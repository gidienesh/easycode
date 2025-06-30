import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Avatar,
  Pagination,
  Grid,
  Paper,
  Loader,
  Alert,
  Modal,
  Tooltip
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconUserPlus,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTenant } from '../../src/providers/TenantProvider';
import EmployeeModal, { Employee } from '../../src/components/hr/EmployeeModal';
import { AppLayout } from '../../src/components/AppLayout';

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: '1',
    tenantId: 'demo-tenant',
    employeeNumber: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    workEmail: 'john.doe@company.com',
    jobTitle: 'Software Engineer',
    employmentType: 'full_time',
    startDate: new Date('2023-01-15'),
    status: 'active',
    departmentId: 'dept-1',
    phoneNumber: '+1 (555) 123-4567',
    salary: {
      amount: 75000,
      currency: 'USD',
      frequency: 'annual',
      effectiveDate: new Date('2023-01-15')
    }
  },
  {
    id: '2',
    tenantId: 'demo-tenant',
    employeeNumber: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    workEmail: 'jane.smith@company.com',
    jobTitle: 'Product Manager',
    employmentType: 'full_time',
    startDate: new Date('2022-08-20'),
    status: 'active',
    departmentId: 'dept-2',
    phoneNumber: '+1 (555) 987-6543',
    salary: {
      amount: 85000,
      currency: 'USD',
      frequency: 'annual',
      effectiveDate: new Date('2022-08-20')
    }
  },
  {
    id: '3',
    tenantId: 'demo-tenant',
    employeeNumber: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    workEmail: 'mike.johnson@company.com',
    jobTitle: 'HR Specialist',
    employmentType: 'full_time',
    startDate: new Date('2023-03-10'),
    status: 'on_leave',
    departmentId: 'dept-3',
    phoneNumber: '+1 (555) 456-7890',
    salary: {
      amount: 60000,
      currency: 'USD',
      frequency: 'annual',
      effectiveDate: new Date('2023-03-10')
    }
  }
];

const mockDepartments = [
  { id: 'dept-1', name: 'Engineering' },
  { id: 'dept-2', name: 'Product' },
  { id: 'dept-3', name: 'Human Resources' },
  { id: 'dept-4', name: 'Finance' },
  { id: 'dept-5', name: 'Marketing' }
];

const mockPositions = [
  { id: 'pos-1', title: 'Software Engineer' },
  { id: 'pos-2', title: 'Senior Software Engineer' },
  { id: 'pos-3', title: 'Product Manager' },
  { id: 'pos-4', title: 'HR Specialist' },
  { id: 'pos-5', title: 'Finance Manager' }
];

