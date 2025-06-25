import React from 'react';
import { notifications } from '@mantine/notifications';
import { Container, Alert, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import GeneratorMaintenanceChecklist from '../../src/components/maintenance/GeneratorMaintenanceChecklist';
import { GeneratorMaintenanceChecklist as ChecklistType } from '../../src/types/maintenance';
import { useUser } from '../../src/providers/UserProvider';

const GeneratorChecklistPage: React.FC = () => {
  const { hasPermission } = useUser();

  // Check if user has permission to access checklists
  if (!hasPermission('equipment-maintenance-service', 'checklists', 'read')) {
    return (
      <Container size="xl" py="xl">
        <Alert 
          icon={<IconLock size="1rem" />} 
          title="Access Restricted" 
          color="yellow"
          variant="light"
        >
          <Text size="sm">
            You don't have permission to access maintenance checklists. 
            Please contact your administrator to request access.
          </Text>
        </Alert>
      </Container>
    );
  }

  const handleSave = (data: ChecklistType) => {
    // Check if user has permission to write checklists
    if (!hasPermission('equipment-maintenance-service', 'checklists', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save checklists.',
        color: 'red',
      });
      return;
    }

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
            <title>Generator Maintenance Checklist</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .field { margin-bottom: 10px; }
              .field label { font-weight: bold; }
              .status-good { color: green; }
              .status-warning { color: orange; }
              .status-poor { color: red; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Generator Maintenance Checklist</h1>
              <p>Worksheet No: ${data.worksheetNo}</p>
              <p>Client: ${data.clientName}</p>
              <p>Location: ${data.generatorLocation}</p>
              <p>Inspection Date: ${data.inspectionDate}</p>
            </div>
            
            <div class="section">
              <h3>Equipment Data</h3>
              <div class="grid">
                <div class="field">
                  <label>Generator Model:</label> ${data.generatorModel}
                </div>
                <div class="field">
                  <label>Serial No:</label> ${data.generatorSerialNo}
                </div>
                <div class="field">
                  <label>Engine Type:</label> ${data.engineType}
                </div>
                <div class="field">
                  <label>KVA Rating:</label> ${data.kvaRating}
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Loading Data</h3>
              <div class="grid">
                <div class="field">
                  <label>Line 1 Current:</label> ${data.line1Current}A
                </div>
                <div class="field">
                  <label>Line 1 Voltage:</label> ${data.line1Voltage}V
                </div>
                <div class="field">
                  <label>Line 2 Current:</label> ${data.line2Current}A
                </div>
                <div class="field">
                  <label>Line 2 Voltage:</label> ${data.line2Voltage}V
                </div>
                <div class="field">
                  <label>Line 3 Current:</label> ${data.line3Current}A
                </div>
                <div class="field">
                  <label>Line 3 Voltage:</label> ${data.line3Voltage}V
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
                  <label>Radiator:</label> 
                  <span class="status-${data.radiator === 'GOOD' ? 'good' : 'warning'}">${data.radiator}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Comments</h3>
              <p>${data.generalComments || 'No additional comments'}</p>
            </div>
            
            <div class="section">
              <h3>Signatures</h3>
              <div class="grid">
                <div class="field">
                  <label>Technician:</label> ${data.engineerTechnicianName}
                </div>
                <div class="field">
                  <label>Client Representative:</label> ${data.clientRepresentativeName}
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Company Information</h3>
              <p><strong>${data.companyName}</strong></p>
              <p>${data.mainOfficeAddress}</p>
              <p>${data.poBox}</p>
              <p>Tel: ${data.telephone1}</p>
              <p>Email: ${data.email}</p>
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
      onSave={handleSave}
      onPrint={handlePrint}
      canEdit={hasPermission('equipment-maintenance-service', 'checklists', 'write')}
      canDelete={hasPermission('equipment-maintenance-service', 'checklists', 'delete')}
      canApprove={hasPermission('equipment-maintenance-service', 'checklists', 'approve')}
    />
  );
};

export default GeneratorChecklistPage; 