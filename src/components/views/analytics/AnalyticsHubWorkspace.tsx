/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  FileText,
  BookOpen,
  Mic,
  Briefcase,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';

import { CareerIntelligenceView } from './CareerIntelligenceView';
import { DocumentAnalyticsView } from './DocumentAnalyticsView';
import { LearningAnalyticsSubView } from './LearningAnalyticsSubView';
import { InterviewAnalyticsView } from './InterviewAnalyticsView';
import { PipelineAnalyticsView } from './PipelineAnalyticsView';
import { AiTokenMetricsView } from './AiTokenMetricsView';
import { ExecutiveReportExporterView } from './ExecutiveReportExporterView';
import { AdminSystemHealthView } from './AdminSystemHealthView';

export type AnalyticsTab =
  | 'intelligence'
  | 'documents'
  | 'learning'
  | 'interview'
  | 'pipeline'
  | 'tokens'
  | 'exporter'
  | 'admin';

export const AnalyticsHubWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('intelligence');
  const { user } = useAuth();
  const { resumeAnalysis, jobApplications } = useCareer();
  const {
    careerIntelligence,
    systemHealth,
    auditLogs,
    loading,
    generatingReport,
    reportResult,
    loadIntelligence,
    loadSystemHealth,
    generateReport
  } = useAnalytics();

  const targetRole = user?.currentTargetGoal || 'Full Stack Software Engineer';
  const readinessScore = resumeAnalysis?.readinessScore || 78;

  const navItems = [
    { id: 'intelligence', label: 'Career Intelligence', icon: TrendingUp },
    { id: 'documents', label: 'Resume & Documents', icon: FileText },
    { id: 'learning', label: 'Learning & Skills', icon: BookOpen },
    { id: 'interview', label: 'Interview Performance', icon: Mic },
    { id: 'pipeline', label: 'Application Pipeline', icon: Briefcase },
    { id: 'tokens', label: 'AI Token Metrics', icon: Cpu },
    { id: 'exporter', label: 'Export Reports', icon: Download },
    { id: 'admin', label: 'System Admin', icon: ShieldCheck }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Career Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Enterprise Intelligence & Analytics</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" /> Master Analytics & Intelligence Workspace
          </h1>
          <p className="text-xs text-text-sub max-w-3xl leading-relaxed font-semibold mt-1">
            Real-time readiness radar, AI salary benchmarking, ATS document diagnostics, interview score trends, and system health.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="primary" className="text-xs font-black py-1 px-3">
            Readiness Index: {readinessScore}%
          </Badge>
          <Badge variant="success" className="text-xs font-black py-1 px-3">
            Goal: {targetRole}
          </Badge>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] overflow-x-auto pb-1 no-scrollbar">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AnalyticsTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 font-black'
                  : 'border-transparent text-text-sub hover:text-text-main hover:bg-[var(--surface-border)]'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-mute'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="w-full">
        {activeTab === 'intelligence' && (
          <CareerIntelligenceView
            intelligence={careerIntelligence}
            targetRole={targetRole}
            readinessScore={readinessScore}
            onRefresh={() => loadIntelligence(readinessScore, jobApplications.length)}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentAnalyticsView
            resumeAnalysis={resumeAnalysis}
            documentsCount={5}
          />
        )}

        {activeTab === 'learning' && (
          <LearningAnalyticsSubView />
        )}

        {activeTab === 'interview' && (
          <InterviewAnalyticsView />
        )}

        {activeTab === 'pipeline' && (
          <PipelineAnalyticsView />
        )}

        {activeTab === 'tokens' && (
          <AiTokenMetricsView />
        )}

        {activeTab === 'exporter' && (
          <ExecutiveReportExporterView
            onGenerateReport={generateReport}
            generating={generatingReport}
            reportResult={reportResult}
          />
        )}

        {activeTab === 'admin' && (
          <AdminSystemHealthView
            systemHealth={systemHealth}
            auditLogs={auditLogs}
            onRefreshHealth={loadSystemHealth}
          />
        )}
      </div>
    </div>
  );
};
