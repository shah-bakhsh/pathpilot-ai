/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, CheckSquare, Sparkles, RefreshCw, Award, Play, Check, 
  HelpCircle, ChevronRight, Bookmark, ArrowUpRight, Clipboard, Trash2, Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface InterviewPlannerProps {
  applications: any[];
}

export const InterviewPlanner: React.FC<InterviewPlannerProps> = ({ applications }) => {
  const [activePrepQuestionId, setActivePrepQuestionId] = useState<string | null>(null);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiFeedbackMap, setAiFeedbackMap] = useState<Record<string, { score: number; critique: string; improved: string }>>({});

  const upcomingInterviews = applications.filter(a => a.interviewDate && a.status !== 'rejected');

  const qaBank = [
    { id: 'q_1', category: 'System Design', question: 'How would you design a distributed rate-limiter that allows 100 requests per minute with sliding-window calculations?' },
    { id: 'q_2', category: 'Backend Concepts', question: 'Explain the difference between optimistic and pessimistic locking in relational databases, and when to use each.' },
    { id: 'q_3', category: 'Architecture', question: 'How do you handle event deduplication in an asynchronous microservice message pipeline?' },
    { id: 'q_4', category: 'Behavioral', question: 'Tell me about a time you introduced an architectural change that met with resistance, and how you resolved the conflict.' }
  ];

  // Company research items stored locally
  const [researchList, setResearchList] = useState<{ id: string; company: string; facts: string }[]>(() => {
    try {
      const saved = localStorage.getItem('pathpilot-company-research');
      return saved ? JSON.parse(saved) : [
        { id: 'res_1', company: 'Google', facts: 'Core culture focuses on large-scale distributed consensus, MapReduce paradigms, and high reliability systems.' },
        { id: 'res_2', company: 'Stripe', facts: 'Highly values developer-experience (DX), elegant RESTful design architectures, and absolute idempotency in transaction execution.' }
      ];
    } catch {
      return [];
    }
  });

  const [newResearch, setNewResearch] = useState({ company: '', facts: '' });

  const handleAddResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResearch.company.trim() || !newResearch.facts.trim()) return;
    const updated = [...researchList, { id: 'res_' + Math.random().toString(36).substring(2, 9), ...newResearch }];
    setResearchList(updated);
    localStorage.setItem('pathpilot-company-research', JSON.stringify(updated));
    setNewResearch({ company: '', facts: '' });
  };

  const handleDeleteResearch = (id: string) => {
    const updated = researchList.filter(r => r.id !== id);
    setResearchList(updated);
    localStorage.setItem('pathpilot-company-research', JSON.stringify(updated));
  };

  const handleRequestAiEvaluation = async (qId: string, questionText: string) => {
    if (!userAnswerText.trim()) return;
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: `You are an elite Silicon Valley Technical Interviewer. Evaluate this answer for a Senior Software Engineer candidate. 
          Question: "${questionText}"
          Candidate Answer: "${userAnswerText}"
          Please return a valid JSON format (wrapped in bracket indicators) providing:
          - A diagnostic rating score from 0 to 100 (score)
          - Actionable constructive critique (critique)
          - An optimized, concise, model response (improvedResponse).
          Do not include other commentary. Conform exactly to JSON output.`,
          history: []
        })
      });
      if (response.ok) {
        const data = await response.json();
        let parsed = { score: 80, critique: 'Ensure more details on edge cases.', improved: 'Optimized response blueprint.' };
        try {
          // Attempt to locate and parse json block in the return text
          const text = data.text;
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}') + 1;
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const rawJson = text.substring(jsonStart, jsonEnd);
            const obj = JSON.parse(rawJson);
            parsed = {
              score: Number(obj.score) || 80,
              critique: obj.critique || 'Good start. Elaborate more on technical benchmarks.',
              improved: obj.improvedResponse || obj.improved || 'A professional response would detail scalable consensus schemas.'
            };
          } else {
            parsed = { score: 75, critique: text, improved: 'Focus on clear design patterns.' };
          }
        } catch {
          parsed = { score: 78, critique: data.text, improved: 'Focus on clear design patterns.' };
        }
        setAiFeedbackMap(prev => ({ ...prev, [qId]: parsed }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      
      {/* Left Column: Countdowns & Checklists */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        
        {/* Countdowns Card */}
        <Card className="bg-slate-900/20 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Interview Timeline Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcomingInterviews.map((int, idx) => {
              const diffTime = Math.ceil((new Date(int.interviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const countdownText = diffTime === 0 ? '📅 TODAY' : diffTime > 0 ? `⏰ In ${diffTime} days` : '⌛ Passed';

              return (
                <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-normal">{int.company}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">{int.role}</span>
                  </div>
                  <Badge variant={diffTime <= 2 ? 'error' : 'neutral'} className="text-[10px] font-bold px-2 py-0.5">
                    {countdownText}
                  </Badge>
                </div>
              );
            })}
            {upcomingInterviews.length === 0 && (
              <p className="text-[10px] text-slate-500 font-bold text-center py-4">No upcoming interviews scheduled yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Core Checklist */}
        <Card className="bg-slate-900/20 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Technical Preparation Checklist</CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex flex-col gap-2">
            {[
              'Review system design patterns (Microservices, gRPC, Event Brokers)',
              'Re-verify relational database locking schemas & normalization',
              'Draft behavioral summaries aligned to the STAR method',
              'Formulate strategic high-level architecture diagrams',
              'Check microphone & camera streaming permissions'
            ].map((chk, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-950/40 border border-slate-900/80 rounded-xl">
                <input type="checkbox" id={`chk_${idx}`} className="mt-0.5 rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500 cursor-pointer" />
                <label htmlFor={`chk_${idx}`} className="text-[11px] text-slate-300 font-bold select-none cursor-pointer leading-normal">{chk}</label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Research Board */}
        <Card className="bg-slate-900/20 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Target Company Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <form onSubmit={handleAddResearch} className="flex flex-col gap-2">
              <Input
                label="Company Name"
                placeholder="e.g. Stripe"
                value={newResearch.company}
                onChange={(e) => setNewResearch({ ...newResearch, company: e.target.value })}
              />
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Context Facts</label>
                <textarea
                  placeholder="Facts to mention, architectural focus, product values..."
                  value={newResearch.facts}
                  onChange={(e) => setNewResearch({ ...newResearch, facts: e.target.value })}
                  className="mt-1 w-full h-12 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="h-8 text-[11px]">Save Intelligence</Button>
            </form>

            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mt-2">
              {researchList.map((res) => (
                <div key={res.id} className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl relative group">
                  <span className="text-[11px] font-extrabold text-white">{res.company}</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{res.facts}</p>
                  <button onClick={() => handleDeleteResearch(res.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Dynamic AI QA Preparation Arena */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <Card className="bg-slate-900/20 border-slate-800 h-full flex flex-col">
          <CardHeader className="border-b border-slate-800/80">
            <CardTitle className="text-sm font-extrabold text-white flex items-center gap-1.5 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI QA Training Arena
            </CardTitle>
            <CardDescription>Practice answering system design or leadership questions. Get real feedback and model answers evaluated by Gemini.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col gap-4">
            
            <div className="flex flex-col gap-2">
              {qaBank.map((qa) => {
                const isSelected = activePrepQuestionId === qa.id;
                const feedback = aiFeedbackMap[qa.id];

                return (
                  <div 
                    key={qa.id}
                    className={`border ${isSelected ? 'border-indigo-500/30 bg-slate-900/40' : 'border-slate-800/80 hover:border-slate-700/80 bg-slate-900/10'} rounded-2xl overflow-hidden transition-all`}
                  >
                    <button 
                      onClick={() => {
                        setActivePrepQuestionId(isSelected ? null : qa.id);
                        setUserAnswerText('');
                      }}
                      className="w-full text-left p-4 flex justify-between items-center"
                    >
                      <div>
                        <Badge variant="secondary" className="text-[9px] font-bold tracking-widest uppercase px-1.5 mb-1.5">{qa.category}</Badge>
                        <h4 className="text-xs font-bold text-white leading-normal">{qa.question}</h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-3 ${isSelected ? 'rotate-90' : ''}`} />
                    </button>

                    {isSelected && (
                      <div className="px-4 pb-4 border-t border-slate-800/40 bg-slate-950/40 p-4 flex flex-col gap-4">
                        
                        {!feedback ? (
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Technical Answer Response</label>
                              <textarea
                                value={userAnswerText}
                                onChange={(e) => setUserAnswerText(e.target.value)}
                                placeholder="Frame your answer... Mention performance requirements, database partitions, caching models, or the STAR framework structures."
                                className="mt-1 w-full h-32 bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleRequestAiEvaluation(qa.id, qa.question)}
                              disabled={isEvaluating || !userAnswerText.trim()}
                              className="self-end flex items-center gap-1.5 shadow-lg shadow-indigo-500/10"
                            >
                              {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Submit for AI Evaluation
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {/* Score banner */}
                            <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                              <Award className="w-6 h-6 text-indigo-400 animate-pulse" />
                              <div>
                                <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">Alignment Rating Score</span>
                                <div className="text-base font-extrabold text-white">{feedback.score} / 100</div>
                              </div>
                            </div>

                            {/* Critique */}
                            <div>
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                                🔍 Critical Critique & Gaps
                              </span>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed bg-slate-900/60 border border-slate-800 p-3 rounded-xl whitespace-pre-wrap font-semibold">
                                {feedback.critique}
                              </p>
                            </div>

                            {/* Improved response */}
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                🚀 Model Answer Reference Blueprint
                              </span>
                              <div className="text-[11px] text-slate-300 mt-1 leading-relaxed bg-slate-900/60 border border-slate-800 p-3 rounded-xl whitespace-pre-wrap font-semibold max-h-48 overflow-y-auto">
                                {feedback.improved}
                              </div>
                            </div>

                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setAiFeedbackMap(prev => {
                                  const copy = { ...prev };
                                  delete copy[qa.id];
                                  return copy;
                                });
                                setUserAnswerText('');
                              }}
                              className="self-end h-8 text-[11px]"
                            >
                              Retry Question Prep
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
