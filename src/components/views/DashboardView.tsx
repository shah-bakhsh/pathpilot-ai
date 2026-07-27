/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadZone } from '../ui/UploadZone';
import { EmptyState } from '../ui/EmptyState';
import { AlertCircle, ShieldAlert, RefreshCw, FileText, Sparkles } from 'lucide-react';

// Import Section Subcomponents
import { WelcomeHero } from './dashboard/WelcomeHero';
import { QuickStatsGrid } from './dashboard/QuickStatsGrid';
import { TodaysFocusPanel } from './dashboard/TodaysFocusPanel';
import { QuickActionsHub } from './dashboard/QuickActionsHub';
import { RecentActivityFeed } from './dashboard/RecentActivityFeed';
import { CareerProgressOverview } from './dashboard/CareerProgressOverview';
import { SignalsAndNotifications } from './dashboard/SignalsAndNotifications';

export type DashboardDemoState = 'normal' | 'empty' | 'loading' | 'error';

export const DashboardView: React.FC = () => {
  const { user, addXp } = useAuth();
  const {
    resumeAnalysis,
    isAnalyzing,
    uploadResume,
    addNotification,
    clearAllCareerState,
  } = useCareer();

  const [demoState, setDemoState] = useState<DashboardDemoState>('normal');
  const [errorText, setErrorText] = useState<string>('');

  // Handle resume uploading trigger
  const handleResumeUpload = async (text: string) => {
    if (!user) return;
    setErrorText('');

    try {
      await uploadResume(text, user.currentTargetGoal);
      addXp(50);
      addNotification(
        'Resume Diagnostic Finished!',
        `Analyzed against your target goal of ${user.currentTargetGoal}. Alignment score updated!`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Error executing AI analysis. Please verify your connection.');
      addNotification(
        'Service Connection Issue',
        'Using local offline evaluation coordinates for validation.',
        'warning'
      );
    }
  };

  const handleResetAnalysis = () => {
    clearAllCareerState();
    addNotification(
      'Calibration Reset',
      'Career trajectory cleared. Awaiting new resume synchronization payload.',
      'info'
    );
  };

  // 1. SKELETON LOADING STATE
  if (demoState === 'loading') {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-pulse select-none">
        <div className="h-44 rounded-2xl bg-[var(--surface)] border border-[var(--border)]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          ))}
        </div>
        <div className="h-72 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
        <div className="h-56 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
        <div className="h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
      </div>
    );
  }

  // 2. ERROR STATE
  if (demoState === 'error') {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto select-none">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-error/20 bg-error/5 rounded-2xl max-w-2xl mx-auto w-full animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-error/15 text-error flex items-center justify-center mb-5 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-xl text-text-main tracking-tight">
            Trajectory Connection Interrupted
          </h3>
          <p className="text-xs text-text-sub max-w-md leading-relaxed mt-2.5 font-semibold">
            We encountered a security policy restriction or client session sync issue. Please retry or re-attempt handshake.
          </p>
          <div className="p-3 bg-error/10 border border-error/15 text-xs text-error font-mono rounded-md max-w-md mt-4 text-left font-semibold">
            ERROR: 403_SESSION_HANDSHAKE_DENIED
          </div>
          <div className="flex items-center gap-3.5 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDemoState('normal')}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDemoState('normal');
                addNotification('Calibration Restored', 'API session coordinates re-negotiated successfully.', 'success');
              }}
              className="text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-attempt Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. EMPTY STATE (When no resume is uploaded/analyzed yet)
  if (demoState === 'empty' || !resumeAnalysis) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
        
        {/* Welcome Hero for first-time onboarding */}
        <WelcomeHero />

        {/* Beautiful empty state upload section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Upload card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card className="h-full border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-base text-text-main font-black">Trajectory Sync Required</CardTitle>
                    <CardDescription className="text-xs">
                      Upload your professional resume in PDF, TXT, or DOCX layout coordinates to activate your Career Operating System.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <EmptyState
                  icon={<FileText className="w-10 h-10 text-primary" />}
                  title="Awaiting Resume Calibration"
                  description="We need your current credentials to construct your customized Career GPS, missing-skill analytics, and AI scorecards."
                />
                <div className="w-full max-w-md mx-auto mt-6">
                  <UploadZone onUpload={handleResumeUpload} isUploading={isAnalyzing} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick onboarding guide (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-sm font-black text-text-main">What happens after calibration?</CardTitle>
                <CardDescription className="text-xs">Instant AI system updates:</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {[
                  { title: 'Resume ATS Alignment Score', desc: 'Identify critical missing recruiter keywords.' },
                  { title: 'Interactive Career GPS', desc: 'Step-by-step roadmap tailored specifically to your target goal.' },
                  { title: 'AI Mock Interview Simulator', desc: 'Practice role-specific interview questions scored by Gemini.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-text-main">{item.title}</h4>
                      <p className="text-xs text-text-sub mt-0.5 leading-normal font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border border-primary/15">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" /> Dynamic AI Coach Hint
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-sub leading-relaxed font-semibold">
                "Hi explorer! Once you upload your resume, I will analyze your background match score against <strong className="text-text-main">{user?.currentTargetGoal}</strong> and recommend targeted technical milestones."
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 4. PREMIER REDESIGNED FULL HOMEPAGE VIEW
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {errorText && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-error/5 border border-error/15 text-xs font-semibold text-error leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* SECTION 1: Welcome Hero */}
      <WelcomeHero />

      {/* SECTION 2: Quick Stats Grid (8 Interactive Metric Cards) */}
      <QuickStatsGrid />

      {/* SECTION 3: Today's Focus Panel (Tasks, Deadlines, AI Rec, Goal) */}
      <TodaysFocusPanel />

      {/* SECTION 4: Quick Actions Launchpad (Direct Page Navigation) */}
      <QuickActionsHub />

      {/* SECTION 5: Recent Activity Feed */}
      <RecentActivityFeed />

      {/* SECTION 6: Career Progress & Velocity Overview */}
      <CareerProgressOverview />

      {/* SECTION 7: Signals, Notifications & Curated Opportunities */}
      <SignalsAndNotifications />

    </div>
  );
};

export default DashboardView;
