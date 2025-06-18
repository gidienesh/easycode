// src/app/finance/ap/expenses/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData, ExpenseClaimStatus } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for type safety
interface ExpenseClaimItemDetail {
  date: string;
  expenseType: string; // e.g., "Meals", "Travel", "Accommodation"
  description: string;
  amount: number;
  receiptAttached: boolean | string; // boolean or mock filename string
}

interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  submissionDate: string;
  description: string;
  totalAmount: number;
  currency: string;
  status: ExpenseClaimStatus;
  items: ExpenseClaimItemDetail[];
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};


export default function ExpenseManagementPage() {
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(mockData.accountsPayable.expenseClaims);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const initialNewClaimData = { employeeName: 'Current User (Mock)', employeeId: 'EMP_CurrentUser', submissionDate: new Date().toISOString().split('T')[0], description: '', currency: 'KES', items: [] };
  const [newClaimData, setNewClaimData] = useState<any>(initialNewClaimData);


  const handleNewClaim = () => {
    setNewClaimData(initialNewClaimData); // Reset form
    setShowCreateModal(true);
  };

  const handleViewDetails = (claimId: string) => {
    const claim = expenseClaims.find(c => c.id === claimId);
    if (claim) setSelectedClaim(claim);
  };

  const handleCloseModal = () => {
    setSelectedClaim(null);
    setShowCreateModal(false);
  };

  const handleNewClaimFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewClaimData({ ...newClaimData, [e.target.name]: e.target.value });
  };

  const handleNewClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = newClaimData.items.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    const newClaim: ExpenseClaim = {
        id: `EXP-${Date.now().toString().slice(-4)}`,
        ...newClaimData,
        totalAmount,
        status: ExpenseClaimStatus.SUBMITTED, // Default to submitted
    };
    setExpenseClaims([...expenseClaims, newClaim]);
    alert(`Placeholder: New Expense Claim ${newClaim.id} submitted (mock).`);
    console.log('New Claim Data Submitted:', newClaim);
    handleCloseModal();
  };

   const handleAddItemToNewClaim = () => {
    setNewClaimData({
        ...newClaimData,
        items: [...newClaimData.items, { date: new Date().toISOString().split('T')[0], expenseType: '', description: '', amount: 0, receiptAttached: false }]
    });
  };
  const handleNewClaimItemChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedItems = newClaimData.items.map((item: any, i: number) => {
        if (i === index) {
            return { ...item, [field]: value };
        }
        return item;
    });
    setNewClaimData({ ...newClaimData, items: updatedItems });
  };

  const handleApproveClaim = (claimId: string) => {
    setExpenseClaims(expenseClaims.map(c => c.id === claimId && c.status === ExpenseClaimStatus.PENDING_APPROVAL ? {...c, status: ExpenseClaimStatus.APPROVED } : c));
    alert(`Expense claim ${claimId} approved (mock).`);
  };
  const handleRejectClaim = (claimId: string) => {
     if (window.confirm(`Are you sure you want to reject claim ID: ${claimId}?`)) {
        setExpenseClaims(expenseClaims.map(c => c.id === claimId && (c.status === ExpenseClaimStatus.PENDING_APPROVAL || c.status === ExpenseClaimStatus.SUBMITTED) ? {...c, status: ExpenseClaimStatus.REJECTED } : c));
        alert(`Expense claim ${claimId} rejected (mock).`);
     }
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Employee Expense Management</h1>
        <Button variant="primary" onClick={handleNewClaim}>Submit New Expense Claim</Button>
      </header>

      <Card title="Manage Expense Claims">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Claim ID</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Submission Date</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle} align="right">Total Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseClaims.map((claim) => (
              <tr key={claim.id}>
                <td style={tdStyle}>{claim.id}</td>
                <td style={tdStyle}>{claim.employeeName} ({claim.employeeId})</td>
                <td style={tdStyle}>{new Date(claim.submissionDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{claim.description}</td>
                <td style={tdStyle} align="right">{claim.currency} {claim.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{claim.status}</td>
                <td style={tdStyle}>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(claim.id)}>Details</Button>
                    {(claim.status === ExpenseClaimStatus.PENDING_APPROVAL || claim.status === ExpenseClaimStatus.SUBMITTED) && (
                        <>
                        <Button variant="primary" size="sm" onClick={() => handleApproveClaim(claim.id)}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectClaim(claim.id)}>Reject</Button>
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenseClaims.length === 0 && <p>No expense claims found.</p>}
      </Card>

      {/* View Details Modal */}
      {selectedClaim && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Expense Claim Details: ${selectedClaim.id}`}>
              <p><strong>Employee:</strong> {selectedClaim.employeeName} ({selectedClaim.employeeId})</p>
              <p><strong>Submission Date:</strong> {new Date(selectedClaim.submissionDate).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {selectedClaim.description}</p>
              <p><strong>Total Amount:</strong> {selectedClaim.currency} {selectedClaim.totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              <p><strong>Status:</strong> {selectedClaim.status}</p>
              <h4>Items:</h4>
              <table style={{...tableStyle, fontSize: '0.9em'}}>
                <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Type</th><th style={thStyle}>Description</th><th style={thStyle} align="right">Amount</th><th style={thStyle}>Receipt</th></tr></thead>
                <tbody>{selectedClaim.items.map((item, idx) => (<tr key={idx}><td style={tdStyle}>{new Date(item.date).toLocaleDateString()}</td><td style={tdStyle}>{item.expenseType}</td><td style={tdStyle}>{item.description}</td><td style={tdStyle} align="right">{item.amount.toFixed(2)}</td><td style={tdStyle}>{item.receiptAttached === true ? 'Yes' : item.receiptAttached || 'No'}</td></tr>))}</tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}><Button variant="secondary" onClick={handleCloseModal}>Close</Button></div>
            </Card>
          </div>
        </div>
      )}

      {/* Create New Expense Claim Modal (Simplified) */}
      {showCreateModal && (
         <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title="Submit New Expense Claim">
                <form onSubmit={handleNewClaimSubmit}>
                    {/* Employee fields could be pre-filled if user is logged in */}
                    <div style={formRowStyle}>
                        <div><label>Employee Name: <input type="text" name="employeeName" value={newClaimData.employeeName} onChange={handleNewClaimFormChange} required style={inputStyle}/></label></div>
                        <div><label>Employee ID: <input type="text" name="employeeId" value={newClaimData.employeeId} onChange={handleNewClaimFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Submission Date: <input type="date" name="submissionDate" value={newClaimData.submissionDate} onChange={handleNewClaimFormChange} required style={inputStyle}/></label></div>
                        <div><label>Currency: <input type="text" name="currency" value={newClaimData.currency} onChange={handleNewClaimFormChange} required style={inputStyle}/></label></div>
                    </div>
                    <div><label>Overall Description: <textarea name="description" value={newClaimData.description} onChange={handleNewClaimFormChange} required style={{...inputStyle, height: '60px'}}></textarea></label></div>

                    <h4>Expense Items</h4>
                    {newClaimData.items.map((item: any, index: number) => (
                        <div key={index} style={{border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px'}}>
                            <div style={formRowStyle}>
                                <div><label>Date: <input type="date" value={item.date} onChange={(e) => handleNewClaimItemChange(index, 'date', e.target.value)} style={inputStyle} /></label></div>
                                <div><label>Expense Type: <input type="text" placeholder="e.g., Meals, Travel" value={item.expenseType} onChange={(e) => handleNewClaimItemChange(index, 'expenseType', e.target.value)} style={inputStyle} /></label></div>
                            </div>
                            <div style={formRowStyle}>
                                <div><label>Amount: <input type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleNewClaimItemChange(index, 'amount', parseFloat(e.target.value))} style={inputStyle} /></label></div>
                                <div><label>Receipt Attached: <input type="text" placeholder="Filename or Yes/No" value={item.receiptAttached.toString()} onChange={(e) => handleNewClaimItemChange(index, 'receiptAttached', e.target.value)} style={inputStyle} /></label></div>
                            </div>
                            <label>Line Description: <input type="text" value={item.description} onChange={(e) => handleNewClaimItemChange(index, 'description', e.target.value)} style={inputStyle} /></label>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={handleAddItemToNewClaim} style={{margin: '10px 0'}}>Add Expense Item</Button>

                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" variant="primary">Submit Claim</Button>
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
