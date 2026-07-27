/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, ShieldAlert, Globe, Lock, CheckCircle2, Sliders, Info, 
  Settings, Key, AlertCircle, RefreshCw, Trash2, Shield 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

export const PrivacyTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  const [privacySettings, setPrivacySettings] = useState(() => {
    const saved = localStorage.getItem('pathpilot-saas-privacy-v1');
    if (saved) return JSON.parse(saved);
    return {
      profileVisibility: 'public', // public, private, recruiter_only
      resumeIndexed: true,
      portfolioIndexed: true,
      recruiterInboxesActive: true,
      searchDiscovery: true,
      analyticsConsent: true,
      marketingConsent: false,
      passcodeProtected: false,
      passcode: '',
    };
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-privacy-v1', JSON.stringify(privacySettings));
  }, [privacySettings]);

  // Calculated Privacy Score
  const privacyScore = React.useMemo(() => {
    let score = 50; // base score
    if (privacySettings.profileVisibility === 'recruiter_only') score += 15;
    if (privacySettings.profileVisibility === 'private') score += 25;
    if (!privacySettings.analyticsConsent) score += 10;
    if (!privacySettings.marketingConsent) score += 10;
    if (privacySettings.passcodeProtected && privacySettings.passcode) score += 15;
    return Math.min(score, 100);
  }, [privacySettings]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      localStorage.setItem('pathpilot-saas-privacy-v1', JSON.stringify(privacySettings));
      addXp(15);
      onUpdateNotification('Privacy Configurations Saved', 'Your data exposure permissions have been updated.', 'success');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Privacy Score Ring Header */}
      <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]">
        <CardContent className="pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="p-3.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl shrink-0">
              <Shield className="w-7 h-7" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-primary font-black uppercase tracking-wider">Candidate Shield Index</span>
                <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[8px] font-black">{privacyScore}/100 Compliance</Badge>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-text-main mt-0.5">Privacy Controls</h3>
              <p className="text-[10.5px] text-text-mute mt-1 font-semibold max-w-xl leading-normal">
                Regulate which segments of your verified credentials ledger are exposed to public indexing or third-party recruiters.
              </p>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-black font-black text-xs h-9 shrink-0">
            {saving ? 'Saving...' : 'Sync Privacy Schema'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Visibility Configurations (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility Settings</CardTitle>
              <CardDescription>Determine who is allowed to load your portfolio links and digital business card previews.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'public', label: 'Public Index', desc: 'Visible to everyone, fully indexed.' },
                  { id: 'recruiter_only', label: 'Recruiters Only', desc: 'Only verified talent scouts.' },
                  { id: 'private', label: 'Private Space', desc: 'Completely locked down profile.' }
                ].map((item) => {
                  const isActive = privacySettings.profileVisibility === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: item.id })}
                      className={`flex flex-col items-start text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                          : 'border-[var(--border)] bg-[var(--surface-secondary)]/45 hover:border-primary/40'
                      }`}
                    >
                      <span className="text-xs font-black text-text-main uppercase tracking-tight mb-1">{item.label}</span>
                      <p className="text-[9.5px] text-text-mute leading-normal font-semibold">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border)]/50 pt-4 flex flex-col gap-3">
                {/* Resume search index */}
                <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Index Uploaded Resumes</span>
                    <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Allows search models to scan and fetch details inside your uploaded files.</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, resumeIndexed: !privacySettings.resumeIndexed })}
                    className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                      privacySettings.resumeIndexed ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                      privacySettings.resumeIndexed ? 'right-0.5 bg-black' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Portfolio index */}
                <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Index Personal Projects</span>
                    <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Allows global users to search and discover your personal builds catalog.</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, portfolioIndexed: !privacySettings.portfolioIndexed })}
                    className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                      privacySettings.portfolioIndexed ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                      privacySettings.portfolioIndexed ? 'right-0.5 bg-black' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Recruiter index */}
                <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Recruiter Direct Inboxes</span>
                    <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Allows companies matching your target goals to ping opportunities directly.</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, recruiterInboxesActive: !privacySettings.recruiterInboxesActive })}
                    className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                      privacySettings.recruiterInboxesActive ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                      privacySettings.recruiterInboxesActive ? 'right-0.5 bg-black' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Analytics and Passcodes (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* SECURE VISITOR PASSCODE LOCK */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Passcode Protection</CardTitle>
              <CardDescription>Lock your public digital link with a 4-digit viewer pin code.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2.5 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Enable Passcode Lock</span>
                  <span className="text-[9.5px] text-text-mute mt-0.5">Adds a gate overlay to your link.</span>
                </div>
                <button
                  onClick={() => setPrivacySettings({ ...privacySettings, passcodeProtected: !privacySettings.passcodeProtected })}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    privacySettings.passcodeProtected ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    privacySettings.passcodeProtected ? 'right-0.5 bg-black' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {privacySettings.passcodeProtected && (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter 4-digit PIN (e.g. 9901)" 
                    value={privacySettings.passcode}
                    onChange={e => setPrivacySettings({ ...privacySettings, passcode: e.target.value.slice(0, 4) })}
                    className="text-xs h-8 text-center font-mono"
                    type="password"
                  />
                  <Button variant="outline" size="sm" onClick={() => onUpdateNotification('PIN Saved', 'Your reader access code is locked.', 'success')} className="h-8 text-[10px] font-bold">Lock</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* TELEMETRY & COOKIE CONTROLS */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sharing Preferences</CardTitle>
              <CardDescription>Configure analytical telemetry and promotional emails.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              {/* Analytics sharing */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Share Analytics Diagnostics</span>
                  <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Shares performance telemetry with our indexing hosts.</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({ ...privacySettings, analyticsConsent: !privacySettings.analyticsConsent })}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    privacySettings.analyticsConsent ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    privacySettings.analyticsConsent ? 'right-0.5 bg-black' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Marketing consent */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Promotional Marketing News</span>
                  <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Sends periodic career reports and product offers.</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({ ...privacySettings, marketingConsent: !privacySettings.marketingConsent })}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    privacySettings.marketingConsent ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    privacySettings.marketingConsent ? 'right-0.5 bg-black' : 'left-0.5'
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
