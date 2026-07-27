/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useToast } from '../ui/ToastContext';
import { AdminService } from '../../services/adminService';
import { BackgroundJobService } from '../../services/backgroundJobService';
import { EmailQueueService } from '../../services/emailQueueService';
import { OrganizationService } from '../../services/organizationService';
import { PLANS_CATALOG } from '../../services/subscriptionService';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';

import {
  ShieldAlert, Building2, Users, CreditCard, Key, Webhook,
  Cpu, Mail, Flag, FileText, CheckCircle2, RefreshCw, Activity,
  Search, TrendingUp, DollarSign, Server, Zap, ArrowUpRight, Lock
} from 'lucide-react';

export const AdminPlatformView: React.FC = () => {
  const { currentRole } = useOrganization();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(() => AdminService.getPlatformStats());
  const [logs, setLogs] = useState(() => AdminService.getSystemLogs());
  const [flags, setFlags] = useState(() => AdminService.getFeatureFlags());
  const [jobs, setJobs] = useState(() => BackgroundJobService.getAllJobs());
  const [emails, setEmails] = useState(() => EmailQueueService.getEmailQueue());
  const [allOrgs, setAllOrgs] = useState(() => OrganizationService.getAllOrganizations());

  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleFlag = (id: string, currentVal: boolean) => {
    AdminService.toggleFeatureFlag(id, !currentVal);
    setFlags(AdminService.getFeatureFlags());
    showToast({
      title: 'Feature Flag Updated',
      description: `Flag configuration saved across all clusters.`,
      type: 'success',
    });
  };

  const handleTriggerJob = (type: any, name: string) => {
    BackgroundJobService.createJob(name, type);
    setJobs(BackgroundJobService.getAllJobs());
    showToast({
      title: 'Worker Job Scheduled',
      description: `Dispatched background job: ${name}`,
      type: 'info',
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'orgs', label: 'Organizations & Tenants', icon: <Building2 className="w-4 h-4" /> },
    { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'jobs', label: 'Workers & Emails', icon: <Cpu className="w-4 h-4" /> },
    { id: 'flags', label: 'Flags & Audit Trail', icon: <Flag className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-12">
      {/* Enterprise Platform Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-sm gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-base text-text-main uppercase tracking-tight">
                Enterprise Admin & Platform Console
              </h2>
              <Badge variant="primary" className="uppercase font-mono text-[9px]">
                {currentRole.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-text-mute mt-0.5">
              Global telemetry, tenant isolation, role management, background job workers, and API webhooks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStats(AdminService.getPlatformStats());
              setJobs(BackgroundJobService.getAllJobs());
              setEmails(EmailQueueService.getEmailQueue());
              setLogs(AdminService.getSystemLogs());
              showToast({ title: 'Telemetry Refreshed', description: 'Pulled fresh cluster metrics.', type: 'info' });
            }}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Cluster
          </Button>
        </div>
      </div>

      {/* Global Stat Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Users</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% this month
          </div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Tenants</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">
            {stats.activeOrganizations.toLocaleString()}
          </div>
          <div className="text-[10px] text-text-mute font-mono mt-1">
            {allOrgs.length} Registered Local
          </div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <div className="font-display font-black text-xl text-success mt-2">
            ${stats.mrrDollars.toLocaleString()}
          </div>
          <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +22.8% YoY
          </div>
        </Card>

        <Card variant="outline" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-mute">
            <span className="text-[10px] uppercase font-bold tracking-wider">System Uptime</span>
            <Server className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-black text-xl text-text-main mt-2">
            {stats.uptimePercent}%
          </div>
          <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 text-success" /> All Systems Operational
          </div>
        </Card>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-[var(--border)] pb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: OVERVIEW & HEALTH */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card variant="outline" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Live API & AI Token Consumption
              </CardTitle>
              <CardDescription>Daily API requests and Gemini LLM token throughput.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)]">
                <div>
                  <div className="text-[10px] font-bold text-text-mute uppercase">Daily API Requests</div>
                  <div className="text-lg font-black text-text-main font-mono mt-1">
                    {stats.dailyApiRequests.toLocaleString()} req/day
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-mute uppercase">AI Tokens (Gemini 2.5)</div>
                  <div className="text-lg font-black text-primary font-mono mt-1">
                    {(stats.aiTokensUsedToday / 1000000).toFixed(2)}M Tokens
                  </div>
                </div>
              </div>

              {/* Terminal Log */}
              <div className="p-4 rounded-xl bg-black/90 font-mono text-[11px] text-emerald-400 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2 text-xs font-bold text-white">
                  <span>Cluster Health Diagnostic Terminal</span>
                  <span className="text-[10px] text-emerald-500">Latency: 18ms</span>
                </div>
                <p className="text-gray-300">[13:28:01] INF :: Cloud Run container autoscaled to 4 replicas (Port 3000)</p>
                <p className="text-emerald-400">[13:28:10] OK  :: Supabase PostgreSQL connection pool 100% healthy</p>
                <p className="text-emerald-400">[13:28:15] OK  :: Gemini 2.5 Flash API endpoint latency 240ms</p>
                <p className="text-gray-300">[13:28:30] INF :: Webhook queue processed 42 events with 0 errors</p>
              </div>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> Security & Audit Summary
              </CardTitle>
              <CardDescription>Recent high-priority security logs.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-main font-mono text-[11px]">{log.action}</span>
                    <Badge variant={log.level === 'security' ? 'danger' : 'info'} className="text-[8px] uppercase">
                      {log.level}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-text-mute mt-1 line-clamp-2">{log.details}</p>
                  <p className="text-[9px] text-text-mute font-mono mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: ORGANIZATIONS & TENANTS */}
      {activeTab === 'orgs' && (
        <Card variant="outline" className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Multi-Tenant Organizations
              </CardTitle>
              <CardDescription>Directory of all registered university, corporate, and team workspaces.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                  <th className="p-3">Organization</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Tier Plan</th>
                  <th className="p-3">Seats Used</th>
                  <th className="p-3">SSO Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs">
                {allOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                    <td className="p-3 font-semibold text-text-main">
                      <div>{org.name}</div>
                      <div className="text-[10px] text-text-mute font-mono">{org.industry || 'Tech'}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-primary">{org.domain || org.slug}</td>
                    <td className="p-3">
                      <Badge variant="primary" className="uppercase text-[9px]">
                        {org.planTier}
                      </Badge>
                    </td>
                    <td className="p-3 text-text-main font-mono">
                      {org.seatsUsed} / {org.seatsTotal}
                    </td>
                    <td className="p-3">
                      <Badge variant={org.ssoEnabled ? 'success' : 'outline'} className="text-[9px]">
                        {org.ssoEnabled ? 'SAML Active' : 'Password'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                        Manage Tenant
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <Card variant="outline" className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> User Management & Global Roles
              </CardTitle>
              <CardDescription>Search platform users and assign global RBAC roles.</CardDescription>
            </div>
            <div className="w-64">
              <Input
                placeholder="Search email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                  <th className="p-3">User</th>
                  <th className="p-3">Primary Role</th>
                  <th className="p-3">Active Workspace</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs">
                {[
                  { name: 'Alex Chen', email: 'alex.chen@acme.com', role: 'Super Admin', org: 'Acme Enterprise Labs', joined: '2026-01-15' },
                  { name: 'Sarah Jenkins', email: 'sarah.j@acme.com', role: 'Career Coach', org: 'Acme Enterprise Labs', joined: '2026-01-20' },
                  { name: 'Dr. Robert Davis', email: 'davis@stanford.edu', role: 'Mentor', org: 'Stanford Career Center', joined: '2026-02-02' },
                  { name: 'Marcus Vance', email: 'marcus.v@acme.com', role: 'Recruiter', org: 'Acme Enterprise Labs', joined: '2026-02-05' },
                  { name: 'Elena Rostova', email: 'elena.r@acme.com', role: 'Student', org: 'Acme Enterprise Labs', joined: '2026-02-18' },
                ]
                  .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((u, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                      <td className="p-3 font-medium text-text-main">
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-text-mute font-mono">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="primary" className="text-[9px]">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-text-mute text-[11px]">{u.org}</td>
                      <td className="p-3 text-text-mute font-mono text-[10px]">{u.joined}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                          Edit Permissions
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: BILLING & PLANS */}
      {activeTab === 'billing' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS_CATALOG.map((plan) => (
              <Card key={plan.id} variant="outline" className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-text-main">{plan.name}</h3>
                    {plan.badge && (
                      <Badge variant="primary" className="text-[8px]">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-black font-display text-text-main mt-3">
                    ${plan.priceMonthly} <span className="text-xs text-text-mute font-normal">/ mo</span>
                  </div>
                  <p className="text-xs text-text-mute mt-2">{plan.description}</p>

                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-text-sub">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="mt-5 w-full text-xs">
                  Configure Plan Tier
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WORKERS & EMAILS */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card variant="outline">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> Active Background Workers
                </CardTitle>
                <CardDescription>Scheduled jobs for resume indexing and analytics batching.</CardDescription>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleTriggerJob('ai_batch_analysis', 'Batch ATS Keyword Analysis')}
              >
                <Zap className="w-3.5 h-3.5 mr-1" /> Run Manual Worker
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {jobs.map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-main">{job.name}</span>
                    <Badge
                      variant={
                        job.status === 'completed'
                          ? 'success'
                          : job.status === 'running'
                          ? 'primary'
                          : 'outline'
                      }
                      className="text-[9px] uppercase"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="w-full bg-[var(--surface-secondary)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Transactional Email Queue
              </CardTitle>
              <CardDescription>Automated onboarding, interview reminders, and weekly digests.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {emails.map((email) => (
                <div key={email.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-main">{email.subject}</span>
                    <Badge variant={email.status === 'sent' ? 'success' : 'warning'} className="text-[8px] uppercase">
                      {email.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-text-mute font-mono mt-1">To: {email.toEmail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: FLAGS & AUDIT TRAIL */}
      {activeTab === 'flags' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Flag className="w-4 h-4 text-primary" /> Feature Flags & Beta Rollouts
              </CardTitle>
              <CardDescription>Control feature availability per role or cluster percentage.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {flags.map((flag) => (
                <div key={flag.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-xs text-text-main flex items-center gap-2">
                      {flag.name}
                      <Badge variant="outline" className="font-mono text-[8px]">
                        {flag.key}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-mute mt-1">{flag.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleFlag(flag.id, flag.enabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                      flag.enabled ? 'bg-primary' : 'bg-gray-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        flag.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> System Audit Trail
              </CardTitle>
              <CardDescription>Immutable system event logs for security and compliance.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]/20 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary text-[11px]">{log.action}</span>
                    <span className="text-[10px] text-text-mute font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-sub">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-text-mute font-mono mt-0.5">
                    <span>User: {log.userEmail || 'System'}</span>
                    <span>• IP: {log.ipAddress || '127.0.0.1'}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
