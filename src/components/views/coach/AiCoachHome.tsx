/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  Share2,
  Bookmark,
  RefreshCw,
  Zap,
  Shield,
  FileText,
  Briefcase,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  ChevronDown,
  Sliders,
  Database,
  Brain,
  Trash2
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';
import { ResumeService } from '../../../services/resumeService';
import { AiCoachService } from '../../../services/aiCoachService';
import { AiConversation, AiMessage, CoachMode, ResumeRecord } from '../../../types';
import { Badge } from '../../ui/Badge';

const COACH_MODES: { id: CoachMode; title: string; desc: string; icon: any; color: string }[] = [
  {
    id: 'general',
    title: 'PathPilot Guide',
    desc: 'General holistic career mentor',
    icon: Bot,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'executive',
    title: 'Executive Strategist',
    desc: 'High-level career trajectory & positioning',
    icon: Zap,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'interviewer',
    title: 'Technical Interviewer',
    desc: 'System design & behavioral drill simulator',
    icon: Target,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'critic',
    title: 'ATS Resume Critic',
    desc: 'Brutally honest resume & portfolio audit',
    icon: FileText,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'negotiator',
    title: 'Salary Negotiator',
    desc: 'Offer analysis & negotiation tactics',
    icon: Award,
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'mentor',
    title: 'Learning Mentor',
    desc: 'Tech stack expansion & project guidance',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600'
  }
];

const PROMPT_STARTERS = [
  {
    title: 'Resume Bullet Audit',
    prompt: 'Audit my active primary resume bullet points against top mid-to-senior software engineering expectations. Write 3 quantifiable, high-impact replacements.',
    icon: FileText
  },
  {
    title: 'System Design Drill',
    prompt: 'Conduct a deep system design drill on designing a high-throughput rate limiting proxy service. Ask me progressive questions.',
    icon: Target
  },
  {
    title: 'Salary Negotiation Script',
    prompt: 'Draft an effective email script negotiating a 15% base salary increase for a Full-Stack Engineer offer while maintaining a warm posture.',
    icon: Award
  },
  {
    title: '4-Week Learning Plan',
    prompt: 'Map out a realistic 4-week study plan to master Docker, Google Cloud Run, and CI/CD pipelines alongside my full-time work.',
    icon: BookOpen
  }
];

interface AiCoachHomeProps {
  currentConversation: AiConversation | null;
  onSelectConversation: (conv: AiConversation) => void;
  onNewConversation: () => void;
  onOpenSettings: () => void;
}

