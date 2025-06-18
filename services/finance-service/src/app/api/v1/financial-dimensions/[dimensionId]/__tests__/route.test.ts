import { GET, PUT, DELETE } from '../route'; // Adjust path
import { prisma } from '../../../../../../../lib/prismaPlaceholders'; // Adjust path

// Mock next/server
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

jest.spyOn(prisma.financialDimension, 'findUnique');
jest.spyOn(prisma.financialDimension, 'update');
jest.spyOn(prisma.financialDimension, 'delete');

const MOCK_DIMENSION_ID = 'dim-id-123';
const MOCK_TENANT_ID = 'test-tenant';

const createMockRequest = (method: string, body?: any): Request => {
  const url = `http://localhost/api/v1/financial-dimensions/${MOCK_DIMENSION_ID}`;
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': MOCK_TENANT_ID },
  });
};

const mockDimension = { id: MOCK_DIMENSION_ID, name: 'Department', tenantId: MOCK_TENANT_ID, isActive: true, definedValues: [] };

describe('Financial Dimensions API - /api/v1/financial-dimensions/[dimensionId]', () => {
  beforeEach(() => {
    mockJson.mockClear();
    mockNextResponseConstructor.mockClear();
    (prisma.financialDimension.findUnique as jest.Mock).mockReset();
    (prisma.financialDimension.update as jest.Mock).mockReset();
    (prisma.financialDimension.delete as jest.Mock).mockReset();
    prisma._mockDb.financialDimensions = [deepClone(mockDimension)]; // Ensure mockDimension is in DB for tests
  });

  // Helper to deep clone for DB state isolation
  const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));


  describe('GET', () => {
    it('should return a dimension if found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimension));
      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: MOCK_DIMENSION_ID } });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockDimension);
      expect(prisma.financialDimension.findUnique).toHaveBeenCalledWith({ where: { id: MOCK_DIMENSION_ID }, include: { definedValues: true } });
    });

    it('should return 404 if not found', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const req = createMockRequest('GET');
      const response = await GET(req, { params: { dimensionId: 'not-found-id' } });
      expect(response.status).toBe(404);
      expect((await response.json()).error).toContain('Financial dimension not found');
    });
  });

  describe('PUT', () => {
    it('should update a dimension successfully', async () => {
      const updatedData = { name: 'Updated Department', isActive: false };
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimension)); // For the initial check
      (prisma.financialDimension.update as jest.Mock).mockResolvedValueOnce({ ...mockDimension, ...updatedData });

      const req = createMockRequest('PUT', updatedData);
      const response = await PUT(req, { params: { dimensionId: MOCK_DIMENSION_ID } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ...mockDimension, ...updatedData });
      expect(prisma.financialDimension.update).toHaveBeenCalledWith({
        where: { id: MOCK_DIMENSION_ID },
        data: updatedData,
      });
    });

    it('should return 409 if new name conflicts', async () => {
      const conflictingDimension = { id: 'dim-other', name: 'Project', tenantId: MOCK_TENANT_ID, isActive: true };
      prisma._mockDb.financialDimensions.push(conflictingDimension); // Add another dimension for conflict

      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimension)); // Initial find

      const req = createMockRequest('PUT', { name: 'Project' }); // Attempt to update to conflicting name
      const response = await PUT(req, { params: { dimensionId: MOCK_DIMENSION_ID } });

      expect(response.status).toBe(409);
      expect((await response.json()).error).toContain('Financial dimension with name "Project" already exists');
    });

    it('should return 404 if dimension not found for update', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(null); // Initial find fails
      const req = createMockRequest('PUT', { name: 'New Name' });
      const response = await PUT(req, { params: { dimensionId: 'not-found-id' } });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE', () => {
    it('should delete a dimension successfully', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(deepClone(mockDimension)); // For the initial check
      (prisma.financialDimension.delete as jest.Mock).mockResolvedValueOnce(deepClone(mockDimension));
      const req = createMockRequest('DELETE');
      const response = await DELETE(req, { params: { dimensionId: MOCK_DIMENSION_ID } });
      expect(response.status).toBe(204);
      expect(prisma.financialDimension.delete).toHaveBeenCalledWith({ where: { id: MOCK_DIMENSION_ID } });
    });

    it('should return 404 if not found for delete', async () => {
      (prisma.financialDimension.findUnique as jest.Mock).mockResolvedValueOnce(null); // Initial find fails
      const req = createMockRequest('DELETE');
      const response = await DELETE(req, { params: { dimensionId: 'not-found-id' } });
      expect(response.status).toBe(404);
    });
  });
});
