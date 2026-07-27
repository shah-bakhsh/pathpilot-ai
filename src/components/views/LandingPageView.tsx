/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { PathPilotLogo } from '../ui/PathPilotLogo';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Brain,
  Award,
  Clock,
  BookOpen,
  Map,
  Users,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  Play,
  FileText,
  User,
  AlertCircle,
  Star,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  Lock,
  Mail
} from 'lucide-react';

// Meta definitions for SEO (Section 14)
export const LANDING_PAGE_SEO = {
  title: 'PathPilot AI - Navigate Your Career With AI',
  description: 'PathPilot AI is an AI-powered Career Operating System. Analyze resumes, bridge skill gaps, generate continuous roadmaps, and practice mock interviews.',
  openGraph: {
    title: 'PathPilot AI | The AI Career Operating System',
    description: 'Map out your career trajectory with automated resume keyword diagnostics, active skill roadmaps, and mock interviews.',
    type: 'website',
  }
};

export const LandingPageView: React.FC = () => {
  const { loginAsGuest, loginWithEmail, signUpWithEmail, resetPassword, resendVerificationEmail } = useAuth();

  // Dialog & Navigation states
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Auth states (Section 1 & 2)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | 'welcome'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [onboardingName, setOnboardingName] = useState<string>('');
  const [onboardingGoal, setOnboardingGoal] = useState<string>('Software Engineer - Backend');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Interactive Mock Dashboard demo states (Section 8)
  const [demoActiveTab, setDemoActiveTab] = useState<'diagnostic' | 'roadmap' | 'interview' | 'mentor'>('diagnostic');
  const [demoScore, setDemoScore] = useState<number>(68);
  const [demoMilestones, setDemoMilestones] = useState([
    { id: 1, text: 'Master TypeScript Advanced Generics & Utility Types', checked: true },
    { id: 2, text: 'Integrate Docker & Build Containerized Microservices', checked: false },
    { id: 3, text: 'Optimize SQL Indexing & Database Query Execution Plans', checked: false },
  ]);
  const [demoInterviewAnswer, setDemoInterviewAnswer] = useState<string>('');
  const [demoInterviewScore, setDemoInterviewScore] = useState<number | null>(null);
  const [demoMentorMessages, setDemoMentorMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hello! I noticed your profile lacks Docker experience. I suggest building a containerized side-project. Would you like a prompt?' }
  ]);
  const [demoMentorInput, setDemoMentorInput] = useState<string>('');
  const [demoIsTyping, setDemoIsTyping] = useState<boolean>(false);

  // Keyboard navigation helpers
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Onboarding submissions
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingName.trim()) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginAsGuest(onboardingName.trim(), onboardingGoal);
    } catch (err: any) {
      setAuthError(err.message || 'Error configuring simulator guest.');
    } finally {
      setIsSubmitting(false);
      setIsOnboardingOpen(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!authEmail.trim() || !authPassword) {
          throw new Error('Please enter both email and password.');
        }
        await loginWithEmail(authEmail.trim(), authPassword);
      } else if (authMode === 'signup') {
        if (!authEmail.trim() || !authPassword || !authName.trim()) {
          throw new Error('Please fill in all registration fields.');
        }
        if (authPassword.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (authPassword !== authConfirmPassword) {
          throw new Error('Passwords do not match. Please verify your password entry.');
        }
        await signUpWithEmail(authEmail.trim(), authPassword, authName.trim());
        setAuthSuccess('Account created successfully! Welcome to PathPilot AI.');
        setAuthMode('welcome');
      } else if (authMode === 'forgot') {
        if (!authEmail.trim()) {
          throw new Error('Please enter your account email address.');
        }
        await resetPassword(authEmail.trim());
        setAuthSuccess('Password recovery email dispatched successfully. Please check your inbox.');
        setAuthMode('verify');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!authEmail.trim()) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await resendVerificationEmail(authEmail.trim());
      setAuthSuccess('Verification link resent to ' + authEmail.trim());
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend verification email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Careers list
  const careers = [
    'Software Engineer - Backend',
    'Software Engineer - Frontend',
    'DevOps / Cloud Architect',
    'Data Scientist',
    'AI Solutions Engineer',
    'Technical Product Manager',
  ];

  // Helper function to animate interactive mock dashboard components
  const handleCompleteDemoMilestone = (id: number) => {
    setDemoMilestones(prev =>
      prev.map(m => (m.id === id ? { ...m, checked: !m.checked } : m))
    );
  };

  const handleDemoInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInterviewAnswer.trim()) return;
    setDemoInterviewScore(88);
  };

  const handleSendDemoMentorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoMentorInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: demoMentorInput };
    setDemoMentorMessages(prev => [...prev, userMsg]);
    setDemoMentorInput('');
    setDemoIsTyping(true);

    setTimeout(() => {
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Great initiative! Here is a plan: Create a multi-container Docker Setup with Node.js and Redis. Then write a Dockerfile and docker-compose.yml configuration. This will unlock the "Container Orchestration" milestone on your PathPilot roadmap!'
      };
      setDemoMentorMessages(prev => [...prev, assistantMsg]);
      setDemoIsTyping(false);
    }, 1200);
  };

  // Reset interactive states periodically
  useEffect(() => {
    const totalCompleted = demoMilestones.filter(m => m.checked).length;
    const baseScore = 60;
    setDemoScore(baseScore + totalCompleted * 10);
  }, [demoMilestones]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-main)] overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* SECTION 1: Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-btn p-1 group">
            <div className="transition-transform group-hover:scale-105">
              <PathPilotLogo size={38} />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-text-main flex items-center gap-1.5">
                PathPilot AI
              </span>
              <span className="text-[9px] font-mono tracking-widest text-text-mute font-bold uppercase">Career Operating System</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-sub">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">Features</a>
            <a href="#problem" className="hover:text-primary transition-colors cursor-pointer">The Problem</a>
            <a href="#solution" className="hover:text-primary transition-colors cursor-pointer">The Solution</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors cursor-pointer">How It Works</a>
            <a href="#dashboard-demo" className="hover:text-primary transition-colors cursor-pointer">Interactive Demo</a>
            <a href="#faq" className="hover:text-primary transition-colors cursor-pointer">FAQ</a>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs font-bold text-text-sub hover:text-text-main px-3 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-bold cursor-pointer hover:scale-102 transition-transform"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 h-9 w-9 flex items-center justify-center text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 py-6 flex flex-col gap-4 shadow-lg overflow-hidden"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                Features
              </a>
              <a
                href="#problem"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                The Problem
              </a>
              <a
                href="#solution"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                The Solution
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                How It Works
              </a>
              <a
                href="#dashboard-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                Interactive Demo
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-text-sub hover:text-primary py-1"
              >
                FAQ
              </a>
              <hr className="border-[var(--border)]/60 my-1" />
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { setMobileMenuOpen(false); setIsOnboardingOpen(true); }}
                  className="w-full font-bold text-xs"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => { setMobileMenuOpen(false); setIsOnboardingOpen(true); }}
                  className="w-full font-bold text-xs"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SECTION 2: Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient background glow structures */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none ambient-glow opacity-60" />
        <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          {/* Badge accent */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 text-primary border border-primary/15 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-accent animate-spin-slow" /> Version 2.0 Launch Event
            </span>
          </motion.div>

          {/* Headline & Subheadline */}
          <div className="text-center max-w-3xl mb-8 flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-text-main tracking-tight leading-none"
            >
              Navigate Your Career <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">With Autonomous AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-text-sub font-medium max-w-2xl mx-auto leading-relaxed"
            >
              PathPilot AI is an AI-powered Career Operating System. Map precise navigation coordinates, audit resumes against real requirements, close skill gaps, and transition effortlessly.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16 w-full max-w-sm sm:max-w-none"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full sm:w-auto font-bold shadow-xl hover:scale-103 transition-transform"
              leftIcon={<PathPilotLogo size={18} />}
            >
              Calibrate Career Coordinates
            </Button>
            <a href="#dashboard-demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-bold border-[var(--border)]"
                leftIcon={<Play className="w-4 h-4 text-text-mute" />}
              >
                Explore Platform Preview
              </Button>
            </a>
          </motion.div>

          {/* Interactive Floating Card Mockups around dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            {/* Visual Frame for Demo Dashboard mockup */}
            <div className="relative rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden bg-[var(--surface)] p-2">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--hover-tint)]/40 rounded-t-xl shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-[10px] text-text-mute font-mono ml-4 font-bold">pathpilot.ai/workspace/alex-mercer</span>
              </div>
              <div className="aspect-[16/10] w-full bg-[var(--background)] p-4 flex flex-col gap-4">
                
                {/* Simulated mini dashboard dashboard */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">AM</div>
                    <div>
                      <p className="text-xs font-bold text-text-main">Alex Mercer</p>
                      <p className="text-[9px] text-text-mute">Trajectory: Backend Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">Level 4 Pathfinder</Badge>
                    <span className="text-[10px] font-mono font-bold text-primary">3,420 XP</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                  
                  {/* Card 1: Diagnostic */}
                  <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)]/75 rounded-card flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Career Readiness</span>
                      <Target className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-display font-extrabold text-primary">82%</span>
                      <span className="text-[9px] text-success font-bold">+14% since last upload</span>
                    </div>
                    <div className="w-full bg-[var(--hover-tint)] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[82%]" />
                    </div>
                  </div>

                  {/* Card 2: Missing Keywords */}
                  <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)]/75 rounded-card flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Skill Gap Analytics</span>
                      <Brain className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 justify-center">
                      <div className="flex items-center justify-between text-[10px] text-text-sub">
                        <span>TypeScript Generics</span>
                        <span className="text-success font-semibold">Found</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-text-sub">
                        <span>Docker Containers</span>
                        <span className="text-error font-semibold">Missing</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-text-sub">
                        <span>System Design</span>
                        <span className="text-warning font-semibold">In Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: AI Interview Score */}
                  <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)]/75 rounded-card flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-text-mute uppercase tracking-wider">Mock Interview Logs</span>
                      <Award className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-display font-extrabold text-secondary">88<span className="text-xs text-text-mute">/100</span></span>
                    </div>
                    <p className="text-[10px] text-text-mute leading-snug">Excellent system design structure. Solid understanding of replication models.</p>
                  </div>
                </div>

                {/* Simulated active roadmap timeline */}
                <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Map className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-text-main">Active Milestone: Docker Containers</p>
                      <p className="text-[9px] text-text-mute">Phase 2: Core Engineering Architecture</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] px-2.5 font-bold">
                    Mark Complete (+100 XP)
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-6 -left-10 bg-[var(--surface)] border border-[var(--border)] shadow-xl p-3.5 rounded-xl hidden lg:flex items-center gap-3 w-48"
            >
              <div className="p-2 bg-success/10 text-success rounded-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-mute uppercase">Resume Verified</p>
                <p className="text-[11px] font-bold text-text-main">Passed ATS Checkers</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-6 -right-10 bg-[var(--surface)] border border-[var(--border)] shadow-xl p-3.5 rounded-xl hidden lg:flex items-center gap-3 w-52"
            >
              <div className="p-2 bg-accent/10 text-accent rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-mute uppercase">Coach Instruction</p>
                <p className="text-[11px] font-bold text-text-main">"Focus on Docker Compose files"</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Social Proof / Trusted By */}
      <section className="py-12 border-y border-[var(--border)] bg-[var(--hover-tint)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-[10px] font-mono font-bold tracking-widest text-text-mute uppercase">
              POWERING CAREERS AT WORLD-CLASS TECHNOLOGY INSTITUTIONS
            </p>
          </div>

          {/* Grid of future company placeholders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-65 grayscale hover:grayscale-0 transition-all">
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Compass className="w-4 h-4 text-primary" /> Google
            </span>
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Shield className="w-4 h-4 text-secondary" /> Stripe
            </span>
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Zap className="w-4 h-4 text-accent" /> Vercel
            </span>
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Target className="w-4 h-4 text-primary" /> Notion
            </span>
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Brain className="w-4 h-4 text-secondary" /> Figma
            </span>
            <span className="font-display font-extrabold text-sm tracking-tight text-text-mute hover:text-text-main transition-colors flex items-center gap-1.5 select-none">
              <Compass className="w-4 h-4 text-accent" /> Linear
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-[var(--border)]/50">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-extrabold text-primary">48,291+</p>
              <p className="text-[10px] font-mono font-bold text-text-mute uppercase mt-1">Paths Charted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-extrabold text-secondary">250K+</p>
              <p className="text-[10px] font-mono font-bold text-text-mute uppercase mt-1">Resumes Audited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-extrabold text-accent">1.2M+</p>
              <p className="text-[10px] font-mono font-bold text-text-mute uppercase mt-1">AI Recommendations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-extrabold text-text-main">94.8%</p>
              <p className="text-[10px] font-mono font-bold text-text-mute uppercase mt-1">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Problem Section */}
      <section id="problem" className="py-20 md:py-28 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-error">The Obstacle</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight">
              Why Modern Career Planning is Unfairly Broken
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Traditional career progression is a dark, uncertain room. Job seekers are bombarded with contradictory advice, generic bullet points, and recruiter algorithms that ignore genuine potential.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Traditional path column */}
            <div className="p-6 md:p-8 rounded-2xl border border-error/15 bg-error/[0.01] flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                  <X className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-text-main">The Traditional Blackbox Path</h3>
                  <p className="text-[10px] text-text-mute">Manual, static, and isolating</p>
                </div>
              </div>
              <ul className="flex flex-col gap-4 text-xs text-text-sub flex-1">
                <li className="flex gap-3 items-start leading-snug">
                  <AlertCircle className="w-4.5 h-4.5 text-error shrink-0" />
                  <span><strong>Blind Keyword Stuffing:</strong> Guessing what applicant tracking systems want, resulting in countless rejected templates.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <AlertCircle className="w-4.5 h-4.5 text-error shrink-0" />
                  <span><strong>Disorganized Tutorials:</strong> Sifting through random courses without clear learning roadmaps or cohesive validation milestones.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <AlertCircle className="w-4.5 h-4.5 text-error shrink-0" />
                  <span><strong>Frozen Mock Interviews:</strong> Costly platforms with pre-recorded questions that offer zero dynamic feedback or conceptual growth tips.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <AlertCircle className="w-4.5 h-4.5 text-error shrink-0" />
                  <span><strong>Isolated Navigation:</strong> Zero feedback loop to verify if your daily side-projects actually improve your career readiness weight.</span>
                </li>
              </ul>
            </div>

            {/* PathPilot path column */}
            <div className="p-6 md:p-8 rounded-2xl border border-primary/15 bg-primary/[0.01] flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Compass className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-text-main">The PathPilot Career GPS</h3>
                  <p className="text-[10px] text-text-mute">Continuous, aligned, and actionable</p>
                </div>
              </div>
              <ul className="flex flex-col gap-4 text-xs text-text-sub flex-1">
                <li className="flex gap-3 items-start leading-snug">
                  <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                  <span><strong>Deep Alignment Diagnostic:</strong> Direct resume scans against live career coordinates to isolate precise structural and keywords gaps.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                  <span><strong>Automated Milestone Roadmaps:</strong> Instant phases and curated resource pathways configured exclusively for your coordinate destination.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                  <span><strong>Interactive AI Mock Interviews:</strong> Dynamic tech screens with active grading metrics, system logs, and granular performance reports.</span>
                </li>
                <li className="flex gap-3 items-start leading-snug">
                  <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                  <span><strong>1-on-1 AI Mentorship:</strong> A supportive, round-the-clock coaching dialogue with prompt indicators that responds natively in secure Markdown.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Solution Section */}
      <section id="solution" className="py-20 md:py-28 bg-[var(--background)] relative">
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">The Core Concept</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight leading-tight">
                An Intelligent Navigation System for Professional Growth
              </h2>
              <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
                PathPilot AI replaces fragmented tools with a single continuous workspace. By syncing your resume gaps with structured milestones, it acts as your personal career GPS.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Career Coordinates Calibration</h4>
                    <p className="text-[11px] text-text-sub mt-0.5 leading-normal">Pick from predefined tracks or declare custom target milestones. The simulator re-calibrates immediately.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Adaptive Skill Gap Analytics</h4>
                    <p className="text-[11px] text-text-sub mt-0.5 leading-normal">Compare missing and found keywords, highlighting exact certifications and skills to gain placement traction.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Gamified Experience Progress</h4>
                    <p className="text-[11px] text-text-sub mt-0.5 leading-normal">Complete daily learning missions to earn XP and rank up. Transform cold starts into structured success.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Card className="bg-[var(--surface)] border-[var(--border)]/70 shadow-sm">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Target className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-text-main">Career GPS</h3>
                    <p className="text-[11px] text-text-sub leading-relaxed">Continuous coordinate alignment ensures every resume edit and learning module gets you closer to high-paying offers.</p>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--surface)] border-[var(--border)]/70 shadow-sm">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                      <MessageSquare className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-text-main">AI Coach & Mentor</h3>
                    <p className="text-[11px] text-text-sub leading-relaxed">Round-the-clock career strategist ready to construct side-project outlines or debug system architecture concepts.</p>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--surface)] border-[var(--border)]/70 shadow-sm">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-text-main">Skill Gap Diagnostics</h3>
                    <p className="text-[11px] text-text-sub leading-relaxed">Direct parser isolation. Compares key technology frameworks to highlight exact keywords lacking on-page density.</p>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--surface)] border-[var(--border)]/70 shadow-sm">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-text-main">Active Daily Missions</h3>
                    <p className="text-[11px] text-text-sub leading-relaxed">Convert large, overwhelming goals into a series of actionable, bite-sized tasks that reward you with verifiable experience.</p>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: Features Grid */}
      <section id="features" className="py-20 md:py-28 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">Engine Capabilities</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight animate-fade-in">
              Crafted Features for Elite Career Scaling
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Every card below is engineered with visual precision, hover feedback, and accessibility considerations. We do not tolerate generic grids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-primary/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-primary transition-colors flex items-center gap-1.5">
                  AI Career GPS
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Target custom goals. Calculates precise training milestones to bridge current experience gaps effortlessly.
                </p>
              </div>
              <div className="text-[10px] font-bold text-primary mt-auto flex items-center gap-1">
                <span>Calibrate destination</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-secondary/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-secondary transition-colors flex items-center gap-1.5">
                  Resume Alignment Diagnostic
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Parse details using secure algorithms to score resume readiness against keyword density baselines.
                </p>
              </div>
              <div className="text-[10px] font-bold text-secondary mt-auto flex items-center gap-1">
                <span>View resume score</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-accent/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-accent transition-colors flex items-center gap-1.5">
                  Skill Gap Extraction
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Identify specific technology gaps (e.g. Docker, Redis) and match with high-contrast learning resources.
                </p>
              </div>
              <div className="text-[10px] font-bold text-accent mt-auto flex items-center gap-1">
                <span>Close structural gaps</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-primary/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Map className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-primary transition-colors flex items-center gap-1.5">
                  Personalized Roadmaps
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Receive structured phase breakdowns and time-to-complete metrics mapped dynamically to your profile.
                </p>
              </div>
              <div className="text-[10px] font-bold text-primary mt-auto flex items-center gap-1">
                <span>Unfold learning phases</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-secondary/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-secondary transition-colors flex items-center gap-1.5">
                  Interactive AI Interviews
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Participate in live-simulated technical screens. Earn experience points (XP) for answering deep conceptual prompts.
                </p>
              </div>
              <div className="text-[10px] font-bold text-secondary mt-auto flex items-center gap-1">
                <span>Start tech screen</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 rounded-2xl border border-[var(--border)] hover:border-accent/40 bg-[var(--surface)] transition-all duration-300 shadow-xs flex flex-col gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-text-main group-hover:text-accent transition-colors flex items-center gap-1.5">
                  24/7 AI Mentorship Chat
                </h3>
                <p className="text-[11px] text-text-sub leading-normal">
                  Chat with a specialized technical counselor. Formatted in clear Markdown for deep conceptual readability.
                </p>
              </div>
              <div className="text-[10px] font-bold text-accent mt-auto flex items-center gap-1">
                <span>Ask coaching prompts</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[var(--background)] relative border-t border-[var(--border)]">
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">Execution Sequence</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight">
              The PathFinder Onboarding Sequence
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Unlock a continuous feedback loop in six structural phases. Watch your alignment coordinates update in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-black text-sm border border-primary/25">
                01
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">Create Account</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Establish coordinates using secure Google credentials or custom guest name coordinates.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-display font-black text-sm border border-secondary/25">
                02
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">Upload Resume</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Drag and drop raw text files into our direct parsing engine with Zero tracking scripts.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-display font-black text-sm border border-accent/25">
                03
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">AI Diagnostics</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Our secure Gemini API maps your technology alignment rating against live marketplace requirements.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-black text-sm border border-primary/25">
                04
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">Career Roadmap</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Get instant, custom-tailored learning phases packed with vetted open-source learning links.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-display font-black text-sm border border-secondary/25">
                05
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">Daily Missions</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Earn experience points (XP) for verifying skills, completing tutorials, and solving questions.</p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-display font-black text-sm border border-accent/25">
                06
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-main">Track Progress</h4>
                <p className="text-[11px] text-text-sub mt-1 leading-normal">Watch your Readiness Score tick upward as you mark milestones complete and master interviews.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8: Interactive Product Preview (Dashboard Simulator!) */}
      <section id="dashboard-demo" className="py-20 md:py-28 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">Interactive Playground</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight">
              Test-Drive the PathPilot AI Core
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Interact directly with this live mock dashboard. Toggle tabs, complete milestones, solve interview questions, or ask the AI Coach. Watch the alignment score update.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Control Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="h-full bg-[var(--hover-tint)]/15 border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-sm">Platform Navigation</CardTitle>
                  <CardDescription className="text-[11px]">Select a component view below to interact with our mock AI core engine.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setDemoActiveTab('diagnostic')}
                    className={`w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between cursor-pointer outline-none ${
                      demoActiveTab === 'diagnostic'
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)]/65 text-text-sub hover:bg-[var(--hover-tint)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs">Resume Diagnostic</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-primary/10 px-2 py-0.5 rounded-full">{demoScore}% Score</span>
                  </button>

                  <button
                    onClick={() => setDemoActiveTab('roadmap')}
                    className={`w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between cursor-pointer outline-none ${
                      demoActiveTab === 'roadmap'
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)]/65 text-text-sub hover:bg-[var(--hover-tint)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Map className="w-4 h-4" />
                      <span className="text-xs">Learning Roadmap</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      {demoMilestones.filter(m => m.checked).length}/{demoMilestones.length} Done
                    </span>
                  </button>

                  <button
                    onClick={() => setDemoActiveTab('interview')}
                    className={`w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between cursor-pointer outline-none ${
                      demoActiveTab === 'interview'
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)]/65 text-text-sub hover:bg-[var(--hover-tint)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4" />
                      <span className="text-xs">Mock Interview</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      {demoInterviewScore ? 'Graded' : 'Solve App'}
                    </span>
                  </button>

                  <button
                    onClick={() => setDemoActiveTab('mentor')}
                    className={`w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between cursor-pointer outline-none ${
                      demoActiveTab === 'mentor'
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)]/65 text-text-sub hover:bg-[var(--hover-tint)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs">AI Mentorship Chat</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-text-mute/10 text-text-mute px-2 py-0.5 rounded-full">Active</span>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Preview Canvas (8 cols) */}
            <div className="lg:col-span-8">
              <Card className="h-full bg-[var(--background)] border-[var(--border)] p-4 sm:p-6 min-h-[380px] flex flex-col overflow-hidden relative">
                
                {/* Active view title banner */}
                <div className="flex items-center justify-between border-b border-[var(--border)]/85 pb-3 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                    <span className="text-[10px] font-mono font-black text-text-mute uppercase tracking-widest">
                      {demoActiveTab === 'diagnostic' && 'Telemetry: Resume Alignment Analytics'}
                      {demoActiveTab === 'roadmap' && 'Telemetry: Milestones Coordinates'}
                      {demoActiveTab === 'interview' && 'Telemetry: Interactive Technical Assessment'}
                      {demoActiveTab === 'mentor' && 'Telemetry: Secure Markdown AI Dialogue'}
                    </span>
                  </div>
                  <Badge variant="neutral" className="text-[9px] font-bold">PathPilot AI Online</Badge>
                </div>

                {/* Sub-view Content Canvas */}
                <div className="flex-1 overflow-y-auto pr-1">
                  
                  {/* Tab 1: Diagnostic */}
                  {demoActiveTab === 'diagnostic' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]/65">
                        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-[6px] border-primary/10 bg-primary/2 shrink-0 relative">
                          <span className="text-2xl font-display font-extrabold text-primary">
                            {demoScore}%
                          </span>
                          <span className="text-[8px] text-text-mute font-bold tracking-tight mt-0.5">ALIGNMENT</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 text-center md:text-left">
                          <h4 className="text-xs font-bold text-text-main">Backend Engineer Calibration Score</h4>
                          <p className="text-[11px] text-text-mute leading-relaxed">
                            Your current resume alignment score is calculated based on technologies matched in our database. Complete more roadmap milestones to scale this score to 95%+.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)]/65 rounded-xl flex flex-col gap-2">
                          <p className="text-[10px] font-bold text-success uppercase tracking-wider">Identified Keywords</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {['TypeScript', 'React', 'Node.js', 'Express', 'SQL'].map((kw) => (
                              <span key={kw} className="px-2 py-0.5 bg-success/8 text-success text-[9px] font-semibold rounded border border-success/10">{kw}</span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)]/65 rounded-xl flex flex-col gap-2">
                          <p className="text-[10px] font-bold text-error uppercase tracking-wider">Missing Technology Gaps</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {['Docker Containers', 'CI/CD Pipelines', 'Redis Cluster', 'Kubernetes'].map((kw) => (
                              <span key={kw} className="px-2 py-0.5 bg-error/8 text-error text-[9px] font-semibold rounded border border-error/10">{kw}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Roadmap */}
                  {demoActiveTab === 'roadmap' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="p-3.5 bg-primary/4 border border-primary/10 rounded-xl">
                        <p className="text-[11px] text-text-sub font-semibold leading-relaxed">
                          Click checkboxes below to mark mock milestones as complete. Watch the overall alignment score in the sidebar recalculate automatically.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {demoMilestones.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleCompleteDemoMilestone(m.id)}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                              m.checked
                                ? 'bg-success/[0.02] border-success/20 shadow-xs'
                                : 'bg-[var(--surface)] border-[var(--border)]/70 hover:border-primary/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={m.checked}
                              readOnly
                              className="mt-0.5 w-4 h-4 rounded border-[var(--border)] text-primary focus:ring-primary/40 cursor-pointer"
                            />
                            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                              <span className={`text-[11px] font-semibold leading-relaxed ${m.checked ? 'text-text-mute line-through' : 'text-text-sub'}`}>
                                {m.text}
                              </span>
                              <span className="text-[9px] text-text-mute font-medium flex items-center gap-1 mt-0.5">
                                <BookOpen className="w-3 h-3 text-primary shrink-0" /> Open-source curriculum guide attached
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Interview */}
                  {demoActiveTab === 'interview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4.5 h-4.5 text-primary" />
                          <span className="text-xs font-bold text-text-main">AI Mock Technical Assessor</span>
                        </div>
                        <p className="text-[11px] text-text-sub italic leading-relaxed bg-[var(--hover-tint)]/40 p-2.5 rounded-lg border border-[var(--border)]/30">
                          "Explain how you would handle high write volumes in an Express microservice architecture. What data structures or systems are best suited?"
                        </p>

                        {!demoInterviewScore ? (
                          <form onSubmit={handleDemoInterviewSubmit} className="flex flex-col gap-2.5 mt-1">
                            <textarea
                              value={demoInterviewAnswer}
                              onChange={(e) => setDemoInterviewAnswer(e.target.value)}
                              placeholder="Type a mock response (e.g. Use a message broker like RabbitMQ or Redis List queue)..."
                              className="w-full bg-[var(--surface)] text-text-main text-[11px] rounded-lg border border-[var(--border)] p-3 h-20 transition-all outline-none focus:border-primary placeholder:text-text-mute/40"
                              required
                            />
                            <Button type="submit" variant="primary" size="sm" className="self-end font-bold text-xs h-9">
                              Submit Technical Response
                            </Button>
                          </form>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-3.5 rounded-lg bg-success/[0.02] border border-success/15 flex flex-col gap-2 mt-1"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-success flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Grading complete!
                              </span>
                              <span className="text-sm font-display font-black text-secondary">88/100</span>
                            </div>
                            <p className="text-[11px] text-text-sub leading-normal">
                              <strong>Key strengths identified:</strong> Excellent description of horizontal queue mechanics and decoupling.
                            </p>
                            <p className="text-[11px] text-text-mute leading-normal">
                              <strong>Improvement prompt:</strong> Explicitly mention memory footprint when using memory-bound key-value caches like Redis.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="self-end h-8 text-[10px] font-bold"
                              onClick={() => { setDemoInterviewScore(null); setDemoInterviewAnswer(''); }}
                            >
                              Reset Mock Screen
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 4: Mentor */}
                  {demoActiveTab === 'mentor' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-3 h-[280px]"
                    >
                      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                        {demoMentorMessages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                              m.sender === 'user' ? 'bg-secondary/10 text-secondary border-secondary/25' : 'bg-primary/10 text-primary border-primary/25'
                            }`}>
                              {m.sender === 'user' ? 'U' : 'AI'}
                            </div>
                            <div className={`p-2.5 rounded-lg text-[11px] leading-relaxed border ${
                              m.sender === 'user' ? 'bg-primary text-white border-primary/20' : 'bg-[var(--surface)] text-text-sub border-[var(--border)]'
                            }`}>
                              <p className="whitespace-pre-line">{m.text}</p>
                            </div>
                          </div>
                        ))}
                        {demoIsTyping && (
                          <div className="self-start flex gap-2.5 items-center">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/25 flex items-center justify-center text-[10px] font-bold">AI</div>
                            <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[10px] text-text-mute flex items-center gap-1 font-mono">
                              Typing plan coordinates...
                            </div>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSendDemoMentorMessage} className="flex gap-2 mt-auto pt-2 border-t border-[var(--border)]/75">
                        <input
                          type="text"
                          value={demoMentorInput}
                          onChange={(e) => setDemoMentorInput(e.target.value)}
                          placeholder="Ask AI Coach (e.g. How do I build a Docker side project?)..."
                          className="flex-1 bg-[var(--surface)] text-text-main text-[11px] rounded-lg border border-[var(--border)] px-3.5 py-2 transition-all outline-none focus:border-primary placeholder:text-text-mute/40"
                          required
                          disabled={demoIsTyping}
                        />
                        <Button type="submit" variant="primary" size="sm" className="font-bold shrink-0 h-9 px-3" disabled={demoIsTyping}>
                          Ask
                        </Button>
                      </form>
                    </motion.div>
                  )}

                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9: Testimonials */}
      <section className="py-20 md:py-28 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">Trajectory Outcomes</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight">
              Verifiable Career Scaling Stories
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Read how engineering students and transition candidates mapped their goals and secured real offers at top companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <Card className="bg-[var(--surface)] border-[var(--border)] shadow-xs flex flex-col justify-between">
              <CardContent className="pt-6 flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs text-text-sub italic leading-relaxed">
                    "Before PathPilot, I spent weeks stuffing random frameworks into my resume. The alignment diagnostic isolated exactly what I lacked (Redis queue scaling), and the customized roadmap mapped my study timeline in hours."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]/60">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">LH</div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Lucas Hwang</h4>
                    <p className="text-[9px] text-text-mute font-medium">Software Engineer @ Vercel • Cornell University</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-[var(--surface)] border-[var(--border)] shadow-xs flex flex-col justify-between">
              <CardContent className="pt-6 flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs text-text-sub italic leading-relaxed">
                    "The mock interview engine is incredible. It kept digging deeper into database sharding and replica sync lags, which matched 90% of my backend tech screens. Landing my offer felt effortless after practicing."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]/60">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">ER</div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Elena Rostova</h4>
                    <p className="text-[9px] text-text-mute font-medium">Infrastructure Analyst @ Stripe • Georgia Tech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-[var(--surface)] border-[var(--border)] shadow-xs flex flex-col justify-between">
              <CardContent className="pt-6 flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs text-text-sub italic leading-relaxed">
                    "I used the guest portal to map my profile from marketing associate to Technical Product Manager. The AI mentor literally drafted a custom system architecture curriculum that helped me pass the technical panel."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]/60">
                  <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0">MK</div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Marcus Kincaid</h4>
                    <p className="text-[9px] text-text-mute font-medium">TPM Lead @ Figma • UT Austin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* SECTION 10: Frequently Asked Questions */}
      <section id="faq" className="py-20 md:py-28 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">Technical Clearance</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-text-sub font-medium leading-relaxed">
              Have questions about security, parsing algorithms, or coordinates calibration? Explore our direct responses below.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {[
              {
                q: 'How does the AI alignment diagnostic work?',
                a: 'When you paste or upload your resume, our engine extracts keywords, skill groupings, and structure density metrics. It sends this data along with your selected Target Career Coordinates to our secure Gemini proxy API, returning a highly targeted score, missing technology lists, and actionable structural critiques.'
              },
              {
                q: 'Is my resume data secure and confidential?',
                a: 'Absolutely. PathPilot AI does not sell, license, or analyze your resume for telemetry tracking. Data is parsed in secure memory. For cloud database storage (Firestore), credentials are secured strictly by security rules, accessible exclusively to your verified user session profile.'
              },
              {
                q: 'Can absolute beginners use this career operating system?',
                a: 'Yes, definitely. When you select a coordinate target, the learning roadmap is structured starting from core fundamentals (Phase 1) and progresses naturally to advanced production architecture (Phase 3). You can interact with the AI Mentor to explain any concept simply.'
              },
              {
                q: 'How accurate are the readiness scores and resume recommendations?',
                a: 'The scoring models align closely with modern applicant tracking system requirements and technical recruiter rubric patterns. Completing roadmap milestones and technical interviews will continuously scale your profile coordinates closer to real hiring matrices.'
              },
              {
                q: 'What is the role of the Experience Point (XP) gamification engine?',
                a: 'Gamification is engineered to incentivize continuous daily study. Marking milestones complete (+100 XP), answering mock interview screens (+75 XP), and interacting with the AI Mentor (+10 XP) ranks up your Pathfinder Level, building real professional habits.'
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200 bg-[var(--surface)]"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 bg-[var(--hover-tint)]/10 hover:bg-[var(--hover-tint)]/25 text-left outline-none cursor-pointer focus:bg-[var(--hover-tint)]/30"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs font-bold text-text-main pr-4">{faq.q}</span>
                    <HelpCircle className={`w-4.5 h-4.5 text-text-mute shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]/65 text-[11px] text-text-sub leading-relaxed whitespace-pre-line">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 11: Call To Action (Motivational Closing) */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[#0a0a0a] text-white border-t border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#111111] opacity-95" />
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none rounded-full bg-white/[0.03] blur-[100px]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <PathPilotLogo size={32} inverted={true} />
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white max-w-2xl">
              Map Your Trajectory. <br />
              Master Your Next Career Destination.
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium max-w-xl leading-relaxed mx-auto">
              Stop guessing. Paste your profile details into PathPilot AI to analyze technological readiness, bridge learning gaps, and receive real career coaching.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3.5 items-center justify-center w-full max-w-xs sm:max-w-none mt-4"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full sm:w-auto font-bold h-12 text-sm px-8"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Calibrate Your Core Trajectory
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 12: Footer */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 md:py-16 text-xs text-text-sub relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Brand column */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <PathPilotLogo size={32} />
                <span className="font-display font-extrabold text-base text-text-main tracking-tight">PathPilot AI</span>
              </div>
              <p className="text-[11px] text-text-mute max-w-xs leading-relaxed">
                PathPilot AI is an AI-powered Career Operating System designed to help developers and designers map precise technical trajectories and secure placements.
              </p>
              <div className="flex items-center gap-3 text-text-mute">
                <a href="#" className="hover:text-accent transition-colors p-1" aria-label="Github Repo Link"><Github className="w-4 h-4" /></a>
                <a href="#" className="hover:text-accent transition-colors p-1" aria-label="Twitter Page Link"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="hover:text-accent transition-colors p-1" aria-label="Linkedin Profile Link"><Linkedin className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Links Col 1 */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-text-main tracking-tight uppercase text-[9px] font-mono">Product Modules</h4>
              <a href="#features" className="hover:text-primary transition-colors">Resume Diagnostics</a>
              <a href="#features" className="hover:text-primary transition-colors">Skill Gap Analyzer</a>
              <a href="#features" className="hover:text-primary transition-colors">Learning Roadmaps</a>
              <a href="#features" className="hover:text-primary transition-colors">AI Technical Screens</a>
            </div>

            {/* Links Col 2 */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-text-main tracking-tight uppercase text-[9px] font-mono">Platform Assets</h4>
              <a href="#how-it-works" className="hover:text-primary transition-colors">Onboarding Flow</a>
              <a href="#dashboard-demo" className="hover:text-primary transition-colors">Interactive Preview</a>
              <a href="#faq" className="hover:text-primary transition-colors">Technical Clearance FAQ</a>
              <a href="#problem" className="hover:text-primary transition-colors">Comparison Matrices</a>
            </div>

            {/* Links Col 3 */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-text-main tracking-tight uppercase text-[9px] font-mono">Legal Parameters</h4>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Security Disclosures</a>
              <a href="#" className="hover:text-primary transition-colors">AI Ethical Guidelines</a>
            </div>

          </div>

          <div className="pt-8 border-t border-[var(--border)]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-mute text-[10px]">
            <p>© {new Date().getFullYear()} PathPilot AI, Inc. All rights reserved. Enterprise AI developer framework initialized.</p>
            <div className="flex items-center gap-4">
              <span>Security verified</span>
              <span>•</span>
              <span>GDPR compliant</span>
            </div>
          </div>

        </div>
      </footer>

      {/* SECTION Onboarding Modal (Modal and Login Form) */}
      <Modal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          setAuthError(null);
          setAuthSuccess(null);
        }}
        title={
          authMode === 'login' ? 'Authentication Gate' :
          authMode === 'signup' ? 'Create Pathfinder Account' :
          authMode === 'forgot' ? 'Recover Pass-Coordinates' :
          authMode === 'verify' ? 'Activation Transmitted' :
          'Calibrate Pathfinder Coordinates'
        }
        size="md"
      >
        <div className="flex flex-col gap-5">
          
          {/* Error and Success Banners */}
          {authError && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-btn text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-success/10 border border-success/20 text-success rounded-btn text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* LOGIN MODE */}
            {authMode === 'login' && (
              <motion.div 
                key="login-view"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="font-display font-black text-sm text-text-main tracking-tight">Access Your Career Operating Cockpit</h3>
                  <p className="text-[10px] text-text-mute leading-normal">
                    Provide credentials to continue tracking your calibrated milestones.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5">
                  <Input
                    label="Account Email Address"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="explorer@pathpilot.ai"
                    required
                    disabled={isSubmitting}
                    leftIcon={<Mail className="w-4 h-4 text-text-mute" />}
                  />

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-text-sub tracking-tight">Password</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setAuthError(null);
                          setAuthSuccess(null);
                          setAuthMode('forgot');
                        }}
                        className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isSubmitting}
                      leftIcon={<Lock className="w-4 h-4 text-text-mute" />}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-11 font-bold text-xs"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Authenticate Credentials
                  </Button>
                </form>

                <div className="flex justify-center mt-1">
                  <span className="text-[10px] text-text-mute">
                    No account registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthError(null);
                        setAuthSuccess(null);
                        setAuthMode('signup');
                      }}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Establish Account
                    </button>
                  </span>
                </div>

                {/* Form divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-[1px] bg-[var(--border)]/75" />
                  <span className="text-[8px] font-bold text-text-mute uppercase tracking-widest">or continue as simulator guest</span>
                  <div className="flex-1 h-[1px] bg-[var(--border)]/75" />
                </div>

                {/* Onboarding Guest option */}
                <form onSubmit={handleOnboardingSubmit} className="flex flex-col gap-3">
                  <Input
                    label="Explorer Full Name"
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    placeholder="Alex Mercer"
                    required
                    disabled={isSubmitting}
                    leftIcon={<User className="w-4 h-4 text-text-mute" />}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-sub tracking-tight">
                      Target Career Coordinate
                    </label>
                    <div className="relative flex items-center w-full">
                      <div className="absolute left-3 text-text-mute flex items-center pointer-events-none">
                        <Target className="w-4 h-4" />
                      </div>
                      <select
                        value={onboardingGoal}
                        onChange={(e) => setOnboardingGoal(e.target.value)}
                        className="w-full bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] pl-10 pr-4 py-2 h-10 transition-all outline-none focus:border-primary font-semibold cursor-pointer appearance-none"
                        disabled={isSubmitting}
                      >
                        {careers.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 text-text-mute pointer-events-none font-sans text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full h-11 font-bold text-xs"
                    disabled={isSubmitting || !onboardingName.trim()}
                    isLoading={isSubmitting}
                  >
                    Calibrate Guest Simulator
                  </Button>
                </form>
              </motion.div>
            )}

            {/* REGISTER/SIGNUP MODE */}
            {authMode === 'signup' && (
              <motion.div 
                key="signup-view"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="font-display font-black text-sm text-text-main tracking-tight">Establish Your Career Coordinates</h3>
                  <p className="text-[10px] text-text-mute leading-normal">
                    Register now to log study metrics, resume critiques, and interview scores.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                  <Input
                    label="Full Name / Identification"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Alex Mercer"
                    required
                    disabled={isSubmitting}
                    leftIcon={<User className="w-4 h-4 text-text-mute" />}
                  />

                  <Input
                    label="Account Email Address"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="explorer@pathpilot.ai"
                    required
                    disabled={isSubmitting}
                    leftIcon={<Mail className="w-4 h-4 text-text-mute" />}
                  />

                  <Input
                    label="Secret Password"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="•••••••• (Min 6 characters)"
                    required
                    disabled={isSubmitting}
                    leftIcon={<Lock className="w-4 h-4 text-text-mute" />}
                  />

                  <Input
                    label="Confirm Secret Password"
                    type="password"
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                    leftIcon={<Lock className="w-4 h-4 text-text-mute" />}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-11 font-bold text-xs mt-1"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Build Career Profile
                  </Button>
                </form>

                <div className="flex justify-center mt-1">
                  <span className="text-[10px] text-text-mute">
                    Already registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthError(null);
                        setAuthSuccess(null);
                        setAuthMode('login');
                      }}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Authenticate Account
                    </button>
                  </span>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {authMode === 'forgot' && (
              <motion.div 
                key="forgot-view"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="font-display font-black text-sm text-text-main tracking-tight">Recover Profile Coordinates</h3>
                  <p className="text-[10px] text-text-mute leading-normal">
                    Enter your email address to receive password reset instructions.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Account Email Address"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="explorer@pathpilot.ai"
                    required
                    disabled={isSubmitting}
                    leftIcon={<Mail className="w-4 h-4 text-text-mute" />}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-11 font-bold text-xs"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Transmit Recovery Link
                  </Button>
                </form>

                <div className="flex justify-center mt-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setAuthError(null);
                      setAuthSuccess(null);
                      setAuthMode('login');
                    }}
                    className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                  >
                    Return to Authentication
                  </button>
                </div>
              </motion.div>
            )}

            {/* VERIFICATION/SUCCESS SCREEN */}
            {authMode === 'verify' && (
              <motion.div 
                key="verify-view"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-display font-black text-sm text-text-main">Activation Email Dispatched</h4>
                  <p className="text-[10px] text-text-mute leading-relaxed max-w-xs mx-auto">
                    An automated link has been dispatched to <strong className="text-text-sub">{authEmail || 'your email address'}</strong>. Follow the link to complete account setup or password reset.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    className="font-bold border-[var(--border)] h-9 px-4 text-[10px]"
                    disabled={isSubmitting}
                  >
                    Resend Email Link
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setAuthError(null);
                      setAuthSuccess(null);
                      setAuthMode('login');
                    }}
                    className="font-bold h-9 px-4 text-[10px]"
                  >
                    Return to Login
                  </Button>
                </div>
              </motion.div>
            )}

            {/* WELCOME / FIRST ACC CREATION SCREEN */}
            {authMode === 'welcome' && (
              <motion.div 
                key="welcome-view"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center text-center gap-4 py-4 animate-fade-in"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <PathPilotLogo size={48} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-display font-black text-sm text-text-main">Welcome aboard, Pathfinder!</h4>
                  <p className="text-[10px] text-text-mute leading-relaxed max-w-xs mx-auto">
                    Your base PathPilot profile has been calibrated successfully. Prepare to engage in deep trajectory onboarding.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOnboardingOpen(false);
                  }}
                  className="font-bold h-10 px-6 text-[10px]"
                >
                  Launch Trajectory Calibration Wizard
                </Button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </Modal>

    </div>
  );
};

export default LandingPageView;