export const AiCoachHome: React.FC<AiCoachHomeProps> = ({
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onOpenSettings
}) => {
  const { user } = useAuth();
  const { jobApplications } = useCareer();
  const [primaryResume, setPrimaryResume] = useState<ResumeRecord | null>(null);

  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [selectedMode, setSelectedMode] = useState<CoachMode>(currentConversation?.coachMode || 'general');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [memoryFactsCount, setMemoryFactsCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load primary resume
  useEffect(() => {
    if (!user) return;
    ResumeService.getPrimaryResume(user.uid).then(res => setPrimaryResume(res));
  }, [user]);

  // Load or initialize conversation
  useEffect(() => {
    if (!user) return;

    const loadChat = async () => {
      let activeConv = currentConversation;
      if (!activeConv) {
        const convs = await AiCoachService.getConversations(user.uid);
        if (convs.length > 0) {
          activeConv = convs[0];
          onSelectConversation(convs[0]);
        } else {
          activeConv = await AiCoachService.createConversation(
            user.uid,
            'Career Acceleration Kickoff',
            'General',
            'general'
          );
          onSelectConversation(activeConv);
        }
      }

      if (activeConv) {
        setSelectedMode(activeConv.coachMode || 'general');
        const msgs = await AiCoachService.getMessages(user.uid, activeConv.id);
        
        if (msgs.length === 0) {
          // Add initial warm greeting from assistant
          const welcomeMsg = await AiCoachService.addMessage(
            user.uid,
            activeConv.id,
            'assistant',
            `Hello **${user.name || 'Engineer'}**! I am your **PathPilot AI Career Coach**.

I have synced with your **Profile Context** and **Primary Resume** (*${primaryResume?.title || 'Active Resume'}*).

How can we accelerate your career trajectory today? You can choose a quick starter below or type your custom goal.`
          );
          setMessages([welcomeMsg]);
        } else {
          setMessages(msgs);
        }
      }

      // Check stored memory facts count
      const memory = await AiCoachService.getMemoryFacts(user.uid);
      setMemoryFactsCount(memory.length);
    };

    loadChat();
  }, [user, currentConversation?.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingReply]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !user || !currentConversation || loadingReply) return;

    setInputText('');
    setLoadingReply(true);

    try {
      await AiCoachService.sendMessageToCoach(
        user.uid,
        currentConversation.id,
        text,
        selectedMode,
        {
          profile: user,
          primaryResume: primaryResume || null,
          applications: jobApplications || []
        }
      );

      // Refresh message list
      const updated = await AiCoachService.getMessages(user.uid, currentConversation.id);
      setMessages(updated);

      // Update memory facts count
      const memory = await AiCoachService.getMemoryFacts(user.uid);
      setMemoryFactsCount(memory.length);
    } catch (err) {
      console.error('Failed to dispatch message:', err);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser window.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('Voice recognition error:', err);
      setIsListening(false);
    }
  };

  const activeModeConfig = COACH_MODES.find(m => m.id === selectedMode) || COACH_MODES[0];

  return (
    <div id="ai-coach-workspace" className="flex flex-col h-[calc(100vh-12rem)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
      {/* Workspace Header & Mode Selector */}
      <div id="coach-header" className="px-6 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activeModeConfig.color} text-white shadow-md`}>
            <activeModeConfig.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                {currentConversation?.title || 'AI Career Coach'}
              </h2>
              <Badge variant="primary" className="text-xs">
                {activeModeConfig.title}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {activeModeConfig.desc}
            </p>
          </div>
        </div>

        {/* Mode Dropdown & Memory Status */}
        <div className="flex items-center gap-2">
          {/* Active Memory Indicator */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] transition-colors"
            title="View remembered career context"
          >
            <Brain className="w-3.5 h-3.5 text-purple-500" />
            <span>Memory ({memoryFactsCount})</span>
          </button>

          {/* Mode Selector */}
          <div className="relative group">
            <select
              value={selectedMode}
              onChange={(e) => {
                const newMode = e.target.value as CoachMode;
                setSelectedMode(newMode);
                if (currentConversation && user) {
                  AiCoachService.updateConversation(user.uid, currentConversation.id, { coachMode: newMode });
                }
              }}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {COACH_MODES.map(mode => (
                <option key={mode.id} value={mode.id}>
                  {mode.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            title="Conversation Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isUser 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
              }`}>
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`group relative flex flex-col max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                isUser 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-none shadow-sm'
              }`}>
                {/* Header info */}
                <div className={`flex items-center justify-between gap-4 mb-1.5 text-xs ${isUser ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>
                  <span className="font-semibold">{isUser ? 'You' : 'PathPilot AI Coach'}</span>
                  <div className="flex items-center gap-2">
                    {msg.contextUsed?.resumeLoaded && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                        <Check className="w-3 h-3" /> Resume Synced
                      </span>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Action Toolbar on Hover */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-[var(--color-border)]/50 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span>Model: {msg.modelUsed || 'gemini-3.6-flash'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="p-1.5 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {loadingReply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Synthesizing career insights & profile context...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Starter Chips (Shown when conversation is short) */}
      {messages.length <= 2 && !loadingReply && (
        <div id="prompt-starters" className="px-6 py-3 bg-[var(--color-bg-secondary)]/50 border-t border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Suggested Career Starters:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROMPT_STARTERS.map((ps, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(ps.prompt)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-left transition-all hover:scale-[1.01]"
              >
                <ps.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">{ps.title}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">{ps.prompt}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div id="chat-input-bar" className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex flex-col gap-2"
        >
          <div className="relative flex items-center gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus-within:border-primary rounded-xl p-2 shadow-inner transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${activeModeConfig.title} about your resume, goals, or interviews...`}
              disabled={loadingReply}
              className="flex-1 bg-transparent px-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none disabled:opacity-50"
            />

            {/* Voice Dictation Toggle */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loadingReply}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Context indicator bar */}
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> Isolated to auth.uid()
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-500" /> Persistent AI Memory Active
              </span>
            </div>
            <span>Press Enter to send</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiCoachHome;
