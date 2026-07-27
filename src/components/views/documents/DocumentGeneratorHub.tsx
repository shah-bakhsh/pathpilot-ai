/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, FileText, Send, Building, GraduationCap, Award, Mail, Linkedin,
  Globe, UserCheck, BookOpen, Layers, ArrowRight, Wand2, RefreshCw, CheckCircle2,
  Lock, Bookmark, Star, ShieldCheck
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/utils';
import { SupportedDocType, WritingStyle, ToneOption, GenerateDocParams } from '../../../types/documentTypes';

interface DocumentGeneratorHubProps {
  onGenerate: (params: GenerateDocParams) => Promise<any>;
  isGenerating: boolean;
  onSelectDoc?: (doc: any) => void;
}

export const DocumentGeneratorHub: React.FC<DocumentGeneratorHubProps> = ({
  onGenerate,
  isGenerating,
  onSelectDoc
}) => {
  const [selectedType, setSelectedType] = useState<SupportedDocType>('cover_letter');
  
  // Universal Form Fields
  const [docTitle, setDocTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetUniversity, setTargetUniversity] = useState('');
  const [targetScholarship, setTargetScholarship] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [keyAchievements, setKeyAchievements] = useState('');
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('Executive');
  const [tone, setTone] = useState<ToneOption>('Professional');

  // Generator Presets list
  const GENERATOR_PRESETS: Array<{
    id: SupportedDocType;
    label: string;
    icon: React.ReactNode;
    category: string;
    description: string;
  }> = [
    { id: 'cover_letter', label: 'Cover Letter', icon: <FileText className="w-4 h-4 text-primary" />, category: 'Jobs', description: 'Quantified executive letter tailored to company coordinates.' },
    { id: 'statement_of_purpose', label: 'Statement of Purpose (SOP)', icon: <GraduationCap className="w-4 h-4 text-purple-400" />, category: 'Academia', description: 'Rigorous research & academic alignment essay.' },
    { id: 'personal_statement', label: 'Personal Statement', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, category: 'Academia', description: 'Narrative overview of motivation and leadership.' },
    { id: 'motivation_letter', label: 'Motivation Letter', icon: <Award className="w-4 h-4 text-amber-400" />, category: 'Scholarships', description: 'Impact-focused motivation for grants and fellowships.' },
    { id: 'recommendation_letter', label: 'Recommendation Letter Draft', icon: <Bookmark className="w-4 h-4 text-indigo-400" />, category: 'Reference', description: 'High-praise recommendation draft for managers/professors.' },
    { id: 'cold_email', label: 'Cold Email / Outreach', icon: <Mail className="w-4 h-4 text-blue-400" />, category: 'Networking', description: 'Short high-response outreach to decision makers.' },
    { id: 'linkedin_about', label: 'LinkedIn About Summary', icon: <Linkedin className="w-4 h-4 text-blue-500" />, category: 'Branding', description: 'Engaging profile summary highlighting key stack.' },
    { id: 'linkedin_headline', label: 'LinkedIn Headline', icon: <Linkedin className="w-4 h-4 text-blue-400" />, category: 'Branding', description: 'Punchy 1-line position titles & value props.' },
    { id: 'professional_bio', label: 'Professional Bio', icon: <Globe className="w-4 h-4 text-teal-400" />, category: 'Branding', description: '3rd-person speaker/author bio for events or portfolios.' },
    { id: 'research_proposal', label: 'Research Proposal', icon: <BookOpen className="w-4 h-4 text-rose-400" />, category: 'Academia', description: 'Structured methodology & research gap proposal.' },
    { id: 'cv', label: 'Curriculum Vitae (CV)', icon: <Layers className="w-4 h-4 text-primary" />, category: 'Jobs', description: 'Comprehensive academic or international CV.' },
    { id: 'custom', label: 'Custom Career Document', icon: <Sparkles className="w-4 h-4 text-primary" />, category: 'Custom', description: 'Free-form AI generation for any custom format.' }
  ];

  const currentPreset = GENERATOR_PRESETS.find(p => p.id === selectedType) || GENERATOR_PRESETS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = await onGenerate({
      docType: selectedType,
      title: docTitle || `${currentPreset.label} - ${targetCompany || targetUniversity || targetRole || 'Draft'}`,
      targetCompany,
      targetRole,
      targetUniversity,
      targetScholarship,
      targetCountry,
      jobDescription,
      keyAchievements,
      writingStyle,
      tone
    });

    if (doc && onSelectDoc) {
      onSelectDoc(doc);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header callout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5" /> AI Writing Engine // Gemini 3.5 Flash
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            Universal Career Document Generator
          </h2>
          <p className="text-xs text-text-sub mt-1 max-w-2xl leading-relaxed">
            Formulate personalized cover letters, statements of purpose, scholarship essays, recommendation drafts, and cold outreach using your candidate profile and target coordinates.
          </p>
        </div>

        <Badge variant="primary" className="text-xs font-black py-1 px-3 shrink-0">
          12 AI Generators Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 1. LEFT GENERATOR SELECTOR (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <label className="text-[10px] font-bold text-text-mute uppercase tracking-wider px-1">
            Select Document Category
          </label>
          <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1">
            {GENERATOR_PRESETS.map((preset) => {
              const isActive = selectedType === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedType(preset.id)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer group',
                    isActive
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-primary/30 hover:bg-[var(--surface-secondary)]/30'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg shrink-0 transition-colors',
                    isActive ? 'bg-primary text-black' : 'bg-[var(--surface-secondary)] text-text-sub'
                  )}>
                    {preset.icon}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={cn(
                        'text-xs font-black truncate',
                        isActive ? 'text-primary' : 'text-text-main group-hover:text-primary'
                      )}>
                        {preset.label}
                      </span>
                      <span className="text-[9px] font-bold text-text-mute uppercase bg-[var(--surface-secondary)] px-1.5 py-0.5 rounded">
                        {preset.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-mute line-clamp-1 mt-0.5 font-medium">
                      {preset.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. RIGHT PARAMETER FORM (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="border-[var(--border)] bg-[var(--surface)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
                  {currentPreset.icon} Formulate {currentPreset.label}
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Auto-Injects Profile Data</Badge>
              </div>
              <CardDescription className="text-xs">
                Provide specific target details to generate a highly personalized document.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Title */}
                <Input
                  label="Document Title (Optional)"
                  placeholder={`e.g. ${currentPreset.label} - Target Opportunity`}
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="text-xs"
                />

                {/* Conditional Fields based on Document Category */}
                {(selectedType === 'cover_letter' || selectedType === 'cold_email' || selectedType === 'cv' || selectedType === 'custom') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Target Company / Organization"
                      placeholder="e.g. Google, Stripe, Microsoft"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      label="Target Role / Title"
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}

                {(selectedType === 'statement_of_purpose' || selectedType === 'personal_statement' || selectedType === 'research_proposal') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Target University / Institution"
                      placeholder="e.g. Stanford University, MIT, ETH Zurich"
                      value={targetUniversity}
                      onChange={(e) => setTargetUniversity(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      label="Target Degree / Program"
                      placeholder="e.g. MS in Computer Science & AI"
                      value={targetScholarship}
                      onChange={(e) => setTargetScholarship(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}

                {(selectedType === 'motivation_letter') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Scholarship / Grant Program"
                      placeholder="e.g. Fulbright Scholarship, Rhodes Trust"
                      value={targetScholarship}
                      onChange={(e) => setTargetScholarship(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      label="Target Country / Destination"
                      placeholder="e.g. United States, Germany, United Kingdom"
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}

                {/* Job / Program Description text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-sub">
                    Opportunity Description / Prompt Details
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description, prompt requirements, or target mission statement here..."
                    className="w-full text-xs p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none focus:border-primary resize-none h-24 text-text-main"
                  />
                </div>

                {/* Key Achievements */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-sub">
                    Key Achievements / Project Highlights to Emphasize
                  </label>
                  <textarea
                    value={keyAchievements}
                    onChange={(e) => setKeyAchievements(e.target.value)}
                    placeholder="e.g. Built microservice handling 10k RPM; Boosted pipeline speed by 40%; Published AI paper..."
                    className="w-full text-xs p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none focus:border-primary resize-none h-20 text-text-main"
                  />
                </div>

                {/* Style & Tone Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]/60">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub">Writing Style</label>
                    <select
                      value={writingStyle}
                      onChange={(e) => setWritingStyle(e.target.value as WritingStyle)}
                      className="w-full text-xs p-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none focus:border-primary text-text-main font-medium"
                    >
                      <option value="Executive">Executive (Impactful & Metric-Driven)</option>
                      <option value="Technical">Technical (Architectural & Precise)</option>
                      <option value="Academic">Academic (Rigor & Scientific Depth)</option>
                      <option value="Passionate">Passionate (Mission-Driven)</option>
                      <option value="Direct">Direct & Concise</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-sub">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as ToneOption)}
                      className="w-full text-xs p-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none focus:border-primary text-text-main font-medium"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Formal">Formal</option>
                      <option value="Academic">Academic</option>
                      <option value="Confident">Confident</option>
                      <option value="Friendly">Friendly</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isGenerating}
                  className="w-full font-black text-sm gap-2 mt-2 py-3"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Formulating {currentPreset.label} via Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate {currentPreset.label}
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
