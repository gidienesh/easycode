import express from 'express';
import { createSupplier, getSuppliers, getSupplierById } from '../../controllers/supplier.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all supplier routes

router.post('/', createSupplier);
router.get('/', getSuppliers);
router.get('/:supplierId', getSupplierById);

// TODO: Add PUT and DELETE routes for suppliers

export default router;
