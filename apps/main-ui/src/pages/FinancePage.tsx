import React from 'react';
import { Card, Text, Button, Group, Stack } from '@mantine/core';
import { IconCash } from '@tabler/icons-react';

export function FinancePage() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconCash size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Finance
        </h1>
      </div>
      
      <Stack spacing="lg">
        <Card className="card">
          <div className="card-header">
            <h2 className="card-title">Finance Overview</h2>
          </div>
          <div className="card-content">
            <Text color="dimmed">Finance dashboard and management will be displayed here</Text>
          </div>
        </Card>
      </Stack>
    </div>
  );
} 