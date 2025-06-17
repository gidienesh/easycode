# API Design Guidelines for List Endpoints

This document outlines architectural standards for backend APIs related to serving list data, primarily to support rich data grid functionality in frontend applications. These standards are intended to ensure consistency across microservices and provide a good developer/user experience.

To effectively support responsive, sortable, filterable, and customizable data grids, all backend microservices exposing list-based resources (e.g., `/invoices`, `/products`, `/users`) MUST adhere to the following API patterns:

## 1. Pagination

A consistent pagination strategy must be implemented for all endpoints returning collections of resources.

-   **Strategy**: Offset-based pagination is recommended for initial simplicity.
    -   `?page=<number>`: The page number to retrieve (e.g., `1`, `2`, ...). Defaults to `1`.
    -   `?pageSize=<number>`: The number of items per page (e.g., `10`, `25`, `50`). Defaults to a system-wide standard (e.g., `25`). Max limit should be enforced (e.g., `100`).
-   **Response Format**: Paginated responses MUST include pagination metadata alongside the data array.
    ```json
    {
      "data": [
        // ... array of resource items ...
      ],
      "pagination": {
        "currentPage": 1,
        "pageSize": 25,
        "totalItems": 123,
        "totalPages": 5
      }
    }
    ```
-   **Cursor-based pagination** may be considered for resources requiring infinite scroll or very large datasets with rapidly changing data, but offset-based is the default expectation.

## 2. Sorting

Endpoints returning lists MUST allow clients to specify sorting criteria.

-   **Query Parameters**:
    -   `?sortBy=<fieldName>`: The name of the field to sort by (e.g., `createdAt`, `name`, `status`). Services should document which fields are sortable for each resource.
    -   `?sortOrder=<asc|desc>`: The sort order. Defaults to `asc` (ascending) or a sensible default for the resource (e.g., `desc` for `createdAt`).
-   **Example**: `GET /api/invoices?sortBy=dueDate&sortOrder=desc`
-   **Multiple Field Sorting**: (Optional Advanced) Consider allowing sorting by multiple fields, e.g., `?sortBy=status,dueDate&sortOrder=asc,desc`.

## 3. Filtering

Endpoints returning lists MUST allow filtering based on resource fields.

-   **Query Parameter Syntax**:
    -   Direct match: `?<fieldName>=<value>` (e.g., `?status=pending_approval`)
    -   Operators for non-exact matches: Use a consistent suffix or bracket notation for operators. Suffixes are often simpler:
        -   `_eq`: Equals (often implicit, same as `?<fieldName>=<value>`)
        -   `_neq`: Not equals
        -   `_lt`: Less than
        -   `_lte`: Less than or equal to
        -   `_gt`: Greater than
        -   `_gte`: Greater than or equal to
        -   `_like`: Contains string (case-insensitive by default, or offer `_ilike`). Use wildcard conventions if supported by backend search (e.g., `%value%`).
        -   `_in`: Value is in a comma-separated list (e.g., `?status_in=pending,approved`). Backend parses string to array.
        -   `_nin`: Value is not in a list.
        -   `_isNull`: Field is null (e.g., `?assignee_isNull=true`).
        -   `_isNotNull`: Field is not null.
-   **Examples**:
    -   `GET /api/tasks?status_eq=completed&priority_gte=3`
    -   `GET /api/products?name_like=Pro&category_in=electronics,books`
    -   `GET /api/purchase-orders?created_at_gte=2023-01-01&created_at_lte=2023-01-31`
-   **Documenting Filters**: Each service MUST document the filterable fields and supported operators for its list endpoints.
-   **Security**: Be cautious with overly complex filtering capabilities that could lead to performance issues or security vulnerabilities (e.g., filtering on sensitive fields not intended for direct query).

## 4. Common Data Actions

Beyond basic CRUD and listing, users often need to perform actions like downloading or sharing data presented in grids or views. APIs should be designed to support these actions effectively.

### a. Download/Export Data (Server-Side Generation)

This functionality allows users to download comprehensive datasets, potentially spanning all pages of a data grid, respecting applied filters and sort order. The backend is responsible for generating the file in the requested format.

-   **Common Formats**:
    -   CSV (`text/csv`)
    -   Excel (XLSX - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)
    -   PDF (`application/pdf` - often for printable views rather than raw data)

