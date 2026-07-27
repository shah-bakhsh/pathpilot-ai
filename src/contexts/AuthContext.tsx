/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  loginAsGuest: (name: string, targetCareer: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboardingData: (data: Partial<NonNullable<UserProfile['onboardingData']>>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  addExperiencePoints: (xp: number) => void;
  addXp: (xp: number) => void;
  incrementStreak: () => void;
  updateTargetCareer: (career: string) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  uploadCover: (file: File) => Promise<string>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Helper to compute profile completion percentage
export const calculateProfileCompletion = (profile: UserProfile): number => {
  let score = 20; // Base creation
  if (profile.avatarUrl) score += 10;
  if (profile.name) score += 5;
  if (profile.headline || profile.bio) score += 10;
  if (profile.currentTargetGoal) score += 10;
  if (profile.university || profile.degree) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 10;
  if (profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) score += 10;
  if (profile.experiences && profile.experiences.length > 0) score += 10;
  if (profile.phone || profile.country || profile.city) score += 5;
  return Math.min(100, score);
};

// Helper for image encoding fallback
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state helper to write back to either Supabase PostgreSQL or LocalStorage
  const syncUserSession = async (updated: UserProfile) => {
    // Re-calculate completion percentage
    const completion = calculateProfileCompletion(updated);
    const withCompletion = { ...updated, profileCompletionPercent: completion };

    setUser(withCompletion);
    localStorage.setItem(`pathpilot-user-session-${withCompletion.uid}`, JSON.stringify(withCompletion));
    localStorage.setItem('pathpilot-user-session', JSON.stringify(withCompletion));

    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user.id === withCompletion.uid) {
          await supabase.from('profiles').upsert({
            id: withCompletion.uid,
            email: withCompletion.email,
            name: withCompletion.name,
            first_name: withCompletion.firstName,
            last_name: withCompletion.lastName,
            username: withCompletion.username,
            joined_at: withCompletion.joinedAt,
            active_streak: withCompletion.activeStreak,
            experience_points: withCompletion.experiencePoints,
            current_target_goal: withCompletion.currentTargetGoal,
            avatar_url: withCompletion.avatarUrl,
            cover_url: withCompletion.coverUrl,
            headline: withCompletion.headline,
            bio: withCompletion.bio,
            phone: withCompletion.phone,
            country: withCompletion.country,
            city: withCompletion.city,
            university: withCompletion.university,
            degree: withCompletion.degree,
            major: withCompletion.major,
            graduation_year: withCompletion.graduationYear,
            current_status: withCompletion.currentStatus,
            experience_level: withCompletion.experienceLevel,
            industry: withCompletion.industry,
            skills: withCompletion.skills || [],
            certifications: withCompletion.certifications || [],
            achievements: withCompletion.achievements || [],
            languages: withCompletion.languages || [],
            github_url: withCompletion.githubUrl,
            linkedin_url: withCompletion.linkedinUrl,
            portfolio_url: withCompletion.portfolioUrl,
            website_url: withCompletion.websiteUrl,
            experiences: withCompletion.experiences || [],
            educations: withCompletion.educations || [],
            projects: withCompletion.projects || [],
            preferred_language: withCompletion.preferredLanguage,
            timezone: withCompletion.timezone,
            onboarding_completed: withCompletion.onboardingCompleted,
            onboarding_data: withCompletion.onboardingData || {},
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Supabase profile sync error:', err);
      }
    }

    // Trigger window event for realtime subscribers
    window.dispatchEvent(new CustomEvent('pathpilot-user-updated', { detail: withCompletion }));
  };

  // Initialize session and auth state listener
  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          fetchOrCreateProfile(session.user.id, session.user.email, session.user.user_metadata?.full_name || session.user.user_metadata?.name);
        } else {
          loadLocalOrNullSession();
        }
      }).catch(() => {
        loadLocalOrNullSession();
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          await fetchOrCreateProfile(session.user.id, session.user.email, session.user.user_metadata?.full_name || session.user.user_metadata?.name);
        } else {
          loadLocalOrNullSession();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      loadLocalOrNullSession();
    }
  }, []);

  const loadLocalOrNullSession = () => {
    const savedUser = localStorage.getItem('pathpilot-user-session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const fetchOrCreateProfile = async (uid: string, email?: string, name?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (data && !error) {
        const profile: UserProfile = {
          uid: data.id,
          email: data.email || email || 'explorer@pathpilot.ai',
          name: data.name || name || 'Pathfinder Explorer',
          firstName: data.first_name || (data.name ? data.name.split(' ')[0] : ''),
          lastName: data.last_name || (data.name ? data.name.split(' ').slice(1).join(' ') : ''),
          username: data.username || (data.email ? data.email.split('@')[0] : 'explorer'),
          joinedAt: data.joined_at || new Date().toISOString(),
          activeStreak: data.active_streak ?? 1,
          experiencePoints: data.experience_points ?? 0,
          currentTargetGoal: data.current_target_goal || 'Software Engineer - Backend',
          avatarUrl: data.avatar_url || '',
          coverUrl: data.cover_url || '',
          headline: data.headline || '',
          bio: data.bio || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          university: data.university || '',
          degree: data.degree || '',
          major: data.major || '',
          graduationYear: data.graduation_year || '',
          currentStatus: data.current_status || 'Job Seeker',
          experienceLevel: data.experience_level || 'Mid-Level',
          industry: data.industry || 'Technology',
          skills: data.skills || [],
          certifications: data.certifications || [],
          achievements: data.achievements || [],
          languages: data.languages || ['English'],
          githubUrl: data.github_url || '',
          linkedinUrl: data.linkedin_url || '',
          portfolioUrl: data.portfolio_url || '',
          websiteUrl: data.website_url || '',
          experiences: data.experiences || [],
          educations: data.educations || [],
          projects: data.projects || [],
          preferredLanguage: data.preferred_language || 'English',
          timezone: data.timezone || 'UTC-8 (Pacific)',
          onboardingCompleted: data.onboarding_completed ?? false,
          onboardingData: data.onboarding_data || undefined,
        };
        profile.profileCompletionPercent = calculateProfileCompletion(profile);
        setUser(profile);
        localStorage.setItem(`pathpilot-user-session-${uid}`, JSON.stringify(profile));
        localStorage.setItem('pathpilot-user-session', JSON.stringify(profile));
      } else {
        const newProfile: UserProfile = {
          uid,
          email: email || 'explorer@pathpilot.ai',
          name: name || 'Pathfinder Explorer',
          firstName: name ? name.split(' ')[0] : 'Pathfinder',
          lastName: name ? name.split(' ').slice(1).join(' ') : 'Explorer',
          username: email ? email.split('@')[0] : 'explorer',
          joinedAt: new Date().toISOString(),
          activeStreak: 1,
          experiencePoints: 0,
          currentTargetGoal: 'Software Engineer - Backend',
          onboardingCompleted: false,
        };
        newProfile.profileCompletionPercent = calculateProfileCompletion(newProfile);
        
        if (isSupabaseConfigured()) {
          await supabase.from('profiles').upsert({
            id: uid,
            email: newProfile.email,
            name: newProfile.name,
            joined_at: newProfile.joinedAt,
            active_streak: newProfile.activeStreak,
            experience_points: newProfile.experiencePoints,
            current_target_goal: newProfile.currentTargetGoal,
            onboarding_completed: newProfile.onboardingCompleted,
            updated_at: new Date().toISOString(),
          });
        }
        
        setUser(newProfile);
        localStorage.setItem(`pathpilot-user-session-${uid}`, JSON.stringify(newProfile));
        localStorage.setItem('pathpilot-user-session', JSON.stringify(newProfile));
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async (name: string, targetCareer: string) => {
    setLoading(true);
    const cleanName = name.trim() || 'Explorer';
    const guestUser: UserProfile = {
      uid: 'guest_user_' + Math.random().toString(36).substring(2, 9),
      email: `${cleanName.toLowerCase().replace(/\s+/g, '')}@guest.pathpilot.ai`,
      name: cleanName,
      joinedAt: new Date().toISOString(),
      activeStreak: 1,
      experiencePoints: 0,
      currentTargetGoal: targetCareer || 'Software Engineer - Backend',
      onboardingCompleted: false,
    };
    await syncUserSession(guestUser);
    setLoading(false);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Please provide both email address and password.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please verify your credentials and try again.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before logging in.');
          }
          throw error;
        }
        if (data.user) {
          await fetchOrCreateProfile(data.user.id, data.user.email, data.user.user_metadata?.name || data.user.user_metadata?.full_name);
        }
      } catch (err: any) {
        setLoading(false);
        throw err;
      }
    } else {
      const mockUser: UserProfile = {
        uid: 'email_user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, ''),
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        joinedAt: new Date().toISOString(),
        activeStreak: 1,
        experiencePoints: 150,
        currentTargetGoal: 'Software Engineer - Backend',
        onboardingCompleted: true,
      };
      await syncUserSession(mockUser);
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanEmail || !pass || !cleanName) {
      throw new Error('All registration fields (Full Name, Email, Password) are required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.');
    }
    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: {
            data: {
              name: cleanName,
              full_name: cleanName,
            },
          },
        });
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already exists')) {
            throw new Error('An account with this email address already exists. Please log in instead.');
          }
          throw error;
        }
        if (data.user) {
          await fetchOrCreateProfile(data.user.id, cleanEmail, cleanName);
        }
      } catch (err: any) {
        setLoading(false);
        throw err;
      }
    } else {
      const simulatedUser: UserProfile = {
        uid: 'email_user_' + Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
        name: cleanName,
        joinedAt: new Date().toISOString(),
        activeStreak: 1,
        experiencePoints: 0,
        currentTargetGoal: 'Software Engineer - Backend',
        onboardingCompleted: false,
      };
      await syncUserSession(simulatedUser);
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter your email address to receive password reset instructions.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } else {
      console.log('Simulated password reset email sent to:', cleanEmail);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const resendVerificationEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error('Please enter a valid email address.');

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
      });
      if (error) throw error;
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem('pathpilot-user-session');
    setLoading(false);
  };

  const updateOnboardingData = async (data: Partial<NonNullable<UserProfile['onboardingData']>>) => {
    if (!user) return;
    const currentOnboarding = user.onboardingData || {};
    const updated: UserProfile = {
      ...user,
      onboardingData: {
        ...currentOnboarding,
        ...data,
        experienceSummary: {
          ...(currentOnboarding.experienceSummary || {}),
          ...(data.experienceSummary || {}),
        },
        resumeMetadata: {
          ...(currentOnboarding.resumeMetadata || {}),
          ...(data.resumeMetadata || {}),
        }
      }
    };
    await syncUserSession(updated);
  };

  const completeOnboarding = async () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      onboardingCompleted: true,
      currentTargetGoal: user.onboardingData?.careerGoals?.[0] || user.currentTargetGoal,
    };
    await syncUserSession(updated);
  };

  const addExperiencePoints = (xp: number) => {
    if (!user) return;
    const updated = {
      ...user,
      experiencePoints: user.experiencePoints + xp,
    };
    syncUserSession(updated);
  };

  const incrementStreak = () => {
    if (!user) return;
    const updated = {
      ...user,
      activeStreak: user.activeStreak + 1,
    };
    syncUserSession(updated);
  };

  const updateTargetCareer = (career: string) => {
    if (!user) return;
    const updated = {
      ...user,
      currentTargetGoal: career,
    };
    syncUserSession(updated);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...data,
      // Auto compute full name if firstName/lastName provided
      name: (data.firstName || data.lastName) 
        ? `${data.firstName || user.firstName || ''} ${data.lastName || user.lastName || ''}`.trim() 
        : (data.name || user.name),
    };
    await syncUserSession(updated);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not logged in');

    let imageUrl = '';
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.uid}/avatar-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          imageUrl = publicUrlData.publicUrl;
        } else {
          imageUrl = await fileToBase64(file);
        }
      } catch {
        imageUrl = await fileToBase64(file);
      }
    } else {
      imageUrl = await fileToBase64(file);
    }

    await updateProfile({ avatarUrl: imageUrl });
    return imageUrl;
  };

  const uploadCover = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not logged in');

    let imageUrl = '';
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.uid}/cover-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('covers').upload(filePath, file, { upsert: true });
        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage.from('covers').getPublicUrl(filePath);
          imageUrl = publicUrlData.publicUrl;
        } else {
          imageUrl = await fileToBase64(file);
        }
      } catch {
        imageUrl = await fileToBase64(file);
      }
    } else {
      imageUrl = await fileToBase64(file);
    }

    await updateProfile({ coverUrl: imageUrl });
    return imageUrl;
  };

  const refreshProfile = async () => {
    if (user && isSupabaseConfigured()) {
      await fetchOrCreateProfile(user.uid, user.email, user.name);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsGuest,
        loginWithEmail,
        signUpWithEmail,
        resetPassword,
        resendVerificationEmail,
        logout,
        updateOnboardingData,
        completeOnboarding,
        addExperiencePoints,
        addXp: addExperiencePoints,
        incrementStreak,
        updateTargetCareer,
        updateProfile,
        uploadAvatar,
        uploadCover,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
