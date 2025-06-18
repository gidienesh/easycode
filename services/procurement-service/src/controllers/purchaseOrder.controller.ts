import { Request, Response } from 'express';
import { PurchaseOrder, POItem, POStatus } from '../models';
// import { InventoryIntegrationService } from '../services/inventory.integration.service'; // For item data
import { randomUUID } from 'crypto';

const mockPOs: PurchaseOrder[] = [];

export const createPO = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, supplierId, items, orderDate, ...rest } = req.body as Omit<PurchaseOrder, 'id'|'poNumber'|'createdAt'|'updatedAt'|'status'>;
  if (!tenantId || !supplierId || !items || !items.length) {
    res.status(400).json({ message: 'Missing required fields: tenantId, supplierId, or items' });
    return;
  }

  // Further validation could include:
  // - Checking if supplierId is valid
  // - Fetching item details from inventory-service to validate itemIds and populate descriptions/UoM if not provided
  //   const itemIds = items.map((item: POItem) => item.itemId);
  //   const inventoryItemDetails = await InventoryIntegrationService.getItemDetails(tenantId, itemIds);
  //   // Then map/validate items against inventoryItemDetails

  const processedItems: POItem[] = items.map((item: any) => ({ // Assuming item structure from request matches POItem closely
    id: randomUUID(), // Each line item gets a unique ID
    itemId: item.itemId,
    description: item.description || `Item ${item.itemId}`, // Fallback description
    quantity: Number(item.quantity),
    unitOfMeasure: item.unitOfMeasure || 'pcs', // Fallback UoM
    unitPrice: Number(item.unitPrice),
    totalPrice: Number(item.quantity) * Number(item.unitPrice),
    deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : undefined,
  }));

  const newPO: PurchaseOrder = {
    id: randomUUID(),
    tenantId,
    supplierId,
    items: processedItems,
    orderDate: orderDate ? new Date(orderDate) : new Date(),
    poNumber: `PO-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, // More robust generation needed
    status: 'draft' as POStatus, // Default status
    ...rest,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockPOs.push(newPO);
  res.status(201).json(newPO);
};

export const getPOById = async (req: Request, res: Response): Promise<void> => {
  const po = mockPOs.find(p => p.id === req.params.poId);
  // TODO: Add tenantId check from auth context
  if (po) {
    res.json(po);
  } else {
    res.status(404).json({ message: 'Purchase Order not found' });
  }
};

export const getPOs = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, supplierId, status } = req.query;
    // In a real app, tenantId would come from auth context or be a mandatory filter for sys admins
    let filteredPOs = mockPOs;
    if (tenantId) {
        filteredPOs = filteredPOs.filter(po => po.tenantId === tenantId);
    }
    if (supplierId) {
        filteredPOs = filteredPOs.filter(po => po.supplierId === supplierId);
    }
    if (status) {
        filteredPOs = filteredPOs.filter(po => po.status === status);
    }
    res.json(filteredPOs);
};

// TODO: Add controllers for updatePO (status changes, item changes - complex), addPOItem, removePOItem, etc.
