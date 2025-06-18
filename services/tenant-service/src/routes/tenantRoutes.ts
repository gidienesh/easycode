import express from 'express';
import { getTenantDetails, getTenantEntitlements } from '../controllers/tenant.controller';
// import { authenticateAdmin } from '../middleware/auth.middleware'; // For admin operations

const router = express.Router();

// Publicly accessible or service-to-service with token auth
router.get('/:tenantId/details', getTenantDetails);
router.get('/:tenantId/entitlements', getTenantEntitlements); // Crucial for user-service

// TODO: Add admin routes for managing tenants and entitlements
// Example: router.post('/', authenticateAdmin, createTenant);
// Example: router.put('/:tenantId/entitlements', authenticateAdmin, updateTenantEntitlements);

export default router;
