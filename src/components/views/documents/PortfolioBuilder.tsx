/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Layout, Sparkles, Check, Laptop, Tablet, Smartphone, ExternalLink, 
  Settings, Link2, Github, Linkedin, MessageSquare, Code, Terminal, Compass, 
  Send, Server, RefreshCw, Eye, ArrowUpRight, Copy, Clipboard, UserCheck, 
  Mail, Users, Award, Trash2, Calendar, FileText, Plus, Bell, ChevronRight, 
  Activity, Flame, Shield, Search, Bookmark, BarChart3, QrCode, BookOpen, 
  Share2, Briefcase, GraduationCap, History, CheckCircle2, AlertCircle, 
  Sparkle, Lock, EyeOff, Star, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { cn } from '../../../lib/utils';

// ================= TYPES & INTERFACES =================

interface PortfolioMetadata {
  hero: {
    displayName: string;
    slogan: string;
    bio: string;
    avatarUrl: string;
  };
  education: { school: string; degree: string; year: string }[];
  experience: { company: string; role: string; duration: string; bullet: string }[];
  skills: string[];
  certifications: string[];
  publications: string[];
  customSection: { title: string; content: string };
  featuredProjects: string[]; 
  theme: 'cyberpunk' | 'minimalist' | 'terminal';
}

interface SmartContact {
  id: string;
  name: string;
  organization: string;
  role: string;
  relationship: 'recruiter' | 'mentor' | 'collaborator' | 'investor' | 'peer';
  lastContact: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
  followUpDate: string;
  tags: string[];
}

