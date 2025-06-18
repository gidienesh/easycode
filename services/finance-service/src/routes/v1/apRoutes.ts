import express from 'express';
import {
    createAPInvoiceFromProcurement,
    createDirectAPInvoice,
    getAPInvoiceById,
    recordSupplierPayment
} from '../../controllers/ap.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all AP routes

router.post('/invoices/from-procurement', createAPInvoiceFromProcurement);
router.post('/invoices/direct', createDirectAPInvoice);
router.get('/invoices/:invoiceId', getAPInvoiceById);
router.post('/payments', recordSupplierPayment);

// TODO: Add routes for updating invoice status, getting list of invoices, etc.

export default router;
