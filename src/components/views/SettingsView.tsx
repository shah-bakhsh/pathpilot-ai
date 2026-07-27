/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCareer } from '../../contexts/CareerContext';
import { 
  Settings, User, Key, Palette, Shield, Bell, Link, Sparkles, 
  Database, HelpCircle, Search, Wifi, WifiOff, ChevronRight, X 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

import { Building2, Code } from 'lucide-react';
// Import Modular Tabs
import { ProfileTab } from './settings/ProfileTab';
import { GeneralTab } from './settings/GeneralTab';
import { AppearanceTab } from './settings/AppearanceTab';
import { SecurityTab } from './settings/SecurityTab';
import { PrivacyTab } from './settings/PrivacyTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { ConnectedAppsTab } from './settings/ConnectedAppsTab';
import { AiPreferencesTab } from './settings/AiPreferencesTab';
import { DataManagementTab } from './settings/DataManagementTab';
import { HelpShortcutsTab } from './settings/HelpShortcutsTab';
import { OrganizationTab } from './settings/OrganizationTab';
import { DeveloperApiTab } from './settings/DeveloperApiTab';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useCareer();
  
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('pathpilot-settings-active-tab') || 'profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Sync active tab to localStorage
  useEffect(() => {
    localStorage.setItem('pathpilot-settings-active-tab', activeTab);
  }, [activeTab]);

  // Handle Toast notification updates
  const handleUpdateNotification = (title: string, body: string, type: 'info' | 'success' | 'warning') => {
    addNotification(title, body, type);
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" />, desc: 'Configure public career identity, digital business card, skills.' },
    { id: 'organization', label: 'Organization & Team', icon: <Building2 className="w-4 h-4" />, desc: 'Workspace multi-tenancy, member invitations, role hierarchy.' },
    { id: 'developer-api', label: 'Developer API & Webhooks', icon: <Code className="w-4 h-4" />, desc: 'REST API secret keys, scopes, outbound webhooks delivery logs.' },
    { id: 'general', label: 'Account Details', icon: <Settings className="w-4 h-4" />, desc: 'Modify username, location coordinates, primary email, phone.' },
    { id: 'appearance', label: 'Theme & Accent', icon: <Palette className="w-4 h-4" />, desc: 'Dark / Light modes, primary accent tones, layout density.' },
    { id: 'security', label: 'Security Center', icon: <Key className="w-4 h-4" />, desc: 'Password resetting, Multi-Factor 2FA TOTP apps, active sessions.' },
    { id: 'privacy', label: 'Privacy Shields', icon: <Shield className="w-4 h-4" />, desc: 'Exposure levels, recruiter direct indices, visitor passcode pins.' },
    { id: 'notifications', label: 'Delivery Matrix', icon: <Bell className="w-4 h-4" />, desc: 'Email channels, SMS alerts, browser push triggers, deadlines.' },
    { id: 'integrations', label: 'Connected Apps', icon: <Link className="w-4 h-4" />, desc: 'Google Calendar, GitHub contributions indices, Outlook syncing.' },
    { id: 'ai-settings', label: 'AI Directives', icon: <Sparkles className="w-4 h-4" />, desc: 'LLM engine configurations, temperature, writing styles, tones.' },
    { id: 'data', label: 'Data & Advanced', icon: <Database className="w-4 h-4" />, desc: 'Export profile JSON archives, feature flags system, terminate account.' },
    { id: 'help', label: 'Help & Hotkeys', icon: <HelpCircle className="w-4 h-4" />, desc: 'FAQ accordions, dispatch support tickets, customized shortcuts.' },
  ];

  // Settings Instant Search logic
  const filteredTabs = tabs.filter(t => 
    t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in relative pb-12">
      
      {/* Dynamic Header row containing diagnostic metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 animate-spin" style={{ animationDuration: '8s' }}>
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-text-main uppercase tracking-tight">
              Enterprise Control & Identity Panel
            </h2>
            <p className="text-[10px] text-text-mute font-semibold mt-0.5 leading-normal">
              Fully configure your authenticated session, private telemetry parameters, and large model directives.
            </p>
          </div>
        </div>

        {/* Offline Simulation toggle */}
        <div className="flex items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-between border-t md:border-t-0 border-[var(--border)] pt-3 md:pt-0">
          <button 
            onClick={() => {
              setIsOfflineSimulated(!isOfflineSimulated);
              handleUpdateNotification(
                isOfflineSimulated ? 'Network Re-established' : 'Offline Cache Enabled',
                isOfflineSimulated ? 'Synchronizing pending localStorage logs to Cloud Run...' : 'Working inside resilient sandbox buffer mode.',
                isOfflineSimulated ? 'success' : 'warning'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9.5px] font-black uppercase transition-all duration-200 cursor-pointer ${
              isOfflineSimulated 
                ? 'bg-warning/10 border-warning text-warning' 
                : 'bg-emerald-400/5 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10'
            }`}
          >
            {isOfflineSimulated ? (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse" /> Sandbox Offline
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" /> Gateway Online
              </>
            )}
          </button>
          
          <Badge variant="neutral" className="bg-primary/5 border border-primary/25 text-primary text-[8px] font-black uppercase px-2 py-0.5">
            NODE 3000 ACTIVE
          </Badge>
        </div>
      </div>

      {/* Global Settings Search bar */}
      <div className="relative w-full max-w-md">
        <span className="absolute left-3.5 top-2.5 text-text-mute">
          <Search className="w-4 h-4" />
        </span>
        <Input 
          type="text" 
          placeholder="Instant search settings (e.g. MFA, password, theme)..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 text-xs h-9 font-semibold"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-text-mute hover:text-text-main p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Layout Grid: Sidebar Selector vs Active Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* SIDEBAR SELECTION PANEL (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-1 bg-[var(--surface)]/45 border border-[var(--border)] p-2 rounded-2xl">
          {filteredTabs.length === 0 ? (
            <span className="text-[10px] text-text-mute p-3 text-center font-bold">No settings matched your query.</span>
          ) : (
            filteredTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-3 w-full text-left p-2.5 rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                    isSelected 
                      ? 'bg-primary text-black font-black shadow-sm' 
                      : 'text-text-sub hover:bg-[var(--hover-tint)]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/10 text-black' : 'bg-[var(--surface-secondary)]/50 text-text-mute'}`}>
                    {tab.icon}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] font-black uppercase tracking-tight leading-normal">{tab.label}</span>
                    {!isSelected && (
                      <span className="text-[8px] text-text-mute font-medium truncate mt-0.5">{tab.desc}</span>
                    )}
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-black' : 'text-text-mute/50'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* ACTIVE MAIN SETTING CONTENT PANEL (9 cols) */}
        <div className="lg:col-span-9 w-full">
          {activeTab === 'profile' && <ProfileTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'organization' && <OrganizationTab />}
          {activeTab === 'developer-api' && <DeveloperApiTab />}
          {activeTab === 'general' && <GeneralTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'appearance' && <AppearanceTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'security' && <SecurityTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'privacy' && <PrivacyTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'notifications' && <NotificationsTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'integrations' && <ConnectedAppsTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'ai-settings' && <AiPreferencesTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'data' && <DataManagementTab onUpdateNotification={handleUpdateNotification} />}
          {activeTab === 'help' && <HelpShortcutsTab onUpdateNotification={handleUpdateNotification} />}
        </div>

      </div>

    </div>
  );
};

export default SettingsView;
