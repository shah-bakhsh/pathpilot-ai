/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sliders, Play, Settings, RefreshCw, BadgeAlert, HelpCircle, 
  Check, Info, MessageSquare, BookOpen, Layers, Volume2 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

export const AiPreferencesTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  const [aiPrefs, setAiPrefs] = useState(() => {
    const saved = localStorage.getItem('pathpilot-saas-aiprefs-v1');
    if (saved) return JSON.parse(saved);
    return {
      preferredModel: 'gemini-1.5-pro', // pro, flash, live
      temperature: 0.7,
      responseLength: 'medium', // concise, medium, exhaustive
      tone: 'professional', // scientific, professional, encouragement, aggressive
      careerFocus: 'Full-Stack Software Engineering',
      learningMode: 'academic', // speed_run, academic, tutorial, projects
      dailySummary: true,
      smartSuggestions: true,
      voiceEnabled: false,
    };
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-aiprefs-v1', JSON.stringify(aiPrefs));
  }, [aiPrefs]);

  // AI Score based on customizations
  const personalizationScore = React.useMemo(() => {
    let score = 40;
    if (aiPrefs.preferredModel !== 'gemini-1.5-pro') score += 10;
    if (aiPrefs.careerFocus.length > 5) score += 20;
    if (aiPrefs.learningMode !== 'academic') score += 15;
    if (aiPrefs.smartSuggestions) score += 15;
    return Math.min(score, 100);
  }, [aiPrefs]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      localStorage.setItem('pathpilot-saas-aiprefs-v1', JSON.stringify(aiPrefs));
      addXp(15);
      onUpdateNotification('AI Model Directives Updated', 'System weights and prompt envelopes synchronized.', 'success');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Header index */}
      <Card className="bg-gradient-to-r from-neutral-900 via-[var(--surface)] to-neutral-900 border-[var(--border)] relative">
        <CardContent className="pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl shrink-0 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-primary font-black uppercase tracking-wider">Large Language Model Routing</span>
                <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[8px] font-black">{personalizationScore}% Personalized</Badge>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-text-main mt-0.5">AI Preferences & Custom Directives</h3>
              <p className="text-[10.5px] text-text-mute mt-1 font-semibold max-w-xl leading-normal">
                Calibrate LLM response volumes, preferred engines, output tones, and focus parameters matching your exact career path.
              </p>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-black font-black text-xs h-9 shrink-0">
            {saving ? 'Syncing...' : 'Sync LLM Settings'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Model and parameters */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Preferred Engine Blueprint</CardTitle>
              <CardDescription>Select the core server model processing your resume logs and mentor inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', desc: 'Maximizes accuracy for code review, resume evaluation, and structural optimizations.', tag: 'DEFAULT BEST' },
                  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', desc: 'Ultra-fast sub-second token delivery. Ideal for quick chat sessions and flashcards.', tag: 'SPEED RUN' },
                  { id: 'gemini-2.0-experimental', label: 'Gemini 2.0 Live Alpha', desc: 'Interactive real-time audio channels. Supports low-latency voice mentorship prompts.', tag: 'PREVIEW' }
                ].map((m) => {
                  const isActive = aiPrefs.preferredModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setAiPrefs({ ...aiPrefs, preferredModel: m.id })}
                      className={`flex items-start gap-4 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                        isActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-[var(--border)] bg-[var(--surface-secondary)]/30 hover:border-primary/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-primary/10 text-primary' : 'bg-[var(--hover-tint)] text-text-mute'}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-text-main uppercase tracking-tight">{m.label}</span>
                          <Badge variant={isActive ? 'success' : 'neutral'} className="text-[7.5px] font-black">{m.tag}</Badge>
                        </div>
                        <p className="text-[10px] text-text-mute font-semibold mt-1 leading-normal">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Temperature Slider */}
              <div className="border-t border-[var(--border)]/40 pt-4 mt-2 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-text-sub font-black uppercase tracking-wider">
                  <span>Temperature / Creative Index</span>
                  <span className="font-mono text-primary">{aiPrefs.temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.1" 
                  value={aiPrefs.temperature}
                  onChange={e => setAiPrefs({ ...aiPrefs, temperature: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[9.5px] text-text-mute font-semibold mt-1 leading-normal">
                  Higher parameters yield creative and conversational replies. Lower limits generate highly structured, deterministic logs.
                </p>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Behavior & personalization */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Writing Style & Tone</CardTitle>
              <CardDescription>Tailor how the AI coach formats textual guides.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Tone Vector</label>
                <select 
                  value={aiPrefs.tone}
                  onChange={e => setAiPrefs({ ...aiPrefs, tone: e.target.value })}
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-semibold text-text-sub outline-none focus:border-primary/50"
                >
                  <option value="professional">Professional / Ex-Netflix (Default)</option>
                  <option value="encouragement">Friendly Mentor / Empathetic Coach</option>
                  <option value="scientific">Scientific / Analytical & Dry</option>
                  <option value="aggressive">Extreme Grit / High Intensity</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Response Length</label>
                <select 
                  value={aiPrefs.responseLength}
                  onChange={e => setAiPrefs({ ...aiPrefs, responseLength: e.target.value })}
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-semibold text-text-sub outline-none focus:border-primary/50"
                >
                  <option value="concise">Bullet points only (Fast review)</option>
                  <option value="medium">Standard / Balanced overview</option>
                  <option value="exhaustive">Exhaustive / Academic thesis style</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Career Anchor Focus</label>
                <Input 
                  value={aiPrefs.careerFocus} 
                  onChange={e => setAiPrefs({ ...aiPrefs, careerFocus: e.target.value })}
                  placeholder="e.g. Distributed backend engineer" 
                  className="text-xs h-9 font-semibold"
                />
              </div>

            </CardContent>
          </Card>

          {/* Prompt options */}
          <Card>
            <CardHeader>
              <CardTitle>System Interactions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              
              {/* suggestions */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Smart suggestions</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Enables inline autocomplete chips.</span>
                </div>
                <button
                  onClick={() => setAiPrefs({ ...aiPrefs, smartSuggestions: !aiPrefs.smartSuggestions })}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    aiPrefs.smartSuggestions ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    aiPrefs.smartSuggestions ? 'right-0.5 bg-black' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* daily digest */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Daily AI Career Summary</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Briefs you on newly matching job alerts.</span>
                </div>
                <button
                  onClick={() => setAiPrefs({ ...aiPrefs, dailySummary: !aiPrefs.dailySummary })}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    aiPrefs.dailySummary ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    aiPrefs.dailySummary ? 'right-0.5 bg-black' : 'left-0.5'
                  }`} />
                </button>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
