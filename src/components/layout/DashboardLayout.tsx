/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { PathPilotLogo } from '../ui/PathPilotLogo';
import { Compass, Flame, Award, X, Target, User, Search, Pin, ShieldCheck, Mail, HelpCircle, ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { CommandPalette } from '../ui/CommandPalette';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  const { user, updateTargetCareer } = useAuth();
  const { notifications } = useCareer();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [newTargetCareer, setNewTargetCareer] = useState<string>(user?.currentTargetGoal || '');

  const mainRef = useRef<HTMLElement>(null);

  const handleUpdateCareerGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTargetCareer.trim()) {
      updateTargetCareer(newTargetCareer.trim());
      setIsProfileModalOpen(false);
    }
  };

  // Scroll to top on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  // Global Keyboard listener for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)]">
      
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onProfileModalOpen={() => {
          setNewTargetCareer(user?.currentTargetGoal || '');
          setIsProfileModalOpen(true);
        }}
      />

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer (Sleek slide-out navigation panel) */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)] z-50 md:hidden flex flex-col transition-transform duration-300 transform',
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] h-16 shrink-0">
          <div className="flex items-center gap-2.5">
            <PathPilotLogo size={32} />
            <span className="font-display font-black text-base text-text-main tracking-tight">
              PathPilot AI
            </span>
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[var(--hover-tint)] text-text-sub hover:text-text-main flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar on mobile drawer */}
        <div className="p-3 border-b border-[var(--border)]/60">
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              setIsCommandPaletteOpen(true);
            }}
            className="w-full flex items-center justify-between bg-[var(--hover-tint)]/60 text-text-sub text-xs font-semibold rounded-input border border-[var(--border)]/40 px-3 py-2 h-9 outline-none"
          >
            <span className="flex items-center gap-2 text-text-mute">
              <Search className="w-3.5 h-3.5" /> Tap to search commands...
            </span>
          </button>
        </div>

        {/* Mobile Navigation List */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard Overview' },
            { id: 'productivity', label: 'Productivity OS' },
            { id: 'tasks', label: 'Task Manager' },
            { id: 'notifications', label: 'Notification Hub' },
            { id: 'notes', label: 'Notion Notes & Docs' },
            { id: 'roadmap', label: 'Career Roadmap' },
            { id: 'execution', label: 'Execution Workspace' },
            { id: 'resume', label: 'Resume & ATS Studio' },
            { id: 'documents', label: 'Documents Vault' },
            { id: 'ecosystem', label: 'Global AI Ecosystem' },
            { id: 'agents', label: 'AI Agent Ecosystem' },
            { id: 'mentor', label: 'PathPilot AI Coach' },
            { id: 'interview', label: 'Interview Simulator' },
            { id: 'opportunities', label: 'Opportunities Grid' },
            { id: 'applications', label: 'Applications Pipeline' },
            { id: 'learning', label: 'Learning Paths' },
            { id: 'analytics', label: 'Career Analytics' },
            { id: 'achievements', label: 'Achievements & XP' },
            { id: 'calendar', label: 'Calendar & Deadlines' },
            { id: 'profile', label: 'User Profile' },
            { id: 'settings', label: 'System Settings' },
            { id: 'admin', label: 'Enterprise Admin Console' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileDrawerOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-3 rounded-btn text-xs font-bold cursor-pointer transition-colors outline-none',
                activeTab === item.id
                  ? 'bg-primary text-black font-extrabold shadow-sm'
                  : 'text-text-sub hover:bg-[var(--hover-tint)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Level details in mobile drawer footer */}
        {user && (
          <div className="p-4 border border-[var(--border)] bg-[var(--hover-tint)]/30 flex flex-col gap-2.5 m-3.5 rounded-card">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-text-sub">
              <Flame className="w-4 h-4 text-accent fill-accent" />
              <span>{user.activeStreak} Day Pipeline Streak</span>
            </div>
            <div className="text-[10px] text-text-mute font-bold">
              Matching Index: {user.experiencePoints} Cumulative XP
            </div>
          </div>
        )}
      </div>

      {/* Main Container Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Dynamic Header */}
        <Header
          activeTab={activeTab}
          onMenuToggle={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          onProfileModalOpen={() => {
            setNewTargetCareer(user?.currentTargetGoal || '');
            setIsProfileModalOpen(true);
          }}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
        />

        {/* Scrollable View Area */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto bg-[var(--background)] relative flex flex-col justify-between scrollbar-thin"
        >
          {/* Main workspace layout content */}
          <div className="p-5 md:p-8 flex-1">
            <div className="max-w-7xl mx-auto w-full h-full animate-fade-up">
              {children}
            </div>
          </div>

          {/* Premium Minimal Footer */}
          <footer className="border-t border-[var(--border)]/60 bg-[var(--surface-secondary)]/30 py-5 px-6 md:px-8 mt-auto select-none">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-text-mute">
              
              <div className="flex items-center gap-2">
                <span className="text-text-main font-black">PathPilot Platform</span>
                <span className="text-text-mute/40">|</span>
                <span>System Console v2.4.0</span>
              </div>

              {/* Action buttons & feedback */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <a
                  href="https://ai.google.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Security & Privacy Terms
                </a>
                <button
                  onClick={() => alert('Connect with customer coordinates at support@pathpilot.ai')}
                  className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Feedback Coordinates
                </button>
                <button
                  onClick={() => {
                    if (mainRef.current) {
                      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  title="Scroll to system top"
                >
                  <ArrowUp className="w-3.5 h-3.5" /> Back to Top
                </button>
              </div>

            </div>
          </footer>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onProfileModalOpen={() => {
          setNewTargetCareer(user?.currentTargetGoal || '');
          setIsProfileModalOpen(true);
        }}
      />

      {/* Profile Trajectory modal */}
      {user && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Recalibrate Career Target"
          size="md"
        >
          <form onSubmit={handleUpdateCareerGoal} className="flex flex-col gap-5">
            <div className="flex items-center gap-4 p-4 rounded-card bg-[var(--surface-secondary)] border border-[var(--border)]">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-text-main font-extrabold flex items-center justify-center text-sm uppercase">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-black text-text-main leading-none">{user.name}</h4>
                <p className="text-[10.5px] text-text-mute font-bold mt-1">{user.email}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-success font-bold mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>Interactive Agent Session Verified</span>
                </div>
              </div>
            </div>

            <Input
              label="Target Career Pipeline Goal"
              value={newTargetCareer}
              onChange={(e) => setNewTargetCareer(e.target.value)}
              placeholder="e.g. Software Engineer - Backend"
              helperText="The career milestones, interview logs, resumes, and AI Coach instruction blocks adapt instantly to target this title."
              required
              leftIcon={<Target className="w-4 h-4 text-text-mute" />}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]/70">
              <Button variant="outline" size="sm" onClick={() => setIsProfileModalOpen(false)}>
                Discard Adjustments
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Recalibrate System
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DashboardLayout;
