// Test stubs for GET (one), PUT Journal Entries
// This file helps create the directory structure:
// services/finance-service/src/app/api/v1/journal-entries/[id]/__tests__

import { GET, PUT } from '../route'; // Adjust path as necessary
import { prisma, JournalEntryStatus, AccountType, ChartOfAccount, JournalEntry } from '../../../../../../../lib/prismaPlaceholders'; // Adjust path

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
jest.spyOn(prisma.journalEntry, 'findUnique');
jest.spyOn(prisma.journalEntry, 'update');
jest.spyOn(prisma.chartOfAccount, 'findUnique');


const MOCK_JE_ID = 'mock-je-id-123';
const MOCK_TENANT_ID = 'test-tenant-id';
const MOCK_COA_ID_ACTIVE = 'coa-active-test-id'; // Matches placeholder
const MOCK_COA_ID_INACTIVE = 'coa-inactive-test-id'; // Matches placeholder
const MOCK_COA_ID_OTHER = 'coa-other-test-id';


// Utility to create a mock Request object
const createMockRequest = (method: string, body?: any): Request => {
  const url = `http://localhost/api/v1/journal-entries/${MOCK_JE_ID}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });
};

const draftJournalEntry: JournalEntry = {
  id: MOCK_JE_ID,
  tenantId: MOCK_TENANT_ID,
  description: 'Draft Entry',
  entryDate: new Date(),
  status: JournalEntryStatus.DRAFT,
  lines: [
    { id: 'line1', journalEntryId: MOCK_JE_ID, chartOfAccountId: MOCK_COA_ID_ACTIVE, debit: 100, credit: 0, description: 'Debit leg' },
    { id: 'line2', journalEntryId: MOCK_JE_ID, chartOfAccountId: MOCK_COA_ID_OTHER, debit: 0, credit: 100, description: 'Credit leg' },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const postedJournalEntry: JournalEntry = {
  ...draftJournalEntry,
  status: JournalEntryStatus.POSTED,
};


describe('Journal Entries API - GET /api/v1/journal-entries/[id]', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.journalEntry.findUnique as jest.Mock).mockClear();
  });

  it('should return a journal entry with lines if found', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(draftJournalEntry);
    const req = createMockRequest('GET');
    const response = await GET(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(draftJournalEntry);
    expect(prisma.journalEntry.findUnique).toHaveBeenCalledWith({
      where: { id: MOCK_JE_ID },
      include: { lines: { include: { chartOfAccount: true } } },
    });
  });

  it('should return 404 if journal entry not found', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const req = createMockRequest('GET');
    const response = await GET(req, { params: { id: 'not-found-id' } });

    expect(response.status).toBe(404);
    expect((await response.json()).error).toContain('Journal entry not found');
  });
});

describe('Journal Entries API - PUT /api/v1/journal-entries/[id]', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.journalEntry.findUnique as jest.Mock).mockReset(); // Use reset for findUnique as it's called multiple times
    (prisma.journalEntry.update as jest.Mock).mockClear();
    (prisma.chartOfAccount.findUnique as jest.Mock).mockClear();
     // Setup default active COA mocks
    (prisma.chartOfAccount.findUnique as jest.Mock)
        .mockImplementation(async ({ where }: { where: { id: string }}) => {
            if (where.id === MOCK_COA_ID_ACTIVE || where.id === MOCK_COA_ID_OTHER) {
                return { id: where.id, isActive: true, accountCode: '000', accountName: 'Mock', tenantId: MOCK_TENANT_ID, accountType: AccountType.ASSET };
            }
            if (where.id === MOCK_COA_ID_INACTIVE) {
                return { id: where.id, isActive: false, accountCode: '000', accountName: 'Mock Inactive', tenantId: MOCK_TENANT_ID, accountType: AccountType.ASSET };
            }
            return null;
        });
  });

  it('should update description if status is DRAFT', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(draftJournalEntry);
    (prisma.journalEntry.update as jest.Mock).mockResolvedValueOnce({ ...draftJournalEntry, description: 'Updated Desc' });
    const req = createMockRequest('PUT', { description: 'Updated Desc' });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(200);
    expect((await response.json()).description).toBe('Updated Desc');
    expect(prisma.journalEntry.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { description: 'Updated Desc' }
    }));
  });

  it('should not update description if status is POSTED', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(postedJournalEntry);
    const req = createMockRequest('PUT', { description: 'Attempt Update Desc' });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(403);
    expect((await response.json()).error).toContain('Description can only be updated for DRAFT entries');
  });

  it('should change status from DRAFT to POSTED if valid and balanced', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(draftJournalEntry); // For initial fetch
    (prisma.journalEntry.update as jest.Mock).mockResolvedValueOnce({ ...draftJournalEntry, status: JournalEntryStatus.POSTED });

    const req = createMockRequest('PUT', { status: JournalEntryStatus.POSTED });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe(JournalEntryStatus.POSTED);
    expect(prisma.journalEntry.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: JournalEntryStatus.POSTED, entryDate: expect.any(Date) } // entryDate gets updated on posting
    }));
    // Check that COAs were validated
    expect(prisma.chartOfAccount.findUnique).toHaveBeenCalledWith({where: {id: MOCK_COA_ID_ACTIVE}});
    expect(prisma.chartOfAccount.findUnique).toHaveBeenCalledWith({where: {id: MOCK_COA_ID_OTHER}});
  });

  it('should not change status from DRAFT to POSTED if lines are unbalanced', async () => {
    const unbalancedDraftEntry = { ...draftJournalEntry, lines: [ { ...draftJournalEntry.lines![0], debit: 150 }, draftJournalEntry.lines![1] ]};
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(unbalancedDraftEntry);

    const req = createMockRequest('PUT', { status: JournalEntryStatus.POSTED });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Cannot post entry: Total debits and credits must balance for posting.');
  });

  it('should not change status from DRAFT to POSTED if a COA is inactive', async () => {
    const entryWithInactiveCOA = { ...draftJournalEntry, lines: [draftJournalEntry.lines![0], { ...draftJournalEntry.lines![1], chartOfAccountId: MOCK_COA_ID_INACTIVE }]};
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(entryWithInactiveCOA);
    // COA findUnique for MOCK_COA_ID_INACTIVE will return isActive: false from beforeEach setup

    const req = createMockRequest('PUT', { status: JournalEntryStatus.POSTED });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain(`Chart of Account ${MOCK_COA_ID_INACTIVE} is inactive or not found`);
  });

  it('should change status from POSTED to REVERSED', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(postedJournalEntry);
    (prisma.journalEntry.update as jest.Mock).mockResolvedValueOnce({ ...postedJournalEntry, status: JournalEntryStatus.REVERSED });
    const req = createMockRequest('PUT', { status: JournalEntryStatus.REVERSED });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe(JournalEntryStatus.REVERSED);
  });

  it('should return 400 for invalid status transitions (e.g., POSTED to DRAFT)', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(postedJournalEntry);
    const req = createMockRequest('PUT', { status: JournalEntryStatus.DRAFT });
    const response = await PUT(req, { params: { id: MOCK_JE_ID } });

    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain(`Invalid status transition from ${JournalEntryStatus.POSTED} to ${JournalEntryStatus.DRAFT}`);
  });

  it('should return 404 if journal entry to update is not found', async () => {
    (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const req = createMockRequest('PUT', { description: 'Update non-existent' });
    const response = await PUT(req, { params: { id: 'non-existent-id' } });

    expect(response.status).toBe(404);
    expect((await response.json()).error).toContain('Journal entry not found');
  });
});
