# Maintenance Module Permissions & Tenancy Guide

## Overview

This guide explains how user roles and tenancy enablements are implemented in the Equipment Maintenance Service, following the same patterns established in the CRM module. The maintenance service provides comprehensive role-based access control (RBAC) and tenant-based feature enablement.

## 1. Permission Structure

### 1.1 Permission Format

Maintenance permissions follow the format: `equipment-maintenance-service:module:action`

Examples:
- `equipment-maintenance-service:asset-registry:read`
- `equipment-maintenance-service:work-orders:write`
- `equipment-maintenance-service:checklists:delete`
- `equipment-maintenance-service:reports:export`

### 1.2 Available Modules

The maintenance service includes the following modules:

#### Asset Management
- **asset-registry**: Equipment asset management
- **asset-types**: Equipment type definitions
- **qr-codes**: QR code generation and management

#### Work Order Management
- **work-orders**: Work order creation and management
- **preventive**: Preventive maintenance scheduling
- **corrective**: Corrective maintenance management

#### Checklists & Documentation
- **checklists**: Maintenance checklist management
- **history**: Service history tracking

#### Scheduling & Resources
- **schedule**: Maintenance scheduling
- **technicians**: Technician management

#### Parts & Inventory
- **parts**: Spare parts management

#### Reporting & Analytics
- **reports**: Maintenance reporting
- **analytics**: Performance analytics

### 1.3 Available Actions

Each module supports the following actions:
- **read**: View data
- **write**: Create and update data
- **delete**: Remove data
- **approve**: Approve workflows (where applicable)
- **export**: Export data (for reports)

## 2. User Roles Implementation

### 2.1 Role Definition

Roles are defined in the `UserProvider` with comprehensive permissions:

```typescript
// Example from UserProvider.tsx
permissions: [
  // Equipment Maintenance - Asset Management
  'equipment-maintenance-service:asset-registry:read',
  'equipment-maintenance-service:asset-registry:write',
  'equipment-maintenance-service:asset-registry:delete',
  'equipment-maintenance-service:asset-types:read',
  'equipment-maintenance-service:asset-types:write',
  'equipment-maintenance-service:qr-codes:read',
  'equipment-maintenance-service:qr-codes:write',
  
  // Equipment Maintenance - Work Orders
  'equipment-maintenance-service:work-orders:read',
  'equipment-maintenance-service:work-orders:write',
  'equipment-maintenance-service:work-orders:delete',
  'equipment-maintenance-service:work-orders:approve',
  
  // Equipment Maintenance - Maintenance Types
  'equipment-maintenance-service:preventive:read',
  'equipment-maintenance-service:preventive:write',
  'equipment-maintenance-service:preventive:delete',
  'equipment-maintenance-service:corrective:read',
  'equipment-maintenance-service:corrective:write',
  'equipment-maintenance-service:corrective:delete',
  
  // Equipment Maintenance - Checklists
  'equipment-maintenance-service:checklists:read',
  'equipment-maintenance-service:checklists:write',
  'equipment-maintenance-service:checklists:delete',
  'equipment-maintenance-service:checklists:approve',
  
  // Equipment Maintenance - Scheduling
  'equipment-maintenance-service:schedule:read',
  'equipment-maintenance-service:schedule:write',
  'equipment-maintenance-service:schedule:delete',
  
  // Equipment Maintenance - Technicians
  'equipment-maintenance-service:technicians:read',
  'equipment-maintenance-service:technicians:write',
  'equipment-maintenance-service:technicians:delete',
  
  // Equipment Maintenance - Parts & Inventory
  'equipment-maintenance-service:parts:read',
  'equipment-maintenance-service:parts:write',
  'equipment-maintenance-service:parts:delete',
  
  // Equipment Maintenance - History & Reports
  'equipment-maintenance-service:history:read',
  'equipment-maintenance-service:history:write',
  'equipment-maintenance-service:reports:read',
  'equipment-maintenance-service:reports:write',
  'equipment-maintenance-service:reports:export',
  'equipment-maintenance-service:analytics:read',
  'equipment-maintenance-service:analytics:write',
]
```

### 2.2 Permission Checking

Permission checks are implemented using the `useUser` hook:

