export interface TenantServiceConfig {
  version: string;
  specificConfig?: Record<string, any>; // For service-specific settings
}

export interface TenantEntitlements {
  tenantId: string;
  // Using a flexible structure for services and their modules/configs
  // as per README's "enabledServices" and "enabledModules"
  services: Record<string, {
    enabled: boolean;
    version?: string; // Version of the service tenant is entitled to
    modules?: string[]; // Specific modules enabled within the service
    config?: Record<string, any>; // Other specific configurations
  }>;
  version: string; // Version of this entitlement set
  lastUpdatedAt: Date;
}

export interface Tenant {
  id: string; // UUID
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  // other tenant-specific configurations can be added here
  // For example, domain, branding settings, etc.
  createdAt: Date;
  updatedAt: Date;
}
