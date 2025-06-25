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
  IconAlertCircle,
  IconBrandWhatsapp,
  IconPhoneCall,
  IconBug
} from '@tabler/icons-react';
import NextLink from 'next/link';
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
    name: 'CRM',
    icon: IconBuilding,
    color: 'green',
    groups: [
      {
        label: 'Activity Feed',
        items: [
          { name: 'Activity Feed', href: '/crm/activity-feed', icon: IconTimeline }
        ]
      },
      {
        label: 'Pipelines',
        items: [
          { name: 'Leads', href: '/crm/leads', icon: IconTarget },
          { name: 'Contacts', href: '/crm/contacts', icon: IconUsers },
          { name: 'Accounts', href: '/crm/accounts', icon: IconBuilding },
          { name: 'Opportunities', href: '/crm/opportunities', icon: IconBuildingStore },
          { name: 'Reports', href: '/crm/reports', icon: IconChartBar }
        ]
      },
      {
        label: 'Engagements',
        items: [
          { name: 'Email', href: '/communications/email', icon: IconMail },
          { name: 'WhatsApp', href: '/communications/whatsapp', icon: IconBrandWhatsapp },
          { name: 'SMS', href: '/communications/sms', icon: IconMessageCircle },
          { name: 'Phone Calls', href: '/communications/calls', icon: IconPhoneCall },
          { name: 'Meetings', href: '/communications/meetings', icon: IconVideo },
          { name: 'Templates', href: '/communications/templates', icon: IconFileText },
          { name: 'Analytics', href: '/communications/analytics', icon: IconChartBar },
          { name: 'Settings', href: '/communications/settings', icon: IconSettings }
        ]
      },
      {
        label: 'Planner',
        items: [
          { name: 'Calendar', href: '/planner/calendar', icon: IconCalendar },
          { name: 'Tasks', href: '/planner/tasks', icon: IconChecklist },
          { name: 'Notes', href: '/planner/notes', icon: IconNote },
          { name: 'Reminders', href: '/planner/reminders', icon: IconBell }
        ]
      }
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
    groups: [
      {
        label: 'Maintenance Management',
        items: [
          { name: 'Dashboard', href: '/maintenance', icon: IconDashboard },
          { name: 'Customer & Equipment', href: '/maintenance/customer-equipment', icon: IconBuilding },
          { name: 'Maintenance Scheduler', href: '/maintenance/scheduler', icon: IconCalendar },
          { name: 'Work Orders', href: '/maintenance/work-orders', icon: IconClipboardList }
        ]
      },
      {
        label: 'Equipment Checklists',
        items: [
          { name: 'Generator Maintenance', href: '/maintenance/generator-checklist', icon: IconTools },
          { name: 'Air Conditioner', href: '/maintenance/ac-checklist', icon: IconGauge },
          { name: 'Fire Equipment', href: '/maintenance/fire-checklist', icon: IconAlertCircle },
          { name: 'HVAC System', href: '/maintenance/hvac-checklist', icon: IconGauge }
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
      {
        label: 'Technician Management',
        items: [
          { name: 'Technicians', href: '/maintenance/technicians', icon: IconUsers },
          { name: 'Skills & Certifications', href: '/maintenance/skills', icon: IconFileCertificate },
          { name: 'Availability', href: '/maintenance/availability', icon: IconClock },
          { name: 'Performance', href: '/maintenance/performance', icon: IconChartBar }
        ]
      },
      {
        label: 'Service & History',
        items: [
          { name: 'Service History', href: '/maintenance/history', icon: IconHistory },
          { name: 'Preventive Maintenance', href: '/maintenance/preventive', icon: IconCalendar },
          { name: 'Corrective Maintenance', href: '/maintenance/corrective', icon: IconTools },
          { name: 'Spare Parts', href: '/maintenance/parts', icon: IconPackage }
        ]
      },
      {
        label: 'Reports & Analytics',
        items: [
          { name: 'Maintenance Reports', href: '/maintenance/reports', icon: IconChartBar },
          { name: 'Cost Analysis', href: '/maintenance/costs', icon: IconReportMoney },
          { name: 'Performance Analytics', href: '/maintenance/analytics', icon: IconTrendingUp },
          { name: 'Compliance Reports', href: '/maintenance/compliance', icon: IconFileCertificate }
        ]
      }
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
  const [expandedCrmGroup, setExpandedCrmGroup] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const theme = useMantineTheme();
  const router = useRouter();
  const pathname = router.asPath; // router.pathname is generally preferred for active checks with dynamic routes
  
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
  
  // Get enabled services from tenant entitlements
  const enabledServices = Object.entries(entitlements?.services || {})
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => ({
      name: serviceName,
      config
    }));

  // Get user's accessible services (intersection of tenant entitlements and user permissions)
 const accessibleServices = enabledServices.filter(service => {
    // For equipment maintenance service, check if user has any maintenance permissions
    if (service.name === 'equipment-maintenance-service') {
      const hasAnyMaintenancePermission = user?.permissions.some(permission => 
        permission.startsWith('equipment-maintenance-service:')
      );
      return hasAnyMaintenancePermission;
    }
    
    return service.config.modules.some(module => 
      user?.permissions.some(permission => 
        permission.startsWith(`${service.name}:${module.name}:`)
      )
    );
  });

  const toggleGroup = (serviceName: string, groupLabel: string) => {
    const groupKey = `${serviceName}-${groupLabel}`;
    setExpandedGroups(prev =>
      prev[0] === groupKey ? [] : [groupKey]
    );
  };

  const isGroupExpanded = (serviceName: string, groupLabel: string) => {
    const groupKey = `${serviceName}-${groupLabel}`;
    return expandedGroups.includes(groupKey);
  };

  const getServiceFeatures = (serviceName: string) => {
    const service = serviceConfig[serviceName as keyof typeof serviceConfig];
    if (!service) return [];

    // Handle grouped services (like CRM)
    if ('groups' in service) {
      const allItems: any[] = [];
      service.groups.forEach(group => {
        group.items.forEach(item => {
          const moduleName = item.name.toLowerCase().replace(/\s+/g, '-');
          if (user?.permissions.some(permission => 
            permission.startsWith(`${serviceName}:${moduleName}:`)
          )) {
            allItems.push(item);
          }
        });
      });
      return allItems;
    }

    // Handle regular services with features
    if ('features' in service) {
      return service.features.filter(feature => {
        const moduleName = feature.name.toLowerCase().replace(/\s+/g, '-');
        return user?.permissions.some(permission => 
          permission.startsWith(`${serviceName}:${moduleName}:`)
        );
      });
    }

    return [];
  };

  const HIDDEN_ENGAGEMENT_ITEMS = ['Analytics', 'Templates', 'Settings'];

  const getServiceGroups = (serviceName: string) => {
    const service = serviceConfig[serviceName as keyof typeof serviceConfig];
    if (!service || !('groups' in service)) return [];

    return service.groups.map(group => ({
      ...group,
      items: group.label === 'Engagements'
        ? group.items.filter(item => !HIDDEN_ENGAGEMENT_ITEMS.includes(item.name) && user?.permissions.some(permission => permission.startsWith(`${serviceName}:${item.name.toLowerCase().replace(/\s+/g, '-')}:`)))
        : group.items.filter(item => {
            // For equipment maintenance service, show all items if user has any maintenance permissions
            if (serviceName === 'equipment-maintenance-service') {
              const hasAnyMaintenancePermission = user?.permissions.some(permission => 
                permission.startsWith('equipment-maintenance-service:')
              );
              
              // If user has any maintenance permission, show all items
              if (hasAnyMaintenancePermission) {
                return true;
              }
            }
            
            // Default permission matching for other services
            const moduleName = item.name.toLowerCase().replace(/\s+/g, '-');
            return user?.permissions.some(permission => 
              permission.startsWith(`${serviceName}:${moduleName}:`)
            );
          })
    })).filter(group => group.items.length > 0);
  };

  const handleNavigation = (href?: string) => { // href is optional now as NextLink will handle it
    // Close mobile menu after navigation
    // Check for window object to ensure it's client-side
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActive = (href: string) => {
    // For more robust active state, especially with dynamic routes, consider router.pathname
    return pathname === href || pathname.startsWith(href + '/') || (href !== '/' && pathname.startsWith(href));
  };

  // New handlers for CRM and service expansion
  const handleCrmGroup = (groupLabel: string) => {
    setExpandedService(null); // collapse all other services
    setExpandedCrmGroup(prev => (prev === groupLabel ? null : groupLabel));
  };
  const handleService = (serviceName: string) => {
    setExpandedCrmGroup(null); // collapse all CRM groups
    setExpandedService(prev => (prev === serviceName ? null : serviceName));
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
              component={NextLink}
              active={isActive(item.href)}
              onClick={() => handleNavigation()}
              color={item.color}
            />
          ))}

          <Divider my="xs" />

          {/* CRM Section - always visible */}
          {accessibleServices.some(s => s.name === 'crm-service') && (
            <Box mt="md" mb="xs">
              <Text size="xs" fw={700} c="green.7" mb="xs" tt="uppercase">CRM</Text>
              {getServiceGroups('crm-service').map((group, groupIndex) => (
                <Box key={groupIndex} mb="xs">
                  <NavLink
                    label={group.label}
                    leftSection={<IconChevronRight size="1rem" />}
                    rightSection={expandedCrmGroup === group.label ? <IconChevronDown size="1rem" /> : <IconChevronRight size="1rem" />}
                    color="green"
                    variant="light"
                    onClick={e => {
                      e.preventDefault();
                      handleCrmGroup(group.label);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <Collapse in={expandedCrmGroup === group.label}>
                    <Box ml="lg">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.href}
                          label={item.name}
                          leftSection={<item.icon size="1rem" stroke={1.5} />}
                          href={item.href}
                          component={NextLink}
                          active={isActive(item.href)}
                          onClick={() => handleNavigation()}
                          color="green"
                          variant="light"
                        />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </Box>
          )}
    <Divider my="xs" />
          {/* Other Services Section - always visible */}
          {accessibleServices.some(s => s.name !== 'crm-service') && (
            <Box mt="md" mb="xs">
              <Text size="xs" fw={700} c="blue.7" mb="xs" tt="uppercase"></Text>
              {accessibleServices.filter(s => s.name !== 'crm-service').map((service) => {
                const serviceInfo = serviceConfig[service.name as keyof typeof serviceConfig];
                if (!serviceInfo) return null;
                const features = getServiceFeatures(service.name);
                const groups = getServiceGroups(service.name);
                const hasFeatures = features.length > 0;
                const hasGroups = groups.length > 0;
                const servicePath = `/${service.name.replace('-service', '')}`;
                const isServiceActive = isActive(servicePath);
                
                return (
                  <Box key={service.name} mb="xs">
                    <NavLink
                      label={serviceInfo.name}
                      leftSection={<serviceInfo.icon size="1.2rem" stroke={1.5} />}
                      color={serviceInfo.color}
                      active={isServiceActive && !hasFeatures && !hasGroups}
                      component={(!hasFeatures && !hasGroups) ? NextLink : undefined}
                      href={(!hasFeatures && !hasGroups) ? servicePath : undefined}
                      onClick={e => {
                        if (hasFeatures || hasGroups) {
                          e.preventDefault();
                          handleService(service.name);
                        } else {
                          handleNavigation();
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                      rightSection={(hasFeatures || hasGroups) ? (expandedService === service.name ? <IconChevronDown size="1rem" /> : <IconChevronRight size="1rem" />) : null}
                    />
                    {(hasGroups
                      ? groups.map((group, groupIndex) => (
                          <Box key={groupIndex} mb="xs">
                            <NavLink
                              label={group.label}
                              leftSection={<IconChevronRight size="1rem" />}
                              rightSection={isGroupExpanded(service.name, group.label) ? <IconChevronDown size="1rem" /> : <IconChevronRight size="1rem" />}
                              color={serviceInfo.color}
                              variant="light"
                              onClick={e => {
                                e.preventDefault();
                                toggleGroup(service.name, group.label);
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <Collapse in={expandedService === service.name && isGroupExpanded(service.name, group.label)}>
                              <Box ml="lg">
                                {group.items.map((item) => (
                                  <NavLink
                                    key={item.href}
                                    label={item.name}
                                    leftSection={<item.icon size="1rem" stroke={1.5} />}
                                    href={item.href}
                                    component={NextLink}
                                    active={isActive(item.href)}
                                    onClick={() => handleNavigation()}
                                    color={serviceInfo.color}
                                    variant="light"
                                  />
                                ))}
                              </Box>
                            </Collapse>
                          </Box>
                        ))
                      : features.map((feature) => (
                          <Collapse key={feature.href} in={expandedService === service.name}>
                            <NavLink
                              label={feature.name}
                              leftSection={<feature.icon size="1rem" stroke={1.5} />}
                              href={feature.href}
                              component={NextLink}
                              active={isActive(feature.href)}
                              onClick={() => handleNavigation()}
                              color={serviceInfo.color}
                              variant="light"
                            />
                          </Collapse>
                        ))
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
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
  const router = useRouter(); // Keep router for programmatic navigation if needed elsewhere

  // MobileHeader navigation ActionIcons are fine with router.push as they are not standard links.
  // No changes needed here unless we want to convert them to NextLink wrapped ActionIcons,
  // which is possible but not strictly necessary if current behavior is fine.
  // For consistency, one might do it, but router.push is perfectly valid for event-driven navigation.

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" style={{ height: '100%' }}>
        <Group>
          <Burger
            opened={opened}
            onClick={onToggle} // This toggles the mobile navbar, not navigation
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
              component={NextLink}
              href="/dashboard"
              aria-label="Dashboard"
            >
              <IconDashboard size="1rem" />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Settings">
            <ActionIcon 
              variant="light" 
              size="md"
              component={NextLink}
              href="/settings"
              aria-label="Settings"
            >
              <IconSettings size="1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </AppShell.Header>
  );
}