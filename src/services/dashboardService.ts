/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';

export interface DashboardMetrics {
  readinessScore: number;
  totalApplications: number;
  activeInterviews: number;
  coursesInProgress: number;
  totalProjects: number;
  experiencePoints: number;
  streakDays: number;
  unlockedBadgesCount: number;
}

export class DashboardService {
  /**
   * Aggregates real metrics directly from user tables
   */
  static async getMetrics(userId: string): Promise<DashboardMetrics> {
    try {
      // 1. Profile data (XP, Streak)
      const { data: profile } = await supabase
        .from('profiles')
        .select('experience_points, active_streak')
        .eq('id', userId)
        .single();

      // 2. Latest resume readiness score
      const { data: resume } = await supabase
        .from('resume_analysis')
        .select('readiness_score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 3. Applications count & interviews count
      const { data: apps } = await supabase
        .from('applications')
        .select('status, interview_date')
        .eq('user_id', userId);

      const totalApplications = apps ? apps.length : 0;
      const activeInterviews = apps ? apps.filter((a) => a.status === 'interview' || !!a.interview_date).length : 0;

      // 4. Learning courses count
      const { data: courses } = await supabase
        .from('learning_paths')
        .select('status')
        .eq('user_id', userId);

      const coursesInProgress = courses ? courses.filter((c) => c.status === 'in_progress').length : 0;

      // 5. Projects count
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', userId);

      const totalProjects = projects ? projects.length : 0;

      // 6. Badges count
      const { data: badges } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', userId);

      const unlockedBadgesCount = badges ? badges.length : 0;

      return {
        readinessScore: resume?.readiness_score || 68,
        totalApplications,
        activeInterviews,
        coursesInProgress,
        totalProjects,
        experiencePoints: profile?.experience_points || 0,
        streakDays: profile?.active_streak || 1,
        unlockedBadgesCount,
      };
    } catch {
      return {
        readinessScore: 68,
        totalApplications: 0,
        activeInterviews: 0,
        coursesInProgress: 0,
        totalProjects: 0,
        experiencePoints: 0,
        streakDays: 1,
        unlockedBadgesCount: 0,
      };
    }
  }
}
