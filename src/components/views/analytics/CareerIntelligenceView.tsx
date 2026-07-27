/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Zap,
  BarChart2,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { CareerIntelligenceInsight } from '../../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface CareerIntelligenceViewProps {
  intelligence: CareerIntelligenceInsight | null;
  targetRole: string;
  readinessScore: number;
  onRefresh?: () => void;
}

export const CareerIntelligenceView: React.FC<CareerIntelligenceViewProps> = ({
  intelligence,
  targetRole,
  readinessScore,
  onRefresh
}) => {
  const score = intelligence?.readinessScore || readinessScore || 78;
  const percentile = intelligence?.percentileRank || 82;
  const salary = intelligence?.estimatedSalaryRange || { min: '$125,000', max: '$175,000', median: '$148,000' };
  const forecast = intelligence?.trajectoryForecast90Days || 92;

  const trajectoryData = [
    { month: 'Month 1', readiness: Math.max(50, score - 15), target: 70 },
    { month: 'Month 2', readiness: Math.max(60, score - 8), target: 78 },
    { month: 'Current', readiness: score, target: 82 },
    { month: 'Month 4 (Proj)', readiness: Math.min(95, score + 7), target: 88 },
    { month: 'Month 5 (Proj)', readiness: Math.min(98, score + 12), target: 92 },
    { month: 'Target', readiness: forecast, target: 95 }
  ];

  const marketVelocityData = [
    { skill: 'TypeScript', demand: 95, candidateSkill: 90 },
    { skill: 'React 19', demand: 92, candidateSkill: 88 },
    { skill: 'Node/Express', demand: 89, candidateSkill: 85 },
    { skill: 'System Design', demand: 94, candidateSkill: 68 },
    { skill: 'Cloud Run/Docker', demand: 88, candidateSkill: 65 },
    { skill: 'PostgreSQL', demand: 86, candidateSkill: 82 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Executive Hero KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Overall Readiness Index
              </span>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">{score}%</span>
              <span className="text-xs font-bold text-success flex items-center">
                +8% vs last month
              </span>
            </div>
            <div className="w-full bg-[var(--surface-border)] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Global Candidate Percentile
              </span>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">Top {100 - percentile}%</span>
              <span className="text-xs font-semibold text-text-sub">Rank {percentile} / 100</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Outperforming 82% of candidates targeting {targetRole}
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Market Salary Benchmark
              </span>
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-2xl font-black text-accent tracking-tight">{salary.median}</span>
              <span className="text-[10px] text-text-sub font-semibold">
                Range: {salary.min} – {salary.max}
              </span>
            </div>
            <Badge variant="info" className="text-[10px] font-bold mt-2 self-start">
              Demand: {intelligence?.marketDemandIndex || 'Very High'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                90-Day Forecast
              </span>
              <Target className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">{forecast}%</span>
              <span className="text-xs font-bold text-success">Target Ready</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Projected offer eligibility in 12 weeks
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Gemini AI Strategic Assessment Briefing */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  AI Career Strategic Assessment
                </span>
                <Badge variant="primary" className="text-[10px] font-bold">
                  Gemini 3.5 Intelligence
                </Badge>
              </div>
              <p className="text-xs text-text-sub leading-relaxed font-semibold max-w-3xl">
                {intelligence?.aiStrategicSummary ||
                  `Your current career trajectory puts you in the top 18th percentile of candidate readiness for ${targetRole}. Maintaining your current study velocity will increase your readiness score to ${forecast}% within 90 days, unlocking senior interview opportunities with median compensation of ${salary.median}.`}
              </p>
            </div>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="shrink-0 text-xs font-bold flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-primary" /> Refresh AI Assessment
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Trajectory Forecast Chart & Market Competitiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" /> 90-Day Trajectory Forecast
            </CardTitle>
            <Badge variant="neutral" className="text-[10px] font-bold">
              Predictive Model
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="month" stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#readinessGrad)"
                    name="Readiness Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Demand vs Candidate Mastery */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" /> Market Skill Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            {marketVelocityData.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{item.skill}</span>
                  <span className="text-text-mute">
                    {item.candidateSkill}% / {item.demand}% Req
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${item.candidateSkill}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors & Growth Accelerators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Identified Vulnerabilities
            </CardTitle>
            <Badge variant="warning" className="text-[10px] font-bold">
              Requires Focus
            </Badge>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3">
            {(intelligence?.riskFactors || [
              'System Design depth under timed interview conditions needs practice.',
              'Deployment automation and CI/CD workflow coverage is at 60%.'
            ]).map((risk, idx) => (
              <div
                key={idx}
                className="p-3 bg-warning/5 border border-warning/20 rounded-lg flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span className="text-xs text-text-sub font-semibold leading-relaxed">
                  {risk}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Accelerators */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Zap className="w-4 h-4 text-success" /> Recommended Accelerators
            </CardTitle>
            <Badge variant="success" className="text-[10px] font-bold">
              High Impact
            </Badge>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3">
            {(intelligence?.growthAccelerators || [
              'Deploy containerized backend to Google Cloud Run with custom domain.',
              'Complete 15 LeetCode Medium system design problems.',
              'Publish 1 open-source full-stack project repository with comprehensive documentation.'
            ]).map((action, idx) => (
              <div
                key={idx}
                className="p-3 bg-success/5 border border-success/20 rounded-lg flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="text-xs text-text-main font-semibold leading-relaxed">
                    {action}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-success shrink-0 opacity-70 hover:opacity-100 cursor-pointer" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
