/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import { JobApplication } from '../../../types';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  FileText,
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  MoreVertical,
  Sliders,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

type ApplicationStatus = 'applied' | 'screening' | 'technical' | 'behavioral' | 'offer' | 'rejected' | 'negotiation';

const STATUS_COLUMNS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'screening', label: 'Screening', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'technical', label: 'Technical', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'behavioral', label: 'Behavioral', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { value: 'offer', label: 'Offer Received', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'rejected', label: 'Rejected / Pass', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
];

export const ApplicationTracker: React.FC = () => {
  const { jobApplications, addJobApplication, updateJobApplication, deleteJobApplication } = useCareer();

  // Create Manual Application state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newType, setNewType] = useState<JobApplication['type']>('job');
  const [newPriority, setNewPriority] = useState<JobApplication['priority']>('medium');
  const [newDeadline, setNewDeadline] = useState<string>('');

  // Editing notes state
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');

  // Add application handler
  const handleAddApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    addJobApplication({
      company: newCompany.trim(),
      role: newRole.trim(),
      type: newType,
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied',
      priority: newPriority,
      deadline: newDeadline || undefined,
      notes: ''
    });

    // Reset states
    setNewCompany('');
    setNewRole('');
    setNewType('job');
    setNewPriority('medium');
    setNewDeadline('');
    setShowAddModal(false);
  };

  // Move status handler
  const handleMoveStatus = (id: string, newStatus: ApplicationStatus) => {
    updateJobApplication(id, { status: newStatus });
  };

  // Save notes handler
  const handleSaveNotes = (id: string) => {
    updateJobApplication(id, { notes: notesInput.trim() });
    setEditingAppId(null);
    setNotesInput('');
  };

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
            🚀 Application Pipeline Board
          </h2>
          <p className="text-xs text-slate-400">Track and manage every stage of your active application coordinates.</p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-4 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/15"
        >
          <Plus className="w-4 h-4" /> Add Application Coordinates
        </Button>
      </div>

      {/* ADD APPLICATION POPUP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center select-none">
                <span className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Register New Coordinate
                </span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleAddApplicationSubmit} className="space-y-3 text-xs text-slate-300">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 block">Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, MIT, Google"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 focus:outline-none focus:border-indigo-500"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 block">Position / Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Engineer, Research Fellow"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 focus:outline-none focus:border-indigo-500"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 block">Category</label>
                    <select
                      className="w-full px-2 py-2 rounded-lg bg-slate-950 border border-slate-850 focus:outline-none focus:border-indigo-500 text-slate-300"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as JobApplication['type'])}
                    >
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="competition">Competition</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 block">Priority Level</label>
                    <select
                      className="w-full px-2 py-2 rounded-lg bg-slate-950 border border-slate-850 focus:outline-none focus:border-indigo-500 text-slate-300"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as JobApplication['priority'])}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 block">Target Deadline Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 focus:outline-none focus:border-indigo-500 text-slate-300"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-2.5 mt-2.5 font-bold uppercase text-xs tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Register Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* KANBAN GRID COLUMNS */}
      <div className="flex gap-4 overflow-x-auto pb-4 max-h-[600px] select-none">
        {STATUS_COLUMNS.map((column) => {
          const colApps = jobApplications.filter((app) => app.status === column.value);

          return (
            <div
              key={column.value}
              className="w-72 shrink-0 flex flex-col gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-850/80"
            >
              {/* COLUMN HEADER */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  {column.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                  {colApps.length}
                </span>
              </div>

              {/* CARD CONTAINER */}
              <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[300px] pr-0.5">
                {colApps.length > 0 ? (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-700/60 transition-all flex flex-col gap-2.5 relative group/card"
                    >
                      {/* TOP ROW: ROLE & TRASH */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">
                            {app.company}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 leading-tight mt-0.5">
                            {app.role}
                          </h4>
                        </div>
                        <button
                          onClick={() => deleteJobApplication(app.id)}
                          className="p-1 rounded hover:bg-slate-850 text-slate-500 hover:text-rose-400 opacity-0 group-hover/card:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* DATE / PRIORITY DETAILS */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {app.dateApplied}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                          app.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' :
                          app.priority === 'medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/15'
                        }`}>
                          {app.priority}
                        </span>
                      </div>

                      {/* NOTES DISPLAY & EDIT TOGGLE */}
                      <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-850/50 text-[10px] text-slate-400">
                        {editingAppId === app.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              className="w-full p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-200 focus:outline-none"
                              value={notesInput}
                              onChange={(e) => setNotesInput(e.target.value)}
                            />
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setEditingAppId(null)}
                                className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNotes(app.id)}
                                className="px-1.5 py-0.5 bg-indigo-600 rounded text-[9px] text-white hover:bg-indigo-500"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingAppId(app.id);
                              setNotesInput(app.notes || '');
                            }}
                            className="cursor-pointer italic hover:text-slate-200"
                          >
                            {app.notes || 'Click to write progress log notes...'}
                          </div>
                        )}
                      </div>

                      {/* QUICK STATUS TRANSITION SHIFTERS */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] select-none">
                        <span className="text-slate-500 font-semibold uppercase">Transition stage:</span>
                        <div className="flex gap-1">
                          {STATUS_COLUMNS.filter(col => col.value !== app.status).slice(0, 2).map((col) => (
                            <button
                              key={col.value}
                              onClick={() => handleMoveStatus(app.id, col.value)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-indigo-900/40 hover:text-indigo-300 text-slate-400 font-bold transition-all text-[8px] uppercase tracking-wider"
                            >
                              {col.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="h-40 rounded-xl border border-dashed border-slate-850 flex flex-col items-center justify-center p-4 text-center text-slate-500">
                    <FileText className="w-5 h-5 opacity-40 mb-1" />
                    <span className="text-[10px] font-semibold leading-normal">No active coordinates tracked.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
