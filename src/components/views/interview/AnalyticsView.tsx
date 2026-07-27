/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, LineChart, TrendingUp, Award, Calendar, BookOpen, Clock, 
  ChevronRight, ArrowLeft, Brain, Zap, ArrowUpRight, Trophy, Sparkles
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { 
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart as ReBarChart, Bar, Cell
} from 'recharts';
import { InterviewSession, Achievement } from './InterviewTypes';
import { CHART_WEEKLY_PROGRESS, CHART_SKILL_IMPROVEMENT } from './mockData';
import { cn } from '../../../lib/utils';

interface AnalyticsViewProps {
  sessions: InterviewSession[];
  achievements: Achievement[];
  onBack: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  sessions,
  achievements,
  onBack
}) => {
  // Aggregate stats
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalSessions) 
    : 0;
  
  const avgTech = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.technicalScore, 0) / totalSessions)
    : 0;

  const avgComm = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.communicationScore, 0) / totalSessions)
    : 0;

  const totalDurationMinutes = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60)
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in py-2 max-w-5xl mx-auto">
      
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-xs text-text-mute hover:text-text-main flex items-center gap-1.5 cursor-pointer px-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <span className="text-[10px] text-text-mute font-mono uppercase tracking-widest">Performance Metrics Panel</span>
      </div>

      {/* 2. Visual Hub Banner */}
      <div className="relative overflow-hidden p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="flex flex-col max-w-2xl relative z-10">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <BarChart2 className="w-3.5 h-3.5 mr-1" /> Analytics Dashboard
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Advanced Competency Analytics
          </h1>
          <p className="text-xs text-text-mute mt-1 leading-relaxed font-semibold">
            Track your professional progression across critical technical domains, algorithmic structuring, system scalability trade-offs, and behavioral STAR milestones.
          </p>
        </div>
      </div>

      {/* 3. Metrics Micro-Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
          <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Average Match Rating</span>
          <span className="text-2xl font-display font-black text-text-main">{avgScore}%</span>
          <span className="text-[9px] text-success font-black mt-1">👑 Top 8% of Candidates</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
          <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Technical Capability</span>
          <span className="text-2xl font-display font-black text-text-main">{avgTech}%</span>
          <span className="text-[9px] text-primary font-black mt-1">⚡ Senior-tier competency</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
          <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Communication Rating</span>
          <span className="text-2xl font-display font-black text-text-main">{avgComm}%</span>
          <span className="text-[9px] text-text-mute font-semibold mt-1">🗣️ Highly articulate style</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
          <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Accumulated Training Time</span>
          <span className="text-2xl font-display font-black text-text-main">{totalDurationMinutes} <span className="text-xs text-text-mute">Mins</span></span>
          <span className="text-[9px] text-primary font-black mt-1">🔥 Consistent pacing model</span>
        </div>

      </div>

      {/* 4. RECHARTS PLOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Plot 1: Weekly Improvement progress */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-primary" />
              <div>
                <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">Weekly Metric Progression</CardTitle>
                <CardDescription className="text-[10px]">Overall match score and communication progress over the last 4 weeks.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={CHART_WEEKLY_PROGRESS} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} domain={[40, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e37', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="score" name="Overall Match" stroke="#f1c40f" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="confidence" name="Confidence Metric" stroke="#3498db" strokeWidth={1.5} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="communication" name="Clarity Rating" stroke="#2ecc71" strokeWidth={1.5} />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plot 2: Competency Skill Indexes */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4.5 h-4.5 text-primary" />
              <div>
                <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">Domain Competency Levels</CardTitle>
                <CardDescription className="text-[10px]">Calculated strengths across core engineering, design and communication blocks.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={CHART_SKILL_IMPROVEMENT} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" opacity={0.2} />
                <XAxis dataKey="subject" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e37', borderRadius: '8px' }}
                />
                <Bar dataKey="A" name="Calculated Competency" fill="#f1c40f" radius={[4, 4, 0, 0]}>
                  {CHART_SKILL_IMPROVEMENT.map((entry, index) => {
                    const colors = ['#f1c40f', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* 5. ACHIEVEMENTS CHECKLIST */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3 border-b border-[var(--border)]/60">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4.5 h-4.5 text-primary" />
            <CardTitle className="text-sm">Milestones & Achievements Catalog</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={cn(
                'flex items-start gap-3 p-4.5 rounded-xl border transition-all duration-150',
                ach.unlocked 
                  ? 'bg-success/2 border-success/15' 
                  : 'bg-[var(--surface-secondary)]/10 border-[var(--border)]/70'
              )}
            >
              <span className="text-3xl select-none leading-none shrink-0">{ach.icon}</span>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={cn('text-xs font-black truncate', ach.unlocked ? 'text-text-main' : 'text-text-sub')}>{ach.title}</span>
                  <span className="text-[8.5px] font-mono text-primary font-bold shrink-0">+{ach.xpReward} XP</span>
                </div>
                <p className="text-[9.5px] text-text-mute leading-snug font-semibold">{ach.desc}</p>
                
                {/* Progress slider if lock is active */}
                {!ach.unlocked && typeof ach.progressMax === 'number' && typeof ach.progressCurrent === 'number' && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex justify-between text-[8px] text-text-mute font-bold">
                      <span>Progress Tracker</span>
                      <span>{ach.progressCurrent} / {ach.progressMax}</span>
                    </div>
                    <div className="w-full bg-[var(--border)]/40 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(ach.progressCurrent / ach.progressMax) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};
