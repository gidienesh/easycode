import React from 'react';
import { notifications } from '@mantine/notifications';
import GeneratorMaintenanceChecklist from '../../src/components/maintenance/GeneratorMaintenanceChecklist';
import { GeneratorMaintenanceChecklist as ChecklistType } from '../../src/types/maintenance';
import { sampleGeneratorChecklist } from '../../src/utils/maintenanceMockData';

const GeneratorChecklistDemoPage: React.FC = () => {
  const handleSave = (data: ChecklistType) => {
    // Here you would typically save to your backend service
    console.log('Saving checklist data:', data);
    
    notifications.show({
      title: 'Checklist Saved',
      message: 'Generator maintenance checklist has been saved successfully.',
      color: 'green',
    });
  };

  const handlePrint = (data: ChecklistType) => {
    // Here you would implement print functionality
    console.log('Printing checklist data:', data);
    
    notifications.show({
      title: 'Printing',
      message: 'Preparing checklist for printing...',
      color: 'blue',
    });
    
    // For now, just open a new window with the data
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Generator Maintenance Checklist - Demo</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #333; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .field { margin-bottom: 10px; padding: 5px; }
              .field label { font-weight: bold; color: #555; }
              .field-value { margin-left: 10px; }
              .status-good { color: #28a745; font-weight: bold; }
              .status-warning { color: #ffc107; font-weight: bold; }
              .status-poor { color: #dc3545; font-weight: bold; }
              .company-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
              .comments { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Generator Maintenance Checklist</h1>
              <p><strong>Worksheet No:</strong> ${data.worksheetNo}</p>
              <p><strong>Client:</strong> ${data.clientName}</p>
              <p><strong>Location:</strong> ${data.generatorLocation}</p>
              <p><strong>Inspection Date:</strong> ${data.inspectionDate}</p>
            </div>
            
            <div class="section">
              <h3>Equipment Data</h3>
              <div class="grid">
                <div class="field">
                  <label>Generator Model:</label>
                  <span class="field-value">${data.generatorModel}</span>
                </div>
                <div class="field">
                  <label>Serial No:</label>
                  <span class="field-value">${data.generatorSerialNo}</span>
                </div>
                <div class="field">
                  <label>Engine Type:</label>
                  <span class="field-value">${data.engineType}</span>
                </div>
                <div class="field">
                  <label>KVA Rating:</label>
                  <span class="field-value">${data.kvaRating}</span>
                </div>
                <div class="field">
                  <label>Frequency:</label>
                  <span class="field-value">${data.frequency}</span>
                </div>
                <div class="field">
                  <label>Output Voltage:</label>
                  <span class="field-value">${data.outputVoltage}</span>
                </div>
                <div class="field">
                  <label>Running Hours:</label>
                  <span class="field-value">${data.runningHours}</span>
                </div>
                <div class="field">
                  <label>Last Service Date:</label>
                  <span class="field-value">${data.lastServiceDate}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Loading Data</h3>
              <div class="grid">
                <div class="field">
                  <label>Line 1 Current:</label>
                  <span class="field-value">${data.line1Current}A</span>
                </div>
                <div class="field">
                  <label>Line 1 Voltage:</label>
                  <span class="field-value">${data.line1Voltage}V</span>
                </div>
                <div class="field">
                  <label>Line 1 Real Power:</label>
                  <span class="field-value">${data.line1RealPower}KW</span>
                </div>
                <div class="field">
                  <label>Line 1 Apparent Power:</label>
                  <span class="field-value">${data.line1ApparentPower}KVA</span>
                </div>
                <div class="field">
                  <label>Line 2 Current:</label>
                  <span class="field-value">${data.line2Current}A</span>
                </div>
                <div class="field">
                  <label>Line 2 Voltage:</label>
                  <span class="field-value">${data.line2Voltage}V</span>
                </div>
                <div class="field">
                  <label>Line 2 Real Power:</label>
                  <span class="field-value">${data.line2RealPower}KW</span>
                </div>
                <div class="field">
                  <label>Line 2 Apparent Power:</label>
                  <span class="field-value">${data.line2ApparentPower}KVA</span>
                </div>
                <div class="field">
                  <label>Line 3 Current:</label>
                  <span class="field-value">${data.line3Current}A</span>
                </div>
                <div class="field">
                  <label>Line 3 Voltage:</label>
                  <span class="field-value">${data.line3Voltage}V</span>
                </div>
                <div class="field">
                  <label>Line 3 Real Power:</label>
                  <span class="field-value">${data.line3RealPower}KW</span>
                </div>
                <div class="field">
                  <label>Line 3 Apparent Power:</label>
                  <span class="field-value">${data.line3ApparentPower}KVA</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Visual/Mechanical Inspection</h3>
              <div class="grid">
                <div class="field">
                  <label>Canopy:</label> 
                  <span class="status-${data.canopy === 'GOOD' ? 'good' : data.canopy === 'NEEDS_REPAIR' ? 'warning' : 'poor'}">${data.canopy}</span>
                </div>
                <div class="field">
                  <label>Injector Pump:</label> 
                  <span class="status-${data.injectorPump === 'WORKING' ? 'good' : 'poor'}">${data.injectorPump}</span>
                </div>
                <div class="field">
                  <label>Fuel Solenoid:</label> 
                  <span class="status-${data.fuelSolenoid === 'WORKING' ? 'good' : 'poor'}">${data.fuelSolenoid}</span>
                </div>
                <div class="field">
                  <label>Fuel Gauge:</label> 
                  <span class="status-${data.fuelGauge === 'WORKING' ? 'good' : 'poor'}">${data.fuelGauge}</span>
                </div>
                <div class="field">
                  <label>Radiator:</label> 
                  <span class="status-${data.radiator === 'GOOD' ? 'good' : 'warning'}">${data.radiator}</span>
                </div>
                <div class="field">
                  <label>Exhaust Pipe Extension:</label> 
                  <span class="status-${data.exhaustPipeExtension === 'GOOD' ? 'good' : 'warning'}">${data.exhaustPipeExtension}</span>
                </div>
                <div class="field">
                  <label>Exhaust Fume:</label> 
                  <span class="status-${data.exhaustFume === 'CLEAN' ? 'good' : 'warning'}">${data.exhaustFume}</span>
                </div>
                <div class="field">
                  <label>Water Pump:</label> 
                  <span class="status-${data.waterPump === 'WORKING' ? 'good' : 'warning'}">${data.waterPump}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Comments</h3>
              <div class="comments">
                <p>${data.generalComments || 'No additional comments'}</p>
              </div>
            </div>
            
            <div class="section">
              <h3>Signatures</h3>
              <div class="grid">
                <div class="field">
                  <label>Technician:</label> ${data.engineerTechnicianName}
                </div>
                <div class="field">
                  <label>Signature:</label> ${data.engineerTechnicianSignature}
                </div>
                <div class="field">
                  <label>Client Representative:</label> ${data.clientRepresentativeName}
                </div>
                <div class="field">
                  <label>Signature:</label> ${data.clientRepresentativeSignature}
                </div>
                <div class="field">
                  <label>For (Bank/Client):</label> ${data.forBankClient}
                </div>
                <div class="field">
                  <label>Stamp Date:</label> ${data.stampDate}
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Company Information</h3>
              <div class="company-info">
                <p><strong>${data.companyName}</strong></p>
                <p>${data.mainOfficeAddress}</p>
                <p>${data.branchOfficeAddress}</p>
                <p>${data.poBox}</p>
                <p>Tel: ${data.telephone1} | ${data.telephone2}</p>
                <p>Email: ${data.email}</p>
                <p>Website: ${data.website}</p>
                <p><strong>Dealer In:</strong> ${data.dealerIn}</p>
                <p><strong>Brands:</strong> ${data.brands}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <GeneratorMaintenanceChecklist
      initialData={sampleGeneratorChecklist}
      onSave={handleSave}
      onPrint={handlePrint}
    />
  );
};

export default GeneratorChecklistDemoPage; 