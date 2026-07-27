/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  AiConversation,
  AiMessage,
  AiMemoryFact,
  AiRecommendation,
  GoalPlan,
  CareerInsight,
  LearningRecommendationItem,
  CoachMode,
  UserProfile,
  ResumeRecord,
  JobApplication
} from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'pathpilot_ai_conversations',
  MESSAGES: 'pathpilot_ai_messages',
  MEMORY: 'pathpilot_ai_memory_facts',
  RECOMMENDATIONS: 'pathpilot_ai_recommendations',
  GOALS: 'pathpilot_ai_goal_plans',
  INSIGHTS: 'pathpilot_ai_career_insights',
  LEARNING: 'pathpilot_ai_learning_recs',
  SETTINGS: 'pathpilot_ai_coach_settings'
};

// Helper for Local Storage Fallback
function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.warn(`Failed reading localStorage key: ${key}`, err);
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing localStorage key: ${key}`, err);
  }
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export interface CoachSettings {
  personalityStyle: 'direct' | 'supportive' | 'socratic' | 'executive';
  includeResumeContext: boolean;
  includeProfileContext: boolean;
  includeApplicationsContext: boolean;
  includeMemoryContext: boolean;
  customInstructions: string;
}

const DEFAULT_SETTINGS: CoachSettings = {
  personalityStyle: 'executive',
  includeResumeContext: true,
  includeProfileContext: true,
  includeApplicationsContext: true,
  includeMemoryContext: true,
  customInstructions: 'Provide actionable, high-impact career guidance with concrete next steps.'
};

export class AiCoachService {
  // --- CONVERSATIONS ---
  static async getConversations(userId: string): Promise<AiConversation[]> {
    if (isSupabaseConfigured() && isValidUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          return data.map(c => ({
            id: c.id,
            userId: c.user_id,
            title: c.title,
            category: c.category || 'General',
            coachMode: c.coach_mode || 'general',
            isPinned: !!c.is_pinned,
            isArchived: !!c.is_archived,
            isFavorite: !!c.is_favorite,
            folderId: c.folder_id,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch conversations error, falling back:', err);
      }
    }

    const all = getLocalData<AiConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    return all.filter(c => c.userId === userId);
  }

  static async createConversation(
    userId: string,
    title: string = 'New Session',
    category: string = 'General',
    coachMode: CoachMode = 'general'
  ): Promise<AiConversation> {
    const newConv: AiConversation = {
      id: generateUUID(),
      userId,
      title,
      category,
      coachMode,
      isPinned: false,
      isArchived: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messagesCount: 0
    };

    if (isSupabaseConfigured() && isValidUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('ai_conversations')
          .insert([{
            user_id: userId,
            title,
            category,
            coach_mode: coachMode,
            is_pinned: false,
            is_archived: false,
            is_favorite: false
          }])
          .select()
          .single();

        if (!error && data) {
          newConv.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase create conversation failed, using local:', err);
      }
    }

    const all = getLocalData<AiConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    all.unshift(newConv);
    setLocalData(STORAGE_KEYS.CONVERSATIONS, all);
    return newConv;
  }

  static async updateConversation(
    userId: string,
    convId: string,
    updates: Partial<AiConversation>
  ): Promise<void> {
    if (isSupabaseConfigured() && isValidUUID(convId) && isValidUUID(userId)) {
      try {
        const payload: any = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.coachMode !== undefined) payload.coach_mode = updates.coachMode;
        if (updates.isPinned !== undefined) payload.is_pinned = updates.isPinned;
        if (updates.isArchived !== undefined) payload.is_archived = updates.isArchived;
        if (updates.isFavorite !== undefined) payload.is_favorite = updates.isFavorite;

        await supabase
          .from('ai_conversations')
          .update(payload)
          .eq('id', convId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase update conversation failed:', err);
      }
    }

    const all = getLocalData<AiConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    const idx = all.findIndex(c => c.id === convId && c.userId === userId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      setLocalData(STORAGE_KEYS.CONVERSATIONS, all);
    }
  }

  static async deleteConversation(userId: string, convId: string): Promise<void> {
    if (isSupabaseConfigured() && isValidUUID(convId) && isValidUUID(userId)) {
      try {
        await supabase
          .from('ai_conversations')
          .delete()
          .eq('id', convId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete conversation failed:', err);
      }
    }

    const all = getLocalData<AiConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    const filtered = all.filter(c => !(c.id === convId && c.userId === userId));
    setLocalData(STORAGE_KEYS.CONVERSATIONS, filtered);

    // Delete associated messages
    const allMsgs = getLocalData<Record<string, AiMessage[]>>(STORAGE_KEYS.MESSAGES, {});
    delete allMsgs[convId];
    setLocalData(STORAGE_KEYS.MESSAGES, allMsgs);
  }

  // --- MESSAGES ---
  static async getMessages(userId: string, convId: string): Promise<AiMessage[]> {
    if (isSupabaseConfigured() && isValidUUID(convId)) {
      try {
        const { data, error } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data.map(m => ({
            id: m.id,
            conversationId: m.conversation_id,
            userId: m.user_id,
            sender: m.sender,
            content: m.content,
            timestamp: m.created_at,
            modelUsed: m.model_used,
            tokensCount: m.tokens_count,
            feedbackRating: m.feedback_rating,
            contextUsed: m.context_used
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch messages error, falling back:', err);
      }
    }

    const allMsgs = getLocalData<Record<string, AiMessage[]>>(STORAGE_KEYS.MESSAGES, {});
    return allMsgs[convId] || [];
  }

  static async addMessage(
    userId: string,
    convId: string,
    sender: 'user' | 'assistant' | 'system',
    content: string,
    contextUsed?: { resumeLoaded?: boolean; profileLoaded?: boolean; goalsLoaded?: boolean }
  ): Promise<AiMessage> {
    const newMsg: AiMessage = {
      id: generateUUID(),
      conversationId: convId,
      userId,
      sender,
      content,
      timestamp: new Date().toISOString(),
      modelUsed: 'gemini-3.6-flash',
      contextUsed
    };

    if (isSupabaseConfigured() && isValidUUID(convId) && isValidUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('ai_messages')
          .insert([{
            conversation_id: convId,
            user_id: userId,
            sender,
            content,
            model_used: 'gemini-3.6-flash',
            context_used: contextUsed || {}
          }])
          .select()
          .single();

        if (!error && data) {
          newMsg.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase add message failed:', err);
      }
    }

    const allMsgs = getLocalData<Record<string, AiMessage[]>>(STORAGE_KEYS.MESSAGES, {});
    if (!allMsgs[convId]) allMsgs[convId] = [];
    allMsgs[convId].push(newMsg);
    setLocalData(STORAGE_KEYS.MESSAGES, allMsgs);

    // Update conversation timestamp & snippet
    await this.updateConversation(userId, convId, {
      updatedAt: new Date().toISOString(),
      lastMessageSnippet: content.substring(0, 80)
    });

    return newMsg;
  }

  // --- MEMORY FACTS SYSTEM ---
  static async getMemoryFacts(userId: string): Promise<AiMemoryFact[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('ai_memory')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(m => ({
            id: m.id,
            userId: m.user_id,
            memoryKey: m.memory_key,
            memoryValue: m.memory_value,
            category: m.category,
            createdAt: m.created_at,
            updatedAt: m.updated_at
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch memory failed:', err);
      }
    }

    const all = getLocalData<AiMemoryFact[]>(STORAGE_KEYS.MEMORY, []);
    return all.filter(m => m.userId === userId);
  }

  static async saveMemoryFact(
    userId: string,
    key: string,
    value: string,
    category: 'goal' | 'tech_stack' | 'preference' | 'experience' | 'constraint' | 'career_path'
  ): Promise<AiMemoryFact> {
    const fact: AiMemoryFact = {
      id: 'mem_' + Math.random().toString(36).substring(2, 11),
      userId,
      memoryKey: key,
      memoryValue: value,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('ai_memory')
          .upsert([{
            user_id: userId,
            memory_key: key,
            memory_value: value,
            category,
            updated_at: new Date().toISOString()
          }], { onConflict: 'user_id,memory_key' })
          .select()
          .single();

        if (data) fact.id = data.id;
      } catch (err) {
        console.warn('Supabase save memory failed:', err);
      }
    }

    const all = getLocalData<AiMemoryFact[]>(STORAGE_KEYS.MEMORY, []);
    const idx = all.findIndex(m => m.userId === userId && m.memoryKey === key);
    if (idx !== -1) {
      all[idx] = fact;
    } else {
      all.unshift(fact);
    }
    setLocalData(STORAGE_KEYS.MEMORY, all);
    return fact;
  }

  static async deleteMemoryFact(userId: string, factId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('ai_memory')
          .delete()
          .eq('id', factId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete memory failed:', err);
      }
    }

    const all = getLocalData<AiMemoryFact[]>(STORAGE_KEYS.MEMORY, []);
    setLocalData(STORAGE_KEYS.MEMORY, all.filter(m => !(m.id === factId && m.userId === userId)));
  }

  // --- COACH SETTINGS ---
  static getSettings(userId: string): CoachSettings {
    const key = `${STORAGE_KEYS.SETTINGS}_${userId}`;
    return getLocalData<CoachSettings>(key, DEFAULT_SETTINGS);
  }

  static saveSettings(userId: string, settings: CoachSettings): void {
    const key = `${STORAGE_KEYS.SETTINGS}_${userId}`;
    setLocalData(key, settings);
  }

  // --- AI RECOMMENDATIONS ---
  static async getRecommendations(userId: string): Promise<AiRecommendation[]> {
    const all = getLocalData<AiRecommendation[]>(STORAGE_KEYS.RECOMMENDATIONS, []);
    const userRecs = all.filter(r => r.userId === userId);
    
    if (userRecs.length === 0) {
      // Seed initial high-quality default recommendations
      const defaults: AiRecommendation[] = [
        {
          id: 'rec_1',
          userId,
          category: 'resume',
          title: 'Quantify Engineering Impacts',
          description: 'Add specific percentage increases or metric improvements to your primary work experience bullet points.',
          actionLabel: 'Open Resume Builder',
          priority: 'high',
          isCompleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec_2',
          userId,
          category: 'job_search',
          title: 'Target Top 5 Priority Applications',
          description: 'Tailor your application package for mid-to-senior software developer positions posted in the past 7 days.',
          actionLabel: 'View Applications',
          priority: 'high',
          isCompleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec_3',
          userId,
          category: 'skill_building',
          title: 'Master Cloud Native Architecture',
          description: 'Complete a weekend proof-of-concept deploying containerized microservices on Google Cloud Run.',
          actionLabel: 'Start Learning Path',
          priority: 'medium',
          isCompleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec_4',
          userId,
          category: 'interview',
          title: 'System Design Drill: Scalable Caching',
          description: 'Practice high-level architectural trade-offs using our AI Interview Simulator.',
          actionLabel: 'Launch Simulator',
          priority: 'medium',
          isCompleted: false,
          createdAt: new Date().toISOString()
        }
      ];
      setLocalData(STORAGE_KEYS.RECOMMENDATIONS, [...all, ...defaults]);
      return defaults;
    }
    return userRecs;
  }

  static async toggleRecommendation(userId: string, recId: string): Promise<void> {
    const all = getLocalData<AiRecommendation[]>(STORAGE_KEYS.RECOMMENDATIONS, []);
    const idx = all.findIndex(r => r.id === recId && r.userId === userId);
    if (idx !== -1) {
      all[idx].isCompleted = !all[idx].isCompleted;
      setLocalData(STORAGE_KEYS.RECOMMENDATIONS, all);
    }
  }

  // --- GOAL PLANS ---
  static async getGoalPlans(userId: string): Promise<GoalPlan[]> {
    const all = getLocalData<GoalPlan[]>(STORAGE_KEYS.GOALS, []);
    const userGoals = all.filter(g => g.userId === userId);

    if (userGoals.length === 0) {
      const defaultGoal: GoalPlan = {
        id: 'goal_def_1',
        userId,
        goalTitle: 'Transition to Senior Full-Stack Engineer',
        targetRole: 'Senior Full-Stack Engineer',
        timeframe: '6 Months',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        milestones: [
          { id: 'm_1', title: 'Achieve 85+ ATS Score on Primary Resume', completed: true },
          { id: 'm_2', title: 'Complete 3 Production Cloud Projects', completed: true },
          { id: 'm_3', title: 'Conduct 5 AI System Design Interview Drills', completed: false },
          { id: 'm_4', title: 'Apply to 15 Tier-1 Target Positions', completed: false },
          { id: 'm_5', title: 'Negotiate Top-Decile Compensation Offer', completed: false }
        ]
      };
      setLocalData(STORAGE_KEYS.GOALS, [...all, defaultGoal]);
      return [defaultGoal];
    }
    return userGoals;
  }

  static async saveGoalPlan(userId: string, goalPlan: GoalPlan): Promise<GoalPlan> {
    const all = getLocalData<GoalPlan[]>(STORAGE_KEYS.GOALS, []);
    const idx = all.findIndex(g => g.id === goalPlan.id && g.userId === userId);
    if (idx !== -1) {
      all[idx] = { ...goalPlan, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(goalPlan);
    }
    setLocalData(STORAGE_KEYS.GOALS, all);
    return goalPlan;
  }

  // --- CAREER INSIGHTS ---
  static async getCareerInsights(userId: string): Promise<CareerInsight[]> {
    const all = getLocalData<CareerInsight[]>(STORAGE_KEYS.INSIGHTS, []);
    const userInsights = all.filter(i => i.userId === userId);

    if (userInsights.length === 0) {
      const defaultInsights: CareerInsight[] = [
        {
          id: 'ins_1',
          userId,
          category: 'skill_gap',
          title: 'Cloud Native & Distributed Systems Advantage',
          score: 82,
          summary: 'Your core TypeScript and React competencies are robust. Strengthening Cloud Infrastructure & Docker orchestration will unlock senior-level roles.',
          detailPoints: [
            'High alignment with Frontend and API layer roles.',
            'Containerization and CI/CD pipelines represent the highest ROI growth vector.',
            'Estimated salary uplift of 15-20% upon adding Cloud Certifications.'
          ],
          impact: 'high',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ins_2',
          userId,
          category: 'readiness',
          title: 'ATS Market Alignment Benchmark',
          score: 88,
          summary: 'Your current primary resume passes technical ATS parsing with top marks for engineering terminology and formatting structure.',
          detailPoints: [
            'Clear keyword density for modern web stack.',
            'Bullet structures showcase measurable business outcomes.',
            'Recommend adding 2 open-source repository links to boost recruiter engagement.'
          ],
          impact: 'high',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ins_3',
          userId,
          category: 'market_value',
          title: 'Market Value & Compensation Trajectory',
          score: 91,
          summary: 'Target roles in your region average $130,000 - $165,000 base compensation with equity packages.',
          detailPoints: [
            'High demand across Fintech, AI SaaS, and Cloud Infrastructure.',
            'Remote roles offer competitive global parity.',
            'Strong negotiation posture backed by verified project portfolios.'
          ],
          impact: 'medium',
          createdAt: new Date().toISOString()
        }
      ];
      setLocalData(STORAGE_KEYS.INSIGHTS, [...all, ...defaultInsights]);
      return defaultInsights;
    }
    return userInsights;
  }

  // --- LEARNING RECOMMENDATIONS ---
  static async getLearningRecommendations(userId: string): Promise<LearningRecommendationItem[]> {
    const all = getLocalData<LearningRecommendationItem[]>(STORAGE_KEYS.LEARNING, []);
    const userLearning = all.filter(l => l.userId === userId);

    if (userLearning.length === 0) {
      const defaultLearning: LearningRecommendationItem[] = [
        {
          id: 'lr_1',
          userId,
          title: 'Google Cloud Run & Serverless Masterclass',
          provider: 'Google Cloud Docs',
          duration: '6 Hours',
          skillTarget: 'Cloud Deployment',
          difficulty: 'intermediate',
          estimatedHours: 6,
          resourceUrl: 'https://cloud.google.com/run/docs',
          isCompleted: false,
          progressPercent: 40
        },
        {
          id: 'lr_2',
          userId,
          title: 'Advanced System Design Patterns & Trade-offs',
          provider: 'PathPilot AI Curriculum',
          duration: '10 Hours',
          skillTarget: 'System Design',
          difficulty: 'advanced',
          estimatedHours: 10,
          resourceUrl: '#interview',
          isCompleted: false,
          progressPercent: 20
        },
        {
          id: 'lr_3',
          userId,
          title: 'TypeScript Performance Optimization & Generics',
          provider: 'TypeScript Official Handbook',
          duration: '4 Hours',
          skillTarget: 'TypeScript',
          difficulty: 'intermediate',
          estimatedHours: 4,
          resourceUrl: 'https://www.typescriptlang.org/docs/',
          isCompleted: true,
          progressPercent: 100
        }
      ];
      setLocalData(STORAGE_KEYS.LEARNING, [...all, ...defaultLearning]);
      return defaultLearning;
    }
    return userLearning;
  }

  static async toggleLearningItem(userId: string, itemId: string): Promise<void> {
    const all = getLocalData<LearningRecommendationItem[]>(STORAGE_KEYS.LEARNING, []);
    const idx = all.findIndex(l => l.id === itemId && l.userId === userId);
    if (idx !== -1) {
      all[idx].isCompleted = !all[idx].isCompleted;
      all[idx].progressPercent = all[idx].isCompleted ? 100 : 50;
      setLocalData(STORAGE_KEYS.LEARNING, all);
    }
  }

  // --- MAIN CHAT DISPATCHER WITH FULL CONTEXT INJECTION ---
  static async sendMessageToCoach(
    userId: string,
    convId: string,
    messageText: string,
    coachMode: CoachMode = 'general',
    fullContext?: {
      profile?: UserProfile | null;
      primaryResume?: ResumeRecord | null;
      applications?: JobApplication[];
    }
  ): Promise<string> {
    // 1. Save user message
    await this.addMessage(userId, convId, 'user', messageText, {
      resumeLoaded: !!fullContext?.primaryResume,
      profileLoaded: !!fullContext?.profile,
      goalsLoaded: true
    });

    // 2. Fetch history
    const history = await this.getMessages(userId, convId);
    const settings = this.getSettings(userId);
    const memoryFacts = await this.getMemoryFacts(userId);

    // 3. Construct rich prompt context
    let systemContext = `User ID: ${userId}\n`;

    if (settings.includeProfileContext && fullContext?.profile) {
      const p = fullContext.profile;
      systemContext += `PROFILE DETAILS:
