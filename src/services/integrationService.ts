/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IntegrationConfig } from '../types/saas';

const INTEGRATIONS_KEY_PREFIX = 'pathpilot_integrations_';

const DEFAULT_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'intg-gcal',
    orgId: 'org-acme-001',
    provider: 'google_calendar',
    name: 'Google Calendar Sync',
    category: 'calendar',
    connected: true,
    connectedAt: '2026-01-20T10:00:00Z',
    accountEmail: 'alex.chen@acme.com',
    status: 'active',
  },
  {
    id: 'intg-gdrive',
    orgId: 'org-acme-001',
    provider: 'google_drive',
    name: 'Google Drive Vault Sync',
    category: 'storage',
    connected: true,
    connectedAt: '2026-01-22T14:30:00Z',
    accountEmail: 'alex.chen@acme.com',
    status: 'active',
  },
  {
    id: 'intg-github',
    orgId: 'org-acme-001',
    provider: 'github',
    name: 'GitHub Repositories & Portfolio',
    category: 'code',
    connected: true,
    connectedAt: '2026-02-01T09:15:00Z',
    accountEmail: 'alexchen-dev',
    status: 'active',
  },
  {
    id: 'intg-linkedin',
    orgId: 'org-acme-001',
    provider: 'linkedin',
    name: 'LinkedIn Profile Auto-Import',
    category: 'social',
    connected: true,
    connectedAt: '2026-02-05T11:00:00Z',
    accountEmail: 'in/alexchen-tech',
    status: 'active',
  },
  {
    id: 'intg-slack',
    orgId: 'org-acme-001',
    provider: 'slack',
    name: 'Slack Bot & Candidate Alerts',
    category: 'communication',
    connected: true,
    connectedAt: '2026-02-12T16:00:00Z',
    accountEmail: '#career-opportunities',
    status: 'active',
  },
  {
    id: 'intg-teams',
    orgId: 'org-acme-001',
    provider: 'microsoft_teams',
    name: 'Microsoft Teams Meeting Hub',
    category: 'communication',
    connected: false,
    status: 'disconnected',
  },
  {
    id: 'intg-zoom',
    orgId: 'org-acme-001',
    provider: 'zoom',
    name: 'Zoom Video Interview Simulator',
    category: 'communication',
    connected: true,
    connectedAt: '2026-02-28T08:00:00Z',
    accountEmail: 'alex.chen@acme.com',
    status: 'active',
  },
  {
    id: 'intg-openrouter',
    orgId: 'org-acme-001',
    provider: 'openrouter',
    name: 'OpenRouter Multi-LLM Gateway',
    category: 'ai',
    connected: true,
    connectedAt: '2026-03-01T12:00:00Z',
    accountEmail: 'openrouter-gateway-key',
    status: 'active',
    config: {
      defaultModel: 'anthropic/claude-3.5-sonnet',
      fallbackModel: 'google/gemini-2.5-flash',
    },
  },
];

export class IntegrationService {
  public static getIntegrationsForOrg(orgId: string): IntegrationConfig[] {
    try {
      const stored = localStorage.getItem(`${INTEGRATIONS_KEY_PREFIX}${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching integrations', e);
    }

    const defaultWithOrg = DEFAULT_INTEGRATIONS.map((i) => ({ ...i, orgId }));
    localStorage.setItem(`${INTEGRATIONS_KEY_PREFIX}${orgId}`, JSON.stringify(defaultWithOrg));
    return defaultWithOrg;
  }

  public static toggleIntegration(
    orgId: string,
    integrationId: string,
    connect: boolean,
    accountEmail?: string
  ): IntegrationConfig | undefined {
    const list = this.getIntegrationsForOrg(orgId);
    const item = list.find((i) => i.id === integrationId);
    if (!item) return undefined;

    item.connected = connect;
    item.status = connect ? 'active' : 'disconnected';
    if (connect) {
      item.connectedAt = new Date().toISOString();
      if (accountEmail) item.accountEmail = accountEmail;
    } else {
      item.accountEmail = undefined;
    }

    localStorage.setItem(`${INTEGRATIONS_KEY_PREFIX}${orgId}`, JSON.stringify(list));
    return item;
  }
}
