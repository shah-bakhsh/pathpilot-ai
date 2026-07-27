/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, Github, Globe, Plus, Trash2, Edit3, CheckSquare, 
  ChevronRight, Sparkles, RefreshCw, AlertCircle, Play, Save
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface ProjectManagerProps {
  projects: any[];
  onAddProject: (project: any) => void;
  onUpdateProject: (id: string, updates: any) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '', description: '', technologies: '', githubUrl: '', demoUrl: '', status: 'planning' as any, completionPercent: 0
  });
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  
  // Project-level custom task management state (persisted locally)
  const [projectTasks, setProjectTasks] = useState<Record<string, { id: string; text: string; completed: boolean }[]>>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-project-tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveProjectTasks = (updated: Record<string, { id: string; text: string; completed: boolean }[]>) => {
    setProjectTasks(updated);
    localStorage.setItem('pathpilot-project-tasks', JSON.stringify(updated));
  };

  const handleAddProjectTask = (projId: string, taskText: string) => {
    if (!taskText.trim()) return;
    const current = projectTasks[projId] || [];
    const updated = {
      ...projectTasks,
      [projId]: [...current, { id: 'pjt_' + Math.random().toString(36).substring(2, 9), text: taskText, completed: false }]
    };
    saveProjectTasks(updated);
  };

  const handleToggleProjectTask = (projId: string, taskId: string) => {
    const current = projectTasks[projId] || [];
    const updated = {
      ...projectTasks,
      [projId]: current.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    };
    saveProjectTasks(updated);
  };

  const handleDeleteProjectTask = (projId: string, taskId: string) => {
    const current = projectTasks[projId] || [];
    const updated = {
      ...projectTasks,
      [projId]: current.filter(t => t.id !== taskId)
    };
    saveProjectTasks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const techArray = newProject.technologies.split(',').map(t => t.trim()).filter(Boolean);
    onAddProject({
      ...newProject,
      technologies: techArray,
      completionPercent: Number(newProject.completionPercent) || 0
    });
    setIsAdding(false);
    setNewProject({
      title: '', description: '', technologies: '', githubUrl: '', demoUrl: '', status: 'planning', completionPercent: 0
    });
  };

  const handleRequestAiArchitecture = async (proj: any) => {
    setLoadingAiId(proj.id);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: `Review my personal portfolio project: "${proj.title}". Description: "${proj.description}". Technologies: ${proj.technologies.join(', ')}. Please provide architectural feedback, structural recommendations, and 3 specific, advanced coding milestones I should implement to optimize it for a professional grade repository. Return in markdown.`,
          history: []
        })
      });
      if (response.ok) {
        const data = await response.json();
        onUpdateProject(proj.id, { aiFeedback: data.text });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header and Controls */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Engineering Project Portfolio</h2>
          <p className="text-[11px] text-slate-400">Build high-fidelity portfolio demonstrations to showcase architectural mastery on GitHub.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Start Project Board
        </Button>
      </div>

      {/* Creation Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-indigo-400" /> Spawn Engineering Project
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Project Name"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Distributed Analytics Database Server"
                  required
                />
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concept Summary</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe technical problems this project solves..."
                    className="mt-1 w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="GitHub Repo URL"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="Live Demo URL"
                    value={newProject.demoUrl}
                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Phase</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="planning">📐 Planning</option>
                      <option value="building">⚡ Building</option>
                      <option value="review">🔍 Under Review</option>
                      <option value="completed">🚀 Completed</option>
                    </select>
                  </div>
                  <Input
                    label="Completion Progress %"
                    type="number"
                    min={0}
                    max={100}
                    value={newProject.completionPercent}
                    onChange={(e) => setNewProject({ ...newProject, completionPercent: Number(e.target.value) || 0 })}
                  />
                </div>

                <Input
                  label="Tech Stack (comma-separated)"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="e.g. TypeScript, Redis, gRPC, Docker"
                />

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Spawn Board</Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;
          const tasksList = projectTasks[proj.id] || [];
          const completedCount = tasksList.filter(t => t.completed).length;
          const pct = tasksList.length > 0 ? Math.round((completedCount / tasksList.length) * 100) : proj.completionPercent;

          return (
            <div 
              key={proj.id}
              className={`bg-slate-900/30 border ${isExpanded ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'border-slate-800 hover:border-slate-700/80'} rounded-3xl overflow-hidden transition-all flex flex-col`}
            >
              <div className="p-5 flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}>
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => handleDeleteProjectProject(proj.id)} className="p-1.5 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Badges */}
              <div className="px-5 pb-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">{proj.status}</span>
                  <span className="text-indigo-400">{pct}% Completed</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {proj.technologies.map((tech: string) => (
                    <Badge key={tech} variant="neutral" className="text-[9px] text-slate-300 border-slate-800 bg-slate-950">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold border-t border-slate-800/60 mt-1">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-300 hover:text-white">
                      <Github className="w-3.5 h-3.5" /> Repository
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                      <Globe className="w-3.5 h-3.5" /> Live Stage
                    </a>
                  )}
                  <button 
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="ml-auto text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 text-[10px] font-extrabold"
                  >
                    {isExpanded ? 'Collapse Hub' : 'Manage Objectives'} <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Sub-Workspace */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/60 p-5 flex flex-col gap-4 animate-fade-in">
                  
                  {/* Inline Project Task planner */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" /> Core Milestones Checklist
                    </span>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('taskText') as HTMLInputElement;
                      handleAddProjectTask(proj.id, input.value);
                      form.reset();
                    }} className="flex gap-2">
                      <input 
                        type="text" 
                        name="taskText" 
                        placeholder="Define next sprint milestone..." 
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <Button variant="primary" size="sm" type="submit">Add</Button>
                    </form>

                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mt-1">
                      {tasksList.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800/60 rounded-xl">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleProjectTask(proj.id, task.id)}
                              className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className={`text-xs ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.text}</span>
                          </div>
                          <button onClick={() => handleDeleteProjectTask(proj.id, task.id)} className="text-slate-500 hover:text-rose-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {tasksList.length === 0 && (
                        <span className="text-[10px] text-slate-500 text-center italic py-2">No milestone checkpoints logged yet.</span>
                      )}
                    </div>
                  </div>

                  {/* AI Design Blueprint Module */}
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> AI Architecture Blueprint Review
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-[10px] px-2 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                        onClick={() => handleRequestAiArchitecture(proj)}
                        disabled={loadingAiId === proj.id}
                      >
                        {loadingAiId === proj.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Run Diagnostic'}
                      </Button>
                    </div>

                    {proj.aiFeedback ? (
                      <div className="text-[11px] text-slate-300 leading-relaxed font-semibold max-h-48 overflow-y-auto whitespace-pre-wrap border-t border-slate-800 pt-2 scrollbar-none">
                        {proj.aiFeedback}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400">Request Gemini to analyze your tech-stack coordinates and generate an advanced, modular software architecture review file.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-slate-800 bg-slate-900/10 rounded-3xl">
            <Folder className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <span className="text-xs text-slate-400 block font-bold">No active personal projects.</span>
            <p className="text-[10px] text-slate-500 mt-1">Spawn project boards to organize core repositories and track architectural improvements.</p>
          </div>
        )}
      </div>
    </div>
  );

  function handleDeleteProjectProject(id: string) {
    if (window.confirm("Are you sure you want to delete this project board?")) {
      onDeleteProject(id);
    }
  }
};
