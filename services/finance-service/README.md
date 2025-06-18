# 🏛️ Finance & Accounting Service (`services/finance-service/`)

## Core Capabilities

The `finance-service` will be the definitive source of financial truth, responsible for the integrity and reporting of all monetary data. It will not directly handle primary operational data that belongs to other services (e.g., raw sales transactions belong to POS, detailed employee data to HR, inventory levels to Inventory). Instead, it will receive summaries or critical financial impacts from these services to update the general ledger and generate financial statements.

---

## 1. General Ledger (GL) Module

This is the bedrock of the finance-service, acting as the central repository for all financial transactions aggregated from other services.

**1.1 Chart of Accounts Management**  
Define, manage, and update the hierarchical chart of accounts, adhering to IFRS and Kenyan Companies Act requirements.

**1.2 Journal Entry Processing**  
Process and post journal entries received from other services (e.g., summarized sales from POS, payroll summaries from HR, asset depreciation from Fixed Assets sub-module) or manual adjustments. Each entry will have a full audit trail.

**1.3 Transaction Tagging & Dimensions**  
Allow tagging of transactions with dimensions like department, cost center, project (integrating with `project-management-service`), or branch for granular reporting.

**1.4 Trial Balance Generation**  
Automatically generate real-time trial balances to ensure financial accuracy.

**1.5 Multi-Currency Management**  
Handle transactions and reporting in KES and other foreign currencies, including automated exchange rate conversions and revaluation.

---

## 2. Accounts Payable (AP) Module

Manages financial obligations to vendors and suppliers, working closely with the `procurement-service`.

**2.1 Vendor Invoice Processing**  
Receive and process vendor invoices, often triggered by events from the procurement-service (e.g., goods received, services rendered). This includes automated data capture and matching.

**2.2 Payment Scheduling & Execution**  
Schedule and execute payments to vendors based on defined terms. This module initiates payment commands, potentially integrating with external banking APIs or M-Pesa.

**2.3 Withholding Tax (WHT) Management**  
Automatically calculate, track, and manage withholding tax deductions for eligible payments, generating necessary KRA reports.

**2.4 Expense Reimbursement (Integration Point)**  
Integrate with the `hr-service` for processing and reimbursing approved employee expenses, ensuring they hit the correct GL accounts.

---

## 3. Accounts Receivable (AR) Module

Manages incoming payments from customers, working with `pos-service` and `crm-service`.

**3.1 Customer Invoice Generation**  
Create and manage customer invoices, typically for services or large B2B sales not handled by POS. This might be triggered by events from CRM-service (e.g., service completion).

**3.2 Payment Receipt & Application**  
Record and apply customer payments (received via bank, M-Pesa paybill, or directly from POS-service settlements) to outstanding invoices.

**3.3 Credit Management**  
Define and manage customer credit limits and terms, potentially informed by data from the CRM-service.

**3.4 Debt Collection & Dunning**  
Automate reminders and dunning letters for overdue invoices, potentially triggering notifications via the `notification-service`.

---

## 4. Fixed Assets (FA) Module

Manages the lifecycle of the organization's tangible assets.

**4.1 Asset Register Management**  
Maintain a detailed register of all fixed assets, including acquisition date, cost, and depreciation methods.

**4.2 Depreciation Calculation**  
Automatically calculate depreciation using various methods compliant with Kenyan tax regulations, posting corresponding journal entries to the GL.

**4.3 Asset Disposal Management**  
Manage the disposal of assets, including calculations for gains or losses. This might link with `equipment-maintenance-service` for asset status.

---

## 5. Reporting & Business Intelligence (BI) Module

Provides the crucial interface for financial analysis and compliance reporting.

**5.1 Standard Financial Reports**  
Generate comprehensive Balance Sheets, Income Statements, and Cash Flow Statements.

**5.2 Custom Report Builder**  
Allow users to build custom financial reports using data from the GL and other aggregated financial summaries.

**5.3 Customizable Dashboards**  
Create personalized dashboards with key financial performance indicators.

**5.4 Budget vs. Actual Analysis**  
Compare actual financial performance against budgets set within this module or received from an external planning tool.

**5.5 Regulatory & Tax Reporting**  
Generate pre-formatted reports required by KRA (e.g., VAT 3, P9A summaries from HR, WHT certificates).

---

## 🤝 Key Integration Points with Other Services

The `finance-service` thrives on its ability to integrate seamlessly with the other micro-services in your monorepo. Here's how it would typically interact:

**From `pos-service`**  
Receives summarized daily/weekly sales and payment reconciliation data for revenue recognition and cash ledger updates. It won't get every single line item transaction.

**From `hr-service`**  
Receives payroll summaries (total salaries, PAYE, NSSF, NHIF, net pay, etc.) for posting to the GL. It won't manage individual employee records or detailed payroll calculations.

**From `logistics-service`**  
Might receive cost summaries related to freight, fuel, or vehicle maintenance for specific projects or cost centers.

**From `inventory-service`**  
Receives cost of goods sold (COGS) summaries as inventory is sold, and potentially inventory valuation adjustments. It won't track individual stock movements.

**From `crm-service`**  
Triggers invoice generation for services/subscriptions or provides customer credit information.

**From `user-service`**  
Handles user authentication and authorization for access to financial data and functionalities within the finance-service.

**From `tenant-service`**  
Provides tenant-specific configurations for financial reporting, chart of accounts, and currency settings.

**From `notification-service`**  
Triggers financial notifications like overdue payment reminders (for AR), payment confirmations, or reporting alerts.

**From `project-management-service`**  
Provides project codes and cost allocation rules for tracking project-specific revenues and expenses within the GL.

**From `equipment-maintenance-service`**  
Might provide maintenance cost summaries for specific assets, which the finance-service would then expense.

**From `procurement-service`**  
Receives approved purchase orders and goods receipt confirmations to initiate invoice processing in AP. It manages the financial implications of procurement, not the operational workflow.
