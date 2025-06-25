import React, { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Container, Alert, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import MaintenanceScheduler from '../../src/components/maintenance/MaintenanceScheduler';
import { 
  MaintenanceWorkOrder, 
  Technician, 
  MaintenanceCustomer 
} from '../../src/types/maintenance';
import { useUser } from '../../src/providers/UserProvider';

// Mock data for demonstration
const mockTechnicians: Technician[] = [
  {
    id: 'tech-1',
    userId: 'user-1',
    employeeNumber: 'TECH001',
    name: 'John Kamau',
    email: 'john.kamau@stemaengineering.com',
    phone: '+254 700 123 456',
    specialization: ['GENERATOR', 'AIR_CONDITIONER', 'HVAC_SYSTEM'],
    certifications: ['HVAC Technician', 'Generator Maintenance'],
    experience: 5,
    status: 'ACTIVE',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    createdAt: '2020-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'tech-2',
    userId: 'user-2',
    employeeNumber: 'TECH002',
    name: 'Sarah Muthoni',
    email: 'sarah.muthoni@stemaengineering.com',
    phone: '+254 700 789 012',
    specialization: ['FIRE_EQUIPMENT', 'ELECTRICAL_PANEL', 'UPS_SYSTEM'],
    certifications: ['Fire Safety Technician', 'Electrical Engineer'],
    experience: 3,
    status: 'ACTIVE',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    workingHours: {
      start: '07:00',
      end: '16:00'
    },
    createdAt: '2021-03-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'tech-3',
    userId: 'user-3',
    employeeNumber: 'TECH003',
    name: 'David Ochieng',
    email: 'david.ochieng@stemaengineering.com',
    phone: '+254 700 345 678',
    specialization: ['GENERATOR', 'PUMP', 'MOTOR'],
    certifications: ['Mechanical Engineer', 'Generator Specialist'],
    experience: 7,
    status: 'ACTIVE',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    createdAt: '2019-06-01',
    updatedAt: '2024-01-01'
  }
];

const mockWorkOrders: MaintenanceWorkOrder[] = [
  {
    id: 'wo-1',
    workOrderNumber: 'WO-2024-001',
    equipmentId: 'eq-1',
    equipment: {
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
      customer: {
        id: '1',
        name: 'KCB Bank Kenya',
        industry: 'Banking',
        status: 'ACTIVE',
        createdAt: '2020-01-01',
        updatedAt: '2024-01-01'
      },
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
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTechnicianIds: ['tech-1'],
    assignedTechnicians: [mockTechnicians[0]],
    scheduledDate: '2024-03-15',
    estimatedDuration: 4,
    actualDuration: 3.5,
    actualStartTime: '2024-03-15T08:00:00Z',
    actualEndTime: '2024-03-15T11:30:00Z',
    description: 'Routine preventive maintenance including oil change, filter replacement, and performance testing.',
    totalCost: 25000,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15'
  },
  {
    id: 'wo-2',
    workOrderNumber: 'WO-2024-002',
    equipmentId: 'eq-2',
    equipment: {
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
      customer: {
        id: '1',
        name: 'KCB Bank Kenya',
        industry: 'Banking',
        status: 'ACTIVE',
        createdAt: '2020-01-01',
        updatedAt: '2024-01-01'
      },
      custodian: 'IT Manager',
      status: 'ACTIVE',
      specifications: {
        coolingCapacity: '24000 BTU',
        refrigerantType: 'R410A'
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedTechnicianIds: ['tech-1'],
    assignedTechnicians: [mockTechnicians[0]],
    scheduledDate: '2024-03-20',
    estimatedDuration: 2,
    description: 'Filter cleaning and performance check.',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  },
  {
    id: 'wo-3',
    workOrderNumber: 'WO-2024-003',
    equipmentId: 'eq-3',
    equipment: {
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
      customer: {
        id: '2',
        name: 'Safaricom PLC',
        industry: 'Telecommunications',
        status: 'ACTIVE',
        createdAt: '2019-01-01',
        updatedAt: '2024-01-01'
      },
      custodian: 'Data Center Manager',
      status: 'ACTIVE',
      specifications: {
        capacity: '5000VA',
        voltage: '230V'
      },
      createdAt: '2024-02-01',
      updatedAt: '2024-02-15'
    },
    priority: 'CRITICAL',
    status: 'OPEN',
    assignedTechnicianIds: ['tech-2'],
    assignedTechnicians: [mockTechnicians[1]],
    scheduledDate: '2024-03-18',
    estimatedDuration: 3,
    description: 'Emergency UPS system maintenance due to battery failure.',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  }
];

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
    createdAt: '2020-01-01',
    updatedAt: '2024-01-01',
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
    createdAt: '2019-01-01',
    updatedAt: '2024-01-01',
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

const MaintenanceSchedulerPage: React.FC = () => {
  const { hasPermission } = useUser();
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(mockWorkOrders);
  const [technicians] = useState<Technician[]>(mockTechnicians);
  const [customers] = useState<MaintenanceCustomer[]>(mockCustomers);

  // Check if user has permission to access scheduling
  if (!hasPermission('equipment-maintenance-service', 'schedule', 'read')) {
    return (
      <Container size="xl" py="xl">
        <Alert 
          icon={<IconLock size="1rem" />} 
          title="Access Restricted" 
          color="yellow"
          variant="light"
        >
          <Text size="sm">
            You don't have permission to access the maintenance scheduler. 
            Please contact your administrator to request access.
          </Text>
        </Alert>
      </Container>
    );
  }

  const handleSaveWorkOrder = (workOrder: MaintenanceWorkOrder) => {
    // Check if user has permission to write work orders
    if (!hasPermission('equipment-maintenance-service', 'work-orders', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to save work orders.',
        color: 'red',
      });
      return;
    }

    setWorkOrders(prev => {
      const existingIndex = prev.findIndex(wo => wo.id === workOrder.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = workOrder;
        return updated;
      } else {
        return [...prev, workOrder];
      }
    });

    notifications.show({
      title: 'Work Order Saved',
      message: `Work order "${workOrder.workOrderNumber}" has been saved successfully.`,
      color: 'green',
    });
  };

  const handleDeleteWorkOrder = (workOrderId: string) => {
    // Check if user has permission to delete work orders
    if (!hasPermission('equipment-maintenance-service', 'work-orders', 'delete')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to delete work orders.',
        color: 'red',
      });
      return;
    }

    setWorkOrders(prev => prev.filter(wo => wo.id !== workOrderId));
    
    notifications.show({
      title: 'Work Order Deleted',
      message: 'Work order has been deleted successfully.',
      color: 'red',
    });
  };

  const handleAssignTechnician = (workOrderId: string, technicianId: string) => {
    // Check if user has permission to write work orders
    if (!hasPermission('equipment-maintenance-service', 'work-orders', 'write')) {
      notifications.show({
        title: 'Permission Denied',
        message: 'You don\'t have permission to assign technicians.',
        color: 'red',
      });
      return;
    }

    setWorkOrders(prev => {
      return prev.map(wo => {
        if (wo.id === workOrderId) {
          const technician = technicians.find(t => t.id === technicianId);
          return {
            ...wo,
            assignedTechnicianIds: [technicianId],
            assignedTechnicians: technician ? [technician] : []
          };
        }
        return wo;
      });
    });

    notifications.show({
      title: 'Technician Assigned',
      message: 'Technician has been assigned to the work order successfully.',
      color: 'blue',
    });
  };

  return (
    <MaintenanceScheduler
      workOrders={workOrders}
      technicians={technicians}
      customers={customers}
      onSaveWorkOrder={handleSaveWorkOrder}
      onDeleteWorkOrder={handleDeleteWorkOrder}
      onAssignTechnician={handleAssignTechnician}
      canEdit={hasPermission('equipment-maintenance-service', 'work-orders', 'write')}
      canDelete={hasPermission('equipment-maintenance-service', 'work-orders', 'delete')}
      canSchedule={hasPermission('equipment-maintenance-service', 'schedule', 'write')}
    />
  );
};

export default MaintenanceSchedulerPage; 