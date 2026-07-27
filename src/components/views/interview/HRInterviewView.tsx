/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Play, ShieldCheck, HeartHandshake, DollarSign, Award, ArrowRight
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CompanyName, DifficultyLevel, QuestionCategory } from './InterviewTypes';

interface HRInterviewViewProps {
  onStartConfig: (prefill?: { type: any; company: any; difficulty: any; category: any }) => void;
}

export const HRInterviewView: React.FC<HRInterviewViewProps> = ({ onStartConfig }) => {
  const hrScenarios = [
    {
      title: 'Self-Introduction & Elevator Pitch',
      desc: 'Master the 90-second executive introduction connecting your background directly to the company mission.',
      category: 'Self Introduction' as QuestionCategory
    },
    {
      title: 'Culture Alignment & Values',
      desc: 'Demonstrate alignment with remote collaboration, constructive friction, and psychological safety.',
      category: 'Behavioral' as QuestionCategory
    },
    {
      title: 'Career Pivots & Motivations',
      desc: 'Articulate why you are leaving your current employer and why this target role is the optimal career step.',
      category: 'Career Goals' as QuestionCategory
    },
    {
      title: 'Compensation & Expectations',
      desc: 'Tactfully handle salary expectations, equity options, and promotion timelines without locking yourself in.',
      category: 'Communication' as QuestionCategory
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Users className="w-3.5 h-3.5 mr-1" /> Culture & HR Recruiter Hub
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Culture Fit, Recruiter Screen & Salary Negotiation
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Nail initial HR phone screens, communicate your career trajectory with conviction, and handle compensation discussions with poise.
          </p>
        </div>
        <Button
          onClick={() => onStartConfig({ type: 'HR Interview', company: 'Google', difficulty: 'Intermediate', category: 'Self Introduction' })}
          className="text-xs font-black h-10 px-5 flex items-center gap-2 bg-primary text-black cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-black" /> Launch HR Recruiter Mock
        </Button>
      </div>

      {/* Grid of HR Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hrScenarios.map((scen, idx) => (
          <Card key={idx} className="bg-[var(--surface)] border-[var(--border)] hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-primary" /> {scen.title}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {scen.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-text-mute leading-relaxed">{scen.desc}</p>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => onStartConfig({ type: 'HR Interview', company: 'Google', difficulty: 'Intermediate', category: scen.category })}
                  className="text-xs font-bold h-8 px-3 bg-primary text-black"
                >
                  Practice Module <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};
