// src/app/finance/fa/depreciation/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define an interface for Depreciation Run Result items for type safety
interface DepreciationResultItem {
  assetId: string;
  assetCode: string;
  assetName: string;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciationAfterRun: number;
  netBookValueAfterRun: number;
  journalEntryId?: string;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const inputStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' };
const controlsSectionStyle: React.CSSProperties = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };


export default function DepreciationPage() {
  // For now, directly use the first mock run result.
  // In a real app, this would be fetched or selected based on period input.
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2023-10'); // Default to YYYY-MM
  const [currentRunResults, setCurrentRunResults] = useState<DepreciationResultItem[]>(
    mockData.fixedAssets.depreciationRunResults.find(run => run.runId === `DEPR-RUN-${selectedPeriod}`)?.details || []
  );

  const handleRunDepreciation = () => {
    console.log('Calculate/Run Depreciation clicked for period:', selectedPeriod);
    // Simulate fetching/calculating for the selected period
    const run = mockData.fixedAssets.depreciationRunResults.find(r => r.runId === `DEPR-RUN-${selectedPeriod}`);
    if (run) {
      setCurrentRunResults(run.details);
      alert(`Depreciation data loaded/simulated for period: ${selectedPeriod}`);
    } else {
      setCurrentRunResults([]);
      alert(`No depreciation data found for period: ${selectedPeriod}. Displaying empty results.`);
    }
  };

  const handleViewSchedule = () => {
    alert('Placeholder: View Depreciation Schedule for a selected asset would open a modal or navigate.');
  };

  const handlePostToGL = () => {
    if (currentRunResults.length === 0) {
        alert('No depreciation results to post.');
        return;
    }
    const journalId = currentRunResults[0]?.journalEntryId || `JE-DEP-${selectedPeriod}-MOCK`;
    console.log(`Post Depreciation to GL clicked for period: ${selectedPeriod}. Associated Journal ID (mock): ${journalId}`);
    alert(`Placeholder: Posting depreciation for ${selectedPeriod} to GL. Journal ID: ${journalId}`);
    // Potentially update status or clear currentRunResults if posting implies completion of this view
  };

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Fixed Asset Depreciation</h1>
      </header>

      <Card title="Depreciation Controls">
        <div style={controlsSectionStyle}>
          <div>
            <label htmlFor="depreciationPeriod" style={{ marginRight: '0.5rem' }}>Select Period (YYYY-MM):</label>
            <input
              type="month" // Changed to month type for better UX
              id="depreciationPeriod"
              name="depreciationPeriod"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={inputStyle}
            />
          </div>
          <Button variant="primary" onClick={handleRunDepreciation}>Calculate/Run Depreciation</Button>
          <Button variant="secondary" onClick={handleViewSchedule}>View Asset Schedule</Button>
          <Button variant="primary" onClick={handlePostToGL} disabled={currentRunResults.length === 0}>Post Depreciation to GL</Button>
        </div>
      </Card>

      <Card title={`Depreciation Results for ${selectedPeriod}`}>
        {currentRunResults.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Asset Code</th>
                <th style={thStyle}>Asset Name</th>
                {/* <th style={thStyle}>Period</th> */}
                <th style={thStyle} align="right">Depreciation Amt.</th>
                <th style={thStyle} align="right">Accumulated Depr.</th>
                <th style={thStyle} align="right">NBV After Depr.</th>
                <th style={thStyle}>GL Journal ID</th>
              </tr>
            </thead>
            <tbody>
              {currentRunResults.map((item) => (
                <tr key={item.assetId}>
                  <td style={tdStyle}>{item.assetCode}</td>
                  <td style={tdStyle}>{item.assetName}</td>
                  {/* <td style={tdStyle}>{item.period}</td> */}
                  <td style={tdStyle} align="right">{item.depreciationAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={tdStyle} align="right">{item.accumulatedDepreciationAfterRun.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={tdStyle} align="right">{item.netBookValueAfterRun.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={tdStyle}>{item.journalEntryId || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
             <tfoot>
                <tr>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} colSpan={2}>Total Depreciation for Period:</th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} align="right">
                        {currentRunResults.reduce((sum, item) => sum + item.depreciationAmount, 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                    </th>
                    <th style={{...thStyle, borderTop: '2px solid #ddd'}} colSpan={3}></th>
                </tr>
             </tfoot>
          </table>
        ) : (
          <p>No depreciation data to display for the selected period. Click "Calculate/Run Depreciation".</p>
        )}
      </Card>
    </div>
  );
}
