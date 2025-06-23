# Frontend Tenancy Guide for EasyCode Platform

## Overview

When all services are backend, the frontend needs to understand tenant context and entitlements to provide the appropriate user experience. This guide explains how tenancy works on the frontend and how users interact with the multi-tenant system.

## 1. Tenant Context in Frontend

### 1.1 How Users Access the Platform

Users access the platform through different entry points:

```typescript
// Different ways users access the platform
const accessPatterns = {
  // 1. Subdomain-based access
  subdomain: 'client-company.easycode.com',
  
  // 2. Path-based access  
  path: 'easycode.com/tenant/client-company',
  
  // 3. Custom domain
  customDomain: 'app.clientcompany.com',
  
  // 4. Query parameter
  queryParam: 'easycode.com?tenant=client-company'
};
```

### 1.2 Tenant Identification

The frontend needs to identify which tenant context it's operating in:

```typescript
// apps/main-ui/src/utils/tenantContext.ts
export class TenantContext {
  static getTenantId(): string {
    // 1. From subdomain
    const hostname = window.location.hostname;
    if (hostname.includes('.easycode.com')) {
      return hostname.split('.')[0];
    }
    
    // 2. From path
    const pathParts = window.location.pathname.split('/');
    const tenantIndex = pathParts.indexOf('tenant');
    if (tenantIndex !== -1 && pathParts[tenantIndex + 1]) {
      return pathParts[tenantIndex + 1];
    }
    
    // 3. From query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    if (tenantParam) {
      return tenantParam;
    }
    
    // 4. From localStorage (for authenticated sessions)
    const storedTenant = localStorage.getItem('currentTenantId');
    if (storedTenant) {
      return storedTenant;
    }
    
    throw new Error('No tenant context found');
  }
  
  static setTenantId(tenantId: string): void {
    localStorage.setItem('currentTenantId', tenantId);
  }
}
```

## 2. Tenant-Aware Frontend Architecture

### 2.1 Tenant Provider Pattern

```tsx
// apps/main-ui/src/providers/TenantProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenantService } from '../services/tenantService';

interface TenantContextType {
  tenantId: string;
  tenant: Tenant | null;
  entitlements: TenantEntitlements | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string>('');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [entitlements, setEntitlements] = useState<TenantEntitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const tenantService = new TenantService();
  
  const loadTenantData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [tenantData, entitlementsData] = await Promise.all([
        tenantService.getTenantDetails(id),
        tenantService.getTenantEntitlements(id)
      ]);
      
      setTenant(tenantData);
      setEntitlements(entitlementsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const id = TenantContext.getTenantId();
    setTenantId(id);
    loadTenantData(id);
  }, []);
  
  const refreshTenant = () => {
    if (tenantId) {
      loadTenantData(tenantId);
    }
  };
  
  return (
    <TenantContext.Provider value={{
      tenantId,
      tenant,
      entitlements,
      loading,
      error,
      refreshTenant
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
```

### 2.2 App-Level Integration

```tsx
// apps/main-ui/pages/_app.tsx
import { TenantProvider } from '../src/providers/TenantProvider';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { EasyCodeProvider } from '@easycode/ui-library';
import '../styles/globals.css';
import '../styles/components.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <Notifications />
      <EasyCodeProvider>
        <TenantProvider>
          <Component {...pageProps} />
        </TenantProvider>
      </EasyCodeProvider>
    </MantineProvider>
  );
}
```

## 3. Tenant-Aware Navigation & Routing

### 3.1 Dynamic Navigation Based on Entitlements

