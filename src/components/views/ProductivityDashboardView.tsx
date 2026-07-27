/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Zap,
  CheckSquare,
  Bell,
  Calendar,
  FileText,
  Activity,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Layers,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useNotifications } from '../../hooks/useNotifications';
import { useProductivity } from '../../hooks/useProductivity';

// Import subviews
import TaskManagerView from './TaskManagerView';
import NotificationCenterView from './NotificationCenterView';
import PlannersView from './PlannersView';
import NotesWorkspaceView from './NotesWorkspaceView';
import ActivityFeedView from './ActivityFeedView';

export const ProductivityDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { unreadCount } = useNotifications();
  const { metrics, dailyPlan } = useProductivity();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notifications' | 'planners' | 'notes' | 'activity'>('overview');

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[var(--surface-secondary)]/50 p-1.5 rounded-card border border-[var(--border)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'overview' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Zap className="w-4 h-4" /> Productivity Command Center
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'tasks' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Task Manager ({pendingTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'notifications' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          onClick={() => setActiveTab('planners')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'planners' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Calendar className="w-4 h-4" /> AI Planners & Motion
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'notes' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <FileText className="w-4 h-4" /> Notion Docs & Notes
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-btn text-xs font-black cursor-pointer transition-all ${
            activeTab === 'activity' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Activity className="w-4 h-4" /> Activity Audit Trail
        </button>
      </div>

      {/* Render selected view */}
      {activeTab === 'tasks' && <TaskManagerView />}
      {activeTab === 'notifications' && <NotificationCenterView />}
      {activeTab === 'planners' && <PlannersView />}
      {activeTab === 'notes' && <NotesWorkspaceView />}
      {activeTab === 'activity' && <ActivityFeedView />}

      {/* Default Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Top Hero Overview Banner */}
          <div className="bg-gradient-to-r from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px] font-black uppercase px-2 py-0.5">
                  Phase 13 OS
                </Badge>
                <span className="text-xs font-bold text-text-sub">
                  Unified Career Operating System
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-text-main tracking-tight mt-1">
                Welcome to Productivity Hub, {user?.name || 'Candidate'}
              </h1>
              <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold">
                Your high-concurrency career execution engine. Seamlessly synchronize interview preparation, application velocity, and focus budget.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[var(--surface)]/80 border border-[var(--border)] p-4 rounded-card shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-text-mute uppercase">Productivity Velocity</span>
                <span className="text-xl font-black text-primary mt-0.5">{metrics?.productivityScore || 92}/100</span>
              </div>
              <div className="h-8 w-px bg-[var(--border)]" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-text-mute uppercase">Streak Days</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" /> {metrics?.streakDays || 7}
                </span>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
              <div className="flex justify-between items-center text-text-sub mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Pending Tasks</span>
                <CheckSquare className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-black text-text-main">{pendingTasks.length}</p>
              <span className="text-[10px] font-bold text-emerald-400 mt-1 block">
                {metrics?.completedTasks || 3} Tasks Completed Today
              </span>
            </Card>

            <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
              <div className="flex justify-between items-center text-text-sub mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Unread Alerts</span>
                <Bell className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-text-main">{unreadCount}</p>
              <span className="text-[10px] font-bold text-text-sub mt-1 block">
                High-priority queue active
              </span>
            </Card>

            <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
              <div className="flex justify-between items-center text-text-sub mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Focus Hours Budget</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-text-main">{dailyPlan?.actualFocusHours || 2.8} / 4.5h</p>
              <span className="text-[10px] font-bold text-blue-400 mt-1 block">
                62% Target Achieved
              </span>
            </Card>

            <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
              <div className="flex justify-between items-center text-text-sub mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Upcoming Interviews</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-text-main">{metrics?.upcomingInterviewsCount || 2}</p>
              <span className="text-[10px] font-bold text-amber-400 mt-1 block">
                Stripe & Google Live Drills
              </span>
            </Card>
          </div>

          {/* Middle Layout: Today's Priorities & Quick AI Motion Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Urgent Tasks Queue */}
            <Card className="lg:col-span-7 bg-[var(--surface)] border-[var(--border)] p-5 flex flex-col gap-4">
              <CardHeader className="p-0 border-b border-[var(--border)] pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" /> High-Priority Task Queue
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')} className="text-xs font-extrabold text-primary">
                  View All Tasks <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-2.5">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-card flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={task.priority === 'urgent' ? 'error' : 'warning'} className="text-[8px] px-1.5 py-0">
                        {task.priority.toUpperCase()}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-text-main">{task.title}</span>
                        <span className="text-[10px] text-text-mute font-bold uppercase">{task.category} • Due {task.dueDate}</span>
                      </div>
                    </div>
                    <Badge variant="neutral" className="text-[9px]">
                      {task.estimatedTimeMinutes}m
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Motion Schedule Banner */}
            <Card className="lg:col-span-5 bg-[var(--surface)] border-[var(--border)] p-5 flex flex-col justify-between">
              <div>
                <CardHeader className="p-0 border-b border-[var(--border)] pb-3 mb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Today's AI Schedule Recommendations
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('planners')} className="text-xs font-extrabold text-primary">
                    Open Planners
                  </Button>
                </CardHeader>

                <CardContent className="p-0 flex flex-col gap-2.5">
                  {(dailyPlan?.todayPriorities || [
                    'Master Rate Limiter System Design Diagram',
                    'Send 2 High-Signal Custom Applications',
                    'Complete 1 Mock Technical Drill'
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 bg-primary/5 border border-primary/20 rounded-card flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-text-main leading-tight">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </div>

              <div className="pt-3 border-t border-[var(--border)] mt-4">
                <span className="text-[10px] text-text-mute font-bold uppercase">
                  AI Focus Strategy: Peak energy windows scheduled for 09:00 AM - 11:30 AM
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityDashboardView;
