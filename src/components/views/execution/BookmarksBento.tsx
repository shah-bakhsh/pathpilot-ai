/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, ExternalLink, Trash2, ArrowUpRight, Compass,
  Briefcase, BookOpen, Folder, FileText, Plus, Star
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface BookmarksBentoProps {}

export const BookmarksBento: React.FC<BookmarksBentoProps> = () => {
  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-execution-bookmarks');
      return saved ? JSON.parse(saved) : [
        { id: 'b_1', title: 'Stripe API Idempotency Keys Engineering Specs', type: 'resource', url: 'https://stripe.com/docs/api/idempotent_requests', dateAdded: new Date().toISOString() },
        { id: 'b_2', title: 'Senior Backend Developer Role on LinkedIn', type: 'job', url: 'https://linkedin.com/', dateAdded: new Date().toISOString() },
        { id: 'b_3', title: 'Concurrency System Design Handbook Course', type: 'course', url: 'https://bytecodego.com', dateAdded: new Date().toISOString() }
      ];
    } catch {
      return [];
    }
  });

  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', type: 'resource' as any });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;
    const item = {
      id: 'bmk_' + Math.random().toString(36).substring(2, 9),
      ...newBookmark,
      dateAdded: new Date().toISOString()
    };
    const updated = [...bookmarks, item];
    setBookmarks(updated);
    localStorage.setItem('pathpilot-execution-bookmarks', JSON.stringify(updated));
    setNewBookmark({ title: '', url: '', type: 'resource' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('pathpilot-execution-bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* Control Bar */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bookmarks Bento Grid</h3>
          <p className="text-[11px] text-slate-400">Assemble external documentation URLs, high-value resume benchmarks, or targeted job details.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4" /> Save Bookmark
        </Button>
      </div>

      {/* Creation Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full bg-slate-950 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-400" /> Catalog External Bookmark
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <Input
                  label="Resource Title"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                  placeholder="e.g. Stripe API Idempotency Specifications"
                  required
                />
                <Input
                  label="Reference URL"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification Group</label>
                  <select
                    value={newBookmark.type}
                    onChange={(e) => setNewBookmark({ ...newBookmark, type: e.target.value as any })}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="resource">📎 Technical Resource</option>
                    <option value="job">💼 Job Application URL</option>
                    <option value="course">📚 Training Course</option>
                    <option value="project">📁 Project Reference</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Log Bookmark</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bmk, idx) => (
          <div 
            key={bmk.id}
            className={`p-5 bg-slate-900/30 border border-slate-800 hover:border-slate-700/80 rounded-3xl transition-all flex flex-col justify-between group h-40 ${
              idx % 3 === 0 ? 'lg:col-span-1' : idx % 3 === 1 ? 'lg:col-span-1' : 'lg:col-span-1'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-xl">
                  {bmk.type === 'job' ? <Briefcase className="w-4 h-4" /> : 
                   bmk.type === 'course' ? <BookOpen className="w-4 h-4" /> : 
                   bmk.type === 'project' ? <Folder className="w-4 h-4" /> : 
                   <FileText className="w-4 h-4" />}
                </div>
                <Badge variant="secondary" className="text-[8px] font-extrabold uppercase px-1.5 py-0">{bmk.type}</Badge>
              </div>

              <button onClick={() => handleDelete(bmk.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-xs font-bold text-white leading-normal mt-2 line-clamp-2">{bmk.title}</h4>

            <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold mt-2 pt-2 border-t border-slate-800/40">
              <span>Added {bmk.dateAdded.split('T')[0]}</span>
              <a href={bmk.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-extrabold">
                Launch Resource <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}

        {bookmarks.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-slate-800 rounded-3xl">
            <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <span className="text-xs text-slate-400 block font-bold">No saved bookmarks.</span>
            <p className="text-[10px] text-slate-500 mt-1">Catalog external references or engineering pages to access them from the bento grid dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};
