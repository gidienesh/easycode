# Tenant Service (@easycode/tenant-service)

This service is responsible for managing tenant (client organization/company) accounts, their specific configurations, and their entitlements to various services and modules within the EasyCode platform.

## Core Responsibilities
-   **Tenant Lifecycle Management**: Creating, updating, activating/deactivating tenant accounts.
-   **Tenant Configuration**: Storing and serving tenant-specific settings, preferences, and customizations.
-   **Data Isolation**: Ensuring that each tenant's data is logically (and potentially physically) separated.
-   **Tenant Entitlement Management**: Storing and serving the authoritative list of services and modules a tenant is permitted to access.

## Tenant Entitlement Management & Offline Sync

This service stores the authoritative list of services and major modules a tenant (client company) is entitled to access, as configured by EasyCode administrators via the `client-admin-service`.

### Entitlement Storage
-   Entitlements are stored within the tenant's configuration data.
-   Example structure:
    ```json
    "entitlements": {
      "enabledServices": ["crm-service", "inventory-service"],
      "enabledModules": {
        "crm-service": ["sales_pipeline"]
      },
      "version": "tenant-version-id" // For cache control
    }
    ```

### API for Offline Synchronization & Server-Side Checks
-   **Endpoint**: `GET /api/tenants/{tenantId}/entitlements`
-   **Purpose**: Allows client applications to fetch tenant-level entitlements for offline storage and UI rendering. Also used by other backend services or API gateways for validation.
-   **Response**: Returns the `entitlements` object as shown above.
-   **Security**: Endpoint is secured; accessible only to authenticated users of the tenant or authorized services.
-   **Caching**: Uses ETags or versioning to support client-side caching and conditional requests.

(Further details on other responsibilities like tenant lifecycle and general configuration will be added.)
