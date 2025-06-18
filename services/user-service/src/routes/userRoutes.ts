import express from 'express';
import { getEffectivePermissions, getUserById } from '../controllers/user.controller';
// import { authenticateToken } from '../middleware/auth.middleware'; // Would be added later

const router = express.Router();

// Apply authentication middleware to all routes in a real app
// router.use(authenticateToken);

router.get('/me/effective-permissions', getEffectivePermissions);
router.get('/:id', getUserById);

// TODO: Add routes for POST /users (registration), PUT /users/:id (profile update), etc.
// POST /auth/login, POST /auth/refresh-token etc.

export default router;
