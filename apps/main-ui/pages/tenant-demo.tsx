import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Group, Container, Title } from '@mantine/core';

// Dynamically import the tenant-service UI components
const TenantListPage = dynamic(() => import('../../services/tenant-service/src/ui/TenantListPage'), { ssr: false });
const TenantOnboardingPage = dynamic(() => import('../../services/tenant-service/src/ui/TenantOnboardingPage'), { ssr: false });
const TenantDetailsPage = dynamic(() => import('../../services/tenant-service/src/ui/TenantDetailsPage'), { ssr: false });

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