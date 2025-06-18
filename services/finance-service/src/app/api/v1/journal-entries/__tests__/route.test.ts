// Test stubs for POST and GET (list) Journal Entries
// This file helps create the directory structure:
// services/finance-service/src/app/api/v1/journal-entries/__tests__

import { GET, POST } from '../route'; // Adjust path as necessary
import { prisma, JournalEntryStatus, AccountType, ChartOfAccount } from '../../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server
const mockJson = jest.fn().mockImplementation((data, options) => ({
  json: async () => data,
  status: options?.status || 200,
  headers: new Headers(),
  ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => mockJson(args[0], args[1]),
  },
}));

// Spy on Prisma methods
jest.spyOn(prisma.journalEntry, 'create');
jest.spyOn(prisma.journalEntry, 'findMany');
jest.spyOn(prisma.chartOfAccount, 'findUnique'); // Though not directly used in this file's handlers, good to have if logic evolves

// Utility to create a mock Request object
const createMockRequest = (method: string, body?: any, urlParams = ''): Request => {
  const url = `http://localhost/api/v1/journal-entries${urlParams}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });
};

const validLine1: any = { chartOfAccountId: 'coa1', debit: 100, credit: 0 };
const validLine2: any = { chartOfAccountId: 'coa2', debit: 0, credit: 100 };
const validBaseBody: any = {
  description: 'Test Journal Entry',
  tenantId: 'test-tenant',
  entryDate: new Date().toISOString(),
};

describe('Journal Entries API - POST /api/v1/journal-entries', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.journalEntry.create as jest.Mock).mockClear();
    // Reset mockDb or specific parts if needed for POST tests, e.g.,
    // prisma._mockDb.journalEntries = [];
    // prisma._mockDb.journalEntryLines = [];
  });

  it('should create a journal entry successfully with valid balanced lines', async () => {
    const mockRequestBody = { ...validBaseBody, lines: [validLine1, validLine2] };
    (prisma.journalEntry.create as jest.Mock).mockResolvedValueOnce({
      id: 'je1', ...mockRequestBody, status: JournalEntryStatus.DRAFT,
      lines: mockRequestBody.lines.map((l:any, i:number) => ({...l, id: `line${i}`}))
    });
    const req = createMockRequest('POST', mockRequestBody);
    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(prisma.journalEntry.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        description: validBaseBody.description,
        status: JournalEntryStatus.DRAFT, // Ensure it defaults to DRAFT
        lines: expect.objectContaining({
          create: expect.arrayContaining([
            expect.objectContaining({ debit: 100 }),
            expect.objectContaining({ credit: 100 }),
          ])
        })
      })
    }));
    expect(responseBody.status).toBe(JournalEntryStatus.DRAFT);
  });

  it('should return 400 if lines are unbalanced', async () => {
    const unbalancedLines = [validLine1, { chartOfAccountId: 'coa2', debit: 0, credit: 90 }]; // 100 debit, 90 credit
    const req = createMockRequest('POST', { ...validBaseBody, lines: unbalancedLines });
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Total debits and credits must balance');
  });

  it('should return 400 if a line has both debit and credit > 0', async () => {
    const invalidLine = { chartOfAccountId: 'coa3', debit: 50, credit: 50 };
    const req = createMockRequest('POST', { ...validBaseBody, lines: [validLine1, invalidLine, validLine2] }); // Balance it for other checks
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('A single line cannot have both debit and credit values greater than zero');
  });

  it('should return 400 if a line has negative debit/credit', async () => {
    const negativeDebitLine = { chartOfAccountId: 'coa3', debit: -50, credit: 0 };
    const req = createMockRequest('POST', { ...validBaseBody, lines: [negativeDebitLine, { chartOfAccountId: 'coa4', debit: 0, credit: -50 }] });
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Debit and credit amounts cannot be negative');
  });

  it('should return 400 if chartOfAccountId is missing on a line', async () => {
    const missingCoaLine = { debit: 100, credit: 0 }; // Missing chartOfAccountId
    const req = createMockRequest('POST', { ...validBaseBody, lines: [missingCoaLine, validLine2] });
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Each line must have a chartOfAccountId');
  });

   it('should return 400 if total debits/credits are zero', async () => {
    const zeroLines = [{ chartOfAccountId: 'coa1', debit: 0, credit: 0 }];
    const req = createMockRequest('POST', { ...validBaseBody, lines: zeroLines });
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Total debits and credits must be greater than zero');
  });
});

describe('Journal Entries API - GET /api/v1/journal-entries', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.journalEntry.findMany as jest.Mock).mockClear();
  });

  it('should return a list of journal entries', async () => {
    const mockEntries = [{ id: 'je1', description: 'Entry 1' }];
    (prisma.journalEntry.findMany as jest.Mock).mockResolvedValueOnce(mockEntries);
    const req = createMockRequest('GET');
    const response = await GET(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockEntries);
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: { entryDate: 'desc' },
        include: { lines: true }
    }));
  });

  it('should filter by tenantId', async () => {
    const req = createMockRequest('GET', undefined, '?tenantId=tenant123');
    await GET(req);
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ tenantId: 'tenant123' })
    }));
  });

  it('should filter by status', async () => {
    const req = createMockRequest('GET', undefined, `?status=${JournalEntryStatus.POSTED}`);
    await GET(req);
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ status: JournalEntryStatus.POSTED })
    }));
  });

  it('should filter by date range', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    const req = createMockRequest('GET', undefined, `?startDate=${startDate}&endDate=${endDate}`);
    await GET(req);
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        entryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        }
      })
    }));
  });

  it('should handle invalid filter parameters gracefully (e.g., invalid status)', async () => {
    const req = createMockRequest('GET', undefined, '?status=INVALID_STATUS');
    const response = await GET(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Invalid status filter value');
  });

  it('should handle invalid date formats gracefully', async () => {
    const req = createMockRequest('GET', undefined, '?startDate=invalid-date');
    const response = await GET(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Invalid startDate format');
  });
});
