import { GET, POST } from '../route'; // Adjust path as necessary
import { prisma } from '../../../../../../../lib/prismaPlaceholders'; // Adjust path

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
jest.spyOn(prisma.financialDimension, 'create');
jest.spyOn(prisma.financialDimension, 'findMany');

// Utility to create a mock Request object
const createMockRequest = (method: string, body?: any, urlParams = ''): Request => {
  const url = `http://localhost/api/v1/financial-dimensions${urlParams}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': 'test-tenant' // Default tenant for tests
    },
  });
};

const MOCK_TENANT_ID = 'test-tenant';

describe('Financial Dimensions API - POST /api/v1/financial-dimensions', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.financialDimension.create as jest.Mock).mockClear();
    (prisma.financialDimension.findMany as jest.Mock).mockClear(); // Also clear findMany for uniqueness check
    prisma._mockDb.financialDimensions = []; // Clear mock DB for consistent uniqueness checks
  });

  it('should create a dimension successfully', async () => {
    const newDimensionData = { name: 'Department', tenantId: MOCK_TENANT_ID, description: 'Test Dept' };
    (prisma.financialDimension.create as jest.Mock).mockResolvedValueOnce({ id: 'dim1', ...newDimensionData, isActive: true });

    const req = createMockRequest('POST', newDimensionData);
    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(prisma.financialDimension.create).toHaveBeenCalledWith({
      data: expect.objectContaining(newDimensionData),
    });
    expect(responseBody.name).toBe(newDimensionData.name);
  });

  it('should return 400 for missing name or tenantId', async () => {
    let req = createMockRequest('POST', { description: 'Missing name and tenant' });
    let response = await POST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Missing required fields: name and tenantId');

    req = createMockRequest('POST', { name: 'Project' }); // Missing tenantId (though default is in header, body matters)
    // To properly test body tenantId, we'd remove X-Tenant-ID or pass explicit undefined tenantId in body.
    // For this test, assume tenantId is expected in body.
    const reqMissingTenantInBody = new Request('http://localhost/api/v1/financial-dimensions', {
        method: 'POST', body: JSON.stringify({ name: 'Test' }), headers: { 'Content-Type': 'application/json'}
    });
    response = await POST(reqMissingTenantInBody);
    expect(response.status).toBe(400);

  });

  it('should return 409 if dimension name already exists for the tenant', async () => {
    const existingDimension = { id: 'dim-exist', name: 'Department', tenantId: MOCK_TENANT_ID, isActive: true };
    prisma._mockDb.financialDimensions.push(existingDimension); // Pre-populate mock DB

    const newDimensionData = { name: 'Department', tenantId: MOCK_TENANT_ID };
    const req = createMockRequest('POST', newDimensionData);
    const response = await POST(req);

    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain('Financial dimension with name "Department" already exists');
  });
});

describe('Financial Dimensions API - GET /api/v1/financial-dimensions', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.financialDimension.findMany as jest.Mock).mockClear();
  });

  it('should return a list of dimensions for a tenant', async () => {
    const mockDimensions = [{ id: 'dim1', name: 'Dept', tenantId: MOCK_TENANT_ID }];
    (prisma.financialDimension.findMany as jest.Mock).mockResolvedValueOnce(mockDimensions);
    const req = createMockRequest('GET', undefined, `?tenantId=${MOCK_TENANT_ID}`);
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockDimensions);
    expect(prisma.financialDimension.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { tenantId: MOCK_TENANT_ID },
    }));
  });

  it('should require tenantId for listing', async () => {
    // Create request without tenantId in query params by removing it from the default createMockRequest
     const req = new Request('http://localhost/api/v1/financial-dimensions', {
        method: 'GET', headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': MOCK_TENANT_ID }
    });

    const response = await GET(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Missing required query parameter: tenantId');
  });

  it('should filter by isActive', async () => {
    const req = createMockRequest('GET', undefined, `?tenantId=${MOCK_TENANT_ID}&isActive=true`);
    await GET(req);
    expect(prisma.financialDimension.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { tenantId: MOCK_TENANT_ID, isActive: true },
    }));

    const reqInactive = createMockRequest('GET', undefined, `?tenantId=${MOCK_TENANT_ID}&isActive=false`);
    await GET(reqInactive);
    expect(prisma.financialDimension.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { tenantId: MOCK_TENANT_ID, isActive: false },
    }));
  });
});
