// src/app/finance/ar/payments/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import {
    mockData,
    ARPaymentApplicationStatus,
    PaymentMethod, // Re-using from AP for now
    mockCustomersData,
    mockARInvoicesData
} from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface ARPaymentApplication {
  invoiceId: string;
  invoiceNumber: string;
  amountApplied: number;
}

interface ARPaymentReceivedItem {
  id: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  totalAmountReceived: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  unappliedAmount: number;
  status: ARPaymentApplicationStatus;
  applications: ARPaymentApplication[];
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function ARPaymentsPage() {
  const [paymentsReceived, setPaymentsReceived] = useState<ARPaymentReceivedItem[]>(
    mockData.accountsReceivable.paymentsReceived.map(p => ({
      ...p,
      // Ensure unappliedAmount is calculated if not directly in mock or needs recalculation
      unappliedAmount: p.totalAmountReceived - p.applications.reduce((sum, app) => sum + app.amountApplied, 0)
    }))
  );
  const [selectedPayment, setSelectedPayment] = useState<ARPaymentReceivedItem | null>(null);
  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);

  const initialNewPaymentData = { customerId: '', paymentDate: new Date().toISOString().split('T')[0], totalAmountReceived: 0, paymentMethod: PaymentMethod.BANK_TRANSFER, referenceNumber: '', applications: {} };
  const [newPaymentFormData, setNewPaymentFormData] = useState<any>(initialNewPaymentData);

  const openInvoicesForSelectedCustomer = useMemo(() => {
    if (!newPaymentFormData.customerId && !selectedPayment?.customerId) return [];
    const custId = selectedPayment?.customerId || newPaymentFormData.customerId;
    return mockARInvoicesData.filter(inv =>
        inv.customerId === custId &&
        (inv.status === ARInvoiceStatus.SENT || inv.status === ARInvoiceStatus.PARTIALLY_PAID || inv.status === ARInvoiceStatus.OVERDUE) &&
        inv.balanceDue > 0 // Only show invoices with a balance
    );
  }, [newPaymentFormData.customerId, selectedPayment]);


  const handleRecordNewPayment = () => {
    setNewPaymentFormData(initialNewPaymentData);
    setSelectedPayment(null); // Ensure not in "apply" mode for an existing payment
    setShowRecordModal(true);
  };

  const handleViewOrApplyPayment = (paymentId: string) => {
    const payment = paymentsReceived.find(p => p.id === paymentId);
    if (payment) {
        setSelectedPayment(payment); // This will be used to show details and current applications
        // For applying, we might pre-fill a form similar to new payment but with existing data
        const currentApplicationsForForm: any = {};
        payment.applications.forEach(app => {
            currentApplicationsForForm[app.invoiceId] = { invoiceId: app.invoiceId, invoiceNumber: app.invoiceNumber, amountToApply: app.amountApplied };
        });
        setNewPaymentFormData({ // Re-purpose newPaymentFormData for application UI
            customerId: payment.customerId,
            paymentDate: payment.paymentDate,
            totalAmountReceived: payment.totalAmountReceived,
            paymentMethod: payment.paymentMethod,
            referenceNumber: payment.referenceNumber || '',
            applications: currentApplicationsForForm, // Pre-fill with existing applications
            _existingPaymentId: payment.id, // To know we are editing/applying for an existing payment
            _currentUnapplied: payment.unappliedAmount,
        });
        setShowRecordModal(true); // Open the same modal, but title/logic will differ
    }
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setShowRecordModal(false);
  };

