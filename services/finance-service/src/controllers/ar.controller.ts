import { Request, Response } from 'express';
import { ARInvoice, ARInvoiceStatus, CustomerReceipt } from '../models';
// Import a conceptual CRMIntegrationService if AR invoices are sourced from CRM
// import { CrmIntegrationService } from '../services/crm.integration.service';
import { randomUUID } from 'crypto';

const mockARInvoices: ARInvoice[] = [];
const mockCustomerReceipts: CustomerReceipt[] = [];

// Example: Create AR Invoice perhaps from CRM sales data
// export const createARInvoiceFromSales = async (req: Request, res: Response): Promise<void> => {
//   const { tenantId, salesReferenceId } = req.body;
//   const salesData = await CrmIntegrationService.getSalesDataForInvoice(tenantId, salesReferenceId);
//   // ... logic to transform salesData into ARInvoice ...
//   const newInvoice: ARInvoice = { /* ... */ id: randomUUID(), status: 'draft', createdAt: new Date(), updatedAt: new Date() };
//   mockARInvoices.push(newInvoice);
//   res.status(201).json(newInvoice);
// };

export const createDirectARInvoice = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, customerId, invoiceDate, lines, totalAmount, currency, ...rest } = req.body as Omit<ARInvoice, 'id'|'invoiceNumber'|'createdAt'|'updatedAt'|'status'>;
    if (!tenantId || !customerId || !invoiceDate || !lines || !lines.length || totalAmount === undefined || !currency) {
        res.status(400).json({ message: 'Missing required fields for direct AR Invoice.' });
        return;
    }
    const newInvoice: ARInvoice = {
        id: randomUUID(), tenantId, customerId, invoiceDate: new Date(invoiceDate), lines: lines.map(line => ({...line, id: randomUUID()})), totalAmount, currency,
        invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substring(2,6)}`, // System generated
        status: 'draft' as ARInvoiceStatus, ...rest, // Ensure subTotal, taxAmount calculated or provided
        createdAt: new Date(), updatedAt: new Date()
    };
    mockARInvoices.push(newInvoice);
    res.status(201).json(newInvoice);
};


export const getARInvoiceById = async (req: Request, res: Response): Promise<void> => {
    const invoice = mockARInvoices.find(inv => inv.id === req.params.invoiceId);
    // TODO: Check tenantId
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404).json({ message: 'AR Invoice not found' });
    }
};

export const recordCustomerReceipt = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, customerId, amount, receiptDate, arInvoiceIds, ...rest } = req.body as Omit<CustomerReceipt, 'id'>;
    if (!tenantId || !customerId || amount === undefined || !receiptDate || !arInvoiceIds || !arInvoiceIds.length) {
        res.status(400).json({ message: 'Missing required fields for customer receipt.'});
        return;
    }
    const newReceipt: CustomerReceipt = {
        id: randomUUID(), tenantId, customerId, amount, receiptDate: new Date(receiptDate), arInvoiceIds, ...rest
    };
    mockCustomerReceipts.push(newReceipt);

    // TODO: Update status of linked ARInvoices to 'partially_paid' or 'paid'
    // TODO: Create Journal Entry for cash receipt and AR reduction
     arInvoiceIds.forEach(invoiceId => {
        const invoice = mockARInvoices.find(inv => inv.id === invoiceId && inv.tenantId === tenantId);
        if (invoice) {
            // Simplified: just mark as paid. Real logic would handle partial payments.
             if (invoice.totalAmount <= amount) { // This logic is overly simple for multi-invoice payment
                 invoice.status = 'paid';
                 invoice.updatedAt = new Date();
            } else {
                 invoice.status = 'partially_paid';
                 invoice.updatedAt = new Date();
            }
        }
    });

    res.status(201).json(newReceipt);
};
