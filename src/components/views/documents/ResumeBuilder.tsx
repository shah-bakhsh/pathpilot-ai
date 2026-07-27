/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Briefcase, FileText, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, 
  RotateCcw, Download, RefreshCw, Check, BookOpen, AlertCircle, Eye,
  Layout, Award, ExternalLink, Globe, Phone, Mail, MapPin, Linkedin, Github
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ResumeContent, ResumeSectionItem } from '../../../types';
import { cn } from '../../../lib/utils';

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const { 
    activeResume, 
    updateContentAutoSave, 
    saveActiveResume, 
    saveStatus, 
    changeTemplate,
    createVersionSnapshot
  } = useResume();

  const { addNotification, portfolioLinks } = useCareer();

  // Active section tab
  const [activeSection, setActiveSection] = useState<'info' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'languages'>('info');
  const [template, setTemplate] = useState<string>(activeResume?.templateId || 'modern');
  const [isImprovingSummary, setIsImprovingSummary] = useState<boolean>(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);

  // Sync content state locally
  const [content, setContent] = useState<ResumeContent>(() => {
    return activeResume?.content || {
      personalInfo: {
        fullName: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        headline: 'Senior Full Stack Software Engineer',
        websiteUrl: 'https://johndoe.dev',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
      },
      summary: 'Passionate Software Engineer with 5+ years of experience engineering high-performance web applications and cloud microservices.',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: [],
      achievements: []
    };
  });

  // Keep content in sync when activeResume changes
  useEffect(() => {
    if (activeResume?.content) {
      setContent(activeResume.content);
      if (activeResume.templateId) {
        setTemplate(activeResume.templateId);
      }
    }
  }, [activeResume]);

  // Helper to update state and trigger debounced auto-save to Supabase
  const handleUpdateContent = (updated: ResumeContent) => {
    setContent(updated);
    updateContentAutoSave(updated);
  };

  // Personal Info change
  const handleInfoChange = (field: keyof ResumeContent['personalInfo'], val: string) => {
    const updated: ResumeContent = {
      ...content,
      personalInfo: {
        ...content.personalInfo,
        [field]: val
      }
    };
    handleUpdateContent(updated);
  };

  // AI Summary Improver
  const handleImproveSummary = async () => {
    if (!content.summary.trim()) return;
    setIsImprovingSummary(true);
    try {
      const response = await fetch('/api/resume/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content.summary,
          type: 'summary',
          targetRole: content.personalInfo.headline || user?.currentTargetGoal
        })
      });
      const data = await response.json();
      if (data.text) {
        const updated: ResumeContent = { ...content, summary: data.text };
        handleUpdateContent(updated);
        addNotification('Summary Optimized', 'AI rewritten executive summary applied.', 'success');
      }
    } catch {
      addNotification('AI Error', 'Could not optimize summary.', 'warning');
    } finally {
      setIsImprovingSummary(false);
    }
  };

  // AI Bullet improver for Experience
  const handleImproveBullet = async (expId: string, bulletIndex: number) => {
    const exp = content.experience.find(e => e.id === expId);
    if (!exp || !exp.bullets || !exp.bullets[bulletIndex]) return;

    setImprovingExpId(expId);
    try {
      const response = await fetch('/api/resume/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: exp.bullets[bulletIndex],
          type: 'experience',
          targetRole: content.personalInfo.headline || user?.currentTargetGoal
        })
      });
      const data = await response.json();
      if (data.text) {
        const updatedExp = content.experience.map(e => {
          if (e.id === expId && e.bullets) {
            const nextBullets = [...e.bullets];
            nextBullets[bulletIndex] = data.text;
            return { ...e, bullets: nextBullets };
          }
          return e;
        });
        const updated = { ...content, experience: updatedExp };
        handleUpdateContent(updated);
        addNotification('Bullet Rewritten', 'Transformed bullet using STAR methodology.', 'success');
      }
    } catch {
      addNotification('AI Error', 'Could not optimize bullet.', 'warning');
    } finally {
      setImprovingExpId(null);
    }
  };

  // Add Experience
  const handleAddExperience = () => {
    const newExp: ResumeSectionItem = {
      id: `exp-${Date.now()}`,
      title: 'Software Engineer',
      subtitle: 'Tech Company Inc.',
      location: 'San Francisco, CA',
      dateRange: '2023 - Present',
      bullets: ['Engineered scalable web applications utilizing React and Node.js.']
    };
    const updated = { ...content, experience: [...(content.experience || []), newExp] };
    handleUpdateContent(updated);
  };

  // Remove Experience
  const handleRemoveExperience = (id: string) => {
    const updated = { ...content, experience: content.experience.filter(e => e.id !== id) };
    handleUpdateContent(updated);
  };

  // Experience Bullet update
  const handleExperienceBulletChange = (expId: string, bIndex: number, val: string) => {
    const updatedExp = content.experience.map(e => {
      if (e.id === expId && e.bullets) {
        const nextBullets = [...e.bullets];
        nextBullets[bIndex] = val;
        return { ...e, bullets: nextBullets };
      }
      return e;
    });
    handleUpdateContent({ ...content, experience: updatedExp });
  };

  // Add Experience Bullet
  const handleAddExperienceBullet = (expId: string) => {
    const updatedExp = content.experience.map(e => {
      if (e.id === expId) {
        return { ...e, bullets: [...(e.bullets || []), 'New accomplishment statement...'] };
      }
      return e;
    });
    handleUpdateContent({ ...content, experience: updatedExp });
  };

  // Template switch
  const handleTemplateChange = async (tId: string) => {
    setTemplate(tId);
    await changeTemplate(tId as any);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-fade-in">
      
      {/* Editor Controls Column (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Status Bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-card flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-[10px] uppercase font-black">
              {activeResume?.title || 'Resume Builder'}
            </Badge>
            <span className="text-[10.5px] text-text-mute font-bold">
              {saveStatus === 'saving' ? 'Auto-saving to Supabase...' : saveStatus === 'saved' ? 'Saved to Supabase' : 'Synced'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => createVersionSnapshot()}
              className="text-xs font-bold h-7"
            >
              Snapshot Version
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => saveActiveResume(content)}
              className="text-xs font-bold h-7"
            >
              Save Now
            </Button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'info', label: 'Contact', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'summary', label: 'Summary', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'experience', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Education', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'projects', label: 'Projects', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'skills', label: 'Skills', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-bold cursor-pointer transition-all whitespace-nowrap',
                activeSection === tab.id
                  ? 'bg-primary text-black font-extrabold'
                  : 'bg-[var(--surface)] text-text-sub hover:bg-[var(--hover-tint)]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Controls Area */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <CardContent className="p-0 space-y-4">
            
            {/* 1. Contact / Personal Info */}
            {activeSection === 'info' && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">Full Name</label>
                    <Input
                      value={content.personalInfo?.fullName || ''}
                      onChange={e => handleInfoChange('fullName', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">Headline / Target Role</label>
                    <Input
                      value={content.personalInfo?.headline || ''}
                      onChange={e => handleInfoChange('headline', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">Email</label>
                    <Input
                      value={content.personalInfo?.email || ''}
                      onChange={e => handleInfoChange('email', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">Phone</label>
                    <Input
                      value={content.personalInfo?.phone || ''}
                      onChange={e => handleInfoChange('phone', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">Location</label>
                    <Input
                      value={content.personalInfo?.location || ''}
                      onChange={e => handleInfoChange('location', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-mute">LinkedIn URL</label>
                    <Input
                      value={content.personalInfo?.linkedinUrl || ''}
                      onChange={e => handleInfoChange('linkedinUrl', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Professional Summary */}
            {activeSection === 'summary' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Executive Summary</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImproveSummary}
                    disabled={isImprovingSummary}
                    className="h-7 text-xs font-bold text-primary"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-accent" /> AI Optimize Summary
                  </Button>
                </div>
                <textarea
                  rows={6}
                  value={content.summary || ''}
                  onChange={e => handleUpdateContent({ ...content, summary: e.target.value })}
                  className="w-full text-xs p-3 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* 3. Work Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Work Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddExperience}
                    className="h-7 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Position
                  </Button>
                </div>

                <div className="space-y-4">
                  {content.experience?.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">Position #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-red-500 hover:text-red-600 text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.title || ''}
                          onChange={e => {
                            const updated = content.experience.map(item => item.id === exp.id ? { ...item, title: e.target.value } : item);
                            handleUpdateContent({ ...content, experience: updated });
                          }}
                          placeholder="Job Title"
                          className="text-xs h-8"
                        />
                        <Input
                          value={exp.subtitle || ''}
                          onChange={e => {
                            const updated = content.experience.map(item => item.id === exp.id ? { ...item, subtitle: e.target.value } : item);
                            handleUpdateContent({ ...content, experience: updated });
                          }}
                          placeholder="Company Name"
                          className="text-xs h-8"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-mute">Accomplishment Bullets</label>
                        {exp.bullets?.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <Input
                              value={b}
                              onChange={e => handleExperienceBulletChange(exp.id, bIdx, e.target.value)}
                              className="text-xs h-8 flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleImproveBullet(exp.id, bIdx)}
                              className="h-8 px-2 text-xs text-amber-500 hover:bg-amber-500/10"
                              title="Improve with STAR AI"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddExperienceBullet(exp.id)}
                          className="text-[10px] font-bold text-primary h-6 p-0"
                        >
                          + Add Bullet Line
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Education */}
            {activeSection === 'education' && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Education</h3>
                {content.education?.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-lg space-y-2">
                    <Input
                      value={edu.title || ''}
                      onChange={e => {
                        const updated = content.education.map(item => item.id === edu.id ? { ...item, title: e.target.value } : item);
                        handleUpdateContent({ ...content, education: updated });
                      }}
                      placeholder="Degree / Major"
                      className="text-xs h-8"
                    />
                    <Input
                      value={edu.subtitle || ''}
                      onChange={e => {
                        const updated = content.education.map(item => item.id === edu.id ? { ...item, subtitle: e.target.value } : item);
                        handleUpdateContent({ ...content, education: updated });
                      }}
                      placeholder="University / School Name"
                      className="text-xs h-8"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 5. Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Featured Projects</h3>
                {content.projects?.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-lg space-y-2">
                    <Input
                      value={proj.title || ''}
                      onChange={e => {
                        const updated = content.projects.map(item => item.id === proj.id ? { ...item, title: e.target.value } : item);
                        handleUpdateContent({ ...content, projects: updated });
                      }}
                      placeholder="Project Title"
                      className="text-xs h-8"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 6. Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-text-main uppercase tracking-wider">Technical Skills</h3>
                {content.skills?.map((skCategory, idx) => (
                  <div key={idx} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-lg space-y-2">
                    <span className="text-xs font-bold text-primary">{skCategory.category}</span>
                    <Input
                      value={skCategory.items?.join(', ') || ''}
                      onChange={e => {
                        const itemsArr = e.target.value.split(',').map(s => s.trim());
                        const updated = content.skills.map((cat, i) => i === idx ? { ...cat, items: itemsArr } : cat);
                        handleUpdateContent({ ...content, skills: updated });
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>

      </div>

      {/* Live Preview Column (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Template Controls Bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-text-main">Live Resume Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={template}
              onChange={e => handleTemplateChange(e.target.value)}
              className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs font-bold text-text-main"
            >
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="professional">Professional</option>
              <option value="tech">Tech</option>
              <option value="corporate">Corporate</option>
              <option value="creative">Creative</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-bold h-7"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> PDF Print
            </Button>
          </div>
        </div>

        {/* Live A4 Document Visual Container */}
        <div className="bg-white text-slate-900 border border-slate-300 rounded-card p-8 shadow-md min-h-[700px] font-sans printable-resume">
          
          {/* Header */}
          <div className="border-b border-slate-300 pb-4 mb-4">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {content.personalInfo?.fullName || 'John Doe'}
            </h1>
            <p className="text-sm font-semibold text-emerald-700 mt-0.5">
              {content.personalInfo?.headline || 'Software Engineer'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 mt-2 font-medium">
              {content.personalInfo?.email && <span>{content.personalInfo.email}</span>}
              {content.personalInfo?.phone && <span>• {content.personalInfo.phone}</span>}
              {content.personalInfo?.location && <span>• {content.personalInfo.location}</span>}
              {content.personalInfo?.linkedinUrl && <span>• LinkedIn</span>}
              {content.personalInfo?.githubUrl && <span>• GitHub</span>}
            </div>
          </div>

          {/* Summary */}
          {content.summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 mb-2">
                Executive Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {content.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {content.experience && content.experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {content.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">{exp.dateRange}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mb-1">{exp.subtitle}</div>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                      {exp.bullets?.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {content.projects && content.projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 mb-2">
                Key Projects
              </h2>
              <div className="space-y-3">
                {content.projects.map(proj => (
                  <div key={proj.id}>
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                    <ul className="list-disc list-inside text-xs text-slate-600">
                      {proj.bullets?.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {content.skills.map((sk, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-slate-900">{sk.category}: </span>
                    <span>{sk.items?.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              {content.education.map(edu => (
                <div key={edu.id} className="flex justify-between text-xs text-slate-800">
                  <span className="font-bold">{edu.title} — {edu.subtitle}</span>
                  <span className="text-[10px] text-slate-500">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
