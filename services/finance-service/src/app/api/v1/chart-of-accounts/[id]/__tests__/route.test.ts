import { GET, PUT, DELETE } from '../route'; // Adjust path as necessary
import { prisma, AccountType } from '../../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server
const mockJson = jest.fn().mockImplementation((data, options) => ({
  json: async () => data,
  status: options?.status || 200,
  headers: new Headers(),
  ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
}));


// For DELETE requests that might return new NextResponse(null, { status: 204 })
const mockNextResponseConstructor = jest.fn().mockImplementation((_body, options) => ({
    json: async () => null, // No body for 204
    status: options?.status || 204,
    headers: new Headers(),
    ok: (options?.status || 204) >= 200 && (options?.status || 204) < 300,
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => mockJson(args[0], args[1]),
    // constructor: (...args: any[]) => mockNextResponseConstructor(args[0], args[1]) // This doesn't work for new NextResponse()
  },
}));
// We need to be able to mock `new NextResponse()` for 204 responses.
// A direct mock of the constructor is tricky. Instead, we can spy on it if it's part of an importable module
// or, for simplicity here, ensure the DELETE handler uses NextResponse.json for its error states
// and handle the 204 case by checking mockJson was NOT called if we expect a 204.
// For the purpose of this stub, we'll assume DELETE uses NextResponse.json for errors
// and returns a specific structure for success that can be asserted if not 204, or lack of mockJson call for 204.
// The provided DELETE handler uses `new NextResponse(null, { status: 204 })`.
// Let's adjust the mock to handle this:
const actualNextServer = jest.requireActual('next/server');
jest.mock('next/server', () => ({
  ...actualNextServer, // Import and retain default behavior
  NextResponse: class extends actualNextServer.NextResponse {
    constructor(body: any, init: any) {
      super(body, init);
      // If it's a 204, the body is null. mockNextResponseConstructor will handle it.
      if (init?.status === 204) {
        return mockNextResponseConstructor(body, init);
      }
      // For other cases, use mockJson
      // This is a bit of a hack due to `new NextResponse`
      // A better way would be to refactor handlers to always use NextResponse.json()
      mockJson(body, init); // Call mockJson so we can assert it
      // @ts-ignore
      this.json = async () => body; // Ensure it still behaves like a response
      // @ts-ignore
      this.status = init?.status || 200;
    }
    static json = (...args: any[]) => mockJson(args[0], args[1]);
  },
}));


// Spy on Prisma methods
jest.spyOn(prisma.chartOfAccount, 'findUnique');
jest.spyOn(prisma.chartOfAccount, 'update');
jest.spyOn(prisma.chartOfAccount, 'delete');

const MOCK_ID = 'mock-coa-id';
const NON_EXISTENT_ID = 'non-existent-id';

describe('Chart of Accounts API - GET /api/v1/chart-of-accounts/[id]', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.chartOfAccount.findUnique as jest.Mock).mockClear();
  });

  it('should return an account if found', async () => {
    const mockAccount = { id: MOCK_ID, accountName: 'Test Account', tenantId: 'test-tenant', accountType: AccountType.ASSET };
    (prisma.chartOfAccount.findUnique as jest.Mock).mockResolvedValueOnce(mockAccount);
    const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${MOCK_ID}`, { method: 'GET' });

    const response = await GET(mockRequest, { params: { id: MOCK_ID } });
    await response.json(); // Consume body

    expect(prisma.chartOfAccount.findUnique).toHaveBeenCalledWith({ where: { id: MOCK_ID } });
    expect(response.status).toBe(200);
    expect(mockJson).toHaveBeenCalledWith(mockAccount, { status: 200 });
  });

  it('should return 404 if account not found', async () => {
    (prisma.chartOfAccount.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${NON_EXISTENT_ID}`, { method: 'GET' });

    const response = await GET(mockRequest, { params: { id: NON_EXISTENT_ID } });
    await response.json(); // Consume body

    expect(prisma.chartOfAccount.findUnique).toHaveBeenCalledWith({ where: { id: NON_EXISTENT_ID } });
    expect(response.status).toBe(404);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Chart of account not found' }, { status: 404 });
  });
});

