export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' | 'contra_asset' | 'contra_liability';
export type NormalBalance = 'debit' | 'credit';

export interface LedgerAccount {
  id: string; // UUID
  tenantId: string;
  accountCode: string; // e.g., "10100", "60500"
  name: string;
  description?: string;
  type: AccountType;
  normalBalance: NormalBalance;
  parentAccountId?: string; // For hierarchical COA
  isActive: boolean;
  // Financial dimensions can be associated here or at transaction level
  // defaultDimensions?: Record<string, string>; // e.g., { department: 'SALES' }
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartOfAccounts { // Represents a specific COA structure for a tenant
  id: string; // UUID
  tenantId: string;
  name: string; // e.g., "Standard Corporate COA", "Retail COA"
  accounts: LedgerAccount[]; // The actual list of accounts in this COA
  defaultCurrency: string; // e.g., "USD", "EUR"
  createdAt: Date;
  updatedAt: Date;
}

export type JournalEntryLineType = 'debit' | 'credit';
export interface JournalEntryLine {
  ledgerAccountId: string; // FK to LedgerAccount.id
  lineType: JournalEntryLineType;
  amount: number; // Positive value, representing the magnitude of the debit or credit
  description?: string;
  // dimensions?: Record<string, string>; // e.g., { project: 'P123', department: 'R&D' }
}
export type JournalEntryStatus = 'draft' | 'posted' | 'reversed';
export interface JournalEntry {
  id: string; // UUID
  tenantId: string;
  entryNumber?: string; // Human-readable, system-generated sequence
  entryDate: Date; // Date the transaction occurred or is effective
  description?: string; // Overall description for the JE
  lines: JournalEntryLine[]; // Should always have at least 2 lines, debits must equal credits
  status: JournalEntryStatus;
  postedDate?: Date;
  reversedByJEId?: string; // If this JE reverses another, store the ID of the reversing JE
  reversesJEId?: string; // If this JE is a reversal of another, store the original JE ID
  reference?: string; // e.g., source document like invoice number, PO number
  userId?: string; // User who created/posted
  createdAt: Date;
  updatedAt: Date;
}

export type APInvoiceStatus = 'draft' | 'pending_approval' | 'approved_for_payment' | 'partially_paid' | 'paid' | 'disputed' | 'void';
export interface APInvoiceLine {
  id: string; // UUID for line item
  description: string;
  quantity?: number;
  unitPrice?: number;
  amount: number; // Total line amount
  glAccountId?: string; // Expense or Asset account
  // dimensions?: Record<string, string>;
}
export interface APInvoice {
  id: string; // UUID
  tenantId: string;
  supplierId: string; // From Procurement or local supplier master
  invoiceNumber: string; // Supplier's invoice number
  invoiceDate: Date;
  dueDate?: Date;
  lines: APInvoiceLine[];
  subTotal: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string; // e.g., "USD"
  purchaseOrderId?: string; // Link to PO in Procurement
  status: APInvoiceStatus;
  // paymentIds?: string[]; // Links to payments made
  notes?: string;
  attachments?: Array<{fileName: string; storageRef: string; uploadedBy?: string;}>; // e.g. scanned invoice
  createdAt: Date;
  updatedAt: Date;
}

export type ARInvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'void' | 'written_off';
export interface ARInvoiceLine {
  id: string; // UUID for line item
  description: string;
  quantity?: number;
  unitPrice?: number;
  amount: number; // Total line amount
  revenueGlAccountId?: string; // Revenue account
  // dimensions?: Record<string, string>;
}
export interface ARInvoice {
  id: string; // UUID
  tenantId: string;
  customerId: string; // From CRM or local customer master
  invoiceNumber: string; // System-generated
  invoiceDate: Date;
  dueDate?: Date;
  lines: ARInvoiceLine[];
  subTotal: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string;
  salesOrderId?: string; // Link to SO in CRM/Sales module
  status: ARInvoiceStatus;
  // paymentReceiptIds?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Basic stubs for Payment, Receipt, Dimension, BankStatement, Budget, FixedAsset
export interface SupplierPayment { id: string; tenantId: string; supplierId: string; amount: number; paymentDate: Date; apInvoiceIds: string[]; paymentMethod?: string; referenceNumber?: string; }
export interface CustomerReceipt { id: string; tenantId: string; customerId: string; amount: number; receiptDate: Date; arInvoiceIds: string[]; paymentMethod?: string; referenceNumber?: string; }
export interface FinancialDimension { id: string; tenantId: string; name: string; description?: string; values: Array<{value: string; description?: string; isActive: boolean}>; isActive: boolean; }
export interface BankStatement { id: string; tenantId: string; bankAccountId: string; statementDate: Date; openingBalance: number; closingBalance: number; transactions: Array<any>; /* Replace 'any' with BankTransaction interface */ }
export interface Budget { id: string; tenantId: string; fiscalYear: number; name: string; description?: string; lines: Array<{ledgerAccountId: string; period: string; amount: number; dimensions?: Record<string, string>}>; }
export interface FixedAsset { id: string; tenantId: string; assetCode: string; name: string; description?: string; acquisitionDate: Date; acquisitionCost: number; depreciationMethod?: string; usefulLifeYears?: number; salvageValue?: number; status: 'in_service' | 'disposed' | 'idle'; }
