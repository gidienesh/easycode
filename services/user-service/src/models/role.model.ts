export interface Permission {
  id: string; // e.g., 'crm:lead:create'
  description?: string;
}

export interface Role {
  id: string; // e.g., 'tenant_admin', 'sales_representative'
  tenantId?: string; // Some roles might be global, others tenant-specific
  name: string;
  description?: string;
  permissions: Permission[]; // Array of Permission objects or just their IDs
  isSystemRole?: boolean; // To distinguish system roles like tenant_admin
  createdAt: Date;
  updatedAt: Date;
}
