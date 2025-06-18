import express from 'express';
import {
    createDirectARInvoice,
    getARInvoiceById,
    recordCustomerReceipt
    // createARInvoiceFromSales (if implemented)
} from '../../controllers/ar.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all AR routes

// router.post('/invoices/from-sales', createARInvoiceFromSales); // If using sales system integration
router.post('/invoices/direct', createDirectARInvoice);
router.get('/invoices/:invoiceId', getARInvoiceById);
router.post('/receipts', recordCustomerReceipt);

// TODO: Add routes for updating invoice status, dunning actions, getting list of invoices, etc.

export default router;
