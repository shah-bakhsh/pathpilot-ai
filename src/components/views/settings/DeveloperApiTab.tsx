/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../../contexts/OrganizationContext';
import { useToast } from '../../ui/ToastContext';
import { ApiKeyService } from '../../../services/apiKeyService';
import { WebhookService, SUPPORTED_WEBHOOK_EVENTS } from '../../../services/webhookService';
import { ApiKey, WebhookSubscription, WebhookDeliveryLog } from '../../../types/saas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Key, Webhook, Plus, Copy, Check, Trash2, Send, Terminal, Shield, RefreshCw } from 'lucide-react';

export const DeveloperApiTab: React.FC = () => {
  const { currentOrg } = useOrganization();
  const { showToast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>([]);

  const [isNewKeyOpen, setIsNewKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const [isNewWebhookOpen, setIsNewWebhookOpen] = useState(false);
  const [whName, setWhName] = useState('');
  const [whUrl, setWhUrl] = useState('');
  const [whEvents, setWhEvents] = useState<string[]>(['application.status_changed']);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const reload = () => {
    setApiKeys(ApiKeyService.getApiKeysForOrg(currentOrg.id));
    setWebhooks(WebhookService.getWebhooksForOrg(currentOrg.id));
    setLogs(WebhookService.getDeliveryLogs(currentOrg.id));
  };

  useEffect(() => {
    reload();
  }, [currentOrg.id]);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const { key, fullSecret } = ApiKeyService.createApiKey(currentOrg.id, newKeyName);
    setGeneratedSecret(fullSecret);
    setNewKeyName('');
    reload();
    showToast({ title: 'API Key Generated', description: 'Copy key secret immediately.', type: 'success' });
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName || !whUrl) return;
    WebhookService.createWebhook(currentOrg.id, whName, whUrl, whEvents);
    setIsNewWebhookOpen(false);
    setWhName('');
    setWhUrl('');
    reload();
    showToast({ title: 'Webhook Endpoint Registered', description: `Subscribed to ${whEvents.length} events.`, type: 'success' });
  };

  const handleTestWebhook = () => {
    const log = WebhookService.triggerSimulatedWebhook(currentOrg.id, 'interview.completed', {
      interviewId: `int-${Math.floor(Math.random() * 8999) + 1000}`,
      candidate: 'Alex Chen',
      score: 95,
      timestamp: new Date().toISOString(),
    });
    reload();
    showToast({
      title: 'Test Webhook Dispatched',
      description: `Payload sent successfully with HTTP ${log.statusCode}.`,
      type: 'success',
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* REST API Keys Card */}
      <Card variant="outline">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Public REST API Keys
            </CardTitle>
            <CardDescription>
              Programmatically query candidates, resume tailoring engines, and career roadmaps.
            </CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={() => setIsNewKeyOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Generate Secret Key
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                <th className="p-3">Key Name</th>
                <th className="p-3">Key Token</th>
                <th className="p-3">Scopes</th>
                <th className="p-3">Last Used</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                  <td className="p-3 font-semibold text-text-main">{key.name}</td>
                  <td className="p-3 font-mono text-[11px] text-primary">{key.keySecret}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.slice(0, 2).map((s) => (
                        <Badge key={s} variant="outline" className="text-[8px] font-mono">
                          {s}
                        </Badge>
                      ))}
                      {key.scopes.length > 2 && (
                        <Badge variant="outline" className="text-[8px] font-mono">
                          +{key.scopes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-[10px] text-text-mute">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleTimeString() : 'Never'}
                  </td>
                  <td className="p-3">
                    <Badge variant={key.status === 'active' ? 'success' : 'danger'} className="text-[9px] uppercase">
                      {key.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {key.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          ApiKeyService.revokeApiKey(currentOrg.id, key.id);
                          reload();
                          showToast({ title: 'Key Revoked', description: 'Secret key invalidated.', type: 'warning' });
                        }}
                        className="text-danger hover:bg-danger/10 h-7 px-2 text-[10px]"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Webhook Endpoints & Trigger Panel */}
      <Card variant="outline">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Webhook className="w-4 h-4 text-primary" /> Outbound Webhook Subscriptions
            </CardTitle>
            <CardDescription>
              Receive HTTP POST notifications when candidate milestones, resumes, or interviews change.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTestWebhook}>
              <Send className="w-3.5 h-3.5 mr-1" /> Dispatch Test Event
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsNewWebhookOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Endpoint
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-text-main">{wh.name}</h4>
                    <Badge variant="success" className="text-[9px] uppercase">
                      {wh.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-primary font-mono mt-1 truncate">{wh.url}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {wh.events.map((ev) => (
                    <Badge key={ev} variant="primary" className="text-[8px]">
                      {ev}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-mute border-t border-[var(--border)] pt-2">
                  <span>Secret: <span className="font-mono">{wh.secret.substring(0, 10)}...</span></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      WebhookService.deleteWebhook(currentOrg.id, wh.id);
                      reload();
                      showToast({ title: 'Endpoint Deleted', description: 'Webhook subscription removed.', type: 'info' });
                    }}
                    className="text-danger h-5 px-1 text-[10px]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Logs Log Terminal */}
          <div className="mt-2 border border-[var(--border)] rounded-xl bg-black/90 p-4 font-mono text-[11px] text-emerald-400 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" /> Webhook Event Dispatcher Log
              </span>
              <span className="text-[10px] text-emerald-500">{logs.length} Recent Payload Dispatches</span>
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-emerald-900/40">
              {logs.map((log) => (
                <div key={log.id} className="py-2 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-emerald-300 font-bold">[{log.event}]</span>{' '}
                    <span className="text-gray-300">HTTP {log.statusCode}</span> •{' '}
                    <span className="text-gray-400">{log.durationMs}ms</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Secret Key Modal */}
      <Modal
        isOpen={isNewKeyOpen}
        onClose={() => {
          setIsNewKeyOpen(false);
          setGeneratedSecret(null);
        }}
        title="Generate REST API Key"
      >
        {generatedSecret ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success text-xs">
              <p className="font-bold">Key successfully created!</p>
              <p className="mt-1 text-[11px]">Copy this secret token now. It will not be shown again.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input value={generatedSecret} readOnly className="font-mono text-xs flex-1" />
              <Button variant="default" onClick={() => handleCopy(generatedSecret, 'gen')}>
                {copiedKeyId === 'gen' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewKeyOpen(false);
                setGeneratedSecret(null);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateKey} className="flex flex-col gap-4">
            <Input
              label="Key Description"
              required
              placeholder="Backend Production Microservice"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsNewKeyOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit">
                Generate Key
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* New Webhook Modal */}
      <Modal isOpen={isNewWebhookOpen} onClose={() => setIsNewWebhookOpen(false)} title="Add Webhook Endpoint">
        <form onSubmit={handleCreateWebhook} className="flex flex-col gap-4">
          <Input
            label="Endpoint Description"
            required
            placeholder="Slack Candidate Bot / Zapier Receiver"
            value={whName}
            onChange={(e) => setWhName(e.target.value)}
          />
          <Input
            label="Target Payload URL"
            required
            type="url"
            placeholder="https://api.yourcompany.com/webhooks/pathpilot"
            value={whUrl}
            onChange={(e) => setWhUrl(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-main">Select Events</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg bg-[var(--surface)]">
              {SUPPORTED_WEBHOOK_EVENTS.map((ev) => (
                <label key={ev} className="flex items-center gap-2 text-xs text-text-main cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whEvents.includes(ev)}
                    onChange={(e) => {
                      if (e.target.checked) setWhEvents([...whEvents, ev]);
                      else setWhEvents(whEvents.filter((x) => x !== ev));
                    }}
                    className="rounded border-gray-300 text-primary"
                  />
                  <span>{ev}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsNewWebhookOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Register Webhook
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
