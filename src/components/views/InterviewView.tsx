/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, ShieldCheck, Sparkles, Brain, LayoutDashboard, MessageSquare, Zap, Users, Code2, Network, 
  Briefcase, History, BarChart2, BookOpen, Settings, HelpCircle, Play
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Subcomponents
import { InterviewDashboard } from './interview/InterviewDashboard';
import { InterviewConfigurator } from './interview/InterviewConfigurator';
import { InterviewRoom } from './interview/InterviewRoom';
import { InterviewReport } from './interview/InterviewReport';
import { QuestionBankView } from './interview/QuestionBankView';
import { AnalyticsView } from './interview/AnalyticsView';
import { BehavioralInterviewView } from './interview/BehavioralInterviewView';
import { TechnicalInterviewView } from './interview/TechnicalInterviewView';
import { HRInterviewView } from './interview/HRInterviewView';
import { CodingInterviewView } from './interview/CodingInterviewView';
import { SystemDesignInterviewView } from './interview/SystemDesignInterviewView';
import { CaseStudyInterviewView } from './interview/CaseStudyInterviewView';
import { InterviewHistoryView } from './interview/InterviewHistoryView';
import { InterviewFeedbackHub } from './interview/InterviewFeedbackHub';
import { InterviewSettingsView } from './interview/InterviewSettingsView';

// Core mock data & types
import { InterviewSession, Achievement, InterviewType, CompanyName, DifficultyLevel, QuestionCategory, Question } from './interview/InterviewTypes';
import { InterviewService } from '../../services/interviewService';

type InterviewStep = 
  | 'dashboard' 
  | 'config' 
  | 'room' 
  | 'report' 
  | 'question_bank' 
  | 'analytics'
  | 'behavioral'
  | 'technical'
  | 'hr'
  | 'coding'
  | 'system_design'
  | 'case_study'
  | 'history'
  | 'feedback'
  | 'settings';

