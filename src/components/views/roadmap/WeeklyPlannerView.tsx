/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { WeeklyGoal } from '../../../types';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Trash2,
  Copy,
  Archive,
  Edit2,
  Sparkles,
  Zap,
  MoreVertical,
  Check,
  Clock
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface WeeklyPlannerViewProps {
  goals: WeeklyGoal[];
  onSaveGoals: (goals: WeeklyGoal[]) => void;
  onAddXp?: (amount: number) => void;
}

export function WeeklyPlannerView({ goals, onSaveGoals, onAddXp }: WeeklyPlannerViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Learning');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [xpValue, setXpValue] = useState(150);

  const handleToggleComplete = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextStatus = g.status === 'completed' ? 'in_progress' : 'completed';
        if (nextStatus === 'completed' && onAddXp) {
          onAddXp(g.xpValue || 150);
        }
        return {
          ...g,
          status: nextStatus as WeeklyGoal['status'],
          completedTasksCount: nextStatus === 'completed' ? g.tasksCount : 0
        };
      }
      return g;
    });
    onSaveGoals(updated);
  };

  const handleDelete = (id: string) => {
    onSaveGoals(goals.filter(g => g.id !== id));
  };

  const handleDuplicate = (goal: WeeklyGoal) => {
    const dup: WeeklyGoal = {
      ...goal,
      id: 'wg_' + Math.random().toString(36).substring(2, 9),
      title: `${goal.title} (Copy)`,
      status: 'pending'
    };
    onSaveGoals([dup, ...goals]);
  };

  const handleArchive = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, status: 'archived' as WeeklyGoal['status'] } : g);
    onSaveGoals(updated);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoal) {
      const updated = goals.map(g => g.id === editingGoal.id ? {
        ...g,
        title,
        description: desc,
        category,
        priority,
        xpValue
      } : g);
      onSaveGoals(updated);
      setEditingGoal(null);
    } else {
      const newGoal: WeeklyGoal = {
        id: 'wg_' + Math.random().toString(36).substring(2, 9),
        title,
        description: desc,
        category,
        weekStartDate: new Date().toISOString().split('T')[0],
        weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        priority,
        tasksCount: 3,
        completedTasksCount: 0,
        xpValue
      };
      onSaveGoals([newGoal, ...goals]);
    }

    setTitle('');
    setDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-surface-raised rounded-2xl border border-border/60">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Calendar className="w-3.5 h-3.5 mr-1" /> Weekly Execution Planner
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Weekly Goal Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Plan, duplicate, edit, and execute weekly career sprints with full task breakdown.
          </p>
        </div>

        <Button
          onClick={() => { setEditingGoal(null); setTitle(''); setDesc(''); setShowAddModal(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Weekly Goal
        </Button>
      </div>

      {/* Goal Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.filter(g => g.status !== 'archived').map((goal) => (
          <Card key={goal.id} className={cn(
            "border transition-all shadow-sm hover:border-primary/40",
            goal.status === 'completed' ? "bg-emerald-500/5 border-emerald-500/30" : "bg-surface-raised border-border/60"
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleComplete(goal.id)}
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0",
                      goal.status === 'completed' ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
                    )}
                  >
                    {goal.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <CardTitle className={cn("text-base font-bold", goal.status === 'completed' && "line-through text-muted-foreground")}>
                    {goal.title}
                  </CardTitle>
                </div>

                <Badge variant="outline" className="text-[10px] capitalize">
                  {goal.category}
                </Badge>
              </div>
              {goal.description && (
                <CardDescription className="text-xs pt-1">{goal.description}</CardDescription>
              )}
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Sprint: {goal.weekStartDate} → {goal.weekEndDate}
                </span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{goal.xpValue} XP
                </span>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicate(goal)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-3 h-3 mr-1" /> Duplicate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArchive(goal.id)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Archive className="w-3 h-3 mr-1" /> Archive
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(goal.id)}
                  className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-background border border-border/80 shadow-xl space-y-4 p-6">
            <h3 className="text-lg font-bold">Create Weekly Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Docker Containerization Pipeline"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-sm p-2 bg-surface-raised rounded-lg border border-border/60 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Description / Deliverables</label>
                <textarea
                  placeholder="Describe target outcomes..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="w-full text-sm p-2 bg-surface-raised rounded-lg border border-border/60 focus:outline-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs p-2 bg-surface-raised rounded-lg border border-border/60"
                  >
                    <option value="Learning">Learning</option>
                    <option value="Projects">Projects</option>
                    <option value="Applications">Applications</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Interview">Interview Prep</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold">XP Reward</label>
                  <input
                    type="number"
                    value={xpValue}
                    onChange={e => setXpValue(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-surface-raised rounded-lg border border-border/60"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Save Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
