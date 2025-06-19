# User Service (@easycode/user-service)

## 1. Service Overview

This service is responsible for managing user identities, authentication, authorization (roles and permissions), user profiles, and ensuring that user access aligns with their tenant's entitlements. It serves as the central authority for all user-related security and access control matters across the EasyCode platform. User permissions are computed based on assigned roles and the overall entitlements of the user's tenant (obtained from `tenant-service`).

Key responsibilities include:
-   User Identity Management: Registration, profile management, password policies, account recovery.
-   Authentication: Verifying user credentials and issuing access tokens (e.g., JWTs).
-   Authorization (RBAC): Managing roles and permissions.
-   Tenant-Aware Access Control: Computing effective user permissions based on their roles and their tenant's specific entitlements.
-   API for Client & Server Use: Providing endpoints for clients to fetch permissions for UI/offline use, and for other services to validate access.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. User Identity Management
Manages the lifecycle of user accounts.

1.  **User Registration**:
    1.1. **Invitation-Based Registration**: Tenant Administrators (via `client-admin-service` or within their tenant via user-service API) can invite new users via email/SMS (leveraging `notification-service`). Invited users complete registration.
    1.2. **Self-Registration (Configurable)**: Option for self-registration with email verification for specific use cases (e.g., public client portals), if enabled by `tenant-service` configuration.
2.  **User Profile Management**:
    2.1. **Core Profile Data**: Store essential user information (name, email, phone, status, associated tenant ID).
    2.2. **Profile Customization**: Allow users to update their own non-sensitive profile information.
    2.3. **Administrator Profile Management**: Enable `tenant_admin` users to view and update basic user profiles within their tenant.
3.  **Password Management**:
    3.1. **Secure Password Storage**: Store hashed passwords securely with appropriate salting.
    3.2. **Password Policy Enforcement**: Configurable policies for password complexity, length, expiry, and reuse, potentially tenant-specific (from `tenant-service`).
    3.3. **Password Reset & Recovery**: Secure mechanisms for password recovery (e.g., email-based tokens, leveraging `notification-service`).
4.  **Account Status Management**:
    4.1. **User Activation/Deactivation**: `tenant_admin` can activate/deactivate users within their tenant. `client-admin-service` can activate/deactivate users across tenants.
    4.2. **Account Locking**: Implement account locking mechanisms after multiple failed login attempts.
5.  **Multi-Factor Authentication (MFA)**:
    5.1. Support for various MFA methods (e.g., TOTP, SMS OTP via `notification-service`) for enhanced security.

### 3.2. Authentication
Verifies user credentials and issues secure access tokens.

1.  **Credential Verification**: Validate username/email and password against stored credentials.
2.  **Token Generation**: Issue secure, short-lived JSON Web Tokens (JWTs) upon successful authentication. JWTs contain user ID, tenant ID, role information, and other relevant claims.
3.  **Token Refresh**: Provide mechanisms for refreshing expired access tokens using refresh tokens.
4.  **Session Management**: Manage active user sessions, including session invalidation on logout or security events.
5.  **API Key Management**: (Future) Potentially provide a mechanism for generating and managing API keys for secure service-to-service communication where direct user impersonation isn't required.

### 3.3. Authorization (Role-Based Access Control - RBAC)
Manages the relationship between users, roles, and granular permissions.

1.  **Role Definition Management (Metadata)**:
    1.1. Store and manage definitions of roles (e.g., "Sales Representative," "Accountant," "Tenant Administrator") and their assigned permissions.
    1.2. Granular permissions (e.g., `crm:lead:create`, `finance:gl:view`) are defined and owned by the respective microservices and registered with the `user-service`.
2.  **User-Role Assignment**:
    2.1. **`tenant_admin` Role Assignment**: `client-admin-service` assigns the `tenant_admin` role to initial users within a new tenant.
    2.2. **In-Tenant Role Assignment**: Users with the `tenant_admin` role can assign other pre-defined roles to users within their own tenant (e.g., "Accountant," "Inventory Clerk").
3.  **Permission Storage & Retrieval**:
    3.1. Store the mappings of roles to their permissions.
    3.2. Provide APIs for other services or clients to query a user's effective permissions.
