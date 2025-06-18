// src/app/finance/ar/collections/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import {
    mockData,
    ARInvoiceStatus,
    CollectionActivityType,
    getMockCollectionLogByInvoiceId
} from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface OverdueInvoiceItem {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  overdueDays: number;
  balanceDue: number;
  currency: string;
  status: ARInvoiceStatus;
  lastCollectionLog?: CollectionLogItem | null;
}

interface CollectionLogItem {
  id: string;
  customerId: string;
  invoiceId: string;
  logDate: string;
  activityType: CollectionActivityType;
  notes: string;
  nextFollowUpDate?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};
const filterSectionStyle: React.CSSProperties = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };


export default function CollectionsPage() {
  const [collectionLogs, setCollectionLogs] = useState<CollectionLogItem[]>(mockData.accountsReceivable.collectionLogs);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [currentInvoiceForLog, setCurrentInvoiceForLog] = useState<OverdueInvoiceItem | null>(null);
  const [logFormData, setLogFormData] = useState<Partial<Omit<CollectionLogItem, 'id' | 'customerId' | 'invoiceId'>>>({
    logDate: new Date().toISOString().split('T')[0],
    activityType: CollectionActivityType.EMAIL_REMINDER,
  });

  // Simulate current date for overdue calculation
  const today = new Date('2023-11-28'); // Set a fixed "today" for consistent overdue calculation with mock data

  const overdueInvoices = useMemo((): OverdueInvoiceItem[] => {
    return mockData.accountsReceivable.invoices
      .filter(inv => {
        const dueDate = new Date(inv.dueDate);
        return inv.balanceDue > 0 && dueDate < today && inv.status !== ARInvoiceStatus.PAID && inv.status !== ARInvoiceStatus.VOID;
      })
      .map(inv => {
        const dueDate = new Date(inv.dueDate);
        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const latestLogs = getMockCollectionLogByInvoiceId(inv.id);

        return {
          ...inv,
          overdueDays: diffDays,
          lastCollectionLog: latestLogs && latestLogs.length > 0 ? latestLogs[0] : null,
        };
      })
      .sort((a, b) => b.overdueDays - a.overdueDays); // Sort by most overdue first
  }, [mockData.accountsReceivable.invoices, collectionLogs]); // Re-calculate if logs change

  const handleOpenLogModal = (invoice: OverdueInvoiceItem) => {
    setCurrentInvoiceForLog(invoice);
    setLogFormData({
        logDate: new Date().toISOString().split('T')[0],
        activityType: CollectionActivityType.EMAIL_REMINDER,
        notes: '',
        nextFollowUpDate: new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0] // Default next follow up in 7 days
    });
    setShowLogModal(true);
  };

  const handleCloseLogModal = () => {
    setShowLogModal(false);
    setCurrentInvoiceForLog(null);
  };

  const handleLogFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setLogFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoiceForLog || !logFormData.activityType || !logFormData.logDate) {
        alert("Activity type and date are required.");
        return;
    }
    const newLog: CollectionLogItem = {
        id: `CL${Date.now().toString().slice(-5)}`,
        customerId: currentInvoiceForLog.customerId,
        invoiceId: currentInvoiceForLog.id,
        logDate: logFormData.logDate!,
        activityType: logFormData.activityType!,
        notes: logFormData.notes || '',
        nextFollowUpDate: logFormData.nextFollowUpDate,
    };
    setCollectionLogs([...collectionLogs, newLog]); // Update local state for logs
    alert('Collection activity logged (mock).');
    console.log("New Log:", newLog);
    handleCloseLogModal();
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Debt Collection & Dunning</h1>
        {/* Add high-level action buttons if needed */}
      </header>

      <Card title="Filters & Overview">
        <div style={filterSectionStyle}>
            <input type="text" placeholder="Filter by Customer..." style={inputStyle} />
            <input type="number" placeholder="Min Overdue Days" style={{...inputStyle, width: '150px'}} />
            <select style={inputStyle}><option value="">Dunning Stage (All)</option></select>
            <Button variant="primary" onClick={() => alert('Apply Filters - Placeholder')}>Apply Filters</Button>
        </div>
         <p>Displaying {overdueInvoices.length} overdue invoice(s).</p>
      </Card>

      <Card title="Overdue Invoices & Collection Activities">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle} align="center">Overdue Days</th>
              <th style={thStyle} align="right">Amount Due</th>
              <th style={thStyle}>Last Action</th>
              <th style={thStyle}>Next Follow-up</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {overdueInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={tdStyle}>{invoice.customerName}</td>
                <td style={tdStyle}>{invoice.invoiceNumber}</td>
                <td style={tdStyle}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="center">{invoice.overdueDays}</td>
                <td style={tdStyle} align="right">{invoice.currency} {invoice.balanceDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{invoice.lastCollectionLog ? `${invoice.lastCollectionLog.activityType} on ${new Date(invoice.lastCollectionLog.logDate).toLocaleDateString()}` : 'None'}</td>
                <td style={tdStyle}>{invoice.lastCollectionLog?.nextFollowUpDate ? new Date(invoice.lastCollectionLog.nextFollowUpDate).toLocaleDateString() : 'N/A'}</td>
                <td style={tdStyle}>
                  <div style={buttonGroupStyle}>
                    <Button variant="secondary" size="sm" onClick={() => alert(`View Invoice ${invoice.id}`)}>View Invoice</Button>
                    <Button variant="primary" size="sm" onClick={() => handleOpenLogModal(invoice)}>Log Activity</Button>
                    <Button variant="secondary" size="sm" onClick={() => alert(`Send Reminder for ${invoice.id}`)}>Send Reminder</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {overdueInvoices.length === 0 && <p>No overdue invoices found.</p>}
      </Card>

      {/* Log Activity Modal */}
      {showLogModal && currentInvoiceForLog && (
        <div style={modalOverlayStyle} onClick={handleCloseLogModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Log Collection Activity for Invoice: ${currentInvoiceForLog.invoiceNumber}`}>
                <form onSubmit={handleLogSubmit}>
                    <p><strong>Customer:</strong> {currentInvoiceForLog.customerName}</p>
                    <p><strong>Amount Due:</strong> {currentInvoiceForLog.currency} {currentInvoiceForLog.balanceDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>

                    <div><label>Activity Date: <input type="date" name="logDate" value={logFormData.logDate} onChange={handleLogFormChange} required style={inputStyle}/></label></div>
                    <div>
                        <label>Activity Type:
                            <select name="activityType" value={logFormData.activityType} onChange={handleLogFormChange} required style={inputStyle}>
                                {Object.values(CollectionActivityType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </label>
                    </div>
                    <div><label>Notes: <textarea name="notes" value={logFormData.notes || ''} onChange={handleLogFormChange} style={{...inputStyle, height: '80px'}}></textarea></label></div>
                    <div><label>Next Follow-up Date: <input type="date" name="nextFollowUpDate" value={logFormData.nextFollowUpDate || ''} onChange={handleLogFormChange} style={inputStyle}/></label></div>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseLogModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Log</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
