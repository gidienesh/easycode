// src/app/finance/gl/settings/page.tsx
"use client";

import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginRight: '10px', // For spacing next to labels or other inputs
  minWidth: '150px',
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    minWidth: '100px',
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

const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
};

export default function GLSettingsPage() {
  const [homeCurrency, setHomeCurrency] = useState<string>('KES');
  // Mock exchange rates data
  const [exchangeRates, setExchangeRates] = useState([
    { id: '1', pair: 'USD to KES', rate: '135.50', lastUpdated: '2023-10-27' },
    { id: '2', pair: 'EUR to KES', rate: '145.20', lastUpdated: '2023-10-27' },
  ]);

  const handleSaveSettings = () => {
    console.log('Save Settings clicked', { homeCurrency });
    alert(`Placeholder: Settings saved! Home currency: ${homeCurrency}`);
  };

  const handleAddNewRate = () => {
    console.log('Add New Rate clicked');
    alert('Placeholder: Add new exchange rate form would appear here.');
    // Example of adding a mock rate:
    // setExchangeRates([...exchangeRates, {
    //   id: `mock-${Date.now()}`,
    //   pair: 'GBP to KES',
    //   rate: (Math.random() * 100 + 150).toFixed(2), // Random rate
    //   lastUpdated: new Date().toISOString().split('T')[0]
    // }]);
  };

  const handleFetchLatestRates = () => {
    console.log('Fetch Latest Rates clicked');
    alert('Placeholder: Fetching latest exchange rates from an external API...');
  };

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>General Ledger Settings</h1>
      </header>

      <Card title="Multi-Currency Management">
        <div>
          <label htmlFor="homeCurrency" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Home Currency:</label>
          <select
            id="homeCurrency"
            value={homeCurrency}
            onChange={(e) => setHomeCurrency(e.target.value)}
            style={selectStyle}
          >
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>

        <div style={sectionHeaderStyle}>Exchange Rates</div>
        {/*
          Conceptual note for Journal Entry UI:
          When creating a Journal Entry, if the transaction currency differs from the home currency,
          the UI should typically include:
          1. A "Transaction Currency" dropdown (e.g., defaulting to Home Currency).
          2. An "Exchange Rate" field. This might be:
             - Auto-populated if a rate exists for the selected currency pair and date.
             - Manually enterable, especially if no rate is found or an override is needed.
             - Recalculated if the transaction date or currency changes.
          3. Display of amounts in both transaction currency and home currency equivalent.
        */}
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={thStyle}>Currency Pair</th>
                    <th style={thStyle}>Rate</th>
                    <th style={thStyle}>Last Updated</th>
                    <th style={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {exchangeRates.map(rate => (
                    <tr key={rate.id}>
                        <td style={tdStyle}>{rate.pair}</td>
                        <td style={tdStyle}>{rate.rate}</td>
                        <td style={tdStyle}>{rate.lastUpdated}</td>
                        <td style={tdStyle}>
                            <Button variant="secondary" size="sm" onClick={() => alert(`Edit rate for ${rate.pair}`)}>Edit</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" onClick={handleAddNewRate}>Add New Rate</Button>
            <Button variant="secondary" onClick={handleFetchLatestRates}>Fetch Latest Rates</Button>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <Button variant="primary" onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}
