import React from 'react';
import { Card, Text, Group, Stack, Badge, Avatar, Timeline } from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-react';
import { User } from '../../providers/UserProvider';

interface RecentActivityCardProps {
  user: User;
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
}

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: 'user-created',
    service: 'user-service',
    title: 'New user created',
    description: 'John Smith was added to the system',
    user: 'admin@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'success',
    icon: IconUsers,
    color: 'blue'
  },
  {
    id: 2,
    type: 'lead-added',
    service: 'crm-service',
    title: 'New lead captured',
    description: 'Lead "Acme Corp" was added to CRM',
    user: 'sales@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'info',
    icon: IconBuilding,
    color: 'green'
  },
  {
    id: 3,
    type: 'invoice-created',
    service: 'finance-service',
    title: 'Invoice generated',
    description: 'Invoice #INV-2024-001 was created',
    user: 'finance@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'success',
    icon: IconCash,
    color: 'yellow'
  },
  {
    id: 4,
    type: 'stock-updated',
    service: 'inventory-service',
    title: 'Stock level updated',
    description: 'Product "Widget Pro" stock updated to 150 units',
    user: 'inventory@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: 'warning',
    icon: IconPackage,
    color: 'orange'
  },
  {
    id: 5,
    type: 'shipment-delivered',
    service: 'logistics-service',
    title: 'Shipment delivered',
    description: 'Shipment #SHIP-2024-005 was delivered successfully',
    user: 'logistics@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'success',
    icon: IconTruck,
    color: 'teal'
  },
  {
    id: 6,
    type: 'notification-sent',
    service: 'notification-service',
    title: 'Bulk notification sent',
    description: 'Email notification sent to 45 users',
    user: 'notifications@demo.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: 'info',
    icon: IconBell,
    color: 'pink'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return IconCheck;
    case 'warning': return IconAlertCircle;
    case 'error': return IconAlertCircle;
    default: return IconInfoCircle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'green';
    case 'warning': return 'yellow';
    case 'error': return 'red';
    default: return 'blue';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export function RecentActivityCard({ user, accessibleServices }: RecentActivityCardProps) {
  // Filter activities based on accessible services
  const accessibleActivities = mockActivities.filter(activity => {
    return accessibleServices.some(service => service.name === activity.service);
  });

  // Get recent activities (last 10)
  const recentActivities = accessibleActivities.slice(0, 10);

  return (
    <Card className="card" shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text fw={500} size="sm">
            Recent Activity
          </Text>
          <Badge color="blue" variant="light" size="sm">
            {recentActivities.length} activities
          </Badge>
        </Group>
      </Card.Section>

      <Stack spacing="md" mt="md">
        {recentActivities.length > 0 ? (
          <Timeline active={0} bulletSize={24} lineWidth={2}>
            {recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              const StatusIcon = getStatusIcon(activity.status);
              const statusColor = getStatusColor(activity.status);
              
              return (
                <Timeline.Item 
                  key={activity.id}
                  bullet={
                    <IconComponent 
                      size={16} 
                      color={`var(--mantine-color-${activity.color}-6)`} 
                    />
                  }
                  title={
                    <Group position="apart" spacing="xs">
                      <Text size="sm" fw={500}>
                        {activity.title}
                      </Text>
                      <StatusIcon 
                        size={14} 
                        color={`var(--mantine-color-${statusColor}-6)`} 
                      />
                    </Group>
                  }
                >
                  <Stack spacing="xs">
                    <Text size="xs" color="dimmed">
                      {activity.description}
                    </Text>
                    <Group position="apart" spacing="xs">
                      <Group spacing="xs">
                        <Avatar 
                          size="xs" 
                          src={`https://ui-avatars.com/api/?name=${activity.user}&size=24`}
                        >
                          {activity.user.charAt(0)}
                        </Avatar>
                        <Text size="xs" color="dimmed">
                          {activity.user}
                        </Text>
                      </Group>
                      <Text size="xs" color="dimmed">
                        {formatTimeAgo(activity.timestamp)}
                      </Text>
                    </Group>
                    <Badge 
                      size="xs" 
                      variant="light" 
                      color={activity.color}
                    >
                      {activity.service.replace('-service', '')}
                    </Badge>
                  </Stack>
                </Timeline.Item>
              );
            })}
          </Timeline>
        ) : (
          <Stack align="center" py="md">
            <IconBell size={48} color="gray" />
            <Text size="sm" color="dimmed" align="center">
              No recent activity for your accessible services.
            </Text>
          </Stack>
        )}
      </Stack>

      {recentActivities.length > 0 && (
        <Group position="center" mt="md">
          <Text 
            size="xs" 
            color="blue" 
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/activity'}
          >
            View all activity
          </Text>
        </Group>
      )}
    </Card>
  );
} 