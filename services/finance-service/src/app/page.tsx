// src/app/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card'; // Adjust path based on your alias setup
import Button from '@/components/ui/Button'; // Assuming Button might be used

const pageContainerStyle: React.CSSProperties = {
  // maxWidth: '1200px',
  // margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #eee',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

// Helper styles for table (can be moved to a separate CSS module later)
const tableHeaderStyle: React.CSSProperties = {
  borderBottom: '2px solid #dee2e6',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f8f9fa'
};

const tableCellStyle: React.CSSProperties = {
  borderBottom: '1px solid #e9ecef',
  padding: '8px',
  textAlign: 'left'
};

const tableCellStyleNum: React.CSSProperties = {
  ...tableCellStyle,
  textAlign: 'right'
};

const mockTrialBalanceData = [
  { accountCode: '1000', accountName: 'Cash', totalDebit: 5000.00, totalCredit: 1000.00, balance: 4000.00 },
  { accountCode: '1010', accountName: 'Accounts Receivable', totalDebit: 2500.00, totalCredit: 500.00, balance: 2000.00 },
  { accountCode: '2000', accountName: 'Accounts Payable', totalDebit: 300.00, totalCredit: 1300.00, balance: -1000.00 },
  { accountCode: '4000', accountName: 'Service Revenue', totalDebit: 0.00, totalCredit: 6000.00, balance: -6000.00 },
  { accountCode: '5000', accountName: 'Office Expenses', totalDebit: 800.00, totalCredit: 0.00, balance: 800.00 },
  { accountCode: 'TOTAL', accountName: 'TOTAL', totalDebit: 8600.00, totalCredit: 8800.00, balance: -200.00 }, // Example: ensure totals make sense
];


export default function HomePage() {
  const [showTrialBalance, setShowTrialBalance] = useState(false);

  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <h1>Welcome to the Finance Microservice Dashboard</h1>
        <p>This is a demonstration of the UI capabilities for the finance service modules.</p>
      </header>

      <section>
        <h2>Overview</h2>
        <div style={gridStyle}>
          {/* Key Metric 1 and Recent Activity Cards removed */}
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/finance/chart-of-accounts" passHref legacyBehavior>
                <Button as="a" variant="secondary">View Chart of Accounts</Button>
              </Link>
              <Link href="/finance/journal-entries" passHref legacyBehavior>
                <Button as="a" variant="primary">List Journal Entries</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setShowTrialBalance(!showTrialBalance)}
              >
                {showTrialBalance ? 'Hide Mock Trial Balance' : 'Show Mock Trial Balance'}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {showTrialBalance && (
        <section style={{ marginTop: '2rem' }}>
          <Card title="Mock Trial Balance">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Account Code</th>
                  <th style={tableHeaderStyle}>Account Name</th>
                  <th style={tableHeaderStyle}>Debit</th>
                  <th style={tableHeaderStyle}>Credit</th>
                  <th style={tableHeaderStyle}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {mockTrialBalanceData.map(row => (
                  <tr key={row.accountCode}>
                    <td style={tableCellStyle}>{row.accountCode}</td>
                    <td style={tableCellStyle}>{row.accountName}</td>
                    <td style={tableCellStyleNum}>{row.totalDebit?.toFixed(2)}</td>
                    <td style={tableCellStyleNum}>{row.totalCredit?.toFixed(2)}</td>
                    <td style={tableCellStyleNum}>{row.balance?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h2>System Status</h2>
        <Card>
          <p>All systems operational.</p>
          <p><small>Last checked: {new Date().toLocaleTimeString()}</small></p>
        </Card>
      </section>
    </div>
  );
}
