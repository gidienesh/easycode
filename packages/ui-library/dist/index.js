"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyCodeProvider = exports.generateColorShades = exports.createTenantTheme = exports.tenantThemes = exports.defaultTenantTheme = exports.useTenantTheme = exports.TenantThemeProvider = void 0;
// Export all theme-related components and utilities
var tenantThemeProvider_1 = require("./theme/tenantThemeProvider");
Object.defineProperty(exports, "TenantThemeProvider", { enumerable: true, get: function () { return tenantThemeProvider_1.TenantThemeProvider; } });
Object.defineProperty(exports, "useTenantTheme", { enumerable: true, get: function () { return tenantThemeProvider_1.useTenantTheme; } });
Object.defineProperty(exports, "defaultTenantTheme", { enumerable: true, get: function () { return tenantThemeProvider_1.defaultTenantTheme; } });
Object.defineProperty(exports, "tenantThemes", { enumerable: true, get: function () { return tenantThemeProvider_1.tenantThemes; } });
Object.defineProperty(exports, "createTenantTheme", { enumerable: true, get: function () { return tenantThemeProvider_1.createTenantTheme; } });
Object.defineProperty(exports, "generateColorShades", { enumerable: true, get: function () { return tenantThemeProvider_1.generateColorShades; } });
// Export existing providers
var EasyCodeProvider_1 = require("./providers/EasyCodeProvider");
Object.defineProperty(exports, "EasyCodeProvider", { enumerable: true, get: function () { return EasyCodeProvider_1.EasyCodeProvider; } });
