# Main UI - Shared Component Library (@easycode/main-ui)

## 1. Purpose and Overview

This directory serves as the central repository for shared UI components for the EasyCode platform. Its primary purpose is to provide a consistent, high-quality, and reusable set of UI elements that can be utilized across various frontend applications within the ecosystem.

It is built with Next.js (though primarily exports components, it can also serve as a reference application or host storybooks), TypeScript, and the Mantine UI component library, ensuring a modern and robust foundation for user interfaces.

## 2. Tech Stack

This shared UI library is built with Next.js, TypeScript, and the Mantine UI component library. It leverages Turborepo for monorepo management and is designed to provide a consistent look and feel across all frontend applications in the ecosystem.

## 3. Key Features & Goals

1.  **UI Consistency**:
    *   Provide a unified look, feel, and user experience across all EasyCode applications by offering a single source of truth for common UI patterns and styles.
2.  **Reusability**:
    *   Offer a comprehensive set of common components (e.g., buttons, forms, input fields, layout elements, modals, navigation bars) to avoid duplication of effort and ensure consistency.
3.  **Accelerated Development**:
    *   Speed up frontend development cycles by providing developers with ready-to-use, well-tested, and documented building blocks.
4.  **Accessibility & Theming**:
    *   Strive for adherence to web accessibility standards (WCAG) to ensure applications are usable by as many people as possible.
    *   (Future) Support for tenant-specific theming, potentially integrating with `tenant-service` to fetch theming configurations (e.g., primary colors, logo) to customize the appearance for different client organizations.
5.  **Maintainability**:
    *   Centralizing shared components simplifies updates, bug fixes, and style revisions, ensuring changes are propagated efficiently across all consuming applications.

## 4. How to Consume Components

Components from this library are designed to be easily consumed by other frontend applications within this Turborepo monorepo setup (e.g., the frontend for `services/finance-service/`, or other applications in the `apps/` directory).

-   **Direct Imports**: Components are exported as standard ES modules and can be imported directly into other Next.js applications or TypeScript projects.
    ```typescript
    // Example: In another app (e.g., apps/another-app/pages/somepage.tsx)
    import { Button, Card } from '@easycode/main-ui'; // Assuming @easycode/main-ui is the package name

    const MyPage = () => (
      <Card shadow="sm" padding="lg">
        <Button>Click Me</Button>
      </Card>
    );
    ```
-   **Styling**: Mantine UI's styling system (CSS-in-JS or global styles) should be configured in the consuming application, often by wrapping the application in MantineProvider. This library's components will then adopt the theme and styles defined by the consuming application's Mantine setup.
-   **Build/Packaging**: Within the Turborepo setup, dependencies are managed such that changes in this shared library can be efficiently reflected in consuming applications during development and build processes. No separate packaging or publishing is typically required for local monorepo consumption.

## 5. Contribution Guidelines (Overview)

Developers looking to contribute new shared components or modify existing ones should:
1.  **Follow Standard Development Practices**: Adhere to the established coding standards, naming conventions, and project structure.
2.  **Component Design**: Ensure components are generic, reusable, and configurable through props.
3.  **Documentation**: Provide clear Storybook stories (or equivalent documentation) for each component, detailing its props, usage examples, and any variations.
4.  **Testing**: Write unit tests and/or visual regression tests for components to ensure reliability and prevent regressions.
5.  **Pull Requests**: Submit changes via pull requests for review and approval by the lead frontend developers or architecture team.

## 6. Integration with Services & Applications

This shared UI library plays a crucial role in the frontend architecture of the EasyCode platform:
-   **Component Source**: It provides the building blocks for the user interfaces of various frontend applications. These applications might include:
    -   Dedicated frontends for specific services (e.g., the Next.js frontend for `finance-service`).
    -   Broader applications that aggregate functionality from multiple services.
    -   Administrative interfaces for managing different aspects of the platform.
-   **Data Interaction**: While this library primarily focuses on UI presentation, the components it provides (e.g., forms, data tables, dashboards) are designed to be populated with data. The consuming applications are responsible for fetching this data from the relevant backend microservices (e.g., `crm-service`, `inventory-service`, `user-service`) via their exposed APIs and passing it to the shared UI components as props.
-   **Consistency**: By using these shared components, all frontend touchpoints in the EasyCode ecosystem can maintain a consistent visual identity and user experience.

# EasyCode Platform - Dynamic Dashboard

A comprehensive multi-tenant dashboard that dynamically adapts based on tenant entitlements and user permissions.

## Features

### 🏢 Multi-Tenant Architecture
- **Tenant Context Management**: Automatic tenant identification from subdomain, path, or query parameters
- **Service Entitlements**: Dynamic service enablement based on tenant configuration
- **User Permissions**: Granular permission system with service-module-action hierarchy
- **Feature Flags**: Tenant-specific feature toggles and capabilities

### 📊 Dynamic Dashboard Components
- **Service Overview Cards**: Real-time statistics for each enabled service
- **Quick Actions**: Context-aware action buttons based on user permissions
- **Metrics Dashboard**: Key performance indicators across all accessible services
- **Recent Activity**: Timeline of activities filtered by accessible services
- **Service-Specific Widgets**: Custom widgets for each service type

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Mantine Components**: Built with Mantine UI library for consistency
- **Real-time Updates**: Live data updates and loading states
- **Error Handling**: Graceful error states and user feedback

