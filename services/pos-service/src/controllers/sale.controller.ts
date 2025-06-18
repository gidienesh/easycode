import { Request, Response } from 'express';
import { SaleTransaction, SaleItem, PaymentDetail, SaleStatus, PaymentType } from '../models';
import { PaymentGatewayService, PaymentGatewayRequestData, PaymentGatewayResponse } from '../services/payment.gateway.service';
import { InventoryIntegrationService, StockUpdateItem } from '../services/inventory.integration.service';
import { randomUUID } from 'crypto';

const mockSales: SaleTransaction[] = [];

// This is a simplified calculation. Real tax/discount engine would be complex.
const calculateTotals = (items: SaleItem[]): { subTotal: number; totalDiscountAmount: number; totalTaxAmount: number; grandTotal: number } => {
    let subTotal = 0;
    let totalDiscountAmount = 0;
    let totalTaxAmount = 0;

    items.forEach(item => {
        const itemTotalBeforeTaxAndDiscount = item.quantity * item.unitPrice;
        subTotal += itemTotalBeforeTaxAndDiscount;
        totalDiscountAmount += item.discountAmount || 0;
        // Assuming item.taxAmount is pre-calculated if item-level tax applies
        // Or, calculate here based on item.taxRate if available from product details
        totalTaxAmount += item.taxAmount || 0; // Simplified
    });

    // Apply transaction-level discounts/taxes if any (not modeled in SaleItem for this mock)
    // For now, grandTotal is based on line item totals.
    const grandTotal = subTotal - totalDiscountAmount + totalTaxAmount;
    return { subTotal, totalDiscountAmount, totalTaxAmount, grandTotal };
};


export const processSaleTransaction = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, registerId, cashierId, items, payments, customerId, notes, isOfflineTransaction, offlineTransactionId } =
    req.body as Partial<Omit<SaleTransaction, 'id'|'transactionNumber'|'status'|'transactionTimestamp'|'subTotal'|'grandTotal'|'amountTendered'|'changeGiven'>>;

  if (!tenantId || !registerId || !cashierId || !items || !items.length || !payments || !payments.length) {
    res.status(400).json({ message: 'Missing required fields: tenantId, registerId, cashierId, items, payments.' });
    return;
  }

  // In a real app:
  // 1. Fetch full item details (price, tax info) from InventoryIntegrationService for items not already in POS cache
  // 2. Apply promotions/discounts engine
  // 3. Calculate taxes accurately

  const { subTotal, totalDiscountAmount, totalTaxAmount, grandTotal } = calculateTotals(items);
  let amountTendered = 0;
  payments.forEach(p => amountTendered += p.amount);
  const changeGiven = Math.max(0, amountTendered - grandTotal); // Simplified change calculation

  const processedPayments: PaymentDetail[] = [];
  let paymentSuccess = true;

  for (const p of payments) {
    if (p.paymentType !== 'cash' && p.paymentType !== 'on_account') { // Skip actual gateway call for cash/on_account in mock
      const pgRequestData: PaymentGatewayRequestData = {
          amount: p.amount,
          currency: 'USD', // Assume USD for now, should come from tenant/request
          paymentType: p.paymentType,
          // Add card details, token etc. from p if available
          metadata: { saleTransactionId_placeholder: 'id_goes_here', tenantId, registerId }
      };
      const paymentResult: PaymentGatewayResponse = await PaymentGatewayService.processPayment(pgRequestData, tenantId);
      if (!paymentResult.success) {
        paymentSuccess = false;
        // Add failed payment attempt to processedPayments for logging/audit
        processedPayments.push({ ...p, id: randomUUID(), status: 'declined', paymentGatewayTxnId: paymentResult.transactionId, referenceNumber: paymentResult.errorMessage });
        // Decide if to stop or allow other payments (e.g. if split payment fails on one card)
        // For now, fail entire transaction if one payment fails that's not cash/on_account
        res.status(400).json({ message: `Payment failed for type ${p.paymentType}: ${paymentResult.errorMessage || 'Gateway error'}`, failedPayment: p });
        return;
      }
      processedPayments.push({ ...p, id: randomUUID(), status: 'approved', paymentGatewayTxnId: paymentResult.transactionId, approvalCode: paymentResult.approvalCode });
    } else {
      processedPayments.push({ ...p, id: randomUUID(), status: 'approved' }); // Auto-approve cash/on_account for mock
    }
  }

  if (!paymentSuccess) return; // Should have already returned above if a non-cash/on_account payment failed

  const newSaleId = randomUUID();
  const newSale: SaleTransaction = {
    id: newSaleId,
    tenantId,
    registerId,
    sessionId: req.body.sessionId, // Assuming sessionId might be passed
    transactionNumber: `SALE-${registerId}-${Date.now()}`, // Needs better sequencing
    items: items.map(item => ({...item, lineItemId: randomUUID() })), // Add lineItemIds
    subTotal,
    totalDiscountAmount,
    totalTaxAmount,
    grandTotal,
    payments: processedPayments,
    amountTendered,
    changeGiven,
    customerId,
    cashierId,
    transactionTimestamp: new Date(),
    status: 'completed' as SaleStatus,
    isOfflineTransaction: !!isOfflineTransaction,
    offlineTransactionId,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockSales.push(newSale);

  // Update inventory (fire and forget for mock, but handle errors in real app)
  const stockUpdateItems: StockUpdateItem[] = items.map(i => ({
    itemId: i.itemId,
    quantitySold: i.quantity,
    warehouseId: 'MAIN_WAREHOUSE_ID_POS' // This needs to be configured per register or tenant
  }));
  InventoryIntegrationService.updateStockAfterSale(tenantId, stockUpdateItems)
    .catch(err => console.error("Error updating stock after sale (ignored in mock):", err));

  // TODO: Generate and send receipt via notification-service
  // TODO: Post transaction to finance-service (or batch at end of day/session)

  res.status(201).json(newSale);
};

export const getSaleById = async (req: Request, res: Response): Promise<void> => {
    const { saleId } = req.params;
    const { tenantId } = req.query; // Or from auth context

    const sale = mockSales.find(s => s.id === saleId && s.tenantId === tenantId);
    if (sale) {
        res.json(sale);
    } else {
        res.status(404).json({ message: 'Sale transaction not found or access denied.' });
    }
};

// TODO: Add controllers for returns, exchanges, voiding sales, parking sales, offline sync.
