/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Award, ArrowLeft, Download, RefreshCw, Star, CheckCircle, AlertTriangle, 
  BookOpen, Compass, ChevronRight, Zap, Target, Shield, Heart, Share2, Printer, X
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { InterviewSession } from './InterviewTypes';
import { cn } from '../../../lib/utils';

interface InterviewReportProps {
  session: InterviewSession;
  onClose: () => void;
}

export const InterviewReport: React.FC<InterviewReportProps> = ({
  session,
  onClose
}) => {
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Score levels
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-primary bg-primary/10 border-primary/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return '👑 PRINCIPAL TIER';
    if (score >= 70) return '⚡ SENIOR FIT';
    return '📈 ASSOCIATE STAGE';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-5xl mx-auto py-2">
      
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-xs text-text-mute hover:text-text-main flex items-center gap-1.5 cursor-pointer px-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <span className="text-[10px] text-text-mute font-mono uppercase tracking-widest">Diagnostic Report #{session.id}</span>
      </div>

      {/* 2. SUMMARY JUMBOTRON CARD */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-emerald-500/2 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10 max-w-xl">
          <Badge variant="success" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            Session Completed Successfully
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight leading-tight">
            Comprehensive Diagnostic Performance Dossier
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed font-semibold">
            Analysis calibrated against enterprise competency matrices from <strong>{session.company}</strong> on the <strong>{session.type}</strong> round. XP bonuses and active streaks have been securely synced.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button 
              onClick={() => setShowCertificate(true)}
              className="text-xs font-black h-10 px-5 flex items-center gap-2 bg-primary text-black shadow-lg shadow-primary/15 transition-all duration-200 cursor-pointer"
            >
              <Award className="w-4 h-4 text-black" /> View Shareable Certificate
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="text-xs font-black h-10 px-4 border-[var(--border)] hover:bg-[var(--surface-secondary)]/10 text-text-sub cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-text-sub" /> Export PDF Dossier
            </Button>
          </div>
        </div>

        {/* Massive Score Gauge */}
        <div className="relative shrink-0 flex flex-col items-center justify-center p-5 bg-[var(--surface-secondary)]/10 border border-[var(--border)] rounded-xl md:w-52 text-center shadow-inner">
          <span className="text-[10px] text-text-mute font-black uppercase tracking-wider mb-1">Overall Match Rating</span>
          <span className="text-5xl font-display font-black text-text-main leading-none">{session.overallScore}%</span>
          <span className={cn('text-[9px] font-black uppercase tracking-wider px-2 py-0.5 mt-3.5 rounded border', getScoreColor(session.overallScore))}>
            {getScoreLabel(session.overallScore)}
          </span>
          <span className="text-[9.5px] text-primary font-bold mt-4 animate-pulse">+{session.xpEarned} Base XP Earned</span>
        </div>
      </div>

      {/* 3. DIAGNOSTIC DIMENSION SLIDERS & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left: Core score matrices (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">
                Competency Dimension Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              
              {/* Technical score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-text-main">
                  <span>Technical Accuracy</span>
                  <span className="font-mono">{session.technicalScore}%</span>
                </div>
                <div className="w-full bg-[var(--border)]/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${session.technicalScore}%` }} />
                </div>
              </div>

              {/* Communication score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-text-main">
                  <span>Communication Clarity</span>
                  <span className="font-mono">{session.communicationScore}%</span>
                </div>
                <div className="w-full bg-[var(--border)]/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${session.communicationScore}%` }} />
                </div>
              </div>

              {/* Problem Solving score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-text-main">
                  <span>Problem Solving Logic</span>
                  <span className="font-mono">{session.problemSolvingScore}%</span>
                </div>
                <div className="w-full bg-[var(--border)]/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${session.problemSolvingScore}%` }} />
                </div>
              </div>

              {/* Professionalism score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-text-main">
                  <span>Professionalism & Jargon</span>
                  <span className="font-mono">{session.professionalismScore}%</span>
                </div>
                <div className="w-full bg-[var(--border)]/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${session.professionalismScore}%` }} />
                </div>
              </div>

              {/* Leadership score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-text-main">
                  <span>Structure & Methodologies (STAR)</span>
                  <span className="font-mono">{session.leadershipScore}%</span>
                </div>
                <div className="w-full bg-[var(--border)]/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${session.leadershipScore}%` }} />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Active notes bookmark */}
          {session.notes && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" /> Session Private Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)]/10 border border-[var(--border)] text-xs text-text-sub leading-relaxed font-semibold italic">
                  "{session.notes}"
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right: Strengths, Weaknesses, AI remedies, practice plan (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Strengths & Weaknesses Panel */}
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">
                Granular Critique Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-5">
              
              {/* Strengths list */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[11px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Identified Strengths
                </h4>
                <ul className="flex flex-col gap-2">
                  {session.strengths.map((st, idx) => (
                    <li key={idx} className="text-xs text-text-sub leading-relaxed flex items-start gap-2 font-semibold">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      {st}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses list */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border)]/40">
                <h4 className="text-[11px] text-rose-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Critical Technical Gaps
                </h4>
                <ul className="flex flex-col gap-2">
                  {session.weaknesses.map((wk, idx) => (
                    <li key={idx} className="text-xs text-text-sub leading-relaxed flex items-start gap-2 font-semibold">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      {wk}
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* AI Remediation Action Plan */}
          <Card className="border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60 bg-primary/2">
              <div className="flex items-center gap-2">
                <Compass className="w-4.5 h-4.5 text-primary" />
                <div>
                  <CardTitle className="text-sm text-text-main">AI Customized Improvement Roadmap</CardTitle>
                  <CardDescription className="text-xs text-text-mute">Customized guidelines and curriculum recommendations generated instantly by PathPilot.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-text-mute uppercase tracking-wider">Expert Actionable Remedy</span>
                <p className="text-xs text-text-sub leading-relaxed font-semibold">
                  {session.remedy}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)]/40">
                <span className="text-[10px] font-black text-text-mute uppercase tracking-wider mb-1">Target Curriculum Tasks</span>
                <div className="flex flex-col gap-2">
                  {session.practicePlan.map((plan, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/10">
                      <span className="w-4.5 h-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black">{idx + 1}</span>
                      <span className="text-xs text-text-sub font-bold">{plan}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)]/40">
                <span className="text-[10px] font-black text-text-mute uppercase tracking-wider mb-1">Recommended Learning Paths</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {session.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/10 hover:border-primary/20 transition-all duration-150"
                    >
                      <span className="text-[8.5px] font-black text-primary uppercase tracking-widest">{res.type} Resources</span>
                      <span className="text-xs font-black text-text-main mt-0.5 line-clamp-1 flex items-center gap-1">
                        {res.title} <ChevronRight className="w-3 h-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>

      {/* 4. MODAL: THE EXQUISITE OFFICIAL CERTIFICATE DRAWER */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl bg-[var(--surface)] text-center shadow-amber-500/5 flex flex-col"
            >
              <button 
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--surface-secondary)]/20 text-text-mute hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-12 flex flex-col items-center">
                
                {/* Visual Certificate Frame */}
                <div className="w-full border-4 border-double border-amber-500/20 p-6 md:p-8 rounded-2xl relative bg-[var(--surface-secondary)]/10 text-center flex flex-col items-center">
                  
                  {/* Watermark Logo */}
                  <div className="text-3xl filter opacity-40 select-none mb-4">🏆</div>
                  
                  <span className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-[0.2em]">PATHPILOT AI CREDENTIAL REGISTER</span>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-text-main tracking-wide mt-3 md:mt-4">
                    Certificate of Competency
                  </h2>
                  <p className="text-[10px] text-text-mute font-semibold mt-1 max-w-xs">
                    This document verifies structured professional performance score completion.
                  </p>

                  <div className="w-16 h-[1px] bg-amber-500/25 my-5 md:my-6" />

                  <span className="text-[9px] text-text-mute uppercase tracking-wider">THIS IS AWARDED TO THE CANDIDATE FOR PRE-COMPLIANCE AT</span>
                  <span className="text-lg font-black text-text-main mt-1 leading-none uppercase tracking-wide">{session.company}</span>
                  <span className="text-[9.5px] text-text-sub font-bold mt-1">Round: {session.type} ({session.difficulty})</span>

                  <div className="grid grid-cols-3 gap-6 mt-6 md:mt-8 text-center border-t border-[var(--border)]/50 pt-5 w-full max-w-md">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-black text-text-main leading-none">{session.overallScore}%</span>
                      <span className="text-[8px] text-text-mute font-black uppercase tracking-wider mt-1.5">Match Index</span>
                    </div>
                    <div className="flex flex-col border-x border-[var(--border)]/40 px-2">
                      <span className="text-xs font-mono font-bold text-text-main leading-none">
                        {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] text-text-mute font-black uppercase tracking-wider mt-1.5">Date Granted</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-black text-emerald-400 leading-none">VERIFIED</span>
                      <span className="text-[8px] text-text-mute font-black uppercase tracking-wider mt-1.5">Recruiter Sign</span>
                    </div>
                  </div>

                  {/* Visual Gold Seal Badge */}
                  <div className="absolute bottom-[-16px] md:bottom-[-20px] w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 border border-amber-300 shadow-md shadow-amber-500/10 flex items-center justify-center text-xs font-black select-none text-black z-20">
                    SEAL
                  </div>

                </div>

                <div className="flex items-center gap-3 mt-10 md:mt-12 w-full max-w-xs">
                  <Button
                    onClick={() => window.print()}
                    className="flex-1 text-xs font-black h-9 bg-primary text-black cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Credential
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCertificate(false)}
                    className="flex-1 text-xs font-black h-9 cursor-pointer border-[var(--border)] text-text-sub"
                  >
                    Close Panel
                  </Button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
