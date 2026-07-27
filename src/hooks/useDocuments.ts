/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useCareer } from '../contexts/CareerContext';
import { DocumentService } from '../services/documentService';
import {
  AppDocument,
  DocumentFolder,
  SupportedDocType,
  WritingAssistantParams,
  GenerateDocParams,
  ExportFormat,
  DocumentVersion
} from '../types/documentTypes';

export function useDocuments() {
  const { user } = useAuth();
  const { addNotification } = useCareer();

  const userId = user?.id || 'local-user';

  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [activeDoc, setActiveDoc] = useState<AppDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAssistantActive, setIsAssistantActive] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<SupportedDocType | 'all'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Ref for debounced auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load documents and folders
  const refreshDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedDocs = await DocumentService.getDocuments(userId);
      const fetchedFolders = DocumentService.getLocalFolders();
      setDocuments(fetchedDocs);
      setFolders(fetchedFolders);

      if (fetchedDocs.length > 0 && !activeDoc) {
        setActiveDoc(fetchedDocs[0]);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, activeDoc]);

  useEffect(() => {
    refreshDocuments();
  }, []);

  // Filtered documents list
  const filteredDocuments = documents.filter((doc) => {
    if (doc.is_archived) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = doc.title.toLowerCase().includes(q);
      const matchesContent = doc.content.toLowerCase().includes(q);
      const matchesTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesContent && !matchesTags) return false;
    }

    if (selectedFolderId && doc.folder_id !== selectedFolderId) return false;
    if (selectedTypeFilter !== 'all' && doc.doc_type !== selectedTypeFilter) return false;
    if (selectedTagFilter && !doc.tags.includes(selectedTagFilter)) return false;

    return true;
  });

  // Select document
  const selectDocument = (doc: AppDocument) => {
    setActiveDoc(doc);
  };

  // Create document
  const createNewDocument = async (
    docType: SupportedDocType = 'cover_letter',
    title: string = 'Untitled Document',
    content: string = ''
  ) => {
    const newDoc = await DocumentService.createDocument(userId, {
      title,
      doc_type: docType,
      content,
      folder_id: selectedFolderId || undefined,
      user_id: userId
    });

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    addNotification('Document Created', `Initialized "${newDoc.title}"`, 'success');
    return newDoc;
  };

  // Auto-save update handler
  const updateActiveContent = (newTitle: string, newContent: string) => {
    if (!activeDoc) return;

    // Immediately update local active state for fluid typing
    const updated: AppDocument = {
      ...activeDoc,
      title: newTitle,
      content: newContent,
      updated_at: new Date().toISOString()
    };
    setActiveDoc(updated);
    setSavingStatus('saving');

    // Debounce save to storage & DB
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      const savedDoc = await DocumentService.updateDocument(
        userId,
        activeDoc.id,
        { title: newTitle, content: newContent },
        false
      );
      if (savedDoc) {
        setDocuments((prev) => prev.map((d) => (d.id === savedDoc.id ? savedDoc : d)));
      }
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);
    }, 1000);
  };

  // Create Manual Checkpoint / Version Snapshot
  const createVersionSnapshot = async (changesSummary: string = 'User Checkpoint') => {
    if (!activeDoc) return;
    const version = await DocumentService.saveVersion(activeDoc.id, activeDoc.title, activeDoc.content, changesSummary);
    addNotification('Version Snapshot Saved', `Recorded version v${version.version_number}`, 'success');
    refreshDocuments();
  };

  // Delete document
  const deleteDocument = async (id: string) => {
    await DocumentService.deleteDocument(userId, id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDoc?.id === id) {
      const remaining = documents.filter((d) => d.id !== id);
      setActiveDoc(remaining.length > 0 ? remaining[0] : null);
    }
    addNotification('Document Deleted', 'Moved document to trash.', 'info');
  };

  // Toggle Favorite
  const toggleFavorite = async (doc: AppDocument) => {
    const updated = await DocumentService.updateDocument(userId, doc.id, { is_favorite: !doc.is_favorite });
    if (updated) {
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      if (activeDoc?.id === updated.id) setActiveDoc(updated);
    }
  };

  // Toggle Pin
  const togglePin = async (doc: AppDocument) => {
    const updated = await DocumentService.updateDocument(userId, doc.id, { is_pinned: !doc.is_pinned });
    if (updated) {
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      if (activeDoc?.id === updated.id) setActiveDoc(updated);
    }
  };

  // Generate Document via AI
  const generateAIDocument = async (params: GenerateDocParams) => {
    setIsGenerating(true);
    try {
      const result = await DocumentService.generateDocument({
        ...params,
        userProfile: {
          name: user?.name,
          targetRole: (user as any)?.targetRole || (user as any)?.role || 'Software Professional',
          skills: (user as any)?.skills || [],
          experienceSummary: 'Experienced technical candidate'
        }
      });

      const newDoc = await DocumentService.createDocument(userId, {
        title: result.title,
        doc_type: result.docType,
        content: result.content,
        analytics: result.analytics,
        user_id: userId,
        folder_id: selectedFolderId || undefined,
        metadata: {
          targetCompany: params.targetCompany,
          targetUniversity: params.targetUniversity,
          targetRole: params.targetRole,
          writingStyle: params.writingStyle,
          tone: params.tone
        }
      });

      setDocuments((prev) => [newDoc, ...prev]);
      setActiveDoc(newDoc);
      addNotification('AI Document Generated', `Formulated "${newDoc.title}"`, 'success');
      return newDoc;
    } catch (err) {
      console.error(err);
      addNotification('Generation Error', 'Failed to generate document via AI.', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Writing Assistant
  const runAssistantAction = async (params: WritingAssistantParams) => {
    if (!activeDoc) return;
    setIsAssistantActive(true);
    try {
      const res = await DocumentService.assistantEdit(params);
      updateActiveContent(activeDoc.title, res.revisedContent);
      addNotification('AI Edit Applied', res.changesSummary, 'success');
    } catch (err) {
      console.error(err);
      addNotification('Assistant Error', 'Failed to apply writing edit.', 'warning');
    } finally {
      setIsAssistantActive(false);
    }
  };

  // Analyze Document
  const runDocumentAudit = async () => {
    if (!activeDoc) return;
    try {
      const analytics = await DocumentService.analyzeDocument(activeDoc.content, activeDoc.doc_type);
      const updated = await DocumentService.updateDocument(userId, activeDoc.id, { analytics });
      if (updated) {
        setActiveDoc(updated);
        setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        addNotification('Audit Completed', `ATS Score: ${analytics.atsScore}/100`, 'success');
      }
    } catch {
      addNotification('Audit Warning', 'Could not run AI document analysis.', 'warning');
    }
  };

  // Export Document
  const exportDocument = (format: ExportFormat) => {
    if (!activeDoc) return;
    DocumentService.exportDocument(activeDoc, format);
    addNotification('Export Initiated', `Downloading ${activeDoc.title} as ${format.toUpperCase()}`, 'success');
  };

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    folders,
    activeDoc,
    loading,
    savingStatus,
    isGenerating,
    isAssistantActive,
    searchQuery,
    selectedFolderId,
    selectedTypeFilter,
    selectedTagFilter,
    setSearchQuery,
    setSelectedFolderId,
    setSelectedTypeFilter,
    setSelectedTagFilter,
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
    exportDocument,
    refreshDocuments
  };
}
