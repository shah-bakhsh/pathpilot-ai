/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { History, Clock, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';

export const ResumeHistoryView: React.FC = () => {
  const { historyLogs, activeResume } = useResume();

  return (
    <div className="flex flex-col gap-5 w-full animate-fade-in max-w-4xl mx-auto">
      <Card className="bg-[var(--surface)] border-[var(--border)] p-6">
        <CardHeader className="p-0 pb-4 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Persistent Activity Log
            </CardTitle>
            <CardDescription className="text-xs">
              Complete audit trail of all actions performed on "{activeResume?.title || 'Resumes'}".
            </CardDescription>
          </div>
          <Badge variant="primary" className="text-xs font-black">
            {historyLogs.length} Events
          </Badge>
        </CardHeader>

        <CardContent className="p-0 pt-4">
          {historyLogs.length === 0 ? (
            <p className="text-xs text-text-sub text-center py-8">
              No activity logs recorded yet. Edits, uploads, and analyses will appear here.
            </p>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
              {historyLogs.map(log => (
                <div key={log.id} className="relative flex items-start justify-between gap-4 text-xs">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-[var(--surface)]" />
                  
                  <div>
                    <h4 className="font-bold text-text-main text-xs">{log.description}</h4>
                    <span className="text-[10px] text-text-mute uppercase tracking-wider font-semibold">
                      Action: {log.actionType}
                    </span>
                  </div>

                  <span className="text-[10.5px] font-mono text-text-mute shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
