/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Target, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  RefreshCw, BarChart3, ShieldCheck, Zap, BookOpen, Layers, Code2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';

interface SkillGapAnalysisViewProps {
  skillGapAnalysis: any;
  analyzingSkillGap: boolean;
  onRunAnalysis: (role?: string) => void;
  targetRole?: string;
  addXp: (amount: number) => void;
}

export const SkillGapAnalysisView: React.FC<SkillGapAnalysisViewProps> = ({
  skillGapAnalysis,
  analyzingSkillGap,
  onRunAnalysis,
  targetRole = 'Full Stack Software Engineer',
  addXp
}) => {
  const [selectedRole, setSelectedRole] = useState(targetRole);

  const data = skillGapAnalysis || {
    overallMatchPercent: 78,
    readinessLevel: 'Intermediate Alignment',
    radarData: [
      { subject: 'Languages', current: 85, required: 90 },
      { subject: 'Frameworks', current: 75, required: 85 },
      { subject: 'System Design', current: 60, required: 80 },
      { subject: 'Cloud & DevOps', current: 55, required: 75 },
      { subject: 'Databases', current: 80, required: 85 },
      { subject: 'Testing & QA', current: 65, required: 75 },
    ],
    skillGaps: [
      {
        skill: 'Redis Caching & Distributed Mutex Locks',
        category: 'Architecture',
        priority: 'High',
        currentLevel: 'Basic',
        targetLevel: 'Advanced',
        gapDescription: 'Missing hands-on experience with Redis caching, microservices message queues, and horizontal sharding.',
        estimatedHoursToBridge: 25,
        recommendedAction: 'Build a distributed rate limiter and study ByteByteGo System Design chapters.'
      },
      {
        skill: 'Google Cloud Run & Multi-Stage Docker',
        category: 'DevOps & Cloud',
        priority: 'High',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        gapDescription: 'Need container optimization and CI/CD workflow configuration skills for Cloud Run deployments.',
        estimatedHoursToBridge: 15,
        recommendedAction: 'Complete Google Cloud Architect hands-on lab and containerize Express services.'
      },
      {
        skill: 'GraphQL & Schema Federation',
        category: 'Frameworks',
        priority: 'Medium',
        currentLevel: 'None',
        targetLevel: 'Intermediate',
        gapDescription: 'Target job postings require GraphQL query optimization and schema federation.',
        estimatedHoursToBridge: 18,
        recommendedAction: 'Complete Apollo GraphQL Developer tutorial and convert REST endpoints.'
      },
      {
        skill: 'Automated Testing (Jest & Playwright)',
        category: 'Quality Assurance',
        priority: 'Medium',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        gapDescription: 'Increase automated code coverage from 40% to >85% for production pipelines.',
        estimatedHoursToBridge: 12,
        recommendedAction: 'Write unit test suites for server API routes and end-to-end UI flows.'
      }
    ],
    strengths: ['TypeScript (Strict Mode)', 'React 19 & Next.js', 'Node.js Express APIs', 'PostgreSQL Schema Design', 'Tailwind CSS UI'],
    strategicAdvice: `To reach senior level readiness for ${targetRole}, prioritize high-impact architectural topics like Redis distributed caching and containerized deployments on Cloud Run. Dedicated focus for 4-6 weeks will bridge all critical skill gaps.`
  };

  const totalBridgeHours = data.skillGaps?.reduce((acc: number, g: any) => acc + (g.estimatedHoursToBridge || 0), 0) || 70;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
              AI Skill Gap Engine
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              ATS Resume + Market Audit
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Skill Gap Diagnostic Matrix
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Comparing your verified profile skills and ATS resume extractions against live market requirements for <span className="text-indigo-400 font-bold">{selectedRole}</span>.
          </p>
        </div>

        <Button
          onClick={() => onRunAnalysis(selectedRole)}
          disabled={analyzingSkillGap}
          className="flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {analyzingSkillGap ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-300" />}
          Re-Analyze Skill Gaps
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/30 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Overall Role Alignment</span>
              <div className="text-3xl font-black text-white mt-1">{data.overallMatchPercent}%</div>
              <span className="text-xs font-bold text-indigo-400 mt-1 block">{data.readinessLevel}</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Target className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/30 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Identified Skill Gaps</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{data.skillGaps?.length || 4} <span className="text-xs text-slate-500 font-normal">critical gaps</span></div>
              <span className="text-xs font-bold text-slate-400 mt-1 block">Requires targeted study</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/30 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Time to Full Readiness</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{totalBridgeHours} <span className="text-xs text-slate-500 font-normal">Hours Total</span></div>
              <span className="text-xs font-bold text-slate-400 mt-1 block">~4 to 6 weeks dedicated pace</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Radar Chart & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <Card className="bg-slate-900/30 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Skill Competency Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Comparative visualization of candidate profile vs industry standard for {selectedRole}.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.radarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="current" name="Current Score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="required" name="Role Requirement" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strengths & Strategic Advice */}
        <div className="flex flex-col gap-6">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Confirmed Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.strengths?.map((s: string, idx: number) => (
                <Badge key={idx} className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs py-1 px-2.5">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> {s}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-indigo-950/20 border-indigo-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" /> AI Strategic Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-300 leading-relaxed">
                {data.strategicAdvice}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Skill Gap Remediation List */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Priority Skill Gaps & Action Plan
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Specific skill deficits identified from job market analysis with recommended learning actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {data.skillGaps?.map((gap: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge className={gap.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'}>
                    {gap.priority} Priority Gap
                  </Badge>
                  <span className="text-[10px] text-indigo-400 font-bold">{gap.category}</span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400">{gap.currentLevel} → {gap.targetLevel}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{gap.skill}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{gap.gapDescription}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 w-fit">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Action: {gap.recommendedAction}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">~{gap.estimatedHoursToBridge} Hours</span>
                  <span className="text-[10px] text-slate-500">Estimated Effort</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addXp(20);
                    alert(`Course module added for ${gap.skill}!`);
                  }}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  Bridge Gap
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
