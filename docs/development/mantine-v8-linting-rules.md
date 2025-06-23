# Mantine v8 Linting and Type Checking Rules

## Overview

This document provides ESLint rules and TypeScript configurations to ensure correct Mantine v8 usage and catch common migration issues early in development.

## ESLint Rules

### 1. Import Rules

Add these rules to your `.eslintrc.js` or `eslint.config.js`:

```javascript
module.exports = {
  // ... existing config
  rules: {
    // Ensure Mantine components are imported from the main package
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mantine/core/*'],
            message: 'Import Mantine components from @mantine/core instead of individual files'
          }
        ]
      }
    ],
    
    // Prevent usage of deprecated v7 components
    'no-restricted-globals': [
      'error',
      {
        name: 'Navbar',
        message: 'Use AppShell.Navbar instead of standalone Navbar component'
      },
      {
        name: 'Header',
        message: 'Use AppShell.Header instead of standalone Header component'
      }
    ]
  }
};
```

### 2. Custom ESLint Plugin

Create a custom ESLint plugin for Mantine v8 specific rules:

```javascript
// eslint-plugin-mantine-v8.js
module.exports = {
  rules: {
    'no-deprecated-props': {
      create(context) {
        return {
          JSXAttribute(node) {
            const deprecatedProps = {
              'NavLink': ['icon'],
              'Card': ['padding'],
              'AppShell.Navbar': ['hiddenBreakpoint', 'width'],
              'AppShell.Header': ['height']
            };
            
            const componentName = node.parent.name?.name;
            const propName = node.name?.name;
            
            if (deprecatedProps[componentName]?.includes(propName)) {
              context.report({
                node,
                message: `Prop '${propName}' is deprecated in Mantine v8. Use the correct v8 prop instead.`
              });
            }
          }
        };
      }
    }
  }
};
```

## TypeScript Configuration

### 1. Strict Type Checking

Update your `tsconfig.json` to catch Mantine v8 type issues:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2. Type Definitions

Create custom type definitions for Mantine v8:

```typescript
// types/mantine-v8.d.ts
declare module '@mantine/core' {
  // Ensure AppShell components are properly typed
  interface AppShellProps {
    header?: { height: number };
    navbar?: { width: number; breakpoint: string };
    padding?: string | number;
  }
  
  // Prevent usage of deprecated props
  interface NavLinkProps {
    icon?: never; // Use leftSection instead
    leftSection?: React.ReactNode;
  }
  
  interface CardProps {
    padding?: never; // Use p instead
    p?: string | number;
  }
}
```

## Pre-commit Hooks

### 1. Husky Configuration

Set up pre-commit hooks to catch Mantine v8 issues:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 2. Custom Pre-commit Script

Create a script to check for Mantine v8 violations:

```bash
#!/bin/bash
# scripts/check-mantine-v8.sh

echo "Checking for Mantine v8 violations..."

# Check for deprecated component imports
if grep -r "import.*Navbar.*from.*@mantine/core" src/; then
  echo "❌ Found deprecated Navbar import"
  exit 1
fi

if grep -r "import.*Header.*from.*@mantine/core" src/; then
  echo "❌ Found deprecated Header import"
  exit 1
fi

# Check for deprecated props
if grep -r "hiddenBreakpoint" src/; then
  echo "❌ Found deprecated hiddenBreakpoint prop"
  exit 1
fi

if grep -r "icon.*NavLink" src/; then
  echo "❌ Found deprecated icon prop in NavLink"
  exit 1
fi

echo "✅ No Mantine v8 violations found"
```

## IDE Configuration

### 1. VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### 2. VS Code Extensions

Recommended extensions for Mantine v8 development:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Automated Testing

### 1. Component Testing

Create tests to ensure Mantine v8 components render correctly:

