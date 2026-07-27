/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, 
  BookOpen, Sparkles, Check, CheckCircle2, AlertCircle, Eye, RefreshCw, 
  QrCode, Copy, ShieldCheck, Plus, Trash2, Edit2, Camera, ExternalLink, 
  ChevronRight, ChevronLeft, Star, Heart, FileText, Sparkle, Loader2 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  bullet: string;
}

interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

interface ProjectItem {
  title: string;
  tech: string;
  desc: string;
}

export const ProfileTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { user, updateProfile, uploadAvatar, uploadCover, addXp } = useAuth();
  const { personalProjects } = useCareer();

  // Load from user or fallback
  const [profileData, setProfileData] = useState(() => {
    return {
      avatarUrl: user?.avatarUrl || '',
      coverUrl: user?.coverUrl || '',
      headline: user?.headline || 'Software Engineer & Systems Specialist',
      about: user?.bio || 'Passionate software engineer building resilient, high-throughput cloud applications and distributed systems.',
      phone: user?.phone || '',
      location: [user?.city, user?.country].filter(Boolean).join(', ') || 'San Francisco, CA',
      website: user?.websiteUrl || '',
      linkedin: user?.linkedinUrl || '',
      github: user?.githubUrl || '',
      skills: user?.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      achievements: user?.achievements || ['PathPilot System Calibrated'],
      languages: user?.languages || ['English (Native)'],
      certifications: user?.certifications || [],
      experiences: (user?.experiences || [
        { company: 'Acme Systems', role: 'Software Engineer Intern', duration: '2024 - Present', bullet: 'Engineered high-throughput REST APIs and reduced response latency by 22%.' }
      ]) as ExperienceItem[],
      educations: (user?.educations || [
        { school: user?.university || 'Stanford University', degree: user?.degree || 'B.S. Computer Science', year: user?.graduationYear || '2025' }
      ]) as EducationItem[],
      projects: [
        { title: 'PathPilot Career Operating System', tech: 'React, TypeScript, Supabase', desc: 'AI-driven career development platform with automated resume scoring and roadmap generation.' }
      ] as ProjectItem[]
    };
  });

  // Sync with AuthContext user
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        avatarUrl: user.avatarUrl || prev.avatarUrl,
        coverUrl: user.coverUrl || prev.coverUrl,
        headline: user.headline || prev.headline,
        about: user.bio || prev.about,
        phone: user.phone || prev.phone,
        location: [user.city, user.country].filter(Boolean).join(', ') || prev.location,
        website: user.websiteUrl || prev.website,
        linkedin: user.linkedinUrl || prev.linkedin,
        github: user.githubUrl || prev.github,
        skills: user.skills && user.skills.length > 0 ? user.skills : prev.skills,
        experiences: user.experiences && user.experiences.length > 0 ? (user.experiences as ExperienceItem[]) : prev.experiences,
        educations: user.educations && user.educations.length > 0 ? (user.educations as EducationItem[]) : prev.educations,
      }));
    }
  }, [user]);

  // Persist edits back to AuthContext
  const handleSaveProfileData = async (updated: typeof profileData) => {
    setProfileData(updated);
    try {
      await updateProfile({
        headline: updated.headline,
        bio: updated.about,
        phone: updated.phone,
        websiteUrl: updated.website,
        linkedinUrl: updated.linkedin,
        githubUrl: updated.github,
        skills: updated.skills,
        experiences: updated.experiences,
        educations: updated.educations,
        certifications: updated.certifications,
        achievements: updated.achievements,
      });
    } catch (e) {
      console.error('Error saving profile tab:', e);
    }
  };

  const [recruiterMode, setRecruiterMode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showWizard, setShowWizard] = useState(true);

  // Experience and Education form inputs
  const [newExp, setNewExp] = useState<ExperienceItem>({ company: '', role: '', duration: '', bullet: '' });
  const [newEdu, setNewEdu] = useState<EducationItem>({ school: '', degree: '', year: '' });
  const [newProj, setNewProj] = useState<ProjectItem>({ title: '', tech: '', desc: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Auto-calculated profile completion percentage
  const profileCompletion = React.useMemo(() => {
    let score = 20; // Base details
    if (profileData.avatarUrl) score += 10;
    if (profileData.headline) score += 10;
    if (profileData.about) score += 10;
    if (profileData.experiences.length > 0) score += 15;
    if (profileData.educations.length > 0) score += 10;
    if (profileData.skills.length > 0) score += 10;
    if (profileData.projects.length > 0) score += 10;
    if (profileData.achievements.length > 0) score += 5;
    return Math.min(score, 100);
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-profile-v1', JSON.stringify(profileData));
  }, [profileData]);

  const handleSave = async () => {
    await handleSaveProfileData(profileData);
    localStorage.setItem('pathpilot-saas-profile-v1', JSON.stringify(profileData));
    onUpdateNotification('Profile Saved', 'Your professional identity coordinates have been synchronized with Supabase.', 'success');
  };

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    // Simulate premium LLM Bio creation based on headline and skills
    setTimeout(() => {
      const bioSuggestions = [
        `As an experienced systems practitioner skilled in ${profileData.skills.slice(0, 4).join(', ')}, I design high-throughput backend services and highly resilient distributed databases. Dedicated to solving complex consensus bugs, scaling container microservices, and crafting developer tooling.`,
        `Passionate developer focusing on microservices, serverless architecture, and memory-efficient runtime structures. Proficient in ${profileData.skills.slice(0, 3).join(', ')}, with an academic foundation centered around highly distributed systems and query optimization pipelines.`,
      ];
      const selectedBio = bioSuggestions[Math.floor(Math.random() * bioSuggestions.length)];
      setProfileData({ ...profileData, about: selectedBio });
      setIsGeneratingBio(false);
      addXp(15);
      onUpdateNotification('AI Bio Formulated', 'An optimized candidate overview was generated utilizing your skill configurations.', 'success');
    }, 1200);
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(`https://pathpilot.me/profile/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'alex-mercer'}`);
    setCopiedLink(true);
    onUpdateNotification('Link Copied', 'Your public digital profile link has been saved to your clipboard.', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // List Management handlers
  const addExperience = () => {
    if (!newExp.company || !newExp.role) return;
    setProfileData({
      ...profileData,
      experiences: [...profileData.experiences, newExp]
    });
    setNewExp({ company: '', role: '', duration: '', bullet: '' });
    addXp(10);
  };

  const deleteExperience = (idx: number) => {
    setProfileData({
      ...profileData,
      experiences: profileData.experiences.filter((_, i) => i !== idx)
    });
  };

  const addEducation = () => {
    if (!newEdu.school || !newEdu.degree) return;
    setProfileData({
      ...profileData,
      educations: [...profileData.educations, newEdu]
    });
    setNewEdu({ school: '', degree: '', year: '' });
    addXp(10);
  };

  const deleteEducation = (idx: number) => {
    setProfileData({
      ...profileData,
      educations: profileData.educations.filter((_, i) => i !== idx)
    });
  };

  const addProject = () => {
    if (!newProj.title || !newProj.desc) return;
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, newProj]
    });
    setNewProj({ title: '', tech: '', desc: '' });
    addXp(10);
  };

  const deleteProject = (idx: number) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter((_, i) => i !== idx)
    });
  };

  const addSkill = () => {
    if (!newSkill.trim() || profileData.skills.includes(newSkill.trim())) return;
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const deleteSkill = (skillToDelete: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skillToDelete)
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      
      {/* HEADER ACTION BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-sm gap-4">
        <div>
          <h2 className="text-base font-black text-text-main flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profile Center & Professional Identity
          </h2>
          <p className="text-[10.5px] text-text-mute font-semibold mt-0.5">
            Craft your unified profile workspace. This serves as the blueprint for recruiters, mentors, and system matches.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRecruiterMode(!recruiterMode)}
            className={`font-black text-xs gap-1.5 h-9 ${recruiterMode ? 'border-primary text-primary bg-primary/5' : ''}`}
          >
            <Eye className="w-4 h-4" />
            {recruiterMode ? 'Edit Mode' : 'Recruiter Preview'}
          </Button>
          
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave} 
            className="bg-primary text-black font-black text-xs h-9"
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* PROFILE COMPLETION WIZARD COMPONENT */}
      {showWizard && !recruiterMode && (
        <Card className="border-primary/20 bg-primary/2">
          <CardContent className="pt-4 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex gap-4 items-start min-w-0">
              <div className="p-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-primary font-black uppercase tracking-wider">Onboarding Wizard</span>
                  <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[8px] font-black">{profileCompletion}% Done</Badge>
                </div>
                <h3 className="font-display font-black text-xs text-text-main uppercase tracking-tight mt-1">
                  Complete your verified digital business card
                </h3>
                <p className="text-[10.5px] text-text-mute mt-1 max-w-2xl font-semibold leading-relaxed">
                  {wizardStep === 1 && "Step 1: Set up a strong, searchable professional headline. Recruiters index candidate pools based on target roles, skills, and current titles."}
                  {wizardStep === 2 && "Step 2: Formulate an elegant professional 'About' section or let our AI copywriter draft one based on your background details."}
                  {wizardStep === 3 && "Step 3: Log major experiences and certifications to authorize your high-fidelity verified identity score."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {wizardStep > 1 && (
                <button 
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="p-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] text-text-sub"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {wizardStep < 3 ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="h-8 text-[10px] font-bold"
                >
                  Next Step <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => { setShowWizard(false); addXp(20); }}
                  className="bg-primary text-black h-8 text-[10px] font-black"
                >
                  Finish Wizard
                </Button>
              )}
              <button 
                onClick={() => setShowWizard(false)}
                className="text-[10px] text-text-mute font-bold hover:text-text-main ml-2"
              >
                Dismiss
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECRUITER PREVIEW MODE BANNER */}
      {recruiterMode && (
        <div className="p-3 bg-emerald-400/5 border border-emerald-400/20 text-emerald-400 rounded-card flex justify-between items-center text-[11px] font-bold">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Currently simulating the interactive Candidate Portal view as seen by certified talent sourcers.
          </span>
          <button 
            onClick={() => setRecruiterMode(false)}
            className="underline hover:text-white"
          >
            Return to Editor
          </button>
        </div>
      )}

      {/* RECRUITER MODE OR STANDARD EDITOR VIEW */}
      {recruiterMode ? (
        // ================= RECRUITER MODE PREVIEW =================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main profile layout */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]">
              {/* Cover Banner */}
              <div className="h-32 w-full relative">
                <img 
                  src={profileData.coverUrl} 
                  alt="Cover" 
                  className="w-full h-full object-cover filter brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
              </div>

              {/* Identity Row */}
              <div className="px-6 pb-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 mb-4 gap-4">
                  <div className="relative">
                    <img 
                      src={profileData.avatarUrl} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full border-4 border-[var(--surface)] shadow-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <Badge variant="success" className="absolute bottom-0 right-0 h-4 px-1.5 text-[8px] font-black">ACTIVE</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyProfileLink} className="h-8 text-[10px] font-bold">
                      {copiedLink ? 'Copied URL!' : 'Share Profile'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowQrCode(!showQrCode)} className="h-8 text-[10px] font-bold">
                      <QrCode className="w-3.5 h-3.5" /> Show QR
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col">
                  <h3 className="font-display font-black text-lg text-text-main uppercase tracking-tight">{user?.name || 'Alex Mercer'}</h3>
                  <p className="text-xs text-primary font-black mt-1 leading-normal">{profileData.headline}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-text-mute font-bold">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profileData.location}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {profileData.website}</span>
                  </div>
                </div>

                {/* QR Code view */}
                {showQrCode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 border border-[var(--border)] bg-[var(--surface-secondary)]/50 rounded-xl mt-4 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <div className="w-24 h-24 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-black" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-primary font-black uppercase tracking-wider">Candidate Pass</span>
                      <h4 className="text-xs font-black text-text-main mt-0.5">Professional QR Code</h4>
                      <p className="text-[10px] text-text-mute mt-1 leading-normal font-semibold">
                        Sours can scan this code using standard smartphone cameras to open your verified credentials index.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* About Card */}
            <Card>
              <CardHeader className="pb-2 border-b border-[var(--border)]/40">
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-text-main">
                  <Award className="w-4 h-4 text-primary" /> About Candidate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-xs text-text-sub leading-relaxed font-semibold">
                {profileData.about}
              </CardContent>
            </Card>

            {/* Experiences Card */}
            <Card>
              <CardHeader className="pb-2 border-b border(--border)/40">
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-text-main">
                  <Briefcase className="w-4 h-4 text-primary" /> Core Work History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                {profileData.experiences.length === 0 ? (
                  <span className="text-xs text-text-mute font-semibold">No experiences logged yet.</span>
                ) : (
                  profileData.experiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-3 border-l-2 border-primary/20 pl-4 py-1">
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-text-main">{exp.role}</h4>
                          <span className="text-[10px] text-text-mute font-semibold">{exp.duration}</span>
                        </div>
                        <span className="text-[11px] text-primary font-black">{exp.company}</span>
                        <p className="text-[11px] text-text-mute mt-2 leading-relaxed font-semibold">{exp.bullet}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader className="pb-2 border-b border-[var(--border)]/40">
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-text-main">
                  <BookOpen className="w-4 h-4 text-primary" /> Featured System Blueprints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 border border-[var(--border)] bg-[var(--surface-secondary)]/30 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-main flex items-center gap-1.5">{proj.title}</h4>
                      <p className="text-[10px] text-text-mute mt-1 font-semibold leading-normal">{proj.desc}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-[var(--border)]/40 flex justify-between items-center">
                      <span className="text-[9px] text-primary font-bold">{proj.tech}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-text-mute hover:text-text-main" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Digital Business Card widget */}
            <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden relative shadow-md">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardContent className="pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img src={profileData.avatarUrl} className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-text-main uppercase">{user?.name || 'Alex Mercer'}</span>
                    <span className="text-[9px] text-primary font-bold uppercase tracking-wider">Candidate Pass</span>
                  </div>
                </div>
                
                <div className="border-t border-b border-[var(--border)] py-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-mute font-semibold">API Credentials:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-mute font-semibold">Career Score:</span>
                    <span className="text-primary font-mono font-black">94 / 100</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-mute font-semibold">Certifications:</span>
                    <span className="text-text-main font-bold">{profileData.certifications.length} Active</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="text-[9px] text-text-mute font-black uppercase tracking-wider">Primary Stack:</div>
                  <div className="flex flex-wrap gap-1">
                    {profileData.skills.slice(0, 5).map((sk, i) => (
                      <Badge key={i} variant="neutral" className="bg-[var(--surface-secondary)] border border-[var(--border)] text-[8px] font-black text-text-sub">{sk}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-2 text-center text-[9.5px] text-text-mute font-semibold leading-normal bg-[var(--surface-secondary)]/50 p-2 border border-[var(--border)] rounded-lg">
                  💡 Scanner authenticated using the secure HTTPS reverse proxy gateway on port 3000.
                </div>
              </CardContent>
            </Card>

            {/* Certifications and credentials list */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-text-main">Certificates</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-2">
                {profileData.certifications.map((cert, i) => (
                  <div key={i} className="flex gap-2.5 items-start p-2.5 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-[10px] text-text-sub font-black leading-snug">{cert}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact links */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-text-main">Social Networks</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-2">
                <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--hover-tint)] border border-[var(--border)] rounded-xl text-[10.5px] text-text-sub font-bold">
                  <span>LinkedIn Channel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-mute" />
                </a>
                <a href={profileData.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--hover-tint)] border border-[var(--border)] rounded-xl text-[10.5px] text-text-sub font-bold">
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-mute" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // ================= PROFILE FORM EDIT MODE =================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Core details card */}
            <Card>
              <CardHeader>
                <CardTitle>Core Biography details</CardTitle>
                <CardDescription>Setup details, avatar, cover images and headline.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] text-text-sub font-black uppercase">Professional Title / Headline</label>
                    <Input 
                      value={profileData.headline} 
                      onChange={e => setProfileData({ ...profileData, headline: e.target.value })}
                      placeholder="e.g. Senior Backend Engineer" 
                      className="text-xs h-9 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] text-text-sub font-black uppercase">Location / Coordinates</label>
                    <Input 
                      value={profileData.location} 
                      onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="e.g. London, UK" 
                      className="text-xs h-9 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] text-text-sub font-black uppercase">Personal Website URL</label>
                    <Input 
                      value={profileData.website} 
                      onChange={e => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="e.g. https://alex.dev" 
                      className="text-xs h-9 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] text-text-sub font-black uppercase">LinkedIn Handle</label>
                    <Input 
                      value={profileData.linkedin} 
                      onChange={e => setProfileData({ ...profileData, linkedin: e.target.value })}
                      className="text-xs h-9 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10.5px] text-text-sub font-black uppercase">Professional Summary / Bio</label>
                    <button 
                      onClick={generateAIBio}
                      disabled={isGeneratingBio}
                      className="text-[9px] text-primary font-black flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingBio ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Drafting Summary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Bio Generator
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    value={profileData.about} 
                    onChange={e => setProfileData({ ...profileData, about: e.target.value })}
                    rows={4}
                    className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg p-3 text-xs font-semibold leading-relaxed text-text-sub outline-none focus:border-primary/50 resize-y"
                    placeholder="Describe your technical challenges, systems proficiency, and core strengths..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* EXPERIENCE BUILDER */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience Track</CardTitle>
                <CardDescription>Log your historical or current career slots with bullet points.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                
                {/* Logged List */}
                <div className="flex flex-col gap-3">
                  {profileData.experiences.map((exp, i) => (
                    <div key={i} className="flex justify-between items-start p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-text-main">{exp.role} @ <strong className="text-primary font-black">{exp.company}</strong></span>
                        <span className="text-[10px] text-text-mute mt-0.5">{exp.duration}</span>
                        <p className="text-[10.5px] text-text-sub mt-2 leading-relaxed font-semibold">{exp.bullet}</p>
                      </div>
                      <button onClick={() => deleteExperience(i)} className="text-text-mute hover:text-error p-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Form fields to add new experience */}
                <div className="p-4 border border-[var(--border)]/70 bg-[var(--surface-secondary)]/20 rounded-xl flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input 
                      placeholder="Company (e.g. Stripe)" 
                      value={newExp.company}
                      onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                      className="text-xs h-8"
                    />
                    <Input 
                      placeholder="Role (e.g. Backend Lead)" 
                      value={newExp.role}
                      onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                      className="text-xs h-8"
                    />
                    <Input 
                      placeholder="Duration (e.g. 2024 - Present)" 
                      value={newExp.duration}
                      onChange={e => setNewExp({ ...newExp, duration: e.target.value })}
                      className="text-xs h-8"
                    />
                  </div>
                  <Input 
                    placeholder="Key impact bullet point (e.g. Optimized database pool nodes decreasing bottleneck delays by 34%.)" 
                    value={newExp.bullet}
                    onChange={e => setNewExp({ ...newExp, bullet: e.target.value })}
                    className="text-xs h-8"
                  />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addExperience} className="h-8 text-[10.5px] font-bold">
                      Add Work Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PROJECTS BUILDER */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Projects</CardTitle>
                <CardDescription>Link key developer achievements or research products.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profileData.projects.map((proj, i) => (
                    <div key={i} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-xl flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-text-main">{proj.title}</h4>
                        <span className="text-[9px] text-primary font-bold">{proj.tech}</span>
                        <p className="text-[10.5px] text-text-mute mt-1 font-semibold leading-normal">{proj.desc}</p>
                      </div>
                      <button onClick={() => deleteProject(i)} className="text-text-mute hover:text-error">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Project Inputs */}
                <div className="p-4 border border-[var(--border)]/70 bg-[var(--surface-secondary)]/20 rounded-xl flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      placeholder="Project Name (e.g. gRPC Gateway)" 
                      value={newProj.title}
                      onChange={e => setNewProj({ ...newProj, title: e.target.value })}
                      className="text-xs h-8"
                    />
                    <Input 
                      placeholder="Tech Stack (e.g. Go, Protobuf)" 
                      value={newProj.tech}
                      onChange={e => setNewProj({ ...newProj, tech: e.target.value })}
                      className="text-xs h-8"
                    />
                  </div>
                  <Input 
                    placeholder="Short description of technical outcomes..." 
                    value={newProj.desc}
                    onChange={e => setNewProj({ ...newProj, desc: e.target.value })}
                    className="text-xs h-8"
                  />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addProject} className="h-8 text-[10.5px] font-bold">
                      Add Project Blueprint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Editors */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Skills chip manager */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase text-text-main">Tech Stack Core Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {profileData.skills.map((sk, idx) => (
                    <Badge 
                      key={idx} 
                      variant="neutral" 
                      className="bg-primary/5 hover:bg-error/10 hover:text-error border border-primary/20 text-[9px] font-black cursor-pointer py-1 px-2.5 transition-all flex items-center gap-1 group"
                      onClick={() => deleteSkill(sk)}
                    >
                      {sk} <span className="text-[8px] text-text-mute group-hover:text-error">✕</span>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Add skill (e.g. Rust)" 
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addSkill(); }}
                    className="text-xs h-8"
                  />
                  <Button variant="outline" size="sm" onClick={addSkill} className="h-8 font-black shrink-0 px-3 text-[10px]">Add</Button>
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Education editor */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase text-text-main">Certificates & Licenses</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  {profileData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[10px] text-text-sub font-semibold">
                      <span>{cert}</span>
                      <button onClick={() => setProfileData({ ...profileData, certifications: profileData.certifications.filter((_, i) => i !== idx) })} className="text-text-mute hover:text-error">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Certified Kubernetes Administrator" 
                    value={newCert}
                    onChange={e => setNewCert(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newCert.trim()) {
                        setProfileData({ ...profileData, certifications: [...profileData.certifications, newCert.trim()] });
                        setNewCert('');
                      }
                    }}
                    className="text-xs h-8"
                  />
                  <Button variant="outline" size="sm" onClick={() => {
                    if (newCert.trim()) {
                      setProfileData({ ...profileData, certifications: [...profileData.certifications, newCert.trim()] });
                      setNewCert('');
                    }
                  }} className="h-8 font-black text-[10px] px-3 shrink-0">Add</Button>
                </div>
              </CardContent>
            </Card>

            {/* Education log */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase text-text-main">Education credentials</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  {profileData.educations.map((edu, idx) => (
                    <div key={idx} className="p-2.5 bg-[var(--surface-secondary)]/60 border border-[var(--border)] rounded-xl flex justify-between items-start text-[10px]">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-main">{edu.degree}</span>
                        <span className="text-text-mute mt-0.5">{edu.school} ({edu.year})</span>
                      </div>
                      <button onClick={() => deleteEducation(idx)} className="text-text-mute hover:text-error">✕</button>
                    </div>
                  ))}
                </div>

                <div className="p-3 border border-[var(--border)] bg-[var(--surface-secondary)]/20 rounded-xl flex flex-col gap-2">
                  <Input 
                    placeholder="Stanford University" 
                    value={newEdu.school}
                    onChange={e => setNewEdu({ ...newEdu, school: e.target.value })}
                    className="text-[10px] h-7"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="B.S. CS" 
                      value={newEdu.degree}
                      onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="text-[10px] h-7"
                    />
                    <Input 
                      placeholder="Year" 
                      value={newEdu.year}
                      onChange={e => setNewEdu({ ...newEdu, year: e.target.value })}
                      className="text-[10px] h-7"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={addEducation} className="h-7 text-[9px] font-black uppercase">Add Education</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