  const handleNewPaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewPaymentFormData({ ...newPaymentFormData, [e.target.name]: e.target.value });
  };

  const handleInvoiceApplicationChange = (invoiceId: string, invoiceNumber: string, amountToApplyStr: string) => {
    const amountToApply = parseFloat(amountToApplyStr) || 0;
    const currentSelectedInvoices = { ...newPaymentFormData.applications };

    if (amountToApply > 0) {
        currentSelectedInvoices[invoiceId] = { invoiceId, invoiceNumber, amountToApply };
    } else {
        delete currentSelectedInvoices[invoiceId];
    }
    setNewPaymentFormData({...newPaymentFormData, applications: currentSelectedInvoices });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appliedInvoices: ARPaymentApplication[] = Object.values(newPaymentFormData.applications);
    const totalApplied = appliedInvoices.reduce((sum, app) => sum + app.amountToApply, 0);

    if (newPaymentFormData._existingPaymentId) { // Applying an existing payment
        const paymentToUpdate = paymentsReceived.find(p => p.id === newPaymentFormData._existingPaymentId);
        if (!paymentToUpdate) return;

        if (totalApplied > paymentToUpdate.totalAmountReceived) {
            alert("Total amount applied cannot exceed the total amount received.");
            return;
        }
        const updatedPayment: ARPaymentReceivedItem = {
            ...paymentToUpdate,
            applications: appliedInvoices,
            unappliedAmount: paymentToUpdate.totalAmountReceived - totalApplied,
            status: totalApplied === paymentToUpdate.totalAmountReceived ? ARPaymentApplicationStatus.FULLY_APPLIED : (totalApplied > 0 ? ARPaymentApplicationStatus.PARTIALLY_APPLIED : ARPaymentApplicationStatus.UNAPPLIED),
        };
        setPaymentsReceived(paymentsReceived.map(p => p.id === newPaymentFormData._existingPaymentId ? updatedPayment : p));
        alert(`Payment ${paymentToUpdate.id} application updated (mock).`);

    } else { // Recording a new payment
        if (totalApplied > newPaymentFormData.totalAmountReceived) {
            alert("Total amount applied cannot exceed the total amount received for a new payment.");
            return;
        }
        const newPayment: ARPaymentReceivedItem = {
            id: `RCPT-${Date.now().toString().slice(-4)}`,
            customerId: newPaymentFormData.customerId,
            customerName: mockCustomersData.find(c => c.id === newPaymentFormData.customerId)?.name || 'Unknown Customer',
            paymentDate: newPaymentFormData.paymentDate,
            totalAmountReceived: Number(newPaymentFormData.totalAmountReceived),
            paymentMethod: newPaymentFormData.paymentMethod as PaymentMethod,
            referenceNumber: newPaymentFormData.referenceNumber,
            applications: appliedInvoices,
            unappliedAmount: Number(newPaymentFormData.totalAmountReceived) - totalApplied,
            status: totalApplied === Number(newPaymentFormData.totalAmountReceived) ? ARPaymentApplicationStatus.FULLY_APPLIED : (totalApplied > 0 ? ARPaymentApplicationStatus.PARTIALLY_APPLIED : ARPaymentApplicationStatus.UNAPPLIED),
        };
        setPaymentsReceived([...paymentsReceived, newPayment]);
        alert(`Placeholder: New AR Payment ${newPayment.id} recorded (mock).`);
    }
    console.log('Payment Form Data Submitted:', newPaymentFormData);
    handleCloseModal();
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Customer Payment Receipts</h1>
        <Button variant="primary" onClick={handleRecordNewPayment}>Record New Payment</Button>
      </header>

      <Card title="Manage Customer Payments">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Payment ID</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle} align="right">Amount Received</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle} align="right">Unapplied Amt.</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentsReceived.map((payment) => (
              <tr key={payment.id}>
                <td style={tdStyle}>{payment.id}</td>
                <td style={tdStyle}>{payment.customerName}</td>
                <td style={tdStyle}>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{payment.totalAmountReceived.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{payment.paymentMethod}</td>
                <td style={tdStyle} align="right">{payment.unappliedAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{payment.status}</td>
                <td style={tdStyle}>
                  <Button variant="secondary" size="sm" onClick={() => handleViewOrApplyPayment(payment.id)}>View/Apply</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paymentsReceived.length === 0 && <p>No payments received found.</p>}
      </Card>

      {/* Record/Apply Payment Modal */}
      {showRecordModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={newPaymentFormData._existingPaymentId ? `Apply Payment: ${newPaymentFormData._existingPaymentId}` : "Record New Customer Payment"}>
                <form onSubmit={handleFormSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Customer: <select name="customerId" value={newPaymentFormData.customerId} onChange={handleNewPaymentFormChange} required style={inputStyle} disabled={!!newPaymentFormData._existingPaymentId}><option value="">-- Select Customer --</option>{mockCustomersData.filter(c=>c.isActive).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
                        <div><label>Payment Date: <input type="date" name="paymentDate" value={newPaymentFormData.paymentDate} onChange={handleNewPaymentFormChange} required style={inputStyle} disabled={!!newPaymentFormData._existingPaymentId}/></label></div>
                    </div>
                     <div style={formRowStyle}>
                        <div><label>Amount Received: <input type="number" name="totalAmountReceived" value={newPaymentFormData.totalAmountReceived} onChange={handleNewPaymentFormChange} required style={inputStyle} disabled={!!newPaymentFormData._existingPaymentId}/></label></div>
                        <div><label>Payment Method: <select name="paymentMethod" value={newPaymentFormData.paymentMethod} onChange={handleNewPaymentFormChange} style={inputStyle} disabled={!!newPaymentFormData._existingPaymentId}>{Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm.replace('_', ' ')}</option>)}</select></label></div>
                    </div>
                    <div><label>Reference #: <input type="text" name="referenceNumber" value={newPaymentFormData.referenceNumber || ''} onChange={handleNewPaymentFormChange} style={inputStyle} disabled={!!newPaymentFormData._existingPaymentId}/></label></div>

                    <h4>Apply to Invoices (Remaining to apply: {(newPaymentFormData.totalAmountReceived - Object.values(newPaymentFormData.applications).reduce((sum: number, inv: any) => sum + inv.amountToApply, 0)).toFixed(2)})</h4>
                    {newPaymentFormData.customerId && openInvoicesForSelectedCustomer.length > 0 ? (
                        <div style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px'}}>
                        {openInvoicesForSelectedCustomer.map(inv => (
                            <div key={inv.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee'}}>
                                <div>
                                    <label htmlFor={`apply-${inv.id}`}>{inv.invoiceNumber} - Bal: {inv.balanceDue.toFixed(2)}</label>
                                </div>
                                <input
                                    type="number"
                                    id={`apply-${inv.id}`}
                                    value={newPaymentFormData.applications[inv.id]?.amountToApply || ''}
                                    onChange={(e) => handleInvoiceApplicationChange(inv.id, inv.invoiceNumber, e.target.value)}
                                    style={{width: '120px', padding: '5px'}}
                                    placeholder="Amount to Apply"
                                    max={inv.balanceDue} // Cannot apply more than balance due
                                    min="0"
                                />
                            </div>
                        ))}
                        </div>
                    ) : newPaymentFormData.customerId ? <p>No open invoices for this customer.</p> : <p>Select a customer to see open invoices.</p>}

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">{newPaymentFormData._existingPaymentId ? "Save Applications" : "Record Payment"}</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
