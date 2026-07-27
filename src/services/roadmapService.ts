/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { CareerRoadmap } from '../types';

export class RoadmapService {
  /**
   * Fetch active career roadmap for user
   */
  static async getRoadmap(userId: string): Promise<CareerRoadmap | null> {
    try {
      const { data, error } = await supabase
        .from('career_roadmaps')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        targetRole: data.target_role || 'Software Professional',
        generatedAt: data.generated_at,
        activePhase: data.active_phase || 1,
        phases: data.phases || [],
      };
    } catch {
      return null;
    }
  }

  /**
   * Save or update career roadmap
   */
  static async saveRoadmap(userId: string, targetRole: string, roadmap: CareerRoadmap): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('career_roadmaps')
        .upsert({
          user_id: userId,
          target_role: targetRole,
          active_phase: roadmap.activePhase,
          phases: roadmap.phases,
          generated_at: roadmap.generatedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      return !error;
    } catch {
      return false;
    }
  }
}
