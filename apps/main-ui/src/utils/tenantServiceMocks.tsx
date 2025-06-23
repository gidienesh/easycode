// Create mock data for tenant service components
export const mockTenantData = {
    tenantId: 'test-tenant-123',
    features: [
        { id: 'crm', name: 'CRM Service', enabled: true },
        { id: 'inventory', name: 'Inventory Management', enabled: false }
    ],
    quotation: {
        total: 299.99,
        currency: 'USD'
    }
};

// Mock tenant service functions
export const mockTenantService = {
    getTenantData: async (tenantId: string) => {
        return mockTenantData;
    },
    updateTenantFeatures: async (tenantId: string, features: any[]) => {
        console.log('Mock: Updating tenant features', { tenantId, features });
        return { success: true };
    }
};
