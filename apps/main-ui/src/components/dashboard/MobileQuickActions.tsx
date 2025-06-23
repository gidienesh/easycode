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
  SimpleGrid
} from '@mantine/core';
import { 
  IconPlus, 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconSettings,
  IconSearch,
  IconFileText,
  IconChartBar
} from '@tabler/icons-react';
import { User } from '../../providers/UserProvider';

interface MobileQuickActionsProps {
  user: User;
  enabledServices: Array<{
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
  }>;
  accessibleServices: Array<{
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
  }>;
  onNavigate: (path: string) => void;
}

const quickActions = [
  {
    id: 'add-user',
    label: 'Add User',
    icon: IconUsers,
    service: 'user-service',
    module: 'user-management',
    action: 'write',
    color: 'blue',
    href: '/users/new'
  },
  {
    id: 'add-lead',
    label: 'Add Lead',
    icon: IconBuilding,
    service: 'crm-service',
    module: 'leads',
    action: 'write',
    color: 'green',
    href: '/crm/leads/new'
  },
  {
    id: 'create-invoice',
    label: 'Create Invoice',
    icon: IconCash,
    service: 'finance-service',
    module: 'invoicing',
    action: 'write',
    color: 'yellow',
    href: '/finance/invoices/new'
  },
  {
    id: 'add-item',
    label: 'Add Item',
    icon: IconPackage,
    service: 'inventory-service',
    module: 'stock-management',
    action: 'write',
    color: 'orange',
    href: '/inventory/items/new'
  },
  {
    id: 'new-sale',
    label: 'New Sale',
    icon: IconCash,
    service: 'pos-service',
    module: 'sales',
    action: 'write',
    color: 'purple',
    href: '/pos/sales/new'
  },
  {
    id: 'add-employee',
    label: 'Add Employee',
    icon: IconUsers,
    service: 'hr-service',
    module: 'employee-management',
    action: 'write',
    color: 'cyan',
    href: '/hr/employees/new'
  },
  {
    id: 'track-shipment',
    label: 'Track Shipment',
    icon: IconTruck,
    service: 'logistics-service',
    module: 'shipment-tracking',
    action: 'read',
    color: 'teal',
    href: '/logistics/shipments'
  },
  {
    id: 'send-notification',
    label: 'Send Notification',
    icon: IconBell,
    service: 'notification-service',
    module: 'email-notifications',
    action: 'write',
    color: 'pink',
    href: '/notifications/send'
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    icon: IconChartBar,
    service: 'finance-service',
    module: 'reporting',
    action: 'read',
    color: 'gray',
    href: '/reports'
  },
  {
    id: 'search',
    label: 'Search',
    icon: IconSearch,
    service: null,
    module: null,
    action: null,
    color: 'gray',
    href: '/search'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: IconSettings,
    service: null,
    module: null,
    action: null,
    color: 'gray',
    href: '/settings'
  }
];

export function MobileQuickActions({ user, enabledServices, accessibleServices, onNavigate }: MobileQuickActionsProps) {
  // Filter actions based on user permissions and enabled services
  const availableActions = quickActions.filter(action => {
    // Always show search and settings
    if (!action.service) return true;
    
    // Check if service is enabled and user has permission
    const service = accessibleServices.find(s => s.name === action.service);
    if (!service) return false;
    
    const module = service.config.modules.find(m => m.name === action.module);
    if (!module) return false;
    
    const permissionKey = `${action.service}:${action.module}:${action.action}`;
    return user.permissions.includes(permissionKey);
  });

  // Group actions by service for better organization
  const groupedActions = availableActions.reduce((acc, action) => {
    const service = action.service || 'general';
    if (!acc[service]) {
      acc[service] = [];
    }
    acc[service].push(action);
    return acc;
  }, {} as Record<string, typeof quickActions>);

  const handleActionClick = (href: string) => {
    onNavigate(href);
  };

  return (
    <Card className="card" shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text fw={500} size="sm">
            Quick Actions
          </Text>
          <Badge color="blue" variant="light" size="sm">
            {availableActions.length} available
          </Badge>
        </Group>
      </Card.Section>

      <Stack spacing="md" mt="md">
        {Object.entries(groupedActions).map(([service, actions]) => (
          <div key={service}>
            {service !== 'general' && (
              <Text size="xs" color="dimmed" mb="xs" tt="uppercase" fw={500}>
                {service.replace('-service', '')}
              </Text>
            )}
            
            <SimpleGrid cols={2} spacing="xs">
              {actions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="light"
                    size="sm"
                    color={action.color as any}
                    leftSection={<IconComponent size="1rem" />}
                    onClick={() => handleActionClick(action.href)}
                    fullWidth
                    compact
                  >
                    {action.label}
                  </Button>
                );
              })}
            </SimpleGrid>
          </div>
        ))}
      </Stack>

      {availableActions.length === 0 && (
        <Stack align="center" py="md">
          <Text size="sm" color="dimmed" align="center">
            No quick actions available for your current permissions.
          </Text>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate('/settings')}
          >
            View Settings
          </Button>
        </Stack>
      )}
    </Card>
  );
} 