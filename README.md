# EasyCode Monorepo

This repository is the foundation for EasyCode's modular, microservice-oriented business applications. It houses various frontend applications (under `apps/`) and backend microservices (under `services/`). Shared libraries and packages can be found in `packages/`.

## Core Purpose
To provide customers with precisely tailored software solutions by assembling modular components, addressing diverse needs across various business categories, including Point-of-Sale (POS) systems, Human Resources (HR), Finance & Accounting, Transport & Logistics, Inventory, CRM, and full ERPs.

## Engineering Philosophy
- High Modularity
- Microservice Architecture
- Scalability
- Resilience & Stability
- Performance
- Security
- Observability
- Maintainability

## Technology Stack
The EasyCode platform leverages a modern, robust technology stack:
-   **Next.js (with TypeScript)**: For building performant, type-safe frontend applications. All frontend code is written in TypeScript, not plain JavaScript or React alone.
-   **OpenNext/Cloudflare**: For deployment, and leveraging edge capabilities for optimal performance and scalability.
-   **TypeScript**: Across both frontend and backend for type safety and improved developer experience.
-   **Node.js**: For developing efficient and scalable backend microservices.
-   **Mantine UI**: As the core UI component library, primarily delivered via the shared `apps/main-ui/` library, to ensure visual and interactive consistency.
-   **Turborepo**: For monorepo management, optimizing build times and development workflows.

## Frontend Architecture Highlight: Shared UI Strategy

A key aspect of our frontend strategy is the centralized shared UI component library located in `apps/main-ui/`. This library is built with **Next.js (React framework) and TypeScript**—not plain JavaScript or React alone.

**Role and Importance of `apps/main-ui/`:**
-   **Source of Truth**: It serves as the single source of truth for reusable UI components (buttons, forms, layout elements, etc.).
-   **Consistency**: Ensures a consistent look, feel, and user experience across all frontend applications within the EasyCode ecosystem.
-   **Accelerated Development**: Speeds up frontend development by providing developers with pre-built, well-tested, and documented UI building blocks.
-   **Maintainability**: Centralizing shared components simplifies updates, bug fixes, and style revisions, ensuring changes are propagated efficiently.

All frontend applications, whether dedicated frontends for specific microservices (like `services/finance-service/`) or broader applications, are built with **Next.js and TypeScript** and are encouraged to consume components from `apps/main-ui/` to maintain coherence and development velocity.

## Available Services
This monorepo hosts a suite of backend microservices, each designed to handle specific business domains while integrating seamlessly to provide comprehensive solutions. These services share data and trigger workflows across the platform, enabling a cohesive and powerful user experience.

Here's a brief overview of the key services:

-   **Client Administration Service (`services/client-admin-service/`)**: Internal service for EasyCode staff to manage business client accounts, subscriptions, and configurations.
-   **CRM Service (`services/crm-service/`)**: Manages customer data, sales pipeline, marketing campaigns, and customer support interactions.
-   **Equipment Maintenance Service (`services/equipment-maintenance-service/`)**: Manages equipment assets, scheduling preventive and corrective maintenance, tracking service history, and utilizing configurable checklists for maintenance procedures.
-   **Finance & Accounting Service (`services/finance-service/`)**: Manages financial operations, including general ledger, accounts payable/receivable, financial reporting, and budgeting. (Has its own Next.js/Mantine UI frontend).
-   **Human Resources Service (`services/hr-service/`)**: Manages human resources functionalities like employee data management, payroll processing, leave management, and recruitment.
-   **Inventory Management Service (`services/inventory-service/`)**: Manages product inventory, stock levels, warehouse management, item master data, stock movements, and interacts with procurement.
-   **Logistics Service (`services/logistics-service/`)**: Manages transport and logistics operations, such as shipment tracking, route optimization, fleet management, and delivery scheduling.
-   **Notification Service (`services/notification-service/`)**: Handles the sending and management of notifications across various channels like email, SMS, and push notifications. It serves as a centralized point for all service-to-user and service-to-service communications.
-   **Point of Sale (POS) Service (`services/pos-service/`)**: Manages point-of-sale operations, including transaction processing, receipt generation, order management, and integration with payment gateways and hardware. (Has a specialized client application).
-   **Procurement Service (`services/procurement-service/`)**: Manages the complete procure-to-pay (P2P) lifecycle, including purchase requisitions, supplier management, sourcing, purchase orders, goods receipt, and invoice matching.
-   **Project Management Service (`services/project-management-service/`)**: Manages project planning, execution, tracking, and collaboration for both EasyCode's clients and internal staff.
-   **Tenant Service (`services/tenant-service/`)**: Manages tenant (client organization) accounts, including their lifecycle, configurations, and entitlements to various services and modules within the platform. This is a cornerstone of the multi-tenant architecture.
-   **User Service (`services/user-service/`)**: Manages user identities, authentication, authorization (roles and permissions), user profiles, and ensures user access aligns with their tenant's entitlements. This is a central authority for user security.

**Note:** This list provides a high-level overview. For detailed information on any specific service, including its core features, API (if applicable), and integration points, please refer to the `README.md` file located within its respective directory in `services/`. For details on the shared UI components, see `apps/main-ui/README.md`.
