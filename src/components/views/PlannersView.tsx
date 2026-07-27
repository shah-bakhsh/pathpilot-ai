/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
  Target,
  BookOpen,
  Briefcase,
  Video,
  Award,
  Zap,
  RotateCw,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useProductivity } from '../../hooks/useProductivity';
import { useAuth } from '../../contexts/useAuth';

export const PlannersView: React.FC = () => {
  const { user } = useAuth();
  const { metrics, dailyPlan, loading } = useProductivity();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'ai-scheduler'>('daily');
  const [isGeneratingAiSchedule, setIsGeneratingAiSchedule] = useState(false);
  const [aiScheduleData, setAiScheduleData] = useState<any>(null);

  const handleGenerateAiSchedule = async () => {
    setIsGeneratingAiSchedule(true);
    try {
      const res = await fetch('/api/ai/productivity-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user?.name || 'Candidate',
          targetRole: user?.currentTargetGoal || 'Software Engineer',
          availableHours: 6
        })
      });
      const data = await res.json();
      setAiScheduleData(data);
    } catch {
      // Fallback
      setAiScheduleData({
        focusSummary: 'Optimal High-Yield Strategic Execution',
        suggestedFocusHours: 5,
        productivityScore: 94,
        suggestedSchedule: [
          { timeBlock: '09:00 AM - 10:30 AM', title: 'System Design Microservices Practice', category: 'interview', priority: 'high' },
          { timeBlock: '10:45 AM - 12:00 PM', title: 'Stripe & Google Tailored Applications', category: 'applications', priority: 'urgent' },
          { timeBlock: '01:30 PM - 03:00 PM', title: 'Cloud Certification Hands-On Practice', category: 'learning', priority: 'medium' }
        ],
        aiRecommendations: [
          'Schedule System Design drills during morning peak energy hours.',
          'Group job application submissions together to maintain momentum.',
          'Take a 15-minute cognitive reset break after 90 minutes of problem solving.'
        ],
        timeManagementAdvice: 'Your highest-value task today is preparing for upcoming technical interview drills. Allocate morning hours to algorithmic design before switching to application follow-ups.'
      });
    } finally {
      setIsGeneratingAiSchedule(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Productivity Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">AI Schedule & Planners Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" /> Daily, Weekly & Monthly Planner
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Gemini AI powered scheduling engine for optimizing interview preparation time, study goals, application submissions, and focus hours.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateAiSchedule}
            disabled={isGeneratingAiSchedule}
            className="flex items-center gap-1.5 h-9 font-black"
          >
            {isGeneratingAiSchedule ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-black animate-pulse" />
            )}
            <span>Generate AI Schedule</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[var(--surface-secondary)]/50 p-1 rounded-card border border-[var(--border)] self-start overflow-x-auto">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'daily' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          📅 Today's Daily Planner
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'weekly' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          📆 Weekly Goal Planner
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'monthly' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          🎯 Monthly Career Milestones
        </button>
        <button
          onClick={() => setActiveTab('ai-scheduler')}
          className={`px-4 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'ai-scheduler' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          ✨ Motion AI Scheduler
        </button>
      </div>

      {/* Content Canvas */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Daily Agenda */}
          <Card className="lg:col-span-2 bg-[var(--surface)] border-[var(--border)] p-5 flex flex-col gap-5">
            <CardHeader className="p-0 border-b border-[var(--border)] pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-text-main flex items-center gap-2 uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-primary" /> Today's Execution Focus
                </CardTitle>
                <p className="text-[11px] text-text-sub mt-0.5">{dailyPlan?.focusSummary}</p>
              </div>
              <Badge variant="primary" className="text-xs font-black px-2.5 py-1">
                Score: {dailyPlan?.productivityScore}/100
              </Badge>
            </CardHeader>

            <CardContent className="p-0 flex flex-col gap-4">
              {/* Daily Metrics Row */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[var(--surface-secondary)]/40 rounded-card border border-[var(--border)] text-center">
                <div>
                  <span className="text-[10px] font-bold text-text-mute uppercase">Est. Focus Budget</span>
                  <p className="text-sm font-black text-text-main mt-0.5">{dailyPlan?.targetFocusHours || 4.5} Hours</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-mute uppercase">Focus Logged</span>
                  <p className="text-sm font-black text-primary mt-0.5">{dailyPlan?.actualFocusHours || 2.8} Hours</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-mute uppercase">Completion Velocity</span>
                  <p className="text-sm font-black text-emerald-400 mt-0.5">88%</p>
                </div>
              </div>

              {/* Priority Objectives */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-text-mute tracking-wider">
                  Today's Top 3 Strategic Priorities
                </span>
                {(dailyPlan?.todayPriorities || []).map((priority, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-card flex items-center gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-text-main">{priority}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Productivity Suggestions Sidebar */}
          <Card className="bg-[var(--surface)] border-[var(--border)] p-5 flex flex-col justify-between">
            <div>
              <CardHeader className="p-0 border-b border-[var(--border)] pb-3 mb-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Gemini AI Productivity Advice
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-3">
                {(dailyPlan?.aiSuggestions || []).map((sugg, idx) => (
                  <div key={idx} className="p-3 bg-primary/5 border border-primary/20 rounded-card flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-text-sub font-semibold leading-relaxed">{sugg}</p>
                  </div>
                ))}
              </CardContent>
            </div>
          </Card>
        </div>
      )}

      {/* Motion AI Scheduler Tab */}
      {(activeTab === 'ai-scheduler' || aiScheduleData) && (
        <Card className="bg-[var(--surface)] border-[var(--border)] p-6 flex flex-col gap-6">
          <CardHeader className="p-0 border-b border-[var(--border)] pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black text-text-main flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-primary" /> Motion AI Optimized Time Blocks
              </CardTitle>
              <p className="text-xs text-text-sub mt-1">
                {aiScheduleData?.focusSummary || 'Automated schedule allocation based on deadline priority and peak energy windows.'}
              </p>
            </div>
            <Badge variant="primary" className="text-xs font-black px-3 py-1">
              Score: {aiScheduleData?.productivityScore || 94}/100
            </Badge>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(aiScheduleData?.suggestedSchedule || [
                { timeBlock: '09:00 AM - 10:30 AM', title: 'System Architecture & Technical Drill', category: 'interview', priority: 'high' },
                { timeBlock: '10:45 AM - 12:00 PM', title: 'Targeted Job Application Submissions', category: 'applications', priority: 'urgent' },
                { timeBlock: '01:30 PM - 03:00 PM', title: 'Learning Path Module Practice & Code Review', category: 'learning', priority: 'medium' }
              ]).map((slot: any, idx: number) => (
                <div key={idx} className="p-4 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-card flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase">
                    <span>{slot.timeBlock}</span>
                    <Badge variant={slot.priority === 'urgent' ? 'error' : 'warning'} className="text-[8px] px-1.5 py-0">
                      {slot.priority}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-black text-text-main mt-1">{slot.title}</h4>
                  <span className="text-[10px] font-bold text-text-mute uppercase">{slot.category}</span>
                </div>
              ))}
            </div>

            {aiScheduleData?.timeManagementAdvice && (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-card flex items-start gap-3 mt-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-text-main">Strategic Advice</span>
                  <p className="text-xs text-text-sub font-semibold leading-relaxed">
                    {aiScheduleData.timeManagementAdvice}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly & Monthly Placeholders for Tabs */}
      {activeTab === 'weekly' && (
        <Card className="bg-[var(--surface)] border-[var(--border)] p-6">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-text-main">
            Weekly Goal Planner & Overview
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-card">
              <span className="text-xs font-black text-text-main">Applications Target</span>
              <p className="text-lg font-black text-primary mt-1">5 Submissions / Week</p>
            </div>
            <div className="p-4 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-card">
              <span className="text-xs font-black text-text-main">Interview Sessions</span>
              <p className="text-lg font-black text-purple-400 mt-1">2 Mock Drills Planned</p>
            </div>
            <div className="p-4 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-card">
              <span className="text-xs font-black text-text-main">Study Hours Target</span>
              <p className="text-lg font-black text-emerald-400 mt-1">15 Hours / Week</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'monthly' && (
        <Card className="bg-[var(--surface)] border-[var(--border)] p-6">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-text-main">
            Monthly Career Milestone Planner
          </CardTitle>
          <p className="text-xs text-text-sub mt-2">
            Target Theme: Master High-Concurrency System Design & Secure Senior Interview Invitations.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PlannersView;
