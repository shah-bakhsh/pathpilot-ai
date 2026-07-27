/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { LearningCourse } from '../types';

export interface SkillGapItem {
  skill: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  currentLevel: string;
  targetLevel: string;
  gapDescription: string;
  estimatedHoursToBridge: number;
  recommendedAction: string;
}

export interface SkillGapAnalysisResult {
  overallMatchPercent: number;
  readinessLevel: string;
  radarData: { subject: string; current: number; required: number }[];
  skillGaps: SkillGapItem[];
  strengths: string[];
  strategicAdvice: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  type: 'course' | 'book' | 'youtube' | 'documentation' | 'project' | 'practice_platform';
  url: string;
  rating: number;
  studentsEnrolled: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFree: boolean;
  cost: string;
  skillsTaught: string[];
  matchScore: number;
  reason: string;
}

export interface CertificationReadinessResult {
  readinessScore: number;
  passingThreshold: number;
  status: string;
  estimatedDaysToExam: number;
  voucherCost: string;
  validityYears: string;
  officialUrl: string;
  domains: { domainName: string; weightPercent: number; userMasteryPercent: number; status: string }[];
  practiceQuestions: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
  topStudyTips: string[];
}

export interface GeneratedSyllabusModule {
  id: string;
  moduleTitle: string;
  durationHours: number;
  lessons: string[];
  recommendedResource: string;
  resourceUrl: string;
}

export interface GeneratedSyllabusPlan {
  title: string;
  topic: string;
  estimatedHoursTotal: number;
  modules: GeneratedSyllabusModule[];
}

export interface StudySessionLog {
  id: string;
  userId: string;
  topic: string;
  durationMinutes: number;
  notes?: string;
  xpEarned: number;
  completedAt: string;
}

