// Create mock data providers for tenant service components
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

// Wrap components with mock providers
export const TenantServiceTestWrapper = ({ children }) => {
    return (
        <TenantDataProvider value={mockTenantData}>
            {children}
        </TenantDataProvider>
    );
};
