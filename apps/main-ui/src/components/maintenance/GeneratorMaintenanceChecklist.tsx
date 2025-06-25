import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Divider,
  Grid,
  Card,
  Badge,
  Alert,
  Stepper,
  Box
} from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconPrinter } from '@tabler/icons-react';
import { GeneratorMaintenanceChecklist as ChecklistType } from '../../types/maintenance';

interface GeneratorMaintenanceChecklistProps {
  initialData?: Partial<ChecklistType>;
  onSave?: (data: ChecklistType) => void;
  onPrint?: (data: ChecklistType) => void;
  isReadOnly?: boolean;
}

const GeneratorMaintenanceChecklist: React.FC<GeneratorMaintenanceChecklistProps> = ({
  initialData,
  onSave,
  onPrint,
  isReadOnly = false
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ChecklistType>({
    // Worksheet Details
    worksheetNo: initialData?.worksheetNo || '',
    clientName: initialData?.clientName || '',
    generatorLocation: initialData?.generatorLocation || '',
    contactPerson: initialData?.contactPerson || '',
    phoneNo: initialData?.phoneNo || '',
    email: initialData?.email || 'info@stemaengineering.com',
    inspectionDate: initialData?.inspectionDate || new Date().toISOString().split('T')[0],

    // Equipment Data
    generatorModel: initialData?.generatorModel || '',
    generatorSerialNo: initialData?.generatorSerialNo || '',
    engineType: initialData?.engineType || '',
    engineSerialNo: initialData?.engineSerialNo || '',
    panelType: initialData?.panelType || '',
    alternatorType: initialData?.alternatorType || '',
    alternatorSerialNo: initialData?.alternatorSerialNo || '',
    kvaRating: initialData?.kvaRating || '',
    frequency: initialData?.frequency || '',
    outputVoltage: initialData?.outputVoltage || '',
    runningHours: initialData?.runningHours || '',
    lastServiceDate: initialData?.lastServiceDate || '',
    nextServiceDate: initialData?.nextServiceDate || '',

    // Loading Data
    line1Current: initialData?.line1Current || 0,
    line1Voltage: initialData?.line1Voltage || 0,
    line1RealPower: initialData?.line1RealPower || 0,
    line1ApparentPower: initialData?.line1ApparentPower || 0,
    line2Current: initialData?.line2Current || 0,
    line2Voltage: initialData?.line2Voltage || 0,
    line2RealPower: initialData?.line2RealPower || 0,
    line2ApparentPower: initialData?.line2ApparentPower || 0,
    line3Current: initialData?.line3Current || 0,
    line3Voltage: initialData?.line3Voltage || 0,
    line3RealPower: initialData?.line3RealPower || 0,
    line3ApparentPower: initialData?.line3ApparentPower || 0,
    neutralCurrent: initialData?.neutralCurrent || 0,
    neutralVoltage: initialData?.neutralVoltage || 0,
    neutralRealPower: initialData?.neutralRealPower || 0,
    neutralApparentPower: initialData?.neutralApparentPower || 0,
    earthReading: initialData?.earthReading || 0,

    // Visual/Mechanical Inspection
    canopy: initialData?.canopy || 'GOOD',
    injectorPump: initialData?.injectorPump || 'WORKING',
    fuelSolenoid: initialData?.fuelSolenoid || 'WORKING',
    electronicMechanicalLiftPump: initialData?.electronicMechanicalLiftPump || 'GOOD',
    fuelFilterHolder: initialData?.fuelFilterHolder || 'GOOD',
    fuelGauge: initialData?.fuelGauge || 'WORKING',
    fuelTank: initialData?.fuelTank || 'GOOD',
    fuelRelay: initialData?.fuelRelay || 'GOOD',
    inletOutletFuelPipes: initialData?.inletOutletFuelPipes || 'GOOD',
    injectorNozzles: initialData?.injectorNozzles || 'WORKING',
    crankingRelay: initialData?.crankingRelay || 'WORKING',
    exhaustPipeExtension: initialData?.exhaustPipeExtension || 'GOOD',
    exhaustFume: initialData?.exhaustFume || 'CLEAN',
    airFilterHolder: initialData?.airFilterHolder || 'OK',
    turbo: initialData?.turbo || 'GOOD_WORKING',
    radiator: initialData?.radiator || 'GOOD',
    radiatorPipes: initialData?.radiatorPipes || 'GOOD',
    waterPump: initialData?.waterPump || 'WORKING',

    // Additional Comments
    generalComments: initialData?.generalComments || '',

    // Signatures & Dates
    engineerTechnicianName: initialData?.engineerTechnicianName || '',
    engineerTechnicianSignature: initialData?.engineerTechnicianSignature || '',
    clientRepresentativeName: initialData?.clientRepresentativeName || '',
    clientRepresentativeSignature: initialData?.clientRepresentativeSignature || '',
    forBankClient: initialData?.forBankClient || '',
    stampDate: initialData?.stampDate || '',
    signatureStamp: initialData?.signatureStamp || '',
    inspectionDateStamp: initialData?.inspectionDateStamp || '',

    // Company Information
    companyName: initialData?.companyName || 'STEMA ENGINEERING LTD.',
    mainOfficeAddress: initialData?.mainOfficeAddress || 'Lusaka Close off Lusaka Road',
    branchOfficeAddress: initialData?.branchOfficeAddress || 'Dunga Close off Dunga Road, Industrial Area',
    poBox: initialData?.poBox || '89-00200 Nairobi, Kenya',
    telephone1: initialData?.telephone1 || '+254 707 122 123',
    telephone2: initialData?.telephone2 || '+254 708 122 122',
    website: initialData?.website || 'www.stemaengineering.com',

    // Dealer Information
    dealerIn: initialData?.dealerIn || 'Generators, Voltage Stabilizers, UPS, Inverters, Solar Systems, Batteries, Air Conditioners, Led Lighting.',
    brands: initialData?.brands || 'FG Wilson, Perkins ABS, APC, Schneider Electric, Eaton, Liebert, MGE, Legrand, Hyundai'
  });

  const updateFormData = (field: keyof ChecklistType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (value: string) => {
    if (value.includes('GOOD') || value.includes('WORKING') || value.includes('OK')) return 'green';
    if (value.includes('NEEDS') || value.includes('ATTENTION')) return 'orange';
    if (value.includes('POOR') || value.includes('NOT_WORKING')) return 'red';
    return 'gray';
  };

  const steps = [
    { label: 'Worksheet Details', description: 'Basic information' },
    { label: 'Equipment Data', description: 'Generator specifications' },
    { label: 'Loading Data', description: 'Electrical readings' },
    { label: 'Visual Inspection', description: 'Mechanical assessment' },
    { label: 'Comments & Signatures', description: 'Final documentation' }
  ];

  const renderWorksheetDetails = () => (
    <Stack gap="md">
      <Title order={3}>Worksheet Details</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Worksheet No."
            value={formData.worksheetNo}
            onChange={(e) => updateFormData('worksheetNo', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Client Name"
            value={formData.clientName}
            onChange={(e) => updateFormData('clientName', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Generator Location"
            value={formData.generatorLocation}
            onChange={(e) => updateFormData('generatorLocation', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(e) => updateFormData('contactPerson', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Phone No."
            value={formData.phoneNo}
            onChange={(e) => updateFormData('phoneNo', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="E-mail"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Inspection Date"
            type="date"
            value={formData.inspectionDate}
            onChange={(e) => updateFormData('inspectionDate', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderEquipmentData = () => (
    <Stack gap="md">
      <Title order={3}>Equipment Data</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Generator Model"
            value={formData.generatorModel}
            onChange={(e) => updateFormData('generatorModel', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Generator Serial No."
            value={formData.generatorSerialNo}
            onChange={(e) => updateFormData('generatorSerialNo', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Engine Type"
            value={formData.engineType}
            onChange={(e) => updateFormData('engineType', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Engine Serial No."
            value={formData.engineSerialNo}
            onChange={(e) => updateFormData('engineSerialNo', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Panel Type"
            value={formData.panelType}
            onChange={(e) => updateFormData('panelType', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Alternator Type"
            value={formData.alternatorType}
            onChange={(e) => updateFormData('alternatorType', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Alternator Serial No."
            value={formData.alternatorSerialNo}
            onChange={(e) => updateFormData('alternatorSerialNo', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="KVA Rating"
            value={formData.kvaRating}
            onChange={(e) => updateFormData('kvaRating', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => updateFormData('frequency', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Output Voltage"
            value={formData.outputVoltage}
            onChange={(e) => updateFormData('outputVoltage', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Running Hours"
            value={formData.runningHours}
            onChange={(e) => updateFormData('runningHours', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Last Service Date"
            type="date"
            value={formData.lastServiceDate}
            onChange={(e) => updateFormData('lastServiceDate', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Next Service Date"
            type="date"
            value={formData.nextServiceDate}
            onChange={(e) => updateFormData('nextServiceDate', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderLoadingData = () => (
    <Stack gap="md">
      <Title order={3}>Loading Data</Title>
      <Grid>
        {[1, 2, 3].map((line) => (
          <React.Fragment key={line}>
            <Grid.Col span={12}>
              <Text fw={500} size="sm" c="dimmed">Line {line}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label={`Current Reading (A)`}
                value={formData[`line${line}Current` as keyof ChecklistType] as number}
                onChange={(value) => updateFormData(`line${line}Current` as keyof ChecklistType, value)}
                disabled={isReadOnly}
                min={0}
                decimalScale={1}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label={`Voltage Reading (V)`}
                value={formData[`line${line}Voltage` as keyof ChecklistType] as number}
                onChange={(value) => updateFormData(`line${line}Voltage` as keyof ChecklistType, value)}
                disabled={isReadOnly}
                min={0}
                decimalScale={1}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label={`Real Power (KW)`}
                value={formData[`line${line}RealPower` as keyof ChecklistType] as number}
                onChange={(value) => updateFormData(`line${line}RealPower` as keyof ChecklistType, value)}
                disabled={isReadOnly}
                min={0}
                decimalScale={1}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label={`Apparent Power (KVA)`}
                value={formData[`line${line}ApparentPower` as keyof ChecklistType] as number}
                onChange={(value) => updateFormData(`line${line}ApparentPower` as keyof ChecklistType, value)}
                disabled={isReadOnly}
                min={0}
                decimalScale={1}
              />
            </Grid.Col>
          </React.Fragment>
        ))}
        
        <Grid.Col span={12}>
          <Text fw={500} size="sm" c="dimmed">Neutral</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <NumberInput
            label="Neutral Current Reading (A)"
            value={formData.neutralCurrent}
            onChange={(value) => updateFormData('neutralCurrent', value)}
            disabled={isReadOnly}
            min={0}
            decimalScale={1}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <NumberInput
            label="Neutral Voltage Reading (V)"
            value={formData.neutralVoltage}
            onChange={(value) => updateFormData('neutralVoltage', value)}
            disabled={isReadOnly}
            min={0}
            decimalScale={1}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <NumberInput
            label="Neutral Real Power (KW)"
            value={formData.neutralRealPower}
            onChange={(value) => updateFormData('neutralRealPower', value)}
            disabled={isReadOnly}
            min={0}
            decimalScale={1}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <NumberInput
            label="Neutral Apparent Power (KVA)"
            value={formData.neutralApparentPower}
            onChange={(value) => updateFormData('neutralApparentPower', value)}
            disabled={isReadOnly}
            min={0}
            decimalScale={1}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Earth Reading (A)"
            value={formData.earthReading}
            onChange={(value) => updateFormData('earthReading', value)}
            disabled={isReadOnly}
            min={0}
            decimalScale={1}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderVisualInspection = () => (
    <Stack gap="md">
      <Title order={3}>Visual/Mechanical Inspection</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="CANOPY"
            value={formData.canopy}
            onChange={(value) => updateFormData('canopy', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.canopy)} size="sm">
                {formData.canopy}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="INJECTOR PUMP"
            value={formData.injectorPump}
            onChange={(value) => updateFormData('injectorPump', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.injectorPump)} size="sm">
                {formData.injectorPump}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="FUEL SOLENOID"
            value={formData.fuelSolenoid}
            onChange={(value) => updateFormData('fuelSolenoid', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.fuelSolenoid)} size="sm">
                {formData.fuelSolenoid}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="ELECTRONIC/MECHANICAL LIFT PUMP"
            value={formData.electronicMechanicalLiftPump}
            onChange={(value) => updateFormData('electronicMechanicalLiftPump', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.electronicMechanicalLiftPump)} size="sm">
                {formData.electronicMechanicalLiftPump}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="FUEL FILTER + HOLDER"
            value={formData.fuelFilterHolder}
            onChange={(value) => updateFormData('fuelFilterHolder', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPLACEMENT', label: 'NEEDS REPLACEMENT' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.fuelFilterHolder)} size="sm">
                {formData.fuelFilterHolder}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="FUEL GAUGE"
            value={formData.fuelGauge}
            onChange={(value) => updateFormData('fuelGauge', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.fuelGauge)} size="sm">
                {formData.fuelGauge}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="FUEL TANK"
            value={formData.fuelTank}
            onChange={(value) => updateFormData('fuelTank', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.fuelTank)} size="sm">
                {formData.fuelTank}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="FUEL RELAY"
            value={formData.fuelRelay}
            onChange={(value) => updateFormData('fuelRelay', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPLACEMENT', label: 'NEEDS REPLACEMENT' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.fuelRelay)} size="sm">
                {formData.fuelRelay}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="INLET/OUTLET FUEL PIPES"
            value={formData.inletOutletFuelPipes}
            onChange={(value) => updateFormData('inletOutletFuelPipes', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.inletOutletFuelPipes)} size="sm">
                {formData.inletOutletFuelPipes}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="INJECTOR NOZZLES"
            value={formData.injectorNozzles}
            onChange={(value) => updateFormData('injectorNozzles', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.injectorNozzles)} size="sm">
                {formData.injectorNozzles}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="CRANKING RELAY"
            value={formData.crankingRelay}
            onChange={(value) => updateFormData('crankingRelay', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.crankingRelay)} size="sm">
                {formData.crankingRelay}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="EXHAUST PIPE & EXTENSION"
            value={formData.exhaustPipeExtension}
            onChange={(value) => updateFormData('exhaustPipeExtension', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_EXHAUST_BEND', label: 'NEEDS EXHAUST BEND' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.exhaustPipeExtension)} size="sm">
                {formData.exhaustPipeExtension}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="EXHAUST FUME"
            value={formData.exhaustFume}
            onChange={(value) => updateFormData('exhaustFume', value)}
            data={[
              { value: 'CLEAN', label: 'CLEAN' },
              { value: 'OIL', label: 'OIL' },
              { value: 'SMOKE', label: 'SMOKE' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.exhaustFume)} size="sm">
                {formData.exhaustFume}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="AIR FILTER + HOLDER"
            value={formData.airFilterHolder}
            onChange={(value) => updateFormData('airFilterHolder', value)}
            data={[
              { value: 'OK', label: 'OK' },
              { value: 'NEEDS_REPLACEMENT', label: 'NEEDS REPLACEMENT' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.airFilterHolder)} size="sm">
                {formData.airFilterHolder}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="TURBO (WHERE NECESSARY)"
            value={formData.turbo}
            onChange={(value) => updateFormData('turbo', value)}
            data={[
              { value: 'GOOD_WORKING', label: 'GOOD WORKING' },
              { value: 'NEEDS_ATTENTION', label: 'NEEDS ATTENTION' },
              { value: 'NOT_APPLICABLE', label: 'NOT APPLICABLE' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.turbo)} size="sm">
                {formData.turbo}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="RADIATOR"
            value={formData.radiator}
            onChange={(value) => updateFormData('radiator', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR_DECLOGGING', label: 'NEEDS REPAIR/DECLOGGING' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.radiator)} size="sm">
                {formData.radiator}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="RADIATOR PIPES"
            value={formData.radiatorPipes}
            onChange={(value) => updateFormData('radiatorPipes', value)}
            data={[
              { value: 'GOOD', label: 'GOOD' },
              { value: 'NEEDS_REPAIR', label: 'NEEDS REPAIR' },
              { value: 'POOR', label: 'POOR' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.radiatorPipes)} size="sm">
                {formData.radiatorPipes}
              </Badge>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="WATER PUMP"
            value={formData.waterPump}
            onChange={(value) => updateFormData('waterPump', value)}
            data={[
              { value: 'WORKING', label: 'WORKING' },
              { value: 'WORKING_OIL', label: 'WORKING OIL' },
              { value: 'NOT_WORKING', label: 'NOT WORKING' }
            ]}
            disabled={isReadOnly}
            rightSection={
              <Badge color={getStatusColor(formData.waterPump)} size="sm">
                {formData.waterPump}
              </Badge>
            }
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderCommentsAndSignatures = () => (
    <Stack gap="md">
      <Title order={3}>Comments & Signatures</Title>
      
      <Textarea
        label="General Comments"
        value={formData.generalComments}
        onChange={(e) => updateFormData('generalComments', e.target.value)}
        disabled={isReadOnly}
        minRows={4}
        placeholder="Enter any additional comments, observations, or recommendations..."
      />

      <Divider label="Signatures & Dates" labelPosition="center" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Engineer/Technician Name"
            value={formData.engineerTechnicianName}
            onChange={(e) => updateFormData('engineerTechnicianName', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Engineer/Technician Signature"
            value={formData.engineerTechnicianSignature}
            onChange={(e) => updateFormData('engineerTechnicianSignature', e.target.value)}
            disabled={isReadOnly}
            placeholder="Digital signature or initials"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Client Representative Name"
            value={formData.clientRepresentativeName}
            onChange={(e) => updateFormData('clientRepresentativeName', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Client Representative Signature"
            value={formData.clientRepresentativeSignature}
            onChange={(e) => updateFormData('clientRepresentativeSignature', e.target.value)}
            disabled={isReadOnly}
            placeholder="Digital signature or initials"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="For (Bank/Client)"
            value={formData.forBankClient}
            onChange={(e) => updateFormData('forBankClient', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Stamp Date"
            value={formData.stampDate}
            onChange={(e) => updateFormData('stampDate', e.target.value)}
            disabled={isReadOnly}
            placeholder="DD.MM.YY"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Signature (Stamp)"
            value={formData.signatureStamp}
            onChange={(e) => updateFormData('signatureStamp', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Inspection Date (Stamp)"
            value={formData.inspectionDateStamp}
            onChange={(e) => updateFormData('inspectionDateStamp', e.target.value)}
            disabled={isReadOnly}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderWorksheetDetails();
      case 1:
        return renderEquipmentData();
      case 2:
        return renderLoadingData();
      case 3:
        return renderVisualInspection();
      case 4:
        return renderCommentsAndSignatures();
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(formData);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Paper shadow="xs" p="xl" radius="md">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="xs">Generator Maintenance Checklist</Title>
            <Text c="dimmed">Complete maintenance inspection for generator equipment</Text>
          </div>

          <Stepper active={activeStep} onStepClick={setActiveStep}>
            {steps.map((step, index) => (
              <Stepper.Step key={index} label={step.label} description={step.description}>
                <Box mt="xl">
                  {renderStepContent()}
                </Box>
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              <Box mt="xl">
                <Alert icon={<IconCheck size={16} />} title="Checklist Complete!" color="green" mb="lg">
                  All sections have been completed. Review the information and save or print the checklist.
                </Alert>
                {renderCommentsAndSignatures()}
              </Box>
            </Stepper.Completed>
          </Stepper>

          <Group justify="space-between" mt="xl">
            <Group>
              {activeStep > 0 && (
                <Button variant="default" onClick={() => setActiveStep(activeStep - 1)}>
                  Previous
                </Button>
              )}
              {activeStep < steps.length && (
                <Button onClick={() => setActiveStep(activeStep + 1)}>
                  Next
                </Button>
              )}
            </Group>

            <Group>
              {!isReadOnly && (
                <Button 
                  leftSection={<IconDeviceFloppy size={16} />} 
                  onClick={handleSave}
                  color="blue"
                >
                  Save Checklist
                </Button>
              )}
              <Button 
                leftSection={<IconPrinter size={16} />} 
                onClick={handlePrint}
                variant="outline"
              >
                Print Checklist
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default GeneratorMaintenanceChecklist; 