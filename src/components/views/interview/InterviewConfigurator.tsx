/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Sliders, Play, ArrowLeft, Brain, Shield, Info, HelpCircle, 
  Settings, Check, Sparkles, FolderOpen, Video, Mic, Target, Flame
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { InterviewType, CompanyName, DifficultyLevel, QuestionCategory } from './InterviewTypes';
import { COMPANIES, DIFFICULTY_LEVELS, INTERVIEW_TYPES, QUESTION_CATEGORIES } from './mockData';
import { cn } from '../../../lib/utils';

interface InterviewConfiguratorProps {
  initialPrefill?: { type?: InterviewType; company?: CompanyName; difficulty?: DifficultyLevel };
  onStartSession: (config: {
    type: InterviewType;
    company: CompanyName;
    difficulty: DifficultyLevel;
    category: QuestionCategory;
    isVoicePractice: boolean;
    adaptiveDifficulty: boolean;
    quickMode: boolean;
    customQuestionPrompt?: string;
  }) => void;
  onCancel: () => void;
}

export const InterviewConfigurator: React.FC<InterviewConfiguratorProps> = ({
  initialPrefill,
  onStartSession,
  onCancel
}) => {
  // Config states
  const [selectedType, setSelectedType] = useState<InterviewType>(
    initialPrefill?.type || 'Technical Interview'
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyName>(
    initialPrefill?.company || 'Google'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    initialPrefill?.difficulty || 'Advanced'
  );
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('System Design');

  // Interactive configurations
  const [isVoicePractice, setIsVoicePractice] = useState<boolean>(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<boolean>(true);
  const [quickMode, setQuickMode] = useState<boolean>(false);
  const [customQuestionPrompt, setCustomQuestionPrompt] = useState<string>('');

  // Auto category mapping on type select to make UI smart
  const handleTypeSelect = (type: InterviewType) => {
    setSelectedType(type);
    
    // Smart category mappings
    if (type === 'System Design') {
      setSelectedCategory('System Design');
    } else if (type === 'Behavioral Interview') {
      setSelectedCategory('Behavioral');
    } else if (type === 'Coding Interview') {
      setSelectedCategory('Algorithms');
    } else if (type === 'Machine Learning') {
      setSelectedCategory('Machine Learning');
    } else if (type === 'Backend' || type === 'Technical Interview') {
      setSelectedCategory('Databases');
    } else if (type === 'Frontend') {
      setSelectedCategory('Portfolio');
    } else if (type === 'HR Interview') {
      setSelectedCategory('Self Introduction');
    } else if (type === 'AI Interview') {
      setSelectedCategory('AI');
    }
  };

  const handleLaunch = () => {
    onStartSession({
      type: selectedType,
      company: selectedCompany,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      isVoicePractice,
      adaptiveDifficulty,
      quickMode,
      customQuestionPrompt: selectedType === 'Custom Interview' ? customQuestionPrompt : undefined
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-5xl mx-auto py-2">
      
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-xs text-text-mute hover:text-text-main flex items-center gap-1.5 cursor-pointer px-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <span className="text-[10px] text-text-mute font-mono uppercase tracking-widest">Session Calibrator v2.0</span>
      </div>

      {/* 2. Calibration Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left: Main Configurations (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 1: TARGET COMPANY */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm">Select Target Company Alignment</CardTitle>
                  <CardDescription className="text-xs">Questions and grading parameters will align to the target enterprise standard.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COMPANIES.map((comp) => {
                const isSelected = selectedCompany === comp.name;
                return (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedCompany(comp.name)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-150 text-center select-none relative group h-20',
                      isSelected
                        ? 'border-primary bg-primary/2 shadow-sm scale-[1.01]'
                        : 'border-[var(--border)] bg-[var(--surface-secondary)]/10 hover:border-primary/20 hover:bg-[var(--surface-secondary)]/25'
                    )}
                    title={comp.desc}
                  >
                    <span className="text-xl mb-1 filter drop-shadow">{comp.logo}</span>
                    <span className={cn('text-[11px] font-black', isSelected ? 'text-primary font-black' : 'text-text-sub')}>{comp.name}</span>
                    
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-primary text-black flex items-center justify-center text-[7px] font-black">✓</span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* SECTION 2: INTERVIEW TYPE & COGNITIVE DOMAIN */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm">Select Core Interview Round & Domain</CardTitle>
                  <CardDescription className="text-xs">Adapt questions to the specific engineering context, academic standard, or soft-skill framework.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTERVIEW_TYPES.map((t) => {
                const isSelected = selectedType === t.type;
                return (
                  <button
                    key={t.type}
                    onClick={() => handleTypeSelect(t.type)}
                    className={cn(
                      'text-left p-3.5 border rounded-xl cursor-pointer transition-all duration-150 relative select-none h-24 flex flex-col justify-between group',
                      isSelected
                        ? 'border-primary bg-primary/2 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface-secondary)]/10 hover:border-primary/20 hover:bg-[var(--surface-secondary)]/25'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn('text-xs font-black truncate', isSelected ? 'text-primary' : 'text-text-main')}>{t.type}</h4>
                        <Badge variant="neutral" className="text-[7.5px] uppercase font-black px-1.5 py-0 bg-[var(--surface-secondary)] border-[var(--border)]">
                          {t.category}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-mute mt-1 leading-relaxed line-clamp-2 font-semibold">
                        {t.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-primary text-black flex items-center justify-center text-[8px] font-black shadow">✓</span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* SECTION 3: CUSTOM PROMPT IF CUSTOM TYPE SELECT */}
          {selectedType === 'Custom Interview' && (
            <Card className="border-[var(--border)] bg-[var(--surface)] animate-slide-in">
              <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs uppercase text-primary tracking-widest font-black">
                  Custom Recruiter Focus Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3.5 flex flex-col gap-3">
                <label className="text-[10px] font-black text-text-mute uppercase tracking-wider">
                  Describe what skills or roles to test (API, System, Custom prompts)
                </label>
                <textarea
                  value={customQuestionPrompt}
                  onChange={(e) => setCustomQuestionPrompt(e.target.value)}
                  placeholder="e.g. Conduct a round on Stripe Billing integrations using Go. Focus on webhook reliability, idempotent requests, and transactional queues."
                  rows={4}
                  className="w-full text-xs p-3 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors leading-relaxed font-semibold"
                />
                <span className="text-[9px] text-text-mute flex items-center gap-1">
                  <Info className="w-3 h-3 text-primary shrink-0" /> Custom guidelines will be injected directly into the active AI interviewer pipeline.
                </span>
              </CardContent>
            </Card>
          )}

          {/* SECTION 4: QUESTION CATEGORY & DIFFICULTY TIER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">
                  Target Question Category
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full text-xs p-3 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors font-semibold"
                >
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">
                  Target Difficulty Level
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] p-0.5 overflow-hidden w-full">
                  {DIFFICULTY_LEVELS.map((d) => (
                    <button
                      key={d.level}
                      type="button"
                      onClick={() => setSelectedDifficulty(d.level)}
                      className={cn(
                        'flex-1 text-[9px] font-black py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center select-none',
                        selectedDifficulty === d.level
                          ? 'bg-primary text-black font-black shadow-xs'
                          : 'text-text-mute hover:text-text-sub'
                      )}
                    >
                      {d.level}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Right: Premium Modifiers & Launch Trigger (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECTION 5: PREMIUM EXPERIMENTAL MODIFIERS */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <CardTitle className="text-xs uppercase text-text-mute tracking-widest font-black flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-primary animate-spin-slow" /> Active Modifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              
              {/* Modifier 1: Practice mode */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[var(--border)]/60 bg-[var(--surface-secondary)]/10 select-none">
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-xs font-black text-text-main">Quick 5-Minute Round</span>
                  <span className="text-[9.5px] text-text-mute leading-normal font-semibold">Test with a single highly complex query instead of standard 3-question sequence.</span>
                </div>
                <input
                  type="checkbox"
                  checked={quickMode}
                  onChange={(e) => setQuickMode(e.target.checked)}
                  className="w-4 h-4 text-primary bg-[var(--surface-secondary)] rounded border-[var(--border)] focus:ring-primary h-4 w-4 mt-1"
                />
              </div>

              {/* Modifier 2: Adaptive difficulty */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[var(--border)]/60 bg-[var(--surface-secondary)]/10 select-none">
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-xs font-black text-text-main flex items-center gap-1">
                    Adaptive AI Difficulty <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <span className="text-[9.5px] text-text-mute leading-normal font-semibold">The AI will dynamically increase complexity or prompt deeper follow-ups based on the depth of your answers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={adaptiveDifficulty}
                  onChange={(e) => setAdaptiveDifficulty(e.target.checked)}
                  className="w-4 h-4 text-primary bg-[var(--surface-secondary)] rounded border-[var(--border)] focus:ring-primary h-4 w-4 mt-1"
                />
              </div>

              {/* Modifier 3: Voice preference */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[var(--border)]/60 bg-[var(--surface-secondary)]/10 select-none">
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-xs font-black text-text-main flex items-center gap-1">
                    Prepare Voice Synthesis <Mic className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <span className="text-[9.5px] text-text-mute leading-normal font-semibold">Uses SpeechSynthesis to read questions aloud in a professional recruiter tone.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isVoicePractice}
                  onChange={(e) => setIsVoicePractice(e.target.checked)}
                  className="w-4 h-4 text-primary bg-[var(--surface-secondary)] rounded border-[var(--border)] focus:ring-primary h-4 w-4 mt-1"
                />
              </div>

            </CardContent>
          </Card>

          {/* LAUNCH TRIGGER PANEL */}
          <Card className="border-[var(--border)] bg-[var(--surface)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-text-mute tracking-widest font-black flex items-center justify-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" /> Readiness Approved
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col gap-2 p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)]/70 rounded-xl mb-4 text-left">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-text-mute">Enterprise Alignment:</span>
                  <span className="text-text-sub font-extrabold">{selectedCompany}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-text-mute">Practice Focus:</span>
                  <span className="text-text-sub font-extrabold">{selectedType}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-text-mute">Difficulty:</span>
                  <span className="text-text-sub font-extrabold">{selectedDifficulty} Level</span>
                </div>
              </div>

              <p className="text-[10px] text-text-mute leading-normal mb-5 font-semibold">
                By launching the simulation session, you will enter our professional interview suite. Ensure your microphone is active.
              </p>

              <Button
                variant="primary"
                onClick={handleLaunch}
                className="w-full text-xs font-black h-11 bg-primary text-black shadow-lg shadow-primary/10 transition-all duration-200 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" /> Deploy Interview Session
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
