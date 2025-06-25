import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Tabs,
  Card,
  Button,
  Group,
  Stack,
  Grid,
  Badge,
  Table,
  ActionIcon,
  Alert
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconMapPin, 
  IconTools, 
  IconBuilding
} from '@tabler/icons-react';
import { 
  MaintenanceCustomer, 
  EquipmentAsset, 
  EquipmentLocation, 
  EquipmentType
} from '../../types/maintenance';

interface CustomerEquipmentManagerProps {
  customers?: MaintenanceCustomer[];
  onSaveCustomer?: (customer: MaintenanceCustomer) => void;
  onSaveEquipment?: (equipment: EquipmentAsset) => void;
  onSaveLocation?: (location: EquipmentLocation) => void;
  onDeleteCustomer?: (customerId: string) => void;
  onDeleteEquipment?: (equipmentId: string) => void;
  onDeleteLocation?: (locationId: string) => void;
}

const CustomerEquipmentManager: React.FC<CustomerEquipmentManagerProps> = ({
  customers = [],
  onSaveCustomer,
  onSaveEquipment,
  onSaveLocation,
  onDeleteCustomer,
  onDeleteEquipment,
  onDeleteLocation
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<MaintenanceCustomer | null>(null);

  const getEquipmentTypeColor = (type: EquipmentType) => {
    const colors: Record<EquipmentType, string> = {
      GENERATOR: 'blue',
      AIR_CONDITIONER: 'green',
      FIRE_EQUIPMENT: 'red',
      HVAC_SYSTEM: 'cyan',
      ELECTRICAL_PANEL: 'yellow',
      UPS_SYSTEM: 'purple',
      SOLAR_SYSTEM: 'orange',
      PUMP: 'teal',
      MOTOR: 'indigo',
      COMPRESSOR: 'pink',
      CHILLER: 'lime',
      BOILER: 'grape'
    };
    return colors[type] || 'gray';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'INACTIVE': return 'gray';
      case 'UNDER_MAINTENANCE': return 'orange';
      case 'RETIRED': return 'red';
      case 'OUT_OF_SERVICE': return 'red';
      default: return 'gray';
    }
  };

  const renderCustomerList = () => (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Customers</Title>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            // TODO: Open customer modal
          }}
        >
          Add Customer
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Customer Name</Table.Th>
            <Table.Th>Industry</Table.Th>
            <Table.Th>Equipment Count</Table.Th>
            <Table.Th>Locations</Table.Th>
            <Table.Th>Contract Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {customers.map((customer) => (
            <Table.Tr 
              key={customer.id}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedCustomer(customer)}
            >
              <Table.Td>
                <Group gap="xs">
                  <IconBuilding size={16} />
                  <Text fw={500}>{customer.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{customer.industry || 'N/A'}</Table.Td>
              <Table.Td>
                <Badge color="blue" variant="light">
                  {customer.equipment?.length || 0} Equipment
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color="green" variant="light">
                  {customer.locations?.length || 0} Locations
                </Badge>
              </Table.Td>
              <Table.Td>
                {customer.maintenanceContract ? (
                  <Badge color="green" variant="light">
                    {customer.maintenanceContract.contractType}
                  </Badge>
                ) : (
                  <Badge color="gray" variant="light">No Contract</Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon 
                    variant="light" 
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Open edit customer modal
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon 
                    variant="light" 
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteCustomer) onDeleteCustomer(customer.id);
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
  );

  const renderEquipmentList = () => {
    if (!selectedCustomer) {
      return (
        <Alert color="blue">
          <Text>Select a customer to view their equipment</Text>
        </Alert>
      );
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Equipment - {selectedCustomer.name}</Title>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              // TODO: Open equipment modal
            }}
          >
            Add Equipment
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Asset Number</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {selectedCustomer.equipment?.map((equipment) => (
              <Table.Tr key={equipment.id}>
                <Table.Td>
                  <Text fw={500}>{equipment.assetNumber}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getEquipmentTypeColor(equipment.equipmentType)}>
                    {equipment.equipmentType.replace('_', ' ')}
                  </Badge>
                </Table.Td>
                <Table.Td>{equipment.model}</Table.Td>
                <Table.Td>{equipment.location?.name || 'N/A'}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(equipment.status)}>
                    {equipment.status.replace('_', ' ')}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {equipment.nextServiceDate ? (
                    <Text size="sm">{new Date(equipment.nextServiceDate).toLocaleDateString()}</Text>
                  ) : (
                    <Text size="sm" c="dimmed">Not scheduled</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      variant="light" 
                      color="blue"
                      onClick={() => {
                        // TODO: Open edit equipment modal
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="light" 
                      color="red"
                      onClick={() => {
                        if (onDeleteEquipment) onDeleteEquipment(equipment.id);
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
    );
  };

  const renderLocationList = () => {
    if (!selectedCustomer) {
      return (
        <Alert color="blue">
          <Text>Select a customer to view their locations</Text>
        </Alert>
      );
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Locations - {selectedCustomer.name}</Title>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              // TODO: Open location modal
            }}
          >
            Add Location
          </Button>
        </Group>

        <Grid>
          {selectedCustomer.locations?.map((location) => (
            <Grid.Col key={location.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section p="md">
                  <Group>
                    <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
                    <div>
                      <Text fw={500} size="lg">{location.name}</Text>
                      <Text size="sm" c="dimmed">{location.city}, {location.state}</Text>
                    </div>
                  </Group>
                </Card.Section>

                <Stack gap="xs">
                  <Text size="sm">{location.address}</Text>
                  {location.contactPerson && (
                    <Text size="sm"><strong>Contact:</strong> {location.contactPerson}</Text>
                  )}
                  {location.contactPhone && (
                    <Text size="sm"><strong>Phone:</strong> {location.contactPhone}</Text>
                  )}
                  {location.contactEmail && (
                    <Text size="sm"><strong>Email:</strong> {location.contactEmail}</Text>
                  )}
                </Stack>

                <Card.Section p="md" pt={0}>
                  <Group gap="xs">
                    <ActionIcon 
                      variant="light" 
                      color="blue"
                      onClick={() => {
                        // TODO: Open edit location modal
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="light" 
                      color="red"
                      onClick={() => {
                        if (onDeleteLocation) onDeleteLocation(location.id);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Card.Section>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    );
  };

  return (
    <Container size="xl" py="xl">
      <Paper shadow="xs" p="xl" radius="md">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="xs">Customer & Equipment Management</Title>
            <Text c="dimmed">Manage customers, their locations, and equipment for maintenance scheduling</Text>
          </div>

          <Tabs defaultValue="customers">
            <Tabs.List>
              <Tabs.Tab value="customers" leftSection={<IconBuilding size={16} />}>
                Customers
              </Tabs.Tab>
              <Tabs.Tab value="equipment" leftSection={<IconTools size={16} />}>
                Equipment
              </Tabs.Tab>
              <Tabs.Tab value="locations" leftSection={<IconMapPin size={16} />}>
                Locations
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="customers" pt="md">
              {renderCustomerList()}
            </Tabs.Panel>

            <Tabs.Panel value="equipment" pt="md">
              {renderEquipmentList()}
            </Tabs.Panel>

            <Tabs.Panel value="locations" pt="md">
              {renderLocationList()}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CustomerEquipmentManager; 