# Client Administration Service (@easycode/client-admin-service)

**INTERNAL SERVICE**

## 1. Service Overview

This is an internal service for EasyCode staff to manage business client accounts, subscriptions, and configurations. It is NOT for use by the clients themselves or their end-users.

It plays a key role in the platform's hybrid tenancy model by allowing EasyCode administrators to:
- Define a client company's deployment model (either on the shared multi-tenant platform or as a dedicated instance).
- Set the top-level service entitlements (e.g., which core EasyCode services like CRM, Finance, etc.) the client company is subscribed to.
These configurations are then used to provision and configure the client's active tenant environment via the `tenant-service`.

For more details on the overall tenancy and deployment strategy, see the [Hybrid Multi-Tenancy & Deployment Strategy](../../docs/architecture/hybrid-tenancy-and-deployment.md).

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

1.  **Client Onboarding & Account Management:**
    1.1. Onboard new business clients.
    1.2. Manage client accounts, including company information, primary contacts, and status.
    1.3. Store internal notes, communication logs, or relationship history relevant to managing the client.
2.  **Subscription and Entitlement Management:**
    2.1. Handle client subscriptions and service tiers.
    2.2. Configure feature entitlements.
    2.3. **Service/Module Entitlement Configuration**:
        2.3.1. Enable or disable access to individual microservices (e.g., `crm-service`, `inventory-service`) for a client company.
        2.3.2. Toggle access to predefined major modules within complex services (Optional).
        2.3.3. Utilize predefined entitlement packages or service plans with override options.
        2.3.4. Persist entitlement settings and signal `tenant-service` for updates to live tenant configurations.
        2.3.5. Log all changes to a client's entitlements via audit trails.
3.  **Deployment Configuration:**
    3.1. Oversee high-level configurations or customizations specific to a client's deployment.

This service is distinct from:
- `crm-service`: Which handles pre-sales activities for potential clients.
- `user-service`: Which manages individual user identities.
- `tenant-service`: Which manages the operational environment for each client.

## 4. Key Integration Points with Other Services

-   **`user-service`**:
    -   Assigns `tenant_admin` role to users via `user-service` APIs, granting them administrative privileges for their specific tenant.
-   **`tenant-service`**:
    -   Creates and configures tenant records in `tenant-service` based on the client information and deployment model defined in this service.
    -   Manages tenant subscriptions and module entitlements through `tenant-service` by propagating settings.
-   **(Other potential integrations to be detailed as they arise)**

## 5. Administrative Interface

Provides APIs that can be consumed by administrative frontends, potentially built using components from the shared UI library in `apps/main-ui/`.