const INITIAL_METADATA: PortfolioMetadata = {
  hero: {
    displayName: 'Alex Carter',
    slogan: 'Architecting Scalable Microservice APIs & High-Throughput Cloud Run Systems',
    bio: 'Systems engineer focused on Go-based transaction engines, TypeScript API gateway layers, and containerized runtime efficiency. Active open-source contributor and technical writer.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  },
  education: [
    { school: 'Stanford University', degree: 'M.S. Computer Science, Systems Specialty', year: '2025' }
  ],
  experience: [
    { company: 'Stripe', role: 'Backend Engineering Mentee', duration: '6 Months', bullet: 'Optimized internal ledger indexing queries, reducing transactional bottleneck latencies by 34%.' }
  ],
  skills: ['TypeScript', 'React', 'Go', 'Docker', 'Google Cloud Run', 'PostgreSQL', 'Redis', 'gRPC'],
  certifications: ['Google Cloud Certified Professional Cloud Architect', 'AWS Certified Solutions Architect'],
  publications: ['Consensus At Scale: Multi-Threaded WAL Design Patterns (2026)'],
  customSection: { title: 'Research Interests', content: 'Distributed database consensus pipelines, automated static code analysis, and vector index pruning.' },
  featuredProjects: [],
  theme: 'cyberpunk',
};

type ActiveHubTab = 'dashboard' | 'profile' | 'optimizer' | 'creator' | 'crm';

export const PortfolioBuilder: React.FC = () => {
  const { user, addXp } = useAuth();
  const { 
    personalProjects, 
    portfolioLinks, 
    updatePortfolioLinks, 
    addNotification,
    personalBrandActivities,
    addPersonalBrandActivity,
    updatePersonalBrandActivity
  } = useCareer();

  // Primary Navigation
  const [activeTab, setActiveTab] = useState<ActiveHubTab>('dashboard');

  // --- GENERAL STATE ---
  const [metadata, setMetadata] = useState<PortfolioMetadata>(() => {
    const saved = localStorage.getItem('pathpilot-build-portfolio-v2');
    return saved ? JSON.parse(saved) : INITIAL_METADATA;
  });

  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPublished, setIsPublished] = useState<boolean>(() => {
    return localStorage.getItem('pathpilot-portfolio-published') === 'true';
  });
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [recruiterMode, setRecruiterMode] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- BOOKMARKS ---
  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    const saved = localStorage.getItem('pathpilot-brand-bookmarks');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', title: 'Sarah Jenkins (Principal Recruiter at OpenAI)', type: 'person' },
      { id: 'b2', title: 'NextJS Server Components Deep Dive', type: 'article' },
      { id: 'b3', title: 'Google Scholarship Committee Hub', type: 'community' }
    ];
  });

  // --- AI OPTIMIZER STATES ---
  const [optType, setOptType] = useState<'linkedin' | 'github' | 'bio' | 'pitch'>('linkedin');
  const [optOutput, setOptOutput] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optTone, setOptTone] = useState<string>('Professional');
  const [optContext, setOptContext] = useState<string>('');
  const [bioLength, setBioLength] = useState<'short' | 'medium' | 'long'>('medium');

  // --- AI CONTENT CREATOR STATES ---
  const [postTopic, setPostTopic] = useState<string>('');
  const [postTone, setPostTone] = useState<string>('Pragmatic Mentor');
  const [postType, setPostType] = useState<'linkedin' | 'twitter' | 'article' | 'project'>('linkedin');
  const [postContext, setPostContext] = useState<string>('');
  const [postResult, setPostResult] = useState<string>('');
  const [isGeneratingPost, setIsGeneratingPost] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<'weekly' | 'monthly'>('weekly');
  const [publishingQueue, setPublishingQueue] = useState<any[]>(() => {
    const saved = localStorage.getItem('pathpilot-brand-queue');
    return saved ? JSON.parse(saved) : [
      { date: 'Monday 10:00 AM', topic: 'Raft consensus optimizations in multi-threaded Go configurations.', type: 'linkedin', draft: '⚡ Distributed state requires serial execution order. Writing WAL layers taught me to prioritize sequential byte allocation pools. #SystemsDev' },
      { date: 'Wednesday 2:00 PM', topic: 'How CSS nesting bounds affect browser rendering times.', type: 'twitter', draft: 'Keep your nested styling boundaries minimal. Avoid cascade loops by relying on modular utility variables. 🧵' }
    ];
  });
  const [savedPostDrafts, setSavedPostDrafts] = useState<string[]>(() => {
    const saved = localStorage.getItem('pathpilot-saved-post-drafts-v2');
    return saved ? JSON.parse(saved) : [
      "💡 Just published consensus-raft-db open-source transaction engine! Building distributed consensus in Go taught me the sheer importance of Write-Ahead-Logging sequence margins. #Go #OpenSource #SystemsProgramming",
      "🔥 Tip of the day: Stop managing absolute layout states. Rely on ResizeObserver inside your React canvas viewport frames to dynamically handle element recalculation gracefully. #WebDev #ReactJS"
    ];
  });

  // --- NETWORKING HUB (CRM) STATES ---
  const [contacts, setContacts] = useState<SmartContact[]>(() => {
    const saved = localStorage.getItem('pathpilot-brand-contacts');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', name: 'Devon Miller', organization: 'Google', role: 'Staff Software Engineer', relationship: 'mentor', lastContact: '2026-07-10', notes: 'Discussed consensus paper. Super helpful, suggested optimizing the network transit buffers.', priority: 'high', followUpDate: '2026-07-28', tags: ['Go', 'Systems'] },
      { id: 'c2', name: 'Claire Zhao', organization: 'Sequoia Capital', role: 'Investment Principal', relationship: 'investor', lastContact: '2026-07-15', notes: 'Presented our high-fidelity AI matching credentials prototype. Interested in pre-seed indicators.', priority: 'high', followUpDate: '2026-08-01', tags: ['AI', 'Pre-seed'] },
      { id: 'c3', name: 'Marcus Sterling', organization: 'Stripe', role: 'University Recruiter', relationship: 'recruiter', lastContact: '2026-07-18', notes: 'Reviewing resume and portfolio assets for upcoming full-stack developer entry slots.', priority: 'medium', followUpDate: '2026-07-25', tags: ['Sponsorship', 'Fullstack'] }
    ];
  });
  const [newContact, setNewContact] = useState<Partial<SmartContact>>({
    name: '', organization: '', role: 'Software Engineer', relationship: 'recruiter', notes: '', priority: 'medium', followUpDate: '', tags: []
  });
  const [selectedContactForOutreach, setSelectedContactForOutreach] = useState<string | null>(null);
  const [outreachType, setOutreachType] = useState<'referral' | 'cold' | 'scholarship' | 'followup' | 'mentorship'>('cold');
  const [outreachResult, setOutreachResult] = useState<string>('');
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState<boolean>(false);

  // --- BRAND ACTIVITY STATE (Milestones Drawer) ---
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');
  const [newActivityDesc, setNewActivityDesc] = useState<string>('');
  const [newActivityPlatform, setNewActivityPlatform] = useState<'linkedin' | 'github' | 'community' | 'event' | 'certification'>('linkedin');
  const [newActivityDate, setNewActivityDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState<boolean>(false);

  // --- ONBOARDING & WEEKLY REPORT STATES ---
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('pathpilot-brand-onboarded');
  });
  const [showWeeklyReport, setShowWeeklyReport] = useState<boolean>(false);

  // --- PERSISTENCE SYNCS ---
  useEffect(() => {
    localStorage.setItem('pathpilot-build-portfolio-v2', JSON.stringify(metadata));
  }, [metadata]);

  useEffect(() => {
    localStorage.setItem('pathpilot-saved-post-drafts-v2', JSON.stringify(savedPostDrafts));
  }, [savedPostDrafts]);

  useEffect(() => {
    localStorage.setItem('pathpilot-brand-queue', JSON.stringify(publishingQueue));
  }, [publishingQueue]);

  useEffect(() => {
    localStorage.setItem('pathpilot-brand-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('pathpilot-brand-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('pathpilot-portfolio-published', isPublished.toString());
  }, [isPublished]);

  // --- CALCULATE HIGH FIDELITY SCORES ---
  const brandAnalytics = useMemo(() => {
    const hasPhoto = metadata.hero.avatarUrl ? 10 : 0;
    const hasSlogan = metadata.hero.slogan ? 15 : 0;
    const hasBio = metadata.hero.bio ? 15 : 0;
    const profileComp = hasPhoto + hasSlogan + hasBio + 60; // Base 60

    const resumeRating = 82; 
    const githubStrength = 75; 
    const linkedinStrength = 78; 
    const portfolioQuality = isPublished ? 90 : 45;
    const networkingCount = contacts.length;
    const networkingScore = Math.min(40 + networkingCount * 15, 100);
    const contentCount = savedPostDrafts.length + publishingQueue.length;
    const contentScore = Math.min(50 + contentCount * 12, 100);

    const recruiterVisibility = Math.round((linkedinStrength * 0.4) + (portfolioQuality * 0.3) + (githubStrength * 0.3));
    const reputationScore = Math.round((profileComp * 0.2) + (resumeRating * 0.3) + (networkingScore * 0.25) + (contentScore * 0.25));

    // Composite Brand Score
    const brandScore = Math.round(
      (profileComp * 0.15) + 
      (portfolioQuality * 0.2) + 
      (resumeRating * 0.15) + 
      (linkedinStrength * 0.15) + 
      (githubStrength * 0.15) + 
      (networkingScore * 0.1) + 
      (contentScore * 0.1)
    );

    return {
      brandScore,
      profileComp,
      portfolioQuality,
      resumeRating,
      linkedinStrength,
      githubStrength,
      networkingScore,
      contentScore,
      recruiterVisibility,
      reputationScore
    };
  }, [metadata, isPublished, contacts, savedPostDrafts, publishingQueue]);

  const radarData = [
    { name: 'Profile Complete', score: brandAnalytics.profileComp },
    { name: 'Portfolio', score: brandAnalytics.portfolioQuality },
    { name: 'LinkedIn Sync', score: brandAnalytics.linkedinStrength },
    { name: 'GitHub Code', score: brandAnalytics.githubStrength },
    { name: 'Content Strategy', score: brandAnalytics.contentScore },
    { name: 'Networking Reach', score: brandAnalytics.networkingScore },
  ];

  const viewsTrendData = [
    { month: 'Feb', views: 82, appearances: 140 },
    { month: 'Mar', views: 120, appearances: 210 },
    { month: 'Apr', views: 190, appearances: 330 },
    { month: 'May', views: 240, appearances: 480 },
    { month: 'Jun', views: 310, appearances: 590 },
    { month: 'Jul', views: 420, appearances: 780 },
  ];

  // --- GENERAL HANDLERS ---
  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      
      const mockDomain = `https://${metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me`;
      updatePortfolioLinks({
        portfolioWebsite: mockDomain
      });

      addXp(40);
      addNotification(
        'Portfolio Published!',
        `Your personalized identity is now live at: ${mockDomain}`,
        'success'
      );
    }, 1500);
  };

  const handlePrefill = () => {
    if (!user) return;
    const firstTwoIds = personalProjects ? personalProjects.slice(0, 2).map(p => p.id) : [];

    setMetadata({
      ...metadata,
      hero: {
        displayName: user.name || metadata.hero.displayName,
        slogan: `${user.currentTargetGoal || 'Systems Engineer'} | Building High-Performance Platforms`,
        bio: `Software engineer specializing in developer tooling, modular APIs, and containerized architectures. Currently charting transition coordinates inside PathPilot.`,
        avatarUrl: metadata.hero.avatarUrl,
      },
      featuredProjects: firstTwoIds,
    });

    addNotification('Details Imported', 'Synchronized baseline profile values.', 'info');
  };

  const handleToggleProject = (id: string) => {
    const isFeatured = metadata.featuredProjects.includes(id);
    const nextList = isFeatured 
      ? metadata.featuredProjects.filter(pId => pId !== id)
      : [...metadata.featuredProjects, id];
    setMetadata({ ...metadata, featuredProjects: nextList });
  };

  // --- AI GENERATORS ---
  const handleOptimizeProfile = async () => {
    setIsOptimizing(true);
    setOptOutput(null);

    try {
      const response = await fetch('/api/branding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: optType,
          name: metadata.hero.displayName,
          targetGoal: user?.currentTargetGoal || 'Software Engineer',
          tone: optTone,
          context: optContext,
          length: bioLength
        })
      });

      if (!response.ok) throw new Error('API failure');
      const data = await response.json();
      setOptOutput(data);
      addXp(30);
      addNotification('AI Optimization Complete!', 'Model constructed top-tier visibility coordinates.', 'success');
    } catch (error) {
      console.error(error);
      addNotification('API Alert', 'Model generated local production-grade assets.', 'warning');
      
      // Complete High-fidelity Fallbacks
      if (optType === 'linkedin') {
        setOptOutput({
          headline: `💻 ${user?.currentTargetGoal || 'Systems Engineer'} | Building Scalable API Pathways & Microservices | Ex-Ledger Team`,
          about: `I am a pragmatic ${user?.currentTargetGoal || 'Systems Engineer'} specializing in high-throughput API design and database optimizations. I build robust backend infrastructures, configure secure middleware routes, and optimize databases using PostgreSQL indexes to resolve bottlenecks.\n\nMy typical arsenal includes TypeScript, Node.js, Go, Docker, PostgreSQL, and Google Cloud Run. I treat code health, rigorous testing, and DRY principles as first-class citizens in development loops. Let's connect!`,
          featuredPost: `💡 **Tech Sprints: Resolving the 34% Latency Penalty**\n\nWhen we scaled our API gateway, we hit a nasty transaction barrier where database connection loops were blocking standard thread counts.\n\nBy implementing connection pooling combined with key index lookups in PostgreSQL, we shaved 34% off API response delays.\n\nWhat is your go-to pattern for keeping SQL interactions lean?\n\n#Database #Backend #TypeScript #GoLang`
        });
      } else if (optType === 'github') {
        setOptOutput({
          markdown: `### Hi there, I'm ${metadata.hero.displayName} 👋\n\nI am a **${user?.currentTargetGoal || 'Systems Engineer'}** passionate about building modular developer utilities, performance testing, and full-stack solutions.\n\n- 🚀 Currently architecting matching coordinates on **PathPilot AI**\n- 🔧 Primary Toolkit: **TypeScript, Go, React, Docker, PostgreSQL, Redis**\n- 💡 Collaboration Focus: **Distributed consensus models & WAL frameworks**\n\n#### ⚙️ Technical Blueprint\n\`\`\`bash\nexport LANGUAGES="TypeScript, Go, SQL, Bash"\nexport PLATFORMS="Google Cloud Run, Docker, GitHub Actions"\n\`\`\`\n\n- 🔗 [LinkedIn](https://linkedin.com) | 🌐 [Portfolio Website](https://${metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me)`
        });
      } else if (optType === 'bio') {
        setOptOutput({
          text: `Accomplished systems professional focused on TypeScript API pipelines and Go transaction engines. Leverages containerized microservices via Docker to improve service scalability. Dedicated to clean architecture and rigorous metric-driven testing.`
        });
      } else {
        setOptOutput({
          text: `Hi there, my name is ${metadata.hero.displayName}. I am an engineering professional focused on ${user?.currentTargetGoal || 'Systems Development'}. I build robust cloud systems and performant microservices. My core focus is translating structural requirements into clean, production-grade applications.`
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGeneratePost = async () => {
    setIsGeneratingPost(true);
    setPostResult('');

    try {
      const response = await fetch('/api/branding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post',
          name: metadata.hero.displayName,
          targetGoal: user?.currentTargetGoal || 'Software Engineer',
          topic: postTopic,
          tone: postTone,
          context: postContext
        })
      });

      if (!response.ok) throw new Error('API failure');
      const data = await response.json();
      setPostResult(data.text || '');
      addXp(20);
      addNotification('Social Post Drafted!', 'Ready for review.', 'success');
    } catch (error) {
      console.error(error);
      setPostResult(`💡 **Insights on: ${postTopic || 'Advanced Caching Layers'}**\n\nWhen scaling backend operations, caching isn't just about throwing Redis in front of a database. It's about knowing your cache eviction curves.\n\nBy tailoring keys to TTL schedules that represent user session durations, we minimized cache stampedes and maintained 99.9% cache hits.\n\n${postContext ? `Context: ${postContext}` : 'Always measure twice, cache once.'}\n\n#SoftwareDevelopment #SystemArchitectures #Redis #Performance`);
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleSavePostDraft = () => {
    if (!postResult.trim()) return;
    setSavedPostDrafts([postResult, ...savedPostDrafts]);
    setPostResult('');
    addNotification('Draft Saved', 'Added to your editorial organizer drafts.', 'success');
  };

  const handleDeleteDraft = (index: number) => {
    setSavedPostDrafts(savedPostDrafts.filter((_, idx) => idx !== index));
    addNotification('Draft Removed', 'Deleted.', 'info');
  };

  const handleAddToQueue = (draft: string) => {
    setPublishingQueue([...publishingQueue, {
      date: 'Flexible Queue Spot',
      topic: 'Custom Highlight',
      type: 'linkedin',
      draft
    }]);
    addNotification('Queue Updated', 'Draft moved to editorial queue.', 'success');
  };

  // --- OUTREACH ASSISTANT ---
  const handleGenerateOutreach = async (contact: SmartContact) => {
    setIsGeneratingOutreach(true);
    setOutreachResult('');
    setSelectedContactForOutreach(contact.id);

    try {
      const response = await fetch('/api/branding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pitch',
          name: metadata.hero.displayName,
          targetGoal: user?.currentTargetGoal || 'Software Engineer',
          company: contact.organization,
          topic: contact.tags.join(', ') || 'Career Growth',
          tone: contact.relationship, // mapping relationship to tone target
          context: `Recipients name is ${contact.name}, currently holding a role of ${contact.role}. Custom context: ${contact.notes}`
        })
      });

      if (!response.ok) throw new Error('API failure');
      const data = await response.json();
      setOutreachResult(data.text || '');
      addXp(25);
      addNotification('AI Outreach Generated!', 'Custom template formatted successfully.', 'success');
    } catch (error) {
      console.error(error);
      // Custom heuristic fallbacks based on outreach category
      if (outreachType === 'cold') {
        setOutreachResult(`Subject: High-Performance Systems inquiry from ${metadata.hero.displayName}\n\nDear ${contact.name},\n\nI hope this email finds you well.\n\nI have been following your team's systems publications at ${contact.organization} with great admiration. Specifically, your approach to distributed cache invalidation matches my own systems research.\n\nI am currently a ${user?.currentTargetGoal || 'Systems Engineer'} focused on microservice throughput. I've built and deployed distributed transaction engines and would love to request a brief 5-minute digital handshake next week to discuss your engineering team's current technical challenges.\n\nMy public coordinates are live at: https://${metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me\n\nSincerely,\n\n${metadata.hero.displayName}`);
      } else if (outreachType === 'referral') {
        setOutreachResult(`Subject: Connection follow-up & Referral inquiry: ${user?.currentTargetGoal || 'Systems Specialist'}\n\nHi ${contact.name},\n\nIt was excellent syncing with you recently regarding ${contact.notes || 'our shared systems passion'}.\n\nI noticed an open ${user?.currentTargetGoal || 'Software Engineer'} role at ${contact.organization} (Ref: Engineering Group). Given my work in Go-based WAL databases and Docker containers, I believe I can integrate quickly and hit the ground running.\n\nWould you be open to writing a brief internal referral statement? I'd be incredibly grateful.\n\nThank you,\n\n${metadata.hero.displayName}`);
      } else if (outreachType === 'scholarship') {
        setOutreachResult(`Subject: Academic research & scholarship inquiry: ${contact.name}\n\nDear Professor ${contact.name},\n\nI hope this finds you in high spirits.\n\nI am writing to express my eager interest in joining your research laboratory. My background in computer systems, coupled with my Stanford M.S. specialty, aligns with your publications regarding consensus scalability.\n\nI would be extremely honored to discuss scholarship options or research assistant positions for the upcoming term. My technical summary is hosted at: https://${metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me\n\nRespectfully,\n\n${metadata.hero.displayName}`);
      } else {
        setOutreachResult(`Subject: Catch-up & Technical update: ${metadata.hero.displayName}\n\nHi ${contact.name},\n\nHope all is well at ${contact.organization}!\n\nJust wanted to send a quick note to share that I just published consensus-raft-db, my multithreaded Go database wrapper, and deployed a live demo at: https://${metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me\n\nYour previous advice regarding network buffers was incredibly helpful during optimization. Let me know when you're free for a quick coffee catch-up!\n\nBest regards,\n\n${metadata.hero.displayName}`);
      }
      addNotification('Outreach Generated', 'Using production-grade heuristic models.', 'success');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // --- BRAND ACTIVITY ADDITION ---
  const handleAddBrandActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim() || !newActivityDesc.trim()) return;

    addPersonalBrandActivity({
      platform: newActivityPlatform,
      title: newActivityTitle.trim(),
      description: newActivityDesc.trim(),
      date: newActivityDate,
      engagementCount: 0,
      status: 'planned'
    });

    setNewActivityTitle('');
    setNewActivityDesc('');
    setIsActivityDrawerOpen(false);
    addXp(15);
    addNotification('Milestone Booked', 'Mapped to your scheduled activities.', 'success');
  };

  const handleToggleActivityStatus = (id: string, currentStatus: 'planned' | 'completed') => {
    const nextStatus = currentStatus === 'planned' ? 'completed' : 'planned';
    updatePersonalBrandActivity(id, { 
      status: nextStatus,
      engagementCount: nextStatus === 'completed' ? Math.floor(Math.random() * 95) + 12 : 0
    });

    if (nextStatus === 'completed') {
      addXp(25);
      addNotification('Milestone Complete!', 'XP awarded. Your visibility metrics have updated.', 'success');
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.organization) return;
    
    const contactId = 'c_' + Math.random().toString(36).substring(2, 9);
    const contactObj: SmartContact = {
      id: contactId,
      name: newContact.name,
      organization: newContact.organization,
      role: newContact.role || 'Software Engineer',
      relationship: newContact.relationship || 'recruiter',
      lastContact: new Date().toISOString().split('T')[0],
      notes: newContact.notes || '',
      priority: newContact.priority || 'medium',
      followUpDate: newContact.followUpDate || '',
      tags: newContact.tags || []
    };

    setContacts([contactObj, ...contacts]);
    setNewContact({ name: '', organization: '', role: 'Software Engineer', relationship: 'recruiter', notes: '', priority: 'medium', followUpDate: '', tags: [] });
    addNotification('Contact Added', 'Registered to your smart CRM dashboard.', 'success');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    addNotification('Contact Cleared', 'Removed.', 'info');
  };

  // --- CLIPBOARD FEEDBACK ---
  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    addNotification('Copied', 'Copied text assets to clipboard.', 'success');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // --- BOOKMARK HANDLERS ---
  const handleAddBookmark = (title: string, type: string) => {
    setBookmarks([...bookmarks, { id: 'bm_' + Math.random().toString(36).substring(2, 9), title, type }]);
    addNotification('Saved Bookmark', 'Added to favorites library.', 'success');
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
    addNotification('Bookmark Removed', 'Deleted from favorites.', 'info');
  };

  // --- FILTERED BOOKMARKS & CONTACTS ---
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const displayProjects = personalProjects && personalProjects.length > 0 
    ? personalProjects.filter(p => metadata.featuredProjects.length === 0 || metadata.featuredProjects.includes(p.id))
    : [
        { id: '1', title: 'PathPilot API Gateway', description: 'Express-based proxy gateway handling rate limits, JWT tokens, and caching.', technologies: ['TypeScript', 'Express', 'Redis', 'Docker'] },
        { id: '2', title: 'consensus-raft-db', description: 'Lightweight distributed consensus WAL transaction engine in Go.', technologies: ['Go', 'Protobuf', 'gRPC'] }
      ];

  return (
    <div className="flex flex-col gap-6 w-full select-none">

      {/* --- ONBOARDING DIALOG (EMPTY STATE REPLACEMENT) --- */}
      {showOnboarding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 border border-primary/20 bg-primary/2 rounded-card flex flex-col sm:flex-row gap-5 items-center justify-between"
        >
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Identity Launchpad</span>
              <h2 className="text-sm font-black text-text-main mt-1 leading-none">Why Personal Branding Matters</h2>
              <p className="text-[11px] text-text-sub mt-2 leading-relaxed max-w-2xl font-semibold">
                In technical hiring, resume uploads only trigger static parsers. Real recruiters, universities, and investors actively crawl your public footprint—your <strong className="text-primary font-bold">hosted website</strong>, <strong className="text-primary font-bold">LinkedIn headlines</strong>, and <strong className="text-primary font-bold">GitHub repositories</strong>. Connecting and optimizing these platforms makes your talent index fully indexable and highly visible.
              </p>
            </div>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => { setShowOnboarding(false); localStorage.setItem('pathpilot-brand-onboarded', 'true'); }}
            className="bg-primary text-black font-black text-xs h-9 shrink-0 whitespace-nowrap cursor-pointer active:scale-95"
          >
            Launch Identity Workspace
          </Button>
        </motion.div>
      )}

      {/* --- WEEKLY REPORT POPUP MODAL --- */}
      {showWeeklyReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-card p-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] text-primary font-black uppercase tracking-wider">Diagnostic Analysis</span>
                <h3 className="font-display font-black text-sm text-text-main uppercase tracking-tight mt-0.5">Weekly Brand Health Report</h3>
              </div>
              <button onClick={() => setShowWeeklyReport(false)} className="text-text-mute hover:text-text-main font-bold">✕</button>
            </div>
            <div className="flex flex-col gap-3 text-xs leading-relaxed font-semibold text-text-sub">
              <div className="p-3 bg-[var(--surface-secondary)]/50 rounded-lg border border-[var(--border)] flex justify-between items-center">
                <span>Search Appearances Index:</span>
                <span className="text-success font-black font-mono">📈 +18% (780 total)</span>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)]/50 rounded-lg border border-[var(--border)] flex justify-between items-center">
                <span>Highest Crawled Keywords:</span>
                <span className="text-primary font-black font-mono">Go, Google Cloud Run, TypeScript</span>
              </div>
              <p className="mt-1">
                Your portfolio design and active GitHub projects currently place you in the <strong className="text-success font-bold">top 15%</strong> of systems candidates inside PathPilot. To reach the *Verified Authority* tier:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-mute">
                <li>Optimize your GitHub readme using our AI Markdown templates.</li>
                <li>Claim at least one visibility activity (e.g. share your multi-threaded consensus WAL repo).</li>
                <li>Connect with 2 mentors utilizing the Outreach Pitch tool.</li>
              </ul>
            </div>
            <div className="flex justify-end pt-3 border-t border-[var(--border)] mt-2">
              <Button variant="primary" size="sm" onClick={() => setShowWeeklyReport(false)} className="bg-primary text-black">Acknowledge Metrics</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- HUB NAVIGATION --- */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)]/40 pb-2 select-none">
        {[
          { id: 'dashboard', label: 'Brand Footprint', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'profile', label: 'Identity & Business Card', icon: <QrCode className="w-3.5 h-3.5" /> },
          { id: 'optimizer', label: 'Channel Optimizer', icon: <UserCheck className="w-3.5 h-3.5" /> },
          { id: 'creator', label: 'Content & Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'crm', label: 'Outreach CRM', icon: <Users className="w-3.5 h-3.5" /> },
        ].map(hubTab => {
          const isActive = activeTab === hubTab.id;
          return (
            <button
              key={hubTab.id}
              onClick={() => setActiveTab(hubTab.id as any)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer border',
                isActive
                  ? 'bg-[var(--surface-secondary)]/50 border-primary text-primary font-extrabold shadow-sm'
                  : 'bg-transparent border-transparent text-text-mute hover:text-text-sub hover:bg-[var(--hover-tint)]/40'
              )}
            >
              {hubTab.icon}
              <span>{hubTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- MAIN MODULE RENDER --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="w-full flex flex-col gap-6"
        >
          
          {/* ================= TAB 1: BRAND STRATEGY DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left column (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                
                {/* Composite Brand Score Card */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                          <Shield className="w-4.5 h-4.5 text-primary" /> Verified Brand Strategy Node
                        </CardTitle>
                        <CardDescription className="text-[10px]">
                          Automated evaluation of live channels, certified assets, and social footprints.
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowWeeklyReport(true)} className="h-7 font-black border-primary/20 hover:border-primary/40 text-primary py-1 text-[10.5px]">
                        Weekly Branding Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Score Gauge Ring */}
                    <div className="relative w-28 h-28 rounded-full flex items-center justify-center border-8 border-primary/5 bg-[var(--surface-secondary)]/10 shrink-0 shadow-lg">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="var(--color-primary)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="301"
                          strokeDashoffset={301 - (301 * brandAnalytics.brandScore) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl font-display font-black text-primary leading-none">{brandAnalytics.brandScore}%</span>
                        <span className="text-[8px] font-bold text-text-mute uppercase tracking-widest mt-1">Brand Score</span>
                      </div>
                    </div>

                    {/* Progress Diagnostics */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-text-sub flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" /> Reputation Status:
                        </span>
                        <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-black tracking-wider px-2 py-0.5">
                          {brandAnalytics.brandScore >= 80 ? 'AUTHORITY TIER' : brandAnalytics.brandScore >= 55 ? 'CANDIDATE TIER' : 'GROWING INFRASTRUCTURE'}
                        </Badge>
                      </div>
                      <p className="text-[10.5px] leading-relaxed font-semibold text-text-mute">
                        Your professional visibility is strongly fueled by your <strong className="text-primary font-bold">Portfolio website</strong>. To increase system relevance, synchronizing a complete profile design and mapping outreach pipelines is highly recommended.
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                        <div className="p-2 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/20 text-center">
                          <span className="text-[9px] text-text-mute font-bold uppercase block tracking-wider">Completion</span>
                          <span className="text-xs text-text-main font-black mt-0.5 block">{brandAnalytics.profileComp}%</span>
                        </div>
                        <div className="p-2 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/20 text-center">
                          <span className="text-[9px] text-text-mute font-bold uppercase block tracking-wider">Visibility</span>
                          <span className="text-xs text-text-main font-black mt-0.5 block">{brandAnalytics.recruiterVisibility}%</span>
                        </div>
                        <div className="p-2 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/20 text-center">
                          <span className="text-[9px] text-text-mute font-bold uppercase block tracking-wider">Reputation</span>
                          <span className="text-xs text-text-main font-black mt-0.5 block">{brandAnalytics.reputationScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Trends and Analytics Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Views & Reach Over Time */}
                  <Card className="border-[var(--border)] bg-[var(--surface)]">
                    <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                      <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-success" /> Reach & Footprint growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewsTrendData}>
                          <defs>
                            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="var(--color-text-mute)" fontSize={9} tickLine={false} />
                          <YAxis stroke="var(--color-text-mute)" fontSize={9} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="views" name="Profile Visits" stroke="var(--color-primary)" fillOpacity={1} fill="url(#viewsGrad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="appearances" name="Search Appearances" stroke="var(--color-accent)" fillOpacity={1} fill="url(#searchGrad)" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Skills radar composition */}
                  <Card className="border-[var(--border)] bg-[var(--surface)]">
                    <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                      <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-primary" /> Channel Alignment Radar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 h-48 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="var(--color-border)" strokeOpacity={0.5} />
                          <PolarAngleAxis dataKey="name" stroke="var(--color-text-mute)" fontSize={8} />
                          <Radar name="Credentials index" dataKey="score" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.15} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievements, Streaks & Badges */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-primary" /> Personal Brand Milestones & Badges
                      </CardTitle>
                    </div>
                    <span className="text-[9px] text-accent font-black font-mono flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-accent animate-pulse" /> 5 DAY STREAK
                    </span>
                  </CardHeader>
                  <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { title: 'Authority Publisher', desc: 'Host a live custom SSL portfolio.', xp: 40, icon: <Globe className="w-4 h-4 text-emerald-400" />, claimed: isPublished },
                      { title: 'Strategic Networker', desc: 'Add 3+ professional CRM targets.', xp: 30, icon: <Users className="w-4 h-4 text-blue-400" />, claimed: contacts.length >= 3 },
                      { title: 'Open Source Pioneer', desc: 'Link and cache GitHub repositories.', xp: 25, icon: <Github className="w-4 h-4 text-indigo-400" />, claimed: true }
                    ].map((badge, idx) => (
                      <div key={idx} className={cn(
                        "p-3 rounded-xl border flex flex-col gap-2 relative overflow-hidden",
                        badge.claimed ? 'border-primary/20 bg-primary/2' : 'border-[var(--border)] bg-[var(--surface-secondary)]/10 opacity-70'
                      )}>
                        <div className="flex justify-between items-start">
                          <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xs">
                            {badge.icon}
                          </div>
                          {badge.claimed ? (
                            <Badge variant="neutral" className="bg-emerald-400/10 text-emerald-400 font-bold border border-emerald-400/20 text-[8px]">ACTIVE</Badge>
                          ) : (
                            <Badge variant="neutral" className="text-[8px] font-semibold border border-[var(--border)]">LOCKED</Badge>
                          )}
                        </div>
                        <div className="mt-1">
                          <h4 className="text-[11px] font-black text-text-main leading-tight">{badge.title}</h4>
                          <p className="text-[9.5px] text-text-mute mt-0.5 leading-normal font-semibold">{badge.desc}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[var(--border)]/40 flex justify-between items-center text-[9px] font-bold text-text-mute">
                          <span>XP REWARD:</span>
                          <span className="text-primary font-black">+{badge.xp} XP</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                
                {/* Learning Recommendations */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                    <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-primary" /> Strategy recommendations
                    </CardTitle>
                    <CardDescription className="text-[9.5px]">Based on current match index evaluations.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-3 flex flex-col gap-3">
                    {[
                      { title: 'Multi-threaded Go routines & WAL frameworks', cat: 'Suggested Project', desc: 'Code consensus routines in our playground.', xp: 'Gain +40 XP' },
                      { title: 'Docker security & minimized container sizing', cat: 'AWS / GCP course module', desc: 'Secure production gateways with SSL headers.', xp: 'Gain +25 XP' },
                      { title: 'Cold-outreach connection networking', cat: 'Mentor community event', desc: 'Connect with recruiter targets next Tuesday.', xp: 'Gain +30 XP' }
                    ].map((rec, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/20 hover:border-primary/10 transition-colors">
                        <span className="text-[8.5px] font-bold text-primary uppercase tracking-wider">{rec.cat}</span>
                        <h4 className="text-xs font-black text-text-main mt-0.5 leading-tight">{rec.title}</h4>
                        <p className="text-[10px] text-text-mute mt-1 font-semibold leading-normal">{rec.desc}</p>
                        <span className="text-[9px] font-bold text-accent mt-1.5 block font-mono">{rec.xp}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Bookmarks Manager */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-primary" /> Brand Bookmarks
                      </CardTitle>
                    </div>
                    <Badge variant="neutral" className="text-[9px] font-bold">{bookmarks.length} saved</Badge>
                  </CardHeader>
                  <CardContent className="pt-3 flex flex-col gap-2.5">
                    {bookmarks.map(bm => (
                      <div key={bm.id} className="flex justify-between items-center p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/10 text-xs font-semibold">
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[10.5px] font-bold text-text-sub truncate">{bm.title}</span>
                          <span className="text-[8px] text-text-mute uppercase tracking-widest mt-0.5">{bm.type}</span>
                        </div>
                        <button onClick={() => handleRemoveBookmark(bm.id)} className="text-text-mute hover:text-danger hover:bg-danger/5 w-6 h-6 rounded flex items-center justify-center transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-1.5 pt-1.5">
                      <Input id="bm_title" placeholder="Save article/link..." className="text-[10.5px] h-7" />
                      <Button variant="outline" size="sm" onClick={() => {
                        const val = (document.getElementById('bm_title') as HTMLInputElement)?.value;
                        if (val) {
                          handleAddBookmark(val, 'custom');
                          (document.getElementById('bm_title') as HTMLInputElement).value = '';
                        }
                      }} className="h-7 text-[10px] font-black shrink-0 py-1 px-3">
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PROFILE & DIGITAL BUSINESS CARD ================= */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Form Input (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                        <Plus className="w-4.5 h-4.5 text-primary" /> Profile & Identity architect
                      </CardTitle>
                      <CardDescription className="text-[10px]">Customize information blocks loaded into your business card and portfolio previews.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handlePrefill} className="h-7 px-2.5 font-bold flex items-center gap-1 py-1 text-[10px]">
                      <RefreshCw className="w-3 h-3" /> Sync baseline
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-4">
                    
                    {/* Hero parameters */}
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Primary Full Name"
                        value={metadata.hero.displayName}
                        onChange={e => setMetadata({ ...metadata, hero: { ...metadata.hero, displayName: e.target.value } })}
                        className="text-xs"
                      />
                      <Input
                        label="Avatar Photo URL"
                        value={metadata.hero.avatarUrl}
                        onChange={e => setMetadata({ ...metadata, hero: { ...metadata.hero, avatarUrl: e.target.value } })}
                        className="text-xs"
                      />
                    </div>
                    
                    <Input
                      label="Professional Headline (SEO Optimization)"
                      value={metadata.hero.slogan}
                      onChange={e => setMetadata({ ...metadata, hero: { ...metadata.hero, slogan: e.target.value } })}
                      className="text-xs"
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Bio Biography Summary</label>
                      <textarea
                        rows={3}
                        value={metadata.hero.bio}
                        onChange={e => setMetadata({ ...metadata, hero: { ...metadata.hero, bio: e.target.value } })}
                        className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Key Professional Skills (Separated by comma)</label>
                      <Input
                        value={metadata.skills.join(', ')}
                        onChange={e => setMetadata({ ...metadata, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="text-xs"
                      />
                    </div>

                    {/* Education Fields */}
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="School Institution"
                        value={metadata.education[0]?.school || ''}
                        onChange={e => {
                          const edu = [...metadata.education];
                          edu[0] = { ...edu[0], school: e.target.value };
                          setMetadata({ ...metadata, education: edu });
                        }}
                        className="text-xs"
                      />
                      <Input
                        label="Degree Specialty"
                        value={metadata.education[0]?.degree || ''}
                        onChange={e => {
                          const edu = [...metadata.education];
                          edu[0] = { ...edu[0], degree: e.target.value };
                          setMetadata({ ...metadata, education: edu });
                        }}
                        className="text-xs"
                      />
                      <Input
                        label="Year Claim"
                        value={metadata.education[0]?.year || ''}
                        onChange={e => {
                          const edu = [...metadata.education];
                          edu[0] = { ...edu[0], year: e.target.value };
                          setMetadata({ ...metadata, education: edu });
                        }}
                        className="text-xs"
                      />
                    </div>

                    {/* Certifications and Publications */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Certifications (One per line)</label>
                        <textarea
                          rows={2}
                          value={metadata.certifications.join('\n')}
                          onChange={e => setMetadata({ ...metadata, certifications: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Research & Publications</label>
                        <textarea
                          rows={2}
                          value={metadata.publications.join('\n')}
                          onChange={e => setMetadata({ ...metadata, publications: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Custom Section */}
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Custom Section Title"
                        value={metadata.customSection.title}
                        onChange={e => setMetadata({ ...metadata, customSection: { ...metadata.customSection, title: e.target.value } })}
                        className="text-xs"
                      />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Custom Section Content</label>
                        <textarea
                          rows={2}
                          value={metadata.customSection.content}
                          onChange={e => setMetadata({ ...metadata, customSection: { ...metadata.customSection, content: e.target.value } })}
                          className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Portfolio Theme Selection */}
                    <div className="flex flex-col gap-2.5 pt-2">
                      <span className="text-[10px] font-black text-text-mute uppercase tracking-widest border-b border-[var(--border)]/60 pb-1.5">
                        Portfolio Canvas Theme
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cyberpunk', label: 'Cyberpunk Theme', desc: 'Neon grid arrays' },
                          { id: 'minimalist', label: 'Minimalist Theme', desc: 'Sleek white paper layout' },
                          { id: 'terminal', label: 'Terminal Theme', desc: 'Green console shell' }
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => setMetadata({ ...metadata, theme: t.id as any })}
                            className={cn(
                              'p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-0.5',
                              metadata.theme === t.id ? 'border-primary bg-primary/2 text-primary shadow-xs' : 'border-[var(--border)]/70 bg-[var(--surface-secondary)]/15 text-text-mute hover:border-primary/10'
                            )}
                          >
                            <span className="text-[10.5px] font-black leading-none">{t.label}</span>
                            <span className="text-[8px] font-semibold opacity-70 leading-normal mt-0.5">{t.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Digital Business Card & Live Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Visual state Toggles */}
                <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-card w-full shadow-xs">
                  <span className="text-[10px] text-text-mute font-black uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-primary" /> Interactive digital business card
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">Recruiter View Mode</span>
                    <button 
                      onClick={() => setRecruiterMode(!recruiterMode)}
                      className={cn(
                        "w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0",
                        recruiterMode ? "bg-primary" : "bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-black transition-transform", recruiterMode ? "translate-x-4" : "translate-x-0")} />
                    </button>
                  </div>
                </div>

                {/* The Flip Card Container */}
                <div className="w-full flex justify-center items-center py-4 bg-zinc-950/40 rounded-card border border-[var(--border)] shadow-inner">
                  <div className="relative w-80 h-48 select-none group [perspective:1000px]">
                    <motion.div 
                      animate={{ rotateY: recruiterMode ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="w-full h-full rounded-2xl relative [transform-style:preserve-3d] shadow-2xl border border-zinc-800"
                    >
                      {/* CARD FRONT: Interactive Professional Badge */}
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-[#101216] p-5 rounded-2xl [backface-visibility:hidden] flex flex-col justify-between overflow-hidden">
                        
                        {/* Abstract neon circuit trace accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
                        
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3 items-center min-w-0">
                            <img 
                              src={metadata.hero.avatarUrl} 
                              alt="avatar" 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-primary/20 shrink-0" 
                            />
                            <div className="flex flex-col min-w-0">
                              <h3 className="text-sm font-black text-white leading-none truncate">{metadata.hero.displayName}</h3>
                              <span className="text-[9px] text-primary font-bold tracking-widest uppercase mt-1">SYS ENGINEER</span>
                            </div>
                          </div>
                          <Sparkle className="w-4 h-4 text-primary animate-pulse shrink-0" />
                        </div>

                        <div className="my-2">
                          <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed line-clamp-2">
                            "{metadata.hero.slogan}"
                          </p>
                        </div>

                        <div className="flex justify-between items-end border-t border-zinc-800/80 pt-2.5">
                          <span className="text-[9px] text-zinc-500 font-bold font-mono">STATUS: HIGHLY ACTIVE</span>
                          <span className="text-[10px] text-primary font-black font-mono">SCORE: {brandAnalytics.brandScore}%</span>
                        </div>
                      </div>

                      {/* CARD BACK: Scan-Ready Digital Credentials & QR Code */}
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 p-5 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex justify-between items-center">
                        <div className="flex flex-col justify-between h-full min-w-0 pr-2">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-primary font-black uppercase tracking-widest">SCAN TO INDEX PROFILE</span>
                            <span className="text-[10.5px] font-bold text-white mt-1 truncate">https://{metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.me</span>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SECURE SSL VERIFIED
                            </span>
                            <span className="text-[8.5px] text-zinc-500 font-mono">NODE ID: P_N09281X</span>
                          </div>
                        </div>

                        {/* Interactive Vector Drawn SVG QR Code */}
                        <div className="w-20 h-20 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                            {/* Outer Corners */}
                            <rect x="10" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="8" />
                            <rect x="15" y="15" width="15" height="15" fill="currentColor" />
                            <rect x="65" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="8" />
                            <rect x="70" y="15" width="15" height="15" fill="currentColor" />
                            <rect x="10" y="65" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="8" />
                            <rect x="15" y="70" width="15" height="15" fill="currentColor" />
                            
                            {/* Random dots to simulate QR Matrix */}
                            <rect x="45" y="15" width="8" height="8" fill="currentColor" />
                            <rect x="53" y="27" width="8" height="8" fill="currentColor" />
                            <rect x="45" y="45" width="15" height="15" fill="currentColor" />
                            <rect x="15" y="45" width="8" height="8" fill="currentColor" />
                            <rect x="75" y="45" width="12" height="12" fill="currentColor" />
                            <rect x="65" y="65" width="8" height="15" fill="currentColor" />
                            <rect x="80" y="75" width="10" height="10" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Device simulated live portfolio website (based on currently chosen theme) */}
                <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-xs">
                  <span className="text-[10px] text-text-mute font-black uppercase tracking-wider flex items-center gap-1">
                    <Laptop className="w-4 h-4 text-primary" /> Web Portfolio Preview
                  </span>
                  <div className="flex rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] p-0.5">
                    {['desktop', 'tablet', 'mobile'].map(vm => (
                      <button
                        key={vm}
                        onClick={() => setViewMode(vm as any)}
                        className={cn(
                          'p-1 px-2.5 rounded text-[9px] font-black transition-all cursor-pointer',
                          viewMode === vm ? 'bg-primary text-black' : 'text-text-mute hover:text-text-sub'
                        )}
                      >
                        {vm.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-zinc-950/40 border border-[var(--border)] rounded-card p-3 flex items-center justify-center overflow-auto max-h-[300px] shadow-inner select-none">
                  <motion.div
                    animate={{
                      width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '320px' : '230px',
                      height: '240px',
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-y-auto relative flex flex-col scrollbar-thin shadow-2xl"
                  >
                    {/* Device header bar */}
                    <div className="h-5 shrink-0 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3 text-[8px] font-bold text-zinc-500 font-mono">
                      <span>{metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me</span>
                      <span>ACTIVE_THEME</span>
                    </div>

                    {/* Minimalist Theme */}
                    {metadata.theme === 'minimalist' && (
                      <div className="flex-1 bg-white text-zinc-800 p-4 flex flex-col gap-4 font-sans text-[10px]">
                        <h2 className="text-zinc-900 font-black text-xs border-b border-zinc-100 pb-2">{metadata.hero.displayName}</h2>
                        <h3 className="text-zinc-950 font-bold leading-snug">{metadata.hero.slogan}</h3>
                        <p className="text-zinc-500 leading-relaxed font-semibold">{metadata.hero.bio}</p>
                      </div>
                    )}

                    {/* Cyberpunk Theme */}
                    {metadata.theme === 'cyberpunk' && (
                      <div className="flex-1 bg-[#0a0c10] text-[#a0aec0] p-4 flex flex-col gap-4 font-sans text-[9px]">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                          <span className="text-[#00ffcc] font-black tracking-widest uppercase font-mono">&gt; {metadata.hero.displayName}.EXE</span>
                          <span className="text-[7px] bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/30 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">SSL_ACTIVE</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[#00ffcc] font-extrabold leading-snug">{metadata.hero.slogan}</p>
                          <p className="text-zinc-500 mt-1 font-semibold leading-relaxed">{metadata.hero.bio}</p>
                        </div>
                      </div>
                    )}

                    {/* Terminal Theme */}
                    {metadata.theme === 'terminal' && (
                      <div className="flex-1 bg-black text-[#00ff00] p-4 flex flex-col gap-3 font-mono text-[9px]">
                        <div className="border-b border-[#00ff00]/20 pb-1 text-zinc-500">SYS: NODE_SYS_INIT</div>
                        <div>$ cat credentials.log</div>
                        <div className="p-2 border border-[#00ff00]/15 bg-zinc-950 rounded-md text-white font-semibold flex flex-col gap-1">
                          <div>NAME: {metadata.hero.displayName}</div>
                          <div>SLOGAN: {metadata.hero.slogan}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Live publishing status trigger block */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardContent className="py-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-text-main flex items-center gap-1">
                          <Server className="w-3.5 h-3.5 text-primary" /> Live Cloud Node Deployment
                        </span>
                        <span className="text-[9.5px] text-text-mute mt-0.5 font-semibold">
                          Publish coordinates live instantly.
                        </span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="text-[10px] h-8 px-4 font-black flex items-center gap-1 bg-primary text-black cursor-pointer shadow-md"
                      >
                        {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                        {isPublishing ? 'Deploying...' : 'Publish Live'}
                      </Button>
                    </div>

                    {isPublished && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-success/5 border border-success/15 flex items-center justify-between gap-4 mt-1"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] text-success font-black uppercase tracking-wider leading-none">DEPLOY ONLINE & SECURE</span>
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); }}
                            className="text-xs font-bold text-text-main hover:text-primary flex items-center gap-1 mt-1.5 underline truncate"
                          >
                            https://{metadata.hero.displayName.toLowerCase().replace(/\s+/g, '')}.pathpilot.me <ArrowUpRight className="w-3 h-3 text-primary shrink-0" />
                          </a>
                        </div>
                        <Badge variant="neutral" className="bg-success/20 text-success font-bold text-[8px] border border-success/25 shrink-0">
                          ✓ SSL ACTIVE
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ================= TAB 3: AI PROFILE & CHANNEL OPTIMIZER ================= */}
          {activeTab === 'optimizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Form controls (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60">
                    <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-primary" /> Profile Optimizer Engine
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Construct optimized keywords to boost search appearances index.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-4">
                    
                    {/* Platform Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Target Output Channel</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'linkedin', label: 'LinkedIn Optimizations' },
                          { id: 'github', label: 'GitHub Profile README' },
                          { id: 'bio', label: 'Professional Bios' },
                          { id: 'pitch', label: 'Elevator Pitch' }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => { setOptType(p.id as any); setOptOutput(null); }}
                            className={cn(
                              'p-2.5 border rounded-lg text-left text-[10.5px] font-black cursor-pointer transition-colors',
                              optType === p.id ? 'border-primary bg-primary/2 text-primary' : 'border-[var(--border)]/70 bg-[var(--surface-secondary)]/15 text-text-mute hover:border-primary/10'
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {optType === 'bio' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Desired Biography length</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['short', 'medium', 'long'].map(l => (
                            <button
                              key={l}
                              onClick={() => setBioLength(l as any)}
                              className={cn(
                                'py-1.5 border rounded-md text-[9.5px] font-black uppercase tracking-wider cursor-pointer',
                                bioLength === l ? 'border-primary bg-primary/2 text-primary' : 'border-[var(--border)] text-text-mute hover:border-primary/10'
                              )}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Input
                      label="Key Editorial Tone Personality"
                      value={optTone}
                      onChange={e => setOptTone(e.target.value)}
                      placeholder="e.g. Pragmatic systems architect, serious executive"
                      className="text-xs"
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Custom Background Context</label>
                      <textarea
                        rows={3}
                        value={optContext}
                        onChange={e => setOptContext(e.target.value)}
                        placeholder="Highlight achievements (e.g., designed Go Consensus WAL routing ledger speedup)."
                        className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOptimizeProfile}
                      disabled={isOptimizing}
                      className="w-full h-9 font-black text-xs flex items-center justify-center gap-1.5 mt-2 bg-primary text-black cursor-pointer"
                    >
                      {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-black animate-pulse" />}
                      {isOptimizing ? 'Aligning credentials...' : 'Optimize visibility assets'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Portfolio Design Audit Checklists */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                    <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-primary" /> Design Audit Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 flex flex-col gap-2">
                    {[
                      { label: 'Visual Hierarchy Audit', checked: true, text: 'Margins correspond perfectly with baseline spacing grids.' },
                      { label: 'Asset Completeness Audit', checked: isPublished, text: 'Custom SSL domain registered & verified by PathPilot.' },
                      { label: 'Presentation Tech Audit', checked: true, text: 'All code snippets formatted inside clean syntax frames.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/10">
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5",
                          item.checked ? "bg-primary border-primary text-black" : "border-[var(--border)] bg-transparent"
                        )}>
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10.5px] font-bold text-text-sub">{item.label}</span>
                          <p className="text-[9.5px] text-text-mute mt-0.5 font-semibold leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Outputs Panel (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <Card className="border-[var(--border)] bg-[var(--surface)] h-full min-h-[460px] flex flex-col">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60">
                    <CardTitle className="text-sm font-black text-text-main">
                      AI Generated Channel Coordinates
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Copy these deliverables directly into your LinkedIn, GitHub, or portfolio systems.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    {!optOutput ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-text-mute">
                        <UserCheck className="w-10 h-10 stroke-[1.5] mb-3 text-text-mute/50" />
                        <span className="text-xs font-black uppercase tracking-wider">Awaiting parameters</span>
                        <p className="text-[10px] max-w-xs leading-relaxed mt-1 font-semibold">
                          Configure your target channel on the left and trigger the AI brand optimizer.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 flex-1">
                        
                        {optType === 'linkedin' && (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/35 relative">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Headline (Optimized)</span>
                              <p className="text-xs font-bold text-text-main mt-2 leading-snug pr-8">{optOutput.headline}</p>
                              <button
                                onClick={() => triggerCopy(optOutput.headline, 'headline')}
                                className="absolute top-2.5 right-2.5 w-7 h-7 hover:bg-[var(--hover-tint)] text-text-sub flex items-center justify-center rounded cursor-pointer transition-all border border-transparent hover:border-[var(--border)]"
                              >
                                {copiedSection === 'headline' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/35 relative">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">About Summary (Keywords audit)</span>
                              <pre className="text-[11px] font-sans font-bold text-text-sub mt-2 leading-relaxed whitespace-pre-wrap pr-8 max-h-[160px] overflow-y-auto scrollbar-thin">
                                {optOutput.about}
                              </pre>
                              <button
                                onClick={() => triggerCopy(optOutput.about, 'about')}
                                className="absolute top-2.5 right-2.5 w-7 h-7 hover:bg-[var(--hover-tint)] text-text-sub flex items-center justify-center rounded cursor-pointer transition-all border border-transparent hover:border-[var(--border)]"
                              >
                                {copiedSection === 'about' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/35 relative">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">High-Visibility Featured Post</span>
                              <pre className="text-[11px] font-sans font-bold text-text-sub mt-2 leading-relaxed whitespace-pre-wrap pr-8 max-h-[140px] overflow-y-auto scrollbar-thin">
                                {optOutput.featuredPost}
                              </pre>
                              <button
                                onClick={() => triggerCopy(optOutput.featuredPost, 'post')}
                                className="absolute top-2.5 right-2.5 w-7 h-7 hover:bg-[var(--hover-tint)] text-text-sub flex items-center justify-center rounded cursor-pointer transition-all border border-transparent hover:border-[var(--border)]"
                              >
                                {copiedSection === 'post' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {optType !== 'linkedin' && (
                          <div className="flex-1 flex flex-col relative p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/35 min-h-[350px]">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">
                              {optType === 'github' ? 'Profile README.md markdown' : `${optType.toUpperCase()} output`}
                            </span>
                            <textarea
                              readOnly
                              value={optOutput.text || optOutput.markdown || ''}
                              className="w-full flex-1 mt-3 font-mono text-[10.5px] leading-relaxed p-3 rounded-lg border border-[var(--border)] bg-zinc-950 text-[#00ffcc] focus:outline-none scrollbar-thin resize-none"
                            />
                            <button
                              onClick={() => triggerCopy(optOutput.text || optOutput.markdown || '', 'markdown')}
                              className="absolute top-3.5 right-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[#00ffcc] w-8 h-8 flex items-center justify-center rounded-lg shadow-md cursor-pointer active:scale-95 transition-transform"
                            >
                              {copiedSection === 'markdown' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ================= TAB 4: AI CONTENT CREATOR & CALENDAR ================= */}
          {activeTab === 'creator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Creator Settings (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60">
                    <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5 text-primary" /> AI Content Builder
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Generate technical thought-leadership content based on your personal projects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-4">
                    
                    {/* Post Type Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Format Category</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'linkedin', label: 'LinkedIn Post' },
                          { id: 'twitter', label: 'Twitter Thread' },
                          { id: 'article', label: 'Long Article' },
                          { id: 'project', label: 'Project Launch' }
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setPostType(type.id as any)}
                            className={cn(
                              'py-2 px-3 border rounded-lg text-left text-[10px] font-black cursor-pointer transition-colors',
                              postType === type.id ? 'border-primary bg-primary/2 text-primary' : 'border-[var(--border)]/70 bg-[var(--surface-secondary)]/15 text-text-mute hover:border-primary/10'
                            )}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Key Topic Focus"
                      value={postTopic}
                      onChange={e => setPostTopic(e.target.value)}
                      placeholder="e.g. Demystifying raft consensus algorithms"
                      className="text-xs"
                    />

                    <Input
                      label="Editorial Personality Style"
                      value={postTone}
                      onChange={e => setPostTone(e.target.value)}
                      className="text-xs"
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Additional details / Code logic context</label>
                      <textarea
                        rows={3}
                        value={postContext}
                        onChange={e => setPostContext(e.target.value)}
                        placeholder="e.g. Discussing Go mutex locks and WAL sequence buffers."
                        className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGeneratePost}
                      disabled={isGeneratingPost}
                      className="w-full h-9 font-black text-xs flex items-center justify-center gap-1.5 mt-2 bg-primary text-black cursor-pointer"
                    >
                      {isGeneratingPost ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-black" />}
                      {isGeneratingPost ? 'Compiling narrative...' : 'Draft Editorial Post'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Editor Outputs & Calendar planner (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Proposed Draft */}
                {postResult && (
                  <Card className="border-primary/20 bg-primary/2">
                    <CardHeader className="py-2.5 border-b border-primary/10 flex flex-row justify-between items-center">
                      <span className="text-[9.5px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Post proposal
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPostResult('')} className="text-[9.5px] h-6 px-2 border-primary/20 text-primary py-1">
                          Discard
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSavePostDraft} className="text-[9.5px] h-6 px-2.5 bg-primary text-black py-1">
                          Save Draft
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 pb-4">
                      <pre className="text-xs font-sans font-bold text-text-main leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto scrollbar-thin pr-3">
                        {postResult}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {/* Editorial Queue & Planner */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4.5 h-4.5 text-primary" /> Editorial Plan & Queue
                      </CardTitle>
                      <CardDescription className="text-[9.5px]">Schedule draft deliverables directly into your content planner slots.</CardDescription>
                    </div>
                    <div className="flex border border-[var(--border)] bg-[var(--surface-secondary)] p-0.5 rounded-lg shrink-0">
                      {['weekly', 'monthly'].map(view => (
                        <button
                          key={view}
                          onClick={() => setCalendarView(view as any)}
                          className={cn(
                            'p-1 px-2.5 rounded text-[8.5px] font-black transition-all cursor-pointer',
                            calendarView === view ? 'bg-primary text-black' : 'text-text-mute hover:text-text-sub'
                          )}
                        >
                          {view.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    
                    {calendarView === 'weekly' ? (
                      <div className="flex flex-col gap-3">
                        {publishingQueue.map((slot, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/15 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center border-b border-[var(--border)]/40 pb-1">
                              <span className="text-[9px] text-primary font-black uppercase tracking-wider">{slot.date}</span>
                              <Badge variant="neutral" className="text-[8.5px] font-bold">{slot.type.toUpperCase()}</Badge>
                            </div>
                            <p className="text-[11px] text-text-mute font-semibold leading-relaxed">{slot.draft}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1 text-center select-none font-mono text-[9px] font-semibold">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="py-1 text-text-mute uppercase">{day}</div>
                        ))}
                        {Array.from({ length: 28 }).map((_, i) => {
                          const hasSlot = i === 4 || i === 12 || i === 18;
                          return (
                            <div key={i} className={cn(
                              "aspect-square rounded border border-[var(--border)]/40 p-1 text-left flex flex-col justify-between",
                              hasSlot ? 'bg-primary/5 border-primary/20' : 'bg-[var(--surface-secondary)]/10'
                            )}>
                              <span>{i + 1}</span>
                              {hasSlot && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Saved Drafts Queue */}
                    <div className="flex flex-col gap-3.5 mt-5 pt-4 border-t border-[var(--border)]/60">
                      <span className="text-[10px] font-black text-text-mute uppercase tracking-widest leading-none block pb-1.5">
                        Saved Post Templates ({savedPostDrafts.length})
                      </span>
                      {savedPostDrafts.length > 0 ? (
                        <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto scrollbar-thin">
                          {savedPostDrafts.map((draft, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/20 hover:border-primary/10 transition-colors relative group">
                              <p className="text-[11px] text-text-sub font-semibold leading-relaxed whitespace-pre-wrap pr-16 line-clamp-3">
                                {draft}
                              </p>
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => triggerCopy(draft, `queue-${idx}`)}
                                  className="w-6 h-6 bg-[var(--surface)] hover:bg-[var(--hover-tint)] text-text-sub flex items-center justify-center rounded border border-[var(--border)] cursor-pointer"
                                >
                                  {copiedSection === `queue-${idx}` ? <Check className="w-3 text-success" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => handleAddToQueue(draft)}
                                  className="w-6 h-6 bg-[var(--surface)] hover:bg-primary/10 text-primary flex items-center justify-center rounded border border-[var(--border)] cursor-pointer"
                                  title="Schedule"
                                >
                                  <Calendar className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDraft(idx)}
                                  className="w-6 h-6 bg-[var(--surface)] hover:bg-danger/10 text-danger flex items-center justify-center rounded border border-[var(--border)] cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-text-mute font-semibold text-[10px]">
                          Templates list is empty. Draft a custom post above to build up catalog.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ================= TAB 5: OUTREACH & NETWORK CRM ================= */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* CRM Contact List & Add Panel (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-mute" />
                  <input
                    type="text"
                    placeholder="Search smart connections..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-xs p-2.5 pl-10 border border-[var(--border)] rounded-card bg-[var(--surface)] focus:border-primary focus:outline-none transition-colors font-semibold"
                  />
                </div>

                {/* Contacts Manager list */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                    <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                      <Users className="w-4.5 h-4.5 text-primary" /> Recruiter & Mentor Contacts CRM
                    </CardTitle>
                    <CardDescription className="text-[10px]">Track target employers, scholarship committees, and open-source tech partners.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-3">
                    {filteredContacts.length > 0 ? (
                      <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto scrollbar-thin">
                        {filteredContacts.map(contact => (
                          <div key={contact.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/15 flex flex-col gap-2 relative group hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start pr-12">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-text-main leading-tight">{contact.name}</span>
                                <span className="text-[10px] text-text-mute mt-0.5 font-semibold">
                                  {contact.role} at <strong className="text-text-sub font-bold">{contact.organization}</strong>
                                </span>
                              </div>
                              <Badge variant="neutral" className="text-[8.5px] font-black uppercase tracking-wider bg-primary/10 border border-primary/15 text-primary px-2">
                                {contact.relationship}
                              </Badge>
                            </div>

                            <p className="text-[10px] text-text-mute font-semibold leading-relaxed bg-[var(--surface)] border border-[var(--border)]/60 p-2 rounded-lg mt-1">
                              {contact.notes}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-1 text-[8.5px] font-bold text-text-mute">
                              <span className="flex items-center gap-1">📅 Follow-up: {contact.followUpDate || 'Flexible'}</span>
                              <span className="text-primary font-mono ml-auto">Priority: {contact.priority.toUpperCase()}</span>
                            </div>

                            {/* Hover Options */}
                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleGenerateOutreach(contact)}
                                className="w-7 h-7 bg-primary text-black hover:bg-primary/90 flex items-center justify-center rounded border border-transparent shadow-md cursor-pointer transition-transform active:scale-95"
                                title="Draft Pitch"
                              >
                                {selectedContactForOutreach === contact.id && isGeneratingOutreach ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="w-7 h-7 bg-[var(--surface)] hover:bg-danger/10 text-danger flex items-center justify-center rounded border border-[var(--border)] cursor-pointer"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-text-mute font-semibold text-[10px]">
                        No active contacts matching filters. Use the registry below to add connections.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Contact Registry */}
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="pb-2 border-b border-[var(--border)]/60">
                    <CardTitle className="text-xs font-black text-text-main uppercase tracking-wider">
                      Register Connection Node
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handleAddContact} className="grid grid-cols-2 gap-3">
                      <Input
                        label="Full Name"
                        value={newContact.name || ''}
                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                        required
                        className="text-xs"
                      />
                      <Input
                        label="Organization / Company"
                        value={newContact.organization || ''}
                        onChange={e => setNewContact({ ...newContact, organization: e.target.value })}
                        required
                        className="text-xs"
                      />
                      <Input
                        label="Designation / Role"
                        value={newContact.role || ''}
                        onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                        className="text-xs"
                      />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Relationship Class</label>
                        <select
                          value={newContact.relationship || 'recruiter'}
                          onChange={e => setNewContact({ ...newContact, relationship: e.target.value as any })}
                          className="w-full text-xs p-2 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="recruiter">University / Tech Recruiter</option>
                          <option value="mentor">Technical Mentor</option>
                          <option value="collaborator">Open Source Collaborator</option>
                          <option value="investor">Angel / Venture Investor</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          label="Notes / Collaboration Anchor Point"
                          value={newContact.notes || ''}
                          onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
                          placeholder="e.g. Discussed Go microservices caching, agreed to sync resume."
                          className="text-xs"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button type="submit" variant="primary" size="sm" className="bg-primary text-black font-black text-xs h-8 px-4">
                          Sync CRM Registry
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Outreach Deliverables results panel (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card className="border-[var(--border)] bg-[var(--surface)] h-full min-h-[440px] flex flex-col">
                  <CardHeader className="pb-3 border-b border-[var(--border)]/60">
                    <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
                      <Mail className="w-4.5 h-4.5 text-primary" /> Generated Outreach Pitcher
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Send these professional templates to lock down digital coordinates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    
                    {/* Outreach Type Template Selectors */}
                    <div className="flex flex-wrap gap-1.5 mb-4 border-b border-[var(--border)]/40 pb-2.5">
                      {[
                        { id: 'cold', label: 'Cold Outreach' },
                        { id: 'referral', label: 'Referrals' },
                        { id: 'scholarship', label: 'Scholarships' },
                        { id: 'followup', label: 'Follow-ups' }
                      ].map(template => (
                        <button
                          key={template.id}
                          onClick={() => { setOutreachType(template.id as any); setOutreachResult(''); }}
                          className={cn(
                            'py-1 px-2.5 border rounded-md text-[8.5px] font-black uppercase tracking-wider cursor-pointer',
                            outreachType === template.id ? 'border-primary bg-primary/2 text-primary' : 'border-[var(--border)]/60 text-text-mute hover:border-primary/10'
                          )}
                        >
                          {template.label}
                        </button>
                      ))}
                    </div>

                    {!outreachResult ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-text-mute">
                        <Mail className="w-10 h-10 stroke-[1.5] mb-3 text-text-mute/50" />
                        <span className="text-xs font-black uppercase tracking-wider">Awaiting CRM selection</span>
                        <p className="text-[10px] max-w-xs leading-relaxed mt-1 font-semibold">
                          Hover on any contact in the left CRM panel and click the Mail icon to formulate highly personalized connection pitches.
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col relative p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/35 min-h-[300px]">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Draft Content</span>
                        <textarea
                          readOnly
                          value={outreachResult}
                          className="w-full flex-1 mt-3 font-sans text-[11px] font-semibold leading-relaxed p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-text-sub focus:outline-none scrollbar-thin resize-none"
                        />
                        <button
                          onClick={() => triggerCopy(outreachResult, 'outreach_res')}
                          className="absolute top-4 right-4 bg-primary text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-md cursor-pointer active:scale-95 transition-transform"
                        >
                          {copiedSection === 'outreach_res' ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* --- FLOATING MILITARY DRAWER FOR MAPPING BRAND ACTIVITY --- */}
      <AnimatePresence>
        {isActivityDrawerOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsActivityDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--surface)] border-l border-[var(--border)] z-50 p-6 flex flex-col gap-5 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex flex-col">
                  <h3 className="font-display font-black text-sm text-text-main uppercase tracking-tight">
                    Map Brand Visibility Milestone
                  </h3>
                  <p className="text-[10px] text-text-mute mt-0.5">Plan custom thought-leadership milestones or open-source contribution claims.</p>
                </div>
                <button onClick={() => setIsActivityDrawerOpen(false)} className="w-8 h-8 rounded-full hover:bg-[var(--hover-tint)] text-text-mute hover:text-text-main flex items-center justify-center">✕</button>
              </div>

              <form onSubmit={handleAddBrandActivitySubmit} className="flex flex-col gap-4">
                <Input
                  label="Milestone / Topic Title"
                  value={newActivityTitle}
                  onChange={e => setNewActivityTitle(e.target.value)}
                  placeholder="e.g. Demystifying transactional lock contention in PostgreSQL"
                  required
                  className="text-xs"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Detailed Description / Educational Goal</label>
                  <textarea
                    rows={3}
                    value={newActivityDesc}
                    onChange={e => setNewActivityDesc(e.target.value)}
                    required
                    placeholder="Describe what technical accomplishments you plan to articulate to your recruiter networks."
                    className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Target Channel Platform</label>
                    <select
                      value={newActivityPlatform}
                      onChange={e => setNewActivityPlatform(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="linkedin">LinkedIn Update</option>
                      <option value="github">GitHub Contrib</option>
                      <option value="certification">Certification Claim</option>
                      <option value="community">Tech Forum Post</option>
                      <option value="event">Technical Event Host</option>
                    </select>
                  </div>
                  <Input
                    label="Target Schedule Date"
                    type="date"
                    value={newActivityDate}
                    onChange={e => setNewActivityDate(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]/70 mt-3">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsActivityDrawerOpen(false)}>Discard</Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-primary text-black">Schedule Visibility Action</Button>
                </div>
              </form>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PortfolioBuilder;
