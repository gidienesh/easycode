import React from 'react';
import { 
  Breadcrumbs, 
  Text, 
  Group, 
  ActionIcon, 
  Tooltip,
  Box,
  Divider
} from '@mantine/core';
import { 
  IconHome, 
  IconChevronRight,
  IconArrowLeft
} from '@tabler/icons-react';
import { useTenant } from '../providers/TenantProvider';

interface MobileBreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

// Service path mapping
const servicePaths = {
  '/users': 'User Management',
  '/crm': 'CRM',
  '/finance': 'Finance',
  '/inventory': 'Inventory',
  '/pos': 'Point of Sale',
  '/hr': 'Human Resources',
  '/logistics': 'Logistics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/dashboard': 'Dashboard'
};

// Feature path mapping
const featurePaths = {
  '/users/roles': 'Roles',
  '/users/permissions': 'Permissions',
  '/crm/leads': 'Leads',
  '/crm/contacts': 'Contacts',
  '/crm/opportunities': 'Opportunities',
  '/crm/accounts': 'Accounts',
  '/finance/accounts': 'Chart of Accounts',
  '/finance/invoices': 'Invoices',
  '/finance/payments': 'Payments',
  '/finance/reports': 'Reports',
  '/inventory/items': 'Items',
  '/inventory/stock': 'Stock Management',
  '/inventory/purchase-orders': 'Purchase Orders',
  '/inventory/suppliers': 'Suppliers',
  '/pos/sales': 'Sales',
  '/pos/returns': 'Returns',
  '/pos/payments': 'Payments',
  '/pos/registers': 'Registers',
  '/hr/employees': 'Employees',
  '/hr/payroll': 'Payroll',
  '/hr/leave': 'Leave Management',
  '/hr/performance': 'Performance',
  '/logistics/shipments': 'Shipments',
  '/logistics/tracking': 'Tracking',
  '/logistics/carriers': 'Carriers',
  '/logistics/routes': 'Routes',
  '/notifications/email': 'Email Templates',
  '/notifications/sms': 'SMS Templates',
  '/notifications/scheduled': 'Scheduled',
  '/notifications/analytics': 'Analytics'
};

export function MobileBreadcrumbs({ currentPath, onNavigate }: MobileBreadcrumbsProps) {
  const { tenant } = useTenant();

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    
    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      path: '/dashboard',
      icon: IconHome
    });

    // Split the path and build breadcrumbs
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    let currentFullPath = '';
    pathSegments.forEach((segment, index) => {
      currentFullPath += `/${segment}`;
      
      // Check if this is a service path
      if (servicePaths[currentFullPath as keyof typeof servicePaths]) {
        breadcrumbs.push({
          label: servicePaths[currentFullPath as keyof typeof servicePaths],
          path: currentFullPath,
          icon: null
        });
      }
      // Check if this is a feature path
      else if (featurePaths[currentFullPath as keyof typeof featurePaths]) {
        breadcrumbs.push({
          label: featurePaths[currentFullPath as keyof typeof featurePaths],
          path: currentFullPath,
          icon: null
        });
      }
      // Fallback to capitalized segment
      else {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: currentFullPath,
          icon: null
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path: string) => {
    onNavigate(path);
  };

  const handleBackClick = () => {
    if (breadcrumbs.length > 1) {
      const previousPath = breadcrumbs[breadcrumbs.length - 2].path;
      onNavigate(previousPath);
    } else {
      onNavigate('/dashboard');
    }
  };

  return (
    <Box>
      <Group position="apart" mb="xs">
        <Group spacing="xs">
          {breadcrumbs.length > 1 && (
            <Tooltip label="Go back">
              <ActionIcon 
                variant="light" 
                size="sm"
                onClick={handleBackClick}
              >
                <IconArrowLeft size="1rem" />
              </ActionIcon>
            </Tooltip>
          )}
          
          <Text size="xs" color="dimmed">
            {tenant?.name}
          </Text>
        </Group>
        
        <Text size="xs" color="dimmed">
          {breadcrumbs.length} levels
        </Text>
      </Group>

      <Breadcrumbs 
        separator={<IconChevronRight size="0.75rem" />}
        styles={{
          root: {
            flexWrap: 'wrap'
          },
          breadcrumb: {
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <Text
            key={breadcrumb.path}
            size="xs"
            color={index === breadcrumbs.length - 1 ? 'dark' : 'dimmed'}
            onClick={() => handleBreadcrumbClick(breadcrumb.path)}
            style={{
              cursor: index === breadcrumbs.length - 1 ? 'default' : 'pointer',
              fontWeight: index === breadcrumbs.length - 1 ? 600 : 400
            }}
          >
            {breadcrumb.icon && <breadcrumb.icon size="0.75rem" style={{ marginRight: '0.25rem' }} />}
            {breadcrumb.label}
          </Text>
        ))}
      </Breadcrumbs>
      
      <Divider mt="xs" />
    </Box>
  );
} 