import React, { useState } from 'react';
import { Card, TextInput, Button, Group, Stack, Alert } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type Tenant from '../types';

export default function TenantIsolationForm({ tenant }: { tenant: Tenant }) {
  const [dbString, setDbString] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <TextInput
          label="Dedicated DB Connection String (mock)"
          value={dbString}
          onChange={e => setDbString(e.currentTarget.value)}
          description="For enterprise tenants with dedicated DBs."
        />
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Isolation settings saved!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Isolation Settings</Button>
        </Group>
      </Stack>
    </Card>
  );
} 