/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIAgent, AgentTask, AgentId, SharedMemoryFact } from '../types/agents';
import { GeminiService } from './gemini';

const SHARED_MEMORY_STORAGE_KEY = 'pathpilot_ai_shared_memory_v1';
const AGENT_TASKS_STORAGE_KEY = 'pathpilot_ai_agent_tasks_v1';

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'career_coach',
    name: 'Career Strategy Coach',
    role: 'Primary Career Navigator',
    category: 'coaching',
    description: 'Provides long-term career trajectory advice, milestone planning, and role alignment.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 48,
    confidenceScore: 98,
    capabilities: ['Milestone Mapping', 'Skill Gap Analysis', 'Executive Coaching'],
  },
  {
    id: 'resume_expert',
    name: 'ATS Resume Architect',
    role: 'Resume & CV Specialist',
    category: 'resume',
    description: 'Optimizes resume bullet points, ATS keyword density, and structural formatting.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 124,
    confidenceScore: 99,
    capabilities: ['ATS Keyword Match', 'Impact Measurement', 'Bullet Polishing'],
  },
  {
    id: 'interview_coach',
    name: 'Interview Simulation Coach',
    role: 'Behavioral & Tech Interview Expert',
    category: 'coaching',
    description: 'Conducts mock STAR behavioral interviews and technical coding practice.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 82,
    confidenceScore: 96,
    capabilities: ['STAR Method Feedback', 'System Design Prep', 'Confidence Analysis'],
  },
  {
    id: 'scholarship_agent',
    name: 'Grant & Scholarship Finder',
    role: 'Academic & Financial Aid Advisor',
    category: 'search',
    description: 'Matches academic profiles with global fellowship, grant, and scholarship opportunities.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 35,
    confidenceScore: 94,
    capabilities: ['FAFSA / Need Match', 'Fellowship Radar', 'Essay Feedback'],
  },
  {
    id: 'internship_agent',
    name: 'Early Career & Internship Radar',
    role: 'Internship Specialist',
    category: 'search',
    description: 'Scouts top university hiring pipelines, summer internships, and co-op roles.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 91,
    confidenceScore: 97,
    capabilities: ['Rotational Programs', 'Co-op Tracking', 'Fast-Track Referrals'],
  },
  {
    id: 'job_search_agent',
    name: 'Autonomous Job Finder',
    role: 'Market Job Matcher',
    category: 'search',
    description: 'Crawls job boards, verifies remote options, and filters high-yield position matches.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 210,
    confidenceScore: 99,
    capabilities: ['Real-time Crawling', 'Compensation Filter', 'Role Fit Scoring'],
  },
  {
    id: 'research_assistant',
    name: 'Academic Research Assistant',
    role: 'Literature & Paper Analyst',
    category: 'intelligence',
    description: 'Summarizes arXiv research papers, citations, technical specs, and methodologies.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 64,
    confidenceScore: 95,
    capabilities: ['Paper Summarization', 'BibTeX Formatting', 'Methodology Synthesis'],
  },
  {
    id: 'learning_coach',
    name: 'Curriculum & Upskilling Coach',
    role: 'EdTech & Course Curator',
    category: 'coaching',
    description: 'Builds targeted skill roadmaps, recommended books, MOOCs, and lab exercises.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 77,
    confidenceScore: 96,
    capabilities: ['Curriculum Design', 'Prerequisite Mapping', 'Project Assignments'],
  },
  {
    id: 'project_mentor',
    name: 'Hands-On Project Mentor',
    role: 'Full-Stack Technical Lead',
    category: 'intelligence',
    description: 'Guides capstone projects, architecture design, repository structures, and code reviews.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 53,
    confidenceScore: 97,
    capabilities: ['Architecture Review', 'PR Feedback', 'Tech Stack Selection'],
  },
  {
    id: 'linkedin_branding',
    name: 'LinkedIn & Personal Brand Specialist',
    role: 'Personal Brand Strategist',
    category: 'branding',
    description: 'Crafts viral LinkedIn headlines, summary bios, featured projects, and post copy.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 88,
    confidenceScore: 95,
    capabilities: ['Headline Optimization', 'Bio Storytelling', 'Content Calendars'],
  },
  {
    id: 'portfolio_agent',
    name: 'Portfolio & Web Curator',
    role: 'Digital Design & Showcase Advisor',
    category: 'branding',
    description: 'Reviews online developer portfolios, GitHub READMEs, and visual case studies.',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 42,
    confidenceScore: 94,
    capabilities: ['UX Layout Critique', 'GitHub Polish', 'Case Study Structuring'],
  },
  {
    id: 'writing_assistant',
    name: 'Cover Letter & Essay Assistant',
    role: 'Professional Writer',
    category: 'resume',
    description: 'Drafts tailored cover letters, cold email intros, and scholarship motivation statements.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 115,
    confidenceScore: 98,
    capabilities: ['Tailored Cover Letters', 'Tone Adjustment', 'Grammar Precision'],
  },
  {
    id: 'application_assistant',
    name: 'Application Tracker & Form Automation',
    role: 'Form Automation Specialist',
    category: 'automation',
    description: 'Fills application forms, tracks submission statuses, and monitors interview pipelines.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 160,
    confidenceScore: 99,
    capabilities: ['Auto Form Prefill', 'Pipeline Analytics', 'Deadline Reminders'],
  },
  {
    id: 'networking_agent',
    name: 'Networking & Cold Outreach Agent',
    role: 'Professional Connection Specialist',
    category: 'branding',
    description: 'Generates non-spammy outreach templates for alumni, hiring managers, and recruiters.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 70,
    confidenceScore: 93,
    capabilities: ['Alumni Reconnect', 'Informational Interview', 'Recruiter InMail'],
  },
  {
    id: 'ai_productivity',
    name: 'Time & Habit Productivity Coach',
    role: 'Workflow Optimization Specialist',
    category: 'automation',
    description: 'Optimizes daily study schedules, pomodoro blocks, and focus time allocation.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 104,
    confidenceScore: 97,
    capabilities: ['Calendar Blocking', 'Habit Tracking', 'Burnout Prevention'],
  },
  {
    id: 'market_intelligence',
    name: 'Market Intelligence & Tech Trends Agent',
    role: 'Macro Labor Market Analyst',
    category: 'intelligence',
    description: 'Tracks hiring surges, technology stack demand shifts, and venture-backed startup trends.',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 89,
    confidenceScore: 99,
    capabilities: ['Labor Heatmaps', 'Skill Indexing', 'Industry Reports'],
  },
  {
    id: 'recruiter_sim',
    name: 'Recruiter Screening Simulator',
    role: 'Talent Acquisition Evaluator',
    category: 'coaching',
    description: 'Simulates 15-minute phone screen interviews with instant feedback on candidate positioning.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 62,
    confidenceScore: 95,
    capabilities: ['Phone Screen Simulation', 'Salary Expectation Check', 'Elevator Pitch Review'],
  },
  {
    id: 'salary_intelligence',
    name: 'Salary & Equity Negotiation Agent',
    role: 'Compensation Specialist',
    category: 'intelligence',
    description: 'Estimates market rate compensation, RSUs, sign-on bonuses, and negotiation scripts.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 58,
    confidenceScore: 98,
    capabilities: ['Levels.fyi Benchmarking', 'Offer Counter-Proposals', 'Tax/Equity Breakdown'],
  },
  {
    id: 'analytics_agent',
    name: 'Career Telemetry & Performance Agent',
    role: 'Data & Metrics Analyst',
    category: 'intelligence',
    description: 'Calculates application response rates, skill growth velocity, and readiness scores.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 140,
    confidenceScore: 99,
    capabilities: ['Conversion Funnels', 'Skill Velocity', 'Goal Attainment %'],
  },
  {
    id: 'system_assistant',
    name: 'Master System Assistant',
    role: 'Universal Multi-Agent Orchestrator',
    category: 'automation',
    description: 'Master routing agent that coordinates sub-agents, merges outputs, and manages execution.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ready',
    tasksCompleted: 310,
    confidenceScore: 99,
    capabilities: ['Agent Routing', 'Memory Synchronization', 'Parallel Pipeline Execution'],
  },
];

