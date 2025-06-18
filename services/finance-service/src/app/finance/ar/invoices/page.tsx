// src/app/finance/ar/invoices/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, ARInvoiceStatus, mockCustomersData, mockSalesOrdersData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface ARInvoiceItemLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  description?: string;
}

interface ARInvoiceItem {
  id: string;
  customerId: string;
  customerName: string;
  salesOrderId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  status: ARInvoiceStatus;
  items: ARInvoiceItemLine[];
  notes?: string;
  isRecurring?: boolean;
  recurringSettings?: { frequency: string; endDate?: string };
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function ARInvoicesPage() {
  const [invoices, setInvoices] = useState<ARInvoiceItem[]>(mockData.accountsReceivable.invoices.map(inv => ({...inv, balanceDue: inv.totalAmount - inv.amountPaid })));
  const [selectedInvoice, setSelectedInvoice] = useState<ARInvoiceItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const initialNewInvoiceData = { customerId: '', salesOrderId: '', invoiceNumber: `INV-${Date.now().toString().slice(-5)}`, invoiceDate: new Date().toISOString().split('T')[0], dueDate: '', totalAmount: 0, amountPaid: 0, currency: 'KES', items: [], notes: '', isRecurring: false, recurringSettings: {frequency: 'MONTHLY'} };
  const [newInvoiceData, setNewInvoiceData] = useState<any>(initialNewInvoiceData);


  const handleCreateNewInvoice = () => {
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
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;

    if (name === "isRecurring") {
        setNewInvoiceData({ ...newInvoiceData, [name]: checked });
    } else if (name.startsWith("recurringSettings.")) {
        const key = name.split('.')[1];
        setNewInvoiceData({ ...newInvoiceData, recurringSettings: { ...newInvoiceData.recurringSettings, [key]: value }});
    }
    else {
        setNewInvoiceData({ ...newInvoiceData, [name]: value });
    }
  };

  const handleNewInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotalAmount = newInvoiceData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const newInv: ARInvoiceItem = {
        id: `ARINV-${Date.now().toString().slice(-4)}`,
        ...newInvoiceData,
        customerName: mockCustomersData.find(c => c.id === newInvoiceData.customerId)?.name || 'Unknown Customer',
        totalAmount: calculatedTotalAmount,
        amountPaid: Number(newInvoiceData.amountPaid) || 0,
        balanceDue: calculatedTotalAmount - (Number(newInvoiceData.amountPaid) || 0),
        status: ARInvoiceStatus.DRAFT, // Default to draft
    };
    setInvoices([...invoices, newInv]);
    alert(`Placeholder: New AR Invoice ${newInv.id} created (mock).`);
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
        <h1>AR Invoice Management</h1>
        <Button variant="primary" onClick={handleCreateNewInvoice}>Create New Invoice</Button>
      </header>

      <Card title="Manage AR Invoices">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>SO #</th>
              <th style={thStyle}>Invoice Date</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle} align="right">Total</th>
              <th style={thStyle} align="right">Balance Due</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={tdStyle}>{invoice.invoiceNumber} ({invoice.id})</td>
                <td style={tdStyle}>{invoice.customerName}</td>
                <td style={tdStyle}>{invoice.salesOrderId || 'N/A'}</td>
                <td style={tdStyle}>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{invoice.currency} {invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle} align="right">{invoice.currency} {invoice.balanceDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{invoice.status}</td>
                <td style={tdStyle}>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(invoice.id)}>Details</Button>
                    <Button variant="primary" size="sm" onClick={() => alert(`Send reminder for ${invoice.id}`)}>Send Reminder</Button>
                    <Button variant="primary" size="sm" onClick={() => alert(`Record payment for ${invoice.id}`)}>Record Payment</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p>No AR invoices found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedInvoice && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`AR Invoice Details: ${selectedInvoice.invoiceNumber}`}>
              <p><strong>Customer:</strong> {selectedInvoice.customerName} ({selectedInvoice.customerId})</p>
              {selectedInvoice.salesOrderId && <p><strong>Related SO #:</strong> {selectedInvoice.salesOrderId}</p>}
              <p><strong>Invoice Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> {selectedInvoice.currency} {selectedInvoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Amount Paid:</strong> {selectedInvoice.currency} {selectedInvoice.amountPaid.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Balance Due:</strong> {selectedInvoice.currency} {selectedInvoice.balanceDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
              {selectedInvoice.isRecurring && <p><strong>Recurring:</strong> Yes (Frequency: {selectedInvoice.recurringSettings?.frequency}, End Date: {selectedInvoice.recurringSettings?.endDate || 'N/A'})</p>}
              {selectedInvoice.notes && <p><strong>Notes:</strong> {selectedInvoice.notes}</p>}
              <h4>Items:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Item</th><th style={thStyle} align="right">Qty</th><th style={thStyle} align="right">Unit Price</th><th style={thStyle} align="right">Total</th></tr></thead>
                <tbody>{selectedInvoice.items.map((item, idx) => (<tr key={idx}><td style={tdStyle}>{item.itemName} ({item.itemId})</td><td style={tdStyle} align="right">{item.quantity}</td><td style={tdStyle} align="right">{item.unitPrice.toFixed(2)}</td><td style={tdStyle} align="right">{item.lineTotal.toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="secondary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal (Simplified) */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Create New AR Invoice">
                <form onSubmit={handleNewInvoiceSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Customer: <select name="customerId" value={newInvoiceData.customerId} onChange={handleNewInvoiceFormChange} required style={inputStyle}><option value="">-- Select Customer --</option>{mockCustomersData.filter(c=>c.isActive).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
                        <div><label>Invoice #: <input type="text" name="invoiceNumber" value={newInvoiceData.invoiceNumber} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                     <div style={formRowStyle}>
                        <div><label>Related SO #: <select name="salesOrderId" value={newInvoiceData.salesOrderId} onChange={handleNewInvoiceFormChange} style={inputStyle}><option value="">N/A</option>{mockSalesOrdersData.filter(so=>so.customerId === newInvoiceData.customerId).map(so => <option key={so.id} value={so.id}>{so.id} - {so.totalAmount}</option>)}</select></label></div>
                        <div><label>Invoice Date: <input type="date" name="invoiceDate" value={newInvoiceData.invoiceDate} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Due Date: <input type="date" name="dueDate" value={newInvoiceData.dueDate} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                        <div><label>Currency: <input type="text" name="currency" value={newInvoiceData.currency} onChange={handleNewInvoiceFormChange} required style={inputStyle}/></label></div>
                    </div>
                     <div><label>Amount Paid (if any): <input type="number" name="amountPaid" value={newInvoiceData.amountPaid || 0} onChange={handleNewInvoiceFormChange} style={inputStyle}/></label></div>
                    <div><label>Notes: <textarea name="notes" value={newInvoiceData.notes} onChange={handleNewInvoiceFormChange} style={{...inputStyle, height: '40px'}}></textarea></label></div>
                    <div style={{margin: '1rem 0'}}><label><input type="checkbox" name="isRecurring" checked={newInvoiceData.isRecurring} onChange={handleNewInvoiceFormChange} /> Is Recurring Invoice?</label></div>
                    {newInvoiceData.isRecurring && (
                        <div style={formRowStyle}>
                            <div><label>Frequency: <select name="recurringSettings.frequency" value={newInvoiceData.recurringSettings?.frequency || 'MONTHLY'} onChange={handleNewInvoiceFormChange} style={inputStyle}><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="YEARLY">Yearly</option></select></label></div>
                            <div><label>End Date (optional): <input type="date" name="recurringSettings.endDate" value={newInvoiceData.recurringSettings?.endDate || ''} onChange={handleNewInvoiceFormChange} style={inputStyle}/></label></div>
                        </div>
                    )}

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
