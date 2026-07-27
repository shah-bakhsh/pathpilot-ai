/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, 
  Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw, Copy, ShieldCheck, 
  Plus, Trash2, Edit2, Camera, ExternalLink, ChevronRight, Star, Heart, 
  FileText, Zap, Flame, Building, Linkedin, Github, Save, Upload, Info, Target
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { ProfileExperience, ProfileEducation } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, uploadAvatar, uploadCover, addXp } = useAuth();
  const { addNotification } = useCareer();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Local state initialized from synced user
  const [firstName, setFirstName] = useState(user?.firstName || user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '');
  const [username, setUsername] = useState(user?.username || user?.email?.split('@')[0] || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || user?.onboardingData?.country || '');
  const [city, setCity] = useState(user?.city || user?.onboardingData?.city || '');
  
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentTargetGoal, setCurrentTargetGoal] = useState(user?.currentTargetGoal || 'Software Engineer - Backend');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Mid-Level');
  const [industry, setIndustry] = useState(user?.industry || 'Technology');
  
  const [university, setUniversity] = useState(user?.university || user?.onboardingData?.university || '');
  const [degree, setDegree] = useState(user?.degree || user?.onboardingData?.degree || '');
  const [major, setMajor] = useState(user?.major || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || user?.onboardingData?.graduationYear || '');
  const [currentStatus, setCurrentStatus] = useState(user?.currentStatus || 'Job Seeker');

  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');

  const [skills, setSkills] = useState<string[]>(user?.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'TailwindCSS']);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState<ProfileExperience[]>(user?.experiences || [
    { company: 'Acme Systems', role: 'Software Engineer Intern', duration: '2024 - Present', bullet: 'Engineered high-throughput REST APIs and reduced response latency by 22%.' }
  ]);
  const [newExp, setNewExp] = useState<ProfileExperience>({ company: '', role: '', duration: '', bullet: '' });

  const [educations, setEducations] = useState<ProfileEducation[]>(user?.educations || [
    { school: university || 'Stanford University', degree: degree || 'B.S. Computer Science', major: major || 'Software Systems', year: graduationYear || '2025' }
  ]);
  const [newEdu, setNewEdu] = useState<ProfileEducation>({ school: '', degree: '', major: '', year: '' });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'experience' | 'links'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setUsername(user.username || user.email?.split('@')[0] || '');
      setPhone(user.phone || '');
      setCountry(user.country || user.onboardingData?.country || '');
      setCity(user.city || user.onboardingData?.city || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setCurrentTargetGoal(user.currentTargetGoal || 'Software Engineer - Backend');
      setExperienceLevel(user.experienceLevel || 'Mid-Level');
      setIndustry(user.industry || 'Technology');
      setUniversity(user.university || user.onboardingData?.university || '');
      setDegree(user.degree || user.onboardingData?.degree || '');
      setMajor(user.major || '');
      setGraduationYear(user.graduationYear || user.onboardingData?.graduationYear || '');
      setCurrentStatus(user.currentStatus || 'Job Seeker');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setPortfolioUrl(user.portfolioUrl || '');
      setWebsiteUrl(user.websiteUrl || '');
      if (user.skills && user.skills.length > 0) setSkills(user.skills);
      if (user.experiences && user.experiences.length > 0) setExperiences(user.experiences);
      if (user.educations && user.educations.length > 0) setEducations(user.educations);
    }
  }, [user]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      addNotification('Avatar Photo Updated', 'Your profile photo has been synchronized across PathPilot AI.', 'success');
      addXp(25);
    } catch (err) {
      console.error(err);
      addNotification('Upload Error', 'Could not update profile avatar.', 'warning');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      await uploadCover(file);
      addNotification('Cover Banner Updated', 'Profile header graphics updated.', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    if (!newExp.company || !newExp.role) return;
    setExperiences([...experiences, newExp]);
    setNewExp({ company: '', role: '', duration: '', bullet: '' });
  };

  const handleRemoveExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  const handleAddEducation = () => {
    if (!newEdu.school || !newEdu.degree) return;
    setEducations([...educations, newEdu]);
    setNewEdu({ school: '', degree: '', major: '', year: '' });
  };

  const handleRemoveEducation = (idx: number) => {
    setEducations(educations.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        username,
        phone,
        country,
        city,
        headline,
        bio,
        currentTargetGoal,
        experienceLevel,
        industry,
        university,
        degree,
        major,
        graduationYear,
        currentStatus,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        websiteUrl,
        skills,
        experiences,
        educations,
      });

      addXp(20);
      addNotification('Profile Coordinates Saved', 'User profile and career vectors synchronized with Supabase.', 'success');
    } catch (err) {
      console.error(err);
      addNotification('Save Failed', 'Could not sync profile coordinates.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyProfileLink = () => {
    const link = `${window.location.origin}/u/${username || user?.uid}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    addNotification('Link Copied', 'Public profile link copied to clipboard.', 'info');
  };

  const completionPercent = user?.profileCompletionPercent || 70;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Hidden inputs for uploads */}
      <input 
        ref={avatarInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarFileChange} 
      />
      <input 
        ref={coverInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleCoverFileChange} 
      />

      {/* Main Header / Cover Card */}
      <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-md relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-56 w-full relative group bg-linear-to-r from-primary/30 via-accent/20 to-primary/10 overflow-hidden">
          {user?.coverUrl ? (
            <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-primary/20 via-primary/5 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary/20" />
            </div>
          )}
          
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-3 py-1.5 rounded-btn text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border border-white/10 opacity-90 group-hover:opacity-100"
          >
            {isUploadingCover ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            {user?.coverUrl ? 'Change Cover' : 'Upload Cover'}
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 z-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5 min-w-0">
            {/* Avatar Container */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-[var(--surface)] p-1.5 shadow-2xl border-2 border-[var(--border)]">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-primary/15 text-primary font-black text-3xl flex items-center justify-center border border-primary/25">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'P'}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[var(--surface)]"
                title="Update Avatar"
              >
                {isUploadingAvatar ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
            </div>

            {/* User Title & Target Info */}
            <div className="flex flex-col min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-text-main tracking-tight truncate">
                  {user?.name || 'Pathfinder Explorer'}
                </h1>
                <Badge variant="success" className="text-[10px] font-black uppercase tracking-wider py-0.5 px-2">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified User
                </Badge>
              </div>

              <p className="text-xs md:text-sm font-bold text-text-sub mt-0.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary shrink-0" />
                <span className="text-primary font-extrabold">{currentTargetGoal}</span>
                {headline && <span className="text-text-mute font-normal hidden sm:inline">• {headline}</span>}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-text-mute mt-2">
                {(city || country) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {[city, country].filter(Boolean).join(', ')}
                  </span>
                )}
                {university && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-accent" /> {university}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-warning" /> {user?.activeStreak || 1} Day Streak
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-success" /> Lvl {Math.floor((user?.experiencePoints || 0) / 100) + 1} Pathfinder
                </span>
              </div>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProfileLink}
              className="font-bold text-xs gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied' : 'Share Profile'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="font-black text-xs gap-1.5 shadow-sm"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Coordinates
            </Button>
          </div>
        </div>
      </Card>

      {/* Completion Meter Card */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-[var(--surface)] to-accent/5 p-4 rounded-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-black text-sm shrink-0">
              {completionPercent}%
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-text-main uppercase tracking-wider">Profile Strength Radar</span>
                {completionPercent === 100 ? (
                  <Badge variant="success" className="text-[9px] font-black">All Vectors Complete</Badge>
                ) : (
                  <Badge variant="warning" className="text-[9px] font-black">{100 - completionPercent}% Missing</Badge>
                )}
              </div>
              <p className="text-[11px] text-text-sub font-medium truncate mt-0.5">
                Complete all profile parameters to unlock high-precision AI resume matching and automated recruiter matches.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-64 flex flex-col gap-1.5 shrink-0">
            <div className="flex justify-between text-[10px] font-extrabold text-text-mute">
              <span>Calibration Meter</span>
              <span className="text-primary font-black">{completionPercent} / 100</span>
            </div>
            <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-linear-to-r from-primary to-accent rounded-full transition-all duration-500" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-black rounded-btn transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Identity & Coordinates
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2 text-xs font-black rounded-btn transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'credentials'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Academic & Education
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 text-xs font-black rounded-btn transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'experience'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Career & Skills
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 text-xs font-black rounded-btn transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'links'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Web & Portfolio Links
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Coordinates Form */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Personal Identity Details
                </CardTitle>
                <CardDescription className="text-xs">
                  Your core contact details synchronized with your authenticated Supabase user profile.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Handle / Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mute font-bold text-xs">@</span>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        className="pl-7"
                        placeholder="janedoe"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Email Address (Read-only)
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-[var(--hover-tint)]/40 text-text-mute cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      City
                    </label>
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Country
                    </label>
                    <Input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                    />
                  </div>
                </div>

                {/* Professional Headline */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border)]">
                  <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                    Professional Headline
                  </label>
                  <Input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Full-Stack Engineer specializing in Distributed Systems & AI Apps"
                  />
                  <p className="text-[10.5px] text-text-mute font-medium">
                    Appears under your name in search lists, resumes, and recruiter portals.
                  </p>
                </div>

                {/* Biography */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                      Executive Biography
                    </label>
                    <span className="text-[10px] text-text-mute font-semibold">{bio.length} / 500 chars</span>
                  </div>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    placeholder="Passionate systems architect and computer science graduate with expertise in React, TypeScript, and cloud execution environments..."
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-card p-3 text-xs text-text-main focus:outline-none focus:border-primary transition-all leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Goal & Summary Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Career Goal Calibration */}
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Target Trajectory
                </CardTitle>
                <CardDescription className="text-xs">
                  Primary career vector driving your AI coach recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-text-sub uppercase tracking-wider">
                    Target Role / Goal
                  </label>
                  <Input
                    type="text"
                    value={currentTargetGoal}
                    onChange={(e) => setCurrentTargetGoal(e.target.value)}
                    placeholder="Software Engineer - Backend"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-text-sub uppercase tracking-wider">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main outline-none focus:border-primary"
                  >
                    <option value="Entry-Level">Entry-Level (0-2 YOE)</option>
                    <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
                    <option value="Senior">Senior (5-8 YOE)</option>
                    <option value="Lead / Staff">Lead / Staff Architect</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-text-sub uppercase tracking-wider">
                    Target Industry
                  </label>
                  <Input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Technology & SaaS"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Metrics Badge */}
            <Card className="border-[var(--border)] bg-[var(--surface-secondary)]/30 p-4 rounded-card">
              <h3 className="text-xs font-black text-text-main uppercase tracking-wider mb-3">
                Account Status
              </h3>
              <div className="flex flex-col gap-2.5 text-xs font-bold">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]/60">
                  <span className="text-text-sub font-semibold">Joined System</span>
                  <span className="text-text-main font-bold">
                    {new Date(user?.joinedAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]/60">
                  <span className="text-text-sub font-semibold">Current Streak</span>
                  <span className="text-warning font-black">{user?.activeStreak || 1} Days Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-sub font-semibold">Total Experience</span>
                  <span className="text-primary font-black">{user?.experiencePoints || 0} XP</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}

      {activeTab === 'credentials' && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
              <GraduationCap className="w-4.5 h-4.5 text-accent" /> Academic Credentials & University Details
            </CardTitle>
            <CardDescription className="text-xs">
              Configure your alma mater, degree, major, and status.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  University / College Name
                </label>
                <Input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Stanford University"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  Degree Program
                </label>
                <Input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="B.S. Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  Major / Field of Study
                </label>
                <Input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Software Systems"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  Graduation Year
                </label>
                <Input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="2025"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  Current Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main outline-none focus:border-primary"
                >
                  <option value="Student">Active Student</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employed">Currently Employed</option>
                  <option value="Career Changer">Career Changer</option>
                </select>
              </div>
            </div>

            {/* Structured Education History */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[var(--border)]">
              <h3 className="text-xs font-black text-text-main uppercase tracking-wider flex items-center justify-between">
                <span>Education History ({educations.length})</span>
              </h3>

              <div className="flex flex-col gap-3">
                {educations.map((edu, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-card border border-[var(--border)] bg-[var(--hover-tint)]/20">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-text-main">{edu.school}</span>
                      <span className="text-[11px] text-text-sub font-semibold">{edu.degree} {edu.major ? `• ${edu.major}` : ''}</span>
                      <span className="text-[10px] text-text-mute font-medium">{edu.year}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveEducation(i)}
                      className="text-error hover:bg-error/10 p-1.5 rounded-btn transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Education Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[var(--surface-secondary)]/30 p-3 rounded-card border border-[var(--border)]">
                <Input
                  type="text"
                  placeholder="School Name"
                  value={newEdu.school}
                  onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                  className="text-xs"
                />
                <Input
                  type="text"
                  placeholder="Degree"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="text-xs"
                />
                <Input
                  type="text"
                  placeholder="Major (Optional)"
                  value={newEdu.major}
                  onChange={(e) => setNewEdu({ ...newEdu, major: e.target.value })}
                  className="text-xs"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Year"
                    value={newEdu.year}
                    onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                    className="text-xs"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddEducation} className="shrink-0 font-bold text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'experience' && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-primary" /> Career Work Experience & Core Skills Tag Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Manage core engineering skills, technical stack tags, and work history.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            
            {/* Skills Tag Matrix */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                Technical Stack & Core Skills ({skills.length})
              </label>

              <div className="flex flex-wrap items-center gap-2 p-3 rounded-card border border-[var(--border)] bg-[var(--hover-tint)]/10 min-h-16">
                {skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="primary" 
                    className="text-xs font-bold py-1 px-2.5 flex items-center gap-1.5 shrink-0"
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-error transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add skill (e.g. Docker, Python, Docker)"
                  className="text-xs"
                />
                <Button variant="outline" size="sm" onClick={handleAddSkill} className="font-bold text-xs shrink-0">
                  <Plus className="w-3.5 h-3.5" /> Add Tag
                </Button>
              </div>
            </div>

            {/* Work History Timeline */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[var(--border)]">
              <h3 className="text-xs font-black text-text-main uppercase tracking-wider">
                Work History & Experiences ({experiences.length})
              </h3>

              <div className="flex flex-col gap-3">
                {experiences.map((exp, i) => (
                  <div key={i} className="flex items-start justify-between p-3.5 rounded-card border border-[var(--border)] bg-[var(--hover-tint)]/20">
                    <div className="flex flex-col min-w-0 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-text-main">{exp.role}</span>
                        <span className="text-xs font-bold text-primary">@ {exp.company}</span>
                        <Badge variant="neutral" className="text-[10px] font-semibold">{exp.duration}</Badge>
                      </div>
                      {exp.bullet && <p className="text-[11px] text-text-sub leading-normal font-medium mt-0.5">{exp.bullet}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(i)}
                      className="text-error hover:bg-error/10 p-1.5 rounded-btn transition-all shrink-0 ml-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Work Experience */}
              <div className="flex flex-col gap-3 bg-[var(--surface-secondary)]/30 p-4 rounded-card border border-[var(--border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="text-xs"
                  />
                  <Input
                    type="text"
                    placeholder="Role Title"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    className="text-xs"
                  />
                  <Input
                    type="text"
                    placeholder="Duration (e.g. 2023 - Present)"
                    value={newExp.duration}
                    onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Key Achievement or Highlight Bullet"
                  value={newExp.bullet}
                  onChange={(e) => setNewExp({ ...newExp, bullet: e.target.value })}
                  className="text-xs"
                />
                <Button variant="primary" size="sm" onClick={handleAddExperience} className="self-start font-bold text-xs gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Experience Position
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {activeTab === 'links' && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
              <Globe className="w-4.5 h-4.5 text-info" /> Web Presence & Social Profiles
            </CardTitle>
            <CardDescription className="text-xs">
              Link your GitHub, LinkedIn, portfolio, and website to verify candidate authenticity.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-text-main" /> GitHub Profile URL
                </label>
                <Input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-info" /> LinkedIn Profile URL
                </label>
                <Input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Personal Portfolio URL
                </label>
                <Input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-accent" /> Website / Blog URL
                </label>
                <Input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourblog.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default ProfileView;
