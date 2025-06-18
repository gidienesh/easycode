import { Request, Response } from 'express';
import { GoodsReceiptNote, GoodsReceiptItem, ReceiptStatus } from '../models';
import { InventoryIntegrationService, GoodsReceiptPayloadItem } from '../services/inventory.integration.service';
import { randomUUID } from 'crypto';

const mockGRNs: GoodsReceiptNote[] = [];

export const createGoodsReceipt = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, purchaseOrderId, supplierId, receivedByUserId, items, receiptDate, ...rest } = req.body as Omit<GoodsReceiptNote, 'id'|'grnNumber'|'createdAt'|'updatedAt'|'status'>;
  if (!tenantId || !purchaseOrderId || !supplierId || !receivedByUserId || !items || !items.length) {
    res.status(400).json({ message: 'Missing required fields: tenantId, purchaseOrderId, supplierId, receivedByUserId, items' });
    return;
  }

  // In a real app, validate PO exists, supplier matches PO, items match PO items, quantities are valid, etc.

  const newGRN: GoodsReceiptNote = {
    id: randomUUID(),
    tenantId,
    purchaseOrderId,
    supplierId,
    receivedByUserId,
    items,
    receiptDate: receiptDate ? new Date(receiptDate) : new Date(),
    grnNumber: `GRN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'pending_inspection' as ReceiptStatus, // Default status
    ...rest,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockGRNs.push(newGRN);

  // After saving GRN, notify inventory service
  // This requires determining the correct warehouseId for each item, which might be complex.
  // For mock, we'll assume a default or it's passed in item metadata.
  const inventoryPayload: GoodsReceiptPayloadItem[] = items.map((item: GoodsReceiptItem) => ({
    itemId: item.itemId,
    quantityReceived: item.quantityReceived,
    warehouseId: 'MAIN_WH', // This needs to be determined from PO, item data, or request
    batchNumber: item.batchNumber,
    serialNumbers: item.serialNumbers
  }));

  try {
    // In a real app, this might be an event, or a direct call with retry logic
    const inventoryNotificationResult = await InventoryIntegrationService.notifyGoodsReceipt(tenantId, newGRN.id, inventoryPayload);
    if (!inventoryNotificationResult.success) {
      // Handle failure to notify inventory: log, mark GRN for retry, etc.
      console.warn(`Failed to notify inventory service for GRN ${newGRN.id}: ${inventoryNotificationResult.message}`);
      // Potentially change GRN status or add a warning to the response
    }
  } catch (error: any) {
      console.error(`Error notifying inventory service for GRN ${newGRN.id}: ${error.message}`);
      // Handle error: log, mark GRN for retry, etc.
  }

  res.status(201).json(newGRN);
};

export const getGoodsReceiptById = async (req: Request, res: Response): Promise<void> => {
    const grn = mockGRNs.find(g => g.id === req.params.grnId);
    // TODO: Add tenantId check
    if (grn) {
        res.json(grn);
    } else {
        res.status(404).json({ message: 'Goods Receipt Note not found' });
    }
};

export const getGoodsReceiptsForPO = async (req: Request, res: Response): Promise<void> => {
    const { poId } = req.params;
    const { tenantId } = req.query; // Or from auth context

    let filteredGRNs = mockGRNs.filter(grn => grn.purchaseOrderId === poId);
    if (tenantId) {
        filteredGRNs = filteredGRNs.filter(grn => grn.tenantId === tenantId);
    }
    res.json(filteredGRNs);
};

// TODO: Add controllers for updating GRN status (e.g., after inspection)
