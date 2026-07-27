/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shared type definitions for the Career Execution Workspace Modules
 */

export interface WorkspaceTask {
  id: string;
  title: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'inbox' | 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate: string;
  labels: string[];
  estTime: number; // in hours
  isRecurring?: boolean;
  projectId?: string;
  createdAt: string;
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  isBookmarked: boolean;
  updatedAt: string;
}

export interface WorkspaceNoteFolder {
  id: string;
  name: string;
  icon?: string;
}

export interface WorkspaceBookmark {
  id: string;
  title: string;
  type: 'job' | 'resource' | 'course' | 'project' | 'note';
  url: string;
  dateAdded: string;
}

export interface AIPrepFeedback {
  score: number;
  critique: string;
  improvedAnswer: string;
}

export interface CareerGoal {
  todayFocus: string;
  currentGoal: string;
}
