/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shared Type Definitions for PathPilot AI
 */

export interface ProfileExperience {
  id?: string;
  company: string;
  role: string;
  duration: string;
  bullet: string;
}

export interface ProfileEducation {
  id?: string;
  school: string;
  degree: string;
  major?: string;
  year: string;
}

export interface ProfileProject {
  id?: string;
  title: string;
  tech: string;
  desc: string;
}

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  joinedAt: string;
  activeStreak: number;
  experiencePoints: number;
  currentTargetGoal: string;
  
  // Profile Media & Branding
  avatarUrl?: string;
  coverUrl?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  
  // Academic & Educational
  university?: string;
  degree?: string;
  major?: string;
  graduationYear?: string;
  currentStatus?: string; // Student, Job Seeker, Employed, Career Changer
  
  // Professional & Skills
  experienceLevel?: string; // Entry, Mid, Senior, Lead
  industry?: string;
  skills?: string[];
  certifications?: string[];
  achievements?: string[];
  languages?: string[];
  
  // Social & Web Presence
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  
  // Structured Timelines
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  projects?: ProfileProject[];
  
  // Preferences
  preferredLanguage?: string;
  timezone?: string;
  
  // Completion score
  profileCompletionPercent?: number;

  onboardingCompleted?: boolean;
  onboardingData?: {
    country?: string;
    city?: string;
    university?: string;
    degree?: string;
    currentSemester?: string;
    graduationYear?: string;
    preferredLanguage?: string;
    timezone?: string;
    careerGoals?: string[];
    selectedSkills?: string[];
    experienceSummary?: {
      projectsCompleted?: number;
      hackathons?: number;
      internships?: number;
      workExperienceYears?: number;
      openSourceContribution?: boolean;
      researchCompleted?: boolean;
    };
    resumeMetadata?: {
      name?: string;
      size?: number;
      uploadedAt?: string;
    };
  };
}

export interface ResumeSectionItem {
  id: string;
  title?: string;
  subtitle?: string; // e.g. Company, University
  location?: string;
  dateRange?: string;
  description?: string;
  bullets?: string[];
  link?: string;
  skills?: string[];
}

export interface ResumeContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    headline?: string;
  };
  summary: string;
  experience: ResumeSectionItem[];
  education: ResumeSectionItem[];
  projects: ResumeSectionItem[];
  skills: { category: string; items: string[] }[];
  certifications: ResumeSectionItem[];
  languages: { language: string; proficiency: string }[];
  achievements: string[];
  volunteer?: ResumeSectionItem[];
  sectionOrder?: string[];
}

export interface ResumeRecord {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  templateId: 'modern' | 'minimal' | 'professional' | 'corporate' | 'creative' | 'tech' | 'startup' | 'executive';
  isPrimary: boolean;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersionRecord {
  id: string;
  resumeId: string;
  userId: string;
  versionNumber: number;
  versionName: string;
  content: ResumeContent;
  createdAt: string;
}

export interface ResumeFileRecord {
  id: string;
  userId: string;
  resumeId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  version: string;
  isActive: boolean;
  uploadedAt: string;
  publicUrl?: string;
}

export interface ResumeHistoryRecord {
  id: string;
  resumeId?: string;
  userId: string;
  actionType: 'created' | 'edited' | 'analyzed' | 'exported' | 'restored' | 'uploaded';
  description: string;
  createdAt: string;
}

export interface SkillRadarScores {
  languages: number; // 0-10
  frameworks: number;
  architecture: number;
  softSkills: number;
  testing: number;
  tooling: number;
}

export interface ResumeAnalysis {
  resumeHash: string;
  uploadedAt: string;
  readinessScore: number; // 0-100
  skillRadarScores: SkillRadarScores;
  structuralImprovements: string[];
  keywordsMissing: string[];
  keywordsFound: string[];
}

export interface RoadmapTask {
  id: string;
  text: string;
  checked: boolean;
  resourceName?: string;
  resourceUrl?: string;
  priority?: 'High' | 'Medium' | 'Low';
  estimatedHours?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  deadline?: string;
  category?: string;
  notes?: string;
}

export interface RoadmapPhase {
  phaseId: number;
  title: string;
  timeToComplete: string;
  milestones: RoadmapTask[];
  objective?: string;
  skillsGained?: string[];
}

export interface CareerRoadmap {
  id?: string;
  userId?: string;
  targetRole: string;
  generatedAt: string;
  activePhase: number;
  phases: RoadmapPhase[];
  
