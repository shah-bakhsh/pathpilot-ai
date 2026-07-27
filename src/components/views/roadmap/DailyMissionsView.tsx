/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { DailyMission } from '../../../types';
import {
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Plus,
  Filter,
  Flame,
  Check,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DailyMissionsViewProps {
  missions: DailyMission[];
  onCompleteMission: (missionId: string) => void;
  onGenerateNewMissions?: () => void;
  isGenerating?: boolean;
}

export function DailyMissionsView({
  missions,
  onCompleteMission,
  onGenerateNewMissions,
  isGenerating
}: DailyMissionsViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customXp, setCustomXp] = useState(50);

  const completedCount = missions.filter(m => m.completed).length;
  const totalXpToday = missions.filter(m => m.completed).reduce((acc, m) => acc + (m.xpValue || 50), 0);

  const filteredMissions = missions.filter(m => {
    const matchesCat = filterCategory === 'all' || m.category === filterCategory;
    const matchesPrio = filterPriority === 'all' || m.priority === filterPriority;
    return matchesCat && matchesPrio;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent rounded-2xl border border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
              <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" /> Daily Mission Hub
            </Badge>
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Today's Career Missions
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete daily high-impact tasks to gain XP, unlock career badges, and accelerate your timeline.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-surface-raised p-3 rounded-xl border border-border/60 text-center shrink-0">
            <span className="text-xs text-muted-foreground block font-medium">Daily XP Earned</span>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-current" /> +{totalXpToday} XP
            </span>
          </div>

          {onGenerateNewMissions && (
            <Button
              onClick={onGenerateNewMissions}
              disabled={isGenerating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm shrink-0"
            >
              <Sparkles className={cn("w-4 h-4", isGenerating && "animate-spin")} />
              {isGenerating ? 'Generating...' : 'Refresh AI Missions'}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-raised p-3 rounded-xl border border-border/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-muted-foreground font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {['all', 'leetcode', 'lecture', 'resume', 'project', 'internship', 'interview'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all",
                filterCategory === cat ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="text-xs bg-background border border-border/60 rounded-lg px-2.5 py-1 text-foreground focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredMissions.map((mission) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn(
                "border transition-all hover:shadow-sm relative overflow-hidden",
                mission.completed
                  ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                  : "border-border/60 bg-surface-raised hover:border-primary/40"
              )}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onCompleteMission(mission.id)}
                        className={cn(
                          "mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0",
                          mission.completed
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-border/80 hover:border-primary/60 bg-background"
                        )}
                      >
                        {mission.completed && <Check className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <h4 className={cn("text-sm font-bold leading-tight", mission.completed && "line-through text-muted-foreground")}>
                          {mission.title || mission.text}
                        </h4>
                        {mission.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{mission.description}</p>
                        )}
                        {!mission.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{mission.text}</p>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-wider font-bold shrink-0",
                        mission.priority === 'High' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                        mission.priority === 'Medium' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      )}
                    >
                      {mission.priority || 'Medium'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {mission.timeMinutes || 30} mins
                      </span>
                      <span className="capitalize bg-muted/60 px-2 py-0.5 rounded text-[10px] font-medium">
                        {mission.category || 'general'}
                      </span>
                    </div>

                    <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{mission.xpValue || 50} XP
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
