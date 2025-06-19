import React, { useState } from 'react';
import { Card, Switch, Button, Group, Stack, Alert } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type Tenant from '../types';

export default function TenantSettingsForm({ tenant }: { tenant: Tenant }) {
  const [notifications, setNotifications] = useState(true);
  const [customSetting, setCustomSetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Switch
          label="Enable notifications for this tenant"
          checked={notifications}
          onChange={e => setNotifications(e.currentTarget.checked)}
        />
        <Switch
          label="Enable custom setting (mock)"
          checked={customSetting}
          onChange={e => setCustomSetting(e.currentTarget.checked)}
        />
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Settings saved!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Settings</Button>
        </Group>
      </Stack>
    </Card>
  );
} 