// src/app/finance/gl/reports/financial-statements/page.tsx
"use client";

import React, { useState } from 'react';
import Card from '../../../../../components/ui/Card';     // Adjust path
import Button from '../../../../../components/ui/Button';   // Adjust path

const reportOptionStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid #eee',
};

const reportTitleStyle: React.CSSProperties = {
  fontSize: '1.5em',
  marginBottom: '0.5rem',
};

const reportDescriptionStyle: React.CSSProperties = {
  fontSize: '0.9em',
  color: '#555',
  marginBottom: '1rem',
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '1rem',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const reportDisplayAreaStyle: React.CSSProperties = {
  marginTop: '2rem',
  padding: '20px',
  border: '1px dashed #ccc',
  textAlign: 'center',
  color: '#777',
  minHeight: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function FinancialStatementsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Placeholder dates for input fields
  const [balanceSheetDate, setBalanceSheetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incomeStatementStartDate, setIncomeStatementStartDate] = useState<string>('2023-01-01');
  const [incomeStatementEndDate, setIncomeStatementEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cashFlowStartDate, setCashFlowStartDate] = useState<string>('2023-01-01');
  const [cashFlowEndDate, setCashFlowEndDate] = useState<string>(new Date().toISOString().split('T')[0]);


  const handleViewReport = (reportName: string) => {
    console.log(`${reportName} "View Report" button clicked.`);
    setSelectedReport(`Displaying details for: ${reportName}`);
    alert(`Placeholder: Functionality to view ${reportName} would be triggered here.`);
    // In a real app, this might navigate to a new page or fetch and display data below.
  };

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Financial Statements</h1>
        <p>Select a financial statement to view.</p>
      </header>

      <Card title="Available Reports">
        {/* Balance Sheet */}
        <div style={reportOptionStyle}>
          <h2 style={reportTitleStyle}>Balance Sheet</h2>
          <p style={reportDescriptionStyle}>
            Shows the company's assets, liabilities, and equity as of a specific date.
          </p>
          <div style={inputGroupStyle}>
            <div>
              <label htmlFor="balanceSheetDate" style={{ marginRight: '0.5rem' }}>As of Date:</label>
              <input type="date" id="balanceSheetDate" name="balanceSheetDate" style={inputStyle} value={balanceSheetDate} onChange={e => setBalanceSheetDate(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={() => handleViewReport('Balance Sheet')}>
              View Report
            </Button>
          </div>
        </div>

        {/* Income Statement (Profit & Loss) */}
        <div style={reportOptionStyle}>
          <h2 style={reportTitleStyle}>Income Statement (Profit & Loss)</h2>
          <p style={reportDescriptionStyle}>
            Reports the company's financial performance over a specific period.
          </p>
          <div style={inputGroupStyle}>
            <div>
              <label htmlFor="isStartDate" style={{ marginRight: '0.5rem' }}>Start Date:</label>
              <input type="date" id="isStartDate" name="isStartDate" style={inputStyle} value={incomeStatementStartDate} onChange={e => setIncomeStatementStartDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="isEndDate" style={{ marginRight: '0.5rem' }}>End Date:</label>
              <input type="date" id="isEndDate" name="isEndDate" style={inputStyle} value={incomeStatementEndDate} onChange={e => setIncomeStatementEndDate(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={() => handleViewReport('Income Statement')}>
              View Report
            </Button>
          </div>
        </div>

        {/* Cash Flow Statement */}
        <div style={{ ...reportOptionStyle, borderBottom: 'none', paddingBottom: 0 }}> {/* Last item, no border bottom */}
          <h2 style={reportTitleStyle}>Cash Flow Statement</h2>
          <p style={reportDescriptionStyle}>
            Tracks the movement of cash both into and out of the company over a period.
          </p>
          <div style={inputGroupStyle}>
             <div>
              <label htmlFor="cfStartDate" style={{ marginRight: '0.5rem' }}>Start Date:</label>
              <input type="date" id="cfStartDate" name="cfStartDate" style={inputStyle} value={cashFlowStartDate} onChange={e => setCashFlowStartDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="cfEndDate" style={{ marginRight: '0.5rem' }}>End Date:</label>
              <input type="date" id="cfEndDate" name="cfEndDate" style={inputStyle} value={cashFlowEndDate} onChange={e => setCashFlowEndDate(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={() => handleViewReport('Cash Flow Statement')}>
              View Report
            </Button>
          </div>
        </div>
      </Card>

      <div style={reportDisplayAreaStyle}>
        {selectedReport ? (
          <Card title="Report Display Area (Placeholder)">
            <p>{selectedReport}</p>
            <Button onClick={() => setSelectedReport(null)} style={{marginTop: '1rem'}}>Clear Display</Button>
          </Card>
        ) : (
          <p>Select a report and click "View Report" to see its (placeholder) details here.</p>
        )}
      </div>
    </div>
  );
}
