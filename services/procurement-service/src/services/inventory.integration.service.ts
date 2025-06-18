export interface GoodsReceiptPayloadItem { itemId: string; quantityReceived: number; warehouseId: string; batchNumber?: string; serialNumbers?: string[]; }

export interface ItemDetail {
    id: string;
    name: string;
    unitOfMeasure: string;
    // other fields procurement might need from inventory service
}

export class InventoryIntegrationService {
  static async notifyGoodsReceipt(tenantId: string, grnId: string, items: GoodsReceiptPayloadItem[]): Promise<{ success: boolean; message?: string }> {
    console.log(`Mock InventoryIntegration: Notifying goods receipt for GRN ${grnId}, Tenant ${tenantId}`, items);
    // In a real app, this would make an API call to inventory-service
    // to update stock levels. Example:
    // const response = await fetch(`${process.env.INVENTORY_SERVICE_URL}/v1/stock/receive`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': tenantId, 'X-Internal-Auth': 'secret-key' },
    //   body: JSON.stringify({ grnId, items })
    // });
    // if (!response.ok) throw new Error('Failed to notify inventory service of goods receipt');
    // return { success: true, message: 'Inventory notified (mock)' };
    return { success: true, message: 'Inventory notified (mock)' };
  }

  static async getItemDetails(tenantId: string, itemIds: string[]): Promise<ItemDetail[]> { // Simplified
     console.log(`Mock InventoryIntegration: Fetching item details for Tenant ${tenantId}`, itemIds);
     // Example:
     // const response = await fetch(`${process.env.INVENTORY_SERVICE_URL}/v1/items/batch-details`, { // Assuming a batch endpoint
     //   method: 'POST',
     //   headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': tenantId },
     //   body: JSON.stringify({ itemIds })
     // });
     // if (!response.ok) throw new Error('Failed to fetch item details from inventory service');
     // return response.json();
     return itemIds.map(id => ({id, name: `Mock Item ${id}`, unitOfMeasure: 'pcs'}));
  }
}
