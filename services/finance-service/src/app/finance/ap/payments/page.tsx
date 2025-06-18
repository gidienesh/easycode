// src/app/finance/ap/payments/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, APPaymentStatus, PaymentMethod, mockVendorsData, mockAPInvoicesData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface PaymentInvoiceDetail {
  invoiceId: string;
  invoiceNumber: string;
  amountToPay: number;
  // Add originalInvoiceAmount, outstandingAmount if needed for context
}

interface APPaymentItem {
  id: string;
  paymentRunId?: string;
  vendorId: string;
  vendorName: string;
  invoices: PaymentInvoiceDetail[];
  totalAmount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: APPaymentStatus;
  notes?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function APPaymentsPage() {
  const [payments, setPayments] = useState<APPaymentItem[]>(mockData.accountsPayable.payments);
  const [selectedPayment, setSelectedPayment] = useState<APPaymentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const initialNewPaymentData = { vendorId: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: PaymentMethod.BANK_TRANSFER, notes: '', selectedInvoices: {} };
  const [newPaymentData, setNewPaymentData] = useState<any>(initialNewPaymentData);

  const availableInvoicesForNewPayment = useMemo(() => {
    if (!newPaymentData.vendorId) return [];
    return mockAPInvoicesData.filter(inv =>
        inv.vendorId === newPaymentData.vendorId &&
        (inv.status === APInvoiceStatus.APPROVED_FOR_PAYMENT || inv.status === APInvoiceStatus.PARTIALLY_PAID)
    );
  }, [newPaymentData.vendorId]);


  const handleCreatePaymentProposal = () => {
    setNewPaymentData(initialNewPaymentData);
    setShowCreateModal(true);
  };

  const handleViewDetails = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) setSelectedPayment(payment);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setShowCreateModal(false);
  };

  const handleNewPaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewPaymentData({ ...newPaymentData, [e.target.name]: e.target.value });
  };

  const handleInvoiceSelectionForPayment = (invoiceId: string, checked: boolean, amount: number) => {
    const currentSelected = { ...newPaymentData.selectedInvoices };
    if (checked) {
        const inv = mockAPInvoicesData.find(i => i.id === invoiceId);
        currentSelected[invoiceId] = { invoiceId, invoiceNumber: inv?.invoiceNumber, amountToPay: amount };
    } else {
        delete currentSelected[invoiceId];
    }
    setNewPaymentData({...newPaymentData, selectedInvoices: currentSelected });
  };

  const handleNewPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoicesToPay: PaymentInvoiceDetail[] = Object.values(newPaymentData.selectedInvoices);
    if (invoicesToPay.length === 0) {
        alert("Please select at least one invoice to pay.");
        return;
    }
    const totalAmount = invoicesToPay.reduce((sum, inv) => sum + inv.amountToPay, 0);
    const newPayment: APPaymentItem = {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        vendorId: newPaymentData.vendorId,
        vendorName: mockVendorsData.find(v => v.id === newPaymentData.vendorId)?.name || 'Unknown Vendor',
        invoices: invoicesToPay,
        totalAmount,
        paymentDate: newPaymentData.paymentDate,
        paymentMethod: newPaymentData.paymentMethod as PaymentMethod,
        status: APPaymentStatus.PENDING_APPROVAL, // Default status for new proposal
        notes: newPaymentData.notes,
    };
    setPayments([...payments, newPayment]);
    alert(`Placeholder: New AP Payment ${newPayment.id} proposed (mock).`);
    console.log('New Payment Data Submitted:', newPayment);
    handleCloseModal();
  };

  const handleApprovePayment = (paymentId: string) => {
    setPayments(payments.map(p => p.id === paymentId ? {...p, status: APPaymentStatus.APPROVED } : p));
    alert(`Payment ${paymentId} approved (mock).`);
  };
  const handleRejectPayment = (paymentId: string) => {
     if (window.confirm(`Are you sure you want to reject payment ID: ${paymentId}?`)) {
        setPayments(payments.map(p => p.id === paymentId ? {...p, status: APPaymentStatus.REJECTED } : p));
        alert(`Payment ${paymentId} rejected (mock).`);
     }
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>AP Payment Processing</h1>
        <div>
            <Button variant="primary" onClick={handleCreatePaymentProposal} style={{marginRight: '0.5rem'}}>Create Payment Proposal</Button>
            <Button variant="secondary" onClick={() => alert("View Payment History - Placeholder")}>View Payment History</Button>
        </div>
      </header>

      <Card title="Pending Payments / Payment Runs">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Payment ID</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>Invoice(s)</th>
              <th style={thStyle} align="right">Total Amount</th>
              <th style={thStyle}>Payment Date</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={tdStyle}>{payment.id} {payment.paymentRunId && `(${payment.paymentRunId})`}</td>
                <td style={tdStyle}>{payment.vendorName}</td>
                <td style={tdStyle}>{payment.invoices.map(inv => inv.invoiceNumber).join(', ')}</td>
                <td style={tdStyle} align="right">{payment.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{payment.paymentMethod}</td>
                <td style={tdStyle}>{payment.status}</td>
                <td style={tdStyle}>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(payment.id)}>Details</Button>
                    {payment.status === APPaymentStatus.PENDING_APPROVAL && (
                        <>
                        <Button variant="primary" size="sm" onClick={() => handleApprovePayment(payment.id)}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectPayment(payment.id)}>Reject</Button>
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p>No payments found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedPayment && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Payment Details: ${selectedPayment.id}`}>
              <p><strong>Vendor:</strong> {selectedPayment.vendorName} ({selectedPayment.vendorId})</p>
              {selectedPayment.paymentRunId && <p><strong>Payment Run ID:</strong> {selectedPayment.paymentRunId}</p>}
              <p><strong>Payment Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> {selectedPayment.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</p>
              <p><strong>Status:</strong> {selectedPayment.status}</p>
              {selectedPayment.notes && <p><strong>Notes:</strong> {selectedPayment.notes}</p>}
              <h4>Invoices Paid:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Invoice #</th><th style={thStyle} align="right">Amount Paid</th></tr></thead>
                <tbody>{selectedPayment.invoices.map(inv => (<tr key={inv.invoiceId}><td style={tdStyle}>{inv.invoiceNumber} ({inv.invoiceId})</td><td style={tdStyle} align="right">{inv.amountToPay.toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="secondary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create Payment Proposal Modal */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Create Payment Proposal">
                <form onSubmit={handleNewPaymentSubmit}>
                    <div style={formRowStyle}>
                        <div><label>Vendor: <select name="vendorId" value={newPaymentData.vendorId} onChange={handleNewPaymentFormChange} required style={inputStyle}><option value="">-- Select Vendor --</option>{mockVendorsData.filter(v=>v.isActive).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label></div>
                        <div><label>Payment Date: <input type="date" name="paymentDate" value={newPaymentData.paymentDate} onChange={handleNewPaymentFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Payment Method: <select name="paymentMethod" value={newPaymentData.paymentMethod} onChange={handleNewPaymentFormChange} style={inputStyle}>{Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm.replace('_', ' ')}</option>)}</select></label></div>
                    </div>
                    <div><label>Notes: <textarea name="notes" value={newPaymentData.notes} onChange={handleNewPaymentFormChange} style={{...inputStyle, height: '60px'}}></textarea></label></div>

                    <h4>Select Invoices to Pay:</h4>
                    {newPaymentData.vendorId && availableInvoicesForNewPayment.length > 0 ? (
                        <div style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px'}}>
                        {availableInvoicesForNewPayment.map(inv => (
                            <div key={inv.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee'}}>
                                <div>
                                    <input type="checkbox" id={`inv-${inv.id}`} checked={!!newPaymentData.selectedInvoices[inv.id]} onChange={(e) => handleInvoiceSelectionForPayment(inv.id, e.target.checked, inv.totalAmount)} style={{marginRight: '10px'}}/>
                                    <label htmlFor={`inv-${inv.id}`}>{inv.invoiceNumber} - {inv.currency} {inv.totalAmount.toFixed(2)} (Due: {new Date(inv.dueDate).toLocaleDateString()})</label>
                                </div>
                                {newPaymentData.selectedInvoices[inv.id] &&
                                 <input type="number" value={newPaymentData.selectedInvoices[inv.id].amountToPay}
                                        onChange={(e)=> handleInvoiceSelectionForPayment(inv.id, true, parseFloat(e.target.value))}
                                        style={{width: '100px', padding: '5px'}} max={inv.totalAmount} />
                                }
                            </div>
                        ))}
                        </div>
                    ) : newPaymentData.vendorId ? <p>No approved invoices found for this vendor.</p> : <p>Select a vendor to see available invoices.</p>}

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Proposal</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
