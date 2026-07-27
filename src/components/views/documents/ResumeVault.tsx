/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Plus, Sparkles, Star, Clock, Download, Trash2, 
  Copy, Edit3, Shield, CheckCircle2, History, Search, Filter, 
  Layers, ChevronRight, ExternalLink, RefreshCw
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { cn } from '../../../lib/utils';

interface ResumeVaultProps {
  onEditResume: (id: string) => void;
  onCreateNew: () => void;
  onOpenAts: () => void;
}

export const ResumeVault: React.FC<ResumeVaultProps> = ({
  onEditResume,
  onCreateNew,
  onOpenAts
}) => {
  const { 
    resumes, 
    activeResume, 
    selectResume, 
    deleteResume, 
    duplicateResume,
    setPrimaryResume,
    latestAnalysis,
    historyLogs,
    loading 
  } = useResume();

  const { addNotification } = useCareer();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSort, setFilterSort] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Filtered resumes
  const filteredResumes = resumes
    .filter(r => 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetRole.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filterSort === 'newest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (filterSort === 'oldest') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return a.title.localeCompare(b.title);
    });

  const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const ok = await deleteResume(id);
      if (ok) {
        addNotification('Resume Deleted', `Successfully removed "${title}".`, 'info');
      }
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const dup = await duplicateResume(id);
    if (dup) {
      addNotification('Resume Duplicated', `Created "${dup.title}".`, 'success');
    }
  };

  const handleMakePrimary = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    const ok = await setPrimaryResume(id);
    if (ok) {
      addNotification('Primary Resume Updated', `"${title}" is now your default primary resume.`, 'success');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Top Banner & Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total Resumes */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Total Resumes</span>
            <div className="text-2xl font-black text-text-main mt-0.5">{resumes.length}</div>
            <span className="text-[10px] text-text-sub font-medium">Persisted in Supabase</span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <FileText className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 2: ATS Health Score */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Latest ATS Score</span>
            <div className="text-2xl font-black text-primary mt-0.5">
              {latestAnalysis?.readinessScore || 78}%
            </div>
            <span className="text-[10px] text-text-sub font-medium">
              {latestAnalysis ? 'Verified by Gemini AI' : 'Default Benchmark'}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Sparkles className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 3: Primary Resume */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Active Primary</span>
            <div className="text-sm font-bold text-text-main truncate max-w-[150px] mt-1">
              {activeResume?.title || 'No Resume Selected'}
            </div>
            <span className="text-[10px] text-text-sub font-medium">
              {activeResume?.targetRole || 'Software Engineer'}
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Star className="w-6 h-6 fill-amber-500/30" />
          </div>
        </Card>

        {/* Card 4: Quick Action */}
        <Card className="bg-gradient-to-br from-primary/15 via-[var(--surface)] to-[var(--surface)] border-[var(--border)] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Resume Operating System</span>
            <h4 className="text-xs font-black text-text-main mt-0.5">Build New Version</h4>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateNew}
            className="text-xs font-bold h-8 mt-2 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create Resume
          </Button>
        </Card>

      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-card">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search resumes by title or role..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-text-mute" />
          <span className="text-xs text-text-mute font-bold">Sort:</span>
          <select
            value={filterSort}
            onChange={e => setFilterSort(e.target.value as any)}
            className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-btn px-3 py-1.5 text-xs font-bold text-text-main focus:outline-none"
          >
            <option value="newest">Recently Updated</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAts}
            className="text-xs font-bold h-8 ml-2 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Run ATS Audit
          </Button>
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-[var(--surface-secondary)]/50 rounded-card animate-pulse border border-[var(--border)]" />
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center bg-[var(--surface)] border-[var(--border)]">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-text-main">No Resumes Found</h3>
          <p className="text-xs text-text-sub max-w-sm my-2">
            {searchTerm ? 'No resumes match your current search criteria.' : 'Create your first persistent resume using the AI Resume Builder.'}
          </p>
          <Button variant="primary" size="sm" onClick={onCreateNew} className="text-xs font-bold mt-2">
            <Plus className="w-4 h-4 mr-1.5" /> Build First Resume
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map(resume => {
            const isSelected = activeResume?.id === resume.id;

            return (
              <motion.div
                key={resume.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => selectResume(resume.id)}
                className={cn(
                  'group relative bg-[var(--surface)] border rounded-card p-5 flex flex-col justify-between cursor-pointer transition-all shadow-xs',
                  isSelected 
                    ? 'border-primary ring-1 ring-primary/30 bg-primary/5' 
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                )}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'p-2 rounded-lg text-primary',
                        isSelected ? 'bg-primary text-black' : 'bg-primary/10'
                      )}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-text-main line-clamp-1 group-hover:text-primary transition-colors">
                          {resume.title}
                        </h3>
                        <span className="text-[10.5px] font-semibold text-text-sub">
                          {resume.targetRole || 'Software Engineer'}
                        </span>
                      </div>
                    </div>

                    {resume.isPrimary && (
                      <Badge variant="primary" className="text-[9px] font-black py-0.5 px-2 uppercase">
                        Primary
                      </Badge>
                    )}
                  </div>

                  {/* Summary Preview */}
                  <p className="text-xs text-text-sub line-clamp-3 font-normal leading-relaxed my-3 bg-[var(--surface-secondary)]/50 p-2.5 rounded-md border border-[var(--border)]/40">
                    {resume.content?.summary || 'No summary statement added yet.'}
                  </p>

                  {/* Badges / Highlights */}
                  <div className="flex flex-wrap items-center gap-1.5 my-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border)] font-semibold text-text-mute uppercase">
                      {resume.templateId || 'modern'} template
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border)] font-semibold text-text-mute">
                      {resume.content?.experience?.length || 0} Experience
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border)] font-semibold text-text-mute">
                      {resume.content?.projects?.length || 0} Projects
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-[10.5px] text-text-mute font-medium mt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-text-mute" />
                    <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    {!resume.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => handleMakePrimary(e, resume.id, resume.title)}
                        className="h-7 px-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500/10"
                        title="Set as Primary Resume"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => handleDuplicate(e, resume.id)}
                      className="h-7 px-1.5 text-xs font-bold text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditResume(resume.id)}
                      className="h-7 px-2 text-xs font-bold text-primary hover:bg-primary/10"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => handleDelete(e, resume.id, resume.title)}
                      className="h-7 px-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Activity Log Section */}
      {historyLogs.length > 0 && (
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Recent Resume Activity
            </CardTitle>
            <span className="text-[10px] text-text-sub">Persisted in Supabase Audit Trail</span>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="divide-y divide-[var(--border)]/40">
              {historyLogs.slice(0, 5).map(log => (
                <div key={log.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="font-bold text-text-main">{log.description}</span>
                  </div>
                  <span className="text-[10px] text-text-mute font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};
