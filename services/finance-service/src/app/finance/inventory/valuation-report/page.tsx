// src/app/finance/inventory/valuation-report/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, ValuationMethod, ItemType } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interface for Valuation Report items for type safety
interface ValuationReportItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantityOnHand: number;
  valuationMethod?: ValuationMethod; // From item master
  unitCost: number; // For this report, using purchasePrice or a standard cost
  totalValue: number; // Calculated: QoH * Unit Cost
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const tfootThStyle: React.CSSProperties = { ...thStyle, borderTop: '2px solid #ddd', fontWeight: 'bold' };
const inputStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' };
const filterSectionStyle: React.CSSProperties = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };


export default function InventoryValuationReportPage() {
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportValuationMethod, setReportValuationMethod] = useState<string>('Default'); // 'Default' or specific method

  // Filter for stockable items and calculate values
  const valuationReportItems = useMemo((): ValuationReportItem[] => {
    return mockData.inventory.itemMaster
      .filter(item => item.isActive && item.itemType !== ItemType.SERVICE && item.itemType !== ItemType.NON_STOCK) // Only active, stockable items
      .map(item => {
        const unitCost = item.purchasePrice || item.unitPrice || 0; // Prioritize purchase price, then unit (selling) price, then 0
        const quantityOnHand = item.quantityOnHand || 0;
        return {
          id: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          category: item.category,
          quantityOnHand: quantityOnHand,
          valuationMethod: item.valuationMethod,
          unitCost: unitCost,
          totalValue: quantityOnHand * unitCost,
        };
      });
  }, [mockData.inventory.itemMaster]); // Re-calculate if item master changes

  const totalInventoryValue = useMemo(() => {
    return valuationReportItems.reduce((sum, item) => sum + item.totalValue, 0);
  }, [valuationReportItems]);

  const handleGenerateReport = () => {
    console.log('Generate Report clicked', { asOfDate, reportValuationMethod });
    alert(`Placeholder: Generating report as of ${asOfDate} using ${reportValuationMethod} view. Currently displaying static mock-derived data.`);
    // In a real app, this might refetch or re-calculate based on the criteria
  };

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Inventory Valuation Report</h1>
      </header>

      <Card title="Report Criteria">
        <div style={filterSectionStyle}>
          <div>
            <label htmlFor="asOfDate" style={{ marginRight: '0.5rem' }}>Valuation as of Date:</label>
            <input
              type="date"
              id="asOfDate"
              name="asOfDate"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="reportValuationMethod" style={{ marginRight: '0.5rem' }}>View Method:</label>
            <select
                name="reportValuationMethod"
                value={reportValuationMethod}
                onChange={(e) => setReportValuationMethod(e.target.value)}
                style={inputStyle}
            >
              <option value="Default">Default (As per Item Master)</option>
              {Object.values(ValuationMethod).map(vm => <option key={vm} value={vm}>{vm.replace('_',' ')}</option>)}
            </select>
          </div>
          <Button variant="primary" onClick={handleGenerateReport}>Generate Report</Button>
        </div>
      </Card>

      <Card title="Valuation Details">
        {valuationReportItems.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item Code</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle} align="right">Qty on Hand</th>
                <th style={thStyle}>Valuation Method</th>
                <th style={thStyle} align="right">Unit Cost</th>
                <th style={thStyle} align="right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {valuationReportItems.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.itemCode}</td>
                  <td style={tdStyle}>{item.itemName}</td>
                  <td style={tdStyle}>{item.category}</td>
                  <td style={tdStyle} align="right">{item.quantityOnHand.toLocaleString()}</td>
                  <td style={tdStyle}>{item.valuationMethod?.replace('_',' ') || 'N/A'}</td>
                  <td style={tdStyle} align="right">{item.unitCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={tdStyle} align="right">{item.totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
                <tr>
                    <th style={tfootThStyle} colSpan={6} align="right">Total Inventory Value:</th>
                    <th style={tfootThStyle} align="right">
                        {totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                    </th>
                </tr>
            </tfoot>
          </table>
        ) : (
          <p>No inventory items found to valuate.</p>
        )}
      </Card>
    </div>
  );
}
