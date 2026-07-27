/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Wand2, Layers, BookOpen, BarChart3, History, Sliders, HardDrive,
  Plus, Search, Sparkles, FolderOpen, ShieldCheck, Download, Lock
} from 'lucide-react';
import { useDocuments } from '../../../hooks/useDocuments';
import { DocumentsDashboard } from './DocumentsDashboard';
import { DocumentEditor } from './DocumentEditor';
import { DocumentGeneratorHub } from './DocumentGeneratorHub';
import { ResumeLibrary } from './ResumeLibrary';
import { TemplatesGallery } from './TemplatesGallery';
import { DocumentAnalyticsView } from './DocumentAnalyticsView';
import { DocumentHistoryView } from './DocumentHistoryView';
import { DocumentSettingsView } from './DocumentSettingsView';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';
import { SupportedDocType, DocumentTemplate, DocumentVersion } from '../../../types/documentTypes';

export type WorkspaceTab =
  | 'dashboard'
  | 'editor'
  | 'generators'
  | 'resumes'
  | 'templates'
  | 'analytics'
  | 'history'
  | 'settings';

export const DocumentsWorkspace: React.FC = () => {
  const {
    documents,
    allDocuments,
    folders,
    activeDoc,
    savingStatus,
    isGenerating,
    isAssistantActive,
    searchQuery,
    selectedFolderId,
    selectedTypeFilter,
    setSearchQuery,
    setSelectedFolderId,
    setSelectedTypeFilter,
    selectDocument,
    createNewDocument,
    updateActiveContent,
    createVersionSnapshot,
    deleteDocument,
    toggleFavorite,
    togglePin,
    generateAIDocument,
    runAssistantAction,
    runDocumentAudit,
    exportDocument
  } = useDocuments();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');

  const TABS: Array<{ id: WorkspaceTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Documents Hub', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'editor', label: 'Document Editor', icon: <FileText className="w-4 h-4" /> },
    { id: 'generators', label: 'AI Generators', icon: <Wand2 className="w-4 h-4 text-primary" /> },
    { id: 'resumes', label: 'Resume Library', icon: <Layers className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'ATS Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'history', label: 'Version History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  // Helper when clicking a doc from list
  const handleSelectAndEdit = (doc: any) => {
    selectDocument(doc);
    setActiveTab('editor');
  };

  // Helper when using template
  const handleUseTemplate = async (tmpl: DocumentTemplate) => {
    const doc = await createNewDocument(tmpl.doc_type, tmpl.title, tmpl.content);
    selectDocument(doc);
    setActiveTab('editor');
  };

  // Helper when restoring version
  const handleRestoreVersion = (ver: DocumentVersion) => {
    if (activeDoc) {
      updateActiveContent(ver.title, ver.content);
      setActiveTab('editor');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Primary Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto bg-[var(--surface)] p-2 rounded-card border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0',
                  isActive
                    ? 'bg-primary text-black shadow-xs'
                    : 'text-text-mute hover:text-text-main hover:bg-[var(--surface-secondary)]/50'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-[var(--border)] pl-3">
          <Badge variant="outline" className="text-[10px] font-extrabold gap-1 text-success bg-success/10 border-success/20">
            <Lock className="w-3 h-3" /> Supabase Storage Encrypted
          </Badge>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="w-full">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'dashboard' && (
            <DocumentsDashboard
              documents={documents}
              allDocuments={allDocuments}
              folders={folders}
              activeDoc={activeDoc}
              searchQuery={searchQuery}
              selectedFolderId={selectedFolderId}
              selectedTypeFilter={selectedTypeFilter}
              onSearchChange={setSearchQuery}
              onSelectFolder={setSelectedFolderId}
              onSelectType={setSelectedTypeFilter}
              onSelectDoc={handleSelectAndEdit}
              onCreateNew={(type) => { createNewDocument(type); setActiveTab('editor'); }}
              onToggleFavorite={toggleFavorite}
              onTogglePin={togglePin}
              onDeleteDoc={deleteDocument}
              onOpenGenerator={() => setActiveTab('generators')}
            />
          )}

          {activeTab === 'editor' && activeDoc && (
            <DocumentEditor
              document={activeDoc}
              savingStatus={savingStatus}
              onUpdateContent={updateActiveContent}
              onRunAssistant={runAssistantAction}
              onRunAudit={runDocumentAudit}
              onExport={exportDocument}
              onCreateSnapshot={createVersionSnapshot}
              onBackToList={() => setActiveTab('dashboard')}
              isAssistantActive={isAssistantActive}
            />
          )}

          {activeTab === 'editor' && !activeDoc && (
            <div className="flex flex-col items-center justify-center p-12 bg-[var(--surface)] border border-[var(--border)] rounded-card text-center gap-3">
              <FileText className="w-10 h-10 text-text-mute" />
              <h3 className="text-base font-black text-text-main">No Active Document</h3>
              <p className="text-xs text-text-sub max-w-sm">
                Create a new document draft or select an existing document from your hub.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  const doc = await createNewDocument('cover_letter', 'Untitled Cover Letter');
                  selectDocument(doc);
                }}
                className="font-black text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Document Draft
              </Button>
            </div>
          )}

          {activeTab === 'generators' && (
            <DocumentGeneratorHub
              onGenerate={generateAIDocument}
              isGenerating={isGenerating}
              onSelectDoc={(doc) => { selectDocument(doc); setActiveTab('editor'); }}
            />
          )}

          {activeTab === 'resumes' && (
            <ResumeLibrary
              documents={allDocuments}
              onCreateResume={async (title) => {
                const doc = await createNewDocument('resume', title);
                selectDocument(doc);
                setActiveTab('editor');
              }}
              onSelectDoc={handleSelectAndEdit}
              onDeleteDoc={deleteDocument}
              onExport={(doc) => exportDocument('pdf')}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesGallery onUseTemplate={handleUseTemplate} />
          )}

          {activeTab === 'analytics' && (
            <DocumentAnalyticsView
              document={activeDoc}
              onRunAudit={runDocumentAudit}
            />
          )}

          {activeTab === 'history' && (
            <DocumentHistoryView
              document={activeDoc}
              onRestoreVersion={handleRestoreVersion}
              onCreateSnapshot={createVersionSnapshot}
            />
          )}

          {activeTab === 'settings' && (
            <DocumentSettingsView />
          )}
        </motion.div>
      </div>

    </div>
  );
};

export default DocumentsWorkspace;
