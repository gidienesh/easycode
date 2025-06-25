// Maintenance-specific roles and permissions for equipment-maintenance-service

export interface MaintenancePermission {
  id: string; // e.g., 'maintenance:work-order:create'
  description: string;
  category: 'ASSET_MANAGEMENT' | 'WORK_ORDERS' | 'SCHEDULING' | 'TECHNICIANS' | 'CHECKLISTS' | 'REPORTS' | 'ADMIN';
}

export interface MaintenanceRole {
  id: string; // e.g., 'maintenance_technician', 'maintenance_manager'
  name: string;
  description: string;
  permissions: MaintenancePermission[];
  isSystemRole: boolean;
  equipmentTypes?: string[]; // For technician roles - specific equipment they can work on
}

// Predefined maintenance permissions
export const MAINTENANCE_PERMISSIONS: MaintenancePermission[] = [
  // Asset Management
  { id: 'maintenance:asset:read', description: 'View equipment assets', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:asset:create', description: 'Create new equipment assets', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:asset:update', description: 'Update equipment asset information', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:asset:delete', description: 'Delete equipment assets', category: 'ASSET_MANAGEMENT' },
  
  // Customer Management
  { id: 'maintenance:customer:read', description: 'View customer information', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:customer:create', description: 'Create new customers', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:customer:update', description: 'Update customer information', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:customer:delete', description: 'Delete customers', category: 'ASSET_MANAGEMENT' },
  
  // Location Management
  { id: 'maintenance:location:read', description: 'View customer locations', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:location:create', description: 'Create new locations', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:location:update', description: 'Update location information', category: 'ASSET_MANAGEMENT' },
  { id: 'maintenance:location:delete', description: 'Delete locations', category: 'ASSET_MANAGEMENT' },
  
  // Work Orders
  { id: 'maintenance:work-order:read', description: 'View work orders', category: 'WORK_ORDERS' },
  { id: 'maintenance:work-order:create', description: 'Create new work orders', category: 'WORK_ORDERS' },
  { id: 'maintenance:work-order:update', description: 'Update work orders', category: 'WORK_ORDERS' },
  { id: 'maintenance:work-order:delete', description: 'Delete work orders', category: 'WORK_ORDERS' },
  { id: 'maintenance:work-order:assign', description: 'Assign technicians to work orders', category: 'WORK_ORDERS' },
  { id: 'maintenance:work-order:complete', description: 'Mark work orders as completed', category: 'WORK_ORDERS' },
  
  // Scheduling
  { id: 'maintenance:schedule:read', description: 'View maintenance schedules', category: 'SCHEDULING' },
  { id: 'maintenance:schedule:create', description: 'Create maintenance schedules', category: 'SCHEDULING' },
  { id: 'maintenance:schedule:update', description: 'Update maintenance schedules', category: 'SCHEDULING' },
  { id: 'maintenance:schedule:delete', description: 'Delete maintenance schedules', category: 'SCHEDULING' },
  
  // Technicians
  { id: 'maintenance:technician:read', description: 'View technician information', category: 'TECHNICIANS' },
  { id: 'maintenance:technician:create', description: 'Create new technicians', category: 'TECHNICIANS' },
  { id: 'maintenance:technician:update', description: 'Update technician information', category: 'TECHNICIANS' },
  { id: 'maintenance:technician:delete', description: 'Delete technicians', category: 'TECHNICIANS' },
  { id: 'maintenance:technician:assign', description: 'Assign technicians to work orders', category: 'TECHNICIANS' },
  
  // Checklists
  { id: 'maintenance:checklist:read', description: 'View maintenance checklists', category: 'CHECKLISTS' },
  { id: 'maintenance:checklist:create', description: 'Create maintenance checklists', category: 'CHECKLISTS' },
  { id: 'maintenance:checklist:update', description: 'Update maintenance checklists', category: 'CHECKLISTS' },
  { id: 'maintenance:checklist:delete', description: 'Delete maintenance checklists', category: 'CHECKLISTS' },
  { id: 'maintenance:checklist:complete', description: 'Complete maintenance checklists', category: 'CHECKLISTS' },
  { id: 'maintenance:checklist:approve', description: 'Approve completed checklists', category: 'CHECKLISTS' },
  
  // Reports
  { id: 'maintenance:report:read', description: 'View maintenance reports', category: 'REPORTS' },
  { id: 'maintenance:report:create', description: 'Generate maintenance reports', category: 'REPORTS' },
  { id: 'maintenance:report:export', description: 'Export maintenance reports', category: 'REPORTS' },
  
  // Admin
  { id: 'maintenance:admin:all', description: 'Full administrative access to maintenance module', category: 'ADMIN' },
  { id: 'maintenance:settings:read', description: 'View maintenance settings', category: 'ADMIN' },
  { id: 'maintenance:settings:update', description: 'Update maintenance settings', category: 'ADMIN' },
];

// Predefined maintenance roles
export const MAINTENANCE_ROLES: MaintenanceRole[] = [
  {
    id: 'maintenance_technician',
    name: 'Maintenance Technician',
    description: 'Field technician who performs maintenance work',
    isSystemRole: true,
    equipmentTypes: ['GENERATOR', 'AIR_CONDITIONER', 'FIRE_EQUIPMENT', 'HVAC_SYSTEM', 'ELECTRICAL_PANEL', 'UPS_SYSTEM', 'SOLAR_SYSTEM', 'PUMP', 'MOTOR', 'COMPRESSOR', 'CHILLER', 'BOILER'],
    permissions: [
      { id: 'maintenance:asset:read', description: 'View equipment assets', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:work-order:read', description: 'View work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:update', description: 'Update work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:complete', description: 'Mark work orders as completed', category: 'WORK_ORDERS' },
      { id: 'maintenance:schedule:read', description: 'View maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:checklist:read', description: 'View maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:checklist:complete', description: 'Complete maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:report:read', description: 'View maintenance reports', category: 'REPORTS' },
    ]
  },
  {
    id: 'maintenance_supervisor',
    name: 'Maintenance Supervisor',
    description: 'Supervises technicians and manages work orders',
    isSystemRole: true,
    permissions: [
      { id: 'maintenance:asset:read', description: 'View equipment assets', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:asset:update', description: 'Update equipment asset information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:customer:read', description: 'View customer information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:location:read', description: 'View customer locations', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:work-order:read', description: 'View work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:create', description: 'Create new work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:update', description: 'Update work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:assign', description: 'Assign technicians to work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:complete', description: 'Mark work orders as completed', category: 'WORK_ORDERS' },
      { id: 'maintenance:schedule:read', description: 'View maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:schedule:create', description: 'Create maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:schedule:update', description: 'Update maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:technician:read', description: 'View technician information', category: 'TECHNICIANS' },
      { id: 'maintenance:technician:assign', description: 'Assign technicians to work orders', category: 'TECHNICIANS' },
      { id: 'maintenance:checklist:read', description: 'View maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:checklist:approve', description: 'Approve completed checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:report:read', description: 'View maintenance reports', category: 'REPORTS' },
      { id: 'maintenance:report:create', description: 'Generate maintenance reports', category: 'REPORTS' },
    ]
  },
  {
    id: 'maintenance_manager',
    name: 'Maintenance Manager',
    description: 'Manages the entire maintenance operation',
    isSystemRole: true,
    permissions: [
      { id: 'maintenance:asset:read', description: 'View equipment assets', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:asset:create', description: 'Create new equipment assets', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:asset:update', description: 'Update equipment asset information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:customer:read', description: 'View customer information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:customer:create', description: 'Create new customers', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:customer:update', description: 'Update customer information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:location:read', description: 'View customer locations', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:location:create', description: 'Create new locations', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:location:update', description: 'Update location information', category: 'ASSET_MANAGEMENT' },
      { id: 'maintenance:work-order:read', description: 'View work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:create', description: 'Create new work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:update', description: 'Update work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:delete', description: 'Delete work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:assign', description: 'Assign technicians to work orders', category: 'WORK_ORDERS' },
      { id: 'maintenance:work-order:complete', description: 'Mark work orders as completed', category: 'WORK_ORDERS' },
      { id: 'maintenance:schedule:read', description: 'View maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:schedule:create', description: 'Create maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:schedule:update', description: 'Update maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:schedule:delete', description: 'Delete maintenance schedules', category: 'SCHEDULING' },
      { id: 'maintenance:technician:read', description: 'View technician information', category: 'TECHNICIANS' },
      { id: 'maintenance:technician:create', description: 'Create new technicians', category: 'TECHNICIANS' },
      { id: 'maintenance:technician:update', description: 'Update technician information', category: 'TECHNICIANS' },
      { id: 'maintenance:technician:assign', description: 'Assign technicians to work orders', category: 'TECHNICIANS' },
      { id: 'maintenance:checklist:read', description: 'View maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:checklist:create', description: 'Create maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:checklist:update', description: 'Update maintenance checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:checklist:approve', description: 'Approve completed checklists', category: 'CHECKLISTS' },
      { id: 'maintenance:report:read', description: 'View maintenance reports', category: 'REPORTS' },
      { id: 'maintenance:report:create', description: 'Generate maintenance reports', category: 'REPORTS' },
      { id: 'maintenance:report:export', description: 'Export maintenance reports', category: 'REPORTS' },
      { id: 'maintenance:settings:read', description: 'View maintenance settings', category: 'ADMIN' },
      { id: 'maintenance:settings:update', description: 'Update maintenance settings', category: 'ADMIN' },
    ]
  },
  {
    id: 'maintenance_admin',
    name: 'Maintenance Administrator',
    description: 'Full administrative access to maintenance module',
    isSystemRole: true,
    permissions: MAINTENANCE_PERMISSIONS
  }
];

// Helper functions
export const getMaintenanceRoleById = (roleId: string): MaintenanceRole | undefined => {
  return MAINTENANCE_ROLES.find(role => role.id === roleId);
};

export const getMaintenancePermissionsByRole = (roleId: string): MaintenancePermission[] => {
  const role = getMaintenanceRoleById(roleId);
  return role ? role.permissions : [];
};

export const hasMaintenancePermission = (userPermissions: string[], permissionId: string): boolean => {
  return userPermissions.includes(permissionId);
};

export const getMaintenanceRolesByEquipmentType = (equipmentType: string): MaintenanceRole[] => {
  return MAINTENANCE_ROLES.filter(role => 
    !role.equipmentTypes || role.equipmentTypes.includes(equipmentType)
  );
}; 