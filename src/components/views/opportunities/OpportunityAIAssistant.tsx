/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { EnrichedOpportunity } from './types';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card, CardContent } from '../../ui/Card';
import {
  Sparkles,
  Send,
  Loader2,
  FileCheck,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface OpportunityAIAssistantProps {
  opportunity: EnrichedOpportunity;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const OpportunityAIAssistant: React.FC<OpportunityAIAssistantProps> = ({ opportunity }) => {
  const { user } = useAuth();
  const { resumeAnalysis } = useCareer();

  // Assistant Tabs
  const [activeTab, setActiveTab] = useState<'chat' | 'optimize' | 'checklist'>('chat');

  // Chat States
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resume Optimizer States
  const [bulletInput, setBulletInput] = useState<string>('');
  const [optimizedBullet, setOptimizedBullet] = useState<string>('');
  const [optimizingBullet, setOptimizingBullet] = useState<boolean>(false);
  const [bulletError, setBulletError] = useState<string>('');

  // Checklist States
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([]);

  // Initialize Chat Messages & Checklist
  useEffect(() => {
    // Initial friendly greeting
    setMessages([
      {
        id: 'msg-init-1',
        sender: 'assistant',
        text: `Greetings! I am **PathPilot AI**, your elite career mentor coach. I have carefully digested the requirements for **"${opportunity.title}"** at **${opportunity.organization}**. Let's prepare an absolute winning strategy.

How can I support you today? Use one of the quick actions below, or write your own custom question!`
      }
    ]);

    // Initial custom application checklist
    const initialChecklist = [
      { id: 'chk-1', text: `Integrate core target keywords (${opportunity.requiredSkills.slice(0, 3).join(', ')}) into your resume details.`, done: false },
      { id: 'chk-2', text: `Analyze the organization's rating of ${opportunity.orgRating || '4.5'}/5 and verify their stack alignment.`, done: false },
      { id: 'chk-3', text: `Formulate a precise professional cover letter emphasizing matching experiences.`, done: false },
      { id: 'chk-4', text: `Draft interview answers for core responsibilities: "${opportunity.responsibilities[0]}".`, done: false }
    ];
    setChecklist(initialChecklist);
  }, [opportunity]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Send Chat message
  const handleSendChat = async (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim() || loadingChat) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setChatInput('');
    setLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: `For the opportunity "${opportunity.title}" at "${opportunity.organization}", analyze the following: ${rawText.trim()}`,
          history: messages.map(msg => ({ sender: msg.sender, text: msg.text })),
          targetRole: opportunity.title
        })
      });

      if (!response.ok) {
        throw new Error('Server connection issue. Unable to fetch AI recommendation.');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I analyzed your query, but encountered a structured parsing boundary.'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **System Integration Error**: ${err.message || 'The cloud server did not respond.'} Try again shortly.`
        }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Quick Prompt Blueprints
  const runQuickPrompt = (type: 'explain' | 'interview' | 'chances' | 'plan') => {
    let promptText = '';
    if (type === 'explain') {
      promptText = `Provide a bulleted, highly clear summary of the core responsibilities and what skills are absolute dealbreakers for this "${opportunity.title}" role.`;
    } else if (type === 'interview') {
      promptText = `Generate 3 high-probability technical interview questions for this position at "${opportunity.organization}" and provide a quick structural answer hint for each based on STAR guidelines.`;
    } else if (type === 'chances') {
      promptText = `Estimate my selection probability. My resume matches are currently evaluated on the dashboard. Let's list positive attributes and candidate risk factors I should solve.`;
    } else if (type === 'plan') {
      promptText = `Formulate a robust 3-week study plan to master missing key requirements for this role, specifically targeting: ${opportunity.requiredSkills.join(', ')}.`;
    }
    handleSendChat(promptText);
  };

  // Optimize Resume Bullet using existing backend `/api/resume/improve` endpoint
  const handleOptimizeBullet = async () => {
    if (!bulletInput.trim() || optimizingBullet) return;
    setOptimizingBullet(true);
    setBulletError('');
    setOptimizedBullet('');

    try {
      const response = await fetch('/api/resume/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: bulletInput.trim(),
          type: 'bullet',
          targetRole: `${opportunity.title} at ${opportunity.organization} utilizing skills: ${opportunity.requiredSkills.slice(0, 4).join(', ')}`
        })
      });

      if (!response.ok) {
        throw new Error('Cloud optimizer is currently busy. Try again shortly.');
      }

      const data = await response.json();
      setOptimizedBullet(data.text || '');
    } catch (err: any) {
      setBulletError(err.message || 'System error compiling bullet point optimization.');
    } finally {
      setOptimizingBullet(false);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <Card className="h-full bg-slate-900/30 border-slate-800/80 flex flex-col overflow-hidden">
      
      {/* CO-PILOT TOP HEADER */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              PathPilot AI Advisor
            </h4>
            <span className="text-[10px] text-slate-400 block font-medium">Real-Time Application Co-Pilot</span>
          </div>
        </div>

        <Badge variant="primary" className="text-[10px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5">
          Gemini 3.5 Active
        </Badge>
      </div>

      {/* THREE TABS CONTROLLER */}
      <div className="flex border-b border-slate-800 select-none shrink-0">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'chat' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Chat Coach
        </button>
        <button
          onClick={() => setActiveTab('optimize')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'optimize' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Resume Optimizer
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'checklist' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Checklist
        </button>
      </div>

      {/* TAB INTERFACES PANEL */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-[300px]">
        
        {/* 1. CHAT TABS SECTION */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full gap-4 flex-1">
            
            {/* MESSAGES CONSOLE */}
            <div className="flex-1 space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-850/80 text-slate-300 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pl-1">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Synthesizing corporate guidelines...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK BLUEPRINT TRIGGERS */}
            <div className="space-y-1 shrink-0">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Quick Blueprint Pipelines</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => runQuickPrompt('explain')}
                  disabled={loadingChat}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-left text-[10px] text-slate-300 font-medium hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  ❓ Explain Requirements
                </button>
                <button
                  onClick={() => runQuickPrompt('interview')}
                  disabled={loadingChat}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-left text-[10px] text-slate-300 font-medium hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  🎯 Prep Prep Interview
                </button>
                <button
                  onClick={() => runQuickPrompt('chances')}
                  disabled={loadingChat}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-left text-[10px] text-slate-300 font-medium hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  📊 Estimate Selection Chances
                </button>
                <button
                  onClick={() => runQuickPrompt('plan')}
                  disabled={loadingChat}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-left text-[10px] text-slate-300 font-medium hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  📅 Create 3-Week Study Plan
                </button>
              </div>
            </div>

            {/* SEND MESSAGE CHAT BAR */}
            <div className="relative mt-auto shrink-0 pt-2 border-t border-slate-800/40">
              <input
                type="text"
                placeholder="Ask PathPilot AI advisor anything..."
                className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                disabled={loadingChat}
              />
              <button
                onClick={() => handleSendChat()}
                disabled={loadingChat || !chatInput.trim()}
                className="absolute right-2.5 top-[15px] p-1.5 rounded-md text-indigo-400 hover:text-indigo-200 hover:bg-slate-900 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. RESUME OPTIMIZER TABS SECTION */}
        {activeTab === 'optimize' && (
          <div className="space-y-4 flex flex-col h-full flex-1">
            <div className="space-y-1.5 shrink-0">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Resume accomplishment bullet optimizer
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">
                Paste an existing bullet point from your resume (e.g. "Worked on APIs"). PathPilot AI will leverage the STAR methodology and integrate this opportunity's keywords (such as <strong className="text-white">{opportunity.requiredSkills.slice(0, 3).join(', ')}</strong>).
              </p>
            </div>

            <div className="space-y-2 flex-1 flex flex-col min-h-[180px]">
              <textarea
                placeholder="Example: Managed the backend API server and fixed bugs in Javascript."
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 flex-1 min-h-[80px]"
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                disabled={optimizingBullet}
              />

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleOptimizeBullet}
                disabled={optimizingBullet || !bulletInput.trim()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                {optimizingBullet ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling STAR Bullet...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Optimize Accomplishment
                  </>
                )}
              </Button>
            </div>

            {/* ERROR DISPLAY */}
            {bulletError && (
              <div className="p-3 rounded-lg border border-rose-900/30 bg-rose-500/5 flex items-start gap-2.5 shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-[10px] text-rose-300 leading-normal">{bulletError}</span>
              </div>
            )}

            {/* OPTIMIZED RESULT BLOCK */}
            {optimizedBullet && (
              <div className="p-3.5 rounded-xl border border-emerald-900/25 bg-emerald-500/5 space-y-2 shrink-0 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> STAR Compliant Bullet Compiled
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(optimizedBullet);
                    }}
                    className="text-[9px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Copy Bullet
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic select-all">
                  "{optimizedBullet}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. CHECKLIST TABS SECTION */}
        {activeTab === 'checklist' && (
          <div className="space-y-4 flex flex-col h-full flex-1">
            <div className="space-y-1 shrink-0">
              <span className="text-xs font-black text-slate-200 block">Application Preparation Milestones</span>
              <p className="text-[10px] text-slate-400">Complete these tasks before pushing your finalized credentials.</p>
            </div>

            <div className="flex-1 space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                    item.done
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-slate-500'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-750 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                  </div>
                  <span className={`text-xs leading-normal select-none ${item.done ? 'line-through text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};
