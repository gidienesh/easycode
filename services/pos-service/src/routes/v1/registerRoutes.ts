import express from 'express';
import { openRegisterSession, closeRegisterSession, getRegisterSession } from '../../controllers/register.controller';
// import { authenticatePOSCashier } from '../../middleware/auth.middleware'; // Placeholder

const router = express.Router();

// router.use(authenticatePOSCashier); // Apply auth to all register routes

router.post('/:registerId/sessions/open', openRegisterSession);
router.post('/:registerId/sessions/close', closeRegisterSession);
router.get('/:registerId/sessions/:sessionId', getRegisterSession); // Get a specific session

// TODO: Add routes for current open session for a register, X/Z reports

export default router;
