import React, { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Container, Alert, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import CustomerEquipmentManager from '../../src/components/maintenance/CustomerEquipmentManager';
import { 
  MaintenanceCustomer, 
  EquipmentAsset, 
  EquipmentLocation 
} from '../../src/types/maintenance';
import { useUser } from '../../src/providers/UserProvider';

// Mock data for demonstration
const mockCustomers: MaintenanceCustomer[] = [
  {
    id: '1',
    name: 'KCB Bank Kenya',
    industry: 'Banking',
    website: 'www.kcb.co.ke',
    phone: '+254 20 327 0000',
    address: 'Kencom House, Moi Avenue, Nairobi',
    annualRevenue: 50000000,
    numberOfEmployees: 5000,
    status: 'ACTIVE',
    createdAt: new Date('2020-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    maintenanceContract: {
      contractNumber: 'KCB-2024-001',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      contractType: 'COMPREHENSIVE',
      billingFrequency: 'MONTHLY',
      monthlyRate: 15000,
      equipmentCount: 25
    },
    locations: [
      {
        id: 'loc-1',
        name: 'Head Office',
        address: 'Kencom House, Moi Avenue',
        city: 'Nairobi',
        state: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya',
        contactPerson: 'John Mwangi',
        contactPhone: '+254 700 123 456',
        contactEmail: 'john.mwangi@kcb.co.ke'
      },
      {
        id: 'loc-2',
        name: 'Mumias Branch',
        address: 'Mumias Town Centre',
        city: 'Mumias',
        state: 'Kakamega',
        postalCode: '50100',
        country: 'Kenya',
        contactPerson: 'Peter Mwasalika',
        contactPhone: '+254 700 789 012',
        contactEmail: 'peter.mwasalika@kcb.co.ke'
      }
    ],
    equipment: [
      {
        id: 'eq-1',
        assetNumber: 'KCB-GEN-001',
        equipmentType: 'GENERATOR',
        model: 'FH44',
        serialNumber: 'T144 K06C0204',
        manufacturer: 'FG Wilson',
        purchaseDate: '2020-06-01',
        installationDate: '2020-06-15',
        locationId: 'loc-1',
        location: {
          id: 'loc-1',
          name: 'Head Office',
          address: 'Kencom House, Moi Avenue',
          city: 'Nairobi',
          state: 'Nairobi',
          postalCode: '00100',
          country: 'Kenya'
        },
        customerId: '1',
        customer: {} as MaintenanceCustomer,
        custodian: 'Facilities Manager',
        status: 'ACTIVE',
        lastServiceDate: '2024-02-15',
        nextServiceDate: '2024-05-15',
        specifications: {
          kvaRating: '44KVA',
          engineType: 'MITSUBISHI',
          fuelType: 'Diesel'
        },
        createdAt: '2020-06-01',
        updatedAt: '2024-03-01'
      },
      {
        id: 'eq-2',
        assetNumber: 'KCB-AC-001',
        equipmentType: 'AIR_CONDITIONER',
        model: 'Split AC 24000 BTU',
        serialNumber: 'AC-2024-001',
        manufacturer: 'LG',
        purchaseDate: '2024-01-01',
        installationDate: '2024-01-15',
        locationId: 'loc-1',
        location: {
          id: 'loc-1',
          name: 'Head Office',
          address: 'Kencom House, Moi Avenue',
          city: 'Nairobi',
          state: 'Nairobi',
          postalCode: '00100',
          country: 'Kenya'
        },
        customerId: '1',
        customer: {} as MaintenanceCustomer,
        custodian: 'IT Manager',
        status: 'ACTIVE',
        specifications: {
          coolingCapacity: '24000 BTU',
          refrigerantType: 'R410A'
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    maintenanceHistory: []
  },
  {
    id: '2',
    name: 'Safaricom PLC',
    industry: 'Telecommunications',
    website: 'www.safaricom.co.ke',
    phone: '+254 722 000 000',
    address: 'Safaricom House, Waiyaki Way, Westlands',
    annualRevenue: 100000000,
    numberOfEmployees: 8000,
    status: 'ACTIVE',
    createdAt: new Date('2019-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    maintenanceContract: {
      contractNumber: 'SAF-2024-001',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      contractType: 'PREVENTIVE',
      billingFrequency: 'QUARTERLY',
      monthlyRate: 25000,
      equipmentCount: 50
    },
    locations: [
      {
        id: 'loc-3',
        name: 'Headquarters',
        address: 'Safaricom House, Waiyaki Way',
        city: 'Nairobi',
        state: 'Nairobi',
        postalCode: '00800',
        country: 'Kenya',
        contactPerson: 'Sarah Kamau',
        contactPhone: '+254 722 111 111',
        contactEmail: 'sarah.kamau@safaricom.co.ke'
      }
    ],
    equipment: [
      {
        id: 'eq-3',
        assetNumber: 'SAF-UPS-001',
        equipmentType: 'UPS_SYSTEM',
        model: 'APC Smart-UPS RT 5000VA',
        serialNumber: 'UPS-2024-001',
        manufacturer: 'APC',
        purchaseDate: '2024-02-01',
        installationDate: '2024-02-15',
        locationId: 'loc-3',
        location: {
          id: 'loc-3',
          name: 'Headquarters',
          address: 'Safaricom House, Waiyaki Way',
          city: 'Nairobi',
          state: 'Nairobi',
          postalCode: '00800',
          country: 'Kenya'
        },
        customerId: '2',
        customer: {} as MaintenanceCustomer,
        custodian: 'Data Center Manager',
        status: 'ACTIVE',
        specifications: {
          capacity: '5000VA',
          voltage: '230V'
        },
        createdAt: '2024-02-01',
        updatedAt: '2024-02-15'
      }
    ],
    maintenanceHistory: []
  }
];

const CustomerEquipmentPage: React.FC = () => {
  const { hasPermission } = useUser();
  const [customers, setCustomers] = useState<MaintenanceCustomer[]>(mockCustomers);

  // Check if user has permission to access asset registry
  if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'read')) {
    return (
      <Container size="xl" py="xl">
        <Alert 
          icon={<IconLock size="1rem" />} 
          title="Access Restricted" 
          color="yellow"
          variant="light"
        >
          <Text size="sm">
            You don't have permission to access customer and equipment management. 
            Please contact your administrator to request access.
          </Text>
        </Alert>
      </Container>
    );
  }

  const handleSaveCustomer = (customer: MaintenanceCustomer) => {
    // Check if user has permission to write customers
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save customer information.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => {
      const existingIndex = prev.findIndex(c => c.id === customer.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = customer;
        return updated;
      } else {
        return [...prev, customer];
      }
    });

    notifications.show({
      title: 'Customer Saved',
      message: `Customer "${customer.name}" has been saved successfully.`,
      color: 'green',
    });
  };

  const handleSaveEquipment = (equipment: EquipmentAsset) => {
    // Check if user has permission to write equipment
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save equipment information.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => {
      return prev.map(customer => {
        if (customer.id === equipment.customerId) {
          const existingIndex = customer.equipment?.findIndex(e => e.id === equipment.id);
          const updatedEquipment = [...(customer.equipment || [])];
          
          if (existingIndex >= 0) {
            updatedEquipment[existingIndex] = equipment;
          } else {
            updatedEquipment.push(equipment);
          }
          
          return { ...customer, equipment: updatedEquipment };
        }
        return customer;
      });
    });

    notifications.show({
      title: 'Equipment Saved',
      message: `Equipment "${equipment.assetNumber}" has been saved successfully.`,
      color: 'green',
    });
  };

  const handleSaveLocation = (location: EquipmentLocation) => {
    // Check if user has permission to write locations
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save location information.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => {
      return prev.map(customer => {
        const existingIndex = customer.locations?.findIndex(l => l.id === location.id);
        const updatedLocations = [...(customer.locations || [])];
        
        if (existingIndex >= 0) {
          updatedLocations[existingIndex] = location;
        } else {
          updatedLocations.push(location);
        }
        
        return { ...customer, locations: updatedLocations };
      });
    });

    notifications.show({
      title: 'Location Saved',
      message: `Location "${location.name}" has been saved successfully.`,
      color: 'green',
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    // Check if user has permission to delete customers
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'delete')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to delete customers.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => prev.filter(c => c.id !== customerId));
    
    notifications.show({
      title: 'Customer Deleted',
      message: 'Customer has been deleted successfully.',
      color: 'red',
    });
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    // Check if user has permission to delete equipment
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'delete')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to delete equipment.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => {
      return prev.map(customer => ({
        ...customer,
        equipment: customer.equipment?.filter(e => e.id !== equipmentId) || []
      }));
    });

    notifications.show({
      title: 'Equipment Deleted',
      message: 'Equipment has been deleted successfully.',
      color: 'red',
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    // Check if user has permission to delete locations
    if (!hasPermission('equipment-maintenance-service', 'asset-registry', 'delete')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to delete locations.',
        color: 'red',
      });
      return;
    }

    setCustomers(prev => {
      return prev.map(customer => ({
        ...customer,
        locations: customer.locations?.filter(l => l.id !== locationId) || []
      }));
    });

    notifications.show({
      title: 'Location Deleted',
      message: 'Location has been deleted successfully.',
      color: 'red',
    });
  };

  return (
    <CustomerEquipmentManager
      customers={customers}
      onSaveCustomer={handleSaveCustomer}
      onSaveEquipment={handleSaveEquipment}
      onSaveLocation={handleSaveLocation}
      onDeleteCustomer={handleDeleteCustomer}
      onDeleteEquipment={handleDeleteEquipment}
      onDeleteLocation={handleDeleteLocation}
      canEdit={hasPermission('equipment-maintenance-service', 'asset-registry', 'write')}
      canDelete={hasPermission('equipment-maintenance-service', 'asset-registry', 'delete')}
    />
  );
};

export default CustomerEquipmentPage; 