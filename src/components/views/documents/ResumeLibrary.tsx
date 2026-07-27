/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Sparkles, Download, Copy, Trash2, Edit3, Plus, ShieldCheck,
  Check, Star, RefreshCw, Layers, Award, ArrowUpRight
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/utils';
import { AppDocument } from '../../../types/documentTypes';

interface ResumeLibraryProps {
  documents: AppDocument[];
  onCreateResume: (title: string) => Promise<void>;
  onSelectDoc: (doc: AppDocument) => void;
  onDeleteDoc: (id: string) => void;
  onExport: (doc: AppDocument) => void;
}

export const ResumeLibrary: React.FC<ResumeLibraryProps> = ({
  documents,
  onCreateResume,
  onSelectDoc,
  onDeleteDoc,
  onExport
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const resumeDocs = documents.filter(d => d.doc_type === 'resume' || d.doc_type === 'cv');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      await onCreateResume(newTitle);
      setNewTitle('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header callout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Career Assets // Resume Vault
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            Targeted Resume & CV Library
          </h2>
          <p className="text-xs text-text-sub mt-1 max-w-2xl leading-relaxed">
            Manage multiple tailored resume variations optimized for specific job families (e.g. Senior Full Stack Engineer, Cloud Architect, AI Specialist).
          </p>
        </div>

        <Badge variant="primary" className="text-xs font-black py-1 px-3 shrink-0">
          {resumeDocs.length} Resumes Stored
        </Badge>
      </div>

      {/* New Resume Creation Bar */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardContent className="p-4">
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer Resume (Google Variation)"
              className="flex-1 bg-[var(--background)] text-xs text-text-main px-3 py-2.5 rounded-lg border border-[var(--border)] outline-none focus:border-primary w-full"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isCreating || !newTitle.trim()}
              className="font-black text-xs gap-1.5 shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Create Targeted Resume Variant
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resume Cards Grid */}
      {resumeDocs.length === 0 ? (
        <Card className="border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-text-mute" />
          <h3 className="text-base font-black text-text-main">No Resume Variations Found</h3>
          <p className="text-xs text-text-sub max-w-sm">
            Create your first tailored resume variant above or use the AI Generator to formulate a high-impact technical resume.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumeDocs.map((doc) => {
            const words = doc.content.trim() ? doc.content.trim().split(/\s+/).filter(Boolean).length : 0;
            const atsScore = doc.analytics?.atsScore || 90;

            return (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                onClick={() => onSelectDoc(doc)}
                className="flex flex-col justify-between p-5 rounded-card border border-[var(--border)] hover:border-primary/50 bg-[var(--surface)] transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-extrabold text-primary">
                      {doc.doc_type.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> ATS: {atsScore}%
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-text-main tracking-tight line-clamp-1 group-hover:text-primary transition-colors mt-1">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-text-mute font-mono line-clamp-3 bg-[var(--background)] p-2.5 rounded border border-[var(--border)]/40 mt-1">
                    {doc.content.replace(/[#*`_]/g, '') || 'Empty resume template...'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]/60 text-xs">
                  <span className="text-[10px] text-text-mute font-medium">{words} words</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); onExport(doc); }}
                      className="text-[10px] py-1 px-2.5 font-bold gap-1"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectDoc(doc)}
                      className="text-[10px] py-1 px-2.5 font-black gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </Button>
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
