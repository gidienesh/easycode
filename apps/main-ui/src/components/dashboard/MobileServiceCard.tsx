import React from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Button, 
  ActionIcon,
  Tooltip,
  MediaQuery
} from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconSettings,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChevronRight
} from '@tabler/icons-react';
import { User } from '../../providers/UserProvider';

interface MobileServiceCardProps {
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
  onNavigate: (path: string) => void;
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

export function MobileServiceCard({ service, user, onNavigate }: MobileServiceCardProps) {
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

  const handleServiceClick = () => {
    onNavigate(`/${service.name.replace('-service', '')}`);
  };

  return (
    <Card 
      className="card" 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={handleServiceClick}
    >
      <Group position="apart" align="flex-start">
        <Group spacing="sm">
          <ActionIcon 
            size="lg" 
            variant="light" 
            color={color}
            radius="md"
          >
            <IconComponent size="1.2rem" />
          </ActionIcon>
          
          <Stack spacing={2}>
            <Text size="sm" weight={600} lineClamp={1}>
              {serviceName}
            </Text>
            <Text size="xs" color="dimmed" lineClamp={1}>
              {accessibleModules.length} modules
            </Text>
          </Stack>
        </Group>

        <Group spacing="xs" align="center">
          <Stack spacing={0} align="center">
            <Text size="lg" weight={700} color={color}>
              {stats.count}
            </Text>
            <Group spacing={2}>
              {stats.trend === 'up' ? (
                <IconArrowUpRight size="0.75rem" color="green" />
              ) : (
                <IconArrowDownRight size="0.75rem" color="red" />
              )}
              <Text 
                size="xs" 
                color={stats.trend === 'up' ? 'green' : 'red'}
                weight={500}
              >
                {Math.abs(stats.change)}%
              </Text>
            </Group>
          </Stack>
          
          <IconChevronRight size="1rem" color="gray" />
        </Group>
      </Group>

      {/* Quick Actions */}
      <Group spacing="xs" mt="md">
        {accessibleModules.slice(0, 3).map((module) => (
          <Badge 
            key={module.name}
            size="xs" 
            variant="light" 
            color={color}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/${service.name.replace('-service', '')}/${module.name.replace('-', '-')}`);
            }}
          >
            {module.name}
          </Badge>
        ))}
        {accessibleModules.length > 3 && (
          <Badge size="xs" variant="light" color="gray">
            +{accessibleModules.length - 3}
          </Badge>
        )}
      </Group>

      {/* Service Status */}
      <Group position="apart" mt="xs">
        <Badge 
          size="xs" 
          color={service.config.enabled ? 'green' : 'red'}
          variant="dot"
        >
          {service.config.enabled ? 'Active' : 'Inactive'}
        </Badge>
        
        <Text size="xs" color="dimmed">
          {service.config.features.length} features
        </Text>
      </Group>
    </Card>
  );
} 