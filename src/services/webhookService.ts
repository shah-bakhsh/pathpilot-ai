/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebhookSubscription, WebhookDeliveryLog } from '../types/saas';

const WEBHOOKS_KEY_PREFIX = 'pathpilot_webhooks_';
const WEBHOOK_LOGS_PREFIX = 'pathpilot_webhook_logs_';

export const SUPPORTED_WEBHOOK_EVENTS = [
  'user.created',
  'user.onboarding_completed',
  'resume.analyzed',
  'resume.tailored',
  'application.created',
  'application.status_changed',
  'interview.completed',
  'interview.feedback_generated',
  'subscription.updated',
];

export class WebhookService {
  public static getWebhooksForOrg(orgId: string): WebhookSubscription[] {
    try {
      const stored = localStorage.getItem(`${WEBHOOKS_KEY_PREFIX}${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching webhooks', e);
    }

    const defaultWebhooks: WebhookSubscription[] = [
      {
        id: 'wh-001',
        orgId,
        name: 'Slack Candidate Alerts Endpoint',
        url: 'https://hooks.slack.com/services/T00/B00/XXXXXX',
        secret: 'whsec_99a8b1c2d3e4f5a6b7c8d9e0f',
        events: ['application.status_changed', 'interview.completed'],
        status: 'active',
        createdAt: '2026-02-01T10:00:00Z',
        lastDeliveryAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        failureCount: 0,
      },
    ];

    localStorage.setItem(`${WEBHOOKS_KEY_PREFIX}${orgId}`, JSON.stringify(defaultWebhooks));
    return defaultWebhooks;
  }

  public static createWebhook(
    orgId: string,
    name: string,
    url: string,
    events: string[]
  ): WebhookSubscription {
    const webhooks = this.getWebhooksForOrg(orgId);
    const secretHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newWebhook: WebhookSubscription = {
      id: `wh-${Date.now().toString(36)}`,
      orgId,
      name,
      url,
      secret: `whsec_${secretHex}`,
      events,
      status: 'active',
      createdAt: new Date().toISOString(),
      failureCount: 0,
    };

    webhooks.push(newWebhook);
    localStorage.setItem(`${WEBHOOKS_KEY_PREFIX}${orgId}`, JSON.stringify(webhooks));
    return newWebhook;
  }

  public static deleteWebhook(orgId: string, webhookId: string): boolean {
    let webhooks = this.getWebhooksForOrg(orgId);
    const initial = webhooks.length;
    webhooks = webhooks.filter((w) => w.id !== webhookId);
    if (webhooks.length === initial) return false;

    localStorage.setItem(`${WEBHOOKS_KEY_PREFIX}${orgId}`, JSON.stringify(webhooks));
    return true;
  }

  public static getDeliveryLogs(orgId: string): WebhookDeliveryLog[] {
    try {
      const stored = localStorage.getItem(`${WEBHOOK_LOGS_PREFIX}${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading webhook logs', e);
    }

    const defaultLogs: WebhookDeliveryLog[] = [
      {
        id: 'log-001',
        webhookId: 'wh-001',
        event: 'interview.completed',
        statusCode: 200,
        payload: {
          interviewId: 'int-8821',
          candidateName: 'Alex Chen',
          scorePercent: 94,
          role: 'Senior Staff Frontend Architect',
        },
        responseBody: '{"ok": true}',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        durationMs: 142,
        success: true,
      },
      {
        id: 'log-002',
        webhookId: 'wh-001',
        event: 'application.status_changed',
        statusCode: 200,
        payload: {
          applicationId: 'app-302',
          company: 'Google',
          newStatus: 'interviewing',
        },
        responseBody: '{"ok": true}',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        durationMs: 88,
        success: true,
      },
    ];

    localStorage.setItem(`${WEBHOOK_LOGS_PREFIX}${orgId}`, JSON.stringify(defaultLogs));
    return defaultLogs;
  }

  public static triggerSimulatedWebhook(orgId: string, event: string, payload: Record<string, any>): WebhookDeliveryLog {
    const webhooks = this.getWebhooksForOrg(orgId);
    const targetWh = webhooks.find((w) => w.events.includes(event)) || webhooks[0];

    const log: WebhookDeliveryLog = {
      id: `log-${Date.now().toString(36)}`,
      webhookId: targetWh ? targetWh.id : 'wh-test',
      event,
      statusCode: 200,
      payload,
      responseBody: '{"status": "delivered", "signature_verified": true}',
      timestamp: new Date().toISOString(),
      durationMs: Math.floor(Math.random() * 100) + 40,
      success: true,
    };

    const logs = this.getDeliveryLogs(orgId);
    logs.unshift(log);
    localStorage.setItem(`${WEBHOOK_LOGS_PREFIX}${orgId}`, JSON.stringify(logs.slice(0, 50)));

    if (targetWh) {
      targetWh.lastDeliveryAt = log.timestamp;
      localStorage.setItem(`${WEBHOOKS_KEY_PREFIX}${orgId}`, JSON.stringify(webhooks));
    }

    return log;
  }
}
