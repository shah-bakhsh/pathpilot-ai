/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Flame, Clock, Plus, Trash2, CheckCircle, Award, Target, HelpCircle, Check, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DailyMission } from '../../../types';

export const DailyMissionsPanel: React.FC = () => {
  const { dailyMissions, completeMission, addNotification } = useCareer();
  const { addXp, user } = useAuth();
  
  // Local state for custom tasks
  const [customMissions, setCustomMissions] = useState<DailyMission[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customXp, setCustomXp] = useState<number>(15);
  const [customTime, setCustomTime] = useState<number>(15);

  const handleAddCustomMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newMission: DailyMission = {
      id: 'custom_' + Math.random().toString(36).substring(2, 9),
      text: customText.trim(),
      title: customText.trim(),
      completed: false,
      xpValue: customXp,
      timeMinutes: customTime,
      priority: 'Medium',
      difficulty: 'Intermediate',
      category: 'general'
    };

    setCustomMissions(prev => [...prev, newMission]);
    setCustomText('');
    setIsAdding(false);
    
    addNotification(
      'Custom Coordinates Added',
      `New custom mission added: "${newMission.text}" worth ${newMission.xpValue} XP.`,
      'info'
    );
  };

  const handleToggleMission = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomMissions(prev =>
        prev.map(m => {
          if (m.id === id && !m.completed) {
            addXp(m.xpValue);
            addNotification('Custom Mission Complete!', `+${m.xpValue} XP. consistency tracker synchronized!`, 'streak');
            return { ...m, completed: true };
          }
          return m;
        })
      );
    } else {
      completeMission(id);
    }
  };

  const handleDeleteCustomMission = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomMissions(prev => prev.filter(m => m.id !== id));
  };

  const getDifficulty = (xp: number) => {
    if (xp >= 25) return { label: 'Advanced', style: 'text-error bg-error/10 border-error/20' };
    if (xp >= 20) return { label: 'Intermediate', style: 'text-warning bg-warning/10 border-warning/20' };
    return { label: 'Fundamentals', style: 'text-success bg-success/10 border-success/20' };
  };

  const getPriority = (id: string) => {
    if (id.includes('1') || id.includes('custom')) return { label: 'Urgent', style: 'text-error bg-error/10 border-error/20' };
    if (id.includes('2')) return { label: 'Important', style: 'text-warning bg-warning/10 border-warning/20' };
    return { label: 'Optional', style: 'text-text-mute bg-[var(--hover-tint)]/60 border-[var(--border)]/40' };
  };

  const allMissions = [
    ...dailyMissions.map(m => ({ ...m, isCustom: false })),
    ...customMissions.map(m => ({ ...m, isCustom: true }))
  ];

  const completedCount = allMissions.filter(m => m.completed).length;
  const totalCount = allMissions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="w-full flex flex-col justify-between border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-shadow duration-300">
      <div>
        <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)]/60 pb-4">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
              <Flame className="w-4.5 h-4.5 text-accent animate-pulse fill-accent" /> Today's Core Missions
            </CardTitle>
            <CardDescription className="text-[10px]">
              Complete daily objectives or target custom parameters to scale your Career XP levels.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 text-[11px] h-8 px-3 font-extrabold bg-[var(--hover-tint)]/10 hover:bg-[var(--hover-tint)]/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> <span>Add Custom</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col gap-4">
          {/* Visual Progress Header */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/5 via-accent/2 to-transparent border border-primary/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-sub flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-primary" /> Daily Completion Ratio
              </span>
              <span className="text-primary font-black">{completedCount}/{totalCount} Completed ({progressPercent}%)</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--border)]/75 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sliding Input Box for Custom Tasks */}
          {isAdding && (
            <form
              onSubmit={handleAddCustomMission}
              className="p-3.5 bg-[var(--hover-tint)]/30 border border-[var(--border)] rounded-xl flex flex-col gap-3 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-primary text-primary" /> Create Task Coordinates
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-[10px] text-text-mute hover:text-text-main font-bold"
                >
                  Close
                </button>
              </div>

              <Input
                label="Mission Objective Text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Conduct PostgreSQL indexing benchmark..."
                required
                className="text-xs"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="XP Reward Value"
                  type="number"
                  value={customXp}
                  onChange={(e) => setCustomXp(parseInt(e.target.value) || 10)}
                  placeholder="15"
                  className="text-xs"
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={customTime}
                  onChange={(e) => setCustomTime(parseInt(e.target.value) || 15)}
                  placeholder="15"
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border)]/40">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-[11px] h-8"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  className="text-[11px] h-8 bg-primary text-black hover:opacity-90"
                >
                  Deploy Task
                </Button>
              </div>
            </form>
          )}

          {/* Interactive Missions Stack */}
          <div className="flex flex-col gap-2.5">
            {allMissions.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-mute font-bold flex flex-col items-center gap-1.5">
                <span>No missions mapped for today.</span>
                <span className="text-[10px] text-text-mute/60 font-medium">Click 'Add Custom' to calibrate new parameters.</span>
              </div>
            ) : (
              allMissions.map((mission) => {
                const diff = getDifficulty(mission.xpValue);
                const priority = getPriority(mission.id);

                return (
                  <div
                    key={mission.id}
                    onClick={() => handleToggleMission(mission.id, mission.isCustom)}
                    className={cn(
                      'flex items-start justify-between gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 select-none group',
                      mission.completed
                        ? 'bg-[var(--hover-tint)]/15 border-[var(--border)]/40 opacity-60'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--hover-tint)]/40 hover:border-primary/20 hover:shadow-2xs'
                    )}
                  >
                    <div className="flex gap-3 items-start min-w-0 flex-1">
                      {/* Premium Custom Checkbox */}
                      <div
                        className={cn(
                          'w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
                          mission.completed
                            ? 'bg-success border-success text-black scale-95'
                            : 'border-[var(--border)] group-hover:border-primary group-hover:scale-105'
                        )}
                      >
                        {mission.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className={cn(
                          'text-xs font-bold leading-snug tracking-tight transition-all duration-150',
                          mission.completed ? 'text-text-mute line-through' : 'text-text-sub group-hover:text-text-main'
                        )}>
                          {mission.text}
                        </span>
                        
                        {/* Meta Badge Elements */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] text-text-mute font-semibold">
                            <Clock className="w-3 h-3 text-text-mute shrink-0" /> {mission.timeMinutes}m
                          </span>
                          <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wider', diff.style)}>
                            {diff.label}
                          </span>
                          <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wider', priority.style)}>
                            {priority.label}
                          </span>
                          {mission.isCustom && (
                            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                              Custom
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-center">
                      <span className="text-xs font-black text-primary flex items-center gap-0.5 bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5 text-primary" /> +{mission.xpValue} XP
                      </span>
                      {mission.isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomMission(mission.id, e)}
                          className="p-1.5 text-text-mute hover:text-danger rounded-lg hover:bg-danger/10 transition-colors"
                          title="Delete Custom Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </div>

      {/* Dynamic Motivation Tips */}
      <div className="p-3 border-t border-[var(--border)]/60 bg-[var(--surface-secondary)]/50 text-[10.5px] text-text-mute leading-relaxed font-semibold flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span>Completing missions boosts your <strong>{user?.activeStreak || 5}-day pipelines streak</strong> and logs career progression markers.</span>
      </div>
    </Card>
  );
};

export default DailyMissionsPanel;
