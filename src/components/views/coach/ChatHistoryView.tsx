/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Search,
  Pin,
  Star,
  Archive,
  Trash2,
  Edit3,
  Download,
  FolderPlus,
  Filter,
  Plus,
  Clock,
  Check,
  X,
  FileText,
  FileCode,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { AiCoachService } from '../../../services/aiCoachService';
import { AiConversation } from '../../../types';
import { Badge } from '../../ui/Badge';

interface ChatHistoryViewProps {
  onSelectConversation: (conv: AiConversation) => void;
  onNewConversation: () => void;
}

export const ChatHistoryView: React.FC<ChatHistoryViewProps> = ({
  onSelectConversation,
  onNewConversation
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'pinned' | 'archived'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const loadConversations = async () => {
    if (!user) return;
    const list = await AiCoachService.getConversations(user.uid);
    setConversations(list);
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  const handleTogglePin = async (conv: AiConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await AiCoachService.updateConversation(user.uid, conv.id, { isPinned: !conv.isPinned });
    loadConversations();
  };

  const handleToggleFavorite = async (conv: AiConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await AiCoachService.updateConversation(user.uid, conv.id, { isFavorite: !conv.isFavorite });
    loadConversations();
  };

  const handleToggleArchive = async (conv: AiConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await AiCoachService.updateConversation(user.uid, conv.id, { isArchived: !conv.isArchived });
    loadConversations();
  };

  const handleDelete = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !confirm('Are you sure you want to permanently delete this chat history?')) return;
    await AiCoachService.deleteConversation(user.uid, convId);
    loadConversations();
  };

  const handleSaveRename = async (convId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editTitle.trim()) return;
    await AiCoachService.updateConversation(user.uid, convId, { title: editTitle.trim() });
    setEditingId(null);
    loadConversations();
  };

  const handleExportTranscript = async (conv: AiConversation, format: 'json' | 'md' | 'txt', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const msgs = await AiCoachService.getMessages(user.uid, conv.id);

    let content = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'json') {
      content = JSON.stringify({ conversation: conv, messages: msgs }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'md') {
      content = `# Transcript: ${conv.title}\n*Date: ${new Date(conv.createdAt).toLocaleDateString()}*\n\n` +
        msgs.map(m => `### ${m.sender === 'user' ? 'Candidate' : 'PathPilot AI Coach'}\n*${new Date(m.timestamp).toLocaleTimeString()}*\n\n${m.content}\n`).join('\n---\n\n');
      mimeType = 'text/markdown';
      ext = 'md';
    } else {
      content = `TRANSCRIPT: ${conv.title}\n========================================\n\n` +
        msgs.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender.toUpperCase()}:\n${m.content}\n`).join('\n----------------------------------------\n\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter conversations
  const filtered = conversations.filter(c => {
    if (filterTab === 'favorites' && !c.isFavorite) return false;
    if (filterTab === 'pinned' && !c.isPinned) return false;
    if (filterTab === 'archived' && !c.isArchived) return false;
    if (filterTab !== 'archived' && c.isArchived) return false;

    if (selectedCategory !== 'all' && c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q);
      const snippetMatch = c.lastMessageSnippet?.toLowerCase().includes(q);
      return titleMatch || snippetMatch;
    }
    return true;
  });

  const categories = ['all', 'General', 'Resume Review', 'Interview Prep', 'Salary Negotiation', 'Career Strategy'];

  return (
    <div id="chat-history-vault" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold">Chat History & Vault</h1>
          </div>
          <p className="text-xs text-indigo-200/80">
            Search, organize, export, and review all previous AI coaching conversations and strategic drills.
          </p>
        </div>

        <button
          onClick={onNewConversation}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Coaching Session</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts by title or message snippet..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Tab Filter Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-x-auto">
          {(['all', 'favorites', 'pinned', 'archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-[var(--color-bg-tertiary)] border border-primary text-primary font-bold'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conversation Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
          <MessageSquare className="w-10 h-10 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">No Conversations Found</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            {searchQuery ? 'Try modifying your search or filters.' : 'Start your first session with your AI Career Coach.'}
          </p>
          <button
            onClick={onNewConversation}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Start Coaching
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(conv => (
            <motion.div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              whileHover={{ scale: 1.01 }}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] hover:border-primary/50 transition-all cursor-pointer shadow-sm"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="primary" className="text-[10px] capitalize">
                    {conv.category || 'General'}
                  </Badge>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleTogglePin(conv, e)}
                      className={`p-1 rounded hover:bg-[var(--color-bg-primary)] ${conv.isPinned ? 'text-amber-500' : 'text-[var(--color-text-secondary)]'}`}
                      title={conv.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleToggleFavorite(conv, e)}
                      className={`p-1 rounded hover:bg-[var(--color-bg-primary)] ${conv.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[var(--color-text-secondary)]'}`}
                      title={conv.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleToggleArchive(conv, e)}
                      className={`p-1 rounded hover:bg-[var(--color-bg-primary)] ${conv.isArchived ? 'text-blue-500' : 'text-[var(--color-text-secondary)]'}`}
                      title={conv.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                {editingId === conv.id ? (
                  <form onSubmit={(e) => handleSaveRename(conv.id, e)} className="flex items-center gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-[var(--color-bg-primary)] border border-primary text-xs font-bold text-[var(--color-text-primary)]"
                      autoFocus
                    />
                    <button type="submit" className="p-1 text-emerald-500 hover:bg-[var(--color-bg-primary)] rounded">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-1 text-rose-500 hover:bg-[var(--color-bg-primary)] rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-primary transition-colors line-clamp-1">
                      {conv.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conv.id);
                        setEditTitle(conv.title);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[var(--color-bg-primary)] rounded text-[var(--color-text-secondary)]"
                      title="Rename Title"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Snippet */}
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                  {conv.lastMessageSnippet || 'No preview messages available yet.'}
                </p>
              </div>

              {/* Footer Bar */}
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(conv.updatedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleExportTranscript(conv, 'md', e)}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-primary transition-colors"
                    title="Export Markdown Transcript"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-rose-500 transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-1 text-primary group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryView;