export const InterviewView: React.FC = () => {
  const { user, addXp } = useAuth();
  const { addNotification } = useCareer();

  // Primary states
  const [step, setStep] = useState<InterviewStep>('dashboard');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Active states
  const [activeConfig, setActiveConfig] = useState<{
    type: InterviewType;
    company: CompanyName;
    difficulty: DifficultyLevel;
    category: QuestionCategory;
    isVoicePractice: boolean;
    adaptiveDifficulty: boolean;
    quickMode: boolean;
    customQuestionPrompt?: string;
  } | null>(null);

  const [activePrefill, setActivePrefill] = useState<{
    type?: InterviewType;
    company?: CompanyName;
    difficulty?: DifficultyLevel;
    category?: QuestionCategory;
  } | undefined>(undefined);

  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  // --- 1. LOAD PERSISTENT SESSIONS & ACHIEVEMENTS ---
  useEffect(() => {
    const loadData = async () => {
      const fetchedSessions = await InterviewService.getInterviewSessions(user?.id);
      const fetchedAchievements = await InterviewService.getAchievements();
      setSessions(fetchedSessions);
      setAchievements(fetchedAchievements);
    };
    loadData();
  }, [user?.id]);

  const handleSaveSession = async (newSession: InterviewSession) => {
    const updated = [newSession, ...sessions.filter(s => s.id !== newSession.id)];
    setSessions(updated);
    await InterviewService.saveInterviewSession(newSession, user?.id);
  };

  // --- 2. TRANSITIONS & HANDLERS ---
  const handleStartConfig = (prefill?: { type?: any; company?: any; difficulty?: any; category?: any }) => {
    setActivePrefill(prefill);
    setStep('config');
  };

  const handleLaunchQuickPractice = (customPrompt?: string) => {
    const quickConfig = {
      type: 'Behavioral Interview' as InterviewType,
      company: 'Google' as CompanyName,
      difficulty: 'Intermediate' as DifficultyLevel,
      category: 'Behavioral' as QuestionCategory,
      isVoicePractice: false,
      adaptiveDifficulty: true,
      quickMode: true,
      customQuestionPrompt: customPrompt
    };
    setActiveConfig(quickConfig);
    setStep('room');
  };

  const handleLaunchQuestion = (question: Question) => {
    const quickConfig = {
      type: 'Technical Interview' as InterviewType,
      company: (question.companies?.[0] || 'Startups') as CompanyName,
      difficulty: question.difficulty,
      category: question.category,
      isVoicePractice: false,
      adaptiveDifficulty: true,
      quickMode: true,
      customQuestionPrompt: `Focus strictly on evaluating this question: "${question.text}"`
    };
    setActiveConfig(quickConfig);
    setStep('room');
  };

  const handleStartSession = (config: typeof activeConfig) => {
    setActiveConfig(config);
    setStep('room');
  };

  const handleCompleteSession = async (session: InterviewSession) => {
    // 1. Save session
    await handleSaveSession(session);

    // 2. Award XP through Auth context
    addXp(session.xpEarned);

    // 3. Trigger smart career notifications
    addNotification(
      'Interview Score Approved!',
      `You cleared the ${session.company} ${session.type} round. Scored ${session.overallScore}%. Earned +${session.xpEarned} XP!`,
      'success'
    );

    // 4. Update achievements
    const updatedAchievements = achievements.map(ach => {
      if (ach.id === 'ach1' && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      if (ach.id === 'ach2' && session.overallScore >= 90 && session.type === 'System Design' && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return ach;
    });
    setAchievements(updatedAchievements);
    await InterviewService.saveAchievements(updatedAchievements);

    // 5. Open report
    setSelectedSession(session);
    setStep('report');
  };

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'config', label: 'Mock Session', icon: Play },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare },
    { id: 'technical', label: 'Technical', icon: Zap },
    { id: 'coding', label: 'Coding', icon: Code2 },
    { id: 'system_design', label: 'System Design', icon: Network },
    { id: 'case_study', label: 'Case Study', icon: Briefcase },
    { id: 'hr', label: 'HR Round', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'feedback', label: 'Feedback', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-6 w-full py-2 selection:bg-primary/25">
      
      {/* BRANDING HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-xs select-none">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <Video className="w-5.5 h-5.5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-base text-text-main tracking-tight flex items-center gap-1.5 leading-none">
              AI Recruiter Interview Simulator <Sparkles className="w-4 h-4 text-primary" />
            </h2>
            <p className="text-[10px] text-text-mute font-black uppercase mt-1.5 tracking-wider">
              PathPilot AI Career Operating System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="text-[8.5px] uppercase tracking-widest font-black px-2.5 py-1 flex items-center gap-1 bg-primary/10 text-primary border border-primary/15">
            <ShieldCheck className="w-3.5 h-3.5" /> Recruiter Verified
          </Badge>
        </div>
      </div>

      {/* SUB-NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-x-auto no-scrollbar">
        {navigationTabs.map(tab => {
          const IconComp = tab.icon;
          const isActive = step === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStep(tab.id as InterviewStep)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${isActive ? 'bg-primary text-black shadow-xs' : 'text-text-sub hover:text-text-main hover:bg-[var(--surface-secondary)]/20'}`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE SCREEN */}
      <div className="w-full">
        {step === 'dashboard' && (
          <InterviewDashboard
            sessions={sessions}
            achievements={achievements}
            onStartConfig={handleStartConfig}
            onViewSession={(sess) => {
              setSelectedSession(sess);
              setStep('report');
            }}
            onLaunchQuickPractice={() => handleLaunchQuickPractice()}
            onViewQuestionBank={() => setStep('question_bank')}
            onViewAnalytics={() => setStep('analytics')}
          />
        )}

        {step === 'config' && (
          <InterviewConfigurator
            initialPrefill={activePrefill}
            onStartSession={handleStartSession}
            onCancel={() => setStep('dashboard')}
          />
        )}

        {step === 'room' && activeConfig && (
          <InterviewRoom
            config={activeConfig}
            onCompleteSession={handleCompleteSession}
            onCancel={() => setStep('dashboard')}
          />
        )}

        {step === 'report' && selectedSession && (
          <InterviewReport
            session={selectedSession}
            onClose={() => setStep('dashboard')}
          />
        )}

        {step === 'question_bank' && (
          <QuestionBankView
            onBack={() => setStep('dashboard')}
            onLaunchQuickPracticeWithQuestion={handleLaunchQuestion}
          />
        )}

        {step === 'analytics' && (
          <AnalyticsView
            sessions={sessions}
            achievements={achievements}
            onBack={() => setStep('dashboard')}
          />
        )}

        {step === 'behavioral' && (
          <BehavioralInterviewView
            onStartConfig={handleStartConfig}
            onLaunchPractice={handleLaunchQuickPractice}
          />
        )}

        {step === 'technical' && (
          <TechnicalInterviewView
            onStartConfig={handleStartConfig}
            onLaunchQuestion={handleLaunchQuestion}
          />
        )}

        {step === 'hr' && (
          <HRInterviewView
            onStartConfig={handleStartConfig}
          />
        )}

        {step === 'coding' && (
          <CodingInterviewView />
        )}

        {step === 'system_design' && (
          <SystemDesignInterviewView />
        )}

        {step === 'case_study' && (
          <CaseStudyInterviewView
            onStartConfig={handleStartConfig}
          />
        )}

        {step === 'history' && (
          <InterviewHistoryView
            sessions={sessions}
            onViewSession={(sess) => {
              setSelectedSession(sess);
              setStep('report');
            }}
          />
        )}

        {step === 'feedback' && (
          <InterviewFeedbackHub
            sessions={sessions}
            onStartPractice={(cat) => handleStartConfig({ category: cat })}
          />
        )}

        {step === 'settings' && (
          <InterviewSettingsView />
        )}
      </div>

    </div>
  );
};

export default InterviewView;
