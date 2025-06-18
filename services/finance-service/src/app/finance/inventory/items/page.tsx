// src/app/finance/inventory/items/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData, ItemType, ValuationMethod, mockVendorsData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interface for ItemMaster items for type safety
interface ItemMasterItem {
  id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  itemType: ItemType;
  valuationMethod?: ValuationMethod;
  unitPrice: number; // Selling price
  purchasePrice?: number; // Cost price
  quantityOnHand: number;
  reorderLevel?: number;
  preferredVendorId?: string;
  isActive: boolean;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};
const fieldsetStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '1rem'};
const legendStyle: React.CSSProperties = { fontWeight: 'bold', padding: '0 5px'};

export default function ItemMasterPage() {
  const [items, setItems] = useState<ItemMasterItem[]>(mockData.inventory.itemMaster);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ItemMasterItem | null>(null);

  const initialFormData: Partial<ItemMasterItem> = { itemCode: '', itemName: '', category: '', unitOfMeasure: 'PCS', itemType: ItemType.FINISHED_GOOD, unitPrice: 0, purchasePrice: 0, quantityOnHand: 0, isActive: true, valuationMethod: ValuationMethod.FIFO };
  const [formData, setFormData] = useState<Partial<ItemMasterItem>>(initialFormData);

  const handleAddNewItem = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleEditItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setShowModal(true);
    }
  };

  const handleAdjustStock = (itemId: string) => {
    alert(`Placeholder: Adjust Stock for Item ID: ${itemId}. This would open a stock adjustment modal/form.`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    let processedValue = type === 'checkbox' ? checked : value;
    if (['unitPrice', 'purchasePrice', 'quantityOnHand', 'reorderLevel'].includes(name)) {
        processedValue = parseFloat(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? {...i, ...formData } as ItemMasterItem : i));
      alert(`Placeholder: Item ${editingItem.id} updated (mock).`);
    } else {
      const newItem: ItemMasterItem = {
        ...initialFormData, // Ensure all default fields are there
        ...formData,
        id: `ITM${Date.now().toString().slice(-5)}`,
      } as ItemMasterItem;
      setItems([...items, newItem]);
      alert(`Placeholder: New item ${newItem.itemCode} created (mock).`);
    }
    handleModalClose();
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Inventory Item Master</h1>
        <Button variant="primary" onClick={handleAddNewItem}>Add New Item</Button>
      </header>

      <Card title="Manage Items">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Code</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>UoM</th>
              <th style={thStyle} align="right">Unit Price</th>
              <th style={thStyle} align="right">Qty on Hand</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={!item.isActive ? {color: '#aaa', textDecoration: 'line-through'} : {}}>
                <td style={tdStyle}>{item.itemCode}</td>
                <td style={tdStyle}>{item.itemName}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>{item.unitOfMeasure}</td>
                <td style={tdStyle} align="right">{item.unitPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle} align="right">{item.quantityOnHand.toLocaleString()}</td>
                <td style={tdStyle}>{item.isActive ? 'Active' : 'Inactive'}</td>
                <td style={tdStyle}>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <Button variant="secondary" size="sm" onClick={() => handleEditItem(item.id)}>View/Edit</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleAdjustStock(item.id)}>Adjust Stock</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p>No items found.</p>}
      </Card>

      {/* Add/Edit Item Modal */}
      {showModal && (
         <div style={modalOverlayStyle} onClick={handleModalClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={editingItem ? `Edit Item: ${editingItem.itemName}` : "Add New Inventory Item"}>
                <form onSubmit={handleFormSubmit}>
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Basic Details</legend>
                        <div style={formRowStyle}>
                            <div><label>Item Code: <input type="text" name="itemCode" value={formData.itemCode || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                            <div><label>Item Name: <input type="text" name="itemName" value={formData.itemName || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        </div>
                        <div><label>Description: <textarea name="description" value={formData.description || ''} onChange={handleFormChange} style={{...inputStyle, height:'60px'}}></textarea></label></div>
                        <div style={formRowStyle}>
                            <div><label>Category: <input type="text" name="category" value={formData.category || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                            <div><label>Unit of Measure (UoM): <input type="text" name="unitOfMeasure" value={formData.unitOfMeasure || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        </div>
                    </fieldset>
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Type & Pricing</legend>
                        <div style={formRowStyle}>
                            <div><label>Item Type: <select name="itemType" value={formData.itemType} onChange={handleFormChange} style={inputStyle}>{Object.values(ItemType).map(it => <option key={it} value={it}>{it.replace('_',' ')}</option>)}</select></label></div>
                            {formData.itemType !== ItemType.SERVICE && formData.itemType !== ItemType.NON_STOCK &&
                                <div><label>Valuation Method: <select name="valuationMethod" value={formData.valuationMethod} onChange={handleFormChange} style={inputStyle}>{Object.values(ValuationMethod).map(vm => <option key={vm} value={vm}>{vm.replace('_',' ')}</option>)}</select></label></div>
                            }
                        </div>
                        <div style={formRowStyle}>
                            <div><label>Unit Price (Selling): <input type="number" name="unitPrice" value={formData.unitPrice || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                            <div><label>Purchase Price (Cost): <input type="number" name="purchasePrice" value={formData.purchasePrice || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                        </div>
                    </fieldset>
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Inventory Control</legend>
                         <div style={formRowStyle}>
                            <div><label>Quantity On Hand: <input type="number" name="quantityOnHand" value={formData.quantityOnHand || 0} onChange={handleFormChange} style={inputStyle} readOnly={!!editingItem} /></label></div> {/* Typically read-only on edit, adjusted via stock movements */}
                            <div><label>Reorder Level: <input type="number" name="reorderLevel" value={formData.reorderLevel || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                        </div>
                        <div><label>Preferred Vendor: <select name="preferredVendorId" value={formData.preferredVendorId || ''} onChange={handleFormChange} style={inputStyle}><option value="">-- Select Vendor --</option>{mockVendorsData.filter(v=>v.isActive).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label></div>
                    </fieldset>
                    <div style={{marginTop: '1rem'}}><label><input type="checkbox" name="isActive" checked={formData.isActive === undefined ? true : formData.isActive} onChange={handleFormChange} /> Active</label></div>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Item</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
