# Inventory Service (@easycode/inventory-service)

## 1. Service Overview

Manages product inventory, stock levels, warehouse management, item master data, stock movements, and interacts with procurement processes for replenishment. This service is responsible for the accurate tracking and valuation of physical goods.

## 2. Tech Stack

Built with TypeScript and Node.js, leveraging Turborepo for monorepo management. It's designed for deployment on cloud infrastructure, compatible with strategies like OpenNext/Cloudflare for relevant parts of the ecosystem.

## 3. Core Features and Capabilities

### 3.1. Item Master Data Management
1.  **Product Definition**: Central repository for all product/item information including SKUs, detailed descriptions, categories, sub-categories, and variants.
2.  **Units of Measure (UoM)**: Manage different units of measure for purchasing, stocking, and selling items (e.g., piece, box, kg).
3.  **Attributes & Specifications**: Define custom attributes and specifications for products (e.g., size, color, material, technical specs).
4.  **Supplier Information**: Store primary supplier details per item, if not exclusively managed by `procurement-service`.
5.  **Barcode Management**: Associate items with barcodes (EAN, UPC, QR codes) for efficient scanning.

### 3.2. Inventory Tracking & Control
1.  **Real-time Stock Levels**: Track inventory quantities across multiple warehouses, specific locations, and bins within locations.
2.  **Stock Types**: Differentiate between various stock statuses (e.g., on-hand/available, allocated/reserved, on-order, in-transit, quality inspection, damaged, returned).
3.  **Serial Number & Batch/Lot Tracking**: Enable tracking of individual items by serial number or groups by batch/lot number, including expiry date management for perishable goods.
4.  **Cycle Counting & Adjustments**: Support periodic physical inventory counts (cycle counts) and allow for stock adjustments due to discrepancies, damages, or other reasons, with audit trails.
5.  **Inventory Valuation Support**: Provide transaction data necessary for inventory valuation methods (e.g., FIFO, LIFO, Weighted Average Cost). The actual calculation and GL posting typically reside in `finance-service`.

### 3.3. Warehouse Management
1.  **Warehouse Configuration**: Define and manage multiple warehouse structures, including zones, storage locations (e.g., shelves, racks), and bin locations.
2.  **Storage Optimization**: (Future) Tools to suggest optimal storage locations based on item characteristics or velocity.
3.  **Bin Management**: Manage inventory at the bin level for precise location tracking.

### 3.4. Stock Movements & Operations
1.  **Goods Receipts**: Process incoming stock from purchase orders (via `procurement-service`), inter-warehouse transfers, or customer returns.
2.  **Stock Issues**: Manage issuing of stock for sales orders (via `pos-service` or `ecommerce-service`), internal consumption, or production orders.
3.  **Inter-Warehouse Transfers**: Create and track stock transfers between different warehouses or locations within the same organization.
4.  **Return Management (RMAs)**: Process customer returns and supplier returns, including inspection and disposition (e.g., return to stock, repair, scrap).

### 3.5. Replenishment & Procurement Interaction
1.  **Reorder Point Management**: Define minimum and maximum stock levels (reorder points) to trigger replenishment alerts or actions.
2.  **Replenishment Planning**: Generate suggestions or automated requests for stock replenishment based on reorder points, sales velocity, or demand forecasts.
3.  **Interaction with `procurement-service`**:
    3.1. **Item Master Source**: Serves item master data to `procurement-service` for creating purchase requisitions and orders.
    3.2. **Goods Receipt Notification**: Receives notifications from `procurement-service` upon goods receipt against a purchase order, triggering stock level updates.
    3.3. **Internal Requests**: May generate internal stock replenishment *requests* that are fulfilled via purchase orders managed by `procurement-service`.
    *(Note: Comprehensive Purchase Order (PO) management, including creation, approval, and external supplier communication, is handled by the `procurement-service`.)*

## 4. Key Integration Points with Other Services

-   **`user-service`**: For authenticating and authorizing users (e.g., warehouse staff, inventory managers, administrators) accessing inventory functionalities. User roles control access to specific operations and data.
-   **`tenant-service`**: For managing tenant-specific inventory rules, warehouse configurations, custom item attributes, and ensuring data isolation between tenants.
-   **`pos-service`**:
    -   Real-time stock lookups at the point of sale.
    -   Decrements stock levels upon completion of a sale.
-   **`procurement-service`**:
    -   `inventory-service` provides item master data to `procurement-service`.
    -   `procurement-service` notifies `inventory-service` of goods received against purchase orders, so stock levels can be updated.
-   **`finance-service`**:
    -   Provides raw data (quantities, item costs) for Cost of Goods Sold (COGS) calculations.
    -   Supplies data for inventory valuation reports (e.g., stock ageing, total value).
    -   Records financial impact of stock adjustments (e.g., write-offs).
-   **`logistics-service`**:
    -   Coordinates shipments for inter-warehouse transfers or customer deliveries originating from inventory.
    -   Manages information about stock currently in-transit.
-   **`ecommerce-service` (if applicable)**:
    -   Publishes product availability and stock levels to online sales channels.
    -   Receives sales order information to trigger stock allocation and issue.
-   **`equipment-maintenance-service` (Potential)**:
    -   May consume spare parts from inventory for maintenance work orders, requiring stock updates.

## 5. Frontend & UI Consumption

Provides APIs and data that can be utilized by frontend applications, potentially built using components from the shared UI library in `apps/main-ui/`, for tasks like viewing stock levels, managing inventory operations (e.g., stock counts, transfers), and generating reports.
