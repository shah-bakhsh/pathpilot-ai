/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import {
  LearningService,
  SkillGapAnalysisResult,
  CourseRecommendation,
  CertificationReadinessResult,
  GeneratedSyllabusPlan
} from '../services/learningService';
import { LearningCourse } from '../types';

export function useLearning() {
  const { user, addXp } = useAuth();
  const userId = user?.uid || user?.id || 'guest_user';

  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Skill Gap Analysis State
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysisResult | null>(null);
  const [analyzingSkillGap, setAnalyzingSkillGap] = useState<boolean>(false);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  // Certification Readiness State
  const [certificationReadiness, setCertificationReadiness] = useState<CertificationReadinessResult | null>(null);
  const [analyzingCertification, setAnalyzingCertification] = useState<boolean>(false);

  // Generated Syllabus State
  const [generatedSyllabus, setGeneratedSyllabus] = useState<GeneratedSyllabusPlan | null>(null);
  const [generatingSyllabus, setGeneratingSyllabus] = useState<boolean>(false);

  const fetchCourses = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await LearningService.getCourses(userId);
    setCourses(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (course: Omit<LearningCourse, 'id'>) => {
    if (!userId) return null;
    const created = await LearningService.addCourse(userId, course);
    if (created) {
      setCourses((prev) => [created, ...prev]);
      addXp(50);
    }
    return created;
  };

  const updateCourse = async (id: string, updates: Partial<LearningCourse>) => {
    if (!userId) return false;
    const ok = await LearningService.updateCourse(userId, id, updates);
    if (ok) {
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      if (updates.hoursCompleted && updates.hoursCompleted > 0) {
        addXp(15);
      }
      if (updates.status === 'completed') {
        addXp(150);
      }
    }
    return ok;
  };

  const deleteCourse = async (id: string) => {
    if (!userId) return false;
    const ok = await LearningService.deleteCourse(userId, id);
    if (ok) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
    return ok;
  };

  const runSkillGapAnalysis = async (customRole?: string) => {
    setAnalyzingSkillGap(true);
    try {
      const targetRole = customRole || user?.currentTargetGoal || 'Full Stack Software Engineer';
      const currentSkills = user?.skills || ['TypeScript', 'React 19', 'Node.js', 'PostgreSQL', 'Tailwind CSS'];
      const missingSkills = ['Redis Distributed Caching', 'Google Cloud Run Containerization', 'GraphQL APIs', 'System Design'];

      const result = await LearningService.analyzeSkillGap({
        targetRole,
        currentSkills,
        missingSkills,
        experienceLevel: user?.experienceLevel || 'Intermediate',
        industry: user?.industry || 'Technology'
      });

      setSkillGapAnalysis(result);
      addXp(30);
      return result;
    } catch (err) {
      console.error('Skill gap analysis error:', err);
      return null;
    } finally {
      setAnalyzingSkillGap(false);
    }
  };

  const fetchRecommendations = async (skillGapFilter?: string) => {
    setLoadingRecommendations(true);
    try {
      const targetRole = user?.currentTargetGoal || 'Software Engineer';
      const result = await LearningService.getCourseRecommendations({
        targetRole,
        skillGap: skillGapFilter || 'System Design & Distributed Systems',
        weeklyHoursAvailable: 12,
        learningStyle: 'Hands-on Projects & Video Tutorials'
      });

      setRecommendations(result.recommendations || []);
      return result.recommendations;
    } catch (err) {
      console.error('Fetch recommendations error:', err);
      return [];
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const checkCertificationReadiness = async (certTitle: string) => {
    setAnalyzingCertification(true);
    try {
      const currentSkills = user?.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'];
      const result = await LearningService.analyzeCertificationReadiness({
        certificationTitle: certTitle,
        currentSkills
      });

      setCertificationReadiness(result);
      addXp(25);
      return result;
    } catch (err) {
      console.error('Certification readiness error:', err);
      return null;
    } finally {
      setAnalyzingCertification(false);
    }
  };

  const generateSyllabus = async (topic: string) => {
    setGeneratingSyllabus(true);
    try {
      const targetRole = user?.currentTargetGoal || 'Software Engineer';
      const result = await LearningService.generateCustomSyllabus({
        topic,
        targetRole,
        depth: 'Intermediate'
      });

      setGeneratedSyllabus(result);
      addXp(40);

      // Auto add to courses if user wants
      if (result) {
        await addCourse({
          title: result.title,
          source: 'AI Generated Path',
          hoursTotal: result.estimatedHoursTotal || 20,
          hoursCompleted: 0,
          status: 'in_progress',
          scheduleDay: 'Tuesday',
          priority: 'high',
          url: 'https://ai.google.dev'
        });
      }

      return result;
    } catch (err) {
      console.error('Generate syllabus error:', err);
      return null;
    } finally {
      setGeneratingSyllabus(false);
    }
  };

  return {
    courses,
    loading,
    refetch: fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,

    // AI Features
    skillGapAnalysis,
    analyzingSkillGap,
    runSkillGapAnalysis,

    recommendations,
    loadingRecommendations,
    fetchRecommendations,

    certificationReadiness,
    analyzingCertification,
    checkCertificationReadiness,

    generatedSyllabus,
    generatingSyllabus,
    generateSyllabus,

    addXp
  };
}

