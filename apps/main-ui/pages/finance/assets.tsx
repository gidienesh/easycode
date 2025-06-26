import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Alert,
  Loader,
  Title,
  Paper,
  Divider,
  Grid,
  Tabs,
  Progress,
  Timeline
} from '@mantine/core';
import {
  IconBuildingWarehouse,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconSearch,
  IconFilter,
  IconDownload,
  IconCalendar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconTool,
  IconTrendingDown,
  IconCash
} from '@tabler/icons-react';

interface FixedAsset {
  id: string;
  assetNumber: string;
  name: string;
  category: string;
  description: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
  usefulLife: number;
  salvageValue: number;
  location: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DISPOSED';
  status: 'ACTIVE' | 'INACTIVE' | 'DISPOSED' | 'UNDER_MAINTENANCE';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  serialNumber?: string;
  vendor?: string;
  warrantyExpiry?: string;
}

interface DepreciationEntry {
  id: string;
  assetId: string;
  assetName: string;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  method: string;
  createdDate: string;
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY';
  description: string;
  maintenanceDate: string;
  cost: number;
  vendor: string;
  nextDueDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

const mockAssets: FixedAsset[] = [
  {
    id: 'asset-001',
    assetNumber: 'FA-001',
    name: 'Dell OptiPlex 7090',
    category: 'Computer Equipment',
    description: 'Desktop computer for office use',
    purchaseDate: '2023-01-15',
    purchasePrice: 85000,
    currentValue: 68000,
    depreciationMethod: 'STRAIGHT_LINE',
    usefulLife: 5,
    salvageValue: 5000,
    location: 'Office Floor 2',
    condition: 'GOOD',
    status: 'ACTIVE',
    lastMaintenanceDate: '2023-12-15',
    nextMaintenanceDate: '2024-06-15',
    serialNumber: 'DL-789456123',
    vendor: 'Dell Kenya',
    warrantyExpiry: '2026-01-15'
  },
  {
    id: 'asset-002',
    assetNumber: 'FA-002',
    name: 'Toyota Hilux 2023',
    category: 'Vehicles',
    description: 'Company vehicle for field operations',
    purchaseDate: '2023-03-20',
    purchasePrice: 4500000,
    currentValue: 3825000,
    depreciationMethod: 'DECLINING_BALANCE',
    usefulLife: 8,
    salvageValue: 500000,
    location: 'Company Parking',
    condition: 'EXCELLENT',
    status: 'ACTIVE',
    lastMaintenanceDate: '2024-01-10',
    nextMaintenanceDate: '2024-04-10',
    serialNumber: 'TY-KDH123456',
    vendor: 'Toyota Kenya',
    warrantyExpiry: '2026-03-20'
  },
  {
    id: 'asset-003',
    assetNumber: 'FA-003',
    name: 'Industrial Generator 50KVA',
    category: 'Machinery',
    description: 'Backup power generator',
    purchaseDate: '2022-08-10',
    purchasePrice: 850000,
    currentValue: 595000,
    depreciationMethod: 'STRAIGHT_LINE',
    usefulLife: 10,
    salvageValue: 85000,
    location: 'Generator Room',
    condition: 'GOOD',
    status: 'UNDER_MAINTENANCE',
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-02-20',
    serialNumber: 'GEN-50KVA-789',
    vendor: 'Power Solutions Ltd'
  },
  {
    id: 'asset-004',
    assetNumber: 'FA-004',
    name: 'Office Furniture Set',
    category: 'Furniture & Fixtures',
    description: 'Executive office desk and chairs',
    purchaseDate: '2023-06-01',
    purchasePrice: 125000,
    currentValue: 106250,
    depreciationMethod: 'STRAIGHT_LINE',
    usefulLife: 8,
    salvageValue: 12500,
    location: 'Executive Office',
    condition: 'EXCELLENT',
    status: 'ACTIVE',
    vendor: 'Office Interiors Ltd'
  }
];

const mockDepreciationEntries: DepreciationEntry[] = [
  {
    id: 'dep-001',
    assetId: 'asset-001',
    assetName: 'Dell OptiPlex 7090',
    period: '2024-01',
    depreciationAmount: 1333,
    accumulatedDepreciation: 17000,
    bookValue: 68000,
    method: 'Straight Line',
    createdDate: '2024-01-31'
  },
  {
    id: 'dep-002',
    assetId: 'asset-002',
    assetName: 'Toyota Hilux 2023',
    period: '2024-01',
    depreciationAmount: 56250,
    accumulatedDepreciation: 675000,
    bookValue: 3825000,
    method: 'Declining Balance',
    createdDate: '2024-01-31'
  },
  {
    id: 'dep-003',
    assetId: 'asset-003',
    assetName: 'Industrial Generator 50KVA',
    period: '2024-01',
    depreciationAmount: 6375,
    accumulatedDepreciation: 255000,
    bookValue: 595000,
    method: 'Straight Line',
    createdDate: '2024-01-31'
  }
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    assetId: 'asset-002',
    assetName: 'Toyota Hilux 2023',
    maintenanceType: 'PREVENTIVE',
    description: 'Regular service and oil change',
    maintenanceDate: '2024-01-10',
    cost: 15000,
    vendor: 'Toyota Service Center',
    nextDueDate: '2024-04-10',
    status: 'COMPLETED'
  },
  {
    id: 'maint-002',
    assetId: 'asset-003',
    assetName: 'Industrial Generator 50KVA',
    maintenanceType: 'CORRECTIVE',
    description: 'Fuel system repair',
    maintenanceDate: '2024-01-20',
    cost: 45000,
    vendor: 'Power Solutions Ltd',
    status: 'IN_PROGRESS'
  },
  {
    id: 'maint-003',
    assetId: 'asset-001',
    assetName: 'Dell OptiPlex 7090',
    maintenanceType: 'PREVENTIVE',
    description: 'System cleanup and updates',
    maintenanceDate: '2024-02-15',
    cost: 5000,
    vendor: 'IT Support Services',
    nextDueDate: '2024-08-15',
    status: 'SCHEDULED'
  }
];

