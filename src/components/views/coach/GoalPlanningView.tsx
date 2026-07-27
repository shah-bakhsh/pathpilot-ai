/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Award,
  BarChart3,
  Check
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { AiCoachService } from '../../../services/aiCoachService';
import { GoalPlan, GoalPlanMilestone } from '../../../types';
import { Badge } from '../../ui/Badge';

export const GoalPlanningView: React.FC = () => {
  const { user } = useAuth();
  const [goalPlans, setGoalPlans] = useState<GoalPlan[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const loadGoalPlans = async () => {
    if (!user) return;
    const data = await AiCoachService.getGoalPlans(user.uid);
    setGoalPlans(data);
    if (data.length > 0 && !activeGoalId) {
      setActiveGoalId(data[0].id);
    }
  };

  useEffect(() => {
    loadGoalPlans();
  }, [user]);

  const activeGoal = goalPlans.find(g => g.id === activeGoalId) || goalPlans[0];

  const handleToggleMilestone = async (milestoneId: string) => {
    if (!user || !activeGoal) return;
    const updatedMilestones = activeGoal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const updatedGoal: GoalPlan = {
      ...activeGoal,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString()
    };
    await AiCoachService.saveGoalPlan(user.uid, updatedGoal);
    loadGoalPlans();
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeGoal || !newMilestoneText.trim()) return;

    const newM: GoalPlanMilestone = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      title: newMilestoneText.trim(),
      completed: false
    };

    const updatedGoal: GoalPlan = {
      ...activeGoal,
      milestones: [...activeGoal.milestones, newM],
      updatedAt: new Date().toISOString()
    };

    await AiCoachService.saveGoalPlan(user.uid, updatedGoal);
    setNewMilestoneText('');
    loadGoalPlans();
  };

  const calculateCompletionPercent = (milestones: GoalPlanMilestone[]) => {
    if (!milestones.length) return 0;
    const done = milestones.filter(m => m.completed).length;
    return Math.round((done / milestones.length) * 100);
  };

  return (
    <div id="goal-planning-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold">SMART Career Goal Planning Workspace</h1>
          </div>
          <p className="text-xs text-amber-200/80">
            Formulate, track, and execute high-signal milestone roadmaps aligned with your dream role.
          </p>
        </div>
      </div>

      {activeGoal && (
        <div className="space-y-6">
          {/* Main Goal Plan Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">Active Strategy Plan</Badge>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Timeframe: {activeGoal.timeframe}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{activeGoal.goalTitle}</h2>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-amber-500">
                  {calculateCompletionPercent(activeGoal.milestones)}%
                </span>
                <p className="text-xs text-[var(--color-text-secondary)]">Milestone Progress</p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${calculateCompletionPercent(activeGoal.milestones)}%` }}
              />
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Milestone Action Items ({activeGoal.milestones.filter(m => m.completed).length} / {activeGoal.milestones.length})
              </h3>

              <div className="space-y-2">
                {activeGoal.milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      m.completed
                        ? 'bg-[var(--color-bg-tertiary)]/50 border-[var(--color-border)] opacity-70'
                        : 'bg-[var(--color-bg-primary)] border-[var(--color-border)] hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />
                      )}
                      <span className={`text-xs font-semibold ${m.completed ? 'line-through text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {m.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Milestone Form */}
              <form onSubmit={handleAddMilestone} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  placeholder="Add custom milestone checkpoint..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <button
                  type="submit"
                  disabled={!newMilestoneText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPlanningView;
