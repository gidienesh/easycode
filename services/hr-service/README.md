# HR Service (@easycode/hr-service)

## 1. Service Overview

Manages human resources functionalities like employee data management, payroll processing, leave management, and recruitment. It serves as the central system for all employee-related information and processes within an organization.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Employee Data Management
1.  **Employee Profiles**: Comprehensive records for each employee including personal details, contact information, job roles, reporting lines, and emergency contacts.
2.  **Document Management**: Securely store and manage employee-related documents (e.g., contracts, ID scans, performance reviews, certifications).
3.  **Contract Management**: Track employment contract details, renewals, and amendments.
4.  **Onboarding & Offboarding**: Workflow automation for employee onboarding (e.g., task lists, document submission) and offboarding processes.
5.  **Organizational Chart**: Visualize company structure and reporting relationships.
6.  **Employee Self-Service**: Allow employees to view and update their own information (subject to approval workflows).

### 3.2. Payroll Processing
1.  **Payroll Configuration**: Define pay grades, salary structures, benefits, deductions, and tax configurations compliant with local regulations (e.g., PAYE, NSSF, NHIF for Kenya).
2.  **Automated Calculations**: Calculate gross pay, deductions, taxes, and net pay for each employee.
3.  **Payslip Generation**: Generate and distribute electronic payslips to employees.
4.  **Statutory Reporting**: Prepare data for statutory returns (e.g., P9A, NSSF/NHIF reports).
5.  **Payroll History**: Maintain a secure archive of all payroll runs and employee payment records.
6.  **Integration with Time Tracking**: (Optional) Integrate with `project-management-service` or a dedicated time-tracking module for hourly employees or overtime calculations.

### 3.3. Leave Management
1.  **Leave Policy Configuration**: Define various leave types (e.g., annual, sick, maternity, paternity) with accrual rules and entitlement policies.
2.  **Leave Application & Approval**: Employees can apply for leave, which then goes through configurable approval workflows (e.g., manager approval).
3.  **Leave Balance Tracking**: Automatically track and display leave balances for employees and managers.
4.  **Company Holiday Calendars**: Manage public holidays and company-specific non-working days.
5.  **Reporting**: Generate reports on leave taken, balances, and trends.

### 3.4. Recruitment & Applicant Tracking System (ATS) - (Basic)
1.  **Job Requisition**: Create and manage job openings.
2.  **Candidate Management**: Track applicants through various stages of the recruitment process (e.g., applied, screened, interviewed, offered, hired).
3.  **Interview Scheduling**: Basic tools to help schedule interviews.
4.  **Offer Management**: Manage job offers and candidate acceptance.
    *(Note: For advanced recruitment, a dedicated `recruitment-service` might be considered in the future).*

### 3.5. Performance Management (Lite)
1.  **Goal Setting**: Allow setting and tracking of employee performance goals.
2.  **Performance Reviews**: Basic framework for conducting performance reviews.
    *(Note: For comprehensive performance management, a dedicated module or service might be developed).*

## 4. Key Integration Points with Other Services

-   **`user-service`**:
    -   Crucial for employee authentication and authorization.
    -   HR records are linked to user accounts in `user-service`, enabling employees to access self-service functionalities.
    -   User roles defined in `user-service` (e.g., employee, manager, HR admin) control access to HR data and features.
-   **`tenant-service`**:
    -   Manages tenant-specific HR policies, configurations (e.g., leave types, payroll rules, working days), and ensures data isolation.
-   **`finance-service`**:
    -   Sends summarized payroll data (total salaries, taxes, deductions per cost center/department) to `finance-service` for posting to the General Ledger.
    -   Processes approved employee expense reimbursements by sending data to `finance-service`.
-   **`notification-service`**:
    -   Used to send various HR-related notifications:
        -   Leave application status (submitted, approved, rejected).
        -   Payroll processing completion and payslip availability.
        -   Onboarding tasks and reminders.
        -   Contract renewal reminders.
        -   Performance review reminders.
-   **`project-management-service` (Optional)**:
    -   If employees track time against projects, `hr-service` might consume this data for payroll calculations (especially for hourly workers or overtime).

## 5. Frontend & UI Consumption

Provides APIs and data structures that can be consumed by frontend applications, potentially built using components from the shared UI library in `apps/main-ui/`, to deliver a consistent user experience for HR functionalities (e.g., employee self-service portal, manager dashboards, HR admin panels).
