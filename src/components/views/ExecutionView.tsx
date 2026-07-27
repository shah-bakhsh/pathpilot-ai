/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCareer } from '../../contexts/CareerContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Layers, BookOpen, Calendar, FileText, TrendingUp, 
  Search, Plus, Trash2, CheckCircle2, ExternalLink, Award, 
  Video, Globe, Github, Linkedin, Clock, ChevronRight, Filter, 
  CheckSquare, AlertCircle, Download, Upload, CalendarDays, 
  Share2, Flame, ArrowUpRight, Sparkles, RefreshCw, Bookmark, HelpCircle, Bell
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Import Modular Sub-Components
import { TaskBoard } from './execution/TaskBoard';
import { ProjectManager } from './execution/ProjectManager';
import { JobTracker } from './execution/JobTracker';
import { InterviewPlanner } from './execution/InterviewPlanner';
import { LearningPlanner } from './execution/LearningPlanner';
import { CalendarComponent } from './execution/CalendarComponent';
import { CommandNotes } from './execution/CommandNotes';
import { FileVault } from './execution/FileVault';
import { BookmarksBento } from './execution/BookmarksBento';
import { WorkspaceTask } from './execution/executionTypes';

export const ExecutionView: React.FC = () => {
  const { user } = useAuth();
  const {
    learningCourses,
    personalProjects,
    jobApplications,
    careerDocuments,
    calendarEvents,
    careerBadges,
    addLearningCourse,
    updateLearningCourse,
    deleteLearningCourse,
    addPersonalProject,
    updatePersonalProject,
    deletePersonalProject,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
    addCareerDocument,
    deleteCareerDocument,
    addCalendarEvent,
    toggleCalendarEvent,
    notifications,
    markNotificationRead
  } = useCareer();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'projects' | 'applications' | 'interviews' | 'learning' | 'calendar' | 'notes' | 'files' | 'bookmarks'>('overview');

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Local productivity states synchronized to localStorage
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-execution-tasks');
      return saved ? JSON.parse(saved) : [
        { id: 't_1', title: 'Refactor express gateway rate limit middleware', priority: 'high', status: 'in_progress', dueDate: new Date().toISOString().split('T')[0], labels: ['Refactor', 'Backend'], estTime: 2, createdAt: new Date().toISOString() },
        { id: 't_2', title: 'Draft mock answers for System Design concurrency', priority: 'medium', status: 'todo', dueDate: new Date().toISOString().split('T')[0], labels: ['Prep'], estTime: 1, createdAt: new Date().toISOString() }
      ];
    } catch {
      return [];
    }
  });

  const [currentGoal, setCurrentGoal] = useState(() => {
    return localStorage.getItem('pathpilot-execution-goal') || 'Secure a Senior Platform Engineer role at Stripe';
  });

  const [todayFocus, setTodayFocus] = useState(() => {
    return localStorage.getItem('pathpilot-execution-today-focus') || 'Complete JWT auth cookie configurations and review Redis cache metrics.';
  });

  // Leveling & XP mechanics
  const [userXp, setUserXp] = useState(() => {
    const saved = localStorage.getItem('pathpilot-execution-xp');
    return saved ? Number(saved) : 340;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('pathpilot-execution-streak');
    return saved ? Number(saved) : 5;
  });

  const [levelUpOverlay, setLevelUpOverlay] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(false);

  // AI Productivity Coach integration
  const [aiResponseText, setAiResponseText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiActivePromptType, setAiActivePromptType] = useState<string | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('pathpilot-execution-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pathpilot-execution-goal', currentGoal);
  }, [currentGoal]);

  useEffect(() => {
    localStorage.setItem('pathpilot-execution-today-focus', todayFocus);
  }, [todayFocus]);

  useEffect(() => {
    localStorage.setItem('pathpilot-execution-xp', String(userXp));
  }, [userXp]);

  useEffect(() => {
    localStorage.setItem('pathpilot-execution-streak', String(streak));
  }, [streak]);

  // Derived leveling metrics
  const userLevel = Math.floor(userXp / 500) + 1;
  const currentLevelMinXp = (userLevel - 1) * 500;
  const currentLevelMaxXp = userLevel * 500;
  const levelProgressPct = Math.min(100, Math.round(((userXp - currentLevelMinXp) / 500) * 100));

  const handleAwardXp = (amount: number) => {
    const nextXp = userXp + amount;
    const nextLevel = Math.floor(nextXp / 500) + 1;
    setUserXp(nextXp);

    if (nextLevel > userLevel) {
      setLevelUpOverlay(true);
    }
  };

  const handleAddTask = (taskData: Omit<WorkspaceTask, 'id' | 'createdAt'>) => {
    const nextTask: WorkspaceTask = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [nextTask, ...prev]);
    handleAwardXp(15); // +15 XP for scheduling a task
  };

  const handleUpdateTask = (id: string, updates: Partial<WorkspaceTask>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        // If checking off task, award larger XP reward
        if (updates.status === 'completed' && t.status !== 'completed') {
          handleAwardXp(30); // +30 XP for completing objective!
        }
        return updated;
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // AI Productivity assistant executor
  const handleExecuteAiCoach = async (type: 'plan' | 'eisenhower' | 'deconstruct' | 'ignite') => {
    setIsAiLoading(true);
    setAiActivePromptType(type);
    setAiResponseText('');

    let promptText = '';
    const taskSummary = tasks.map(t => `- [${t.status}] ${t.title} (${t.priority} priority)`).join('\n');
    const projectSummary = personalProjects.map(p => `- ${p.title} (${p.status}, ${p.completionPercent}% finished)`).join('\n');
    
    if (type === 'plan') {
      promptText = `I need an hourly daily roadmap calendar schedule. Here is my current focus coordinates:
      Focus: "${todayFocus}"
      Target Career Goal: "${currentGoal}"
      Micro-Tasks Checklist:
      ${taskSummary}
      Please output a clean hour-by-hour roadmap (e.g. 09:00, 10:00) with concrete development habits, resting slots, and learning reviews. Format in high-contrast Markdown.`;
    } else if (type === 'eisenhower') {
      promptText = `Classify my active task lists into the 4 quadrants of the Eisenhower Priority Matrix (Urgent & Important, Important but Not Urgent, Urgent but Not Important, Neither).
      Tasks:
      ${taskSummary}
      Provide actionable choices on what to delegate, automate, schedule, or eliminate immediately to protect study cycles.`;
    } else if (type === 'deconstruct') {
      promptText = `I have a massive career target milestone goal: "${currentGoal}".
      Please deconstruct this target into 5 progressive, atomic, highly technical sub-tasks with estimated hours. Each sub-task must be concrete (e.g., "Build a multi-region database migration script").`;
    } else {
      promptText = `Generate an intense, elite Silicon Valley platform developer motivation spark designed to ignite focus. Here are my coordinates:
      Focus: "${todayFocus}"
      Goal: "${currentGoal}"
      Keep it brief, direct, and pragmatic. Avoid low-quality sales hype.`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: promptText,
          history: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponseText(data.text);
      } else {
        setAiResponseText('Service momentarily congested. Please attempt execution cycle again.');
      }
    } catch {
      setAiResponseText('Network error logged. Confirm backend connectivity.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Global counts for overview panels
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;
  const activeApplicationsCount = jobApplications.filter(a => a.status !== 'rejected').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col gap-6 p-4 md:p-8 relative overflow-hidden">
      
      {/* Background visual mesh glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[50%] aspect-square rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Flagship header panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-indigo-400 font-extrabold tracking-widest uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">Module 3 — Active Execution</span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">Command Hub Workspace</h1>
          </div>
        </div>

        {/* Global workspace filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search across workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
          >
            <option value="all">Priority: All</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Quick Navigation Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-900/60">
        {[
          { id: 'overview', label: 'Command Center', icon: Layers },
          { id: 'tasks', label: 'Tasks Board', icon: CheckSquare },
          { id: 'projects', label: 'Project Board', icon: Github },
          { id: 'applications', label: 'Job Tracker', icon: Briefcase },
          { id: 'interviews', label: 'Interview Planner', icon: Sparkles },
          { id: 'learning', label: 'Learning Hub', icon: BookOpen },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'notes', label: 'Draft Notes', icon: FileText },
          { id: 'files', label: 'Secure Vault', icon: Upload },
          { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold shrink-0 border transition-all flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                  : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* MAIN RENDER ENGINE */}
      <div className="flex-1 w-full flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full flex"
          >
            {/* OVERVIEW COMMAND CENTER */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                
                {/* Left Columns - Focus Cards & Assistant */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Hero Gradient Panel */}
                  <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950 border border-indigo-500/15 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-lg">
                    <div className="flex flex-col gap-1.5 z-10">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Platform Command Centers
                      </span>
                      <h2 className="text-lg font-extrabold text-white">Welcome back, developer cadet!</h2>
                      <p className="text-[11px] text-slate-400">Keep up your coding training streaks to advance through tech level goals.</p>
                    </div>

                    {/* Streak flame celebration block */}
                    <button 
                      onClick={() => {
                        setStreak(prev => prev + 1);
                        setCelebrationStreak(true);
                        handleAwardXp(50); // Award +50 XP for daily streak trigger
                      }}
                      className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-4 py-2.5 rounded-2xl cursor-pointer transition-all shrink-0 z-10"
                    >
                      <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
                      <div className="text-left">
                        <span className="text-[9px] font-extrabold text-orange-400 block uppercase leading-none">STREAK</span>
                        <span className="text-sm font-extrabold text-white">{streak} Days</span>
                      </div>
                    </button>
                  </div>

                  {/* Focus & Career Goals Inputs */}
                  <Card className="bg-slate-900/20 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Workspace Priorities</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overarching Trajectory Target Goal</label>
                        <input
                          type="text"
                          value={currentGoal}
                          onChange={(e) => setCurrentGoal(e.target.value)}
                          placeholder="e.g. Become a Principal Backend Architect"
                          className="mt-1.5 w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Objectives Focus for Today</label>
                        <input
                          type="text"
                          value={todayFocus}
                          onChange={(e) => setTodayFocus(e.target.value)}
                          placeholder="What must be completed or mastered before end of day?"
                          className="mt-1.5 w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none font-semibold leading-relaxed"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Productivity Assistant Arena */}
                  <Card className="bg-slate-900/20 border-slate-800 flex flex-col justify-between">
                    <CardHeader className="border-b border-slate-800/80">
                      <CardTitle className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> AI Coach Assistant Panel
                      </CardTitle>
                      <CardDescription>Initiate instant optimization processes on your current workspace variables using Gemini models.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col gap-4">
                      
                      {/* Control grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'plan', label: 'Plan My Day', desc: 'Hour-by-hour roadmap' },
                          { id: 'eisenhower', label: 'Eisenhower Matrix', desc: 'Prioritize task checklist' },
                          { id: 'deconstruct', label: 'Deconstruct Goal', desc: 'Atomic micro-tasks list' },
                          { id: 'ignite', label: 'Ignite Motivation', desc: 'Developer drive catalyst' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            disabled={isAiLoading}
                            onClick={() => handleExecuteAiCoach(btn.id as any)}
                            className="bg-slate-950 hover:bg-slate-900/80 border border-slate-850 hover:border-indigo-500/20 p-3 rounded-2xl flex flex-col gap-1 text-left transition-all group disabled:opacity-50"
                          >
                            <span className="text-[11px] font-extrabold text-white group-hover:text-indigo-400 transition-colors">{btn.label}</span>
                            <span className="text-[9px] text-slate-500 leading-normal">{btn.desc}</span>
                          </button>
                        ))}
                      </div>

                      {/* Display response box */}
                      {(isAiLoading || aiResponseText) && (
                        <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl flex flex-col gap-3">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <span className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                              {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />} 
                              AI Diagnostic: {aiActivePromptType}
                            </span>
                          </div>
                          
                          {isAiLoading ? (
                            <div className="flex flex-col gap-2 py-4">
                              <div className="h-4 bg-slate-900 rounded animate-pulse w-[90%]" />
                              <div className="h-4 bg-slate-900 rounded animate-pulse w-[75%]" />
                              <div className="h-4 bg-slate-900 rounded animate-pulse w-[80%]" />
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-300 leading-relaxed font-semibold whitespace-pre-wrap max-h-60 overflow-y-auto scrollbar-none">
                              {aiResponseText}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Stats, Streak, Badge widgets */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Level Progress Circle Widget */}
                  <Card className="bg-slate-900/20 border-slate-800 p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Training Progress Levels</span>
                      <span className="text-[11px] text-slate-400 font-bold">{userXp} XP total</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 shrink-0">
                        {/* Circular progress background */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-900" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-indigo-500" strokeWidth="2.5" strokeDasharray={`${levelProgressPct}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-extrabold text-slate-500 leading-none">LVL</span>
                          <span className="text-base font-extrabold text-white">{userLevel}</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-xs font-bold text-white leading-normal">Cadet Tier Progression</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1">
                          {currentLevelMaxXp - userXp} XP required to advance to Level {userLevel + 1}
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${levelProgressPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Tasks Progression Metrics Card */}
                  <Card className="bg-slate-900/20 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Sprint Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl">
                          <span className="text-base font-extrabold text-white block">{completedTasks}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl">
                          <span className="text-base font-extrabold text-indigo-400 block">{pendingTasks}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pending</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-900">
                        <span>Sprint Completion rate</span>
                        <span className="text-indigo-400">{tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* App Notifications stream widget */}
                  <Card className="bg-slate-900/20 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Workspace Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2.5 max-h-52 overflow-y-auto scrollbar-none">
                      {notifications.slice(0, 3).map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 bg-slate-950/60 border ${notif.read ? 'border-slate-900' : 'border-indigo-500/20'} rounded-2xl cursor-pointer hover:border-slate-800 transition-colors flex flex-col gap-1 relative`}
                        >
                          {!notif.read && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />}
                          <span className="text-xs font-bold text-slate-200 pr-4 leading-normal">{notif.title}</span>
                          <p className="text-[10px] text-slate-500 leading-normal">{notif.body}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <p className="text-[10px] text-slate-500 font-bold text-center py-4">No workspace alerts generated yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TASK MANAGER MODULE */}
            {activeTab === 'tasks' && (
              <TaskBoard
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                searchQuery={searchQuery}
                selectedPriority={selectedPriority}
              />
            )}

            {/* PROJECT MANAGER MODULE */}
            {activeTab === 'projects' && (
              <ProjectManager
                projects={personalProjects}
                onAddProject={addPersonalProject}
                onUpdateProject={updatePersonalProject}
                onDeleteProject={deletePersonalProject}
              />
            )}

            {/* JOB APPLICATIONS TRACKER */}
            {activeTab === 'applications' && (
              <JobTracker
                applications={jobApplications}
                onAddApplication={addJobApplication}
                onUpdateApplication={updateJobApplication}
                onDeleteApplication={deleteJobApplication}
              />
            )}

            {/* INTERVIEW PLANNER */}
            {activeTab === 'interviews' && (
              <InterviewPlanner applications={jobApplications} />
            )}

            {/* LEARNING PLANNER */}
            {activeTab === 'learning' && (
              <LearningPlanner
                courses={learningCourses}
                onAddCourse={addLearningCourse}
                onUpdateCourse={updateLearningCourse}
                onDeleteCourse={deleteLearningCourse}
                onAwardXp={handleAwardXp}
              />
            )}

            {/* CALENDAR VIEW */}
            {activeTab === 'calendar' && (
              <CalendarComponent
                events={calendarEvents}
                onAddEvent={addCalendarEvent}
                onToggleEventComplete={toggleCalendarEvent}
                onDeleteEvent={() => {}} // Simple delete mockup
              />
            )}

            {/* COMMAND NOTES */}
            {activeTab === 'notes' && (
              <CommandNotes />
            )}

            {/* SECURE FILE VAULT */}
            {activeTab === 'files' && (
              <FileVault
                documents={careerDocuments}
                onUploadDocument={(fileName, fileType, fileDataUrl, fileSize) => {
                  addCareerDocument({
                    name: fileName,
                    type: fileType.includes('pdf') ? 'resume' : fileType.includes('image') ? 'portfolio_pdf' : 'cover_letter',
                    url: fileDataUrl,
                    size: fileSize,
                    version: 'v1.0'
                  });
                }}
                onDeleteDocument={deleteCareerDocument}
              />
            )}

            {/* BOOKMARKS BENTO */}
            {activeTab === 'bookmarks' && (
              <BookmarksBento />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RPG LEVEL UP POPUP OVERLAY CELEBRATION */}
      <AnimatePresence>
        {levelUpOverlay && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-950 border border-indigo-500/25 p-8 rounded-[40px] text-center max-w-sm w-full shadow-2xl relative flex flex-col items-center gap-4"
            >
              {/* Particle visual glow */}
              <div className="absolute w-40 aspect-square rounded-full bg-indigo-500/20 blur-[50px] animate-pulse pointer-events-none" />

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 rounded-full mb-2">
                <Award className="w-12 h-12 animate-bounce" />
              </div>

              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest leading-none">LEVEL ADVANCEMENT</span>
              <h2 className="text-2xl font-extrabold text-white leading-tight">Level Up Achieved!</h2>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">Congratulations! You've advanced to Level {userLevel}! Your dedication to daily refactoring and study goals has unlocked new career badges.</p>

              <Button 
                variant="primary" 
                className="w-full mt-4 h-11 rounded-2xl font-extrabold shadow-lg shadow-indigo-500/25"
                onClick={() => setLevelUpOverlay(false)}
              >
                Continue Training
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STREAK CELEBRATION OVERLAY */}
      <AnimatePresence>
        {celebrationStreak && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-950 border border-orange-500/25 p-8 rounded-[40px] text-center max-w-sm w-full shadow-2xl relative flex flex-col items-center gap-4"
            >
              <div className="absolute w-40 aspect-square rounded-full bg-orange-500/20 blur-[50px] pointer-events-none" />

              <div className="p-4 bg-orange-500/10 border border-orange-500/25 text-orange-400 rounded-full mb-2">
                <Flame className="w-12 h-12 animate-bounce" />
              </div>

              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest leading-none">TRAINING HABIT UNLOCKED</span>
              <h2 className="text-2xl font-extrabold text-white leading-tight">Streak Ignited!</h2>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">You've extended your continuous training streak to {streak} consecutive days! Keep practicing to secure premium platform credentials. Awarded +50 XP!</p>

              <Button 
                variant="primary" 
                className="w-full mt-4 h-11 rounded-2xl font-extrabold bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-500/25 text-white"
                onClick={() => setCelebrationStreak(false)}
              >
                Conquer the Day
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
