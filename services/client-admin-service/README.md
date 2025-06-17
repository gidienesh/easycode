# Client Administration Service (@easycode/client-admin-service)

**INTERNAL SERVICE**

This service is used by EasyCode internal staff to manage business clients (i.e., companies that purchase EasyCode software solutions). It is NOT for use by the clients themselves or their end-users.

## Core Responsibilities
- Onboarding new business clients.
- Managing client accounts, including company information, primary contacts, and status.
- Handling client subscriptions, service tiers, and feature entitlements.
- Overseeing high-level configurations or customizations specific to a client's deployment.
- Storing internal notes, communication logs, or relationship history relevant to managing the client.

This service is distinct from:
- `crm-service`: Which handles pre-sales activities for potential clients.
- `user-service`: Which manages individual user identities.
- `tenant-service`: Which manages the operational environment for each client.
