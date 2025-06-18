import { Request, Response } from 'express';
import { JournalEntry, JournalEntryLine, JournalEntryStatus, LedgerAccount, AccountType, NormalBalance } from '../models';
import { randomUUID } from 'crypto';

const mockJournalEntries: JournalEntry[] = [];
// Initialize with a few common accounts for balance check simulation
const mockLedgerAccounts: LedgerAccount[] = [
    // Assets
    { id: 'acc-cash', tenantId: 't1', accountCode: '10100', name: 'Cash in Bank', type: 'asset', normalBalance: 'debit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'acc-ar', tenantId: 't1', accountCode: '10500', name: 'Accounts Receivable', type: 'asset', normalBalance: 'debit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    // Liabilities
    { id: 'acc-ap', tenantId: 't1', accountCode: '20100', name: 'Accounts Payable', type: 'liability', normalBalance: 'credit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    // Equity
    { id: 'acc-equity', tenantId: 't1', accountCode: '30100', name: 'Common Stock', type: 'equity', normalBalance: 'credit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    // Revenue
    { id: 'acc-sales', tenantId: 't1', accountCode: '40100', name: 'Sales Revenue', type: 'revenue', normalBalance: 'credit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    // Expenses
    { id: 'acc-rent', tenantId: 't1', accountCode: '50100', name: 'Rent Expense', type: 'expense', normalBalance: 'debit', isActive: true, createdAt: new Date(), updatedAt: new Date() },
];


export const createJournalEntry = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, entryDate, description, lines, reference, userId, ...rest } = req.body as Omit<JournalEntry, 'id'|'status'|'createdAt'|'updatedAt'|'entryNumber'|'postedDate'>;

  if (!tenantId || !entryDate || !lines || lines.length < 2) {
    res.status(400).json({ message: 'Missing required fields: tenantId, entryDate, or lines (must be at least 2).' });
    return;
  }

  let debitTotal = 0;
  let creditTotal = 0;
  for (const line of lines) {
    if (!line.ledgerAccountId || !line.lineType || line.amount === undefined || line.amount <= 0) {
        res.status(400).json({ message: 'Each journal entry line must have ledgerAccountId, lineType, and a positive amount.'});
        return;
    }
    if (line.lineType === 'debit') {
      debitTotal += line.amount;
    } else if (line.lineType === 'credit') {
      creditTotal += line.amount;
    } else {
        res.status(400).json({ message: `Invalid lineType: ${line.lineType}. Must be 'debit' or 'credit'.`});
        return;
    }
  }

  // Using a small tolerance for floating point comparisons
  if (Math.abs(debitTotal - creditTotal) > 0.00001) {
    res.status(400).json({ message: `Debits (${debitTotal}) must equal credits (${creditTotal}).` });
    return;
  }

  const newJE: JournalEntry = {
    id: randomUUID(),
    tenantId,
    entryDate: new Date(entryDate),
    description,
    lines,
    reference,
    userId,
    status: 'posted' as JournalEntryStatus, // Or 'draft' if approval workflow exists
    entryNumber: `JE-${Date.now()}`, // Simple mock generation
    postedDate: new Date(), // If status is 'posted'
    ...rest,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockJournalEntries.push(newJE);

  // Conceptually, update account balances here
  // This is simplified for mock. A real system would have an atomic process.
  lines.forEach(line => {
    const account = mockLedgerAccounts.find(acc => acc.id === line.ledgerAccountId && acc.tenantId === tenantId);
    if (account) {
        // This is not how balances are stored; they are derived from all JEs.
        // This is just for the getLedgerAccountBalance mock.
        // In a real system, getLedgerAccountBalance would sum up all relevant JE lines.
    }
  });

  res.status(201).json(newJE);
};

export const getJournalEntryById = async (req: Request, res: Response): Promise<void> => {
    const je = mockJournalEntries.find(entry => entry.id === req.params.journalEntryId);
    // TODO: Check tenantId
    if (je) {
        res.json(je);
    } else {
        res.status(404).json({ message: 'Journal Entry not found.' });
    }
};

export const getLedgerAccountBalance = async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;
    const { tenantId, date } = req.query; // date is effective date for balance

    const account = mockLedgerAccounts.find(acc => acc.id === accountId && acc.tenantId === (tenantId as string));
    if (!account) {
        res.status(404).json({ message: 'Ledger account not found for the specified tenant.'});
        return;
    }

    let balance = 0;
    mockJournalEntries
        .filter(je => je.tenantId === (tenantId as string) && je.status === 'posted' && new Date(je.postedDate!) <= (date ? new Date(date as string) : new Date()))
        .forEach(je => {
            je.lines.forEach(line => {
                if (line.ledgerAccountId === accountId) {
                    if (line.lineType === account.normalBalance) {
                        balance += line.amount;
                    } else {
                        balance -= line.amount;
                    }
                }
            });
        });

    res.json({ accountId, accountName: account.name, accountCode: account.accountCode, balance, asOfDate: date || new Date().toISOString().split('T')[0], tenantId });
};

// TODO: Controllers for ChartOfAccounts, FinancialDimensions, BankStatements, Budgets, FixedAssets
// TODO: Controllers for period-end closing processes.
// TODO: Controllers for financial reports.
