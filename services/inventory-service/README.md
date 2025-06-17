# Inventory Service (@easycode/inventory-service)

This service is responsible for managing product inventory, stock levels, warehouse operations, item master data, and stock movements.

## Core Responsibilities

-   **Item Master Data Management**: Central repository for all product/item information (SKUs, descriptions, categories, units of measure, attributes, supplier details if not managed by Procurement).
-   **Inventory Tracking**: Real-time tracking of stock levels across multiple warehouses, locations, and bins. Includes different stock types (on-hand, allocated, on-order, in-transit).
-   **Warehouse Management**: Managing warehouse structures (zones, locations, bins), optimizing storage, and supporting warehouse operations.
-   **Stock Movements**: Handling various inventory transactions like goods receipts, issues, transfers between locations, stock adjustments (cycle counts, damages), and returns.
-   **Valuation**: Providing data for inventory valuation (e.g., FIFO, LIFO, Weighted Average - actual calculation might be in `finance-service`).
-   **Replenishment Planning**: Generating suggestions or automated requests for stock replenishment based on reorder points, sales velocity, or demand forecasts.

### Purchase Order (PO) Management & Integration with `procurement-service`

Comprehensive Purchase Order (PO) management, including creation, approval, and supplier communication, is now handled by the dedicated `procurement-service`.

**`inventory-service`'s role in procurement:**
-   **Provides Item Master Data**: `inventory-service` serves as the source of truth for item master data (SKUs, descriptions, UoM, categories), which `procurement-service` consumes when creating requisitions or POs for stockable goods.
-   **Receives Goods Receipt Updates**: When goods are received against a PO in `procurement-service`, it notifies `inventory-service` to update stock levels for the received items in the appropriate warehouse/location.
-   **Internal Stock Management**: This service may still handle internal stock transfer orders between warehouses or generate automated stock replenishment *requests* that are then fulfilled via the `procurement-service`.

For all external supplier POs and the broader Procure-to-Pay lifecycle, please refer to the `procurement-service`.

## Key Integrations

-   **`procurement-service`**: Consumes item master data from this service for POs/requisitions. Receives goods receipt notifications to update stock.
-   **`pos-service`**: For real-time stock lookups and decrementing stock upon sale.
-   **`logistics-service`**: For coordinating shipments, in-transit stock, and deliveries.
-   **`finance-service`**: For inventory valuation data and COGS calculation.
-   **`ecommerce-service` (if applicable)**: For publishing product availability to online channels.

*(Detailed API specifications and data models will be documented separately.)*
```
