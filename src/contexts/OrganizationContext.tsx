/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Organization, OrganizationMember, SubscriptionDetails, UserRole } from '../types/saas';
import { OrganizationService } from '../services/organizationService';
import { SubscriptionService } from '../services/subscriptionService';

interface OrganizationContextType {
  currentOrg: Organization;
  userOrgs: Organization[];
  members: OrganizationMember[];
  subscription: SubscriptionDetails;
  currentRole: UserRole;
  loading: boolean;
  switchOrganization: (orgId: string) => void;
  createOrganization: (name: string, industry: string, domain?: string, planTier?: Organization['planTier']) => Organization;
  inviteMember: (email: string, name: string, role: UserRole, department?: string) => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: UserRole) => void;
  checkPermission: (action: string) => boolean;
  refreshOrg: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userOrgs, setUserOrgs] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization>(() => {
    const orgs = OrganizationService.getAllOrganizations();
    const activeId = OrganizationService.getActiveOrganizationId();
    return orgs.find((o) => o.id === activeId) || orgs[0];
  });
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDetails>(() =>
    SubscriptionService.getSubscriptionForOrg(currentOrg.id, currentOrg.planTier)
  );
  const [loading, setLoading] = useState<boolean>(false);

  const reloadData = useCallback(() => {
    const allOrgs = OrganizationService.getAllOrganizations();
    setUserOrgs(allOrgs);

    const activeId = OrganizationService.getActiveOrganizationId();
    const activeOrg = allOrgs.find((o) => o.id === activeId) || allOrgs[0];
    setCurrentOrg(activeOrg);

    const orgMembers = OrganizationService.getMembers(activeOrg.id);
    setMembers(orgMembers);

    const subDetails = SubscriptionService.getSubscriptionForOrg(activeOrg.id, activeOrg.planTier);
    setSubscription(subDetails);
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const switchOrganization = (orgId: string) => {
    OrganizationService.setActiveOrganizationId(orgId);
    reloadData();
  };

  const createOrganization = (
    name: string,
    industry: string,
    domain?: string,
    planTier: Organization['planTier'] = 'starter'
  ) => {
    const newOrg = OrganizationService.createOrganization(name, industry, domain, planTier);
    reloadData();
    return newOrg;
  };

  const inviteMember = (email: string, name: string, role: UserRole, department?: string) => {
    OrganizationService.inviteMember(currentOrg.id, email, name, role, department);
    reloadData();
  };

  const removeMember = (memberId: string) => {
    OrganizationService.removeMember(currentOrg.id, memberId);
    reloadData();
  };

  const updateMemberRole = (memberId: string, role: UserRole) => {
    OrganizationService.updateMemberRole(currentOrg.id, memberId, role);
    reloadData();
  };

  // Find user's role in current org
  const currentUserMember = members.find((m) => m.uid === 'demo-user-123' || m.email.includes('alex'));
  const currentRole: UserRole = currentUserMember ? currentUserMember.role : 'super_admin';

  const checkPermission = (action: string): boolean => {
    if (currentRole === 'super_admin' || currentRole === 'platform_admin' || currentRole === 'org_owner') return true;
    if (action === 'manage_org' || action === 'billing') {
      return currentRole === 'org_admin';
    }
    if (action === 'invite_members') {
      return currentRole === 'org_admin' || currentRole === 'career_coach';
    }
    return true;
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        userOrgs,
        members,
        subscription,
        currentRole,
        loading,
        switchOrganization,
        createOrganization,
        inviteMember,
        removeMember,
        updateMemberRole,
        checkPermission,
        refreshOrg: reloadData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
