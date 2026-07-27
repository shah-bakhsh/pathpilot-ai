/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useToast } from '../ui/ToastContext';
import { AIAgentService } from '../../services/aiAgentService';
import { KnowledgeGraphService } from '../../services/knowledgeGraphService';
import { WorkflowEngineService } from '../../services/workflowEngineService';
import { PredictionService } from '../../services/predictionService';
import { MarketIntelligenceService } from '../../services/marketIntelligenceService';
import { AIAgent, AgentTask, SharedMemoryFact, KnowledgeNode } from '../../types/agents';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';

import {
  Bot, Cpu, Zap, Activity, BrainCircuit, Share2, Layers,
  Play, RefreshCw, Plus, CheckCircle2, AlertCircle, ShieldAlert,
  Search, TrendingUp, DollarSign, Sparkles, Send, Network,
  Settings2, Eye, Lock, ArrowUpRight, Check, Trash2, HelpCircle
} from 'lucide-react';

export const AgentEcosystemView: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orchestrator');
  const [agents] = useState(() => AIAgentService.getAgents());
  const [memory, setMemory] = useState(() => AIAgentService.getSharedMemory());
  const [tasks, setTasks] = useState(() => AIAgentService.getAgentTasks());
  const [workflows, setWorkflows] = useState(() => WorkflowEngineService.getWorkflows());
  const [rules, setRules] = useState(() => WorkflowEngineService.getAutomationRules());
  const [nodes] = useState(() => KnowledgeGraphService.getNodes());
  const [edges] = useState(() => KnowledgeGraphService.getEdges());
  const [predictions] = useState(() => PredictionService.getCareerPredictions());
  const [marketTrends] = useState(() => MarketIntelligenceService.getMarketTrends());

  // Interactive Operator Chat state
  const [chatPrompt, setChatPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; content: string; agentName?: string; steps?: string[] }>>([
    {
      role: 'assistant',
      agentName: 'Master System Assistant',
      content: 'Welcome to the Autonomous Career Operating System. I coordinate 20 specialized AI agents working together with persistent shared memory. How can we advance your career trajectory today?',
      steps: ['[Orchestrator] System initialized with 20 active agents and 5 shared memory facts.'],
    },
  ]);

  // Selected Agent Modal / Detail View
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [agentCategoryFilter, setAgentCategoryFilter] = useState<string>('all');

  // Shared Memory Add Fact Modal
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');
  const [newMemCat, setNewMemCat] = useState<'career_goal' | 'skill_vector' | 'resume_fact' | 'interview_result' | 'preference'>('career_goal');

  // Automation Rule Modal
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleCondition, setRuleCondition] = useState('');
  const [ruleActionTask, setRuleActionTask] = useState('');

  const handleRunOrchestratorChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || isExecuting) return;

    const userText = chatPrompt.trim();
    setChatPrompt('');
    setChatLog((prev) => [...prev, { role: 'user', content: userText }]);
    setIsExecuting(true);

    try {
      const res = await AIAgentService.executeOrchestration(userText, selectedAgent?.id);
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          agentName: res.agent.name,
          content: res.output,
          steps: res.task.reasoningSteps,
        },
      ]);
      setTasks(AIAgentService.getAgentTasks());
      setMemory(AIAgentService.getSharedMemory());
    } catch (err) {
      showToast({ title: 'Execution Failure', description: 'Failed to complete agent orchestration.', type: 'error' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddMemoryFact = () => {
    if (!newMemKey || !newMemVal) return;
    AIAgentService.addSharedMemoryFact({
      category: newMemCat,
      key: newMemKey,
      value: newMemVal,
      sourceAgent: 'career_coach',
      confidence: 0.98,
    });
    setMemory(AIAgentService.getSharedMemory());
    setShowAddMemoryModal(false);
    setNewMemKey('');
    setNewMemVal('');
    showToast({ title: 'Shared Memory Updated', description: 'Added fact to global persistent context.', type: 'success' });
  };

  const handleDeleteMemoryFact = (id: string) => {
    AIAgentService.deleteSharedMemoryFact(id);
    setMemory(AIAgentService.getSharedMemory());
    showToast({ title: 'Memory Fact Removed', description: 'Fact deleted from global persistent storage.', type: 'info' });
  };

  const handleToggleWorkflow = (id: string) => {
    WorkflowEngineService.toggleWorkflow(id);
    setWorkflows([...WorkflowEngineService.getWorkflows()]);
    showToast({ title: 'Workflow Updated', description: 'Pipeline execution state toggled.', type: 'info' });
  };

  const handleToggleRule = (id: string) => {
    WorkflowEngineService.toggleRule(id);
    setRules([...WorkflowEngineService.getAutomationRules()]);
    showToast({ title: 'Automation Rule Toggled', description: 'Trigger condition saved.', type: 'info' });
  };

  const handleAddRule = () => {
    if (!ruleTitle || !ruleCondition || !ruleActionTask) return;
    WorkflowEngineService.addRule({
      title: ruleTitle,
      condition: ruleCondition,
      actionAgentId: 'career_coach',
      actionTask: ruleActionTask,
      enabled: true,
    });
    setRules([...WorkflowEngineService.getAutomationRules()]);
    setShowAddRuleModal(false);
    setRuleTitle('');
    setRuleCondition('');
    setRuleActionTask('');
    showToast({ title: 'Automation Created', description: 'New rule registered in engine.', type: 'success' });
  };

  const filteredAgents = agents.filter((a) => {
    if (agentCategoryFilter === 'all') return true;
    return a.category === agentCategoryFilter;
  });

  const tabs = [
    { id: 'orchestrator', label: 'Universal Operator', icon: <Bot className="w-4 h-4" /> },
    { id: 'agents', label: '20 Specialized Agents', icon: <Cpu className="w-4 h-4" /> },
    { id: 'workflows', label: 'Autonomous Workflows', icon: <Layers className="w-4 h-4" /> },
    { id: 'automations', label: 'Automation Rules', icon: <Zap className="w-4 h-4" /> },
    { id: 'memory', label: 'Shared AI Memory', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge Graph', icon: <Network className="w-4 h-4" /> },
    { id: 'predictions', label: 'Career Intelligence', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-12">
      {/* Platform Orchestration Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0 relative">
            <BrainCircuit className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg text-text-main uppercase tracking-tight">
                Autonomous Multi-Agent Career System
              </h2>
              <Badge variant="primary" className="uppercase font-mono text-[9px]">
                20 Active Agents
              </Badge>
            </div>
            <p className="text-xs text-text-mute mt-0.5">
              Master Orchestrator, persistent shared memory, knowledge graph reasoning, and autonomous job pipelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTasks(AIAgentService.getAgentTasks());
              setMemory(AIAgentService.getSharedMemory());
              showToast({ title: 'Memory Synced', description: 'Refreshed shared agent vector context.', type: 'info' });
            }}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Vector Memory
          </Button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Agents</span>
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">20 / 20</div>
          <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 text-success" /> All Systems Online
          </div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Shared Memory Facts</span>
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">{memory.length} Vector Facts</div>
          <div className="text-[10px] text-text-mute font-mono mt-1">Cross-agent synchronization</div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Career Readiness Index</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="font-display font-black text-xl text-success mt-2">{predictions.readinessScore} / 100</div>
          <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
            Top 5% Candidate Pool
          </div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Est. Market Value</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">
            ${(predictions.estimatedSalaryMin / 1000).toFixed(0)}k - ${(predictions.estimatedSalaryMax / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-text-mute font-mono mt-1">USD Annual Compensation</div>
        </Card>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-[var(--border)] pb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: UNIVERSAL OPERATOR / CHAT */}
      {activeTab === 'orchestrator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Operator Chat Window (2 cols) */}
          <Card variant="outline" className="lg:col-span-2 flex flex-col h-[600px]">
            <CardHeader className="border-b border-[var(--border)] py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Universal AI Operator & Assistant</CardTitle>
                </div>
                <Badge variant="primary" className="text-[9px] uppercase font-mono">
                  Master Route Mode
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1.5 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-text-mute font-mono">
                    <span>{msg.role === 'user' ? 'You' : msg.agentName || 'Master Assistant'}</span>
                  </div>

                  {msg.steps && msg.steps.length > 0 && (
                    <div className="w-full max-w-xl p-2.5 rounded-lg bg-black/80 font-mono text-[10px] text-emerald-400 space-y-1 mb-1">
                      <div className="text-[9px] font-bold uppercase text-white/70 border-b border-emerald-900/60 pb-1 flex items-center justify-between">
                        <span>Agent Reasoning Chain</span>
                        <Cpu className="w-3 h-3 text-emerald-400 animate-spin" />
                      </div>
                      {msg.steps.map((step, sIdx) => (
                        <p key={sIdx} className="leading-tight">{step}</p>
                      ))}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-black font-medium rounded-tr-none'
                        : 'bg-[var(--surface-secondary)] text-text-main border border-[var(--border)] rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isExecuting && (
                <div className="flex items-center gap-3 text-xs text-text-mute p-3 rounded-xl bg-[var(--surface-secondary)]/50 animate-pulse">
                  <Cpu className="w-4 h-4 text-primary animate-spin" />
                  <span>Master Orchestrator selecting optimal agent and synthesizing reasoning steps...</span>
                </div>
              )}
            </CardContent>

            <form onSubmit={handleRunOrchestratorChat} className="p-3 border-t border-[var(--border)] flex gap-2 bg-[var(--surface)]">
              <Input
                placeholder="Ask anything (e.g. 'Optimize my resume for AI roles', 'Find scholarships', 'Prepare interview STAR answer')..."
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                className="text-xs"
                disabled={isExecuting}
              />
              <Button type="submit" variant="default" size="sm" isLoading={isExecuting}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          {/* Active Tasks & Memory Context Sidebar (1 col) */}
          <div className="flex flex-col gap-6">
            <Card variant="outline">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Orchestrator Task Queue
                </CardTitle>
                <CardDescription>Recent autonomous tasks executed by specialized agents.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-main line-clamp-1">{task.title}</span>
                      <Badge variant="success" className="text-[8px] uppercase">
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-text-mute mt-1 line-clamp-2">{task.output}</p>
                    <div className="text-[9px] text-primary font-mono mt-1">
                      Confidence: {(task.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" /> Shared Memory Context
                  </CardTitle>
                  <CardDescription>Live vector context injected into prompts.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowAddMemoryModal(true)}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {memory.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/20 text-[11px]">
                    <span className="font-bold text-text-main uppercase font-mono text-[9px]">{m.key}:</span>
                    <p className="text-text-sub mt-0.5 text-[10px] line-clamp-2">{m.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: 20 SPECIALIZED AGENTS */}
      {activeTab === 'agents' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'coaching', 'resume', 'search', 'intelligence', 'automation', 'branding'].map((cat) => (
              <Button
                key={cat}
                variant={agentCategoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                className="capitalize text-xs h-7"
                onClick={() => setAgentCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                variant="outline"
                className="p-4 flex flex-col justify-between hover:border-primary/40 transition-colors cursor-pointer group"
                onClick={() => setSelectedAgent(agent)}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div>
                      <h3 className="font-bold text-xs text-text-main group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-[10px] text-text-mute font-mono">{agent.role}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-sub mt-3 line-clamp-2">{agent.description}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {agent.capabilities.map((cap, i) => (
                      <Badge key={i} variant="neutral" className="text-[8px]">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-text-mute font-mono">
                  <span>Tasks: {agent.tasksCompleted}</span>
                  <span className="text-success font-bold">{agent.confidenceScore}% Confidence</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUTONOMOUS WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {workflows.map((wf) => (
              <Card key={wf.id} variant="outline" className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-text-main">{wf.title}</h3>
                      <Badge variant={wf.enabled ? 'success' : 'outline'} className="text-[8px] uppercase">
                        {wf.enabled ? 'Active Pipeline' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-mute mt-1">{wf.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleWorkflow(wf.id)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                      wf.enabled ? 'bg-primary' : 'bg-gray-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        wf.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Workflow Steps */}
                <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                  <span className="text-[10px] uppercase font-bold text-text-mute tracking-wider">
                    Sequential Agent Steps
                  </span>
                  {wf.steps.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-text-main">{s.instruction}</span>
                      </div>
                      <Badge variant={s.status === 'completed' ? 'success' : 'warning'} className="text-[8px] uppercase">
                        {s.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Workflow Engine Diagnostics
              </CardTitle>
              <CardDescription>Real-time step execution pipeline stats.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-mute">Total Workflows:</span>
                  <span className="font-bold text-text-main">{workflows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mute">Active Pipelines:</span>
                  <span className="font-bold text-success">
                    {workflows.filter((w) => w.enabled).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mute">Daily Executions:</span>
                  <span className="font-bold text-primary">142 runs/day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: AUTOMATION RULES */}
      {activeTab === 'automations' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-text-main">Autonomous Trigger Rules</h3>
              <p className="text-xs text-text-mute">Configure background conditions that automatically invoke specialized agents.</p>
            </div>
            <Button variant="default" size="sm" onClick={() => setShowAddRuleModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Create Automation Rule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} variant="outline" className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-text-main">{rule.title}</h4>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        rule.enabled ? 'bg-primary' : 'bg-gray-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          rule.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-[var(--surface-secondary)]/50 border border-[var(--border)] font-mono text-[10px] text-text-sub">
                    <span className="font-bold text-primary">WHEN:</span> {rule.condition}
                  </div>

                  <p className="text-[11px] text-text-main mt-3 leading-relaxed">
                    <span className="font-bold text-success">THEN:</span> {rule.actionTask}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-text-mute font-mono">
                  <span>Executions: {rule.executionCount}</span>
                  <span>{rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt).toLocaleDateString() : 'Never'}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SHARED AI MEMORY */}
      {activeTab === 'memory' && (
        <Card variant="outline" className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" /> Persistent Vector Memory
              </CardTitle>
              <CardDescription>Global facts and career vectors accessible across all 20 specialized agents.</CardDescription>
            </div>
            <Button variant="default" size="sm" onClick={() => setShowAddMemoryModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Vector Fact
            </Button>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                  <th className="p-3">Fact Key</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Vector Value</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs">
                {memory.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                    <td className="p-3 font-semibold text-text-main font-mono">{m.key}</td>
                    <td className="p-3">
                      <Badge variant="primary" className="uppercase text-[9px]">
                        {m.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-text-sub max-w-md line-clamp-2">{m.value}</td>
                    <td className="p-3 text-success font-mono font-bold">{(m.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-danger hover:bg-danger/10"
                        onClick={() => handleDeleteMemoryFact(m.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: KNOWLEDGE GRAPH */}
      {activeTab === 'knowledge' && (
        <Card variant="outline" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" /> Multi-Entity Career Knowledge Graph
            </CardTitle>
            <CardDescription>
              Interconnected graph nodes mapping skills, job roles, top tech companies, scholarships, and universities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-text-main">{node.label}</div>
                    <div className="text-[10px] text-text-mute font-mono">{node.category || node.type}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase font-mono">
                    {node.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/90 font-mono text-[11px] text-emerald-400">
              <div className="text-xs font-bold text-white border-b border-emerald-900/60 pb-2 mb-2 flex justify-between">
                <span>Knowledge Graph Edge Traversal Matrix</span>
                <span className="text-emerald-500">{edges.length} Active Edges</span>
              </div>
              {edges.map((e) => (
                <div key={e.id} className="py-0.5 flex justify-between text-[10px]">
                  <span>
                    Node[{e.sourceId}] --({e.relation})--&gt; Node[{e.targetId}]
                  </span>
                  <span className="text-emerald-500">Weight: {e.weight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 7: PREDICTIONS & MARKET INTELLIGENCE */}
      {activeTab === 'predictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Predictive Career Trajectory
              </CardTitle>
              <CardDescription>AI-modeled interview success probabilities and skill gaps.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-text-mute">Hiring Likelihood</div>
                  <div className="text-2xl font-black font-display text-success mt-1">
                    {predictions.hiringProbability}% Probability
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-text-mute">Interview Success</div>
                  <div className="text-2xl font-black font-display text-primary mt-1">
                    {predictions.interviewSuccessProb}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-text-main mb-2">Identified Core Strengths:</h4>
                <ul className="flex flex-col gap-1.5 text-xs text-text-sub">
                  {predictions.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs text-text-main mb-2">Recommended Upskilling Priorities:</h4>
                <ul className="flex flex-col gap-1.5 text-xs text-text-sub">
                  {predictions.keyGaps.map((g, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Macro Market Intelligence Trends
              </CardTitle>
              <CardDescription>Real-time hiring demand & salary benchmark radar.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {marketTrends.map((trend) => (
                <div key={trend.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-main">{trend.title}</span>
                    <Badge variant="success" className="text-[8px] uppercase font-mono">
                      +{trend.growthPercentage}% YoY
                    </Badge>
                  </div>
                  <div className="text-[10px] text-text-mute mt-1">
                    Avg Range: <span className="text-primary font-bold">{trend.avgSalaryRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {trend.requiredSkills.map((sk, i) => (
                      <Badge key={i} variant="neutral" className="text-[8px]">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AGENT DETAIL / DIRECT EXECUTION MODAL */}
      {selectedAgent && (
        <Modal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          title={selectedAgent.name}
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedAgent.avatarUrl}
                alt={selectedAgent.name}
                className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
              />
              <div>
                <Badge variant="primary" className="uppercase text-[9px]">
                  {selectedAgent.category}
                </Badge>
                <div className="text-[11px] text-text-mute mt-1 font-mono">
                  {selectedAgent.tasksCompleted} Tasks Completed • {selectedAgent.confidenceScore}% Confidence
                </div>
              </div>
            </div>

            <p className="text-text-sub leading-relaxed">{selectedAgent.description}</p>

            <div>
              <h4 className="font-bold text-xs text-text-main mb-2">Capabilities:</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map((cap, i) => (
                  <Badge key={i} variant="neutral" className="text-[9px]">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border)]">
              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                Close
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setActiveTab('orchestrator');
                  setSelectedAgent(null);
                }}
              >
                Invoke Agent in Operator Chat
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD MEMORY MODAL */}
      {showAddMemoryModal && (
        <Modal
          isOpen={showAddMemoryModal}
          onClose={() => setShowAddMemoryModal(false)}
          title="Add Shared Vector Memory Fact"
        >
          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Category</label>
              <select
                className="w-full mt-1 p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs text-text-main"
                value={newMemCat}
                onChange={(e: any) => setNewMemCat(e.target.value)}
              >
                <option value="career_goal">Career Goal</option>
                <option value="skill_vector">Skill Vector</option>
                <option value="resume_fact">Resume Fact</option>
                <option value="interview_result">Interview Result</option>
                <option value="preference">Preference</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Fact Key</label>
              <Input
                placeholder="e.g. Target Industry or Preferred Tech Stack"
                value={newMemKey}
                onChange={(e) => setNewMemKey(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Fact Value</label>
              <Input
                placeholder="e.g. Autonomous AI Engineering & Scalable Systems"
                value={newMemVal}
                onChange={(e) => setNewMemVal(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowAddMemoryModal(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleAddMemoryFact}>
                Save Fact
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD AUTOMATION RULE MODAL */}
      {showAddRuleModal && (
        <Modal
          isOpen={showAddRuleModal}
          onClose={() => setShowAddRuleModal(false)}
          title="Create Automation Trigger Rule"
        >
          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Rule Title</label>
              <Input
                placeholder="e.g. Auto-Notify on New Remote AI Internships"
                value={ruleTitle}
                onChange={(e) => setRuleTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">WHEN Condition</label>
              <Input
                placeholder="e.g. When new AI job matches > 90% fit"
                value={ruleCondition}
                onChange={(e) => setRuleCondition(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">THEN Action</label>
              <Input
                placeholder="e.g. Draft cover letter and alert on mobile"
                value={ruleActionTask}
                onChange={(e) => setRuleActionTask(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowAddRuleModal(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleAddRule}>
                Register Rule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
