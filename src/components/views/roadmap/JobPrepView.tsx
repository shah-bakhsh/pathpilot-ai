/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { JobPrepChecklistItem } from '../../../types';
import {
  Briefcase,
  FileText,
  Linkedin,
  Github,
  Globe,
  Users,
  CheckCircle2,
  Check,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function JobPrepView() {
  const [items, setItems] = useState<JobPrepChecklistItem[]>([
    { id: 'jp_1', category: 'resume', title: 'Optimize Bullet Points with Metrics (Google XYZ Pattern)', completed: true, priority: 'High', xpValue: 100 },
    { id: 'jp_2', category: 'linkedin', title: 'Update Headline & About Section for Target Role SEO', completed: true, priority: 'High', xpValue: 80 },
    { id: 'jp_3', category: 'github', title: 'Pin Top 3 Repositories with Clean README & Architecture Diagrams', completed: false, priority: 'High', xpValue: 120 },
    { id: 'jp_4', category: 'portfolio', title: 'Publish Custom Domain Portfolio with Live Project Demos', completed: false, priority: 'High', xpValue: 150 },
    { id: 'jp_5', category: 'networking', title: 'Reach Out to 5 Tech Recruiters / Alumni on LinkedIn', completed: false, priority: 'Medium', xpValue: 90 },
    { id: 'jp_6', category: 'interview', title: 'Complete System Design Mock Round with AI Career Coach', completed: false, priority: 'High', xpValue: 200 },
    { id: 'jp_7', category: 'applications', title: 'Submit 10 Tailored Applications on PathPilot Opportunities Hub', completed: false, priority: 'High', xpValue: 250 }
  ]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const categories = ['all', 'resume', 'linkedin', 'github', 'portfolio', 'networking', 'interview', 'applications'];
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = items.filter(i => selectedCat === 'all' || i.category === selectedCat);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Briefcase className="w-3.5 h-3.5 mr-1" /> Internship & Job Preparation
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Job Search Readiness Hub</h2>
          <p className="text-sm text-muted-foreground">Actionable checklists covering resume optimization, LinkedIn branding, GitHub polishing, networking, and mock interviews.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
              selectedCat === cat ? "bg-primary text-primary-foreground shadow-xs" : "bg-surface-raised text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "border transition-all shadow-sm",
              item.completed ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground" : "bg-surface-raised border-border/60 hover:border-primary/40"
            )}
          >
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0",
                    item.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
                  )}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <span className={cn("text-sm font-semibold", item.completed && "line-through text-muted-foreground")}>
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                  {item.category}
                </Badge>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{item.xpValue} XP
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
