/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, Mail, MessageSquare, Smartphone, AlertTriangle, CheckCircle2, 
  Info, Sparkles, RefreshCw, Layers, Calendar, HelpCircle 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

export const NotificationsTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  const [notifState, setNotifState] = useState(() => {
    const saved = localStorage.getItem('pathpilot-saas-notifications-v1');
    if (saved) return JSON.parse(saved);
    return {
      emailMaster: true,
      pushMaster: true,
      smsMaster: false,
      interviewAlerts: true,
      applicationReminders: true,
      scholarshipAlerts: false,
      deadlineAlerts: true,
      aiRecommendations: true,
      weeklyDigest: true,
      monthlyReports: false,
    };
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-notifications-v1', JSON.stringify(notifState));
  }, [notifState]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      localStorage.setItem('pathpilot-saas-notifications-v1', JSON.stringify(notifState));
      addXp(10);
      onUpdateNotification('Alert Routing Updated', 'Your contact communication channels have been configured.', 'success');
    }, 600);
  };

  const toggleVal = (key: keyof typeof notifState) => {
    setNotifState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Overview Block */}
      <div className="p-4 rounded-card bg-[var(--surface-secondary)]/30 border border-[var(--border)] flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-text-main">Notification Delivery Matrix</h3>
            <p className="text-[10px] text-text-mute font-semibold mt-0.5">Control where and when PathPilot sends interview triggers and deadline prompts.</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-black font-black text-xs h-8">
          {saving ? 'Syncing...' : 'Save Matrix'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Channels Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /> Delivery Channels</CardTitle>
            <CardDescription>Activate master pipelines for email, browser push, and text coordinates.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            
            {/* Email Channel */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Email Notifications</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Sends roadmaps, interview guides to inbox.</span>
                </div>
              </div>
              <button
                onClick={() => toggleVal('emailMaster')}
                className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                  notifState.emailMaster ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                  notifState.emailMaster ? 'right-0.5 bg-black' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Push Channel */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
              <div className="flex gap-3 items-center">
                <Bell className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Browser Push Alerts</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Launches toast prompts on target devices.</span>
                </div>
              </div>
              <button
                onClick={() => toggleVal('pushMaster')}
                className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                  notifState.pushMaster ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                  notifState.pushMaster ? 'right-0.5 bg-black' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* SMS Channel */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
              <div className="flex gap-3 items-center">
                <MessageSquare className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">SMS Mobile Updates</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Sends high priority alert streams via text.</span>
                </div>
              </div>
              <button
                onClick={() => toggleVal('smsMaster')}
                className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                  notifState.smsMaster ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                  notifState.smsMaster ? 'right-0.5 bg-black' : 'left-0.5'
                }`} />
              </button>
            </div>

          </CardContent>
        </Card>

        {/* Categories of Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Trigger Categories</CardTitle>
            <CardDescription>Configure which event streams dispatch message blocks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            
            {[
              { id: 'interviewAlerts', label: 'Interview Guide Alerts', desc: 'Alerts when simulated prep cycles compile feedback.' },
              { id: 'applicationReminders', label: 'Application Status Reminders', desc: 'Triggers when logged job targets reach key stages.' },
              { id: 'scholarshipAlerts', label: 'Scholarship Target Alerts', desc: 'Alerts for high matching financial opportunities.' },
              { id: 'deadlineAlerts', label: 'Calendar Milestones & Deadlines', desc: 'Warns 24 hours prior to goal target checkpoints.' },
              { id: 'aiRecommendations', label: 'Smart AI Career Suggestions', desc: 'Dispatches matching skill paths and course units.' },
            ].map((item) => {
              const key = item.id as keyof typeof notifState;
              const isActive = notifState[key];
              return (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-[var(--surface-secondary)]/25 border border-[var(--border)]/70 rounded-xl">
                  <div className="flex flex-col pr-3">
                    <span className="text-xs font-bold text-text-main">{item.label}</span>
                    <p className="text-[9.5px] text-text-mute mt-0.5 font-semibold leading-normal">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleVal(key)}
                    className={`w-9 h-5 rounded-full transition-all duration-150 relative border shrink-0 ${
                      isActive ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                      isActive ? 'right-0.5 bg-black' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              );
            })}

          </CardContent>
        </Card>

      </div>

    </div>
  );
};
