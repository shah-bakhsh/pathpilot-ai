/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { EnhancedNotification, NotificationPreference } from '../types';

export class NotificationService {
  /**
   * Fetch user notifications with category, priority, pinned, archived support
   */
  static async getNotifications(userId: string): Promise<EnhancedNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        return this.getLocalNotifications(userId);
      }

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        type: item.type || 'info',
        timestamp: item.created_at,
        read: item.read || false,
        category: item.category || 'system',
        priority: item.priority || 'medium',
        isArchived: item.is_archived || false,
        isPinned: item.is_pinned || false,
        actionUrl: item.action_url
      }));
    } catch {
      return this.getLocalNotifications(userId);
    }
  }

  /**
   * Insert new enhanced notification
   */
  static async createNotification(
    userId: string,
    title: string,
    body: string,
    type: 'info' | 'success' | 'warning' | 'streak' = 'info',
    category: EnhancedNotification['category'] = 'system',
    priority: EnhancedNotification['priority'] = 'medium',
    actionUrl?: string
  ): Promise<EnhancedNotification | null> {
    const newNotif: EnhancedNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      title,
      body,
      type,
      category,
      priority,
      timestamp: new Date().toISOString(),
      read: false,
      isArchived: false,
      isPinned: false,
      actionUrl
    };

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          id: newNotif.id,
          user_id: userId,
          title,
          body,
          type,
          category,
          priority,
          read: false,
          is_archived: false,
          is_pinned: false,
          action_url: actionUrl,
          created_at: newNotif.timestamp
        })
        .select()
        .single();

      this.saveLocalNotification(userId, newNotif);
      if (error || !data) return newNotif;

      return newNotif;
    } catch {
      this.saveLocalNotification(userId, newNotif);
      return newNotif;
    }
  }

  /**
   * Mark notification as read
   */
  static async markRead(userId: string, id: string): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', userId);

      this.updateLocalNotification(userId, id, { read: true });
      return true;
    } catch {
      this.updateLocalNotification(userId, id, { read: true });
      return true;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllRead(userId: string): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

      const notifs = this.getLocalNotifications(userId);
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifs.map((n) => ({ ...n, read: true }))));
      return true;
    } catch {
      const notifs = this.getLocalNotifications(userId);
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifs.map((n) => ({ ...n, read: true }))));
      return true;
    }
  }

  /**
   * Toggle pin status
   */
  static async togglePin(userId: string, id: string, currentPinned: boolean): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .update({ is_pinned: !currentPinned })
        .eq('id', id)
        .eq('user_id', userId);

      this.updateLocalNotification(userId, id, { isPinned: !currentPinned });
      return true;
    } catch {
      this.updateLocalNotification(userId, id, { isPinned: !currentPinned });
      return true;
    }
  }

  /**
   * Archive or unarchive
   */
  static async toggleArchive(userId: string, id: string, currentArchived: boolean): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .update({ is_archived: !currentArchived })
        .eq('id', id)
        .eq('user_id', userId);

      this.updateLocalNotification(userId, id, { isArchived: !currentArchived });
      return true;
    } catch {
      this.updateLocalNotification(userId, id, { isArchived: !currentArchived });
      return true;
    }
  }

  /**
   * Delete single notification
   */
  static async deleteNotification(userId: string, id: string): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      this.deleteLocalNotification(userId, id);
      return true;
    } catch {
      this.deleteLocalNotification(userId, id);
      return true;
    }
  }

  /**
   * Clear all notifications
   */
  static async clearAll(userId: string): Promise<boolean> {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      localStorage.removeItem(`notifications_${userId}`);
      return true;
    } catch {
      localStorage.removeItem(`notifications_${userId}`);
      return true;
    }
  }

  // Local storage helpers
  private static getLocalNotifications(userId: string): EnhancedNotification[] {
    const raw = localStorage.getItem(`notifications_${userId}`);
    if (!raw) return this.getDefaultNotifications();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultNotifications();
    }
  }

  private static saveLocalNotification(userId: string, notif: EnhancedNotification) {
    const existing = this.getLocalNotifications(userId);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify([notif, ...existing]));
  }

  private static updateLocalNotification(userId: string, id: string, updates: Partial<EnhancedNotification>) {
    const existing = this.getLocalNotifications(userId);
    const updated = existing.map((n) => (n.id === id ? { ...n, ...updates } : n));
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
  }

  private static deleteLocalNotification(userId: string, id: string) {
    const existing = this.getLocalNotifications(userId);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(existing.filter((n) => n.id !== id)));
  }

  private static getDefaultNotifications(): EnhancedNotification[] {
    return [
      {
        id: 'ntf_1',
        title: 'Upcoming Interview Reminder',
        body: 'Stripe Technical System Architecture Drill scheduled in 2 hours.',
        type: 'warning',
        category: 'interview',
        priority: 'urgent',
        timestamp: new Date().toISOString(),
        read: false,
        isPinned: true,
        isArchived: false,
        actionUrl: '#calendar'
      },
      {
        id: 'ntf_2',
        title: 'Application Deadline Today',
        body: 'Senior Full Stack Lead Role application window closes at 11:59 PM EST.',
        type: 'info',
        category: 'application',
        priority: 'high',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        isPinned: false,
        isArchived: false,
        actionUrl: '#applications'
      },
      {
        id: 'ntf_3',
        title: 'AI Productivity Schedule Suggestion',
        body: 'Gemini AI generated a 4.5-hour optimal daily focus roadmap.',
        type: 'success',
        category: 'ai',
        priority: 'medium',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        isPinned: false,
        isArchived: false,
        actionUrl: '#daily-planner'
      },
      {
        id: 'ntf_4',
        title: '7-Day Pipeline Streak Unlocked!',
        body: 'You completed daily missions for 7 consecutive days. +100 XP Earned.',
        type: 'streak',
        category: 'goal',
        priority: 'high',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        isPinned: false,
        isArchived: false,
        actionUrl: '#achievements'
      }
    ];
  }
}
