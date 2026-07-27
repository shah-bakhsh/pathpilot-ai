/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, BookOpen, MessageSquare, Terminal, Keyboard, AlertTriangle, 
  CheckCircle2, ChevronDown, ChevronUp, Star, RefreshCw, Send, Check 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

interface FAQItem {
  q: string;
  a: string;
}

interface KeyboardShortcut {
  action: string;
  keys: string;
}

export const HelpShortcutsTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  // FAQs state (open/close toggles)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    { q: 'Is my data secure in PathPilot?', a: 'Yes. PathPilot stores all configuration profiles inside isolated, secure, client-side localStorage coordinates, synchronized server-side to encrypted Firestore nodes behind GCP proxies on port 3000.' },
    { q: 'How does the AI career scorer calculate my index?', a: 'The scoring model evaluates your verified tech stack keywords, education credentials, certifications list, andWork history bullet points, comparing them with live recruiter requisitions.' },
    { q: 'Can I export my profile to resume generators?', a: 'Absolutely. You can fetch your unified profile JSON from the Data tab, or compile a recruiter-friendly digital business card directly from the Profile Center.' },
    { q: 'How do I customize the default system theme?', a: 'Head to the Appearance tab where you can choose Light/Dark/System default modes, along with customized primary accent color highlights like Indigo or Emerald.' }
  ];

  // Customizable Shortcuts state
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(() => {
    const saved = localStorage.getItem('pathpilot-saas-shortcuts-v1');
    if (saved) return JSON.parse(saved);
    return [
      { action: 'Navigate to Dashboard', keys: 'G + D' },
      { action: 'Navigate to Roadmap', keys: 'G + R' },
      { action: 'Navigate to Settings', keys: 'G + S' },
      { action: 'Open AI Coach chat', keys: 'Ctrl + K' },
      { action: 'Toggle Recruiter Preview', keys: 'Ctrl + P' }
    ];
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempKeys, setTempKeys] = useState('');

  // Support Ticket state
  const [ticketType, setTicketType] = useState('bug'); // bug, feedback, feature
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-shortcuts-v1', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const handleEditShortcut = (idx: number, currentKeys: string) => {
    setEditingIndex(idx);
    setTempKeys(currentKeys);
  };

  const saveShortcut = (idx: number) => {
    if (!tempKeys.trim()) return;
    setShortcuts(prev => prev.map((s, i) => {
      if (i === idx) return { ...s, keys: tempKeys.toUpperCase() };
      return s;
    }));
    setEditingIndex(null);
    onUpdateNotification('Shortcuts Updated', 'Custom keyboard shortcuts bindings saved.', 'success');
  };

  const handleSendTicket = () => {
    if (!subject || !details) {
      onUpdateNotification('Fields Empty', 'Please provide a subject line and description for the support ticket.', 'warning');
      return;
    }

    setSubmittingTicket(true);
    setTimeout(() => {
      setSubmittingTicket(false);
      setSubject('');
      setDetails('');
      addXp(15);
      onUpdateNotification('Ticket Dispatched', `Your support ticket has been compiled. Reference code: PP-${Math.floor(100000 + Math.random() * 900000)}`, 'success');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Search Header */}
      <div className="p-4 rounded-card bg-[var(--surface-secondary)]/30 border border-[var(--border)] flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-text-main">Knowledge Center & Shortcuts</h3>
            <p className="text-[10px] text-text-mute font-semibold mt-0.5">Diagnose issues, open expandable support lines, read regulatory rules, or bind customize keyboard accelerators.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Accordion and Shortcuts */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
              <CardDescription>Quick, actionable answers regarding credential storage and rating parameters.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface-secondary)]/20">
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 flex justify-between items-center hover:bg-[var(--hover-tint)]/45 transition-colors duration-150 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-text-main leading-snug">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-mute shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-[var(--surface-secondary)]/50 border-t border-[var(--border)]/70 text-[11px] font-semibold text-text-sub leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* KEYBOARD SHORTCUTS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5"><Keyboard className="w-5 h-5 text-primary" /> Customizable Shortcuts</CardTitle>
              <CardDescription>Navigate between panels without clicking. Customize key triggers.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {shortcuts.map((sh, idx) => (
                <div key={idx} className="p-3 bg-[var(--surface-secondary)]/45 border border-[var(--border)] rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-text-sub">{sh.action}</span>
                  
                  {editingIndex === idx ? (
                    <div className="flex gap-2">
                      <Input 
                        value={tempKeys}
                        onChange={e => setTempKeys(e.target.value)}
                        className="text-xs h-7 text-center font-mono max-w-[100px]"
                        placeholder="Key Bind"
                      />
                      <Button variant="primary" size="sm" onClick={() => saveShortcut(idx)} className="bg-primary text-black h-7 text-[9px] font-black uppercase">Save</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <code className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded font-mono font-black text-[9.5px] uppercase">{sh.keys}</code>
                      <button onClick={() => handleEditShortcut(idx, sh.keys)} className="text-[10px] text-text-mute hover:text-text-main font-bold">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right: Support Ticket Desk and Links */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* SUPPORT TICKET FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Support Desk</CardTitle>
              <CardDescription>File technical bug reports or feedback. Checked by core engineering teams.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              
              <div className="flex border border-[var(--border)] rounded-lg overflow-hidden">
                {[
                  { id: 'bug', label: 'Report Bug' },
                  { id: 'feedback', label: 'Give Feedback' },
                  { id: 'feature', label: 'Request Feature' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTicketType(item.id)}
                    className={`flex-1 py-1.5 text-[9.5px] font-black uppercase ${ticketType === item.id ? 'bg-primary text-black' : 'bg-transparent text-text-mute hover:bg-[var(--hover-tint)]'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Subject Line</span>
                <Input 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Broken radar grid on MacBook Chrome"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">Specific Details</span>
                <textarea 
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  rows={3}
                  placeholder="Describe your environment coordinates or suggestions..."
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg p-2.5 text-xs font-semibold leading-relaxed text-text-sub outline-none focus:border-primary/50 resize-y"
                />
              </div>

              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSendTicket} 
                disabled={submittingTicket}
                className="bg-primary text-black font-black text-xs h-9 w-full gap-1.5"
              >
                {submittingTicket ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Dispatch Support Ticket
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          {/* DOCUMENTATION LINKS */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-text-main">Regulatory Guides</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-2 text-[10px] text-text-mute font-semibold leading-relaxed">
              <a href="#" className="p-2.5 bg-[var(--surface-secondary)]/50 hover:bg-[var(--hover-tint)] border border-[var(--border)] rounded-xl flex justify-between items-center text-text-sub">
                <span>Core Documentation Manual</span>
                <BookOpen className="w-4 h-4 text-text-mute" />
              </a>
              <a href="#" className="p-2.5 bg-[var(--surface-secondary)]/50 hover:bg-[var(--hover-tint)] border border-[var(--border)] rounded-xl flex justify-between items-center text-text-sub">
                <span>Terms of Service Agreement</span>
                <Terminal className="w-4 h-4 text-text-mute" />
              </a>
              <a href="#" className="p-2.5 bg-[var(--surface-secondary)]/50 hover:bg-[var(--hover-tint)] border border-[var(--border)] rounded-xl flex justify-between items-center text-text-sub">
                <span>Privacy & Telemetry Protocol</span>
                <Star className="w-4 h-4 text-text-mute" />
              </a>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
