import { OfflineProduct } from '../models'; // For the return type of getProductDetails

export interface StockUpdateItem {
    itemId: string; // Corresponds to Item.id in inventory-service
    sku?: string; // Optional, itemId is primary key
    quantitySold: number;
    warehouseId: string; // From which warehouse stock was sold (important for multi-warehouse POS)
    saleId?: string; // For traceability
}

export class InventoryIntegrationService {
  static async updateStockAfterSale(tenantId: string, items: StockUpdateItem[]): Promise<{ success: boolean; errors?: any[] }> {
    console.log(`Mock InventoryIntegration: Updating stock for tenant ${tenantId}`, items);
    // In a real app, this would make an API call to inventory-service
    // Example:
    // const response = await fetch(`${process.env.INVENTORY_SERVICE_URL}/v1/stock/sell`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': tenantId, 'X-Internal-Auth': 'secret' },
    //   body: JSON.stringify({ items }) // items would be an array of { itemId, quantitySold, warehouseId }
    // });
    // if (!response.ok) {
    //    const errorData = await response.json();
    //    return { success: false, errors: errorData.details || [{ message: 'Failed to update stock in inventory service' }] };
    // }
    // return { success: true };
    return { success: true }; // Mock success
  }

  static async getProductDetails(tenantId: string, itemIdsOrSkus: string[]): Promise<Partial<OfflineProduct>[]> {
    console.log(`Mock InventoryIntegration: Fetching product details for tenant ${tenantId}`, itemIdsOrSkus);
    // In a real app, call inventory-service to get details needed for POS (name, price, tax info, SKU)
    // const response = await fetch(`${process.env.INVENTORY_SERVICE_URL}/v1/items/pos-lookup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': tenantId },
    //   body: JSON.stringify({ identifiers: itemIdsOrSkus })
    // });
    // if (!response.ok) throw new Error('Failed to fetch product details');
    // const products = await response.json();
    // return products.map(p => ({ sku: p.sku, name: p.name, unitPrice: p.sellingPrice, taxRate: p.taxConfiguration.rate, itemId: p.id }));

    // Mock response:
    return itemIdsOrSkus.map(idOrSku => ({
        itemId: idOrSku.startsWith('SKU-') ? `item-${idOrSku.split('-')[1]}` : idOrSku,
        sku: idOrSku.startsWith('SKU-') ? idOrSku : `SKU-${idOrSku}`,
        name: `Mock Product ${idOrSku}`,
        unitPrice: parseFloat((Math.random() * 50 + 10).toFixed(2)), // Random price between 10 and 60
        taxRate: 0.07 // Mock 7% tax rate
    }));
  }

  // TODO: Add method for real-time stock level check if needed, though this might be slow for every cart addition.
  // static async checkStockLevel(tenantId: string, itemId: string, warehouseId: string): Promise<{ quantityOnHand: number }> {}
}
