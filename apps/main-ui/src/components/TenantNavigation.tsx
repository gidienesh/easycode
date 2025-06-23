import React, { useState } from 'react';
import { 
  AppShell,
  NavLink, 
  Group, 
  Text, 
  Badge, 
  Avatar,
  Stack,
  Button,
  Divider,
  Collapse,
  Box,
  Burger,
  useMantineTheme,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconCash, 
  IconPackage,
  IconTruck,
  IconBell,
  IconSettings,
  IconDashboard,
  IconLogout,
  IconChevronRight,
  IconChevronDown,
  IconUser,
  IconBuildingStore,
  IconReceipt,
  IconBox,
  IconShoppingCart,
  IconUsersGroup,
  IconTruckDelivery,
  IconNotification,
  IconTarget,
  IconTool,
  IconClipboardList,
  IconCalendar,
  IconChartBar,
  IconFileText,
  IconCreditCard,
  IconCalculator,
  IconReportMoney,
  IconBuildingBank,
  IconAsset,
  IconTools,
  IconClipboardCheck,
  IconHistory,
  IconGauge,
  IconTimeline,
  IconUsersPlus,
  IconBriefcase,
  IconClock,
  IconCalendarTime,
  IconFileInvoice,
  IconReceipt2,
  IconWallet,
  IconChartPie,
  IconTrendingUp,
  IconDatabase,
  IconFolder,
  IconChecklist,
  IconMapPin,
  IconRoute,
  IconCar,
  IconTruckReturn,
  IconMessage,
  IconMail,
  IconPhone,
  IconMessageCircle,
  IconNote,
  IconVideo,
  IconActivity,
  IconSearch,
  IconPercentage,
  IconBook,
  IconCurrency,
  IconUserPlus,
  IconUserMinus,
  IconNetwork,
  IconRuler,
  IconFlag,
  IconFile,
  IconArrowsMaximize,
  IconFileCertificate,
  IconEye,
  IconAlertCircle
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useTenant } from '../providers/TenantProvider';
import { useUser } from '../providers/UserProvider';