```typescript
// __tests__/mantine-v8.test.tsx
import { render, screen } from '@testing-library/react';
import { AppShell, Button, Card, NavLink } from '@mantine/core';

describe('Mantine v8 Components', () => {
  test('AppShell renders with correct structure', () => {
    render(
      <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }}>
        <AppShell.Header>Header</AppShell.Header>
        <AppShell.Navbar>Navbar</AppShell.Navbar>
        <AppShell.Main>Main</AppShell.Main>
      </AppShell>
    );
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });
  
  test('NavLink uses leftSection prop', () => {
    render(
      <NavLink label="Test" leftSection={<span>Icon</span>} />
    );
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
});
```

### 2. Type Checking Tests

Create tests to ensure TypeScript catches Mantine v8 issues:

```typescript
// __tests__/mantine-v8-types.test.ts
import { AppShell, NavLink, Card } from '@mantine/core';

// These should cause TypeScript errors if v7 syntax is used
describe('Mantine v8 Type Safety', () => {
  test('AppShell.Navbar does not accept hiddenBreakpoint', () => {
    // This should cause a TypeScript error
    // @ts-expect-error
    <AppShell.Navbar hiddenBreakpoint="sm" />;
  });
  
  test('NavLink does not accept icon prop', () => {
    // This should cause a TypeScript error
    // @ts-expect-error
    <NavLink icon={<span>Icon</span>} label="Test" />;
  });
});
```

## Continuous Integration

### 1. GitHub Actions

Add Mantine v8 checks to your CI pipeline:

```yaml
# .github/workflows/mantine-v8-check.yml
name: Mantine v8 Compliance

on: [push, pull_request]

jobs:
  check-mantine-v8:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Run TypeScript check
      run: npx tsc --noEmit
    
    - name: Run Mantine v8 specific checks
      run: ./scripts/check-mantine-v8.sh
    
    - name: Run tests
      run: npm test
```

## Monitoring and Reporting

### 1. Custom Reporter

Create a custom ESLint reporter for Mantine v8 issues:

```javascript
// scripts/mantine-v8-reporter.js
const fs = require('fs');
const path = require('path');

function generateMantineV8Report(results) {
  const mantineIssues = results.flatMap(result => 
    result.messages.filter(message => 
      message.message.includes('Mantine') || 
      message.message.includes('Navbar') ||
      message.message.includes('Header')
    )
  );
  
  if (mantineIssues.length > 0) {
    console.log('🚨 Mantine v8 Issues Found:');
    mantineIssues.forEach(issue => {
      console.log(`  - ${issue.message} (${issue.line}:${issue.column})`);
    });
    
    // Write to file for CI
    fs.writeFileSync(
      path.join(process.cwd(), 'mantine-v8-issues.json'),
      JSON.stringify(mantineIssues, null, 2)
    );
  }
}

module.exports = { generateMantineV8Report };
```

### 2. Dashboard Integration

Track Mantine v8 compliance in your development dashboard:

```typescript
// utils/mantine-v8-metrics.ts
export interface MantineV8Metrics {
  totalComponents: number;
  v8CompliantComponents: number;
  deprecatedPropsUsed: number;
  migrationIssues: string[];
}

export function calculateMantineV8Metrics(): MantineV8Metrics {
  // Implementation to scan codebase and calculate metrics
  return {
    totalComponents: 0,
    v8CompliantComponents: 0,
    deprecatedPropsUsed: 0,
    migrationIssues: []
  };
}
```

## Best Practices Summary

1. **Use ESLint rules** to catch deprecated imports and props
2. **Configure TypeScript strictly** to catch type issues
3. **Set up pre-commit hooks** to prevent violations from being committed
4. **Create automated tests** to ensure components render correctly
5. **Monitor compliance** through CI/CD and reporting
6. **Document violations** and migration progress
7. **Train team members** on Mantine v8 best practices

## Resources

- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Husky Pre-commit Hooks](https://typicode.github.io/husky/)
- [GitHub Actions](https://docs.github.com/en/actions) 