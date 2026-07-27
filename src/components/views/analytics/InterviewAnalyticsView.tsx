/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Mic,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  Brain,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const InterviewAnalyticsView: React.FC = () => {
  const scoreHistoryData = [
    { drill: 'Drill 1', score: 68, type: 'Technical' },
    { drill: 'Drill 2', score: 74, type: 'Behavioral' },
    { drill: 'Drill 3', score: 78, type: 'System Design' },
    { drill: 'Drill 4', score: 82, type: 'Technical' },
    { drill: 'Drill 5', score: 88, type: 'System Design' }
  ];

  const competencyBreakdown = [
    { category: 'Technical Problem Solving & Algorithms', score: 88, status: 'Mastered' },
    { category: 'System Architecture & Scalability', score: 82, status: 'Strong' },
    { category: 'STAR Behavioral Clarity & Communication', score: 86, status: 'Strong' },
    { category: 'Database Query Optimization & Edge Cases', score: 74, status: 'Refining' },
    { category: 'Concurrency & Locking Mechanisms', score: 68, status: 'Needs Practice' }
  ];

  const weakSpotTopics = [
    { topic: 'Distributed Rate Limiting Algorithms', errorRate: '32%', occurrences: 4 },
    { topic: 'Database Transaction Isolation Levels', errorRate: '28%', occurrences: 3 },
    { topic: 'REST API Rate Throttling Responses', errorRate: '20%', occurrences: 2 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Top Interview KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Total Drills Completed
              </span>
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">12 Sessions</span>
              <span className="text-xs font-bold text-success">+3 this week</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              64 questions answered & scored
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Average Overall Score
              </span>
              <Award className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">84%</span>
              <span className="text-xs font-bold text-success">+12% trend</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              High signal rating from AI Interrogator
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Technical Clarity Score
              </span>
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-accent tracking-tight">88%</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Precise, structured explanations
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Behavioral Confidence Score
              </span>
              <Sparkles className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">86%</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Strong STAR method alignment
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Drill Score Trend & Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drill Score Trend Chart */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Session Score Trajectory
            </CardTitle>
            <Badge variant="primary" className="text-[10px] font-bold">
              +20% Growth
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="drill" stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: 'var(--primary)' }}
                    name="Session Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Competency Scorecard */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" /> Interview Competency Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3.5">
            {competencyBreakdown.map((comp, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{comp.category}</span>
                  <span className="text-primary">{comp.score}%</span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weak Spot Topic Matrix */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Identified Technical Weak Spots
          </CardTitle>
          <Badge variant="warning" className="text-[10px] font-bold">
            Target Drills Recommended
          </Badge>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weakSpotTopics.map((topic, idx) => (
              <div key={idx} className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-text-main">{topic.topic}</span>
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-sub">
                  <span>Error Rate: {topic.errorRate}</span>
                  <span>Flagged {topic.occurrences}x</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
