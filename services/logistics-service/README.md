# Logistics Service (@easycode/logistics-service)

## 1. Service Overview

Manages transport and logistics operations, such as shipment tracking, route optimization, fleet management, and delivery scheduling. This service aims to streamline and optimize the movement of goods, whether for internal transfers, customer deliveries, or other logistical needs.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Shipment Management
1.  **Shipment Creation**: Plan and create shipments, linking them to sales orders (from `pos-service` or `crm-service`), transfer orders (from `inventory-service`), or other sources.
2.  **Shipment Consolidation**: (Future) Group multiple orders or items into consolidated shipments to optimize transport.
3.  **Label Generation**: Generate shipping labels with necessary information (addresses, tracking numbers, barcodes).
4.  **Status Tracking**: Real-time tracking of shipment status (e.g., pending, in-transit, out for delivery, delivered, delayed, returned).
5.  **Proof of Delivery (POD)**: Capture proof of delivery, including digital signatures, photos, and notes.
6.  **International Shipping**: (Future) Support for customs documentation and international shipping requirements.

### 3.2. Route Planning & Optimization
1.  **Manual Route Planning**: Allow dispatchers to manually plan routes and assign shipments to vehicles/drivers.
2.  **Automated Route Optimization**: (Future) Utilize algorithms to calculate the most efficient routes based on factors like distance, traffic, delivery windows, vehicle capacity, and priority.
3.  **Multi-Stop Routing**: Plan routes with multiple drop-off or pick-up points.
4.  **Real-time Adjustments**: (Future) Ability to dynamically adjust routes based on real-time conditions (e.g., traffic, new urgent orders).

### 3.3. Fleet Management
1.  **Vehicle Registry**: Maintain a database of all vehicles in the fleet, including details like registration, capacity, type, and current status.
2.  **Driver Management**: Assign drivers to vehicles and track driver availability and performance.
3.  **Telematics Integration**: (Future) Integrate with GPS tracking and telematics systems for real-time vehicle location, speed, and diagnostics.
4.  **Maintenance Scheduling Integration**: Link with `equipment-maintenance-service` to track vehicle maintenance schedules and status, ensuring fleet availability.
5.  **Fuel & Expense Tracking**: (Future) Basic tracking of fuel consumption and other vehicle-related expenses.

### 3.4. Delivery Scheduling & Dispatch
1.  **Delivery Windows**: Manage preferred delivery windows for customers.
2.  **Automated Dispatch**: (Future) Automatically assign deliveries to the most suitable driver/vehicle based on route, location, and availability.
3.  **Manual Dispatch**: Allow dispatchers to manually assign and manage deliveries.
4.  **Driver Mobile App Support**: Provide necessary data for a driver-facing mobile application (e.g., delivery list, route information, POD capture).

### 3.5. Zone & Territory Management
1.  **Define Delivery Zones**: Configure geographical delivery zones or territories.
2.  **Zone-based Assignment**: Assign drivers or vehicles to specific zones.

## 4. Key Integration Points with Other Services

-   **`user-service`**:
    -   For authentication and authorization of users such as drivers, dispatchers, logistics managers, and administrators.
    -   User roles control access to logistics data and functionalities.
-   **`tenant-service`**:
    -   Manages tenant-specific logistics rules, delivery zone configurations, fleet settings, and ensures data isolation.
-   **`inventory-service`**:
    -   Receives information about items to be shipped (e.g., from transfer orders or sales fulfillment).
    -   Updates `inventory-service` on stock status changes (e.g., "in-transit," "delivered") to maintain accurate inventory levels.
-   **`pos-service` / `crm-service` / Order Management Service**:
    -   Receives delivery orders originating from sales transactions (POS) or customer relationship management activities (CRM), or a dedicated Order Management Service. These orders form the basis for shipment creation.
-   **`finance-service`**:
    -   Provides data for calculating logistics costs (e.g., fuel, driver pay per delivery, third-party logistics provider costs).
    -   May provide data for billing customers for delivery services.
-   **`notification-service`**:
    -   Sends notifications to customers regarding shipment status (e.g., "shipped," "out for delivery," "delivered," "delayed").
    -   Alerts dispatchers or managers about critical issues (e.g., prolonged delays, delivery exceptions).
-   **`equipment-maintenance-service`**:
    -   Integrates for managing the maintenance schedules and service history of fleet vehicles, ensuring vehicles are available and roadworthy. `logistics-service` can be alerted to vehicles due for service.
-   **Mapping Services (External)**:
    -   (Future) Integration with external mapping and geocoding services (e.g., Google Maps, Mapbox) for address validation, route calculation, and map visualization.

## 5. Frontend & UI Consumption

Provides APIs and data that can be utilized by frontend applications, potentially built using components from the shared UI library in `apps/main-ui/`, for tasks such as tracking shipments, managing deliveries, visualizing routes, and overseeing fleet operations.
