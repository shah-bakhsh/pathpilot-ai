/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Sparkles, FolderOpen, Star, ShieldCheck, Clock, Download, Plus,
  Search, Filter, Trash2, Edit3, Pin, Copy, HardDrive, Check, Award, ArrowRight,
  TrendingUp, RefreshCw, Wand2
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/utils';
import { AppDocument, DocumentFolder, SupportedDocType } from '../../../types/documentTypes';

interface DocumentsDashboardProps {
  documents: AppDocument[];
  allDocuments: AppDocument[];
  folders: DocumentFolder[];
  activeDoc: AppDocument | null;
  searchQuery: string;
  selectedFolderId: string | null;
  selectedTypeFilter: SupportedDocType | 'all';
  onSearchChange: (q: string) => void;
  onSelectFolder: (id: string | null) => void;
  onSelectType: (type: SupportedDocType | 'all') => void;
  onSelectDoc: (doc: AppDocument) => void;
  onCreateNew: (type?: SupportedDocType) => void;
  onToggleFavorite: (doc: AppDocument) => void;
  onTogglePin: (doc: AppDocument) => void;
  onDeleteDoc: (id: string) => void;
  onOpenGenerator: () => void;
}

export const DocumentsDashboard: React.FC<DocumentsDashboardProps> = ({
  documents,
  allDocuments,
  folders,
  activeDoc,
  searchQuery,
  selectedFolderId,
  selectedTypeFilter,
  onSearchChange,
  onSelectFolder,
  onSelectType,
  onSelectDoc,
  onCreateNew,
  onToggleFavorite,
  onTogglePin,
  onDeleteDoc,
  onOpenGenerator
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (doc: AppDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(doc.content);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate statistics
  const totalDocs = allDocuments.length;
  const favoriteDocs = allDocuments.filter(d => d.is_favorite);
  const pinnedDocs = allDocuments.filter(d => d.is_pinned);
  const avgAtsScore = totalDocs > 0
    ? Math.round(allDocuments.reduce((acc, d) => acc + (d.analytics?.atsScore || 85), 0) / totalDocs)
    : 88;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. TOP OVERVIEW METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-text-mute uppercase tracking-wider">Total Documents</span>
              <span className="text-2xl font-black text-text-main mt-1">{totalDocs}</span>
              <span className="text-[10px] text-text-sub mt-0.5 font-medium">Persisted in Supabase Vault</span>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-text-mute uppercase tracking-wider">Average ATS Score</span>
              <span className="text-2xl font-black text-emerald-400 mt-1">{avgAtsScore}/100</span>
              <span className="text-[10px] text-text-sub mt-0.5 font-medium">High Match Compatibility</span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-text-mute uppercase tracking-wider">Favorites & Pinned</span>
              <span className="text-2xl font-black text-amber-400 mt-1">{favoriteDocs.length + pinnedDocs.length}</span>
              <span className="text-[10px] text-text-sub mt-0.5 font-medium">Quick Access Shortcuts</span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <Star className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-text-mute uppercase tracking-wider">Organized Folders</span>
              <span className="text-2xl font-black text-indigo-400 mt-1">{folders.length}</span>
              <span className="text-[10px] text-text-sub mt-0.5 font-medium">Categorized Storage</span>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FolderOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 2. QUICK SHORTCUTS BAR */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-[var(--surface)] to-[var(--surface)] border border-primary/20 p-5 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" /> AI Quick Creation Shortcuts
          </span>
          <h3 className="text-base font-black text-text-main tracking-tight mt-0.5">
            What career document do you need today?
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenGenerator}
            className="font-extrabold text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Document Hub
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateNew('cover_letter')}
            className="font-extrabold text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Blank Draft
          </Button>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-card border border-[var(--border)]">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents by title, tags, or content..."
            className="w-full bg-[var(--background)] text-xs text-text-main pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] outline-none focus:border-primary"
          />
        </div>

        {/* Folder Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <button
            onClick={() => onSelectFolder(null)}
            className={cn(
              'text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0',
              selectedFolderId === null
                ? 'border-primary bg-primary text-black'
                : 'border-[var(--border)] text-text-sub hover:bg-[var(--surface-secondary)]'
            )}
          >
            All Files ({allDocuments.length})
          </button>

          {folders.map(f => {
            const count = allDocuments.filter(d => d.folder_id === f.id).length;
            const isSelected = selectedFolderId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFolder(f.id)}
                className={cn(
                  'text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                  isSelected
                    ? 'border-primary bg-primary text-black'
                    : 'border-[var(--border)] text-text-sub hover:bg-[var(--surface-secondary)]'
                )}
              >
                <FolderOpen className="w-3 h-3" /> {f.name} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* 4. DOCUMENTS GRID */}
      {documents.length === 0 ? (
        <Card className="border-[var(--border)] bg-[var(--surface)] text-center p-12 flex flex-col items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-text-mute" />
          <h3 className="text-base font-black text-text-main">No Documents Found</h3>
          <p className="text-xs text-text-sub max-w-sm">
            You don't have any matching documents in this view. Use the AI Document Hub to formulate a tailored cover letter, statement of purpose, or resume draft.
          </p>
          <Button variant="primary" size="sm" onClick={onOpenGenerator} className="font-extrabold text-xs gap-1.5 mt-2">
            <Sparkles className="w-3.5 h-3.5" /> Launch AI Document Hub
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isSelected = activeDoc?.id === doc.id;
            const words = doc.content.trim() ? doc.content.trim().split(/\s+/).filter(Boolean).length : 0;
            const atsScore = doc.analytics?.atsScore || 88;

            return (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                onClick={() => onSelectDoc(doc)}
                className={cn(
                  'flex flex-col justify-between p-4 rounded-card border transition-all duration-200 cursor-pointer bg-[var(--surface)] group relative',
                  isSelected
                    ? 'border-primary shadow-xs ring-1 ring-primary'
                    : 'border-[var(--border)] hover:border-primary/40'
                )}
              >
                
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded tracking-wider">
                      {doc.doc_type.replace(/_/g, ' ')}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePin(doc); }}
                        className={cn('p-1 text-text-mute hover:text-amber-400 transition-colors', doc.is_pinned && 'text-amber-400')}
                        title="Pin Document"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc); }}
                        className={cn('p-1 text-text-mute hover:text-amber-400 transition-colors', doc.is_favorite && 'text-amber-400 fill-amber-400')}
                        title="Favorite Document"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-black text-text-main tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-text-mute line-clamp-3 leading-relaxed font-mono bg-[var(--background)]/50 p-2 rounded border border-[var(--border)]/40 mt-1">
                    {doc.content.replace(/[#*`_]/g, '') || 'Empty document draft...'}
                  </p>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border)]/60 text-[10px] text-text-mute">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ATS: {atsScore}%
                    </span>
                    <span>•</span>
                    <span>{words} words</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopyText(doc, e)}
                      className="p-1 text-text-mute hover:text-text-main transition-colors"
                      title="Copy Content"
                    >
                      {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteDoc(doc.id); }}
                      className="p-1 text-text-mute hover:text-rose-400 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
