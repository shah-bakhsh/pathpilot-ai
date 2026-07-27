/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ResumeService } from '../services/resumeService';
import { 
  ResumeRecord, 
  ResumeVersionRecord, 
  ResumeFileRecord, 
  ResumeHistoryRecord, 
  ResumeAnalysis,
  ResumeContent
} from '../types';
import { supabase } from '../services/supabase';

export function useResume() {
  const { user } = useAuth();

  // Core States
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeRecord | null>(null);
  const [versions, setVersions] = useState<ResumeVersionRecord[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<ResumeFileRecord[]>([]);
  const [historyLogs, setHistoryLogs] = useState<ResumeHistoryRecord[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ResumeAnalysis[]>([]);

  // UI & Sync Statuses
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Debounce Auto-save Timer Ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Data Load
  const fetchAllResumeData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch user resumes
      let userResumes = await ResumeService.getUserResumes(user.id);
      
      // If no resume exists for user, create initial default primary resume
      if (userResumes.length === 0) {
        const defaultContent = ResumeService.getDefaultResumeContent(
          user.name || user.email?.split('@')[0],
          user.email
        );
        const created = await ResumeService.createResume(user.id, {
          title: `${user.name || 'My'} Professional Resume`,
          targetRole: user.currentTargetGoal || 'Software Engineer',
          templateId: 'modern',
          isPrimary: true,
          content: defaultContent
        });

        if (created) {
          userResumes = [created];
        }
      }

      setResumes(userResumes);

      // Select active resume (primary or first)
      const currentActive = userResumes.find(r => r.isPrimary) || userResumes[0] || null;
      setActiveResume(currentActive);

      // 2. Fetch versions for active resume
      if (currentActive) {
        const vers = await ResumeService.getVersions(currentActive.id, user.id);
        setVersions(vers);
      }

      // 3. Fetch uploaded files
      const files = await ResumeService.getResumeFiles(user.id);
      setUploadedFiles(files);

      // 4. Fetch latest and all ATS analysis reports
      const latestAna = await ResumeService.getLatestAnalysis(user.id);
      setLatestAnalysis(latestAna);

      const allAna = await ResumeService.getAllAnalyses(user.id);
      setAnalysisHistory(allAna);

      // 5. Fetch history logs
      const logs = await ResumeService.getHistory(user.id, currentActive?.id);
      setHistoryLogs(logs);

    } catch (err) {
      console.error('Error fetching resume data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.name, user?.email, user?.currentTargetGoal]);

  // Load on mount or user change
  useEffect(() => {
    fetchAllResumeData();
  }, [fetchAllResumeData]);

  // Real-time Supabase Subscriptions for live updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`resume_updates_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resumes', filter: `user_id=eq.${user.id}` },
        () => fetchAllResumeData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resume_analysis', filter: `user_id=eq.${user.id}` },
        async () => {
          const latest = await ResumeService.getLatestAnalysis(user.id);
          setLatestAnalysis(latest);
          const all = await ResumeService.getAllAnalyses(user.id);
          setAnalysisHistory(all);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resume_files', filter: `user_id=eq.${user.id}` },
        async () => {
          const files = await ResumeService.getResumeFiles(user.id);
          setUploadedFiles(files);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAllResumeData]);

  // Select Active Resume
  const selectResume = useCallback(async (resumeId: string) => {
    if (!user?.id) return;
    const found = resumes.find(r => r.id === resumeId);
    if (found) {
      setActiveResume(found);
      const vers = await ResumeService.getVersions(found.id, user.id);
      setVersions(vers);
      const logs = await ResumeService.getHistory(user.id, found.id);
      setHistoryLogs(logs);
    }
  }, [resumes, user?.id]);

  // Create New Resume
  const createResume = async (title: string, targetRole: string, templateId = 'modern') => {
    if (!user?.id) return null;
    const defaultContent = ResumeService.getDefaultResumeContent(
      user.name || user.email?.split('@')[0],
      user.email
    );
    defaultContent.personalInfo.headline = targetRole;

    const newResume = await ResumeService.createResume(user.id, {
      title: title || 'Untitled Resume',
      targetRole: targetRole || 'Software Engineer',
      templateId: templateId as any,
      isPrimary: resumes.length === 0,
      content: defaultContent
    });

    if (newResume) {
      setResumes(prev => [newResume, ...prev]);
      setActiveResume(newResume);
      setVersions(await ResumeService.getVersions(newResume.id, user.id));
    }
    return newResume;
  };

  // Immediate Save Active Resume Content
  const saveActiveResume = async (updatedContent: ResumeContent, newTitle?: string, newRole?: string) => {
    if (!user?.id || !activeResume) return false;

    setSaveStatus('saving');
    const updatePayload: Partial<ResumeRecord> = {
      content: updatedContent,
      title: newTitle !== undefined ? newTitle : activeResume.title,
      targetRole: newRole !== undefined ? newRole : activeResume.targetRole,
    };

    const success = await ResumeService.updateResume(activeResume.id, user.id, updatePayload);

    if (success) {
      setSaveStatus('saved');
      setActiveResume(prev => prev ? {
        ...prev,
        content: updatedContent,
        title: updatePayload.title || prev.title,
        targetRole: updatePayload.targetRole || prev.targetRole,
        updatedAt: new Date().toISOString()
      } : null);

      setResumes(prev => prev.map(r => r.id === activeResume.id ? {
        ...r,
        content: updatedContent,
        title: updatePayload.title || r.title,
        targetRole: updatePayload.targetRole || r.targetRole,
        updatedAt: new Date().toISOString()
      } : r));

      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
    }

    return success;
  };

  // Debounced Auto-Save
  const updateContentAutoSave = (updatedContent: ResumeContent) => {
    // Immediate optimistic update
    setActiveResume(prev => prev ? { ...prev, content: updatedContent } : null);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      saveActiveResume(updatedContent);
    }, 2000);
  };

  // Duplicate Resume
  const duplicateResume = async (resumeId: string) => {
    if (!user?.id) return null;
    const dup = await ResumeService.duplicateResume(resumeId, user.id);
    if (dup) {
      setResumes(prev => [dup, ...prev]);
    }
    return dup;
  };

  // Set Primary Resume
  const setPrimaryResume = async (resumeId: string) => {
    if (!user?.id) return false;
    const ok = await ResumeService.setPrimaryResume(resumeId, user.id);
    if (ok) {
      setResumes(prev => prev.map(r => ({
        ...r,
        isPrimary: r.id === resumeId
      })));
      if (activeResume?.id === resumeId) {
        setActiveResume(prev => prev ? { ...prev, isPrimary: true } : null);
      }
    }
    return ok;
  };

  // Delete Resume
  const deleteResume = async (resumeId: string) => {
    if (!user?.id) return false;
    const ok = await ResumeService.deleteResume(resumeId, user.id);
    if (ok) {
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      if (activeResume?.id === resumeId) {
        const remaining = resumes.filter(r => r.id !== resumeId);
        setActiveResume(remaining[0] || null);
      }
    }
    return ok;
  };

  // Change Active Template
  const changeTemplate = async (templateId: ResumeRecord['templateId']) => {
    if (!activeResume || !user?.id) return;
    const ok = await ResumeService.updateResume(activeResume.id, user.id, { templateId });
    if (ok) {
      setActiveResume(prev => prev ? { ...prev, templateId } : null);
      setResumes(prev => prev.map(r => r.id === activeResume.id ? { ...r, templateId } : r));
    }
  };

  // Create Version Snapshot
  const createVersionSnapshot = async (versionName?: string) => {
    if (!user?.id || !activeResume) return null;
    const v = await ResumeService.createVersion(activeResume.id, user.id, versionName, activeResume.content);
    if (v) {
      setVersions(prev => [v, ...prev]);
    }
    return v;
  };

  // Restore Version Snapshot
  const restoreVersionSnapshot = async (versionId: string) => {
    if (!user?.id || !activeResume) return false;
    const ok = await ResumeService.restoreVersion(activeResume.id, versionId, user.id);
    if (ok) {
      // Refresh active resume content
      const refreshed = await ResumeService.getResumeById(activeResume.id, user.id);
      if (refreshed) {
        setActiveResume(refreshed);
      }
    }
    return ok;
  };

  // Upload File to Supabase Storage
  const uploadFile = async (file: File) => {
    if (!user?.id) return null;
    setIsUploading(true);
    try {
      const record = await ResumeService.uploadResumeFile(user.id, file, activeResume?.id);
      if (record) {
        setUploadedFiles(prev => [record, ...prev]);
      }
      return record;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete File
  const deleteFile = async (fileId: string, filePath: string) => {
    if (!user?.id) return false;
    const ok = await ResumeService.deleteResumeFile(fileId, filePath, user.id);
    if (ok) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    }
    return ok;
  };

  // Run Gemini ATS Analysis
  const runAtsAnalysis = async (resumeText: string, jobDescription?: string, targetRole?: string) => {
    if (!user?.id) return null;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole: targetRole || activeResume?.targetRole || user.currentTargetGoal
        })
      });

      const data = await response.json();
      if (data && typeof data.readinessScore === 'number') {
        const analysisData: ResumeAnalysis = {
          resumeHash: data.resumeHash || `hash_${Date.now()}`,
          uploadedAt: new Date().toISOString(),
          readinessScore: data.readinessScore,
          skillRadarScores: data.skillRadarScores,
          structuralImprovements: data.structuralImprovements,
          keywordsMissing: data.keywordsMissing,
          keywordsFound: data.keywordsFound
        };

        // Save permanently in Supabase
        await ResumeService.saveAnalysis(user.id, analysisData, activeResume?.id);

        setLatestAnalysis(analysisData);
        setAnalysisHistory(prev => [analysisData, ...prev]);
        return analysisData;
      }
      return null;
    } catch (err) {
      console.error('Error running ATS analysis:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    resumes,
    activeResume,
    versions,
    uploadedFiles,
    latestAnalysis,
    analysisHistory,
    historyLogs,
    loading,
    saveStatus,
    isUploading,
    isAnalyzing,
    selectResume,
    createResume,
    saveActiveResume,
    updateContentAutoSave,
    deleteResume,
    duplicateResume,
    setPrimaryResume,
    changeTemplate,
    createVersionSnapshot,
    restoreVersionSnapshot,
    uploadFile,
    deleteFile,
    runAtsAnalysis,
    refetch: fetchAllResumeData
  };
}
