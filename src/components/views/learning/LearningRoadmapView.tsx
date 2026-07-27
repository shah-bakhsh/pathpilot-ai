/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers, CheckCircle2, Circle, Clock, ArrowRight, Sparkles, BookOpen,
  Award, ExternalLink, Plus, RefreshCw, ChevronDown, ChevronUp, Code2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface LearningRoadmapViewProps {
  onGenerateSyllabus: (topic: string) => Promise<any>;
  generatingSyllabus: boolean;
  generatedSyllabus: any;
  addXp: (amount: number) => void;
  targetRole?: string;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({
  onGenerateSyllabus,
  generatingSyllabus,
  generatedSyllabus,
  addXp,
  targetRole = 'Software Engineer'
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'les_1_1': true,
    'les_1_2': true,
    'les_2_1': true,
  });

  const defaultPhases = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Foundations & Core Language Mechanics',
      duration: '3 Weeks (20 Hours)',
      description: 'Master core language syntax, memory management, asynchronous runtimes, and clean code principles.',
      status: 'completed',
      modules: [
        {
          id: 'mod_1',
          title: 'Advanced TypeScript & Type System Precision',
          resource: 'Official TypeScript Documentation & Type Challenges',
          url: 'https://www.typescriptlang.org',
          lessons: [
            { id: 'les_1_1', title: 'Generics, Conditional Types & Template Literal Types' },
            { id: 'les_1_2', title: 'Discriminated Unions & Exhaustive Type Checking' },
            { id: 'les_1_3', title: 'Decorators, Metadata Reflection & Type Stripping' }
          ]
        },
        {
          id: 'mod_2',
          title: 'Asynchronous Programming & Event Loop Mechanics',
          resource: 'Node.js Internals & Event Loop Deep Dive',
          url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick',
          lessons: [
            { id: 'les_2_1', title: 'Event Loop Phases (Timers, Poll, Check, Close Callbacks)' },
            { id: 'les_2_2', title: 'Promises, Async/Await microtasks vs macrotasks' },
            { id: 'les_2_3', title: 'Worker Threads & SharedArrayBuffer Concurrency' }
          ]
        }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Backend Microservices & Data Architecture',
      duration: '4 Weeks (35 Hours)',
      description: 'Architect scalable Express/Node.js microservices with PostgreSQL relational schema design and Redis caching.',
      status: 'in_progress',
      modules: [
        {
          id: 'mod_3',
          title: 'Relational Schema Design & Query Optimization',
          resource: 'PostgreSQL High Performance Indexing Guide',
          url: 'https://www.postgresql.org/docs',
          lessons: [
            { id: 'les_3_1', title: 'B-Tree, GIN & GiST Indexing Strategies' },
            { id: 'les_3_2', title: 'ACID Transactions, Locking & MVCC Isolation Levels' },
            { id: 'les_3_3', title: 'EXPLAIN ANALYZE & Query Cost Optimization' }
          ]
        },
        {
          id: 'mod_4',
          title: 'High-Throughput Caching & Distributed Mutex Locks',
          resource: 'Redis University - Microservices Caching',
          url: 'https://redis.io/university',
          lessons: [
            { id: 'les_4_1', title: 'Redis In-Memory Data Structures (Hashes, Sorted Sets, HyperLogLogs)' },
            { id: 'les_4_2', title: 'Cache Invalidation Strategies (Cache-Aside vs Write-Through)' },
            { id: 'les_4_3', title: 'Distributed Rate Limiting (Token Bucket & Leaky Bucket)' }
          ]
        }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: System Design & Distributed Cloud Infrastructure',
      duration: '5 Weeks (45 Hours)',
      description: 'Build fault-tolerant distributed systems, multi-region deployments on Google Cloud Run, and event streaming.',
      status: 'upcoming',
      modules: [
        {
          id: 'mod_5',
          title: 'Google Cloud Run & Container Orchestration',
          resource: 'Google Cloud Run Architecture Blueprints',
          url: 'https://cloud.google.com/run',
          lessons: [
            { id: 'les_5_1', title: 'Multi-Stage Dockerfile Optimization & Security Scanning' },
            { id: 'les_5_2', title: 'Serverless Scaling to Zero, Concurrency & Warmup Probes' },
            { id: 'les_5_3', title: 'CI/CD Automated Deployment Pipelines via GitHub Actions' }
          ]
        },
        {
          id: 'mod_6',
          title: 'Distributed System Reliability & Consensus',
          resource: 'ByteByteGo & Designing Data-Intensive Applications',
          url: 'https://bytebytego.com',
          lessons: [
            { id: 'les_6_1', title: 'CAP Theorem, PACELC & Eventual Consistency Models' },
            { id: 'les_6_2', title: 'Message Queues (RabbitMQ, Kafka) & Asynchronous Processing' },
            { id: 'les_6_3', title: 'Distributed Consensus (Raft, Paxos) & Leader Election' }
          ]
        }
      ]
    }
  ];

  const handleToggleLesson = (id: string) => {
    setCompletedLessons(prev => {
      const nextState = !prev[id];
      if (nextState) {
        addXp(15);
      }
      return { ...prev, [id]: nextState };
    });
  };

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onGenerateSyllabus(customTopic);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
              Curriculum Roadmap
            </Badge>
            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
              Target Role: {targetRole}
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Personalized Master Roadmap
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Structured, step-by-step technical progression from core fundamentals to advanced distributed systems.
          </p>
        </div>

        {/* Custom AI Syllabus Generator Form */}
        <form onSubmit={handleGenerateCustom} className="w-full md:w-auto flex items-center gap-2 bg-slate-950 p-2 border border-slate-800 rounded-2xl">
          <Input
            placeholder="e.g., GraphQL API Design..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="border-none bg-transparent text-xs text-white placeholder-slate-500 focus:ring-0 w-48 md:w-64"
          />
          <Button
            type="submit"
            size="sm"
            disabled={generatingSyllabus || !customTopic.trim()}
            className="flex items-center gap-1.5 shrink-0"
          >
            {generatingSyllabus ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-300" />}
            AI Syllabus
          </Button>
        </form>
      </div>

      {/* AI Generated Custom Syllabus Output */}
      {generatedSyllabus && (
        <Card className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border-indigo-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs">
                AI Custom Syllabus
              </Badge>
              <span className="text-xs text-slate-400 font-semibold">
                Estimated Duration: {generatedSyllabus.estimatedHoursTotal} Hours
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-white mt-1">
              {generatedSyllabus.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedSyllabus.modules?.map((mod: any, idx: number) => (
              <div key={mod.id || idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-extrabold text-indigo-400">Module {idx + 1}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{mod.durationHours} Hours</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{mod.moduleTitle}</h4>
                  <ul className="flex flex-col gap-1.5 mb-3">
                    {mod.lessons?.map((les: string, lIdx: number) => (
                      <li key={lIdx} className="text-xs text-slate-300 flex items-center gap-2">
                        <Code2 className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{les}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {mod.recommendedResource && (
                  <a
                    href={mod.resourceUrl || 'https://google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-2 border-t border-slate-900"
                  >
                    <span>{mod.recommendedResource}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Default Roadmap Phases List */}
      <div className="flex flex-col gap-4">
        {defaultPhases.map((phase) => {
          const isExpanded = expandedPhase === phase.phaseNumber;
          const isCompleted = phase.status === 'completed';
          const isInProgress = phase.status === 'in_progress';

          return (
            <Card
              key={phase.phaseNumber}
              className={`bg-slate-900/40 border transition-all ${
                isInProgress
                  ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800'
              }`}
            >
              <CardHeader
                onClick={() => setExpandedPhase(isExpanded ? null : phase.phaseNumber)}
                className="cursor-pointer flex flex-row items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-white">{phase.title}</CardTitle>
                      <Badge
                        className={`text-[10px] uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isInProgress
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {phase.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">
                      {phase.duration} • {phase.description}
                    </CardDescription>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 border-t border-slate-800/60 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {phase.modules.map((mod) => (
                      <div key={mod.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="text-xs font-bold text-white">{mod.title}</h4>
                          </div>

                          <div className="flex flex-col gap-2 my-3">
                            {mod.lessons.map((les) => {
                              const checked = !!completedLessons[les.id];
                              return (
                                <button
                                  key={les.id}
                                  onClick={() => handleToggleLesson(les.id)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition ${
                                    checked
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span className="text-xs font-medium">{les.title}</span>
                                  {checked ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <a
                          href={mod.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-2 border-t border-slate-900"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{mod.resource}</span>
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
