// src/app/finance/fa/asset-register/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { mockData, DepreciationMethod, AssetStatus, MaintenanceStatus, MaintenanceType } from '../../../../lib/mockData'; // Adjust path
import Card from '../../../../components/ui/Card';     // Adjust path
import Button from '../../../../components/ui/Button';   // Adjust path

// Define interfaces for Asset items for type safety
interface MaintenanceLogItem {
  id: string;
  maintenanceDate: string;
  maintenanceType: MaintenanceType;
  description: string;
  cost?: number;
  status: MaintenanceStatus;
}
interface AssetRegisterItem {
  id: string;
  assetCode: string;
  assetName: string;
  description?: string;
  category: string;
  location?: string;
  acquisitionDate: string;
  acquisitionCost: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;
  depreciationRate?: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  netBookValue: number; // Calculated
  status: AssetStatus;
  serialNumber?: string;
  assignedToUser?: string;
  department?: string;
  maintenanceSchedule?: MaintenanceLogItem[];
  // Disposal fields
  disposalDate?: string;
  proceedsFromSale?: number;
  gainLossOnDisposal?: number;
  disposalNotes?: string;
}


const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.85em' };
const thStyle: React.CSSProperties = { borderBottom: '2px solid #ddd', padding: '8px 4px', textAlign: 'left', backgroundColor: '#f9f9f9' };
const tdStyle: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px 4px', textAlign: 'left', verticalAlign: 'top' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle: React.CSSProperties = { width: '100%', padding:'8px', boxSizing: 'border-box', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const textAreaStyle: React.CSSProperties = { ...inputStyle, height: '60px', fontFamily: 'inherit' };
const formRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'};
const fieldsetStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '1rem'};
const legendStyle: React.CSSProperties = { fontWeight: 'bold', padding: '0 5px'};


