# Mantine v8 Migration and Usage Guide

## Overview

This guide ensures consistent and correct usage of Mantine v8 components across the EasyCode platform. Mantine v8 introduced significant changes from v7, including new component structure and prop changes.

## Key Changes in Mantine v8

### 1. AppShell Structure

**v7 (Deprecated):**
```tsx
import { AppShell, Navbar, Header } from '@mantine/core';

<AppShell
  navbar={<Navbar width={{ base: 300 }} p="md">...</Navbar>}
  header={<Header height={60} p="md">...</Header>}
>
  {/* content */}
</AppShell>
```

**v8 (Current):**
```tsx
import { AppShell } from '@mantine/core';

<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm' }}
  padding="md"
>
  <AppShell.Header p="md">
    {/* Header content */}
  </AppShell.Header>
  
  <AppShell.Navbar p="md">
    {/* Navbar content */}
  </AppShell.Navbar>
  
  <AppShell.Main>
    {/* Main content */}
  </AppShell.Main>
</AppShell>
```

### 2. Component Props Changes

#### Button Component
**v7:**
```tsx
<Button variant="filled" color="blue" size="md">
  Click me
</Button>
```

**v8:**
```tsx
<Button variant="filled" color="blue" size="md">
  Click me
</Button>
```
*No changes for Button component*

#### Card Component
**v7:**
```tsx
<Card shadow="sm" padding="lg" radius="md">
  <Card.Section>
    {/* content */}
  </Card.Section>
</Card>
```

**v8:**
```tsx
<Card shadow="sm" p="lg" radius="md">
  <Card.Section>
    {/* content */}
  </Card.Section>
</Card>
```
*`padding` prop renamed to `p`*

#### NavLink Component
**v7:**
```tsx
<NavLink
  label="Dashboard"
  icon={<IconDashboard size="1rem" />}
  active={isActive}
  onClick={handleClick}
/>
```

**v8:**
```tsx
<NavLink
  label="Dashboard"
  leftSection={<IconDashboard size="1rem" />}
  active={isActive}
  onClick={handleClick}
/>
```
*`icon` prop renamed to `leftSection`*

### 3. Theme Configuration

**v7:**
```tsx
const theme = {
  colorScheme: 'light',
  primaryColor: 'blue',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
};
```

**v8:**
```tsx
const theme = {
  primaryColor: 'blue',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
};
```
*`colorScheme` is now handled by CSS variables*

## Best Practices for Mantine v8

### 1. Import Structure

Always import from the main package:
```tsx
// ✅ Correct
import { Button, Card, Text, Group } from '@mantine/core';

// ❌ Avoid
import { Button } from '@mantine/core/Button';
```

### 2. Component Composition

Use the new AppShell structure:
```tsx
import { AppShell } from '@mantine/core';

function Layout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header p="md">
        <HeaderContent />
      </AppShell.Header>
      
      <AppShell.Navbar p="md">
        <NavigationContent />
      </AppShell.Navbar>
      
      <AppShell.Main>
        <PageContent />
      </AppShell.Main>
    </AppShell>
  );
}
```

### 3. Responsive Design

Use CSS variables for breakpoints:
```tsx
// ✅ Use CSS custom properties
const isMobile = useMediaQuery('(max-width: 768px)');

// ✅ Use Mantine's responsive props
<Group gap={{ base: 'xs', sm: 'md', lg: 'lg' }}>
  <Button size={{ base: 'xs', sm: 'sm', lg: 'md' }}>
    Responsive Button
  </Button>
</Group>
```

### 4. Styling Approach

**Preferred: CSS Custom Properties**
```tsx
// ✅ Use design system tokens
<div style={{ 
  backgroundColor: 'var(--gray-50)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)'
}}>
  Content
</div>
```

**Alternative: Mantine Components**
```tsx
// ✅ Use Mantine components for UI elements
<Card shadow="sm" p="lg" radius="md">
  <Text size="lg" fw={500} mb="md">
    Title
  </Text>
  <Group>
    <Button variant="filled">Primary</Button>
    <Button variant="outline">Secondary</Button>
  </Group>
</Card>
```

## Common Migration Issues

### 1. Navbar/Header Components

**Issue:** `Navbar` and `Header` components no longer exist as standalone components.

**Solution:** Use `AppShell.Navbar` and `AppShell.Header`:
```tsx
// ❌ Old way
<Navbar width={{ base: 300 }} p="md">
  {/* content */}
</Navbar>

// ✅ New way
<AppShell.Navbar p="md">
  {/* content */}
</AppShell.Navbar>
```

### 2. Breakpoint Handling

**Issue:** `hiddenBreakpoint` prop removed from AppShell components.

**Solution:** Handle visibility through CSS or state:
```tsx
// ✅ Use hidden prop with state management
<AppShell.Navbar hidden={!isNavbarOpen}>
  {/* content */}
</AppShell.Navbar>
```

### 3. Icon Props

**Issue:** `icon` prop renamed to `leftSection` in NavLink.

**Solution:** Update prop names:
```tsx
// ❌ Old way
<NavLink icon={<IconDashboard />} label="Dashboard" />

// ✅ New way
<NavLink leftSection={<IconDashboard />} label="Dashboard" />
```

## Component Checklist

Before using any Mantine component, verify:

- [ ] Import from `@mantine/core`
- [ ] Use correct prop names (v8 syntax)
- [ ] Follow AppShell structure for layouts
- [ ] Use CSS custom properties for styling
- [ ] Implement responsive design properly
- [ ] Handle accessibility attributes

## Testing Mantine Components

### 1. Visual Testing
```tsx
// Test component rendering
import { render, screen } from '@testing-library/react';
import { Button } from '@mantine/core';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 2. Theme Testing
```tsx
// Test theme integration
import { MantineProvider } from '@mantine/core';

test('Component uses theme', () => {
  render(
    <MantineProvider theme={customTheme}>
      <Button>Test</Button>
    </MantineProvider>
  );
  // Assert theme styles are applied
});
```

## Resources

- [Mantine v8 Documentation](https://mantine.dev/)
- [Migration Guide](https://mantine.dev/migration/7/)
- [Component API Reference](https://mantine.dev/core/button/)
- [Theme Configuration](https://mantine.dev/theming/theme-object/)

## Troubleshooting

### Common Errors

1. **"Cannot find name 'Navbar'"**
   - Solution: Use `AppShell.Navbar` instead

2. **"Property 'hiddenBreakpoint' does not exist"**
   - Solution: Remove `hiddenBreakpoint` prop, use `hidden` prop instead

3. **"Operator '<' cannot be applied to types 'number' and 'string'"**
   - Solution: Use fixed breakpoint values or CSS custom properties

4. **"Property 'icon' does not exist"**
   - Solution: Use `leftSection` prop for NavLink components

### Getting Help

1. Check the [Mantine v8 documentation](https://mantine.dev/)
2. Review the [migration guide](https://mantine.dev/migration/7/)
3. Search existing issues in the project
4. Create a new issue with component name and error details 