/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Code2, Database, Shield, Server, Cpu, Play, CheckCircle2, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { CompanyName, DifficultyLevel, QuestionCategory } from './InterviewTypes';

interface TechnicalInterviewViewProps {
  onStartConfig: (prefill?: { type: any; company: any; difficulty: any; category: any }) => void;
  onLaunchQuestion: (question: any) => void;
}

export const TechnicalInterviewView: React.FC<TechnicalInterviewViewProps> = ({
  onStartConfig,
  onLaunchQuestion
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Backend');

  const domains = [
    { name: 'Backend', icon: Server, desc: 'APIs, relational DB indexing, caching, gRPC, transaction isolation.' },
    { name: 'Frontend', icon: Code2, desc: 'DOM hydration, state management, render optimization, CSS grid, Web Vitals.' },
    { name: 'Databases & SQL', icon: Database, desc: 'B-Trees, ACID guarantees, sharding, query plans, connection pools.' },
    { name: 'Machine Learning & AI', icon: Cpu, desc: 'Transformers, fine-tuning, embeddings, vector databases, inference latency.' },
    { name: 'Cybersecurity & Cloud', icon: Shield, desc: 'OAuth 2.0, TLS 1.3, Kubernetes, IAM policies, zero-trust architecture.' }
  ];

  const sampleTechnicalQuestions = [
    {
      id: 'tq1',
      text: 'Explain how PostgreSQL handles WAL (Write-Ahead Logging) and checkpointing under heavy write workloads.',
      category: 'Databases' as QuestionCategory,
      difficulty: 'Advanced' as DifficultyLevel,
      companies: ['Google' as CompanyName, 'Apple' as CompanyName]
    },
    {
      id: 'tq2',
      text: 'How does Node.js event loop handle phase transitions between poll, check, and timers? What causes event loop starvation?',
      category: 'Coding' as QuestionCategory,
      difficulty: 'Intermediate' as DifficultyLevel,
      companies: ['Meta' as CompanyName, 'Startups' as CompanyName]
    },
    {
      id: 'tq3',
      text: 'Describe the differences between JWTs and Stateful Session Cookies in distributed architectures regarding revocation and security.',
      category: 'Cloud' as QuestionCategory,
      difficulty: 'Intermediate' as DifficultyLevel,
      companies: ['Amazon' as CompanyName, 'Microsoft' as CompanyName]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Zap className="w-3.5 h-3.5 mr-1" /> Technical Deep-Dive Hub
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Specialized Technical Rounds & Architecture Drills
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Sharpen domain-specific technical mastery across backend services, distributed systems, frontend performance, machine learning, and security.
          </p>
        </div>
        <Button
          onClick={() => onStartConfig({ type: 'Technical Interview', company: 'Google', difficulty: 'Advanced', category: 'System Design' })}
          className="text-xs font-black h-10 px-5 flex items-center gap-2 bg-primary text-black cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-black" /> Setup Technical Mock Session
        </Button>
      </div>

      {/* Technical Domains Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((dom, i) => {
          const IconComp = dom.icon;
          const isSelected = selectedDomain === dom.name;
          return (
            <Card
              key={i}
              onClick={() => setSelectedDomain(dom.name)}
              className={`border cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-[var(--border)] bg-[var(--surface)] hover:border-primary/40'}`}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconComp className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <Badge variant="primary" className="text-[10px] font-bold">Active Focus</Badge>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-text-main mt-1">{dom.name}</h3>
                <p className="text-xs text-text-mute leading-relaxed">{dom.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Technical Drills */}
      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Recommended {selectedDomain} Technical Prompts
          </CardTitle>
          <CardDescription className="text-xs text-text-mute">
            Practice questions extracted from real FAANG and top unicorn technical interview rounds.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {sampleTechnicalQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {q.category}
                  </Badge>
                  <Badge variant="primary" className="text-[10px] font-bold">
                    {q.difficulty}
                  </Badge>
                  <span className="text-[10px] text-text-mute font-bold">Companies: {q.companies.join(', ')}</span>
                </div>
                <p className="text-xs font-extrabold text-text-main leading-snug">
                  "{q.text}"
                </p>
              </div>
              <Button
                onClick={() => onLaunchQuestion(q)}
                className="text-xs font-black h-9 px-4 bg-primary text-black shrink-0"
              >
                Practice Question <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};
