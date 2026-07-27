/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowTemplate, AutomationRule, AgentId } from '../types/agents';

const INITIAL_WORKFLOWS: WorkflowTemplate[] = [
  {
    id: 'wf_resume_pipeline',
    title: 'New Resume Optimization Pipeline',
    description: 'Triggered when a new CV is uploaded. Automatically audits ATS, suggests project rewrites, and updates skill memory.',
    triggerEvent: 'resume_uploaded',
    enabled: true,
    steps: [
      { id: 's1', agentId: 'resume_expert', instruction: 'Parse resume structure and compute ATS score.', status: 'completed' },
      { id: 's2', agentId: 'career_coach', instruction: 'Identify missing core skill vectors for target role.', status: 'completed' },
      { id: 's3', agentId: 'learning_coach', instruction: 'Recommend targeted courses & projects for skill gap.', status: 'pending' },
      { id: 's4', agentId: 'application_assistant', instruction: 'Update master profile facts across active job apps.', status: 'pending' },
    ],
  },
  {
    id: 'wf_daily_opportunity',
    title: 'Autonomous Job & Scholarship Radar Pipeline',
    description: 'Runs daily at 08:00 AM. Finds matching roles, filters compensation bounds, and queues early applications.',
    triggerEvent: 'schedule_daily',
    enabled: true,
    steps: [
      { id: 's10', agentId: 'job_search_agent', instruction: 'Search active job boards for remote AI/Software roles.', status: 'completed' },
      { id: 's11', agentId: 'scholarship_agent', instruction: 'Check global fellowship deadlines and eligibility.', status: 'completed' },
      { id: 's12', agentId: 'salary_intelligence', instruction: 'Verify salary ranges against market benchmarks.', status: 'completed' },
      { id: 's13', agentId: 'writing_assistant', instruction: 'Draft customized intro letters for top 3 matches.', status: 'pending' },
    ],
  },
  {
    id: 'wf_interview_prep',
    title: 'Post-Interview Feedback & Practice Pipeline',
    description: 'Triggered after completing a mock interview. Analyzes STAR response clarity, confidence, and system design logic.',
    triggerEvent: 'interview_completed',
    enabled: true,
    steps: [
      { id: 's20', agentId: 'interview_coach', instruction: 'Evaluate answer transcript for STAR methodology.', status: 'completed' },
      { id: 's21', agentId: 'recruiter_sim', instruction: 'Provide recruiter perspective on response impact.', status: 'completed' },
      { id: 's22', agentId: 'analytics_agent', instruction: 'Update candidate Readiness Score in dashboard.', status: 'completed' },
    ],
  },
];

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule_1',
    title: 'Auto-Improve Resume on Score Drop',
    condition: 'When ATS Resume Score falls below 85%',
    actionAgentId: 'resume_expert',
    actionTask: 'Trigger ATS keyword re-optimization and bullet point rewrite',
    enabled: true,
    executionCount: 14,
    lastTriggeredAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rule_2',
    title: 'Near-Deadline Scholarship Reminder',
    condition: 'When fellowship or grant deadline is within 7 days',
    actionAgentId: 'scholarship_agent',
    actionTask: 'Dispatch high-priority email notification and pre-fill application draft',
    enabled: true,
    executionCount: 8,
    lastTriggeredAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'rule_3',
    title: 'New High-Match Job Radar',
    condition: 'When job match fit score is >= 90%',
    actionAgentId: 'writing_assistant',
    actionTask: 'Auto-generate tailored cover letter and prepare 1-click application draft',
    enabled: true,
    executionCount: 29,
    lastTriggeredAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export class WorkflowEngineService {
  static getWorkflows(): WorkflowTemplate[] {
    return INITIAL_WORKFLOWS;
  }

  static toggleWorkflow(id: string): void {
    const wf = INITIAL_WORKFLOWS.find((w) => w.id === id);
    if (wf) {
      wf.enabled = !wf.enabled;
    }
  }

  static getAutomationRules(): AutomationRule[] {
    return INITIAL_RULES;
  }

  static toggleRule(id: string): void {
    const rule = INITIAL_RULES.find((r) => r.id === id);
    if (rule) {
      rule.enabled = !rule.enabled;
    }
  }

  static addRule(rule: Omit<AutomationRule, 'id' | 'executionCount'>): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      executionCount: 0,
    };
    INITIAL_RULES.push(newRule);
    return newRule;
  }
}
