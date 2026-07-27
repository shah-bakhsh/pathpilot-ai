/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Sliders,
  Plus,
  Trash2,
  Check,
  Save,
  Shield,
  FileText,
  User,
  Briefcase,
  Database,
  Sparkles
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { AiCoachService, CoachSettings } from '../../../services/aiCoachService';
import { AiMemoryFact } from '../../../types';
import { Badge } from '../../ui/Badge';

export const ConversationSettingsView: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CoachSettings>({
    personalityStyle: 'executive',
    includeResumeContext: true,
    includeProfileContext: true,
    includeApplicationsContext: true,
    includeMemoryContext: true,
    customInstructions: 'Provide concise, high-impact career guidance with concrete next steps.'
  });

  const [memoryFacts, setMemoryFacts] = useState<AiMemoryFact[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'goal' | 'tech_stack' | 'preference' | 'experience' | 'constraint' | 'career_path'>('preference');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = async () => {
    if (!user) return;
    const st = AiCoachService.getSettings(user.uid);
    setSettings(st);

    const memory = await AiCoachService.getMemoryFacts(user.uid);
    setMemoryFacts(memory);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSaveSettings = () => {
    if (!user) return;
    AiCoachService.saveSettings(user.uid, settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newKey.trim() || !newValue.trim()) return;

    await AiCoachService.saveMemoryFact(user.uid, newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    loadData();
  };

  const handleDeleteFact = async (factId: string) => {
    if (!user) return;
    await AiCoachService.deleteMemoryFact(user.uid, factId);
    loadData();
  };

  return (
    <div id="coach-settings-view" className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Coach Preferences & Persistent Memory</h1>
            <p className="text-xs text-purple-200/80">
              Manage what your AI Coach remembers about your career profile, preferences, and system prompts.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Grid Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personality & Tone */}
        <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" /> Coach Personality & Style
          </h2>

          <div className="space-y-2">
            {[
              { id: 'executive', name: 'Executive Strategist', desc: 'Direct, high-level, business impact focused' },
              { id: 'supportive', name: 'Supportive Mentor', desc: 'Encouraging, step-by-step constructive feedback' },
              { id: 'socratic', name: 'Socratic Interviewer', desc: 'Asks guiding questions to trigger deep technical reasoning' },
              { id: 'direct', name: 'Uncompromising Critic', desc: 'Blunt, high-signal, zero fluff feedback' }
            ].map(style => (
              <label
                key={style.id}
                onClick={() => setSettings(prev => ({ ...prev, personalityStyle: style.id as any }))}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  settings.personalityStyle === style.id
                    ? 'bg-[var(--color-bg-tertiary)] border-purple-500'
                    : 'bg-[var(--color-bg-primary)] border-[var(--color-border)] hover:border-purple-500/40'
                }`}
              >
                <input
                  type="radio"
                  name="personalityStyle"
                  checked={settings.personalityStyle === style.id}
                  onChange={() => {}}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">{style.name}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)]">{style.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Context Inclusions */}
        <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" /> Active Context Inclusions
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Select which telemetry sources are automatically attached to prompt context:
          </p>

          <div className="space-y-3">
            {[
              { key: 'includeResumeContext', label: 'Primary Resume Data', icon: FileText },
              { key: 'includeProfileContext', label: 'User Profile & Skills', icon: User },
              { key: 'includeApplicationsContext', label: 'Active Job Applications', icon: Briefcase },
              { key: 'includeMemoryContext', label: 'Stored Persistent Memory Facts', icon: Brain }
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={(settings as any)[item.key]}
                  onChange={(e) => setSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Memory Facts Manager */}
      <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" /> Stored Persistent Memory Facts ({memoryFacts.length})
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Facts automatically extracted or manually specified that persist permanently in Supabase for your user ID.
            </p>
          </div>
        </div>

        {/* Facts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {memoryFacts.map(fact => (
            <div key={fact.id} className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="primary" className="text-[10px] uppercase">
                    {fact.category}
                  </Badge>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">{fact.memoryKey}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{fact.memoryValue}</p>
              </div>

              <button
                onClick={() => handleDeleteFact(fact.id)}
                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-rose-500 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                title="Forget fact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Memory Fact Form */}
        <form onSubmit={handleAddFact} className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Fact Key (e.g. Target Salary)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Fact Value (e.g. $150k+ Remote Only)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
          />
          <button
            type="submit"
            disabled={!newKey.trim() || !newValue.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Save Fact
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationSettingsView;
