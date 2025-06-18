// src/app/finance/ap/vendors/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define an interface for Vendor items for type safety
interface VendorItem {
  id: string;
  name: string;
  kraPin: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  paymentTerms?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  outstandingBalance: number;
  isActive: boolean;
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle: React.CSSProperties = {
  borderBottom: '2px solid #ddd',
  padding: '10px 8px',
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '10px 8px',
  textAlign: 'left',
};

const actionsCellStyle: React.CSSProperties = {
  ...tdStyle,
  width: '180px', // Adjusted for two buttons
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '5px',
};

// Basic Modal Styles (similar to Journal Entry details modal)
const modalOverlayStyle: React.CSSProperties = { /* ... (same as JE modal) ... */ };
const modalContentStyle: React.CSSProperties = { /* ... (same as JE modal) ... */ };
// For brevity, assuming modal styles are defined or copied from JE page if needed.
// If not, they would be:
// const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
// const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '80%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' };


export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<VendorItem[]>(mockData.accountsPayable.vendors);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Basic form state for add/edit - can be expanded
  const [formData, setFormData] = useState<Partial<VendorItem>>({});

  const handleAddNewVendor = () => {
    setEditingVendor(null); // Ensure not editing
    setFormData({}); // Clear form data
    setShowModal(true);
    console.log('Add New Vendor button clicked');
  };

  const handleEditVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setEditingVendor(vendor);
      setFormData(vendor); // Populate form with vendor data
      setShowModal(true);
      console.log(`Edit Vendor button clicked for ID: ${vendorId}`);
    }
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (window.confirm(`Are you sure you want to delete vendor ID: ${vendorId}?`)) {
      setVendors(vendors.filter(v => v.id !== vendorId)); // Simulate delete
      console.log(`Delete Vendor button clicked for ID: ${vendorId}`);
      alert(`Placeholder: Vendor ID: ${vendorId} deleted (mock).`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVendor(null);
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVendor) { // Update existing
      setVendors(vendors.map(v => v.id === editingVendor.id ? {...v, ...formData} as VendorItem : v));
      alert(`Placeholder: Vendor ${editingVendor.id} updated (mock).`);
    } else { // Create new
      const newVendor: VendorItem = {
        id: `V${Date.now().toString().slice(-4)}`, // Mock ID
        ...formData,
        outstandingBalance: Number(formData.outstandingBalance) || 0,
        isActive: formData.isActive === undefined ? true : formData.isActive,
      } as VendorItem; // Needs proper casting and validation
      setVendors([...vendors, newVendor]);
      alert(`Placeholder: New vendor created (mock).`);
    }
    console.log('Form Data Submitted:', formData);
    handleModalClose();
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Vendor Management</h1>
        <Button variant="primary" onClick={handleAddNewVendor}>
          Add New Vendor
        </Button>
      </header>

      <Card title="Manage Vendors">
        {vendors.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>KRA PIN</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle} align="right">Outstanding Balance</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td style={tdStyle}>{vendor.name}</td>
                  <td style={tdStyle}>{vendor.kraPin}</td>
                  <td style={tdStyle}>{vendor.email}</td>
                  <td style={tdStyle}>{vendor.phone}</td>
                  <td style={tdStyle} align="right">{vendor.outstandingBalance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={tdStyle}>{vendor.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={actionsCellStyle}>
                    <div style={buttonGroupStyle}>
                        <Button variant="secondary" size="sm" onClick={() => handleEditVendor(vendor.id)}>
                            View/Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteVendor(vendor.id)}>
                            Delete
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vendors found. Add new vendors to get started.</p>
        )}
      </Card>

      {showModal && (
         // Re-using modal styles from JE page or define here
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={handleModalClose}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <Card title={editingVendor ? "Edit Vendor" : "Add New Vendor"}>
              <form onSubmit={handleFormSubmit}>
                {/* Simplified form fields - add more as needed */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
                    <div><label>Name: <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} required style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>KRA PIN: <input type="text" name="kraPin" value={formData.kraPin || ''} onChange={handleFormChange} required style={{width: '100%', padding:'8px', boxSizing: 'border-box'}} /></label></div>
                    <div><label>Email: <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} required style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Phone: <input type="tel" name="phone" value={formData.phone || ''} onChange={handleFormChange} required style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Address: <input type="text" name="address" value={formData.address || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>City: <input type="text" name="city" value={formData.city || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Country: <input type="text" name="country" value={formData.country || 'Kenya'} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Payment Terms: <input type="text" name="paymentTerms" value={formData.paymentTerms || 'Net 30'} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Outstanding Balance: <input type="number" name="outstandingBalance" value={formData.outstandingBalance || 0} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>

                    <div><label>Bank Name: <input type="text" name="bankName" value={formData.bankName || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Bank Account Name: <input type="text" name="bankAccountName" value={formData.bankAccountName || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Bank Account No.: <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>
                    <div><label>Bank Branch: <input type="text" name="bankBranch" value={formData.bankBranch || ''} onChange={handleFormChange} style={{width: '100%', padding:'8px', boxSizing: 'border-box'}}/></label></div>

                    <div style={{gridColumn: '1 / -1'}}><label><input type="checkbox" name="isActive" checked={formData.isActive === undefined ? true : formData.isActive} onChange={handleFormChange} /> Active</label></div>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Vendor</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
