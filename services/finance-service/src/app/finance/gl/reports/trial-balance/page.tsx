// src/app/finance/gl/reports/trial-balance/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData } from '../../../../../lib/mockData'; // Adjust path
import Card from '../../../../../components/ui/Card';     // Adjust path
import Button from '../../../../../components/ui/Button';   // Adjust path

// Define an interface for Trial Balance line items for type safety
interface TrialBalanceLine {
  accountCode: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
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

const tfootThStyle: React.CSSProperties = {
  ...thStyle,
  borderTop: '2px solid #ddd',
  fontWeight: 'bold',
};

const reportCriteriaStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '1rem',
  flexWrap: 'wrap', // Allow wrapping on smaller screens
};

const inputStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
};


export default function TrialBalancePage() {
  // For now, we'll directly use the mock data.
  // In a real app, these would be fetched based on date inputs.
  const [startDate, setStartDate] = useState<string>('2023-01-01'); // Default or from user input
  const [endDate, setEndDate] = useState<string>('2023-12-31');   // Default or from user input

  const trialBalanceData: TrialBalanceLine[] = useMemo(() => {
    return mockData.generalLedger.trialBalance.accounts.map(acc => ({
      ...acc,
      balance: acc.totalDebit - acc.totalCredit,
    }));
  }, [mockData.generalLedger.trialBalance.accounts]); // Dependency on mockData

  const totals = mockData.generalLedger.trialBalance.totals;

  const handleGenerateReport = () => {
    console.log('Generate Report button clicked with dates:', { startDate, endDate });
    alert(`Placeholder: Generate report for ${startDate} to ${endDate}. Currently displaying static mock data.`);
    // In a real app, this would trigger an API call and update displayed data.
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Trial Balance Report</h1>
      </header>

      <Card title="Report Criteria">
        <div style={reportCriteriaStyle}>
          <div>
            <label htmlFor="startDate" style={{ marginRight: '0.5rem' }}>Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="endDate" style={{ marginRight: '0.5rem' }}>End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <Button variant="primary" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>
      </Card>

      <Card title="Trial Balance">
        {trialBalanceData.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Account Code</th>
                <th style={thStyle}>Account Name</th>
                <th style={thStyle} align="right">Debit</th>
                <th style={thStyle} align="right">Credit</th>
                <th style={thStyle} align="right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceData.map((line) => (
                <tr key={line.accountCode}>
                  <td style={tdStyle}>{line.accountCode}</td>
                  <td style={tdStyle}>{line.accountName}</td>
                  <td style={tdStyle} align="right">{line.totalDebit.toFixed(2)}</td>
                  <td style={tdStyle} align="right">{line.totalCredit.toFixed(2)}</td>
                  <td style={tdStyle} align="right">{line.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th style={tfootThStyle} colSpan={2}>Totals:</th>
                <th style={tfootThStyle} align="right">{totals.debit.toFixed(2)}</th>
                <th style={tfootThStyle} align="right">{totals.credit.toFixed(2)}</th>
                <th style={tfootThStyle} align="right">
                  {(totals.debit - totals.credit).toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No data available for the selected criteria. Please generate the report.</p>
        )}
      </Card>
    </div>
  );
}