// Enhanced service configuration with comprehensive features
const serviceConfig = {
  'user-service': {
    name: 'User Management',
    icon: IconUsers,
    color: 'blue',
    features: [
      { name: 'Users', href: '/users', icon: IconUser },
      { name: 'Roles', href: '/users/roles', icon: IconUsers },
      { name: 'Permissions', href: '/users/permissions', icon: IconSettings }
    ]
  },
  'crm-service': {
    name: 'Customer Relationship Management',
    icon: IconBuilding,
    color: 'green',
    features: [
      { name: 'Leads', href: '/crm/leads', icon: IconTarget },
      { name: 'Contacts', href: '/crm/contacts', icon: IconUsers },
      { name: 'Accounts', href: '/crm/accounts', icon: IconBuilding },
      { name: 'Opportunities', href: '/crm/opportunities', icon: IconBuildingStore },
      { name: 'Activities', href: '/crm/activities', icon: IconActivity },
      { name: 'Reports', href: '/crm/reports', icon: IconChartBar },
      { name: 'Email Templates', href: '/crm/email-templates', icon: IconMail },
      { name: 'SMS Templates', href: '/crm/sms-templates', icon: IconMessage },
      { name: 'Call Logs', href: '/crm/call-logs', icon: IconPhone },
      { name: 'Meeting Notes', href: '/crm/meeting-notes', icon: IconNote },
      { name: 'WhatsApp Logs', href: '/crm/whatsapp-logs', icon: IconMessageCircle },
      { name: 'Activity Feed', href: '/crm/activity-feed', icon: IconTimeline }
    ]
  },
  'project-management-service': {
    name: 'Project Management',
    icon: IconTarget,
    color: 'indigo',
    features: [
      { name: 'Projects', href: '/projects', icon: IconBriefcase },
      { name: 'Tasks', href: '/projects/tasks', icon: IconChecklist },
      { name: 'Timeline', href: '/projects/timeline', icon: IconTimeline },
      { name: 'Gantt Charts', href: '/projects/gantt', icon: IconChartBar },
      { name: 'Calendar', href: '/projects/calendar', icon: IconCalendar },
      { name: 'Resources', href: '/projects/resources', icon: IconUsers },
      { name: 'Time Tracking', href: '/projects/time-tracking', icon: IconClock },
      { name: 'Milestones', href: '/projects/milestones', icon: IconFlag },
      { name: 'Workspaces', href: '/projects/workspaces', icon: IconFolder },
      { name: 'Reports', href: '/projects/reports', icon: IconChartPie },
      { name: 'Dashboards', href: '/projects/dashboards', icon: IconGauge },
      { name: 'File Management', href: '/projects/files', icon: IconFile },
      { name: 'Comments', href: '/projects/comments', icon: IconMessageCircle },
      { name: 'Activity Feed', href: '/projects/activity', icon: IconActivity }
    ]
  },
  'equipment-maintenance-service': {
    name: 'Equipment Maintenance',
    icon: IconTool,
    color: 'orange',
    features: [
      { name: 'Asset Registry', href: '/equipment/assets', icon: IconAsset },
      { name: 'Work Orders', href: '/equipment/work-orders', icon: IconClipboardList },
      { name: 'Preventive Maintenance', href: '/equipment/preventive', icon: IconCalendar },
      { name: 'Corrective Maintenance', href: '/equipment/corrective', icon: IconTools },
      { name: 'Checklists', href: '/equipment/checklists', icon: IconClipboardCheck },
      { name: 'Service History', href: '/equipment/history', icon: IconHistory },
      { name: 'Maintenance Schedule', href: '/equipment/schedule', icon: IconCalendarTime },
      { name: 'Technicians', href: '/equipment/technicians', icon: IconUsers },
      { name: 'Spare Parts', href: '/equipment/parts', icon: IconPackage },
      { name: 'Reports', href: '/equipment/reports', icon: IconChartBar },
      { name: 'Analytics', href: '/equipment/analytics', icon: IconTrendingUp },
      { name: 'QR Codes', href: '/equipment/qr-codes', icon: IconSearch },
      { name: 'Asset Types', href: '/equipment/asset-types', icon: IconDatabase }
    ]
  },
  'hr-service': {
    name: 'Human Resources',
    icon: IconUsersGroup,
    color: 'cyan',
    features: [
      { name: 'Employees', href: '/hr/employees', icon: IconUsers },
      { name: 'Departments', href: '/hr/departments', icon: IconBuilding },
      { name: 'Positions', href: '/hr/positions', icon: IconBriefcase },
      { name: 'Payroll', href: '/hr/payroll', icon: IconCalculator },
      { name: 'Leave Management', href: '/hr/leave', icon: IconCalendarTime },
      { name: 'Leave Balances', href: '/hr/leave-balances', icon: IconClock },
      { name: 'Leave Requests', href: '/hr/leave-requests', icon: IconClipboardList },
      { name: 'Performance', href: '/hr/performance', icon: IconChartBar },
      { name: 'Recruitment', href: '/hr/recruitment', icon: IconUsersPlus },
      { name: 'Job Requisitions', href: '/hr/job-requisitions', icon: IconFileText },
      { name: 'Candidates', href: '/hr/candidates', icon: IconUser },
      { name: 'Interviews', href: '/hr/interviews', icon: IconVideo },
      { name: 'Onboarding', href: '/hr/onboarding', icon: IconUsersPlus },
      { name: 'Offboarding', href: '/hr/offboarding', icon: IconUserMinus },
      { name: 'Documents', href: '/hr/documents', icon: IconFile },
      { name: 'Reports', href: '/hr/reports', icon: IconChartPie },
      { name: 'Organizational Chart', href: '/hr/org-chart', icon: IconNetwork }
    ]
  },
  'finance-service': {
    name: 'Finance & Accounting',
    icon: IconCash,
    color: 'yellow',
    features: [
      { name: 'General Ledger', href: '/finance/gl', icon: IconBook },
      { name: 'Chart of Accounts', href: '/finance/accounts', icon: IconReceipt },
      { name: 'Journal Entries', href: '/finance/journal-entries', icon: IconFileText },
      { name: 'Accounts Payable', href: '/finance/ap', icon: IconCreditCard },
      { name: 'Accounts Receivable', href: '/finance/ar', icon: IconReceipt2 },
      { name: 'Fixed Assets', href: '/finance/assets', icon: IconAsset },
      { name: 'Invoices', href: '/finance/invoices', icon: IconFileInvoice },
      { name: 'Payments', href: '/finance/payments', icon: IconWallet },
      { name: 'Bank Reconciliation', href: '/finance/bank-reconciliation', icon: IconBuildingBank },
      { name: 'Trial Balance', href: '/finance/trial-balance', icon: IconCalculator },
      { name: 'Financial Reports', href: '/finance/reports', icon: IconChartBar },
      { name: 'Balance Sheet', href: '/finance/balance-sheet', icon: IconReportMoney },
      { name: 'Income Statement', href: '/finance/income-statement', icon: IconTrendingUp },
      { name: 'Cash Flow', href: '/finance/cash-flow', icon: IconCash },
      { name: 'Budget Management', href: '/finance/budgets', icon: IconChartPie },
      { name: 'Tax Management', href: '/finance/tax', icon: IconReceipt },
      { name: 'Multi-Currency', href: '/finance/currency', icon: IconCurrency },
      { name: 'Financial Dimensions', href: '/finance/dimensions', icon: IconDatabase },
      { name: 'Audit Trail', href: '/finance/audit', icon: IconEye },
      { name: 'Dashboards', href: '/finance/dashboards', icon: IconGauge }
    ]
  },
  'inventory-service': {
    name: 'Inventory Management',
    icon: IconPackage,
    color: 'orange',
    features: [
      { name: 'Items', href: '/inventory/items', icon: IconPackage },
      { name: 'Stock Management', href: '/inventory/stock', icon: IconBox },
      { name: 'Warehouses', href: '/inventory/warehouses', icon: IconBuilding },
      { name: 'Stock Movements', href: '/inventory/movements', icon: IconArrowsMaximize },
      { name: 'Stock Counts', href: '/inventory/stock-counts', icon: IconCalculator },
      { name: 'Purchase Orders', href: '/inventory/purchase-orders', icon: IconReceipt },
      { name: 'Suppliers', href: '/inventory/suppliers', icon: IconBuilding },
      { name: 'Categories', href: '/inventory/categories', icon: IconFolder },
      { name: 'Units of Measure', href: '/inventory/uom', icon: IconRuler },
      { name: 'Reports', href: '/inventory/reports', icon: IconChartBar },
      { name: 'Analytics', href: '/inventory/analytics', icon: IconTrendingUp },
      { name: 'Alerts', href: '/inventory/alerts', icon: IconAlertCircle }
    ]
  },
  'pos-service': {
    name: 'Point of Sale',
    icon: IconShoppingCart,
    color: 'purple',
    features: [
      { name: 'Sales', href: '/pos/sales', icon: IconShoppingCart },
      { name: 'Returns', href: '/pos/returns', icon: IconTruckReturn },
      { name: 'Payments', href: '/pos/payments', icon: IconCash },
      { name: 'Registers', href: '/pos/registers', icon: IconReceipt },
      { name: 'Products', href: '/pos/products', icon: IconPackage },
      { name: 'Customers', href: '/pos/customers', icon: IconUsers },
      { name: 'Discounts', href: '/pos/discounts', icon: IconPercentage },
      { name: 'Taxes', href: '/pos/taxes', icon: IconReceipt },
      { name: 'Receipts', href: '/pos/receipts', icon: IconFileText },
      { name: 'Reports', href: '/pos/reports', icon: IconChartBar },
      { name: 'Analytics', href: '/pos/analytics', icon: IconTrendingUp },
      { name: 'Settings', href: '/pos/settings', icon: IconSettings }
    ]
  },
  'logistics-service': {
    name: 'Logistics',
    icon: IconTruckDelivery,
    color: 'teal',
    features: [
      { name: 'Shipments', href: '/logistics/shipments', icon: IconTruck },
      { name: 'Tracking', href: '/logistics/tracking', icon: IconTruckDelivery },
      { name: 'Carriers', href: '/logistics/carriers', icon: IconTruck },
      { name: 'Routes', href: '/logistics/routes', icon: IconRoute },
      { name: 'Fleet Management', href: '/logistics/fleet', icon: IconCar },
      { name: 'Delivery Scheduling', href: '/logistics/scheduling', icon: IconCalendar },
      { name: 'Warehouse Operations', href: '/logistics/warehouse', icon: IconBuilding },
      { name: 'Import/Export', href: '/logistics/import-export', icon: IconArrowsMaximize },
      { name: 'Customs', href: '/logistics/customs', icon: IconFileCertificate },
      { name: 'Reports', href: '/logistics/reports', icon: IconChartBar },
      { name: 'Analytics', href: '/logistics/analytics', icon: IconTrendingUp },
      { name: 'Maps', href: '/logistics/maps', icon: IconMapPin }
    ]
  },
  'notification-service': {
    name: 'Notifications',
    icon: IconNotification,
    color: 'pink',
    features: [
      { name: 'Email Templates', href: '/notifications/email', icon: IconMail },
      { name: 'SMS Templates', href: '/notifications/sms', icon: IconMessage },
      { name: 'Push Notifications', href: '/notifications/push', icon: IconBell },
      { name: 'Scheduled', href: '/notifications/scheduled', icon: IconCalendar },
      { name: 'Templates', href: '/notifications/templates', icon: IconFileText },
      { name: 'Channels', href: '/notifications/channels', icon: IconMessageCircle },
      { name: 'Analytics', href: '/notifications/analytics', icon: IconChartBar },
      { name: 'Settings', href: '/notifications/settings', icon: IconSettings },
      { name: 'History', href: '/notifications/history', icon: IconHistory },
      { name: 'Reports', href: '/notifications/reports', icon: IconChartPie }
    ]
  }
};

