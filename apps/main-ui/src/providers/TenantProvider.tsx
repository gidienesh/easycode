import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  logoUrl?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceModule {
  name: string;
  enabled: boolean;
  permissions: string[];
}

export interface ServiceConfig {
  enabled: boolean;
  modules: ServiceModule[];
  features: string[];
}

export interface TenantEntitlements {
  services: {
    [serviceName: string]: ServiceConfig;
  };
  features: string[];
  limits: {
    [key: string]: number;
  };
}

export interface TenantContextType {
  tenantId: string;
  tenant: Tenant | null;
  entitlements: TenantEntitlements | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => void;
  hasService: (serviceName: string) => boolean;
  hasModule: (serviceName: string, moduleName: string) => boolean;
  hasFeature: (featureName: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Mock tenant service for development
class TenantService {
  async getTenantDetails(tenantId: string): Promise<Tenant> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: tenantId,
      name: `Tenant ${tenantId}`,
      status: 'active',
      logoUrl: `https://ui-avatars.com/api/?name=${tenantId}&background=random`,
      domain: `${tenantId}.easycode.com`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getTenantEntitlements(tenantId: string): Promise<TenantEntitlements> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock entitlements based on tenant ID
    const mockEntitlements: TenantEntitlements = {
      services: {
        'user-service': {
          enabled: true,
          modules: [
            { name: 'user-management', enabled: true, permissions: ['read', 'write', 'delete'] },
            { name: 'role-management', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['user-creation', 'bulk-import', 'advanced-permissions']
        },
        'crm-service': {
          enabled: true,
          modules: [
            { name: 'leads', enabled: true, permissions: ['read', 'write'] },
            { name: 'contacts', enabled: true, permissions: ['read', 'write'] },
            { name: 'accounts', enabled: true, permissions: ['read', 'write'] },
            { name: 'opportunities', enabled: true, permissions: ['read', 'write'] },
            { name: 'activities', enabled: true, permissions: ['read', 'write'] },
            { name: 'reports', enabled: true, permissions: ['read', 'write'] },
            { name: 'email-templates', enabled: true, permissions: ['read', 'write'] },
            { name: 'sms-templates', enabled: true, permissions: ['read', 'write'] },
            { name: 'call-logs', enabled: true, permissions: ['read', 'write'] },
            { name: 'meeting-notes', enabled: true, permissions: ['read', 'write'] },
            { name: 'whatsapp-logs', enabled: true, permissions: ['read', 'write'] },
            { name: 'activity-feed', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['lead-scoring', 'email-integration', 'reporting']
        },
        'equipment-maintenance-service': {
          enabled: true,
          modules: [
            { name: 'asset-registry', enabled: true, permissions: ['read', 'write'] },
            { name: 'work-orders', enabled: true, permissions: ['read', 'write'] },
            { name: 'preventive', enabled: true, permissions: ['read', 'write'] },
            { name: 'corrective', enabled: true, permissions: ['read', 'write'] },
            { name: 'checklists', enabled: true, permissions: ['read', 'write'] },
            { name: 'history', enabled: true, permissions: ['read', 'write'] },
            { name: 'schedule', enabled: true, permissions: ['read', 'write'] },
            { name: 'technicians', enabled: true, permissions: ['read', 'write'] },
            { name: 'parts', enabled: true, permissions: ['read', 'write'] },
            { name: 'reports', enabled: true, permissions: ['read', 'write'] },
            { name: 'analytics', enabled: true, permissions: ['read', 'write'] },
            { name: 'qr-codes', enabled: true, permissions: ['read', 'write'] },
            { name: 'asset-types', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['asset-tracking', 'maintenance-scheduling', 'spare-parts-management']
        },
        'project-management-service': {
          enabled: true,
          modules: [
            { name: 'projects', enabled: true, permissions: ['read', 'write'] },
            { name: 'tasks', enabled: true, permissions: ['read', 'write'] },
            { name: 'timeline', enabled: true, permissions: ['read', 'write'] },
            { name: 'gantt', enabled: true, permissions: ['read', 'write'] },
            { name: 'calendar', enabled: true, permissions: ['read', 'write'] },
            { name: 'resources', enabled: true, permissions: ['read', 'write'] },
            { name: 'time-tracking', enabled: true, permissions: ['read', 'write'] },
            { name: 'milestones', enabled: true, permissions: ['read', 'write'] },
            { name: 'workspaces', enabled: true, permissions: ['read', 'write'] },
            { name: 'reports', enabled: true, permissions: ['read', 'write'] },
            { name: 'dashboards', enabled: true, permissions: ['read', 'write'] },
            { name: 'files', enabled: true, permissions: ['read', 'write'] },
            { name: 'comments', enabled: true, permissions: ['read', 'write'] },
            { name: 'activity', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['task-management', 'resource-allocation', 'project-reports']
        },
        'hr-service': {
          enabled: true,
          modules: [
            { name: 'employees', enabled: true, permissions: ['read', 'write'] },
            { name: 'departments', enabled: true, permissions: ['read', 'write'] },
            { name: 'positions', enabled: true, permissions: ['read', 'write'] },
            { name: 'payroll', enabled: true, permissions: ['read', 'write'] },
            { name: 'leave', enabled: true, permissions: ['read', 'write'] },
            { name: 'leave-balances', enabled: true, permissions: ['read', 'write'] },
            { name: 'leave-requests', enabled: true, permissions: ['read', 'write'] },
            { name: 'performance', enabled: true, permissions: ['read', 'write'] },
            { name: 'recruitment', enabled: true, permissions: ['read', 'write'] },
            { name: 'job-requisitions', enabled: true, permissions: ['read', 'write'] },
            { name: 'candidates', enabled: true, permissions: ['read', 'write'] },
            { name: 'interviews', enabled: true, permissions: ['read', 'write'] },
            { name: 'onboarding', enabled: true, permissions: ['read', 'write'] },
            { name: 'offboarding', enabled: true, permissions: ['read', 'write'] },
            { name: 'documents', enabled: true, permissions: ['read', 'write'] },
            { name: 'reports', enabled: true, permissions: ['read', 'write'] },
            { name: 'org-chart', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['employee-directory', 'payroll-processing', 'performance-management']
        },
        'finance-service': {
          enabled: true,
          modules: [
            { name: 'gl', enabled: true, permissions: ['read', 'write'] },
            { name: 'accounts', enabled: true, permissions: ['read', 'write'] },
            { name: 'journal-entries', enabled: true, permissions: ['read', 'write'] },
            { name: 'ap', enabled: true, permissions: ['read', 'write'] },
            { name: 'ar', enabled: true, permissions: ['read', 'write'] },
            { name: 'assets', enabled: true, permissions: ['read', 'write'] },
            { name: 'invoices', enabled: true, permissions: ['read', 'write'] },
            { name: 'payments', enabled: true, permissions: ['read', 'write'] },
            { name: 'bank-reconciliation', enabled: true, permissions: ['read', 'write'] },
            { name: 'trial-balance', enabled: true, permissions: ['read', 'write'] },
            { name: 'reports', enabled: true, permissions: ['read', 'write'] },
            { name: 'balance-sheet', enabled: true, permissions: ['read', 'write'] },
            { name: 'income-statement', enabled: true, permissions: ['read', 'write'] },
            { name: 'cash-flow', enabled: true, permissions: ['read', 'write'] },
            { name: 'budgets', enabled: true, permissions: ['read', 'write'] },
            { name: 'tax', enabled: true, permissions: ['read', 'write'] },
            { name: 'currency', enabled: true, permissions: ['read', 'write'] },
            { name: 'dimensions', enabled: true, permissions: ['read', 'write'] },
            { name: 'audit', enabled: true, permissions: ['read', 'write'] },
            { name: 'dashboards', enabled: true, permissions: ['read', 'write'] },
          ],
          features: ['multi-currency', 'tax-calculation', 'audit-trail']
        },
        'inventory-service': {
          enabled: tenantId.includes('inventory'),
          modules: [
            { name: 'stock-management', enabled: true, permissions: ['read', 'write'] },
            { name: 'purchase-orders', enabled: true, permissions: ['read', 'write'] },
            { name: 'supplier-management', enabled: tenantId.includes('premium'), permissions: ['read', 'write'] },
          ],
          features: ['barcode-scanning', 'low-stock-alerts', 'supplier-portal']
        },
        'pos-service': {
          enabled: tenantId.includes('pos'),
          modules: [
            { name: 'sales', enabled: true, permissions: ['read', 'write'] },
            { name: 'payments', enabled: true, permissions: ['read', 'write'] },
            { name: 'returns', enabled: tenantId.includes('premium'), permissions: ['read', 'write'] },
          ],
          features: ['offline-mode', 'multi-payment-methods', 'loyalty-program']
        },
        'logistics-service': {
          enabled: tenantId.includes('logistics'),
          modules: [
            { name: 'shipment-tracking', enabled: true, permissions: ['read', 'write'] },
            { name: 'route-optimization', enabled: tenantId.includes('premium'), permissions: ['read', 'write'] },
          ],
          features: ['real-time-tracking', 'delivery-notifications', 'carrier-integration']
        },
        'notification-service': {
          enabled: true,
          modules: [
            { name: 'email-notifications', enabled: true, permissions: ['read', 'write'] },
            { name: 'sms-notifications', enabled: tenantId.includes('premium'), permissions: ['read', 'write'] },
          ],
          features: ['template-management', 'scheduled-notifications', 'analytics']
        }
      },
      features: ['dashboard', 'reporting', 'api-access'],
      limits: {
        users: tenantId.includes('premium') ? 1000 : 100,
        storage: tenantId.includes('premium') ? '100GB' : '10GB',
        apiCalls: tenantId.includes('premium') ? 10000 : 1000,
      }
    };
    
    return mockEntitlements;
  }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>('');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [entitlements, setEntitlements] = useState<TenantEntitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const tenantService = new TenantService();
  
  const getTenantId = (): string => {
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
    
    // Default for development
    return 'demo-tenant';
  };
  
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
    const id = getTenantId();
    setTenantId(id);
    loadTenantData(id);
  }, []);
  
  const refreshTenant = () => {
    if (tenantId) {
      loadTenantData(tenantId);
    }
  };
  
  const hasService = (serviceName: string): boolean => {
    return entitlements?.services[serviceName]?.enabled || false;
  };
  
  const hasModule = (serviceName: string, moduleName: string): boolean => {
    const service = entitlements?.services[serviceName];
    return service?.enabled && 
           service.modules?.some(module => module.name === moduleName && module.enabled) || false;
  };
  
  const hasFeature = (featureName: string): boolean => {
    return entitlements?.features?.includes(featureName) || false;
  };
  
  return (
    <TenantContext.Provider value={{
      tenantId,
      tenant,
      entitlements,
      loading,
      error,
      refreshTenant,
      hasService,
      hasModule,
      hasFeature
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