export default function AssetRegisterPage() {
  const [assets, setAssets] = useState<AssetRegisterItem[]>(
    mockData.fixedAssets.assetRegister.map(asset => ({
      ...asset,
      netBookValue: asset.acquisitionCost - asset.accumulatedDepreciation,
      maintenanceSchedule: asset.maintenanceSchedule || [],
    }))
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<AssetRegisterItem | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState<boolean>(false);
  const [currentMaintenanceLog, setCurrentMaintenanceLog] = useState<Partial<MaintenanceLogItem>>({});
  const [showDisposalModal, setShowDisposalModal] = useState<boolean>(false);
  const [disposingAsset, setDisposingAsset] = useState<AssetRegisterItem | null>(null);
  const [disposalFormData, setDisposalFormData] = useState<{ date: string, proceeds: number, notes: string }>({ date: new Date().toISOString().split('T')[0], proceeds: 0, notes: ''});

  const initialFormData: Partial<AssetRegisterItem> = { assetCode: '', assetName: '', category: '', acquisitionDate: new Date().toISOString().split('T')[0], acquisitionCost: 0, depreciationMethod: DepreciationMethod.STRAIGHT_LINE, usefulLifeYears: 5, salvageValue: 0, accumulatedDepreciation: 0, status: AssetStatus.IN_USE, location: '', assignedToUser: '', department: '', maintenanceSchedule: [] };
  const [formData, setFormData] = useState<Partial<AssetRegisterItem>>(initialFormData);


  const handleAddNewAsset = () => { /* ... (same as before) ... */
    setEditingAsset(null);
    setFormData(initialFormData);
    setShowModal(true);
  };
  const handleEditAsset = (assetId: string) => { /* ... (same as before) ... */
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setEditingAsset(asset);
      setFormData({...asset, maintenanceSchedule: asset.maintenanceSchedule || []});
      setShowModal(true);
    }
  };

  const handleOpenDisposalModal = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
        setDisposingAsset(asset);
        setDisposalFormData({ date: new Date().toISOString().split('T')[0], proceeds: 0, notes: ''});
        setShowDisposalModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAsset(null);
    setFormData({});
    setShowMaintenanceModal(false);
    setCurrentMaintenanceLog({});
    setShowDisposalModal(false);
    setDisposingAsset(null);
    setDisposalFormData({ date: new Date().toISOString().split('T')[0], proceeds: 0, notes: ''});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { /* ... (same as before) ... */
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    let processedValue = type === 'checkbox' ? checked : value;
    if (['acquisitionCost', 'usefulLifeYears', 'depreciationRate', 'salvageValue', 'accumulatedDepreciation'].includes(name)) {
        processedValue = parseFloat(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  const handleFormSubmit = (e: React.FormEvent) => { /* ... (same as before) ... */
    e.preventDefault();
    const netBookValue = (Number(formData.acquisitionCost) || 0) - (Number(formData.accumulatedDepreciation) || 0);

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? {...a, ...formData, netBookValue, maintenanceSchedule: formData.maintenanceSchedule || [] } as AssetRegisterItem : a));
      alert(`Placeholder: Asset ${editingAsset.id} updated (mock).`);
    } else {
      const newAsset: AssetRegisterItem = {
        ...initialFormData,
        ...formData,
        id: `FA${Date.now().toString().slice(-4)}`,
        netBookValue,
        maintenanceSchedule: formData.maintenanceSchedule || [],
      } as AssetRegisterItem;
      setAssets([...assets, newAsset]);
      alert(`Placeholder: New asset created (mock).`);
    }
    handleModalClose();
  };

  const handleOpenMaintenanceModal = (log?: MaintenanceLogItem) => { /* ... (same as before) ... */
      setCurrentMaintenanceLog(log || { maintenanceDate: new Date().toISOString().split('T')[0], maintenanceType: MaintenanceType.PREVENTIVE, status: MaintenanceStatus.SCHEDULED, cost: 0 });
      setShowMaintenanceModal(true);
  };
  const handleMaintenanceLogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { /* ... (same as before) ... */
      const { name, value } = e.target;
      let processedValue: string | number = value;
      if (name === 'cost') processedValue = parseFloat(value) || 0;
      setCurrentMaintenanceLog(prev => ({...prev, [name]: processedValue }));
  };
  const handleSaveMaintenanceLog = () => { /* ... (same as before) ... */
      if (!currentMaintenanceLog.maintenanceType || !currentMaintenanceLog.description) {
          alert("Maintenance type and description are required.");
          return;
      }
      const newLog = { ...currentMaintenanceLog, id: currentMaintenanceLog.id || `MS-${Date.now().toString().slice(-5)}`} as MaintenanceLogItem;
      const currentLogs = formData.maintenanceSchedule || [];

      let updatedLogs;
      if (currentMaintenanceLog.id) {
          updatedLogs = currentLogs.map(log => log.id === newLog.id ? newLog : log);
      } else {
          updatedLogs = [...currentLogs, newLog];
      }
      setFormData(prev => ({...prev, maintenanceSchedule: updatedLogs }));
      setShowMaintenanceModal(false);
      setCurrentMaintenanceLog({});
  };

  const handleConfirmDisposal = () => {
    if (!disposingAsset) return;
    const nbvAtDisposal = disposingAsset.netBookValue; // Or re-calculate based on disposal date if depreciation was run up to that date
    const gainLoss = disposalFormData.proceeds - nbvAtDisposal;

    setAssets(assets.map(a => a.id === disposingAsset.id ? {
        ...a,
        status: AssetStatus.DISPOSED,
        disposalDate: disposalFormData.date,
        proceedsFromSale: disposalFormData.proceeds,
        disposalNotes: disposalFormData.notes,
        gainLossOnDisposal: gainLoss,
        // Typically, for disposed assets, accumulated depreciation might be set to acquisition cost if fully written off,
        // and NBV becomes 0 or salvage value. For simplicity, we just mark as disposed.
        // Or, NBV becomes proceeds - gain/loss, effectively making it zero after accounting for proceeds.
        // For this mock, we'll just update status and disposal info.
        // A real system would also post a Journal Entry for disposal.
    } : a));
    alert(`Asset ${disposingAsset.assetCode} disposed. Gain/(Loss): ${gainLoss.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`);
    handleModalClose();
  };


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Fixed Asset Register</h1>
        <Button variant="primary" onClick={handleAddNewAsset}>Add New Asset</Button>
      </header>

      <Card title="Manage Fixed Assets">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Asset Code</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Assigned To</th>
              <th style={thStyle}>Acq. Date</th>
              <th style={thStyle} align="right">Cost</th>
              <th style={thStyle} align="right">NBV</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} style={asset.status === AssetStatus.DISPOSED ? {backgroundColor: '#f0f0f0', color: '#999'} : {}}>
                <td style={tdStyle}>{asset.assetCode}</td>
                <td style={tdStyle}>{asset.assetName}</td>
                <td style={tdStyle}>{asset.category}</td>
                <td style={tdStyle}>{asset.location || 'N/A'}</td>
                <td style={tdStyle}>{asset.assignedToUser || asset.department || 'N/A'}</td>
                <td style={tdStyle}>{new Date(asset.acquisitionDate).toLocaleDateString()}</td>
                <td style={tdStyle} align="right">{asset.acquisitionCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle} align="right">{asset.netBookValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style={tdStyle}>{asset.status.replace('_', ' ')}</td>
                <td style={tdStyle}>
                  <div style={buttonGroupStyle}>
                    <Button variant="secondary" size="sm" onClick={() => handleEditAsset(asset.id)}>View/Edit</Button>
                    {asset.status !== AssetStatus.DISPOSED &&
                        <Button variant="destructive" size="sm" onClick={() => handleOpenDisposalModal(asset.id)}>Dispose</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {assets.length === 0 && <p>No fixed assets found.</p>}
      </Card>

      {/* Add/Edit Asset Modal (Main) */}
      {showModal && ( /* ... (existing modal code remains largely the same, ensure it handles new fields if they are editable here) ... */
          <div style={modalOverlayStyle} onClick={handleModalClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <Card title={editingAsset ? `Edit Asset: ${editingAsset.assetName}` : "Add New Fixed Asset"}>
                <form onSubmit={handleFormSubmit}>
                    {/* Basic Info */}
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Asset Details</legend>
                        {/* ... assetCode, assetName, description, category, serialNumber ... */}
                        <div style={formRowStyle}>
                            <div><label>Asset Code: <input type="text" name="assetCode" value={formData.assetCode || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                            <div><label>Asset Name: <input type="text" name="assetName" value={formData.assetName || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        </div>
                        <div><label>Description: <textarea name="description" value={formData.description || ''} onChange={handleFormChange} style={textAreaStyle}></textarea></label></div>
                        <div style={formRowStyle}>
                            <div><label>Category: <input type="text" name="category" value={formData.category || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                            <div><label>Serial Number: <input type="text" name="serialNumber" value={formData.serialNumber || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                        </div>
                    </fieldset>
                     {/* Acquisition & Value */}
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Acquisition & Value</legend>
                        {/* ... acquisitionDate, acquisitionCost, depreciationMethod, usefulLifeYears/depreciationRate, salvageValue, accumulatedDepreciation ... */}
                         <div style={formRowStyle}>
                            <div><label>Acquisition Date: <input type="date" name="acquisitionDate" value={formData.acquisitionDate || ''} onChange={handleFormChange} required style={inputStyle}/></label></div>
                            <div><label>Acquisition Cost: <input type="number" name="acquisitionCost" value={formData.acquisitionCost || 0} onChange={handleFormChange} required style={inputStyle}/></label></div>
                        </div>
                        <div style={formRowStyle}>
                            <div><label>Depreciation Method: <select name="depreciationMethod" value={formData.depreciationMethod} onChange={handleFormChange} style={inputStyle}>{Object.values(DepreciationMethod).map(dm => <option key={dm} value={dm}>{dm.replace('_', ' ')}</option>)}</select></label></div>
                            {formData.depreciationMethod === DepreciationMethod.STRAIGHT_LINE ? (<div><label>Useful Life (Years): <input type="number" name="usefulLifeYears" value={formData.usefulLifeYears || 0} onChange={handleFormChange} style={inputStyle}/></label></div>) :
                             formData.depreciationMethod === DepreciationMethod.DECLINING_BALANCE ? (<div><label>Depreciation Rate (%): <input type="number" step="0.01" name="depreciationRate" value={formData.depreciationRate || 0} onChange={handleFormChange} style={inputStyle}/></label></div>) : (<div>&nbsp;</div>) }
                        </div>
                        <div style={formRowStyle}>
                            <div><label>Salvage Value: <input type="number" name="salvageValue" value={formData.salvageValue || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                            <div><label>Accumulated Depreciation: <input type="number" name="accumulatedDepreciation" value={formData.accumulatedDepreciation || 0} onChange={handleFormChange} style={inputStyle}/></label></div>
                        </div>
                    </fieldset>
                     {/* Tracking & Status */}
                    <fieldset style={fieldsetStyle}><legend style={legendStyle}>Tracking & Status</legend>
                        {/* ... location, assignedToUser, department, status ... */}
                        <div style={formRowStyle}>
                            <div><label>Location: <input type="text" name="location" value={formData.location || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                            <div><label>Assigned To User/Emp ID: <input type="text" name="assignedToUser" value={formData.assignedToUser || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                        </div>
                        <div style={formRowStyle}>
                             <div><label>Department: <input type="text" name="department" value={formData.department || ''} onChange={handleFormChange} style={inputStyle}/></label></div>
                             <div><label>Status: <select name="status" value={formData.status} onChange={handleFormChange} style={inputStyle} disabled={editingAsset?.status === AssetStatus.DISPOSED}>{Object.values(AssetStatus).filter(s => s !== AssetStatus.DISPOSED || formData.status === AssetStatus.DISPOSED).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select></label></div>
                        </div>
                    </fieldset>
                    {/* Maintenance Schedule (if editing) */}
                    {editingAsset && formData.status !== AssetStatus.DISPOSED && ( /* ... existing maintenance schedule section ... */
                         <fieldset style={fieldsetStyle}><legend style={legendStyle}>Maintenance Schedule</legend>
                            <table style={{...tableStyle, fontSize: '0.9em'}}>
                                <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Type</th><th style={thStyle}>Description</th><th style={thStyle} align="right">Cost</th><th style={thStyle}>Status</th><th style={thStyle}>Action</th></tr></thead>
                                <tbody>
                                    {(formData.maintenanceSchedule || []).map(log => (
                                        <tr key={log.id}>
                                            <td style={tdStyle}>{new Date(log.maintenanceDate).toLocaleDateString()}</td>
                                            <td style={tdStyle}>{log.maintenanceType}</td>
                                            <td style={tdStyle}>{log.description}</td>
                                            <td style={tdStyle} align="right">{log.cost?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'}</td>
                                            <td style={tdStyle}>{log.status}</td>
                                            <td style={tdStyle}><Button type="button" variant="secondary" size="sm" onClick={() => handleOpenMaintenanceModal(log)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!formData.maintenanceSchedule || formData.maintenanceSchedule.length === 0) && <p>No maintenance logs for this asset.</p>}
                            <Button type="button" variant="secondary" onClick={() => handleOpenMaintenanceModal()} style={{marginTop: '10px'}}>Add Maintenance Log</Button>
                        </fieldset>
                    )}
                    {/* Disposal Info (if editing and disposed) */}
                    {editingAsset && formData.status === AssetStatus.DISPOSED && (
                        <fieldset style={fieldsetStyle}><legend style={legendStyle}>Disposal Information</legend>
                            <div style={formRowStyle}>
                                <div><label>Disposal Date: <input type="date" value={formData.disposalDate || ''} style={inputStyle} readOnly /></label></div>
                                <div><label>Proceeds from Sale: <input type="number" value={formData.proceedsFromSale || 0} style={inputStyle} readOnly /></label></div>
                            </div>
                            <div><label>Gain/(Loss) on Disposal: <input type="text" value={formData.gainLossOnDisposal?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) || 'N/A'} style={{...inputStyle, backgroundColor: '#f0f0f0'}} readOnly /></label></div>
                            <div><label>Disposal Notes: <textarea value={formData.disposalNotes || ''} style={{...textAreaStyle, backgroundColor: '#f0f0f0'}} readOnly></textarea></label></div>
                        </fieldset>
                    )}
                    <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        {formData.status !== AssetStatus.DISPOSED && <Button type="submit" variant="primary">Save Asset</Button>}
                    </div>
                </form>
            </Card>
          </div>
        </div>
      )}

      {/* Add/Edit Maintenance Log Modal */}
      {showMaintenanceModal && editingAsset && ( /* ... (existing maintenance modal code) ... */
          <div style={modalOverlayStyle} onClick={() => setShowMaintenanceModal(false)}>
              <div style={{...modalContentStyle, maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
                  <Card title={currentMaintenanceLog.id ? "Edit Maintenance Log" : "Add Maintenance Log"}>
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveMaintenanceLog(); }}>
                          <div><label>Maintenance Date: <input type="date" name="maintenanceDate" value={currentMaintenanceLog.maintenanceDate || ''} onChange={handleMaintenanceLogChange} required style={inputStyle} /></label></div>
                          <div><label>Type: <select name="maintenanceType" value={currentMaintenanceLog.maintenanceType} onChange={handleMaintenanceLogChange} style={inputStyle}>{Object.values(MaintenanceType).map(mt => <option key={mt} value={mt}>{mt}</option>)}</select></label></div>
                          <div><label>Description: <textarea name="description" value={currentMaintenanceLog.description || ''} onChange={handleMaintenanceLogChange} required style={textAreaStyle}></textarea></label></div>
                          <div><label>Cost: <input type="number" name="cost" value={currentMaintenanceLog.cost || 0} onChange={handleMaintenanceLogChange} style={inputStyle} /></label></div>
                          <div><label>Status: <select name="status" value={currentMaintenanceLog.status} onChange={handleMaintenanceLogChange} style={inputStyle}>{Object.values(MaintenanceStatus).map(ms => <option key={ms} value={ms}>{ms}</option>)}</select></label></div>
                          <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <Button type="button" variant="secondary" onClick={() => setShowMaintenanceModal(false)}>Cancel</Button>
                              <Button type="submit" variant="primary">Save Log</Button>
                          </div>
                      </form>
                  </Card>
              </div>
          </div>
      )}

      {/* Asset Disposal Modal */}
      {showDisposalModal && disposingAsset && (
          <div style={modalOverlayStyle} onClick={handleModalClose}>
              <div style={{...modalContentStyle, maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
                  <Card title={`Dispose Asset: ${disposingAsset.assetName} (${disposingAsset.assetCode})`}>
                      <form onSubmit={(e) => {e.preventDefault(); handleConfirmDisposal();}}>
                          <p><strong>Asset Name:</strong> {disposingAsset.assetName}</p>
                          <p><strong>Asset Code:</strong> {disposingAsset.assetCode}</p>
                          <p><strong>Acquisition Cost:</strong> {disposingAsset.acquisitionCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                          <p><strong>Accumulated Depreciation:</strong> {disposingAsset.accumulatedDepreciation.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                          <p><strong>Net Book Value (at disposal):</strong> {disposingAsset.netBookValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                          <hr style={{margin: '1rem 0'}}/>
                          <div><label>Date of Disposal: <input type="date" name="date" value={disposalFormData.date} onChange={(e) => setDisposalFormData({...disposalFormData, date: e.target.value})} required style={inputStyle}/></label></div>
                          <div><label>Proceeds from Sale (KES): <input type="number" name="proceeds" value={disposalFormData.proceeds} onChange={(e) => setDisposalFormData({...disposalFormData, proceeds: parseFloat(e.target.value) || 0})} style={inputStyle}/></label></div>
                          <div><label>Gain/(Loss) on Disposal (KES): <input type="text" value={(disposalFormData.proceeds - disposingAsset.netBookValue).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} style={{...inputStyle, backgroundColor: '#f0f0f0'}} readOnly /></label></div>
                          <div><label>Disposal Notes: <textarea name="notes" value={disposalFormData.notes} onChange={(e) => setDisposalFormData({...disposalFormData, notes: e.target.value})} style={textAreaStyle}></textarea></label></div>
                          <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
                              <Button type="submit" variant="destructive">Confirm Disposal</Button>
                          </div>
                      </form>
                  </Card>
              </div>
          </div>
      )}

    </div>
  );
}
