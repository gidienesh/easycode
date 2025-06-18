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


## Core Responsibilities & Features

### 1. User Identity Management  
Manages the lifecycle of user accounts.

#### 1.1 User Registration

- **1.1.1 Invitation-Based Registration**  
  Tenant Administrators (via client-admin-service or within their tenant via user-service API) can invite new users via email/SMS (leveraging notification-service). Invited users complete registration.

- **1.1.2 Self-Registration (Configurable)**  
  Option for self-registration with email verification for specific use cases (e.g., public client portals), if enabled by tenant-service configuration.

#### 1.2 User Profile Management

- **1.2.1 Core Profile Data**  
  Store essential user information (name, email, phone, status, associated tenant ID).

- **1.2.2 Profile Customization**  
  Allow users to update their own non-sensitive profile information.

- **1.2.3 Administrator Profile Management**  
  Enable tenant_admin users to view and update basic user profiles within their tenant.

#### 1.3 Password Management

- **1.3.1 Secure Password Storage**  
  Store hashed passwords securely with appropriate salting.

- **1.3.2 Password Policy Enforcement**  
  Configurable policies for password complexity, length, expiry, and reuse, potentially tenant-specific (from tenant-service).

- **1.3.3 Password Reset & Recovery**  
  Secure mechanisms for password recovery (e.g., email-based tokens, leveraging notification-service).

#### 1.4 Account Status Management

- **1.4.1 User Activation/Deactivation**  
  tenant_admin can activate/deactivate users within their tenant.  
  client-admin-service can activate/deactivate users across tenants.

- **1.4.2 Account Locking**  
  Implement account locking mechanisms after multiple failed login attempts.

#### 1.5 Multi-Factor Authentication (MFA)

- Support for various MFA methods (e.g., TOTP, SMS OTP via notification-service) for enhanced security.

---

### 2. Authentication  
Verifies user credentials and issues secure access tokens.

- **2.1 Credential Verification**  
  Validate username/email and password against stored credentials.

- **2.2 Token Generation**  
  Issue secure, short-lived JSON Web Tokens (JWTs) upon successful authentication.  
  JWTs contain user ID, tenant ID, and other relevant claims.

- **2.3 Token Refresh**  
  Provide mechanisms for refreshing expired access tokens using refresh tokens.

- **2.4 Session Management**  
  Manage active user sessions, including session invalidation on logout or security events.

- **2.5 API Key Management**  
  Potentially provide a mechanism for generating and managing API keys for secure service-to-service communication, if direct user impersonation isn't required.

---

### 3. Authorization (Role-Based Access Control - RBAC)  
Manages the relationship between users, roles, and granular permissions.

#### 3.1 Role Definition Management (Metadata)

- Store and manage definitions of roles (e.g., "Sales Representative", "Accountant") and their assigned permissions.  
- Note: The actual granular permissions (e.g., `crm:lead:create`, `finance:gl:view`) are defined and owned by the respective micro-services and registered with the user-service.

#### 3.2 User-Role Assignment

- **3.2.1 tenant_admin Role Assignment**  
  client-admin-service assigns the tenant_admin role to users.

- **3.2.2 In-Tenant Role Assignment**  
  tenant_admin users can assign pre-defined roles to other users within their own tenant (e.g., "Accountant", "Inventory Clerk").

#### 3.3 Permission Storage & Retrieval

- Store the mappings of roles to their permissions.  
- Provide APIs for other services or clients to query a user's effective permissions.

---

### 4. Tenant-Aware Access Control  
Crucial for multi-tenancy, ensuring data isolation and entitlement enforcement.

#### 4.1 Tenant Entitlement Integration

- **4.1.1 Sync from tenant-service**  
  Regularly sync or query tenant-service to get list of active services/modules for each tenant.

- **4.1.2 Real-time Entitlement Check**  
  Intersect user’s assigned role permissions with their tenant’s enabled services to compute effective permissions.

#### 4.2 Effective Permissions Computation

- Provide an endpoint:  
  `GET /users/{userId}/permissions`  
  Returns user’s calculated effective permissions (roles + entitlements).  
  This is the primary endpoint for authorization decisions.

#### 4.3 Multi-Tenant Data Scoping

- Ensures all queries for user data and role assignments are scoped by `tenantId`.

---

### 5. API for Client & Server Use  
Exposes functionality for frontend apps and backend services.

- **5.1 Authentication Endpoints**  
  `/login`, `/logout`, `/refresh-token`, `/reset-password`.

- **5.2 User Management Endpoints**  
  `/users` (CRUD for tenant_admin/client-admin-service)  
  `/users/{userId}/profile`  
  `/users/{userId}/roles` (for assignment)

- **5.3 Authorization Endpoints**  
  `/roles`: Get available roles and their permissions  
  `/permissions`: Get registered permissions from services  
  `/users/{userId}/effective-permissions`: Real-time permission checks

- **5.4 Internal Service-to-Service APIs**  
  Secure internal calls for token validation and user detail retrieval.

---

### 6. Tenant Administrator Role (tenant_admin)  
A special, high-level role for managing a tenant's users.

- **6.1 Scope of Authority**  
  Can invite, activate/deactivate, assign roles within their tenant.

- **6.2 Entitlement Constraint**  
  tenant_admin’s management capabilities depend on what services/modules the tenant is entitled to.

- **6.3 Assignment**  
  Typically assigned by client-admin-service during onboarding.

---

### 7. Offline Sync Capabilities (for Client Apps)

- **7.1 Permissions Caching**  
  Allow clients (web/mobile) to cache permissions for offline usage or UI control.

- **7.2 Webhooks/Events**  
  Emit events (e.g., `user-roles-changed`, `tenant-entitlements-updated`) for cache invalidation and re-syncing permissions.

---

## 🔄 Interactions with Other Services

### @easycode/tenant-service

- **Dependency:**  
  user-service queries tenant-service for entitlement data to calculate effective permissions.

- **Event Subscription:**  
  Listens to `tenant-activated`, `tenant-module-enabled` to refresh entitlement caches.

### @easycode/notification-service

- **Dependency:**  
  Used for password resets, invitations, MFA codes, account status alerts.

### @easycode/client-admin-service

- **Consumer:**  
  Uses user-service APIs to manage users, assign tenant_admins, deactivate users across tenants.

### All Other Services (e.g., finance-service, crm-service, inventory-service)

- **Permission Registration:**  
  Register their granular permissions with user-service.

- **Authorization Enforcement:**  
  Call `/users/{userId}/effective-permissions` to authorize access or via middleware/API Gateway.

- **User Info Retrieval:**  
  Query basic user profile details (e.g., for audit logs or task assignment UI).

---
