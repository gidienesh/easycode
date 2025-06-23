import React from 'react';
import { Card, Text, Group, Badge, Stack, Button, Progress } from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconSettings,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';
import { User } from '../../providers/UserProvider';

interface ServiceOverviewCardProps {
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

const serviceIcons = {
  'user-service': IconUsers,
  'crm-service': IconBuilding,
  'finance-service': IconCash,
  'inventory-service': IconPackage,
  'pos-service': IconCash,
  'hr-service': IconUsers,
  'logistics-service': IconTruck,
  'notification-service': IconBell,
};

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

export function ServiceOverviewCard({ service, user }: ServiceOverviewCardProps) {
  const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons] || IconSettings;
  const serviceName = serviceNames[service.name as keyof typeof serviceNames] || service.name;
  const color = serviceColors[service.name as keyof typeof serviceColors] || 'gray';

  // Calculate user's accessible modules for this service
  const accessibleModules = service.config.modules.filter(module => 
    user.permissions.some(permission => 
      permission.startsWith(`${service.name}:${module.name}:`)
    )
  );

  // Mock data for demonstration
  const mockStats = {
    'user-service': { count: 45, change: 12, trend: 'up' },
    'crm-service': { count: 128, change: -5, trend: 'down' },
    'finance-service': { count: 89, change: 23, trend: 'up' },
    'inventory-service': { count: 234, change: 8, trend: 'up' },
    'pos-service': { count: 67, change: 15, trend: 'up' },
    'hr-service': { count: 23, change: 3, trend: 'up' },
    'logistics-service': { count: 156, change: -2, trend: 'down' },
    'notification-service': { count: 89, change: 7, trend: 'up' },
  };

  const stats = mockStats[service.name as keyof typeof mockStats] || { count: 0, change: 0, trend: 'up' };

  return (
    <Card className="card" shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Group>
            <IconComponent size={20} color={`var(--mantine-color-${color}-6)`} />
            <Text fw={500} size="sm">
              {serviceName}
            </Text>
          </Group>
          <Badge color={color} variant="light" size="sm">
            {accessibleModules.length} modules
          </Badge>
        </Group>
      </Card.Section>

      <Stack spacing="xs" mt="md">
        <Group position="apart">
          <Text size="xl" fw={700}>
            {stats.count}
          </Text>
          <Group spacing={4}>
            {stats.trend === 'up' ? (
              <IconArrowUpRight size={16} color="green" />
            ) : (
              <IconArrowDownRight size={16} color="red" />
            )}
            <Text 
              size="sm" 
              color={stats.trend === 'up' ? 'green' : 'red'}
              fw={500}
            >
              {Math.abs(stats.change)}%
            </Text>
          </Group>
        </Group>

        <Text size="xs" color="dimmed">
          Total records
        </Text>

        <Progress 
          value={Math.min((accessibleModules.length / service.config.modules.length) * 100, 100)} 
          color={color} 
          size="sm" 
        />

        <Text size="xs" color="dimmed">
          {accessibleModules.length} of {service.config.modules.length} modules accessible
        </Text>
      </Stack>

      <Group position="apart" mt="md">
        <Button 
          variant="light" 
          size="xs" 
          color={color}
          onClick={() => window.location.href = `/${service.name.replace('-service', '')}`}
        >
          View Details
        </Button>
        
        <Group spacing={4}>
          {service.config.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} size="xs" variant="dot" color={color}>
              {feature}
            </Badge>
          ))}
          {service.config.features.length > 2 && (
            <Badge size="xs" variant="light" color="gray">
              +{service.config.features.length - 2}
            </Badge>
          )}
        </Group>
      </Group>
    </Card>
  );
} 