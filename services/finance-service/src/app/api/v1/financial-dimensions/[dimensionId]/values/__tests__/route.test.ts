import { GET, POST } from '../route'; // Adjust path
import { prisma } from '../../../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server (using the same mock as other files)
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

jest.spyOn(prisma.financialDimension, 'findUnique');
jest.spyOn(prisma.financialDimensionValue, 'create');
jest.spyOn(prisma.financialDimensionValue, 'findMany');

const MOCK_DIMENSION_ID = 'dim-id-for-values';
const MOCK_TENANT_ID = 'test-tenant';

const createMockRequest = (method: string, body?: any, urlParams = ''): Request => {
  const url = `http://localhost/api/v1/financial-dimensions/${MOCK_DIMENSION_ID}/values${urlParams}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': MOCK_TENANT_ID },
  });
};

const mockParentDimension = { id: MOCK_DIMENSION_ID, name: 'Project', tenantId: MOCK_TENANT_ID, isActive: true };
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));


describe('Financial Dimension Values API - /api/v1/financial-dimensions/[dimensionId]/values', () => {
  beforeEach(() => {
    mockJson.mockClear();
    (prisma.financialDimension.findUnique as jest.Mock).mockReset();
    (prisma.financialDimensionValue.create as jest.Mock).mockReset();
    (prisma.financialDimensionValue.findMany as jest.Mock).mockReset();

    // Setup default parent dimension for most tests
    prisma._mockDb.financialDimensions = [deepClone(mockParentDimension)];
    prisma._mockDb.financialDimensionValues = [];
  });

  describe('POST', () => {
    it('should create a dimension value successfully', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      const newValueData = { value: 'Alpha', description: 'Project Alpha' };
      const createdValue = { id: 'val1', financialDimensionId: MOCK_DIMENSION_ID, ...newValueData, isActive: true };
      (prisma.financialDimensionValue.create as jest.Mock).mockResolvedValueOnce(createdValue);

      const req = createMockRequest('POST', newValueData);
      const response = await POST(req, { params: { dimensionId: MOCK_DIMENSION_ID } });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(prisma.financialDimensionValue.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ ...newValueData, financialDimensionId: MOCK_DIMENSION_ID }),
      });
      expect(responseBody).toEqual(createdValue);
    });

    it('should return 400 for missing value', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      const req = createMockRequest('POST', { description: 'Missing value field' });
      const response = await POST(req, { params: { dimensionId: MOCK_DIMENSION_ID } });
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Missing required field: value');
    });

    it('should return 404 if parent dimension not found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const req = createMockRequest('POST', { value: 'Beta' });
      const response = await POST(req, { params: { dimensionId: 'non-existent-dim' } });
      expect(response.status).toBe(404);
      expect((await response.json()).error).toContain('Financial dimension with ID non-existent-dim not found');
    });

    it('should return 409 if value already exists for the dimension', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      const existingValue = { id: 'val-exist', financialDimensionId: MOCK_DIMENSION_ID, value: 'Alpha', isActive: true };
      prisma._mockDb.financialDimensionValues.push(existingValue); // Pre-populate

      const req = createMockRequest('POST', { value: 'Alpha' }); // Attempt to create duplicate
      const response = await POST(req, { params: { dimensionId: MOCK_DIMENSION_ID } });
      expect(response.status).toBe(409);
      expect((await response.json()).error).toContain('Value "Alpha" already exists for this financial dimension');
    });
  });

  describe('GET', () => {
    it('should return list of values for a dimension', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      const mockValues = [{ id: 'val1', value: 'Alpha', financialDimensionId: MOCK_DIMENSION_ID }];
      (prisma.financialDimensionValue.findMany as jest.Mock).mockResolvedValueOnce(mockValues);

      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockValues);
      expect(prisma.financialDimensionValue.findMany).toHaveBeenCalledWith({
        where: { financialDimensionId: MOCK_DIMENSION_ID },
      });
    });

    it('should return 404 if parent dimension not found when listing values', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: 'non-existent-dim' } });
      expect(response.status).toBe(404);
    });

    it('should filter values by isActive', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      const req = createMockRequest('GET', undefined, '?isActive=true');
      await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID }});
      expect(prisma.financialDimensionValue.findMany).toHaveBeenCalledWith({
          where: { financialDimensionId: MOCK_DIMENSION_ID, isActive: true }
      });
    });
  });
});
