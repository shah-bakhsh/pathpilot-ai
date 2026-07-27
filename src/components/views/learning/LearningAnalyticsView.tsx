/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3, TrendingUp, Flame, Award, Download, Clock,
  CheckCircle2, Sparkles, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface LearningAnalyticsViewProps {
  courses: any[];
  userProfile?: any;
}

export const LearningAnalyticsView: React.FC<LearningAnalyticsViewProps> = ({ courses, userProfile }) => {
  const weeklyTrend = [
    { week: 'Wk 1', hours: 8, xp: 240 },
    { week: 'Wk 2', hours: 12, xp: 380 },
    { week: 'Wk 3', hours: 15, xp: 450 },
    { week: 'Wk 4', hours: 18, xp: 580 },
  ];

  const categoryBreakdown = [
    { name: 'System Design', value: 35, color: '#6366f1' },
    { name: 'Cloud & DevOps', value: 25, color: '#10b981' },
    { name: 'Full-Stack APIs', value: 20, color: '#3b82f6' },
    { name: 'Algorithms', value: 20, color: '#f59e0b' },
  ];

  const totalHours = courses.reduce((acc, c) => acc + (c.hoursCompleted || 0), 0);

  const handleDownloadReport = () => {
    const reportText = `PathPilot AI - Professional Skill Progress Report
Candidate Goal: ${userProfile?.currentTargetGoal || 'Software Engineer'}
Total Study Hours Logged: ${totalHours} Hours
Active Streak: ${userProfile?.activeStreak || 7} Days
Completed Syllabi: ${courses.filter(c => c.status === 'completed').length}
Generated: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pathpilot-learning-report.txt';
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs">
              Learning Velocity & Skill Progress
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Learning Analytics & Growth Insights
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track study hours, XP velocity trends, category distribution, and export verified skill progress reports.
          </p>
        </div>

        <Button
          onClick={handleDownloadReport}
          variant="outline"
          className="flex items-center gap-2 border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          <Download className="w-4 h-4 text-slate-400" />
          Export Progress Report
        </Button>
      </div>

      {/* Main Grid: Weekly Trend & Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Chart */}
        <Card className="bg-slate-900/30 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Weekly Study Momentum & XP Velocity
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Hours logged and experience points earned over the past month.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} name="XP Earned" />
                <Area type="monotone" dataKey="hours" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Hours Logged" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution Pie */}
        <Card className="bg-slate-900/30 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-400" /> Skill Category Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-800">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
