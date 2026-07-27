/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Save, UserCheck, Shield, Volume2, Sparkles, CheckCircle2, Plus, Trash2, Building
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Input, Textarea } from '../../ui/Input';
import { InterviewSettings, CompanyName } from './InterviewTypes';
import { InterviewService, DEFAULT_INTERVIEW_SETTINGS } from '../../../services/interviewService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';

export const InterviewSettingsView: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useCareer();

  const [settings, setSettings] = useState<InterviewSettings>(DEFAULT_INTERVIEW_SETTINGS);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [newTemplate, setNewTemplate] = useState<string>('');

  useEffect(() => {
    InterviewService.getSettings(user?.id).then(res => setSettings(res));
  }, [user?.id]);

  const handleSaveSettings = async () => {
    await InterviewService.saveSettings(settings, user?.id);
    setIsSaved(true);
    addNotification('Settings Updated', 'Your interview preferences & AI recruiter persona saved successfully.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCustomTemplate = () => {
    if (!newTemplate.trim()) return;
    setSettings(prev => ({
      ...prev,
      customPromptTemplates: [...prev.customPromptTemplates, newTemplate.trim()]
    }));
    setNewTemplate('');
  };

  const handleRemoveTemplate = (idx: number) => {
    setSettings(prev => ({
      ...prev,
      customPromptTemplates: prev.customPromptTemplates.filter((_, i) => i !== idx)
    }));
  };

  const personas = [
    { name: 'FAANG Senior Evaluator', desc: 'Strict, precise, focuses heavily on system scalability & edge cases.' },
    { name: 'Friendly Career Coach', desc: 'Encouraging, constructive, offers gentle prompts during technical stumbles.' },
    { name: 'Startup CTO', desc: 'Fast-paced, pragmatic, prioritizes speed-to-delivery & product judgment.' },
    { name: 'Strict Technical Lead', desc: 'Uncompromising accuracy checks, deep algorithmic performance scrutiny.' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Settings className="w-3.5 h-3.5 mr-1" /> AI Engine Configuration
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Interview Recruiter Persona & Prompt Controls
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Customize the AI interviewer's evaluation strictness, target companies, prompt injection rules, and audio playback settings.
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          className="text-xs font-black h-10 px-5 bg-primary text-black flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Save Configuration
        </Button>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recruiter Persona */}
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" /> Evaluator Persona & Style
            </CardTitle>
            <CardDescription className="text-xs text-text-mute">
              Select how strict or encouraging the AI interviewer should behave.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {personas.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setSettings(prev => ({ ...prev, persona: p.name as any }))}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${settings.persona === p.name ? 'border-primary bg-primary/5 shadow-xs' : 'border-[var(--border)] bg-[var(--surface-secondary)]/10 hover:border-primary/30'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text-main">{p.name}</span>
                  {settings.persona === p.name && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-text-mute mt-1 leading-snug">{p.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audio & Context Options */}
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" /> Context Integration & Audio
            </CardTitle>
            <CardDescription className="text-xs text-text-mute">
              Manage resume data injection and voice playback speed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            
            {/* Resume Context Toggle */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-text-main block">Inject Resume & Career Context</span>
                <span className="text-[11px] text-text-mute">Loads skills, projects, and target role into AI prompts</span>
              </div>
              <input
                type="checkbox"
                checked={settings.includeResumeContext}
                onChange={e => setSettings(prev => ({ ...prev, includeResumeContext: e.target.checked }))}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>

            {/* Voice Speed */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text-main">Interviewer Speech Speed</span>
                <span className="text-xs font-bold text-primary">{settings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.voiceSpeed}
                onChange={e => setSettings(prev => ({ ...prev, voiceSpeed: parseFloat(e.target.value) }))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Strictness Level */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/10 flex flex-col gap-2">
              <span className="text-xs font-black text-text-main">Evaluation Strictness</span>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {(['Lenient', 'Standard', 'Strict', 'Ruthless'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSettings(prev => ({ ...prev, strictnessLevel: lvl }))}
                    className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${settings.strictnessLevel === lvl ? 'bg-primary text-black border-primary' : 'bg-[var(--surface)] text-text-sub border-[var(--border)]'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Custom Prompt Templates */}
      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Custom AI Interviewer Directives
          </CardTitle>
          <CardDescription className="text-xs text-text-mute">
            Add custom evaluation criteria or guidelines to be injected into every mock interview session.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              value={newTemplate}
              onChange={e => setNewTemplate(e.target.value)}
              placeholder="e.g. Always ask at least one question about database query optimization..."
              className="text-xs"
            />
            <Button
              onClick={handleAddCustomTemplate}
              className="text-xs font-black px-4 bg-primary text-black shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Directive
            </Button>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {settings.customPromptTemplates.map((tmpl, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[var(--surface-secondary)]/10 border border-[var(--border)] flex items-center justify-between text-xs text-text-main">
                <span>"{tmpl}"</span>
                <button
                  onClick={() => handleRemoveTemplate(idx)}
                  className="text-text-mute hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
