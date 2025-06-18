import express from 'express';
import { getCarriers, getCarrierById } from '../../controllers/carrier.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all carrier routes, or make public if for selection

router.get('/', getCarriers);
router.get('/:carrierId', getCarrierById);

// TODO: Admin routes for managing carriers if this service owns that data

export default router;
