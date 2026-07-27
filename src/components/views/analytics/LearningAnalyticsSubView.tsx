/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Zap,
  BarChart2,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const LearningAnalyticsSubView: React.FC = () => {
  const weeklyHoursData = [
    { week: 'Wk 1', actual: 12.5, target: 15 },
    { week: 'Wk 2', actual: 16.0, target: 15 },
    { week: 'Wk 3', actual: 18.4, target: 15 },
    { week: 'Wk 4 (Current)', actual: 21.0, target: 15 }
  ];

  const skillMasteryList = [
    { skill: 'TypeScript Generics & Mapped Types', level: 92, category: 'Languages' },
    { skill: 'React 19 Server Components', level: 88, category: 'Frontend' },
    { skill: 'Node.js & Express Architecture', level: 85, category: 'Backend' },
    { skill: 'PostgreSQL Query Optimization', level: 80, category: 'Databases' },
    { skill: 'System Design & Redis Caching', level: 72, category: 'Architecture' },
    { skill: 'Google Cloud Run Deployments', level: 68, category: 'DevOps' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Top Learning KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Total Study Hours Logged
              </span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">67.9 hrs</span>
              <span className="text-xs font-bold text-success">+18.4 hrs this week</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              140% of weekly target budget
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Courses Completed
              </span>
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">8 / 11</span>
              <span className="text-xs font-bold text-success">72% Completed</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              3 active courses in progress
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Skill Gap Reduction Velocity
              </span>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-accent tracking-tight">-64% Gap</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Closed 8 target technical gaps in 30 days
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Certification Readiness
              </span>
              <Award className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">74%</span>
              <span className="text-xs font-bold text-info">GCP Architect</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Exam target date in 21 days
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Charts: Weekly Study Hours & Skill Mastery Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours vs Target Chart */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" /> Weekly Study Velocity (Actual vs Target)
            </CardTitle>
            <Badge variant="primary" className="text-[10px] font-bold">
              Target: 15h/wk
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="week" stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="actual" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Actual Hours" />
                  <Bar dataKey="target" fill="var(--border)" radius={[4, 4, 0, 0]} name="Target Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Mastery Levels */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" /> Skill Mastery Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3.5">
            {skillMasteryList.map((sm, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{sm.skill}</span>
                  <span className="text-text-mute">
                    {sm.category} • {sm.level}%
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${sm.level}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
