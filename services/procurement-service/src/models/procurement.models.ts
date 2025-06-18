export interface Address { street: string; city: string; state?: string; postalCode: string; country: string; }
export interface ContactPerson { name: string; email?: string; phone?: string; role?: string; }

export interface Supplier {
  id: string; // UUID
  tenantId: string;
  name: string;
  taxId?: string;
  primaryContact?: ContactPerson;
  address?: Address;
  paymentTerms?: string; // e.g., "Net 30"
  // performanceRating?: number; // Could be calculated
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RequisitionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'po_created' | 'closed';
export interface RequisitionItem { itemId: string; description?: string; quantity: number; unitOfMeasure: string; estimatedPrice?: number; }
export interface PurchaseRequisition {
  id: string; // UUID
  tenantId: string;
  requisitionNumber: string; // Human-readable
  requesterUserId: string;
  departmentId?: string;
  items: RequisitionItem[];
  totalEstimatedValue?: number;
  reason?: string;
  status: RequisitionStatus;
  approvedByUserId?: string;
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type POStatus = 'draft' | 'pending_supplier_acceptance' | 'accepted' | 'in_production' | 'partially_shipped' | 'fully_shipped' | 'partially_received' | 'fully_received' | 'invoiced' | 'paid' | 'cancelled';
export interface POItem {
  id: string; // UUID for line item
  itemId: string; // From inventory-service or item master here
  description: string; // Can be copied from item master or PR
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  totalPrice: number; // quantity * unitPrice
  deliveryDate?: Date;
  // Add tax info, discounts, etc.
}
export interface PurchaseOrder {
  id: string; // UUID
  tenantId: string;
  poNumber: string; // Human-readable
  requisitionId?: string; // Link to PR
  supplierId: string;
  orderDate: Date;
  items: POItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentTerms?: string;
  shippingMethod?: string;
  notes?: string;
  status: POStatus;
  // currency: string; // e.g., 'USD', 'EUR'
  // subTotal: number;
  // taxes: number;
  // totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ReceiptStatus = 'pending_inspection' | 'accepted' | 'partially_accepted' | 'rejected';
export interface GoodsReceiptItem { poItemId: string; itemId: string; quantityReceived: number; quantityAccepted?: number; batchNumber?: string; serialNumbers?: string[]; notes?: string; }
export interface GoodsReceiptNote {
  id: string; // UUID
  tenantId: string;
  grnNumber: string; // Human-readable
  purchaseOrderId: string;
  supplierId: string;
  receivedByUserId: string;
  receiptDate: Date;
  items: GoodsReceiptItem[];
  status: ReceiptStatus; // Overall status
  deliveryNoteNumber?: string; // Supplier's delivery note
  inspectedByUserId?: string;
  inspectionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
// Basic stubs for RFx, Contract, Invoice for now
export interface RFx { id: string; tenantId: string; title: string; status: string; type: 'RFI' | 'RFQ' | 'RFP'; }
export interface Contract { id: string; tenantId: string; supplierId: string; title: string; status: string; startDate: Date; endDate?: Date; contractValue?: number; }
export interface Invoice { id: string; tenantId: string; poId?: string; supplierId: string; invoiceNumber: string; invoiceDate: Date; dueDate?: Date; amount: number; status: 'pending_approval' | 'approved_for_payment' | 'paid' | 'disputed'; }
