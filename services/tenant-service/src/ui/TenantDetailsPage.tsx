import React, { useState } from 'react';
import { Card, Tabs, Title, Group, Avatar, Text } from '@mantine/core';
import { mockTenants } from './mockData';
import type Tenant from './types';
import TenantStatusBadge from './components/TenantStatusBadge';
import TenantSettingsForm from './components/TenantSettingsForm';
import TenantBrandingForm from './components/TenantBrandingForm';
import TenantRegionalSettingsForm from './components/TenantRegionalSettingsForm';
import TenantEntitlementsForm from './components/TenantEntitlementsForm';
import TenantDomainForm from './components/TenantDomainForm';
import TenantIsolationForm from './components/TenantIsolationForm';
import TenantAuditLog from './components/TenantAuditLog';

function GeneralInfoTab({ tenant }: { tenant: Tenant }) {
  return (
    <Card withBorder radius="md" padding="md">
      <Title order={5} mb="sm">General Info</Title>
      <Text><b>Company Name:</b> {tenant.name}</Text>
      <Text><b>Primary Contact:</b> {tenant.primaryContact}</Text>
      <Text><b>Email:</b> {tenant.email}</Text>
      <Text><b>Phone:</b> {tenant.phone}</Text>
      <Text><b>Status:</b> <TenantStatusBadge status={tenant.status} /></Text>
      <Text><b>Created:</b> {new Date(tenant.createdAt).toLocaleString()}</Text>
      <Text><b>Updated:</b> {new Date(tenant.updatedAt).toLocaleString()}</Text>
    </Card>
  );
}

export default function TenantDetailsPage({ tenantId }: { tenantId: string }) {
  const tenant = mockTenants.find(t => t.id === tenantId);
  const [tab, setTab] = useState('general');
  if (!tenant) return <div>Tenant not found.</div>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="md" spacing="md">
        <Avatar src={tenant.branding?.logoUrl} alt={tenant.name} size={64} radius="xl" />
        <div>
          <Title order={3}>{tenant.name}</Title>
          <Group spacing="xs">
            <TenantStatusBadge status={tenant.status} />
            <Text size="sm" color="dimmed">{tenant.email}</Text>
          </Group>
        </div>
      </Group>
      <Tabs value={tab} onTabChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="general">General Info</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab value="branding">Branding</Tabs.Tab>
          <Tabs.Tab value="regional">Regional</Tabs.Tab>
          <Tabs.Tab value="entitlements">Entitlements</Tabs.Tab>
          <Tabs.Tab value="domain">Domain</Tabs.Tab>
          <Tabs.Tab value="isolation">Isolation</Tabs.Tab>
          <Tabs.Tab value="audit">Audit</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general"><GeneralInfoTab tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="settings"><TenantSettingsForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="branding"><TenantBrandingForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="regional"><TenantRegionalSettingsForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="entitlements"><TenantEntitlementsForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="domain"><TenantDomainForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="isolation"><TenantIsolationForm tenant={tenant} /></Tabs.Panel>
        <Tabs.Panel value="audit"><TenantAuditLog tenant={tenant} /></Tabs.Panel>
      </Tabs>
    </Card>
  );
} 