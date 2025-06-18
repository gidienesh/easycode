// src/app/finance/ar/sales-orders/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData, SalesOrderStatus, mockCustomersData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface SOItemLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface SalesOrderItem {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  expectedShipmentDate?: string;
  totalAmount: number;
  currency: string;
  status: SalesOrderStatus;
  items: SOItemLine[];
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrderItem[]>(mockData.accountsReceivable.salesOrders);
  const [selectedSO, setSelectedSO] = useState<SalesOrderItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const initialNewSOData = { customerId: '', orderDate: new Date().toISOString().split('T')[0], currency: 'KES', items: [], notes: '', shippingAddress: '', billingAddress: '' };
  const [newSOData, setNewSOData] = useState<any>(initialNewSOData);


  const handleCreateNewSO = () => {
    setNewSOData(initialNewSOData);
    setShowCreateModal(true);
  };

  const handleViewDetails = (soId: string) => {
    const so = salesOrders.find(s => s.id === soId);
    if (so) setSelectedSO(so);
  };

  const handleCloseModal = () => {
    setSelectedSO(null);
    setShowCreateModal(false);
  };

  const handleNewSOFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSOData({ ...newSOData, [name]: value });
     if (name === 'customerId') {
        const customer = mockCustomersData.find(c => c.id === value);
        if (customer) {
            setNewSOData((prev:any) => ({
                ...prev,
                shippingAddress: customer.shippingAddress || customer.billingAddress || '',
                billingAddress: customer.billingAddress || '',
                currency: 'KES' // Default or from customer profile
            }));
        }
    }
  };

  const handleNewSOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSOData.customerId || newSOData.items.length === 0) {
        alert("Customer and at least one item are required.");
        return;
    }
    const newSO: SalesOrderItem = {
        id: `SO-${Date.now().toString().slice(-4)}`,
        ...newSOData,
        customerName: mockCustomersData.find(c => c.id === newSOData.customerId)?.name || 'Unknown Customer',
        totalAmount: newSOData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
        status: SalesOrderStatus.DRAFT, // Default to draft
        expectedShipmentDate: newSOData.expectedShipmentDate || undefined,
    };
    setSalesOrders([...salesOrders, newSO]);
    alert(`Placeholder: New Sales Order ${newSO.id} created (mock).`);
    console.log('New SO Data Submitted:', newSO);
    handleCloseModal();
  };

   const handleAddItemToNewSO = () => {
    setNewSOData({
        ...newSOData,
        items: [...newSOData.items, { itemId: `ITEM-${newSOData.items.length +1}`, itemName: '', quantity: 1, unitPrice: 0, lineTotal: 0 }]
    });
  };
  const handleNewSOItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = newSOData.items.map((item: any, i: number) => {
        if (i === index) {
            const newItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
                newItem.lineTotal = (field === 'quantity' ? Number(value) : item.quantity) * (field === 'unitPrice' ? Number(value) : item.unitPrice);
            }
            return newItem;
        }
        return item;
    });
    setNewSOData({ ...newSOData, items: updatedItems });
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Sales Order Management</h1>
        <Button variant="primary" onClick={handleCreateNewSO}>Create New Sales Order</Button>
      </header>

      <Card title="Manage Sales Orders">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>SO Number</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Order Date</th>
              <th style={thStyle} align="right">Total Amount</th>
              <th style={thStyle}>Currency</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((so) => (
              <tr key={so.id}>
                <td style={tdStyle}>{so.id}</td>
                <td style={tdStyle}>{so.customerName}</td>
                <td style={tdStyle}>{new Date(so.orderDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{so.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{so.currency}</td>
                <td style={tdStyle}>{so.status}</td>
                <td style={tdStyle}>
                  <Button variant="secondary" size="sm" onClick={() => handleViewDetails(so.id)}>View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {salesOrders.length === 0 && <p>No sales orders found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedSO && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Sales Order Details: ${selectedSO.id}`}>
              <p><strong>Customer:</strong> {selectedSO.customerName} ({selectedSO.customerId})</p>
              <p><strong>Order Date:</strong> {new Date(selectedSO.orderDate).toLocaleDateString()}</p>
              {selectedSO.expectedShipmentDate && <p><strong>Expected Shipment:</strong> {new Date(selectedSO.expectedShipmentDate).toLocaleDateString()}</p>}
              <p><strong>Total Amount:</strong> {selectedSO.currency} {selectedSO.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Status:</strong> {selectedSO.status}</p>
              {selectedSO.shippingAddress && <p><strong>Shipping Address:</strong> {selectedSO.shippingAddress}</p>}
              {selectedSO.billingAddress && <p><strong>Billing Address:</strong> {selectedSO.billingAddress}</p>}
              {selectedSO.notes && <p><strong>Notes:</strong> {selectedSO.notes}</p>}
              <h4>Items:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Item ID</th><th style={thStyle}>Name</th><th style={thStyle} align="right">Qty</th><th style={thStyle} align="right">Unit Price</th><th style={thStyle} align="right">Total</th></tr></thead>
                <tbody>{selectedSO.items.map(item => (<tr key={item.itemId}><td style={tdStyle}>{item.itemId}</td><td style={tdStyle}>{item.itemName}</td><td style={tdStyle} align="right">{item.quantity}</td><td style={tdStyle} align="right">{item.unitPrice.toFixed(2)}</td><td style={tdStyle} align="right">{item.lineTotal.toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="primary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create New SO Modal (Simplified) */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Create New Sales Order">
                <form onSubmit={handleNewSOSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Customer: <select name="customerId" value={newSOData.customerId} onChange={handleNewSOFormChange} required style={inputStyle}><option value="">-- Select Customer --</option>{mockCustomersData.filter(c=>c.isActive).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
                        <div><label>Order Date: <input type="date" name="orderDate" value={newSOData.orderDate} onChange={handleNewSOFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Expected Shipment Date: <input type="date" name="expectedShipmentDate" value={newSOData.expectedShipmentDate || ''} onChange={handleNewSOFormChange} style={inputStyle}/></label></div>
                        <div><label>Currency: <input type="text" name="currency" value={newSOData.currency} onChange={handleNewSOFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div><label>Billing Address: <textarea name="billingAddress" value={newSOData.billingAddress} onChange={handleNewSOFormChange} style={{...inputStyle, height: '40px'}}></textarea></label></div>
                    <div><label>Shipping Address: <textarea name="shippingAddress" value={newSOData.shippingAddress} onChange={handleNewSOFormChange} style={{...inputStyle, height: '40px'}}></textarea></label></div>
                    <div><label>Notes: <textarea name="notes" value={newSOData.notes} onChange={handleNewSOFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>

                    <h4>Items</h4>
                    {newSOData.items.map((item: any, index: number) => (
                        <div key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                            <div style={formRowStyle}>
                                <input type="text" placeholder="Item ID/Code" value={item.itemId} onChange={(e) => handleNewSOItemChange(index, 'itemId', e.target.value)} style={inputStyle} />
                                <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleNewSOItemChange(index, 'itemName', e.target.value)} style={inputStyle} />
                            </div>
                             <div style={formRowStyle}>
                                <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleNewSOItemChange(index, 'quantity', parseFloat(e.target.value))} style={inputStyle} />
                                <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleNewSOItemChange(index, 'unitPrice', parseFloat(e.target.value))} style={inputStyle} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={handleAddItemToNewSO} style={{margin: '10px 0'}}>Add Item</Button>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Save SO (Draft)</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
