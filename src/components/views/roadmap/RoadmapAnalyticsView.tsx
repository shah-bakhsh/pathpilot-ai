/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { RoadmapAnalyticsData } from '../../../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  BookOpen,
  Code2,
  Briefcase,
  FileCheck2,
  Smile
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

interface RoadmapAnalyticsViewProps {
  analytics?: Partial<RoadmapAnalyticsData>;
}

export function RoadmapAnalyticsView({ analytics }: RoadmapAnalyticsViewProps) {
  const data: RoadmapAnalyticsData = {
    completionPercent: analytics?.completionPercent ?? 68,
    learningPercent: analytics?.learningPercent ?? 82,
    projectsPercent: analytics?.projectsPercent ?? 75,
    applicationsPercent: analytics?.applicationsPercent ?? 50,
    interviewPercent: analytics?.interviewPercent ?? 60,
    resumePercent: analytics?.resumePercent ?? 88,
    overallCareerProgress: analytics?.overallCareerProgress ?? 71,
    totalXpEarned: analytics?.totalXpEarned ?? 1850,
    currentLevel: analytics?.currentLevel ?? 4,
    activeStreakDays: analytics?.activeStreakDays ?? 12,
    weeklyProgressTrend: analytics?.weeklyProgressTrend ?? [
      { week: 'W1', tasksCompleted: 8, xpEarned: 350 },
      { week: 'W2', tasksCompleted: 12, xpEarned: 520 },
      { week: 'W3', tasksCompleted: 15, xpEarned: 680 },
      { week: 'W4', tasksCompleted: 10, xpEarned: 450 }
    ],
    categoryBreakdown: analytics?.categoryBreakdown ?? [
      { category: 'Learning', value: 35, color: '#3b82f6' },
      { category: 'Projects', value: 25, color: '#10b981' },
      { category: 'Resume', value: 15, color: '#8b5cf6' },
      { category: 'Applications', value: 15, color: '#f59e0b' },
      { category: 'Interview', value: 10, color: '#ec4899' }
    ]
  };

  const radarData = [
    { subject: 'Resume', score: data.resumePercent },
    { subject: 'Learning', score: data.learningPercent },
    { subject: 'Projects', score: data.projectsPercent },
    { subject: 'Applications', score: data.applicationsPercent },
    { subject: 'Interview', score: data.interviewPercent },
    { subject: 'Overall', score: data.overallCareerProgress }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5 mr-1" /> Performance & Career Intelligence
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Roadmap Analytics</h2>
          <p className="text-sm text-muted-foreground">Comprehensive execution metrics tracking learning speed, project completions, and interview readiness.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-background px-4 py-2 rounded-xl border border-border/60 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Current Level</span>
            <span className="text-lg font-black text-primary">Level {data.currentLevel}</span>
          </div>
          <div className="bg-background px-4 py-2 rounded-xl border border-border/60 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Overall Progress</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{data.overallCareerProgress}%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Resume</span>
          <p className="text-lg font-bold text-foreground">{data.resumePercent}%</p>
        </Card>
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Learning</span>
          <p className="text-lg font-bold text-foreground">{data.learningPercent}%</p>
        </Card>
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Projects</span>
          <p className="text-lg font-bold text-foreground">{data.projectsPercent}%</p>
        </Card>
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Applications</span>
          <p className="text-lg font-bold text-foreground">{data.applicationsPercent}%</p>
        </Card>
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Interview</span>
          <p className="text-lg font-bold text-foreground">{data.interviewPercent}%</p>
        </Card>
        <Card className="p-3 border border-border/60 bg-surface-raised text-center space-y-1">
          <span className="text-xs text-muted-foreground">Streak</span>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{data.activeStreakDays} Days</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="border border-border/60 bg-surface-raised p-5 space-y-2">
          <CardTitle className="text-base font-bold">Career Readiness Balance</CardTitle>
          <CardDescription className="text-xs">Balanced score distribution across core career pillars.</CardDescription>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar name="Readiness" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Trend Bar Chart */}
        <Card className="border border-border/60 bg-surface-raised p-5 space-y-2">
          <CardTitle className="text-base font-bold">Weekly Task & XP Velocity</CardTitle>
          <CardDescription className="text-xs">Task execution speed over recent weekly sprints.</CardDescription>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyProgressTrend}>
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="tasksCompleted" name="Tasks Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="xpEarned" name="XP Earned" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