  // Multi-horizon views
  roadmap12Month?: RoadmapPhase[];
  roadmap6Month?: RoadmapPhase[];
  roadmap90Day?: RoadmapPhase[];
  roadmap30Day?: RoadmapPhase[];
  roadmap7Day?: RoadmapPhase[];
  todayTasks?: DailyMission[];
}

export interface DailyMission {
  id: string;
  userId?: string;
  text: string;
  title?: string;
  description?: string;
  completed: boolean;
  xpValue: number;
  timeMinutes: number;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'leetcode' | 'lecture' | 'resume' | 'project' | 'paper' | 'internship' | 'linkedin' | 'certification' | 'interview' | 'networking' | 'general';
  deadline?: string;
  completedAt?: string;
}

export interface WeeklyGoal {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  category: string;
  weekStartDate: string;
  weekEndDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: 'High' | 'Medium' | 'Low';
  tasksCount: number;
  completedTasksCount: number;
  xpValue: number;
  subtasks?: { id: string; text: string; completed: boolean }[];
  createdAt?: string;
}

export interface MonthlyGoal {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  monthYear: string; // e.g. "2026-08" or "August 2026"
  targetMetric?: string; // e.g. "10 Applications Submitted"
  currentMetric?: number;
  targetMetricValue?: number;
  status: 'pending' | 'in_progress' | 'completed';
  progressPercent: number; // 0 - 100
  xpValue: number;
  keyMilestones?: string[];
  createdAt?: string;
}

export interface CareerTimelineStage {
  id: string;
  userId?: string;
  phaseId: number;
  title: string;
  targetRole: string;
  startDate: string;
  estimatedCompletionDate: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progressPercent: number;
  milestonesCount: number;
  completedMilestonesCount: number;
  xpReward: number;
  highlights?: string[];
}

export interface LearningResourceItem {
  id: string;
  title: string;
  type: 'course' | 'book' | 'youtube' | 'documentation' | 'project' | 'research_paper' | 'practice_platform';
  provider: string;
  url: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  orderIndex: number;
  completed: boolean;
  notes?: string;
}

export interface StructuredLearningPlan {
  id: string;
  userId?: string;
  title: string;
  targetRole: string;
  category: string;
  estimatedHoursTotal: number;
  estimatedHoursCompleted: number;
  status: 'planned' | 'in_progress' | 'completed';
  progressPercent: number;
  resources: LearningResourceItem[];
  updatedAt?: string;
}

export interface CertificationPlan {
  id: string;
  userId?: string;
  title: string;
  issuer: string;
  cost?: string;
  examUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'planned' | 'in_progress' | 'completed' | 'expired' | 'upcoming';
  targetDate?: string;
  completionDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  skillsValidated?: string[];
}

export interface ProjectPlanItem {
  id: string;
  userId?: string;
  title: string;
  objective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry-Level' | 'Research-Level';
  estimatedDuration: string;
  portfolioValue: 'Essential' | 'High' | 'Medium';
  requiredSkills: string[];
  status: 'planned' | 'building' | 'review' | 'completed';
  completionPercent: number;
  repoUrl?: string;
  demoUrl?: string;
  aiArchitectureTips?: string;
}

export interface JobPrepChecklistItem {
  id: string;
  category: 'resume' | 'interview' | 'networking' | 'portfolio' | 'github' | 'linkedin' | 'applications' | 'mock_interviews';
  title: string;
  description?: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  xpValue: number;
  actionUrl?: string;
}

export interface RoadmapAnalyticsData {
  completionPercent: number;
  learningPercent: number;
  projectsPercent: number;
  applicationsPercent: number;
  interviewPercent: number;
  resumePercent: number;
  overallCareerProgress: number;
  totalXpEarned: number;
  currentLevel: number;
  activeStreakDays: number;
  weeklyProgressTrend: { week: string; tasksCompleted: number; xpEarned: number }[];
  categoryBreakdown: { category: string; value: number; color: string }[];
}

export interface RoadmapSettings {
  autoAdaptOnTaskComplete: boolean;
  dailyMissionTargetCount: number;
  reminderNotifications: boolean;
  weeklyReviewDay: 'Sunday' | 'Monday' | 'Friday';
  difficultyPreference: 'Balanced' | 'Aggressive' | 'Gentle';
  targetRoleOverride?: string;
}

export type MessageSender = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  lastActive: string;
  messages: ChatMessage[];
}

