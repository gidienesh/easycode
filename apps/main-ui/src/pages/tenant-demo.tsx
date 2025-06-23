import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Button, 
  Group, 
  Stack, 
  Badge,
  Select,
  Checkbox,
  Divider
} from '@mantine/core';
import { IconRefresh, IconSettings } from '@tabler/icons-react';

const tenantConfigs = [
  {
    id: 'demo-tenant',
    name: 'Demo Tenant',
    description: 'Basic tenant with core services',
    services: ['user-service', 'notification-service']
  },
  {
    id: 'crm-tenant',
    name: 'CRM Tenant',
    description: 'CRM-focused tenant',
    services: ['user-service', 'crm-service', 'notification-service']
  },
  {
    id: 'finance-tenant',
    name: 'Finance Tenant',
    description: 'Finance and accounting focused',
    services: ['user-service', 'finance-service', 'notification-service']
  },
  {
    id: 'inventory-tenant',
    name: 'Inventory Tenant',
    description: 'Inventory and POS focused',
    services: ['user-service', 'inventory-service', 'pos-service', 'notification-service']
  },
  {
    id: 'hr-tenant',
    name: 'HR Tenant',
    description: 'Human resources focused',
    services: ['user-service', 'hr-service', 'notification-service']
  },
  {
    id: 'logistics-tenant',
    name: 'Logistics Tenant',
    description: 'Logistics and shipping focused',
    services: ['user-service', 'logistics-service', 'notification-service']
  },
  {
    id: 'premium-tenant',
    name: 'Premium Tenant',
    description: 'Full access to all services',
    services: [
      'user-service', 
      'crm-service', 
      'finance-service', 
      'inventory-service', 
      'pos-service', 
      'hr-service', 
      'logistics-service', 
      'notification-service'
    ]
  }
];

export default function TenantDemo() {
  const [selectedTenant, setSelectedTenant] = useState('demo-tenant');

  const handleTenantSwitch = (tenantId: string) => {
    setSelectedTenant(tenantId);
    
    // Update localStorage to simulate tenant switching
    localStorage.setItem('currentTenantId', tenantId);
    
    // Reload the page to apply new tenant context
    window.location.reload();
  };

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <div>
          <Title order={1}>Tenant Configuration Demo</Title>
          <Text color="dimmed" size="lg">
            Test different tenant configurations to see how the dashboard adapts
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text fw={500} size="sm">
                Current Configuration
              </Text>
              <Badge color="blue" variant="light">
                {selectedTenant}
              </Badge>
            </Group>
          </Card.Section>

          <Stack spacing="md" mt="md">
            <Select
              label="Select Tenant Configuration"
              placeholder="Choose a tenant configuration"
              value={selectedTenant}
              onChange={(value) => value && handleTenantSwitch(value)}
              data={tenantConfigs.map(config => ({
                value: config.id,
                label: config.name
              }))}
            />

            {tenantConfigs.find(config => config.id === selectedTenant) && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  {tenantConfigs.find(config => config.id === selectedTenant)?.description}
                </Text>
                <Group spacing="xs">
                  {tenantConfigs.find(config => config.id === selectedTenant)?.services.map(service => (
                    <Badge key={service} size="sm" variant="light" color="blue">
                      {service.replace('-service', '')}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}

            <Button 
              leftSection={<IconRefresh size="1rem" />}
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Dashboard
            </Button>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text fw={500} size="sm">
                Available Configurations
              </Text>
              <Badge color="green" variant="light">
                {tenantConfigs.length} presets
              </Badge>
            </Group>
          </Card.Section>

          <Stack spacing="md" mt="md">
            {tenantConfigs.map((config) => (
              <Card 
                key={config.id} 
                shadow="xs" 
                padding="md" 
                radius="sm" 
                withBorder
                style={{ 
                  cursor: 'pointer',
                  borderColor: selectedTenant === config.id ? 'var(--mantine-color-blue-6)' : undefined
                }}
                onClick={() => handleTenantSwitch(config.id)}
              >
                <Group position="apart">
                  <div>
                    <Text fw={500} size="sm">
                      {config.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {config.description}
                    </Text>
                  </div>
                  <Group spacing="xs">
                    <Badge size="xs" variant="light">
                      {config.services.length} services
                    </Badge>
                    {selectedTenant === config.id && (
                      <Badge size="xs" color="blue">
                        Active
                      </Badge>
                    )}
                  </Group>
                </Group>
                
                <Group spacing="xs" mt="xs">
                  {config.services.map(service => (
                    <Badge 
                      key={service} 
                      size="xs" 
                      variant="dot" 
                      color="gray"
                    >
                      {service.replace('-service', '')}
                    </Badge>
                  ))}
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text fw={500} size="sm">
                How It Works
              </Text>
              <IconSettings size="1rem" />
            </Group>
          </Card.Section>

          <Stack spacing="md" mt="md">
            <Text size="sm">
              The dashboard dynamically adapts based on:
            </Text>
            
            <Stack spacing="xs">
              <Text size="xs" color="dimmed">
                • <strong>Tenant Entitlements:</strong> Which services are enabled for the tenant
              </Text>
              <Text size="xs" color="dimmed">
                • <strong>User Permissions:</strong> What the current user can access within enabled services
              </Text>
              <Text size="xs" color="dimmed">
                • <strong>Service Modules:</strong> Specific modules and features available within each service
              </Text>
              <Text size="xs" color="dimmed">
                • <strong>Feature Flags:</strong> Additional features and capabilities based on tenant tier
              </Text>
            </Stack>

            <Divider />

            <Text size="sm">
              <strong>Try switching between different tenant configurations above to see how the dashboard, navigation, and available actions change dynamically.</strong>
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
} 