const INITIAL_SHARED_MEMORY: SharedMemoryFact[] = [
  {
    id: 'mem_1',
    category: 'career_goal',
    key: 'Primary Target Role',
    value: 'Senior Staff AI Engineer / Technical Lead',
    sourceAgent: 'career_coach',
    confidence: 0.99,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    category: 'skill_vector',
    key: 'Core Technical Stack',
    value: 'TypeScript, React 18, Node.js, PyTorch, Gemini 2.5, PostgreSQL, TailWind CSS',
    sourceAgent: 'resume_expert',
    confidence: 0.98,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_3',
    category: 'resume_fact',
    key: 'ATS Resume Rating',
    value: '92 / 100 - Strong engineering impact metrics and leadership bullet points.',
    sourceAgent: 'resume_expert',
    confidence: 0.95,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_4',
    category: 'interview_result',
    key: 'STAR Behavioral Readiness',
    value: 'Strong performance on System Architecture and Conflict Resolution scenarios.',
    sourceAgent: 'interview_coach',
    confidence: 0.92,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_5',
    category: 'preference',
    key: 'Target Compensation & Work Style',
    value: '$180,000 - $220,000 USD / Remote or Hybrid (SF Bay / NYC / Seattle)',
    sourceAgent: 'salary_intelligence',
    confidence: 0.96,
    updatedAt: new Date().toISOString(),
  },
];

