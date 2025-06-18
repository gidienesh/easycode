import { GET, PUT, DELETE } from '../route'; // Adjust path
import { prisma } from '../../../../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server (using the same mock as other files)
const mockJson = jest.fn().mockImplementation((data, options) => ({
  json: async () => data,
  status: options?.status || 200,
  headers: new Headers(),
  ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
}));

const mockNextResponseConstructor = jest.fn().mockImplementation((_body, options) => ({
    json: async () => null,
    status: options?.status || 204,
    headers: new Headers(),
    ok: (options?.status || 204) >= 200 && (options?.status || 204) < 300,
}));

const actualNextServer = jest.requireActual('next/server');
jest.mock('next/server', () => ({
  ...actualNextServer,
  NextResponse: class extends actualNextServer.NextResponse {
    constructor(body: any, init: any) {
      super(body, init);
      if (init?.status === 204) return mockNextResponseConstructor(body, init);
      mockJson(body, init);
      // @ts-ignore
      this.json = async () => body;
      // @ts-ignore
      this.status = init?.status || 200;
    }
    static json = (...args: any[]) => mockJson(args[0], args[1]);
  },
}));


jest.spyOn(prisma.financialDimension, 'findUnique'); // For parent dimension checks
jest.spyOn(prisma.financialDimensionValue, 'findUnique');
jest.spyOn(prisma.financialDimensionValue, 'update');
jest.spyOn(prisma.financialDimensionValue, 'delete');

const MOCK_DIMENSION_ID = 'dim-id-for-specific-values';
const MOCK_VALUE_ID = 'val-id-123';
const MOCK_TENANT_ID = 'test-tenant';

const createMockRequest = (method: string, body?: any): Request => {
  const url = `http://localhost/api/v1/financial-dimensions/${MOCK_DIMENSION_ID}/values/${MOCK_VALUE_ID}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': MOCK_TENANT_ID },
  });
};

const mockParentDimension = { id: MOCK_DIMENSION_ID, name: 'Region', tenantId: MOCK_TENANT_ID, isActive: true };
const mockDimensionValue = { id: MOCK_VALUE_ID, financialDimensionId: MOCK_DIMENSION_ID, value: 'North', description: 'Northern Region', isActive: true };
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));


describe('Financial Dimension Value API - /api/v1/financial-dimensions/[dimensionId]/values/[valueId]', () => {
  beforeEach(() => {
    mockJson.mockClear();
    mockNextResponseConstructor.mockClear();
    (prisma.financialDimension.findUnique as jest.Mock).mockReset();
    (prisma.financialDimensionValue.findUnique as jest.Mock).mockReset();
    (prisma.financialDimensionValue.update as jest.Mock).mockReset();
    (prisma.financialDimensionValue.delete as jest.Mock).mockReset();

    // Setup default mocks for parent dimension and the specific value
    prisma._mockDb.financialDimensions = [deepClone(mockParentDimension)];
    prisma._mockDb.financialDimensionValues = [deepClone(mockDimensionValue)];
  });

  describe('GET', () => {
    it('should return a dimension value if found and parent dimension matches tenant', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue));

      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: MOCK_VALUE_ID } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockDimensionValue);
      expect(prisma.financialDimensionValue.findUnique).toHaveBeenCalledWith({ where: { id: MOCK_VALUE_ID } });
    });

    it('should return 404 if value not found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: 'not-found-val-id' } });
      expect(response.status).toBe(404);
    });

    it('should return 403 if parent dimension does not belong to tenant', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce({...deepClone(mockParentDimension), tenantId: 'other-tenant'});
      // findUnique for value won't even be called if parent check fails first.
      // (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue));


      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: MOCK_VALUE_ID } });
      expect(response.status).toBe(403);
    });
  });

  describe('PUT', () => {
    it('should update a dimension value successfully', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue));
      const updatedData = { value: 'North-East', isActive: false };
      (prisma.financialDimensionValue.update as jest.Mock).mockResolvedValueOnce({ ...mockDimensionValue, ...updatedData });

      const req = createMockRequest('PUT', updatedData);
      const response = await PUT(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: MOCK_VALUE_ID } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ...mockDimensionValue, ...updatedData });
      expect(prisma.financialDimensionValue.update).toHaveBeenCalledWith({
        where: { id: MOCK_VALUE_ID },
        data: updatedData,
      });
    });

    it('should return 409 if new value conflicts within the same dimension', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue)); // Initial find for the value being updated

      const conflictingValue = { id: 'val-other', financialDimensionId: MOCK_DIMENSION_ID, value: 'South', isActive: true };
      prisma._mockDb.financialDimensionValues.push(conflictingValue); // Add a conflicting value

      const req = createMockRequest('PUT', { value: 'South' }); // Attempt to update to 'South'
      const response = await PUT(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: MOCK_VALUE_ID } });

      expect(response.status).toBe(409);
      expect((await response.json()).error).toContain('Value "South" already exists for this financial dimension.');
    });

    it('should return 404 if value to update is not found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(null); // Value not found

      const req = createMockRequest('PUT', { value: 'New Value' });
      const response = await PUT(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: 'not-found-val-id' } });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE', () => {
    it('should delete a dimension value successfully', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue));
      (prisma.financialDimensionValue.delete as jest.Mock).mockResolvedValueOnce(deepClone(mockDimensionValue));

      const req = createMockRequest('DELETE');
      const response = await DELETE(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: MOCK_VALUE_ID } });

      expect(response.status).toBe(204);
      expect(prisma.financialDimensionValue.delete).toHaveBeenCalledWith({ where: { id: MOCK_VALUE_ID } });
    });

    it('should return 404 if value to delete is not found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockParentDimension));
      (prisma.financialDimensionValue.findUnique as jest.Mock).mockResolvedValueOnce(null); // Value not found

      const req = createMockRequest('DELETE');
      const response = await DELETE(req, { params: { dimensionId: MOCK_DIMENSION_ID, valueId: 'not-found-val-id' } });
      expect(response.status).toBe(404);
    });
  });
});
