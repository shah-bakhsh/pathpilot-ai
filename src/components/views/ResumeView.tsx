/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Sparkles, Layout, History, Upload, 
  Download, BarChart3, Clock, Layers, Star, Plus
} from 'lucide-react';

// Import Phase 5 Resume Sub-Components
import { ResumeVault } from './documents/ResumeVault';
import { ResumeBuilder } from './documents/ResumeBuilder';
import { ResumeUploader } from './documents/ResumeUploader';
import { AtsAnalyzer } from './documents/AtsAnalyzer';
import { ResumeVersions } from './documents/ResumeVersions';
import { ResumeTemplatesGallery } from './documents/ResumeTemplatesGallery';
import { ResumeExportView } from './documents/ResumeExportView';
import { ResumeHistoryView } from './documents/ResumeHistoryView';
import { ResumeInsightsView } from './documents/ResumeInsightsView';

import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { useResume } from '../../hooks/useResume';

export const ResumeView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'vault' | 'builder' | 'upload' | 'ats' | 'versions' | 'templates' | 'export' | 'history' | 'insights'
  >('vault');

  const { activeResume, latestAnalysis, createResume, selectResume } = useResume();

  const handleCreateNewResume = async () => {
    const title = prompt('Enter a title for your new resume:', 'New Tailored Resume');
    if (!title) return;
    const targetRole = prompt('Enter target job role / headline:', 'Full Stack Software Engineer') || 'Software Engineer';
    
    const created = await createResume(title, targetRole);
    if (created) {
      setActiveSubTab('builder');
    }
  };

  const handleEditResume = (id: string) => {
    selectResume(id);
    setActiveSubTab('builder');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Career Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">AI Resume Intelligence Studio</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> AI Resume Operating System
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Build, version, quantify, and analyze your professional resumes with Gemini AI & Supabase cloud persistence.
          </p>
        </div>

        {/* Action Header Stats & Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Badge variant="primary" className="text-xs font-black py-1 px-3">
            ATS Health: {latestAnalysis?.readinessScore || 78}%
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateNewResume}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Resume
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveSubTab('ats')}
            className="text-xs font-bold flex items-center gap-1.5 text-black"
          >
            <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" /> Gemini ATS Audit
          </Button>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'vault', label: 'Resume Vault', icon: <Layers className="w-4 h-4" /> },
          { id: 'builder', label: 'Resume Builder', icon: <FileText className="w-4 h-4" /> },
          { id: 'upload', label: 'File Upload & Storage', icon: <Upload className="w-4 h-4" /> },
          { id: 'ats', label: 'ATS AI Diagnostic', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'versions', label: 'Version Snapshots', icon: <Clock className="w-4 h-4" /> },
          { id: 'templates', label: 'Templates Gallery', icon: <Layout className="w-4 h-4" /> },
          { id: 'export', label: 'Export & Print', icon: <Download className="w-4 h-4" /> },
          { id: 'history', label: 'Activity Logs', icon: <History className="w-4 h-4" /> },
          { id: 'insights', label: 'Score Insights', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-bold transition-all cursor-pointer outline-none whitespace-nowrap',
                isActive
                  ? 'bg-primary text-black font-extrabold shadow-xs'
                  : 'bg-[var(--surface)] text-text-sub hover:bg-[var(--hover-tint)] hover:text-text-main border border-[var(--border)]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content Renderer */}
      <div className="w-full">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeSubTab === 'vault' && (
            <ResumeVault 
              onEditResume={handleEditResume}
              onCreateNew={handleCreateNewResume}
              onOpenAts={() => setActiveSubTab('ats')}
            />
          )}

          {activeSubTab === 'builder' && <ResumeBuilder />}

          {activeSubTab === 'upload' && (
            <ResumeUploader 
              onAnalyzeText={() => setActiveSubTab('ats')} 
            />
          )}

          {activeSubTab === 'ats' && <AtsAnalyzer />}

          {activeSubTab === 'versions' && <ResumeVersions />}

          {activeSubTab === 'templates' && (
            <ResumeTemplatesGallery 
              onSelectTemplate={() => setActiveSubTab('builder')} 
            />
          )}

          {activeSubTab === 'export' && <ResumeExportView />}

          {activeSubTab === 'history' && <ResumeHistoryView />}

          {activeSubTab === 'insights' && <ResumeInsightsView />}
        </motion.div>
      </div>

    </div>
  );
};

export default ResumeView;
