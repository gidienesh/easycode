"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantThemes = exports.defaultTenantTheme = void 0;
exports.useTenantTheme = useTenantTheme;
exports.TenantThemeProvider = TenantThemeProvider;
exports.generateColorShades = generateColorShades;
exports.createTenantTheme = createTenantTheme;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
// Default theme for fallback
exports.defaultTenantTheme = {
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
exports.tenantThemes = {
    default: exports.defaultTenantTheme,
    'tenant-1': {
        ...exports.defaultTenantTheme,
        id: 'tenant-1',
        name: 'TechCorp Theme',
        primaryColor: 'blue',
        customColors: {
            brand: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
        },
    },
    'tenant-2': {
        ...exports.defaultTenantTheme,
        id: 'tenant-2',
        name: 'GreenCorp Theme',
        primaryColor: 'green',
        colorScheme: 'light',
        customColors: {
            brand: ['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'],
        },
    },
    'tenant-3': {
        ...exports.defaultTenantTheme,
        id: 'tenant-3',
        name: 'DarkCorp Theme',
        primaryColor: 'gray',
        colorScheme: 'dark',
        customColors: {
            brand: ['#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA', '#FFFFFF'],
        },
    },
};
const TenantThemeContext = (0, react_1.createContext)(undefined);
// Hook to use tenant theme
function useTenantTheme() {
    const context = (0, react_1.useContext)(TenantThemeContext);
    if (!context) {
        throw new Error('useTenantTheme must be used within a TenantThemeProvider');
    }
    return context;
}
// Convert tenant theme to Mantine theme
function createMantineTheme(tenantTheme) {
    return {
        primaryColor: tenantTheme.primaryColor,
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
            brand: (tenantTheme.customColors?.brand || ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1']),
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
// Main provider component
function TenantThemeProvider({ children, initialTenantId = 'default', onThemeChange }) {
    const [currentTenantId, setCurrentTenantId] = react_1.default.useState(initialTenantId);
    const currentTheme = (0, react_1.useMemo)(() => {
        return exports.tenantThemes[currentTenantId] || exports.defaultTenantTheme;
    }, [currentTenantId]);
    const mantineTheme = (0, react_1.useMemo)(() => {
        return createMantineTheme(currentTheme);
    }, [currentTheme]);
    const setTenantId = react_1.default.useCallback((tenantId) => {
        setCurrentTenantId(tenantId);
        const theme = exports.tenantThemes[tenantId] || exports.defaultTenantTheme;
        onThemeChange?.(tenantId, theme);
    }, [onThemeChange]);
    const contextValue = (0, react_1.useMemo)(() => ({
        currentTenantId,
        currentTheme,
        setTenantId,
        mantineTheme,
    }), [currentTenantId, currentTheme, setTenantId, mantineTheme]);
    return ((0, jsx_runtime_1.jsx)(TenantThemeContext.Provider, { value: contextValue, children: children }));
}
// Utility function to generate color shades
function generateColorShades(baseColor) {
    // This is a simplified version - you might want to use a proper color manipulation library
    return [
        baseColor + '0A', // 4%
        baseColor + '1A', // 10%
        baseColor + '26', // 15%
        baseColor + '4D', // 30%
        baseColor + '66', // 40%
        baseColor, // 50%
        baseColor + '80', // 60%
        baseColor + '99', // 70%
        baseColor + 'B3', // 80%
        baseColor + 'CC', // 90%
    ];
}
// Utility function to create a new tenant theme
function createTenantTheme(id, name, primaryColor, colorScheme = 'light') {
    return {
        id,
        name,
        primaryColor,
        colorScheme,
        customColors: {
            brand: generateColorShades(primaryColor),
        },
        fontFamily: exports.defaultTenantTheme.fontFamily,
        borderRadius: exports.defaultTenantTheme.borderRadius,
        spacing: exports.defaultTenantTheme.spacing,
    };
}
