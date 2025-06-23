# CSS Setup Guide for EasyCode Platform

## Overview

This guide explains the CSS architecture and styling approach implemented in the EasyCode platform. We've established a unified design system that combines CSS custom properties, Mantine UI components, and utility classes.

## Architecture

### 1. CSS Custom Properties (Design Tokens)
Located in `apps/main-ui/styles/globals.css`, these provide consistent design tokens:

```css
:root {
  /* Colors */
  --primary-color: #2196F3;
  --success-color: #4CAF50;
  --warning-color: #FFC107;
  --error-color: #F44336;
  
  /* Spacing */
  --space-1: 0.25rem;   /* 4px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  
  /* Typography */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  
  /* Border Radius */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 2. Component Utility Classes
Located in `apps/main-ui/styles/components.css`, these provide reusable component styles:

```css
.card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}
```

### 3. Mantine UI Components
We use Mantine for consistent, accessible UI components:

```tsx
import { Button, Card, Text, Group } from '@mantine/core';

<Card shadow="md" padding="lg">
  <Text size="lg" weight={500}>Title</Text>
  <Group>
    <Button variant="filled" color="blue">Primary</Button>
    <Button variant="outline">Secondary</Button>
  </Group>
</Card>
```

## File Structure

```
apps/main-ui/
├── styles/
│   ├── globals.css          # Design tokens and base styles
│   └── components.css       # Component utility classes
├── pages/
│   ├── _app.tsx            # Global CSS imports and providers
│   └── index.tsx           # Example usage
└── src/
    └── components/
        └── ExampleComponent.tsx  # Demo component
```

## Usage Guidelines

### 1. For New Components

**Preferred Approach: Mantine Components**
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

**Alternative: CSS Utility Classes**
```tsx
function MyComponent() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Component Title</h2>
      </div>
      <div className="card-content">
        <div className="flex gap-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
        </div>
      </div>
    </div>
  );
}
```

### 2. For Layout and Spacing

**Use CSS Custom Properties:**
```tsx
<div style={{ 
  padding: 'var(--space-6)', 
  marginBottom: 'var(--space-4)' 
}}>
  Content
</div>
```

**Use Utility Classes:**
```tsx
<div className="p-6 mb-4">
  Content
</div>
```

### 3. For Colors

**Use CSS Custom Properties:**
```tsx
<div style={{ 
  backgroundColor: 'var(--primary-color)',
  color: 'var(--white)' 
}}>
  Colored content
</div>
```

**Use Utility Classes:**
```tsx
<div className="bg-primary text-white">
  Colored content
</div>
```

## Migration from Inline Styles

### Before (Inline Styles)
```tsx
const style = {
  backgroundColor: '#f5f5f5',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px'
};

<div style={style}>Content</div>
```

### After (CSS Custom Properties)
```tsx
const style = {
  backgroundColor: 'var(--gray-100)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  marginBottom: 'var(--space-5)'
};

<div style={style}>Content</div>
```

### Even Better (CSS Classes)
```tsx
<div className="card mb-5">
  Content
</div>
```

## Available Utility Classes

### Layout
- `.container`, `.container-sm`, `.container-md`, `.container-lg`, `.container-xl`
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`
- `.flex`, `.flex-col`, `.flex-row`
- `.items-center`, `.items-start`, `.items-end`
- `.justify-center`, `.justify-between`, `.justify-start`, `.justify-end`

### Spacing
- `.m-0`, `.m-1`, `.m-2`, `.m-3`, `.m-4`, `.m-6`, `.m-8`
- `.mt-0`, `.mt-1`, `.mt-2`, `.mt-3`, `.mt-4`, `.mt-6`, `.mt-8`
- `.mb-0`, `.mb-1`, `.mb-2`, `.mb-3`, `.mb-4`, `.mb-6`, `.mb-8`
- `.p-0`, `.p-1`, `.p-2`, `.p-3`, `.p-4`, `.p-6`, `.p-8`
- `.gap-1`, `.gap-2`, `.gap-3`, `.gap-4`, `.gap-6`

### Typography
- `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`
- `.text-center`, `.text-left`, `.text-right`
- `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`
- `.text-gray-500`, `.text-gray-600`, `.text-gray-700`, `.text-gray-900`

### Components
- `.card`, `.card-header`, `.card-title`, `.card-content`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- `.btn-sm`, `.btn-lg`
- `.form-group`, `.form-label`, `.form-input`, `.form-error`, `.form-help`
- `.table-container`, `.table`
- `.badge`, `.badge-primary`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`
- `.alert`, `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-error`

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
      Content
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

### 3. Performance
- Use CSS custom properties for dynamic theming
- Minimize CSS bundle size
- Use CSS modules for component-specific styles
- Avoid inline styles for static values

### 4. Accessibility
- Use semantic HTML elements
- Ensure proper color contrast
- Include proper ARIA labels
- Test with screen readers

### 5. Maintainability
- Follow consistent naming conventions
- Document complex components
- Use TypeScript for type safety
- Keep styles close to components

## Troubleshooting

### CSS Not Loading
1. Check that `globals.css` is imported in `_app.tsx`
2. Verify the CSS file paths are correct
3. Ensure the Mantine provider is properly configured

### Styles Not Applying
1. Check CSS specificity
2. Verify class names are correct
3. Ensure CSS custom properties are defined
4. Check for conflicting styles

### Mantine Components Not Styled
1. Verify Mantine provider is wrapping the app
2. Check Mantine theme configuration
3. Ensure proper imports from `@mantine/core`

## Resources

- [Mantine Documentation](https://mantine.dev/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design System Best Practices](https://www.designsystems.com/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) 