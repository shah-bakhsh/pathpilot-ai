/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PathPilotLogo } from '../ui/PathPilotLogo';
import {
  Compass,
  LayoutDashboard,
  Map,
  Bot,
  Video,
  Briefcase,
  Settings,
  Flame,
  LogOut,
  Sun,
  Moon,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Award,
  Pin,
  Clock,
  ExternalLink,
  HelpCircle,
  FileText,
  Zap,
  CheckSquare,
  Bell,
  ShieldAlert,
  BrainCircuit,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onProfileModalOpen?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onProfileModalOpen,
}) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Custom states for collapsible groups
  const [showWorkspace, setShowWorkspace] = useState(true);
  const [showCoaching, setShowCoaching] = useState(true);

  // Grouped Navigation Items
  const workspaceGroup = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'productivity', label: 'Productivity OS', icon: <Zap className="w-4 h-4" /> },
    { id: 'tasks', label: 'Task Manager', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Hub', icon: <Bell className="w-4 h-4" /> },
    { id: 'notes', label: 'Notion Notes & Docs', icon: <FileText className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Career Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'execution', label: 'Execution Workspace', icon: <Layers className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume & ATS Studio', icon: <FileText className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents Vault', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const coachingGroup = [
    { id: 'ecosystem', label: 'Global AI Ecosystem', icon: <Globe className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Agent Ecosystem', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'mentor', label: 'AI Coach Pane', icon: <Bot className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Simulator', icon: <Video className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Opportunities Grid', icon: <Compass className="w-4 h-4" /> },
    { id: 'applications', label: 'Job Applications', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Paths', icon: <Award className="w-4 h-4" /> },
  ];

  const analyticsGroup = [
    { id: 'analytics', label: 'Career Analytics', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements & XP', icon: <Award className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar & Deadlines', icon: <Clock className="w-4 h-4" /> },
  ];

  const managementGroup = [
    { id: 'profile', label: 'User Profile', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'admin', label: 'Enterprise Admin Console', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  // Helper to compute level based on experience points
  const computeLevelInfo = (xp: number) => {
    const level = Math.floor(xp / 100) + 1;
    const currentXpInLevel = xp % 100;
    const progressPercent = currentXpInLevel;
    return { level, currentXpInLevel, progressPercent };
  };

  const levelInfo = user ? computeLevelInfo(user.experiencePoints) : { level: 1, currentXpInLevel: 0, progressPercent: 0 };

  const renderNavButton = (item: { id: string; label: string; icon: React.ReactNode }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-bold rounded-btn cursor-pointer transition-all duration-150 outline-none select-none relative group',
          isActive
            ? 'bg-primary text-black shadow-md font-extrabold'
            : 'text-text-sub hover:bg-[var(--hover-tint)] hover:text-text-main border border-transparent'
        )}
        title={!isOpen ? item.label : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={cn('shrink-0 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-black' : 'text-text-mute group-hover:text-text-main')}>
            {item.icon}
          </span>
          {isOpen && <span className="truncate tracking-tight">{item.label}</span>}
        </div>
        {isOpen && isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 ml-1 animate-pulse" />
        )}
        {!isOpen && (
          <div className="absolute left-16 bg-black text-white text-[10px] font-black px-2.5 py-1.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 relative shrink-0 z-20 select-none',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]/70 h-16 shrink-0 overflow-hidden bg-[var(--surface)]">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex items-center justify-center shrink-0 hover:rotate-6 transition-transform duration-300 cursor-pointer">
            <PathPilotLogo size={32} />
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <span className="font-display font-black text-sm leading-none text-text-main tracking-tight">
                PathPilot AI
              </span>
              <span className="text-[9.5px] text-primary font-black mt-1 uppercase tracking-wider">
                Autonomous Coach v2
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Calibration Action Trigger */}
      {isOpen ? (
        <div className="px-3 pt-4 pb-2 shrink-0">
          <button
            onClick={onProfileModalOpen}
            className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/15 text-text-main border border-primary/20 hover:border-primary/40 px-3.5 py-2.5 rounded-btn text-xs font-black tracking-tight transition-all duration-150 cursor-pointer active:scale-98 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />
            <span>Redefine Target Career</span>
          </button>
        </div>
      ) : (
        <div className="px-3 pt-4 pb-2 shrink-0 flex justify-center">
          <button
            onClick={onProfileModalOpen}
            className="w-10 h-10 flex items-center justify-center bg-primary text-black rounded-full hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Redefine Target Career"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </button>
        </div>
      )}

      {/* Structured Navigation Hub */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4 scrollbar-none">
        
        {/* Workspace core services group */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <span className="text-[9px] font-black text-text-mute/80 uppercase tracking-widest px-3 py-1.5">
              Primary System
            </span>
          )}
          <div className="flex flex-col gap-0.5">
            {workspaceGroup.map(renderNavButton)}
          </div>
        </div>

        {/* Dynamic Coaching tools group */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <span className="text-[9px] font-black text-text-mute/80 uppercase tracking-widest px-3 py-1.5">
              Copilot & Jobs
            </span>
          )}
          <div className="flex flex-col gap-0.5">
            {coachingGroup.map(renderNavButton)}
          </div>
        </div>

        {/* Analytics & Metrics group */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <span className="text-[9px] font-black text-text-mute/80 uppercase tracking-widest px-3 py-1.5">
              Analytics & Metrics
            </span>
          )}
          <div className="flex flex-col gap-0.5">
            {analyticsGroup.map(renderNavButton)}
          </div>
        </div>

        {/* Admin management tools group */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <span className="text-[9px] font-black text-text-mute/80 uppercase tracking-widest px-3 py-1.5">
              System Settings
            </span>
          )}
          <div className="flex flex-col gap-0.5">
            {managementGroup.map(renderNavButton)}
          </div>
        </div>

        {/* Pinned shortcuts section */}
        {isOpen && (
          <div className="flex flex-col gap-1.5 mt-2 border-t border-[var(--border)]/40 pt-4">
            <span className="text-[9px] font-black text-text-mute/70 uppercase tracking-widest px-3 flex items-center gap-1">
              <Pin className="w-2.5 h-2.5 text-text-mute" /> Pinned Resources
            </span>
            <div className="flex flex-col gap-1 px-3">
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-text-sub hover:text-primary font-bold flex items-center justify-between group py-1"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <button
                onClick={() => alert('Need assistance? Connect with team coordinates via support@pathpilot.ai')}
                className="text-[11px] text-text-sub hover:text-primary font-bold flex items-center justify-between group py-1 text-left cursor-pointer"
              >
                <span>Help Support Desk</span>
                <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Card */}
      {user && (
        <div className={cn('mx-3 my-1.5 p-2 rounded-card border border-[var(--border)] bg-[var(--surface-secondary)]/40 flex items-center gap-2.5 shrink-0', !isOpen && 'justify-center mx-1 px-1')}>
          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-black text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden relative">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{user.name ? user.name.split(' ').map(n => n[0]).join('') : 'P'}</span>
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success border border-[var(--surface)]" />
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-xs font-black text-text-main truncate leading-tight">{user.name}</span>
              <span className="text-[10px] text-primary font-bold truncate mt-0.5">{user.currentTargetGoal || 'Software Engineer'}</span>
            </div>
          )}
        </div>
      )}

      {/* Gamification Indicator Panel */}
      {user && isOpen && (
        <div className="px-4.5 py-3.5 border border-[var(--border)]/70 mx-3 my-2.5 rounded-card bg-[var(--surface-secondary)]/50 flex flex-col gap-2 shrink-0 shadow-2xs">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-text-sub">Lvl {levelInfo.level} Pathfinder</span>
            <span className="text-text-mute">{levelInfo.currentXpInLevel}/100 XP</span>
          </div>
          {/* XP Gauge */}
          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-black text-text-sub mt-0.5">
            <Flame className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" />
            <span>{user.activeStreak} Day Pipeline Streak</span>
          </div>
        </div>
      )}

      {/* Footer Controllers */}
      <div className="p-3 border-t border-[var(--border)]/70 shrink-0 flex flex-col gap-3.5 bg-[var(--surface-secondary)]/20">
        
        {/* Toggle Collapse Button absolutely overlayed */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3.5 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-7 h-7 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-md text-text-sub hover:text-text-main cursor-pointer active:scale-95 focus:outline-none z-50"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Dynamic theme switcher layout */}
        <div className={cn('flex items-center justify-around bg-[var(--hover-tint)]/65 rounded-card p-1', !isOpen && 'flex-col gap-1.5')}>
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'p-1.5 rounded-btn cursor-pointer outline-none transition-all duration-150',
              theme === 'light' ? 'bg-[var(--surface)] text-text-main shadow-xs font-bold border border-[var(--border)]/10' : 'text-text-mute hover:text-text-main'
            )}
            title="Light theme"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'p-1.5 rounded-btn cursor-pointer outline-none transition-all duration-150',
              theme === 'dark' ? 'bg-[var(--surface)] text-primary shadow-xs font-bold border border-[var(--border)]/10' : 'text-text-mute hover:text-text-main'
            )}
            title="Dark theme"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              'p-1.5 rounded-btn cursor-pointer outline-none transition-all duration-150',
              theme === 'system' ? 'bg-[var(--surface)] text-text-sub shadow-xs font-bold border border-[var(--border)]/10' : 'text-text-mute hover:text-text-main'
            )}
            title="System theme"
          >
            <Laptop className="w-4 h-4" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-xs font-bold text-danger hover:bg-danger/5 rounded-btn transition-all duration-150 outline-none w-full cursor-pointer border border-transparent hover:border-danger/10',
            !isOpen && 'justify-center px-0'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isOpen && <span className="tracking-tight">Sign Out Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
