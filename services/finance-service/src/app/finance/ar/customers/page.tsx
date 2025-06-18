// src/app/finance/ar/customers/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Extend CustomerItem interface for credit management fields
interface CustomerItem {
  id: string;
  name: string;
  kraPin?: string;
  email: string;
  phone: string;
  billingAddress?: string;
  shippingAddress?: string;
  city?: string;
  country?: string;
  creditLimit?: number;
  paymentTerms?: string;
  outstandingBalance: number;
  isActive: boolean;
  lastCreditReviewDate?: string;
  creditAnalystNotes?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const actionsCellStyle: React.CSSProperties = { ...tdStyle, width: '180px' }; // width for View/Edit & Delete
const buttonGroupStyle: React.CSSProperties = { display: 'flex', gap: '5px' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }; // Made modal slightly wider
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const textAreaStyle: React.CSSProperties = { ...inputStyle, height: '80px', fontFamily: 'inherit' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};
const fieldsetStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '1rem'};
const legendStyle: React.CSSProperties = { fontWeight: 'bold', padding: '0 5px'};


export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(mockData.accountsReceivable.customers);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerItem>>({});

  const calculateCreditAvailable = (limit?: number, balance?: number): number | undefined => {
    if (typeof limit === 'number' && typeof balance === 'number') {
      return limit - balance;
    }
    return undefined;
  };

  const getCreditStatusStyle = (customer: CustomerItem): React.CSSProperties => {
    const creditAvailable = calculateCreditAvailable(customer.creditLimit, customer.outstandingBalance);
    if (creditAvailable === undefined && (customer.creditLimit === 0 || customer.creditLimit === undefined)) return {}; // No limit set or COD
    if (creditAvailable !== undefined && creditAvailable < 0) return { color: 'red', fontWeight: 'bold' }; // Over limit
    if (creditAvailable !== undefined && customer.creditLimit && creditAvailable < customer.creditLimit * 0.1) return { color: 'orange' }; // Nearing limit (e.g. < 10%)
    return {};
  };


  const handleAddNewCustomer = () => {
    setEditingCustomer(null);
    setFormData({ country: 'Kenya', paymentTerms: 'Net 30', isActive: true, creditLimit: 0, outstandingBalance: 0, lastCreditReviewDate: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
      setShowModal(true);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm(`Are you sure you want to delete customer ID: ${customerId}?`)) {
      setCustomers(customers.filter(c => c.id !== customerId));
      alert(`Placeholder: Customer ID: ${customerId} deleted (mock).`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? {...c, ...formData, creditLimit: Number(formData.creditLimit), outstandingBalance: Number(formData.outstandingBalance)} as CustomerItem : c));
      alert(`Placeholder: Customer ${editingCustomer.id} updated (mock).`);
    } else {
      const newCustomer: CustomerItem = {
        id: `C${Date.now().toString().slice(-4)}`,
        ...formData,
        outstandingBalance: Number(formData.outstandingBalance) || 0,
        creditLimit: Number(formData.creditLimit) || 0,
        isActive: formData.isActive === undefined ? true : formData.isActive,
      } as CustomerItem;
      setCustomers([...customers, newCustomer]);
      alert(`Placeholder: New customer created (mock).`);
    }
    handleModalClose();
  };

  const creditAvailableInModal = useMemo(() => {
    return calculateCreditAvailable(Number(formData.creditLimit), Number(formData.outstandingBalance));
  }, [formData.creditLimit, formData.outstandingBalance]);

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Customer Management</h1>
        <Button variant="primary" onClick={handleAddNewCustomer}>Add New Customer</Button>
      </header>

      <Card title="Manage Customers">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>KRA PIN</th>
              <th style={thStyle} align="right">Credit Limit</th>
              <th style={thStyle} align="right">Outstanding Bal.</th>
              <th style={thStyle} align="right">Credit Available</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const creditAvailable = calculateCreditAvailable(customer.creditLimit, customer.outstandingBalance);
              const creditStatusStyle = getCreditStatusStyle(customer);
              let creditAvailableText = creditAvailable?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A';
              if (creditAvailable !== undefined && creditAvailable < 0) creditAvailableText = `(${Math.abs(creditAvailable).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}) Over Limit`;
              else if (creditAvailable !== undefined && customer.creditLimit && creditAvailable < customer.creditLimit * 0.1) creditAvailableText += ' (Low)';


              return (
                <tr key={customer.id}>
                  <td style={tdStyle}>{customer.name}</td>
                  <td style={tdStyle}>{customer.kraPin || 'N/A'}</td>
                  <td style={tdStyle} align="right">{customer.creditLimit?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'}</td>
                  <td style={tdStyle} align="right">{customer.outstandingBalance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={{...tdStyle, ...creditStatusStyle}} align="right">{creditAvailableText}</td>
                  <td style={tdStyle}>{customer.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={actionsCellStyle}>
                    <div style={buttonGroupStyle}>
                      <Button variant="secondary" size="sm" onClick={() => handleEditCustomer(customer.id)}>View/Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length === 0 && <p>No customers found.</p>}
      </Card>

      {showModal && (
        <div style={modalOverlayStyle} onClick={handleModalClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={editingCustomer ? "Edit Customer" : "Add New Customer"}>
              <form onSubmit={handleFormSubmit}>
                <fieldset style={fieldsetStyle}>
                    <legend style={legendStyle}>Basic Information</legend>
                    <div style={formRowStyle}>
                        <div><label>Name: <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        <div><label>KRA PIN: <input type="text" name="kraPin" value={formData.kraPin || ''} onChange={handleFormChange} style={inputStyle} /></label></div>
                    </div>
                    <div style={formRowStyle}>
                        <div><label>Email: <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        <div><label>Phone: <input type="tel" name="phone" value={formData.phone || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                    </div>
                </fieldset>

                <fieldset style={fieldsetStyle}>
                    <legend style={legendStyle}>Address Information</legend>
                    <div><label>Billing Address: <input type="text" name="billingAddress" value={formData.billingAddress || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                    <div><label>Shipping Address: <input type="text" name="shippingAddress" value={formData.shippingAddress || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                    <div style={formRowStyle}>
                        <div><label>City: <input type="text" name="city" value={formData.city || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                        <div><label>Country: <input type="text" name="country" value={formData.country || 'Kenya'} onChange={handleFormChange} style={inputStyle}/></label></div>
                    </div>
                </fieldset>

                <fieldset style={fieldsetStyle}>
                    <legend style={legendStyle}>Credit & Payment Terms</legend>
                    <div style={formRowStyle}>
                        <div><label>Credit Limit (KES): <input type="number" name="creditLimit" value={formData.creditLimit || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                        <div><label>Payment Terms: <input type="text" name="paymentTerms" value={formData.paymentTerms || 'Net 30'} onChange={handleFormChange} style={inputStyle}/></label></div>
                    </div>
                     {editingCustomer && (
                        <div style={formRowStyle}>
                             <div><label>Outstanding Balance (KES): <input type="number" name="outstandingBalance" value={formData.outstandingBalance || 0} onChange={handleFormChange} style={inputStyle} readOnly={!editingCustomer} /></label></div>
                             <div><label>Available Credit (KES): <input type="text" value={creditAvailableInModal?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'} style={{...inputStyle, backgroundColor: '#f0f0f0'}} readOnly /></label></div>
                        </div>
                    )}
                    <div style={formRowStyle}>
                        <div><label>Last Credit Review Date: <input type="date" name="lastCreditReviewDate" value={formData.lastCreditReviewDate || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                    </div>
                     <div><label>Credit Analyst Notes: <textarea name="creditAnalystNotes" value={formData.creditAnalystNotes || ''} onChange={handleFormChange} style={textAreaStyle}></textarea></label></div>
                     <Button type="button" variant="secondary" size="sm" onClick={() => alert('Placeholder: Request Credit Limit Change')} style={{marginTop: '10px'}}>Request Credit Limit Change</Button>
                </fieldset>

                <div style={{marginTop: '1rem'}}><label><input type="checkbox" name="isActive" checked={formData.isActive === undefined ? true : formData.isActive} onChange={handleFormChange} /> Active</label></div>

                <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Customer</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
