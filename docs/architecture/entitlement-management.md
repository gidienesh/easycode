# Entitlement Management Architecture

## 1. Overview

This document outlines the architecture for managing entitlements in the EasyCode platform. The system controls:
- Which services and major modules client companies (tenants) can access, as defined by EasyCode administrators.
- User permissions within a client company, managed by that company's designated Tenant Administrator(s), within the scope of the company's entitlements.

Key principles include:
- **Server-Side Authoritative**: All access control checks performed by backend services are definitive.
- **Client-Side for UX**: Client applications use local copies of entitlements to improve user experience (e.g., hiding inaccessible features) but not for security.
- **Offline Support**: Client applications can function offline using locally stored entitlement data.

## 2. Key Services Involved

-   **`client-admin-service`**: Used by EasyCode internal staff to define and manage service/module entitlements for each client company (tenant).
-   **`tenant-service`**: Stores and serves the authoritative list of enabled services/modules for each tenant. Provides an API for clients to fetch these tenant-level entitlements for offline use.
-   **`user-service`**: Manages user identities, roles (including the Tenant Administrator role), and computes/serves effective user-specific permissions based on their roles and their tenant's entitlements. Provides an API for clients to fetch these permissions for offline use.
-   **API Gateway / Auth Middleware**: Performs initial authentication and coarse-grained authorization checks (e.g., tenant access to a service).
-   **Client Applications (e.g., `apps/main-ui`)**: Fetch, store (client-side), and use entitlement data to tailor UX and make preliminary access checks.
-   **Individual Microservices**: Enforce fine-grained permissions for specific actions.

## 3. Defining Entitlements

-   **Tenant-Level Entitlements**: EasyCode administrators use the `client-admin-service` to toggle access to services (e.g., CRM, Inventory) and potentially major modules within those services for a specific client company. These settings are stored by `tenant-service`.
-   **User-Level Access within a Tenant**: Each client company designates one or more "Tenant Administrators." These administrators use features within the main application (powered by `user-service`) to assign roles to their company's users. These roles grant access only to the services/features their company is entitled to.

## 4. Data Models for Entitlements

### a. Tenant Entitlements (stored in `tenant-service`, served via API)
```json
// Example: GET /api/tenants/{tenantId}/entitlements
{
  "enabledServices": ["crm-service", "inventory-service"],
  "enabledModules": {
    "crm-service": ["sales_pipeline", "contact_management"]
  },
  "version": "tenant-etag-or-version-123",
  "lastFetched": "iso-timestamp" // Added by client when storing
}
```

### b. User-Specific Effective Permissions (served by `user-service` via API)
```json
// Example: GET /api/users/me/effective-permissions
{
  "userId": "user-xyz",
  "tenantId": "client-company-abc",
  "roles": ["crm_manager", "inventory_viewer"],
  "permissions": {
    // Option 1: Grouped by service
    "crm-service": {
      "leads": ["create", "read", "update"],
      "contacts": ["read"]
    },
    "inventory-service": {
      "items": ["read"],
      "stock": ["read"]
    }
    // Option 2: Flat list (alternative)
    // "flatPermissions": ["crm:lead:create", "crm:lead:read", ...]
  },
  "version": "user-etag-or-version-456",
  "lastFetched": "iso-timestamp" // Added by client when storing
}
```

## 5. Synchronization & Client-Side Storage (Offline Support)

-   **Workflow**:
    1.  User authenticates (receives JWT with `userId`, `tenantId`).
    2.  Client app fetches tenant entitlements from `tenant-service`.
    3.  Client app fetches user-specific effective permissions from `user-service`.
-   **Storage**: IndexedDB is recommended for storing this structured data on the client. An `EntitlementService` abstraction in the client app should manage this data.
    ```json
    // Example structure in IndexedDB
    {
      "id": "currentUserEntitlements",
      "tenantEntitlements": { /* ... as above ... */ },
      "userPermissions": { /* ... as above ... */ }
    }
    ```
-   **Synchronization Logic**:
    -   **Initial Load**: Fetch and store with versions.
    -   **Subsequent Online Loads**: Optimistically load from local. In background, make conditional GETs using stored versions (ETags). Update local store if new data is received.
    -   **Coming Online**: Trigger refresh logic. Handle data staleness gracefully.
-   **Client-Side Abstraction**: An `EntitlementService` in the client application should provide methods like `canAccessService(serviceName)`, `hasPermission(permissionString)`.

## 6. Enforcement Strategy

### a. Client-Side (UX Enforcement)
-   UI elements (menus, buttons, routes) are conditionally rendered/enabled based on checks against the local `EntitlementService`.
-   Example: `if (EntitlementService.hasPermission('crm:lead:create')) { /* show button */ }`.
-   This improves UX but is not for security.

### b. Server-Side (Authoritative Enforcement)
-   **API Gateway/Auth Middleware**: Validates JWT. Can perform coarse-grained checks: Is tenant entitled to this service? (Requires gateway to know tenant entitlements, possibly from JWT claims or its own cache).
-   **Microservice Logic**: Each service endpoint performs fine-grained checks: Does this specific user have the specific permission for this action?
    -   Permissions can be derived from JWT claims (if enriched by `user-service` at login) or by calling `user-service` (with caching).
    -   Example: `if (!currentUser.hasPermission('crm:lead:create')) throw ForbiddenError();`.
-   This is the ultimate security boundary.

## 7. Flow Diagrams (Illustrative)

*(Placeholder for future sequence diagrams: e.g., Initial Client Data Fetch, API Request Validation)*

## 8. Security Considerations

-   Server-side checks are paramount.
-   Client-side data is for UX and can be inspected/tampered with.
-   Ensure secure API endpoints for fetching entitlements/permissions.
-   Manage JWT payload size if embedding many permissions.

## 9. Future Considerations
-   More granular feature flags within modules.
-   Real-time push updates for entitlement changes to active clients (e.g., via WebSockets).
```
