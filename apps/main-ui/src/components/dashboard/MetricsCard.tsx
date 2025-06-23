import React from 'react';
import { Card, Text, Group, Stack, RingProgress, Grid, Badge } from '@mantine/core';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconUsers, 
  IconCash,
  IconPackage,
  IconTruck,
  IconBell
} from '@tabler/icons-react';

interface MetricsCardProps {
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
}

// Mock metrics data
const mockMetrics = {
  totalUsers: { value: 45, change: 12, trend: 'up' },
  totalRevenue: { value: 125000, change: 8.5, trend: 'up' },
  totalOrders: { value: 234, change: -3, trend: 'down' },
  activeShipments: { value: 67, change: 15, trend: 'up' },
  inventoryItems: { value: 1234, change: 5, trend: 'up' },
  notifications: { value: 89, change: 22, trend: 'up' },
  systemHealth: { value: 98, change: 2, trend: 'up' },
  dataUsage: { value: 65, change: 8, trend: 'up' }
};

export function MetricsCard({ enabledServices, accessibleServices }: MetricsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'totalUsers': return IconUsers;
      case 'totalRevenue': return IconCash;
      case 'totalOrders': return IconPackage;
      case 'activeShipments': return IconTruck;
      case 'inventoryItems': return IconPackage;
      case 'notifications': return IconBell;
      default: return IconTrendingUp;
    }
  };

  const metrics = [
    {
      key: 'totalUsers',
      label: 'Total Users',
      value: mockMetrics.totalUsers.value,
      change: mockMetrics.totalUsers.change,
      trend: mockMetrics.totalUsers.trend,
      format: formatNumber,
      color: 'blue'
    },
    {
      key: 'totalRevenue',
      label: 'Total Revenue',
      value: mockMetrics.totalRevenue.value,
      change: mockMetrics.totalRevenue.change,
      trend: mockMetrics.totalRevenue.trend,
      format: formatCurrency,
      color: 'green'
    },
    {
      key: 'totalOrders',
      label: 'Total Orders',
      value: mockMetrics.totalOrders.value,
      change: mockMetrics.totalOrders.change,
      trend: mockMetrics.totalOrders.trend,
      format: formatNumber,
      color: 'orange'
    },
    {
      key: 'activeShipments',
      label: 'Active Shipments',
      value: mockMetrics.activeShipments.value,
      change: mockMetrics.activeShipments.change,
      trend: mockMetrics.activeShipments.trend,
      format: formatNumber,
      color: 'teal'
    }
  ];

  const progressMetrics = [
    {
      key: 'systemHealth',
      label: 'System Health',
      value: mockMetrics.systemHealth.value,
      color: 'green'
    },
    {
      key: 'dataUsage',
      label: 'Data Usage',
      value: mockMetrics.dataUsage.value,
      color: 'blue'
    }
  ];

  return (
    <Card className="card" shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text fw={500} size="sm">
            Key Metrics
          </Text>
          <Badge color="blue" variant="light" size="sm">
            {accessibleServices.length} services
          </Badge>
        </Group>
      </Card.Section>

      <Stack spacing="lg" mt="md">
        {/* Main Metrics Grid */}
        <Grid gutter="md">
          {metrics.map((metric) => {
            const IconComponent = getMetricIcon(metric.key);
            return (
              <Grid.Col key={metric.key} span={{ base: 6, sm: 3 }}>
                <Stack spacing="xs" align="center">
                  <IconComponent 
                    size={24} 
                    color={`var(--mantine-color-${metric.color}-6)`} 
                  />
                  <Text size="xl" fw={700}>
                    {metric.format(metric.value)}
                  </Text>
                  <Text size="xs" color="dimmed" align="center">
                    {metric.label}
                  </Text>
                  <Group spacing={4}>
                    {metric.trend === 'up' ? (
                      <IconTrendingUp size={12} color="green" />
                    ) : (
                      <IconTrendingDown size={12} color="red" />
                    )}
                    <Text 
                      size="xs" 
                      color={metric.trend === 'up' ? 'green' : 'red'}
                      fw={500}
                    >
                      {Math.abs(metric.change)}%
                    </Text>
                  </Group>
                </Stack>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Progress Metrics */}
        <Grid gutter="md">
          {progressMetrics.map((metric) => (
            <Grid.Col key={metric.key} span={{ base: 12, sm: 6 }}>
              <Stack align="center" spacing="xs">
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[{ value: metric.value, color: metric.color }]}
                  label={
                    <Text ta="center" size="xs" fw={700}>
                      {metric.value}%
                    </Text>
                  }
                />
                <Text size="sm" fw={500}>
                  {metric.label}
                </Text>
              </Stack>
            </Grid.Col>
          ))}
        </Grid>

        {/* Service Summary */}
        <Stack spacing="xs">
          <Text size="sm" fw={500} color="dimmed">
            Service Summary
          </Text>
          <Group spacing="xs">
            {accessibleServices.map((service) => (
              <Badge 
                key={service.name} 
                size="sm" 
                variant="light"
                color="blue"
              >
                {service.name.replace('-service', '')}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
} 