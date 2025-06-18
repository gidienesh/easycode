export interface ClientCompany {
  id: string; // UUID
  name: string;
  contactEmail?: string;
  status: 'active' | 'pending_onboarding' | 'suspended';
  // Could link to one or more tenantIds if a client can have multiple environments
  tenantIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleDefinition {
  id: string; // e.g., 'leads', 'item_management'
  name: string;
  description?: string;
}

export interface ServiceDefinition {
  id: string; // e.g., 'crm-service', 'inventory-service'
  name: string;
  description?: string;
  availableVersions: string[];
  modules: ModuleDefinition[];
  defaultConfig?: Record<string, any>; // Default settings for a service
}

export interface EntitlementPackage {
  id: string; // e.g., 'basic_plan', 'premium_plan'
  name: string;
  description?: string;
  // Defines what services and modules are included, and any default settings/limits
  services: Array<{
    serviceDefinitionId: string;
    version: string; // Specific version for this package
    enabledModules: string[]; // Array of module IDs
    config?: Record<string, any>; // Package-specific overrides or limits
  }>;
}

// This represents the configuration that tenant-service would ultimately consume for a specific tenant
export interface TenantServiceAssignment {
  tenantId: string;
  clientCompanyId: string;
  assignedPackageId?: string; // Optional link to a package
  // Detailed breakdown of services, modules, and their configurations for THIS tenant
  services: Record<string, { // Keyed by serviceDefinitionId
    enabled: boolean;
    version: string;
    modules: Record<string, { // Keyed by moduleDefinitionId
      enabled: boolean;
      config?: Record<string, any>;
    }>;
    serviceWideConfig?: Record<string, any>;
  }>;
  lastUpdatedAt: Date;
}
