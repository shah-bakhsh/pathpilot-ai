/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Star,
  Trash2,
  Folder,
  FolderPlus,
  Tag,
  Copy,
  Check,
  Edit3,
  BookOpen,
  Sparkles,
  Layers,
  Share2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotes } from '../../hooks/useNotes';
import { ProductivityNote } from '../../types';

export const NotesWorkspaceView: React.FC = () => {
  const { notes, loading, addNote, updateNote, deleteNote, togglePin, toggleFavorite } = useNotes();

  const [selectedNote, setSelectedNote] = useState<ProductivityNote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit State
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const activeNote = selectedNote || notes[0] || null;

  const handleSelectNote = (note: ProductivityNote) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleCreateNewNote = async () => {
    const created = await addNote({
      title: 'Untitled Career Note',
      content: '# New Workspace Note\nStart typing notes, technical formulas, or interview preparation STAR stories...',
      tags: ['Career'],
      type: 'rich'
    });
    if (created) {
      handleSelectNote(created);
      setIsEditing(true);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    await updateNote(activeNote.id, {
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredNotes = notes.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Productivity Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Notion Notes & Docs Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Career Notes & Knowledge Base
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Structured workspace for system design cheatsheets, behavioral STAR stories, technical interview formulas, and company research.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" size="sm" onClick={handleCreateNewNote} className="flex items-center gap-1.5 h-9 font-black">
            <Plus className="w-4 h-4" /> New Workspace Note
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Notes List */}
        <Card className="lg:col-span-4 bg-[var(--surface)] border-[var(--border)] p-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-sub">No notes found.</p>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-card border cursor-pointer transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-[var(--surface-secondary)]/30 border-[var(--border)] hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-text-main truncate">{note.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {note.isPinned && <Pin className="w-3 h-3 text-primary" />}
                        {note.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-text-sub line-clamp-2 leading-tight">
                      {note.content.replace(/[#*`]/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[9px] font-bold text-text-mute pt-1">
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      <span className="uppercase">{note.tags?.[0] || 'Note'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Area: Markdown Editor / Viewer */}
        <Card className="lg:col-span-8 bg-[var(--surface)] border-[var(--border)] p-6 min-h-[600px] flex flex-col justify-between">
          {activeNote ? (
            <div className="flex flex-col gap-4">
              {/* Note Header Controls */}
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="text-[10px] uppercase font-black">
                    {activeNote.type || 'Rich Markdown'}
                  </Badge>
                  <span className="text-[10px] text-text-mute font-bold">
                    Updated {new Date(activeNote.updatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyNote}
                    className="flex items-center gap-1 h-8 text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>

                  <Button
                    variant={isEditing ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        handleSaveNote();
                      } else {
                        setEditTitle(activeNote.title);
                        setEditContent(activeNote.content);
                        setIsEditing(true);
                      }
                    }}
                    className="flex items-center gap-1 h-8 text-xs font-black"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Changes' : 'Edit Note'}</span>
                  </Button>

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-text-mute hover:text-danger cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Body */}
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <Input
                    label="Note Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-sm font-black"
                  />

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-text-mute tracking-wider">
                      Markdown Content
                    </label>
                    <textarea
                      rows={18}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-card p-3 text-xs text-text-main font-mono leading-relaxed focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-black text-text-main">{activeNote.title}</h2>
                  <div className="prose dark:prose-invert max-w-none text-xs text-text-sub leading-relaxed whitespace-pre-wrap font-sans">
                    {activeNote.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
              <FileText className="w-12 h-12 text-text-mute opacity-50" />
              <p className="text-sm font-black text-text-main">No Workspace Note Selected</p>
              <p className="text-xs text-text-sub">Select a note from the left sidebar or create a new note.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NotesWorkspaceView;
