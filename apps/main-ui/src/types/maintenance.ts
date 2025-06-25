import { Account, Contact } from './crm';

export interface GeneratorMaintenanceChecklist {
  // Worksheet Details
  worksheetNo: string;
  clientName: string;
  generatorLocation: string;
  contactPerson: string;
  phoneNo: string;
  email: string;
  inspectionDate: string;

  // Equipment Data
  generatorModel: string;
  generatorSerialNo: string;
  engineType: string;
  engineSerialNo: string;
  panelType: string;
  alternatorType: string;
  alternatorSerialNo: string;
  kvaRating: string;
  frequency: string;
  outputVoltage: string;
  runningHours: string;
  lastServiceDate: string;
  nextServiceDate: string;

  // Loading Data
  line1Current: number;
  line1Voltage: number;
  line1RealPower: number;
  line1ApparentPower: number;
  line2Current: number;
  line2Voltage: number;
  line2RealPower: number;
  line2ApparentPower: number;
  line3Current: number;
  line3Voltage: number;
  line3RealPower: number;
  line3ApparentPower: number;
  neutralCurrent: number;
  neutralVoltage: number;
  neutralRealPower: number;
  neutralApparentPower: number;
  earthReading: number;

  // Visual/Mechanical Inspection
  canopy: 'GOOD' | 'NEEDS_REPAIR' | 'POOR';
  injectorPump: 'WORKING' | 'NOT_WORKING' | 'NEEDS_ATTENTION';
  fuelSolenoid: 'WORKING' | 'NOT_WORKING' | 'NEEDS_ATTENTION';
  electronicMechanicalLiftPump: 'GOOD' | 'NEEDS_REPAIR' | 'POOR';
  fuelFilterHolder: 'GOOD' | 'NEEDS_REPLACEMENT' | 'POOR';
  fuelGauge: 'WORKING' | 'NOT_WORKING' | 'NEEDS_ATTENTION';
  fuelTank: 'GOOD' | 'NEEDS_REPAIR' | 'POOR';
  fuelRelay: 'GOOD' | 'NEEDS_REPLACEMENT' | 'POOR';
  inletOutletFuelPipes: 'GOOD' | 'NEEDS_REPAIR' | 'POOR';
  injectorNozzles: 'WORKING' | 'NOT_WORKING' | 'NEEDS_ATTENTION';
  crankingRelay: 'WORKING' | 'NOT_WORKING' | 'NEEDS_ATTENTION';
  exhaustPipeExtension: 'GOOD' | 'NEEDS_EXHAUST_BEND' | 'NEEDS_REPAIR';
  exhaustFume: 'CLEAN' | 'OIL' | 'SMOKE';
  airFilterHolder: 'OK' | 'NEEDS_REPLACEMENT' | 'POOR';
  turbo: 'GOOD_WORKING' | 'NEEDS_ATTENTION' | 'NOT_APPLICABLE';
  radiator: 'GOOD' | 'NEEDS_REPAIR_DECLOGGING' | 'POOR';
  radiatorPipes: 'GOOD' | 'NEEDS_REPAIR' | 'POOR';
  waterPump: 'WORKING' | 'WORKING_OIL' | 'NOT_WORKING';

  // Additional Comments
  generalComments: string;

  // Signatures & Dates
  engineerTechnicianName: string;
  engineerTechnicianSignature: string;
  clientRepresentativeName: string;
  clientRepresentativeSignature: string;
  forBankClient: string;
  stampDate: string;
  signatureStamp: string;
  inspectionDateStamp: string;

  // Company Information
  companyName: string;
  mainOfficeAddress: string;
  branchOfficeAddress: string;
  poBox: string;
  telephone1: string;
  telephone2: string;
  email: string;
  website: string;

  // Dealer Information
  dealerIn: string;
  brands: string;
}

// Enhanced Equipment Management Types
export interface EquipmentLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface EquipmentAsset {
  id: string;
  assetNumber: string;
  equipmentType: EquipmentType;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  installationDate: string;
  warrantyExpiryDate?: string;
  locationId: string;
  location: EquipmentLocation;
  customerId: string;
  customer: Account;
  custodian: string;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'RETIRED' | 'OUT_OF_SERVICE';
  lastServiceDate?: string;
  nextServiceDate?: string;
  runningHours?: number;
  parentAssetId?: string; // for hierarchical structure
  qrCode?: string;
  barcode?: string;
  customAttributes?: Record<string, any>;
  
  // Equipment-specific attributes
  specifications?: EquipmentSpecifications;
  maintenanceSchedule?: MaintenanceSchedule;
  createdAt: string;
  updatedAt: string;
}

export type EquipmentType = 
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

export interface EquipmentSpecifications {
  // Common specifications
  capacity?: string;
  powerRating?: string;
  voltage?: string;
  frequency?: string;
  phase?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'm' | 'ft' | 'in';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  
  // Generator-specific
  kvaRating?: string;
  engineType?: string;
  fuelType?: string;
  fuelCapacity?: string;
  
  // AC-specific
  coolingCapacity?: string;
  heatingCapacity?: string;
  refrigerantType?: string;
  airFlow?: string;
  
  // Fire Equipment-specific
  fireRating?: string;
  extinguishingAgent?: string;
  coverageArea?: string;
  