function FixedAssetsPage() {
  const [assets, setAssets] = useState<FixedAsset[]>([]);
  const [depreciationEntries, setDepreciationEntries] = useState<DepreciationEntry[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assets');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'asset' | 'maintenance' | 'depreciation'>('asset');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setAssets(mockAssets);
      setDepreciationEntries(mockDepreciationEntries);
      setMaintenanceRecords(mockMaintenanceRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'COMPLETED': case 'EXCELLENT': return 'green';
      case 'INACTIVE': case 'SCHEDULED': case 'GOOD': return 'blue';
      case 'UNDER_MAINTENANCE': case 'IN_PROGRESS': case 'FAIR': return 'yellow';
      case 'DISPOSED': case 'OVERDUE': case 'POOR': return 'red';
      default: return 'gray';
    }
  };

  const calculateAssetSummary = () => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalDepreciation = assets.reduce((sum, asset) => sum + (asset.purchasePrice - asset.currentValue), 0);
    const activeAssets = assets.filter(asset => asset.status === 'ACTIVE').length;
    const maintenanceDue = assets.filter(asset => 
      asset.nextMaintenanceDate && new Date(asset.nextMaintenanceDate) <= new Date()
    ).length;

    return { totalValue, totalDepreciation, activeAssets, maintenanceDue };
  };

  const { totalValue, totalDepreciation, activeAssets, maintenanceDue } = calculateAssetSummary();

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredDepreciation = depreciationEntries.filter(entry => {
    const matchesSearch = entry.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.period.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredMaintenance = maintenanceRecords.filter(record => {
    const matchesSearch = record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: 'asset' | 'maintenance' | 'depreciation', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconBuildingWarehouse size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Fixed Assets
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconBuildingWarehouse size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Fixed Assets
        </h1>
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal('asset')}
          >
            Add Asset
          </Button>
          <Button
            variant="outline"
            leftSection={<IconTool size="1rem" />}
            onClick={() => handleOpenModal('maintenance')}
          >
            Schedule Maintenance
          </Button>
          <Button variant="outline" leftSection={<IconDownload size="1rem" />}>
            Export
          </Button>
        </Group>
      </div>

      <Stack gap="lg">
        {/* Summary Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Total Asset Value</Text>
                  <Text size="xl" fw={600}>{formatCurrency(totalValue)}</Text>
                </div>
                <IconBuildingWarehouse size="2rem" color="blue" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Total Depreciation</Text>
                  <Text size="xl" fw={600} color="red">{formatCurrency(totalDepreciation)}</Text>
                </div>
                <IconTrendingDown size="2rem" color="red" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Active Assets</Text>
                  <Text size="xl" fw={600} color="green">{activeAssets}</Text>
                </div>
                <IconCheck size="2rem" color="green" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Maintenance Due</Text>
                  <Text size="xl" fw={600} color="orange">{maintenanceDue}</Text>
                </div>
                <IconAlertTriangle size="2rem" color="orange" />
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Filters */}
        <Card className="card">
          <Group>
            <TextInput
              placeholder="Search assets..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size="1rem" />}
              data={
                activeTab === 'assets' ? [
                  { value: '', label: 'All Status' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
                  { value: 'DISPOSED', label: 'Disposed' }
                ] : activeTab === 'maintenance' ? [
                  { value: '', label: 'All Status' },
                  { value: 'SCHEDULED', label: 'Scheduled' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'OVERDUE', label: 'Overdue' }
                ] : []
              }
              value={filterStatus}
              onChange={(value) => setFilterStatus(value || '')}
              clearable
            />
          </Group>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="assets" leftSection={<IconBuildingWarehouse size="0.8rem" />}>
              Assets ({assets.length})
            </Tabs.Tab>
            <Tabs.Tab value="depreciation" leftSection={<IconTrendingDown size="0.8rem" />}>
              Depreciation ({depreciationEntries.length})
            </Tabs.Tab>
            <Tabs.Tab value="maintenance" leftSection={<IconTool size="0.8rem" />}>
              Maintenance ({maintenanceRecords.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Assets Tab */}
          <Tabs.Panel value="assets" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Fixed Assets ({filteredAssets.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Asset #</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Purchase Price</Table.Th>
                      <Table.Th>Current Value</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Condition</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredAssets.map((asset) => (
                      <Table.Tr key={asset.id}>
                        <Table.Td>
                          <Text fw={500}>{asset.assetNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{asset.name}</Text>
                            <Text size="xs" color="dimmed">{asset.description}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{asset.category}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(asset.purchasePrice)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color="blue">{formatCurrency(asset.currentValue)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{asset.location}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(asset.condition)} 
                            variant="light"
                            size="sm"
                          >
                            {asset.condition}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(asset.status)} 
                            variant="light"
                            size="sm"
                          >
                            {asset.status.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md">
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <IconDots size="1rem" />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                                View Details
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Asset
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconTool size="0.9rem" />}
                                onClick={() => handleOpenModal('maintenance')}
                              >
                                Schedule Maintenance
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item leftSection={<IconTrash size="0.9rem" />} color="red">
                                Dispose Asset
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Card>
          </Tabs.Panel>

          {/* Depreciation Tab */}
          <Tabs.Panel value="depreciation" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Depreciation Entries ({filteredDepreciation.length})</h3>
                <Button
                  size="sm"
                  leftSection={<IconPlus size="0.8rem" />}
                  onClick={() => handleOpenModal('depreciation')}
                >
                  Calculate Depreciation
                </Button>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Asset</Table.Th>
                      <Table.Th>Period</Table.Th>
                      <Table.Th>Method</Table.Th>
                      <Table.Th>Depreciation Amount</Table.Th>
                      <Table.Th>Accumulated Depreciation</Table.Th>
                      <Table.Th>Book Value</Table.Th>
                      <Table.Th>Date Created</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredDepreciation.map((entry) => (
                      <Table.Tr key={entry.id}>
                        <Table.Td>
                          <Text fw={500}>{entry.assetName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{entry.period}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{entry.method}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color="red">{formatCurrency(entry.depreciationAmount)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(entry.accumulatedDepreciation)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color="blue">{formatCurrency(entry.bookValue)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(entry.createdDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Card>
          </Tabs.Panel>

          {/* Maintenance Tab */}
          <Tabs.Panel value="maintenance" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Maintenance Records ({filteredMaintenance.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Asset</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Cost</Table.Th>
                      <Table.Th>Vendor</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredMaintenance.map((record) => (
                      <Table.Tr key={record.id}>
                        <Table.Td>
                          <Text fw={500}>{record.assetName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">
                            {record.maintenanceType.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{record.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(record.maintenanceDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(record.cost)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{record.vendor}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(record.status)} 
                            variant="light"
                            size="sm"
                          >
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md">
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <IconDots size="1rem" />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                                View Details
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Record
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item leftSection={<IconTrash size="0.9rem" />} color="red">
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Modal for creating/editing */}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title={`${editingItem ? 'Edit' : 'Create'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
        size="lg"
      >
        <Text color="dimmed">
          {modalType === 'asset' && 'Asset registration form will be implemented here.'}
          {modalType === 'maintenance' && 'Maintenance scheduling form will be implemented here.'}
          {modalType === 'depreciation' && 'Depreciation calculation form will be implemented here.'}
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleCloseModal}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default function FixedAssetsPageWrapper() {
  return (
    <AppLayout>
      <FixedAssetsPage />
    </AppLayout>
  );
} 