```tsx
// apps/main-ui/src/components/TenantNavigation.tsx
import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Navbar, NavLink, Group, Text, Badge } from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconSettings 
} from '@tabler/icons-react';

export function TenantNavigation() {
  const { entitlements, loading } = useTenant();
  
  if (loading) {
    return <div>Loading navigation...</div>;
  }
  
  const enabledServices = Object.entries(entitlements?.services || {})
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => ({
      name: serviceName,
      modules: config.modules || []
    }));
  
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: IconBuilding,
      href: '/dashboard',
      alwaysShow: true
    },
    {
      label: 'User Management',
      icon: IconUsers,
      href: '/users',
      service: 'user-service'
    },
    {
      label: 'CRM',
      icon: IconBuilding,
      href: '/crm',
      service: 'crm-service'
    },
    {
      label: 'Finance',
      icon: IconCash,
      href: '/finance',
      service: 'finance-service'
    },
    {
      label: 'Inventory',
      icon: IconPackage,
      href: '/inventory',
      service: 'inventory-service'
    },
    {
      label: 'Logistics',
      icon: IconTruck,
      href: '/logistics',
      service: 'logistics-service'
    },
    {
      label: 'Notifications',
      icon: IconBell,
      href: '/notifications',
      service: 'notification-service'
    },
    {
      label: 'Settings',
      icon: IconSettings,
      href: '/settings',
      alwaysShow: true
    }
  ];
  
  const visibleItems = navigationItems.filter(item => 
    item.alwaysShow || enabledServices.some(service => service.name === item.service)
  );
  
  return (
    <Navbar width={{ base: 300 }} p="md">
      <Navbar.Section>
        <Text size="lg" weight={500} mb="md">
          EasyCode Platform
        </Text>
      </Navbar.Section>
      
      <Navbar.Section grow>
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            leftSection={<item.icon size="1.2rem" stroke={1.5} />}
            href={item.href}
            mb="xs"
          />
        ))}
      </Navbar.Section>
      
      <Navbar.Section>
        <Group>
          <Badge color="green" size="sm">
            {enabledServices.length} Services
          </Badge>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}
```

### 3.2 Protected Routes

```tsx
// apps/main-ui/src/components/ProtectedRoute.tsx
import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Card, Text, Button } from '@mantine/core';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  
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
            <Text>This feature requires the {requiredService} service.</Text>
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
            <Text>This feature requires the {requiredModule} module.</Text>
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
```

## 4. Tenant-Aware Components

### 4.1 Service-Specific Components

```tsx
// apps/main-ui/src/components/ServiceWrapper.tsx
import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Card, Text, Button } from '@mantine/core';

interface ServiceWrapperProps {
  serviceName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ServiceWrapper({ 
  serviceName, 
  children, 
  fallback 
}: ServiceWrapperProps) {
  const { entitlements } = useTenant();
  
  const serviceConfig = entitlements?.services[serviceName];
  
  if (!serviceConfig?.enabled) {
    return fallback || (
      <Card className="card">
        <div className="alert alert-info">
          <Text>The {serviceName} service is not enabled for your tenant.</Text>
          <Button 
            variant="outline" 
            size="sm" 
            mt="md"
            onClick={() => window.location.href = '/settings'}
          >
            View Settings
          </Button>
        </div>
      </Card>
    );
  }
  
  return <>{children}</>;
}

// Usage example
export function FinanceDashboard() {
  return (
    <ServiceWrapper serviceName="finance-service">
      <div>
        <h1>Finance Dashboard</h1>
        {/* Finance-specific content */}
      </div>
    </ServiceWrapper>
  );
}
```

### 4.2 Tenant-Specific Branding

```tsx
// apps/main-ui/src/components/TenantBranding.tsx
import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Group, Text, Avatar } from '@mantine/core';

export function TenantBranding() {
  const { tenant } = useTenant();
  
  if (!tenant) return null;
  
  return (
    <Group>
      <Avatar 
        src={tenant.logoUrl} 
        alt={tenant.name}
        size="md"
      >
        {tenant.name.charAt(0)}
      </Avatar>
      <div>
        <Text size="sm" weight={500}>
          {tenant.name}
        </Text>
        <Text size="xs" color="dimmed">
          Tenant ID: {tenant.id}
        </Text>
      </div>
    </Group>
  );
}
```

## 5. Tenant-Aware API Calls

### 5.1 API Client with Tenant Context

```typescript
// apps/main-ui/src/services/apiClient.ts
import { useTenant } from '../providers/TenantProvider';

export class ApiClient {
  private baseURL: string;
  private tenantId: string;
  
  constructor(baseURL: string, tenantId: string) {
    this.baseURL = baseURL;
    this.tenantId = tenantId;
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': this.tenantId,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Hook to use API client with tenant context
export function useApiClient(serviceName: string) {
  const { tenantId } = useTenant();
  
  const serviceUrls = {
    'user-service': process.env.NEXT_PUBLIC_USER_SERVICE_URL,
    'crm-service': process.env.NEXT_PUBLIC_CRM_SERVICE_URL,
    'finance-service': process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL,
    'inventory-service': process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL,
    // ... other services
  };
  
  const baseURL = serviceUrls[serviceName as keyof typeof serviceUrls];
  
  if (!baseURL) {
    throw new Error(`Service URL not configured for ${serviceName}`);
  }
  
  return new ApiClient(baseURL, tenantId);
}
```

