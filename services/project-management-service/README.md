# Project Management Service (@easycode/project-management-service)

## 1. Service Overview

Manages project planning, execution, tracking, and collaboration. It is designed to serve two primary user groups:
1.  **EasyCode's Clients**: To manage their own internal or customer-facing projects. Data for client projects is tenant-isolated.
2.  **EasyCode Internal Staff**: To manage internal projects, such as client implementations, software development sprints, or other company initiatives.

The service helps teams organize tasks, monitor progress, manage resources, and report on project performance effectively.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Project Planning & Definition
1.  **Project Creation**: Define new projects with details such as name, description, goals, start/end dates, budget (links to `finance-service`), and project manager.
2.  **Workspace Management**: Organize projects within workspaces or portfolios for better grouping and visibility, especially for larger clients or internal departments.
3.  **Project Templates**: (Future) Create and utilize project templates for common project types to speed up setup.
4.  **Milestone Tracking**: Define and track key project milestones to mark significant achievements or phases.

### 3.2. Task Management
1.  **Task Creation**: Create tasks with detailed descriptions, assignees, due dates, priorities, and estimated effort.
2.  **Subtasks**: Break down complex tasks into smaller, manageable subtasks.
3.  **Task Assignment**: Assign tasks to one or more team members (integrates with `user-service`).
4.  **Status Updates**: Track task progress through customizable statuses (e.g., To Do, In Progress, Review, Completed).
5.  **Task Dependencies**: Define dependencies between tasks (e.g., finish-to-start, start-to-start) to manage critical paths.
6.  **Checklists**: Add checklists within tasks for granular to-do items.

### 3.3. Timeline & Schedule Management
1.  **Gantt Charts**: Visualize project timelines, task durations, dependencies, and progress using interactive Gantt charts.
2.  **Project Calendar**: View tasks, milestones, and deadlines in a calendar format.
3.  **Baseline Management**: (Future) Set project baselines to compare planned progress against actual progress.

### 3.4. Resource Management
1.  **Resource Allocation**: Assign team members to projects and tasks based on availability and skills (links to `hr-service` for roles/skills).
2.  **Workload Visibility**: (Future) View team member workloads to prevent overallocation and identify available resources.
3.  **Role Management**: Define project-specific roles and permissions.

### 3.5. Collaboration & Communication
1.  **Task Comments**: Facilitate discussions directly within tasks using comments.
2.  **File Attachments**: Attach relevant files (documents, images, mockups) to projects and tasks.
3.  **Activity Feeds**: View a chronological feed of project activities and updates.
4.  **Notifications**: Integrated with `notification-service` for updates on task assignments, status changes, comments, and deadlines.

### 3.6. Time Tracking
1.  **Manual Time Entry**: Allow users to log time spent on tasks.
2.  **Timers**: (Future) Built-in timers for real-time tracking of work.
3.  **Timesheet Management**: (Future) Consolidate time entries into timesheets for review and approval.
4.  **Reporting**: Generate reports on time spent per task, project, or user. (May integrate with `hr-service` for payroll or `finance-service` for client billing).

### 3.7. Reporting & Dashboards
1.  **Project Dashboards**: Customizable dashboards providing an overview of project status, progress, key metrics, and potential risks.
2.  **Progress Reports**: Generate reports on task completion, milestone achievement, and overall project health.
3.  **Resource Utilization Reports**: (Future) Analyze resource allocation and utilization.
4.  **Export Capabilities**: Export project data and reports to common formats (e.g., CSV, PDF).

### 3.8. Potential AI Enhancements
1.  **Project Schedule Risk Prediction**: Identify projects and tasks at risk of delays based on historical data and current progress.
2.  **Intelligent Task Assignment Suggestions**: Recommend optimal resource assignments based on skills, availability, and past performance.
3.  **Automated Project Status Summary Generation**: Draft project status summaries from progress data and key activities.
    *For more details on the overall AI strategy, see the [AI Integration Strategy](../../docs/architecture/ai-integration-strategy.md).*

## 4. Key Integration Points with Other Services

-   **`user-service`**:
    -   For user authentication and authorization, ensuring only authorized personnel can access specific projects or data.
    -   Provides user information for assigning users to projects and tasks.
    -   User roles defined in `user-service` can influence project roles and permissions.
-   **`tenant-service`**:
    -   For managing tenant-specific configurations such as custom project templates, default workflows, custom fields for tasks/projects, and ensuring strict data isolation for client projects.
-   **`finance-service`**:
    -   To link project activities with financial data. Projects can be tagged as cost centers or revenue drivers.
    -   Actual project costs (e.g., labor from time tracking, expenses) can be sent to `finance-service` for reporting and profitability analysis.
    -   Budget information for projects may be sourced from or reported to `finance-service`.
-   **`hr-service`**:
    -   Provides information about employee skills, roles, and availability for resource management purposes.
    -   Time tracking data from this service might be consumed by `hr-service` for payroll input or performance reviews.
-   **`notification-service`**:
    -   Used extensively for sending notifications to users about:
        -   Task assignments, updates, and upcoming deadlines.
        -   Comments or mentions in project discussions.
        -   Project status changes and milestone completions.
-   **`client-admin-service` / `crm-service`**:
    -   Projects might be initiated or linked based on client engagements managed in `crm-service`.
    -   For EasyCode internal projects related to client onboarding or support, `client-admin-service` might trigger project creation or provide relevant client context.
-   **Document Management Service (Future/External)**:
    -   For more robust document versioning and management, could integrate with a dedicated document service.

## 5. Frontend & UI Consumption

Provides APIs and data that can be consumed by frontend applications, potentially built using components from the shared UI library in `apps/main-ui/`, to deliver a comprehensive project management experience (e.g., task boards, Gantt charts, reporting dashboards, resource allocation views).
