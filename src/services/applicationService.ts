/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { JobApplication } from '../types';

export class ApplicationService {
  /**
   * Fetch all applications for the logged in user
   */
  static async getApplications(userId: string): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        company: item.company,
        role: item.role,
        type: item.type || 'job',
        dateApplied: item.date_applied ? new Date(item.date_applied).toISOString().split('T')[0] : '',
        status: item.status || 'applied',
        notes: item.notes || '',
        interviewDate: item.interview_date ? new Date(item.interview_date).toISOString() : undefined,
        deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : undefined,
        priority: item.priority || 'medium',
        outcome: item.outcome || undefined,
        salaryOffered: item.salary_offered ? String(item.salary_offered) : undefined,
        location: item.location || undefined,
        jobUrl: item.job_url || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Create new job application
   */
  static async createApplication(userId: string, app: Omit<JobApplication, 'id'>): Promise<JobApplication | null> {
    try {
      const dbPayload = {
        user_id: userId,
        company: app.company,
        role: app.role,
        type: app.type || 'job',
        date_applied: app.dateApplied || new Date().toISOString().split('T')[0],
        status: app.status || 'applied',
        notes: app.notes || '',
        interview_date: app.interviewDate ? new Date(app.interviewDate).toISOString() : null,
        deadline: app.deadline || null,
        priority: app.priority || 'medium',
        outcome: app.outcome || null,
        salary_offered: app.salaryOffered ? parseFloat(app.salaryOffered) : null,
        location: app.location || null,
        job_url: app.jobUrl || null,
      };

      const { data, error } = await supabase
        .from('applications')
        .insert(dbPayload)
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        company: data.company,
        role: data.role,
        type: data.type,
        dateApplied: data.date_applied,
        status: data.status,
        notes: data.notes,
        interviewDate: data.interview_date,
        deadline: data.deadline,
        priority: data.priority,
        outcome: data.outcome,
        salaryOffered: data.salary_offered ? String(data.salary_offered) : undefined,
        location: data.location,
        jobUrl: data.job_url,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update existing application
   */
  static async updateApplication(userId: string, id: string, updates: Partial<JobApplication>): Promise<boolean> {
    try {
      const dbPayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.company !== undefined) dbPayload.company = updates.company;
      if (updates.role !== undefined) dbPayload.role = updates.role;
      if (updates.type !== undefined) dbPayload.type = updates.type;
      if (updates.dateApplied !== undefined) dbPayload.date_applied = updates.dateApplied;
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.notes !== undefined) dbPayload.notes = updates.notes;
      if (updates.interviewDate !== undefined) dbPayload.interview_date = updates.interviewDate ? new Date(updates.interviewDate).toISOString() : null;
      if (updates.deadline !== undefined) dbPayload.deadline = updates.deadline || null;
      if (updates.priority !== undefined) dbPayload.priority = updates.priority;
      if (updates.outcome !== undefined) dbPayload.outcome = updates.outcome;
      if (updates.salaryOffered !== undefined) dbPayload.salary_offered = updates.salaryOffered ? parseFloat(updates.salaryOffered) : null;
      if (updates.location !== undefined) dbPayload.location = updates.location;
      if (updates.jobUrl !== undefined) dbPayload.job_url = updates.jobUrl;

      const { error } = await supabase
        .from('applications')
        .update(dbPayload)
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete an application
   */
  static async deleteApplication(userId: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}
