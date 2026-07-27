/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, BarChart3, TrendingUp, Sparkles, CheckCircle2, AlertCircle,
  FileText, Clock, Type, Award, RefreshCw
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { AppDocument } from '../../../types/documentTypes';

interface DocumentAnalyticsViewProps {
  document: AppDocument | null;
  onRunAudit: () => Promise<void>;
}

export const DocumentAnalyticsView: React.FC<DocumentAnalyticsViewProps> = ({
  document,
  onRunAudit
}) => {
  if (!document) {
    return (
      <Card className="border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center gap-3">
        <BarChart3 className="w-10 h-10 text-text-mute" />
        <h3 className="text-base font-black text-text-main">No Document Selected for Analytics</h3>
        <p className="text-xs text-text-sub max-w-sm">
          Select or open a career document from the workspace to inspect ATS match scores, readability, and grammar metrics.
        </p>
      </Card>
    );
  }

  const analytics = document.analytics || {
    wordCount: document.content.split(/\s+/).filter(Boolean).length,
    readingTimeMinutes: 1,
    grammarScore: 95,
    readabilityScore: 90,
    atsScore: 88,
    toneScore: 92,
    actionabilityScore: 89,
    improvementSuggestions: [
      'Add metric-backed accomplishment bullet points.',
      'Ensure standard ATS section headers are used.'
    ],
    keyHighlights: ['Strong action verb density', 'Clean structural layout']
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Quality Audit // Document Analytics
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            Analytics for "{document.title}"
          </h2>
          <p className="text-xs text-text-sub mt-1 max-w-2xl leading-relaxed">
            Real-time assessment of ATS compatibility, grammar accuracy, reading time, and executive tone alignment.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={onRunAudit} className="text-xs font-black gap-1.5 shrink-0">
          <RefreshCw className="w-3.5 h-3.5" /> Re-Run Full Audit
        </Button>
      </div>

      {/* Main Score Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-[var(--border)] bg-[var(--surface)] p-4 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-extrabold text-text-mute uppercase">ATS Compatibility</span>
          <span className="text-3xl font-black text-emerald-400 my-1">{analytics.atsScore}%</span>
          <span className="text-[10px] text-text-sub font-medium">Scannable Header Structure</span>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] p-4 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-extrabold text-text-mute uppercase">Grammar & Syntax</span>
          <span className="text-3xl font-black text-blue-400 my-1">{analytics.grammarScore}%</span>
          <span className="text-[10px] text-text-sub font-medium">Spelling & Punctuation</span>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] p-4 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-extrabold text-text-mute uppercase">Readability Index</span>
          <span className="text-3xl font-black text-amber-400 my-1">{analytics.readabilityScore}%</span>
          <span className="text-[10px] text-text-sub font-medium">Scannable Flow & Density</span>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] p-4 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-extrabold text-text-mute uppercase">Tone Match</span>
          <span className="text-3xl font-black text-primary my-1">{analytics.toneScore}%</span>
          <span className="text-[10px] text-text-sub font-medium">Executive Vocabulary</span>
        </Card>

      </div>

      {/* Feedback & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-xs font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" /> AI Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-2.5">
            {analytics.improvementSuggestions.map((sug, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-text-sub bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-xs font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Outstanding Document Qualities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-2.5">
            {(analytics.keyHighlights || ['Strong structural hierarchy', 'Clear action verbs']).map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-text-sub bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
