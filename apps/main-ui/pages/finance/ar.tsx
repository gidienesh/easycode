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
  IconReceipt,
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
  IconX
} from '@tabler/icons-react';

interface Customer {
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
}

interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'SENT' | 'OVERDUE' | 'PAID' | 'CANCELLED';
  description: string;
  paymentTerms: string;
  daysOverdue: number;
}

interface ARPayment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'MPESA' | 'CARD';
  reference: string;
  notes: string;
  status: 'PENDING' | 'CLEARED' | 'BOUNCED';
}

const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    code: 'CUST-001',
    name: 'Acme Corporation Ltd',
    email: 'billing@acmecorp.com',
    phone: '+254 700 123 456',
    address: 'Westlands, Nairobi',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'Net 30',
    status: 'ACTIVE'
  },
  {
    id: 'cust-002',
    code: 'CUST-002',
    name: 'Tech Solutions Kenya',
    email: 'accounts@techsolutions.co.ke',
    phone: '+254 722 987 654',
    address: 'Upper Hill, Nairobi',
    creditLimit: 300000,
    currentBalance: 85000,
    paymentTerms: 'Net 15',
    status: 'ACTIVE'
  },
  {
    id: 'cust-003',
    code: 'CUST-003',
    name: 'Safari Logistics',
    email: 'finance@safarilogistics.com',
    phone: '+254 733 456 789',
    address: 'Industrial Area, Nairobi',
    creditLimit: 200000,
    currentBalance: 45000,
    paymentTerms: 'Net 30',
    status: 'ACTIVE'
  }
];

const mockInvoices: ARInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    customerId: 'cust-001',
    customerName: 'Acme Corporation Ltd',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 150000,
    paidAmount: 25000,
    balanceAmount: 125000,
    status: 'OVERDUE',
    description: 'Software development services',
    paymentTerms: 'Net 30',
    daysOverdue: 5
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-002',
    customerId: 'cust-002',
    customerName: 'Tech Solutions Kenya',
    issueDate: '2024-01-20',
    dueDate: '2024-02-04',
    amount: 85000,
    paidAmount: 0,
    balanceAmount: 85000,
    status: 'SENT',
    description: 'Consulting services',
    paymentTerms: 'Net 15',
    daysOverdue: 0
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-003',
    customerId: 'cust-003',
    customerName: 'Safari Logistics',
    issueDate: '2024-01-22',
    dueDate: '2024-02-21',
    amount: 45000,
    paidAmount: 0,
    balanceAmount: 45000,
    status: 'SENT',
    description: 'Equipment maintenance',
    paymentTerms: 'Net 30',
    daysOverdue: 0
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2024-004',
    customerId: 'cust-001',
    customerName: 'Acme Corporation Ltd',
    issueDate: '2024-01-10',
    dueDate: '2024-02-09',
    amount: 75000,
    paidAmount: 75000,
    balanceAmount: 0,
    status: 'PAID',
    description: 'Monthly support services',
    paymentTerms: 'Net 30',
    daysOverdue: 0
  }
];

const mockPayments: ARPayment[] = [
  {
    id: 'pay-001',
    paymentNumber: 'PAY-2024-001',
    customerId: 'cust-001',
    customerName: 'Acme Corporation Ltd',
    invoiceId: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    paymentDate: '2024-01-25',
    amount: 25000,
    paymentMethod: 'BANK_TRANSFER',
    reference: 'TXN-789456',
    notes: 'Partial payment',
    status: 'CLEARED'
  },
  {
    id: 'pay-002',
    paymentNumber: 'PAY-2024-002',
    customerId: 'cust-001',
    customerName: 'Acme Corporation Ltd',
    invoiceId: 'inv-004',
    invoiceNumber: 'INV-2024-004',
    paymentDate: '2024-02-08',
    amount: 75000,
    paymentMethod: 'MPESA',
    reference: 'QA12345678',
    notes: 'Full payment via M-Pesa',
    status: 'CLEARED'
  }
];

function AccountsReceivablePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<ARInvoice[]>([]);
  const [payments, setPayments] = useState<ARPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'invoice' | 'payment' | 'customer'>('invoice');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setCustomers(mockCustomers);
      setInvoices(mockInvoices);
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
      case 'SENT': case 'PENDING': return 'blue';
      case 'OVERDUE': case 'BOUNCED': return 'red';
      case 'DRAFT': return 'yellow';
      case 'CANCELLED': case 'INACTIVE': case 'SUSPENDED': return 'gray';
      default: return 'gray';
    }
  };

  const calculateARSummary = () => {
    const totalReceivables = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
    const overdueAmount = invoices
      .filter(inv => inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + inv.balanceAmount, 0);
    const currentAmount = invoices
      .filter(inv => inv.status === 'SENT')
      .reduce((sum, inv) => sum + inv.balanceAmount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

    return { totalReceivables, overdueAmount, currentAmount, totalPaid };
  };

  const { totalReceivables, overdueAmount, currentAmount, totalPaid } = calculateARSummary();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: 'invoice' | 'payment' | 'customer', item?: any) => {
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
            <IconReceipt size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Accounts Receivable
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
          <IconReceipt size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Accounts Receivable
        </h1>
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal('invoice')}
          >
            New Invoice
          </Button>
          <Button
            variant="outline"
            leftSection={<IconCash size="1rem" />}
            onClick={() => handleOpenModal('payment')}
          >
            Record Payment
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
                  <Text size="xs" color="dimmed" mb={4}>Total Receivables</Text>
                  <Text size="xl" fw={600}>{formatCurrency(totalReceivables)}</Text>
                </div>
                <IconReceipt size="2rem" color="blue" />
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
                  <Text size="xs" color="dimmed" mb={4}>Collected This Month</Text>
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
                activeTab === 'invoices' ? [
                  { value: '', label: 'All Status' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'SENT', label: 'Sent' },
                  { value: 'OVERDUE', label: 'Overdue' },
                  { value: 'PAID', label: 'Paid' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ] : activeTab === 'customers' ? [
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
            <Tabs.Tab value="invoices" leftSection={<IconReceipt size="0.8rem" />}>
              Invoices ({invoices.length})
            </Tabs.Tab>
            <Tabs.Tab value="customers" leftSection={<IconMail size="0.8rem" />}>
              Customers ({customers.length})
            </Tabs.Tab>
            <Tabs.Tab value="payments" leftSection={<IconCash size="0.8rem" />}>
              Payments ({payments.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Invoices Tab */}
          <Tabs.Panel value="invoices" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Customer Invoices ({filteredInvoices.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Invoice #</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Issue Date</Table.Th>
                      <Table.Th>Due Date</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Balance</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredInvoices.map((invoice) => (
                      <Table.Tr key={invoice.id}>
                        <Table.Td>
                          <Text fw={500}>{invoice.invoiceNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{invoice.customerName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" color={invoice.status === 'OVERDUE' ? 'red' : undefined}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                            {invoice.daysOverdue > 0 && (
                              <Text size="xs" color="red">
                                {invoice.daysOverdue} days overdue
                              </Text>
                            )}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>{formatCurrency(invoice.amount)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color={invoice.balanceAmount > 0 ? 'red' : 'green'}>
                            {formatCurrency(invoice.balanceAmount)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(invoice.status)} 
                            variant="light"
                            size="sm"
                          >
                            {invoice.status}
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
                                View Invoice
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Invoice
                              </Menu.Item>
                              <Menu.Item leftSection={<IconSend size="0.9rem" />}>
                                Send Reminder
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconCash size="0.9rem" />}
                                onClick={() => handleOpenModal('payment')}
                              >
                                Record Payment
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

          {/* Customers Tab */}
          <Tabs.Panel value="customers" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Customers ({filteredCustomers.length})</h3>
                <Button
                  size="sm"
                  leftSection={<IconPlus size="0.8rem" />}
                  onClick={() => handleOpenModal('customer')}
                >
                  Add Customer
                </Button>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Code</Table.Th>
                      <Table.Th>Customer Name</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>Credit Limit</Table.Th>
                      <Table.Th>Current Balance</Table.Th>
                      <Table.Th>Credit Usage</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredCustomers.map((customer) => {
                      const creditUsage = (customer.currentBalance / customer.creditLimit) * 100;
                      return (
                        <Table.Tr key={customer.id}>
                          <Table.Td>
                            <Text fw={500}>{customer.code}</Text>
                          </Table.Td>
                          <Table.Td>
                            <div>
                              <Text fw={500}>{customer.name}</Text>
                              <Text size="xs" color="dimmed">{customer.address}</Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <div>
                              <Text size="sm">{customer.email}</Text>
                              <Text size="xs" color="dimmed">{customer.phone}</Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600}>{formatCurrency(customer.creditLimit)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600} color={customer.currentBalance > 0 ? 'red' : 'green'}>
                              {formatCurrency(customer.currentBalance)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <div>
                              <Progress 
                                value={creditUsage} 
                                color={creditUsage > 80 ? 'red' : creditUsage > 60 ? 'yellow' : 'green'}
                                size="sm"
                                mb={4}
                              />
                              <Text size="xs" color="dimmed">
                                {creditUsage.toFixed(1)}% used
                              </Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              color={getStatusColor(customer.status)} 
                              variant="light"
                              size="sm"
                            >
                              {customer.status}
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
                                  Edit Customer
                                </Menu.Item>
                                <Menu.Item leftSection={<IconPhone size="0.9rem" />}>
                                  Call Customer
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
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            </Card>
          </Tabs.Panel>

          {/* Payments Tab */}
          <Tabs.Panel value="payments" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Customer Payments ({filteredPayments.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Payment #</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Invoice</Table.Th>
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
                          <Text size="sm">{payment.customerName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{payment.invoiceNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} color="green">{formatCurrency(payment.amount)}</Text>
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
          {modalType === 'invoice' && 'Invoice creation form will be implemented here.'}
          {modalType === 'payment' && 'Payment recording form will be implemented here.'}
          {modalType === 'customer' && 'Customer management form will be implemented here.'}
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

export default function AccountsReceivablePageWrapper() {
  return (
    <AppLayout>
      <AccountsReceivablePage />
    </AppLayout>
  );
} 