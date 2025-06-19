import React, { useState } from 'react';
import { Card, Button, Group, Stack, ColorInput, Alert, Avatar, FileInput, Text } from '@mantine/core';
import { IconCheck, IconUpload } from '@tabler/icons-react';
import type Tenant from '../types';

export default function TenantBrandingForm({ tenant }: { tenant: Tenant }) {
  const [logo, setLogo] = useState<File | null>(null);
  const [color, setColor] = useState(tenant.branding?.colorScheme || '#228be6');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Group>
          <Avatar src={tenant.branding?.logoUrl} size={64} radius="xl" />
          <Text>Current Logo</Text>
        </Group>
        <FileInput
          label="Upload new logo"
          icon={<IconUpload size={16} />}
          value={logo}
          onChange={setLogo}
          accept="image/*"
        />
        <ColorInput
          label="Primary Color Scheme"
          value={color}
          onChange={setColor}
        />
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Branding updated!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Branding</Button>
        </Group>
      </Stack>
    </Card>
  );
} 