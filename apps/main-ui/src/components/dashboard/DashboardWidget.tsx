import React from 'react';
import { Card, Text, Group, Stack, Badge, Button, Grid } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { User } from '../../providers/UserProvider';

interface DashboardWidgetProps {
  service: {
    name: string;
    config: {
      enabled: boolean;
      modules: Array<{
        name: string;
        enabled: boolean;
        permissions: string[];
      }>;
      features: string[];
    };
  };
  user: User;
}

const serviceNames = {
  'user-service': 'User Management',
  'crm-service': 'CRM',
  'finance-service': 'Finance',
  'inventory-service': 'Inventory',
  'pos-service': 'Point of Sale',
  'hr-service': 'Human Resources',
  'logistics-service': 'Logistics',
  'notification-service': 'Notifications',
};

const serviceColors = {
  'user-service': 'blue',
  'crm-service': 'green',
  'finance-service': 'yellow',
  'inventory-service': 'orange',
  'pos-service': 'purple',
  'hr-service': 'cyan',
  'logistics-service': 'teal',
  'notification-service': 'pink',
};

export function DashboardWidget({ service, user }: DashboardWidgetProps) {
  const serviceName = serviceNames[service.name as keyof typeof serviceNames] || service.name;
  const color = serviceColors[service.name as keyof typeof serviceColors] || 'gray';

  // Mock data for demonstration
  const mockStats = {
    'user-service': { count: 45, label: 'Total Users' },
    'crm-service': { count: 128, label: 'Total Leads' },
    'finance-service': { count: 89, label: 'Total Invoices' },
    'inventory-service': { count: 234, label: 'Total Items' },
    'pos-service': { count: 67, label: 'Today Sales' },
    'hr-service': { count: 23, label: 'Employees' },
    'logistics-service': { count: 156, label: 'Active Shipments' },
    'notification-service': { count: 89, label: 'Sent Today' },
  };

  const stats = mockStats[service.name as keyof typeof mockStats] || { count: 0, label: 'Records' };

  return (
    <Card className="card" shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text fw={500} size="sm">
            {serviceName} Overview
          </Text>
          <Group spacing="xs">
            <Badge color={color} variant="light" size="sm">
              {service.config.modules.length} modules
            </Badge>
            <Button 
              variant="light" 
              size="xs" 
              color={color}
              leftSection={<IconEye size={14} />}
              onClick={() => window.location.href = `/${service.name.replace('-service', '')}`}
            >
              View Details
            </Button>
          </Group>
        </Group>
      </Card.Section>

      <Stack spacing="md" mt="md">
        {/* Service Stats */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Stack spacing="xs" align="center">
              <Text size="xl" fw={700} color={color}>
                {stats.count}
              </Text>
              <Text size="xs" color="dimmed">{stats.label}</Text>
            </Stack>
          </Grid.Col>
        </Grid>
        
        {/* Module Access Summary */}
        <Stack spacing="xs">
          <Text size="sm" fw={500} color="dimmed">
            Module Access
          </Text>
          <Group spacing="xs">
            {service.config.modules.map((module) => {
              const hasAccess = user.permissions.some(permission => 
                permission.startsWith(`${service.name}:${module.name}:`)
              );
              
              return (
                <Badge 
                  key={module.name}
                  size="sm" 
                  variant={hasAccess ? "filled" : "light"}
                  color={hasAccess ? color : "gray"}
                >
                  {module.name}
                </Badge>
              );
            })}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
} 