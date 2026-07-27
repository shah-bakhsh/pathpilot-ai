/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { Opportunity } from '../types';

export class BookmarkService {
  /**
   * Fetch saved jobs/opportunities
   */
  static async getSavedJobs(userId: string): Promise<Opportunity[]> {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        title: item.job_title,
        organization: item.organization,
        type: item.type || 'job',
        location: item.location || '',
        matchIndex: item.match_index || 80,
        requirements: item.requirements || [],
        description: item.description || '',
        applicationUrl: item.application_url || '#',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Save a job opportunity
   */
  static async saveJob(userId: string, opportunity: Opportunity): Promise<boolean> {
    try {
      const { error } = await supabase.from('saved_jobs').upsert({
        id: opportunity.id,
        user_id: userId,
        job_title: opportunity.title,
        organization: opportunity.organization,
        type: opportunity.type,
        location: opportunity.location,
        match_index: opportunity.matchIndex,
        requirements: opportunity.requirements,
        description: opportunity.description,
        application_url: opportunity.applicationUrl,
        saved_at: new Date().toISOString(),
      });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete saved job
   */
  static async removeSavedJob(userId: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}
