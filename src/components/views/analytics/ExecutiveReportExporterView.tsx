/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Zap,
  Printer
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ExecutiveReportConfig } from '../../../types';

interface ExecutiveReportExporterViewProps {
  onGenerateReport: (config: ExecutiveReportConfig) => Promise<any>;
  generating: boolean;
  reportResult: any | null;
}

export const ExecutiveReportExporterView: React.FC<ExecutiveReportExporterViewProps> = ({
  onGenerateReport,
  generating,
  reportResult
}) => {
  const [reportTitle, setReportTitle] = useState('PathPilot AI - Candidate Career Progress Briefing');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');

  const [includeIntelligence, setIncludeIntelligence] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [includeLearning, setIncludeLearning] = useState(true);
  const [includeInterview, setIncludeInterview] = useState(true);
  const [includePipeline, setIncludePipeline] = useState(true);
  const [includeTokens, setIncludeTokens] = useState(true);

  const handleGenerate = async () => {
    await onGenerateReport({
      reportTitle,
      dateRange,
      includeCareerIntelligence: includeIntelligence,
      includeDocumentAnalytics: includeDocs,
      includeLearningAnalytics: includeLearning,
      includeInterviewAnalytics: includeInterview,
      includePipelineAnalytics: includePipeline,
      includeTokenMetrics: includeTokens,
      format
    });
  };

  const handleExportDownload = () => {
    if (!reportResult) return;

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportResult, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `career_report_${dateRange}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv' || format === 'excel') {
      const csvRows = [
        ['Metric', 'Value'],
        ['Report Title', reportResult.reportTitle || reportTitle],
        ['Candidate Name', reportResult.candidateName || 'Candidate'],
        ['Target Role', reportResult.targetRole || 'Software Engineer'],
        ['Readiness Score', `${reportResult.metricsSummary?.overallReadinessPercent || 78}%`],
        ['Applications Submitted', reportResult.metricsSummary?.totalApplicationsSubmitted || 12],
        ['Interview Conversion Rate', `${reportResult.metricsSummary?.interviewConversionRatePercent || 33}%`],
        ['Study Hours Logged', reportResult.metricsSummary?.studyHoursLogged || 74.5],
        ['Skills Mastered', reportResult.metricsSummary?.skillsMastered || 14],
        ['ATS Average Match Score', `${reportResult.metricsSummary?.atsMatchAverageScore || 86}%`]
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `career_analytics_report_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      // Trigger Print for PDF format
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Report Configuration & AI Generator Header */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Executive Report Generator
          </CardTitle>
          <Badge variant="primary" className="text-[10px] font-bold">
            Export Center
          </Badge>
        </CardHeader>

        <CardContent className="p-6 flex flex-col gap-6">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-text-main">Report Title / Description</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full bg-[var(--surface-border)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-main">Time Horizon</label>
              <div className="flex items-center gap-1 bg-[var(--surface-border)] p-1 rounded-lg border border-[var(--border)]">
                {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
                      dateRange === range
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-sub hover:text-text-main'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Toggles */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-text-main">Included Analytics Modules</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Career Intelligence', state: includeIntelligence, set: setIncludeIntelligence },
                { label: 'Resume & Documents', state: includeDocs, set: setIncludeDocs },
                { label: 'Learning & Skills', state: includeLearning, set: setIncludeLearning },
                { label: 'Interview Drills', state: includeInterview, set: setIncludeInterview },
                { label: 'Application Pipeline', state: includePipeline, set: setIncludePipeline },
                { label: 'AI Token Metrics', state: includeTokens, set: setIncludeTokens }
              ].map((mod, idx) => (
                <label
                  key={idx}
                  onClick={() => mod.set(!mod.state)}
                  className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    mod.state
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-[var(--surface-border)] border-[var(--border)] text-text-mute'
                  }`}
                >
                  <span>{mod.label}</span>
                  <CheckCircle2 className={`w-4 h-4 ${mod.state ? 'opacity-100' : 'opacity-30'}`} />
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection & Action */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-main">Export Format:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'pdf', label: 'PDF Summary', icon: Printer },
                  { id: 'csv', label: 'CSV Table', icon: FileSpreadsheet },
                  { id: 'json', label: 'JSON Package', icon: FileCode }
                ].map((fmt) => {
                  const IconComp = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        format === fmt.id
                          ? 'bg-primary text-white border-primary'
                          : 'bg-[var(--surface-border)] text-text-sub border-[var(--border)] hover:text-text-main'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      {fmt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="primary"
              className="text-xs font-bold py-2 px-5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating Report...' : 'Compile Executive AI Briefing'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Result Briefing */}
      {reportResult && (
        <Card className="border-primary/20 bg-[var(--surface)] animate-fade-in">
          <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Generated Report Preview
            </CardTitle>
            <Button
              onClick={handleExportDownload}
              variant="success"
              size="sm"
              className="text-xs font-bold flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download ({format.toUpperCase()})
            </Button>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4">
              <h2 className="text-base font-black text-text-main">{reportResult.reportTitle}</h2>
              <span className="text-xs font-bold text-text-sub">
                Candidate: {reportResult.candidateName || 'Candidate'} • Target: {reportResult.targetRole} • Date: {new Date(reportResult.generatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col gap-2">
              <span className="text-xs font-black uppercase text-primary tracking-wider">
                Executive AI Briefing Summary
              </span>
              <p className="text-xs text-text-sub leading-relaxed font-semibold">
                {reportResult.executiveSummaryText}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-[var(--surface-border)] rounded-lg flex flex-col">
                <span className="text-[10px] text-text-mute font-bold">Overall Readiness</span>
                <span className="text-xl font-black text-primary">
                  {reportResult.metricsSummary?.overallReadinessPercent || 78}%
                </span>
              </div>
              <div className="p-3 bg-[var(--surface-border)] rounded-lg flex flex-col">
                <span className="text-[10px] text-text-mute font-bold">Applications</span>
                <span className="text-xl font-black text-text-main">
                  {reportResult.metricsSummary?.totalApplicationsSubmitted || 12}
                </span>
              </div>
              <div className="p-3 bg-[var(--surface-border)] rounded-lg flex flex-col">
                <span className="text-[10px] text-text-mute font-bold">Interview Conversion</span>
                <span className="text-xl font-black text-success">
                  {reportResult.metricsSummary?.interviewConversionRatePercent || 33}%
                </span>
              </div>
              <div className="p-3 bg-[var(--surface-border)] rounded-lg flex flex-col">
                <span className="text-[10px] text-text-mute font-bold">Study Hours</span>
                <span className="text-xl font-black text-accent">
                  {reportResult.metricsSummary?.studyHoursLogged || 74.5} hrs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
