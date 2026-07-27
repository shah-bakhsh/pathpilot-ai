/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, FileText, Clipboard, Copy, Download, RefreshCw, Send, 
  Settings, User, Landmark, HelpCircle, Save, ArrowRight
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { cn } from '../../../lib/utils';

export const CoverLetterGenerator: React.FC = () => {
  const { user } = useAuth();
  const { addCareerDocument, addNotification } = useCareer();

  // Form Fields
  const [company, setCompany] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tone, setTone] = useState<'Professional' | 'Confident' | 'Passionate' | 'Technical'>('Professional');
  const [focusPoints, setFocusPoints] = useState<string>('');

  // Execution states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');

  // Submit trigger
  const handleGenerate = async () => {
    if (!company.trim() || !jobTitle.trim()) {
      addNotification('Parameters Missing', 'Please fill in the Job Title and Company Name.', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          jobTitle,
          jobDescription,
          tone,
          focusPoints,
          resumeText: localStorage.getItem('pathpilot-build-resume') || ''
        })
      });
      const data = await response.json();
      if (data && data.text) {
        setGeneratedLetter(data.text);
        addNotification('Cover Letter Formulated', 'Generated tailored executive correspondence letters.', 'success');
      } else {
        addNotification('Generation Failed', 'Model did not return letter output. Try adjusting parameters.', 'warning');
      }
    } catch (err) {
      console.error(err);
      addNotification('API Access Failed', 'Could not reach server cover letter generator endpoints.', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  // Action Buttons
  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    addNotification('Copied', 'Cover letter copied to clipboard.', 'success');
  };

  const handleSaveToVault = () => {
    if (!generatedLetter) return;
    
    // Register inside context careerDocuments
    addCareerDocument({
      name: `${company.replace(/\s+/g, '_')}_Cover_Letter.txt`,
      type: 'cover_letter',
      url: '#',
      size: '2.5 KB',
      version: 'v1.0',
      score: 92
    });

    addNotification('Document Saved', 'Your letter has been recorded in the Documents Vault.', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      
      {/* Parameter Fields (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Core details Card */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
              <Landmark className="w-4.5 h-4.5 text-primary" /> Application Target
            </CardTitle>
            <CardDescription className="text-[10px]">
              Set company coordinates to tailor matching alignment.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Company Name"
                placeholder="e.g. Google, Stripe"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Job Title"
                placeholder="e.g. Frontend Intern"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Job Requirements Snippet</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                placeholder="Paste key responsibilities or target tech requirement lists..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Style Accents Card */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-primary" /> Tone & Accents
            </CardTitle>
            <CardDescription className="text-[10px]">
              Adjust the semantic structure and thematic accents.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4">
            
            {/* Tone pills */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Tone Selection</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Professional', label: 'Executive' },
                  { id: 'Confident', label: 'High Impact' },
                  { id: 'Passionate', label: 'Cultural Fit' },
                  { id: 'Technical', label: 'Code Master' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTone(item.id as any)}
                    className={cn(
                      'p-2 rounded-xl text-xs font-black border transition-all cursor-pointer',
                      tone === item.id
                        ? 'border-primary bg-primary/2 text-primary'
                        : 'border-[var(--border)] bg-[var(--surface-secondary)]/15 text-text-mute hover:border-primary/20 hover:text-text-sub'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Focus Accent */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-text-mute tracking-wider">Custom Focus Accents</label>
              <textarea
                rows={2}
                value={focusPoints}
                onChange={e => setFocusPoints(e.target.value)}
                className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g. Emphasize my Raft Consensus project, focus on secure token pipelines..."
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || !company.trim() || !jobTitle.trim()}
              className="text-[10.5px] h-9 px-4 font-black flex items-center justify-center gap-2 bg-primary text-black cursor-pointer shadow-md w-full mt-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Drafting Letterhead...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Formulate Cover Letter
                </>
              )}
            </Button>

          </CardContent>
        </Card>

      </div>

      {/* Draft Document Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-card w-full shadow-sm">
          <span className="text-[10px] text-text-mute font-black uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" /> Active Draft Document
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!generatedLetter}
              onClick={handleCopy}
              className="text-[9.5px] h-7 px-2.5 font-bold flex items-center gap-1 cursor-pointer border-[var(--border)]"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Letter
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!generatedLetter}
              onClick={handleSaveToVault}
              className="text-[10px] h-7 px-3 font-black flex items-center gap-1 cursor-pointer bg-primary text-black"
            >
              <Save className="w-3.5 h-3.5" /> Save to Vault
            </Button>
          </div>
        </div>

        {/* Paper Container Viewport */}
        <div className="w-full border border-[var(--border)] bg-zinc-900/40 rounded-card p-6 flex justify-center overflow-auto max-h-[640px] scrollbar-thin shadow-inner">
          {generatedLetter ? (
            <textarea
              value={generatedLetter}
              onChange={e => setGeneratedLetter(e.target.value)}
              className="w-[612px] min-h-[580px] bg-white text-zinc-800 p-12 shadow-2xl rounded font-serif text-[11px] leading-relaxed focus:outline-none resize-none border-t-8 border-primary select-text"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          ) : (
            <div className="w-[612px] min-h-[580px] bg-white border border-dashed border-zinc-200 rounded flex flex-col items-center justify-center p-12 text-center text-zinc-400 font-sans">
              <FileText className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <h4 className="text-xs font-black text-zinc-800 mt-3 uppercase tracking-wider">Letterhead Template Sheet</h4>
              <p className="text-[9.5px] text-zinc-400 mt-1 max-w-[200px] leading-normal font-medium">
                Fill out the target company coordinates on the left and generate a custom AI cover letter.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CoverLetterGenerator;
