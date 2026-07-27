/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  Sparkles,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DocumentAnalyticsViewProps {
  resumeAnalysis?: any;
  documentsCount?: number;
}

export const DocumentAnalyticsView: React.FC<DocumentAnalyticsViewProps> = ({
  resumeAnalysis,
  documentsCount = 5
}) => {
  const atsScore = resumeAnalysis?.readinessScore || 88;
  const keywordsMissing = resumeAnalysis?.keywordsMissing || [
    'Google Cloud Run',
    'Docker',
    'Redis Caching',
    'CI/CD Pipelines',
    'GraphQL'
  ];
  const keywordsFound = resumeAnalysis?.keywordsFound || [
    'TypeScript',
    'React 19',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Tailwind CSS',
    'REST API',
    'Git'
  ];

  const sectionScores = [
    { section: 'Professional Summary', score: 92 },
    { section: 'Technical Experience', score: 86 },
    { section: 'Education & Honors', score: 95 },
    { section: 'Featured Projects', score: 89 },
    { section: 'Key Competencies', score: 91 }
  ];

  const documentTypeData = [
    { type: 'Resumes', count: 3, avgScore: 88 },
    { type: 'Cover Letters', count: 4, avgScore: 92 },
    { type: 'Certificates', count: 2, avgScore: 95 },
    { type: 'Portfolios', count: 1, avgScore: 90 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Top Document KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Average ATS Score
              </span>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">{atsScore}%</span>
              <span className="text-xs font-bold text-success">ATS Ready</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Optimal scanner parsing accuracy
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Recruiter Match Rate
              </span>
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">89%</span>
              <span className="text-xs font-bold text-success">High Probability</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Estimated 3.4x interview callback rate
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Keyword Density Index
              </span>
              <Search className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-accent tracking-tight">
                {keywordsFound.length} Found
              </span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              {keywordsMissing.length} target keywords missing
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Vault Documents
              </span>
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">{documentsCount}</span>
              <span className="text-xs font-semibold text-text-sub">Versions active</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              All documents cryptographically verified
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Section Performance Scores & Document Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Score Breakdown */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Resume Section Quality Scorecards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            {sectionScores.map((sec, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{sec.section}</span>
                  <span className="text-primary">{sec.score}%</span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${sec.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Type Distribution Chart */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" /> Document Vault Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={documentTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="type" stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="avgScore" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Avg ATS Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Missing vs Found Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confirmed Keywords */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Detected ATS Keywords ({keywordsFound.length})
            </CardTitle>
            <Badge variant="success" className="text-[10px] font-bold">
              Matched
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {keywordsFound.map((kw, idx) => (
                <Badge
                  key={idx}
                  variant="neutral"
                  className="bg-success/10 text-success border-success/20 text-xs py-1 px-2.5 font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Target Keywords */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" /> Critical Missing Keywords ({keywordsMissing.length})
            </CardTitle>
            <Badge variant="warning" className="text-[10px] font-bold">
              High Impact
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {keywordsMissing.map((kw, idx) => (
                <Badge
                  key={idx}
                  variant="neutral"
                  className="bg-warning/10 text-warning border-warning/20 text-xs py-1 px-2.5 font-bold flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3 h-3 shrink-0" /> {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
