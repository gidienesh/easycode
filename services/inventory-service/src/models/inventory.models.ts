export interface ItemDimension { length?: number; width?: number; height?: number; unit?: 'cm' | 'm' | 'in' | 'ft'; }
export interface ItemWeight { value?: number; unit?: 'kg' | 'lb'; }

export interface Item {
  id: string; // UUID or system-generated SKU
  tenantId: string;
  sku: string; // Stock Keeping Unit
  name: string;
  description?: string;
  category?: string; // Could be a FK to a Category model
  unitOfMeasure: string; // e.g., 'pcs', 'kg', 'm'
  barcode?: string; // UPC/EAN
  supplierId?: string; // FK to a supplier entity (potentially in procurement)
  purchaseCost?: number;
  sellingPrice?: number; // May come from a pricing service or be here
  dimensions?: ItemDimension;
  weight?: ItemWeight;
  isBatchTracked?: boolean;
  isSerialTracked?: boolean;
  minimumStockLevel?: number;
  reorderPoint?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WarehouseZone { id: string; name: string; description?: string; }
export interface WarehouseBin { id: string; zoneId: string; name: string; capacity?: number; }

export interface Warehouse {
  id: string; // UUID
  tenantId: string;
  name: string;
  address?: string; // Or structured address object
  type: 'central' | 'regional' | 'local' | 'retail_store' | 'virtual';
  zones?: WarehouseZone[];
  bins?: WarehouseBin[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type StockType = 'on_hand' | 'allocated' | 'quality_inspection' | 'damaged' | 'in_transit' | 'reserved';

export interface StockLevel {
  itemId: string;
  warehouseId: string;
  binId?: string; // Optional for more granular tracking
  batchNumber?: string; // If item is batch tracked
  serialNumber?: string; // If item is serial tracked
  quantity: number;
  stockType: StockType;
  lastUpdatedAt: Date;
}

export type InventoryTransactionType = 'receipt_po' | 'receipt_return' | 'issue_so' | 'issue_internal' | 'transfer_out' | 'transfer_in' | 'adjustment_positive' | 'adjustment_negative' | 'cycle_count';

export interface InventoryTransaction {
  id: string; // UUID
  tenantId: string;
  itemId: string;
  transactionType: InventoryTransactionType;
  quantityChange: number; // Positive for increase, negative for decrease
  warehouseId: string;
  fromBinId?: string;
  toBinId?: string;
  fromWarehouseId?: string; // For transfers
  toWarehouseId?: string;   // For transfers
  batchNumber?: string;
  serialNumber?: string;
  transactionTimestamp: Date;
  referenceId?: string; // e.g., PO number, SO number, adjustment reason code
  userId?: string; // User performing the transaction
  notes?: string;
}