describe('Chart of Accounts API - PUT /api/v1/chart-of-accounts/[id]', () => {
    beforeEach(() => {
        mockJson.mockClear();
        (prisma.chartOfAccount.update as jest.Mock).mockClear();
    });

    it('should update an account successfully with valid data', async () => {
        const updatePayload = { accountName: 'Updated Name', isActive: false };
        const mockUpdatedAccount = { id: MOCK_ID, accountName: 'Updated Name', isActive: false, tenantId: 'test-tenant', accountType: AccountType.ASSET };
        (prisma.chartOfAccount.update as jest.Mock).mockResolvedValueOnce(mockUpdatedAccount);

        const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${MOCK_ID}`, {
            method: 'PUT',
            body: JSON.stringify(updatePayload),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await PUT(mockRequest, { params: { id: MOCK_ID } });
        await response.json();

        expect(prisma.chartOfAccount.update).toHaveBeenCalledWith({ where: { id: MOCK_ID }, data: updatePayload });
        expect(response.status).toBe(200);
        expect(mockJson).toHaveBeenCalledWith(mockUpdatedAccount, { status: 200 });
    });

    it('should return 404 if account to update is not found', async () => {
        (prisma.chartOfAccount.update as jest.Mock).mockResolvedValueOnce(null); // Simulate not found by Prisma update
        const updatePayload = { accountName: 'Updated Name' };
        const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${NON_EXISTENT_ID}`, {
            method: 'PUT',
            body: JSON.stringify(updatePayload),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await PUT(mockRequest, { params: { id: NON_EXISTENT_ID } });
        await response.json();

        expect(prisma.chartOfAccount.update).toHaveBeenCalledWith({ where: { id: NON_EXISTENT_ID }, data: updatePayload });
        expect(response.status).toBe(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Chart of account not found or failed to update' }, { status: 404 });
    });

    it('should return 400 for invalid update data (e.g., invalid accountType)', async () => {
        const updatePayload = { accountType: 'INVALID_TYPE' };
        const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${MOCK_ID}`, {
            method: 'PUT',
            body: JSON.stringify(updatePayload),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await PUT(mockRequest, { params: { id: MOCK_ID } });
        await response.json();

        expect(response.status).toBe(400);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Invalid accountType') }), { status: 400 });
    });
});

describe('Chart of Accounts API - DELETE /api/v1/chart-of-accounts/[id]', () => {
    beforeEach(() => {
        mockJson.mockClear();
        mockNextResponseConstructor.mockClear();
        (prisma.chartOfAccount.delete as jest.Mock).mockClear();
    });

    it('should delete an account successfully', async () => {
        const mockDeletedAccount = { id: MOCK_ID, message: "mock delete" }; // Placeholder returns this
        (prisma.chartOfAccount.delete as jest.Mock).mockResolvedValueOnce(mockDeletedAccount);
        const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${MOCK_ID}`, { method: 'DELETE' });

        const response = await DELETE(mockRequest, { params: { id: MOCK_ID } });

        expect(prisma.chartOfAccount.delete).toHaveBeenCalledWith({ where: { id: MOCK_ID } });
        expect(response.status).toBe(204);
        expect(mockNextResponseConstructor).toHaveBeenCalledWith(null, { status: 204 });
    });

    it('should return 404 if account to delete is not found', async () => {
        (prisma.chartOfAccount.delete as jest.Mock).mockResolvedValueOnce(null); // Simulate not found
        const mockRequest = new Request(`http://localhost/api/v1/chart-of-accounts/${NON_EXISTENT_ID}`, { method: 'DELETE' });

        const response = await DELETE(mockRequest, { params: { id: NON_EXISTENT_ID } });
        await response.json();

        expect(prisma.chartOfAccount.delete).toHaveBeenCalledWith({ where: { id: NON_EXISTENT_ID } });
        expect(response.status).toBe(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Chart of account not found' }, { status: 404 });
    });
});
