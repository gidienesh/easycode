import { GET, POST } from '../route'; // Adjust path as necessary
import { prisma, AccountType } from '../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server
const mockJson = jest.fn().mockImplementation((data, options) => ({
  json: async () => data,
  status: options?.status || 200,
  headers: new Headers(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => mockJson(args[0], args[1]),
  },
}));

// Spy on Prisma methods
jest.spyOn(prisma.chartOfAccount, 'create');
jest.spyOn(prisma.chartOfAccount, 'findMany');

describe('Chart of Accounts API - POST /api/v1/chart-of-accounts', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockJson.mockClear();
    (prisma.chartOfAccount.create as jest.Mock).mockClear();
  });

  it('should create an account successfully with valid data', async () => {
    const mockRequestBody = {
      accountCode: '1010',
      accountName: 'Cash',
      accountType: AccountType.ASSET,
      tenantId: 'test-tenant',
      parentId: null,
      hierarchyLevel: 0,
      isActive: true,
    };
    const mockRequest = new Request('http://localhost/api/v1/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    // Provide a mock implementation for prisma.chartOfAccount.create for this test
    (prisma.chartOfAccount.create as jest.Mock).mockResolvedValueOnce({ id: 'new-id', ...mockRequestBody });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(prisma.chartOfAccount.create).toHaveBeenCalledWith({ data: mockRequestBody });
    expect(response.status).toBe(201);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ id: 'new-id', ...mockRequestBody }), { status: 201 });
    expect(responseBody.accountCode).toBe(mockRequestBody.accountCode);
  });

  it('should return 400 for missing required fields (e.g., accountCode)', async () => {
    const mockRequestBody = {
      // accountCode: '1020', // Missing accountCode
      accountName: 'Accounts Receivable',
      accountType: AccountType.ASSET,
      tenantId: 'test-tenant',
    };
    const mockRequest = new Request('http://localhost/api/v1/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Missing required fields') }), { status: 400 });
    expect(responseBody.error).toContain('Missing required fields');
  });

  it('should return 400 for invalid accountType', async () => {
    const mockRequestBody = {
      accountCode: '6000',
      accountName: 'Office Supplies',
      accountType: 'INVALID_TYPE' as AccountType, // Invalid account type
      tenantId: 'test-tenant',
    };
    const mockRequest = new Request('http://localhost/api/v1/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Invalid accountType') }), { status: 400 });
    expect(responseBody.error).toContain('Invalid accountType');
  });
});

describe('Chart of Accounts API - GET /api/v1/chart-of-accounts', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.chartOfAccount.findMany as jest.Mock).mockClear();
  });

  it('should return a list of accounts', async () => {
    const mockRequest = new Request('http://localhost/api/v1/chart-of-accounts?tenantId=test-tenant', {
      method: 'GET',
    });
    const mockAccounts = [{ id: 'id1', name: 'Account1' }];
    (prisma.chartOfAccount.findMany as jest.Mock).mockResolvedValueOnce(mockAccounts);

    const response = await GET(mockRequest);
    await response.json(); // consume the body to allow assertions on mockJson

    expect(prisma.chartOfAccount.findMany).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(mockJson).toHaveBeenCalledWith(mockAccounts, { status: 200 });
  });

  it('should pass query parameters to prisma.chartOfAccount.findMany', async () => {
    const mockRequest = new Request('http://localhost/api/v1/chart-of-accounts?tenantId=abc&isActive=true&parentId=parent123', {
      method: 'GET',
    });
    (prisma.chartOfAccount.findMany as jest.Mock).mockResolvedValueOnce([]);

    await GET(mockRequest);

    expect(prisma.chartOfAccount.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: 'abc',
        isActive: true,
        parentId: 'parent123',
      },
    });
  });
});
