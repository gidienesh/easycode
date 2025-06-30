import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Grid,
  Text,
  Divider,
  NumberInput,
  Textarea,
  Card,
  Badge,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { DatePickerInput, DateInput } from '@mantine/dates';
import { IconPlus, IconTrash, IconUser, IconBriefcase, IconCash, IconPhone, IconMail } from '@tabler/icons-react';
import { useTenant } from '../../providers/TenantProvider';

export interface Employee {
  id?: string;
  tenantId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  personalEmail?: string;
  workEmail: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  jobTitle: string;
  departmentId?: string;
  positionId?: string;
  managerId?: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
  startDate: Date;
  endDate?: Date;
  salary?: {
    amount: number;
    currency: string;
    frequency: 'annual' | 'monthly' | 'bi_weekly' | 'weekly' | 'hourly';
    effectiveDate: Date;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    sortCode?: string;
    iban?: string;
    swiftCode?: string;
  };
  customFields?: Record<string, any>;
  status: 'active' | 'on_leave' | 'terminated' | 'pending_hire' | 'offer_accepted';
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeModalProps {
  opened: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSave: (employee: Employee) => void;
  departments?: Array<{ id: string; name: string }>;
  positions?: Array<{ id: string; title: string }>;
  managers?: Array<{ id: string; firstName: string; lastName: string }>;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  opened,
  onClose,
  employee,
  onSave,
  departments = [],
  positions = [],
  managers = []
}) => {
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'salary' | 'banking'>('personal');
  const [formData, setFormData] = useState<Employee>({
    tenantId: tenant?.id || '',
    employeeNumber: '',
    firstName: '',
    lastName: '',
    workEmail: '',
    jobTitle: '',
    employmentType: 'full_time',
    startDate: new Date(),
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
    } else {
      // Reset form for new employee
      setFormData({
        tenantId: tenant?.id || '',
        employeeNumber: generateEmployeeNumber(),
        firstName: '',
        lastName: '',
        workEmail: '',
        jobTitle: '',
        employmentType: 'full_time',
        startDate: new Date(),
        status: 'active'
      });
    }
    setErrors({});
  }, [employee, tenant, opened]);

  const generateEmployeeNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `EMP${timestamp}`;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateNestedFormData = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof Employee] as any,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.workEmail.trim()) newErrors.workEmail = 'Work email is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.employeeNumber.trim()) newErrors.employeeNumber = 'Employee number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.workEmail && !emailRegex.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }
    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const renderPersonalInfo = () => (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Employee Number"
            placeholder="EMP001"
            value={formData.employeeNumber}
            onChange={(e) => updateFormData('employeeNumber', e.target.value)}
            error={errors.employeeNumber}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Status"
            data={[
              { value: 'active', label: 'Active' },
              { value: 'on_leave', label: 'On Leave' },
              { value: 'terminated', label: 'Terminated' },
              { value: 'pending_hire', label: 'Pending Hire' },
              { value: 'offer_accepted', label: 'Offer Accepted' }
            ]}
            value={formData.status}
            onChange={(value) => updateFormData('status', value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <TextInput
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            error={errors.firstName}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Middle Name"
            placeholder="Michael"
            value={formData.middleName || ''}
            onChange={(e) => updateFormData('middleName', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            error={errors.lastName}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <DatePickerInput
            label="Date of Birth"
            placeholder="Select date"
            value={formData.dateOfBirth}
            onChange={(date) => updateFormData('dateOfBirth', date)}
            maxDate={new Date()}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Gender"
            placeholder="Select gender"
            data={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
              { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]}
            value={formData.gender || ''}
            onChange={(value) => updateFormData('gender', value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Work Email"
            placeholder="john.doe@company.com"
            value={formData.workEmail}
            onChange={(e) => updateFormData('workEmail', e.target.value)}
            error={errors.workEmail}
            leftSection={<IconMail size={16} />}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Personal Email"
            placeholder="john.doe@gmail.com"
            value={formData.personalEmail || ''}
            onChange={(e) => updateFormData('personalEmail', e.target.value)}
            error={errors.personalEmail}
            leftSection={<IconMail size={16} />}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={formData.phoneNumber || ''}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            leftSection={<IconPhone size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Nationality"
            placeholder="American"
            value={formData.nationality || ''}
            onChange={(e) => updateFormData('nationality', e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Divider label="Address" labelPosition="left" />
      <Grid>
        <Grid.Col span={12}>
          <TextInput
            label="Street Address"
            placeholder="123 Main Street"
            value={formData.address?.street || ''}
            onChange={(e) => updateNestedFormData('address', 'street', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="City"
            placeholder="New York"
            value={formData.address?.city || ''}
            onChange={(e) => updateNestedFormData('address', 'city', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="State"
            placeholder="NY"
            value={formData.address?.state || ''}
            onChange={(e) => updateNestedFormData('address', 'state', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="Postal Code"
            placeholder="10001"
            value={formData.address?.postalCode || ''}
            onChange={(e) => updateNestedFormData('address', 'postalCode', e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Divider label="Emergency Contact" labelPosition="left" />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Contact Name"
            placeholder="Jane Doe"
            value={formData.emergencyContact?.name || ''}
            onChange={(e) => updateNestedFormData('emergencyContact', 'name', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Relationship"
            placeholder="Spouse"
            value={formData.emergencyContact?.relationship || ''}
            onChange={(e) => updateNestedFormData('emergencyContact', 'relationship', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Emergency Phone"
            placeholder="+1 (555) 987-6543"
            value={formData.emergencyContact?.phone || ''}
            onChange={(e) => updateNestedFormData('emergencyContact', 'phone', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Emergency Email"
            placeholder="jane.doe@gmail.com"
            value={formData.emergencyContact?.email || ''}
            onChange={(e) => updateNestedFormData('emergencyContact', 'email', e.target.value)}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderEmploymentInfo = () => (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Job Title"
            placeholder="Software Engineer"
            value={formData.jobTitle}
            onChange={(e) => updateFormData('jobTitle', e.target.value)}
            error={errors.jobTitle}
            leftSection={<IconBriefcase size={16} />}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Employment Type"
            data={[
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'intern', label: 'Intern' },
              { value: 'temporary', label: 'Temporary' }
            ]}
            value={formData.employmentType}
            onChange={(value) => updateFormData('employmentType', value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Department"
            placeholder="Select department"
            data={departments.map(dept => ({ value: dept.id, label: dept.name }))}
            value={formData.departmentId || ''}
            onChange={(value) => updateFormData('departmentId', value)}
            searchable
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="Position"
            placeholder="Select position"
            data={positions.map(pos => ({ value: pos.id, label: pos.title }))}
            value={formData.positionId || ''}
            onChange={(value) => updateFormData('positionId', value)}
            searchable
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="Manager"
            placeholder="Select manager"
            data={managers.map(mgr => ({ value: mgr.id, label: `${mgr.firstName} ${mgr.lastName}` }))}
            value={formData.managerId || ''}
            onChange={(value) => updateFormData('managerId', value)}
            searchable
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <DatePickerInput
            label="Start Date"
            placeholder="Select start date"
            value={formData.startDate}
            onChange={(date) => updateFormData('startDate', date)}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DatePickerInput
            label="End Date"
            placeholder="Select end date (if applicable)"
            value={formData.endDate}
            onChange={(date) => updateFormData('endDate', date)}
            minDate={formData.startDate}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderSalaryInfo = () => (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={4}>
          <NumberInput
            label="Salary Amount"
            placeholder="50000"
            value={formData.salary?.amount || ''}
            onChange={(value) => updateNestedFormData('salary', 'amount', value)}
            leftSection={<IconCash size={16} />}
            min={0}
            decimalScale={2}
            fixedDecimalScale
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="Currency"
            data={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'CAD', label: 'CAD' }
            ]}
            value={formData.salary?.currency || 'USD'}
            onChange={(value) => updateNestedFormData('salary', 'currency', value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="Frequency"
            data={[
              { value: 'annual', label: 'Annual' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'bi_weekly', label: 'Bi-weekly' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'hourly', label: 'Hourly' }
            ]}
            value={formData.salary?.frequency || 'annual'}
            onChange={(value) => updateNestedFormData('salary', 'frequency', value)}
          />
        </Grid.Col>
      </Grid>

      <DatePickerInput
        label="Effective Date"
        placeholder="Select effective date"
        value={formData.salary?.effectiveDate}
        onChange={(date) => updateNestedFormData('salary', 'effectiveDate', date)}
      />
    </Stack>
  );

  const renderBankingInfo = () => (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Bank Name"
            placeholder="Chase Bank"
            value={formData.bankDetails?.bankName || ''}
            onChange={(e) => updateNestedFormData('bankDetails', 'bankName', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Account Number"
            placeholder="1234567890"
            value={formData.bankDetails?.accountNumber || ''}
            onChange={(e) => updateNestedFormData('bankDetails', 'accountNumber', e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <TextInput
            label="Sort Code"
            placeholder="12-34-56"
            value={formData.bankDetails?.sortCode || ''}
            onChange={(e) => updateNestedFormData('bankDetails', 'sortCode', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="IBAN"
            placeholder="GB29 NWBK 6016 1331 9268 19"
            value={formData.bankDetails?.iban || ''}
            onChange={(e) => updateNestedFormData('bankDetails', 'iban', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="SWIFT Code"
            placeholder="NWBKGB2L"
            value={formData.bankDetails?.swiftCode || ''}
            onChange={(e) => updateNestedFormData('bankDetails', 'swiftCode', e.target.value)}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: IconUser },
    { id: 'employment', label: 'Employment', icon: IconBriefcase },
    { id: 'salary', label: 'Salary', icon: IconCash },
    { id: 'banking', label: 'Banking', icon: IconCash }
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconUser size={20} />
          <Text fw={600}>{employee ? 'Edit Employee' : 'Add New Employee'}</Text>
        </Group>
      }
      size="xl"
      centered
    >
      <Stack gap="lg">
        {/* Tab Navigation */}
        <Group gap="xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'filled' : 'light'}
                size="sm"
                leftSection={<Icon size={16} />}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </Button>
            );
          })}
        </Group>

        {/* Tab Content */}
        <Card withBorder p="lg">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'employment' && renderEmploymentInfo()}
          {activeTab === 'salary' && renderSalaryInfo()}
          {activeTab === 'banking' && renderBankingInfo()}
        </Card>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {employee ? 'Update Employee' : 'Create Employee'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EmployeeModal;