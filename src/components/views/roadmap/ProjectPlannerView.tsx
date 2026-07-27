/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ProjectPlanItem } from '../../../types';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Clock,
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ProjectPlannerViewProps {
  projects: ProjectPlanItem[];
  onSaveProjects: (projects: ProjectPlanItem[]) => void;
}

export function ProjectPlannerView({ projects, onSaveProjects }: ProjectPlannerViewProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filtered = projects.filter(p => filterDifficulty === 'all' || p.difficulty === filterDifficulty);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Code2 className="w-3.5 h-3.5 mr-1" /> Portfolio Project Planner
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Industry & Research Level Projects</h2>
          <p className="text-sm text-muted-foreground">High-value portfolio projects designed to demonstrate production readiness to hiring managers.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Beginner', 'Intermediate', 'Advanced', 'Industry-Level', 'Research-Level'].map(diff => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              filterDifficulty === diff ? "bg-primary text-primary-foreground shadow-xs" : "bg-surface-raised text-muted-foreground hover:text-foreground"
            )}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proj) => (
          <Card key={proj.id} className="border border-border/60 bg-surface-raised shadow-sm hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-base font-bold">{proj.title}</CardTitle>
                  <CardDescription className="text-xs pt-1">{proj.objective}</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
                  {proj.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-wrap gap-1">
                {proj.requiredSkills.map((sk, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">
                    {sk}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{proj.estimatedDuration}</span>
                <span className="font-semibold text-foreground">Portfolio Value: <span className="text-emerald-600 dark:text-emerald-400">{proj.portfolioValue}</span></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
