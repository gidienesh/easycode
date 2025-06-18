// src/app/finance/inventory/stock-transactions/page.tsx
"use client";

import React, { useState } from 'react';
import {
    mockData,
    StockTransactionType,
    mockItemMasterData,
    mockVendorsData,
    mockCustomersData,
    mockPurchaseOrdersData,
    mockSalesOrdersData
} from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interface for Stock Transaction items for type safety
interface StockTransactionItem {
  id: string;
  transactionDate: string;
  transactionType: StockTransactionType;
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  referenceId?: string; // PO, SO, Adjustment Ref
  source?: string; // e.g. Vendor Name, From Warehouse/Dept
  destination?: string; // e.g. To Warehouse/Dept, Customer Name
  notes?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};

export default function StockTransactionsPage() {
  const [stockTransactions, setStockTransactions] = useState<StockTransactionItem[]>(mockData.inventory.stockTransactions);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'receipt' | 'issuance' | null>(null);

  const initialFormData = { transactionDate: new Date().toISOString().split('T')[0], itemId: '', quantity: 1, unitCost:0, referenceId: '', notes: '', source: '', destination: ''};
  const [formData, setFormData] = useState<any>(initialFormData);

  const handleOpenModal = (mode: 'receipt' | 'issuance') => {
    setModalMode(mode);
    setFormData({
        ...initialFormData,
        transactionType: mode === 'receipt' ? StockTransactionType.GOODS_RECEIPT_DIRECT : StockTransactionType.GOODS_ISSUANCE_INTERNAL,
        source: mode === 'receipt' ? '' : 'Main Warehouse', // Default source/dest
        destination: mode === 'receipt' ? 'Main Warehouse' : '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode(null);
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    if (['quantity', 'unitCost'].includes(name)) {
        processedValue = parseFloat(value) || 0;
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
    const newTransaction: StockTransactionItem = {
      id: `${formData.transactionType.slice(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      ...formData,
      itemName: item.itemName,
      totalCost: formData.transactionType.includes('RECEIPT') || formData.transactionType.includes('ADJUSTMENT_IN') ? (formData.quantity * formData.unitCost) : undefined,
    };
    setStockTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()));

    // Mock update item master quantity (very basic)
    const itemIndex = mockData.inventory.itemMaster.findIndex(i => i.id === formData.itemId);
    if(itemIndex !== -1) {
        if(formData.transactionType.includes('RECEIPT') || formData.transactionType.includes('ADJUSTMENT_IN') || formData.transactionType.includes('TRANSFER_IN')) {
            mockData.inventory.itemMaster[itemIndex].quantityOnHand += Number(formData.quantity);
        } else if (formData.transactionType.includes('ISSUANCE') || formData.transactionType.includes('ADJUSTMENT_OUT') || formData.transactionType.includes('TRANSFER_OUT')) {
            mockData.inventory.itemMaster[itemIndex].quantityOnHand -= Number(formData.quantity);
        }
    }
    alert(`Placeholder: Stock transaction ${newTransaction.id} recorded (mock).`);
    console.log('New Stock Transaction:', newTransaction);
    handleModalClose();
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Inventory Stock Transactions</h1>
        <div>
            <Button variant="primary" onClick={() => handleOpenModal('receipt')} style={{marginRight: '0.5rem'}}>Record Goods Receipt</Button>
            <Button variant="primary" onClick={() => handleOpenModal('issuance')}>Record Goods Issuance</Button>
        </div>
      </header>

      <Card title="Stock Movement History">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Trans. ID</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle} align="right">Qty</th>
              <th style={thStyle} align="right">Unit Cost</th>
              <th style={thStyle} align="right">Total Cost</th>
              <th style={thStyle}>Ref. ID</th>
              <th style={thStyle}>Source/Dest.</th>
            </tr>
          </thead>
          <tbody>
            {stockTransactions.map((trans) => (
              <tr key={trans.id}>
                <td style={tdStyle}>{new Date(trans.transactionDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{trans.id}</td>
                <td style={tdStyle}>{trans.transactionType}</td>
                <td style={tdStyle}>{trans.itemName} ({trans.itemId})</td>
                <td style={tdStyle} align="right">{trans.quantity}</td>
                <td style={tdStyle} align="right">{trans.unitCost?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'}</td>
                <td style={tdStyle} align="right">{trans.totalCost?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'}</td>
                <td style={tdStyle}>{trans.referenceId || 'N/A'}</td>
                <td style={tdStyle}>{trans.transactionType.includes('RECEIPT') || trans.transactionType.includes('TRANSFER_IN') ? `From: ${trans.source}` : `To: ${trans.destination}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stockTransactions.length === 0 && <p>No stock transactions found.</p>}
      </Card>

      {/* Modal for Goods Receipt/Issuance */}
      {showModal && modalMode && (
         <div style={modalOverlayStyle} onClick={handleModalClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={modalMode === 'receipt' ? "Record Goods Receipt" : "Record Goods Issuance"}>
                <form onSubmit={handleFormSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Transaction Date: <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        <div><label>Transaction Type:
                            <select name="transactionType" value={formData.transactionType} onChange={handleFormChange} style={inputStyle}>
                                {modalMode === 'receipt' ? (
                                    <>
                                    <option value={StockTransactionType.GOODS_RECEIPT_DIRECT}>Goods Receipt (Direct)</option>
                                    <option value={StockTransactionType.GOODS_RECEIPT_PO}>Goods Receipt (PO)</option>
                                    <option value={StockTransactionType.STOCK_ADJUSTMENT_IN}>Stock Adjustment (In)</option>
                                    <option value={StockTransactionType.STOCK_TRANSFER_IN}>Stock Transfer (In)</option>
                                    </>
                                ) : (
                                    <>
                                    <option value={StockTransactionType.GOODS_ISSUANCE_INTERNAL}>Goods Issuance (Internal)</option>
                                    <option value={StockTransactionType.GOODS_ISSUANCE_SO}>Goods Issuance (SO)</option>
                                    <option value={StockTransactionType.STOCK_ADJUSTMENT_OUT}>Stock Adjustment (Out)</option>
                                    <option value={StockTransactionType.STOCK_TRANSFER_OUT}>Stock Transfer (Out)</option>
                                    </>
                                )}
                            </select>
                        </label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Item: <select name="itemId" value={formData.itemId} onChange={handleFormChange} required style={inputStyle}><option value="">-- Select Item --</option>{mockItemMasterData.filter(i=>i.isActive && i.itemType !== ItemType.SERVICE).map(i => <option key={i.id} value={i.id}>{i.itemName} ({i.itemCode})</option>)}</select></label></div>
                        <div><label>Quantity: <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} required style={inputStyle} min="1"/></label></div>
                    </div>
                     { (formData.transactionType.includes('RECEIPT') || formData.transactionType.includes('ADJUSTMENT_IN')) &&
                        <div><label>Unit Cost: <input type="number" name="unitCost" value={formData.unitCost} onChange={handleFormChange} style={inputStyle} min="0"/></label></div>
                     }
                    <div style={formRowStyle}>
                         <div><label>Reference ID (PO#, SO#, etc.): <input type="text" name="referenceId" value={formData.referenceId} onChange={handleFormChange} style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>{modalMode === 'receipt' ? 'Source (e.g., Vendor)' : 'Source Warehouse/Dept.'}: <input type="text" name="source" value={formData.source} onChange={handleFormChange} style={inputStyle}/></label></div>
                        <div><label>{modalMode === 'receipt' ? 'Destination Warehouse/Dept.' : 'Destination (e.g., Customer, Dept.)'}: <input type="text" name="destination" value={formData.destination} onChange={handleFormChange} style={inputStyle}/></label></div>
                    </div>
                    <div><label>Notes: <textarea name="notes" value={formData.notes} onChange={handleFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Transaction</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
