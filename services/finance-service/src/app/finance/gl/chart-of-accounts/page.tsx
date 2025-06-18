// src/app/finance/gl/chart-of-accounts/page.tsx
"use client"; // Required for event handlers like onClick

import React from 'react';
import { mockData } from '../../../../lib/mockData'; // Adjusted path
import Card from '../../../../components/ui/Card';     // Adjusted path
import Button from '../../../../components/ui/Button';   // Adjusted path
import { AccountType } from '../../../../lib/prismaPlaceholders'; // For AccountType Enum, adjust path

// Define an interface for COA items for type safety in the component
interface ChartOfAccountItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType; // Using the enum
  isActive?: boolean;
  // Add parentId or hierarchyLevel if you plan to use them for indentation
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle: React.CSSProperties = {
  borderBottom: '2px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '12px',
  textAlign: 'left',
};

const actionsCellStyle: React.CSSProperties = {
  ...tdStyle,
  width: '150px', // Adjust as needed
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '5px',
};

export default function ChartOfAccountsPage() {
  const chartOfAccounts: ChartOfAccountItem[] = mockData.generalLedger.chartOfAccounts.map(acc => ({
      ...acc,
      accountType: acc.accountType as AccountType, // Ensure type assertion if needed
      isActive: acc.isActive !== undefined ? acc.isActive : true, // Default to true if undefined in mock
  }));

  const handleAddNewAccount = () => {
    console.log('Add New Account button clicked');
    // Placeholder for future modal or navigation
    alert('Placeholder: Add New Account functionality');
  };

  const handleEditAccount = (accountId: string) => {
    console.log(`Edit Account button clicked for ID: ${accountId}`);
    alert(`Placeholder: Edit Account ID: ${accountId}`);
  };

  const handleDeleteAccount = (accountId: string) => {
    console.log(`Delete Account button clicked for ID: ${accountId}`);
    alert(`Placeholder: Delete Account ID: ${accountId}`);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Chart of Accounts</h1>
        <Button variant="primary" onClick={handleAddNewAccount}>
          Add New Account
        </Button>
      </header>

      <Card title="Manage Accounts">
        {chartOfAccounts.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Account Code</th>
                <th style={thStyle}>Account Name</th>
                <th style={thStyle}>Account Type</th>
                <th style={thStyle}>Is Active</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chartOfAccounts.map((account) => (
                <tr key={account.id}>
                  <td style={tdStyle}>{account.accountCode}</td>
                  <td style={tdStyle}>{account.accountName}</td>
                  <td style={tdStyle}>{account.accountType}</td>
                  <td style={tdStyle}>{account.isActive ? 'Yes' : 'No'}</td>
                  <td style={actionsCellStyle}>
                    <div style={buttonGroupStyle}>
                        <Button variant="secondary" size="sm" onClick={() => handleEditAccount(account.id)}> {/* Assuming size prop exists or can be added */}
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                            Delete
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No chart of accounts data available. Add new accounts to get started.</p>
        )}
      </Card>
    </div>
  );
}
