import { Request, Response } from 'express';
import { Item } from '../models'; // Assuming models are available
import { randomUUID } from 'crypto';

const mockItems: Item[] = [];

export const createItem = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, sku, name, unitOfMeasure, ...rest } = req.body as Omit<Item, 'id'|'createdAt'|'updatedAt'|'isActive'>;
  if (!tenantId || !sku || !name || !unitOfMeasure) {
    res.status(400).json({ message: 'Missing required fields: tenantId, sku, name, unitOfMeasure' });
    return;
  }
  const newItem: Item = {
    id: randomUUID(), tenantId, sku, name, unitOfMeasure, isActive: true, ...rest,
    createdAt: new Date(), updatedAt: new Date()
  };
  mockItems.push(newItem);
  res.status(201).json(newItem);
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
  // TODO: Add filtering by tenantId, category, etc. from req.query
  // For now, returning all mock items. In a real app, tenantId filtering is crucial.
  const { tenantId } = req.query;
  if (tenantId) {
    res.json(mockItems.filter(item => item.tenantId === tenantId));
  } else {
    res.json(mockItems); // Or return error if tenantId is always required
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  const item = mockItems.find(i => i.id === req.params.itemId);
  // TODO: Add tenantId check from authenticated user context
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};
// TODO: Add updateItem, deleteItem controllers
