import React from 'react';
import { Container, Paper, Title, Text, Grid, Card, Button, Group, Stack, Badge, Alert } from '@mantine/core';
import { 
  IconTools, 
  IconClipboardCheck, 
  IconCalendar, 
  IconUsers, 
  IconBuilding,
  IconMapPin,
  IconChartBar,
  IconSettings,
  IconArrowRight,
  IconLock
} from '@tabler/icons-react';
import Link from 'next/link';
import { useUser } from '../../src/providers/UserProvider';

const MaintenanceDashboard: React.FC = () => {
  const { user, hasPermission } = useUser();

  // Debug: Log user permissions
  console.log('User permissions:', user?.permissions);
  console.log('User:', user);

  const maintenanceModules = [
    {
      title: 'Generator Maintenance Checklist',
      description: 'Comprehensive checklist for generator maintenance and inspection',
      icon: IconTools,
      color: 'blue',
      href: '/maintenance/generator-checklist',
      demoHref: '/maintenance/generator-checklist-demo',
      features: ['Multi-step form', 'Equipment details', 'Performance data', 'Digital signatures'],
      permission: 'equipment-maintenance-service:checklists:read'
    },
    {
      title: 'Customer & Equipment Management',
      description: 'Manage customers, their locations, and equipment assets',
      icon: IconBuilding,
      color: 'green',
      href: '/maintenance/customer-equipment',
      features: ['Customer profiles', 'Equipment registry', 'Location management', 'Contract tracking'],
      permission: 'equipment-maintenance-service:asset-registry:read'
    },
    {
      title: 'Maintenance Scheduler',
      description: 'Schedule and manage maintenance work orders and technician allocation',
      icon: IconCalendar,
      color: 'orange',
      href: '/maintenance/scheduler',
      features: ['Calendar view', 'Work order management', 'Technician allocation', 'Progress tracking'],
      permission: 'equipment-maintenance-service:schedule:read'
    },
    {
      title: 'Work Order Management',
      description: 'Create, track, and manage maintenance work orders',
      icon: IconClipboardCheck,
      color: 'purple',
      href: '/maintenance/work-orders',
      features: ['Work order creation', 'Status tracking', 'Parts management', 'Cost tracking'],
      permission: 'equipment-maintenance-service:work-orders:read'
    },
    {
      title: 'Technician Management',
      description: 'Manage technician profiles, skills, and availability',
      icon: IconUsers,
      color: 'cyan',
      href: '/maintenance/technicians',
      features: ['Technician profiles', 'Skill management', 'Availability tracking', 'Performance metrics'],
      permission: 'equipment-maintenance-service:technicians:read'
    },
    {
      title: 'Equipment Locations',
      description: 'Manage customer locations and site information',
      icon: IconMapPin,
      color: 'red',
      href: '/maintenance/locations',
      features: ['Location mapping', 'Contact information', 'Site details', 'Access management'],
      permission: 'equipment-maintenance-service:asset-registry:read'
    },
    {
      title: 'Maintenance Reports',
      description: 'Generate reports and analytics for maintenance activities',
      icon: IconChartBar,
      color: 'teal',
      href: '/maintenance/reports',
      features: ['Performance reports', 'Cost analysis', 'Compliance reports', 'Trend analysis'],
      permission: 'equipment-maintenance-service:reports:read'
    },
    {
      title: 'Maintenance Settings',
      description: 'Configure maintenance schedules, checklists, and preferences',
      icon: IconSettings,
      color: 'gray',
      href: '/maintenance/settings',
      features: ['Schedule templates', 'Checklist configuration', 'Notification settings', 'System preferences'],
      permission: 'equipment-maintenance-service:analytics:read'
    }
  ];

  // Filter modules based on user permissions
  const accessibleModules = maintenanceModules.filter(module => {
    const [service, moduleName, action] = module.permission.split(':');
    const hasAccess = hasPermission(service, moduleName, action);
    console.log(`Checking permission for ${module.title}:`, { service, moduleName, action, hasAccess });
    return hasAccess;
  });

  console.log('Accessible modules:', accessibleModules.length);

  const quickStats = [
    {
      title: 'Active Work Orders',
      value: '12',
      color: 'blue',
      icon: IconClipboardCheck,
      permission: 'equipment-maintenance-service:work-orders:read'
    },
    {
      title: 'Scheduled This Month',
      value: '28',
      color: 'green',
      icon: IconCalendar,
      permission: 'equipment-maintenance-service:schedule:read'
    },
    {
      title: 'Active Customers',
      value: '15',
      color: 'orange',
      icon: IconBuilding,
      permission: 'equipment-maintenance-service:asset-registry:read'
    },
    {
      title: 'Available Technicians',
      value: '8',
      color: 'purple',
      icon: IconUsers,
      permission: 'equipment-maintenance-service:technicians:read'
    }
  ];

  // Filter stats based on user permissions
  const accessibleStats = quickStats.filter(stat => {
    const [service, moduleName, action] = stat.permission.split(':');
    return hasPermission(service, moduleName, action);
  });

  // Check if user has any maintenance permissions
  const hasMaintenanceAccess = accessibleModules.length > 0;

  if (!hasMaintenanceAccess) {
    return (
      <Container size="xl" py="xl">
        <Alert 
          icon={<IconLock size="1rem" />} 
          title="Access Restricted" 
          color="yellow"
          variant="light"
        >
          <Text size="sm">
            You don't have permission to access the maintenance management system. 
            Please contact your administrator to request access.
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} mb="xs">Maintenance Management Dashboard</Title>
          <Text c="dimmed" size="lg">
            Comprehensive equipment maintenance management system for generators, air conditioners, fire equipment, and more
          </Text>
        </div>

        {/* Quick Stats */}
        {accessibleStats.length > 0 && (
          <Grid>
            {accessibleStats.map((stat, index) => (
              <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group>
                    <div style={{ 
                      backgroundColor: `var(--mantine-color-${stat.color}-1)`, 
                      padding: '12px', 
                      borderRadius: '8px' 
                    }}>
                      <stat.icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
                    </div>
                    <div>
                      <Text size="lg" fw={700}>{stat.value}</Text>
                      <Text size="sm" c="dimmed">{stat.title}</Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Maintenance Modules */}
        <div>
          <Title order={2} mb="lg">Maintenance Modules</Title>
          <Grid>
            {accessibleModules.map((module, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Stack gap="md" h="100%">
                    <Group>
                      <div style={{ 
                        backgroundColor: `var(--mantine-color-${module.color}-1)`, 
                        padding: '12px', 
                        borderRadius: '8px' 
                      }}>
                        <module.icon size={24} color={`var(--mantine-color-${module.color}-6)`} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text fw={600} size="lg">{module.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {module.description}
                        </Text>
                      </div>
                    </Group>

                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500} mb="xs">Features:</Text>
                      <Stack gap="xs">
                        {module.features.map((feature, featureIndex) => (
                          <Text key={featureIndex} size="xs" c="dimmed">
                            • {feature}
                          </Text>
                        ))}
                      </Stack>
                    </div>

                    <Group gap="xs">
                      <Button 
                        component={Link}
                        href={module.href}
                        variant="filled"
                        color={module.color}
                        size="sm"
                        rightSection={<IconArrowRight size={16} />}
                        style={{ flex: 1 }}
                      >
                        Open Module
                      </Button>
                      {module.demoHref && (
                        <Button 
                          component={Link}
                          href={module.demoHref}
                          variant="light"
                          color={module.color}
                          size="sm"
                        >
                          Demo
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Recent Activity */}
        {hasPermission('equipment-maintenance-service', 'work-orders', 'read') && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">Recent Maintenance Activity</Title>
            <Stack gap="md">
              <Group justify="space-between" p="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: '8px' }}>
                <div>
                  <Text fw={500}>Generator Maintenance - KCB Bank</Text>
                  <Text size="sm" c="dimmed">Work Order WO-2024-001 completed</Text>
                </div>
                <Badge color="green">Completed</Badge>
              </Group>
              <Group justify="space-between" p="md" style={{ backgroundColor: 'var(--mantine-color-orange-0)', borderRadius: '8px' }}>
                <div>
                  <Text fw={500}>AC Service - Safaricom PLC</Text>
                  <Text size="sm" c="dimmed">Work Order WO-2024-002 in progress</Text>
                </div>
                <Badge color="orange">In Progress</Badge>
              </Group>
              <Group justify="space-between" p="md" style={{ backgroundColor: 'var(--mantine-color-red-0)', borderRadius: '8px' }}>
                <div>
                  <Text fw={500}>UPS Emergency - Safaricom PLC</Text>
                  <Text size="sm" c="dimmed">Work Order WO-2024-003 scheduled</Text>
                </div>
                <Badge color="red">Critical</Badge>
              </Group>
            </Stack>
          </Card>
        )}

        {/* Quick Actions */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">Quick Actions</Title>
          <Group>
            {hasPermission('equipment-maintenance-service', 'schedule', 'write') && (
              <Button 
                component={Link}
                href="/maintenance/scheduler"
                leftSection={<IconCalendar size={16} />}
                variant="filled"
                color="blue"
              >
                Schedule Maintenance
              </Button>
            )}
            {hasPermission('equipment-maintenance-service', 'asset-registry', 'write') && (
              <Button 
                component={Link}
                href="/maintenance/customer-equipment"
                leftSection={<IconBuilding size={16} />}
                variant="light"
                color="green"
              >
                Add Customer
              </Button>
            )}
            {hasPermission('equipment-maintenance-service', 'checklists', 'write') && (
              <Button 
                component={Link}
                href="/maintenance/generator-checklist"
                leftSection={<IconTools size={16} />}
                variant="light"
                color="orange"
              >
                Create Checklist
              </Button>
            )}
            {hasPermission('equipment-maintenance-service', 'reports', 'read') && (
              <Button 
                component={Link}
                href="/maintenance/reports"
                leftSection={<IconChartBar size={16} />}
                variant="light"
                color="purple"
              >
                View Reports
              </Button>
            )}
          </Group>
        </Card>
      </Stack>
    </Container>
  );
};

export default MaintenanceDashboard; 