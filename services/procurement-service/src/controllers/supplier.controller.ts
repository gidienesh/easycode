import { Request, Response } from 'express';
import { Supplier } from '../models';
import { randomUUID } from 'crypto';

const mockSuppliers: Supplier[] = [];

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, name, ...rest } = req.body as Omit<Supplier, 'id'|'createdAt'|'updatedAt'|'isActive'>;
    if (!tenantId || !name) {
        res.status(400).json({ message: 'Missing required fields: tenantId, name' });
        return;
    }
    const newSupplier: Supplier = {
        id: randomUUID(),
        tenantId,
        name,
        isActive: true,
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    mockSuppliers.push(newSupplier);
    res.status(201).json(newSupplier);
};

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
    // TODO: Add filtering by tenantId from req.query or auth context
    const { tenantId } = req.query;
    if (tenantId) {
        res.json(mockSuppliers.filter(s => s.tenantId === tenantId));
    } else {
        res.json(mockSuppliers); // Or error if tenantId is strictly required
    }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
    const supplier = mockSuppliers.find(s => s.id === req.params.supplierId);
    // TODO: Add tenantId check
    if (supplier) {
        res.json(supplier);
    } else {
        res.status(404).json({ message: 'Supplier not found' });
    }
};

// TODO: Add updateSupplier, deleteSupplier controllers