// Always available items
const alwaysAvailableItems = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    href: '/dashboard',
    color: 'gray'
  },
  {
    label: 'Settings',
    icon: IconSettings,
    href: '/settings',
    color: 'gray'
  }
];

interface NavigationProps {
  opened: boolean;
  onToggle: () => void;
}

export function TenantNavigation({ opened, onToggle }: NavigationProps) {
  const { tenant, entitlements, loading } = useTenant();
  const { user, logout } = useUser();
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const theme = useMantineTheme();
  const router = useRouter();
  const pathname = router.asPath;
  
  if (loading) {
    return (
      <AppShell.Navbar 
        p="md" 
        hidden={!opened}
      >
        <Text>Loading navigation...</Text>
      </AppShell.Navbar>
    );
  }
  
  // Get enabled services
  const enabledServices = Object.entries(entitlements?.services || {})
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => ({
      name: serviceName,
      config
    }));

  // Get user's accessible services (intersection of tenant entitlements and user permissions)
 const accessibleServices = enabledServices.filter(service => {
    return service.config.modules.some(module => 
      user?.permissions.some(permission => 
        permission.startsWith(`${service.name}:${module.name}:`)
      )
    );
  }); 

  const toggleService = (serviceName: string) => {
    setExpandedServices(prev =>
      prev[0] === serviceName ? [] : [serviceName]
    );
  };

  const isServiceExpanded = (serviceName: string) => {
    return expandedServices.includes(serviceName);
  };

  const getServiceFeatures = (serviceName: string) => {
    const service = serviceConfig[serviceName as keyof typeof serviceConfig];
    if (!service) return [];

    // Filter features based on user permissions
    return service.features.filter(feature => {
      const moduleName = feature.name.toLowerCase().replace(/\s+/g, '-');
      return user?.permissions.some(permission => 
        permission.startsWith(`${serviceName}:${moduleName}:`)
      );
    });
  };

  const handleNavigation = (href: string) => {
    // Use Next.js router for client-side navigation (no page reload)
    router.push(href);
    
    // Close mobile menu after navigation
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <AppShell.Navbar 
      p="md" 
      hidden={!opened}
      style={{ 
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Header Section */}
      <AppShell.Section>
        <Stack gap="md">
          {/* Tenant Info */}
          {tenant && (
            <Group>
              <Avatar 
                src={tenant.logoUrl} 
                alt={tenant.name}
                size="md"
              >
                {tenant.name.charAt(0)}
              </Avatar>
              <div>
                <Text size="sm" fw={500} lineClamp={1}>
                  {tenant.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {tenant.status}
                </Text>
              </div>
            </Group>
          )}
          
          {/* User Info */}
          {user && (
            <Group>
              <Avatar 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                size="sm"
              >
                {user.firstName.charAt(0)}
              </Avatar>
              <div>
                <Text size="sm" fw={500} lineClamp={1}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text size="xs" c="dimmed">
                  {user.role}
                </Text>
              </div>
            </Group>
          )}
        </Stack>
      </AppShell.Section>
      
      <Divider my="md" />
      
      {/* Navigation Section */}
      <AppShell.Section grow>
        <Stack gap="xs">
          {/* Always Available Items */}
          {alwaysAvailableItems.map((item) => (
            <NavLink
              key={item.href}
              label={item.label}
              leftSection={<item.icon size="1.2rem" stroke={1.5} />}
              href={item.href}
              active={isActive(item.href)}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
              color={item.color}
            />
          ))}

          <Divider my="xs" />

          {/* Service Accordion Items */}
          {accessibleServices.map((service) => {
            const serviceInfo = serviceConfig[service.name as keyof typeof serviceConfig];
            if (!serviceInfo) return null;

            const features = getServiceFeatures(service.name);
            const isExpanded = isServiceExpanded(service.name);
            const hasFeatures = features.length > 0;
            const servicePath = `/${service.name.replace('-service', '')}`;
            const isServiceActive = isActive(servicePath);

            return (
              <Box key={service.name}>
                <NavLink
                  label={serviceInfo.name}
                  leftSection={<serviceInfo.icon size="1.2rem" stroke={1.5} />}
                  rightSection={
                    hasFeatures ? (
                      isExpanded ? (
                        <IconChevronDown size="1rem" />
                      ) : (
                        <IconChevronRight size="1rem" />
                      )
                    ) : null
                  }
                  color={serviceInfo.color}
                  active={isServiceActive}
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasFeatures) {
                      toggleService(service.name);
                    } else {
                      handleNavigation(servicePath);
                    }
                  }}
                  style={{
                    cursor: 'pointer'
                  }}
                />
                
                {hasFeatures && (
                  <Collapse in={isExpanded}>
                    <Box ml="md">
                      {features.map((feature) => (
                        <NavLink
                          key={feature.href}
                          label={feature.name}
                          leftSection={<feature.icon size="1rem" stroke={1.5} />}
                          href={feature.href}
                          active={isActive(feature.href)}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(feature.href);
                          }}
                          color={serviceInfo.color}
                          variant="light"
                        />
                      ))}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      </AppShell.Section>
      
      <Divider my="md" />
      
      {/* Footer Section */}
      <AppShell.Section>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Services Enabled
            </Text>
            <Badge color="green" size="sm">
              {accessibleServices.length}
            </Badge>
          </Group>
          
          <Button 
            variant="light" 
            size="sm" 
            color="red"
            leftSection={<IconLogout size="1rem" />}
            onClick={logout}
            fullWidth
          >
            Logout
          </Button>
        </Stack>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

// Mobile Header Component
export function MobileHeader({ opened, onToggle }: NavigationProps) {
  const { tenant } = useTenant();
  const { user } = useUser();
  const router = useRouter();

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" style={{ height: '100%' }}>
        <Group>
          <Burger
            opened={opened}
            onClick={onToggle}
            size="sm"
            color="gray"
          />
          <div>
            <Text size="sm" fw={500}>
              {tenant?.name || 'EasyCode Platform'}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.firstName} {user?.lastName}
            </Text>
          </div>
        </Group>
        
        <Group gap="xs">
          <Tooltip label="Dashboard">
            <ActionIcon 
              variant="light" 
              size="md"
              onClick={() => router.push('/dashboard')}
            >
              <IconDashboard size="1rem" />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Settings">
            <ActionIcon 
              variant="light" 
              size="md"
              onClick={() => router.push('/settings')}
            >
              <IconSettings size="1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </AppShell.Header>
  );
} 