# Procurement Service (@easycode/procurement-service)

## 1. Service Overview

Manages the complete procure-to-pay (P2P) lifecycle, including purchase requisitions, supplier management, sourcing, purchase orders, goods receipt, and invoice matching. It aims to streamline procurement processes, enhance spend visibility, and ensure compliance.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Purchase Requisition Management
1.  **Internal Requests**: Handling internal requests for goods and services.
2.  **Customizable Forms**: Allow creation of requisition forms tailored to different needs.
3.  **Approval Workflows**: Configurable, multi-level approval workflows based on factors like value, department, or item category.
4.  **Budget Control Integration**: Real-time or near real-time budget checks against `finance-service` before approval.
5.  **Status Tracking**: Full visibility into the status of requisitions (e.g., pending approval, approved, rejected, PO created).
6.  **Conversion to RFx/PO**: Approved requisitions can be converted into sourcing events (RFx) or directly into Purchase Orders.

### 3.2. Supplier Relationship Management (SRM)
1.  **Supplier Master Data**: Central repository for all supplier information, including contacts, addresses, banking details, tax IDs, and certifications. This service is the primary owner of Supplier Master Data.
2.  **Supplier Onboarding & Qualification**: Workflow for onboarding new suppliers, including document submission, review, and approval.
3.  **Performance Tracking**: (Future) Mechanisms to track and evaluate supplier performance based on delivery times, quality, and other metrics.
4.  **Document Management**: Store supplier-related documents (contracts, compliance certificates, NDAs).

### 3.3. Sourcing (RFx Management)
1.  **RFx Creation**: Support for creating Requests for Information (RFI), Requests for Quotation (RFQ), and Requests for Proposal (RFP).
2.  **Supplier Response Portal**: (Future) A portal for suppliers to view RFx documents and submit their responses/bids securely.
3.  **Bid Comparison & Analysis**: Tools to compare supplier responses and bids based on predefined criteria.
4.  **Awarding**: Process for awarding contracts or POs to selected suppliers.

### 3.4. Contract Management (Basic)
1.  **Contract Repository**: Central storage for supplier contracts.
2.  **Key Data Tracking**: Track key contract terms, expiry dates, and renewal notifications.
3.  **Link to Procurement Activities**: Associate contracts with specific POs or sourcing events.

### 3.5. Purchase Order (PO) Management
1.  **PO Creation**: Generate Purchase Orders from approved requisitions, sourcing events, or directly (with appropriate permissions).
2.  **Customizable PO Templates**: Support for tenant-specific PO templates with branding and legal text.
3.  **Line Items**: Detailed line items for goods or services, including quantities, pricing, and delivery dates.
4.  **Approval Workflows**: Configurable approval workflows for POs.
5.  **Budget Adherence**: Ensure POs align with approved budgets (integration with `finance-service`).
6.  **Supplier Communication**: Dispatch POs to suppliers (potentially via `notification-service` or direct email).
7.  **Change Order Management**: Process for managing amendments or cancellations to existing POs, including versioning and re-approval.

### 3.6. Receiving & Acceptance (Goods Receipt Note - GRN)
1.  **Goods Receipt Notes (GRN)**: Record the receipt of goods against Purchase Orders.
2.  **Service Acceptance Sheets (SAS)**: Record the acceptance of services rendered.
3.  **Partial & Full Receipts**: Support for recording partial deliveries or service completions.
4.  **Quality Inspection**: (Optional) Workflow steps for quality inspection and acceptance/rejection of received goods.
5.  **Discrepancy Handling**: Manage discrepancies between POs and received goods/services (e.g., quantity, quality).
6.  **Inventory Update Coordination**: Notifies `inventory-service` to update stock levels upon goods receipt.

### 3.7. Invoice Processing & Matching (Coordination Role)
1.  **Supplier Invoice Capture**: Digital capture of supplier invoices.
2.  **Automated Matching (2-way/3-way)**:
    2.1. **2-Way Matching**: Matches invoice details against Purchase Order information.
    2.2. **3-Way Matching**: Matches invoice details against both Purchase Order and Goods Receipt Note (GRN) / Service Acceptance Sheet (SAS) information.
3.  **Discrepancy Resolution**: Workflow for managing and resolving discrepancies found during matching.
4.  **Approval Routing**: Route matched and verified invoices for internal payment approval.
5.  **Handoff to Finance**: Approved invoices are handed off to `finance-service` for AP ledger posting and payment execution.

### 3.8. Spend Analytics & Reporting
1.  **Dashboards**: Visual overview of key procurement metrics (e.g., spend by category, supplier performance).
2.  **Standard Reports**: Pre-built reports on P2P cycle times, PO vs. invoice accuracy, spend analysis.
3.  **Custom Reporting**: (Basic) Ability to generate custom reports based on available data.

### 3.9. Process Flexibility & Configuration
This service supports a comprehensive P2P lifecycle but allows for flexibility:
1.  **Configurable Mandatory/Optional Steps**: Tenants define which stages are mandatory.
2.  **Value-Based Bypass Thresholds**: Low-value purchases may bypass certain steps.
3.  **Role-Based Permissions & Bypassing**: Specific roles may be authorized to bypass predefined steps.
4.  **Alternative Entry Points**: Allow starting from Requisition, Sourcing, or direct PO based on permissions and needs.

## 4. Key Integration Points with Other Services

-   **`user-service`**:
    -   For user authentication and authorization of all personnel interacting with the procurement system (e.g., requisitioners, approvers, procurement officers, finance staff).
    -   Manages role assignments that `procurement-service` uses to enforce permissions and workflows.
-   **`tenant-service`**:
    -   For managing tenant-specific procurement policies, approval workflows, supplier onboarding criteria, RFx templates, and other configurations.
    -   Ensures data isolation and customization per tenant.
-   **`inventory-service`**:
    -   Consumes item master data (SKUs, descriptions, specifications) from `inventory-service` when creating requisitions or purchase orders for stockable goods.
    -   Notifies `inventory-service` upon goods receipt (via GRN) to update stock levels.
-   **`finance-service`**:
    -   Integrates for budget validation during requisition and PO approval stages.
    -   Sends approved and matched supplier invoices to `finance-service` for posting to the Accounts Payable ledger and subsequent payment execution.
    -   May synchronize or access essential supplier payment information and status.
    -   May receive tax information/codes from `finance-service` for accurate PO generation.
-   **`notification-service`**:
    -   Used for sending alerts and notifications throughout the P2P cycle, including:
        -   Requisition/PO approval requests and status changes.
        -   RFx event communication to suppliers.
        -   Contract expiry reminders.
        -   Notifications of goods receipt or invoice discrepancies.
-   **`project-management-service` (Optional/Future)**:
    -   For linking requisitions and purchase orders to specific projects, enabling project-based cost tracking and budget management.

## 5. Frontend & UI Consumption

Provides APIs and data that can be utilized by frontend applications, potentially built using components from the shared UI library in `apps/main-ui/`, for tasks such as creating and managing requisitions, purchase orders, supplier onboarding, and viewing procurement analytics.
