import { Request, Response } from 'express';
import { StockLevel, InventoryTransaction, StockType, InventoryTransactionType } from '../models';
import { randomUUID } from 'crypto';

const mockStockLevels: StockLevel[] = [];
const mockInventoryTransactions: InventoryTransaction[] = [];

export const adjustStock = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, itemId, warehouseId, quantityChange, reason, stockType = 'on_hand' as StockType, batchNumber, serialNumber } = req.body;
  if (!tenantId || !itemId || !warehouseId || quantityChange === undefined || typeof quantityChange !== 'number') {
    res.status(400).json({ message: 'Missing or invalid required fields: tenantId, itemId, warehouseId, quantityChange (must be a number)' });
    return;
  }

  let stockLevel = mockStockLevels.find(sl =>
    sl.itemId === itemId &&
    sl.warehouseId === warehouseId &&
    sl.stockType === stockType &&
    sl.batchNumber === batchNumber && // undefined === undefined is true, so this works for non-batch/serial
    sl.serialNumber === serialNumber
  );

  if (stockLevel) {
    stockLevel.quantity += quantityChange;
    stockLevel.lastUpdatedAt = new Date();
  } else {
    // Ensure new stock level doesn't go negative from adjustment if it's the first record
    if (quantityChange < 0 && !batchNumber && !serialNumber) { // More complex for batch/serial to check if it exists first
        // res.status(400).json({ message: 'Cannot adjust stock to a negative value for a new stock record.'});
        // return;
        // For simplicity in mock, we allow it, but a real system might prevent this unless specific scenarios.
    }
    stockLevel = {
        itemId,
        warehouseId,
        quantity: quantityChange,
        stockType,
        batchNumber,
        serialNumber,
        lastUpdatedAt: new Date()
    };
    mockStockLevels.push(stockLevel);
  }

  const transactionType: InventoryTransactionType = quantityChange > 0 ? 'adjustment_positive' : 'adjustment_negative';
  const transaction: InventoryTransaction = {
    id: randomUUID(), tenantId, itemId, transactionType, quantityChange, warehouseId,
    transactionTimestamp: new Date(), referenceId: reason, batchNumber, serialNumber
    // userId might come from req.user in a real app
  };
  mockInventoryTransactions.push(transaction);

  res.json({ message: 'Stock adjusted successfully', stockLevel, transaction });
};

export const getStockLevelsForItem = async (req: Request, res: Response): Promise<void> => {
  const { itemId } = req.params;
  const { warehouseId, stockType, tenantId } = req.query; // Added tenantId for filtering

  // In a real app, tenantId would likely come from auth context
  if (!tenantId) {
      // res.status(400).json({ message: "tenantId query parameter is required for fetching stock levels."});
      // return;
      // For mock, we'll allow omitting it but log a warning or assume a default if appropriate
  }

  const levels = mockStockLevels.filter(sl =>
    sl.itemId === itemId &&
    (!tenantId || sl.itemId.startsWith(tenantId as string + ':')) && // Assuming itemId might be prefixed with tenantId for global mock, or filter by a tenantId field on StockLevel
    (!warehouseId || sl.warehouseId === warehouseId) &&
    (!stockType || sl.stockType === (stockType as StockType))
  );
  res.json(levels);
};
// TODO: Add controllers for getStockLevelsByWarehouse, recordInventoryMovement (transfers, receipts from PO, issues to SO)