export interface InterviewQuestion {
  id: string;
  text: string;
  timeLimitSeconds: number;
}

export interface InterviewSession {
  id: string;
  targetCareer: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: string[];
  score?: number; // 0-100
  feedback?: string; // Markdown formatted structured feedback
}

export type OpportunityType = 'job' | 'internship' | 'scholarship';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  location: string;
  matchIndex: number; // 0-100
  requirements: string[];
  description: string;
  rewardValue?: string; // For scholarships
  applicationUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'streak';
  timestamp: string;
  read: boolean;
}

export type ThemeType = 'light' | 'dark' | 'system';

// --- Execution-Focused Modules Types ---

export interface LearningCourse {
  id: string;
  title: string;
  source: string;
  hoursTotal: number;
  hoursCompleted: number;
  status: 'not_started' | 'in_progress' | 'completed';
  scheduleDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  priority: 'low' | 'medium' | 'high';
  url?: string;
}

export interface PersonalProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: 'planning' | 'building' | 'review' | 'completed';
  completionPercent: number; // 0-100
  aiFeedback?: string;
}

export interface PortfolioLinks {
  portfolioWebsite: string;
  github: string;
  linkedin: string;
  behance: string;
  kaggle: string;
  medium: string;
  personalBlog: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  type: 'job' | 'internship' | 'scholarship' | 'competition' | 'hackathon';
  dateApplied: string;
  status: 'applied' | 'screening' | 'technical' | 'behavioral' | 'offer' | 'rejected' | 'negotiation';
  location?: string;
  salaryOffered?: string;
  jobUrl?: string;
  notes?: string;
  interviewDate?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  outcome?: string;
}

export interface InterviewRecord {
  id: string;
  company: string;
  role: string;
  date: string;
  notes?: string;
  score?: number;
  feedback?: string;
}

export interface PersonalBrandActivity {
  id: string;
  platform: 'linkedin' | 'github' | 'community' | 'event' | 'certification';
  title: string;
  description: string;
  date: string;
  engagementCount?: number;
  status: 'planned' | 'completed';
}

export interface CareerDocument {
  id: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'certificate' | 'transcript' | 'recommendation_letter' | 'portfolio_pdf';
  url: string;
  uploadedAt: string;
  size: string;
  version: string;
  score?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline' | 'application' | 'interview' | 'learning_goal' | 'daily_mission' | 'milestone' | 'monthly_goal';
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface CareerBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  xpReward: number;
}

// --- Phase 6: AI Career Coach & Persistent Memory Types ---

export type CoachMode = 
  | 'executive'     // Executive Career Strategist
  | 'interviewer'   // Technical & Behavioral Interviewer
  | 'critic'        // Resume & Profile Critic
  | 'negotiator'    // Salary & Offer Negotiator
  | 'mentor'        // Learning & Technical Mentor
  | 'general';      // General Career Guide

export interface AiConversation {
  id: string;
  userId: string;
  title: string;
  category?: string;
  coachMode?: CoachMode;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  messagesCount?: number;
  lastMessageSnippet?: string;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  userId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  tokensCount?: number;
  feedbackRating?: 'up' | 'down';
  contextUsed?: {
    resumeLoaded?: boolean;
    profileLoaded?: boolean;
    goalsLoaded?: boolean;
  };
}

export interface AiMemoryFact {
  id: string;
  userId: string;
  memoryKey: string;
  memoryValue: string;
  category: 'goal' | 'tech_stack' | 'preference' | 'experience' | 'constraint' | 'career_path';
  createdAt: string;
  updatedAt: string;
}

export interface AiRecommendation {
  id: string;
  userId: string;
  category: 'job_search' | 'skill_building' | 'networking' | 'resume' | 'interview';
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  createdAt: string;
}