export class LearningService {
  /**
   * Fetch user's learning courses
   */
  static async getCourses(userId: string): Promise<LearningCourse[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('learning_paths')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            title: item.title,
            source: item.source || 'Online',
            hoursTotal: item.hours_total || 0,
            hoursCompleted: item.hours_completed || 0,
            status: item.status || 'not_started',
            scheduleDay: item.schedule_day || 'Monday',
            priority: item.priority || 'medium',
            url: item.url || undefined,
          }));
        }
      }
    } catch {
      // Fallback
    }

    // LocalStorage fallback
    const saved = localStorage.getItem(`pathpilot-courses-${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Continue
      }
    }

    // Initial default seed if empty
    return [
      {
        id: 'lc_seed_1',
        title: 'High-Performance System Design & Microservices',
        source: 'Coursera & ByteByteGo',
        hoursTotal: 25,
        hoursCompleted: 12,
        status: 'in_progress',
        scheduleDay: 'Monday',
        priority: 'high',
        url: 'https://bytebytego.com'
      },
      {
        id: 'lc_seed_2',
        title: 'Google Cloud Run & Docker Containerization',
        source: 'Google Cloud Tech',
        hoursTotal: 15,
        hoursCompleted: 6,
        status: 'in_progress',
        scheduleDay: 'Wednesday',
        priority: 'high',
        url: 'https://cloud.google.com/run'
      },
      {
        id: 'lc_seed_3',
        title: 'Advanced TypeScript & Full-Stack Patterns',
        source: 'Official TS Docs & Frontend Masters',
        hoursTotal: 20,
        hoursCompleted: 20,
        status: 'completed',
        scheduleDay: 'Friday',
        priority: 'medium',
        url: 'https://www.typescriptlang.org'
      }
    ];
  }

  /**
   * Add new course
   */
  static async addCourse(userId: string, course: Omit<LearningCourse, 'id'>): Promise<LearningCourse | null> {
    const newId = 'lc_' + Math.random().toString(36).substring(2, 9);
    const newCourse: LearningCourse = {
      id: newId,
      ...course
    };

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('learning_paths')
          .insert({
            id: newId,
            user_id: userId,
            title: course.title,
            source: course.source || null,
            hours_total: course.hoursTotal || 0,
            hours_completed: course.hoursCompleted || 0,
            status: course.status || 'not_started',
            schedule_day: course.scheduleDay || 'Monday',
            priority: course.priority || 'medium',
            url: course.url || null,
          })
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            source: data.source,
            hoursTotal: data.hours_total,
            hoursCompleted: data.hours_completed,
            status: data.status,
            scheduleDay: data.schedule_day,
            priority: data.priority,
            url: data.url,
          };
        }
      }
    } catch {
      // Continue to local sync
    }

    // Local Storage sync
    const existing = await this.getCourses(userId);
    const updated = [newCourse, ...existing];
    localStorage.setItem(`pathpilot-courses-${userId}`, JSON.stringify(updated));
    return newCourse;
  }

  /**
   * Update course progress or details
   */
  static async updateCourse(userId: string, id: string, updates: Partial<LearningCourse>): Promise<boolean> {
    try {
      if (supabase) {
        const dbPayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (updates.title !== undefined) dbPayload.title = updates.title;
        if (updates.source !== undefined) dbPayload.source = updates.source;
        if (updates.hoursTotal !== undefined) dbPayload.hours_total = updates.hoursTotal;
        if (updates.hoursCompleted !== undefined) dbPayload.hours_completed = updates.hoursCompleted;
        if (updates.status !== undefined) dbPayload.status = updates.status;
        if (updates.scheduleDay !== undefined) dbPayload.schedule_day = updates.scheduleDay;
        if (updates.priority !== undefined) dbPayload.priority = updates.priority;
        if (updates.url !== undefined) dbPayload.url = updates.url;

        await supabase
          .from('learning_paths')
          .update(dbPayload)
          .eq('id', id)
          .eq('user_id', userId);
      }
    } catch {
      // Ignore
    }

    const existing = await this.getCourses(userId);
    const updated = existing.map(c => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem(`pathpilot-courses-${userId}`, JSON.stringify(updated));
    return true;
  }

  /**
   * Delete course
   */
  static async deleteCourse(userId: string, id: string): Promise<boolean> {
    try {
      if (supabase) {
        await supabase
          .from('learning_paths')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
      }
    } catch {
      // Ignore
    }

    const existing = await this.getCourses(userId);
    const updated = existing.filter(c => c.id !== id);
    localStorage.setItem(`pathpilot-courses-${userId}`, JSON.stringify(updated));
    return true;
  }

  /**
   * Analyze Skill Gap via AI API Endpoint
   */
  static async analyzeSkillGap(params: {
    targetRole: string;
    currentSkills: string[];
    missingSkills: string[];
    experienceLevel?: string;
    industry?: string;
  }): Promise<SkillGapAnalysisResult> {
    const res = await fetch('/api/learning/skill-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error('Failed to compute skill gap analysis');
    }

    return res.json();
  }

  /**
   * Fetch Course Recommendations via AI API Endpoint
   */
  static async getCourseRecommendations(params: {
    targetRole: string;
    skillGap?: string;
    preferredPlatform?: string;
    weeklyHoursAvailable?: number;
    learningStyle?: string;
  }): Promise<{ recommendations: CourseRecommendation[] }> {
    const res = await fetch('/api/learning/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error('Failed to retrieve learning recommendations');
    }

    return res.json();
  }

  /**
   * Analyze Certification Exam Readiness via AI API Endpoint
   */
  static async analyzeCertificationReadiness(params: {
    certificationTitle: string;
    currentSkills: string[];
  }): Promise<CertificationReadinessResult> {
    const res = await fetch('/api/learning/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error('Failed to calculate certification readiness');
    }

    return res.json();
  }

  /**
   * Generate Custom Learning Syllabus via AI API Endpoint
   */
  static async generateCustomSyllabus(params: {
    topic: string;
    targetRole: string;
    depth?: string;
  }): Promise<GeneratedSyllabusPlan> {
    const res = await fetch('/api/learning/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error('Failed to generate custom syllabus');
    }

    return res.json();
  }
}

