/**
 * FeatureChecklist (Mantine-based)
 *
 * Allows admin to select features/modules for a tenant using a production-grade UI.
 * - Uses Mantine Card, Checkbox, Group, Button, and Alert components
 * - Validates that at least one feature is selected
 * - Shows error/success messages
 * - Responsive and accessible
 * - Ready for integration with real data
 */
import React, { useState } from 'react';
import { Card, Checkbox, Group, Button, Alert, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

// TODO: Replace with real data and logic
const mockFeatures = [
  { id: 'crm', name: 'CRM Service', description: 'Customer relationship management tools.' },
  { id: 'inventory', name: 'Inventory Service', description: 'Track and manage inventory levels.' },
  { id: 'finance', name: 'Finance Service', description: 'Accounting, invoicing, and payments.' },
  { id: 'hr', name: 'HR Service', description: 'Employee and payroll management.' },
  { id: 'pos', name: 'POS Service', description: 'Point of sale and retail operations.' },
  { id: 'logistics', name: 'Logistics Service', description: 'Shipping and delivery management.' },
];

export default function FeatureChecklist({ onNext }: { onNext?: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    setError(null);
    setSuccess(false);
  };

  const handleNext = () => {
    if (selected.length === 0) {
      setError('Please select at least one feature to continue.');
      setSuccess(false);
      return;
    }
    setError(null);
    setSuccess(true);
    if (onNext) onNext(selected);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">Select Features for Tenant</Title>
      <Stack spacing="sm">
        {mockFeatures.map((feature) => (
          <Card key={feature.id} withBorder radius="sm" padding="sm" mb="xs">
            <Group position="apart">
              <Group>
                <Checkbox
                  checked={selected.includes(feature.id)}
                  onChange={() => handleToggle(feature.id)}
                  id={feature.id}
                  aria-label={feature.name}
                />
                <div>
                  <Text weight={500}>{feature.name}</Text>
                  <Text size="sm" color="dimmed">{feature.description}</Text>
                </div>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mt="md">
          {error}
        </Alert>
      )}
      {success && (
        <Alert icon={<IconCheck size={16} />} color="green" mt="md">
          Features selected successfully!
        </Alert>
      )}
      <Group position="right" mt="lg">
        <Button onClick={handleNext} disabled={selected.length === 0}>
          Continue
        </Button>
      </Group>
    </Card>
  );
} 