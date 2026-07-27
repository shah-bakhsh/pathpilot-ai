/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Save, Download, Sparkles, History, Eye, Maximize2, Minimize2,
  Check, RefreshCw, Wand2, Type, List, ListOrdered, Quote, Code, Heading1,
  Heading2, Bold, Italic, ArrowLeft, ShieldCheck, Tag, Folder, Share2,
  Sliders, MessageSquare, AlertCircle, Copy
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/utils';
import { AppDocument, ToneOption, ExportFormat } from '../../../types/documentTypes';

interface DocumentEditorProps {
  document: AppDocument;
  savingStatus: 'idle' | 'saving' | 'saved';
  onUpdateContent: (newTitle: string, newContent: string) => void;
  onRunAssistant: (params: any) => Promise<void>;
  onRunAudit: () => Promise<void>;
  onExport: (format: ExportFormat) => void;
  onCreateSnapshot: (summary: string) => Promise<void>;
  onBackToList?: () => void;
  isAssistantActive?: boolean;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  savingStatus,
  onUpdateContent,
  onRunAssistant,
  onRunAudit,
  onExport,
  onCreateSnapshot,
  onBackToList,
  isAssistantActive = false
}) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<'assistant' | 'analytics' | 'history' | 'settings' | null>('assistant');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('Professional');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [checkpointNote, setCheckpointNote] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync state if external document prop changes
  useEffect(() => {
    setTitle(document.title);
    setContent(document.content);
  }, [document.id, document.title, document.content]);

  // Handle title/content changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    onUpdateContent(val, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    onUpdateContent(title, val);
  };

  // Helper formatting injectors for markdown editor
  const injectFormatting = (prefix: string, suffix: string = '') => {
    const textarea = window.document.getElementById('doc-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    onUpdateContent(title, newContent);
  };

  // Calculate quick live stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={cn(
      'flex flex-col w-full bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-xs transition-all duration-200 overflow-hidden',
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' : 'min-h-[750px]'
    )}>
      
      {/* 1. EDITOR TOP HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--border)] bg-[var(--surface-secondary)]/20">
        
        {/* Left Title & Status */}
        <div className="flex items-center gap-3 min-w-[260px] flex-1">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-secondary)] text-text-sub transition-colors cursor-pointer"
              title="Back to Documents"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col flex-1 max-w-md">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="bg-transparent text-sm md:text-base font-black text-text-main outline-none focus:border-b focus:border-primary px-1 py-0.5 tracking-tight"
              placeholder="Document Title..."
            />
            <div className="flex items-center gap-2 text-[10px] text-text-mute px-1 mt-0.5">
              <span className="capitalize font-bold text-primary">{document.doc_type.replace(/_/g, ' ')}</span>
              <span>•</span>
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold">
                {savingStatus === 'saving' && <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-500" />}
                {savingStatus === 'saved' && <Check className="w-2.5 h-2.5 text-success" />}
                <span className={savingStatus === 'saving' ? 'text-amber-500' : savingStatus === 'saved' ? 'text-success' : 'text-text-mute'}>
                  {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'saved' ? 'Auto-Saved' : 'Synced'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions & View Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveRightPanel(activeRightPanel === 'assistant' ? null : 'assistant')}
            className={cn('text-xs gap-1.5 font-extrabold', activeRightPanel === 'assistant' && 'border-primary text-primary bg-primary/5')}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Assistant
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveRightPanel(activeRightPanel === 'analytics' ? null : 'analytics')}
            className={cn('text-xs gap-1.5 font-extrabold', activeRightPanel === 'analytics' && 'border-primary text-primary bg-primary/5')}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ATS Audit ({document.analytics?.atsScore || 88})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="text-xs gap-1.5 font-extrabold"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-[var(--border)] text-text-mute hover:text-text-main transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Focus Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. FORMATTING TOOLBAR */}
      <div className="flex items-center gap-1 p-2 px-4 border-b border-[var(--border)]/60 bg-[var(--surface)] text-text-sub text-xs overflow-x-auto select-none">
        <button
          onClick={() => injectFormatting('# ', '')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => injectFormatting('## ', '')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <button
          onClick={() => injectFormatting('**', '**')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer font-bold"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => injectFormatting('*', '*')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer italic"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <button
          onClick={() => injectFormatting('- ', '')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => injectFormatting('1. ', '')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => injectFormatting('> ', '')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => injectFormatting('```\n', '\n```')}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main transition-colors cursor-pointer"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-2 text-[11px] text-text-mute font-medium">
          <span>Markdown Supported</span>
        </div>
      </div>

      {/* 3. MAIN EDITOR BODY & SIDEBAR */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* TEXTAREA WRAPPER */}
        <div className="flex-1 flex flex-col p-6 bg-[var(--background)]/30 overflow-y-auto">
          <textarea
            id="doc-editor-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Type your markdown document content here, or use the AI Assistant to auto-formulate your text..."
            className="w-full h-full min-h-[500px] bg-transparent text-sm text-text-main font-mono leading-relaxed outline-none resize-none placeholder:text-text-mute"
          />
        </div>

        {/* 4. SLIDING RIGHT SIDEBAR PANEL */}
        <AnimatePresence>
          {activeRightPanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[var(--border)] bg-[var(--surface)] flex flex-col p-4 gap-4 overflow-y-auto shrink-0"
            >
              
              {/* AI ASSISTANT PANEL */}
              {activeRightPanel === 'assistant' && (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2">
                    <h3 className="text-xs font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
                      <Wand2 className="w-4 h-4 text-primary" /> AI Career Writer
                    </h3>
                    <Badge variant="primary" className="text-[9px] px-1.5 py-0.5">Gemini 3.5</Badge>
                  </div>

                  {/* Quick Tone Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Tone Presets</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['Formal', 'Professional', 'Academic', 'Confident'] as ToneOption[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTone(t)}
                          className={cn(
                            'text-[11px] font-bold py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer',
                            selectedTone === t
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-[var(--border)] text-text-sub hover:bg-[var(--surface-secondary)]'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Writing Assistant Action Buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    <label className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Instant Smart Refinement</label>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAssistantActive}
                      onClick={() => onRunAssistant({ content, action: 'rewrite', tone: selectedTone })}
                      className="justify-start text-xs font-semibold gap-2 border-[var(--border)] hover:border-primary/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Rewrite for Impact
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAssistantActive}
                      onClick={() => onRunAssistant({ content, action: 'ats_optimize', tone: selectedTone })}
                      className="justify-start text-xs font-semibold gap-2 border-[var(--border)] hover:border-primary/40"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ATS Keyword Injection
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAssistantActive}
                      onClick={() => onRunAssistant({ content, action: 'expand', tone: selectedTone })}
                      className="justify-start text-xs font-semibold gap-2 border-[var(--border)] hover:border-primary/40"
                    >
                      <Type className="w-3.5 h-3.5 text-indigo-400" /> Expand Technical Context
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAssistantActive}
                      onClick={() => onRunAssistant({ content, action: 'shorten', tone: selectedTone })}
                      className="justify-start text-xs font-semibold gap-2 border-[var(--border)] hover:border-primary/40"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> Shorten & Condense
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAssistantActive}
                      onClick={() => onRunAssistant({ content, action: 'grammar_fix', tone: selectedTone })}
                      className="justify-start text-xs font-semibold gap-2 border-[var(--border)] hover:border-primary/40"
                    >
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Grammar & Syntax Polish
                    </Button>
                  </div>

                  {/* Manual Prompt Input */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]/60">
                    <label className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Custom Edit Command</label>
                    <textarea
                      value={assistantPrompt}
                      onChange={e => setAssistantPrompt(e.target.value)}
                      placeholder="e.g. Highlight my experience in TypeScript microservices..."
                      className="w-full text-xs p-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none focus:border-primary resize-none h-20 text-text-main"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isAssistantActive || !assistantPrompt.trim()}
                      onClick={() => {
                        onRunAssistant({ content, action: 'rewrite', tone: selectedTone, keywordsToInclude: [assistantPrompt] });
                        setAssistantPrompt('');
                      }}
                      className="text-xs font-black gap-1.5 w-full"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Execute AI Transformation
                    </Button>
                  </div>
                </div>
              )}

              {/* ANALYTICS & ATS AUDIT PANEL */}
              {activeRightPanel === 'analytics' && (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2">
                    <h3 className="text-xs font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> ATS & Quality Audit
                    </h3>
                    <button onClick={() => onRunAudit()} className="p-1 text-text-mute hover:text-primary transition-colors cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--surface-secondary)]/30 p-2.5 rounded-xl border border-[var(--border)]/60 text-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase block">ATS Match</span>
                      <span className="text-xl font-black text-emerald-400">{document.analytics?.atsScore || 88}%</span>
                    </div>
                    <div className="bg-[var(--surface-secondary)]/30 p-2.5 rounded-xl border border-[var(--border)]/60 text-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase block">Grammar</span>
                      <span className="text-xl font-black text-blue-400">{document.analytics?.grammarScore || 95}%</span>
                    </div>
                    <div className="bg-[var(--surface-secondary)]/30 p-2.5 rounded-xl border border-[var(--border)]/60 text-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase block">Readability</span>
                      <span className="text-xl font-black text-amber-400">{document.analytics?.readabilityScore || 90}%</span>
                    </div>
                    <div className="bg-[var(--surface-secondary)]/30 p-2.5 rounded-xl border border-[var(--border)]/60 text-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase block">Actionability</span>
                      <span className="text-xl font-black text-primary">{document.analytics?.actionabilityScore || 89}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-[10px] font-bold text-text-mute uppercase tracking-wider">AI Suggestions</label>
                    {(document.analytics?.improvementSuggestions || [
                      'Quantify achievements with clear metrics.',
                      'Incorporate standard industry keywords.'
                    ]).map((sug, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-text-sub bg-[var(--background)] p-2 rounded-lg border border-[var(--border)]">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onRunAudit()}
                    className="text-xs font-black gap-1.5 w-full mt-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-Run Full Quality Audit
                  </Button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-card p-6 max-w-md w-full shadow-lg flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="text-sm font-black text-text-main flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" /> Export Career Document
                </h3>
                <button onClick={() => setShowExportModal(false)} className="text-text-mute hover:text-text-main text-xs">✕</button>
              </div>

              <p className="text-xs text-text-sub">
                Select your preferred file format to download <strong className="text-text-main">{document.title}</strong>:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { fmt: 'pdf', name: 'PDF Document', desc: 'Print-ready formatted' },
                  { fmt: 'docx', name: 'Word (.docx)', desc: 'Editable MS Word' },
                  { fmt: 'markdown', name: 'Markdown (.md)', desc: 'Clean source text' },
                  { fmt: 'html', name: 'HTML Web Page', desc: 'Styled web document' },
                  { fmt: 'txt', name: 'Plain Text (.txt)', desc: 'Raw unformatted text' }
                ].map(item => (
                  <button
                    key={item.fmt}
                    onClick={() => {
                      onExport(item.fmt as ExportFormat);
                      setShowExportModal(false);
                    }}
                    className="flex flex-col items-start p-3 rounded-xl border border-[var(--border)] hover:border-primary/50 hover:bg-primary/5 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-extrabold text-text-main group-hover:text-primary">{item.name}</span>
                    <span className="text-[10px] text-text-mute">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" onClick={() => setShowExportModal(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
