/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiKey } from '../types/saas';

const API_KEYS_KEY_PREFIX = 'pathpilot_apikeys_';

export class ApiKeyService {
  public static getApiKeysForOrg(orgId: string): ApiKey[] {
    try {
      const stored = localStorage.getItem(`${API_KEYS_KEY_PREFIX}${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading API keys', e);
    }

    const defaultKeys: ApiKey[] = [
      {
        id: 'key-001',
        orgId,
        uid: 'demo-user-123',
        name: 'Production Server Integration Key',
        keyPrefix: 'pp_live_7a',
        keySecret: 'pp_live_7a9f82...c014b',
        scopes: ['read:candidates', 'write:resumes', 'read:roadmaps', 'trigger:interviews'],
        createdAt: '2026-02-10T12:00:00Z',
        lastUsedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'active',
      },
      {
        id: 'key-002',
        orgId,
        uid: 'demo-user-123',
        name: 'Staging / QA Testing Key',
        keyPrefix: 'pp_test_3b',
        keySecret: 'pp_test_3b11e2...f901a',
        scopes: ['read:candidates', 'read:roadmaps'],
        createdAt: '2026-03-01T09:30:00Z',
        lastUsedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        status: 'active',
      },
    ];

    localStorage.setItem(`${API_KEYS_KEY_PREFIX}${orgId}`, JSON.stringify(defaultKeys));
    return defaultKeys;
  }

  public static createApiKey(
    orgId: string,
    name: string,
    scopes: string[] = ['read:candidates', 'write:resumes']
  ): { key: ApiKey; fullSecret: string } {
    const keys = this.getApiKeysForOrg(orgId);
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullSecret = `pp_live_${randomHex}`;
    const prefix = fullSecret.substring(0, 10);
    const hidden = `${prefix}...${fullSecret.substring(fullSecret.length - 4)}`;

    const newKey: ApiKey = {
      id: `key-${Date.now().toString(36)}`,
      orgId,
      uid: 'demo-user-123',
      name,
      keyPrefix: prefix,
      keySecret: hidden,
      scopes,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    keys.push(newKey);
    localStorage.setItem(`${API_KEYS_KEY_PREFIX}${orgId}`, JSON.stringify(keys));
    return { key: newKey, fullSecret };
  }

  public static revokeApiKey(orgId: string, keyId: string): boolean {
    const keys = this.getApiKeysForOrg(orgId);
    const key = keys.find((k) => k.id === keyId);
    if (!key) return false;

    key.status = 'revoked';
    localStorage.setItem(`${API_KEYS_KEY_PREFIX}${orgId}`, JSON.stringify(keys));
    return true;
  }
}
