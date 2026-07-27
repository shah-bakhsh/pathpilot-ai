/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders, Save, Type, Clock, Sparkles, Download, Check
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { ToneOption, DocumentSettings } from '../../../types/documentTypes';
import { useCareer } from '../../../contexts/CareerContext';

export const DocumentSettingsView: React.FC = () => {
  const { addNotification } = useCareer();

  const [settings, setSettings] = useState<DocumentSettings>({
    defaultTypography: 'Sans-Serif',
    autoSaveIntervalSeconds: 3,
    preferredTone: 'Professional',
    exportPageSize: 'A4'
  });

  const handleSave = () => {
    try {
      localStorage.setItem('pathpilot_doc_settings_v10', JSON.stringify(settings));
      addNotification('Settings Saved', 'Updated AI Document Workspace preferences.', 'success');
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Workspace Preferences // Configuration
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            AI Document Workspace Settings
          </h2>
          <p className="text-xs text-text-sub mt-1 leading-relaxed">
            Configure default writing typography, auto-save interval, AI model tone defaults, and document export paper sizing.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} className="font-black text-xs gap-1.5 shrink-0">
          <Save className="w-3.5 h-3.5" /> Save Preferences
        </Button>
      </div>

      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardContent className="p-6 flex flex-col gap-6">
          
          {/* Typography */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
              <Type className="w-4 h-4 text-primary" /> Editor Typography
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Sans-Serif', 'Serif', 'Monospace'] as const).map(font => (
                <button
                  key={font}
                  onClick={() => setSettings(s => ({ ...s, defaultTypography: font }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    settings.defaultTypography === font
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 text-text-sub'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* AI Tone */}
          <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]/60">
            <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> Preferred AI Writing Tone
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Professional', 'Formal', 'Academic', 'Confident', 'Friendly'] as ToneOption[]).map(t => (
                <button
                  key={t}
                  onClick={() => setSettings(s => ({ ...s, preferredTone: t }))}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    settings.preferredTone === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 text-text-sub'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Export Paper Size */}
          <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]/60">
            <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
              <Download className="w-4 h-4 text-primary" /> Export Paper Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['A4', 'Letter'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setSettings(s => ({ ...s, exportPageSize: size }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    settings.exportPageSize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 text-text-sub'
                  }`}
                >
                  {size} Standard
                </button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
};
