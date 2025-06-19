import React from 'react';
import { Card, List, Text, Title } from '@mantine/core';
import type Tenant from '../types';

const mockAuditLog = [
  { ts: '2024-06-01T10:00:00Z', action: 'Created tenant account' },
  { ts: '2024-06-02T14:30:00Z', action: 'Enabled CRM Service' },
  { ts: '2024-06-03T09:15:00Z', action: 'Updated branding' },
  { ts: '2024-06-04T16:45:00Z', action: 'Assigned trial for Inventory Service' },
  { ts: '2024-06-05T11:20:00Z', action: 'Changed status to active' },
];

export default function TenantAuditLog({ tenant }: { tenant: Tenant }) {
  return (
    <Card withBorder radius="md" padding="md">
      <Title order={5} mb="sm">Audit Log</Title>
      <List spacing="xs" size="sm">
        {mockAuditLog.map((entry, i) => (
          <List.Item key={i}>
            <Text span color="dimmed">{new Date(entry.ts).toLocaleString()}:</Text> {entry.action}
          </List.Item>
        ))}
 