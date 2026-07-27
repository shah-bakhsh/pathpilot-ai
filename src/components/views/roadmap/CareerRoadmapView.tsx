/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { CareerRoadmap, RoadmapPhase, RoadmapTask } from '../../../types';
import {
  Map,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Zap,
  Target,
  Layers,
  Calendar,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CareerRoadmapViewProps {
  roadmap: CareerRoadmap | null;
  onToggleTask: (phaseId: number, taskId: string) => void;
  onRegenerateRoadmap: () => void;
  isGenerating: boolean;
}

export function CareerRoadmapView({
  roadmap,
  onToggleTask,
  onRegenerateRoadmap,
  isGenerating
}: CareerRoadmapViewProps) {
  const [horizonTab, setHorizonTab] = useState<'12m' | '6m' | '90d' | '30d' | '7d' | 'today'>('12m');
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const phases = roadmap?.phases || [];

  const totalTasks = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedTasks = phases.reduce((acc, p) => acc + p.milestones.filter(m => m.checked).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-surface-raised dark:bg-zinc-900 rounded-2xl border border-border/60 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Multi-Horizon AI Roadmap
            </Badge>
            <span className="text-xs text-muted-foreground">
              Generated: {roadmap?.generatedAt ? new Date(roadmap.generatedAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {roadmap?.targetRole ? `${roadmap.targetRole} Execution Roadmap` : 'Strategic Career Roadmap'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Structured step-by-step career path tailored to your skills, experience, and target position.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground font-medium">Overall Completion</p>
            <p className="text-xl font-extrabold text-primary">{overallProgress}%</p>
          </div>
          <Button
            onClick={onRegenerateRoadmap}
            disabled={isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md"
          >
            <Sparkles className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Regenerating...' : 'Adapt Roadmap with AI'}
          </Button>
        </div>
      </div>

      {/* Horizon Selection Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-border/40">
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl">
          <button
            onClick={() => setHorizonTab('12m')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              horizonTab === '12m' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            12-Month Plan
          </button>
          <button
            onClick={() => setHorizonTab('6m')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              horizonTab === '6m' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            6-Month
          </button>
          <button
            onClick={() => setHorizonTab('90d')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              horizonTab === '90d' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            90-Day Sprint
          </button>
          <button
            onClick={() => setHorizonTab('30d')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              horizonTab === '30d' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            30-Day
          </button>
          <button
            onClick={() => setHorizonTab('7d')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              horizonTab === '7d' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            7-Day Focus
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-surface-raised rounded-lg border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/40 w-40 sm:w-56"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e: any) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-surface-raised rounded-lg border border-border/60 text-foreground focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Roadmap Milestone Completion</span>
          <span>{completedTasks} of {totalTasks} Completed</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
          />
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const isExpanded = expandedPhases[phase.phaseId] ?? true;
          const phaseTasks = phase.milestones.filter(m => {
            const matchesSearch = searchQuery === '' || m.text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || m.priority === filterPriority;
            return matchesSearch && matchesPriority;
          });
          const phaseDoneCount = phase.milestones.filter(m => m.checked).length;
          const phasePercent = phase.milestones.length > 0 ? Math.round((phaseDoneCount / phase.milestones.length) * 100) : 0;

          return (
            <Card key={phase.phaseId} className="border border-border/60 overflow-hidden shadow-sm hover:border-border transition-colors">
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.phaseId)}
                className="p-5 flex items-center justify-between bg-surface-raised/50 cursor-pointer select-none border-b border-border/40"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs",
                    phasePercent === 100 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary"
                  )}>
                    {phase.phaseId}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{phase.title}</h3>
                      <Badge variant="outline" className="text-[10px] bg-muted/60">
                        <Clock className="w-3 h-3 mr-1" /> {phase.timeToComplete}
                      </Badge>
                    </div>
                    {phase.objective && (
                      <p className="text-xs text-muted-foreground mt-0.5">{phase.objective}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-foreground">{phasePercent}%</span>
                    <p className="text-[10px] text-muted-foreground">{phaseDoneCount}/{phase.milestones.length} Done</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Phase Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-5 space-y-3 bg-background">
                      {phaseTasks.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-4">No tasks matching your current filters.</p>
                      ) : (
                        phaseTasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "p-3.5 rounded-xl border transition-all flex items-start gap-3 group",
                              task.checked
                                ? "bg-emerald-500/5 border-emerald-500/20 text-muted-foreground"
                                : "bg-surface-raised border-border/50 hover:border-primary/40 text-foreground"
                            )}
                          >
                            <button
                              onClick={() => onToggleTask(phase.phaseId, task.id)}
                              className={cn(
                                "mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0",
                                task.checked
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-border/80 group-hover:border-primary/60 bg-background"
                              )}
                            >
                              {task.checked && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={cn("text-sm font-medium leading-snug", task.checked && "line-through text-muted-foreground")}>
                                  {task.text}
                                </p>
                                {task.priority && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] shrink-0",
                                      task.priority === 'High' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                      task.priority === 'Medium' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                      "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    )}
                                  >
                                    {task.priority}
                                  </Badge>
                                )}
                              </div>

                              {(task.resourceName || task.estimatedHours) && (
                                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                                  {task.resourceName && (
                                    <a
                                      href={task.resourceUrl || '#'}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center hover:text-primary transition-colors text-primary/80 font-medium"
                                    >
                                      <BookOpen className="w-3 h-3 mr-1" />
                                      {task.resourceName}
                                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                  )}
                                  {task.estimatedHours && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> ~{task.estimatedHours} hrs
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