-   **API Design Strategies**:

    -   **Synchronous Download (for smaller datasets)**:
        -   Endpoint: `GET /api/{resource}/export?format=<csv|xlsx|pdf>&{filterParams}&{sortParams}`
        -   Behavior: The server generates the file directly and streams it back in the HTTP response with appropriate `Content-Type` and `Content-Disposition: attachment; filename="export.csv"` headers.
        -   Use Cases: Suitable for exports that can be generated quickly (e.g., within a few seconds).
        -   Considerations: Request timeouts for longer-running exports.

    -   **Asynchronous Download (for large datasets or complex reports)**:
        -   This approach prevents request timeouts and allows users to continue working while the export is prepared.
        1.  **Initiate Export Job**:
            -   Endpoint: `POST /api/{resource}/export-jobs`
            -   Request Payload: `{ "format": "xlsx", "filters": { ... }, "sortBy": "...", "sortOrder": "..." }`
            -   Response: `{ "jobId": "unique_export_job_id", "status": "queued" }` (HTTP 202 Accepted)
        2.  **Poll Job Status (optional, or use webhooks/notifications)**:
            -   Endpoint: `GET /api/export-jobs/{jobId}`
            -   Response: `{ "jobId": "...", "status": "queued|processing|completed|failed", "progress": "%", "downloadUrl": null | "..." }`
        3.  **Download File (once completed)**:
            -   Endpoint: `GET /api/export-jobs/{jobId}/download` (or use the `downloadUrl` from status response).
            -   Behavior: Streams the generated file.
        -   Considerations: Job queue management, storage for generated files (temporary), cleanup of old files/jobs, notifying user upon completion (e.g., via `notification-service` or client-side polling).

-   **General Considerations**:
    -   **Filtering & Sorting**: Export APIs MUST respect the same filtering and sorting parameters as the corresponding list view APIs to ensure data consistency between what is seen and what is downloaded.
    -   **Security**: Ensure that users can only export data they are authorized to access.
    -   **Resource Utilization**: Be mindful of server resources for generating large or complex exports. Implement appropriate safeguards.

### b. Share Data

Sharing data can take various forms, with different implications for backend involvement.

-   **Primary Current Approach: Client-Side Generation & Dispatch of Local View Data**
    -   **Context**: User intends to share the data currently visible or loaded in their client-side application (e.g., the current page of a data grid, a rendered chart, or a specific report view).
    -   **Mechanism**:
        1.  The frontend application utilizes its existing local data state.
        2.  Client-side JavaScript libraries are employed to generate the desired file format (e.g., generating a PDF from HTML, creating a CSV from a JSON array). This is feasible for moderately sized local datasets.
        3.  The frontend then uses browser capabilities (e.g., `navigator.share()` Web API if available and supported) or constructs protocol links (e.g., `mailto:`, `whatsapp://send?text=...`) to initiate the sharing of the client-generated file or data snippet.
    -   **Backend Role**: The backend's primary role in this scenario is to have accurately served the data to the client via the standard list APIs (with pagination, filtering, sorting). No specific backend "share" API endpoint is directly invoked for *this type* of client-side sharing action.
    -   **UI/UX Note**: The user interface should clearly indicate that this method shares the "current view" or "locally available data," which might be a subset of the total dataset available on the server.

-   **Potential Future Server-Side Sharing Mechanisms (or for specific use cases)**:

    -   **Share via Email (using `notification-service`)**:
        -   **Use Case**: Sending a standardized report or data snapshot directly from the application, potentially with an audit trail.
        -   **API Example**: `POST /api/{resource}/{resource_id_or_identifier}/share-by-email`
        -   **Request Payload**: `{ "recipient_email": "user@example.com", "subject": "Shared Data: [Resource Name]", "message": "Please find the requested data attached or linked.", "format_preference": "pdf" (optional, implies server-side generation) }`
        -   **Backend Action**: The backend service would generate a representation of the resource (this might involve the "Download/Export" mechanism to create a file) or a link to a secure view, and then instruct `notification-service` to send an email with this content.

    -   **Generating Secure Sharable Links (to specific views/reports/resources)**:
        -   **Use Case**: Allowing a user to generate a unique link that can be shared with others (internal or external, depending on permissions) to view a specific piece of data or report.
        -   **API Example**: `POST /api/{resource}/{resource_id}/generate-share-link?expires_in=7d`
        -   **Backend Action**: Generates a unique, possibly time-limited, and permission-aware token or link. Accessing this link would then resolve to the specific resource, with the backend enforcing appropriate access controls. This is a more complex feature requiring careful security design.

Choosing the appropriate "Share" mechanism depends on the specific requirements regarding data scope (local view vs. full dataset), security, auditability, and desired user experience.
```
