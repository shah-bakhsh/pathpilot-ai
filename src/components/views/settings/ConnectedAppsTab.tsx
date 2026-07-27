/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Link, Link2, ExternalLink, ShieldCheck, RefreshCw, AlertCircle, Info, 
  Settings, Sliders, Check, BadgeAlert 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

interface ConnectedApp {
  id: string;
  name: string;
  desc: string;
  connected: boolean;
  username?: string;
  scopes: string[];
  logoColor: string;
}

export const ConnectedAppsTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  const [apps, setApps] = useState<ConnectedApp[]>(() => {
    const saved = localStorage.getItem('pathpilot-saas-connected-apps-v1');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'google', name: 'Google Suite', desc: 'Syncs interview invitations directly with Google Calendar and Sheets.', connected: true, username: 'ninjacyber484@gmail.com', scopes: ['calendar.events', 'sheets.write'], logoColor: 'text-rose-500' },
      { id: 'github', name: 'GitHub Developer', desc: 'Indexes repository contributions, stars, and readme configurations.', connected: true, username: 'alexmercer-dev', scopes: ['repo.read', 'user.profile'], logoColor: 'text-neutral-400' },
      { id: 'linkedin', name: 'LinkedIn Professional', desc: 'Synchronizes job alerts, current industry tags, and headlines.', connected: false, scopes: ['profile.read', 'inbox.post'], logoColor: 'text-blue-500' },
      { id: 'microsoft', name: 'Microsoft Outlook', desc: 'Connects Outlook calendars with mentor application timelines.', connected: false, scopes: ['calendar.read'], logoColor: 'text-cyan-500' },
      { id: 'slack', name: 'Slack Workspace', desc: 'Pings active mock feedback and study reminders inside private channels.', connected: false, scopes: ['chat.write', 'incoming-webhook'], logoColor: 'text-indigo-400' },
      { id: 'discord', name: 'Discord Community', desc: 'Receives support reminders and alerts inside the PathPilot server.', connected: false, scopes: ['guilds.join'], logoColor: 'text-violet-500' },
      { id: 'apple', name: 'Apple ID', desc: 'Quick sign-on credentials linking for safe biometric logins.', connected: false, scopes: ['identity.read'], logoColor: 'text-neutral-200' },
      { id: 'twitter', name: 'X / Twitter Developers', desc: 'Dispatches branding stats directly to your personal public feed.', connected: false, scopes: ['tweet.read'], logoColor: 'text-neutral-300' }
    ];
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-connected-apps-v1', JSON.stringify(apps));
  }, [apps]);

  const toggleConnection = (id: string) => {
    const target = apps.find(a => a.id === id);
    if (!target) return;

    if (target.connected) {
      // Disconnect
      setApps(prev => prev.map(a => {
        if (a.id === id) {
          return { ...a, connected: false, username: undefined };
        }
        return a;
      }));
      onUpdateNotification('Integration Severed', `Disconnected from ${target.name}. API access revoked.`, 'warning');
    } else {
      // Simulate Connection Flow
      setIsSyncing(true);
      onUpdateNotification('OAuth Initialized', `Requesting credential token scopes for ${target.name}...`, 'info');
      
      setTimeout(() => {
        setIsSyncing(false);
        setApps(prev => prev.map(a => {
          if (a.id === id) {
            return { 
              ...a, 
              connected: true, 
              username: id === 'linkedin' ? 'alex-mercer-systems' : 'alex_mercer_guest' 
            };
          }
          return a;
        }));
        addXp(25);
        onUpdateNotification('Connection Authorized', `Successfully authorized gRPC tokens for ${target.name}!`, 'success');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Description Hero */}
      <div className="p-4 rounded-card bg-[var(--surface-secondary)]/30 border border-[var(--border)] flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Link className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-text-main">Connected Services & Workspace Integrations</h3>
            <p className="text-[10px] text-text-mute font-semibold mt-0.5">Authorize credentials, sync repository details, export calendar files, and configure alert triggers.</p>
          </div>
        </div>
        {isSyncing && (
          <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-wider animate-pulse py-1">
            <RefreshCw className="w-3 h-3 animate-spin mr-1 inline" /> Exchanging Tokens
          </Badge>
        )}
      </div>

      {/* Grid of connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="relative overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] font-display font-black text-xs ${app.logoColor}`}>
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-main uppercase tracking-tight">{app.name}</h4>
                    {app.connected && app.username && (
                      <span className="text-[9.5px] text-primary font-bold">Connected as {app.username}</span>
                    )}
                  </div>
                </div>

                <Badge variant={app.connected ? 'success' : 'neutral'} className="text-[8px] font-black uppercase tracking-wider">
                  {app.connected ? 'ACTIVE' : 'DISCONNECTED'}
                </Badge>
              </div>
              <CardDescription className="text-[10px] leading-relaxed font-semibold mt-2.5 pr-2">
                {app.desc}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="border-t border-[var(--border)]/40 pt-3 mt-1 flex justify-between items-center gap-4">
                <div className="flex flex-wrap gap-1">
                  {app.scopes.map((sc, i) => (
                    <Badge key={i} variant="neutral" className="bg-[var(--surface-secondary)] border border-[var(--border)] text-[8px] font-semibold text-text-mute">{sc}</Badge>
                  ))}
                </div>

                <Button 
                  variant={app.connected ? 'outline' : 'primary'} 
                  size="sm" 
                  onClick={() => toggleConnection(app.id)}
                  className={`h-7 px-3 text-[9.5px] font-black uppercase shrink-0 ${app.connected ? 'border-error/20 text-error hover:bg-error/5' : 'bg-primary text-black'}`}
                >
                  {app.connected ? 'Disconnect' : 'Connect Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};
