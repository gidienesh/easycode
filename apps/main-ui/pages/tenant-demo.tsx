import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Badge, 
  Group, 
  Select,
  Grid,
  Alert,
  Tabs,
  Stack,
  Box
} from '@mantine/core';

// Mock tenant data for demo purposes
const mockTenants = [
  {
    id: 'client-company-abc',
    name: 'Client Company ABC',
    status: 'active',
    entitlements: {
      services: {
        'user-service': { enabled: true, modules: ['user_management'] },
        'crm-service': { enabled: true, modules: ['leads', 'contacts'] },
        'finance-service': { enabled: true, modules: ['accounting', 'invoicing'] },
        'inventory-service': { enabled: false, modules: [] },
        'logistics-service': { enabled: false, modules: [] },
        'notification-service': { enabled: true, modules: [] }
      }
    }
  },
  {
    id: 'client-company-xyz',
    name: 'Client Company XYZ',
    status: 'active',
    entitlements: {
      services: {
        'user-service': { enabled: true, modules: ['user_management'] },
        'crm-service': { enabled: true, modules: ['leads'] },
        'finance-service': { enabled: false, modules: [] },
        'inventory-service': { enabled: true, modules: ['item_management'] },
        'logistics-service': { enabled: true, modules: ['shipments'] },
        'notification-service': { enabled: true, modules: [] }
      }
    }
  },
  {
    id: 'startup-company',
    name: 'Startup Company',
    status: 'active',
    entitlements: {
      services: {
        'user-service': { enabled: true, modules: ['user_management'] },
        'crm-service': { enabled: false, modules: [] },
        'finance-service': { enabled: false, modules: [] },
        'inventory-service': { enabled: false, modules: [] },
        'logistics-service': { enabled: false, modules: [] },
        'notification-service': { enabled: true, modules: [] }
      }
    }
  }
];

