# Procurement Service (@easycode/procurement-service)

This service manages the full Procure-to-Pay (P2P) lifecycle for an organization, from need identification and internal requisitioning through supplier management, sourcing, contracting, purchase order management, receiving, invoice processing coordination, and spend analytics.

## Core Scope & Key Modules

The `procurement-service` is responsible for:

-   **Purchase Requisition Management**: Handling internal requests for goods/services, including approval workflows and budget checks. Key features include customizable forms, conversion to RFx/PO, and status tracking.
-   **Supplier Relationship Management (SRM - Core)**: Managing a central database of suppliers (contacts, addresses, banking info, performance metrics, documents) and onboarding/qualification processes. This service is the primary owner of Supplier Master Data.
-   **Sourcing (RFx Management - RFP/RFQ/RFI)**: Facilitating sourcing events, supplier response submission, bid comparison, and awarding.
-   **Contract Management (Basic)**: Storing supplier contracts, linking to procurement activities, and tracking key dates and terms.
-   **Purchase Order (PO) Management**: Comprehensive management of Purchase Orders, including creation (from requisitions, sourcing, or direct), customizable templates, line items for goods/services, approval workflows, budget checks, supplier communication, and change order management. This service is the central owner of PO data.
-   **Receiving & Acceptance**: Managing Goods Receipt Notes (GRNs) and Service Acceptance Sheets (SAS) against POs, including quality inspection, discrepancy handling, and coordinating stock updates with `inventory-service`.
-   **Invoice Processing & AP Automation (Coordination Role)**: Digitally capturing supplier invoices, performing automated 2-way/3-way matching against POs and receipts, managing discrepancy resolution, and routing for internal payment approval. Approved invoices are handed off to `finance-service` for payment execution.
-   **Spend Analytics & Reporting**: Providing dashboards and reports on P2P cycle times, spend by supplier/category/department, PO vs. invoice accuracy, and supplier performance.

## Process Flexibility & Configuration

While the `procurement-service` supports a comprehensive Procure-to-Pay (P2P) lifecycle, it is designed with the understanding that not all organizations, nor all purchases, require every step to be rigidly enforced. The service offers flexibility through tenant-level configurations, allowing businesses to tailor the procurement process to their specific needs, risk tolerance, and operational efficiency goals.

Key aspects of this flexibility include:

-   **Configurable Mandatory/Optional Steps**: Tenants can define which stages of the P2P cycle are mandatory and which can be optional or conditional. For example, a formal RFx process might be mandatory for purchases over a certain value but optional for smaller, routine purchases.
-   **Value-Based Bypass Thresholds**: Thresholds can be established to allow bypassing certain steps (e.g., multi-level requisition approvals, formal sourcing events) for low-value purchases.
-   **Role-Based Permissions & Bypassing**: Specific user roles can be granted permissions to bypass certain predefined steps. For instance, a "Senior Procurement Manager" might be authorized to create Purchase Orders directly for urgent needs without a prior approved requisition, up to a certain value.
-   **Alternative Entry Points**: The system allows for different starting points in the P2P cycle based on the situation and user permissions:
    -   **Full Cycle**: Start with a Purchase Requisition, proceed through Sourcing (if needed), to Purchase Order, etc.
    -   **Direct Sourcing**: Initiate an RFx event directly if a need is already identified and sourcing is the primary first step.
    -   **Direct Purchase Order**: Create a Purchase Order directly for well-defined, routine, or urgent purchases, bypassing formal requisitioning or sourcing (subject to role permissions and value thresholds).
-   **Item/Category Specific Rules (Future Consideration)**: Future enhancements may allow for defining streamlined procurement paths for specific categories of items or services (e.g., pre-approved supplier catalogs for office supplies allowing direct PO creation by designated users).

This configurability ensures that the `procurement-service` can adapt to diverse operational models, from highly structured, compliance-driven procurement departments to more agile environments, while still providing the tools for governance and control where needed. The specific configurations will be managed by tenant administrators via the application interface.

## Key Modules & Features (Summary)

*(This section would ideally list the detailed features per module as defined in Step 3 of the plan. For brevity in this subtask prompt, we'll assume the detailed list from plan step 3 is implied here for the full README).*
- Requisition Management: Forms, approvals, budget checks, conversion.
- SRM: Supplier master, onboarding, performance, document mgt.
- Sourcing: RFx creation, supplier responses, bid comparison, awarding.
- Contract Mgt: Repository, key data tracking, linking, notifications.
- PO Mgt: Creation, templates, approvals, supplier comms, change orders.
- Receiving: GRN/SAS, quality inspection, discrepancy mgt.
- Invoice Processing: Capture, matching, discrepancy resolution, approval handoff.
- Spend Analytics: Dashboards, standard reports, custom reporting (basic).


## Key Integrations

-   **`inventory-service`**:
    -   Consumes: Item master data for requisitions/POs.
    -   Provides: Updates `inventory-service` upon goods receipt.
    -   Note: PO functionality in `inventory-service` is expected to be reduced/deprecated.
-   **`finance-service`**:
    -   Interaction: Budget validation for requisitions/POs.
    -   Provides: Approved invoices to `finance-service` for AP ledger posting and payment execution.
    -   Interaction: Synchronization or access to essential supplier payment information (as `procurement-service` owns the full SRM).
    -   Interaction: May provide tax information for POs.
-   **`user-service`**:
    -   Provides: User authentication and identity for all procurement roles.
    -   Interaction: Manages role assignments (e.g., Requisitioner, Approver, Procurement Officer) used by `procurement-service` to enforce permissions.
-   **`notification-service`**:
    -   Used for: Alerts and notifications for approvals, status changes, RFx communication, contract reminders, etc.
-   **`project-management-service` (Optional/Future)**:
    -   Interaction: Linking requisitions/POs to projects for cost tracking.

*(Full API details and data models to be documented separately or expanded here later.)*
```
