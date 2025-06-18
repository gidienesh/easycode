// src/app/finance/journal-entries/page.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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

const tableCellStyleNum: React.CSSProperties = {
  ...tableCellStyle,
  textAlign: 'right'
};

const initialMockJournalEntries = [
  { id: 'JE001', description: 'Purchase of office supplies', status: 'DRAFT', amount: 150.75 },
  { id: 'JE002', description: 'Client payment for Project Alpha', status: 'POSTED', amount: 2500.00 },
  { id: 'JE003', description: 'Monthly software subscription', status: 'DRAFT', amount: 99.00 },
  { id: 'JE004', description: 'Reimburse travel expenses', status: 'DRAFT', amount: 76.50 },
  { id: 'JE005', description: 'Revenue from Q1 services', status: 'POSTED', amount: 10500.00 },
];

export default function JournalEntriesPage() {
  const [mockJournalEntries, setMockJournalEntries] = useState(initialMockJournalEntries);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handlePostJournalEntry = (id: string) => {
    setMockJournalEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id && entry.status === 'DRAFT' ? { ...entry, status: 'POSTED' } : entry
      )
    );
    setActionMessage(`Journal Entry ${id} successfully POSTED! (Simulated)`);
    setTimeout(() => setActionMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <h1>Journal Entries (Mock Data)</h1>
      </header>

      <Link href="/" passHref legacyBehavior>
        <Button as="a" variant="outline" style={{ marginBottom: '10px' }}>
          &larr; Back to Dashboard
        </Button>
      </Link>

      {actionMessage && (
        <Card style={{ marginBottom: '20px', backgroundColor: '#d4edda', borderColor: '#c3e6cb' }}>
          <p style={{ color: '#155724', margin: 0 }}>{actionMessage}</p>
        </Card>
      )}

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Amount</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockJournalEntries.map(je => (
              <tr key={je.id}>
                <td style={tableCellStyle}>{je.id}</td>
                <td style={tableCellStyle}>{je.description}</td>
                <td style={tableCellStyleNum}>${je.amount.toFixed(2)}</td>
                <td style={tableCellStyle}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                    backgroundColor: je.status === 'POSTED' ? '#28a745' : (je.status === 'DRAFT' ? '#ffc107' : '#6c757d'),
                    color: je.status === 'DRAFT' ? '#212529' : '#fff'
                  }}>
                    {je.status}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  {je.status === 'DRAFT' && (
                    <Button size="small" onClick={() => handlePostJournalEntry(je.id)}>
                      Post
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
