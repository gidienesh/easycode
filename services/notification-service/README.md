# Notification Service (@easycode/notification-service)

## 1. Service Overview

Handles the sending and management of notifications across various channels like email, SMS, and push notifications. It serves as a centralized point for all service-to-user and, in some cases, service-to-service communications, ensuring consistency and manageability of outgoing messages.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Multi-Channel Delivery
1.  **Email**: Integration with email gateways (e.g., SendGrid, AWS SES, Postmark) to send transactional and bulk emails.
2.  **SMS**: Integration with SMS providers (e.g., Twilio, Africa's Talking, Vonage) to send text messages.
3.  **Push Notifications**: Support for sending push notifications to mobile applications (via FCM for Android, APNS for iOS) and web browsers.
4.  **In-App Notifications**: (Future) Functionality to deliver notifications directly within web or mobile applications, often stored and retrieved by the client application.
5.  **Channel Fallback**: (Future) Configure fallback strategies (e.g., if a push notification is not delivered, send an SMS).

### 3.2. Template Management
1.  **Create & Manage Templates**: Allow administrators to create, edit, and manage reusable notification templates for different channels and languages.
2.  **Variable Substitution**: Support for dynamic content using placeholder variables within templates (e.g., `{{userName}}`, `{{orderId}}`).
3.  **Rich Text & HTML**: Support for HTML content in email templates and potentially rich text for other channels.
4.  **Versioning**: (Future) Keep track of template versions.

### 3.3. Message Handling & Delivery
1.  **Queueing System**: Utilize a message queue (e.g., RabbitMQ, AWS SQS) to handle high volumes of notification requests reliably and asynchronously.
2.  **Rate Limiting & Throttling**: Implement rate limiting per user, per channel, or globally to prevent abuse and manage costs with third-party providers.
3.  **Retry Mechanisms**: Automatic retries for failed deliveries with configurable backoff strategies.
4.  **Prioritization**: (Future) Allow certain types of notifications to be prioritized in the queue.

### 3.4. Tracking, Logging & Analytics
1.  **Delivery Status Tracking**: Log the status of each notification (e.g., sent, delivered, failed, opened, clicked - where supported by the channel/provider).
2.  **Audit Trails**: Maintain logs of all notification requests and system actions for auditing and troubleshooting.
3.  **Analytics Dashboard**: (Future) Provide basic analytics on notification volume, delivery rates, open rates, etc.

### 3.5. User Preferences & Consent Management
1.  **Notification Preferences**: Allow users to specify their preferred notification channels and opt-in/opt-out of different types of notifications (e.g., marketing emails, transactional alerts).
2.  **Subscription Groups**: (Future) Manage user subscriptions to different notification categories.
3.  **Do Not Disturb (DND)**: Respect DND settings and time windows for sending notifications.
4.  **Consent Tracking**: Record user consent for receiving notifications, especially for compliance with data privacy regulations.

## 4. Key Integration Points with Other Services

The `notification-service` is primarily a utility service consumed by other services within the platform that need to send communications.

-   **`user-service`**:
    -   Provides user contact information (email addresses, phone numbers, device tokens for push notifications).
    -   Stores and retrieves user-specific notification preferences and consent settings.
-   **`tenant-service`**:
    -   May provide tenant-specific notification configurations, such as custom email templates/branding, SMS sender IDs, or default language settings.
    -   Ensures that notification policies are applied correctly within a tenant's context.

-   **All Other Business Logic Services**: These services are consumers of `notification-service`, triggering notifications based on various events. Examples include:
    -   **`crm-service`**:
        -   Sends email/SMS notifications for new lead assignments.
        -   Notifies users of upcoming appointments or follow-ups.
    -   **`finance-service`**:
        -   Sends email/SMS reminders for overdue invoices.
        -   Notifies users of payment confirmations.
    -   **`hr-service`**:
        -   Sends notifications for leave application status updates.
        -   Alerts employees about payslip availability.
        -   Distributes company-wide announcements.
    -   **`pos-service`**:
        -   Sends e-receipts via email or SMS after a transaction.
    -   **`inventory-service`**:
        -   Notifies relevant staff about low stock levels.
        -   Alerts on completion of stock transfers.
    -   **`logistics-service`**:
        -   Sends shipment status updates (e.g., "shipped," "out for delivery," "delivered") to customers.
        -   Alerts dispatchers about delivery exceptions.
    -   **`equipment-maintenance-service`**:
        -   Sends reminders for scheduled equipment maintenance.
        -   Alerts on critical equipment failures.
    -   **`client-admin-service`**:
        -   May send notifications to EasyCode staff regarding client account status changes or required actions.

## 5. Frontend & UI Consumption

Primarily a backend service, `notification-service` provides APIs for other services to send notifications. Any UI for managing templates, viewing logs, or configuring notification settings would likely be part of an administrative interface (e.g., for EasyCode super-admins or tenant admins), potentially using components from `apps/main-ui/`. User-facing notification preferences would typically be managed within the frontend of the respective application (e.g., user profile settings in `apps/main-ui` or other specific frontends).
