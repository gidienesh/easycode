// src/app/finance/chart-of-accounts/page.tsx
"use client"; // Required for Next.js App Router pages that use client components like Link if not already default
import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button'; // Assuming Button might be used for styling Link or other actions

const pageContainerStyle: React.CSSProperties = {
  padding: '20px',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #eee',
};

// Helper styles for table (consistent with homepage)
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

const mockCoaData = [
  { code: '1000', name: 'Cash', type: 'ASSET', isActive: true },
  { code: '1010', name: 'Accounts Receivable', type: 'ASSET', isActive: true },
  { code: '1020', name: 'Prepaid Expenses', type: 'ASSET', isActive: true },
  { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', isActive: true },
  { code: '2100', name: 'Accrued Liabilities', type: 'LIABILITY', isActive: false },
  { code: '3000', name: 'Common Stock', type: 'EQUITY', isActive: true },
  { code: '3100', name: 'Retained Earnings', type: 'EQUITY', isActive: true },
  { code: '4000', name: 'Service Revenue', type: 'REVENUE', isActive: true },
  { code: '4010', name: 'Interest Income', type: 'REVENUE', isActive: true },
  { code: '5000', name: 'Office Expenses', type: 'EXPENSE', isActive: true },
  { code: '5010', name: 'Salaries Expense', type: 'EXPENSE', isActive: true },
  { code: '5020', name: 'Rent Expense', type: 'EXPENSE', isActive: false },
];

export default function ChartOfAccountsPage() {
  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <h1>Chart of Accounts (Mock Data)</h1>
      </header>

      <Link href="/" passHref legacyBehavior>
        <Button as="a" variant="outline" style={{ marginBottom: '20px' }}>
          &larr; Back to Dashboard
        </Button>
      </Link>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Account Code</th>
              <th style={tableHeaderStyle}>Account Name</th>
              <th style={tableHeaderStyle}>Account Type</th>
              <th style={tableHeaderStyle}>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {mockCoaData.map(account => (
              <tr key={account.code}>
                <td style={tableCellStyle}>{account.code}</td>
                <td style={tableCellStyle}>{account.name}</td>
                <td style={tableCellStyle}>{account.type}</td>
                <td style={tableCellStyle}>{account.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
