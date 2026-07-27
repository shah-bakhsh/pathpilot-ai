/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, FolderPlus, Tag, Plus, Trash2, Edit3, Save, Compass, 
  MoreVertical, FileText, Search, Bookmark, ChevronRight, Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface CommandNotesProps {}

export const CommandNotes: React.FC<CommandNotesProps> = () => {
  // Synchronized locally in localStorage
  const [folders, setFolders] = useState<{ id: string; name: string }[]>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-notes-folders');
      return saved ? JSON.parse(saved) : [
        { id: 'f_1', name: 'System Design Studies' },
        { id: 'f_2', name: 'Application Templates' },
        { id: 'f_3', name: 'Leadership QAs' }
      ];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-notes-items');
      return saved ? JSON.parse(saved) : [
        { id: 'n_1', folderId: 'f_1', title: 'Concurrency Mechanics & Caching', content: 'Design parameters for utilizing Redis clusters with write-through caching methodologies to secure 20ms read latencies.', tags: ['Redis', 'SystemDesign'], isBookmarked: true, updatedAt: new Date().toISOString() },
        { id: 'n_2', folderId: 'f_2', title: 'Resume Cover Letter Core Template', content: 'Dear Engineering Leader,\n\nI am writing to express my strong interest in the Senior Backend Engineer position...', tags: ['CoverLetter', 'Apply'], isBookmarked: false, updatedAt: new Date().toISOString() }
      ];
    } catch {
      return [];
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>('n_1');
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Auto-save logic simulation
  useEffect(() => {
    if (activeNote) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
        localStorage.setItem('pathpilot-notes-items', JSON.stringify(notes));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [notes]);

  const handleCreateNote = () => {
    const fId = activeFolderId === 'all' ? (folders[0]?.id || '') : activeFolderId;
    const newNote = {
      id: 'n_' + Math.random().toString(36).substring(2, 9),
      folderId: fId,
      title: 'Untitled Document Draft',
      content: '',
      tags: [],
      isBookmarked: false,
      updatedAt: new Date().toISOString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this document?")) {
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      localStorage.setItem('pathpilot-notes-items', JSON.stringify(updated));
      if (activeNoteId === id) {
        setActiveNoteId(updated[0]?.id || null);
      }
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newF = { id: 'f_' + Math.random().toString(36).substring(2, 9), name: newFolderName };
    const updated = [...folders, newF];
    setFolders(updated);
    localStorage.setItem('pathpilot-notes-folders', JSON.stringify(updated));
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleUpdateNoteContent = (content: string) => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content, updatedAt: new Date().toISOString() } : n));
  };

  const handleUpdateNoteTitle = (title: string) => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, title, updatedAt: new Date().toISOString() } : n));
  };

  const handleToggleNoteBookmark = () => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, isBookmarked: !n.isBookmarked } : n));
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesFolder = activeFolderId === 'all' || n.folderId === activeFolderId;
    const matchesSearch = n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(noteSearchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 w-full min-h-[500px]">
      
      {/* Sidebar navigation */}
      <Card className="lg:col-span-1 bg-slate-900/20 border-slate-800 p-4 flex flex-col gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={noteSearchQuery}
            onChange={(e) => setNoteSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Folders List */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Notebooks / Folders</span>
          <button 
            onClick={() => setActiveFolderId('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeFolderId === 'all' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/10' : 'text-slate-300 hover:bg-slate-900/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> All Drafts</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded-full text-slate-400">{notes.length}</span>
          </button>

          {folders.map(f => {
            const count = notes.filter(n => n.folderId === f.id).length;
            const isSelected = activeFolderId === f.id;

            return (
              <button 
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/10' : 'text-slate-300 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5"><Folder className="w-3.5 h-3.5" /> {f.name}</span>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded-full text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Create Folder trigger */}
        {!isAddingFolder ? (
          <button 
            onClick={() => setIsAddingFolder(true)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 px-2.5 mt-1"
          >
            <FolderPlus className="w-4 h-4" /> Add Notebook
          </button>
        ) : (
          <form onSubmit={handleCreateFolder} className="flex gap-2 animate-fade-in mt-1">
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
            <Button variant="primary" size="sm" type="submit" className="h-8">Save</Button>
          </form>
        )}

        <hr className="border-slate-800/80 my-1" />

        {/* Notes list */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documents</span>
            <button onClick={handleCreateNote} className="text-indigo-400 hover:text-indigo-300"><Plus className="w-4 h-4" /></button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto scrollbar-none">
            {filteredNotes.map(n => {
              const isSelected = activeNoteId === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveNoteId(n.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex flex-col gap-1 transition-all group ${
                    isSelected ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-slate-900 bg-slate-950/20 hover:bg-slate-900/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 w-full">
                    <span className={`text-xs font-bold leading-normal line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{n.title || 'Untitled Draft'}</span>
                    <button 
                      onClick={(e) => handleDeleteNote(n.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 leading-normal line-clamp-1 font-bold">{n.content.substring(0, 40) || 'Write draft...'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Editor Main Board */}
      <Card className="lg:col-span-3 bg-slate-900/20 border-slate-800 p-5 flex flex-col gap-4 h-full min-h-[450px]">
        {activeNote ? (
          <div className="flex-1 flex flex-col gap-4 h-full">
            
            {/* Header controls */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleToggleNoteBookmark}
                  className={`p-1.5 rounded-lg border transition-all ${
                    activeNote.isBookmarked ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-500 font-bold">Draft ID: {activeNote.id}</span>
              </div>

              {/* Saved Status Indicator */}
              <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                {isSaving ? (
                  <span className="text-amber-400 flex items-center gap-1">Auto-saving...</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" /> Synced to Vault</span>
                )}
              </div>
            </div>

            {/* Note Title Input */}
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateNoteTitle(e.target.value)}
              placeholder="Untitled Document Draft..."
              className="bg-transparent text-lg font-bold text-white border-none outline-none focus:ring-0 px-0 placeholder-slate-700"
            />

            {/* Note Rich Text Editor */}
            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateNoteContent(e.target.value)}
              placeholder="Start drafting study schedules, motivation milestones, application checklists..."
              className="flex-1 w-full min-h-[300px] bg-transparent text-slate-200 text-xs border-none outline-none focus:ring-0 p-0 placeholder-slate-700 resize-none font-semibold leading-relaxed"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-12 h-12 text-slate-500 mb-3" />
            <span className="text-xs text-slate-400 font-bold block">No document loaded.</span>
            <p className="text-[10px] text-slate-500 mt-1">Select a document from folders or spawn a new draft to configure engineering logs.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
