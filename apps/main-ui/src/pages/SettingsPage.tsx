import React from 'react';
import { Card, Text, Badge, Group, Button, Stack, Divider } from '@mantine/core';
import { useTenant } from '../providers/TenantProvider';
import { useUser } from '../providers/UserProvider';
import { IconSettings, IconUser, IconBuilding } from '@tabler/icons-react';

export function SettingsPage() {
  const { tenant, entitlements, loading } = useTenant();
  const { user } = useUser();
  
  if (loading) {
    return <div>Loading settings...</div>;
  }
  
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconSettings size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Settings
        </h1>
      </div>
      
      <Stack spacing="lg">
        {/* Tenant Information */}
        <Card className="card">
          <div className="card-header">
            <h2 className="card-title">
              <IconBuilding size="1.2rem" style={{ marginRight: '0.5rem' }} />
              Tenant Information
            </h2>
          </div>
          <div className="card-content">
            <Group>
              <Text>Name: {tenant?.name}</Text>
              <Badge color={tenant?.status === 'active' ? 'green' : 'red'}>
                {tenant?.status}
              </Badge>
            </Group>
            <Text size="sm" color="dimmed">
              Tenant ID: {tenant?.id}
            </Text>
          </div>
        </Card>
        
        {/* User Information */}
        <Card className="card">
          <div className="card-header">
            <h2 className="card-title">
              <IconUser size="1.2rem" style={{ marginRight: '0.5rem' }} />
              User Information
            </h2>
          </div>
          <div className="card-content">
            <Text>Name: {user?.firstName} {user?.lastName}</Text>
            <Text size="sm" color="dimmed">
              Role: {user?.role}
            </Text>
            <Text size="sm" color="dimmed">
              Email: {user?.email}
            </Text>
          </div>
        </Card>
        
        {/* Service Entitlements */}
        <Card className="card">
          <div className="card-header">
            <h2 className="card-title">Service Entitlements</h2>
          </div>
          <div className="card-content">
            {Object.entries(entitlements?.services || {}).map(([serviceName, config]) => (
              <div key={serviceName} className="mb-4">
                <Group>
                  <Text weight={500}>{serviceName}</Text>
                  <Badge color={config.enabled ? 'green' : 'red'}>
                    {config.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </Group>
                {config.modules && config.modules.length > 0 && (
                  <Text size="sm" color="dimmed">
                    Modules: {config.modules.join(', ')}
                  </Text>
                )}
              </div>
            ))}
          </div>
        </Card>
      </Stack>
    </div>
  );
} 