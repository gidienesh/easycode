# Tenant Service (@easycode/tenant-service)

## 1. Service Overview

Manages tenant (client organization) accounts, including their lifecycle, configurations, and entitlements to various services and modules within the EasyCode platform.

The `tenant-service` is a cornerstone of the EasyCode platform's hybrid tenancy architecture:
-   In the **shared multi-tenant environment**, it manages the configurations, settings, and ensures data isolation for numerous distinct client tenants.
-   In **dedicated client instances**, an instance of `tenant-service` typically runs to manage the configuration for that single enterprise (as a "super-tenant"), maintaining architectural consistency.

It receives the high-level service entitlements for a tenant (i.e., which EasyCode services are active) based on configurations set by EasyCode administrators via the `client-admin-service`.

**New:** The platform now supports an internal admin workflow for feature selection, quotation, payment, trial management, promotions, and affiliate agent tracking, enabling a streamlined sales and onboarding process for tenants.

For more details on the overall tenancy and deployment strategy, see the [Hybrid Multi-Tenancy & Deployment Strategy](../../docs/architecture/hybrid-tenancy-and-deployment.md).

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Tenant Lifecycle Management
1.  **Tenant Onboarding**: Creating new tenant accounts, typically initiated by the `client-admin-service`. This includes generating unique tenant IDs and setting up initial configurations.
2.  **Tenant Activation & Deactivation**: Managing the status of tenant accounts (e.g., active, suspended, trial). Deactivated tenants may have restricted access or data archival processes.
3.  **Tenant Offboarding**: Processes for permanently removing a tenant and their data from the system, including data deletion or archival according to policy.
4.  **Tenant Updates**: Modifying core tenant information (e.g., company name, primary contact).

### 3.2. Tenant Configuration Management
1.  **Centralized Settings Storage**: Stores and serves tenant-specific settings, preferences, and customizations that other services rely on.
2.  **Custom Fields & Extensibility**: (Future) Support for tenants defining custom fields or extending data models for certain services.
3.  **Branding Customization**: Store tenant-specific branding elements (e.g., logos, color schemes) that can be applied to UIs or communications.
4.  **Regional Settings**: Manage tenant-specific regional settings like timezone, language defaults, and currency defaults.

### 3.3. Service Entitlement Management
1.  **Authoritative Entitlement Store**: Stores and serves the definitive list of services, features, and modules a tenant is permitted to access, based on their subscription level (configured via `client-admin-service`).
2.  **Granular Control**: Allows for enabling/disabling specific services (e.g., `crm-service`, `inventory-service`) or even sub-modules/features within those services.
3.  **API for Entitlement Checks**:
    -   **Endpoint Example**: `GET /api/tenants/{tenantId}/entitlements`
    -   **Purpose**: Allows client applications to fetch tenant-level entitlements for UI rendering (e.g., showing/hiding menu items) and offline storage. Also used by other backend services or API gateways for validating access to service functionalities.
    -   **Response Example**:
        ```json
        {
          "entitlements": {
            "enabledServices": ["crm-service", "inventory-service"],
            "enabledModules": {
              "crm-service": ["sales_pipeline", "marketing_campaigns"],
              "inventory-service": ["basic_stock_tracking"]
            },
            "version": "tenant-entitlement-version-id" // For cache control
          }
        }
        ```
    -   **Security & Caching**: The endpoint is secured, accessible only to authenticated users of the tenant or authorized services. It utilizes ETags or versioning to support client-side caching.

### 3.4. Domain & Subdomain Management (If Applicable)
1.  **Custom Domain Mapping**: (Future) For tenants who wish to use their own custom domains for accessing the platform.
2.  **Subdomain Provisioning**: Manage unique subdomains for tenants (e.g., `clientcompany.easycode.com`).

### 3.5. Data Isolation Assurance
1.  **Tenant Context Propagation**: While not directly enforcing data separation (which is the responsibility of individual data-handling services), `tenant-service` provides the definitive `tenantId` that is crucial for other services to filter and scope data correctly.
2.  **Configuration for Isolation Strategies**: May store configuration details related to a tenant's specific data isolation needs if more complex than simple `tenantId` filtering (e.g., dedicated database connection strings for certain enterprise tenants, though this is rare in a typical SaaS multi-tenant model).

### 3.6. Internal Admin Workflow: Feature Selection, Quotation, Payment, Trials, Promotions, and Affiliates
1.  **Feature Checklist for Admins**: Internal administrators use a checklist interface to select and configure the specific features and modules requested by each tenant during onboarding or upgrade.
2.  **Quotation Generation**: Based on the selected features, the system generates a detailed quotation for the tenant, outlining costs and included modules/services.
3.  **Payment & Activation**: Once payment is confirmed, the selected features are activated for the tenant, updating their entitlements in the system. Trial and promotional features can be enabled with specific time limits or conditions.
4.  **Trial Management**: Admins can assign trial periods for certain features or modules, after which access is automatically restricted unless payment is made.
5.  **Promotions & Discounts**: The workflow supports applying promotional codes or discounts to the quotation, with tracking for reporting and analytics.
6.  **Affiliate Agent Tracking**: If a tenant is referred by an affiliate agent, this relationship is recorded, and commissions or rewards can be tracked and reported.
7.  **Audit & History**: All admin actions (feature selection, quotation, payment, trial assignment, promotions, affiliate links) are logged for compliance and support purposes.

This workflow ensures a seamless, auditable, and flexible process for onboarding tenants, managing upsells, and supporting marketing and affiliate programs.

## 4. Key Integration Points with Other Services

The `tenant-service` is a foundational service, primarily consumed by other services to ensure they operate correctly within a tenant's context and entitlements.

-   **`user-service`**:
    -   `user-service` queries `tenant-service` to validate tenant existence and status when associating users with a tenant.
    -   `tenant-service` informs `user-service` about a tenant's service/module entitlements, which `user-service` might use in conjunction with its own role/permission system to calculate effective user permissions.
-   **`client-admin-service`**:
    -   This is the primary administrative interface for creating, managing, and configuring tenants and their high-level entitlements. `client-admin-service` calls `tenant-service` APIs to persist these settings.

-   **All Other Business Logic Services** (e.g., `crm-service`, `finance-service`, `hr-service`, `pos-service`, `inventory-service`, `project-management-service`, `logistics-service`, etc.):
    -   These services query `tenant-service` at startup or on-demand to fetch tenant-specific configurations (e.g., "What are the custom invoice templates for tenant X?", "What are the specific HR policies for tenant Y?").
    -   They rely on `tenant-service` to confirm that a requested operation or data access is within the tenant's entitled scope of services and modules.
    -   All services use the `tenantId` (often obtained via JWT or request context, validated against `tenant-service`) to ensure strict data isolation in their respective databases and operations.

-   **`notification-service`**:
    -   May be triggered by `tenant-service` to send notifications regarding significant tenant lifecycle events (e.g., trial period ending, subscription changes, deactivation confirmation).
    -   `notification-service` itself queries `tenant-service` for tenant-specific branding or contact preferences when sending notifications on behalf of other services.

## 5. Frontend & UI Consumption

Primarily a backend service, `tenant-service` provides crucial data for data isolation and configuration to all other services and applications. Any UI for managing tenant configurations directly (beyond what `client-admin-service` offers) would typically be part of a super-administrative interface, potentially using components from `apps/main-ui/`. End-user applications consume tenant configurations indirectly through the business logic services they interact with.