## Architecture

### Providers
- **TenantProvider**: Manages tenant context, entitlements, and service configurations
- **UserProvider**: Handles user authentication, permissions, and role management

### Components
- **DynamicDashboard**: Main dashboard component that orchestrates all widgets
- **TenantNavigation**: Context-aware navigation based on enabled services
- **ServiceOverviewCard**: Displays service statistics and module access
- **QuickActionsCard**: Provides quick access to common actions
- **MetricsCard**: Shows key performance indicators
- **RecentActivityCard**: Displays recent activities and notifications
- **DashboardWidget**: Service-specific detailed widgets

## Getting Started

### Prerequisites
- Node.js 16+ 
- pnpm (recommended) or npm
- Mantine UI library
- Tabler Icons

### Installation

1. **Install dependencies**:
```bash
cd apps/main-ui
pnpm install
```

2. **Start the development server**:
```bash
pnpm dev
```

3. **Access the application**:
```
http://localhost:3000
```

### Testing Different Tenant Configurations

Visit `/tenant-demo` to test different tenant configurations:

- **Demo Tenant**: Basic services (User Management, Notifications)
- **CRM Tenant**: CRM-focused with lead management
- **Finance Tenant**: Financial services and accounting
- **Inventory Tenant**: Inventory and POS systems
- **HR Tenant**: Human resources management
- **Logistics Tenant**: Shipping and logistics
- **Premium Tenant**: Full access to all services

## Configuration

### Tenant Configuration

Tenants are configured through the `TenantProvider` with the following structure:

```typescript
interface TenantEntitlements {
  services: {
    [serviceName: string]: {
      enabled: boolean;
      modules: Array<{
        name: string;
        enabled: boolean;
        permissions: string[];
      }>;
      features: string[];
    };
  };
  features: string[];
  limits: Record<string, number>;
}
```

### User Permissions

User permissions follow the format: `service:module:action`

Examples:
- `user-service:user-management:read`
- `crm-service:leads:write`
- `finance-service:invoicing:delete`

### Service Configuration

Each service can have multiple modules and features:

```typescript
{
  'crm-service': {
    enabled: true,
    modules: [
      {
        name: 'leads',
        enabled: true,
        permissions: ['read', 'write', 'delete']
      },
      {
        name: 'contacts',
        enabled: true,
        permissions: ['read', 'write']
      }
    ],
    features: ['lead-scoring', 'email-integration', 'reporting']
  }
}
```

## Customization

### Adding New Services

1. **Update TenantProvider**: Add service configuration to mock entitlements
2. **Create Service Widget**: Add service-specific widget component
3. **Update Navigation**: Add navigation item for the new service
4. **Add Quick Actions**: Include relevant quick actions for the service

### Customizing Widgets

Each service can have its own custom widget by extending the `DashboardWidget` component:

```typescript
const CustomServiceWidget = ({ service, user }) => {
  // Custom implementation for your service
  return (
    <Card>
      {/* Your custom widget content */}
    </Card>
  );
};
```

### Styling

The dashboard uses Mantine's theming system. Customize colors, spacing, and components through the theme configuration.

## API Integration

### Real API Integration

Replace the mock services in `TenantProvider` and `UserProvider` with real API calls:

```typescript
// In TenantProvider
const loadTenantData = async (id: string) => {
  const [tenantData, entitlementsData] = await Promise.all([
    fetch(`/api/tenants/${id}`).then(res => res.json()),
    fetch(`/api/tenants/${id}/entitlements`).then(res => res.json())
  ]);
  
  setTenant(tenantData);
  setEntitlements(entitlementsData);
};
```

### API Headers

All API calls should include tenant context:

```typescript
headers: {
  'Content-Type': 'application/json',
  'X-Tenant-ID': tenantId,
  'Authorization': `Bearer ${authToken}`,
}
```

## Security Considerations

### Permission Validation
- Always validate permissions on both frontend and backend
- Use role-based access control (RBAC) for fine-grained permissions
- Implement proper authentication and authorization middleware

### Tenant Isolation
- Ensure proper tenant data isolation in API calls
- Validate tenant context in all requests
- Implement proper session management

### Data Protection
- Sanitize all user inputs
- Implement proper CORS policies
- Use HTTPS in production

## Performance Optimization

### Lazy Loading
- Implement lazy loading for service-specific components
- Use React.lazy() for code splitting
- Load data on-demand based on user permissions

### Caching
- Cache tenant entitlements and user permissions
- Implement proper cache invalidation strategies
- Use React Query or SWR for data fetching

### Bundle Optimization
- Tree-shake unused components
- Optimize bundle size with dynamic imports
- Use proper code splitting strategies

## Troubleshooting

### Common Issues

1. **Tenant not loading**: Check localStorage and URL parameters
2. **Permissions not working**: Verify permission format and user roles
3. **Services not showing**: Ensure tenant entitlements are properly configured
4. **Navigation issues**: Check service enablement in tenant configuration

### Debug Mode

Enable debug mode by setting `localStorage.setItem('debug', 'true')` to see detailed logs.

## Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types for all new components
3. Include unit tests for new functionality
4. Update documentation for any new features
5. Follow the design system guidelines

## License

This project is part of the EasyCode Platform and follows the same licensing terms.
