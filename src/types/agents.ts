/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AgentId =
  | 'career_coach'
  | 'resume_expert'
  | 'interview_coach'
  | 'scholarship_agent'
  | 'internship_agent'
  | 'job_search_agent'
  | 'research_assistant'
  | 'learning_coach'
  | 'project_mentor'
  | 'linkedin_branding'
  | 'portfolio_agent'
  | 'writing_assistant'
  | 'application_assistant'
  | 'networking_agent'
  | 'ai_productivity'
  | 'market_intelligence'
  | 'recruiter_sim'
  | 'salary_intelligence'
  | 'analytics_agent'
  | 'system_assistant';

export interface AIAgent {
  id: AgentId;
  name: string;
  role: string;
  category: 'coaching' | 'resume' | 'search' | 'intelligence' | 'automation' | 'branding';
  description: string;
  avatarUrl: string;
  status: 'idle' | 'working' | 'ready' | 'offline';
  tasksCompleted: number;
  confidenceScore: number;
  capabilities: string[];
  lastAction?: string;
}

export interface AgentTask {
  id: string;
  agentId: AgentId;
  title: string;
  prompt: string;
  status: 'queued' | 'thinking' | 'executing' | 'completed' | 'failed';
  reasoningSteps: string[];
  output?: string;
  confidence: number;
  createdAt: string;
  completedAt?: string;
  orgId?: string;
}

export interface SharedMemoryFact {
  id: string;
  category: 'career_goal' | 'skill_vector' | 'resume_fact' | 'interview_result' | 'preference' | 'application_fact';
  key: string;
  value: string;
  sourceAgent: AgentId;
  confidence: number;
  updatedAt: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'skill' | 'job_role' | 'company' | 'university' | 'scholarship' | 'learning_path' | 'project';
  category?: string;
  importanceScore: number;
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: 'requires_skill' | 'hires_for' | 'offers_scholarship' | 'prepares_for' | 'recommends';
  weight: number;
}

export interface WorkflowStep {
  id: string;
  agentId: AgentId;
  instruction: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  triggerEvent: 'resume_uploaded' | 'job_searched' | 'interview_completed' | 'schedule_daily' | 'goal_updated';
  steps: WorkflowStep[];
  enabled: boolean;
}

export interface AutomationRule {
  id: string;
  title: string;
  condition: string;
  actionAgentId: AgentId;
  actionTask: string;
  enabled: boolean;
  lastTriggeredAt?: string;
  executionCount: number;
}

export interface MarketTrendItem {
  id: string;
  title: string;
  category: string;
  growthPercentage: number;
  demandLevel: 'high' | 'very_high' | 'extreme' | 'moderate';
  avgSalaryRange: string;
  topCompanies: string[];
  requiredSkills: string[];
}

export interface CareerPredictionResult {
  readinessScore: number;
  interviewSuccessProb: number;
  resumeQualityScore: number;
  estimatedSalaryMin: number;
  estimatedSalaryMax: number;
  hiringProbability: number;
  keyGaps: string[];
  strengths: string[];
}
