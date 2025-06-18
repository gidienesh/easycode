// src/app/finance/ap/invoices/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData, APInvoiceStatus, mockVendorsData, mockPurchaseOrdersData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface APInvoiceItemLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  description?: string;
}

interface APInvoiceItem {
  id: string;
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: APInvoiceStatus;
  items: APInvoiceItemLine[];
  notes?: string;
  attachments?: string[];
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function APInvoicesPage() {
  const [invoices, setInvoices] = useState<APInvoiceItem[]>(mockData.accountsPayable.invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<APInvoiceItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const initialNewInvoiceData = { vendorId: '', purchaseOrderId: '', invoiceNumber: '', invoiceDate: new Date().toISOString().split('T')[0], dueDate: '', totalAmount: 0, currency: 'KES', items: [], notes: '', attachments: [] };
  const [newInvoiceData, setNewInvoiceData] = useState<any>(initialNewInvoiceData);


  const handleRecordNewInvoice = () => {
    setNewInvoiceData(initialNewInvoiceData);
    setShowCreateModal(true);
  };

  const handleViewDetails = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
    setShowCreateModal(false);
  };

  const handleNewInvoiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewInvoiceData({ ...newInvoiceData, [e.target.name]: e.target.value });
  };

  const handleNewInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: APInvoiceItem = {
        id: `APINV-${Date.now().toString().slice(-4)}`,
        ...newInvoiceData,
        vendorName: mockVendorsData.find(v => v.id === newInvoiceData.vendorId)?.name || 'Unknown Vendor',
        totalAmount: newInvoiceData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
        status: APInvoiceStatus.DRAFT,
        attachments: newInvoiceData.attachmentsString ? newInvoiceData.attachmentsString.split(',').map((s:string) => s.trim()) : [],
    };
    setInvoices([...invoices, newInv]);
    alert(`Placeholder: New AP Invoice ${newInv.id} recorded (mock).`);
    console.log('New Invoice Data Submitted:', newInv);
    handleCloseModal();
  };

   const handleAddItemToNewInvoice = () => {
    setNewInvoiceData({
        ...newInvoiceData,
        items: [...newInvoiceData.items, { itemId: `ITEM-${newInvoiceData.items.length +1}`, itemName: '', quantity: 1, unitPrice: 0, lineTotal: 0, description: '' }]
    });
  };
  const handleNewInvoiceItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = newInvoiceData.items.map((item: any, i: number) => {
        if (i === index) {
            const newItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
                newItem.lineTotal = (field === 'quantity' ? Number(value) : item.quantity) * (field === 'unitPrice' ? Number(value) : item.unitPrice);
            }
            return newItem;
        }
        return item;
    });
    setNewInvoiceData({ ...newInvoiceData, items: updatedItems });
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>AP Invoice Processing</h1>
        <Button variant="primary" onClick={handleRecordNewInvoice}>Record New Invoice</Button>
      </header>

      <Card title="Manage AP Invoices">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>PO #</th>
              <th style={thStyle}>Invoice Date</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle} align="right">Total Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={tdStyle}>{invoice.invoiceNumber} ({invoice.id})</td>
                <td style={tdStyle}>{invoice.vendorName}</td>
                <td style={tdStyle}>{invoice.purchaseOrderId || 'N/A'}</td>
                <td style={tdStyle}>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{invoice.currency} {invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{invoice.status}</td>
                <td style={tdStyle}>
                  <Button variant="secondary" size="sm" onClick={() => handleViewDetails(invoice.id)}>View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p>No AP invoices found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedInvoice && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`AP Invoice Details: ${selectedInvoice.invoiceNumber}`}>
              <p><strong>Vendor:</strong> {selectedInvoice.vendorName} ({selectedInvoice.vendorId})</p>
              {selectedInvoice.purchaseOrderId && <p><strong>Related PO #:</strong> {selectedInvoice.purchaseOrderId}</p>}
              <p><strong>Invoice Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> {selectedInvoice.currency} {selectedInvoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
              {selectedInvoice.notes && <p><strong>Notes:</strong> {selectedInvoice.notes}</p>}
              <h4>Items:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Item</th><th style={thStyle} align="right">Qty</th><th style={thStyle} align="right">Unit Price</th><th style={thStyle} align="right">Total</th><th style={thStyle}>Desc.</th></tr></thead>
                <tbody>{selectedInvoice.items.map((item, idx) => (<tr key={idx}><td style={tdStyle}>{item.itemName} ({item.itemId})</td><td style={tdStyle} align="right">{item.quantity}</td><td style={tdStyle} align="right">{item.unitPrice.toFixed(2)}</td><td style{...tdStyle} align="right">{item.lineTotal.toFixed(2)}</td><td style={tdStyle}>{item.description}</td></tr>))}</tbody>
              </table>
              {selectedInvoice.attachments && selectedInvoice.attachments.length > 0 && <h4>Attachments:</h4>}
              <ul>{selectedInvoice.attachments?.map((file, idx) => <li key={idx}><a href="#" onClick={(e) => e.preventDefault()}>{file}</a></li>)}</ul>
              <div style={{marginTop: '1rem'}}>
                <Button variant="primary" onClick={() => alert('Placeholder: Perform Three-Way Match (PO, Goods Receipt, Invoice)')}>Perform 3-Way Match</Button>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="secondary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal (Simplified) */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Record New AP Invoice">
                <form onSubmit={handleNewInvoiceSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Vendor: <select name="vendorId" value={newInvoiceData.vendorId} onChange={handleNewInvoiceFormChange} required style={inputStyle}>{mockVendorsData.filter(v=>v.isActive).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label></div>
                        <div><label>Vendor Invoice #: <input type="text" name="invoiceNumber" value={newInvoiceData.invoiceNumber} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                     <div style={formRowStyle}>
                        <div><label>Related PO #: <select name="purchaseOrderId" value={newInvoiceData.purchaseOrderId} onChange={handleNewInvoiceFormChange} style={inputStyle}><option value="">N/A</option>{mockPurchaseOrdersData.map(po => <option key={po.id} value={po.id}>{po.id} - {po.vendorName}</option>)}</select></label></div>
                        <div><label>Invoice Date: <input type="date" name="invoiceDate" value={newInvoiceData.invoiceDate} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Due Date: <input type="date" name="dueDate" value={newInvoiceData.dueDate} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                        <div><label>Currency: <input type="text" name="currency" value={newInvoiceData.currency} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div><label>Notes: <textarea name="notes" value={newInvoiceData.notes} onChange={handleNewInvoiceFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>
                    <div><label>Attachments (comma-separated): <input type="text" name="attachmentsString" value={newInvoiceData.attachmentsString || ''} onChange={handleNewInvoiceFormChange} style={inputStyle}/></label></div>

                    <h4>Items</h4>
                    {newInvoiceData.items.map((item: any, index: number) => (
                        <div key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                            <div style={formRowStyle}>
                                <input type="text" placeholder="Item ID/Code" value={item.itemId} onChange={(e) => handleNewInvoiceItemChange(index, 'itemId', e.target.value)} style={inputStyle} />
                                <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleNewInvoiceItemChange(index, 'itemName', e.target.value)} style={inputStyle} />
                            </div>
                             <div style={formRowStyle}>
                                <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleNewInvoiceItemChange(index, 'quantity', parseFloat(e.target.value))} style={inputStyle} />
                                <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleNewInvoiceItemChange(index, 'unitPrice', parseFloat(e.target.value))} style={inputStyle} />
                            </div>
                            <input type="text" placeholder="Line Description" value={item.description} onChange={(e) => handleNewInvoiceItemChange(index, 'description', e.target.value)} style={inputStyle} />
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={handleAddItemToNewInvoice} style={{margin: '10px 0'}}>Add Item</Button>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Invoice (Draft)</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
