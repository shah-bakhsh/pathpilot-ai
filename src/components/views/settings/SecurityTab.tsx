/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Shield, Key, KeyRound, Smartphone, 
  MapPin, CheckCircle2, AlertTriangle, RefreshCw, LogOut, Check, Info, 
  AlertCircle, ChevronRight, XCircle, Trash2, Calendar 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  current: boolean;
  activeAt: string;
}

interface SecurityLog {
  id: string;
  event: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warn' | 'error';
}

export const SecurityTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { addXp } = useAuth();

  // Settings State persistent values
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => localStorage.getItem('pathpilot-2fa-enabled') === 'true');
  const [emailVerified, setEmailVerified] = useState(() => localStorage.getItem('pathpilot-email-verified') !== 'false');
  const [phoneVerified, setPhoneVerified] = useState(() => localStorage.getItem('pathpilot-phone-verified') === 'true');
  
  // Password inputs
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStrength, setPassStrength] = useState(0);

  // Active Sessions state
  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    const saved = localStorage.getItem('pathpilot-saas-sessions-v1');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', device: 'Apple MacBook Pro 16"', browser: 'Chrome / macOS', ip: '192.178.2.14', location: 'San Francisco, CA', current: true, activeAt: 'Just now' },
      { id: '2', device: 'Apple iPhone 15 Pro Max', browser: 'Safari Mobile', ip: '172.56.21.90', location: 'San Francisco, CA', current: false, activeAt: '3 hours ago' },
      { id: '3', device: 'Linux Dev Container', browser: 'Vite Native / HMR', ip: '127.0.0.1', location: 'Local Host Port 3000', current: false, activeAt: '2 days ago' }
    ];
  });

  // Security Logs
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    { id: 'l1', event: 'MFA settings audited', ip: '192.178.2.14', timestamp: '2026-07-21 09:32', status: 'success' },
    { id: 'l2', event: 'Successful OAuth login', ip: '192.178.2.14', timestamp: '2026-07-21 08:11', status: 'success' },
    { id: 'l3', event: 'Invalid password attempt', ip: '185.220.101.44', timestamp: '2026-07-20 14:02', status: 'warn' },
  ]);

  // Modal / setup trigger for 2FA
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  // Auto-calculated Security Score
  const securityScore = React.useMemo(() => {
    let score = 30; // base score
    if (emailVerified) score += 20;
    if (phoneVerified) score += 15;
    if (twoFactorEnabled) score += 25;
    if (newPass && passStrength > 3) score += 10;
    return Math.min(score, 100);
  }, [emailVerified, phoneVerified, twoFactorEnabled, newPass, passStrength]);

  useEffect(() => {
    localStorage.setItem('pathpilot-saas-sessions-v1', JSON.stringify(sessions));
  }, [sessions]);

  // Check pass strength
  useEffect(() => {
    let strength = 0;
    if (newPass.length > 7) strength += 1;
    if (/[A-Z]/.test(newPass)) strength += 1;
    if (/[0-9]/.test(newPass)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(newPass)) strength += 1;
    setPassStrength(strength);
  }, [newPass]);

  const handleChangePassword = () => {
    if (!currentPass || !newPass || !confirmPass) {
      onUpdateNotification('Fields Missing', 'Please fill in all standard password credentials blocks.', 'warning');
      return;
    }
    if (newPass !== confirmPass) {
      onUpdateNotification('Passwords Mismatch', 'The confirm password field must match your new target password.', 'warning');
      return;
    }
    if (passStrength < 3) {
      onUpdateNotification('Password Weak', 'Ensure your new password uses mixed character types for stronger security indexes.', 'warning');
      return;
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addXp(20);
    onUpdateNotification('Password Modified', 'New credentials written successfully.', 'success');
  };

  const handleRevokeSession = (id: string) => {
    const sessionToRevoke = sessions.find(s => s.id === id);
    if (sessionToRevoke?.current) {
      onUpdateNotification('Revoke Failed', 'You cannot revoke your active local terminal session here.', 'warning');
      return;
    }
    setSessions(prev => prev.filter(s => s.id !== id));
    onUpdateNotification('Session Revoked', `Terminal access for ${sessionToRevoke?.device} was locked.`, 'info');
  };

  const handleRevokeAllOthers = () => {
    setSessions(prev => prev.filter(s => s.current));
    onUpdateNotification('Security Hardened', 'All other client sockets were terminated.', 'success');
    addXp(15);
  };

  const verifyPhoneCode = () => {
    setPhoneVerified(true);
    localStorage.setItem('pathpilot-phone-verified', 'true');
    onUpdateNotification('Phone Verified', 'Coordinate verified. SMS notifications can now be channeled.', 'success');
    addXp(15);
  };

  const submit2FAActivation = () => {
    if (totpCode.length < 6) {
      onUpdateNotification('Code Invalid', 'Please input the full 6-digit verification code.', 'warning');
      return;
    }
    setTwoFactorEnabled(true);
    localStorage.setItem('pathpilot-2fa-enabled', 'true');
    setShow2faSetup(false);
    onUpdateNotification('MFA Activated', 'Two-Factor app authentication is fully integrated.', 'success');
    addXp(30);
  };

  const disable2FA = () => {
    setTwoFactorEnabled(false);
    localStorage.setItem('pathpilot-2fa-enabled', 'false');
    onUpdateNotification('MFA Deactivated', 'Account security score reduced. Multi-Factor checks disabled.', 'warning');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* SECURITY SCORE INDEX HERO HEADER */}
      <Card className="overflow-hidden bg-gradient-to-r from-neutral-900 via-[var(--surface)] to-neutral-900 border-[var(--border)] relative">
        <CardContent className="pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            {/* Scoring Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke={securityScore >= 80 ? '#10b981' : securityScore >= 50 ? '#f59e0b' : '#f43f5e'} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - securityScore / 100)}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-mono font-black text-text-main">{securityScore}%</span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[9px] text-primary font-black uppercase tracking-wider">Operational Security Index</span>
              <h3 className="text-base font-black uppercase tracking-tight text-text-main mt-0.5">SaaS Security Hub</h3>
              <p className="text-[10.5px] text-text-mute mt-1 font-semibold max-w-xl leading-normal">
                {securityScore >= 80 
                  ? 'Excellent. Your profile has high compliance metrics, Multi-Factor check lines are active, and credential streams are secure.'
                  : 'Action Recommended. Strengthen security scores by enabling Multi-Factor App Authenticators and completing phone verifications.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-sub">
              {emailVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <AlertTriangle className="w-3.5 h-3.5 text-error" />}
              <span>Email Verified Status</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-sub">
              {phoneVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <AlertCircle className="w-3.5 h-3.5 text-text-mute" />}
              <span>SMS Phone Verify</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-sub">
              {twoFactorEnabled ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <AlertCircle className="w-3.5 h-3.5 text-text-mute" />}
              <span>Authenticator App</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Password and MFA */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* PASSWORD RESET MODULE */}
          <Card>
            <CardHeader>
              <CardTitle>Change Secure Password</CardTitle>
              <CardDescription>Update your host account login credentials below. Changes write instantly.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">Current Password</span>
                <Input 
                  type="password" 
                  value={currentPass} 
                  onChange={e => setCurrentPass(e.target.value)}
                  className="text-xs h-9 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">New Password</span>
                  <Input 
                    type="password" 
                    value={newPass} 
                    onChange={e => setNewPass(e.target.value)}
                    className="text-xs h-9 font-semibold"
                  />
                  {newPass && (
                    <div className="flex gap-1.5 mt-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`h-1 flex-1 rounded ${
                            step <= passStrength 
                              ? passStrength >= 3 ? 'bg-success' : 'bg-warning'
                              : 'bg-[var(--border)]'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">Confirm New Password</span>
                  <Input 
                    type="password" 
                    value={confirmPass} 
                    onChange={e => setConfirmPass(e.target.value)}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={handleChangePassword} className="h-9 text-xs font-bold gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" /> Save Password Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TWO FACTOR APP AUTH MODULE */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor App Authentication (2FA)</CardTitle>
              <CardDescription>Force mobile verification prompts upon terminal authentication entry checks.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="flex justify-between items-start p-4 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl">
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-full shrink-0 ${twoFactorEnabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Time-based One-Time Passwords (TOTP)</h4>
                    <p className="text-[10px] text-text-mute leading-normal font-semibold mt-1">
                      Generate high-security session pins using Google Authenticator, Duo, or Microsoft Auth apps.
                    </p>
                  </div>
                </div>

                <Badge variant={twoFactorEnabled ? 'success' : 'neutral'} className="shrink-0">
                  {twoFactorEnabled ? 'SECURED' : 'INACTIVE'}
                </Badge>
              </div>

              {twoFactorEnabled ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-success/2 border border-success/15 rounded-xl text-[10px] text-text-sub font-semibold leading-normal">
                    ✓ Multi-Factor authenticator checks are globally active on account login routes.
                  </div>
                  <Button variant="outline" size="sm" onClick={disable2FA} className="border-error/20 hover:bg-error/5 text-error h-9 text-xs font-bold self-start">
                    Disable Authenticator Security
                  </Button>
                </div>
              ) : !show2faSetup ? (
                <Button variant="outline" size="sm" onClick={() => setShow2faSetup(true)} className="border-primary/20 text-primary hover:bg-primary/5 h-9 text-xs font-black self-start">
                  Set Up Authenticator App
                </Button>
              ) : (
                <div className="p-4 border border-[var(--border)] bg-[var(--surface-secondary)]/50 rounded-xl flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated QR Code */}
                    <div className="p-2 bg-white rounded-lg shrink-0 w-24 h-24 flex items-center justify-center">
                      <div className="border border-black w-20 h-20 flex flex-wrap p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-5 h-5 ${i % 3 === 0 || i % 5 === 1 ? 'bg-black' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <span className="text-[9px] text-primary font-black uppercase tracking-wider">MFA Secure Token Setup</span>
                      <h5 className="text-xs font-bold text-text-main">1. Scan QR Code</h5>
                      <p className="text-[10px] text-text-mute font-semibold leading-normal">
                        Open Google Authenticator on your smartphone and scan this visual token. Alternatively use manual secret key: <code className="bg-[var(--surface)] text-text-main px-1.5 py-0.5 rounded font-mono font-black text-[9px]">PATH PILOT 772X SAAS</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h5 className="text-xs font-bold text-text-main">2. Input Authenticator Code</h5>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. 102 992" 
                        value={totpCode}
                        onChange={e => setTotpCode(e.target.value)}
                        className="text-xs h-8 font-mono text-center max-w-[140px]"
                      />
                      <Button variant="primary" size="sm" onClick={submit2FAActivation} className="bg-primary text-black h-8 text-[10px] font-black uppercase px-4">Verify Token</Button>
                      <Button variant="outline" size="sm" onClick={() => setShow2faSetup(false)} className="h-8 text-[10px] font-bold">Cancel</Button>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

        </div>

        {/* Right Side: Active Sessions and Audit Log */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* TERMINAL SESSIONS LIST (DEVICE MANAGER) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-text-main flex items-center justify-between">
                <span>Active Terminal Connections</span>
                {sessions.length > 1 && (
                  <button onClick={handleRevokeAllOthers} className="text-[9px] text-error font-black hover:underline uppercase">Revoke Other Nodes</button>
                )}
              </CardTitle>
              <CardDescription>Audit terminal clients authenticated to write profile records.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 pt-2">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-3 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-xl flex justify-between items-start">
                  <div className="flex gap-3">
                    <Smartphone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-text-main flex items-center gap-1.5">
                        {sess.device}
                        {sess.current && <Badge variant="success" className="h-3 text-[7px] font-black px-1">CURRENT</Badge>}
                      </span>
                      <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">{sess.browser} • {sess.ip}</span>
                      <span className="text-[9px] text-text-mute font-bold flex items-center gap-1 mt-1.5"><MapPin className="w-3 h-3 text-primary" /> {sess.location}</span>
                    </div>
                  </div>

                  {!sess.current && (
                    <button 
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-text-mute hover:text-error p-1 hover:bg-error/5 rounded"
                      title="Terminate device link"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* VERIFY PROFILE COORDINATES */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-text-main">Verify Contacts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-2">
              {/* Phone verified */}
              <div className="flex justify-between items-center p-2.5 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Phone Coordinate</span>
                  <span className="text-[9.5px] text-text-mute font-semibold mt-0.5">+1 (555) 382-9902</span>
                </div>

                {phoneVerified ? (
                  <Badge variant="success" className="text-[8px] font-black">VERIFIED</Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={verifyPhoneCode} className="h-6 text-[8px] font-black uppercase">Verify SMS</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RECENT SECURITY LOGS */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-black uppercase text-text-main">Security Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-2">
              {securityLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-[var(--surface-secondary)]/30 border border-[var(--border)] rounded-xl flex justify-between items-center text-[10px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-sub flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'success' ? 'bg-success' : log.status === 'warn' ? 'bg-warning' : 'bg-error'
                      }`} />
                      {log.event}
                    </span>
                    <span className="text-text-mute font-semibold mt-0.5">{log.timestamp} • {log.ip}</span>
                  </div>
                  <Calendar className="w-3.5 h-3.5 text-text-mute" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
