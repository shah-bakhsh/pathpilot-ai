/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Flame, Award, Heart, CheckCircle2 } from 'lucide-react';

interface OpportunitiesHeroProps {
  totalRecommended: number;
  totalSaved: number;
  upcomingDeadlinesCount: number;
}

export const OpportunitiesHero: React.FC<OpportunitiesHeroProps> = ({
  totalRecommended,
  totalSaved,
  upcomingDeadlinesCount
}) => {
  const { user } = useAuth();
  const { jobApplications } = useCareer();

  // Compute stats based on real applications
  const totalApps = jobApplications.length;
  const totalOffers = jobApplications.filter(app => app.status === 'offer').length;
  const successRate = totalApps > 0 ? Math.round((totalOffers / totalApps) * 100) : 0;
  const streak = user?.activeStreak || 0;

  return (
    <div className="relative overflow-hidden rounded-card bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
        <div className="space-y-3 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold tracking-wide uppercase select-none"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Opportunities Hub
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-none"
          >
            Your Personal AI Career Marketplace
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400 leading-relaxed"
          >
            PathPilot AI maps your custom skills coordinates and resume compatibility scores directly against corporate pipelines. Optimize your profile keywords, analyze job specifications, and track every application step.
          </motion.p>
        </div>

        {/* User Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0"
        >
          {/* Recommended Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Recommended</span>
            </div>
            <div className="font-display font-black text-xl text-white leading-tight">
              {totalRecommended}
            </div>
            <span className="text-[10px] text-slate-400">High Match Opportunities</span>
          </div>

          {/* Saved Bookmarks Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-pink-500/30 transition-colors">
            <div className="flex items-center gap-2 text-pink-400 mb-1">
              <Heart className="w-4 h-4 shrink-0" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Bookmarks</span>
            </div>
            <div className="font-display font-black text-xl text-white leading-tight">
              {totalSaved}
            </div>
            <span className="text-[10px] text-slate-400">Saved in Pipeline Vault</span>
          </div>

          {/* Active Streak Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Flame className="w-4 h-4 shrink-0" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Streak</span>
            </div>
            <div className="font-display font-black text-xl text-white leading-tight flex items-baseline gap-1">
              {streak} <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <span className="text-[10px] text-slate-400">Active Action Cycle</span>
          </div>

          {/* Selection Success Rate Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Success Rate</span>
            </div>
            <div className="font-display font-black text-xl text-white leading-tight">
              {successRate}%
            </div>
            <span className="text-[10px] text-slate-400">Application Offer Index</span>
          </div>
        </motion.div>
      </div>

      {/* Quick trajectory summary bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Active Target Path: <strong className="text-white font-semibold">{user?.currentTargetGoal || 'Not set'}</strong></span>
        </div>
        {upcomingDeadlinesCount > 0 ? (
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{upcomingDeadlinesCount} application deadlines scheduled this week!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>All application schedules current. No upcoming deadlines today.</span>
          </div>
        )}
      </div>
    </div>
  );
};
