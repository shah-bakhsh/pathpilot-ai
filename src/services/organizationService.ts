/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Organization, OrganizationMember, UserRole } from '../types/saas';

const ORGS_STORAGE_KEY = 'pathpilot_organizations_db';
const ACTIVE_ORG_KEY = 'pathpilot_active_org_id';

const DEFAULT_ORGS: Organization[] = [
  {
    id: 'org-acme-001',
    name: 'Acme Enterprise Labs',
    slug: 'acme-labs',
    domain: 'acme.com',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    planTier: 'enterprise',
    seatsTotal: 50,
    seatsUsed: 12,
    ownerUid: 'demo-user-123',
    createdAt: '2026-01-15T08:00:00Z',
    ssoEnabled: true,
    ssoProvider: 'Google Workspace SAML',
    customDomain: 'careers.acme.com',
    industry: 'Enterprise Software & Cloud',
    verified: true,
  },
  {
    id: 'org-stanford-002',
    name: 'Stanford Career Center',
    slug: 'stanford-careers',
    domain: 'stanford.edu',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80',
    planTier: 'pro',
    seatsTotal: 20,
    seatsUsed: 8,
    ownerUid: 'demo-user-123',
    createdAt: '2026-02-01T10:30:00Z',
    ssoEnabled: true,
    ssoProvider: 'Okta SSO',
    customDomain: 'pathpilot.stanford.edu',
    industry: 'Higher Education & Career Mobility',
    verified: true,
  },
  {
    id: 'org-personal-003',
    name: 'Personal Workspace',
    slug: 'personal-space',
    planTier: 'free',
    seatsTotal: 1,
    seatsUsed: 1,
    ownerUid: 'demo-user-123',
    createdAt: '2026-03-10T14:00:00Z',
    ssoEnabled: false,
    industry: 'Individual Pro',
    verified: true,
  },
];

const DEFAULT_MEMBERS: Record<string, OrganizationMember[]> = {
  'org-acme-001': [
    {
      id: 'mem-1',
      orgId: 'org-acme-001',
      uid: 'demo-user-123',
      email: 'alex.chen@acme.com',
      name: 'Alex Chen',
      role: 'org_owner',
      department: 'Engineering & Talent',
      joinedAt: '2026-01-15T08:00:00Z',
      status: 'active',
    },
    {
      id: 'mem-2',
      orgId: 'org-acme-001',
      uid: 'u-sarah-jenkins',
      email: 'sarah.j@acme.com',
      name: 'Sarah Jenkins',
      role: 'career_coach',
      department: 'University Relations',
      joinedAt: '2026-01-20T11:00:00Z',
      status: 'active',
    },
    {
      id: 'mem-3',
      orgId: 'org-acme-001',
      uid: 'u-marcus-v',
      email: 'marcus.v@acme.com',
      name: 'Marcus Vance',
      role: 'recruiter',
      department: 'Technical Recruiting',
      joinedAt: '2026-02-05T09:15:00Z',
      status: 'active',
    },
    {
      id: 'mem-4',
      orgId: 'org-acme-001',
      uid: 'u-elena-r',
      email: 'elena.r@acme.com',
      name: 'Elena Rostova',
      role: 'student',
      department: 'Software Internship Cohort',
      joinedAt: '2026-02-18T14:30:00Z',
      status: 'active',
    },
  ],
  'org-stanford-002': [
    {
      id: 'mem-5',
      orgId: 'org-stanford-002',
      uid: 'demo-user-123',
      email: 'alex.chen@stanford.edu',
      name: 'Alex Chen',
      role: 'org_admin',
      department: 'Computer Science Department',
      joinedAt: '2026-02-01T10:30:00Z',
      status: 'active',
    },
    {
      id: 'mem-6',
      orgId: 'org-stanford-002',
      uid: 'u-prof-davis',
      email: 'davis@stanford.edu',
      name: 'Dr. Robert Davis',
      role: 'mentor',
      department: 'AI & Systems Faculty',
      joinedAt: '2026-02-02T12:00:00Z',
      status: 'active',
    },
  ],
  'org-personal-003': [
    {
      id: 'mem-7',
      orgId: 'org-personal-003',
      uid: 'demo-user-123',
      email: 'alex.chen@gmail.com',
      name: 'Alex Chen',
      role: 'org_owner',
      department: 'Personal',
      joinedAt: '2026-03-10T14:00:00Z',
      status: 'active',
    },
  ],
};

