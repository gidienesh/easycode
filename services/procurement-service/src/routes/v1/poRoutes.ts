import express from 'express';
import { createPO, getPOById, getPOs } from '../../controllers/purchaseOrder.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all PO routes

router.post('/', createPO);
router.get('/', getPOs); // Route to get multiple POs, potentially with filters
router.get('/:poId', getPOById);

// TODO: Add routes for updating PO (e.g., status, items), cancelling PO

export default router;
