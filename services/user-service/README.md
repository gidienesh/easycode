# User Service (@easycode/user-service)

This service is responsible for managing user identities, authentication, authorization (roles and permissions), user profiles, and ensuring that user access aligns with their tenant's entitlements.

## Core Responsibilities
-   **User Identity Management**: Registration, profile management, password policies, account recovery.
-   **Authentication**: Verifying user credentials and issuing access tokens (e.g., JWTs).
-   **Authorization (RBAC)**: Managing roles and permissions.
-   **Tenant-Aware Access Control**: Computing effective user permissions based on their roles and their tenant's specific entitlements.
-   **API for Client & Server Use**: Providing endpoints for clients to fetch permissions for UI/offline use, and for other services to validate access.

## Tenant-Aware Permissions, Roles & Offline Sync

User permissions are computed based on assigned roles and the overall entitlements of the user's tenant.

### Tenant Administrator Role
-   A special role (`tenant_admin`) can be assigned to users within a tenant.
-   **Capabilities**: Manage users (invite, activate/deactivate, assign roles) *within their own tenant*. They operate within the scope of services/modules their company is entitled to.

### Roles & Permissions Structure
-   Roles are defined with associated granular permissions. The actual permissions (e.g., `crm:lead:create`, `inventory:item:edit`) are defined by the services that own the resources.
-   `user-service` stores role definitions and assignments to users.
-   A user's *effective permissions* are an intersection of their roles' permissions and their tenant's enabled services/modules (obtained from `tenant-service`). For example, if a user has the "CRM Manager" role but their tenant is not entitled to the `crm-service`, they will not have any CRM-related permissions.

#### Example System-Wide & Service-Specific Roles:
-   **System Roles**:
    -   `tenant_admin`: Manages users and role assignments within their own tenant, within the scope of tenant entitlements.
-   **CRM Roles (Managed by `crm-service` logic, assigned via `user-service` UI/API)**:
    -   `SalesRepresentative`: Can manage leads, contacts, opportunities they own.
    -   `SalesManager`: Can view/manage team's sales data, approve discounts.
    -   `MarketingUser`: Can create and manage campaigns.
-   **Procurement Roles (Managed by `procurement-service` logic, assigned via `user-service` UI/API)**:
    -   `Requisitioner`: Can create purchase requisitions.
    -   `ProcurementApproverTier1`: Can approve requisitions/POs up to a certain value.
    -   `ProcurementOfficer`: Can manage POs, RFx, and suppliers.
    -   `ReceivingClerk`: Can record goods receipts.
    -   `SupplierManager`: Can manage supplier master data.
-   *(Other services like `inventory-service`, `finance-service` would also define roles relevant to their domain, e.g., `InventoryClerk`, `Accountant`).*

### API for Offline Synchronization & Server-Side Checks
-   **Endpoint**: `GET /api/users/me/effective-permissions` (authenticates via token to derive user and tenant context).
-   **Purpose**: Allows client applications to fetch the current user's computed, effective permissions for offline storage and UI rendering. Also used by backend services for fine-grained checks.
-   **Response Example**:
    ```json
    {
      "userId": "user-xyz",
      "tenantId": "client-company-abc",
      "roles": ["crm_manager"],
      "permissions": {
        "crm-service": { "leads": ["create", "read", "update"] }
        // ... other entitled service permissions
      },
      "version": "user-permissions-version-id" // For cache control
    }
    ```
-   **Security**: Highly sensitive endpoint, robustly secured. Requires valid user authentication.
-   **Caching**: Uses ETags or versioning to allow clients and intermediate services to cache permission data effectively.

## Integration with Other Services
-   **`tenant-service`**: Consulted to determine a tenant's active entitlements, which scope the permissions granted to users of that tenant.
-   **`client-admin-service`**: Indirectly, as it defines what entitlements are available for `tenant-service` to store.
-   **All other microservices**: Rely on this service (or the permissions it embeds in tokens/provides via API) to enforce access control.

(Further details on identity management, authentication protocols, etc., will be added.)
