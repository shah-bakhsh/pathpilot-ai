/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  History, Clock, RotateCcw, FileText, Check, ShieldCheck, Sparkles, Plus
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { DocumentService } from '../../../services/documentService';
import { AppDocument, DocumentVersion } from '../../../types/documentTypes';

interface DocumentHistoryViewProps {
  document: AppDocument | null;
  onRestoreVersion: (version: DocumentVersion) => void;
  onCreateSnapshot: (summary: string) => Promise<void>;
}

export const DocumentHistoryView: React.FC<DocumentHistoryViewProps> = ({
  document,
  onRestoreVersion,
  onCreateSnapshot
}) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!document) {
    return (
      <Card className="border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center gap-3">
        <History className="w-10 h-10 text-text-mute" />
        <h3 className="text-base font-black text-text-main">No Document Selected</h3>
        <p className="text-xs text-text-sub max-w-sm">
          Select a document from the workspace to view its complete version history timeline.
        </p>
      </Card>
    );
  }

  const versions = DocumentService.getLocalVersions(document.id);

  const handleCreateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setIsSaving(true);
    try {
      await onCreateSnapshot(note);
      setNote('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Version Control // Revision Audit
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            Version Timeline for "{document.title}"
          </h2>
          <p className="text-xs text-text-sub mt-1 max-w-2xl leading-relaxed">
            Every edit checkpoint and auto-save is recorded in version control. Compare or restore previous revisions at any time.
          </p>
        </div>

        <Badge variant="primary" className="text-xs font-black py-1 px-3 shrink-0">
          {versions.length} Checkpoints Saved
        </Badge>
      </div>

      {/* Manual Checkpoint Bar */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardContent className="p-4">
          <form onSubmit={handleCreateCheckpoint} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Revised experience bullet points for Google Cloud alignment..."
              className="flex-1 bg-[var(--background)] text-xs text-text-main px-3 py-2.5 rounded-lg border border-[var(--border)] outline-none focus:border-primary w-full"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving || !note.trim()}
              className="font-black text-xs gap-1.5 shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Save Manual Checkpoint
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Version History List */}
      {versions.length === 0 ? (
        <Card className="border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center gap-3">
          <History className="w-10 h-10 text-text-mute" />
          <h3 className="text-base font-black text-text-main">No Prior Versions Recorded</h3>
          <p className="text-xs text-text-sub max-w-sm">
            Save a manual checkpoint above or make edits in the Document Editor to build version history automatically.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {versions.map((ver) => (
            <Card key={ver.id} className="border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="text-[9px] px-2 py-0.5">
                    v{ver.version_number}.0
                  </Badge>
                  <span className="text-xs font-black text-text-main">{ver.title}</span>
                  <span className="text-[10px] text-text-mute flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(ver.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-text-sub mt-0.5 font-medium">
                  {ver.changes_summary}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRestoreVersion(ver)}
                className="text-xs font-black gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-primary" /> Restore Revision
              </Button>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
