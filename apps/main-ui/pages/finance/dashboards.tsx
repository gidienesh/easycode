import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { Card, Text, Title } from '@mantine/core';
import { IconGauge } from '@tabler/icons-react';

function FinanceDashboardsPage() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconGauge size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Finance Dashboards
        </h1>
      </div>
      
      <Card className="card">
        <div className="card-header">
          <Title order={3}>Finance Dashboards</Title>
        </div>
        <div className="card-content">
          <Text color="dimmed">Advanced finance dashboards will be implemented here.</Text>
        </div>
      </Card>
    </div>
  );
}

export default function FinanceDashboardsPageWrapper() {
  return (
    <AppLayout>
      <FinanceDashboardsPage />
    </AppLayout>
  );
} 