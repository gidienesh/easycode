// Admin routes configuration for EasyCode Platform
// This file defines the admin routes structure

export interface AdminRoute {
    path: string;
    name: string;
    description: string;
    component?: string;
}

export const adminRoutes: AdminRoute[] = [
    {
        path: '/admin/tenant-service-test',
        name: 'Tenant Service Test',
        description: 'Test tenant service functionality',
        component: 'TenantServiceTest'
    },
    {
        path: '/admin/dashboard',
        name: 'Admin Dashboard',
        description: 'Main admin dashboard',
        component: 'AdminDashboard'
    }
];
