import React, { useState } from 'react';
import { Card, Checkbox, Button, Group, Stack, Alert, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type Tenant from '../types';
import { mockFeatures } from '../mockData';

export default function TenantEntitlementsForm({ tenant }: { tenant: Tenant }) {
  const [entitlements, setEntitlements] = useState<string[]>(tenant.entitlements);
  const [success, setSuccess] = useState(false);

  const handleToggle = (id: string) => {
    setEntitlements(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    setSuccess(false);
  };

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Text weight={500}>Enabled Services & Features</Text>
        {mockFeatures.map(feature => (
          <Checkbox
            key={feature.id}
            label={feature.name}
            checked={entitlements.includes(feature.id)}
            onChange={() => handleToggle(feature.id)}
          />
        ))}
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Entitlements updated!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Entitlements</Button>
        </Group>
      </Stack>
    </Card>
  );
} 