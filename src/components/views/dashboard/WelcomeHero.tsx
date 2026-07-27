/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';
import { Sparkles, Flame, Award, Calendar, Target, User, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Progress } from '../../ui/Progress';
import { Button } from '../../ui/Button';

export const WelcomeHero: React.FC = () => {
  const { user } = useAuth();
  const { resumeAnalysis, jobApplications, learningCourses, careerDocuments } = useCareer();

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Format today's date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Level & XP calculations
  const levelInfo = useMemo(() => {
    const xp = user?.experiencePoints || 320;
    const level = Math.floor(xp / 100) + 1;
    const currentXpInLevel = xp % 100;
    return { level, xp, currentXpInLevel, nextLevelXp: 100 };
  }, [user?.experiencePoints]);

  // Profile completion calculation based on user profile and career context
  const profileCompletion = useMemo(() => {
    if (user?.profileCompletionPercent) return user.profileCompletionPercent;
    let score = 40; // Base profile
    if (user?.name) score += 10;
    if (user?.currentTargetGoal) score += 10;
    if (resumeAnalysis) score += 20;
    if (jobApplications.length > 0) score += 10;
    if (learningCourses.length > 0) score += 5;
    if (careerDocuments.length > 0) score += 5;
    return Math.min(100, score);
  }, [user, resumeAnalysis, jobApplications, learningCourses, careerDocuments]);

  // Dynamic motivational AI message
  const aiMotivationalQuote = useMemo(() => {
    const readiness = resumeAnalysis?.readinessScore || 68;
    const goal = user?.currentTargetGoal || 'Senior Full-Stack Engineer';
    if (readiness >= 80) {
      return `Your career vector is in top ${readiness}% alignment for ${goal}. Maintain your trajectory by mastering advanced system design and container orchestration.`;
    } else if (readiness >= 65) {
      return `Solid trajectory toward ${goal}! Candidates with PostgreSQL indexing and TypeScript generics experience see 28% higher recruiter interview match rates.`;
    } else {
      return `Welcome cadet! Calibrate your resume and complete foundational milestones to accelerate your pipeline toward ${goal}.`;
    }
  }, [resumeAnalysis, user?.currentTargetGoal]);

  const handleSwitchTab = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-[var(--surface-secondary)]/30 to-accent/5 border border-primary/15 p-6 shadow-xs select-none">
      {/* Background Mesh Lighting */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-16 w-60 h-60 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        
        {/* Left Column: Greeting & Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-text-mute">
            <span className="flex items-center gap-1.5 text-primary font-black uppercase tracking-wider text-[10px]">
              <Calendar className="w-3.5 h-3.5 text-primary" /> {todayFormatted}
            </span>
            <span>•</span>
            <span className="text-text-sub font-semibold">AI Career Operating System v2.4</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-black text-xl shrink-0 shadow-2xs overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-display font-black text-2xl md:text-3xl text-text-main tracking-tight leading-tight truncate">
                {greeting}, {user?.name || 'Pathfinder'}! <Sparkles className="w-5 h-5 text-accent inline-block animate-pulse" />
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-text-sub font-semibold">Target Vector:</span>
                <Badge variant="primary" className="text-xs font-black py-0.5 px-2.5">
                  <Target className="w-3 h-3 text-primary mr-1" /> {user?.currentTargetGoal || 'Full-Stack Developer'}
                </Badge>
                <button
                  onClick={() => handleSwitchTab('profile')}
                  className="text-[11px] text-primary hover:underline font-bold transition-all cursor-pointer"
                >
                  Edit Goal
                </button>
              </div>
            </div>
          </div>

          {/* AI Motivational Callout */}
          <div className="p-3.5 rounded-xl bg-[var(--surface)]/80 backdrop-blur-xs border border-[var(--border)]/60 flex items-start gap-3 shadow-2xs max-w-3xl mt-1">
            <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-text-sub leading-relaxed font-semibold">
              <strong className="text-text-main font-bold">AI Trajectory Insight:</strong> {aiMotivationalQuote}
            </p>
          </div>

        </div>

        {/* Right Column: Key Dials (Level, Streak, Profile Completion) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 self-start xl:self-center">
          
          {/* Level & XP Gauge */}
          <div className="flex items-center gap-3 bg-[var(--surface)]/80 backdrop-blur-xs border border-[var(--border)] p-3.5 rounded-xl shadow-2xs min-w-[150px]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0 font-black">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-text-mute uppercase tracking-wider">Level {levelInfo.level}</span>
                <span className="text-primary">{levelInfo.currentXpInLevel}/100 XP</span>
              </div>
              <span className="text-xs font-black text-text-main mt-0.5">Rank Pathfinder</span>
              <Progress value={levelInfo.currentXpInLevel} className="h-1.5 mt-1.5" />
            </div>
          </div>

          {/* Training Streak Counter */}
          <div className="flex items-center gap-3 bg-[var(--surface)]/80 backdrop-blur-xs border border-[var(--border)] p-3.5 rounded-xl shadow-2xs min-w-[130px]">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20 shrink-0 animate-pulse">
              <Flame className="w-5 h-5 fill-accent text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">Training Streak</span>
              <span className="text-sm font-black text-text-main mt-0.5">{user?.activeStreak || 5} Days Active</span>
            </div>
          </div>

          {/* Profile Completion Dial */}
          <div className="flex items-center gap-3 bg-[var(--surface)]/80 backdrop-blur-xs border border-[var(--border)] p-3.5 rounded-xl shadow-2xs min-w-[140px]">
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/20 bg-primary/5 shrink-0 font-black text-xs text-primary">
              {profileCompletion}%
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">Profile Power</span>
              <span className="text-xs font-black text-text-main mt-0.5">
                {profileCompletion >= 80 ? 'Optimized' : 'Calibrating'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WelcomeHero;
