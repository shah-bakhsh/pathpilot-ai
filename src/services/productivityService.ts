/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import {
  ProductivityTask,
  TaskComment,
  ProductivityNote,
  NoteFolder,
  AdvancedCalendarEvent,
  CalendarReminder,
  CalendarMeeting,
  ActivityFeedItem,
  DailyPlan,
  WeeklyPlan,
  MonthlyPlan,
  WorkspaceSettings,
  TeamCollaborator,
  ProductivityMetrics,
  NotificationPreference,
  EnhancedNotification
} from '../types';

export class ProductivityService {
  // ==========================================
  // TASKS SYSTEM
  // ==========================================

  static async getTasks(userId: string): Promise<ProductivityTask[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return this.getLocalTasks(userId);

      return data.map((t) => ({
        id: t.id,
        userId: t.user_id,
        title: t.title,
        description: t.description || '',
        status: t.status || 'todo',
        priority: t.priority || 'medium',
        category: t.category || 'career',
        dueDate: t.due_date,
        estimatedTimeMinutes: t.estimated_time_minutes || 30,
        actualTimeMinutes: t.actual_time_minutes || 0,
        recurring: t.recurring || 'none',
        tags: t.tags || [],
        subtasks: t.subtasks || [],
        dependencies: t.dependencies || [],
        attachments: t.attachments || [],
        commentsCount: t.comments_count || 0,
        xpValue: t.xp_value || 15,
        completedAt: t.completed_at,
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }));
    } catch {
      return this.getLocalTasks(userId);
    }
  }

  static async createTask(userId: string, task: Partial<ProductivityTask>): Promise<ProductivityTask> {
    const newTask: ProductivityTask = {
      id: 'tsk_' + Math.random().toString(36).substring(2, 9),
      userId,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      category: task.category || 'career',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      estimatedTimeMinutes: task.estimatedTimeMinutes || 30,
      actualTimeMinutes: 0,
      recurring: task.recurring || 'none',
      tags: task.tags || ['Career'],
      subtasks: task.subtasks || [],
      dependencies: task.dependencies || [],
      attachments: task.attachments || [],
      commentsCount: 0,
      xpValue: task.xpValue || 20,
      createdAt: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          id: newTask.id,
          user_id: userId,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          category: newTask.category,
          due_date: newTask.dueDate,
          estimated_time_minutes: newTask.estimatedTimeMinutes,
          actual_time_minutes: newTask.actualTimeMinutes,
          recurring: newTask.recurring,
          tags: newTask.tags,
          subtasks: newTask.subtasks,
          dependencies: newTask.dependencies,
          attachments: newTask.attachments,
          xp_value: newTask.xpValue,
          created_at: newTask.createdAt
        })
        .select()
        .single();

      if (error || !data) {
        this.saveLocalTask(userId, newTask);
        return newTask;
      }
      return newTask;
    } catch {
      this.saveLocalTask(userId, newTask);
      return newTask;
    }
  }

  static async updateTask(userId: string, id: string, updates: Partial<ProductivityTask>): Promise<boolean> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) {
        updateData.status = updates.status;
        if (updates.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.estimatedTimeMinutes !== undefined) updateData.estimated_time_minutes = updates.estimatedTimeMinutes;
      if (updates.actualTimeMinutes !== undefined) updateData.actual_time_minutes = updates.actualTimeMinutes;
      if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks;
      if (updates.tags !== undefined) updateData.tags = updates.tags;

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId);

      this.updateLocalTask(userId, id, updates);
      return !error;
    } catch {
      this.updateLocalTask(userId, id, updates);
      return true;
    }
  }

  static async deleteTask(userId: string, id: string): Promise<boolean> {
    try {
      await supabase.from('tasks').delete().eq('id', id).eq('user_id', userId);
      this.deleteLocalTask(userId, id);
      return true;
    } catch {
      this.deleteLocalTask(userId, id);
      return true;
    }
  }

  // Local storage helpers for Tasks
  private static getLocalTasks(userId: string): ProductivityTask[] {
    const raw = localStorage.getItem(`tasks_${userId}`);
    if (!raw) return this.getDefaultTasks(userId);
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultTasks(userId);
    }
  }

  private static saveLocalTask(userId: string, task: ProductivityTask) {
    const existing = this.getLocalTasks(userId);
    const updated = [task, ...existing];
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated));
  }

  private static updateLocalTask(userId: string, id: string, updates: Partial<ProductivityTask>) {
    const existing = this.getLocalTasks(userId);
    const updated = existing.map((t) => (t.id === id ? { ...t, ...updates } : t));
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated));
  }

  private static deleteLocalTask(userId: string, id: string) {
    const existing = this.getLocalTasks(userId);
    const updated = existing.filter((t) => t.id !== id);
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated));
  }

  private static getDefaultTasks(userId: string): ProductivityTask[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'tsk_1',
        userId,
        title: 'Review System Design Microservices Architecture',
        description: 'Study high-concurrency rate limiters and database partitioning strategies.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'interview',
        dueDate: today,
        estimatedTimeMinutes: 45,
        actualTimeMinutes: 20,
        recurring: 'daily',
        tags: ['Interview', 'System Design'],
        subtasks: [
          { id: 'st_1', title: 'Read Token Bucket algorithm implementation', completed: true },
          { id: 'st_2', title: 'Draft diagram for distributed locking', completed: false }
        ],
        xpValue: 30,
        createdAt: new Date().toISOString()
      },
      {
        id: 'tsk_2',
        userId,
        title: 'Submit Tailored Resume to Senior Full-Stack Lead Role',
        description: 'Optimize ATS keywords for React 18, Vite, Supabase, and Gemini API.',
        status: 'todo',
        priority: 'high',
        category: 'applications',
        dueDate: today,
        estimatedTimeMinutes: 30,
        actualTimeMinutes: 0,
        recurring: 'none',
        tags: ['Applications', 'ATS Resume'],
        subtasks: [
          { id: 'st_3', title: 'Run ATS Match Score check', completed: false },
          { id: 'st_4', title: 'Export PDF to Documents Vault', completed: false }
        ],
        xpValue: 25,
        createdAt: new Date().toISOString()
      },
      {
        id: 'tsk_3',
        userId,
        title: 'Complete Cloud Architecture Certification Module 4',
        description: 'Hands-on practice on Google Cloud Run container deployments.',
        status: 'completed',
        priority: 'medium',
        category: 'learning',
        dueDate: today,
        estimatedTimeMinutes: 60,
        actualTimeMinutes: 55,
        recurring: 'weekly',
        tags: ['Learning', 'Google Cloud'],
        subtasks: [],
        xpValue: 40,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
  }

  // ==========================================
  // NOTES WORKSPACE SYSTEM
  // ==========================================

  static async getNotes(userId: string): Promise<ProductivityNote[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return this.getLocalNotes(userId);

      return data.map((n) => ({
        id: n.id,
        userId: n.user_id,
        folderId: n.folder_id,
        title: n.title,
        content: n.content,
        type: n.type || 'rich',
        tags: n.tags || [],
        isPinned: n.is_pinned || false,
        isFavorite: n.is_favorite || false,
        isShared: n.is_shared || false,
        createdAt: n.created_at,
        updatedAt: n.updated_at
      }));
    } catch {
      return this.getLocalNotes(userId);
    }
  }

  static async createNote(userId: string, note: Partial<ProductivityNote>): Promise<ProductivityNote> {
    const newNote: ProductivityNote = {
      id: 'nte_' + Math.random().toString(36).substring(2, 9),
      userId,
      folderId: note.folderId,
      title: note.title || 'Untitled Workspace Note',
      content: note.content || '',
      type: note.type || 'rich',
      tags: note.tags || ['Career'],
      isPinned: note.isPinned || false,
      isFavorite: note.isFavorite || false,
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await supabase.from('notes').insert({
        id: newNote.id,
        user_id: userId,
        folder_id: newNote.folderId,
        title: newNote.title,
        content: newNote.content,
        type: newNote.type,
        tags: newNote.tags,
        is_pinned: newNote.isPinned,
        is_favorite: newNote.isFavorite,
        created_at: newNote.createdAt,
        updated_at: newNote.updatedAt
      });
      this.saveLocalNote(userId, newNote);
      return newNote;
    } catch {
      this.saveLocalNote(userId, newNote);
      return newNote;
    }
  }

  static async updateNote(userId: string, id: string, updates: Partial<ProductivityNote>): Promise<boolean> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.folderId !== undefined) updateData.folder_id = updates.folderId;
      if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned;
      if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
      if (updates.tags !== undefined) updateData.tags = updates.tags;

      await supabase.from('notes').update(updateData).eq('id', id).eq('user_id', userId);
      this.updateLocalNote(userId, id, updates);
      return true;
    } catch {
      this.updateLocalNote(userId, id, updates);
      return true;
    }
  }

  static async deleteNote(userId: string, id: string): Promise<boolean> {
    try {
      await supabase.from('notes').delete().eq('id', id).eq('user_id', userId);
      this.deleteLocalNote(userId, id);
      return true;
    } catch {
      this.deleteLocalNote(userId, id);
      return true;
    }
  }

  private static getLocalNotes(userId: string): ProductivityNote[] {
    const raw = localStorage.getItem(`notes_${userId}`);
    if (!raw) return this.getDefaultNotes(userId);
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultNotes(userId);
    }
  }

  private static saveLocalNote(userId: string, note: ProductivityNote) {
    const existing = this.getLocalNotes(userId);
    localStorage.setItem(`notes_${userId}`, JSON.stringify([note, ...existing]));
  }

  private static updateLocalNote(userId: string, id: string, updates: Partial<ProductivityNote>) {
    const existing = this.getLocalNotes(userId);
    const updated = existing.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updated));
  }

  private static deleteLocalNote(userId: string, id: string) {
    const existing = this.getLocalNotes(userId);
    localStorage.setItem(`notes_${userId}`, JSON.stringify(existing.filter((n) => n.id !== id)));
  }

  private static getDefaultNotes(userId: string): ProductivityNote[] {
    return [
      {
        id: 'nte_1',
        userId,
        title: 'System Design Interview Cheatsheet: Distributed Caching',
        content: `### Redis & Memcached Architectural Patterns
1. **Cache-Aside Pattern**: Read from cache first. If miss, load from PostgreSQL/Supabase and write back to cache with TTL.
2. **Write-Through**: Write to cache and database synchronously to guarantee consistency.
3. **Eviction Policies**: LRU (Least Recently Used) is optimal for standard user session tokens and hot data keys.`,
        type: 'interview',
        tags: ['Interview', 'System Design', 'Redis'],
        isPinned: true,
        isFavorite: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'nte_2',
        userId,
        title: 'STAR Method Response Strategy: Resolving Production Incidents',
        content: `**Situation**: Microservice CPU utilization spiked to 98% during peak traffic due to an unindexed database query.
**Task**: Restore service health under 5 minutes without dropping active user websocket sessions.
**Action**: Deployed hotfix index on Supabase database, scaled Cloud Run instances temporarily, and implemented rate limiting.
**Result**: Latency dropped from 2400ms to 38ms with zero data loss.`,
        type: 'career',
        tags: ['Behavioral', 'STAR Method'],
        isPinned: false,
        isFavorite: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  // ==========================================
  // ADVANCED CALENDAR & EVENTS
  // ==========================================

  static async getAdvancedEvents(userId: string): Promise<AdvancedCalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('event_date', { ascending: true });

      if (error || !data) return this.getLocalEvents(userId);

      return data.map((e) => ({
        id: e.id,
        userId: e.user_id,
        title: e.title,
        description: e.description || '',
        type: e.type || 'deadline',
        eventDate: e.event_date,
        startTime: e.start_time || '09:00',
        endTime: e.end_time || '10:00',
        timezone: e.timezone || 'UTC',
        location: e.location || 'Remote',
        meetingLink: e.meeting_link || '',
        completed: e.completed || false,
        priority: e.priority || 'medium',
        color: e.color || '#3b82f6',
        recurring: e.recurring || 'none',
        attendees: e.attendees || [],
        createdAt: e.created_at
      }));
    } catch {
      return this.getLocalEvents(userId);
    }
  }

  static async createAdvancedEvent(userId: string, event: Partial<AdvancedCalendarEvent>): Promise<AdvancedCalendarEvent> {
    const newEvt: AdvancedCalendarEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      userId,
      title: event.title || 'New Scheduled Event',
      description: event.description || '',
      type: event.type || 'deadline',
      eventDate: event.eventDate || new Date().toISOString().split('T')[0],
      startTime: event.startTime || '10:00',
      endTime: event.endTime || '11:00',
      timezone: event.timezone || 'UTC',
      location: event.location || 'Virtual Workspace',
      meetingLink: event.meetingLink || '',
      completed: false,
      priority: event.priority || 'medium',
      color: event.color || '#6366f1',
      recurring: event.recurring || 'none',
      attendees: event.attendees || [],
      createdAt: new Date().toISOString()
    };

    try {
      await supabase.from('calendar_events').insert({
        id: newEvt.id,
        user_id: userId,
        title: newEvt.title,
        description: newEvt.description,
        type: newEvt.type,
        event_date: newEvt.eventDate,
        start_time: newEvt.startTime,
        end_time: newEvt.endTime,
        timezone: newEvt.timezone,
        location: newEvt.location,
        meeting_link: newEvt.meetingLink,
        completed: newEvt.completed,
        priority: newEvt.priority,
        color: newEvt.color,
        created_at: newEvt.createdAt
      });
      this.saveLocalEvent(userId, newEvt);
      return newEvt;
    } catch {
      this.saveLocalEvent(userId, newEvt);
      return newEvt;
    }
  }

  private static getLocalEvents(userId: string): AdvancedCalendarEvent[] {
    const raw = localStorage.getItem(`cal_events_${userId}`);
    if (!raw) return this.getDefaultEvents(userId);
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultEvents(userId);
    }
  }

  private static saveLocalEvent(userId: string, evt: AdvancedCalendarEvent) {
    const existing = this.getLocalEvents(userId);
    localStorage.setItem(`cal_events_${userId}`, JSON.stringify([evt, ...existing]));
  }

  private static getDefaultEvents(userId: string): AdvancedCalendarEvent[] {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return [
      {
        id: 'evt_1',
        userId,
        title: 'Stripe Technical Live Coding Drill',
        description: 'System Architecture & Data Modeling Interview with Senior Director.',
        type: 'interview',
        eventDate: today,
        startTime: '14:00',
        endTime: '15:00',
        timezone: 'EST',
        location: 'Google Meet',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        completed: false,
        priority: 'urgent',
        color: '#8b5cf6',
        recurring: 'none',
        attendees: [{ name: 'Sarah Tech Lead', email: 'sarah@stripe.com', role: 'Interviewer' }],
        createdAt: new Date().toISOString()
      },
      {
        id: 'evt_2',
        userId,
        title: 'AI Career Coach Weekly Strategy Briefing',
        description: 'Review job application pipeline conversion velocity and resume keywords.',
        type: 'meeting',
        eventDate: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        timezone: 'EST',
        location: 'PathPilot Workspace',
        completed: false,
        priority: 'high',
        color: '#10b981',
        recurring: 'weekly',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // ==========================================
  // ACTIVITY FEED
  // ==========================================

  static async getActivityFeed(userId: string): Promise<ActivityFeedItem[]> {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error || !data) return this.getLocalActivities(userId);

      return data.map((a) => ({
        id: a.id,
        userId: a.user_id,
        userName: a.user_name || 'Candidate',
        userAvatar: a.user_avatar,
        type: a.type || 'task_completed',
        title: a.title,
        description: a.description,
        metaData: a.meta_data,
        xpEarned: a.xp_earned || 0,
        createdAt: a.created_at
      }));
    } catch {
      return this.getLocalActivities(userId);
    }
  }

  static async logActivity(userId: string, activity: Omit<ActivityFeedItem, 'id' | 'createdAt'>): Promise<ActivityFeedItem> {
    const newAct: ActivityFeedItem = {
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      ...activity,
      createdAt: new Date().toISOString()
    };

    try {
      await supabase.from('activity_feed').insert({
        id: newAct.id,
        user_id: userId,
        user_name: newAct.userName,
        type: newAct.type,
        title: newAct.title,
        description: newAct.description,
        meta_data: newAct.metaData,
        xp_earned: newAct.xpEarned,
        created_at: newAct.createdAt
      });
      this.saveLocalActivity(userId, newAct);
      return newAct;
    } catch {
      this.saveLocalActivity(userId, newAct);
      return newAct;
    }
  }

  private static getLocalActivities(userId: string): ActivityFeedItem[] {
    const raw = localStorage.getItem(`activities_${userId}`);
    if (!raw) return this.getDefaultActivities(userId);
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultActivities(userId);
    }
  }

  private static saveLocalActivity(userId: string, activity: ActivityFeedItem) {
    const existing = this.getLocalActivities(userId);
    localStorage.setItem(`activities_${userId}`, JSON.stringify([activity, ...existing.slice(0, 50)]));
  }

  private static getDefaultActivities(userId: string): ActivityFeedItem[] {
    return [
      {
        id: 'act_1',
        userId,
        userName: 'You',
        type: 'interview_completed',
        title: 'Mock Behavioral Drill Mastered',
        description: 'Scored 94/100 on System Architecture leadership question.',
        xpEarned: 50,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'act_2',
        userId,
        userName: 'You',
        type: 'application_submitted',
        title: 'Application Sent to Senior Full Stack Engineer at Stripe',
        description: 'Tailored resume attached with 92% ATS keywords match.',
        xpEarned: 30,
        createdAt: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: 'act_3',
        userId,
        userName: 'PathPilot AI',
        type: 'ai_recommendation',
        title: 'AI Productivity Schedule Optimized',
        description: 'Recommended 2-hour morning deep focus block for system design.',
        xpEarned: 15,
        createdAt: new Date(Date.now() - 28800000).toISOString()
      }
    ];
  }

  // ==========================================
  // DAILY & WEEKLY PRODUCTIVITY PLANS
  // ==========================================

  static async getDailyPlan(userId: string, dateStr?: string): Promise<DailyPlan> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    return {
      id: 'plan_daily_' + targetDate,
      userId,
      planDate: targetDate,
      focusSummary: 'High-Impact Execution: Interview Practice & Resume Distribution',
      targetFocusHours: 4.5,
      actualFocusHours: 2.8,
      productivityScore: 88,
      aiSuggestions: [
        'Schedule system design drills during morning peak energy hours (9:00 AM - 11:00 AM).',
        'Review application status responses before 2:00 PM for optimal response velocity.',
        'Take a 15-minute cognitive reset break after intensive mock interviews.'
      ],
      todayPriorities: [
        'Master Rate Limiter System Design Diagram',
        'Send 2 High-Signal Custom Applications',
        'Complete 1 Mock Technical Drill'
      ],
      tasks: [],
      createdAt: new Date().toISOString()
    };
  }

  // ==========================================
  // PRODUCTIVITY ANALYTICS & METRICS
  // ==========================================

  static async getProductivityMetrics(userId: string): Promise<ProductivityMetrics> {
    const tasks = await this.getTasks(userId);
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const completionRatePercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRatePercent,
      totalFocusHours: 18.5,
      productivityScore: 92,
      streakDays: 7,
      topCategory: 'Interview Prep',
      pendingDeadlinesCount: tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length,
      upcomingInterviewsCount: 2,
      weeklyFocusTrend: [
        { day: 'Mon', focusHours: 3.5, tasksDone: 4 },
        { day: 'Tue', focusHours: 4.0, tasksDone: 5 },
        { day: 'Wed', focusHours: 2.8, tasksDone: 3 },
        { day: 'Thu', focusHours: 4.5, tasksDone: 6 },
        { day: 'Fri', focusHours: 3.8, tasksDone: 4 },
        { day: 'Sat', focusHours: 2.0, tasksDone: 2 },
        { day: 'Sun', focusHours: 1.5, tasksDone: 1 }
      ],
      categoryDistribution: [
        { category: 'Interview Prep', count: 8, color: '#8b5cf6' },
        { category: 'Applications', count: 6, color: '#3b82f6' },
        { category: 'Learning & Skills', count: 5, color: '#10b981' },
        { category: 'Projects', count: 4, color: '#f59e0b' },
        { category: 'Networking', count: 2, color: '#ec4899' }
      ]
    };
  }
}