export class OrganizationService {
  private static getOrgsFromStorage(): Organization[] {
    try {
      const stored = localStorage.getItem(ORGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading orgs from storage', e);
    }
    localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(DEFAULT_ORGS));
    return DEFAULT_ORGS;
  }

  private static saveOrgsToStorage(orgs: Organization[]): void {
    localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(orgs));
  }

  public static getAllOrganizations(): Organization[] {
    return this.getOrgsFromStorage();
  }

  public static getActiveOrganizationId(): string {
    const active = localStorage.getItem(ACTIVE_ORG_KEY);
    const orgs = this.getAllOrganizations();
    if (active && orgs.some((o) => o.id === active)) return active;
    return orgs[0]?.id || 'org-acme-001';
  }

  public static setActiveOrganizationId(orgId: string): void {
    localStorage.setItem(ACTIVE_ORG_KEY, orgId);
  }

  public static getOrganizationById(id: string): Organization | undefined {
    return this.getAllOrganizations().find((o) => o.id === id);
  }

  public static createOrganization(
    name: string,
    industry: string,
    domain?: string,
    planTier: Organization['planTier'] = 'starter'
  ): Organization {
    const orgs = this.getOrgsFromStorage();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newOrg: Organization = {
      id: `org-${Date.now().toString(36)}`,
      name,
      slug,
      domain,
      planTier,
      seatsTotal: planTier === 'enterprise' ? 100 : planTier === 'pro' ? 25 : 5,
      seatsUsed: 1,
      ownerUid: 'demo-user-123',
      createdAt: new Date().toISOString(),
      ssoEnabled: false,
      industry,
      verified: true,
    };

    orgs.push(newOrg);
    this.saveOrgsToStorage(orgs);
    this.setActiveOrganizationId(newOrg.id);
    return newOrg;
  }

  public static updateOrganization(id: string, updates: Partial<Organization>): Organization | undefined {
    const orgs = this.getOrgsFromStorage();
    const index = orgs.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    orgs[index] = { ...orgs[index], ...updates };
    this.saveOrgsToStorage(orgs);
    return orgs[index];
  }

  public static getMembers(orgId: string): OrganizationMember[] {
    try {
      const stored = localStorage.getItem(`pathpilot_org_members_${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading members', e);
    }
    const defaultMems = DEFAULT_MEMBERS[orgId] || [];
    localStorage.setItem(`pathpilot_org_members_${orgId}`, JSON.stringify(defaultMems));
    return defaultMems;
  }

  public static inviteMember(
    orgId: string,
    email: string,
    name: string,
    role: UserRole,
    department?: string
  ): OrganizationMember {
    const members = this.getMembers(orgId);
    const newMember: OrganizationMember = {
      id: `mem-${Date.now().toString(36)}`,
      orgId,
      uid: `u-${Date.now().toString(36)}`,
      email,
      name,
      role,
      department: department || 'General',
      joinedAt: new Date().toISOString(),
      status: 'invited',
    };

    members.push(newMember);
    localStorage.setItem(`pathpilot_org_members_${orgId}`, JSON.stringify(members));

    // Increment seatsUsed
    const org = this.getOrganizationById(orgId);
    if (org) {
      this.updateOrganization(orgId, { seatsUsed: Math.min(org.seatsTotal, org.seatsUsed + 1) });
    }

    return newMember;
  }

  public static updateMemberRole(orgId: string, memberId: string, role: UserRole): boolean {
    const members = this.getMembers(orgId);
    const member = members.find((m) => m.id === memberId);
    if (!member) return false;

    member.role = role;
    localStorage.setItem(`pathpilot_org_members_${orgId}`, JSON.stringify(members));
    return true;
  }

  public static removeMember(orgId: string, memberId: string): boolean {
    let members = this.getMembers(orgId);
    const initialLen = members.length;
    members = members.filter((m) => m.id !== memberId);
    if (members.length === initialLen) return false;

    localStorage.setItem(`pathpilot_org_members_${orgId}`, JSON.stringify(members));

    const org = this.getOrganizationById(orgId);
    if (org && org.seatsUsed > 1) {
      this.updateOrganization(orgId, { seatsUsed: org.seatsUsed - 1 });
    }
    return true;
  }
}
