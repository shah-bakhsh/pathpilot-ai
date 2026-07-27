/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/Card';
import { TRENDING_COMPANIES, TRENDING_SKILLS } from './mockData';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { Award, Flame, TrendingUp, BarChart2, Star, Sparkles } from 'lucide-react';

export const TrendingAnalytics: React.FC = () => {
  const { jobApplications } = useCareer();

  // 1. Map Application Statuses for Recharts Pie Chart
  const getStatusDistribution = () => {
    const counts: Record<string, number> = {
      applied: 0,
      screening: 0,
      technical: 0,
      behavioral: 0,
      offer: 0,
      rejected: 0,
      negotiation: 0
    };

    jobApplications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      } else {
        counts.applied++;
      }
    });

    const labelMap: Record<string, string> = {
      applied: 'Applied',
      screening: 'Screening',
      technical: 'Technical',
      behavioral: 'Behavioral',
      negotiation: 'Negotiation',
      offer: 'Offers Received',
      rejected: 'Pass / Passive'
    };

    return Object.keys(counts)
      .map((key) => ({
        name: labelMap[key] || key,
        value: counts[key]
      }))
      .filter((item) => item.value > 0);
  };

  const pieData = getStatusDistribution();

  // If empty, seed dummy data so the user sees a preview
  const activePieData = pieData.length > 0 ? pieData : [
    { name: 'Applied', value: 3 },
    { name: 'Screening', value: 2 },
    { name: 'Technical', value: 1 },
    { name: 'Offers Received', value: 1 }
  ];

  const COLORS = ['#6366f1', '#a855f7', '#f59e0b', '#38bdf8', '#ec4899', '#10b981', '#64748b'];

  // 2. Prepare Skills Growth Data
  const barData = TRENDING_SKILLS.map((skill) => ({
    name: skill.name,
    Demand: parseInt(skill.demandGrowth.replace('+', '').replace('%', '')),
    AvgSalary: parseInt(skill.avgSalary.replace('$', '').replace('K', ''))
  }));

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-300">
      
      {/* HEADER ROW */}
      <div className="border-b border-slate-800 pb-3 select-none">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          📈 Predictive Trends & Analytics
        </h2>
        <p className="text-xs text-slate-400">Examine marketplace trajectories, active skills demand ratios, and pipeline performance indices.</p>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 select-none">
        
        {/* PIE CHART: STATUSES */}
        <Card className="bg-slate-905 border-slate-850">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Application Status Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              {activePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {activePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] text-slate-400 font-semibold">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-slate-500 font-medium">No application statuses registered yet.</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* BAR CHART: SKILL DEMANDS */}
        <Card className="bg-slate-905 border-slate-850">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Hot Tech Skills Growth Factor (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Legend formatter={(value) => <span className="text-[10px] text-slate-400 font-semibold">{value}</span>} />
                  <Bar dataKey="Demand" name="Growth demand (%)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AvgSalary" name="Avg Salary ($K)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TRENDING CAROUSELS: SKILLS & COMPANIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
        
        {/* SKILLS CAROUSEL */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-400" /> Tech stacks demanding highest premiums
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {TRENDING_SKILLS.map((skill, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850/60 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-100 block">{skill.name}</span>
                  <span className="text-[10px] text-slate-500 block">Demanded in {skill.jobsCount} open roles</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-400 block">{skill.demandGrowth} Growth</span>
                  <span className="text-[10px] text-slate-400 block">Avg: {skill.avgSalary}/yr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPANIES CAROUSEL */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> Active Global Recruiting Hubs
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {TRENDING_COMPANIES.map((company, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-[10px] ${company.logo}`}>
                    {company.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{company.name}</span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {company.rating} Rating
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-indigo-400 block">{company.openRolesCount} Openings</span>
                  <div className="flex gap-1 mt-0.5">
                    {company.techStack.slice(0, 2).map((tech, idx) => (
                      <span key={idx} className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.2 rounded-sm font-semibold">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
