/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemLog, FeatureFlag, PlatformStats } from '../types/saas';

const LOGS_STORAGE_KEY = 'pathpilot_system_logs';
const FLAGS_STORAGE_KEY = 'pathpilot_feature_flags';

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    id: 'ff-1',
    key: 'openrouter_llm_gateway',
    name: 'OpenRouter Multi-LLM Routing',
    description: 'Allow switching between Gemini, Claude 3.5 Sonnet, and GPT-4o.',
    enabled: true,
    rolloutPercentage: 100,
    targetRoles: ['super_admin', 'platform_admin', 'org_owner', 'org_admin', 'premium_user'],
  },
  {
    id: 'ff-2',
    key: 'pwa_offline_sync',
    name: 'Progressive Web App Offline Syncing',
    description: 'Service Worker background queueing for offline resume edits.',
    enabled: true,
    rolloutPercentage: 100,
    targetRoles: ['super_admin', 'platform_admin', 'org_owner', 'org_admin', 'student', 'free_user'],
  },
  {
    id: 'ff-3',
    key: 'live_audio_interview_studio',
    name: 'Live Gemini Multimodal Audio Studio',
    description: 'Real-time WebSocket audio interview simulations with sub-50ms latency.',
    enabled: true,
    rolloutPercentage: 80,
    targetRoles: ['super_admin', 'platform_admin', 'org_owner', 'premium_user'],
  },
  {
    id: 'ff-4',
    key: 'webhooks_event_dispatcher',
    name: 'Realtime Webhook Event Dispatcher',
    description: 'Outbound HTTP POST payloads for Slack, Zapier, and custom HR endpoints.',
    enabled: true,
    rolloutPercentage: 100,
    targetRoles: ['super_admin', 'platform_admin', 'org_owner', 'org_admin'],
  },
];

const DEFAULT_LOGS: SystemLog[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    level: 'info',
    category: 'auth',
    action: 'USER_LOGIN_SUCCESS',
    userEmail: 'alex.chen@acme.com',
    orgId: 'org-acme-001',
    ipAddress: '192.168.1.104',
    details: 'OAuth 2.0 session granted via Google Workspace SAML',
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    level: 'info',
    category: 'ai',
    action: 'GEMINI_RESUME_ANALYSIS_COMPLETED',
    userEmail: 'alex.chen@acme.com',
    orgId: 'org-acme-001',
    details: 'Processed 3,420 tokens in 680ms (Gemini 2.5 Flash)',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    level: 'security',
    category: 'admin',
    action: 'API_KEY_CREATED',
    userEmail: 'alex.chen@acme.com',
    orgId: 'org-acme-001',
    details: 'Created Production Server Key with scopes [read:candidates, write:resumes]',
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    level: 'warn',
    category: 'api',
    action: 'RATE_LIMIT_WARNING_80_PERCENT',
    userEmail: 'sarah.j@acme.com',
    orgId: 'org-acme-001',
    details: 'API requests reached 80% of daily tier quota (800 / 1000)',
  },
];

export class AdminService {
  public static getPlatformStats(): PlatformStats {
    return {
      totalUsers: 14280,
      activeOrganizations: 312,
      mrrDollars: 48950,
      dailyApiRequests: 184500,
      aiTokensUsedToday: 14280000,
      activeSubscriptions: 2840,
      systemHealthPercent: 99.98,
      uptimePercent: 99.99,
    };
  }

  public static getSystemLogs(): SystemLog[] {
    try {
      const stored = localStorage.getItem(LOGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading logs', e);
    }
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }

  public static logEvent(
    level: SystemLog['level'],
    category: SystemLog['category'],
    action: string,
    details: string,
    userEmail?: string,
    orgId?: string
  ): SystemLog {
    const logs = this.getSystemLogs();
    const newLog: SystemLog = {
      id: `log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      details,
      userEmail,
      orgId,
      ipAddress: '127.0.0.1',
    };

    logs.unshift(newLog);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
    return newLog;
  }

  public static getFeatureFlags(): FeatureFlag[] {
    try {
      const stored = localStorage.getItem(FLAGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading feature flags', e);
    }
    localStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
    return DEFAULT_FLAGS;
  }

  public static toggleFeatureFlag(flagId: string, enabled: boolean): FeatureFlag | undefined {
    const flags = this.getFeatureFlags();
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return undefined;

    flag.enabled = enabled;
    localStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(flags));
    this.logEvent('info', 'admin', 'FEATURE_FLAG_TOGGLED', `Flag ${flag.key} set to ${enabled}`);
    return flag;
  }
}
