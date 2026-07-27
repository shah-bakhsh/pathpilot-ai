/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Briefcase,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import { Badge } from '../../ui/Badge';

export const CareerStrategyView: React.FC = () => {
  const quarters = [
    {
      quarter: 'Q1 Strategy',
      title: 'Foundation & Profile Optimization',
      status: 'completed',
      focus: 'Optimize ATS Resume, GitHub Readmes, LinkedIn Headline, and Personal Brand Activities.',
      deliverables: [
        'Primary Resume ATS Score > 85%',
        '3 Completed Project Repositories with Live Demos',
        'Updated LinkedIn Experience & Skills'
      ]
    },
    {
      quarter: 'Q2 Strategy',
      title: 'Cloud Native & Full-Stack Expansion',
      status: 'active',
      focus: 'Master Docker containerization, Google Cloud Run deployments, and PostgreSQL transaction pipelines.',
      deliverables: [
        'Deploy 2 Microservice Apps to Google Cloud Run',
        'Complete Technical Architecture Portfolio',
        'Conduct 5 System Design Drills with AI Coach'
      ]
    },
    {
      quarter: 'Q3 Strategy',
      title: 'Job Search Execution & Interview Sprints',
      status: 'upcoming',
      focus: 'Target Top-50 tech companies with tailored applications and interview simulations.',
      deliverables: [
        'Submit 20 High-Match Applications',
        'Achieve 80%+ Score in Technical Mock Interviews',
        'Secure 3 Active Recruiter Screening calls'
      ]
    },
    {
      quarter: 'Q4 Strategy',
      title: 'Offer Evaluation & Compensation Negotiation',
      status: 'upcoming',
      focus: 'Leverage multi-offer posture to negotiate top-tier compensation package.',
      deliverables: [
        'Evaluate Compensation vs Market Benchmarks',
        'Execute Negotiation Strategy for Base + Equity',
        'Finalize Acceptance & Career Transition'
      ]
    }
  ];

  return (
    <div id="career-strategy-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-pink-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-6 h-6 text-rose-400" />
            <h1 className="text-xl font-bold">Executive Career Strategy & Roadmap</h1>
          </div>
          <p className="text-xs text-rose-200/80">
            Multi-quarter strategic execution roadmap designed to maximize your long-term earnings and career trajectory.
          </p>
        </div>
      </div>

      {/* Quarters Timeline */}
      <div className="space-y-4">
        {quarters.map((q, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start justify-between gap-6 ${
              q.status === 'active'
                ? 'bg-[var(--color-bg-secondary)] border-rose-500 shadow-md'
                : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)]'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={q.status === 'completed' ? 'success' : q.status === 'active' ? 'primary' : 'neutral'}>
                  {q.quarter}
                </Badge>
                <span className="text-xs font-bold text-[var(--color-text-secondary)] capitalize">{q.status} Phase</span>
              </div>

              <h2 className="text-base font-bold text-[var(--color-text-primary)]">{q.title}</h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{q.focus}</p>

              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Strategic Deliverables:</span>
                <ul className="space-y-1">
                  {q.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] font-medium">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${q.status === 'completed' ? 'text-emerald-500' : 'text-rose-500'}`} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerStrategyView;
