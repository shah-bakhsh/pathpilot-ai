/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, Sparkles, Target, 
  CheckCircle2, AlertCircle, Award, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, 
  YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';

export const ResumeInsightsView: React.FC = () => {
  const { analysisHistory, latestAnalysis } = useResume();

  // Chart data
  const trendData = analysisHistory.length > 0 
    ? analysisHistory.slice().reverse().map((a, i) => ({
        index: `Run ${i + 1}`,
        score: a.readinessScore,
        date: new Date(a.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
      }))
    : [
        { index: 'Audit 1', score: 62, date: 'Jul 10' },
        { index: 'Audit 2', score: 71, date: 'Jul 15' },
        { index: 'Audit 3', score: 78, date: 'Jul 22' },
        { index: 'Audit 4', score: 85, date: 'Jul 23' }
      ];

  const currentScore = latestAnalysis?.readinessScore || 78;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-5xl mx-auto">
      
      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Latest Score</span>
          <div className="text-3xl font-black text-primary mt-1">{currentScore}%</div>
          <span className="text-xs text-text-sub font-medium">Gemini AI Audit Score</span>
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Keywords Matched</span>
          <div className="text-3xl font-black text-emerald-500 mt-1">
            {latestAnalysis?.keywordsFound?.length || 7}
          </div>
          <span className="text-xs text-text-sub font-medium">Found in Resume</span>
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Missing Keywords</span>
          <div className="text-3xl font-black text-amber-500 mt-1">
            {latestAnalysis?.keywordsMissing?.length || 5}
          </div>
          <span className="text-xs text-text-sub font-medium">Recommended to add</span>
        </Card>
      </div>

      {/* Historical Score Progress Graph */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
        <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60">
          <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> ATS Score Evolution
          </CardTitle>
          <CardDescription className="text-xs">
            Tracking readiness score improvements over time.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-4">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-sub)', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-sub)', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
