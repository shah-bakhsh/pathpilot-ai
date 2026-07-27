/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { CalendarEvent } from '../types';

export class CalendarService {
  /**
   * Fetch user calendar events
   */
  static async getEvents(userId: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('event_date', { ascending: true });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type || 'learning_goal',
        date: item.event_date,
        completed: item.completed || false,
        priority: item.priority || 'medium',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Add new calendar event
   */
  static async createEvent(userId: string, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: userId,
          title: event.title,
          type: event.type || 'learning_goal',
          event_date: event.date,
          completed: event.completed || false,
          priority: event.priority || 'medium',
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        type: data.type,
        date: data.event_date,
        completed: data.completed,
        priority: data.priority,
      };
    } catch {
      return null;
    }
  }

  /**
   * Toggle event completion status
   */
  static async toggleCompleted(userId: string, id: string, currentCompleted: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({ completed: !currentCompleted })
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}
