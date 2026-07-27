/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Award,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  PieChart
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { ResumeService } from '../../../services/resumeService';
import { AiCoachService } from '../../../services/aiCoachService';
import { CareerInsight, ResumeRecord } from '../../../types';
import { Badge } from '../../ui/Badge';

export const CareerInsightsView: React.FC = () => {
  const { user } = useAuth();
  const [primaryResume, setPrimaryResume] = useState<ResumeRecord | null>(null);
  const [insights, setInsights] = useState<CareerInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    ResumeService.getPrimaryResume(user.uid).then(res => setPrimaryResume(res));
  }, [user]);

  const loadInsights = async () => {
    if (!user) return;
    const data = await AiCoachService.getCareerInsights(user.uid);
    setInsights(data);
  };

  useEffect(() => {
    loadInsights();
  }, [user]);

  const handleRefreshInsights = async () => {
    if (!user) return;
    setLoading(true);
    setTimeout(async () => {
      await loadInsights();
      setLoading(false);
    }, 1000);
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="error">High Priority Impact</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Impact</Badge>;
      default:
        return <Badge variant="info">Growth Vector</Badge>;
    }
  };

  return (
    <div id="career-insights-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold">AI Career Insights & Diagnostics</h1>
          </div>
          <p className="text-xs text-purple-200/80">
            Real-time strategic analysis of your technical readiness, compensation benchmark, and skill positioning.
          </p>
        </div>

        <button
          onClick={handleRefreshInsights}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-Analyze Profile Context</span>
        </button>
      </div>

      {/* Top Metric Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">Overall Technical Readiness</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">86%</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center">
              +4% this month <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-2">
            Strong alignment for Senior Full-Stack Engineering roles.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">Market Compensation Range</span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">$135k - $165k</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-2">
            Based on tier-1 remote & hybrid tech job postings.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">Primary Skill Gap Vector</span>
            <BrainCircuit className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">Cloud & Infra</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-2">
            Adding Docker & CI/CD will increase recruiter conversion by 30%.
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Generated AI Strategic Reports
        </h2>

        {insights.map(ins => (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                  {ins.score ? `${ins.score}%` : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">{ins.title}</h3>
                  <span className="text-xs text-[var(--color-text-secondary)] capitalize">{ins.category.replace('_', ' ')} Report</span>
                </div>
              </div>

              <div>{getImpactBadge(ins.impact)}</div>
            </div>

            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed font-medium">
              {ins.summary}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Key Findings & Action Items:</h4>
              <ul className="space-y-1.5">
                {ins.detailPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-primary)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerInsightsView;
