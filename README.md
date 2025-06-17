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

## Technology Stack (Planned)
- Node.js (for backend microservices)
- Next.js (for frontend applications)
- Cloudflare (for edge platform capabilities)

## Available Services
This monorepo hosts a suite of backend microservices. Here's a brief overview of some key services:

- **Point-of-Sale Service (`services/pos-service/`)**: Manages point-of-sale operations, including transaction processing, receipt generation, and integration with payment gateways.
- **Human Resources Service (`services/hr-service/`)**: Handles human resources functionalities like employee data management, payroll processing, leave management, and recruitment.
- **Finance & Accounting Service (`services/finance-service/`)**: Manages financial operations, including general ledger, accounts payable/receivable, financial reporting, and budgeting.
- **Transport & Logistics Service (`services/logistics-service/`)**: Handles transport and logistics operations, such as shipment tracking, route optimization, fleet management, and delivery scheduling.
- **Inventory Management Service (`services/inventory-service/`)**: Manages product inventory, stock levels, warehouse management, purchase orders, and stock transfers.
- **Customer Relationship Management Service (`services/crm-service/`)**: Manages customer data, sales pipeline, marketing campaigns, and customer support interactions.
- **User Service (`services/user-service/`)**: Manages user authentication, authorization, user profiles, and roles across all applications and services.
- **Tenant Service (`services/tenant-service/`)**: Manages tenant/organization accounts and their specific configurations, ensuring data isolation and customization capabilities for different clients.
- **Notification Service (`services/notification-service/`)**: Handles sending notifications (email, SMS, push notifications) for various events within the system.
- **Client Administration Service (`services/client-admin-service/`)**: An internal service for EasyCode staff to manage business client accounts, subscriptions, and configurations.
- **Project Management Service (`services/project-management-service/`)**: For planning, executing, and tracking projects, suitable for both internal EasyCode use and by clients for their own project management needs.
- **Equipment Maintenance Service (`services/equipment-maintenance-service/`)**: For managing equipment assets, scheduling preventive and corrective maintenance, tracking service history, and utilizing configurable checklists for maintenance procedures.

(Note: The list of services will evolve. Refer to the `services/` directory and individual service READMEs for the most up-to-date details.)
