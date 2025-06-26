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
  Progress
} from '@mantine/core';
import {
  IconReceipt2,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconSearch,
  IconFilter,
  IconDownload,
  IconCash,
  IconSend,
  IconPhone,
  IconMail,
  IconCalendar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconBuildingBank
} from '@tabler/icons-react';

interface Vendor {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  taxId: string;
}

interface APBill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'PENDING' | 'OVERDUE' | 'PAID' | 'CANCELLED';
  description: string;
  reference: string;
  daysOverdue: number;
}

interface APPayment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendorName: string;
  billId: string;
  billNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'MPESA' | 'CARD';
  reference: string;
  notes: string;
  status: 'PENDING' | 'CLEARED' | 'BOUNCED';
}

const mockVendors: Vendor[] = [
  {
    id: 'vend-001',
    code: 'VEND-001',
    name: 'Office Supplies Ltd',
    email: 'billing@officesupplies.co.ke',
    phone: '+254 700 111 222',
    address: 'Industrial Area, Nairobi',
    creditLimit: 200000,
    currentBalance: 85000,
    paymentTerms: 'Net 30',
    status: 'ACTIVE',
    taxId: 'P051234567M'
  },
  {
    id: 'vend-002',
    code: 'VEND-002',
    name: 'Tech Equipment Kenya',
    email: 'accounts@techequipment.com',
    phone: '+254 722 333 444',
    address: 'Westlands, Nairobi',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'Net 15',
    status: 'ACTIVE',
    taxId: 'P051234568M'
  },
  {
    id: 'vend-003',
    code: 'VEND-003',
    name: 'Utility Services Co.',
    email: 'billing@utilities.co.ke',
    phone: '+254 733 555 666',
    address: 'CBD, Nairobi',
    creditLimit: 100000,
    currentBalance: 35000,
    paymentTerms: 'Net 7',
    status: 'ACTIVE',
    taxId: 'P051234569M'
  }
];

const mockBills: APBill[] = [
  {
    id: 'bill-001',
    billNumber: 'BILL-2024-001',
    vendorId: 'vend-001',
    vendorName: 'Office Supplies Ltd',
    billDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 85000,
    paidAmount: 0,
    balanceAmount: 85000,
    status: 'PENDING',
    description: 'Office supplies for January',
    reference: 'PO-2024-001',
    daysOverdue: 0
  },
  {
    id: 'bill-002',
    billNumber: 'BILL-2024-002',
    vendorId: 'vend-002',
    vendorName: 'Tech Equipment Kenya',
    billDate: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 125000,
    paidAmount: 0,
    balanceAmount: 125000,
    status: 'OVERDUE',
    description: 'Computer equipment purchase',
    reference: 'PO-2024-002',
    daysOverdue: 8
  },
  {
    id: 'bill-003',
    billNumber: 'BILL-2024-003',
    vendorId: 'vend-003',
    vendorName: 'Utility Services Co.',
    billDate: '2024-01-20',
    dueDate: '2024-01-27',
    amount: 35000,
    paidAmount: 35000,
    balanceAmount: 0,
    status: 'PAID',
    description: 'Electricity bill for January',
    reference: 'UTIL-JAN-2024',
    daysOverdue: 0
  },
  {
    id: 'bill-004',
    billNumber: 'BILL-2024-004',
    vendorId: 'vend-001',
    vendorName: 'Office Supplies Ltd',
    billDate: '2024-01-22',
    dueDate: '2024-02-21',
    amount: 45000,
    paidAmount: 0,
    balanceAmount: 45000,
    status: 'PENDING',
    description: 'Stationery supplies',
    reference: 'PO-2024-003',
    daysOverdue: 0
  }
];

const mockPayments: APPayment[] = [
  {
    id: 'pay-001',
    paymentNumber: 'PAY-2024-001',
    vendorId: 'vend-003',
    vendorName: 'Utility Services Co.',
    billId: 'bill-003',
    billNumber: 'BILL-2024-003',
    paymentDate: '2024-01-26',
    amount: 35000,
    paymentMethod: 'BANK_TRANSFER',
    reference: 'TXN-987654',
    notes: 'Utility bill payment',
    status: 'CLEARED'
  }
];

function AccountsPayablePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bills, setBills] = useState<APBill[]>([]);
  const [payments, setPayments] = useState<APPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bills');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'bill' | 'payment' | 'vendor'>('bill');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setVendors(mockVendors);
      setBills(mockBills);
      setPayments(mockPayments);
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
      case 'PAID': case 'CLEARED': case 'ACTIVE': return 'green';
      case 'PENDING': return 'blue';
      case 'OVERDUE': case 'BOUNCED': return 'red';
      case 'DRAFT': return 'yellow';
      case 'CANCELLED': case 'INACTIVE': case 'SUSPENDED': return 'gray';
      default: return 'gray';
    }
  };

  const calculateAPSummary = () => {
    const totalPayables = bills.reduce((sum, bill) => sum + bill.balanceAmount, 0);
    const overdueAmount = bills
      .filter(bill => bill.status === 'OVERDUE')
      .reduce((sum, bill) => sum + bill.balanceAmount, 0);
    const currentAmount = bills
      .filter(bill => bill.status === 'PENDING')
      .reduce((sum, bill) => sum + bill.balanceAmount, 0);
    const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);

    return { totalPayables, overdueAmount, currentAmount, totalPaid };
  };

  const { totalPayables, overdueAmount, currentAmount, totalPaid } = calculateAPSummary();

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: 'bill' | 'payment' | 'vendor', item?: any) => {
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
            <IconReceipt2 size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Accounts Payable
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
          <IconReceipt2 size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Accounts Payable
        </h1>
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal('bill')}
          >
            New Bill
          </Button>
          <Button
            variant="outline"
            leftSection={<IconCash size="1rem" />}
            onClick={() => handleOpenModal('payment')}
          >
            Make Payment
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
                  <Text size="xs" color="dimmed" mb={4}>Total Payables</Text>
                  <Text size="xl" fw={600}>{formatCurrency(totalPayables)}</Text>
                </div>
                <IconReceipt2 size="2rem" color="blue" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Overdue Amount</Text>
                  <Text size="xl" fw={600} color="red">{formatCurrency(overdueAmount)}</Text>
                </div>
                <IconAlertTriangle size="2rem" color="red" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Current Amount</Text>
                  <Text size="xl" fw={600} color="blue">{formatCurrency(currentAmount)}</Text>
                </div>
                <IconCalendar size="2rem" color="blue" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Paid This Month</Text>
                  <Text size="xl" fw={600} color="green">{formatCurrency(totalPaid)}</Text>
                </div>
                <IconCheck size="2rem" color="green" />
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Filters */}
        <Card className="card">
          <Group>
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size="1rem" />}
              data={
                activeTab === 'bills' ? [
                  { value: '', label: 'All Status' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'OVERDUE', label: 'Overdue' },
                  { value: 'PAID', label: 'Paid' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ] : activeTab === 'vendors' ? [
                  { value: '', label: 'All Status' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'SUSPENDED', label: 'Suspended' }
                ] : [
                  { value: '', label: 'All Status' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CLEARED', label: 'Cleared' },
                  { value: 'BOUNCED', label: 'Bounced' }
                ]
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
            <Tabs.Tab value="bills" leftSection={<IconReceipt2 size="0.8rem" />}>
              Bills ({bills.length})
            </Tabs.Tab>
            <Tabs.Tab value="vendors" leftSection={<IconBuildingBank size="0.8rem" />}>
              Vendors ({vendors.length})
            </Tabs.Tab>
            <Tabs.Tab value="payments" leftSection={<IconCash size="0.8rem" />}>
              Payments ({payments.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Bills Tab */}
          <Tabs.Panel value="bills" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Vendor Bills ({filteredBills.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Bill #</Table.Th>
                      <Table.Th>Vendor</Table.Th>
                      <Table.Th>Bill Date</Table.Th>
                      <Table.Th>Due Date</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Balance</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredBills.map((bill) => (
                      <Table.Tr key={bill.id}>
                        <Table.Td>
                          <Text fw={500}>{bill.billNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{bill.vendorName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(bill.billDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" color={bill.status === 'OVERDUE' ? 'red' : undefined}>
                            {new Date(bill.dueDate).toLocaleDateString()}
                            {bill.daysOverdue > 0 && (
                              <Text size="xs" color="red">
                                {bill.daysOverdue} days overdue
                              </Text>
                            )}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(bill.amount)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color={bill.balanceAmount > 0 ? 'red' : 'green'}>
                            {formatCurrency(bill.balanceAmount)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(bill.status)} 
                            variant="light"
                            size="sm"
                          >
                            {bill.status}
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
                                View Bill
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Bill
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconCash size="0.9rem" />}
                                onClick={() => handleOpenModal('payment')}
                              >
                                Make Payment
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

          {/* Vendors Tab */}
          <Tabs.Panel value="vendors" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Vendors ({filteredVendors.length})</h3>
                <Button
                  size="sm"
                  leftSection={<IconPlus size="0.8rem" />}
                  onClick={() => handleOpenModal('vendor')}
                >
                  Add Vendor
                </Button>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Code</Table.Th>
                      <Table.Th>Vendor Name</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>Tax ID</Table.Th>
                      <Table.Th>Credit Limit</Table.Th>
                      <Table.Th>Current Balance</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredVendors.map((vendor) => (
                      <Table.Tr key={vendor.id}>
                        <Table.Td>
                          <Text fw={500}>{vendor.code}</Text>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{vendor.name}</Text>
                            <Text size="xs" color="dimmed">{vendor.address}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm">{vendor.email}</Text>
                            <Text size="xs" color="dimmed">{vendor.phone}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>{vendor.taxId}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(vendor.creditLimit)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color={vendor.currentBalance > 0 ? 'red' : 'green'}>
                            {formatCurrency(vendor.currentBalance)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(vendor.status)} 
                            variant="light"
                            size="sm"
                          >
                            {vendor.status}
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
                                Edit Vendor
                              </Menu.Item>
                              <Menu.Item leftSection={<IconPhone size="0.9rem" />}>
                                Call Vendor
                              </Menu.Item>
                              <Menu.Item leftSection={<IconMail size="0.9rem" />}>
                                Send Email
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

          {/* Payments Tab */}
          <Tabs.Panel value="payments" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Vendor Payments ({filteredPayments.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Payment #</Table.Th>
                      <Table.Th>Vendor</Table.Th>
                      <Table.Th>Bill</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Method</Table.Th>
                      <Table.Th>Reference</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredPayments.map((payment) => (
                      <Table.Tr key={payment.id}>
                        <Table.Td>
                          <Text fw={500}>{payment.paymentNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{payment.vendorName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{payment.billNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color="red">{formatCurrency(payment.amount)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">
                            {payment.paymentMethod.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{payment.reference}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(payment.status)} 
                            variant="light"
                            size="sm"
                          >
                            {payment.status}
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
                                View Payment
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Payment
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
          {modalType === 'bill' && 'Bill creation form will be implemented here.'}
          {modalType === 'payment' && 'Payment processing form will be implemented here.'}
          {modalType === 'vendor' && 'Vendor management form will be implemented here.'}
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

export default function AccountsPayablePageWrapper() {
  return (
    <AppLayout>
      <AccountsPayablePage />
    </AppLayout>
  );
}