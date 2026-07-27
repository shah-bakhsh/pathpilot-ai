/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { 
  InterviewSession, 
  InterviewNote, 
  InterviewSettings, 
  Achievement,
  Question
} from '../components/views/interview/InterviewTypes';
import { INITIAL_HISTORICAL_SESSIONS, INITIAL_ACHIEVEMENTS } from '../components/views/interview/mockData';

const LOCAL_SESSIONS_KEY = 'pathpilot_interview_sessions';
const LOCAL_NOTES_KEY = 'pathpilot_interview_notes';
const LOCAL_SETTINGS_KEY = 'pathpilot_interview_settings';
const LOCAL_ACHIEVEMENTS_KEY = 'pathpilot_interview_achievements';

export const DEFAULT_INTERVIEW_SETTINGS: InterviewSettings = {
  persona: 'FAANG Senior Evaluator',
  voiceSpeed: 1.0,
  targetCompanies: ['Google', 'Meta', 'Amazon', 'Apple', 'OpenAI'],
  includeResumeContext: true,
  autoSpeechPlayback: false,
  strictnessLevel: 'Standard',
  customPromptTemplates: [
    'Focus heavily on edge cases, scalability, and system bottlenecks.',
    'Evaluate strictly using the STAR methodology (Situation, Task, Action, Result).',
    'Assess system design trade-offs: SQL vs NoSQL, consistency vs availability.'
  ]
};

export class InterviewService {
  /**
   * Fetch all user interview sessions.
   */
  static async getInterviewSessions(userId?: string): Promise<InterviewSession[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            type: item.type,
            company: item.company,
            difficulty: item.difficulty,
            category: item.category,
            durationSeconds: item.duration_seconds || item.durationSeconds || 300,
            timestamp: item.created_at || item.timestamp,
            overallScore: item.overall_score || item.overallScore || 80,
            communicationScore: item.communication_score || item.communicationScore || 80,
            technicalScore: item.technical_score || item.technicalScore || 80,
            behavioralScore: item.behavioral_score || item.behavioralScore || 80,
            confidenceScore: item.confidence_score || item.confidenceScore || 80,
            leadershipScore: item.leadership_score || item.leadershipScore || 80,
            problemSolvingScore: item.problem_solving_score || item.problemSolvingScore || 80,
            professionalismScore: item.professionalism_score || item.professionalismScore || 80,
            hiringRecommendation: item.hiring_recommendation || item.hiringRecommendation,
            dialogue: item.dialogue || [],
            strengths: item.strengths || [],
            weaknesses: item.weaknesses || [],
            missingConcepts: item.missing_concepts || item.missingConcepts || [],
            remedy: item.remedy || '',
            practicePlan: item.practice_plan || item.practicePlan || [],
            resources: item.resources || [],
            notes: item.notes || '',
            xpEarned: item.xp_earned || item.xpEarned || 100
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch interview_sessions failed, falling back to localStorage.', err);
      }
    }

    // Fallback to Local Storage
    const saved = localStorage.getItem(LOCAL_SESSIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved interview sessions:', e);
      }
    }

    // Default mock data
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(INITIAL_HISTORICAL_SESSIONS));
    return INITIAL_HISTORICAL_SESSIONS;
  }

  /**
   * Save a completed interview session.
   */
  static async saveInterviewSession(session: InterviewSession, userId?: string): Promise<void> {
    // Update local storage first
    const existing = await this.getInterviewSessions(userId);
    const updated = [session, ...existing.filter(s => s.id !== session.id)];
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('interview_sessions').upsert({
          id: session.id,
          user_id: userId,
          type: session.type,
          company: session.company,
          difficulty: session.difficulty,
          category: session.category,
          duration_seconds: session.durationSeconds,
          overall_score: session.overallScore,
          communication_score: session.communicationScore,
          technical_score: session.technicalScore,
          behavioral_score: session.behavioralScore,
          confidence_score: session.confidenceScore,
          leadership_score: session.leadershipScore,
          problem_solving_score: session.problemSolvingScore,
          professionalism_score: session.professionalismScore,
          hiring_recommendation: session.hiringRecommendation,
          dialogue: session.dialogue,
          strengths: session.strengths,
          weaknesses: session.weaknesses,
          missing_concepts: session.missingConcepts,
          remedy: session.remedy,
          practice_plan: session.practicePlan,
          resources: session.resources,
          notes: session.notes,
          xp_earned: session.xpEarned,
          created_at: session.timestamp
        });
      } catch (err) {
        console.warn('Supabase save interview_session failed, stored in localStorage.', err);
      }
    }
  }

  /**
   * Fetch User Interview Settings.
   */
  static async getSettings(userId?: string): Promise<InterviewSettings> {
    const saved = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_INTERVIEW_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_INTERVIEW_SETTINGS;
  }

  /**
   * Save User Interview Settings.
   */
  static async saveSettings(settings: InterviewSettings, userId?: string): Promise<void> {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('interview_settings').upsert({
          user_id: userId,
          persona: settings.persona,
          voice_speed: settings.voiceSpeed,
          target_companies: settings.targetCompanies,
          include_resume_context: settings.includeResumeContext,
          auto_speech_playback: settings.autoSpeechPlayback,
          strictness_level: settings.strictnessLevel,
          custom_prompt_templates: settings.customPromptTemplates,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase save settings failed, stored in localStorage.', err);
      }
    }
  }

  /**
   * Fetch User Notes.
   */
  static async getNotes(userId?: string): Promise<InterviewNote[]> {
    const saved = localStorage.getItem(LOCAL_NOTES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  }

  /**
   * Save a Note.
   */
  static async saveNote(note: InterviewNote, userId?: string): Promise<InterviewNote[]> {
    const existing = await this.getNotes(userId);
    const updated = [note, ...existing.filter(n => n.id !== note.id)];
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Delete a Note.
   */
  static async deleteNote(noteId: string, userId?: string): Promise<InterviewNote[]> {
    const existing = await this.getNotes(userId);
    const updated = existing.filter(n => n.id !== noteId);
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Fetch Achievements.
   */
  static async getAchievements(): Promise<Achievement[]> {
    const saved = localStorage.getItem(LOCAL_ACHIEVEMENTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
    return INITIAL_ACHIEVEMENTS;
  }

  /**
   * Save Achievements.
   */
  static async saveAchievements(achievements: Achievement[]): Promise<void> {
    localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}
