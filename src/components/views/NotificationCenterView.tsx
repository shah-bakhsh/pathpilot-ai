/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Pin,
  Archive,
  Trash2,
  Filter,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Briefcase,
  BookOpen,
  Award,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotifications } from '../../hooks/useNotifications';
import { EnhancedNotification } from '../../types';

export const NotificationCenterView: React.FC = () => {
  const {
    notifications,
    loading,
    unreadCount,
    markRead,
    markAllRead,
    togglePin,
    toggleArchive,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter((item) => {
    // Tab filter
    if (activeTab === 'unread' && (item.read || item.isArchived)) return false;
    if (activeTab === 'pinned' && (!item.isPinned || item.isArchived)) return false;
    if (activeTab === 'archived' && !item.isArchived) return false;
    if (activeTab === 'all' && item.isArchived) return false;

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q);
    }

    return true;
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'interview':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'learning':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'certification':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-primary animate-pulse" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-text-sub" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Productivity Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Smart Notification Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notification Center
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Realtime smart notification queue for interview alerts, application deadlines, AI recommendations, and milestone streak updates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={unreadCount > 0 ? 'primary' : 'neutral'} className="text-xs font-black py-1 px-3">
            {unreadCount} Unread Alerts
          </Badge>
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-1.5 h-9">
            <CheckCheck className="w-4 h-4 text-primary" /> Mark All Read
          </Button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Navigation Tabs */}
        <div className="md:col-span-2 flex items-center gap-1.5 bg-[var(--surface-secondary)]/50 p-1 rounded-card border border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              activeTab === 'all' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            Inbox ({notifications.filter((n) => !n.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              activeTab === 'unread' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              activeTab === 'pinned' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            Pinned ({notifications.filter((n) => n.isPinned && !n.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-btn text-xs font-black cursor-pointer transition-all ${
              activeTab === 'archived' ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main'
            }`}
          >
            Archive ({notifications.filter((n) => n.isArchived).length})
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-card px-3 py-2 text-xs font-bold text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="interview">⚡ Interviews</option>
            <option value="application">📄 Applications</option>
            <option value="learning">📚 Learning</option>
            <option value="certification">🎯 Certifications</option>
            <option value="ai">✨ AI Suggestions</option>
            <option value="security">🛡️ Security Alerts</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Notifications Queue */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-4">
        <CardHeader className="border-b border-[var(--border)] pb-3 mb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-text-sub flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-primary" /> Active Queue Items ({filteredNotifications.length})
          </CardTitle>
          <button
            onClick={clearAll}
            className="text-[11px] font-extrabold text-danger hover:underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Notification Storage
          </button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-60" />
              <p className="text-xs font-black text-text-main">Notification Queue Clear</p>
              <p className="text-[11px] text-text-sub">No pending alerts match your current filter parameters.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  notif.read
                    ? 'bg-[var(--surface-secondary)]/30 border-[var(--border)]/60 opacity-80'
                    : 'bg-[var(--surface)] border-primary/30 shadow-xs'
                } ${notif.isPinned ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-black tracking-tight ${notif.read ? 'text-text-sub' : 'text-text-main'}`}>
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      )}
                      {notif.priority === 'urgent' && (
                        <Badge variant="error" className="text-[9px] px-1.5 py-0">URGENT</Badge>
                      )}
                      {notif.priority === 'high' && (
                        <Badge variant="warning" className="text-[9px] px-1.5 py-0">HIGH</Badge>
                      )}
                      <span className="text-[10px] text-text-mute font-bold">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-text-sub leading-relaxed font-semibold">
                      {notif.body}
                    </p>

                    {notif.actionUrl && (
                      <a
                        href={notif.actionUrl}
                        className="text-[11px] font-extrabold text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Navigate to Module <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border)]">
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] text-text-sub hover:text-text-main cursor-pointer"
                      title="Mark Read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => togglePin(notif.id, !!notif.isPinned)}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      notif.isPinned ? 'text-primary bg-primary/10' : 'text-text-mute hover:text-text-main'
                    }`}
                    title={notif.isPinned ? 'Unpin' : 'Pin to Top'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleArchive(notif.id, !!notif.isArchived)}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      notif.isArchived ? 'text-blue-400 bg-blue-500/10' : 'text-text-mute hover:text-text-main'
                    }`}
                    title={notif.isArchived ? 'Unarchive' : 'Archive Alert'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 rounded-lg hover:bg-danger/10 text-text-mute hover:text-danger cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenterView;
