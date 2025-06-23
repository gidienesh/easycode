# EasyCode Design System Guide

## Overview

This guide outlines the design system and styling approach for the EasyCode platform. We use a combination of CSS custom properties, Mantine UI components, and consistent design tokens to ensure a cohesive user experience.

## Design Tokens

### Colors

Use CSS custom properties for consistent color usage:

```css
/* Primary Colors */
--primary-color: #2196F3;
--primary-light: #64B5F6;
--primary-dark: #1976D2;

/* Semantic Colors */
--success-color: #4CAF50;
--warning-color: #FFC107;
--error-color: #F44336;
--info-color: #2196F3;

/* Neutral Colors */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;
```

### Typography

```css
/* Font Families */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Full circle */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## Styling Approaches

### 1. CSS Custom Properties (Recommended)

Use CSS custom properties for consistent styling:

```css
.my-component {
  background-color: var(--gray-50);
  color: var(--gray-900);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### 2. Mantine Components (Preferred for UI Elements)

Use Mantine components for consistent UI elements:

```tsx
import { Button, Card, Text, Group } from '@mantine/core';

function MyComponent() {
  return (
    <Card shadow="md" padding="lg">
      <Text size="lg" weight={500} mb="md">
        Component Title
      </Text>
      <Group>
        <Button variant="filled" color="blue">
          Primary Action
        </Button>
        <Button variant="outline">
          Secondary Action
        </Button>
      </Group>
    </Card>
  );
}
```

### 3. CSS Modules (For Complex Components)

For complex components, use CSS modules:

```tsx
// MyComponent.module.css
.container {
  background-color: var(--gray-50);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.title {
  color: var(--gray-900);
  font-size: var(--text-xl);
  margin-bottom: var(--space-4);
}

// MyComponent.tsx
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );
}
```

### 4. Inline Styles (Avoid)

Avoid inline styles except for dynamic values:

```tsx
// ❌ Avoid this
<div style={{ backgroundColor: '#f5f5f5', padding: '16px' }}>

// ✅ Use CSS custom properties
<div style={{ backgroundColor: 'var(--gray-100)', padding: 'var(--space-4)' }}>

// ✅ Better: Use CSS classes
<div className="card-container">
```

## Component Guidelines

### Buttons

```tsx
import { Button } from '@mantine/core';

// Primary button
<Button variant="filled" color="blue" size="md">
  Primary Action
</Button>

// Secondary button
<Button variant="outline" size="md">
  Secondary Action
</Button>

// Danger button
<Button variant="filled" color="red" size="md">
  Delete
</Button>
```

### Cards

```tsx
import { Card, Text, Group } from '@mantine/core';

<Card shadow="md" padding="lg" radius="md">
  <Text size="lg" weight={500} mb="md">
    Card Title
  </Text>
  <Text size="sm" color="dimmed">
    Card content goes here
  </Text>
</Card>
```

### Tables

```tsx
import { Table } from '@mantine/core';

<Table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
    </tr>
  </tbody>
</Table>
```

### Forms

```tsx
import { TextInput, Select, Textarea, Button, Group } from '@mantine/core';

<TextInput
  label="Name"
  placeholder="Enter your name"
  required
  mb="md"
/>

<Select
  label="Role"
  placeholder="Select a role"
  data={['Admin', 'User', 'Manager']}
  mb="md"
/>

<Textarea
  label="Description"
  placeholder="Enter description"
  mb="md"
/>

<Group>
  <Button type="submit" variant="filled">
    Save
  </Button>
  <Button variant="outline">
    Cancel
  </Button>
</Group>
```

## Layout Guidelines

### Page Structure

```tsx
import { Container, Title, Paper } from '@mantine/core';

function PageLayout() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Page Title
      </Title>
      
      <Paper shadow="sm" p="md">
        {/* Page content */}
      </Paper>
    </Container>
  );
}
```

### Sidebar Layout

```tsx
import { AppShell, Navbar, Header, Text } from '@mantine/core';

function AppLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Header height={60} p="xs">
          <Text>EasyCode Platform</Text>
        </Header>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar width={{ base: 300 }} p="xs">
          {/* Navigation content */}
        </Navbar>
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Main content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

### Responsive Utilities

```tsx
import { useMediaQuery } from '@mantine/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div style={{ 
      padding: isMobile ? 'var(--space-2)' : 'var(--space-6)' 
    }}>
      {/* Content */}
    </div>
  );
}
```

## Best Practices

### 1. Use Design Tokens
- Always use CSS custom properties for colors, spacing, typography
- Maintain consistency across components
- Easy to update globally

### 2. Component Composition
- Build reusable components using Mantine primitives
- Keep components focused and single-purpose
- Use composition over inheritance

### 3. Accessibility
- Use semantic HTML elements
- Ensure proper color contrast
- Include proper ARIA labels
- Test with screen readers

### 4. Performance
- Use CSS custom properties for dynamic theming
- Minimize CSS bundle size
- Use CSS modules for component-specific styles
- Avoid inline styles for static values

### 5. Maintainability
- Follow consistent naming conventions
- Document complex components
- Use TypeScript for type safety
- Keep styles close to components

## Migration Guide

### From Inline Styles

```tsx
// Before
const style = {
  backgroundColor: '#f5f5f5',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

// After
const style = {
  backgroundColor: 'var(--gray-100)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)'
};

// Even Better: Use CSS classes
<div className="card-container">
```

### From Custom CSS

```css
/* Before */
.my-button {
  background-color: #2196F3;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* After */
.my-button {
  background-color: var(--primary-color);
  color: var(--white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}
```

## Resources

- [Mantine Documentation](https://mantine.dev/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design System Best Practices](https://www.designsystems.com/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) 