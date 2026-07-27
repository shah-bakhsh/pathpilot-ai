/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { PersonalProject } from '../types';

export class ProjectService {
  /**
   * Get user projects from Supabase
   */
  static async getProjects(userId: string): Promise<PersonalProject[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        technologies: item.technologies || [],
        githubUrl: item.github_url || undefined,
        demoUrl: item.demo_url || undefined,
        status: item.status || 'planning',
        completionPercent: item.completion_percent || 0,
        aiFeedback: item.ai_feedback || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Add new project
   */
  static async createProject(userId: string, project: Omit<PersonalProject, 'id'>): Promise<PersonalProject | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          github_url: project.githubUrl || null,
          demo_url: project.demoUrl || null,
          status: project.status || 'planning',
          completion_percent: project.completionPercent || 0,
          ai_feedback: project.aiFeedback || null,
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        githubUrl: data.github_url,
        demoUrl: data.demo_url,
        status: data.status,
        completionPercent: data.completion_percent,
        aiFeedback: data.ai_feedback,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update existing project
   */
  static async updateProject(userId: string, id: string, updates: Partial<PersonalProject>): Promise<boolean> {
    try {
      const dbPayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) dbPayload.title = updates.title;
      if (updates.description !== undefined) dbPayload.description = updates.description;
      if (updates.technologies !== undefined) dbPayload.technologies = updates.technologies;
      if (updates.githubUrl !== undefined) dbPayload.github_url = updates.githubUrl;
      if (updates.demoUrl !== undefined) dbPayload.demo_url = updates.demoUrl;
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.completionPercent !== undefined) dbPayload.completion_percent = updates.completionPercent;
      if (updates.aiFeedback !== undefined) dbPayload.ai_feedback = updates.aiFeedback;

      const { error } = await supabase
        .from('projects')
        .update(dbPayload)
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete project
   */
  static async deleteProject(userId: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}
