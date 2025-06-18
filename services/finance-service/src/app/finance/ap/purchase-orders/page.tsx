// src/app/finance/ap/purchase-orders/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, PurchaseOrderStatus, mockVendorsData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface POItemLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface PurchaseOrderItem {
  id: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
  currency: string;
  items: POItemLine[];
  notes?: string;
  shippingAddress?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>(mockData.accountsPayable.purchaseOrders);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Basic form state for new PO
  const initialNewPoData = { vendorId: '', orderDate: new Date().toISOString().split('T')[0], currency: 'KES', items: [], notes: '', shippingAddress: '' };
  const [newPoData, setNewPoData] = useState<any>(initialNewPoData);


  const handleCreateNewPO = () => {
    setNewPoData(initialNewPoData); // Reset form
    setShowCreateModal(true);
    console.log('Create New PO button clicked');
  };

  const handleViewDetails = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (po) setSelectedPO(po);
  };

  const handleCloseModal = () => {
    setSelectedPO(null);
    setShowCreateModal(false);
  };

  const handleNewPoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewPoData({ ...newPoData, [e.target.name]: e.target.value });
  };

  const handleNewPoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation (example)
    if (!newPoData.vendorId || newPoData.items.length === 0) {
        alert("Vendor and at least one item are required.");
        return;
    }
    const newPo: PurchaseOrderItem = {
        id: `PO-${Date.now().toString().slice(-4)}`,
        ...newPoData,
        vendorName: mockVendorsData.find(v => v.id === newPoData.vendorId)?.name || 'Unknown Vendor',
        totalAmount: newPoData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
        status: PurchaseOrderStatus.DRAFT, // Default to draft
        expectedDeliveryDate: newPoData.expectedDeliveryDate || undefined,
    };
    setPurchaseOrders([...purchaseOrders, newPo]);
    alert(`Placeholder: New PO ${newPo.id} created (mock).`);
    console.log('New PO Data Submitted:', newPo);
    handleCloseModal();
  };

  // Simplified item handling for mock create form
  const handleAddItemToNewPo = () => {
    setNewPoData({
        ...newPoData,
        items: [...newPoData.items, { itemId: `ITEM-${newPoData.items.length +1}`, itemName: '', quantity: 1, unitPrice: 0, lineTotal: 0 }]
    });
  };
  const handleNewPoItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = newPoData.items.map((item: any, i: number) => {
        if (i === index) {
            const newItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
                newItem.lineTotal = (field === 'quantity' ? Number(value) : item.quantity) * (field === 'unitPrice' ? Number(value) : item.unitPrice);
            }
            return newItem;
        }
        return item;
    });
    setNewPoData({ ...newPoData, items: updatedItems });
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Purchase Order Management</h1>
        <Button variant="primary" onClick={handleCreateNewPO}>Create New PO</Button>
      </header>

      <Card title="Manage Purchase Orders">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>PO Number</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>Order Date</th>
              <th style={thStyle} align="right">Total Amount</th>
              <th style={thStyle}>Currency</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td style={tdStyle}>{po.id}</td>
                <td style={tdStyle}>{po.vendorName}</td>
                <td style={tdStyle}>{new Date(po.orderDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{po.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{po.currency}</td>
                <td style={tdStyle}>{po.status}</td>
                <td style={tdStyle}>
                  <Button variant="secondary" size="sm" onClick={() => handleViewDetails(po.id)}>View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchaseOrders.length === 0 && <p>No purchase orders found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedPO && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Purchase Order Details: ${selectedPO.id}`}>
              <p><strong>Vendor:</strong> {selectedPO.vendorName} ({selectedPO.vendorId})</p>
              <p><strong>Order Date:</strong> {new Date(selectedPO.orderDate).toLocaleDateString()}</p>
              {selectedPO.expectedDeliveryDate && <p><strong>Expected Delivery:</strong> {new Date(selectedPO.expectedDeliveryDate).toLocaleDateString()}</p>}
              <p><strong>Total Amount:</strong> {selectedPO.currency} {selectedPO.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Status:</strong> {selectedPO.status}</p>
              {selectedPO.shippingAddress && <p><strong>Shipping Address:</strong> {selectedPO.shippingAddress}</p>}
              {selectedPO.notes && <p><strong>Notes:</strong> {selectedPO.notes}</p>}
              <h4>Items:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Item ID</th><th style={thStyle}>Name</th><th style={thStyle} align="right">Qty</th><th style={thStyle} align="right">Unit Price</th><th style={thStyle} align="right">Total</th></tr></thead>
                <tbody>{selectedPO.items.map(item => (<tr key={item.itemId}><td style={tdStyle}>{item.itemId}</td><td style={tdStyle}>{item.itemName}</td><td style={tdStyle} align="right">{item.quantity}</td><td style={tdStyle} align="right">{item.unitPrice.toFixed(2)}</td><td style={tdStyle} align="right">{item.lineTotal.toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="primary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create New PO Modal (Simplified) */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Create New Purchase Order">
                <form onSubmit={handleNewPoSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Vendor: <select name="vendorId" value={newPoData.vendorId} onChange={handleNewPoFormChange} required style={inputStyle}>{mockVendorsData.filter(v=>v.isActive).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label></div>
                        <div><label>Order Date: <input type="date" name="orderDate" value={newPoData.orderDate} onChange={handleNewPoFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Expected Delivery Date: <input type="date" name="expectedDeliveryDate" value={newPoData.expectedDeliveryDate || ''} onChange={handleNewPoFormChange} style={inputStyle}/></label></div>
                        <div><label>Currency: <input type="text" name="currency" value={newPoData.currency} onChange={handleNewPoFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div><label>Shipping Address: <input type="text" name="shippingAddress" value={newPoData.shippingAddress} onChange={handleNewPoFormChange} style={inputStyle}/></label></div>
                    <div><label>Notes: <textarea name="notes" value={newPoData.notes} onChange={handleNewPoFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>

                    <h4>Items</h4>
                    {newPoData.items.map((item: any, index: number) => (
                        <div key={index} style={{...formRowStyle, borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                            <input type="text" placeholder="Item ID/Code" value={item.itemId} onChange={(e) => handleNewPoItemChange(index, 'itemId', e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleNewPoItemChange(index, 'itemName', e.target.value)} style={inputStyle} />
                            <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleNewPoItemChange(index, 'quantity', parseFloat(e.target.value))} style={inputStyle} />
                            <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleNewPoItemChange(index, 'unitPrice', parseFloat(e.target.value))} style={inputStyle} />
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={handleAddItemToNewPo} style={{margin: '10px 0'}}>Add Item</Button>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Save PO (Draft)</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
