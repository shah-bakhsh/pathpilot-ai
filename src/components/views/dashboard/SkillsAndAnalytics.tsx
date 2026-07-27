/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, AlertCircle, BookOpen, Layers, Award, Sparkles, CheckCircle2, Flame, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ResumeAnalysis } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';

interface SkillsAndAnalyticsProps {
  resumeAnalysis: ResumeAnalysis | null;
}

export const SkillsAndAnalytics: React.FC<SkillsAndAnalyticsProps> = ({ resumeAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'skills'>('progress');
  const { user } = useAuth();
  const { learningCourses, personalProjects } = useCareer();

  // Progress history data
  const progressData = [
    { day: 'Mon', hours: 2.5, xp: 45 },
    { day: 'Tue', hours: 4.0, xp: 80 },
    { day: 'Wed', hours: 1.5, xp: 30 },
    { day: 'Thu', hours: 5.2, xp: 110 },
    { day: 'Fri', hours: 3.0, xp: 60 },
    { day: 'Sat', hours: 6.5, xp: 140 },
    { day: 'Sun', hours: 4.8, xp: 95 },
  ];

  // Radar scores
  const radarScores = resumeAnalysis?.skillRadarScores || {
    languages: 7,
    frameworks: 5,
    architecture: 4,
    softSkills: 8,
    testing: 3,
    tooling: 6,
  };

  const radarData = [
    { subject: 'Languages', A: radarScores.languages * 10, fullMark: 100 },
    { subject: 'Frameworks', A: radarScores.frameworks * 10, fullMark: 100 },
    { subject: 'Architecture', A: radarScores.architecture * 10, fullMark: 100 },
    { subject: 'Testing', A: radarScores.testing * 10, fullMark: 100 },
    { subject: 'Tooling', A: radarScores.tooling * 10, fullMark: 100 },
    { subject: 'Soft Skills', A: radarScores.softSkills * 10, fullMark: 100 },
  ];

  const keywordsFound = resumeAnalysis?.keywordsFound || ['TypeScript', 'React', 'Node.js', 'REST APIs', 'SQL'];
  const keywordsMissing = resumeAnalysis?.keywordsMissing || ['Docker', 'Next.js', 'PostgreSQL', 'CI/CD Pipelines', 'System Design', 'Redis'];

  // Calculate study telemetry dynamically
  const totalHours = learningCourses.reduce((acc, c) => acc + c.hoursCompleted, 0) + (user?.activeStreak || 5) * 1.5;
  const completedProjectsCount = personalProjects.filter(p => p.status === 'completed').length + 1; // offset base project

  return (
    <Card className="w-full border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-[var(--border)]/60 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-primary" /> Metrics & Skill Gap Engine
            </CardTitle>
            <CardDescription className="text-[10px]">
              Review your study telemetry trends alongside matching keyword diagnostics.
            </CardDescription>
          </div>

          {/* Sub tabs switcher */}
          <div className="flex bg-[var(--hover-tint)]/40 p-1 rounded-lg self-start border border-[var(--border)]/40">
            <button
              onClick={() => setActiveTab('progress')}
              className={cn(
                'px-3.5 py-1.5 rounded-md text-[10.5px] font-black uppercase tracking-wider cursor-pointer transition-all duration-200 outline-none',
                activeTab === 'progress'
                  ? 'bg-[var(--surface)] text-primary shadow-xs border border-[var(--border)]/50'
                  : 'text-text-mute hover:text-text-main'
              )}
            >
              Study Progress
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={cn(
                'px-3.5 py-1.5 rounded-md text-[10.5px] font-black uppercase tracking-wider cursor-pointer transition-all duration-200 outline-none',
                activeTab === 'skills'
                  ? 'bg-[var(--surface)] text-primary shadow-xs border border-[var(--border)]/50'
                  : 'text-text-mute hover:text-text-main'
              )}
            >
              Skill Gaps Analysis
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {activeTab === 'progress' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Recharts Area Chart (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-[10.5px] font-black text-text-sub flex items-center gap-1 uppercase tracking-wider">
                📅 Continuous Weekly XP Metrics
              </span>
              <div className="w-full h-56 select-none relative">
                <div className="absolute top-1 right-2 flex items-center gap-1 text-[9px] text-text-mute font-bold bg-[var(--hover-tint)]/40 border border-[var(--border)]/30 px-2 py-0.5 rounded">
                  <RefreshCw className="w-2.5 h-2.5 text-primary shrink-0 animate-spin-slow" /> Real-time Feed
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="var(--text-mute)" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-mute)', fontWeight: 'bold' }} />
                    <YAxis stroke="var(--text-mute)" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-mute)', fontWeight: 'bold' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ color: 'var(--text-main)', fontSize: 10, fontWeight: 'black' }}
                      itemStyle={{ color: 'var(--color-primary)', fontSize: 11, fontWeight: 'black' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="xp"
                      name="XP Earned"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorXp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Metrics bento details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-3.5 bg-[var(--hover-tint)]/20 border border-[var(--border)]/60 rounded-xl flex flex-col gap-1.5">
                <span className="text-[9px] text-text-mute uppercase tracking-widest font-black flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" /> AI Assessment Analytics
                </span>
                <span className="text-xs font-black text-text-main">Telemetry Sync Complete</span>
                <p className="text-[10.5px] text-text-sub leading-normal mt-0.5 font-semibold">
                  Your peak XP surge occurred on Saturday with 140 XP gains, coinciding with your mock interview completion.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-[var(--hover-tint)]/15 border border-[var(--border)]/40 flex flex-col gap-1 transition-all duration-200 hover:border-primary/25">
                  <span className="text-[10px] text-text-mute font-bold uppercase tracking-wider">Total Study Hours</span>
                  <span className="text-base font-display font-black text-text-main mt-0.5">{totalHours.toFixed(1)} Hours</span>
                  <span className="text-[9px] text-success font-black mt-1 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-success shrink-0" /> ↑ +4.2h this week
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--hover-tint)]/15 border border-[var(--border)]/40 flex flex-col gap-1 transition-all duration-200 hover:border-primary/25">
                  <span className="text-[10px] text-text-mute font-bold uppercase tracking-wider">Completed Projects</span>
                  <span className="text-base font-display font-black text-text-main mt-0.5">{completedProjectsCount} Systems</span>
                  <span className="text-[9px] text-text-mute font-black mt-1">Next: Container Run</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Recharts Radar Chart (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <span className="text-[10.5px] font-black text-text-sub mb-3.5 uppercase tracking-wider">
                🎯 Alignment Category Index
              </span>
              <div className="w-full h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-sub)', fontSize: 9, fontWeight: 'black' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-mute)', fontSize: 8 }} />
                    <Radar
                      name="Calibration"
                      dataKey="A"
                      stroke="var(--color-primary)"
                      fill="var(--color-primary)"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills split overview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9.5px] text-text-mute font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Registered Skills ({keywordsFound.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keywordsFound.map((kw, i) => (
                    <Badge key={i} variant="success" className="text-[9.5px] font-black uppercase tracking-wider bg-success/10 text-success border-success/20 px-2 py-0.5 rounded">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-[var(--border)]/60 pt-3">
                <span className="text-[9.5px] text-text-mute font-black uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-warning" /> Missing Keywords ({keywordsMissing.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keywordsMissing.map((kw, i) => (
                    <Badge key={i} variant="warning" className="text-[9.5px] font-black uppercase tracking-wider bg-warning/10 text-warning border-warning/20 px-2 py-0.5 rounded">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-primary/3 border border-primary/10 rounded-xl flex flex-col gap-1 mt-1">
                <span className="text-[9px] font-black uppercase text-primary tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-primary text-primary" /> Critical Learning Priority
                </span>
                <p className="text-[10.5px] text-text-sub leading-normal font-semibold">
                  Integrate <strong className="text-text-main font-bold">PostgreSQL</strong> and <strong className="text-text-main font-bold">Docker</strong> schemas into your project bullet descriptions to immediately bypass candidate matching filters for Tier-1 positions.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsAndAnalytics;
