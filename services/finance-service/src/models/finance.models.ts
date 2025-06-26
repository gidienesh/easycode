// Core Finance Types and Interfaces

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  COST_OF_GOODS_SOLD = 'COST_OF_GOODS_SOLD'
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  MPESA = 'MPESA',
  CHEQUE = 'CHEQUE',
  CASH = 'CASH',
  CARD = 'CARD'
}

export enum AssetStatus {
  IN_USE = 'IN_USE',
  IDLE = 'IDLE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  DISPOSED = 'DISPOSED',
  PENDING_DISPOSAL = 'PENDING_DISPOSAL'
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION'
}

export enum TaxType {
  VAT = 'VAT',
  WITHHOLDING_TAX = 'WITHHOLDING_TAX',
  PAYE = 'PAYE',
  CORPORATE_TAX = 'CORPORATE_TAX'
}

// Chart of Accounts
export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentId?: string;
  hierarchyLevel: number;
  isActive: boolean;
  tenantId: string;
  balance?: number;
  children?: ChartOfAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAccountRequest {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentId?: string;
}

// Journal Entries
export interface JournalEntry {
  id: string;
  entryDate: Date;
  description: string;
  reference?: string;
  tenantId: string;
  status: JournalEntryStatus;
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  chartOfAccountId: string;
  accountCode?: string;
  accountName?: string;
  debit: number;
  credit: number;
  description?: string;
  financialDimensions?: Record<string, string>;
}

export interface CreateJournalEntryRequest {
  entryDate: Date;
  description: string;
  reference?: string;
  lines: Omit<JournalEntryLine, 'id' | 'journalEntryId'>[];
}

// Accounts Payable
export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms: string;
  taxId?: string;
  isActive: boolean;
  tenantId: string;
  totalOutstanding: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface APInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor?: Vendor;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  description?: string;
  reference?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface APPayment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendor?: Vendor;
  paymentDate: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  status: PaymentStatus;
  tenantId: string;
  invoices: APPaymentInvoice[];
  createdAt: Date;
  updatedAt: Date;
}

export interface APPaymentInvoice {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoice?: APInvoice;
  amountApplied: number;
}

// Accounts Receivable
export interface Customer {
  id: string;
  customerCode: string;
  customerName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  paymentTerms: string;
  taxId?: string;
  isActive: boolean;
  tenantId: string;
  totalOutstanding: number;
  availableCredit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  description?: string;
  reference?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ARPayment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customer?: Customer;
  paymentDate: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  status: PaymentStatus;
  tenantId: string;
  invoices: ARPaymentInvoice[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ARPaymentInvoice {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoice?: ARInvoice;
  amountApplied: number;
}

// Fixed Assets
export interface FixedAsset {
  id: string;
  assetCode: string;
  assetName: string;
  description?: string;
  category: string;
  location?: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;
  depreciationRate?: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  status: AssetStatus;
  serialNumber?: string;
  assignedToUser?: string;
  department?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepreciationEntry {
  id: string;
  assetId: string;
  asset?: FixedAsset;
  depreciationDate: Date;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  journalEntryId?: string;
  tenantId: string;
  createdAt: Date;
}

// Financial Dimensions
export interface FinancialDimension {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  isActive: boolean;
  definedValues: FinancialDimensionValue[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialDimensionValue {
  id: string;
  financialDimensionId: string;
  value: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Management
export interface Budget {
  id: string;
  budgetName: string;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
  tenantId: string;
  lines: BudgetLine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLine {
  id: string;
  budgetId: string;
  accountId: string;
  account?: ChartOfAccount;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  financialDimensions?: Record<string, string>;
}

// Tax Management
export interface Tax {
  id: string;
  taxCode: string;
  taxName: string;
  taxType: TaxType;
  rate: number;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxTransaction {
  id: string;
  taxId: string;
  tax?: Tax;
  transactionDate: Date;
  baseAmount: number;
  taxAmount: number;
  reference: string;
  description?: string;
  tenantId: string;
  createdAt: Date;
}

// Reports
export interface TrialBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

export interface BalanceSheet {
  asOfDate: Date;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
}

export interface BalanceSheetSection {
  accounts: BalanceSheetAccount[];
  total: number;
}

export interface BalanceSheetAccount {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
  children?: BalanceSheetAccount[];
}

export interface IncomeStatement {
  periodStart: Date;
  periodEnd: Date;
  revenue: IncomeStatementSection;
  costOfGoodsSold: IncomeStatementSection;
  grossProfit: number;
  expenses: IncomeStatementSection;
  netIncome: number;
}

export interface IncomeStatementSection {
  accounts: IncomeStatementAccount[];
  total: number;
}

export interface IncomeStatementAccount {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
  children?: IncomeStatementAccount[];
}

export interface CashFlow {
  periodStart: Date;
  periodEnd: Date;
  operatingActivities: CashFlowSection;
  investingActivities: CashFlowSection;
  financingActivities: CashFlowSection;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface CashFlowSection {
  items: CashFlowItem[];
  total: number;
}

export interface CashFlowItem {
  description: string;
  amount: number;
}

// Dashboard KPIs
export interface FinancialKPIs {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  grossMargin: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquityRatio: number;
  returnOnAssets: number;
  returnOnEquity: number;
  cashBalance: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventoryValue: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request/Response DTOs
export interface CreateVendorRequest {
  vendorCode: string;
  vendorName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms: string;
  taxId?: string;
}

export interface CreateCustomerRequest {
  customerCode: string;
  customerName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  paymentTerms: string;
  taxId?: string;
}

export interface CreateAPInvoiceRequest {
  invoiceNumber: string;
  vendorId: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  description?: string;
  reference?: string;
}

export interface CreateARInvoiceRequest {
  invoiceNumber: string;
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  description?: string;
  reference?: string;
}

export interface CreatePaymentRequest {
  paymentDate: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  invoiceAllocations: {
    invoiceId: string;
    amountApplied: number;
  }[];
}

export interface CreateFixedAssetRequest {
  assetCode: string;
  assetName: string;
  description?: string;
  category: string;
  location?: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;
  depreciationRate?: number;
  salvageValue: number;
  serialNumber?: string;
  assignedToUser?: string;
  department?: string;
} 