export default function TenantDemo() {
  const [selectedTenantId, setSelectedTenantId] = useState('client-company-abc');
  const [currentTenant, setCurrentTenant] = useState(mockTenants[0]);
  
  const handleTenantChange = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (tenant) {
      setSelectedTenantId(tenantId);
      setCurrentTenant(tenant);
    }
  };

  const enabledServices = Object.entries(currentTenant.entitlements.services)
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => ({
      name: serviceName,
      modules: config.modules || []
    }));

  const disabledServices = Object.entries(currentTenant.entitlements.services)
    .filter(([_, config]) => !config.enabled)
    .map(([serviceName]) => serviceName);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Box ta="center">
          <Title order={1} size="2.5rem" mb="md">
            Frontend Tenancy Demo
          </Title>
          <Text size="lg" c="dimmed">
            See how tenancy works on the frontend with different tenant configurations
          </Text>
        </Box>

        {/* Tenant Selector */}
        <Card withBorder p="md">
          <Stack gap="md">
            <Title order={2} size="h3">Switch Tenant Context</Title>
            <Group>
              <Select
                label="Select Tenant"
                value={selectedTenantId}
                onChange={handleTenantChange}
                data={mockTenants.map(t => ({ value: t.id, label: t.name }))}
                style={{ minWidth: 300 }}
              />
              <Badge color={currentTenant.status === 'active' ? 'green' : 'red'}>
                {currentTenant.status}
              </Badge>
            </Group>
          </Stack>
        </Card>

        <Grid>
          {/* Left Sidebar - Navigation */}
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="md">
                <Title order={3} size="h4">Navigation</Title>
                <Text size="sm" c="dimmed">
                  Based on tenant entitlements
                </Text>
                
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Dashboard</Text>
                    <Badge size="xs" color="green">Always</Badge>
                  </Group>
                  
                  {enabledServices.map(service => (
                    <Group key={service.name} justify="space-between">
                      <Text size="sm" tt="capitalize">
                        {service.name.replace('-', ' ')}
                      </Text>
                      <Badge size="xs" color="blue">
                        {service.modules.length} modules
                      </Badge>
                    </Group>
                  ))}
                  
                  {disabledServices.map(service => (
                    <Group key={service} justify="space-between" opacity={0.5}>
                      <Text size="sm" tt="capitalize">
                        {service.replace('-', ' ')}
                      </Text>
                      <Badge size="xs" color="gray">Disabled</Badge>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Main Content */}
          <Grid.Col span={9}>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="services">Services</Tabs.Tab>
                <Tabs.Tab value="simulation">Simulation</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Stack gap="md">
                  <Card withBorder p="md">
                    <Stack gap="md">
                      <Title order={2} size="h3">Tenant Overview</Title>
                      <Grid>
                        <Grid.Col span={6}>
                          <Text size="sm" c="dimmed">Tenant Name</Text>
                          <Text fw={500}>{currentTenant.name}</Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text size="sm" c="dimmed">Tenant ID</Text>
                          <Text fw={500}>{currentTenant.id}</Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text size="sm" c="dimmed">Status</Text>
                          <Badge color={currentTenant.status === 'active' ? 'green' : 'red'}>
                            {currentTenant.status}
                          </Badge>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text size="sm" c="dimmed">Enabled Services</Text>
                          <Text fw={500}>{enabledServices.length} of {Object.keys(currentTenant.entitlements.services).length}</Text>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Card>

                  <Alert color="blue" title="How It Works">
                    <Text size="sm">
                      The frontend automatically adapts based on the tenant's service entitlements. 
                      Users only see features and navigation items they have access to.
                    </Text>
                  </Alert>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="services" pt="md">
                <Grid>
                  {Object.entries(currentTenant.entitlements.services).map(([serviceName, config]) => (
                    <Grid.Col span={6} key={serviceName}>
                      <Card withBorder p="md">
                        <Stack gap="md">
                          <Group justify="space-between">
                            <Title order={3} size="h4" tt="capitalize">
                              {serviceName.replace('-', ' ')}
                            </Title>
                            <Badge color={config.enabled ? 'green' : 'red'}>
                              {config.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </Group>
                          
                          {config.enabled ? (
                            <Stack gap="xs">
                              <Text size="sm" c="dimmed">Available Modules:</Text>
                              {config.modules && config.modules.length > 0 ? (
                                <Group>
                                  {config.modules.map(module => (
                                    <Badge key={module} size="xs" color="blue">
                                      {module}
                                    </Badge>
                                  ))}
                                </Group>
                              ) : (
                                <Text size="sm" c="dimmed">No specific modules</Text>
                              )}
                            </Stack>
                          ) : (
                            <Text size="sm" c="dimmed">
                              This service is not enabled for this tenant.
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="simulation" pt="md">
                <Card withBorder p="md">
                  <Stack gap="md">
                    <Title order={2} size="h3">User Experience Simulation</Title>
                    <Text size="sm" c="dimmed">
                      Simulate what a user would see when accessing different features
                    </Text>
                    
                    <Grid>
                      <Grid.Col span={4}>
                        <Card withBorder p="md">
                          <Stack gap="md">
                            <Title order={3} size="h4">CRM Dashboard</Title>
                            {currentTenant.entitlements.services['crm-service']?.enabled ? (
                              <Stack gap="xs">
                                <Text size="sm">✅ Access granted</Text>
                                <Text size="xs" c="dimmed">
                                  Modules: {currentTenant.entitlements.services['crm-service'].modules?.join(', ')}
                                </Text>
                              </Stack>
                            ) : (
                              <Alert color="yellow" title="Service not enabled">
                                <Text size="sm">❌ Service not enabled</Text>
                              </Alert>
                            )}
                          </Stack>
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={4}>
                        <Card withBorder p="md">
                          <Stack gap="md">
                            <Title order={3} size="h4">Finance Dashboard</Title>
                            {currentTenant.entitlements.services['finance-service']?.enabled ? (
                              <Stack gap="xs">
                                <Text size="sm">✅ Access granted</Text>
                                <Text size="xs" c="dimmed">
                                  Modules: {currentTenant.entitlements.services['finance-service'].modules?.join(', ')}
                                </Text>
                              </Stack>
                            ) : (
                              <Alert color="yellow" title="Service not enabled">
                                <Text size="sm">❌ Service not enabled</Text>
                              </Alert>
                            )}
                          </Stack>
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={4}>
                        <Card withBorder p="md">
                          <Stack gap="md">
                            <Title order={3} size="h4">Inventory Dashboard</Title>
                            {currentTenant.entitlements.services['inventory-service']?.enabled ? (
                              <Stack gap="xs">
                                <Text size="sm">✅ Access granted</Text>
                                <Text size="xs" c="dimmed">
                                  Modules: {currentTenant.entitlements.services['inventory-service'].modules?.join(', ')}
                                </Text>
                              </Stack>
                            ) : (
                              <Alert color="yellow" title="Service not enabled">
                                <Text size="sm">❌ Service not enabled</Text>
                              </Alert>
                            )}
                          </Stack>
                        </Card>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
} 