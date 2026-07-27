/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, Plus, Edit3, Trash2, Calendar, MapPin, 
  ExternalLink, List, LayoutGrid, Check, FileText, Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface JobTrackerProps {
  applications: any[];
  onAddApplication: (app: any) => void;
  onUpdateApplication: (id: string, updates: any) => void;
  onDeleteApplication: (id: string) => void;
}

export const JobTracker: React.FC<JobTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication
}) => {
  const [layout, setLayout] = useState<'kanban' | 'table'>('kanban');
  const [isAdding, setIsAdding] = useState(false);
  const [newApp, setNewApp] = useState({
    company: '', role: '', type: 'job' as any, dateApplied: new Date().toISOString().split('T')[0],
    status: 'applied' as any, notes: '', interviewDate: '', deadline: '', priority: 'medium' as any
  });
  const [editingApp, setEditingApp] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.company.trim() || !newApp.role.trim()) return;
    onAddApplication(newApp);
    setIsAdding(false);
    setNewApp({
      company: '', role: '', type: 'job', dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied', notes: '', interviewDate: '', deadline: '', priority: 'medium'
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp.company.trim() || !editingApp.role.trim()) return;
    onUpdateApplication(editingApp.id, editingApp);
    setEditingApp(null);
  };

  const statusColumns: { id: any; label: string; color: string; hover: string }[] = [
    { id: 'applied', label: 'Applied', color: 'border-slate-800 bg-slate-900/40 text-slate-300', hover: 'hover:border-slate-600' },
    { id: 'screening', label: 'Screening', color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300', hover: 'hover:border-indigo-500/40' },
    { id: 'technical', label: 'Technical Board', color: 'border-blue-500/20 bg-blue-500/5 text-blue-300', hover: 'hover:border-blue-500/40' },
    { id: 'behavioral', label: 'Behavioral Fit', color: 'border-amber-500/20 bg-amber-500/5 text-amber-300', hover: 'hover:border-amber-500/40' },
    { id: 'offer', label: 'Offer Received', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300', hover: 'hover:border-emerald-500/40' },
    { id: 'rejected', label: 'Archived / Reject', color: 'border-rose-500/15 bg-rose-500/5 text-rose-400/80', hover: 'hover:border-rose-500/30' }
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Tracker Menu Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Button 
            variant={layout === 'kanban' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setLayout('kanban')}
            className="flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Pipeline Board
          </Button>
          <Button 
            variant={layout === 'table' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setLayout('table')}
            className="flex items-center gap-1.5"
          >
            <List className="w-3.5 h-3.5" /> Registry Spreadsheet
          </Button>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 shadow-lg">
          <Plus className="w-4 h-4" /> Log Opportunity
        </Button>
      </div>

      {/* Creation Overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Log Application Coordinate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    value={newApp.company}
                    onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                    placeholder="e.g. Stripe"
                    required
                  />
                  <Input
                    label="Target Role"
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                    placeholder="e.g. Senior Backend Engineer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opp Type</label>
                    <select
                      value={newApp.type}
                      onChange={(e) => setNewApp({ ...newApp, type: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="job">💼 Full-Time Job</option>
                      <option value="internship">🎓 Internship</option>
                      <option value="scholarship">✨ Scholarship</option>
                      <option value="hackathon">🏆 Competition</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage</label>
                    <select
                      value={newApp.status}
                      onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Archived / Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Application Date"
                    type="date"
                    value={newApp.dateApplied}
                    onChange={(e) => setNewApp({ ...newApp, dateApplied: e.target.value })}
                  />
                  <Input
                    label="Interview Date (if set)"
                    type="date"
                    value={newApp.interviewDate}
                    onChange={(e) => setNewApp({ ...newApp, interviewDate: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Apply Deadline"
                    type="date"
                    value={newApp.deadline}
                    onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                  />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Level</label>
                    <select
                      value={newApp.priority}
                      onChange={(e) => setNewApp({ ...newApp, priority: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="high">🔴 High Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="low">🟢 Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Notes</label>
                  <textarea
                    value={newApp.notes}
                    onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                    placeholder="Log recruiter info, referrals, cover letter parameters..."
                    className="mt-1 w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Log Position</Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      )}

      {/* Editing Overlay */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white">Modify Position Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Company"
                    value={editingApp.company}
                    onChange={(e) => setEditingApp({ ...editingApp, company: e.target.value })}
                  />
                  <Input
                    label="Role"
                    value={editingApp.role}
                    onChange={(e) => setEditingApp({ ...editingApp, role: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage</label>
                    <select
                      value={editingApp.status}
                      onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Archived / Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                    <select
                      value={editingApp.priority}
                      onChange={(e) => setEditingApp({ ...editingApp, priority: e.target.value as any })}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Applied Date"
                    type="date"
                    value={editingApp.dateApplied}
                    onChange={(e) => setEditingApp({ ...editingApp, dateApplied: e.target.value })}
                  />
                  <Input
                    label="Interview Date"
                    type="date"
                    value={editingApp.interviewDate || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, interviewDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                  <textarea
                    value={editingApp.notes || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                    className="mt-1 w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button variant="outline" size="sm" type="button" onClick={() => setEditingApp(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      )}

      {/* Kanban Pipeline Layout */}
      {layout === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {statusColumns.map((col) => {
            const colApps = applications.filter(a => a.status === col.id);

            return (
              <div 
                key={col.id} 
                className="flex flex-col gap-3 min-w-[200px] p-3 bg-slate-950/70 border border-slate-900/60 rounded-2xl"
              >
                <div className={`p-2 border rounded-xl flex justify-between items-center ${col.color}`}>
                  <span className="text-[10px] font-extrabold tracking-widest uppercase">{col.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10">{colApps.length}</span>
                </div>

                <div className="flex flex-col gap-3.5 min-h-[350px]">
                  {colApps.map((app) => (
                    <div 
                      key={app.id}
                      className={`bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-4 rounded-xl flex flex-col gap-2 relative transition-all group shadow-sm`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/10 uppercase tracking-wider">{app.type}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setEditingApp(app)} className="text-slate-400 hover:text-white p-0.5"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onDeleteApplication(app.id)} className="text-slate-500 hover:text-rose-400 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-normal">{app.company}</h4>
                        <p className="text-[11px] text-slate-300 font-bold mt-0.5">{app.role}</p>
                      </div>

                      {app.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/40 p-1.5 rounded-lg border border-slate-900 mt-1 italic">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="flex flex-col gap-1 text-[9px] text-slate-400 font-bold mt-1 pt-1.5 border-t border-slate-800/40">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Applied: {app.dateApplied}</span>
                        {app.interviewDate && (
                          <span className="flex items-center gap-1 text-emerald-400"><Calendar className="w-3 h-3" /> Interview: {app.interviewDate}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex items-center justify-center p-6 text-center text-[10px] text-slate-500 select-none">
                      Empty Segment
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabular Layout */}
      {layout === 'table' && (
        <Card className="bg-slate-900/20 border-slate-800">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Opp Type</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Pipeline Stage</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800/60 hover:bg-slate-900/20 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white text-xs">{app.company}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{app.role}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="uppercase text-[9px] px-1.5 py-0.5 font-extrabold">{app.type}</Badge>
                    </td>
                    <td className="p-4 text-slate-300 font-bold">{app.dateApplied}</td>
                    <td className="p-4">
                      <Badge variant="neutral" className="uppercase text-[9px] px-1.5 py-0.5 font-extrabold">{app.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={app.priority === 'high' ? 'error' : app.priority === 'medium' ? 'warning' : 'neutral'} className="text-[9px] px-1.5 py-0.5 uppercase font-bold">
                        {app.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setEditingApp(app)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteApplication(app.id)} className="text-slate-400 hover:text-rose-400 p-1 hover:bg-rose-950/20 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500 font-bold">No applications loaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
