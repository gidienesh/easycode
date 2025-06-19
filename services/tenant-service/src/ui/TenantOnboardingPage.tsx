import React, { useState } from 'react';
import { Card, TextInput, Button, Group, Select, Title, Stack, Alert } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type Tenant from './types';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspended' },
];

export default function TenantOnboardingPage() {
  const [form, setForm] = useState({
    name: '',
    primaryContact: '',
    email: '',
    phone: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Mock async submission
    setTimeout(() => {
      if (!form.name || !form.primaryContact || !form.email || !form.phone) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
      // Reset form (optional)
      setForm({ name: '', primaryContact: '', email: '', phone: '', status: 'active' });
    }, 1200);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2} mb="md">Onboard New Tenant</Title>
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <TextInput
            label="Company Name"
            value={form.name}
            onChange={e => handleChange('name', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Primary Contact"
            value={form.primaryContact}
            onChange={e => handleChange('primaryContact', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Phone"
            value={form.phone}
            onChange={e => handleChange('phone', e.currentTarget.value)}
            required
          />
          <Select
            label="Initial Status"
            data={statusOptions}
            value={form.status}
            onChange={v => handleChange('status', v || 'active')}
            required
          />
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>
          )}
          {success && (
            <Alert icon={<IconCheck size={16} />} color="green">Tenant onboarded successfully!</Alert>
          )}
          <Group position="right">
            <Button type="submit" loading={loading}>
              Onboard Tenant
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
} 