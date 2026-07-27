/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, AlertCircle, CheckCircle2, BookOpen, Layers, Target, ArrowUpRight, Award, Lightbulb
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { MOCK_MISSING_CONCEPTS } from './mockData';
import { InterviewSession } from './InterviewTypes';

interface InterviewFeedbackHubProps {
  sessions: InterviewSession[];
  onStartPractice: (category?: string) => void;
}

export const InterviewFeedbackHub: React.FC<InterviewFeedbackHubProps> = ({
  sessions,
  onStartPractice
}) => {
  // Aggregate strengths & weaknesses across all historical sessions
  const allStrengths = Array.from(new Set(sessions.flatMap(s => s.strengths || [])));
  const allWeaknesses = Array.from(new Set(sessions.flatMap(s => s.weaknesses || [])));

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Comprehensive Feedback Engine
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            AI Skill Gap Diagnostic & Missing Concepts Hub
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Consolidated evaluation feedback from all interview practice sessions. Pinpoints specific missing technical concepts and prescribes targeted learning material.
          </p>
        </div>
      </div>

      {/* Grid: Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identified Strengths */}
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recruiter Verified Strengths
            </CardTitle>
            <CardDescription className="text-xs text-text-mute">
              Consistently demonstrated competencies across technical and behavioral rounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {allStrengths.length > 0 ? (
              allStrengths.map((str, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs font-semibold text-text-main flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {str}
                </div>
              ))
            ) : (
              <p className="text-xs text-text-mute">Complete mock sessions to generate verified strengths.</p>
            )}
          </CardContent>
        </Card>

        {/* Identified Weaknesses */}
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-sm font-black text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Critical Areas For Growth
            </CardTitle>
            <CardDescription className="text-xs text-text-mute">
              Recurring gaps flagged during technical and architectural evaluations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {allWeaknesses.length > 0 ? (
              allWeaknesses.map((weak, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs font-semibold text-text-main flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {weak}</span>
                  <Button
                    onClick={() => onStartPractice('System Design')}
                    className="text-[10px] font-bold h-6 px-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                  >
                    Drill Topic
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-mute">No critical weaknesses detected in recent sessions.</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Missing Concepts & Prescribed Resources */}
      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Missing Concepts Index & Prescribed Learning
          </CardTitle>
          <CardDescription className="text-xs text-text-mute">
            AI prescribed reading list based on terms missing from your answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {MOCK_MISSING_CONCEPTS.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="text-[10px] font-bold">{item.category}</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold text-rose-400">{item.importance} Importance</Badge>
                </div>
                <h4 className="text-sm font-black text-text-main mt-1">{item.concept}</h4>
                <p className="text-xs text-text-mute">Recommended: {item.recommendedResource.title}</p>
              </div>

              <a
                href={item.recommendedResource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black font-black text-xs shrink-0 self-start md:self-auto"
              >
                Study Material <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};
