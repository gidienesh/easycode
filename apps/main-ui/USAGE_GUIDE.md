# EasyCode Platform - Usage Guide

## 🚀 Getting Started

### 1. Installation & Setup

```bash
# Navigate to the main-ui directory
cd apps/main-ui

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Mobile-Ready Navigation System

### Desktop Experience

#### **Sidebar Navigation**
- **Always Visible**: Full sidebar on desktop (300px width)
- **Accordion Menus**: Click on services to expand/collapse features
- **Service Organization**: Main menu items are services
- **Feature Sub-menus**: Sub-items are features per service

#### **Navigation Structure**
```
📁 User Management
  ├── 👥 Users
  ├── 🛡️ Roles
  └── ⚙️ Permissions

📁 CRM
  ├── 🏢 Leads
  ├── 👤 Contacts
  ├── 💼 Opportunities
  └── 🏢 Accounts

📁 Finance
  ├── 📊 Chart of Accounts
  ├── 🧾 Invoices
  ├── 💰 Payments
  └── 📈 Reports
```

### Mobile Experience

#### **Mobile Header**
- **Burger Menu**: Tap to open/close navigation
- **Tenant Info**: Shows current tenant name
- **User Info**: Shows current user name
- **Quick Actions**: Dashboard and Settings shortcuts

#### **Collapsible Sidebar**
- **Touch-Friendly**: Larger touch targets
- **Auto-Close**: Menu closes after navigation
- **Smooth Animations**: Smooth expand/collapse transitions

#### **Mobile Breadcrumbs**
- **Navigation Path**: Shows current location
- **Back Button**: Easy navigation to previous level
- **Clickable Path**: Navigate to any level in the path

## 🎯 Dynamic Dashboard Features

### 1. **Service Overview Cards**

#### Desktop View
- **Grid Layout**: 3-column grid on large screens
- **Detailed Stats**: Shows counts, trends, and percentages
- **Progress Bars**: Visual representation of module access
- **Feature Badges**: Shows available features

#### Mobile View
- **Stack Layout**: Vertical stack for better mobile viewing
- **Compact Design**: Optimized for small screens
- **Touch Targets**: Larger buttons for easy tapping
- **Quick Access**: Direct navigation to service features

### 2. **Quick Actions**

#### Desktop View
- **Horizontal Layout**: Actions arranged horizontally
- **Service Grouping**: Actions grouped by service
- **Detailed Labels**: Full action descriptions

#### Mobile View
- **Grid Layout**: 2-column grid for better mobile layout
- **Compact Buttons**: Full-width buttons for easy access
- **Icon + Label**: Clear visual identification
- **Touch-Friendly**: Minimum 44px touch targets

### 3. **Metrics Dashboard**

#### Key Performance Indicators
- **Total Users**: User count with trend indicator
- **Total Revenue**: Revenue with currency formatting
- **Total Orders**: Order count with trend
- **Active Shipments**: Shipment tracking

#### Progress Metrics
- **System Health**: Ring progress indicator
- **Data Usage**: Storage usage visualization

### 4. **Recent Activity**

#### Activity Timeline
- **Service Filtering**: Only shows activities for accessible services
- **Status Indicators**: Success, warning, error states
- **User Attribution**: Shows who performed the action
- **Time Stamps**: Relative time (e.g., "5m ago")

## 🔧 Testing Different Tenant Configurations

### 1. **Access Tenant Demo**

Navigate to the tenant demo page:
```
http://localhost:3000/tenant-demo
```

### 2. **Available Tenant Types**

#### **Demo Tenant** (Basic)
- Services: User Management, Notifications
- Features: Basic user operations
- Use Case: Small businesses, testing

#### **CRM Tenant** (Sales Focused)
- Services: User Management, CRM, Notifications
- Features: Lead management, contact tracking
- Use Case: Sales teams, customer management

#### **Finance Tenant** (Accounting)
- Services: User Management, Finance, Notifications
- Features: Invoicing, payments, reporting
- Use Case: Accounting departments, financial management

#### **Inventory Tenant** (Retail)
- Services: User Management, Inventory, POS, Notifications
- Features: Stock management, sales processing
- Use Case: Retail stores, inventory management

#### **HR Tenant** (Human Resources)
- Services: User Management, HR, Notifications
- Features: Employee management, payroll
- Use Case: HR departments, employee management

#### **Logistics Tenant** (Shipping)
- Services: User Management, Logistics, Notifications
- Features: Shipment tracking, carrier management
- Use Case: Shipping companies, logistics

#### **Premium Tenant** (Full Access)
- Services: All services enabled
- Features: Complete feature set
- Use Case: Enterprise customers, full platform access

### 3. **Switching Tenants**

1. **Select Tenant**: Choose from the dropdown or click on tenant cards
2. **Auto-Reload**: Page automatically reloads with new tenant context
3. **Dynamic Updates**: Dashboard adapts to new tenant entitlements
4. **Permission Check**: Only shows accessible services and features

## 🎨 UI Components & Interactions

### 1. **Navigation Interactions**

#### **Desktop Navigation**
```typescript
// Click on service to expand/collapse
<NavLink 
  label="CRM"
  onClick={() => toggleService('crm-service')}
  rightSection={<IconChevronRight />}
