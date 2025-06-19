import React, { useState } from 'react';
import { Card, Button, Group, Stack, Select, Alert } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type Tenant from '../types';

const timezones = [
  'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Africa/Nairobi', 'Australia/Sydney',
];
const languages = [
  'en', 'fr', 'es', 'de', 'zh', 'ar', 'sw',
];
const currencies = [
  'USD', 'EUR', 'KES', 'JPY', 'CNY', 'AUD',
];

export default function TenantRegionalSettingsForm({ tenant }: { tenant: Tenant }) {
  const [timezone, setTimezone] = useState(tenant.region?.timezone || 'UTC');
  const [language, setLanguage] = useState(tenant.region?.language || 'en');
  const [currency, setCurrency] = useState(tenant.region?.currency || 'USD');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(false);
    setTimeout(() => setSuccess(true), 800);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Select
          label="Timezone"
          data={timezones}
          value={timezone}
          onChange={v => setTimezone(v || 'UTC')}
        />
        <Select
          label="Language"
          data={languages}
          value={language}
          onChange={v => setLanguage(v || 'en')}
        />
        <Select
          label="Currency"
          data={currencies}
          value={currency}
          onChange={v => setCurrency(v || 'USD')}
        />
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">Regional settings saved!</Alert>
        )}
        <Group position="right">
          <Button onClick={handleSave}>Save Regional Settings</Button>
        </Group>
      </Stack>
    </Card>
  );
} 