# Maintenance Module - EasyCode POS System

## Overview

The Maintenance Module is a comprehensive equipment maintenance management system designed for companies that maintain various types of equipment for their customers. This module supports generators, air conditioners, fire equipment, HVAC systems, UPS systems, and more.

## Key Features

### 1. Customer & Equipment Management
- **Customer Profiles**: Manage customer information, contracts, and billing details
- **Equipment Registry**: Track equipment assets with detailed specifications
- **Location Management**: Manage multiple customer locations and site information
- **Contract Tracking**: Monitor maintenance contracts, billing frequency, and rates

### 2. Maintenance Scheduling
- **Calendar View**: Visual monthly calendar showing scheduled maintenance
- **Work Order Management**: Create, track, and manage maintenance work orders
- **Technician Allocation**: Assign technicians based on skills and availability
- **Progress Tracking**: Monitor work order status and completion

### 3. Equipment Checklists
- **Generator Maintenance**: Comprehensive checklist for generator inspection and maintenance
- **Air Conditioner Maintenance**: AC-specific maintenance procedures
- **Fire Equipment**: Fire safety equipment inspection and testing
- **Customizable Templates**: Configurable checklists for different equipment types

### 4. Technician Management
- **Skill Profiles**: Track technician specializations and certifications
- **Availability Management**: Monitor technician schedules and working hours
- **Performance Metrics**: Track technician efficiency and work completion rates

## File Structure

```
apps/main-ui/
├── pages/maintenance/
│   ├── index.tsx                    # Main dashboard
│   ├── generator-checklist.tsx      # Generator maintenance checklist
│   ├── generator-checklist-demo.tsx # Demo with sample data
│   ├── customer-equipment.tsx       # Customer & equipment management
│   └── scheduler.tsx                # Maintenance scheduling
├── src/
│   ├── components/maintenance/
│   │   ├── GeneratorMaintenanceChecklist.tsx  # Generator checklist component
│   │   ├── CustomerEquipmentManager.tsx       # Customer management component
│   │   └── MaintenanceScheduler.tsx           # Scheduling component
│   ├── types/
│   │   └── maintenance.ts           # TypeScript type definitions
│   └── utils/
│       └── maintenanceMockData.ts   # Mock data for testing
```

## Type Definitions

### Core Types

```typescript
// Equipment Types
type EquipmentType = 
  | 'GENERATOR'
  | 'AIR_CONDITIONER'
  | 'FIRE_EQUIPMENT'
  | 'HVAC_SYSTEM'
  | 'ELECTRICAL_PANEL'
  | 'UPS_SYSTEM'
  | 'SOLAR_SYSTEM'
  | 'PUMP'
  | 'MOTOR'
  | 'COMPRESSOR'
  | 'CHILLER'
  | 'BOILER';

// Customer Management
interface MaintenanceCustomer extends Account {
  maintenanceContract?: {
    contractNumber: string;
    startDate: string;
    endDate: string;
    contractType: 'PREVENTIVE' | 'CORRECTIVE' | 'COMPREHENSIVE';
    billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    monthlyRate?: number;
    equipmentCount: number;
  };
  locations: EquipmentLocation[];
  equipment: EquipmentAsset[];
  maintenanceHistory: MaintenanceWorkOrder[];
}

// Equipment Assets
interface EquipmentAsset {
  id: string;
  assetNumber: string;
  equipmentType: EquipmentType;
  model: string;
  serialNumber: string;
  manufacturer: string;
  locationId: string;
  location: EquipmentLocation;
  customerId: string;
  customer: Account;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'RETIRED' | 'OUT_OF_SERVICE';
  specifications?: EquipmentSpecifications;
}

// Work Orders
interface MaintenanceWorkOrder {
  id: string;
  workOrderNumber: string;
  equipmentId: string;
  equipment: EquipmentAsset;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
  assignedTechnicianIds: string[];
  assignedTechnicians: Technician[];
  scheduledDate: string;
  estimatedDuration: number;
  description: string;
}
```

## Usage Instructions

### 1. Accessing the Maintenance Module

