import express from 'express';
import {
    createShipmentRequest,
    getShipmentById,
    getShipmentTracking
} from '../../controllers/shipment.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all shipment routes

router.post('/', createShipmentRequest);
router.get('/:shipmentId', getShipmentById); // Route to get shipment details
router.get('/:shipmentId/tracking', getShipmentTracking);

// TODO: Add routes for cancelling shipments, listing shipments with filters

export default router;
