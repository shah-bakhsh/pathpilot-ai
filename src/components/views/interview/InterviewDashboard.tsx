/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Award, Play, History, Trophy, Flame, Target, BookOpen, Clock, 
  ChevronRight, Brain, Zap, ArrowUpRight, BarChart2, Star, CheckCircle, HelpCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { InterviewSession, Achievement } from './InterviewTypes';
import { RECOMMENDED_PRACTICES } from './mockData';
import { cn } from '../../../lib/utils';

interface InterviewDashboardProps {
  sessions: InterviewSession[];
  achievements: Achievement[];
  onStartConfig: (prefill?: { type: any; company: any; difficulty: any }) => void;
  onViewSession: (session: InterviewSession) => void;
  onLaunchQuickPractice: () => void;
  onViewQuestionBank: () => void;
  onViewAnalytics: () => void;
}

export const InterviewDashboard: React.FC<InterviewDashboardProps> = ({
  sessions,
  achievements,
  onStartConfig,
  onViewSession,
  onLaunchQuickPractice,
  onViewQuestionBank,
  onViewAnalytics
}) => {
  // Stats
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalSessions) 
    : 0;
  const avgConfidence = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.confidenceScore, 0) / totalSessions)
    : 0;
  
  // Calculate readiness score
  const readinessScore = Math.min(100, Math.max(50, 60 + totalSessions * 8 + (avgScore - 70) * 0.4));
  
  // Unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* 1. LUXURY HERO WELCOME SECTION */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle decorative grid in the background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-[-40px] right-[-20px] w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10 max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Brain className="w-3.5 h-3.5 mr-1" /> Dynamic AI Coaching Module
          </Badge>
          <h1 className="text-xl md:text-3xl font-black text-text-main tracking-tight leading-tight">
            Perfect Your Tech and Behavioral Interviewing Skills
          </h1>
          <p className="text-xs text-text-mute mt-2 md:mt-3 leading-relaxed font-semibold">
            Recreate high-stakes, realistic conversations with professional AI recruiters. Aligned with strict evaluators from Meta, Apple, Google, and top startups. Dictate your thoughts or type comprehensively, and receive actionable real-time analysis instantly.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button 
              onClick={() => onStartConfig()}
              className="text-xs font-black h-10 px-5 flex items-center gap-2 bg-primary text-black shadow-lg shadow-primary/15 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Setup Interactive Session
            </Button>
            <Button 
              variant="outline"
              onClick={onLaunchQuickPractice}
              className="text-xs font-black h-10 px-4 border-[var(--border)] hover:bg-[var(--surface-secondary)]/10 text-text-sub cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-primary animate-pulse" /> Quick 5-Min Practice
            </Button>
          </div>
        </div>

        {/* Readiness Score Ring Panel */}
        <div className="relative shrink-0 flex flex-col items-center justify-center p-5 bg-[var(--surface-secondary)]/10 border border-[var(--border)]/80 rounded-xl md:w-56 text-center select-none shadow-inner">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-[var(--border)]/30 fill-transparent"
                strokeWidth="7"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-primary fill-transparent"
                strokeWidth="7"
                strokeDasharray="289"
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 289 - (289 * readinessScore) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className="text-3xl font-display font-black text-text-main">{Math.round(readinessScore)}%</span>
              <span className="text-[8px] text-text-mute font-black uppercase tracking-wider mt-1.5">Readiness Index</span>
            </div>
          </div>
          <span className="text-[10px] text-text-sub font-bold mt-4 leading-normal">
            {readinessScore >= 85 ? '👑 Ready for Principal rounds' : readinessScore >= 70 ? '⚡ Performing at Senior tier' : '📈 Cultivating foundational blocks'}
          </span>
        </div>
      </div>

      {/* 2. GRANULAR OFF-CANVAS STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="bg-[var(--surface)] border-[var(--border)] relative overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Interview Streak</span>
              <span className="text-2xl font-display font-black text-text-main flex items-baseline gap-1 leading-none">
                3 <span className="text-xs text-text-mute font-semibold">Days</span>
              </span>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
              <Flame className="w-5 h-5 fill-rose-500/20" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-400 opacity-60" />
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)] relative overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Average Score</span>
              <span className="text-2xl font-display font-black text-text-main flex items-baseline gap-1 leading-none">
                {avgScore}% <span className="text-xs text-success font-black mt-0.5">Approved</span>
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60" />
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)] relative overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Confidence Metric</span>
              <span className="text-2xl font-display font-black text-text-main flex items-baseline gap-1 leading-none">
                {avgConfidence}% <span className="text-[10px] text-text-mute font-semibold">Self-Assessed</span>
              </span>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-amber-400 opacity-60" />
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)] relative overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Practice Rounds</span>
              <span className="text-2xl font-display font-black text-text-main flex items-baseline gap-1 leading-none">
                {totalSessions} <span className="text-xs text-text-mute font-semibold">Completed</span>
              </span>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-400 opacity-60" />
        </Card>

      </div>

      {/* 3. MIDDLE SECTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left 8 cols: Goals, Recommendations, Recent Sessions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Today's Goals & Daily Challenge */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm">Today's Practice Goals</CardTitle>
                  <CardDescription className="text-xs">Maintain your daily streak and earn supplementary XP modifiers.</CardDescription>
                </div>
              </div>
              <Badge variant="success" className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5">
                +100 Daily XP Active
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)]/70">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-black">✓</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Set target company alignment parameters</span>
                    <span className="text-[9.5px] text-text-mute">Configured with your ideal recruiter settings.</span>
                  </div>
                </div>
                <Badge variant="neutral" className="text-[8.5px] font-extrabold px-1.5 bg-neutral-500/10 text-neutral-400">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)]/70">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-5 h-5 rounded-full border flex items-center justify-center text-xs font-black shrink-0',
                    totalSessions > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'border-[var(--border)] text-text-mute'
                  )}>
                    {totalSessions > 0 ? '✓' : '2'}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Complete a structured interview session</span>
                    <span className="text-[9.5px] text-text-mute">Successfully clear a 3-question evaluation sequence.</span>
                  </div>
                </div>
                {totalSessions > 0 ? (
                  <Badge variant="neutral" className="text-[8.5px] font-extrabold px-1.5 bg-neutral-500/10 text-neutral-400">Completed</Badge>
                ) : (
                  <Badge variant="primary" className="text-[8.5px] font-black px-1.5 bg-primary/10 text-primary">+50 XP</Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)]/70">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-[var(--border)] text-text-mute flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Practice one System Design or coding bank card</span>
                    <span className="text-[9.5px] text-text-mute">Review and score optimal sliding-window topologies in the library.</span>
                  </div>
                </div>
                <Badge variant="primary" className="text-[8.5px] font-black px-1.5 bg-primary/10 text-primary">+25 XP</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Practice Tracks */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm">Recommended Practice Sessions</CardTitle>
                  <CardDescription className="text-xs">Based on current industry vacancies and custom role target alignments.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RECOMMENDED_PRACTICES.map((rec, i) => (
                <div 
                  key={i} 
                  className="flex flex-col p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 text-left relative group hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-[9.5px] text-primary font-black uppercase tracking-wider">{rec.company} // Round</span>
                  <h4 className="text-xs font-black text-text-main mt-1 leading-snug line-clamp-1">{rec.title}</h4>
                  <p className="text-[10px] text-text-mute mt-1 leading-relaxed font-semibold">
                    {rec.type} · {rec.difficulty}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[9px] text-text-mute font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rec.time}
                    </span>
                    <button
                      onClick={() => onStartConfig({ type: rec.type as any, company: rec.company as any, difficulty: rec.difficulty as any })}
                      className="text-[9px] font-black text-primary flex items-center gap-1 cursor-pointer hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      Launch <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Interview Sessions History */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm">Recent Interview History Log</CardTitle>
                  <CardDescription className="text-xs">Analyze diagnostic reports, feedback transcripts and scoring progressions.</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onViewAnalytics}
                className="text-[10px] font-black text-primary cursor-pointer hover:underline"
              >
                Detailed Analytics
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {sessions.length > 0 ? (
                <table className="w-full border-collapse text-left text-xs text-text-sub">
                  <thead>
                    <tr className="border-b border-[var(--border)]/40 bg-[var(--surface-secondary)]/10 font-bold text-text-mute text-[9px] uppercase tracking-widest select-none">
                      <th className="py-2.5 px-4">Session Target</th>
                      <th className="py-2.5 px-4">Recruiter / Difficulty</th>
                      <th className="py-2.5 px-4">Overall Score</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/30">
                    {sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-[var(--hover-tint)]/10 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <span className="text-lg">{sess.company === 'Google' ? '🔍' : sess.company === 'Netflix' ? '🍿' : '🏢'}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-text-main text-[11px] truncate">{sess.type}</span>
                            <span className="text-[9px] text-text-mute font-black uppercase mt-0.5 tracking-wider">{sess.company} Pack</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="neutral" className="text-[8px] font-extrabold uppercase px-1.5">{sess.difficulty}</Badge>
                            <span className="text-[9.5px] text-text-mute font-semibold">
                              {new Date(sess.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'text-[10px] font-black font-mono',
                              sess.overallScore >= 85 ? 'text-success' : sess.overallScore >= 70 ? 'text-primary' : 'text-danger'
                            )}>
                              {sess.overallScore}%
                            </span>
                            <span className="text-[8px] text-text-mute font-semibold">Match</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewSession(sess)}
                            className="text-[9px] font-black hover:text-primary cursor-pointer px-2 h-7 rounded border border-[var(--border)] hover:border-primary/20"
                          >
                            View Report <ArrowUpRight className="w-3 h-3 ml-0.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-text-mute flex flex-col items-center justify-center">
                  <History className="w-10 h-10 text-text-mute/30 stroke-[1.5]" />
                  <h4 className="text-xs font-black text-text-main mt-3 uppercase tracking-wider">No sessions found</h4>
                  <p className="text-[10px] text-text-mute mt-1 max-w-xs leading-normal">
                    You haven't completed any dynamic simulated sessions yet. Setup your first interview.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right 4 cols: Achievements, Badges, Milestones, Question Bank Shortcut */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Question Bank Link Panel */}
          <Card className="border-[var(--border)] bg-[var(--surface)] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-text-mute tracking-widest font-black flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" /> Core Question Bank
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-[11px] text-text-sub leading-relaxed font-semibold">
                Explore a massive categorized database of technical algorithms, behavioral STAR questions, system designs, databases, and general recruiting queries.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewQuestionBank}
                className="w-full text-[9.5px] font-black h-8 mt-4 border-primary/20 text-primary hover:bg-primary/2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Browse Question Bank <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Achievements, Badges and Levels */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm">Milestones & Badges</CardTitle>
              </div>
              <Badge variant="primary" className="text-[8px] font-extrabold px-1.5 py-0.5">
                {unlockedCount}/{achievements.length} Unlocked
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3.5">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all duration-150',
                    ach.unlocked 
                      ? 'bg-success/2 border-success/15' 
                      : 'bg-[var(--surface-secondary)]/10 border-[var(--border)]/70'
                  )}
                >
                  <span className="text-2xl select-none leading-none shrink-0">{ach.icon}</span>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={cn('text-xs font-black truncate', ach.unlocked ? 'text-text-main' : 'text-text-sub')}>{ach.title}</span>
                      <span className="text-[8.5px] font-mono text-primary font-bold shrink-0">+{ach.xpReward} XP</span>
                    </div>
                    <p className="text-[9.5px] text-text-mute leading-snug font-semibold">{ach.desc}</p>
                    
                    {/* Progress slider if lock is active */}
                    {!ach.unlocked && typeof ach.progressMax === 'number' && typeof ach.progressCurrent === 'number' && (
                      <div className="flex flex-col gap-1 mt-1.5">
                        <div className="flex justify-between text-[8px] text-text-mute font-bold">
                          <span>Progress Tracker</span>
                          <span>{ach.progressCurrent} / {ach.progressMax}</span>
                        </div>
                        <div className="w-full bg-[var(--border)]/40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300" 
                            style={{ width: `${(ach.progressCurrent / ach.progressMax) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
