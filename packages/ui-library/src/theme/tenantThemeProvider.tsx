import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { MantineThemeOverride } from '@mantine/core';

// Tenant theme configuration interface
export interface TenantTheme {
  id: string;
  name: string;
  primaryColor: string;
  colorScheme: 'light' | 'dark';
  customColors?: Record<string, string[]>;
  fontFamily?: string;
  borderRadius?: number;
  spacing?: Record<string, number>;
}

// Default theme for fallback
export const defaultTenantTheme: TenantTheme = {
  id: 'default',
  name: 'Default Theme',
  primaryColor: 'blue',
  colorScheme: 'light',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  borderRadius: 6,
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
};

// Predefined tenant themes
export const tenantThemes: Record<string, TenantTheme> = {
  default: defaultTenantTheme,
  'tenant-1': {
    ...defaultTenantTheme,
    id: 'tenant-1',
    name: 'TechCorp Theme',
    primaryColor: 'blue',
    customColors: {
      brand: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
    },
  },
  'tenant-2': {
    ...defaultTenantTheme,
    id: 'tenant-2',
    name: 'GreenCorp Theme',
    primaryColor: 'green',
    colorScheme: 'light',
    customColors: {
      brand: ['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'],
    },
  },
  'tenant-3': {
    ...defaultTenantTheme,
    id: 'tenant-3',
    name: 'DarkCorp Theme',
    primaryColor: 'gray',
    colorScheme: 'dark',
    customColors: {
      brand: ['#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA', '#FFFFFF'],
    },
  },
};

// Context for tenant theme
interface TenantThemeContextType {
  currentTenantId: string;
  currentTheme: TenantTheme;
  setTenantId: (tenantId: string) => void;
  mantineTheme: MantineThemeOverride;
}

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(undefined);

// Hook to use tenant theme
export function useTenantTheme() {
  const context = useContext(TenantThemeContext);
  if (!context) {
    throw new Error('useTenantTheme must be used within a TenantThemeProvider');
  }
  return context;
}

// Convert tenant theme to Mantine theme
function createMantineTheme(tenantTheme: TenantTheme): MantineThemeOverride {
  return {
    primaryColor: tenantTheme.primaryColor as any,
    fontFamily: tenantTheme.fontFamily,
    radius: {
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
    colors: {
      brand: (tenantTheme.customColors?.brand || ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1']) as [string, string, string, string, string, string, string, string, string, string],
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
        },
      },
      Card: {
        defaultProps: {
          radius: 'md',
          withBorder: true,
        },
      },
      Input: {
        defaultProps: {
          radius: 'md',
        },
      },
    },
  };
}

// Props for the provider
interface TenantThemeProviderProps {
  children: ReactNode;
  initialTenantId?: string;
  onThemeChange?: (tenantId: string, theme: TenantTheme) => void;
}

// Main provider component
export function TenantThemeProvider({ 
  children, 
  initialTenantId = 'default',
  onThemeChange 
}: TenantThemeProviderProps) {
  const [currentTenantId, setCurrentTenantId] = React.useState(initialTenantId);
  
  const currentTheme = useMemo(() => {
    return tenantThemes[currentTenantId] || defaultTenantTheme;
  }, [currentTenantId]);
  
  const mantineTheme = useMemo(() => {
    return createMantineTheme(currentTheme);
  }, [currentTheme]);
  
  const setTenantId = React.useCallback((tenantId: string) => {
    setCurrentTenantId(tenantId);
    const theme = tenantThemes[tenantId] || defaultTenantTheme;
    onThemeChange?.(tenantId, theme);
  }, [onThemeChange]);
  
  const contextValue = useMemo(() => ({
    currentTenantId,
    currentTheme,
    setTenantId,
    mantineTheme,
  }), [currentTenantId, currentTheme, setTenantId, mantineTheme]);
  
  return (
    <TenantThemeContext.Provider value={contextValue}>
      {children}
    </TenantThemeContext.Provider>
  );
}

// Utility function to generate color shades
export function generateColorShades(baseColor: string): string[] {
  // This is a simplified version - you might want to use a proper color manipulation library
  return [
    baseColor + '0A', // 4%
    baseColor + '1A', // 10%
    baseColor + '26', // 15%
    baseColor + '4D', // 30%
    baseColor + '66', // 40%
    baseColor,        // 50%
    baseColor + '80', // 60%
    baseColor + '99', // 70%
    baseColor + 'B3', // 80%
    baseColor + 'CC', // 90%
  ];
}

// Utility function to create a new tenant theme
export function createTenantTheme(
  id: string, 
  name: string, 
  primaryColor: string, 
  colorScheme: 'light' | 'dark' = 'light'
): TenantTheme {
  return {
    id,
    name,
    primaryColor,
    colorScheme,
    customColors: {
      brand: generateColorShades(primaryColor),
    },
    fontFamily: defaultTenantTheme.fontFamily,
    borderRadius: defaultTenantTheme.borderRadius,
    spacing: defaultTenantTheme.spacing,
  };
} 