### 5.2 Service-Specific Hooks

```typescript
// apps/main-ui/src/hooks/useUserService.ts
import { useState, useEffect } from 'react';
import { useApiClient } from '../services/apiClient';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiClient = useApiClient('user-service');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/users');
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return { users, loading, error };
}

// apps/main-ui/src/hooks/useCrmService.ts
export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiClient = useApiClient('crm-service');
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/leads');
        setLeads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  return { leads, loading, error };
}
```

## 6. Tenant Switching & Multi-Tenant Support

### 6.1 Tenant Switcher Component

```tsx
// apps/main-ui/src/components/TenantSwitcher.tsx
import React, { useState } from 'react';
import { Select, Button, Modal, TextInput } from '@mantine/core';
import { useTenant } from '../providers/TenantProvider';

export function TenantSwitcher() {
  const { tenantId, refreshTenant } = useTenant();
  const [opened, setOpened] = useState(false);
  const [newTenantId, setNewTenantId] = useState('');
  
  const handleTenantSwitch = () => {
    if (newTenantId) {
      // Update URL to reflect new tenant
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('tenant', newTenantId);
      window.history.pushState({}, '', currentUrl.toString());
      
      // Update localStorage
      localStorage.setItem('currentTenantId', newTenantId);
      
      // Refresh tenant data
      refreshTenant();
      
      setOpened(false);
      setNewTenantId('');
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpened(true)}
      >
        Switch Tenant
      </Button>
      
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)}
        title="Switch Tenant"
      >
        <div className="space-y-4">
          <Text size="sm" color="dimmed">
            Current Tenant: {tenantId}
          </Text>
          
          <TextInput
            label="New Tenant ID"
            value={newTenantId}
            onChange={(e) => setNewTenantId(e.target.value)}
            placeholder="Enter tenant ID"
          />
          
          <Button onClick={handleTenantSwitch} disabled={!newTenantId}>
            Switch
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

## 7. Error Handling for Tenant Issues

### 7.1 Tenant Error Boundaries

```tsx
// apps/main-ui/src/components/TenantErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TenantErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tenant error caught:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleSwitchTenant = () => {
    // Clear tenant context and redirect to tenant selection
    localStorage.removeItem('currentTenantId');
    window.location.href = '/tenant-select';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="card">
          <div className="alert alert-error">
            <Text weight={500} mb="md">
              Tenant Error
            </Text>
            <Text size="sm" mb="md">
              {this.state.error?.message || 'An error occurred with tenant data'}
            </Text>
            
            <Group>
              <Button size="sm" onClick={this.handleRetry}>
                Retry
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={this.handleSwitchTenant}
              >
                Switch Tenant
              </Button>
            </Group>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

## 8. Tenant Configuration & Settings

### 8.1 Tenant Settings Page

```tsx
// apps/main-ui/src/pages/tenant-settings.tsx
import React from 'react';
import { useTenant } from '../providers/TenantProvider';
import { Card, Text, Badge, Group, Button } from '@mantine/core';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function TenantSettings() {
  const { tenant, entitlements, loading } = useTenant();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Tenant Settings</h1>
        
        <Card className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Tenant Information</h2>
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
      </div>
    </ProtectedRoute>
  );
}
```

## 9. Summary

### Key Concepts:

1. **Tenant Context**: Every user interaction happens within a tenant context
2. **Service Entitlements**: Frontend checks what services/modules the tenant has access to
3. **Dynamic UI**: Navigation, components, and features are shown/hidden based on entitlements
4. **API Calls**: All API calls include tenant context in headers
5. **Error Handling**: Graceful handling of tenant-related errors

### User Experience:

- **Single Sign-On**: Users log in once and access all enabled services
- **Seamless Navigation**: Only see features they have access to
- **Contextual Errors**: Clear messages when features aren't available
- **Tenant Switching**: Ability to switch between tenants (for admin users)

This architecture ensures that users only see and can access what their tenant is entitled to, while maintaining a consistent and professional user experience across all services. 