export default function HrPage() {
  const { tenant } = useTenant();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.workEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || employee.status === statusFilter;
    const matchesDepartment = !departmentFilter || employee.departmentId === departmentFilter;
    const matchesEmploymentType = !employmentTypeFilter || employee.employmentType === employmentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesEmploymentType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalOpened(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpened(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpened(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
      setDeleteModalOpened(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSaveEmployee = (employeeData: Employee) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id ? { ...employeeData, id: selectedEmployee.id } : emp
      ));
    } else {
      // Add new employee
      const newEmployee = {
        ...employeeData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setModalOpened(false);
    setSelectedEmployee(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', label: 'Active' },
      on_leave: { color: 'yellow', label: 'On Leave' },
      terminated: { color: 'red', label: 'Terminated' },
      pending_hire: { color: 'blue', label: 'Pending Hire' },
      offer_accepted: { color: 'cyan', label: 'Offer Accepted' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge color={config.color} variant="light">{config.label}</Badge>;
  };

  const getEmploymentTypeBadge = (type: string) => {
    const typeConfig = {
      full_time: { color: 'blue', label: 'Full Time' },
      part_time: { color: 'orange', label: 'Part Time' },
      contract: { color: 'purple', label: 'Contract' },
      intern: { color: 'green', label: 'Intern' },
      temporary: { color: 'gray', label: 'Temporary' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'gray', label: type };
    return <Badge color={config.color} variant="outline" size="sm">{config.label}</Badge>;
  };

  const getDepartmentName = (departmentId?: string) => {
    const department = mockDepartments.find(dept => dept.id === departmentId);
    return department?.name || 'Unassigned';
  };

  const formatSalary = (salary?: Employee['salary']) => {
    if (!salary) return 'Not set';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency
    });
    return `${formatter.format(salary.amount)} ${salary.frequency}`;
  };

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Human Resources</Title>
              <Text c="dimmed" size="sm">Manage employees, departments, and HR operations</Text>
            </div>
            <Group gap="sm">
              <Tooltip label="Refresh data">
                <ActionIcon variant="light" onClick={() => setLoading(true)}>
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Export employees">
                <ActionIcon variant="light">
                  <IconDownload size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Import employees">
                <ActionIcon variant="light">
                  <IconUpload size={16} />
                </ActionIcon>
              </Tooltip>
              <Button leftSection={<IconUserPlus size={16} />} onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </Group>
          </Group>

          {/* Stats Cards */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">Total Employees</Text>
                    <Text fw={700} size="xl">{employees.length}</Text>
                  </div>
                  <IconUsers size={24} color="var(--mantine-color-blue-6)" />
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">Active</Text>
                    <Text fw={700} size="xl" c="green">
                      {employees.filter(emp => emp.status === 'active').length}
                    </Text>
                  </div>
                  <IconUsers size={24} color="var(--mantine-color-green-6)" />
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">On Leave</Text>
                    <Text fw={700} size="xl" c="yellow">
                      {employees.filter(emp => emp.status === 'on_leave').length}
                    </Text>
                  </div>
                  <IconUsers size={24} color="var(--mantine-color-yellow-6)" />
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">Departments</Text>
                    <Text fw={700} size="xl">{mockDepartments.length}</Text>
                  </div>
                  <IconUsers size={24} color="var(--mantine-color-purple-6)" />
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Filters */}
          <Card withBorder p="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput
                  placeholder="Search employees..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  placeholder="Filter by status"
                  data={[
                    { value: '', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'on_leave', label: 'On Leave' },
                    { value: 'terminated', label: 'Terminated' },
                    { value: 'pending_hire', label: 'Pending Hire' },
                    { value: 'offer_accepted', label: 'Offer Accepted' }
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value || '')}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  placeholder="Filter by department"
                  data={[
                    { value: '', label: 'All Departments' },
                    ...mockDepartments.map(dept => ({ value: dept.id, label: dept.name }))
                  ]}
                  value={departmentFilter}
                  onChange={(value) => setDepartmentFilter(value || '')}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  placeholder="Filter by employment type"
                  data={[
                    { value: '', label: 'All Types' },
                    { value: 'full_time', label: 'Full Time' },
                    { value: 'part_time', label: 'Part Time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'intern', label: 'Intern' },
                    { value: 'temporary', label: 'Temporary' }
                  ]}
                  value={employmentTypeFilter}
                  onChange={(value) => setEmploymentTypeFilter(value || '')}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Employee Table */}
          <Card withBorder>
            {loading ? (
              <Group justify="center" p="xl">
                <Loader size="md" />
              </Group>
            ) : filteredEmployees.length === 0 ? (
              <Alert icon={<IconAlertCircle size={16} />} title="No employees found" color="blue">
                {searchQuery || statusFilter || departmentFilter || employmentTypeFilter
                  ? 'No employees match your current filters. Try adjusting your search criteria.'
                  : 'No employees have been added yet. Click "Add Employee" to get started.'}
              </Alert>
            ) : (
              <>
                <Table.ScrollContainer minWidth={800}>
                  <Table verticalSpacing="sm" highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Employee</Table.Th>
                        <Table.Th>Job Title</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Employment Type</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Start Date</Table.Th>
                        <Table.Th>Salary</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paginatedEmployees.map((employee) => (
                        <Table.Tr key={employee.id}>
                          <Table.Td>
                            <Group gap="sm">
                              <Avatar color="blue" radius="xl">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </Avatar>
                              <div>
                                <Text fw={500}>{employee.firstName} {employee.lastName}</Text>
                                <Text size="xs" c="dimmed">{employee.employeeNumber}</Text>
                                <Text size="xs" c="dimmed">{employee.workEmail}</Text>
                              </div>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>{employee.jobTitle}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text>{getDepartmentName(employee.departmentId)}</Text>
                          </Table.Td>
                          <Table.Td>
                            {getEmploymentTypeBadge(employee.employmentType)}
                          </Table.Td>
                          <Table.Td>
                            {getStatusBadge(employee.status)}
                          </Table.Td>
                          <Table.Td>
                            <Text>{employee.startDate.toLocaleDateString()}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{formatSalary(employee.salary)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Menu shadow="md" width={200}>
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconEye size={14} />}
                                  onClick={() => handleEditEmployee(employee)}
                                >
                                  View Details
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEdit size={14} />}
                                  onClick={() => handleEditEmployee(employee)}
                                >
                                  Edit Employee
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleDeleteEmployee(employee)}
                                >
                                  Delete Employee
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Group justify="center" mt="md">
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages}
                      size="sm"
                    />
                  </Group>
                )}
              </>
            )}
          </Card>
        </Stack>

        {/* Employee Modal */}
        <EmployeeModal
          opened={modalOpened}
          onClose={() => {
            setModalOpened(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          departments={mockDepartments}
          positions={mockPositions}
          managers={employees.filter(emp => emp.status === 'active').map(emp => ({
            id: emp.id || '',
            firstName: emp.firstName,
            lastName: emp.lastName
          }))}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Confirm Deletion"
          centered
        >
          <Stack gap="md">
            <Text>
              Are you sure you want to delete employee{' '}
              <Text component="span" fw={600}>
                {employeeToDelete?.firstName} {employeeToDelete?.lastName}
              </Text>?
              This action cannot be undone.
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={confirmDelete}>
                Delete Employee
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AppLayout>
  );
}