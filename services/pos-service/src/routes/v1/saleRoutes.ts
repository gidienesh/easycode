import express from 'express';
import { processSaleTransaction, getSaleById } from '../../controllers/sale.controller';
// import { authenticatePOS } from '../../middleware/auth.middleware'; // Placeholder for POS terminal/cashier auth

const router = express.Router();

// router.use(authenticatePOS); // Apply auth to all sale routes

router.post('/', processSaleTransaction);
router.get('/:saleId', getSaleById);

// TODO: Add routes for returns, exchanges, voiding sales, parking/unparking sales

export default router;