- Name: ${p.name || p.firstName || 'Candidate'}
- Target Role: ${p.currentTargetGoal || 'Software Professional'}
- Experience Level: ${p.experienceLevel || 'Mid-Level'}
- University/Education: ${p.university || p.degree || 'Not specified'}
- Key Skills: ${p.skills?.join(', ') || 'TypeScript, React, Node.js'}
`;
    }

    if (settings.includeResumeContext && fullContext?.primaryResume) {
      const r = fullContext.primaryResume;
      systemContext += `PRIMARY RESUME DATA:
- Title: ${r.title}
- Target Role: ${r.targetRole}
- Summary: ${r.content.summary || 'N/A'}
- Top Experience: ${r.content.experience?.slice(0, 2).map(e => `${e.title} at ${e.subtitle}`).join('; ') || 'N/A'}
- Skills Listed: ${r.content.skills?.map(s => s.items.join(', ')).join('; ') || 'N/A'}
`;
    }

    if (settings.includeApplicationsContext && fullContext?.applications?.length) {
      systemContext += `ACTIVE JOB APPLICATIONS (${fullContext.applications.length}):
${fullContext.applications.slice(0, 5).map(a => `- ${a.role} at ${a.company} (Status: ${a.status})`).join('\n')}
`;
    }

    if (settings.includeMemoryContext && memoryFacts.length > 0) {
      systemContext += `PERSISTENT MEMORY FACTS (Things remembered about this user):