```typescript
import { useUser } from '../../src/providers/UserProvider';

const { hasPermission } = useUser();

// Check if user can read asset registry
if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'read')) {
  return <AccessDenied />;
}

// Check if user can write work orders
if (hasPermission('equipment-maintenance-service', 'work-orders', 'write')) {
  // Show edit buttons
}
```

## 3. Tenancy Enablement

### 3.1 Tenant Configuration

Tenants are configured in the `TenantProvider` with service enablement:

```typescript
// From TenantProvider.tsx
'equipment-maintenance-service': {
  enabled: true,
  modules: [
    { name: 'asset-registry', enabled: true, permissions: ['read', 'write'] },
    { name: 'work-orders', enabled: true, permissions: ['read', 'write'] },
    { name: 'preventive', enabled: true, permissions: ['read', 'write'] },
    { name: 'corrective', enabled: true, permissions: ['read', 'write'] },
    { name: 'checklists', enabled: true, permissions: ['read', 'write'] },
    { name: 'history', enabled: true, permissions: ['read', 'write'] },
    { name: 'schedule', enabled: true, permissions: ['read', 'write'] },
    { name: 'technicians', enabled: true, permissions: ['read', 'write'] },
    { name: 'parts', enabled: true, permissions: ['read', 'write'] },
    { name: 'reports', enabled: true, permissions: ['read', 'write'] },
    { name: 'analytics', enabled: true, permissions: ['read', 'write'] },
    { name: 'qr-codes', enabled: true, permissions: ['read', 'write'] },
    { name: 'asset-types', enabled: true, permissions: ['read', 'write'] },
  ],
  features: ['asset-tracking', 'maintenance-scheduling', 'spare-parts-management']
}
```

### 3.2 Service Access Control

The navigation system filters services based on both tenant entitlements and user permissions:

```typescript
// From TenantNavigation.tsx
const accessibleServices = enabledServices.filter(service => {
  return service.config.modules.some(module => 
    user?.permissions.some(permission => 
      permission.startsWith(`${service.name}:${module.name}:`)
    )
  );
});
```

## 4. Implementation Examples

### 4.1 Maintenance Dashboard

The maintenance dashboard implements comprehensive permission checks:

```typescript
const MaintenanceDashboard: React.FC = () => {
  const { hasPermission } = useUser();

  // Filter modules based on user permissions
  const accessibleModules = maintenanceModules.filter(module => 
    hasPermission('equipment-maintenance-service', module.permission.split(':')[2], 'read')
  );

  // Check if user has any maintenance access
  const hasMaintenanceAccess = accessibleModules.length > 0;

  if (!hasMaintenanceAccess) {
    return <AccessRestricted />;
  }

  return (
    <div>
      {/* Show only accessible modules */}
      {accessibleModules.map(module => (
        <ModuleCard key={module.id} module={module} />
      ))}
      
      {/* Conditional quick actions */}
      {hasPermission('equipment-maintenance-service', 'schedule', 'write') && (
        <Button>Schedule Maintenance</Button>
      )}
    </div>
  );
};
```

### 4.2 Generator Checklist Page

The generator checklist page implements granular permission checks:

```typescript
const GeneratorChecklistPage: React.FC = () => {
  const { hasPermission } = useUser();

  // Check access permission
  if (!hasPermission('equipment-maintenance-service', 'checklists', 'read')) {
    return <AccessRestricted />;
  }

  const handleSave = (data: ChecklistType) => {
    // Check write permission
    if (!hasPermission('equipment-maintenance-service', 'checklists', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save checklists.',
        color: 'red',
      });
      return;
    }
    // Save logic
  };

  return (
    <GeneratorMaintenanceChecklist
      onSave={handleSave}
      onPrint={handlePrint}
      canEdit={hasPermission('equipment-maintenance-service', 'checklists', 'write')}
      canDelete={hasPermission('equipment-maintenance-service', 'checklists', 'delete')}
      canApprove={hasPermission('equipment-maintenance-service', 'checklists', 'approve')}
    />
  );
};
```

### 4.3 Customer Equipment Management

The customer equipment page implements CRUD permission checks:

