/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { MonthlyGoal } from '../../../types';
import { Target, Zap, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MonthlyGoalsViewProps {
  goals: MonthlyGoal[];
  onSaveGoals: (goals: MonthlyGoal[]) => void;
}

export function MonthlyGoalsView({ goals, onSaveGoals }: MonthlyGoalsViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Target className="w-3.5 h-3.5 mr-1" /> Monthly Strategic Milestones
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Monthly Goal Planning</h2>
          <p className="text-sm text-muted-foreground">Macro-level career milestones with target metric tracking and visual completion meters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="border border-border/60 bg-surface-raised shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">{goal.title}</CardTitle>
                  <CardDescription className="text-xs pt-0.5">{goal.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs bg-muted/60">
                  {goal.monthYear}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Progress Target</span>
                  <span>{goal.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span>Metric: <strong className="text-foreground">{goal.targetMetric}</strong></span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{goal.xpValue} XP
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
