import { Request, Response } from 'express';
import { APInvoice, APInvoiceStatus, SupplierPayment } from '../models';
import { ProcurementIntegrationService, ProcurementAPInvoiceData } from '../services/procurement.integration.service';
import { randomUUID } from 'crypto';

const mockAPInvoices: APInvoice[] = [];
const mockSupplierPayments: SupplierPayment[] = [];

export const createAPInvoiceFromProcurement = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, procurementInvoiceId } = req.body;
    if (!tenantId || !procurementInvoiceId) {
        res.status(400).json({ message: 'Missing tenantId or procurementInvoiceId' });
        return;
    }

    try {
        const procurementData: ProcurementAPInvoiceData | null = await ProcurementIntegrationService.getAPInvoiceDetailsFromProcurement(tenantId, procurementInvoiceId);
        if (!procurementData) {
            res.status(404).json({ message: `Procurement invoice ${procurementInvoiceId} not found or details incomplete.` });
            return;
        }

        // Transform procurementData to APInvoice structure if needed, or assume it matches
        const newInvoice: APInvoice = {
            id: randomUUID(),
            tenantId,
            supplierId: procurementData.supplierId,
            invoiceNumber: procurementData.invoiceNumber,
            invoiceDate: new Date(procurementData.invoiceDate),
            dueDate: procurementData.dueDate ? new Date(procurementData.dueDate) : undefined,
            lines: procurementData.lines.map(line => ({ ...line, id: randomUUID() })), // Ensure lines have IDs
            subTotal: procurementData.subTotal,
            taxAmount: procurementData.taxAmount,
            totalAmount: procurementData.totalAmount,
            currency: procurementData.currency,
            purchaseOrderId: procurementData.purchaseOrderId,
            status: 'pending_approval' as APInvoiceStatus, // Initial status
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockAPInvoices.push(newInvoice);
        // TODO: Potentially create preliminary Journal Entries in 'draft' status or a sub-ledger entry

        res.status(201).json(newInvoice);
    } catch (error: any) {
        console.error("Error creating AP Invoice from procurement:", error);
        res.status(500).json({ message: "Failed to create AP Invoice from procurement data.", error: error.message });
    }
};

export const createDirectAPInvoice = async (req: Request, res: Response): Promise<void> => {
    // For non-PO invoices or manual entry
    const { tenantId, supplierId, invoiceNumber, invoiceDate, lines, totalAmount, currency, ...rest } = req.body as Omit<APInvoice, 'id'|'createdAt'|'updatedAt'|'status'>;
    if (!tenantId || !supplierId || !invoiceNumber || !invoiceDate || !lines || !lines.length || totalAmount === undefined || !currency) {
        res.status(400).json({ message: 'Missing required fields for direct AP Invoice.' });
        return;
    }
    const newInvoice: APInvoice = {
        id: randomUUID(), tenantId, supplierId, invoiceNumber, invoiceDate: new Date(invoiceDate), lines: lines.map(line => ({ ...line, id: randomUUID() })), totalAmount, currency,
        status: 'pending_approval' as APInvoiceStatus, ...rest, // Ensure subTotal, taxAmount are calculated or provided
        createdAt: new Date(), updatedAt: new Date()
    };
    mockAPInvoices.push(newInvoice);
    res.status(201).json(newInvoice);
};


export const getAPInvoiceById = async (req: Request, res: Response): Promise<void> => {
    const invoice = mockAPInvoices.find(inv => inv.id === req.params.invoiceId);
    // TODO: Check tenantId from auth context
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404).json({ message: 'AP Invoice not found' });
    }
};

export const recordSupplierPayment = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, supplierId, amount, paymentDate, apInvoiceIds, ...rest } = req.body as Omit<SupplierPayment, 'id'>;
    if (!tenantId || !supplierId || amount === undefined || !paymentDate || !apInvoiceIds || !apInvoiceIds.length) {
        res.status(400).json({ message: 'Missing required fields for supplier payment.'});
        return;
    }
    const newPayment: SupplierPayment = {
        id: randomUUID(), tenantId, supplierId, amount, paymentDate: new Date(paymentDate), apInvoiceIds, ...rest
    };
    mockSupplierPayments.push(newPayment);

    // TODO: Update status of linked APInvoices to 'partially_paid' or 'paid'
    // TODO: Create Journal Entry for payment
    apInvoiceIds.forEach(invoiceId => {
        const invoice = mockAPInvoices.find(inv => inv.id === invoiceId && inv.tenantId === tenantId);
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

    res.status(201).json(newPayment);
};
