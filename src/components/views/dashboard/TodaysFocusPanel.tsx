/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Plus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Progress } from '../../ui/Progress';
import { cn } from '../../../lib/utils';

export const TodaysFocusPanel: React.FC = () => {
  const {
    dailyMissions,
    completeMission,
    calendarEvents,
    toggleCalendarEvent,
    learningCourses,
    resumeAnalysis,
    addNotification
  } = useCareer();
  const { user, addXp } = useAuth();

  const handleCompleteMission = (id: string) => {
    completeMission(id);
    addXp(20);
    addNotification('Mission Mastered!', '+20 XP awarded for today\'s execution track.', 'streak');
  };

  const handleToggleEvent = (id: string) => {
    toggleCalendarEvent(id);
    addXp(15);
  };

  const activeCourse = learningCourses[0] || {
    id: 'c1',
    title: 'TypeScript Advanced Types & Generics Masterclass',
    source: 'Udemy / System Deep Dive',
    hoursCompleted: 14,
    hoursTotal: 20,
    priority: 'High'
  };

  const courseProgress = Math.round((activeCourse.hoursCompleted / activeCourse.hoursTotal) * 100);

  const completedMissionsCount = dailyMissions.filter(m => m.completed).length;
  const totalMissionsCount = dailyMissions.length;
  const missionProgressPercent = totalMissionsCount > 0 ? Math.round((completedMissionsCount / totalMissionsCount) * 100) : 0;

  const handleNavigate = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  const missingKeyword = resumeAnalysis?.keywordsMissing?.[0] || 'Docker Containers';

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] hover:shadow-sm transition-shadow duration-300 select-none">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-text-main">Today's Focus & Execution</CardTitle>
              <p className="text-xs text-text-sub font-semibold">Priority missions, learning targets, and dynamic AI suggestions for today.</p>
            </div>
          </div>
          <Badge variant="primary" className="text-xs font-black py-1 px-3 self-start sm:self-center">
            {completedMissionsCount}/{totalMissionsCount} Tasks Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-5">
        
        {/* Top Split: Today's Tasks & Today's AI Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Actionable Tasks List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <span className="text-xs font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-accent fill-accent animate-pulse" /> Actionable Tasks
            </span>

            <div className="flex flex-col gap-2">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => !mission.completed && handleCompleteMission(mission.id)}
                  className={cn(
                    'p-3 border rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group',
                    mission.completed
                      ? 'bg-[var(--surface-secondary)]/20 border-[var(--border)]/40 opacity-60'
                      : 'bg-[var(--surface)] border-[var(--border)] hover:border-primary/30 hover:bg-[var(--hover-tint)]/30'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all',
                        mission.completed ? 'bg-success border-success text-black' : 'border-[var(--border)] group-hover:border-primary'
                      )}
                    >
                      {mission.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-black truncate',
                        mission.completed ? 'line-through text-text-mute' : 'text-text-main'
                      )}
                    >
                      {mission.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                      +{mission.xpValue} XP
                    </span>
                    <span className="text-[10px] text-text-mute font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {mission.timeMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission Progress Gauge */}
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)]/20 border border-[var(--border)] flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-text-sub">Mission Progress</span>
                <span className="text-primary">{missionProgressPercent}% Complete</span>
              </div>
              <Progress value={missionProgressPercent} variant="primary" className="h-2" />
            </div>
          </div>

          {/* Right: AI Today's Recommendation & Current Learning Goal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Today's AI Recommendation */}
            <div className="p-4 rounded-xl bg-linear-to-br from-accent/10 via-[var(--surface)] to-primary/5 border border-accent/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-accent uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" /> AI Today's Recommendation
                </span>
                <Badge variant="secondary" className="text-[9px] font-black py-0.5 px-2">
                  High Priority
                </Badge>
              </div>
              <p className="text-xs text-text-sub font-semibold leading-relaxed">
                Recruiters screening for <strong className="text-text-main">{user?.currentTargetGoal}</strong> prioritize candidates with <strong className="text-accent">{missingKeyword}</strong> experience. Spend 20 minutes reviewing project implementation strategies today.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('learning')}
                className="text-xs font-bold mt-1 self-start flex items-center gap-1.5"
              >
                Start Learning <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </Button>
            </div>

            {/* Current Learning Goal Track */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text-main flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" /> Current Learning Goal
                </span>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {activeCourse.priority}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-black text-text-main truncate">{activeCourse.title}</h4>
                <span className="text-[10px] text-text-mute font-semibold">{activeCourse.source}</span>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-text-sub">Course Completion</span>
                  <span className="text-primary">{activeCourse.hoursCompleted}/{activeCourse.hoursTotal} hrs ({courseProgress}%)</span>
                </div>
                <Progress value={courseProgress} className="h-1.5" />
              </div>
            </div>

          </div>

        </div>

        {/* Upcoming Deadlines Banner */}
        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4.5 h-4.5 text-warning shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-text-main">Upcoming Deadline: Technical Assessment</span>
              <span className="text-[11px] text-text-sub font-semibold">Stripe Full-Stack Engineering Assessment due in 2 days.</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate('calendar')}
            className="text-xs font-bold shrink-0"
          >
            View Calendar
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default TodaysFocusPanel;
