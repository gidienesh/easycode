# Finance Service (@easycode/finance-service)

This service is responsible for managing core financial operations, including general ledger, accounts payable/receivable, financial reporting, budgeting, tax management, and asset accounting.

## Core Responsibilities

-   **General Ledger (GL)**: Maintaining the chart of accounts, recording all financial transactions, and managing journal entries.
-   **Accounts Receivable (AR)**: Managing customer invoices, tracking payments received, and handling collections.
-   **Financial Reporting**: Generating key financial statements (Balance Sheet, Income Statement, Cash Flow Statement) and supporting internal management reporting.
-   **Tax Management**: Calculating, collecting, and remitting taxes (sales tax, VAT, etc.). Integration with tax data providers.
-   **Asset Accounting**: Tracking fixed assets, depreciation, and disposals.

### Accounts Payable (AP) & Invoice Processing

The Accounts Payable module in `finance-service` is responsible for the final stages of invoice processing and payment execution.
-   **Invoice Intake**: `finance-service` receives digitally captured, matched, and internally approved supplier invoices from the `procurement-service`.
-   **AP Ledger Posting**: Approved invoices are recorded in the Accounts Payable ledger.
-   **Payment Execution**: Manages the scheduling and execution of payments to suppliers based on due dates and payment terms.
-   **Reconciliation**: Handles bank reconciliation for payments made.

### Supplier/Vendor Management (Payment Focus)

While the comprehensive Supplier Relationship Management (SRM), including detailed supplier profiles and onboarding, is managed by the `procurement-service` (which owns the Supplier Master Data), `finance-service` maintains essential vendor information required for payment processing.
-   **Vendor Payment Records**: Stores and manages critical vendor data such as legal name, tax IDs, and bank account details for payment execution.
-   **Data Synchronization**: This information is synchronized from or made accessible by `procurement-service` upon supplier approval/update to ensure consistency and security for financial transactions.

### Budget Management & Control
-   `finance-service` provides an API for other services, like `procurement-service`, to validate budget availability for expenditures such as purchase requisitions and POs. It can also record commitments against these budgets.
-   Manages overall budget definition, allocation to departments/cost centers, and tracking of actuals vs. budget.

## Key Integrations

-   **`procurement-service`**: Receives approved invoices for AP processing. Synchronizes essential vendor payment data. Provides budget validation for requisitions/POs.
-   **`inventory-service`**: For inventory valuation data and Cost of Goods Sold (COGS) calculation.
-   **`pos-service`**: For end-of-day financial postings, sales revenue, and payment reconciliation.
-   **`hr-service`**: For payroll processing and related financial entries.
-   **`crm-service`**: For customer billing information and revenue recognition.
-   **`user-service`**: For user roles and permissions related to financial approvals and access.
-   **Banks & Payment Gateways**: For payment processing and bank statement reconciliation.

*(Detailed API specifications and data models will be documented separately.)*
```
