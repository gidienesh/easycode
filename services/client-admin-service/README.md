# Client Administration Service (@easycode/client-admin-service)

**INTERNAL SERVICE**

This service is used by EasyCode internal staff to manage business clients (i.e., companies that purchase EasyCode software solutions). It is NOT for use by the clients themselves or their end-users.

## Core Responsibilities
- Onboarding new business clients.
- Managing client accounts, including company information, primary contacts, and status.
- Handling client subscriptions, service tiers, and feature entitlements.

  ### Service/Module Entitlement Configuration

  EasyCode administrators can configure specific service and major module access for each client company (tenant).

  -   **Service Access Toggles**: The system provides an interface to enable or disable access to individual microservices (e.g., `crm-service`, `inventory-service`) for a client company.
  -   **Major Module Access (Optional)**: For certain complex services, access to predefined major modules within them can also be toggled.
  -   **Entitlement Packages**: Predefined packages or service plans can automatically set default entitlements, with options for overrides.
  -   **Persistence & Propagation**: These entitlement settings are saved with the client company's record and signal the `tenant-service` to update the live tenant configuration.
  -   **Audit Trails**: All changes to a client's entitlements are logged.

- Overseeing high-level configurations or customizations specific to a client's deployment.
- Storing internal notes, communication logs, or relationship history relevant to managing the client.

This service is distinct from:
- `crm-service`: Which handles pre-sales activities for potential clients.
- `user-service`: Which manages individual user identities.
- `tenant-service`: Which manages the operational environment for each client.
