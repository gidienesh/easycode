import express from 'express';
import { createGoodsReceipt, getGoodsReceiptById, getGoodsReceiptsForPO } from '../../controllers/goodsReceipt.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all GRN routes

router.post('/', createGoodsReceipt);
router.get('/:grnId', getGoodsReceiptById);
router.get('/for-po/:poId', getGoodsReceiptsForPO);

// TODO: Add routes for updating GRN (e.g., status after inspection)

export default router;