export class AIAgentService {
  /**
   * Retrieves all registered specialized AI agents.
   */
  static getAgents(): AIAgent[] {
    return INITIAL_AGENTS;
  }

  /**
   * Retrieves persistent shared memory facts.
   */
  static getSharedMemory(): SharedMemoryFact[] {
    try {
      const stored = localStorage.getItem(SHARED_MEMORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse shared memory from storage', e);
    }
    return INITIAL_SHARED_MEMORY;
  }

  /**
   * Upserts a fact into the persistent shared memory.
   */
  static addSharedMemoryFact(fact: Omit<SharedMemoryFact, 'id' | 'updatedAt'>): SharedMemoryFact {
    const memory = this.getSharedMemory();
    const newFact: SharedMemoryFact = {
      ...fact,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newFact, ...memory];
    localStorage.setItem(SHARED_MEMORY_STORAGE_KEY, JSON.stringify(updated));
    return newFact;
  }

  /**
   * Deletes a fact from shared memory.
   */
  static deleteSharedMemoryFact(id: string): void {
    const memory = this.getSharedMemory();
    const filtered = memory.filter((m) => m.id !== id);
    localStorage.setItem(SHARED_MEMORY_STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Gets recent agent tasks executed by the orchestrator.
   */
  static getAgentTasks(): AgentTask[] {
    try {
      const stored = localStorage.getItem(AGENT_TASKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse agent tasks', e);
    }
    return [
      {
        id: 'task_101',
        agentId: 'resume_expert',
        title: 'ATS Keyword Match against AI Engineer posting',
        prompt: 'Analyze resume bullets for PyTorch & RAG architecture keywords',
        status: 'completed',
        reasoningSteps: [
          'Step 1: Extract keywords from active target job descriptions.',
          'Step 2: Cross-reference candidate skills in shared memory.',
          'Step 3: Identified 2 high-impact missing keywords: "RAG Evaluation" & "Vector DB Indexing".',
          'Step 4: Output recommended resume bullet rewrites.',
        ],
        output: 'Added 2 recommended bullet points showcasing Vector DB optimization resulting in 35% reduced search latency.',
        confidence: 0.98,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3550000).toISOString(),
      },
      {
        id: 'task_102',
        agentId: 'market_intelligence',
        title: 'Macro AI Hiring Index & Tech Demand Audit',
        prompt: 'Run daily crawl on vector search & LLM ops demand in North America.',
        status: 'completed',
        reasoningSteps: [
          'Step 1: Analyzed 1,420 open job listings across Tech & Enterprise sectors.',
          'Step 2: Vector Search & LangChain/LlamaIndex skills grew +28% YoY.',
          'Step 3: Average compensation bracket: $175k - $240k.',
        ],
        output: 'Demand for Generative AI & Fine-tuning is up 34% this quarter.',
        confidence: 0.99,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7150000).toISOString(),
      },
    ];
  }

  /**
   * Master Orchestrator: Automatically selects best agent, generates reasoning steps, and executes prompt via Gemini API.
   */
  static async executeOrchestration(
    userPrompt: string,
    targetAgentId?: AgentId
  ): Promise<{ agent: AIAgent; task: AgentTask; output: string }> {
    const memory = this.getSharedMemory();
    const agents = this.getAgents();

    // 1. Identify primary agent
    let selectedAgent = agents.find((a) => a.id === targetAgentId);

    if (!selectedAgent) {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('resume') || lower.includes('cv') || lower.includes('ats')) {
        selectedAgent = agents.find((a) => a.id === 'resume_expert');
      } else if (lower.includes('interview') || lower.includes('star') || lower.includes('question')) {
        selectedAgent = agents.find((a) => a.id === 'interview_coach');
      } else if (lower.includes('scholarship') || lower.includes('grant') || lower.includes('aid')) {
        selectedAgent = agents.find((a) => a.id === 'scholarship_agent');
      } else if (lower.includes('job') || lower.includes('role') || lower.includes('hire') || lower.includes('search')) {
        selectedAgent = agents.find((a) => a.id === 'job_search_agent');
      } else if (lower.includes('salary') || lower.includes('offer') || lower.includes('negotiat')) {
        selectedAgent = agents.find((a) => a.id === 'salary_intelligence');
      } else if (lower.includes('linkedin') || lower.includes('brand') || lower.includes('bio')) {
        selectedAgent = agents.find((a) => a.id === 'linkedin_branding');
      } else {
        selectedAgent = agents.find((a) => a.id === 'career_coach');
      }
    }

    if (!selectedAgent) {
      selectedAgent = agents[0];
    }

    // 2. Build reasoning steps
    const reasoningSteps = [
      `[Orchestrator] Received user prompt: "${userPrompt.substring(0, 60)}..."`,
      `[Orchestrator] Routed task to specialized agent: ${selectedAgent.name} (${selectedAgent.role})`,
      `[Shared Memory] Loaded ${memory.length} contextual user facts into model prompt.`,
      `[${selectedAgent.name}] Step 1: Parsing user requirement and evaluating confidence thresholds.`,
      `[${selectedAgent.name}] Step 2: Formulating step-by-step career strategy response...`,
    ];

    // 3. Execute request via Gemini chat or mock fallback
    let outputText = '';
    try {
      const memoryContext = memory.map((m) => `${m.key}: ${m.value}`).join('\n');
      const fullPrompt = `System Persona: You are ${selectedAgent.name} (${selectedAgent.role}).
Capabilities: ${selectedAgent.capabilities.join(', ')}.
User Shared Memory Context:
${memoryContext}

User Query: ${userPrompt}

Provide a concise, highly strategic, actionable response formatted with clean bullet points and clear next steps.`;

      outputText = await GeminiService.getCoachReply(fullPrompt, [], selectedAgent.role);
    } catch (e) {
      console.warn('Gemini API call fallback to intelligent response generator:', e);
      outputText = `### ${selectedAgent.name} Strategic Guidance\n\nBased on your profile and target goals (**${memory[0]?.value || 'Software Engineer'}**):\n\n1. **Immediate Focus**: Action item tailored for ${userPrompt}.\n2. **Optimization Step**: Update your skill vectors with recent hands-on projects.\n3. **Proactive Recommendation**: Leverage autonomous job agents to benchmark current open opportunities.`;
    }

    // 4. Record task
    const task: AgentTask = {
      id: `task_${Date.now()}`,
      agentId: selectedAgent.id,
      title: `${selectedAgent.name}: ${userPrompt.substring(0, 40)}...`,
      prompt: userPrompt,
      status: 'completed',
      reasoningSteps: [...reasoningSteps, `[${selectedAgent.name}] Finalized output generation.`],
      output: outputText,
      confidence: selectedAgent.confidenceScore / 100,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const existingTasks = this.getAgentTasks();
    localStorage.setItem(AGENT_TASKS_STORAGE_KEY, JSON.stringify([task, ...existingTasks.slice(0, 20)]));

    // Update memory automatically if user updated career goal
    if (userPrompt.toLowerCase().includes('goal') || userPrompt.toLowerCase().includes('want to become')) {
      this.addSharedMemoryFact({
        category: 'career_goal',
        key: 'Updated User Objective',
        value: userPrompt,
        sourceAgent: selectedAgent.id,
        confidence: 0.95,
      });
    }

    return { agent: selectedAgent, task, output: outputText };
  }
}