Navigate to `/maintenance` in your application to access the main dashboard.

### 2. Customer & Equipment Management

1. **Add Customers**: Click "Add Customer" to create new customer profiles
2. **Manage Equipment**: Add equipment assets linked to customers and locations
3. **Location Management**: Create and manage customer locations with contact information
4. **Contract Tracking**: Set up maintenance contracts with billing details

### 3. Maintenance Scheduling

1. **Calendar View**: Use the monthly calendar to view scheduled maintenance
2. **Create Work Orders**: Generate work orders for specific equipment
3. **Assign Technicians**: Allocate technicians based on skills and availability
4. **Track Progress**: Monitor work order status and completion

### 4. Equipment Checklists

1. **Generator Maintenance**: Use the comprehensive generator checklist
2. **Multi-step Forms**: Complete checklists step-by-step with validation
3. **Digital Signatures**: Capture technician and customer signatures
4. **Save & Print**: Save completed checklists and generate printable reports

## Technical Implementation

### Component Architecture

The module follows a modular component architecture:

- **Dashboard**: Main entry point with navigation to all features
- **CustomerEquipmentManager**: Manages customers, equipment, and locations
- **MaintenanceScheduler**: Handles work order scheduling and technician allocation
- **GeneratorMaintenanceChecklist**: Equipment-specific maintenance forms

### State Management

- Uses React hooks for local state management
- Mock data for demonstration purposes
- Ready for backend integration with API calls

### Form Handling

- Comprehensive form validation
- Multi-step form navigation
- Real-time data updates
- Error handling and user feedback

## Integration Points

### CRM Integration
- Customer data from CRM accounts
- Contact information synchronization
- Account hierarchy support

### Inventory Integration
- Parts and materials tracking
- Stock level monitoring
- Cost calculation

### Finance Integration
- Work order costing
- Contract billing
- Revenue tracking

### Notification System
- Maintenance reminders
- Work order notifications
- Technician assignments

## Future Enhancements

### Planned Features
1. **Mobile App**: Field technician mobile application
2. **GPS Tracking**: Real-time technician location tracking
3. **Photo Documentation**: Equipment condition photos
4. **QR Code Integration**: Equipment identification via QR codes
5. **Predictive Maintenance**: AI-powered maintenance scheduling
6. **Reporting Dashboard**: Advanced analytics and reporting

### Equipment Types
- Additional equipment type support
- Custom equipment specifications
- Equipment lifecycle management

### Advanced Scheduling
- Route optimization for technicians
- Weather-based scheduling
- Emergency response coordination

## Running the Module

### Prerequisites
- Node.js and npm/pnpm installed
- Next.js application running
- Mantine UI library configured

### Installation
```bash
# Navigate to the main-ui directory
cd apps/main-ui

# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

### Access URLs
- **Main Dashboard**: `http://localhost:3000/maintenance`
- **Generator Checklist**: `http://localhost:3000/maintenance/generator-checklist`
- **Customer Management**: `http://localhost:3000/maintenance/customer-equipment`
- **Maintenance Scheduler**: `http://localhost:3000/maintenance/scheduler`
- **Demo Pages**: `http://localhost:3000/maintenance/generator-checklist-demo`

## Design System Compliance

The module adheres to the EasyCode design system:

- **Consistent UI Components**: Uses predefined Mantine components
- **Color Scheme**: Follows the established color palette
- **Typography**: Consistent font usage and sizing
- **Spacing**: Standardized spacing and layout
- **Icons**: Tabler icons for consistency

## Testing

### Mock Data
The module includes comprehensive mock data for testing:
- Sample customers (KCB Bank, Safaricom PLC)
- Equipment assets (generators, AC units, UPS systems)
- Technician profiles with specializations
- Work orders in various states

### Demo Mode
Use the demo pages to see the module in action with pre-filled data.

## Support and Documentation

For technical support or questions about the maintenance module:
- Check the component documentation
- Review the type definitions
- Test with the provided mock data
- Refer to the design system guidelines

---

**Note**: This module is designed for integration with the EasyCode POS system and follows the established patterns and conventions of the broader application. 