```typescript
const CustomerEquipmentPage: React.FC = () => {
  const { hasPermission } = useUser();

  // Check access permission
  if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'read')) {
    return <AccessRestricted />;
  }

  const handleSaveCustomer = (customer: MaintenanceCustomer) => {
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save customer information.',
        color: 'red',
      });
      return;
    }
    // Save logic
  };

  return (
    <CustomerEquipmentManager
      customers={customers}
      onSaveCustomer={handleSaveCustomer}
      canEdit={hasPermission('equipment-maintenance-service', 'asset-registry', 'write')}
      canDelete={hasPermission('equipment-maintenance-service', 'asset-registry', 'delete')}
    />
  );
};
```

## 5. Navigation Integration

### 5.1 Service Configuration

The maintenance service is configured in the navigation with grouped features:

```typescript
'equipment-maintenance-service': {
  name: 'Equipment Maintenance',
  icon: IconTools,
  color: 'blue',
  groups: [
    {
      label: 'Maintenance Management',
      items: [
        { name: 'Dashboard', href: '/maintenance', icon: IconDashboard },
        { name: 'Work Orders', href: '/maintenance/work-orders', icon: IconClipboardCheck },
        { name: 'Scheduler', href: '/maintenance/scheduler', icon: IconCalendar },
        { name: 'Checklists', href: '/maintenance/checklists', icon: IconClipboardList }
      ]
    },
    {
      label: 'Asset Management',
      items: [
        { name: 'Asset Registry', href: '/maintenance/assets', icon: IconAsset },
        { name: 'Equipment Types', href: '/maintenance/equipment-types', icon: IconDatabase },
        { name: 'Locations', href: '/maintenance/locations', icon: IconMapPin },
        { name: 'QR Codes', href: '/maintenance/qr-codes', icon: IconSearch }
      ]
    },
    // ... more groups
  ]
}
```

### 5.2 Permission-Based Filtering

Navigation items are filtered based on user permissions:

```typescript
const getServiceGroups = (serviceName: string) => {
  const service = serviceConfig[serviceName as keyof typeof serviceConfig];
  if (!service || !('groups' in service)) return [];

  return service.groups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const moduleName = item.name.toLowerCase().replace(/\s+/g, '-');
      return user?.permissions.some(permission => 
        permission.startsWith(`${serviceName}:${moduleName}:`)
      );
    })
  })).filter(group => group.items.length > 0);
};
```

## 6. Best Practices

### 6.1 Permission Checking

1. **Always check permissions at the page level** before rendering content
2. **Implement granular permission checks** for individual actions
3. **Provide clear feedback** when permissions are denied
4. **Use consistent permission patterns** across all maintenance modules

### 6.2 UI/UX Considerations

1. **Hide inaccessible features** rather than showing disabled buttons
2. **Show appropriate messaging** when access is restricted
3. **Maintain consistent navigation** even when some items are filtered out
4. **Provide clear error messages** for permission violations

### 6.3 Security

1. **Client-side checks are for UX only** - always validate on the server
2. **Use proper authentication** before checking permissions
3. **Log permission violations** for security monitoring
4. **Implement proper session management**

## 7. Testing

### 7.1 Permission Testing

Test different user roles and permissions:

```typescript
// Test read-only access
const readOnlyUser = {
  permissions: ['equipment-maintenance-service:asset-registry:read']
};

// Test full access
const adminUser = {
  permissions: [
    'equipment-maintenance-service:asset-registry:read',
    'equipment-maintenance-service:asset-registry:write',
    'equipment-maintenance-service:asset-registry:delete'
  ]
};
```

### 7.2 Tenant Testing

Test different tenant configurations:

```typescript
// Test tenant with limited maintenance access
const limitedTenant = {
  'equipment-maintenance-service': {
    enabled: true,
    modules: [
      { name: 'asset-registry', enabled: true, permissions: ['read'] },
      { name: 'work-orders', enabled: false, permissions: [] }
    ]
  }
};
```

## 8. Future Enhancements

### 8.1 Advanced Permissions

- **Conditional permissions** based on data ownership
- **Time-based permissions** for temporary access
- **Location-based permissions** for field technicians
- **Equipment-specific permissions** for specialized access

### 8.2 Integration Points

- **Integration with HR service** for technician permissions
- **Integration with finance service** for cost-related permissions
- **Integration with inventory service** for parts management permissions
- **Integration with notification service** for alert permissions

This guide ensures that the maintenance service follows the same robust permission and tenancy patterns as the CRM module, providing secure and scalable access control for equipment maintenance operations. 