// src/lib/mockData.ts
import { AccountType, JournalEntryStatus } from './prismaPlaceholders'; // Adjust path if necessary

export enum PurchaseOrderStatus { DRAFT = "DRAFT", PENDING_APPROVAL = "PENDING_APPROVAL", APPROVED = "APPROVED", REJECTED = "REJECTED", ORDERED = "ORDERED", PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED", FULLY_RECEIVED = "FULLY_RECEIVED", INVOICED = "INVOICED", CLOSED = "CLOSED", CANCELLED = "CANCELLED" }
export enum APInvoiceStatus { DRAFT = "DRAFT", PENDING_APPROVAL = "PENDING_APPROVAL", APPROVED_FOR_PAYMENT = "APPROVED_FOR_PAYMENT", PARTIALLY_PAID = "PARTIALLY_PAID", PAID = "PAID", REJECTED = "REJECTED", VOID = "VOID" }
export enum APPaymentStatus { PENDING_APPROVAL = "PENDING_APPROVAL", APPROVED = "APPROVED", PROCESSING = "PROCESSING", PAID = "PAID", FAILED = "FAILED", CANCELLED = "CANCELLED" }
export enum PaymentMethod { BANK_TRANSFER = "BANK_TRANSFER", MPESA = "MPESA", CHEQUE = "CHEQUE", CASH = "CASH", CARD = "CARD" }
export enum ExpenseClaimStatus { DRAFT = "DRAFT", SUBMITTED = "SUBMITTED", PENDING_APPROVAL = "PENDING_APPROVAL", APPROVED = "APPROVED", REIMBURSED = "REIMBURSED", REJECTED = "REJECTED", CANCELLED = "CANCELLED"}
export type WHTStatus = "Pending Remittance" | "Remitted" | "Partially Remitted";
export enum SalesOrderStatus { DRAFT = "DRAFT", PENDING_CONFIRMATION = "PENDING_CONFIRMATION", CONFIRMED = "CONFIRMED", PROCESSING = "PROCESSING", READY_FOR_SHIPMENT = "READY_FOR_SHIPMENT", SHIPPED = "SHIPPED", PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED", DELIVERED = "DELIVERED", INVOICED = "INVOICED", COMPLETED = "COMPLETED", CANCELLED = "CANCELLED" }
export enum ARInvoiceStatus { DRAFT = "DRAFT", SENT = "SENT", PARTIALLY_PAID = "PARTIALLY_PAID", PAID = "PAID", VOID = "VOID", OVERDUE = "OVERDUE" }
export enum ARPaymentApplicationStatus { UNAPPLIED = "UNAPPLIED", PARTIALLY_APPLIED = "PARTIALLY_APPLIED", FULLY_APPLIED = "FULLY_APPLIED" }
export enum CollectionActivityType { EMAIL_REMINDER = "Email Reminder Sent", PHONE_CALL = "Phone Call Made", LETTER_SENT = "Dunning Letter Sent", PAYMENT_PROMISE = "Payment Promise Received", DISPUTE_RAISED = "Dispute Raised", ESCALATED_TO_LEGAL = "Escalated to Legal" }
export enum DepreciationMethod { STRAIGHT_LINE = "STRAIGHT_LINE", DECLINING_BALANCE = "DECLINING_BALANCE", UNITS_OF_PRODUCTION = "UNITS_OF_PRODUCTION" }
export enum AssetStatus { IN_USE = "IN_USE", IDLE = "IDLE", UNDER_MAINTENANCE = "UNDER_MAINTENANCE", DISPOSED = "DISPOSED", PENDING_DISPOSAL = "PENDING_DISPOSAL" }
export enum MaintenanceStatus { SCHEDULED = "Scheduled", COMPLETED = "Completed", OVERDUE = "Overdue", CANCELLED = "Cancelled", IN_PROGRESS = "In Progress"}
export enum MaintenanceType { PREVENTIVE = "Preventive", REPAIR = "Repair", UPGRADE = "Upgrade", INSPECTION = "Inspection" }
export enum ItemType { RAW_MATERIAL = "RAW_MATERIAL", FINISHED_GOOD = "FINISHED_GOOD", SERVICE = "SERVICE", NON_STOCK = "NON_STOCK", OTHER = "OTHER" }
export enum ValuationMethod { FIFO = "FIFO", LIFO = "LIFO", WEIGHTED_AVERAGE = "WEIGHTED_AVERAGE", STANDARD_COST = "STANDARD_COST", SPECIFIC_IDENTIFICATION = "SPECIFIC_IDENTIFICATION" }
export enum StockTransactionType { GOODS_RECEIPT_PO = "Goods Receipt (PO)", GOODS_RECEIPT_DIRECT = "Goods Receipt (Direct)", GOODS_ISSUANCE_SO = "Goods Issuance (SO)", GOODS_ISSUANCE_INTERNAL = "Goods Issuance (Internal)", STOCK_ADJUSTMENT_IN = "Stock Adjustment (In)", STOCK_ADJUSTMENT_OUT = "Stock Adjustment (Out)", STOCK_TRANSFER_OUT = "Stock Transfer (Out)", STOCK_TRANSFER_IN = "Stock Transfer (In)", MANUFACTURING_INPUT = "Manufacturing (Input)", MANUFACTURING_OUTPUT = "Manufacturing (Output)" }
export enum StockAdjustmentReason {
    PHYSICAL_COUNT_MISMATCH = "Physical Count Mismatch",
    DAMAGED_GOODS = "Damaged Goods",
    OBSOLETE_STOCK_WRITEOFF = "Obsolete Stock Write-off",
    PROMOTIONAL_ITEMS = "Promotional Items",
    INTERNAL_CONSUMPTION = "Internal Consumption/Use",
    RETURN_TO_VENDOR = "Return to Vendor",
    CUSTOMER_RETURN = "Customer Return (Restock)",
    OTHER = "Other"
}

export const mockChartOfAccountsData = [ /* ... */ ];
export const mockJournalEntriesData = [ /* ... */ ];
const sampleTrialBalanceAccounts = [ /* ... */ ];
const calculateTotals = (accounts: Array<{totalDebit: number, totalCredit: number}>) => { /* ... */ return { debit: 0, credit: 0}; };
const sampleTrialBalanceTotals = calculateTotals(sampleTrialBalanceAccounts);
export const mockVendorsData = [ { id: 'V001', name: 'Supplier Alpha Ltd', isActive: true }, { id: 'V002', name: 'Beta Hardware Solutions', isActive: true }, {id: 'V003', name: 'Gamma Stationery Supplies', isActive: true} ];
export const mockPurchaseOrdersData = [ /* ... */ ];
export const mockAPInvoicesData = [ /* ... */ ];
export const mockAPPaymentsData = [ /* ... */ ];
export const mockExpenseClaimsData = [ /* ... */ ];
export const mockWhtTransactionsData = [ /* ... */ ];
export const mockCustomersData = [ /* ... */ ];
export const mockSalesOrdersData = [ /* ... */ ];
export const mockARInvoicesData = [ /* ... */ ];
export const mockARPaymentsReceivedData = [ /* ... */ ];
export const mockCollectionLogsData = [ /* ... */ ];
export const mockAssetRegisterData = [ /* ... */ ];
export const mockDepreciationRunResultsData = [ /* ... */ ];

export const mockItemMasterData = [ /* ... existing item master data ... */
  { id: 'ITM001', itemCode: 'INVITM-LAP01', itemName: 'Standard Laptop Model X', unitPrice: 85000, purchasePrice: 60000, quantityOnHand: 50, category: 'IT Equipment', unitOfMeasure: 'PCS', itemType: ItemType.FINISHED_GOOD, isActive: true, preferredVendorId: 'V001', reservedStock: 5, incomingStock: 20, lastStockCountDate: '2023-10-15' },
  { id: 'ITM002', itemCode: 'INVITM-RAM16', itemName: '16GB DDR4 RAM Module', unitPrice: 7000, purchasePrice: 4500, quantityOnHand: 120, category: 'Components', unitOfMeasure: 'PCS', itemType: ItemType.RAW_MATERIAL, isActive: true, preferredVendorId: 'V002', reservedStock: 10, incomingStock: 50, lastStockCountDate: '2023-10-20' },
];

export const mockStockTransactionsData = [ /* ... existing stock transactions data ... */ ];

export const mockStockAdjustmentsData = [
  {
    id: 'ADJ-001', adjustmentDate: '2023-10-31',
    itemId: 'ITM001', itemName: 'Standard Laptop Model X',
    adjustmentType: 'Decrease', quantityAdjusted: 1,
    reason: StockAdjustmentReason.DAMAGED_GOODS,
    notes: 'Screen cracked during handling in warehouse.', approvedBy: 'Jane Supervisor'
  },
  {
    id: 'ADJ-002', adjustmentDate: '2023-11-05',
    itemId: 'ITM002', itemName: '16GB DDR4 RAM Module',
    adjustmentType: 'Increase', quantityAdjusted: 10,
    reason: StockAdjustmentReason.PHYSICAL_COUNT_MISMATCH,
    notes: 'Found extra units during weekly cycle count.', approvedBy: 'John Storekeeper'
  },
  {
    id: 'ADJ-003', adjustmentDate: '2023-11-10',
    itemId: 'ITM001', itemName: 'Standard Laptop Model X',
    adjustmentType: 'Decrease', quantityAdjusted: 2,
    reason: StockAdjustmentReason.INTERNAL_CONSUMPTION,
    notes: 'Used for internal IT department setup.', approvedBy: 'Tech Lead'
  },
];


export const mockData = {
  generalLedger: { /* ... */ },
  accountsPayable: { /* ... */ },
  accountsReceivable: { /* ... */ },
  inventory: {
    itemMaster: mockItemMasterData,
    stockTransactions: mockStockTransactionsData,
    stockAdjustments: mockStockAdjustmentsData, // Added stock adjustments
    warehouses: [ {id: 'WH-MAIN', name: 'Main Warehouse'}, {id: 'WH-RETAIL', name: 'Retail Outlet Store'} ],
  },
  reports: {},
  budgeting: { /* ... */ },
  fixedAssets: { /* ... */ }
};

export const getMockCoaById = (id: string) => mockData.generalLedger.chartOfAccounts.find(acc => acc.id === id);
// ... other getter functions ...
export const getMockInventoryItemById = (id: string) => mockData.inventory.itemMaster.find(item => item.id === id);
export const getMockStockTransactionById = (id: string) => mockData.inventory.stockTransactions.find(st => st.id === id);
export const getMockStockAdjustmentById = (id: string) => mockData.inventory.stockAdjustments.find(adj => adj.id === id);
export const getMockWhtTransactionById = (id: string) => mockData.accountsPayable.whtTransactions.find(wht => wht.id === id);