export interface GoalPlanMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface GoalPlan {
  id: string;
  userId: string;
  goalTitle: string;
  targetRole: string;
  timeframe: string; // e.g. "3 Months", "6 Months"
  milestones: GoalPlanMilestone[];
  status: 'in_progress' | 'achieved' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface CareerInsight {
  id: string;
  userId: string;
  category: 'skill_gap' | 'market_value' | 'readiness' | 'opportunity';
  title: string;
  score?: number; // 0-100
  summary: string;
  detailPoints: string[];
  impact: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface LearningRecommendationItem {
  id: string;
  userId: string;
  title: string;
  provider: string; // e.g. "Google Cloud", "FreeCodeCamp", "Official Docs"
  duration: string;
  skillTarget: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  resourceUrl?: string;
  isCompleted: boolean;
  progressPercent: number;
}

// --- Phase 12: Enterprise Analytics, Intelligence, Admin & System Monitoring Types ---

export interface CareerIntelligenceInsight {
  readinessScore: number;
  percentileRank: number;
  estimatedSalaryRange: { min: string; max: string; median: string };
  marketDemandIndex: 'Very High' | 'High' | 'Moderate' | 'Emerging';
  trajectoryForecast90Days: number; // projected readiness in 90 days
  weeklyVelocityHours: number;
  riskFactors: string[];
  growthAccelerators: string[];
  aiStrategicSummary: string;
}

export interface DocumentAnalyticsData {
  totalDocuments: number;
  averageAtsScore: number;
  averageGrammarScore: number;
  averageReadabilityScore: number;
  recruiterMatchPrediction: number; // %
  topMissingKeywords: string[];
  topFoundKeywords: string[];
  documentTypeBreakdown: { type: string; count: number; avgScore: number }[];
  sectionPerformanceScores: { section: string; score: number }[];
}

export interface LearningAnalyticsSummary {
  totalStudyHours: number;
  completedCoursesCount: number;
  skillsMasteredCount: number;
  skillGapReductionPercent: number;
  certificationReadinessPercent: number;
  weeklyHoursHistory: { week: string; hours: number; target: number }[];
  skillMasteryLevels: { skill: string; mastery: number; category: string }[];
}

export interface InterviewAnalyticsSummary {
  totalDrillsCompleted: number;
  averageScore: number;
  technicalClarityScore: number;
  behavioralConfidenceScore: number;
  systemDesignScore: number;
  weakSpotTopics: { topic: string; errorRate: number; occurrences: number }[];
  scoreTrendHistory: { date: string; score: number; type: string }[];
}

export interface PipelineAnalyticsSummary {
  totalApplications: number;
  conversionFunnel: {
    saved: number;
    applied: number;
    screening: number;
    interviewing: number;
    offers: number;
    rejected: number;
  };
  funnelConversionRates: {
    appliedToScreen: number;
    screenToInterview: number;
    interviewToOffer: number;
  };
  averageResponseDays: number;
  weeklyApplicationVelocity: { week: string; count: number }[];
  topRejectionReasons: string[];
}

export interface AiTokenMetricsSummary {
  totalTokensUsed: number;
  estimatedCostUsd: number;
  totalAiCallsCount: number;
  averageLatencyMs: number;
  moduleUsageBreakdown: { module: string; tokens: number; percentage: number; calls: number }[];
  modelDistribution: { model: string; calls: number; percentage: number }[];
  dailyTokenHistory: { date: string; tokens: number; cost: number }[];
}

export interface SystemHealthMetrics {
  dbStatus: 'healthy' | 'degraded' | 'offline';
  dbResponseLatencyMs: number;
  activeRlsPoliciesCount: number;
  storageUsageMb: number;
  maxStorageLimitMb: number;
  apiSuccessRatePercent: number;
  errorRatePercent: number;
  activeConnections: number;
  cacheHitRatioPercent: number;
  uptimeSeconds: number;
  lastBackupTimestamp: string;
}

export interface SystemAuditLog {
  id: string;
  userId: string;
  userEmail?: string;
  action: string;
  category: 'auth' | 'security' | 'rls' | 'api' | 'admin' | 'data';
  severity: 'info' | 'warning' | 'error' | 'critical';
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ExecutiveReportConfig {
  reportTitle: string;
  dateRange: '7d' | '30d' | '90d' | 'all';
  includeCareerIntelligence: boolean;
  includeDocumentAnalytics: boolean;
  includeLearningAnalytics: boolean;
  includeInterviewAnalytics: boolean;
  includePipelineAnalytics: boolean;
  includeTokenMetrics: boolean;
  format: 'pdf' | 'excel' | 'csv' | 'json';
}

// --- Phase 13: Productivity, Collaboration, Task Management, Notes & Calendar Types ---

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'archived';
export type TaskCategoryType =
  | 'career'
  | 'learning'
  | 'projects'
  | 'interview'
  | 'applications'
  | 'research'
  | 'certification'
  | 'networking'
  | 'personal'
  | string;

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size?: string;
}

export interface ProductivityTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategoryType;
  dueDate?: string;
  estimatedTimeMinutes?: number;
  actualTimeMinutes?: number;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  tags?: string[];
  subtasks?: SubTask[];
  dependencies?: string[]; // Task IDs
  attachments?: TaskAttachment[];
  commentsCount?: number;
  xpValue?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NoteFolder {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  notesCount?: number;
  createdAt: string;
}

export interface ProductivityNote {
  id: string;
  userId: string;
  folderId?: string;
  title: string;
  content: string;
  type: 'rich' | 'markdown' | 'quick' | 'career' | 'interview' | 'research';
  tags?: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isShared?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | 'interview'
  | 'meeting'
  | 'learning_session'
  | 'deadline'
  | 'application'
  | 'hackathon'
  | 'scholarship'
  | 'research'
  | 'conference'
  | 'personal';

export interface CalendarAttendee {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface AdvancedCalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: EventType;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  location?: string;
  meetingLink?: string;
  completed: boolean;
  priority: TaskPriority;
  color?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  attendees?: CalendarAttendee[];
  createdAt: string;
}

export interface CalendarReminder {
  id: string;
  userId: string;
  eventId?: string;
  taskId?: string;
  title: string;
  remindAt: string;
  type: 'email' | 'in_app' | 'popup';
  sent: boolean;
  createdAt: string;
}

export interface CalendarMeeting {
  id: string;
  userId: string;
  title: string;
  hostName: string;
  participants: string[];
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  agenda?: string;
  notes?: string;
  actionItems?: string[];
  createdAt: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type:
    | 'resume_updated'
    | 'interview_completed'
    | 'application_submitted'
    | 'course_finished'
    | 'certificate_earned'
    | 'goal_completed'
    | 'achievement_unlocked'
    | 'ai_recommendation'
    | 'task_completed'
    | 'note_created';
  title: string;
  description: string;
  metaData?: Record<string, any>;
  xpEarned?: number;
  createdAt: string;
}

export interface DailyPlan {
  id: string;
  userId: string;
  planDate: string;
  focusSummary: string;
  targetFocusHours: number;
  actualFocusHours: number;
  productivityScore: number;
  aiSuggestions: string[];
  todayPriorities: string[];
  tasks: ProductivityTask[];
  createdAt: string;
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  goals: string[];
  interviewSessions: string[];
  applicationsTarget: number;
  learningHoursTarget: number;
  aiWeeklyFocusReport: string;
  createdAt: string;
}

export interface MonthlyPlan {
  id: string;
  userId: string;
  monthYear: string;
  theme: string;
  milestones: string[];
  targetOutcomes: string[];
  createdAt: string;
}

export interface WorkspaceSettings {
  id?: string;
  userId: string;
  workspaceName: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  preferredTimeZone: string;
  aiSchedulerEnabled: boolean;
  autoPrioritizeDeadlines: boolean;
  notificationsEnabled: boolean;
  themeMode: 'light' | 'dark' | 'system';
  createdAt?: string;
}

export interface TeamCollaborator {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'mentor' | 'coach' | 'collaborator' | 'viewer';
  avatarUrl?: string;
  status: 'active' | 'invited' | 'declined';
  joinedAt: string;
}

export interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRatePercent: number;
  totalFocusHours: number;
  productivityScore: number;
  streakDays: number;
  topCategory: string;
  pendingDeadlinesCount: number;
  upcomingInterviewsCount: number;
  weeklyFocusTrend: { day: string; focusHours: number; tasksDone: number }[];
  categoryDistribution: { category: string; count: number; color: string }[];
}

export interface NotificationPreference {
  id?: string;
  userId: string;
  emailAlerts: boolean;
  interviewReminders: boolean;
  deadlineAlerts: boolean;
  aiInsights: boolean;
  streakAlerts: boolean;
  weeklyReports: boolean;
}

export interface EnhancedNotification extends AppNotification {
  category?:
    | 'resume'
    | 'interview'
    | 'application'
    | 'scholarship'
    | 'learning'
    | 'certification'
    | 'project'
    | 'goal'
    | 'report'
    | 'ai'
    | 'system'
    | 'security';
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  isArchived?: boolean;
  isPinned?: boolean;
  actionUrl?: string;
}




