// src/app/finance/ap/wht/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, WHTStatus } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define an interface for WHT Transaction items for type safety
interface WhtTransactionItem {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceId: string;
  invoiceNumber: string;
  transactionDate: string;
  grossAmount: number;
  whtRate: number;
  whtAmount: number;
  kraPin: string;
  status: WHTStatus;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '10px 8px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '10px 8px', textAlign: 'left' };
const inputStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' };
const filterSectionStyle: React.CSSProperties = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };


export default function WhtManagementPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // For now, directly use all mock data. Filtering would be applied in a real fetch.
  const whtTransactions: WhtTransactionItem[] = mockData.accountsPayable.whtTransactions;

  const handleApplyFilters = () => {
    console.log('Apply Filters / Refresh clicked', { startDate, endDate });
    alert(`Placeholder: Filtering WHT transactions from ${startDate || 'any'} to ${endDate || 'any'}. Currently showing all mock data.`);
    // In a real app, this would refetch or filter the displayed 'whtTransactions'
  };

  const handleGenerateKraReport = ()_ => {
    console.log('Generate KRA WHT Report clicked');
    alert('Placeholder: Generating KRA WHT report based on selected filters/data...');
  };

  const summary = useMemo(() => {
    let pending = 0;
    let remitted = 0;
    whtTransactions.forEach(t => {
      if (t.status === 'Pending Remittance') {
        pending += t.whtAmount;
      } else if (t.status === 'Remitted') {
        remitted += t.whtAmount;
      }
    });
    return { pending, remitted };
  }, [whtTransactions]);

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Withholding Tax (WHT) Management - Payables</h1>
      </header>

      <Card title="Filter & Actions">
        <div style={filterSectionStyle}>
          <div>
            <label htmlFor="startDate" style={{ marginRight: '0.5rem' }}>Start Date:</label>
            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="endDate" style={{ marginRight: '0.5rem' }}>End Date:</label>
            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
          </div>
          <Button variant="primary" onClick={handleApplyFilters}>Apply Filters / Refresh</Button>
          <Button variant="secondary" onClick={handleGenerateKraReport}>Generate KRA WHT Report</Button>
        </div>
      </Card>

      <Card title="WHT Summary">
        <div style={{display: 'flex', gap: '2rem'}}>
            <p><strong>Total WHT Pending Remittance:</strong> KES {summary.pending.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
            <p><strong>Total WHT Remitted:</strong> KES {summary.remitted.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
      </Card>

      <Card title="WHT Transactions">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>KRA PIN</th>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle} align="right">Gross Amount</th>
              <th style={thStyle} align="right">WHT Rate (%)</th>
              <th style={thStyle} align="right">WHT Amount</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {whtTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={tdStyle}>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{transaction.vendorName}</td>
                <td style={tdStyle}>{transaction.kraPin}</td>
                <td style={tdStyle}>{transaction.invoiceNumber}</td>
                <td style={tdStyle} align="right">{transaction.grossAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle} align="right">{(transaction.whtRate * 100).toFixed(1)}%</td>
                <td style={tdStyle} align="right">{transaction.whtAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {whtTransactions.length === 0 && <p>No WHT transactions found for the selected criteria.</p>}
      </Card>
    </div>
  );
}
