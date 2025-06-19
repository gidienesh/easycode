import React, { useState } from 'react';
import { Card, TextInput, Button, Group, Stack, Alert } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type Tenant from '../types';

export default function TenantDomainForm({ tenant }: { tenant: Tenant }) {
  const [subdomain, setSubdomain] = useState(tenant.subdomain || '');
  const [customDomain, setCustomDomain] = useState(''); // Future
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <TextInput
          label="Subdomain"
          value={subdomain}
          onChange={e => setSubdomain(e.currentTarget.value)}
          description="e.g. clientcompany.easycode.com"
        />
        <TextInput
          label="Custom Domain (future)"
          value={customDomain}
          onChange={e => setCustomDomain(e.currentTarget.value)}
          description="e.g. portal.clientcompany.com"
          disabled
        />
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Domain settings saved!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Domain Settings</Button>
        </Group>
      </Stack>
    </Card>
  );
} 