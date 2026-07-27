/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CareerTimelineStage } from '../../../types';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

interface CareerTimelineViewProps {
  timeline: CareerTimelineStage[];
  targetRole?: string;
}

export function CareerTimelineView({ timeline, targetRole }: CareerTimelineViewProps) {
  const defaultStages: CareerTimelineStage[] = [
    {
      id: 'stg_1',
      phaseId: 1,
      title: 'Foundation & Core Architecture',
      targetRole: targetRole || 'Target Career Role',
      startDate: '2026-07-01',
      estimatedCompletionDate: '2026-08-15',
      status: 'completed',
      progressPercent: 100,
      milestonesCount: 5,
      completedMilestonesCount: 5,
      xpReward: 300,
      highlights: ['Mastered TypeScript Generics', 'Built Express & PostgreSQL API layer', 'Configured Auth sessions']
    },
    {
      id: 'stg_2',
      phaseId: 2,
      title: 'System Design & Distributed Services',
      targetRole: targetRole || 'Target Career Role',
      startDate: '2026-08-16',
      estimatedCompletionDate: '2026-10-01',
      status: 'in_progress',
      progressPercent: 55,
      milestonesCount: 6,
      completedMilestonesCount: 3,
      xpReward: 500,
      highlights: ['Redis Caching Implementation', 'Cloud Run Container Deployment', 'Database Indexing Optimization']
    },
    {
      id: 'stg_3',
      phaseId: 3,
      title: 'Production Capstone & Interview Rounds',
      targetRole: targetRole || 'Target Career Role',
      startDate: '2026-10-02',
      estimatedCompletionDate: '2026-12-01',
      status: 'upcoming',
      progressPercent: 0,
      milestonesCount: 4,
      completedMilestonesCount: 0,
      xpReward: 750,
      highlights: ['LeetCode System Interview Mastery', 'Portfolio Site Launch', 'Mock Behavioral Screens']
    }
  ];

  const stages = timeline.length > 0 ? timeline : defaultStages;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-surface-raised dark:bg-zinc-900 rounded-2xl border border-border/60">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Milestone className="w-3.5 h-3.5 mr-1" /> Career Milestones Timeline
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Career Progression Roadmap Timeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Visual milestone breakdown mapping out expected completion dates, XP milestones, and key achievements.
          </p>
        </div>
      </div>

      {/* Interactive Vertical Timeline */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-border/80 space-y-8 my-6">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative"
          >
            {/* Dot indicator */}
            <div
              className={cn(
                "absolute -left-[31px] md:-left-[39px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-sm transition-all",
                stage.status === 'completed'
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : stage.status === 'in_progress'
                  ? "bg-primary border-primary text-white ring-4 ring-primary/20"
                  : "bg-surface-raised border-border text-muted-foreground"
              )}
            >
              {stage.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{stage.phaseId}</span>
              )}
            </div>

            {/* Stage Card */}
            <Card className="border border-border/60 shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold">{stage.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          stage.status === 'completed' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          stage.status === 'in_progress' ? "bg-primary/10 text-primary border-primary/20" :
                          "bg-muted text-muted-foreground"
                        )}
                      >
                        {stage.status === 'completed' ? 'Completed' : stage.status === 'in_progress' ? 'In Active Progress' : 'Upcoming Stage'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Target Role: <span className="font-semibold text-foreground">{stage.targetRole}</span>
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Est. Completion: {stage.estimatedCompletionDate}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Milestones Completed</span>
                    <span className="font-semibold text-foreground">{stage.completedMilestonesCount} / {stage.milestonesCount} ({stage.progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        stage.status === 'completed' ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${stage.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Highlights / Key Outcomes */}
                {stage.highlights && stage.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-border/40">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-primary" /> Stage Focus Deliverables:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stage.highlights.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 text-muted-foreground border-t border-border/40">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-3.5 h-3.5 fill-current" /> +{stage.xpReward} XP Stage Reward
                  </span>
                  <span className="text-[11px]">Start Date: {stage.startDate}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
