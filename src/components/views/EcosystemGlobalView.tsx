/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useToast } from '../ui/ToastContext';
import { EcosystemService } from '../../services/ecosystemService';
import {
  CommunityPost,
  MentorProfile,
  MarketplacePlugin,
  RecruiterCandidateMatch,
  AIDigitalTwinState,
  UniversityCampus,
} from '../../types/ecosystem';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';

import {
  Globe, Users, ShoppingBag, Briefcase, GraduationCap, Mic,
  Smartphone, Bot, Heart, MessageSquare, Share2, Plus, Star,
  Calendar, CheckCircle2, Download, Search, ShieldCheck, Sparkles,
  Wifi, Bell, Lock, Cpu, Send, RefreshCw, Layers, Award
} from 'lucide-react';

export const EcosystemGlobalView: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('community');

  // State
  const [posts, setPosts] = useState<CommunityPost[]>(() => EcosystemService.getCommunityPosts());
  const [mentors] = useState<MentorProfile[]>(() => EcosystemService.getMentors());
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>(() => EcosystemService.getPlugins());
  const [candidates] = useState<RecruiterCandidateMatch[]>(() => EcosystemService.getCandidates());
  const [digitalTwin, setDigitalTwin] = useState<AIDigitalTwinState>(() => EcosystemService.getDigitalTwinState());
  const [universities] = useState<UniversityCampus[]>(() => EcosystemService.getUniversities());

  // Community New Post Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'general' | 'career_advice' | 'interview_prep' | 'project_showcase' | 'ai_insights'>('career_advice');

  // Voice & Language State
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string[]>([]);

  // Mobile Sync state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [offlineStatus, setOfflineStatus] = useState('Online (Synced with Cloud)');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;

    const newPost = EcosystemService.addCommunityPost({
      authorName: 'Alex Mercer',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      authorRole: 'Senior AI Engineer Candidate',
      title: postTitle,
      content: postContent,
      category: postCategory,
      tags: ['CareerPath', 'PathPilotEcosystem'],
    });

    setPosts([...EcosystemService.getCommunityPosts()]);
    setShowPostModal(false);
    setPostTitle('');
    setPostContent('');
    showToast({ title: 'Post Published', description: 'Your message is live on the Global Community Feed.', type: 'success' });
  };

  const handleTogglePlugin = (id: string) => {
    EcosystemService.togglePluginInstall(id);
    setPlugins([...EcosystemService.getPlugins()]);
    showToast({ title: 'Plugin Updated', description: 'Plugin status synchronized.', type: 'info' });
  };

  const handleToggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setVoiceLog((prev) => [...prev, `[Voice AI] Session started in ${selectedLanguage}. Speak to your AI Digital Twin.`]);
      showToast({ title: 'Voice AI Listening', description: `Speaking in ${selectedLanguage}.`, type: 'info' });
    } else {
      showToast({ title: 'Voice AI Paused', description: 'Session ended.', type: 'info' });
    }
  };

  const tabs = [
    { id: 'community', label: 'Community Feed', icon: <Users className="w-4 h-4" /> },
    { id: 'mentors', label: 'Mentor Marketplace', icon: <Star className="w-4 h-4" /> },
    { id: 'recruiters', label: 'Recruiter Platform', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'marketplace', label: 'AI Plugins & Packs', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'twin', label: 'AI Digital Twin & Voice', icon: <Bot className="w-4 h-4" /> },
    { id: 'universities', label: 'University Hub', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'mobile', label: 'Mobile & Push Sync', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-12">
      {/* Ecosystem Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg text-text-main uppercase tracking-tight">
                Global AI Career Ecosystem
              </h2>
              <Badge variant="primary" className="uppercase font-mono text-[9px]">
                Phase 18 Final
              </Badge>
            </div>
            <p className="text-xs text-text-mute mt-0.5">
              Integrated network connecting Candidates, Mentors, Recruiters, AI Plugins, Universities, and Mobile Apps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => showToast({ title: 'Ecosystem Synced', description: 'All 7 global subsystems operating normally.', type: 'success' })}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Cloud Sync
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] pb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: COMMUNITY FEED */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-text-main">Global Career Feed</h3>
              <Button variant="default" size="sm" onClick={() => setShowPostModal(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> New Post
              </Button>
            </div>

            {posts.map((post) => (
              <Card key={post.id} variant="outline" className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-9 h-9 rounded-full object-cover border border-[var(--border)]" />
                    <div>
                      <h4 className="font-bold text-xs text-text-main">{post.authorName}</h4>
                      <p className="text-[10px] text-text-mute font-mono">{post.authorRole}</p>
                    </div>
                  </div>
                  <Badge variant="primary" className="text-[8px] uppercase font-mono">
                    {post.category.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-text-main leading-snug">{post.title}</h3>
                  <p className="text-xs text-text-sub mt-1.5 leading-relaxed">{post.content}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-text-mute font-mono">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-danger transition-colors cursor-pointer">
                      <Heart className="w-3.5 h-3.5" /> {post.likesCount}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount} Comments
                    </button>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Card variant="outline">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Active Communities
                </CardTitle>
                <CardDescription>Join specialized university & regional career channels.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs">
                {['AI Systems Engineers', 'Stanford Alumni Network', 'Balochistan Tech Initiative', 'FAANG Staff Candidates'].map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex justify-between items-center">
                    <span className="font-semibold text-text-main">{c}</span>
                    <Badge variant="neutral" className="text-[8px]">Joined</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MENTOR MARKETPLACE */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {mentors.map((m) => (
            <Card key={m.id} variant="outline" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <img src={m.avatarUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                  <div>
                    <h3 className="font-bold text-sm text-text-main">{m.name}</h3>
                    <p className="text-xs text-text-mute font-mono">{m.title} • {m.company}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {m.rating} ({m.reviewsCount} reviews)
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-sub mt-4 leading-relaxed">{m.bio}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.expertise.map((exp, idx) => (
                    <Badge key={idx} variant="primary" className="text-[9px]">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-text-mute uppercase font-mono">Rate</span>
                  <div className="text-sm font-black text-text-main">${m.hourlyRateDollars} / hour</div>
                </div>
                <Button variant="default" size="sm" onClick={() => showToast({ title: 'Session Requested', description: `Booking request sent to ${m.name}.`, type: 'success' })}>
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Book Session
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: RECRUITER PLATFORM */}
      {activeTab === 'recruiters' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Recruiter & Talent Acquisition Radar
              </CardTitle>
              <CardDescription>AI-verified candidate profiles ready for 1-click interviewing.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Target Role</th>
                    <th className="p-3">Match Fit</th>
                    <th className="p-3">ATS Score</th>
                    <th className="p-3">Location</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                      <td className="p-3 font-bold text-text-main">{c.candidateName}</td>
                      <td className="p-3 text-text-sub font-mono">{c.targetRole}</td>
                      <td className="p-3 font-bold text-success font-mono">{c.matchScore}%</td>
                      <td className="p-3 font-bold text-primary font-mono">{c.atsScore}/100</td>
                      <td className="p-3 text-text-mute">{c.location}</td>
                      <td className="p-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast({ title: 'Interview Invited', description: `Sent invitation to ${c.candidateName}.`, type: 'success' })}>
                          Schedule Interview
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: AI MARKETPLACE & PLUGINS */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {plugins.map((plug) => (
            <Card key={plug.id} variant="outline" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-text-main">{plug.name}</h3>
                  <Badge variant={plug.installed ? 'success' : 'outline'} className="text-[8px] uppercase">
                    {plug.installed ? 'Installed' : 'Available'}
                  </Badge>
                </div>
                <p className="text-[10px] text-text-mute font-mono mt-0.5">By {plug.developer}</p>
                <p className="text-xs text-text-sub mt-2 leading-relaxed">{plug.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="font-bold text-primary font-mono">{plug.priceDollars === 0 ? 'FREE' : `$${plug.priceDollars}`}</span>
                <Button variant={plug.installed ? 'outline' : 'default'} size="sm" onClick={() => handleTogglePlugin(plug.id)}>
                  {plug.installed ? 'Uninstall' : 'Install Plugin'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 5: AI DIGITAL TWIN & VOICE */}
      {activeTab === 'twin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> Personal AI Digital Twin State
              </CardTitle>
              <CardDescription>Persistent AI twin trained on your resume, writing style, and goals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-text-mute uppercase">Status</span>
                  <div className="font-bold text-success mt-0.5 uppercase">{digitalTwin.synchronizationStatus}</div>
                </div>
                <div>
                  <span className="text-[10px] text-text-mute uppercase">Goal Fit</span>
                  <div className="font-bold text-primary mt-0.5">{digitalTwin.careerGoalMatch}%</div>
                </div>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-text-sub">
                <div>Writing Style: <span className="font-bold text-text-main">{digitalTwin.writingStyleModel}</span></div>
                <div>Indexed Docs: <span className="font-bold text-text-main">{digitalTwin.indexedDocumentsCount} Files</span></div>
                <div>Interview Audio Trained: <span className="font-bold text-text-main">{digitalTwin.indexedInterviewHours} Hours</span></div>
              </div>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" /> Multilingual Voice AI Engine
              </CardTitle>
              <CardDescription>Real-time speech-to-text career coaching in multiple global languages.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <select
                  className="p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs text-text-main font-semibold"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {['English', 'Urdu', 'Balochi', 'Arabic', 'Chinese', 'French', 'Spanish', 'German', 'Japanese'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <Button variant={isVoiceActive ? 'danger' : 'default'} size="sm" onClick={handleToggleVoice}>
                  <Mic className="w-3.5 h-3.5 mr-1" /> {isVoiceActive ? 'Stop Voice' : 'Start Voice AI'}
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-black/90 font-mono text-[10px] text-emerald-400 h-32 overflow-y-auto">
                {voiceLog.length === 0 ? (
                  <p className="text-emerald-700">Voice system ready. Select language and click Start Voice AI.</p>
                ) : (
                  voiceLog.map((log, i) => <p key={i}>{log}</p>)
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: UNIVERSITY HUB */}
      {activeTab === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {universities.map((uni) => (
            <Card key={uni.id} variant="outline" className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-text-main">{uni.name}</h3>
                <p className="text-[10px] text-text-mute font-mono mt-0.5">{uni.location}</p>

                <div className="mt-3 flex gap-4 text-xs font-mono">
                  <div>Students: <span className="font-bold text-primary">{uni.enrolledStudentsCount}</span></div>
                  <div>Placement Rate: <span className="font-bold text-success">{uni.placementRatePercent}%</span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                <Badge variant="neutral" className="text-[8px] uppercase">Campus Verified</Badge>
                <Button variant="outline" size="sm" onClick={() => showToast({ title: 'Campus Connected', description: `Linked with ${uni.name}.`, type: 'info' })}>
                  View Placement Portal
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 7: MOBILE & PUSH SYNC */}
      {activeTab === 'mobile' && (
        <Card variant="outline" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" /> Cross-Device Mobile & Offline Sync Engine
            </CardTitle>
            <CardDescription>PWA, background notifications, and biometric authentication status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-success" />
                <span className="font-bold text-text-main">{offlineStatus}</span>
              </div>
              <Badge variant="success" className="text-[9px]">PWA READY</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-text-main">Push Notifications</span>
                </div>
                <button
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${pushEnabled ? 'bg-primary' : 'bg-gray-400'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-text-main">Biometric Authentication (FaceID / Fingerprint)</span>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${biometricEnabled ? 'bg-primary' : 'bg-gray-400'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${biometricEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NEW COMMUNITY POST MODAL */}
      {showPostModal && (
        <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Create Community Post">
          <form onSubmit={handleCreatePost} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Category</label>
              <select
                className="w-full mt-1 p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs text-text-main"
                value={postCategory}
                onChange={(e: any) => setPostCategory(e.target.value)}
              >
                <option value="career_advice">Career Advice</option>
                <option value="interview_prep">Interview Prep</option>
                <option value="project_showcase">Project Showcase</option>
                <option value="ai_insights">AI Insights</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Post Title</label>
              <Input placeholder="e.g. Tips for Staff Architect System Design Interviews" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
            </div>

            <div>
              <label className="font-bold text-[10px] text-text-mute uppercase">Post Content</label>
              <textarea
                rows={4}
                className="w-full mt-1 p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs text-text-main"
                placeholder="Share your learnings..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowPostModal(false)}>Cancel</Button>
              <Button variant="default" size="sm" type="submit">Publish Post</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
