# Point of Sale (POS) Service (@easycode/pos-service)

## 1. Service Overview

Manages point-of-sale operations, including cart management, transaction processing (sales, returns, exchanges), payment integration, receipt generation, session management, and integration with payment gateways, hardware, inventory, customer, and finance systems. It is designed to be versatile, configurable, and support robust offline capabilities.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem. The POS client application itself might be a Next.js application or utilize specific frontend technologies suited for POS hardware.

## 3. Core Features and Capabilities

### 3.1. Core POS Operations
1.  **Transaction Processing**:
    1.1. **Sales**: Item addition (via scan, manual entry, or quick buttons), quantity adjustment, price overrides (permission-based), discount application (item/cart level), and comprehensive tax calculation.
    1.2. **Returns & Exchanges**: Processing returns with or without an original receipt (based on configurable policies), managing refund processing, and handling exchanges as a combination of return and new sale.
    1.3. **Payment Processing**: Support for multiple payment types including Cash, Card (EMV, tokenization), Gift Cards, Loyalty Points, Digital Wallets, and On-Account Sales. Enables split payments across different types.
    1.4. **Order Management**: Includes layaway/on-account sales management (deposits, payments, fulfillment).
2.  **Product Information & Pricing**:
    2.1. Integrates with `inventory-service` (or a central catalog) for detailed product information.
    2.2. Provides condensed product data for offline POS client use.
    2.3. Real-time stock checks when online; advisory or last-synced stock information when offline.
    2.4. Accurate tax calculation via `finance-service` integration or an internal tax module.
3.  **Receipt Management**:
    3.1. Generation of digital and printable receipts with a standard JSON-based data structure.
    3.2. Supports tenant-configurable receipt templates (header, footer, line items, promotional messages, branding).
    3.3. Dispatches email/SMS receipts via the `notification-service`.
4.  **Session Management (End-of-Day Reconciliation)**:
    4.1. Shift open and close procedures, functional even when offline.
    4.2. Cash drawer reconciliation, including offline transactions once they are synced.
    4.3. Generation of X/Z reports, consolidating online and synced offline transaction data.

### 3.2. Offline Capability (Store-and-Forward Architecture)
1.  **Client-Side Database (IndexedDB/SQLite)**:
    1.1. Stores essential data locally: products, pricing, basic customer information, ongoing transaction carts, and a log of completed offline transactions.
    1.2. Manages a synchronization queue status for all offline transactions.
2.  **Synchronization Mechanism**:
    2.1. **Data Seeding & Updates**: Client fetches necessary data from the server upon initial connection and receives delta updates to minimize data transfer.
    2.2. **Offline Transaction Queueing**: Transactions completed while the POS client is offline are securely logged locally.
    2.3. **Secure Upload & Server Processing**: Queued offline transactions are sent to the server in batches upon reconnection. The server acknowledges receipt and processes these transactions, including conflict resolution.
    2.4. **Conflict Resolution**: Implements strategies for handling discrepancies in inventory, pricing, promotions, and customer data that may arise between the time of an offline sale and server synchronization.
3.  **Supporting Server Endpoints**: Dedicated endpoints for data seeding to offline clients and for receiving queued offline transactions.

### 3.3. Configuration Model (Tenant-Specific Customization)
1.  **UI Customization Support**: Backend stores preferences enabling frontend UI flexibility (e.g., quick access grids, screen layout profiles, basic branding elements).
2.  **Payment Methods Configuration**: Tenants can define active payment types, link them to specific payment gateway configurations, and set properties (e.g., surcharges, automatic cash drawer opening).
3.  **Receipt Template Management**: CRUD operations for multiple, customizable receipt templates per tenant.
4.  **Tax Configuration**: Integrates with a central tax service or module; POS stores default tax zones and display preferences.
5.  **Discount & Promotion Engine**: Supports tenant-defined discounts (item/cart level, percentage/fixed amount, BOGO, tiered discounts) and promotions (duration, conditions, coupon codes), evaluated by a rule engine.
6.  **Hardware Profiles**: Server-side storage of configurations for various POS hardware setups (e.g., printers, scanners, payment terminals).

### 3.4. Modules/Features for Key Business Verticals
1.  **Retail Module**:
    1.1. Advanced inventory lookups (multi-store online, last-synced offline).
    1.2. Enhanced barcode handling, variant selection, and serial number tracking.
    1.3. Layaway management workflow.
    1.4. Gift registry features (optional).
    1.5. Loyalty program integration (points earning/redemption, tier recognition).
