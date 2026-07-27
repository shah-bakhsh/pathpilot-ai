/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code2, GitBranch, Terminal, ExternalLink, CheckCircle2,
  Sparkles, Layers, Cpu, Github, ArrowUpRight, Play, Copy, Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface ProjectLearningViewProps {
  addXp: (amount: number) => void;
  targetRole?: string;
}

export const ProjectLearningView: React.FC<ProjectLearningViewProps> = ({
  addXp,
  targetRole = 'Software Engineer'
}) => {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [repoUrl, setRepoUrl] = useState('');
  const [submittingRepo, setSubmittingRepo] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const projects = [
    {
      id: 'proj_1',
      title: 'Distributed In-Memory Rate Limiting Proxy',
      difficulty: 'Industry-Level',
      portfolioValue: 'Essential for Backend Engineers',
      estimatedHours: '15 Hours',
      techStack: ['Node.js', 'Express', 'Redis', 'Docker', 'Jest'],
      architectureSummary: 'High-concurrency reverse proxy enforcing sliding-window rate limits backed by a Redis cluster with atomic Lua script execution.',
      milestones: [
        { title: 'Setup Express server & Redis client connection pool', completed: true },
        { title: 'Write Redis Lua script for atomic sliding window token evaluation', completed: true },
        { title: 'Implement custom Express middleware injecting rate limit headers', completed: false },
        { title: 'Containerize with Docker & write unit tests for edge throttle cases', completed: false }
      ],
      codeSnippet: `// Express Rate Limiter Middleware via Redis Lua Script
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const LUA_SLIDING_WINDOW = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local clearBefore = now - window

  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  local currentRequests = redis.call('ZCARD', key)

  if currentRequests < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return 1
  else
    return 0
  end
\`;

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const allowed = await redis.eval(LUA_SLIDING_WINDOW, 1, \`ratelimit:\${ip}\`, now, 60000, 100);
  if (!allowed) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  next();
}`
    },
    {
      id: 'proj_2',
      title: 'Serverless Real-Time Document Synchronization Engine',
      difficulty: 'Industry-Level',
      portfolioValue: 'High Impact',
      estimatedHours: '20 Hours',
      techStack: ['TypeScript', 'WebSocket', 'Google Cloud Run', 'PostgreSQL', 'Tailwind'],
      architectureSummary: 'Collaborative real-time canvas engine using Operational Transformation (OT) over WebSockets deployed serverless on Google Cloud Run.',
      milestones: [
        { title: 'Configure WebSocket server with auto-heartbeat reconnect', completed: true },
        { title: 'Implement operational transformation for multi-user cursor sync', completed: false },
        { title: 'Deploy container image to Google Cloud Run with IAM auth', completed: false },
        { title: 'Write end-to-end load test simulating 500 concurrent connections', completed: false }
      ],
      codeSnippet: `// WebSocket Reconnection & Delta Dispatch
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3000 });
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('message', (message) => {
    // Broadcast delta to all connected clients except sender
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });
});`
    }
  ];

  const currentProj = projects[activeProjectIdx];

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setSubmittingRepo(true);
    setTimeout(() => {
      setSubmittingRepo(false);
      setFeedback('AI Review Completed: Excellent modularity and Lua script concurrency handling. Code structure matches production engineering standards (+150 XP Awarded)!');
      addXp(150);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentProj.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
              Hands-On Portfolio Blueprints
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Production Engineering Projects
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Build industry-standard capstone projects with system architecture diagrams, starter code, and AI code review.
          </p>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => {
              setActiveProjectIdx(idx);
              setFeedback(null);
            }}
            className={`p-4 rounded-2xl border text-left shrink-0 w-80 transition ${
              activeProjectIdx === idx
                ? 'bg-blue-950/20 border-blue-500/50 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                {proj.difficulty}
              </Badge>
              <span className="text-[10px] text-slate-400">{proj.estimatedHours}</span>
            </div>
            <h4 className="text-xs font-bold leading-snug">{proj.title}</h4>
          </button>
        ))}
      </div>

      {/* Main Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Architecture, Milestones & Code Snippet */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs mb-2">
                    {currentProj.portfolioValue}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white">{currentProj.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-2 leading-relaxed">
                {currentProj.architectureSummary}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">
              {/* Tech Stack Chips */}
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">Required Tech Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {currentProj.techStack.map((tech, idx) => (
                    <Badge key={idx} className="bg-slate-950 text-slate-200 border-slate-800 text-xs py-1 px-3">
                      <Code2 className="w-3.5 h-3.5 mr-1 text-blue-400" /> {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">Implementation Milestones:</span>
                <div className="flex flex-col gap-2">
                  {currentProj.milestones.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-slate-200 font-medium">{m.title}</span>
                      <CheckCircle2 className={`w-4 h-4 ${m.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Code Snippet */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Starter Code Template:</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed">
                  {currentProj.codeSnippet}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Submission & AI Review */}
        <div className="flex flex-col gap-6">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-blue-400" /> GitHub Submission & AI Review
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Submit your repository link for AI architecture evaluation and XP reward.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <form onSubmit={handleSubmitRepo} className="flex flex-col gap-3">
                <Input
                  placeholder="https://github.com/username/project-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={submittingRepo || !repoUrl.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {submittingRepo ? 'Evaluating Repository...' : 'Submit Repository for AI Review'}
                </Button>
              </form>

              {feedback && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 leading-relaxed">
                  <span className="font-bold block mb-1">Feedback Evaluation:</span>
                  {feedback}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
