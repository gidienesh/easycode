import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Card, Text, Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredService?: string;
  requiredModule?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredService, 
  requiredModule 
}: ProtectedRouteProps) {
  const { entitlements, loading, tenant } = useTenant();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!tenant || tenant.status !== 'active') {
    return (
      <Card className="card">
        <div className="alert alert-error">
          <Text>Tenant is not active or not found.</Text>
        </div>
      </Card>
    );
  }
  
  if (requiredService) {
    const serviceConfig = entitlements?.services[requiredService];
    if (!serviceConfig?.enabled) {
      return (
        <Card className="card">
          <div className="alert alert-warning">
            <Text>The {requiredService} service is not enabled for your tenant.</Text>
            <Text size="sm" color="dimmed" mt="xs">
              Contact your administrator to enable this service.
            </Text>
          </div>
        </Card>
      );
    }
    
    if (requiredModule && !serviceConfig.modules?.includes(requiredModule)) {
      return (
        <Card className="card">
          <div className="alert alert-warning">
            <Text>The {requiredModule} module is not enabled for your tenant.</Text>
            <Text size="sm" color="dimmed" mt="xs">
              Contact your administrator to enable this module.
            </Text>
          </div>
        </Card>
      );
    }
  }
  
  return <>{children}</>;
} 