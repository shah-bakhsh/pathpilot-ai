/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, RotateCcw, Plus, Clock, FileText, CheckCircle2, 
  AlertCircle, Eye, EyeOff, ShieldCheck, CornerDownLeft
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { ResumeVersionRecord } from '../../../types';

export const ResumeVersions: React.FC = () => {
  const { 
    activeResume, 
    versions, 
    createVersionSnapshot, 
    restoreVersionSnapshot 
  } = useResume();
  const { addNotification } = useCareer();

  const [versionNameInput, setVersionNameInput] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersionRecord | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateSnapshot = async () => {
    if (!activeResume) return;
    setIsCreating(true);
    const created = await createVersionSnapshot(versionNameInput.trim() || undefined);
    setIsCreating(false);

    if (created) {
      setVersionNameInput('');
      addNotification('Version Snapshot Saved', `Saved "${created.versionName}" in Supabase.`, 'success');
    }
  };

  const handleRestore = async (version: ResumeVersionRecord) => {
    if (!activeResume) return;
    if (window.confirm(`Are you sure you want to restore "${version.versionName}"? Current unsaved edits will be replaced.`)) {
      const ok = await restoreVersionSnapshot(version.id);
      if (ok) {
        addNotification('Version Restored', `Restored "${version.versionName}".`, 'success');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-fade-in">
      
      {/* Create & Version List Column (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        
        {/* Create Snapshot Box */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Create Version Snapshot
            </CardTitle>
            <CardDescription className="text-xs">
              Save a named point-in-time backup of "{activeResume?.title || 'Active Resume'}".
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-4 flex flex-col gap-3">
            <Input
              value={versionNameInput}
              onChange={e => setVersionNameInput(e.target.value)}
              placeholder="E.g. Post-Google Interview Draft, FinTech Tailored..."
              className="text-xs h-9"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateSnapshot}
              disabled={isCreating || !activeResume}
              className="text-xs font-bold h-9 flex items-center justify-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-black" /> Save Snapshot
            </Button>
          </CardContent>
        </Card>

        {/* Saved Versions History List */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Version History
            </CardTitle>
            <Badge variant="primary" className="text-[10px] font-black">
              {versions.length} Snapshots
            </Badge>
          </CardHeader>

          <CardContent className="p-0 pt-3">
            {versions.length === 0 ? (
              <p className="text-xs text-text-sub text-center py-6">
                No version snapshots created yet. Create a snapshot to back up your progress.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border)]/50">
                {versions.map(v => {
                  const isSelected = selectedVersion?.id === v.id;
                  return (
                    <div 
                      key={v.id} 
                      onClick={() => setSelectedVersion(v)}
                      className={`py-3 flex items-center justify-between cursor-pointer transition-colors px-2 rounded-md ${
                        isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-[var(--hover-tint)]'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-text-main flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-primary" /> {v.versionName}
                        </h4>
                        <span className="text-[10px] text-text-mute">
                          v{v.versionNumber} • {new Date(v.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleRestore(v); }}
                          className="h-7 px-2 text-[10.5px] font-bold text-amber-500 hover:bg-amber-500/10"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Snapshot Content Preview Column (7 cols) */}
      <div className="lg:col-span-7">
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5 min-h-[400px] flex flex-col justify-between">
          <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Snapshot Preview Pane
            </CardTitle>
            {selectedVersion && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleRestore(selectedVersion)}
                className="text-xs font-bold h-8 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-black" /> Restore This Version
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0 pt-4 flex-1">
            {!selectedVersion ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-xs text-text-sub">
                <FileText className="w-8 h-8 text-text-mute mb-2" />
                Select a version snapshot from the list on the left to preview its stored content.
              </div>
            ) : (
              <div className="bg-[var(--surface-secondary)]/50 p-4 rounded-lg border border-[var(--border)] font-mono text-xs text-text-main space-y-3 overflow-y-auto max-h-[500px]">
                <div>
                  <span className="text-primary font-bold">FULL NAME:</span> {selectedVersion.content.personalInfo?.fullName}
                </div>
                <div>
                  <span className="text-primary font-bold">HEADLINE:</span> {selectedVersion.content.personalInfo?.headline}
                </div>
                <div>
                  <span className="text-primary font-bold">SUMMARY:</span>
                  <p className="text-text-sub mt-1 leading-relaxed">{selectedVersion.content.summary}</p>
                </div>
                <div>
                  <span className="text-primary font-bold">EXPERIENCE ({selectedVersion.content.experience?.length || 0}):</span>
                  {selectedVersion.content.experience?.map((exp, i) => (
                    <div key={i} className="pl-3 border-l-2 border-primary/40 my-1">
                      <p className="font-bold">{exp.title} @ {exp.subtitle}</p>
                      <p className="text-[11px] text-text-mute">{exp.dateRange}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
