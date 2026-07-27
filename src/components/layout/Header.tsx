/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, X, Check, Trash2, ShieldAlert, Award, Flame, Globe, Wifi, CheckCircle, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';

export interface HeaderProps {
  activeTab: string;
  onMenuToggle: () => void;
  onProfileModalOpen?: () => void;
  onSearchClick: () => void;
}

const tabNames: Record<string, string> = {
  dashboard: 'Dashboard Overview',
  roadmap: 'Career Roadmap',
  execution: 'Execution Workspace',
  resume: 'Resume & ATS Studio',
  documents: 'Documents Vault',
  mentor: 'PathPilot AI Coach',
  interview: 'Interview Simulator',
  opportunities: 'Opportunities Grid',
  applications: 'Job Applications Pipeline',
  learning: 'Learning Paths & Skills',
  analytics: 'Career Analytics',
  achievements: 'Achievements & XP',
  calendar: 'Calendar & Deadlines',
  profile: 'User Profile & Goals',
  settings: 'System Settings',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onMenuToggle,
  onProfileModalOpen,
  onSearchClick,
}) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, clearNotifications } = useCareer();
  
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to mark all notifications as read
  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <header className="flex items-center justify-between px-5 md:px-8 border-b border-[var(--border)] bg-[var(--surface)] h-16 shrink-0 relative z-30 select-none">
      
      {/* Mobile Drawer Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-btn text-text-sub hover:bg-[var(--hover-tint)] cursor-pointer outline-none transition-colors border border-[var(--border)]"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Dynamic Breadcrumbs System */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-text-mute font-bold">
          <span className="text-text-mute/80 tracking-wide font-medium">PathPilot AI</span>
          <span className="text-text-mute/40 select-none font-normal">/</span>
          <span className="text-text-main font-black tracking-tight">{tabNames[activeTab] || 'Dashboard'}</span>
          <span className="flex items-center gap-1.5 ml-2.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/15 text-[9px] text-success font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Trajectory Synced
          </span>
        </div>
      </div>

      {/* Global Utilities Area */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Command Palette trigger Search bar */}
        <button
          onClick={onSearchClick}
          className="relative max-w-[200px] md:max-w-[260px] w-full hidden md:flex items-center justify-between bg-[var(--hover-tint)]/60 text-text-sub text-[11px] font-semibold rounded-input border border-[var(--border)]/45 px-3 py-1.5 h-9 hover:border-primary/25 cursor-pointer outline-none transition-all duration-150"
        >
          <span className="flex items-center gap-2 text-text-mute/80">
            <Search className="w-3.5 h-3.5" /> Search commands...
          </span>
          <kbd className="bg-[var(--surface)] border border-[var(--border)] text-[9px] px-1.5 py-0.5 rounded shadow-2xs font-sans">
            ⌘K
          </kbd>
        </button>

        {/* Real-time Notifications Bell dropdown */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-btn border border-[var(--border)] hover:bg-[var(--hover-tint)] text-text-sub hover:text-text-main transition-all duration-200 cursor-pointer outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border border-[var(--surface)] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-xl overflow-hidden py-1.5 animate-dropdown z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-text-main">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/15 px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[9px] text-primary hover:underline font-bold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[9px] text-text-mute hover:text-danger flex items-center gap-0.5 font-bold cursor-pointer outline-none"
                    >
                      <Trash2 className="w-2.5 h-2.5" /> Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]/40 scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-text-mute flex flex-col items-center justify-center gap-1.5">
                    <span>🔔</span>
                    <p className="font-semibold text-[11px]">System activity clear</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        'p-3.5 text-left transition-colors duration-150 cursor-pointer flex gap-3',
                        notif.read ? 'bg-transparent' : 'bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary'
                      )}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.type === 'success' && <Award className="w-4 h-4 text-success" />}
                        {notif.type === 'streak' && <Flame className="w-4 h-4 text-accent animate-pulse" />}
                        {notif.type === 'warning' && <ShieldAlert className="w-4 h-4 text-warning" />}
                        {notif.type === 'info' && <Bell className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-bold text-text-main leading-tight truncate">
                          {notif.title}
                        </p>
                        <p className="text-[10.5px] text-text-sub leading-normal mt-0.5 font-medium">
                          {notif.body}
                        </p>
                        <p className="text-[9px] text-text-mute mt-1 font-semibold">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(notif.id);
                          }}
                          className="shrink-0 self-center w-5 h-5 rounded-full hover:bg-[var(--hover-tint)] text-success flex items-center justify-center"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown menu */}
        {user && (
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--hover-tint)] transition-all duration-150 cursor-pointer outline-none text-left border border-transparent hover:border-[var(--border)]"
            >
              {/* Profile Avatar photo or custom initials */}
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-text-main font-extrabold flex items-center justify-center text-xs tracking-wider uppercase shadow-xs shrink-0 relative overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{user.name ? user.name.split(' ').map(n => n[0]).join('') : 'P'}</span>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-[var(--surface)]" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-2xl py-1.5 overflow-hidden animate-dropdown z-50">
                <div className="px-4.5 py-3 border-b border-[var(--border)] bg-[var(--surface-secondary)]/30 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-black text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>{user.name ? user.name.split(' ').map(n => n[0]).join('') : 'P'}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-black text-text-main truncate">{user.name}</p>
                    <p className="text-[10px] text-primary font-bold truncate mt-0.5">{user.currentTargetGoal || 'Software Engineer'}</p>
                    <p className="text-[9.5px] text-text-mute font-medium truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="py-1">
                  <div className="px-4.5 py-2 flex flex-col gap-1 text-[10.5px] border-b border-[var(--border)]/60 pb-2.5">
                    <span className="text-[9.5px] text-text-mute font-bold uppercase tracking-wider">Level Progress</span>
                    <div className="flex justify-between items-center font-bold text-text-main mt-0.5">
                      <span>Lvl {Math.floor(user.experiencePoints / 100) + 1} Pathfinder</span>
                      <span>{user.experiencePoints % 100}/100 XP</span>
                    </div>
                    <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{ width: `${user.experiencePoints % 100}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onProfileModalOpen?.();
                    }}
                    className="w-full text-left px-4.5 py-2.5 text-xs font-bold text-text-sub hover:bg-[var(--hover-tint)] hover:text-text-main flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-primary" /> View Achievements
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onProfileModalOpen?.();
                    }}
                    className="w-full text-left px-4.5 py-2.5 text-xs font-bold text-text-sub hover:bg-[var(--hover-tint)] hover:text-text-main flex items-center gap-2 cursor-pointer border-b border-[var(--border)]/40 pb-2.5"
                  >
                    <Globe className="w-4 h-4 text-info" /> Sync Credentials
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4.5 py-2.5 text-xs font-bold text-error hover:bg-error/5 flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <X className="w-4 h-4" /> Sign Out of System
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