2.  **Grocery Module**:
    2.1. Weighted item processing (scale integration).
    2.2. EBT/SNAP payment type handling.
    2.3. Efficient PLU management.
    2.4. Bottle deposit/return processing (regional compliance).
3.  **Restaurant (QSR & FSR) Module**:
    3.1. Kitchen Display System (KDS) integration (API/event-based).
    3.2. Order modifiers with price adjustments.
    3.3. Combo meal definition and processing.
    3.4. **FSR Specifics**: Table management (layouts, status, order assignment), course management/order firing, bill splitting (by item, evenly, by seat), and tip management/reporting.
4.  **Service-Based Business Module (Salons, Repairs, etc.)**:
    4.1. Appointment/booking system integration (API-based).
    4.2. Service provider tracking per line item (for commissions/tracking).
    4.3. Consumption of parts/retail products from `inventory-service` during a service.
    4.4. Package/series sales and redemption tracking.

## 4. API and Extensibility Strategy

### 4.1. Core API Design (RESTful/GraphQL)
1.  Resource-oriented endpoints for terminals, transactions, products (proxied), offline sync, and promotions.
2.  Secured with JWT, tenant-aware, and supports fine-grained permissions.
3.  Standard HTTP status codes and idempotency support for critical operations.

### 4.2. Webhook Events
1.  Emits events for key POS actions (e.g., `sale.completed`, `shift.closed`, `offline_transactions.synced`) to a message broker or HTTP endpoints for decoupled integration.
2.  Events use well-defined, versioned JSON payloads.

### 4.3. Headless POS Support
1.  The backend is designed with comprehensive APIs to support diverse frontend applications (web, native mobile, kiosks) independently of the UI.
2.  API documentation will be provided in OpenAPI/Swagger format.

### 4.4. Plugin/Extension Model (Long-Term)
1.  Consideration for a future lightweight plugin architecture to allow for highly specific customizations (e.g., unique payment gateways, niche loyalty systems) via defined extension points.

### 4.5. API Versioning
1.  APIs will be versioned (e.g., `/api/v1/...`) to manage evolution and ensure backward compatibility where appropriate.

## 5. Key Integration Points with Other Services

-   **`user-service`**: For cashier/staff authentication, authorization, and role-based access control to POS functionalities.
-   **`tenant-service`**: For tenant-specific POS configurations, including store locations, tax rules, receipt templates, payment gateway settings, and feature flags.
-   **`inventory-service`**:
    -   Real-time product information lookups (description, price, variants).
    -   Real-time stock availability checks before finalizing a sale.
    -   Updates stock levels in `inventory-service` after each completed sale or return.
-   **`finance-service`**:
    -   Sends summarized sales, payment, and tax data for end-of-day reconciliation and general ledger posting.
    -   May integrate for on-account sales and customer credit checks.
    -   Provides or validates tax calculation rules.
-   **`crm-service`**:
    -   Customer lookup for associating sales with customer accounts.
    -   Retrieves customer loyalty information (e.g., points balance, tier) and updates it after transactions.
-   **`notification-service`**: For sending digital receipts to customers via email or SMS.
-   **Payment Gateway Services (External)**: For processing card payments, digital wallet transactions, and other electronic payments.
-   **Specialized Hardware Systems (External)**: Integrations with KDS (for restaurants), booking systems (for service businesses), scales (for grocery), etc., often specific to business verticals.

## 6. Frontend & UI Consumption

The POS client application is a critical interface and might be a specialized Next.js application or use other frontend technologies suitable for POS devices. It may consume shared components from `apps/main-ui/` for non-transactional views (e.g., settings, reports) or administrative functions. The core transaction UI will be highly optimized for speed and specific POS hardware.

## 7. Potential AI Enhancements

AI features planned for the `pos-service` aim to optimize sales, reduce risk, and improve local operational insights:
-   **Dynamic Pricing/Personalized Promotion Suggestions**: Real-time offers at the point of sale.
-   **Real-Time Transaction Fraud Detection**: To flag and manage suspicious transactions.
-   **AI-Assisted Demand Forecasting (Local)**: To predict item demand for specific POS locations, aiding inventory management.

*For more details on the overall AI strategy and infrastructure, see the [AI Integration Strategy](../../docs/architecture/ai-integration-strategy.md).*
