/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, Plus, Clock, Tag, Calendar, Play, AlertCircle, 
  Trash2, Edit3, LayoutGrid, List, Search, Filter, RefreshCw, Star
} from 'lucide-react';
import { WorkspaceTask } from './executionTypes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface TaskBoardProps {
  tasks: WorkspaceTask[];
  onAddTask: (task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<WorkspaceTask>) => void;
  onDeleteTask: (id: string) => void;
  searchQuery: string;
  selectedPriority: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  searchQuery,
  selectedPriority
}) => {
  const [layout, setLayout] = useState<'list' | 'kanban'>('kanban');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', notes: '', priority: 'medium' as any, dueDate: new Date().toISOString().split('T')[0],
    labels: '', estTime: 1, isRecurring: false, status: 'todo' as any
  });
  const [selectedTask, setSelectedTask] = useState<WorkspaceTask | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  // Filtering
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          t.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesStatus = selectedStatusFilter === 'all' || t.status === selectedStatusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const labelArray = newTask.labels.split(',').map(l => l.trim()).filter(Boolean);
    onAddTask({
      title: newTask.title,
      notes: newTask.notes,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      labels: labelArray,
      estTime: Number(newTask.estTime) || 1,
      isRecurring: newTask.isRecurring
    });
    setIsAdding(false);
    setNewTask({
      title: '', notes: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0],
      labels: '', estTime: 1, isRecurring: false, status: 'todo'
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: any) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTask(taskId, { status });
    }
  };

  const handleToggleBulk = (taskId: string) => {
    setBulkSelected(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleBulkComplete = () => {
    bulkSelected.forEach(id => onUpdateTask(id, { status: 'completed' }));
    setBulkSelected([]);
  };

  const handleBulkDelete = () => {
    bulkSelected.forEach(id => onDeleteTask(id));
    setBulkSelected([]);
  };

  const statusColumns: { id: WorkspaceTask['status']; label: string; color: string; border: string }[] = [
    { id: 'inbox', label: 'Inbox', color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/20' },
    { id: 'todo', label: 'To Do', color: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/20' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
    { id: 'review', label: 'In Review', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20' },
    { id: 'completed', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' }
  ];

  const smartSuggestions = [
    { title: 'Refactor Auth Route Controller', priority: 'high', labels: ['Refactor', 'Backend'] },
    { title: 'Write System Design Cache Specs', priority: 'medium', labels: ['Docs', 'SystemDesign'] },
    { title: 'Connect LinkedIn Developer Profile', priority: 'low', labels: ['Branding'] }
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Task Filters & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Button 
            variant={layout === 'list' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setLayout('list')}
            className="flex items-center gap-1.5"
          >
            <List className="w-3.5 h-3.5" /> List View
          </Button>
          <Button 
            variant={layout === 'kanban' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setLayout('kanban')}
            className="flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban Board
          </Button>
          
          <select 
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="inbox">Status: Inbox</option>
            <option value="todo">Status: To Do</option>
            <option value="in_progress">Status: In Progress</option>
            <option value="review">Status: Review</option>
            <option value="completed">Status: Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {bulkSelected.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in">
              <span className="text-xs text-slate-300 font-bold">{bulkSelected.length} Selected</span>
              <button onClick={handleBulkComplete} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold px-2">Complete</button>
              <button onClick={handleBulkDelete} className="text-rose-400 hover:text-rose-300 text-xs font-bold px-2">Delete</button>
            </div>
          )}
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Quick Add Task
          </Button>
        </div>
      </div>

      {/* Task Suggestion Helper Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
        <div className="md:col-span-1 flex items-center gap-2 text-indigo-400 text-xs font-bold pl-2">
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>AI Task Suggestion Sparks:</span>
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {smartSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                onAddTask({
                  title: suggestion.title,
                  priority: suggestion.priority as any,
                  status: 'todo',
                  dueDate: new Date().toISOString().split('T')[0],
                  labels: suggestion.labels,
                  estTime: 1
                });
              }}
              className="text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg px-2.5 py-1 transition-all"
            >
              + {suggestion.title}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Overlay Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
          >
            <CardHeader className="border-b border-slate-800/80">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" /> Plan New Micro-Task
              </CardTitle>
              <CardDescription>Allocate estimated study/refactor hours and tag it for visual hierarchy tracking.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <Input
                  label="Task Objective"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Master TypeScript Interface Constraints"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Level</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="high">🔴 High Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="low">🟢 Low Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Column</label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="inbox">📥 Inbox</option>
                      <option value="todo">📋 To Do</option>
                      <option value="in_progress">⚡ In Progress</option>
                      <option value="review">🔍 Review</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Due Date"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <Input
                    label="Estimated Hours"
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={newTask.estTime}
                    onChange={(e) => setNewTask({ ...newTask, estTime: parseFloat(e.target.value) || 1 })}
                  />
                </div>

                <Input
                  label="Labels (comma-separated)"
                  value={newTask.labels}
                  onChange={(e) => setNewTask({ ...newTask, labels: e.target.value })}
                  placeholder="e.g. System, TS, Caching"
                />

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Notes / Context</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Provide description of technical objectives or resources link..."
                    className="mt-1 w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newTask.isRecurring}
                    onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                  />
                  <label htmlFor="isRecurring" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                    Set as Daily Recurring Task
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Log Task Objective</Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      )}

      {/* RENDER LIST REPRESENTATION */}
      {layout === 'list' && (
        <Card className="bg-slate-900/20 border-slate-800">
          <CardContent className="p-4 flex flex-col gap-2.5">
            {filteredTasks.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-8">No tasks match current search filter parameters.</div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => onUpdateTask(task.id, { 
                        status: task.status === 'completed' ? 'todo' : 'completed' 
                      })}
                      className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {task.title}
                      </span>
                      {task.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{task.notes}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'neutral'} className="text-[9px] px-1 py-0 scale-90">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 scale-90 uppercase">
                          {task.status}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 font-bold">
                            <Calendar className="w-2.5 h-2.5" /> {task.dueDate}
                          </span>
                        )}
                        {task.estTime && (
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 font-bold">
                            <Clock className="w-2.5 h-2.5" /> {task.estTime}h
                          </span>
                        )}
                        {task.labels.map(l => (
                          <Badge key={l} variant="neutral" className="text-[8px] font-bold text-slate-400 border-slate-800 bg-slate-950 px-1 py-0">
                            #{l}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 hover:bg-rose-950/20 rounded text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* RENDER KANBAN REPRESENTATION */}
      {layout === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statusColumns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div 
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex flex-col gap-3 p-3 bg-slate-950/80 border border-slate-900 rounded-2xl min-w-[200px]"
              >
                <div className={`p-2 rounded-xl border ${col.color} ${col.border} text-center flex justify-between items-center`}>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">{col.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10">{colTasks.length}</span>
                </div>

                <div className="flex flex-col gap-2.5 min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-none">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                      className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/20 p-3 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:shadow transition-all relative flex flex-col gap-2 group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'neutral'} className="text-[8px] px-1 py-0 scale-90 origin-left">
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedTask(task)} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button onClick={() => onDeleteTask(task.id)} className="p-0.5 hover:bg-rose-950/20 rounded text-slate-400 hover:text-rose-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-100 leading-normal line-clamp-2">{task.title}</div>
                      
                      {task.notes && (
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 italic border-t border-slate-800/60 pt-1">
                          "{task.notes}"
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.labels.map(l => (
                          <Badge key={l} variant="neutral" className="text-[8px] font-bold text-slate-400 border-slate-800/80 bg-slate-950/40 px-1 py-0">
                            #{l}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-1 pt-1.5 border-t border-slate-800/40">
                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {task.estTime}h</span>
                        {task.dueDate && <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {task.dueDate.split('-').slice(1).join('/')}</span>}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4 text-center text-[10px] text-slate-500 select-none">
                      Drag targets here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Task Drawer/Detail Overlay */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full bg-slate-950 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-widest text-slate-400">Modify Task Parameters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                label="Task Objective"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value as any })}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as any })}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="inbox">Inbox</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                <textarea
                  value={selectedTask.notes || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, notes: e.target.value })}
                  className="mt-1 w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setSelectedTask(null)}>Close</Button>
                <Button variant="primary" size="sm" onClick={() => {
                  onUpdateTask(selectedTask.id, selectedTask);
                  setSelectedTask(null);
                }}>Save Coordinates</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
