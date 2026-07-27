/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Plus, Clock, ExternalLink, Calendar, 
  ChevronRight, Award, Trash2, ArrowUpRight, Check, Play, BookOpenCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface LearningPlannerProps {
  courses: any[];
  onAddCourse: (course: any) => void;
  onUpdateCourse: (id: string, updates: any) => void;
  onDeleteCourse: (id: string) => void;
  onAwardXp: (amount: number) => void;
}

export const LearningPlanner: React.FC<LearningPlannerProps> = ({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAwardXp
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '', source: '', hoursTotal: 10, hoursCompleted: 0,
    status: 'not_started' as any, scheduleDay: 'Monday' as any, priority: 'medium' as any, url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.source.trim()) return;
    onAddCourse({
      ...newCourse,
      hoursTotal: Number(newCourse.hoursTotal) || 1,
      hoursCompleted: Number(newCourse.hoursCompleted) || 0
    });
    setIsAdding(false);
    setNewCourse({
      title: '', source: '', hoursTotal: 10, hoursCompleted: 0,
      status: 'not_started', scheduleDay: 'Monday', priority: 'medium', url: ''
    });
  };

  const handleIncrementHour = (course: any) => {
    if (course.hoursCompleted >= course.hoursTotal) return;
    const nextHours = course.hoursCompleted + 1;
    const isCompleted = nextHours >= course.hoursTotal;
    
    onUpdateCourse(course.id, {
      hoursCompleted: nextHours,
      status: isCompleted ? 'completed' : 'in_progress'
    });
    
    // Award XP for studying
    onAwardXp(15); 
    if (isCompleted) {
      onAwardXp(100); // 100 XP bonus for completing course!
    }
  };

  const handleDecrementHour = (course: any) => {
    if (course.hoursCompleted <= 0) return;
    onUpdateCourse(course.id, {
      hoursCompleted: course.hoursCompleted - 1,
      status: course.hoursCompleted - 1 === 0 ? 'not_started' : 'in_progress'
    });
  };

  // Build chart data based on weekly schedule priorities
  const studyScheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const chartData = studyScheduleDays.map(day => {
    const dayCourses = courses.filter(c => c.scheduleDay === day);
    const completed = dayCourses.reduce((acc, c) => acc + c.hoursCompleted, 0);
    const total = dayCourses.reduce((acc, c) => acc + c.hoursTotal, 0);
    return { day: day.substring(0, 3), Completed: completed, Total: total };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      
      {/* Chart & Stats Column */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        
        {/* Weekly Stats */}
        <Card className="bg-slate-900/20 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Study Analytics Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#475569" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#475569" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Total" fill="#1e1b4b" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Study Log */}
        <Card className="bg-slate-900/20 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Continuous Study Goals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { id: 'l_1', label: 'Read 3 pages of high-concurrency database documentation', xp: 15 },
              { id: 'l_2', label: 'Complete 1 video tutorial on serverless caching', xp: 20 },
              { id: 'l_3', label: 'Write code samples utilizing system channel buffers', xp: 25 }
            ].map((item) => (
              <div key={item.id} className="p-3 bg-slate-950/40 border border-slate-900/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 font-bold leading-normal block">{item.label}</span>
                  <span className="text-[9px] text-indigo-400 font-bold">+{item.xp} XP reward</span>
                </div>
                <button 
                  onClick={() => {
                    onAwardXp(item.xp);
                    alert(`Goal achieved! Awarded +${item.xp} XP!`);
                  }}
                  className="p-1.5 hover:bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 hover:border-indigo-500/20 rounded-lg shrink-0 ml-3"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Registry Area */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Controls */}
        <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Course Training Vault</h3>
            <p className="text-[11px] text-slate-400">Commit to daily learning habits, complete milestones, and earn level advancements.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 shadow">
            <Plus className="w-4 h-4" /> Add Syllabus
          </Button>
        </div>

        {/* Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Catalog Syllabus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Course / Resource Name"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g. System Design Fundamentals by ByteByteGo"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Syllabus Host / Provider"
                      value={newCourse.source}
                      onChange={(e) => setNewCourse({ ...newCourse, source: e.target.value })}
                      placeholder="e.g. Coursera, GitHub, YouTube"
                      required
                    />
                    <Input
                      label="Resource Link URL"
                      value={newCourse.url}
                      onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Syllabus Hours (Total)"
                      type="number"
                      min={1}
                      value={newCourse.hoursTotal}
                      onChange={(e) => setNewCourse({ ...newCourse, hoursTotal: Number(e.target.value) || 1 })}
                    />
                    <Input
                      label="Hours Checked Off"
                      type="number"
                      min={0}
                      value={newCourse.hoursCompleted}
                      onChange={(e) => setNewCourse({ ...newCourse, hoursCompleted: Number(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Schedule Target</label>
                      <select
                        value={newCourse.scheduleDay}
                        onChange={(e) => setNewCourse({ ...newCourse, scheduleDay: e.target.value as any })}
                        className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      >
                        {studyScheduleDays.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Coordinates</label>
                      <select
                        value={newCourse.priority}
                        onChange={(e) => setNewCourse({ ...newCourse, priority: e.target.value as any })}
                        className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Catalog Syllabus</Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const pct = Math.round((course.hoursCompleted / course.hoursTotal) * 100);
            const isFinished = course.status === 'completed';

            return (
              <div 
                key={course.id}
                className={`bg-slate-900/30 border ${isFinished ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-800'} rounded-3xl p-5 flex flex-col justify-between`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">{course.source}</span>
                      <h4 className="text-xs font-bold text-white leading-normal mt-1.5">{course.title}</h4>
                    </div>
                    <button onClick={() => onDeleteCourse(course.id)} className="text-slate-500 hover:text-rose-400 p-1 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold">
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {course.scheduleDay}</span>
                    <span className="scale-75">•</span>
                    <span className="uppercase">{course.priority} Priority</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">{course.hoursCompleted} / {course.hoursTotal} Hours Logged</span>
                    <span className={isFinished ? 'text-emerald-400' : 'text-indigo-400'}>{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${isFinished ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
                  </div>

                  <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-900 mt-1">
                    {course.url ? (
                      <a href={course.url} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-[10px] text-slate-300 hover:text-white font-extrabold">
                        Resume Lecture <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[9px] text-slate-500">Offline syllabus reference</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleDecrementHour(course)}
                        disabled={course.hoursCompleted <= 0}
                        className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-xs font-extrabold disabled:opacity-40"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => handleIncrementHour(course)}
                        disabled={course.hoursCompleted >= course.hoursTotal}
                        className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center text-xs font-extrabold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-slate-800 rounded-3xl">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <span className="text-xs text-slate-400 block font-bold">No active syallabi logged.</span>
              <p className="text-[10px] text-slate-500 mt-1">Syllabus modules will display training analytics, weekly schedule allocations, and reward bonus XP.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
