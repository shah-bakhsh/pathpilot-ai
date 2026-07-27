/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Compass, Target, BookOpen, Layers, Briefcase, Award, CheckCircle, ChevronRight, Sparkles, AlertCircle, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface MilestoneDetail {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'future';
  title: string;
  description: string;
  timeframe: string;
  aiAdvice: string;
  icon: React.ReactNode;
}

export const CareerGps: React.FC<{ targetCareer: string }> = ({ targetCareer }) => {
  const [selectedId, setSelectedId] = useState<string>('next_milestone');

  const gpsMilestones: MilestoneDetail[] = [
    {
      id: 'current_pos',
      label: 'Current Position',
      status: 'completed',
      title: 'Calibration Foundation',
      description: 'Your base professional profile and initial credentials has been fully calibrated and analyzed against target markets.',
      timeframe: 'Completed',
      aiAdvice: 'Your core credentials look clean! The primary keyword gap is backend database indexing techniques and Docker deployments.',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'next_milestone',
      label: 'Next Milestone',
      status: 'active',
      title: 'Build Full-Stack APIs',
      description: 'Write robust RESTful backend endpoint schemas, configure error handling middleware, and integrate with PostgreSQL.',
      timeframe: 'Next 1-2 Weeks',
      aiAdvice: 'Prioritize writing secure JWT token validations stored securely in cookies rather than localstorage. Implement rate-limiting.',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'next_skill',
      label: 'Next Skill',
      status: 'future',
      title: 'Database Schema Optimization',
      description: 'Master PostgreSQL query indexing, execution plans, connection pool scaling, and structured database migrations.',
      timeframe: 'Next 2-3 Weeks',
      aiAdvice: 'Gemini predicts mastering database optimization and index configurations will boost your automatic recruiters screening match index by up to +15%.',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'next_project',
      label: 'Next Project',
      status: 'future',
      title: 'Containerized Microservices',
      description: 'Build a production-grade backend service utilizing multi-stage Docker builds and deploy to serverless infrastructure.',
      timeframe: 'Next 4 Weeks',
      aiAdvice: 'Deploy this project on Google Cloud Run to showcase auto-scaling configurations, secure environment keys, and lightweight container sizes.',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'internship',
      label: 'Internship',
      status: 'future',
      title: 'Backend Systems Intern',
      description: 'Apply to recommended internship pipelines at Tier-1 and Tier-2 companies matching your verified skill stack.',
      timeframe: 'Month 3-4',
      aiAdvice: 'This position aligns with the internship pipelines from Google and Stripe currently featured inside your customized opportunities radar.',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'dream_career',
      label: 'Dream Career',
      status: 'future',
      title: targetCareer || 'Senior Backend Engineer',
      description: 'Operate at scale as an autonomous engineer leading enterprise cloud architectures, data pipelines, and systems design.',
      timeframe: 'Target Horizon',
      aiAdvice: 'Maintain active personal branding (sharing TypeScript and database insights) to stay on top of automatic industry sourcing algorithms.',
      icon: <Award className="w-4 h-4" />
    },
  ];

  const selectedMilestone = gpsMilestones.find(m => m.id === selectedId) || gpsMilestones[1];

  return (
    <Card className="w-full border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Compass className="w-4.5 h-4.5 animate-spin-slow" />
            </div>
            <div>
              <CardTitle className="text-sm font-black text-text-main tracking-tight">Interactive Career GPS</CardTitle>
              <CardDescription className="text-[10px]">Tap any coordinate nodes below to audit recommended trajectories, timelines, and AI tips.</CardDescription>
            </div>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary font-black border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Signature Navigation
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 flex flex-col gap-6">
        {/* Horizontal timeline / bento nodes */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2 py-3">
          {/* Background connecting line */}
          <div className="absolute left-1/2 md:left-0 md:top-[1.25rem] transform -translate-x-1/2 md:-translate-x-0 w-[2px] md:w-full h-full md:h-[2px] bg-[var(--border)]/70 z-0" />

          {gpsMilestones.map((milestone, idx) => {
            const isSelected = selectedId === milestone.id;
            return (
              <button
                key={milestone.id}
                onClick={() => setSelectedId(milestone.id)}
                className="relative z-10 flex flex-col items-center group cursor-pointer outline-none w-full md:w-auto"
                aria-label={`Inspect ${milestone.label}`}
              >
                {/* Node Ring and Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm bg-[var(--surface)]',
                    milestone.status === 'completed'
                      ? 'border-success text-success bg-success/5 hover:bg-success/10'
                      : milestone.status === 'active'
                      ? 'border-accent text-accent bg-accent/5 animate-pulse'
                      : 'border-[var(--border)] text-text-mute group-hover:border-text-sub hover:bg-[var(--hover-tint)]/40',
                    isSelected && 'ring-4 ring-primary/30 scale-110 border-primary bg-primary text-black font-extrabold shadow-md'
                  )}
                >
                  {milestone.status === 'completed' && !isSelected ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    milestone.icon
                  )}
                </div>

                {/* Node text labels */}
                <div className="text-center mt-2 md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2 md:w-28 flex flex-col items-center">
                  <span
                    className={cn(
                      'text-[10px] font-black tracking-tight transition-colors',
                      isSelected ? 'text-primary font-black' : 'text-text-sub group-hover:text-text-main'
                    )}
                  >
                    {milestone.label}
                  </span>
                  <span className="text-[8px] font-bold text-text-mute uppercase tracking-widest block mt-0.5">
                    {milestone.timeframe}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Trajectory Action Card */}
        <div className="mt-2 md:mt-12 p-4 rounded-xl border border-[var(--border)]/80 bg-[var(--surface-secondary)]/30 backdrop-blur-xs flex flex-col gap-4 animate-fade-in relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-primary/2 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)]/40 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-black text-sm shrink-0 border border-primary/20">
                {selectedMilestone.status === 'completed' ? '✓' : '→'}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-text-mute uppercase tracking-widest">
                  {selectedMilestone.label} COORDINATE
                </span>
                <h4 className="text-sm font-black text-text-main tracking-tight leading-snug mt-0.5">
                  {selectedMilestone.title}
                </h4>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className={cn(
                'text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border',
                selectedMilestone.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                selectedMilestone.status === 'active' ? 'bg-accent/10 text-accent border-accent/20 animate-pulse font-extrabold' :
                'bg-[var(--hover-tint)] text-text-mute border-transparent'
              )}>
                {selectedMilestone.status}
              </span>
              <span className="text-[10px] text-text-mute font-bold bg-[var(--hover-tint)] px-2 py-0.5 rounded border border-[var(--border)]/40">
                {selectedMilestone.timeframe}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] font-black uppercase text-text-mute tracking-widest">Milestone Goal Description</span>
              <p className="text-xs text-text-sub leading-relaxed font-semibold">
                {selectedMilestone.description}
              </p>
            </div>
            
            <div className="md:col-span-5 p-3.5 rounded-xl bg-primary/4 dark:bg-primary/5 border border-primary/10 flex flex-col gap-1.5 relative overflow-hidden">
              <div className="absolute right-2 bottom-2 text-primary/10 select-none pointer-events-none">
                <Compass className="w-14 h-14 rotate-12" />
              </div>
              <span className="text-[9.5px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" /> AI Coordinate Advisor
              </span>
              <p className="text-[10.5px] text-text-sub leading-normal font-medium mt-0.5">
                {selectedMilestone.aiAdvice}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[8.5px] text-text-mute italic font-bold">
                <span>⚡ Real-time prediction node active</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerGps;
