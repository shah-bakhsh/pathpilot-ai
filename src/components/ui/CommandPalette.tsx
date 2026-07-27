/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Map, LayoutDashboard, Layers, Bot, Video, Briefcase, Settings, Sparkles, Terminal, BookOpen, Key, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onProfileModalOpen: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  category: 'Pages' | 'Actions' | 'Help & Context';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onProfileModalOpen,
}) => {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, setTheme } = useTheme();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const commands: CommandItem[] = [
    // Pages Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard Overview',
      subtitle: 'Primary pipeline metrics, diagnostics, & snapshots',
      category: 'Pages',
      icon: <LayoutDashboard className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('dashboard');
        onClose();
      },
    },
    {
      id: 'nav-productivity',
      label: 'Go to Productivity OS',
      subtitle: 'Focus Pomodoro timers, habit tracker, & daily momentum logs',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('productivity');
        onClose();
      },
    },
    {
      id: 'nav-tasks',
      label: 'Go to Task Manager',
      subtitle: 'Kanban boards, priority matrices, & task sprint management',
      category: 'Pages',
      icon: <Layers className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('tasks');
        onClose();
      },
    },
    {
      id: 'nav-notifications',
      label: 'Go to Notification Hub',
      subtitle: 'Real-time activity logs, system alerts, & milestone updates',
      category: 'Pages',
      icon: <Terminal className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('notifications');
        onClose();
      },
    },
    {
      id: 'nav-ecosystem',
      label: 'Go to Global AI Career Ecosystem',
      subtitle: 'Community, Mentors, Recruiters, AI Twin, Universities, & Mobile Sync',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('ecosystem');
        onClose();
      },
    },
    {
      id: 'nav-agents',
      label: 'Go to Autonomous AI Agent Ecosystem',
      subtitle: '20 Specialized AI Agents, Master Orchestrator, & Shared Memory',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('agents');
        onClose();
      },
    },
    {
      id: 'nav-notes',
      label: 'Go to Notion Notes & Docs',
      subtitle: 'Rich text Markdown editor, career documents, & knowledge base',
      category: 'Pages',
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('notes');
        onClose();
      },
    },
    {
      id: 'nav-admin',
      label: 'Go to Enterprise Admin Console',
      subtitle: 'Multi-tenant settings, RBAC roles, worker queues, & API keys',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('admin');
        onClose();
      },
    },
    {
      id: 'nav-roadmap',
      label: 'Go to Career Roadmap',
      subtitle: 'Personalized career milestones & trajectory track',
      category: 'Pages',
      icon: <Map className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('roadmap');
        onClose();
      },
    },
    {
      id: 'nav-execution',
      label: 'Go to Execution Workspace',
      subtitle: 'Sprint tasks, project manager, notes, & file vault',
      category: 'Pages',
      icon: <Layers className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('execution');
        onClose();
      },
    },
    {
      id: 'nav-resume',
      label: 'Go to Resume Studio & ATS Analyzer',
      subtitle: 'Quantified resume builder & keyword compliance audit',
      category: 'Pages',
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('resume');
        onClose();
      },
    },
    {
      id: 'nav-documents',
      label: 'Go to Documents Vault',
      subtitle: 'Encrypted document repository for certified records',
      category: 'Pages',
      icon: <Briefcase className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('documents');
        onClose();
      },
    },
    {
      id: 'nav-mentor',
      label: 'Go to AI Coach Pane',
      subtitle: 'Interactive AI coaching and prompt recommendations',
      category: 'Pages',
      icon: <Bot className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('mentor');
        onClose();
      },
    },
    {
      id: 'nav-interview',
      label: 'Go to Interview Simulator',
      subtitle: 'Run interactive simulated AI technical & behavioral interviews',
      category: 'Pages',
      icon: <Video className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('interview');
        onClose();
      },
    },
    {
      id: 'nav-opportunities',
      label: 'Go to Opportunities Grid',
      subtitle: 'Custom job coordinates matching your skill indexes',
      category: 'Pages',
      icon: <Briefcase className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('opportunities');
        onClose();
      },
    },
    {
      id: 'nav-applications',
      label: 'Go to Job Applications Pipeline',
      subtitle: 'Track active job applications, offers, & interviews',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('applications');
        onClose();
      },
    },
    {
      id: 'nav-learning',
      label: 'Go to Learning Paths & Skills',
      subtitle: 'Master required technical competencies & course tracks',
      category: 'Pages',
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('learning');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      label: 'Go to Career Analytics',
      subtitle: 'Readiness radar, skill gaps, & market velocity metrics',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('analytics');
        onClose();
      },
    },
    {
      id: 'nav-achievements',
      label: 'Go to Achievements & XP Progress',
      subtitle: 'Level progression, daily streaks, & system badges',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('achievements');
        onClose();
      },
    },
    {
      id: 'nav-calendar',
      label: 'Go to Calendar & Deadlines',
      subtitle: 'Event schedule, deadlines, & interview dates',
      category: 'Pages',
      icon: <Terminal className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('calendar');
        onClose();
      },
    },
    {
      id: 'nav-profile',
      label: 'Go to User Profile',
      subtitle: 'Personal parameters & trajectory career targets',
      category: 'Pages',
      icon: <Settings className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('profile');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      label: 'Go to System Settings',
      subtitle: 'Configure accounts, API tokens, & platform preferences',
      category: 'Pages',
      icon: <Settings className="w-4 h-4 text-primary" />,
      action: () => {
        setActiveTab('settings');
        onClose();
      },
    },
    // Dynamic Actions
    {
      id: 'action-profile',
      label: 'Re-calibrate Trajectory Coordinates',
      subtitle: 'Update your targeting career and system focus',
      category: 'Actions',
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      action: () => {
        onProfileModalOpen();
        onClose();
      },
    },
    {
      id: 'action-theme',
      label: `Switch Theme to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle global interface appearance spectrum',
      category: 'Actions',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-indigo-500" />,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    // Context & Help
    {
      id: 'help-documentation',
      label: 'Open PathPilot v2.0 Blueprint',
      subtitle: 'View detailed structural alignment and guides',
      category: 'Help & Context',
      icon: <BookOpen className="w-4 h-4 text-text-mute" />,
      action: () => {
        window.open('https://ai.google.dev', '_blank');
        onClose();
      },
    },
    {
      id: 'help-shortcuts',
      label: 'Keyboard Command Shortcuts',
      subtitle: 'View global platform hotkeys for high-speed operation',
      category: 'Help & Context',
      icon: <Terminal className="w-4 h-4 text-text-mute" />,
      action: () => {
        alert('Global Hotkeys:\n• ⌘K or Ctrl+K: Toggle Command Palette\n• Escape: Close Menus/Modals\n• Space: Play/Pause/Acknowledge\n• ⌘/ : Open Quick Help');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase()) ||
    (cmd.subtitle && cmd.subtitle.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, onClose]);

  // Scroll active element into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  // Group commands by category
  const categories = Array.from(new Set(filteredCommands.map((cmd) => cmd.category)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-modal shadow-floating overflow-hidden flex flex-col animate-modal max-h-[70vh]">
        {/* Search header */}
        <div className="flex items-center gap-3 px-4.5 py-3.5 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
          <Search className="w-5 h-5 text-text-mute shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-text-main text-sm font-medium outline-none placeholder:text-text-mute/55"
          />
          <span className="text-[10px] bg-[var(--surface-secondary)] border border-[var(--border)] text-text-mute font-bold px-2 py-0.5 rounded-md shrink-0">
            ESC
          </span>
        </div>

        {/* Command list content */}
        <div className="flex-1 overflow-y-auto p-2.5 divide-y divide-[var(--border)]/30 scrollbar-thin">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-xl">🔍</span>
              <p className="text-xs text-text-mute font-semibold">No results matching coordinates found</p>
            </div>
          ) : (
            <div ref={listRef} className="flex flex-col gap-1">
              {categories.map((cat) => {
                const catCommands = filteredCommands.filter((cmd) => cmd.category === cat);
                return (
                  <div key={cat} className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] text-text-mute font-bold uppercase tracking-widest px-3 py-2">
                      {cat}
                    </span>
                    {catCommands.map((cmd) => {
                      const absoluteIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                      const isSelected = absoluteIndex === activeIndex;

                      return (
                        <div
                          key={cmd.id}
                          onClick={() => cmd.action()}
                          className={cn(
                            'px-3.5 py-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer select-none transition-all duration-150',
                            isSelected
                              ? 'bg-primary text-black font-semibold'
                              : 'hover:bg-[var(--hover-tint)] text-text-main'
                          )}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={cn(
                              'p-1.5 rounded-md shrink-0',
                              isSelected ? 'bg-black/10 text-black' : 'bg-[var(--surface-secondary)] text-text-sub'
                            )}>
                              {cmd.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold truncate leading-tight">
                                {cmd.label}
                              </span>
                              {cmd.subtitle && (
                                <span className={cn(
                                  'text-[10px] truncate mt-0.5 leading-none',
                                  isSelected ? 'text-black/70 font-medium' : 'text-text-mute'
                                )}>
                                  {cmd.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] bg-black/15 text-black font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                              Enter
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="bg-[var(--surface-secondary)]/50 border-t border-[var(--border)] px-4.5 py-2.5 flex items-center justify-between text-[10px] text-text-mute shrink-0">
          <div className="flex items-center gap-3.5 font-medium">
            <span className="flex items-center gap-1">
              <kbd className="bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[9px] shadow-2xs font-sans">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[9px] shadow-2xs font-sans">↵</kbd>
              Select
            </span>
          </div>
          <span className="font-bold">PathPilot Platform Search</span>
        </div>
      </div>
    </div>
  );
};
