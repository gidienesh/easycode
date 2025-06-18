import { Request, Response } from 'express';
import { TenantServiceAssignment, ClientCompany } from '../models';

const mockClientCompanies: ClientCompany[] = [
    { id: 'stema-inc', name: 'Stema Inc.', status: 'active', tenantIds: ['stema-tenant-prod', 'stema-tenant-dev'], createdAt: new Date(), updatedAt: new Date(), contactEmail: 'contact@stema.inc'},
    { id: 'globex-corp', name: 'Globex Corporation', status: 'active', tenantIds: ['globex-main-tenant'], createdAt: new Date(), updatedAt: new Date(), contactEmail: 'admin@globex.corp'},
];

const mockTenantAssignments: TenantServiceAssignment[] = [
  {
    tenantId: 'stema-tenant-prod', clientCompanyId: 'stema-inc', assignedPackageId: 'premium_plan',
    services: {
      'crm-service': {
        enabled: true, version: 'v1.2',
        modules: { 'leads': { enabled: true, config: {maxLeadsPerMonth: 1000} }, 'contacts': { enabled: true } },
        serviceWideConfig: { maxUsers: 50, customAnalytics: true }
      },
      'inventory-service': {
        enabled: true, version: 'v1.0',
        modules: { 'item_mgmt': { enabled: true }, 'stock_control': {enabled: false} },
      },
      'finance-service': { enabled: false, version: 'v1.0', modules: {} }
    },
    lastUpdatedAt: new Date()
  },
  {
    tenantId: 'globex-main-tenant', clientCompanyId: 'globex-corp', assignedPackageId: 'basic_plan',
    services: {
      'crm-service': {
        enabled: true, version: 'v1.0',
        modules: { 'leads': { enabled: true } },
        serviceWideConfig: { maxUsers: 5 }
      },
      'notification-service': {
        enabled: true, version: 'v1.0',
        modules: { 'email_service': {enabled: true} }
      }
    },
    lastUpdatedAt: new Date()
  }
];

// Endpoint that tenant-service might call, or used to trigger propagation
export const getTenantAssignment = (req: Request, res: Response): void => {
  const { tenantId } = req.params;
  const assignment = mockTenantAssignments.find(a => a.tenantId === tenantId);
  if (assignment) {
    res.json(assignment);
  } else {
    res.status(404).json({ message: 'Tenant assignment not found.' });
  }
};

// TODO: Add controllers for EasyCode admins to:
// - Create/manage ClientCompany entries.
// - Assign EntitlementPackages or custom configurations to a ClientCompany/Tenant.
// - Trigger propagation of these settings to tenant-service.
// Example: getClientCompanies, createClientCompany, assignPackageToTenant, etc.
