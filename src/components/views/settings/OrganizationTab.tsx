/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../contexts/OrganizationContext';
import { useToast } from '../../ui/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Building2, Users, ShieldCheck, Plus, Trash2, Mail, ExternalLink, Globe, Key, UserCheck } from 'lucide-react';
import { UserRole } from '../../../types/saas';

export const OrganizationTab: React.FC = () => {
  const { currentOrg, userOrgs, members, subscription, currentRole, switchOrganization, createOrganization, inviteMember, removeMember, updateMemberRole } = useOrganization();
  const { showToast } = useToast();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('student');
  const [inviteDept, setInviteDept] = useState('');

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('Technology & Software');
  const [newOrgDomain, setNewOrgDomain] = useState('');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteName || inviteEmail.split('@')[0], inviteRole, inviteDept);
    showToast({
      title: 'Invitation Dispatched',
      description: `Sent invitation link to ${inviteEmail} as ${inviteRole.replace('_', ' ')}.`,
      type: 'success',
    });
    setIsInviteOpen(false);
    setInviteEmail('');
    setInviteName('');
  };

  const handleCreateOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;
    const newOrg = createOrganization(newOrgName, newOrgIndustry, newOrgDomain, 'starter');
    showToast({
      title: 'Organization Created',
      description: `Switched to workspace: ${newOrg.name}`,
      type: 'success',
    });
    setIsCreateOrgOpen(false);
    setNewOrgName('');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Active Organization Banner */}
      <Card variant="outline" className="border-primary/30 bg-primary/5">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-text-main">{currentOrg.name}</h3>
                <Badge variant="primary" className="uppercase font-mono text-[9px]">
                  {currentOrg.planTier}
                </Badge>
                {currentOrg.verified && (
                  <Badge variant="success" className="text-[9px]">
                    Verified Org
                  </Badge>
                )}
              </div>
              <p className="text-xs text-text-mute mt-0.5">
                Domain: <span className="font-mono">{currentOrg.domain || currentOrg.slug}</span> • Seats Used:{' '}
                <span className="font-bold text-text-main">
                  {currentOrg.seatsUsed} / {currentOrg.seatsTotal}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOrgOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> New Workspace
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsInviteOpen(true)}>
              <Mail className="w-3.5 h-3.5 mr-1" /> Invite Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Switch Workspaces Selector */}
      <Card variant="outline">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Multi-Tenancy Workspaces
          </CardTitle>
          <CardDescription>Switch between your personal, university, or corporate team workspaces.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userOrgs.map((org) => {
            const isCurrent = org.id === currentOrg.id;
            return (
              <div
                key={org.id}
                onClick={() => !isCurrent && switchOrganization(org.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isCurrent
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/20'
                    : 'border-[var(--border)] hover:border-primary/50 bg-[var(--surface-secondary)]/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-text-main">{org.name}</h4>
                    <p className="text-[10px] text-text-mute font-mono">{org.industry || 'Organization'}</p>
                  </div>
                  {isCurrent && (
                    <Badge variant="primary" className="text-[9px]">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-mute border-t border-[var(--border)] pt-2">
                  <span>{org.seatsUsed} Seats</span>
                  <span className="capitalize font-semibold">{org.planTier} Plan</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Team Members & Role Hierarchy Table */}
      <Card variant="outline">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Workspace Members & Roles
            </CardTitle>
            <CardDescription>Manage user role hierarchy, departments, and access permissions.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Invite
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]/50 text-[10px] uppercase font-bold text-text-mute">
                <th className="p-3">Member</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {members.map((mem) => (
                <tr key={mem.id} className="hover:bg-[var(--surface-secondary)]/30 transition-colors">
                  <td className="p-3 font-medium text-text-main">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                        {mem.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{mem.name}</div>
                        <div className="text-[10px] text-text-mute font-mono">{mem.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={mem.role}
                      onChange={(e) => updateMemberRole(mem.id, e.target.value as UserRole)}
                      className="text-[10px] font-semibold bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-text-main"
                    >
                      <option value="org_owner">Org Owner</option>
                      <option value="org_admin">Org Admin</option>
                      <option value="career_coach">Career Coach</option>
                      <option value="mentor">Mentor</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="student">Student</option>
                    </select>
                  </td>
                  <td className="p-3 text-text-mute text-[11px]">{mem.department || 'General'}</td>
                  <td className="p-3">
                    <Badge
                      variant={mem.status === 'active' ? 'success' : 'warning'}
                      className="text-[9px] capitalize"
                    >
                      {mem.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {mem.role !== 'org_owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeMember(mem.id);
                          showToast({ title: 'Member Removed', description: `${mem.name} removed from workspace.`, type: 'info' });
                        }}
                        className="text-danger hover:bg-danger/10 h-7 px-2 text-[10px]"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member or Student">
        <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="colleague@university.edu"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Input
            label="Full Name"
            placeholder="Sarah Jenkins"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-main">Assign Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-text-main"
            >
              <option value="student">Student / Job Seeker</option>
              <option value="career_coach">Career Coach</option>
              <option value="mentor">Mentor</option>
              <option value="recruiter">Recruiter</option>
              <option value="org_admin">Organization Admin</option>
            </select>
          </div>
          <Input
            label="Department / Cohort (Optional)"
            placeholder="Computer Science Spring 2026"
            value={inviteDept}
            onChange={(e) => setInviteDept(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Send Invite Link
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Org Modal */}
      <Modal isOpen={isCreateOrgOpen} onClose={() => setIsCreateOrgOpen(false)} title="Create New Enterprise Workspace">
        <form onSubmit={handleCreateOrgSubmit} className="flex flex-col gap-4">
          <Input
            label="Workspace Name"
            required
            placeholder="MIT AI Talent Lab"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
          />
          <Input
            label="Industry / Domain"
            placeholder="Higher Education / AI Research"
            value={newOrgIndustry}
            onChange={(e) => setNewOrgIndustry(e.target.value)}
          />
          <Input
            label="Corporate Domain (Optional)"
            placeholder="mit.edu"
            value={newOrgDomain}
            onChange={(e) => setNewOrgDomain(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsCreateOrgOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Provision Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
