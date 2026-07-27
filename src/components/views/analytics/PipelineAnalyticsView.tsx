/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  BarChart2,
  AlertTriangle,
  ArrowRight
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

export const PipelineAnalyticsView: React.FC = () => {
  const funnelStages = [
    { stage: 'Saved Opportunities', count: 24, percent: 100 },
    { stage: 'Applications Submitted', count: 18, percent: 75 },
    { stage: 'Screening Calls Scheduled', count: 8, percent: 33 },
    { stage: 'Technical Interviews', count: 5, percent: 21 },
    { stage: 'Behavioral & Onsite', count: 3, percent: 12.5 },
    { stage: 'Offers Extended', count: 1, percent: 4.1 }
  ];

  const weeklyVelocityData = [
    { week: 'Wk 1', applications: 3 },
    { week: 'Wk 2', applications: 5 },
    { week: 'Wk 3', applications: 4 },
    { week: 'Wk 4 (Current)', applications: 6 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Top Application KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Total Pipeline Applications
              </span>
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">18 Total</span>
              <span className="text-xs font-bold text-success">+6 this month</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Across 14 target companies
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Screening Conversion Rate
              </span>
              <Filter className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">44.4%</span>
              <span className="text-xs font-bold text-success">Above Industry Avg (20%)</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              8 screening calls secured from 18 apps
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Interview to Offer Rate
              </span>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-accent tracking-tight">20.0%</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              1 offer from 5 technical rounds
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Average Recruiter Response Time
              </span>
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">8.4 Days</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Fastest response: 2 days (Google)
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Application Funnel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Conversion Funnel */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> Application Pipeline Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3.5">
            {funnelStages.map((stg, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{stg.stage}</span>
                  <span className="text-primary">
                    {stg.count} ({stg.percent}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${stg.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Application Velocity Chart */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-accent" /> Weekly Application Velocity
            </CardTitle>
            <Badge variant="info" className="text-[10px] font-bold">
              Avg: 4.5/wk
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Bar dataKey="applications" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
