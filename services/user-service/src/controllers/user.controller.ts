import { Request, Response } from 'express';
// import { User, Role } from '../models'; // Assuming models are available
// import { TenantService } from '../services/tenantIntegration.service'; // Mocked

// Mocked data - in a real app, this would come from a database
const mockUsers: any[] = [
  { id: 'user-xyz', tenantId: 'client-company-abc', roles: ['crm_manager', 'tenant_admin'], username: 'testuser' },
];
const mockRoles: any[] = [
  { id: 'crm_manager', name: 'CRM Manager', permissions: [{id: 'crm:lead:create'}, {id: 'crm:lead:read'}] },
  { id: 'tenant_admin', name: 'Tenant Administrator', permissions: [{id: 'user:manage:all'}] /* simplified */ },
];

export const getEffectivePermissions = async (req: Request, res: Response): Promise<void> => {
  // const userId = req.user?.id; // Assuming JWT middleware would populate req.user
  const userId = 'user-xyz'; // Hardcoded for mock
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Mock tenant service interaction
  // const tenantEntitlements = await TenantService.getEntitlements(user.tenantId);
  const mockTenantEntitlements: { [key: string]: { enabled: boolean; version: string } } = {
    "crm-service": { enabled: true, version: 'v1.2' },
    "inventory-service": { enabled: true, version: 'v1.0' },
    "finance-service": { enabled: false, version: 'v1.0' }
  };

  let effectivePermissions: { [service: string]: { [resource: string]: string[] } } = {};
  // let userRolesDetails: any[] = []; // Variable not used, commented out

  for (const roleId of user.roles) {
    const roleDetail = mockRoles.find(r => r.id === roleId);
    if (roleDetail) {
      // userRolesDetails.push(roleDetail); // Variable not used, commented out
      for (const perm of roleDetail.permissions) {
        const [serviceName, resource, action] = perm.id.split(':'); // e.g., crm:lead:create

        if (mockTenantEntitlements[serviceName]?.enabled) {
          if (!effectivePermissions[serviceName]) {
            effectivePermissions[serviceName] = {};
          }
          if (!effectivePermissions[serviceName][resource]) {
            effectivePermissions[serviceName][resource] = [];
          }
          if (!effectivePermissions[serviceName][resource].includes(action)) {
            effectivePermissions[serviceName][resource].push(action);
          }
        }
      }
    }
  }

  const responsePayload = {
    userId: user.id,
    tenantId: user.tenantId,
    roles: user.roles,
    permissions: effectivePermissions,
    version: `user-permissions-${user.id}-${Date.now()}` // Dynamic version
  };
  res.json(responsePayload);
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (user) {
    // In a real app, don't send passwordHash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