  // Custom specifications
  customFields?: Record<string, any>;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  scheduleType: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'CUSTOM';
  customFrequencyDays?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  lastScheduledDate?: string;
  nextScheduledDate: string;
  estimatedDuration: number; // in hours
  requiredTechnicians: number;
  checklistTemplateId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  workOrderNumber: string;
  equipmentId: string;
  equipment: EquipmentAsset;
  scheduleId?: string;
  schedule?: MaintenanceSchedule;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
  assignedTechnicianIds: string[];
  assignedTechnicians: Technician[];
  scheduledDate: string;
  estimatedDuration: number; // in hours
  actualDuration?: number; // in hours
  actualStartTime?: string;
  actualEndTime?: string;
  description: string;
  checklist?: MaintenanceChecklist;
  partsUsed?: MaintenancePart[];
  totalCost?: number;
  customerSignature?: string;
  technicianSignature?: string;
  photos?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  userId: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  specialization: EquipmentType[];
  certifications: string[];
  experience: number; // in years
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  id: string;
  workOrderId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  warranty?: string;
  notes?: string;
}

export interface MaintenanceChecklist {
  id: string;
  workOrderId: string;
  checklistType: EquipmentType;
  checklistData: GeneratorMaintenanceChecklist | AirConditionerChecklist | FireEquipmentChecklist;
  completedBy: string;
  completedAt: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Additional Equipment Checklists
export interface AirConditionerChecklist {
  // Basic Information
  worksheetNo: string;
  clientName: string;
  location: string;
  contactPerson: string;
  phoneNo: string;
  email: string;
  inspectionDate: string;
  
  // Equipment Data
  acModel: string;
  serialNumber: string;
  capacity: string;
  refrigerantType: string;
  installationDate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  
  // Performance Data
  ambientTemperature: number;
  returnAirTemperature: number;
  supplyAirTemperature: number;
  refrigerantPressure: {
    high: number;
    low: number;
  };
  airFlow: number;
  powerConsumption: number;
  
  // Inspection Points
  airFilter: 'CLEAN' | 'NEEDS_CLEANING' | 'NEEDS_REPLACEMENT';
  condenserCoil: 'CLEAN' | 'NEEDS_CLEANING' | 'DIRTY';
  evaporatorCoil: 'CLEAN' | 'NEEDS_CLEANING' | 'DIRTY';
  fanMotor: 'WORKING' | 'NEEDS_ATTENTION' | 'NOT_WORKING';
  compressor: 'WORKING' | 'NEEDS_ATTENTION' | 'NOT_WORKING';
  thermostat: 'WORKING' | 'NEEDS_CALIBRATION' | 'NOT_WORKING';
  electricalConnections: 'GOOD' | 'NEEDS_TIGHTENING' | 'LOOSE';
  refrigerantLeaks: 'NONE' | 'MINOR' | 'MAJOR';
  drainLine: 'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED';
  
  // Comments and Signatures
  generalComments: string;
  technicianName: string;
  technicianSignature: string;
  clientSignature: string;
}

export interface FireEquipmentChecklist {
  // Basic Information
  worksheetNo: string;
  clientName: string;
  location: string;
  contactPerson: string;
  phoneNo: string;
  email: string;
  inspectionDate: string;
  
  // Equipment Data
  equipmentType: 'FIRE_EXTINGUISHER' | 'FIRE_ALARM' | 'SPRINKLER_SYSTEM' | 'SMOKE_DETECTOR' | 'FIRE_HOSE';
  model: string;
  serialNumber: string;
  capacity: string;
  installationDate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  
  // Inspection Points
  physicalCondition: 'GOOD' | 'FAIR' | 'POOR';
  pressureGauge: 'NORMAL' | 'LOW' | 'HIGH' | 'NOT_APPLICABLE';
  safetySeal: 'INTACT' | 'BROKEN' | 'MISSING';
  dischargeNozzle: 'CLEAR' | 'BLOCKED' | 'DAMAGED';
  hoseCondition: 'GOOD' | 'CRACKED' | 'DAMAGED';
  mountingBracket: 'SECURE' | 'LOOSE' | 'DAMAGED';
  accessibility: 'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED';
  signage: 'VISIBLE' | 'FADED' | 'MISSING';
  
  // Functional Tests
  alarmTest: 'PASS' | 'FAIL' | 'NOT_TESTED';
  sprinklerTest: 'PASS' | 'FAIL' | 'NOT_TESTED';
  detectorTest: 'PASS' | 'FAIL' | 'NOT_TESTED';
  
  // Comments and Signatures
  generalComments: string;
  technicianName: string;
  technicianSignature: string;
  clientSignature: string;
}

// Customer Management
export interface MaintenanceCustomer extends Account {
  maintenanceContract?: {
    contractNumber: string;
    startDate: string;
    endDate: string;
    contractType: 'PREVENTIVE' | 'CORRECTIVE' | 'COMPREHENSIVE';
    billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    monthlyRate?: number;
    equipmentCount: number;
  };
  primaryContact?: Contact;
  billingContact?: Contact;
  locations: EquipmentLocation[];
  equipment: EquipmentAsset[];
  maintenanceHistory: MaintenanceWorkOrder[];
}

// Scheduling and Planning
export interface MaintenanceSchedule {
  id: string;
  month: string; // YYYY-MM format
  technicianId: string;
  technician: Technician;
  workOrders: MaintenanceWorkOrder[];
  totalScheduledHours: number;
  totalCompletedHours: number;
  efficiency: number; // percentage
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceCalendar {
  id: string;
  month: string; // YYYY-MM format
  schedules: MaintenanceSchedule[];
  totalWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  createdAt: string;
  updatedAt: string;
} 