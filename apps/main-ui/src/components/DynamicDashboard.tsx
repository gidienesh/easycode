import React from 'react';
import { 
  Grid, 
  Text, 
  Group, 
  Badge, 
  LoadingOverlay, 
  Alert,
  Stack,
  Title,
  Container,
  Box
} from '@mantine/core';
import { 
  IconAlertCircle
} from '@tabler/icons-react';
import { useTenant } from '../providers/TenantProvider';
import { useUser } from '../providers/UserProvider';
import { ServiceOverviewCard } from './dashboard/ServiceOverviewCard';
import { MobileServiceCard } from './dashboard/MobileServiceCard';
import { QuickActionsCard } from './dashboard/QuickActionsCard';
import { MobileQuickActions } from './dashboard/MobileQuickActions';
import { RecentActivityCard } from './dashboard/RecentActivityCard';
import { MetricsCard } from './dashboard/MetricsCard';
import { MobileBreadcrumbs } from './MobileBreadcrumbs';

export function DynamicDashboard() {
  const { tenant, entitlements, loading: tenantLoading, error: tenantError } = useTenant();
  const { user, loading: userLoading, error: userError } = useUser();

  if (tenantLoading || userLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (tenantError || userError) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {tenantError || userError}
        </Alert>
      </Container>
    );
  }

  if (!tenant || !user) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Access Denied" color="red">
          Unable to load tenant or user information.
        </Alert>
      </Container>
    );
  }

  // Get enabled services
  const enabledServices = Object.entries(entitlements?.services || {})
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => ({
      name: serviceName,
      config
    }));

  // Get user's accessible services (intersection of tenant entitlements and user permissions)
  const accessibleServices = enabledServices.filter(service => {
    return service.config.modules.some(module => 
      user.permissions.some(permission => 
        permission.startsWith(`${service.name}:${module.name}:`)
      )
    );
  });

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <Container size="xl" py="md">
      {/* Mobile Breadcrumbs */}
      <Box mb="md" display={{ base: 'block', sm: 'none' }}>
        <MobileBreadcrumbs 
          currentPath={window.location.pathname} 
          onNavigate={handleNavigation}
        />
      </Box>

      {/* Header */}
      <Stack gap="lg" mb="xl">
        <Group justify="space-between">
          <div>
            <Title order={1} size="h2">
              Welcome back, {user.firstName}!
            </Title>
            <Text c="dimmed" size="sm">
              {tenant.name} • {enabledServices.length} services enabled
            </Text>
          </div>
          <Group display={{ base: 'none', sm: 'flex' }}>
            <Badge color="green" size="lg">
              {tenant.status}
            </Badge>
          </Group>
        </Group>
      </Stack>

      {/* Quick Actions */}
      <Grid mb="xl">
        <Grid.Col span={12}>
          {/* Desktop Quick Actions */}
          <Box display={{ base: 'none', sm: 'block' }}>
            <QuickActionsCard 
              user={user} 
              enabledServices={enabledServices}
              accessibleServices={accessibleServices}
            />
          </Box>

          {/* Mobile Quick Actions */}
          <Box display={{ base: 'block', sm: 'none' }}>
            <MobileQuickActions 
              user={user} 
              enabledServices={enabledServices}
              accessibleServices={accessibleServices}
              onNavigate={handleNavigation}
            />
          </Box>
        </Grid.Col>
      </Grid>

      {/* Main Dashboard Grid */}
      <Grid gutter="md">
        {/* Service Overview Cards - Desktop */}
        <Grid.Col span={12} display={{ base: 'none', sm: 'block' }}>
          <Grid gutter="md">
            {accessibleServices.map((service) => (
              <Grid.Col key={service.name} span={{ base: 12, sm: 6, lg: 4 }}>
                <ServiceOverviewCard 
                  service={service}
                  user={user}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>

        {/* Service Overview Cards - Mobile */}
        <Grid.Col span={12} display={{ base: 'block', sm: 'none' }}>
          <Stack gap="md">
            {accessibleServices.map((service) => (
              <MobileServiceCard 
                key={service.name}
                service={service}
                user={user}
                onNavigate={handleNavigation}
              />
            ))}
          </Stack>
        </Grid.Col>

        {/* Metrics Cards */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <MetricsCard 
            enabledServices={enabledServices}
            accessibleServices={accessibleServices}
          />
        </Grid.Col>

        {/* Recent Activity */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RecentActivityCard 
            user={user}
            accessibleServices={accessibleServices}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 