/>

// Click on feature to navigate
<NavLink 
  label="Leads"
  onClick={() => navigate('/crm/leads')}
/>
```

#### **Mobile Navigation**
```typescript
// Burger menu toggle
<Burger 
  opened={navOpened} 
  onClick={() => setNavOpened(!navOpened)} 
/>

// Auto-close on navigation
const handleNavigation = (href: string) => {
  window.location.href = href;
  if (isMobile) {
    setNavOpened(false);
  }
};
```

### 2. **Responsive Design**

#### **Breakpoint System**
```typescript
// Desktop components
<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
  <DesktopComponent />
</MediaQuery>

// Mobile components
<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
  <MobileComponent />
</MediaQuery>
```

#### **Touch-Friendly Design**
- **Minimum Touch Target**: 44px × 44px
- **Adequate Spacing**: 8px minimum between interactive elements
- **Visual Feedback**: Clear hover and active states
- **Gesture Support**: Ready for swipe gestures

### 3. **Permission-Based Rendering**

#### **Service Access**
```typescript
// Check if user has access to service
const accessibleServices = enabledServices.filter(service => {
  return service.config.modules.some(module => 
    user.permissions.some(permission => 
      permission.startsWith(`${service.name}:${module.name}:`)
    )
  );
});
```

#### **Feature Access**
```typescript
// Check if user has permission for specific action
const hasPermission = (service: string, module: string, action: string) => {
  const permissionKey = `${service}:${module}:${action}`;
  return user.permissions.includes(permissionKey);
};
```

## 🔍 Troubleshooting

### Common Issues

#### **1. Navigation Not Working**
- **Check Permissions**: Ensure user has required permissions
- **Verify Tenant**: Confirm tenant has service enabled
- **Clear Cache**: Clear browser cache and localStorage
- **Check Console**: Look for JavaScript errors

#### **2. Mobile Menu Issues**
- **Touch Targets**: Ensure buttons are large enough
- **Z-Index**: Check for overlapping elements
- **Swipe Gestures**: Verify touch event handling
- **Performance**: Check for rendering issues

#### **3. Dashboard Not Loading**
- **API Connection**: Verify backend services are running
- **Tenant Context**: Check tenant identification
- **User Authentication**: Ensure user is properly authenticated
- **Network Issues**: Check for connectivity problems

### Debug Mode

Enable debug mode for detailed logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

### Performance Optimization

#### **Lazy Loading**
```typescript
// Lazy load service-specific components
const ServiceWidget = React.lazy(() => import('./ServiceWidget'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ServiceWidget />
</Suspense>
```

#### **Caching Strategy**
```typescript
// Cache tenant entitlements
const cachedEntitlements = localStorage.getItem('tenantEntitlements');
if (cachedEntitlements) {
  setEntitlements(JSON.parse(cachedEntitlements));
}
```

## 🚀 Next Steps

### 1. **API Integration**
- Replace mock services with real API calls
- Implement proper authentication
- Add error handling and retry logic

### 2. **Advanced Features**
- Add search functionality
- Implement notifications system
- Add data export capabilities
- Create custom dashboards

### 3. **Performance Optimization**
- Implement code splitting
- Add service worker for offline support
- Optimize bundle size
- Add performance monitoring

### 4. **Testing**
- Add unit tests for components
- Implement integration tests
- Add end-to-end testing
- Performance testing

## 📚 Additional Resources

- **Mantine Documentation**: https://mantine.dev/
- **React Best Practices**: https://react.dev/
- **TypeScript Guide**: https://www.typescriptlang.org/docs/
- **Mobile UX Guidelines**: https://material.io/design/usability/accessibility.html

---

**Happy coding! 🎉**

The EasyCode Platform is now ready to provide a seamless, mobile-ready experience across all devices while maintaining the powerful accordion navigation system you requested. 