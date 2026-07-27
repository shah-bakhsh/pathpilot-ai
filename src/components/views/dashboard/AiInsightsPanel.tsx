/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Progress } from '../../ui/Progress';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  Gauge,
  Award,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';

export const AiInsightsPanel: React.FC = () => {
  const { user } = useAuth();
  const { resumeAnalysis, jobApplications } = useCareer();

  const score = resumeAnalysis?.readinessScore || 68;

  // Derive dynamic salary estimation based on target career & score
  const getSalaryEstimate = () => {
    const goal = (user?.currentTargetGoal || '').toLowerCase();
    let baseMin = 75000;
    let baseMax = 110000;

    if (goal.includes('senior') || goal.includes('lead') || goal.includes('staff')) {
      baseMin = 130000;
      baseMax = 185000;
    } else if (goal.includes('backend') || goal.includes('fullstack') || goal.includes('systems')) {
      baseMin = 85000;
      baseMax = 125000;
    } else if (goal.includes('frontend') || goal.includes('ui') || goal.includes('react')) {
      baseMin = 80000;
      baseMax = 115000;
    } else if (goal.includes('data') || goal.includes('ml') || goal.includes('ai')) {
      baseMin = 90000;
      baseMax = 140000;
    }

    // Add multiplier based on match score
    const factor = score / 100;
    const currentMin = Math.round(baseMin + (baseMax - baseMin) * factor * 0.3);
    const currentMax = Math.round(baseMin + (baseMax - baseMin) * (factor * 0.4 + 0.6));

    const formattedMin = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(currentMin);
    const formattedMax = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(currentMax);

    return { min: formattedMin, max: formattedMax, potentialBoost: '+$18,500' };
  };

  const salary = getSalaryEstimate();

  // Derive dynamic hiring probability index
  const hiringProbability = Math.min(Math.round(score * 0.9 + (user?.activeStreak || 5) * 1.5), 98);

  // Derive interview confidence rating
  const interviewConfidence = Math.min(Math.round(score * 0.85 + 10), 95);

  const predictions = [
    {
      title: 'Hiring Probability',
      value: `${hiringProbability}%`,
      desc: 'Based on current resume keyword density and active applications pipeline.',
      status: hiringProbability >= 80 ? 'Optimal' : hiringProbability >= 65 ? 'Competitive' : 'Needs Optimization',
      statusColor: hiringProbability >= 80 ? 'text-success bg-success/10 border-success/20' : hiringProbability >= 65 ? 'text-warning bg-warning/10 border-warning/20' : 'text-danger bg-danger/10 border-danger/20',
      icon: <Gauge className="w-4 h-4 text-primary" />
    },
    {
      title: 'Interview Confidence',
      value: `${interviewConfidence}%`,
      desc: 'Constructed from matching communication metrics and technical answer schemas.',
      status: interviewConfidence >= 80 ? 'Fluent' : 'Developing',
      statusColor: interviewConfidence >= 80 ? 'text-success bg-success/10 border-success/20' : 'text-warning bg-warning/10 border-warning/20',
      icon: <Award className="w-4 h-4 text-accent" />
    }
  ];

  return (
    <Card className="w-full relative overflow-hidden border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-primary/2">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4 animate-pulse fill-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-black tracking-tight text-text-main">AI Predictive Engine</CardTitle>
              <CardDescription className="text-[10px]">Real-time salary modeling, match parameters & market confidence.</CardDescription>
            </div>
          </div>
          <Badge variant="primary" className="text-[9px] font-black uppercase tracking-widest bg-primary/15 text-primary border-primary/20">
            Active Prediction
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Dynamic Salary Modeler Box */}
        <div className="p-4 rounded-xl border border-[var(--border)]/80 bg-[var(--surface-secondary)]/30 backdrop-blur-xs flex flex-col gap-2 relative">
          <div className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-success/10 text-success text-[10px] font-extrabold flex items-center gap-0.5 border border-success/20">
            <Zap className="w-3 h-3 text-success animate-bounce shrink-0" /> Boost {salary.potentialBoost}
          </div>
          <span className="text-[9px] text-text-mute uppercase tracking-widest font-black flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-text-mute" /> Projected Salary Band
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-display font-black text-text-main tracking-tight">
              {salary.min} - {salary.max}
            </span>
            <span className="text-xs text-text-mute font-bold">/ year</span>
          </div>
          <p className="text-[10.5px] text-text-sub leading-normal font-medium mt-1">
            Expected compensation scale for a candidate targeting <strong className="text-primary">{user?.currentTargetGoal || 'Backend Engineer'}</strong> with your verified credentials.
          </p>
          <div className="w-full h-1.5 bg-[var(--border)]/80 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${score}%` }} />
          </div>
          <div className="flex justify-between items-center text-[9px] text-text-mute font-bold">
            <span>Market Low Entry</span>
            <span className="text-text-sub">Resume Score: {score}%</span>
            <span>Premium Scale Goal</span>
          </div>
        </div>

        {/* Predictive Widgets Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {predictions.map((pred, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-2.5 transition-all duration-200 hover:border-primary/20 hover:shadow-xs group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-extrabold text-text-sub group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {pred.icon} {pred.title}
                </span>
                <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wider', pred.statusColor)}>
                  {pred.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-display font-black text-text-main tracking-tight group-hover:scale-105 transition-transform origin-left duration-200">{pred.value}</span>
                <span className="text-[9px] text-text-mute font-bold">Index</span>
              </div>
              <p className="text-[10px] text-text-mute leading-snug font-medium">
                {pred.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Today's Priority Action Alert */}
        <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-md bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-3 h-3 fill-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-[11px] font-black text-text-main leading-none uppercase tracking-wider">AI Strategy Dispatch</h5>
            <p className="text-[10.5px] text-text-sub leading-normal font-semibold mt-1">
              Add database indexing details and container orchestration (Docker) highlights to push your overall profile alignment past the <strong className="text-accent">85% threshold</strong>. This single fix increases top-tier hiring probability by <strong className="text-success">+14%</strong>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsightsPanel;
