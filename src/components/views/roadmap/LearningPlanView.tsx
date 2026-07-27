/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { StructuredLearningPlan, LearningResourceItem } from '../../../types';
import {
  BookOpen,
  Video,
  FileCode,
  Globe,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LearningPlanViewProps {
  learningPlans: StructuredLearningPlan[];
  onToggleResource?: (planId: string, resourceId: string) => void;
}

export function LearningPlanView({ learningPlans, onToggleResource }: LearningPlanViewProps) {
  const defaultResources: LearningResourceItem[] = [
    { id: 'lr_1', title: 'TypeScript Deep Dive & Advanced Patterns', type: 'book', provider: 'Official Docs & Handbook', url: 'https://www.typescriptlang.org/docs/', estimatedTime: '12 Hours', difficulty: 'Intermediate', orderIndex: 1, completed: true },
    { id: 'lr_2', title: 'PostgreSQL Query Optimization & Indexing', type: 'course', provider: 'PostgreSQL Academy', url: 'https://www.postgresql.org/docs/', estimatedTime: '18 Hours', difficulty: 'Advanced', orderIndex: 2, completed: false },
    { id: 'lr_3', title: 'System Design Interview Fundamentals', type: 'youtube', provider: 'System Design Channel', url: 'https://youtube.com', estimatedTime: '10 Hours', difficulty: 'Intermediate', orderIndex: 3, completed: false },
    { id: 'lr_4', title: 'Google Cloud Run Container Architecture', type: 'documentation', provider: 'Google Cloud Platform', url: 'https://cloud.google.com/run/docs', estimatedTime: '8 Hours', difficulty: 'Intermediate', orderIndex: 4, completed: false },
    { id: 'lr_5', title: 'LeetCode Patterns & Algorithm Masterclass', type: 'practice_platform', provider: 'LeetCode', url: 'https://leetcode.com', estimatedTime: '25 Hours', difficulty: 'Advanced', orderIndex: 5, completed: false }
  ];

  const plans = learningPlans.length > 0 ? learningPlans : [
    {
      id: 'lp_default',
      title: 'Full-Stack Technical Career Track',
      targetRole: 'Senior Full-Stack Engineer',
      category: 'Software Engineering',
      estimatedHoursTotal: 73,
      estimatedHoursCompleted: 12,
      status: 'in_progress' as const,
      progressPercent: 16,
      resources: defaultResources
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <GraduationCap className="w-3.5 h-3.5 mr-1" /> AI Curated Learning Paths
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Structured Learning Roadmap</h2>
          <p className="text-sm text-muted-foreground">Order-optimized courses, books, documentation, and research papers for your target role.</p>
        </div>
      </div>

      <div className="space-y-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border border-border/60 bg-surface-raised shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-xl font-bold">{plan.title}</CardTitle>
                  <CardDescription className="text-xs">{plan.targetRole} • ~{plan.estimatedHoursTotal} Hours Estimated</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0">
                  {plan.resources.filter(r => r.completed).length} / {plan.resources.length} Completed
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {plan.resources.map((res) => (
                  <div
                    key={res.id}
                    className={cn(
                      "p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all",
                      res.completed ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground" : "bg-background border-border/60 hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        #{res.orderIndex}
                      </div>
                      <div>
                        <h4 className={cn("text-sm font-bold", res.completed && "line-through text-muted-foreground")}>
                          {res.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="capitalize font-medium">{res.type}</span>
                          <span>•</span>
                          <span>{res.provider}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {res.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center gap-1 shrink-0"
                    >
                      Open Resource <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
