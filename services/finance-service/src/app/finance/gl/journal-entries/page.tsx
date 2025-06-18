// src/app/finance/gl/journal-entries/page.tsx
"use client";

import React, { useState } from 'react';
import { mockData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path
import { JournalEntryStatus } from '../../../../lib/prismaPlaceholders'; // For Enum

// Define interfaces for type safety
interface JournalEntryLineItem {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string | null;
}

interface JournalEntryItem {
  id: string;
  entryDate: string;
  description: string;
  status: JournalEntryStatus;
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLineItem[];
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

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
};


export default function JournalEntriesPage() {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryItem | null>(null);

  const journalEntries: JournalEntryItem[] = mockData.generalLedger.journalEntries.map(je => ({
      ...je,
      status: je.status as JournalEntryStatus, // Type assertion
  }));

  const handleCreateNewEntry = () => {
    console.log('Create New Journal Entry button clicked');
    alert('Placeholder: Create New Journal Entry form would appear here.');
  };

  const handleViewDetails = (entryId: string) => {
    const entry = journalEntries.find(je => je.id === entryId);
    if (entry) {
      setSelectedEntry(entry);
    } else {
      alert('Error: Could not find journal entry details.');
    }
  };

  const handleCloseDetails = () => {
    setSelectedEntry(null);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Journal Entries</h1>
        <Button variant="primary" onClick={handleCreateNewEntry}>
          Create New Journal Entry
        </Button>
      </header>

      <Card title="Manage Journal Entries">
        {journalEntries.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Total Debit</th>
                <th style={thStyle}>Total Credit</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry) => (
                <tr key={entry.id}>
                  <td style={tdStyle}>{new Date(entry.entryDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>{entry.id}</td>
                  <td style={tdStyle}>{entry.description}</td>
                  <td style={tdStyle}>{entry.status}</td>
                  <td style={tdStyle} align="right">{entry.totalDebit.toFixed(2)}</td>
                  <td style={tdStyle} align="right">{entry.totalCredit.toFixed(2)}</td>
                  <td style={tdStyle}>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(entry.id)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No journal entries found.</p>
        )}
      </Card>

      {selectedEntry && (
        <div style={modalOverlayStyle} onClick={handleCloseDetails}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={`Details for Journal Entry: ${selectedEntry.id}`}>
              <div style={{ marginBottom: '1rem' }}>
                <p><strong>Date:</strong> {new Date(selectedEntry.entryDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {selectedEntry.description}</p>
                <p><strong>Status:</strong> {selectedEntry.status}</p>
                <p><strong>Total Debit:</strong> {selectedEntry.totalDebit.toFixed(2)}</p>
                <p><strong>Total Credit:</strong> {selectedEntry.totalCredit.toFixed(2)}</p>
              </div>

              <h3>Lines:</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Account</th>
                    <th style={thStyle}>Debit</th>
                    <th style={thStyle}>Credit</th>
                    <th style={thStyle}>Line Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntry.lines.map((line) => (
                    <tr key={line.id}>
                      <td style={tdStyle}>{line.accountName} ({line.accountId})</td>
                      <td style={tdStyle} align="right">{line.debit.toFixed(2)}</td>
                      <td style={tdStyle} align="right">{line.credit.toFixed(2)}</td>
                      <td style={tdStyle}>{line.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button variant="primary" onClick={handleCloseDetails}>Close</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