4.  **Tenant Administrator Role (`tenant_admin`)**:
    4.1. A special, high-level role for managing a tenant's users.
    4.2. **Scope of Authority**: Can invite, activate/deactivate, and assign roles to users *within their own tenant*.
    4.3. **Entitlement Constraint**: The `tenant_admin`’s management capabilities and the roles they can assign are constrained by what services/modules their tenant is entitled to (via `tenant-service`).

### 3.4. Tenant-Aware Access Control
Crucial for multi-tenancy, ensuring data isolation and entitlement enforcement.

1.  **Tenant Entitlement Integration**:
    1.1. **Sync/Query `tenant-service`**: Regularly syncs or queries `tenant-service` to get the list of active services and modules for each tenant.
    1.2. **Real-time Entitlement Check**: Intersects a user’s assigned role permissions with their tenant’s enabled services/modules to compute their effective permissions. For example, if a user has the "CRM Manager" role but their tenant is not entitled to the `crm-service`, they will not have any CRM-related permissions.
2.  **Effective Permissions Computation**:
    2.1. Provides an endpoint (e.g., `GET /users/{userId}/effective-permissions`) that returns a user’s calculated effective permissions. This is the primary endpoint for authorization decisions by other services or API gateways.
3.  **Multi-Tenant Data Scoping**:
    3.1. Ensures all internal queries for user data, role definitions, and assignments are scoped by `tenantId` where applicable.

### 3.5. API for Client & Server Use
Exposes functionality for frontend applications and backend services.

1.  **Authentication Endpoints**: e.g., `/login`, `/logout`, `/refresh-token`, `/reset-password`.
2.  **User Management Endpoints**: e.g., `/users` (CRUD for `tenant_admin`/`client-admin-service`), `/users/{userId}/profile`, `/users/{userId}/roles` (for assignment by `tenant_admin`).
3.  **Authorization Endpoints**: e.g., `/roles` (get available roles and their permissions), `/permissions` (get all registered permissions), `/users/{userId}/effective-permissions`.
4.  **Internal Service-to-Service APIs**: Secure internal calls for token validation and user detail retrieval by other backend services.

### 3.6. Offline Sync Capabilities (for Client Apps)
1.  **Permissions Caching**: Allow clients (web/mobile) to cache a user's effective permissions for offline usage or to optimize UI rendering (e.g., hiding/showing features).
2.  **Webhooks/Events**: Emit events (e.g., `user-roles-changed`, `user-profile-updated`, `tenant-entitlements-updated-for-user`) to notify relevant systems or client applications about changes, enabling cache invalidation and re-synchronization of permissions or user data.

## 4. Key Integration Points with Other Services

-   **`@easycode/tenant-service`**:
    -   **Dependency**: `user-service` queries `tenant-service` for tenant-specific service and module entitlement data to calculate a user's effective permissions.
    -   **Event Subscription**: May listen to events from `tenant-service` (e.g., `tenant-activated`, `tenant-module-enabled`) to refresh local entitlement caches or re-evaluate user permissions.
-   **`@easycode/notification-service`**:
    -   **Dependency**: Used to send communications for password resets, user invitations, MFA codes, account status alerts, and other user-related notifications.
-   **`@easycode/client-admin-service`**:
    -   **Consumer**: Uses `user-service` APIs extensively to manage users across all tenants, assign `tenant_admin` roles, and perform other super-administrative user management tasks.
-   **All Other Services** (e.g., `@easycode/finance-service`, `@easycode/crm-service`, `@easycode/inventory-service`, etc.):
    -   **Permission Registration**: Register their granular, service-specific permissions (e.g., `crm:lead:create`) with `user-service` during their startup or via an administrative process.
    -   **Authorization Enforcement**: Call `user-service` (e.g., `/users/{userId}/effective-permissions` endpoint) or integrate with an API Gateway that uses `user-service` for token validation and authorization decisions before allowing access to their resources.
    -   **User Info Retrieval**: Query `user-service` for basic user profile details (e.g., name, email) for display in UIs, audit logs, or task assignment functionalities.

## 5. Frontend & UI Consumption

Provides APIs for authentication and user management that are consumed by various frontend applications. These frontends, including potentially `apps/main-ui/` or applications built with its components, handle user-facing aspects like login forms, profile pages, and user administration interfaces (e.g., for `tenant_admin` users to manage users within their tenant).
