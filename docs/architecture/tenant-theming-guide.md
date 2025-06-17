# Tenant Theming Architecture Guide

This document outlines the architecture for supporting tenant-specific UI theming within EasyCode applications. This allows client companies (tenants) to customize the look and feel of the UI (e.g., `apps/main-ui`) to align with their branding.

The `tenant-service` is primarily responsible for storing and serving these theme configurations.

## 1. Data Model for Theme Settings

Theme settings are stored as part of a tenant's configuration data within the `tenant-service`.

-   **Example JSON Structure** (to be stored within the tenant configuration object, e.g., under a "theme" key):
    ```json
    {
      "primaryColor": "#005A9C",       // Main brand color for buttons, links, headers
      "secondaryColor": "#FDB813",     // Accent color
      "textColor": "#333333",          // Default text color
      "backgroundColor": "#FFFFFF",    // Default page background
      "logoUrlAppHeader": "https://cdn.example.com/tenant_xyz/logo_header.png", // URL for logo in app header
      "logoUrlSmall": "https://cdn.example.com/tenant_xyz/logo_small.png",       // For smaller contexts, e.g. sidebar
      "faviconUrl": "https://cdn.example.com/tenant_xyz/favicon.ico",
      "fontPreference": "Roboto, sans-serif", // Optional: preferred font stack
      "uiDensity": "compact" // Optional: e.g., compact, comfortable, spacious
      // Additional theme-related settings can be added as needed
    }
    ```
-   Tenant administrators would typically manage these settings via a dedicated section in the application's admin interface, which would then call APIs on `client-admin-service` or directly `tenant-service` (if authorized) to update this configuration.

## 2. API Endpoint in `tenant-service`

Frontend applications need to fetch these theme settings to apply them dynamically.

-   **Endpoint**: `GET /api/tenants/{tenantId}/theme-settings`
    -   Alternatively, these settings could be part of a larger tenant configuration endpoint like `GET /api/tenants/{tenantId}/configuration`.
-   **Response**: The endpoint will return the `theme` object (as defined in the data model section) for the specified tenant.
    ```json
    // Example Response:
    {
      "primaryColor": "#005A9C",
      "secondaryColor": "#FDB813",
      "textColor": "#333333",
      "backgroundColor": "#FFFFFF",
      "logoUrlAppHeader": "https://cdn.example.com/tenant_xyz/logo_header.png",
      "logoUrlSmall": "https://cdn.example.com/tenant_xyz/logo_small.png",
      "faviconUrl": "https://cdn.example.com/tenant_xyz/favicon.ico",
      "fontPreference": "Roboto, sans-serif",
      "uiDensity": "compact"
    }
    ```
-   **Caching**: The API response SHOULD include appropriate HTTP caching headers (e.g., `ETag`, `Cache-Control`) to allow client applications and browsers to cache theme settings effectively and reduce redundant fetches. Clients should use conditional requests (e.g., `If-None-Match`) when possible.
-   **Security**: This endpoint MUST be authenticated. Authorization should ensure that only users belonging to the specified tenant (or authorized EasyCode administrators) can access these settings.

## 3. Frontend Application Responsibility

Client applications (e.g., `apps/main-ui`) are responsible for:

-   **Fetching Theme Settings**: Retrieving the theme configuration from the `tenant-service` API endpoint upon application load or user login (after authentication and tenant identification).
-   **Applying Theme Settings**: Dynamically applying the fetched theme settings across the UI. Common methods include:
    -   Using CSS variables (custom properties) that are updated based on the fetched theme values.
    -   Utilizing theme providers offered by UI component libraries (e.g., Material-UI ThemeProvider, Ant Design ConfigProvider, or equivalents in Shadcn UI, Mantine, 21st.dev).
    -   Custom styling logic to inject colors, fonts, and logos as needed.
-   **Default Fallback**: Handling cases where theme settings might be missing, incomplete, or fail to load. In such scenarios, the application should gracefully fall back to a default application theme to ensure usability.
-   **Dynamic Updates (Optional)**: If theme settings can be changed while a user is active, the frontend might need a mechanism to re-fetch and re-apply themes without requiring a full page reload (e.g., via a global state management trigger or a dedicated event).
```
