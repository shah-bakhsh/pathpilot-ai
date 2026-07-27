/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InterviewType =
  | 'HR Interview'
  | 'Behavioral Interview'
  | 'Technical Interview'
  | 'Coding Interview'
  | 'AI Interview'
  | 'System Design'
  | 'Frontend'
  | 'Backend'
  | 'Machine Learning'
  | 'Data Science'
  | 'Cybersecurity'
  | 'Product Management'
  | 'UI/UX'
  | 'Research'
  | 'Internship'
  | 'Scholarship'
  | 'University Admission'
  | 'Custom Interview';

export type CompanyName =
  | 'Google'
  | 'Microsoft'
  | 'Amazon'
  | 'Meta'
  | 'Apple'
  | 'Netflix'
  | 'Tesla'
  | 'OpenAI'
  | 'Anthropic'
  | 'NVIDIA'
  | 'Startups'
  | 'Custom Company';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type QuestionCategory =
  | 'Self Introduction'
  | 'Behavioral'
  | 'Leadership'
  | 'Communication'
  | 'Problem Solving'
  | 'Projects'
  | 'Resume'
  | 'Portfolio'
  | 'Coding'
  | 'Algorithms'
  | 'System Design'
  | 'AI'
  | 'Machine Learning'
  | 'Cloud'
  | 'Databases'
  | 'Career Goals'
  | 'Custom Questions';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  companies?: CompanyName[];
  points: number;
}

export type HiringRecommendation = 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire';

export interface STARMethodBreakdown {
  situation: string;
  task: string;
  action: string;
  result: string;
  completenessScore: number;
}

export interface RealTimeEvaluation {
  confidence: number;
  communication: number;
  grammar: number;
  clarity: number;
  vocabulary: number;
  professionalism: number;
  structure: number;
  technicalAccuracy: number;
  behavioralQuality: number;
  explanation: string;
  starBreakdown?: STARMethodBreakdown;
  hiringRecommendation?: HiringRecommendation;
  missingConcepts?: string[];
}

export interface DialogueTurn {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  feedback?: RealTimeEvaluation;
}

export interface InterviewSession {
  id: string;
  type: InterviewType;
  company: CompanyName;
  difficulty: DifficultyLevel;
  category: QuestionCategory;
  durationSeconds: number;
  timestamp: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  behavioralScore: number;
  confidenceScore: number;
  leadershipScore: number;
  problemSolvingScore: number;
  professionalismScore: number;
  hiringRecommendation?: HiringRecommendation;
  dialogue: DialogueTurn[];
  strengths: string[];
  weaknesses: string[];
  missingConcepts?: string[];
  remedy: string;
  practicePlan: string[];
  resources: Array<{ title: string; url: string; type: 'video' | 'article' | 'course' }>;
  notes?: string;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progressMax?: number;
  progressCurrent?: number;
}

export interface InterviewNote {
  id: string;
  sessionId?: string;
  title: string;
  content: string;
  lastSaved: string;
  bookmarked: boolean;
  category: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  companies: CompanyName[];
  description: string;
  starterCode: Record<string, string>; // e.g. { typescript: '...', python: '...' }
  testCases: Array<{ id: string; input: string; expectedOutput: string; explanation?: string }>;
  hints: string[];
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface SystemDesignNode {
  id: string;
  type: 'client' | 'load_balancer' | 'api_gateway' | 'service' | 'cache' | 'database' | 'queue' | 'cdn';
  label: string;
  x: number;
  y: number;
}

export interface SystemDesignConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface SystemDesignDiagram {
  id: string;
  title: string;
  description: string;
  nodes: SystemDesignNode[];
  connections: SystemDesignConnection[];
  requirements: string[];
  bottlenecks?: string[];
}

export interface InterviewSettings {
  persona: 'FAANG Senior Evaluator' | 'Friendly Career Coach' | 'Startup CTO' | 'Strict Technical Lead';
  voiceSpeed: number;
  targetCompanies: CompanyName[];
  includeResumeContext: boolean;
  autoSpeechPlayback: boolean;
  strictnessLevel: 'Lenient' | 'Standard' | 'Strict' | 'Ruthless';
  customPromptTemplates: string[];
}

export interface MissingConceptItem {
  id: string;
  concept: string;
  category: QuestionCategory;
  importance: 'High' | 'Medium' | 'Critical';
  recommendedResource: { title: string; url: string; type: 'video' | 'article' | 'course' };
}

