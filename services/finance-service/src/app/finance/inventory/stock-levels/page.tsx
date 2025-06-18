// src/app/finance/inventory/stock-levels/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, ItemType, ValuationMethod } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interface for Stock Level items for type safety
interface StockLevelItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  unitOfMeasure: string;
  itemType: ItemType; // To know if it's a stock item
  quantityOnHand: number;
  reservedStock?: number;
  incomingStock?: number;
  availableStock: number; // Calculated: QoH - Reserved
  unitPrice?: number; // Selling price, for context
  purchasePrice?: number; // Cost price, for stock valuation
  stockValue: number; // Calculated: QoH * Purchase Price (or other valuation method)
  lastStockCountDate?: string;
  isActive: boolean;
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.85em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 6px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 6px', textAlign: 'left' };
const inputStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' };
const filterSectionStyle: React.CSSProperties = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };


export default function StockLevelsPage() {
  // For now, directly use all mock data. Filtering would be applied in a real fetch/state update.
  const [filterItem, setFilterItem] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const stockItems = useMemo((): StockLevelItem[] => {
    return mockData.inventory.itemMaster
      .filter(item => item.itemType !== ItemType.SERVICE && item.itemType !== ItemType.NON_STOCK) // Only stockable items
      .map(item => {
        const qtyOnHand = item.quantityOnHand || 0;
        const reserved = item.reservedStock || 0;
        const available = qtyOnHand - reserved;
        const stockValue = qtyOnHand * (item.purchasePrice || item.unitPrice || 0); // Prioritize purchase price for stock value

        return {
          ...item,
          quantityOnHand: qtyOnHand,
          reservedStock: reserved,
          incomingStock: item.incomingStock || 0,
          availableStock: available,
          stockValue: stockValue,
          lastStockCountDate: item.lastStockCountDate,
        };
      })
      .filter(item =>
        (item.itemName.toLowerCase().includes(filterItem.toLowerCase()) || item.itemCode.toLowerCase().includes(filterItem.toLowerCase())) &&
        (filterCategory === '' || item.category === filterCategory)
      );
  }, [filterItem, filterCategory, mockData.inventory.itemMaster]);

  const totalStockValue = useMemo(() => {
    return stockItems.reduce((sum, item) => sum + item.stockValue, 0);
  }, [stockItems]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(mockData.inventory.itemMaster.map(item => item.category));
    return Array.from(categories);
  }, [mockData.inventory.itemMaster]);

  const handleApplyFilters = () => {
    // In a real app, this might trigger a refetch or re-calculation if data isn't live filtered
    console.log('Apply Filters clicked', { filterItem, filterCategory });
    alert('Filters applied (mock - filtering is live on input change for this demo).');
  };


  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Inventory Stock Levels</h1>
      </header>

      <Card title="Filters & Overview">
        <div style={filterSectionStyle}>
          <input
            type="text"
            placeholder="Filter by Item Code/Name..."
            value={filterItem}
            onChange={(e) => setFilterItem(e.target.value)}
            style={inputStyle}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select style={inputStyle} disabled><option value="">All Warehouses (N/A)</option></select>
          <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
        <p><strong>Total Stock Value:</strong> KES {totalStockValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
      </Card>

      <Card title="Current Stock Levels">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Code</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle} align="right">Qty on Hand</th>
              <th style={thStyle} align="right">Reserved</th>
              <th style={thStyle} align="right">Incoming</th>
              <th style={thStyle} align="right">Available</th>
              <th style={thStyle} align="right">Purchase Price</th>
              <th style={thStyle} align="right">Stock Value</th>
              <th style={thStyle}>Last Count</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item) => (
              <tr key={item.id} style={!item.isActive ? {color: '#aaa', textDecoration: 'line-through'} : {}}>
                <td style={tdStyle}>{item.itemCode}</td>
                <td style={tdStyle}>{item.itemName}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle} align="right">{item.quantityOnHand.toLocaleString()}</td>
                <td style={tdStyle} align="right">{item.reservedStock?.toLocaleString() || 0}</td>
                <td style={tdStyle} align="right">{item.incomingStock?.toLocaleString() || 0}</td>
                <td style={tdStyle} align="right" style={{fontWeight: 'bold'}}>{item.availableStock.toLocaleString()}</td>
                <td style={tdStyle} align="right">{(item.purchasePrice || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle} align="right">{item.stockValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{item.lastStockCountDate ? new Date(item.lastStockCountDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stockItems.length === 0 && <p>No stock items found matching your criteria.</p>}
      </Card>
    </div>
  );
}
