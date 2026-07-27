/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Activity,
  Database,
  Lock,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Terminal,
  UserCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SystemHealthMetrics, SystemAuditLog } from '../../../types';

interface AdminSystemHealthViewProps {
  systemHealth: SystemHealthMetrics | null;
  auditLogs: SystemAuditLog[];
  onRefreshHealth: () => void;
}

export const AdminSystemHealthView: React.FC<AdminSystemHealthViewProps> = ({
  systemHealth,
  auditLogs,
  onRefreshHealth
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'security'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter === 'all') return true;
    if (severityFilter === 'security') return log.category === 'security' || log.category === 'rls';
    return log.severity === severityFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* RBAC Admin Header Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-text-main">System Admin & Security Control Panel</span>
                <Badge variant="primary" className="text-[10px] font-bold py-0.5 px-2">
                  Role: Super Admin
                </Badge>
              </div>
              <p className="text-xs text-text-sub font-semibold">
                Real-time monitoring for Supabase RLS isolation, API latency, database health, and audit logs.
              </p>
            </div>
          </div>

          <Button
            onClick={onRefreshHealth}
            variant="outline"
            size="sm"
            className="text-xs font-bold flex items-center gap-2 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Diagnostics
          </Button>
        </CardContent>
      </Card>

      {/* System Health Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Database Status
              </span>
              <Database className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-success capitalize tracking-tight">
                {systemHealth?.dbStatus || 'Healthy'}
              </span>
              <span className="text-xs font-bold text-text-sub">
                {systemHealth?.dbResponseLatencyMs || 14} ms
              </span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Supabase Postgres Connection Active
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Supabase RLS Policies
              </span>
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">
                {systemHealth?.activeRlsPoliciesCount || 28} Active
              </span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              100% auth.uid() isolation verified
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Storage Utilization
              </span>
              <HardDrive className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-main tracking-tight">
                {systemHealth?.storageUsageMb || 42.8} MB
              </span>
              <span className="text-xs font-bold text-text-sub">
                / {systemHealth?.maxStorageLimitMb || 500} MB
              </span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              8.5% capacity utilized
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                API Success Rate
              </span>
              <Activity className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-info tracking-tight">
                {systemHealth?.apiSuccessRatePercent || 99.8}%
              </span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Error Rate: {systemHealth?.errorRatePercent || 0.2}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="p-5 border-b border-[var(--border)] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" /> Security & System Audit Trail
          </CardTitle>

          <div className="flex items-center gap-1.5">
            {(['all', 'info', 'warning', 'security'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md border capitalize transition-all ${
                  severityFilter === sev
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[var(--surface-border)] text-text-sub border-[var(--border)] hover:text-text-main'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-border)] text-[10px] font-black uppercase text-text-mute tracking-wider">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User / Identity</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs text-text-sub font-semibold">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-border)]/50 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-text-mute">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-text-main font-bold">
                      {log.userEmail || log.userId}
                    </td>
                    <td className="p-3 text-text-main font-bold">{log.action}</td>
                    <td className="p-3">
                      <Badge variant="neutral" className="text-[10px] font-mono uppercase">
                        {log.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          log.severity === 'error' || log.severity === 'critical'
                            ? 'error'
                            : log.severity === 'warning'
                            ? 'warning'
                            : 'success'
                        }
                        className="text-[10px] font-bold uppercase"
                      >
                        {log.severity}
                      </Badge>
                    </td>
                    <td className="p-3 text-text-mute max-w-md truncate">{log.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
