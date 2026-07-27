/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  CareerRoadmap,
  DailyMission,
  WeeklyGoal,
  MonthlyGoal,
  CareerTimelineStage,
  StructuredLearningPlan,
  CertificationPlan,
  ProjectPlanItem,
  JobPrepChecklistItem,
  RoadmapAnalyticsData,
  RoadmapSettings,
  RoadmapPhase,
  RoadmapTask
} from '../types';

export class RoadmapExecutionService {
  // --- CAREER ROADMAP (PERSISTENCE) ---

  static async getActiveRoadmap(userId: string): Promise<CareerRoadmap | null> {
    if (!userId) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('career_roadmaps')
          .select('*')
          .eq('user_id', userId)
          .order('generated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          return {
            id: data.id,
            userId: data.user_id,
            targetRole: data.target_role,
            generatedAt: data.generated_at,
            activePhase: data.active_phase || 1,
            phases: data.phases || [],
            roadmap12Month: data.roadmap_12_month || data.phases,
            roadmap6Month: data.roadmap_6_month,
            roadmap90Day: data.roadmap_90_day,
            roadmap30Day: data.roadmap_30_day,
            roadmap7Day: data.roadmap_7_day,
            todayTasks: data.today_tasks
          };
        }
      } catch (err) {
        console.warn('Supabase roadmap fetch failed, using local fallback', err);
      }
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(`pathpilot_roadmap_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }

    return null;
  }

  static async saveRoadmap(userId: string, targetRole: string, roadmap: CareerRoadmap): Promise<boolean> {
    if (!userId) return false;

    // Save to localStorage immediately for client responsiveness
    localStorage.setItem(`pathpilot_roadmap_${userId}`, JSON.stringify(roadmap));

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('career_roadmaps')
          .upsert({
            user_id: userId,
            target_role: targetRole,
            active_phase: roadmap.activePhase,
            phases: roadmap.phases,
            roadmap_12_month: roadmap.roadmap12Month || roadmap.phases,
            roadmap_6_month: roadmap.roadmap6Month || null,
            roadmap_90_day: roadmap.roadmap90Day || null,
            roadmap_30_day: roadmap.roadmap30Day || null,
            roadmap_7_day: roadmap.roadmap7Day || null,
            today_tasks: roadmap.todayTasks || null,
            generated_at: roadmap.generatedAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) {
          console.warn('Supabase saveRoadmap error (will rely on local persistence):', error.message);
        }
      } catch (e) {
        console.warn('Supabase saveRoadmap exception:', e);
      }
    }

    return true;
  }

  // --- DAILY MISSIONS ---

  static async getDailyMissions(userId: string): Promise<DailyMission[]> {
    if (!userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('daily_missions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            userId: m.user_id,
            text: m.text || m.title,
            title: m.title || m.text,
            description: m.description,
            completed: m.completed,
            xpValue: m.xp_value || 50,
            timeMinutes: m.time_minutes || 30,
            priority: m.priority || 'Medium',
            difficulty: m.difficulty || 'Intermediate',
            category: m.category || 'general',
            deadline: m.deadline,
            completedAt: m.completed_at
          }));
        }
      } catch (err) {
        console.warn('Supabase daily_missions fetch fallback', err);
      }
    }

    const saved = localStorage.getItem(`pathpilot_missions_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }

  static async saveDailyMissions(userId: string, missions: DailyMission[]): Promise<boolean> {
    if (!userId) return false;
    localStorage.setItem(`pathpilot_missions_${userId}`, JSON.stringify(missions));

    if (isSupabaseConfigured()) {
      try {
        const rows = missions.map(m => ({
          id: m.id,
          user_id: userId,
          title: m.title || m.text,
          text: m.text || m.title,
          description: m.description || '',
          completed: m.completed,
          xp_value: m.xpValue,
          time_minutes: m.timeMinutes,
          priority: m.priority,
          difficulty: m.difficulty,
          category: m.category,
          deadline: m.deadline || null,
          completed_at: m.completedAt || null,
          updated_at: new Date().toISOString()
        }));

        await supabase.from('daily_missions').upsert(rows);
      } catch (e) {
        console.warn('Supabase saveDailyMissions warning:', e);
      }
    }
    return true;
  }

  // --- WEEKLY GOALS ---

  static async getWeeklyGoals(userId: string): Promise<WeeklyGoal[]> {
    if (!userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('weekly_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map(g => ({
            id: g.id,
            userId: g.user_id,
            title: g.title,
            description: g.description,
            category: g.category || 'Career Growth',
            weekStartDate: g.week_start_date,
            weekEndDate: g.week_end_date,
            status: g.status || 'in_progress',
            priority: g.priority || 'Medium',
            tasksCount: g.tasks_count || 1,
            completedTasksCount: g.completed_tasks_count || 0,
            xpValue: g.xp_value || 150,
            subtasks: g.subtasks || []
          }));
        }
      } catch (e) {
        console.warn('Weekly goals supabase fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_weekly_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveWeeklyGoals(userId: string, goals: WeeklyGoal[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_weekly_${userId}`, JSON.stringify(goals));
    if (isSupabaseConfigured()) {
      try {
        const rows = goals.map(g => ({
          id: g.id,
          user_id: userId,
          title: g.title,
          description: g.description,
          category: g.category,
          week_start_date: g.weekStartDate,
          week_end_date: g.weekEndDate,
          status: g.status,
          priority: g.priority,
          tasks_count: g.tasksCount,
          completed_tasks_count: g.completedTasksCount,
          xp_value: g.xpValue,
          subtasks: g.subtasks || [],
          updated_at: new Date().toISOString()
        }));
        await supabase.from('weekly_goals').upsert(rows);
      } catch (e) {
        console.warn('saveWeeklyGoals fallback', e);
      }
    }
    return true;
  }

  // --- MONTHLY GOALS ---

  static async getMonthlyGoals(userId: string): Promise<MonthlyGoal[]> {
    if (!userId) return [];
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('monthly_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            userId: m.user_id,
            title: m.title,
            description: m.description,
            monthYear: m.month_year,
            targetMetric: m.target_metric,
            currentMetric: m.current_metric || 0,
            targetMetricValue: m.target_metric_value || 1,
            status: m.status || 'in_progress',
            progressPercent: m.progress_percent || 0,
            xpValue: m.xp_value || 500,
            keyMilestones: m.key_milestones || []
          }));
        }
      } catch (e) {
        console.warn('Monthly goals fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_monthly_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveMonthlyGoals(userId: string, goals: MonthlyGoal[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_monthly_${userId}`, JSON.stringify(goals));
    if (isSupabaseConfigured()) {
      try {
        const rows = goals.map(m => ({
          id: m.id,
          user_id: userId,
          title: m.title,
          description: m.description,
          month_year: m.monthYear,
          target_metric: m.targetMetric,
          current_metric: m.currentMetric,
          target_metric_value: m.targetMetricValue,
          status: m.status,
          progress_percent: m.progressPercent,
          xp_value: m.xpValue,
          key_milestones: m.keyMilestones || [],
          updated_at: new Date().toISOString()
        }));
        await supabase.from('monthly_goals').upsert(rows);
      } catch (e) {
        console.warn('saveMonthlyGoals fallback', e);
      }
    }
    return true;
  }

  // --- CERTIFICATION PLANNER ---

  static async getCertifications(userId: string): Promise<CertificationPlan[]> {
    if (!userId) return [];
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('certification_plans')
          .select('*')
          .eq('user_id', userId);

        if (data && !error && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            userId: c.user_id,
            title: c.title,
            issuer: c.issuer,
            cost: c.cost,
            examUrl: c.exam_url,
            difficulty: c.difficulty || 'Intermediate',
            status: c.status || 'planned',
            targetDate: c.target_date,
            completionDate: c.completion_date,
            credentialId: c.credential_id,
            verificationUrl: c.verification_url,
            skillsValidated: c.skills_validated || []
          }));
        }
      } catch (e) {
        console.warn('Certifications fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_certifications_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveCertifications(userId: string, certs: CertificationPlan[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_certifications_${userId}`, JSON.stringify(certs));
    if (isSupabaseConfigured()) {
      try {
        const rows = certs.map(c => ({
          id: c.id,
          user_id: userId,
          title: c.title,
          issuer: c.issuer,
          cost: c.cost,
          exam_url: c.examUrl,
          difficulty: c.difficulty,
          status: c.status,
          target_date: c.targetDate,
          completion_date: c.completionDate,
          credential_id: c.credentialId,
          verification_url: c.verificationUrl,
          skills_validated: c.skillsValidated || [],
          updated_at: new Date().toISOString()
        }));
        await supabase.from('certification_plans').upsert(rows);
      } catch (e) {
        console.warn('saveCertifications fallback', e);
      }
    }
    return true;
  }

  // --- PROJECT PLANNER ---

  static async getProjectPlans(userId: string): Promise<ProjectPlanItem[]> {
    if (!userId) return [];
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('project_plans')
          .select('*')
          .eq('user_id', userId);

        if (data && !error && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            userId: p.user_id,
            title: p.title,
            objective: p.objective,
            difficulty: p.difficulty || 'Intermediate',
            estimatedDuration: p.estimated_duration || '2 Weeks',
            portfolioValue: p.portfolio_value || 'High',
            requiredSkills: p.required_skills || [],
            status: p.status || 'planned',
            completionPercent: p.completion_percent || 0,
            repoUrl: p.repo_url,
            demoUrl: p.demo_url,
            aiArchitectureTips: p.ai_architecture_tips
          }));
        }
      } catch (e) {
        console.warn('Projects fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_projects_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveProjectPlans(userId: string, projects: ProjectPlanItem[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_projects_${userId}`, JSON.stringify(projects));
    if (isSupabaseConfigured()) {
      try {
        const rows = projects.map(p => ({
          id: p.id,
          user_id: userId,
          title: p.title,
          objective: p.objective,
          difficulty: p.difficulty,
          estimated_duration: p.estimatedDuration,
          portfolio_value: p.portfolioValue,
          required_skills: p.requiredSkills || [],
          status: p.status,
          completion_percent: p.completionPercent,
          repo_url: p.repoUrl,
          demo_url: p.demoUrl,
          ai_architecture_tips: p.aiArchitectureTips,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('project_plans').upsert(rows);
      } catch (e) {
        console.warn('saveProjectPlans fallback', e);
      }
    }
    return true;
  }

  // --- TIMELINE STAGES ---

  static async getCareerTimeline(userId: string): Promise<CareerTimelineStage[]> {
    if (!userId) return [];
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('career_timelines')
          .select('*')
          .eq('user_id', userId)
          .order('phase_id', { ascending: true });

        if (data && !error && data.length > 0) {
          return data.map(t => ({
            id: t.id,
            userId: t.user_id,
            phaseId: t.phase_id,
            title: t.title,
            targetRole: t.target_role,
            startDate: t.start_date,
            estimatedCompletionDate: t.estimated_completion_date,
            status: t.status,
            progressPercent: t.progress_percent,
            milestonesCount: t.milestones_count,
            completedMilestonesCount: t.completed_milestones_count,
            xpReward: t.xp_reward,
            highlights: t.highlights || []
          }));
        }
      } catch (e) {
        console.warn('Timeline fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_timeline_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveCareerTimeline(userId: string, timeline: CareerTimelineStage[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_timeline_${userId}`, JSON.stringify(timeline));
    if (isSupabaseConfigured()) {
      try {
        const rows = timeline.map(t => ({
          id: t.id,
          user_id: userId,
          phase_id: t.phaseId,
          title: t.title,
          target_role: t.targetRole,
          start_date: t.startDate,
          estimated_completion_date: t.estimatedCompletionDate,
          status: t.status,
          progress_percent: t.progressPercent,
          milestones_count: t.milestonesCount,
          completed_milestones_count: t.completedMilestonesCount,
          xp_reward: t.xpReward,
          highlights: t.highlights || [],
          updated_at: new Date().toISOString()
        }));
        await supabase.from('career_timelines').upsert(rows);
      } catch (e) {
        console.warn('saveCareerTimeline fallback', e);
      }
    }
    return true;
  }

  // --- LEARNING PLANS ---

  static async getLearningPlans(userId: string): Promise<StructuredLearningPlan[]> {
    if (!userId) return [];
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('learning_plans')
          .select('*')
          .eq('user_id', userId);

        if (data && !error && data.length > 0) {
          return data.map(l => ({
            id: l.id,
            userId: l.user_id,
            title: l.title,
            targetRole: l.target_role,
            category: l.category,
            estimatedHoursTotal: l.estimated_hours_total,
            estimatedHoursCompleted: l.estimated_hours_completed,
            status: l.status,
            progressPercent: l.progress_percent,
            resources: l.resources || []
          }));
        }
      } catch (e) {
        console.warn('Learning plan fallback', e);
      }
    }

    const saved = localStorage.getItem(`pathpilot_learning_plans_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static async saveLearningPlans(userId: string, plans: StructuredLearningPlan[]): Promise<boolean> {
    localStorage.setItem(`pathpilot_learning_plans_${userId}`, JSON.stringify(plans));
    if (isSupabaseConfigured()) {
      try {
        const rows = plans.map(l => ({
          id: l.id,
          user_id: userId,
          title: l.title,
          target_role: l.targetRole,
          category: l.category,
          estimated_hours_total: l.estimatedHoursTotal,
          estimated_hours_completed: l.estimatedHoursCompleted,
          status: l.status,
          progress_percent: l.progressPercent,
          resources: l.resources || [],
          updated_at: new Date().toISOString()
        }));
        await supabase.from('learning_plans').upsert(rows);
      } catch (e) {
        console.warn('saveLearningPlans fallback', e);
      }
    }
    return true;
  }
}
