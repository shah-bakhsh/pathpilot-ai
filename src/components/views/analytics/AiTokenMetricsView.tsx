/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Cpu,
  Zap,
  DollarSign,
  Clock,
  Layers,
  PieChart as PieIcon,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AiTokenMetricsView: React.FC = () => {
  const moduleUsageData = [
    { module: 'Resume Builder', tokens: 42000, percentage: 32, calls: 18 },
    { module: 'AI Coach', tokens: 38000, percentage: 29, calls: 24 },
    { module: 'Interview Platform', tokens: 26000, percentage: 20, calls: 12 },
    { module: 'Documents Workspace', tokens: 15000, percentage: 11, calls: 10 },
    { module: 'Learning Engine', tokens: 10000, percentage: 8, calls: 8 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Top Token Metrics KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Total Gemini Tokens Used
              </span>
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary tracking-tight">131,000</span>
              <span className="text-xs font-bold text-success">Tokens</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              72 API requests executed
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Estimated Prompt Cost (USD)
              </span>
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-text-main tracking-tight">$0.026</span>
              <span className="text-xs font-bold text-success">Ultra Efficient</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Optimized via Gemini 3.5 Flash
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Average API Latency
              </span>
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-accent tracking-tight">1,120 ms</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              Sub-second response streaming
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-mute font-black uppercase tracking-wider">
                Model Allocation
              </span>
              <Activity className="w-5 h-5 text-info" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-info tracking-tight">Gemini 3.5 Flash</span>
            </div>
            <span className="text-[10px] text-text-sub font-semibold mt-2">
              100% server-side proxy security
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Module Token Consumption Chart & Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Consumption Chart */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Token Consumption by Workspace Module
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="module" stroke="var(--text-mute)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-mute)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="tokens" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Tokens Used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Module Breakdown List */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="p-5 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" /> API Request Volume Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            {moduleUsageData.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-main">{item.module}</span>
                  <span className="text-text-mute">
                    {item.calls} Calls • {item.tokens.toLocaleString()} tokens ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
