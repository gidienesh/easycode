import React, { useState } from 'react';
import { Container, Title, Group, Button, Stack, Text, Badge } from '@mantine/core';
import { useTenantTheme } from '@easycode-pkgs/ui-library/src';


// Mock components for demo - replace with actual implementations
const TenantListPage = ({ onViewTenant }: { onViewTenant: (id: string) => void }) => (
  <Stack>
    <Title order={2}>Tenant List</Title>
    <Group>
      <Button onClick={() => onViewTenant('tenant-1')}>View TechCorp</Button>
      <Button onClick={() => onViewTenant('tenant-2')}>View GreenCorp</Button>
      <Button onClick={() => onViewTenant('tenant-3')}>View DarkCorp</Button>
    </Group>
  </Stack>
);

const TenantOnboardingPage = () => (
  <Stack>
    <Title order={2}>Tenant Onboarding</Title>
    <Text>Onboarding form would go here...</Text>
  </Stack>
);

const TenantDetailsPage = ({ tenantId }: { tenantId: string }) => {
  const { currentTheme, setTenantId } = useTenantTheme();
  
  return (
    <Stack>
      <Title order={2}>Tenant Details: {tenantId}</Title>
      <Group>
        <Badge color={currentTheme.primaryColor}>Current Theme: {currentTheme.name}</Badge>
        <Button onClick={() => setTenantId('tenant-1')}>Switch to TechCorp</Button>
        <Button onClick={() => setTenantId('tenant-2')}>Switch to GreenCorp</Button>
        <Button onClick={() => setTenantId('tenant-3')}>Switch to DarkCorp</Button>
      </Group>
    </Stack>
  );
};

export default function TenantDemo() {
  const [view, setView] = useState<'list' | 'onboard' | 'details'>('list');
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Handler to view tenant details
  const handleViewTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setView('details');
  };

  // Handler to go back to list
  const handleBackToList = () => {
    setView('list');
    setSelectedTenantId(null);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">Tenant Service Demo</Title>
      <Group mb="md">
        <Button onClick={() => setView('list')}>Tenant List</Button>
        <Button onClick={() => setView('onboard')}>Onboard Tenant</Button>
      </Group>
      {view === 'list' && <TenantListPage onViewTenant={handleViewTenant} />}
      {view === 'onboard' && <TenantOnboardingPage />}
      {view === 'details' && selectedTenantId && (
        <>
          <Button mb="md" onClick={handleBackToList} variant="outline">Back to List</Button>
          <TenantDetailsPage tenantId={selectedTenantId} />
        </>
      )}
    </Container>
  );
} 