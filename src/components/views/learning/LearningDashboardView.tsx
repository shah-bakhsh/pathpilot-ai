/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Sparkles, Flame, Clock, Award, Target, Plus, CheckCircle2,
  BrainCircuit, GraduationCap, ChevronRight, ArrowUpRight, BarChart3,
  Code2, ExternalLink, Play, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';

interface LearningDashboardViewProps {
  courses: any[];
  onNavigateTab: (tab: string) => void;
  onRunSkillGap: () => void;
  onAddCourse: () => void;
  onUpdateCourse: (id: string, updates: any) => void;
  addXp: (amount: number) => void;
  userProfile?: any;
}

export const LearningDashboardView: React.FC<LearningDashboardViewProps> = ({
  courses,
  onNavigateTab,
  onRunSkillGap,
  onAddCourse,
  onUpdateCourse,
  addXp,
  userProfile
}) => {
  const totalHoursCompleted = courses.reduce((acc, c) => acc + (c.hoursCompleted || 0), 0);
  const totalHoursPlanned = courses.reduce((acc, c) => acc + (c.hoursTotal || 0), 0);
  const activeCourses = courses.filter((c) => c.status === 'in_progress');
  const completedCourses = courses.filter((c) => c.status === 'completed');

  const radarData = [
    { subject: 'Languages', current: 85, target: 90 },
    { subject: 'Frameworks', current: 78, target: 85 },
    { subject: 'System Design', current: 62, target: 80 },
    { subject: 'Cloud / DevOps', current: 58, target: 75 },
    { subject: 'Databases', current: 82, target: 85 },
    { subject: 'Testing & QA', current: 65, target: 75 },
  ];

  const dailyObjectives = [
    { id: 'obj_1', label: 'Complete 1 chapter on Redis Distributed Mutex Locks', xp: 20, time: '30 min', category: 'System Design' },
    { id: 'obj_2', label: 'Containerize Express service with Multi-Stage Dockerfile', xp: 30, time: '45 min', category: 'DevOps' },
    { id: 'obj_3', label: 'Practice 3 LeetCode Medium Sliding Window Problems', xp: 25, time: '40 min', category: 'Algorithms' },
  ];

  const handleIncrement = (course: any) => {
    if (course.hoursCompleted >= course.hoursTotal) return;
    const nextHours = course.hoursCompleted + 1;
    const isCompleted = nextHours >= course.hoursTotal;
    onUpdateCourse(course.id, {
      hoursCompleted: nextHours,
      status: isCompleted ? 'completed' : 'in_progress',
    });
    addXp(15);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Top Banner & Quick Metrics */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 text-xs font-semibold">
                <BrainCircuit className="w-3.5 h-3.5 mr-1" /> AI-Powered Career Learning Hub
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                Target: {userProfile?.currentTargetGoal || 'Software Engineer'}
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Personalized Learning & Skill Engine
            </h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              Dynamically close skill gaps, master industry certifications, build portfolio projects, and maintain daily learning momentum aligned to your target role.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              onClick={onRunSkillGap}
              className="flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              Analyze Skill Gaps
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigateTab('roadmap')}
              className="flex items-center gap-2 border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              Learning Roadmap
            </Button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
              <span>Study Hours Logged</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalHoursCompleted} <span className="text-xs text-slate-500 font-normal">/ {totalHoursPlanned} hrs</span></div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((totalHoursCompleted / (totalHoursPlanned || 1)) * 100))}%` }} />
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
              <span>Active Streak</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{userProfile?.activeStreak || 7} <span className="text-xs text-amber-400 font-bold">Days 🔥</span></div>
            <p className="text-[10px] text-slate-400 mt-1">Consistency multiplier: 1.5x XP</p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
              <span>Active Courses</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{activeCourses.length} <span className="text-xs text-emerald-400 font-normal">({completedCourses.length} finished)</span></div>
            <p className="text-[10px] text-slate-400 mt-1">Syllabi in progress</p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
              <span>Skill Gap Closure</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">78%</div>
            <p className="text-[10px] text-emerald-400 mt-1">+12% growth this month</p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active Syllabi & Daily Focus */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Active Courses Card */}
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Active Course Syllabi
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Track course progress, log study hours, and check off completed modules.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={onAddCourse} className="flex items-center gap-1.5 border-slate-700 text-slate-200">
                <Plus className="w-4 h-4" /> Catalog Syllabus
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {courses.map((course) => {
                const pct = Math.round((course.hoursCompleted / (course.hoursTotal || 1)) * 100);
                const isDone = course.status === 'completed';

                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/10 border-emerald-500/20'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {course.source}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Day: {course.scheduleDay || 'Flexible'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{course.title}</h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-300 block">
                            {course.hoursCompleted} / {course.hoursTotal} hrs
                          </span>
                          <span className={`text-[10px] font-bold ${isDone ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {pct}% Completed
                          </span>
                        </div>

                        <button
                          onClick={() => handleIncrement(course)}
                          disabled={course.hoursCompleted >= course.hoursTotal}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition disabled:opacity-30"
                        >
                          +1 Hr Log
                        </button>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {courses.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No active courses cataloged yet.</p>
                  <Button variant="ghost" size="sm" onClick={onAddCourse} className="text-indigo-400 text-xs mt-2 hover:bg-indigo-500/10">
                    + Add your first learning course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Learning Objectives & Study Tasks */}
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" /> Today's Focus Objectives
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Daily high-yield study goals designed to steadily close technical gaps.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {dailyObjectives.map((obj) => (
                <div key={obj.id} className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        addXp(obj.xp);
                        alert(`Goal achieved! +${obj.xp} XP awarded!`);
                      }}
                      className="w-5 h-5 rounded-full border-2 border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center transition shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400" />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{obj.label}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="text-indigo-400 font-semibold">{obj.category}</span>
                        <span>•</span>
                        <span>{obj.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-bold shrink-0">
                    +{obj.xp} XP
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Skill Mastery Radar & AI Action Hub */}
        <div className="flex flex-col gap-6">
          
          {/* Skill Radar Chart */}
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Skill Competency Radar
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Current skills vs target role benchmark
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                  <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Required" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-400 mt-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Current Skill Level</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Target Role Benchmark</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Tools Navigation */}
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white">Learning Modules</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {[
                { tab: 'skillgap', label: 'Skill Gap Engine', desc: 'ATS resume vs Job Description gap audit', icon: Sparkles, color: 'text-indigo-400' },
                { tab: 'recommendations', label: 'Course Catalog', desc: 'AI curated courses, books, and videos', icon: GraduationCap, color: 'text-emerald-400' },
                { tab: 'certifications', label: 'Certification Planner', desc: 'AWS, GCP, Meta exam readiness & drills', icon: Award, color: 'text-amber-400' },
                { tab: 'projects', label: 'Hands-on Projects', desc: 'Build production-level portfolio projects', icon: Code2, color: 'text-blue-400' },
                { tab: 'planner', label: 'Study Schedule', desc: 'Weekly calendar & Pomodoro focus timer', icon: Clock, color: 'text-purple-400' },
                { tab: 'analytics', label: 'Skill Analytics', desc: 'Detailed velocity & XP growth reports', icon: BarChart3, color: 'text-rose-400' },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => onNavigateTab(item.tab)}
                  className="p-3 bg-slate-950/40 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl flex items-center justify-between group transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
