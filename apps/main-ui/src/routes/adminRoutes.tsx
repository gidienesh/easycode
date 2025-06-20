import { RouteObject } from 'react-router-dom';
import TenantServiceTestPage from '../pages/admin/TenantServiceTest';

export const adminRoutes: RouteObject[] = [
    // ... existing routes
    {
        path: '/admin/tenant-service-test',
        element: <TenantServiceTestPage />,
    },
];
