import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { Card, Text, Title } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';

function GeneralLedgerPage() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconBook size="1.5rem" style={{ marginRight: '0.5rem' }} />
          General Ledger
        </h1>
      </div>
      
      <Card className="card">
        <div className="card-header">
          <Title order={3}>General Ledger</Title>
        </div>
        <div className="card-content">
          <Text color="dimmed">General Ledger functionality will be implemented here.</Text>
        </div>
      </Card>
    </div>
  );
}

export default function GeneralLedgerPageWrapper() {
  return (
    <AppLayout>
      <GeneralLedgerPage />
    </AppLayout>
  );
} 