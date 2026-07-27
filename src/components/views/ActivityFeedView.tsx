/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  CheckCircle2,
  Briefcase,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useActivityFeed } from '../../hooks/useActivityFeed';

export const ActivityFeedView: React.FC = () => {
  const { activities, loading } = useActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'application_submitted':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'interview_completed':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'learning_completed':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'ai_recommendation':
        return <Sparkles className="w-4 h-4 text-primary animate-pulse" />;
      default:
        return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Productivity Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Realtime Activity Audit Feed</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Career Execution Log
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Chronological real-time event log tracking task completions, mock interview drills, resume applications, and AI productivity milestones.
          </p>
        </div>
      </div>

      <Card className="bg-[var(--surface)] border-[var(--border)] p-6">
        <CardHeader className="border-b border-[var(--border)] pb-3 mb-4">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-text-sub flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-primary" /> Live Audit Trail ({activities.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex flex-col gap-3">
          {activities.length === 0 ? (
            <p className="text-center py-12 text-xs text-text-sub">No activity logged yet.</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-card bg-[var(--surface-secondary)]/40 border border-[var(--border)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shrink-0">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-text-main">{act.title}</span>
                    <p className="text-[11px] text-text-sub font-semibold">{act.description}</p>
                    <span className="text-[9px] text-text-mute font-bold mt-1">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {act.xpEarned > 0 && (
                  <Badge variant="primary" className="text-xs font-black px-2.5 py-1 shrink-0">
                    +{act.xpEarned} XP
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityFeedView;
