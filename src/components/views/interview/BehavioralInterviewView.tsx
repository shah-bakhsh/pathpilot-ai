/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, Sparkles, MessageSquare, Play, CheckCircle, ArrowRight, Shield, Zap, RefreshCw, Award
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Textarea, Input } from '../../ui/Input';
import { CompanyName, DifficultyLevel, QuestionCategory } from './InterviewTypes';
import { AIInterviewService } from '../../../services/aiInterviewService';

interface BehavioralInterviewViewProps {
  onStartConfig: (prefill?: { type: any; company: any; difficulty: any; category: any }) => void;
  onLaunchPractice: (customPrompt?: string) => void;
}

export const BehavioralInterviewView: React.FC<BehavioralInterviewViewProps> = ({
  onStartConfig,
  onLaunchPractice
}) => {
  // STAR Method Builder State
  const [starState, setStarState] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [starFeedback, setStarFeedback] = useState<any>(null);

  const [selectedCompany, setSelectedCompany] = useState<CompanyName>('Amazon');

  const amazonPrinciples = [
    { title: 'Customer Obsession', desc: 'Leaders start with the customer and work backwards.' },
    { title: 'Ownership', desc: 'Leaders think long term and don’t sacrifice long-term value for short-term results.' },
    { title: 'Bias for Action', desc: 'Speed matters in business. Many decisions and actions are reversible.' },
    { title: 'Have Backbone; Disagree & Commit', desc: 'Leaders are obligated to respectfully challenge decisions when they disagree.' }
  ];

  const handleEvaluateSTAR = async () => {
    if (!starState.situation || !starState.action) return;
    setIsEvaluating(true);
    const combinedAnswer = `Situation: ${starState.situation}\nTask: ${starState.task}\nAction: ${starState.action}\nResult: ${starState.result}`;
    
    try {
      const evalResult = await AIInterviewService.evaluateAnswer(
        'Describe a challenging scenario in your previous role and how you handled it.',
        combinedAnswer,
        selectedCompany,
        'Behavioral',
        'Behavioral Interview'
      );
      setStarFeedback(evalResult);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <MessageSquare className="w-3.5 h-3.5 mr-1" /> Behavioral & Soft Skills Studio
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Master the STAR Methodology for Tech Leaders
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Practice storytelling using Situation, Task, Action, and Result. Tailored to leadership principles at Amazon, Meta, Google, and Apple.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onStartConfig({ type: 'Behavioral Interview', company: selectedCompany, difficulty: 'Intermediate', category: 'Behavioral' })}
            className="text-xs font-black h-10 px-5 flex items-center gap-2 bg-primary text-black shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Launch Behavioral Mock Session
          </Button>
        </div>
      </div>

      {/* Grid: STAR Interactive Composer & Company Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: STAR Composer Studio */}
        <Card className="lg:col-span-2 bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Interactive STAR Story Builder
                </CardTitle>
                <CardDescription className="text-xs text-text-mute mt-1">
                  Draft your story response step by step to verify alignment before taking high-stakes rounds.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold">
                STAR Framework
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-black text-text-sub uppercase tracking-wider mb-1 block">
                1. Situation (Context & Background)
              </label>
              <Textarea
                value={starState.situation}
                onChange={e => setStarState(prev => ({ ...prev, situation: e.target.value }))}
                placeholder="Set the stage: What was the company, project, or problem? (e.g. During Q3 at CloudTech, our API latency spiked to 450ms...)"
                rows={2}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-black text-text-sub uppercase tracking-wider mb-1 block">
                2. Task (Responsibility & Challenges)
              </label>
              <Textarea
                value={starState.task}
                onChange={e => setStarState(prev => ({ ...prev, task: e.target.value }))}
                placeholder="What was your specific goal or responsibility? What were the deadlines or constraints?"
                rows={2}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-black text-text-sub uppercase tracking-wider mb-1 block">
                3. Action (Your Concrete Technical/Leadership Steps)
              </label>
              <Textarea
                value={starState.action}
                onChange={e => setStarState(prev => ({ ...prev, action: e.target.value }))}
                placeholder="What exact steps did YOU take? Which architecture decisions or cross-team alignments did you execute?"
                rows={3}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-black text-text-sub uppercase tracking-wider mb-1 block">
                4. Result (Quantifiable Metrics & Lessons Learned)
              </label>
              <Textarea
                value={starState.result}
                onChange={e => setStarState(prev => ({ ...prev, result: e.target.value }))}
                placeholder="What was the measurable outcome? (e.g. Reduced API latency by 68% to 140ms and boosted throughput by 3x...)"
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStarState({ situation: '', task: '', action: '', result: '' })}
                className="text-xs font-bold"
              >
                Clear Fields
              </Button>
              <Button
                onClick={handleEvaluateSTAR}
                disabled={isEvaluating || !starState.situation || !starState.action}
                className="text-xs font-black px-5 bg-primary text-black"
              >
                {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
                Analyze STAR Quality
              </Button>
            </div>

            {/* AI Evaluated Feedback Box */}
            {starFeedback && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> AI STAR Story Diagnostic
                  </span>
                  <Badge variant="primary" className="text-xs font-extrabold">
                    Hiring Decision: {starFeedback.hiringRecommendation || 'Hire'}
                  </Badge>
                </div>
                <p className="text-xs text-text-main font-medium leading-relaxed">
                  {starFeedback.explanation}
                </p>
                {starFeedback.starBreakdown && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-1 pt-2 border-t border-primary/10">
                    <div className="p-2 rounded bg-[var(--surface)] border border-[var(--border)]">
                      <span className="font-bold block text-text-sub">Completeness Index</span>
                      <span className="text-base font-black text-primary">{starFeedback.starBreakdown.completenessScore}%</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--surface)] border border-[var(--border)]">
                      <span className="font-bold block text-text-sub">STAR Structure</span>
                      <span className="text-base font-black text-emerald-400">STAR Verified</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => onLaunchPractice(`Practice this exact story: "Situation: ${starState.situation}. Action: ${starState.action}. Result: ${starState.result}"`)}
                    className="text-xs font-black h-8 px-3 bg-primary text-black"
                  >
                    Launch Practice with this Story <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Right Col: Leadership Principles Alignment */}
        <div className="flex flex-col gap-4">
          <Card className="bg-[var(--surface)] border-[var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Target Leadership Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {(['Amazon', 'Google', 'Meta', 'Apple'] as CompanyName[]).map(comp => (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompany(comp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${selectedCompany === comp ? 'bg-primary text-black' : 'bg-[var(--surface-secondary)]/20 border border-[var(--border)] text-text-sub'}`}
                  >
                    {comp}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                {amazonPrinciples.map((princ, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[var(--surface-secondary)]/10 border border-[var(--border)]">
                    <span className="text-xs font-extrabold text-text-main block">{princ.title}</span>
                    <span className="text-[11px] text-text-mute mt-1 block leading-snug">{princ.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
