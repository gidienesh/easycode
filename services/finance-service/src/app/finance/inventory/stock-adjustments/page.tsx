// src/app/finance/inventory/stock-adjustments/page.tsx
"use client";

import React, { useState } from 'react';
import {
    mockData,
    StockAdjustmentReason,
    mockItemMasterData
} from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interface for Stock Adjustment items for type safety
interface StockAdjustmentItem {
  id: string;
  adjustmentDate: string;
  itemId: string;
  itemName: string;
  adjustmentType: 'Increase' | 'Decrease';
  quantityAdjusted: number;
  reason: StockAdjustmentReason | string; // Allow string for 'Other'
  notes?: string;
  approvedBy?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function StockAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<StockAdjustmentItem[]>(mockData.inventory.stockAdjustments);
  const [showModal, setShowModal] = useState<boolean>(false);

  const initialFormData: Partial<Omit<StockAdjustmentItem, 'id' | 'itemName'>> & {itemId: string} = {
    adjustmentDate: new Date().toISOString().split('T')[0],
    itemId: '',
    adjustmentType: 'Decrease',
    quantityAdjusted: 1,
    reason: StockAdjustmentReason.PHYSICAL_COUNT_MISMATCH,
    notes: '',
    approvedBy: 'Current User (Mock)'
  };
  const [formData, setFormData] = useState<Partial<Omit<StockAdjustmentItem, 'id' | 'itemName'>> & {itemId: string}>(initialFormData);

  const handleRecordNewAdjustment = () => {
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData(initialFormData);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    if (name === 'quantityAdjusted') {
        processedValue = Math.max(0, parseFloat(value) || 0); // Ensure positive number
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = mockItemMasterData.find(i => i.id === formData.itemId);
    if (!item) {
        alert("Selected item not found in master data.");
        return;
    }
    if (formData.quantityAdjusted <= 0) {
        alert("Quantity adjusted must be greater than zero.");
        return;
    }

    const newAdjustment: StockAdjustmentItem = {
      id: `ADJ-${Date.now().toString().slice(-5)}`,
      adjustmentDate: formData.adjustmentDate!,
      itemId: formData.itemId!,
      itemName: item.itemName,
      adjustmentType: formData.adjustmentType as 'Increase' | 'Decrease',
      quantityAdjusted: Number(formData.quantityAdjusted),
      reason: formData.reason!,
      notes: formData.notes,
      approvedBy: formData.approvedBy,
    };
    setAdjustments(prev => [newAdjustment, ...prev].sort((a,b) => new Date(b.adjustmentDate).getTime() - new Date(a.adjustmentDate).getTime()));

    // Mock update item master quantity (very basic)
    const itemIndex = mockData.inventory.itemMaster.findIndex(i => i.id === formData.itemId);
    if(itemIndex !== -1) {
        if(newAdjustment.adjustmentType === 'Increase') {
            mockData.inventory.itemMaster[itemIndex].quantityOnHand += newAdjustment.quantityAdjusted;
        } else {
            mockData.inventory.itemMaster[itemIndex].quantityOnHand -= newAdjustment.quantityAdjusted;
        }
    }
    alert(`Placeholder: Stock Adjustment ${newAdjustment.id} recorded (mock).`);
    console.log('New Stock Adjustment:', newAdjustment);
    handleModalClose();
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Inventory Stock Adjustments</h1>
        <Button variant="primary" onClick={handleRecordNewAdjustment}>Record New Adjustment</Button>
      </header>

      <Card title="Stock Adjustment History">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Adj. ID</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle} align="right">Qty Adjusted</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Approved By</th>
              {/* <th style={thStyle}>Notes</th> */}
            </tr>
          </thead>
          <tbody>
            {adjustments.map((adj) => (
              <tr key={adj.id}>
                <td style={tdStyle}>{new Date(adj.adjustmentDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{adj.id}</td>
                <td style={tdStyle}>{adj.itemName} ({adj.itemId})</td>
                <td style={tdStyle} style={{color: adj.adjustmentType === 'Decrease' ? 'red' : 'green'}}>{adj.adjustmentType}</td>
                <td style={tdStyle} align="right">{adj.quantityAdjusted}</td>
                <td style={tdStyle}>{adj.reason}</td>
                <td style={tdStyle}>{adj.approvedBy || 'N/A'}</td>
                {/* <td style={tdStyle}>{adj.notes}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {adjustments.length === 0 && <p>No stock adjustments found.</p>}
      </Card>

      {/* Modal for Recording New Adjustment */}
      {showModal && (
         <div style={modalOverlayStyle} onClick={handleModalClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Record Stock Adjustment">
                <form onSubmit={handleFormSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Adjustment Date: <input type="date" name="adjustmentDate" value={formData.adjustmentDate} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        <div><label>Item: <select name="itemId" value={formData.itemId} onChange={handleFormChange} required style={inputStyle}><option value="">-- Select Item --</option>{mockItemMasterData.filter(i=>i.isActive && i.itemType !== ItemType.SERVICE).map(i => <option key={i.id} value={i.id}>{i.itemName} ({i.itemCode})</option>)}</select></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Adjustment Type:
                            <select name="adjustmentType" value={formData.adjustmentType} onChange={handleFormChange} style={inputStyle}>
                                <option value="Decrease">Decrease Stock</option>
                                <option value="Increase">Increase Stock</option>
                            </select>
                        </label></div>
                        <div><label>Quantity Adjusted: <input type="number" name="quantityAdjusted" value={formData.quantityAdjusted} onChange={handleFormChange} required style={inputStyle} min="1"/></label></div>
                    </div>
                    <div>
                        <label>Reason:
                            <select name="reason" value={formData.reason} onChange={handleFormChange} style={inputStyle}>
                                {Object.values(StockAdjustmentReason).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </label>
                    </div>
                    <div><label>Notes (Optional): <textarea name="notes" value={formData.notes || ''} onChange={handleFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>
                    <div><label>Approved By: <input type="text" name="approvedBy" value={formData.approvedBy || ''} onChange={handleFormChange} style={inputStyle}/></label></div>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Adjustment</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