${memoryFacts.map(m => `- [${m.category}] ${m.memoryKey}: ${m.memoryValue}`).join('\n')}
`;
    }

    systemContext += `\nCOACH PERSONALITY STYLE: ${settings.personalityStyle.toUpperCase()}
CUSTOM INSTRUCTIONS: ${settings.customInstructions || 'Be practical, direct, and encouraging.'}`;

    // 4. Call server endpoint
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText,
          history: history.map(m => ({ sender: m.sender, text: m.content })),
          targetRole: fullContext?.profile?.currentTargetGoal || fullContext?.primaryResume?.targetRole || 'Software Professional',
          coachMode,
          systemContext
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || "I've processed your message and reviewed your career telemetry. Let's continue accelerating your career growth!";

      // 5. Save assistant reply
      await this.addMessage(userId, convId, 'assistant', replyText, {
        resumeLoaded: !!fullContext?.primaryResume,
        profileLoaded: !!fullContext?.profile,
        goalsLoaded: true
      });

      // 6. Auto-extract memory fact if message contains key statements
      this.attemptAutoMemoryExtract(userId, messageText);

      return replyText;
    } catch (err: any) {
      console.error('Error sending message to AI coach:', err);
      const fallbackReply = `I've analyzed your career profile and active target goals. While maintaining continuous background synchronization, here is my guidance on your inquiry:\n\n1. **Immediate Focus**: Focus on strengthening your core project demonstrations and metric-driven accomplishments.\n2. **Target Strategy**: Align your technical resume with high-priority job requirements in your active applications pipeline.\n3. **Next Steps**: Tell me which specific company or project you would like to prepare for next!`;

      await this.addMessage(userId, convId, 'assistant', fallbackReply);
      return fallbackReply;
    }
  }

  // Automatic memory extraction heuristics
  private static attemptAutoMemoryExtract(userId: string, text: string): void {
    const lower = text.toLowerCase();
    if (lower.includes('i want to become a') || lower.includes('my goal is to be a') || lower.includes('targeting roles in')) {
      const match = text.match(/(become a|goal is to be a|targeting roles in)\s+([A-Za-z0-9\s]+)/i);
      if (match && match[2]) {
        this.saveMemoryFact(userId, 'Target Role Goal', match[2].trim(), 'goal');
      }
    }
    if (lower.includes('i know') || lower.includes('i use') || lower.includes('proficient in')) {
      const match = text.match(/(proficient in|experienced with|know)\s+([A-Za-z0-9,\s]+)/i);
      if (match && match[2]) {
        this.saveMemoryFact(userId, 'Stated Tech Stack', match[2].trim(), 'tech_stack');
      }
    }
  }
}

export default AiCoachService;
