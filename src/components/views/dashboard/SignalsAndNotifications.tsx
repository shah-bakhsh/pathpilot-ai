/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import {
  Bell,
  Calendar,
  Sparkles,
  Compass,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

export const SignalsAndNotifications: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
    calendarEvents,
    toggleCalendarEvent,
    opportunities,
  } = useCareer();

  const [activeTab, setActiveTab] = useState<'notifications' | 'events' | 'opportunities'>('notifications');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavigate = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] hover:shadow-sm transition-shadow duration-300 select-none">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-text-main">Signals, Alerts & Curated Leads</CardTitle>
              <p className="text-xs text-text-sub font-semibold">Real-time AI broadcasts, calendar events, and matched opportunities.</p>
            </div>
          </div>

          {/* Sub-tabs switch */}
          <div className="flex items-center gap-1 bg-[var(--surface-secondary)]/30 border border-[var(--border)] p-1 rounded-xl">
            {[
              { id: 'notifications', label: `Notifications (${unreadCount})`, icon: <Bell className="w-3.5 h-3.5" /> },
              { id: 'events', label: `Events (${calendarEvents.length})`, icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: 'opportunities', label: `Leads (${opportunities.length})`, icon: <Compass className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer',
                  activeTab === t.id
                    ? 'bg-primary text-black shadow-2xs font-black'
                    : 'text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]'
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        
        {/* Tab 1: Notifications */}
        {activeTab === 'notifications' && (
          <div className="flex flex-col gap-3">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-mute font-semibold">
                No new notifications logged. You're up to date!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {notifications.slice(0, 6).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      'p-3.5 rounded-xl border flex flex-col justify-between gap-2 cursor-pointer transition-all duration-200',
                      notif.read
                        ? 'bg-[var(--surface-secondary)]/10 border-[var(--border)]/40 opacity-60'
                        : 'bg-primary/5 border-primary/20 hover:border-primary/40 shadow-2xs'
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-black text-text-main leading-snug">{notif.title}</span>
                      <span className="text-[9px] text-text-mute font-bold shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-sub font-medium leading-relaxed">
                      {notif.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs font-bold text-error flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All Notifications
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Calendar Events */}
        {activeTab === 'events' && (
          <div className="flex flex-col gap-3">
            {calendarEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-mute font-semibold">
                No events scheduled. Add interviews or target dates on your Calendar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {calendarEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => toggleCalendarEvent(event.id)}
                    className={cn(
                      'p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all duration-200 group select-none',
                      event.completed
                        ? 'bg-[var(--surface-secondary)]/20 border-[var(--border)]/40 opacity-60'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-primary/30'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        event.completed ? 'bg-success border-success text-black' : 'border-[var(--border)] group-hover:border-primary'
                      )}
                    >
                      {event.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          'text-xs font-black truncate',
                          event.completed ? 'line-through text-text-mute' : 'text-text-main'
                        )}
                      >
                        {event.title}
                      </span>
                      <span className="text-[10px] text-text-mute font-bold mt-1">
                        {event.date} • <strong className="text-primary uppercase">{event.type}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Curated Opportunities Leads */}
        {activeTab === 'opportunities' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {opportunities.slice(0, 3).map((op) => (
                <div
                  key={op.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-3 shadow-2xs hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant={op.type === 'scholarship' ? 'secondary' : 'primary'} className="text-[9px] font-black uppercase">
                        {op.type}
                      </Badge>
                      <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                        {op.matchIndex}% Match
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-text-main group-hover:text-primary transition-colors leading-snug">
                      {op.title}
                    </h4>
                    <span className="text-[10.5px] text-text-sub font-semibold">
                      {op.organization} • {op.location}
                    </span>
                    <p className="text-[10.5px] text-text-mute font-medium line-clamp-2 mt-1">
                      {op.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/40 text-[10.5px]">
                    <span className="text-text-mute font-bold">{op.rewardValue ? `Grant: ${op.rewardValue}` : `Location: ${op.location}`}</span>
                    <a
                      href={op.applicationUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-primary font-black flex items-center gap-0.5 hover:underline"
                    >
                      Apply <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('opportunities')}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                Explore All Opportunities <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default SignalsAndNotifications;
