# Hybrid Multi-Tenancy & Deployment Strategy

## 1. Introduction

This document outlines the EasyCode platform's hybrid approach to multi-tenancy and service deployment. The strategy is designed to offer scalability and cost-effectiveness for a broad range of clients, primarily through a multi-tenant architecture, while also providing the option for fully dedicated, isolated instances for large enterprise clients or those with specific security, compliance, or customization requirements.

**Key Goals of this Hybrid Model:**
-   Provide a cost-effective, scalable solution for Small to Medium-sized Businesses (SMBs) and standard enterprise clients.
-   Offer premium, high-isolation, and customizable dedicated environments for large enterprise clients.
-   Maintain a consistent core application logic and feature set across deployment models where possible.
-   Enable efficient operational management for both deployment types.

## 2. Standard Multi-Tenant Architecture (Default Model)

This is the primary deployment model for most EasyCode clients.

-   **Application & Service Layer**: Microservices (CRM, Finance, Inventory, POS, Procurement, etc.) run as shared instances, serving multiple client companies (tenants) concurrently.
-   **Data Layer**:
    -   **Logical Data Isolation**: Each tenant's data is strictly isolated from others. This is typically achieved by including a `tenantId` column in all relevant database tables and ensuring all data access queries are filtered by the current `tenantId`.
    -   **Database Strategy**: Depending on the underlying database technology, this could involve all tenants sharing tables within a single database (with row-level security enforced by `tenantId`), or each tenant having its own schema within a shared database instance. The choice aims for a balance of isolation, cost, and manageability.
-   **`tenant-service` Role**:
    -   Manages the configuration, customization settings (e.g., UI themes, specific workflow preferences), and active status for each tenant within the shared infrastructure.
    -   It holds the unique "personality" and operational parameters for each tenant.
    -   Ensures that other services receive the correct tenant context for their operations.

## 3. Dedicated Instance Architecture (Enterprise Model)

For clients with needs exceeding the standard multi-tenant offering, dedicated instances provide a higher level of isolation and control.

-   **Infrastructure**: A fully isolated stack is provisioned for each client, including:
    -   Dedicated virtual servers or container clusters for all required microservices.
    -   A dedicated database instance (or cluster).
    -   Potentially dedicated networking components (VPCs, load balancers).
-   **Benefits**:
    -   **Maximum Data Isolation**: Data is physically and logically separate from all other clients.
    -   **Performance Guarantees**: No "noisy neighbor" effect; resources are dedicated.
    -   **Enhanced Customization**: Greater flexibility for deep customizations or integrations specific to that client.
    -   **Specific Compliance Adherence**: Easier to meet stringent, client-specific regulatory or compliance requirements (e.g., data residency, specific audit trails).
-   **`tenant-service` in Dedicated Instances**:
    -   Typically, a dedicated instance will run its own instance of `tenant-service`. This instance would be configured to manage a single "super-tenant" which represents the client enterprise itself.
    -   This approach maintains architectural consistency for how services within the instance discover and use tenant-specific configurations.
    -   A central EasyCode operational `tenant-service` (or a similar registry) might still maintain a high-level record of these dedicated instances and their metadata (e.g., version, location) for EasyCode's internal operational oversight and release management.

## 4. Orchestrating Tenancy - Key Service Roles & Management Flow

The setup and ongoing management of tenants, whether shared or dedicated, involves distinct responsibilities:

-   **`client-admin-service` (Used by EasyCode Internal Staff)**:
    -   **Client Company Onboarding**: This is the entry point where EasyCode administrators register new client companies that subscribe to the EasyCode platform.
    -   **Deployment Model Selection**: During onboarding or subsequent upgrades, EasyCode admins use this service to specify whether a client will be provisioned on the shared multi-tenant platform or will receive a dedicated instance. This decision impacts the provisioning process.
    -   **Service Entitlement Management**: Admins define which core EasyCode microservices (e.g., CRM, Finance, Inventory) and potentially major, predefined modules within those services the client company is subscribed to and authorized to use.
    -   **Propagation of Configuration**: The entitlement configuration (deployment model, enabled services/modules) set in `client-admin-service` is then communicated to (or pulled by) the relevant `tenant-service` to activate and configure the actual tenant environment. For dedicated instances, this might involve triggering the provisioning workflow for that instance.

-   **`tenant-service` (Manages Active Tenant Configuration & Runtime Context)**:
    -   **Applies Entitlements**: For a shared tenant, it ensures only the entitled services/modules are accessible. For a dedicated instance, its local `tenant-service` reflects the entitlements for that single enterprise.
    -   **Stores Tenant-Specific Settings**: Persists configurations like UI theme settings, workflow preferences, notification settings, and other customizations made by the tenant's own administrators.
    -   **Provides Tenant Context**: Delivers tenant-specific information and configuration to other microservices at runtime, ensuring they operate correctly for the current tenant.

-   **"Tenant Administrator" (A User Role within the Client Company, Managed via `user-service`)**:
    -   These are users employed by the client company who are granted administrative privileges *for their own company's tenant environment*.
    -   **User Management**: They can add/remove their company's users, assign roles (e.g., "CRM User," "Finance Manager"), and manage user access *within the scope of the services their company is entitled to use* (as defined by EasyCode admins in `client-admin-service`).
    -   **Application Configuration**: They configure tenant-specific settings for the enabled services (e.g., custom fields in CRM, approval workflows in Procurement, POS receipt templates).
    -   **Important Distinction**: Tenant Administrators do *not* choose the deployment model (shared/dedicated) nor do they define which top-level EasyCode services their company can subscribe to; those are functions of the `client-admin-service` used by EasyCode staff.

## 5. Operational Considerations

-   **Deployment Automation (Infrastructure as Code - IaC & CI/CD)**: A robust, automated deployment pipeline is critical for efficiently provisioning, configuring, updating, and managing both the shared multi-tenant platform and numerous dedicated client instances.
-   **Monitoring & Logging**: A centralized or federated monitoring and logging strategy is needed to provide visibility into the health and performance of all deployed instances (shared and dedicated). Tenant-specific logs must remain isolated.
-   **Update & Release Management**: A clear strategy for rolling out software updates and new versions across the shared platform and the fleet of dedicated instances. This may involve different schedules or version controls for dedicated instances based on client agreements.
-   **Data Backup & Disaster Recovery (DR)**: Backup and DR strategies must be defined and implemented for both shared tenant data (with logical separation) and dedicated tenant data (physical separation). Service Level Agreements (SLAs) for RPO/RTO may differ.

## 6. Data Analytics & AI Model Training Considerations

-   **EasyCode Internal Analytics**: For platform improvement and business intelligence, EasyCode may aggregate anonymized usage data from the multi-tenant platform (with appropriate client consent and privacy safeguards). Accessing data from dedicated instances for such purposes would require explicit client agreements.
-   **AI Model Training**:
    -   **Multi-Tenant Platform**: AI models providing features to shared tenants might be trained on anonymized, aggregated data from multiple consenting tenants to improve general model performance. Alternatively, tenant-specific AI models can be trained if data pooling is not feasible or desired.
    -   **Dedicated Instances**: AI models for clients on dedicated instances will typically be trained exclusively on that client's own data within their isolated environment, ensuring data privacy and model specificity.

This hybrid multi-tenancy and deployment strategy provides a flexible framework to serve a wide range of clients while balancing cost, scalability, isolation, and customization.
```
