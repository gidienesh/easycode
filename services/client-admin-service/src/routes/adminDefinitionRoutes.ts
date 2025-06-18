import express from 'express';
import { getAllServiceDefinitions } from '../controllers/definition.controller';
import { getTenantAssignment } from '../controllers/clientAssignment.controller';
// import { authenticateEasyCodeAdmin } from '../middleware/auth.middleware'; // For securing admin actions

const router = express.Router();

// --- Global Definitions (managed by EasyCode staff) ---
// router.use(authenticateEasyCodeAdmin); // Secure all definition routes

router.get('/services', getAllServiceDefinitions);
// TODO: router.post('/services', createServiceDefinition);
// TODO: router.put('/services/:id', updateServiceDefinition);
// TODO: Similar routes for /modules and /packages

// --- Client Specific Assignments ---
// This endpoint might be hit by tenant-service or an internal propagation mechanism
router.get('/assignments/tenant/:tenantId', getTenantAssignment);
// TODO: Routes for EasyCode staff to manage these assignments
// e.g., POST /assignments/tenant/:tenantId

export default router;
