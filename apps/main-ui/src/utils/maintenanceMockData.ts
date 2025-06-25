import { GeneratorMaintenanceChecklist } from '../types/maintenance';

export const sampleGeneratorChecklist: GeneratorMaintenanceChecklist = {
  // Worksheet Details
  worksheetNo: '60336',
  clientName: 'KCB',
  generatorLocation: 'MUMIAS',
  contactPerson: 'Peter Mwasalika',
  phoneNo: '+254 700 000 000',
  email: 'peter.mwasalika@kcb.co.ke',
  inspectionDate: '2024-03-14',

  // Equipment Data
  generatorModel: 'FH44',
  generatorSerialNo: 'T144 K06C0204',
  engineType: 'MITSUBISHI',
  engineSerialNo: 'MIT-2024-001',
  panelType: 'DEYLS',
  alternatorType: 'STAMFORD',
  alternatorSerialNo: 'ALT-2024-001',
  kvaRating: '44KVA',
  frequency: '50 HZ',
  outputVoltage: '415V',
  runningHours: '4132 HRS',
  lastServiceDate: '2023-06-14',
  nextServiceDate: '2024-06-14',

  // Loading Data
  line1Current: 5,
  line1Voltage: 234,
  line1RealPower: 1.3,
  line1ApparentPower: 1.1,
  line2Current: 10,
  line2Voltage: 237,
  line2RealPower: 2.9,
  line2ApparentPower: 2.3,
  line3Current: 15,
  line3Voltage: 234,
  line3RealPower: 4.3,
  line3ApparentPower: 3.5,
  neutralCurrent: 0,
  neutralVoltage: 0,
  neutralRealPower: 0,
  neutralApparentPower: 0,
  earthReading: 0,

  // Visual/Mechanical Inspection
  canopy: 'GOOD',
  injectorPump: 'WORKING',
  fuelSolenoid: 'WORKING',
  electronicMechanicalLiftPump: 'GOOD',
  fuelFilterHolder: 'GOOD',
  fuelGauge: 'WORKING',
  fuelTank: 'GOOD',
  fuelRelay: 'GOOD',
  inletOutletFuelPipes: 'GOOD',
  injectorNozzles: 'WORKING',
  crankingRelay: 'WORKING',
  exhaustPipeExtension: 'NEEDS_EXHAUST_BEND',
  exhaustFume: 'OIL',
  airFilterHolder: 'OK',
  turbo: 'GOOD_WORKING',
  radiator: 'NEEDS_REPAIR_DECLOGGING',
  radiatorPipes: 'GOOD',
  waterPump: 'WORKING_OIL',

  // Additional Comments
  generalComments: 'THE GENERATOR RADIATOR NEEDS REPAIR AND SERVICE. THE GENERATOR TOP COVER GASKET IS LEAKING OIL NEED REPLACING. THE EXHAUST EXTENSION HAS A RIGHT ANGLE BEND WHILE CREATES BACK PRESSURE WHEN ENGINE RUNNING NEEDS A CIRCULAR BEND. TESTED BY SWITCHING OFF THE MAINS AND STARTED AND WORKED WELL ON LOAD.',

  // Signatures & Dates
  engineerTechnicianName: 'Fred',
  engineerTechnicianSignature: 'B. Ki.',
  clientRepresentativeName: 'Peter Mwasalika',
  clientRepresentativeSignature: 'P.M.',
  forBankClient: 'KCB BANK KENYA LTD',
  stampDate: '14.3.07',
  signatureStamp: 'Munira Solomon MUMIAS',
  inspectionDateStamp: 'Mar 2025',

  // Company Information
  companyName: 'STEMA ENGINEERING LTD.',
  mainOfficeAddress: 'Lusaka Close off Lusaka Road',
  branchOfficeAddress: 'Dunga Close off Dunga Road, Industrial Area',
  poBox: '89-00200 Nairobi, Kenya',
  telephone1: '+254 707 122 123',
  telephone2: '+254 708 122 122',
  website: 'www.stemaengineering.com',

  // Dealer Information
  dealerIn: 'Generators, Voltage Stabilizers, UPS, Inverters, Solar Systems, Batteries, Air Conditioners, Led Lighting.',
  brands: 'FG Wilson, Perkins ABS, APC, Schneider Electric, Eaton, Liebert, MGE, Legrand, Hyundai'
};

export const generateMockChecklist = (): Partial<GeneratorMaintenanceChecklist> => {
  return {
    worksheetNo: `WO-${Math.floor(Math.random() * 100000)}`,
    clientName: '',
    generatorLocation: '',
    contactPerson: '',
    phoneNo: '',
    email: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    generatorModel: '',
    generatorSerialNo: '',
    engineType: '',
    engineSerialNo: '',
    panelType: '',
    alternatorType: '',
    alternatorSerialNo: '',
    kvaRating: '',
    frequency: '50 HZ',
    outputVoltage: '415V',
    runningHours: '',
    lastServiceDate: '',
    nextServiceDate: '',
    engineerTechnicianName: '',
    clientRepresentativeName: '',
    forBankClient: '',
    generalComments: ''
  };
}; 