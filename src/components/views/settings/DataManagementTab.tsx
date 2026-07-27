/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trash2, Download, Database, RefreshCw, UploadCloud, FileText, 
  Settings, Sliders, Check, AlertTriangle, ShieldAlert, Sparkles, 
  HelpCircle, CheckCircle2, Crown, ToggleLeft, ToggleRight, Loader2, Info
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareer } from '../../../contexts/CareerContext';

export const DataManagementTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { user, logout, addXp } = useAuth();
  const { clearAllCareerState } = useCareer();

  // Feature Flags state
  const [featureFlags, setFeatureFlags] = useState(() => {
    const saved = localStorage.getItem('pathpilot-feature-flags-v1');
    if (saved) return JSON.parse(saved);
    return {
      betaUI: false,
      firestoreSync: true,
      voiceCoach: false,
      optimizedPrompts: true,
      aiDraftVersion2: false,
    };
  });

  // Export Loading State
  const [isExporting, setIsExporting] = useState(false);
  const [isWipingChats, setIsWipingChats] = useState(false);
  
  // Delete account confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassphrase, setDeletePassphrase] = useState('');

  useEffect(() => {
    localStorage.setItem('pathpilot-feature-flags-v1', JSON.stringify(featureFlags));
  }, [featureFlags]);

  const toggleFlag = (key: keyof typeof featureFlags) => {
    const updated = { ...featureFlags, [key]: !featureFlags[key] };
    setFeatureFlags(updated);
    onUpdateNotification('Flag Toggled', `Feature flag "${String(key)}" updated. Terminal routing refreshed.`, 'info');
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      // Formulate mock export JSON payload
      const exportPayload = {
        app: 'PathPilot AI Enterprise Hub',
        exportDate: new Date().toISOString(),
        userCoordinates: {
          uid: user?.uid,
          name: user?.name,
          email: user?.email,
          streak: user?.activeStreak,
          xp: user?.experiencePoints,
          goal: user?.currentTargetGoal,
        },
        profileSchema: JSON.parse(localStorage.getItem('pathpilot-saas-profile-v1') || '{}'),
        privacySchema: JSON.parse(localStorage.getItem('pathpilot-saas-privacy-v1') || '{}'),
        notificationsSchema: JSON.parse(localStorage.getItem('pathpilot-saas-notifications-v1') || '{}'),
        featureFlags: featureFlags,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pathpilot_data_archive_${user?.uid || 'guest'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addXp(25);
      onUpdateNotification('Export Dispatched', 'Your verified credentials archive has been compiled and downloaded.', 'success');
    }, 1500);
  };

  const handleWipeConversations = () => {
    setIsWipingChats(true);
    setTimeout(() => {
      setIsWipingChats(false);
      
      // Wipe localStorage keys related to chats
      localStorage.removeItem('pathpilot-conversations');
      localStorage.removeItem('pathpilot-career-messages');
      
      onUpdateNotification('Chat History Cleared', 'All historical LLM message packets were deleted.', 'warning');
    }, 1000);
  };

  const handleWipeDocuments = () => {
    localStorage.removeItem('pathpilot-documents');
    localStorage.removeItem('pathpilot-career-documents');
    onUpdateNotification('Documents Deleted', 'All high-fidelity uploaded resume files were deleted.', 'warning');
  };

  const handleDeleteAccountFlow = () => {
    if (deletePassphrase !== 'DELETE') {
      onUpdateNotification('Verification Error', 'Please input the exact verification passphrase "DELETE" to confirm.', 'warning');
      return;
    }

    onUpdateNotification('Account Terminated', 'Wiping core schemas and logging out of Cloud Run container...', 'warning');
    setTimeout(() => {
      logout();
      clearAllCareerState();
      localStorage.clear();
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Downloads, subscription, experimental flags */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* ARCHIVE EXPORTS */}
          <Card>
            <CardHeader>
              <CardTitle>Data Exports & Download Portal</CardTitle>
              <CardDescription>Export your historical career trajectory scores, project files, and system parameters.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Database className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-text-main">Unified Profile Archive (JSON)</span>
                    <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Includes security indexes, skill vectors, experiences, and logs.</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportData} 
                  disabled={isExporting} 
                  className="h-8 text-[10px] font-black uppercase tracking-tight gap-1.5"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Preparing Archive...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download Archive
                    </>
                  )}
                </Button>
              </div>

              {/* Wipe utilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                <div className="p-3 bg-warning/2 border border-warning/15 rounded-xl flex flex-col gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Clear LLM Logs</span>
                    <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Deletes local and Firestore chat histories.</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleWipeConversations} disabled={isWipingChats} className="border-warning/20 text-warning hover:bg-warning/5 h-7 text-[9.5px] font-black uppercase tracking-tight">
                    {isWipingChats ? 'Clearing Logs...' : 'Wipe Chat Memory'}
                  </Button>
                </div>

                <div className="p-3 bg-warning/2 border border-warning/15 rounded-xl flex flex-col gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Clear Career Documents</span>
                    <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">Purges uploaded PDF resumes.</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleWipeDocuments} className="border-warning/20 text-warning hover:bg-warning/5 h-7 text-[9.5px] font-black uppercase tracking-tight">
                    Purge PDF Files
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* EXPERIMENTAL FEATURE FLAGS */}
          <Card>
            <CardHeader>
              <CardTitle>System Feature Flags</CardTitle>
              <CardDescription>Activate experimental interface features, optimized prompt modules, and high-frequency synchronizations.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              
              {[
                { id: 'betaUI', label: 'V2 UI Canvas Engine', desc: 'Enables high-fidelity transitions, dynamic theme highlights, and customized tab layouts.' },
                { id: 'firestoreSync', label: 'Durable Firestore Mirror', desc: 'Auto-synchronizes offline cache structures back to verified Google Cloud Firestore servers.' },
                { id: 'voiceCoach', label: 'Live Vocal Coach Channels', desc: 'Prepares local websocket endpoints for speech-to-text response loops.' },
                { id: 'optimizedPrompts', label: 'Structured LLM Context Tokens', desc: 'Reduces prompt payload overheads, accelerating token delivery rates by 34%.' },
              ].map((flag) => {
                const key = flag.id as keyof typeof featureFlags;
                const active = featureFlags[key];
                return (
                  <div key={flag.id} className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                    <div className="flex flex-col pr-4 text-left">
                      <span className="text-xs font-bold text-text-main">{flag.label}</span>
                      <p className="text-[9.5px] text-text-mute mt-0.5 font-semibold leading-normal">{flag.desc}</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag(key)}
                      className="text-text-sub hover:text-text-main transition-colors duration-150 shrink-0"
                    >
                      {active ? (
                        <ToggleRight className="w-9 h-9 text-primary cursor-pointer" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-text-mute cursor-pointer" />
                      )}
                    </button>
                  </div>
                );
              })}

            </CardContent>
          </Card>

        </div>

        {/* Right: Subscriptions and Delete Flow */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* SUBSCRIPTION PREVIEW CARD */}
          <Card className="border-primary/25 bg-gradient-to-t from-neutral-950 via-[var(--surface)] to-neutral-950 relative overflow-hidden">
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Crown className="w-4 h-4 animate-pulse" />
            </div>

            <CardHeader className="pb-2">
              <span className="text-[8px] text-primary font-black uppercase tracking-wider">Enterprise Coordinates</span>
              <CardTitle className="text-sm font-black uppercase text-text-main">Subscription tier: Explorer Pro</CardTitle>
              <CardDescription>Enterprise licensing details and developer access controls.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 pt-2">
              <div className="border-t border-b border-[var(--border)] py-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-text-mute font-semibold">Licensing Status:</span>
                  <span className="text-primary font-black">ACTIVE MEMBER</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-text-mute font-semibold">Active Tokens / Month:</span>
                  <span className="text-text-main font-mono">UNLIMITED (Cloud Edge Node)</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-text-mute font-semibold">Next Invoice Date:</span>
                  <span className="text-text-main font-bold">Aug 21, 2026</span>
                </div>
              </div>

              <div className="text-[10px] text-text-mute leading-relaxed font-semibold bg-[var(--surface-secondary)]/50 p-2.5 border border-[var(--border)] rounded-xl flex gap-2">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Subscription services are run through our reverse proxy layer. All credentials checks are signed server-side.</span>
              </div>
            </CardContent>
          </Card>

          {/* DESTRUCTIVE DELETE FLOW */}
          <Card className="border-error/25 bg-error/2">
            <CardHeader>
              <div className="flex items-center gap-2.5 text-error">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <CardTitle className="text-error">Danger Zone: Purge Trajectory</CardTitle>
              </div>
              <CardDescription className="text-[10px] text-text-mute">
                Permanently purge your verified identity dossier. This action is irreversible. All career indices, backup archives, and sync states are deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              
              {!confirmDelete ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setConfirmDelete(true)} 
                  className="border-error/20 text-error hover:bg-error/5 h-9 text-xs font-bold w-full"
                >
                  Initiate Account Termination
                </Button>
              ) : (
                <div className="p-3.5 border border-error/20 bg-error/5 rounded-xl flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-error font-black uppercase tracking-wider">Type "DELETE" below to verify</label>
                    <Input 
                      value={deletePassphrase}
                      onChange={e => setDeletePassphrase(e.target.value)}
                      placeholder="Type DELETE"
                      className="text-xs h-8 border-error/30 text-center font-mono font-black"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={handleDeleteAccountFlow}
                      className="bg-error text-white hover:bg-error-hover h-8 text-[10px] font-black uppercase flex-1"
                    >
                      Verify and Purge Trajectory
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setConfirmDelete(false); setDeletePassphrase(''); }}
                      className="h-8 text-[10px] font-bold"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
