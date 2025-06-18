// src/lib/prismaPlaceholders.ts
// Placeholder for Decimal, not actually available without Prisma client or a decimal library
// import { Decimal } from '@prisma/client/runtime/library';

// Enums
export enum AccountType {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EQUITY = "EQUITY",
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE",
  COST_OF_GOODS_SOLD = "COST_OF_GOODS_SOLD",
}

export enum JournalEntryStatus {
  DRAFT = "DRAFT",
  POSTED = "POSTED",
  REVERSED = "REVERSED",
}

// Interfaces for model types
export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentId?: string | null;
  hierarchyLevel?: number;
  isActive?: boolean;
  tenantId: string;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  chartOfAccountId: string;
  chartOfAccount?: ChartOfAccount;
  debit: number;
  credit: number;
  description?: string | null;
  financialDimensions?: any | null;
}

export interface JournalEntry {
  id: string;
  entryDate: Date; // Stored as Date object
  description: string;
  tenantId: string;
  status: JournalEntryStatus;
  lines?: JournalEntryLine[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialDimension {
  id: string;
  name: string;
  description?: string | null;
  tenantId: string;
  isActive?: boolean;
  definedValues?: FinancialDimensionValue[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialDimensionValue {
  id: string;
  financialDimensionId: string;
  financialDimension?: FinancialDimension;
  value: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


// Store for mock data
const mockCoaData: ChartOfAccount[] = [
    { id: 'coa1', accountCode: '1000', accountName: 'Cash', accountType: AccountType.ASSET, tenantId: 'tenant1', isActive: true },
    { id: 'coa2', accountCode: '2000', accountName: 'Accounts Payable', accountType: AccountType.LIABILITY, tenantId: 'tenant1', isActive: true },
    { id: 'coa3', accountCode: '4000', accountName: 'Revenue', accountType: AccountType.REVENUE, tenantId: 'tenant1', isActive: true },
    { id: 'coa4', accountCode: '5000', accountName: 'Office Supplies', accountType: AccountType.EXPENSE, tenantId: 'tenant1', isActive: true },
    { id: 'coa5', accountCode: '1010', accountName: 'Petty Cash', accountType: AccountType.ASSET, tenantId: 'tenant2', isActive: true },
    { id: 'coa-inactive', accountCode: '9999', accountName: 'Old Bank Account', accountType: AccountType.ASSET, tenantId: 'tenant1', isActive: false },
];

const mockJournalEntryData: JournalEntry[] = [
    { id: 'je1', entryDate: new Date('2023-01-15'), description: 'Office Supplies Purchase', tenantId: 'tenant1', status: JournalEntryStatus.POSTED, createdAt: new Date(), updatedAt: new Date() },
    { id: 'je2', entryDate: new Date('2023-01-20'), description: 'Revenue Q1', tenantId: 'tenant1', status: JournalEntryStatus.POSTED, createdAt: new Date(), updatedAt: new Date() },
    { id: 'je3', entryDate: new Date('2023-02-10'), description: 'Draft for Feb', tenantId: 'tenant1', status: JournalEntryStatus.DRAFT, createdAt: new Date(), updatedAt: new Date() },
    { id: 'je4', entryDate: new Date('2023-01-05'), description: 'Early Jan Posting', tenantId: 'tenant1', status: JournalEntryStatus.POSTED, createdAt: new Date(), updatedAt: new Date() },
];

const mockJournalEntryLineData: JournalEntryLine[] = [
    // je1 lines
    { id: 'jel1-1', journalEntryId: 'je1', chartOfAccountId: 'coa4', debit: 50, credit: 0, description: 'Pens and Paper' },
    { id: 'jel1-2', journalEntryId: 'je1', chartOfAccountId: 'coa1', debit: 0, credit: 50, description: 'Paid from cash' },
    // je2 lines
    { id: 'jel2-1', journalEntryId: 'je2', chartOfAccountId: 'coa1', debit: 1000, credit: 0, description: 'Cash received' },
    { id: 'jel2-2', journalEntryId: 'je2', chartOfAccountId: 'coa3', debit: 0, credit: 1000, description: 'Service Revenue' },
    // je3 lines (draft)
    { id: 'jel3-1', journalEntryId: 'je3', chartOfAccountId: 'coa4', debit: 25, credit: 0 },
    { id: 'jel3-2', journalEntryId: 'je3', chartOfAccountId: 'coa1', debit: 0, credit: 25 },
    // je4 lines (early Jan)
    { id: 'jel4-1', journalEntryId: 'je4', chartOfAccountId: 'coa1', debit: 200, credit: 0 },
    { id: 'jel4-2', journalEntryId: 'je4', chartOfAccountId: 'coa3', debit: 0, credit: 200 },
];


const mockDb = {
  chartOfAccounts: [...mockCoaData] as ChartOfAccount[],
  journalEntries: [...mockJournalEntryData] as JournalEntry[],
  journalEntryLines: [...mockJournalEntryLineData] as JournalEntryLine[],
  financialDimensions: [] as FinancialDimension[],
  financialDimensionValues: [] as FinancialDimensionValue[],
};
// Reset function for tests if needed
export const resetMockDb = () => {
    mockDb.chartOfAccounts = [...mockCoaData];
    mockDb.journalEntries = [...mockJournalEntryData];
    mockDb.journalEntryLines = [...mockJournalEntryLineData];
    mockDb.financialDimensions = [];
    mockDb.financialDimensionValues = [];
};


const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
interface FindManyArgs<TWhereInput = any, TInclude = any, TOrderBy = any> { where?: TWhereInput; include?: TInclude; orderBy?: TOrderBy; skip?: number; take?: number; }
interface FindUniqueArgs<TWhereUniqueInput = any, TInclude = any> { where: TWhereUniqueInput; include?: TInclude; }
interface CreateArgs<TCreateInput = any, TInclude = any> { data: TCreateInput; include?: TInclude; }
interface UpdateArgs<TUpdateInput = any, TWhereUniqueInput = any, TInclude = any> { where: TWhereUniqueInput; data: TUpdateInput; include?: TInclude; }
interface DeleteArgs<TWhereUniqueInput = any> { where: TWhereUniqueInput; }

export const prisma = {
  _mockDb: mockDb,
  _resetMockDb: resetMockDb, // Expose reset for test utility
  chartOfAccount: {
    findMany: async (args?: FindManyArgs<Partial<ChartOfAccount>>): Promise<ChartOfAccount[]> => {
      let results = deepClone(mockDb.chartOfAccounts);
      if (args?.where) {
        results = results.filter(coa =>
          Object.entries(args.where!).every(([key, value]) => (coa as any)[key] === value)
        );
      }
      return results;
    },
    findUnique: async (args: FindUniqueArgs<{ id: string }>): Promise<ChartOfAccount | null> => {
      const account = mockDb.chartOfAccounts.find(coa => coa.id === args.where.id);
      return account ? deepClone(account) : null;
    },
     create: async (args: CreateArgs<Omit<ChartOfAccount, 'id'>>): Promise<ChartOfAccount> => {
      const newAccount: ChartOfAccount = { id: `mock-coa-${Date.now()}`, ...args.data } as ChartOfAccount;
      mockDb.chartOfAccounts.push(newAccount);
      return deepClone(newAccount);
    },
    update: async (args: UpdateArgs<Partial<Omit<ChartOfAccount, 'id'>>, { id: string }>): Promise<ChartOfAccount | null> => {
      const index = mockDb.chartOfAccounts.findIndex(coa => coa.id === args.where.id);
      if (index === -1) return null;
      mockDb.chartOfAccounts[index] = { ...mockDb.chartOfAccounts[index], ...args.data };
      return deepClone(mockDb.chartOfAccounts[index]);
    },
    delete: async (args: DeleteArgs<{ id: string }>): Promise<ChartOfAccount | null> => {
      const index = mockDb.chartOfAccounts.findIndex(coa => coa.id === args.where.id);
      if (index === -1) return null;
      return deepClone(mockDb.chartOfAccounts.splice(index, 1)[0]);
    },
  },
  journalEntry: { // Simplified, no include handling for brevity in this update
    findMany: async (args?: FindManyArgs<Partial<JournalEntry>>): Promise<JournalEntry[]> => {
      let entries = deepClone(mockDb.journalEntries);
      if(args?.where) {
        if (args.where.tenantId) entries = entries.filter(e => e.tenantId === args.where!.tenantId);
        if (args.where.status) entries = entries.filter(e => e.status === args.where!.status);
        if (args.where.entryDate) {
            // @ts-ignore
            if(args.where.entryDate.gte) entries = entries.filter(e => new Date(e.entryDate) >= new Date(args.where!.entryDate.gte));
            // @ts-ignore
            if(args.where.entryDate.lte) entries = entries.filter(e => new Date(e.entryDate) <= new Date(args.where!.entryDate.lte));
        }
      }
      // Simplified include lines
      if (args?.include?.lines) {
        for (const entry of entries) {
          entry.lines = deepClone(mockDb.journalEntryLines.filter(line => line.journalEntryId === entry.id));
        }
      }
      return entries;
    },
    findUnique: async (args: FindUniqueArgs<{ id: string }, { lines?: boolean | { include?: { chartOfAccount?: boolean } } }>): Promise<JournalEntry | null> => {
      const entry = mockDb.journalEntries.find(je => je.id === args.where.id);
      if (!entry) return null;
      const clonedEntry = deepClone(entry);
      if (args.include?.lines) {
        clonedEntry.lines = deepClone(mockDb.journalEntryLines.filter(line => line.journalEntryId === clonedEntry.id));
        if (typeof args.include.lines === 'object' && args.include.lines.include?.chartOfAccount) {
          for (const line of clonedEntry.lines!) {
            // @ts-ignore
            line.chartOfAccount = deepClone(mockDb.chartOfAccounts.find(coa => coa.id === line.chartOfAccountId));
          }
        }
      }
      return clonedEntry;
    },
    create: async (args: CreateArgs<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'lines'> & { lines?: { create: Array<Omit<JournalEntryLine, 'id' | 'journalEntryId'>> } }, { lines?: boolean }>): Promise<JournalEntry> => {
      const entryId = `mock-je-${Date.now()}`;
      const newEntryData = { ...args.data, entryDate: new Date(args.data.entryDate || Date.now()), status: args.data.status || JournalEntryStatus.DRAFT, createdAt: new Date(), updatedAt: new Date()};
      const newEntry: JournalEntry = { id: entryId, ...newEntryData, lines: [] };
      mockDb.journalEntries.push(newEntry);
      let createdLines: JournalEntryLine[] = [];
      if (args.data.lines?.create) {
        createdLines = args.data.lines.create.map((line, i) => {
          const newLine: JournalEntryLine = { ...line, id: `mock-line-${Date.now()}-${i}`, journalEntryId: entryId, debit: Number(line.debit), credit: Number(line.credit) };
          mockDb.journalEntryLines.push(newLine);
          return newLine;
        });
      }
      if (args.include?.lines) newEntry.lines = deepClone(createdLines);
      else delete newEntry.lines;
      return deepClone(newEntry);
    },
    update: async (args: UpdateArgs<Partial<Omit<JournalEntry, 'id' | 'lines' | 'createdAt' | 'updatedAt'>>, { id: string }, { lines?: boolean }>): Promise<JournalEntry | null> => {
      const index = mockDb.journalEntries.findIndex(je => je.id === args.where.id);
      if (index === -1) return null;
      const existing = mockDb.journalEntries[index];
      if (args.data.status && existing.status !== JournalEntryStatus.DRAFT && args.data.status === JournalEntryStatus.DRAFT) { console.warn(`Mock: Denying status change from ${existing.status} to DRAFT.`); return deepClone(existing); }
      mockDb.journalEntries[index] = { ...existing, ...args.data, updatedAt: new Date() };
      const updated = deepClone(mockDb.journalEntries[index]);
      if (args.include?.lines) updated.lines = deepClone(mockDb.journalEntryLines.filter(l => l.journalEntryId === updated.id));
      else delete updated.lines;
      return updated;
    },
  },
  journalEntryLine: {
    findMany: async (args?: FindManyArgs<Partial<JournalEntryLine>>): Promise<JournalEntryLine[]> => {
      let results = deepClone(mockDb.journalEntryLines);
      if (args?.where) {
        results = results.filter(line =>
          Object.entries(args.where!).every(([key, value]) => {
            if (key === 'journalEntry') { // Special handling for filtering by parent JE properties
              const je = mockDb.journalEntries.find(entry => entry.id === line.journalEntryId);
              if (!je) return false;
              // @ts-ignore
              return Object.entries(value).every(([jeKey, jeValue]) => (je as any)[jeKey] === jeValue);
            }
            return (line as any)[key] === value;
          })
        );
      }
      return results;
    },
  },
  financialDimension: { /* ... existing financialDimension mocks ... */
    findMany: async (args?: FindManyArgs<Partial<FinancialDimension>, { definedValues?: boolean }>): Promise<FinancialDimension[]> => {
      let dimensions = deepClone(mockDb.financialDimensions);
      if (args?.where?.tenantId) dimensions = dimensions.filter(fd => fd.tenantId === args.where!.tenantId);
      if (args?.where?.isActive !== undefined) dimensions = dimensions.filter(fd => fd.isActive === args.where!.isActive);
      if (args?.include?.definedValues) {
        dimensions.forEach(dim => dim.definedValues = deepClone(mockDb.financialDimensionValues.filter(val => val.financialDimensionId === dim.id)));
      }
      return dimensions;
    },
    findUnique: async (args: FindUniqueArgs<{ id: string }, { definedValues?: boolean }>): Promise<FinancialDimension | null> => {
      const dim = mockDb.financialDimensions.find(fd => fd.id === args.where.id);
      if (!dim) return null;
      const clonedDim = deepClone(dim);
      if (args.include?.definedValues) clonedDim.definedValues = deepClone(mockDb.financialDimensionValues.filter(val => val.financialDimensionId === clonedDim.id));
      return clonedDim;
    },
    create: async (args: CreateArgs<Omit<FinancialDimension, 'id' | 'createdAt' | 'updatedAt' | 'definedValues'>>): Promise<FinancialDimension> => {
      const newDim: FinancialDimension = { id: `mock-fd-${Date.now()}`, ...args.data, isActive: args.data.isActive !== undefined ? args.data.isActive : true, createdAt: new Date(), updatedAt: new Date() };
      mockDb.financialDimensions.push(newDim);
      return deepClone(newDim);
    },
    update: async (args: UpdateArgs<Partial<Omit<FinancialDimension, 'id' | 'createdAt' | 'updatedAt' | 'definedValues'>>, { id: string }>): Promise<FinancialDimension | null> => {
      const index = mockDb.financialDimensions.findIndex(fd => fd.id === args.where.id);
      if (index === -1) return null;
      mockDb.financialDimensions[index] = { ...mockDb.financialDimensions[index], ...args.data, updatedAt: new Date() };
      return deepClone(mockDb.financialDimensions[index]);
    },
    delete: async (args: DeleteArgs<{ id: string }>): Promise<FinancialDimension | null> => {
      const index = mockDb.financialDimensions.findIndex(fd => fd.id === args.where.id);
      if (index === -1) return null;
      mockDb.financialDimensionValues = mockDb.financialDimensionValues.filter(val => val.financialDimensionId !== args.where.id);
      return deepClone(mockDb.financialDimensions.splice(index, 1)[0]);
    },
  },
  financialDimensionValue: { /* ... existing financialDimensionValue mocks ... */
    findMany: async (args?: FindManyArgs<Partial<FinancialDimensionValue>>): Promise<FinancialDimensionValue[]> => {
       if (!args?.where) return deepClone(mockDb.financialDimensionValues);
       let results = deepClone(mockDb.financialDimensionValues);
       if (args?.where) {
           results = results.filter(val => Object.entries(args.where!).every(([k, v]) => (val as any)[k] === v));
       }
       return results;
    },
    findUnique: async (args: FindUniqueArgs<{ id: string }>): Promise<FinancialDimensionValue | null> => {
      const val = mockDb.financialDimensionValues.find(fdv => fdv.id === args.where.id);
      return val ? deepClone(val) : null;
    },
    create: async (args: CreateArgs<Omit<FinancialDimensionValue, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FinancialDimensionValue> => {
      const newVal: FinancialDimensionValue = { id: `mock-fdv-${Date.now()}`, ...args.data, isActive: args.data.isActive !== undefined ? args.data.isActive : true, createdAt: new Date(), updatedAt: new Date() };
      mockDb.financialDimensionValues.push(newVal);
      return deepClone(newVal);
    },
    update: async (args: UpdateArgs<Partial<Omit<FinancialDimensionValue, 'id' | 'createdAt' | 'updatedAt'>>, { id: string }>): Promise<FinancialDimensionValue | null> => {
      const index = mockDb.financialDimensionValues.findIndex(fdv => fdv.id === args.where.id);
      if (index === -1) return null;
      mockDb.financialDimensionValues[index] = { ...mockDb.financialDimensionValues[index], ...args.data, updatedAt: new Date() };
      return deepClone(mockDb.financialDimensionValues[index]);
    },
    delete: async (args: DeleteArgs<{ id: string }>): Promise<FinancialDimensionValue | null> => {
      const index = mockDb.financialDimensionValues.findIndex(fdv => fdv.id === args.where.id);
      if (index === -1) return null;
      return deepClone(mockDb.financialDimensionValues.splice(index, 1)[0]);
    },
  },
};
