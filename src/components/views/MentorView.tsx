/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  MessageSquare,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Target,
  Compass,
  Sliders,
  Plus,
  Brain
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { AiCoachService } from '../../services/aiCoachService';
import { AiConversation } from '../../types';

import { AiCoachHome } from './coach/AiCoachHome';
import { ChatHistoryView } from './coach/ChatHistoryView';
import { CareerInsightsView } from './coach/CareerInsightsView';
import { AiRecommendationsView } from './coach/AiRecommendationsView';
import { LearningRecommendationsView } from './coach/LearningRecommendationsView';
import { GoalPlanningView } from './coach/GoalPlanningView';
import { CareerStrategyView } from './coach/CareerStrategyView';
import { ConversationSettingsView } from './coach/ConversationSettingsView';

type CoachSubTab = 
  | 'chat'
  | 'history'
  | 'insights'
  | 'recommendations'
  | 'learning'
  | 'goals'
  | 'strategy'
  | 'settings';

export const MentorView: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<CoachSubTab>('chat');
  const [currentConversation, setCurrentConversation] = useState<AiConversation | null>(null);

  const handleSelectConversation = (conv: AiConversation) => {
    setCurrentConversation(conv);
    setActiveSubTab('chat');
  };

  const handleNewConversation = async () => {
    if (!user) return;
    const newConv = await AiCoachService.createConversation(
      user.uid,
      `Coaching Session (${new Date().toLocaleDateString()})`,
      'General',
      'general'
    );
    setCurrentConversation(newConv);
    setActiveSubTab('chat');
  };

  const navigationTabs = [
    { id: 'chat' as CoachSubTab, label: 'Chat Workspace', icon: Bot },
    { id: 'history' as CoachSubTab, label: 'Chat Vault', icon: MessageSquare },
    { id: 'insights' as CoachSubTab, label: 'Career Insights', icon: TrendingUp },
    { id: 'recommendations' as CoachSubTab, label: 'Recommendations', icon: Sparkles },
    { id: 'learning' as CoachSubTab, label: 'Learning Paths', icon: GraduationCap },
    { id: 'goals' as CoachSubTab, label: 'Goal Planning', icon: Target },
    { id: 'strategy' as CoachSubTab, label: 'Career Strategy', icon: Compass },
    { id: 'settings' as CoachSubTab, label: 'Memory & Settings', icon: Sliders }
  ];

  return (
    <div id="ai-coach-main-module" className="min-h-screen bg-[var(--color-bg-primary)] p-4 sm:p-6 space-y-6">
      {/* Platform Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">
              AI Career Coach & Intelligence Platform
            </h1>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Powered by Google Gemini 3.6 & Persistent Supabase Context Memory
          </p>
        </div>

        <button
          onClick={handleNewConversation}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat Session</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div id="coach-navigation-tabs" className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border)]">
        {navigationTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-View Render Area */}
      <div id="coach-view-content" className="transition-all">
        {activeSubTab === 'chat' && (
          <AiCoachHome
            currentConversation={currentConversation}
            onSelectConversation={setCurrentConversation}
            onNewConversation={handleNewConversation}
            onOpenSettings={() => setActiveSubTab('settings')}
          />
        )}

        {activeSubTab === 'history' && (
          <ChatHistoryView
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        )}

        {activeSubTab === 'insights' && <CareerInsightsView />}

        {activeSubTab === 'recommendations' && <AiRecommendationsView />}

        {activeSubTab === 'learning' && <LearningRecommendationsView />}

        {activeSubTab === 'goals' && <GoalPlanningView />}

        {activeSubTab === 'strategy' && <CareerStrategyView />}

        {activeSubTab === 'settings' && <ConversationSettingsView />}
      </div>
    </div>
  );
};

export default MentorView;
