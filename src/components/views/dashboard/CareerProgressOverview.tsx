/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  TrendingUp,
  Award,
  BookOpen,
  Map,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Progress } from '../../ui/Progress';
import { Badge } from '../../ui/Badge';

export const CareerProgressOverview: React.FC = () => {
  const { roadmap, learningCourses, jobApplications } = useCareer();
  const { user } = useAuth();

  const xp = user?.experiencePoints || 320;
  const level = Math.floor(xp / 100) + 1;
  const currentXpInLevel = xp % 100;

  // Calculate overall roadmap completion ratio
  const roadmapStats = React.useMemo(() => {
    if (!roadmap) return { total: 10, completed: 4, percent: 40 };
    let total = 0;
    let completed = 0;
    roadmap.phases.forEach(phase => {
      phase.milestones.forEach(m => {
        total++;
        if (m.checked) completed++;
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [roadmap]);

  // Calculate learning hours completed
  const learningStats = React.useMemo(() => {
    let totalHours = 0;
    let completedHours = 0;
    learningCourses.forEach(c => {
      totalHours += c.hoursTotal;
      completedHours += c.hoursCompleted;
    });
    if (totalHours === 0) {
      totalHours = 40;
      completedHours = 18;
    }
    const percent = Math.round((completedHours / totalHours) * 100);
    return { totalHours, completedHours, percent };
  }, [learningCourses]);

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] hover:shadow-sm transition-shadow duration-300 select-none">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Career Trajectory Progress & Velocity
          </CardTitle>
          <Badge variant="primary" className="text-xs font-black py-1 px-3">
            Weekly Velocity: 18.4 hrs
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Level & XP Progress */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col justify-between gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-main">Pathfinder Rank</h4>
                  <span className="text-[10px] text-text-mute font-semibold">Level {level} Milestone</span>
                </div>
              </div>
              <span className="text-xs font-black text-primary">{xp} Total XP</span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[10px] font-black text-text-sub">
                <span>Progress to Level {level + 1}</span>
                <span>{currentXpInLevel}/100 XP</span>
              </div>
              <Progress value={currentXpInLevel} className="h-2" />
            </div>
          </div>

          {/* Card 2: Roadmap Completion */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col justify-between gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-info/10 text-info">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-main">Roadmap Progress</h4>
                  <span className="text-[10px] text-text-mute font-semibold">{roadmapStats.completed} of {roadmapStats.total} Milestones</span>
                </div>
              </div>
              <span className="text-xs font-black text-info">{roadmapStats.percent}%</span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[10px] font-black text-text-sub">
                <span>Phase Completion</span>
                <span>{roadmapStats.percent}%</span>
              </div>
              <Progress value={roadmapStats.percent} variant="primary" className="h-2" />
            </div>
          </div>

          {/* Card 3: Learning Hours Velocity */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col justify-between gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-main">Skill Learning Hours</h4>
                  <span className="text-[10px] text-text-mute font-semibold">Mastery Velocity</span>
                </div>
              </div>
              <span className="text-xs font-black text-accent">{learningStats.completedHours} hrs</span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[10px] font-black text-text-sub">
                <span>Goal: {learningStats.totalHours} hrs</span>
                <span>{learningStats.percent}%</span>
              </div>
              <Progress value={learningStats.percent} className="h-2" />
            </div>
          </div>

          {/* Card 4: Monthly Execution Metric */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col justify-between gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-main">Monthly Execution</h4>
                  <span className="text-[10px] text-text-mute font-semibold">Consistency Index</span>
                </div>
              </div>
              <span className="text-xs font-black text-success">High Consistency</span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[10px] font-black text-text-sub">
                <span>Monthly Completion Rate</span>
                <span>92%</span>
              </div>
              <Progress value={92} variant="success" className="h-2" />
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgressOverview;
