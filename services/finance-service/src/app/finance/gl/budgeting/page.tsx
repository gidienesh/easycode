// src/app/finance/gl/budgeting/page.tsx
"use client";

import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginRight: '10px',
  minWidth: '200px',
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
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

const sectionFlexStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end', // Align items to bottom for button next to selects
    flexWrap: 'wrap',
    marginBottom: '1rem',
};

const sampleBudgetVarianceData = [
  { accountCode: '4000', accountName: 'Sales Revenue', budgeted: 500000, actual: 480000, variance: -4 },
  { accountCode: '5010', accountName: 'Office Supplies', budgeted: 20000, actual: 25000, variance: 25 },
  { accountCode: '5100', accountName: 'Salaries Expense', budgeted: 120000, actual: 115000, variance: -4.17 },
];

export default function BudgetingPage() {
  const [selectedBudget, setSelectedBudget] = useState<string>('annual2024');
  const [comparisonPeriod, setComparisonPeriod] = useState<string>('actualsYtd');
  const [showReport, setShowReport] = useState<boolean>(false);

  const handleLoadBudget = () => {
    console.log('Load Budget Data clicked', { selectedBudget, comparisonPeriod });
    setShowReport(true); // Simulate loading data by showing the report table
    alert(`Placeholder: Loading data for Budget: ${selectedBudget}, Comparison: ${comparisonPeriod}`);
  };

  const handleCreateNewBudget = () => {
    console.log('Create New Budget clicked');
    alert('Placeholder: Navigate to new budget creation form/modal.');
  };

  const handleImportBudget = () => {
    console.log('Import Budget clicked');
    alert('Placeholder: Open file import dialog for budgets.');
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Budgeting and Forecasting</h1>
        <div>
            <Button variant="primary" onClick={handleCreateNewBudget} style={{marginRight: '0.5rem'}}>Create New Budget</Button>
            <Button variant="secondary" onClick={handleImportBudget}>Import Budget</Button>
        </div>
      </header>

      <Card title="Budget Configuration">
        <div style={sectionFlexStyle}>
          <div>
            <label htmlFor="budgetLedger" style={{ display: 'block', marginBottom: '0.25rem' }}>Budget Ledger/Scenario:</label>
            <select
              id="budgetLedger"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              style={selectStyle}
            >
              <option value="annual2024">Annual Budget 2024</option>
              <option value="q1Forecast2024">Q1 Forecast 2024</option>
              <option value="annual2023">Annual Budget 2023 (Historical)</option>
            </select>
          </div>
          <div>
            <label htmlFor="comparisonPeriod" style={{ display: 'block', marginBottom: '0.25rem' }}>Comparison Period:</label>
            <select
              id="comparisonPeriod"
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              style={selectStyle}
            >
              <option value="actualsYtd">Actuals YTD</option>
              <option value="actualsQ1">Actuals Q1 2024</option>
              <option value="actualsPrevYear">Actuals Previous Year</option>
            </select>
          </div>
          <Button variant="primary" onClick={handleLoadBudget}>Load Budget Data</Button>
        </div>
      </Card>

      {showReport && (
        <Card title="Budget vs. Actuals Variance Report">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Account Code</th>
                <th style={thStyle}>Account Name</th>
                <th style={thStyle} align="right">Budgeted Amount</th>
                <th style={thStyle} align="right">Actual Amount</th>
                <th style={thStyle} align="right">Variance (Abs)</th>
                <th style={thStyle} align="right">Variance (%)</th>
              </tr>
            </thead>
            <tbody>
              {sampleBudgetVarianceData.map((item) => (
                <tr key={item.accountCode}>
                  <td style={tdStyle}>{item.accountCode}</td>
                  <td style={tdStyle}>{item.accountName}</td>
                  <td style={tdStyle} align="right">{item.budgeted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td style={tdStyle} align="right">{item.actual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td style={tdStyle} align="right">{(item.actual - item.budgeted).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td style={tdStyle} align="right">
                    {item.budgeted !== 0 ? ((item.actual - item.budgeted) / item.budgeted * 100).toFixed(2) + '%' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
             <tfoot>
                <tr>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} colSpan={2}>Totals:</th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} align="right">
                        {sampleBudgetVarianceData.reduce((sum, item) => sum + item.budgeted, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} align="right">
                        {sampleBudgetVarianceData.reduce((sum, item) => sum + item.actual, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} align="right">
                        {sampleBudgetVarianceData.reduce((sum, item) => sum + (item.actual - item.budgeted), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} align="right"> {/* Overall Variance % can be tricky, usually not summed directly */}
                        N/A
                    </th>
                </tr>
             </tfoot>
          </table>
        </Card>
      )}
      {!showReport && (
          <Card>
            <p style={{textAlign: 'center', color: '#555'}}>Load budget data to view report.</p>
          </Card>
      )}
    </div>
  );
}
