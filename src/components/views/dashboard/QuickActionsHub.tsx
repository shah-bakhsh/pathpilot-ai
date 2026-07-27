/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Sparkles,
  Bot,
  Video,
  Map,
  Target,
  BookOpen,
  HardDrive,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

export const QuickActionsHub: React.FC = () => {
  const handleNavigate = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  const actions = [
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      desc: 'Build & format quantized technical resumes',
      icon: <FileText className="w-5 h-5 text-primary" />,
      tab: 'resume',
      badge: 'Interactive',
    },
    {
      id: 'resume-ats',
      title: 'Resume Analysis',
      desc: 'ATS score diagnostic & keyword audit',
      icon: <Sparkles className="w-5 h-5 text-accent animate-pulse" />,
      tab: 'resume',
      badge: 'AI Diagnostic',
    },
    {
      id: 'mentor',
      title: 'AI Career Coach',
      desc: 'Interactive 24/7 AI mentoring & guidance',
      icon: <Bot className="w-5 h-5 text-success" />,
      tab: 'mentor',
      badge: 'Gemini 2.5',
    },
    {
      id: 'interview',
      title: 'Interview Simulator',
      desc: 'Mock behavioral & technical rounds',
      icon: <Video className="w-5 h-5 text-warning" />,
      tab: 'interview',
      badge: 'Real-time AI',
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      desc: 'Step-by-step milestone execution map',
      icon: <Map className="w-5 h-5 text-info" />,
      tab: 'roadmap',
      badge: 'Custom GPS',
    },
    {
      id: 'applications',
      title: 'Job Applications',
      desc: 'Kanban pipeline tracker & offer logs',
      icon: <Target className="w-5 h-5 text-primary" />,
      tab: 'applications',
      badge: 'Pipeline',
    },
    {
      id: 'learning',
      title: 'Learning Paths',
      desc: 'Skill courses & hours velocity tracker',
      icon: <BookOpen className="w-5 h-5 text-accent" />,
      tab: 'learning',
      badge: 'Courses',
    },
    {
      id: 'documents',
      title: 'Documents Vault',
      desc: 'Encrypted storage for diplomas & records',
      icon: <HardDrive className="w-5 h-5 text-success" />,
      tab: 'documents',
      badge: 'Vault',
    },
    {
      id: 'opportunities',
      title: 'Saved Opportunities',
      desc: 'Scholarships, internships & job leads',
      icon: <Compass className="w-5 h-5 text-warning" />,
      tab: 'opportunities',
      badge: 'Leads Grid',
    },
  ];

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] hover:shadow-sm transition-shadow duration-300 select-none">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Career Operating System Launchpad
          </CardTitle>
          <span className="text-xs text-text-mute font-semibold">Direct SaaS Workspace Shortcuts</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {actions.map((act) => (
            <motion.button
              key={act.id}
              whileHover={{ y: -2 }}
              onClick={() => handleNavigate(act.tab)}
              className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-primary/30 hover:shadow-xs transition-all duration-200 flex flex-col items-start text-left gap-2.5 group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)] group-hover:bg-primary/10 transition-colors">
                {act.icon}
              </div>

              <div className="flex flex-col min-w-0 w-full">
                <div className="flex items-center justify-between w-full">
                  <h4 className="text-xs font-black text-text-main group-hover:text-primary transition-colors truncate">
                    {act.title}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-text-mute opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0" />
                </div>
                <p className="text-[10px] text-text-sub font-semibold mt-1 leading-snug line-clamp-2">
                  {act.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsHub;
