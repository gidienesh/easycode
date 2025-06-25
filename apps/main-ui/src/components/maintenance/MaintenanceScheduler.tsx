import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Grid,
  Card,
  Button,
  Group,
  Stack,
  Badge,
  Table,
  ActionIcon,
  Select,
  DateInput,
  NumberInput,
  Textarea,
  Modal,
  Alert,
  Calendar,
  Box
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCalendar, 
  IconUser,
  IconTools,
  IconMapPin,
  IconClock,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { 
  MaintenanceWorkOrder, 
  MaintenanceSchedule, 
  Technician, 
  EquipmentAsset,
  MaintenanceCustomer
} from '../../types/maintenance';

interface MaintenanceSchedulerProps {
  workOrders?: MaintenanceWorkOrder[];
  technicians?: Technician[];
  customers?: MaintenanceCustomer[];
  onSaveWorkOrder?: (workOrder: MaintenanceWorkOrder) => void;
  onDeleteWorkOrder?: (workOrderId: string) => void;
  onAssignTechnician?: (workOrderId: string, technicianId: string) => void;
}

const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({
  workOrders = [],
  technicians = [],
  customers = [],
  onSaveWorkOrder,
  onDeleteWorkOrder,
  onAssignTechnician
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<MaintenanceWorkOrder | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'blue';
      case 'IN_PROGRESS': return 'orange';
      case 'ON_HOLD': return 'yellow';
      case 'COMPLETED': return 'green';
      case 'CLOSED': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'gray';
      case 'MEDIUM': return 'blue';
      case 'HIGH': return 'orange';
      case 'CRITICAL': return 'red';
      default: return 'gray';
    }
  };

  const getWorkOrdersForMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    return workOrders.filter(wo => {
      const woDate = new Date(wo.scheduledDate);
      return woDate.getFullYear() === year && woDate.getMonth() === month;
    });
  };

  const getWorkOrdersForDate = (date: Date) => {
    return workOrders.filter(wo => {
      const woDate = new Date(wo.scheduledDate);
      return woDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarView = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Maintenance Calendar</Title>
          <Group>
            <Button 
              variant="light"
              onClick={() => {
                const prevMonth = new Date(selectedMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setSelectedMonth(prevMonth);
              }}
            >
              Previous Month
            </Button>
            <Button 
              variant="light"
              onClick={() => {
                const nextMonth = new Date(selectedMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setSelectedMonth(nextMonth);
              }}
            >
              Next Month
            </Button>
          </Group>
        </Group>

        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          renderDay={(date) => {
            const dayWorkOrders = getWorkOrdersForDate(date);
            const hasWorkOrders = dayWorkOrders.length > 0;
            
            return (
              <Box>
                <Text size="sm">{date.getDate()}</Text>
                {hasWorkOrders && (
                  <Badge 
                    size="xs" 
                    color="blue" 
                    variant="filled"
                    style={{ position: 'absolute', top: 2, right: 2 }}
                  >
                    {dayWorkOrders.length}
                  </Badge>
                )}
              </Box>
            );
          }}
        />

        {selectedDate && (
          <Card withBorder p="md">
            <Title order={4} mb="md">
              Work Orders for {selectedDate.toLocaleDateString()}
            </Title>
            {getWorkOrdersForDate(selectedDate).length > 0 ? (
              <Stack gap="sm">
                {getWorkOrdersForDate(selectedDate).map(wo => (
                  <Card key={wo.id} withBorder p="sm">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>{wo.workOrderNumber}</Text>
                        <Text size="sm" c="dimmed">
                          {wo.equipment?.assetNumber} - {wo.equipment?.model}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {wo.equipment?.customer?.name} - {wo.equipment?.location?.name}
                        </Text>
                      </div>
                      <Group gap="xs">
                        <Badge color={getPriorityColor(wo.priority)}>
                          {wo.priority}
                        </Badge>
                        <Badge color={getStatusColor(wo.status)}>
                          {wo.status.replace('_', ' ')}
                        </Badge>
                        <ActionIcon 
                          variant="light" 
                          color="blue"
                          onClick={() => {
                            setSelectedWorkOrder(wo);
                            setWorkOrderModalOpen(true);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">No work orders scheduled for this date.</Text>
            )}
          </Card>
        )}
      </Stack>
    </Card>
  );

  const renderWorkOrderList = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Work Orders</Title>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setSelectedWorkOrder(null);
              setWorkOrderModalOpen(true);
            }}
          >
            Create Work Order
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Work Order #</Table.Th>
              <Table.Th>Equipment</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Scheduled Date</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Assigned Technicians</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {getWorkOrdersForMonth().map((workOrder) => (
              <Table.Tr key={workOrder.id}>
                <Table.Td>
                  <Text fw={500}>{workOrder.workOrderNumber}</Text>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm">{workOrder.equipment?.assetNumber}</Text>
                    <Text size="xs" c="dimmed">{workOrder.equipment?.model}</Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{workOrder.equipment?.customer?.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{workOrder.equipment?.location?.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {new Date(workOrder.scheduledDate).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getPriorityColor(workOrder.priority)}>
                    {workOrder.priority}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(workOrder.status)}>
                    {workOrder.status.replace('_', ' ')}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {workOrder.assignedTechnicians?.map(tech => (
                      <Badge key={tech.id} size="xs" variant="light">
                        {tech.name}
                      </Badge>
                    ))}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      variant="light" 
                      color="blue"
                      onClick={() => {
                        setSelectedWorkOrder(workOrder);
                        setWorkOrderModalOpen(true);
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="light" 
                      color="red"
                      onClick={() => {
                        if (onDeleteWorkOrder) onDeleteWorkOrder(workOrder.id);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );

  const renderTechnicianSchedule = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Technician Schedule</Title>
        
        <Grid>
          {technicians.map(technician => {
            const technicianWorkOrders = workOrders.filter(wo => 
              wo.assignedTechnicians?.some(tech => tech.id === technician.id)
            );
            
            const monthlyWorkOrders = technicianWorkOrders.filter(wo => {
              const woDate = new Date(wo.scheduledDate);
              return woDate.getFullYear() === selectedMonth.getFullYear() && 
                     woDate.getMonth() === selectedMonth.getMonth();
            });

            return (
              <Grid.Col key={technician.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card withBorder p="md">
                  <Group mb="md">
                    <IconUser size={20} color="var(--mantine-color-blue-6)" />
                    <div>
                      <Text fw={500}>{technician.name}</Text>
                      <Text size="sm" c="dimmed">{technician.employeeNumber}</Text>
                    </div>
                  </Group>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <Badge color="blue" variant="light">
                        {monthlyWorkOrders.length} Work Orders
                      </Badge>
                      <Badge color={technician.status === 'ACTIVE' ? 'green' : 'gray'}>
                        {technician.status}
                      </Badge>
                    </Group>

                    <Text size="sm">
                      <strong>Specializations:</strong> {technician.specialization.join(', ')}
                    </Text>
                    <Text size="sm">
                      <strong>Experience:</strong> {technician.experience} years
                    </Text>

                    {monthlyWorkOrders.length > 0 && (
                      <div>
                        <Text size="sm" fw={500} mt="sm">This Month's Work Orders:</Text>
                        <Stack gap="xs" mt="xs">
                          {monthlyWorkOrders.slice(0, 3).map(wo => (
                            <Text key={wo.id} size="xs" c="dimmed">
                              • {wo.workOrderNumber} - {new Date(wo.scheduledDate).toLocaleDateString()}
                            </Text>
                          ))}
                          {monthlyWorkOrders.length > 3 && (
                            <Text size="xs" c="dimmed">
                              +{monthlyWorkOrders.length - 3} more
                            </Text>
                          )}
                        </Stack>
                      </div>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    </Card>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">Maintenance Scheduler</Title>
          <Text c="dimmed">Schedule and manage maintenance work orders for {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            {renderCalendarView()}
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            {renderTechnicianSchedule()}
          </Grid.Col>
        </Grid>

        {renderWorkOrderList()}

        {/* Work Order Modal */}
        <Modal 
          opened={workOrderModalOpen} 
          onClose={() => setWorkOrderModalOpen(false)}
          title={selectedWorkOrder ? "Edit Work Order" : "Create Work Order"}
          size="lg"
        >
          <WorkOrderForm 
            workOrder={selectedWorkOrder}
            technicians={technicians}
            customers={customers}
            onSave={(workOrder) => {
              if (onSaveWorkOrder) onSaveWorkOrder(workOrder);
              setWorkOrderModalOpen(false);
            }}
          />
        </Modal>
      </Stack>
    </Container>
  );
};

// Work Order Form Component
interface WorkOrderFormProps {
  workOrder?: MaintenanceWorkOrder | null;
  technicians: Technician[];
  customers: MaintenanceCustomer[];
  onSave: (workOrder: MaintenanceWorkOrder) => void;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ workOrder, technicians, customers, onSave }) => {
  const [formData, setFormData] = useState({
    workOrderNumber: workOrder?.workOrderNumber || `WO-${Date.now()}`,
    equipmentId: workOrder?.equipmentId || '',
    priority: workOrder?.priority || 'MEDIUM',
    status: workOrder?.status || 'OPEN',
    scheduledDate: workOrder?.scheduledDate ? new Date(workOrder.scheduledDate) : new Date(),
    estimatedDuration: workOrder?.estimatedDuration || 2,
    description: workOrder?.description || '',
    assignedTechnicianIds: workOrder?.assignedTechnicianIds || []
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentAsset[]>([]);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = customers.find(c => c.id === customerId);
    setAvailableEquipment(customer?.equipment || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedEquipment = availableEquipment.find(eq => eq.id === formData.equipmentId);
    if (!selectedEquipment) return;

    const workOrderData: MaintenanceWorkOrder = {
      id: workOrder?.id || `workorder-${Date.now()}`,
      workOrderNumber: formData.workOrderNumber,
      equipmentId: formData.equipmentId,
      equipment: selectedEquipment,
      priority: formData.priority as any,
      status: formData.status as any,
      assignedTechnicianIds: formData.assignedTechnicianIds,
      assignedTechnicians: technicians.filter(t => formData.assignedTechnicianIds.includes(t.id)),
      scheduledDate: formData.scheduledDate.toISOString(),
      estimatedDuration: formData.estimatedDuration,
      description: formData.description,
      createdAt: workOrder?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(workOrderData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Work Order Number"
              value={formData.workOrderNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, workOrderNumber: e.target.value }))}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Scheduled Date"
              value={formData.scheduledDate}
              onChange={(date) => setFormData(prev => ({ ...prev, scheduledDate: date || new Date() }))}
              required
            />
          </Grid.Col>
        </Grid>

        <Select
          label="Customer"
          value={selectedCustomerId}
          onChange={(value) => {
            setSelectedCustomerId(value || '');
            handleCustomerChange(value || '');
          }}
          data={customers.map(c => ({ value: c.id, label: c.name }))}
          required
        />

        <Select
          label="Equipment"
          value={formData.equipmentId}
          onChange={(value) => setFormData(prev => ({ ...prev, equipmentId: value || '' }))}
          data={availableEquipment.map(eq => ({ 
            value: eq.id, 
            label: `${eq.assetNumber} - ${eq.model} (${eq.location?.name})` 
          }))}
          required
        />

        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(value) => setFormData(prev => ({ ...prev, priority: value || 'MEDIUM' }))}
              data={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value || 'OPEN' }))}
              data={[
                { value: 'OPEN', label: 'Open' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'ON_HOLD', label: 'On Hold' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CLOSED', label: 'Closed' },
                { value: 'CANCELLED', label: 'Cancelled' }
              ]}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Estimated Duration (hours)"
              value={formData.estimatedDuration}
              onChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: value || 2 }))}
              min={0.5}
              max={24}
              step={0.5}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Assigned Technicians"
              value={formData.assignedTechnicianIds[0] || ''}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                assignedTechnicianIds: value ? [value] : [] 
              }))}
              data={technicians.map(t => ({ value: t.id, label: t.name }))}
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">
            {workOrder ? 'Update Work Order' : 'Create Work Order'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default MaintenanceScheduler; 