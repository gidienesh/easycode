import { Request, Response } from 'express';
import { Tenant, TenantEntitlements } from '../models'; // Assuming models are available

// Mocked data - in a real app, this would come from a database or configuration store
const mockTenants: Tenant[] = [
  { id: 'client-company-abc', name: 'Client Company ABC', status: 'active', createdAt: new Date(), updatedAt: new Date() },
  { id: 'client-company-xyz', name: 'Client Company XYZ', status: 'active', createdAt: new Date(), updatedAt: new Date() },
];

const mockEntitlements: TenantEntitlements[] = [
  {
    tenantId: 'client-company-abc',
    services: {
      "crm-service": { enabled: true, version: "v1.2", modules: ["leads", "contacts"], config: { maxUsers: 100 } },
      "inventory-service": { enabled: true, version: "v1.0", modules: ["item_management"] },
      "finance-service": { enabled: false, version: "v1.0" }
    },
    version: 'ent-v1.0.0',
    lastUpdatedAt: new Date()
  },
  {
    tenantId: 'client-company-xyz',
    services: {
      "crm-service": { enabled: true, version: "v1.1", modules: ["leads"] },
      "notification-service": { enabled: true, version: "v1.0" }
    },
    version: 'ent-v1.0.1',
    lastUpdatedAt: new Date()
  }
];

export const getTenantDetails = async (req: Request, res: Response): Promise<void> => {
  const { tenantId } = req.params;
  const tenant = mockTenants.find(t => t.id === tenantId);

  if (tenant) {
    res.json(tenant);
  } else {
    res.status(404).json({ message: 'Tenant not found' });
  }
};

export const getTenantEntitlements = async (req: Request, res: Response): Promise<void> => {
  const { tenantId } = req.params;
  const entitlements = mockEntitlements.find(e => e.tenantId === tenantId);

  if (entitlements) {
    res.json(entitlements);
  } else {
    // Fallback to a default "empty" or "base" entitlement if tenant exists but has no specific entry?
    // For now, strict 404 if no specific entitlement record found.
    const tenantExists = mockTenants.find(t => t.id === tenantId);
    if (tenantExists) {
         res.status(404).json({ message: 'Entitlements not configured for this tenant.'});
    } else {
         res.status(404).json({ message: 'Tenant not found' });
    }
  }
};

// TODO: Add controllers for creating/updating tenants and their entitlements (admin operations)
