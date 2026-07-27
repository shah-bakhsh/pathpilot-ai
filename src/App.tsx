/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CareerProvider } from './contexts/CareerContext';
import { ToastProvider } from './components/ui/ToastContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Spinner } from './components/ui/Spinner';
import { OrganizationProvider } from './contexts/OrganizationContext';

// Code-Split Page Views via React.lazy for Optimal Performance & Minimal Initial Bundle Size
const DashboardView = lazy(() => import('./components/views/DashboardView').then(m => ({ default: m.DashboardView || (m as any).default })));
const RoadmapView = lazy(() => import('./components/views/RoadmapView').then(m => ({ default: m.RoadmapView || (m as any).default })));
const ExecutionView = lazy(() => import('./components/views/ExecutionView').then(m => ({ default: m.ExecutionView || (m as any).default })));
const ResumeView = lazy(() => import('./components/views/ResumeView').then(m => ({ default: m.ResumeView || (m as any).default })));
const DocumentsView = lazy(() => import('./components/views/DocumentsView').then(m => ({ default: m.DocumentsView || (m as any).default })));
const ApplicationsView = lazy(() => import('./components/views/ApplicationsView').then(m => ({ default: m.ApplicationsView || (m as any).default })));
const LearningView = lazy(() => import('./components/views/LearningView').then(m => ({ default: m.LearningView || (m as any).default })));
const AnalyticsView = lazy(() => import('./components/views/AnalyticsView').then(m => ({ default: m.AnalyticsView || (m as any).default })));
const AchievementsView = lazy(() => import('./components/views/AchievementsView').then(m => ({ default: m.AchievementsView || (m as any).default })));
const CalendarView = lazy(() => import('./components/views/CalendarView').then(m => ({ default: m.CalendarView || (m as any).default })));
const MentorView = lazy(() => import('./components/views/MentorView').then(m => ({ default: m.MentorView || (m as any).default })));
const InterviewView = lazy(() => import('./components/views/InterviewView').then(m => ({ default: m.InterviewView || (m as any).default })));
const OpportunitiesView = lazy(() => import('./components/views/OpportunitiesView').then(m => ({ default: m.OpportunitiesView || (m as any).default })));
const ProfileView = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView || (m as any).default })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView || (m as any).default })));
const LandingPageView = lazy(() => import('./components/views/LandingPageView').then(m => ({ default: m.LandingPageView || (m as any).default })));
const OnboardingView = lazy(() => import('./components/views/OnboardingView').then(m => ({ default: m.OnboardingView || (m as any).default })));

// Productivity & Collaboration Hub Views
const ProductivityDashboardView = lazy(() => import('./components/views/ProductivityDashboardView').then(m => ({ default: m.ProductivityDashboardView || (m as any).default })));
const TaskManagerView = lazy(() => import('./components/views/TaskManagerView').then(m => ({ default: m.TaskManagerView || (m as any).default })));
const NotificationCenterView = lazy(() => import('./components/views/NotificationCenterView').then(m => ({ default: m.NotificationCenterView || (m as any).default })));
const NotesWorkspaceView = lazy(() => import('./components/views/NotesWorkspaceView').then(m => ({ default: m.NotesWorkspaceView || (m as any).default })));

// Admin & Enterprise Ecosystem Views
const AdminPlatformView = lazy(() => import('./components/views/AdminPlatformView').then(m => ({ default: m.AdminPlatformView || (m as any).default })));
const AgentEcosystemView = lazy(() => import('./components/views/AgentEcosystemView').then(m => ({ default: m.AgentEcosystemView || (m as any).default })));
const EcosystemGlobalView = lazy(() => import('./components/views/EcosystemGlobalView').then(m => ({ default: m.EcosystemGlobalView || (m as any).default })));

import { ErrorBoundary } from './components/ui/ErrorBoundary';

const PageFallback = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center bg-[var(--background)]">
    <Spinner size="lg" className="text-primary" />
  </div>
);

const VALID_ROUTES = new Set([
  'dashboard', 'productivity', 'tasks', 'notifications', 'notes', 'roadmap', 'execution', 'resume', 'documents',
  'applications', 'learning', 'analytics', 'achievements',
  'calendar', 'mentor', 'interview', 'opportunities', 'profile', 'settings', 'admin', 'agents', 'ecosystem'
]);

function MainAppContent() {
  const { user, loading } = useAuth();

  // Helper to read current tab from URL hash (or default to 'dashboard')
  const getTabFromUrl = useCallback(() => {
    const hash = window.location.hash.replace('#', '').trim();
    return VALID_ROUTES.has(hash) ? hash : 'dashboard';
  }, []);

  const [activeTab, setActiveTabState] = useState<string>(getTabFromUrl);

  // Navigate function that updates state + URL hash + scrolls to top
  const handleNavigate = useCallback((newTab: string) => {
    const tabToSet = VALID_ROUTES.has(newTab) ? newTab : 'dashboard';
    setActiveTabState(tabToSet);
    if (window.location.hash !== `#${tabToSet}`) {
      window.location.hash = tabToSet;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser Back/Forward (hashchange) and custom change-tab events
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = getTabFromUrl();
      setActiveTabState(currentHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCustomTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleNavigate(customEvent.detail);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('change-tab', handleCustomTabChange);

    // Initial check to ensure URL hash reflects current tab
    if (!window.location.hash || !VALID_ROUTES.has(window.location.hash.replace('#', ''))) {
      window.location.hash = activeTab;
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('change-tab', handleCustomTabChange);
    };
  }, [getTabFromUrl, handleNavigate, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--background)]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<PageFallback />}>
        <LandingPageView />
      </Suspense>
    );
  }

  // Force onboarding completion if not done
  if (!user.onboardingCompleted) {
    return (
      <Suspense fallback={<PageFallback />}>
        <OnboardingView />
      </Suspense>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={handleNavigate}>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'productivity' && <ProductivityDashboardView />}
          {activeTab === 'tasks' && <TaskManagerView />}
          {activeTab === 'notifications' && <NotificationCenterView />}
          {activeTab === 'notes' && <NotesWorkspaceView />}
          {activeTab === 'roadmap' && <RoadmapView />}
          {activeTab === 'execution' && <ExecutionView />}
          {activeTab === 'resume' && <ResumeView />}
          {activeTab === 'documents' && <DocumentsView />}
          {activeTab === 'applications' && <ApplicationsView />}
          {activeTab === 'learning' && <LearningView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'achievements' && <AchievementsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'mentor' && <MentorView />}
          {activeTab === 'interview' && <InterviewView />}
          {activeTab === 'opportunities' && <OpportunitiesView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'admin' && <AdminPlatformView />}
          {activeTab === 'agents' && <AgentEcosystemView />}
          {activeTab === 'ecosystem' && <EcosystemGlobalView />}
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CareerProvider>
          <OrganizationProvider>
            <ToastProvider>
              <MainAppContent />
            </ToastProvider>
          </OrganizationProvider>
        </CareerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
