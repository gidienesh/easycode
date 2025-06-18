import express from 'express';
import { adjustStock, getStockLevelsForItem } from '../../controllers/stock.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all stock routes

router.post('/adjust', adjustStock);
router.get('/item/:itemId/levels', getStockLevelsForItem);

// TODO: Add routes for getStockLevelsByWarehouse, recordInventoryMovement (transfers, receipts, issues)

export default router;
