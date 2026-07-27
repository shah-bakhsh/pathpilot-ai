/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { UserProfile } from '../types';

export class ProfileService {
  /**
   * Fetch current user profile from Supabase
   */
  static async getProfile(userId: string): Promise<Partial<UserProfile> | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        joinedAt: data.joined_at,
        activeStreak: data.active_streak,
        experiencePoints: data.experience_points,
        currentTargetGoal: data.current_target_goal,
        avatarUrl: data.avatar_url,
        coverUrl: data.cover_url,
        headline: data.headline,
        bio: data.bio,
        phone: data.phone,
        country: data.country,
        city: data.city,
        university: data.university,
        degree: data.degree,
        major: data.major,
        graduationYear: data.graduation_year,
        currentStatus: data.current_status,
        experienceLevel: data.experience_level,
        industry: data.industry,
        skills: data.skills || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        languages: data.languages || [],
        githubUrl: data.github_url,
        linkedinUrl: data.linkedin_url,
        portfolioUrl: data.portfolio_url,
        websiteUrl: data.website_url,
        experiences: data.experiences || [],
        educations: data.educations || [],
        projects: data.projects || [],
        preferredLanguage: data.preferred_language,
        timezone: data.timezone,
        onboardingCompleted: data.onboarding_completed,
        onboardingData: data.onboarding_data,
      };
    } catch (e) {
      console.warn('[ProfileService] Error reading profile from Supabase:', e);
      return null;
    }
  }

  /**
   * Save or update user profile in Supabase
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const dbPayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.firstName !== undefined) dbPayload.first_name = updates.firstName;
      if (updates.lastName !== undefined) dbPayload.last_name = updates.lastName;
      if (updates.username !== undefined) dbPayload.username = updates.username;
      if (updates.avatarUrl !== undefined) dbPayload.avatar_url = updates.avatarUrl;
      if (updates.coverUrl !== undefined) dbPayload.cover_url = updates.coverUrl;
      if (updates.headline !== undefined) dbPayload.headline = updates.headline;
      if (updates.bio !== undefined) dbPayload.bio = updates.bio;
      if (updates.phone !== undefined) dbPayload.phone = updates.phone;
      if (updates.country !== undefined) dbPayload.country = updates.country;
      if (updates.city !== undefined) dbPayload.city = updates.city;
      if (updates.university !== undefined) dbPayload.university = updates.university;
      if (updates.degree !== undefined) dbPayload.degree = updates.degree;
      if (updates.major !== undefined) dbPayload.major = updates.major;
      if (updates.graduationYear !== undefined) dbPayload.graduation_year = updates.graduationYear;
      if (updates.currentTargetGoal !== undefined) dbPayload.current_target_goal = updates.currentTargetGoal;
      if (updates.currentStatus !== undefined) dbPayload.current_status = updates.currentStatus;
      if (updates.experienceLevel !== undefined) dbPayload.experience_level = updates.experienceLevel;
      if (updates.industry !== undefined) dbPayload.industry = updates.industry;
      if (updates.skills !== undefined) dbPayload.skills = updates.skills;
      if (updates.certifications !== undefined) dbPayload.certifications = updates.certifications;
      if (updates.achievements !== undefined) dbPayload.achievements = updates.achievements;
      if (updates.languages !== undefined) dbPayload.languages = updates.languages;
      if (updates.githubUrl !== undefined) dbPayload.github_url = updates.githubUrl;
      if (updates.linkedinUrl !== undefined) dbPayload.linkedin_url = updates.linkedinUrl;
      if (updates.portfolioUrl !== undefined) dbPayload.portfolio_url = updates.portfolioUrl;
      if (updates.websiteUrl !== undefined) dbPayload.website_url = updates.websiteUrl;
      if (updates.experiences !== undefined) dbPayload.experiences = updates.experiences;
      if (updates.educations !== undefined) dbPayload.educations = updates.educations;
      if (updates.projects !== undefined) dbPayload.projects = updates.projects;
      if (updates.preferredLanguage !== undefined) dbPayload.preferred_language = updates.preferredLanguage;
      if (updates.timezone !== undefined) dbPayload.timezone = updates.timezone;
      if (updates.experiencePoints !== undefined) dbPayload.experience_points = updates.experiencePoints;
      if (updates.activeStreak !== undefined) dbPayload.active_streak = updates.activeStreak;
      if (updates.onboardingCompleted !== undefined) dbPayload.onboarding_completed = updates.onboardingCompleted;
      if (updates.onboardingData !== undefined) dbPayload.onboarding_data = updates.onboardingData;

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...dbPayload });

      if (error) {
        console.warn('[ProfileService] Supabase profile upsert error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('[ProfileService] Unexpected profile update error:', e);
      return false;
    }
  }

  /**
   * Add experience points (XP) to user record
   */
  static async addXp(userId: string, points: number, reason: string = 'Completed Task'): Promise<number | null> {
    try {
      const current = await this.getProfile(userId);
      const newXp = (current?.experiencePoints || 0) + points;

      await this.updateProfile(userId, { experiencePoints: newXp });

      // Log XP history entry
      await supabase.from('xp_history').insert({
        user_id: userId,
        amount: points,
        reason,
        earned_at: new Date().toISOString(),
      });

      return newXp;
    } catch {
      return null;
    }
  }
}
