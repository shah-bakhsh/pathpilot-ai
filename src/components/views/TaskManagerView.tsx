/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Clock,
  Tag,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Copy,
  Archive,
  MessageSquare,
  Paperclip,
  Flame,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  User,
  Calendar,
  Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTasks } from '../../hooks/useTasks';
import { ProductivityTask, TaskCategoryType, TaskPriority, TaskStatus } from '../../types';

export const TaskManagerView: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleSubtask } = useTasks();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<ProductivityTask | null>(null);

  // New Task Form
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    category: TaskCategoryType;
    priority: TaskPriority;
    dueDate: string;
    estimatedTimeMinutes: number;
    tags: string;
  }>({
    title: '',
    description: '',
    category: 'career',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTimeMinutes: 30,
    tags: 'Career, Priority'
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    await addTask({
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      estimatedTimeMinutes: Number(newTask.estimatedTimeMinutes) || 30,
      tags: newTask.tags.split(',').map((t) => t.trim()).filter(Boolean),
      subtasks: [],
      status: 'todo',
      xpValue: 20
    });

    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      category: 'career',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedTimeMinutes: 30,
      tags: 'Career'
    });
  };

  const handleDuplicate = async (task: ProductivityTask) => {
    await addTask({
      title: `${task.title} (Copy)`,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedTimeMinutes: task.estimatedTimeMinutes,
      tags: task.tags,
      subtasks: task.subtasks,
      status: 'todo',
      xpValue: task.xpValue
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        (task.description || '').toLowerCase().includes(q) ||
        (task.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const statusColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-blue-500/40 text-blue-400' },
    { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/40 text-amber-400' },
    { id: 'review', label: 'In Review', color: 'border-purple-500/40 text-purple-400' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500/40 text-emerald-400' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Productivity Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Linear / Notion Task Studio</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" /> Task Planner & Milestone Tracker
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Organize career goals, interview preparation subtasks, job application deadlines, and research projects in a unified workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" size="sm" onClick={() => setIsAddingTask(true)} className="flex items-center gap-1.5 h-9 font-black">
            <Plus className="w-4 h-4" /> Create New Task
          </Button>
        </div>
      </div>

      {/* Filter & View Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[var(--surface-secondary)]/50 p-1 rounded-card border border-[var(--border)]">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              viewMode === 'list' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              viewMode === 'kanban' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban Board
          </button>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="career">💼 Career Strategy</option>
          <option value="interview">⚡ Interview Prep</option>
          <option value="applications">📄 Applications</option>
          <option value="learning">📚 Learning & Skills</option>
          <option value="projects">🛠️ Personal Projects</option>
          <option value="research">🔬 Industry Research</option>
          <option value="certification">🎯 Certification</option>
          <option value="networking">🤝 Networking</option>
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main focus:outline-none cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main focus:outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="completed">Completed</option>
        </select>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search tasks or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Main Task Canvas */}
      {viewMode === 'list' ? (
        <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
          <CardHeader className="border-b border-[var(--border)] pb-3 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-text-sub flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-primary" /> Active Task Inventory ({filteredTasks.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-3">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-60" />
                <p className="text-xs font-black text-text-main">No Tasks Found</p>
                <p className="text-[11px] text-text-sub">Create your first task or clear your search filters.</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const subtasks = task.subtasks || [];
                const completedSubtasks = subtasks.filter((s) => s.completed).length;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      task.status === 'completed'
                        ? 'bg-[var(--surface-secondary)]/30 border-[var(--border)]/60'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <button
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === 'completed' ? 'todo' : 'completed'
                          })
                        }
                        className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                          task.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-black font-black'
                            : 'border-[var(--border)] hover:border-primary'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            onClick={() => setSelectedTaskDetails(task)}
                            className={`text-xs font-black tracking-tight cursor-pointer hover:text-primary ${
                              task.status === 'completed' ? 'text-text-mute line-through' : 'text-text-main'
                            }`}
                          >
                            {task.title}
                          </span>

                          <Badge
                            variant={
                              task.priority === 'urgent'
                                ? 'error'
                                : task.priority === 'high'
                                ? 'warning'
                                : 'neutral'
                            }
                            className="text-[9px] px-1.5 py-0"
                          >
                            {task.priority.toUpperCase()}
                          </Badge>

                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[var(--surface-secondary)] text-text-sub border border-[var(--border)]">
                            {task.category}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-text-sub leading-relaxed font-semibold line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks snippet */}
                        {subtasks.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border)]/50">
                            <span className="text-[10px] font-bold text-text-mute">
                              Subtasks ({completedSubtasks}/{subtasks.length}):
                            </span>
                            <div className="flex-1 h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden max-w-[120px]">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Quick Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-mute">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{task.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(task)}
                          className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main cursor-pointer"
                          title="Duplicate Task"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-text-mute hover:text-danger cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusColumns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div key={col.id} className="flex flex-col gap-3 bg-[var(--surface-secondary)]/40 p-3 rounded-card border border-[var(--border)] min-h-[500px]">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                  <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${col.color}`}>
                    <span>{col.label}</span>
                  </h3>
                  <Badge variant="neutral" className="text-[10px] py-0 px-2 font-black">
                    {columnTasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2.5 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <Card key={task.id} className="bg-[var(--surface)] border-[var(--border)] p-3 hover:border-primary/40 cursor-pointer shadow-xs">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-black text-text-main leading-snug">
                            {task.title}
                          </span>
                          <Badge
                            variant={
                              task.priority === 'urgent'
                                ? 'error'
                                : task.priority === 'high'
                                ? 'warning'
                                : 'neutral'
                            }
                            className="text-[8px] px-1 py-0 shrink-0"
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-text-sub line-clamp-2 leading-tight">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-text-mute font-bold">
                          <span className="truncate uppercase">{task.category}</span>
                          <div className="flex items-center gap-1 text-primary">
                            <Clock className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-lg w-full bg-[var(--surface)] border-[var(--border)]">
            <CardHeader className="border-b border-[var(--border)]">
              <CardTitle className="text-sm font-black text-text-main flex items-center gap-2 uppercase tracking-widest">
                <Plus className="w-4 h-4 text-primary" /> Create Workspace Task
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <Input
                  label="Task Objective / Title"
                  placeholder="e.g. Master Distributed Rate Limiter System Design"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-text-mute tracking-wider">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details, links, or bullet objectives..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-card p-2.5 text-xs text-text-main focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-text-mute tracking-wider">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                      className="mt-1 w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-card p-2 text-xs text-text-main"
                    >
                      <option value="career">💼 Career Strategy</option>
                      <option value="interview">⚡ Interview Prep</option>
                      <option value="applications">📄 Job Applications</option>
                      <option value="learning">📚 Learning & Skills</option>
                      <option value="projects">🛠️ Personal Projects</option>
                      <option value="research">🔬 Research</option>
                      <option value="certification">🎯 Certification</option>
                      <option value="networking">🤝 Networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-text-mute tracking-wider">Priority Level</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="mt-1 w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-card p-2 text-xs text-text-main"
                    >
                      <option value="urgent">🔴 Urgent</option>
                      <option value="high">🟠 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
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
                    label="Est. Focus Minutes"
                    type="number"
                    value={newTask.estimatedTimeMinutes}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTimeMinutes: Number(e.target.value) })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddingTask(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TaskManagerView;
