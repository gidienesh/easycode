# EasyCode UI Library - Tenant Theming System

This package provides a centralized theming system for the EasyCode monorepo that supports per-tenant customization using Mantine components.

## Features

- **Multi-tenant theming**: Each tenant can have their own color scheme, fonts, and styling
- **Dynamic theme switching**: Change themes at runtime without page refresh
- **Consistent design system**: All Mantine components automatically use tenant themes
- **Type-safe**: Full TypeScript support for theme configurations
- **Monorepo-wide**: Can be used in any service or app in the monorepo

## Quick Start

### 1. Wrap your app with TenantThemeProvider

```tsx
import { TenantThemeProvider } from '@easycode/ui-library';

function App() {
  return (
    <TenantThemeProvider initialTenantId="default">
      <YourAppContent />
    </TenantThemeProvider>
  );
}
```

### 2. Use the theme in any component

```tsx
import { useTenantTheme } from '@easycode/ui-library';
import { Button, Badge } from '@mantine/core';

function MyComponent() {
  const { currentTheme, setTenantId } = useTenantTheme();
  
  return (
    <div>
      <Badge color={currentTheme.primaryColor}>
        Current Theme: {currentTheme.name}
      </Badge>
      <Button onClick={() => setTenantId('tenant-1')}>
        Switch to TechCorp Theme
      </Button>
    </div>
  );
}
```

## Available Themes

### Predefined Themes

- **default**: Default blue theme
- **tenant-1**: TechCorp blue theme
- **tenant-2**: GreenCorp green theme  
- **tenant-3**: DarkCorp dark theme

### Creating Custom Themes

```tsx
import { createTenantTheme } from '@easycode/ui-library';

const customTheme = createTenantTheme(
  'my-tenant',
  'My Company Theme',
  '#FF6B6B', // primary color
  'light'    // color scheme
);
```

## Theme Configuration

Each tenant theme includes:

```tsx
interface TenantTheme {
  id: string;
  name: string;
  primaryColor: string;
  colorScheme: 'light' | 'dark';
  customColors?: Record<string, string[]>;
  fontFamily?: string;
  borderRadius?: number;
  spacing?: Record<string, number>;
}
```

## Usage in Different Services

### In Tenant Service

```tsx
// services/tenant-service/src/ui/components/TenantBrandingForm.tsx
import { useTenantTheme } from '@easycode/ui-library';

export function TenantBrandingForm({ tenantId }: { tenantId: string }) {
  const { currentTheme, setTenantId } = useTenantTheme();
  
  const handleThemeChange = (newTheme: TenantTheme) => {
    setTenantId(newTheme.id);
    // Save to backend
    updateTenantTheme(tenantId, newTheme);
  };
  
  return (
    <ColorInput
      label="Primary Color"
      value={currentTheme.primaryColor}
      onChange={(color) => handleThemeChange({ ...currentTheme, primaryColor: color })}
    />
  );
}
```

### In Finance Service

```tsx
// services/finance-service/src/components/Dashboard.tsx
import { useTenantTheme } from '@easycode/ui-library';

export function FinanceDashboard() {
  const { currentTheme } = useTenantTheme();
  
  return (
    <Card style={{ borderColor: currentTheme.customColors?.brand?.[5] }}>
      <Title>Financial Dashboard</Title>
      {/* All Mantine components automatically use tenant theme */}
    </Card>
  );
}
```

### In Main UI App

```tsx
// apps/main-ui/src/pages/dashboard.tsx
import { TenantThemeProvider, useTenantTheme } from '@easycode/ui-library';

function DashboardContent() {
  const { currentTheme } = useTenantTheme();
  
  return (
    <div style={{ fontFamily: currentTheme.fontFamily }}>
      <h1>Welcome to {currentTheme.name}</h1>
      {/* Your dashboard content */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <TenantThemeProvider initialTenantId="tenant-1">
      <DashboardContent />
    </TenantThemeProvider>
  );
}
```

## Integration with Backend

### Saving Theme to Database

```tsx
// In your tenant service
interface Tenant {
  id: string;
  name: string;
  theme: TenantTheme;
  // ... other fields
}

// API endpoint to update tenant theme
async function updateTenantTheme(tenantId: string, theme: TenantTheme) {
  await fetch(`/api/tenants/${tenantId}/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(theme),
  });
}
```

### Loading Theme from Database

```tsx
// Load tenant theme on app initialization
async function loadTenantTheme(tenantId: string) {
  const response = await fetch(`/api/tenants/${tenantId}/theme`);
  const theme = await response.json();
  
  // Update the theme provider
  setTenantId(theme.id);
}
```

## Best Practices

1. **Always wrap your app** with `TenantThemeProvider` at the root level
2. **Use the `useTenantTheme` hook** to access current theme and change themes
3. **Store themes in your backend** and load them on app initialization
4. **Use Mantine components** for consistent theming across all services
5. **Test themes** in both light and dark modes
6. **Keep custom colors accessible** by ensuring proper contrast ratios

## Troubleshooting

### Theme not updating
- Ensure `TenantThemeProvider` wraps your component tree
- Check that `setTenantId` is being called with a valid tenant ID
- Verify the theme exists in `tenantThemes` or is properly loaded

### TypeScript errors
- Make sure `@easycode/ui-library` is installed in your service/app
- Check that Mantine is installed as a peer dependency
- Ensure proper TypeScript configuration for monorepo imports

### Styling issues
- Use Mantine's built-in theme variables instead of hardcoded values
- Leverage `currentTheme.customColors` for brand-specific styling
- Test themes across different screen sizes and color schemes 