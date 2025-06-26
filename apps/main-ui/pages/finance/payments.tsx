import { useState, useEffect } from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { 
  Card, 
  Text, 
  Title, 
  Button, 
  Table, 
  Badge, 
  Group, 
  ActionIcon, 
  Modal, 
  TextInput, 
  Select, 
  NumberInput,
  Textarea,
  Stack,
  Grid,
  Tabs,
  Paper,
  Loader,
  Alert,
  Menu,
  Divider
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { 
  IconWallet, 
  IconPlus, 
  IconEdit, 
  IconEye, 
  IconTrash, 
  IconDownload,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconCurrency,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconCheck,
  IconCreditCard,
  IconBuildingBank,
  IconCash,
  IconDeviceMobile
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface Payment {
  id: string;
  paymentNumber: string;
  type: 'RECEIVED' | 'SENT';
  partyId: string;
  partyName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MPESA' | 'AIRTEL_MONEY' | 'CHEQUE';
  reference?: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

interface PaymentSummary {
  totalReceived: number;
  totalSent: number;
  netFlow: number;
  pendingReceived: number;
  pendingSent: number;
}

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'RECEIVED' as 'RECEIVED' | 'SENT',
    partyName: '',
    invoiceNumber: '',
    amount: 0 as number,
    paymentDate: '',
    paymentMethod: 'CASH' as Payment['paymentMethod'],
    reference: '',
    description: ''
  });

  // Mock data
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: '1',
        paymentNumber: 'PAY-2024-001',
        type: 'RECEIVED',
        partyId: '1',
        partyName: 'Acme Corporation',
        invoiceId: '1',
        invoiceNumber: 'INV-2024-001',
        amount: 58000,
        paymentDate: '2024-01-16',
        paymentMethod: 'BANK_TRANSFER',
        reference: 'TXN123456789',
        description: 'Payment for web development services',
        status: 'COMPLETED',
        createdAt: '2024-01-16T10:30:00Z'
      },
      {
        id: '2',
        paymentNumber: 'PAY-2024-002',
        type: 'SENT',
        partyId: '2',
        partyName: 'Office Supplies Ltd',
        amount: 15000,
        paymentDate: '2024-01-18',
        paymentMethod: 'MPESA',
        reference: 'MP240118.1234.A12345',
        description: 'Office supplies purchase',
        status: 'COMPLETED',
        createdAt: '2024-01-18T14:15:00Z'
      },
      {
        id: '3',
        paymentNumber: 'PAY-2024-003',
        type: 'RECEIVED',
        partyId: '3',
        partyName: 'Global Enterprises',
        invoiceId: '3',
        invoiceNumber: 'INV-2024-003',
        amount: 50000,
        paymentDate: '2024-01-20',
        paymentMethod: 'CHEQUE',
        reference: 'CHQ001234',
        description: 'Partial payment for consulting services',
        status: 'PENDING',
        createdAt: '2024-01-20T09:45:00Z'
      },
      {
        id: '4',
        paymentNumber: 'PAY-2024-004',
        type: 'SENT',
        partyId: '4',
        partyName: 'Utility Company',
        amount: 8500,
        paymentDate: '2024-01-22',
        paymentMethod: 'BANK_TRANSFER',
        reference: 'UTIL-JAN-2024',
        description: 'Monthly utility bills',
        status: 'COMPLETED',
        createdAt: '2024-01-22T16:20:00Z'
      },
      {
        id: '5',
        paymentNumber: 'PAY-2024-005',
        type: 'RECEIVED',
        partyId: '5',
        partyName: 'Tech Solutions Ltd',
        invoiceId: '2',
        invoiceNumber: 'INV-2024-002',
        amount: 87000,
        paymentDate: '2024-01-25',
        paymentMethod: 'CREDIT_CARD',
        reference: '****1234',
        description: 'Software license payment',
        status: 'COMPLETED',
        createdAt: '2024-01-25T11:10:00Z'
      }
    ];

    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const getPaymentSummary = (): PaymentSummary => {
    const completed = payments.filter(p => p.status === 'COMPLETED');
    const pending = payments.filter(p => p.status === 'PENDING');
    
    return {
      totalReceived: completed.filter(p => p.type === 'RECEIVED').reduce((sum, p) => sum + p.amount, 0),
      totalSent: completed.filter(p => p.type === 'SENT').reduce((sum, p) => sum + p.amount, 0),
      netFlow: completed.reduce((sum, p) => sum + (p.type === 'RECEIVED' ? p.amount : -p.amount), 0),
      pendingReceived: pending.filter(p => p.type === 'RECEIVED').reduce((sum, p) => sum + p.amount, 0),
      pendingSent: pending.filter(p => p.type === 'SENT').reduce((sum, p) => sum + p.amount, 0)
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'FAILED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'RECEIVED' ? 'green' : 'blue';
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH': return <IconCash size={16} />;
      case 'BANK_TRANSFER': return <IconBuildingBank size={16} />;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD': return <IconCreditCard size={16} />;
      case 'MPESA':
      case 'AIRTEL_MONEY': return <IconDeviceMobile size={16} />;
      default: return <IconWallet size={16} />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || payment.type === typeFilter;
    const matchesMethod = !methodFilter || payment.paymentMethod === methodFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'received' && payment.type === 'RECEIVED') ||
                      (activeTab === 'sent' && payment.type === 'SENT') ||
                      (activeTab === 'pending' && payment.status === 'PENDING') ||
                      (activeTab === 'completed' && payment.status === 'COMPLETED');
    
    return matchesSearch && matchesType && matchesMethod && matchesTab;
  });

  const handleSavePayment = () => {
    // Validation
    if (!formData.partyName || !formData.amount || !formData.paymentDate) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        color: 'red'
      });
      return;
    }

    // Save logic would go here
    const newPayment: Payment = {
      id: (payments.length + 1).toString(),
      paymentNumber: `PAY-2024-${(payments.length + 1).toString().padStart(3, '0')}`,
      type: formData.type,
      partyId: (payments.length + 1).toString(),
      partyName: formData.partyName,
      invoiceNumber: formData.invoiceNumber || undefined,
      amount: formData.amount,
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      description: formData.description,
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    };

    setPayments(prev => [newPayment, ...prev]);
    
    notifications.show({
      title: 'Success',
      message: 'Payment recorded successfully',
      color: 'green'
    });
    closeModal();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'RECEIVED',
      partyName: '',
      invoiceNumber: '',
      amount: 0,
      paymentDate: '',
      paymentMethod: 'CASH',
      reference: '',
      description: ''
    });
    setSelectedPayment(null);
  };

  const handleDeletePayment = () => {
    if (selectedPayment) {
      setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      notifications.show({
        title: 'Payment Deleted',
        message: `Payment ${selectedPayment.paymentNumber} has been deleted`,
        color: 'green'
      });
    }
    closeDeleteModal();
    setSelectedPayment(null);
  };

  const getTabCounts = () => {
    return {
      all: payments.length,
      received: payments.filter(p => p.type === 'RECEIVED').length,
      sent: payments.filter(p => p.type === 'SENT').length,
      pending: payments.filter(p => p.status === 'PENDING').length,
      completed: payments.filter(p => p.status === 'COMPLETED').length
    };
  };

  const tabCounts = getTabCounts();
  const summary = getPaymentSummary();

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <Group justify="space-between">
          <div>
            <h1 className="page-title">
              <IconWallet size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Payments
            </h1>
            <Text color="dimmed">Track and manage all payment transactions</Text>
          </div>
          <Group>
            <Button leftSection={<IconRefresh size={16} />} variant="light">
              Refresh
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openModal}>
              Record Payment
            </Button>
          </Group>
        </Group>
      </div>

      {/* Summary Cards */}
      <Grid className="mb-6">
        <Grid.Col span={2.4}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Received</Text>
                <Text fw={700} size="xl" color="green">KES {summary.totalReceived.toLocaleString()}</Text>
              </div>
              <IconCheck size={24} color="#51cf66" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2.4}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Sent</Text>
                <Text fw={700} size="xl" color="blue">KES {summary.totalSent.toLocaleString()}</Text>
              </div>
              <IconCurrency size={24} color="#228be6" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2.4}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Net Flow</Text>
                <Text fw={700} size="xl" color={summary.netFlow >= 0 ? 'green' : 'red'}>
                  KES {summary.netFlow.toLocaleString()}
                </Text>
              </div>
              <IconWallet size={24} color="#fd7e14" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2.4}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Pending Received</Text>
                <Text fw={700} size="xl" color="orange">KES {summary.pendingReceived.toLocaleString()}</Text>
              </div>
              <IconAlertCircle size={24} color="#fd7e14" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2.4}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Pending Sent</Text>
                <Text fw={700} size="xl" color="orange">KES {summary.pendingSent.toLocaleString()}</Text>
              </div>
              <IconCalendar size={24} color="#fd7e14" />
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Card className="card">
        {/* Filters and Search */}
        <Group justify="space-between" className="mb-4">
          <Group>
            <TextInput
              placeholder="Search payments..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filter by type"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: '', label: 'All Types' },
                { value: 'RECEIVED', label: 'Received' },
                { value: 'SENT', label: 'Sent' }
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value || '')}
              clearable
            />
            <Select
              placeholder="Filter by method"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: '', label: 'All Methods' },
                { value: 'CASH', label: 'Cash' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CREDIT_CARD', label: 'Credit Card' },
                { value: 'DEBIT_CARD', label: 'Debit Card' },
                { value: 'MPESA', label: 'M-Pesa' },
                { value: 'AIRTEL_MONEY', label: 'Airtel Money' },
                { value: 'CHEQUE', label: 'Cheque' }
              ]}
              value={methodFilter}
              onChange={(value) => setMethodFilter(value || '')}
              clearable
            />
          </Group>
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
          <Tabs.List>
            <Tabs.Tab value="all">All ({tabCounts.all})</Tabs.Tab>
            <Tabs.Tab value="received">Received ({tabCounts.received})</Tabs.Tab>
            <Tabs.Tab value="sent">Sent ({tabCounts.sent})</Tabs.Tab>
            <Tabs.Tab value="completed">Completed ({tabCounts.completed})</Tabs.Tab>
            <Tabs.Tab value="pending">Pending ({tabCounts.pending})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab} pt="md">
            {filteredPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <IconWallet size={48} color="#ced4da" />
                <Text size="lg" color="dimmed" mt="md">No payments found</Text>
                <Text color="dimmed">Record your first payment to get started</Text>
              </div>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Payment #</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Party</Table.Th>
                    <Table.Th>Invoice</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPayments.map((payment) => (
                    <Table.Tr key={payment.id}>
                      <Table.Td>
                        <Text fw={600}>{payment.paymentNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getTypeColor(payment.type)} variant="light">
                          {payment.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{payment.partyName}</Text>
                      </Table.Td>
                      <Table.Td>
                        {payment.invoiceNumber ? (
                          <Text size="sm" color="blue">{payment.invoiceNumber}</Text>
                        ) : (
                          <Text size="sm" color="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600} color={payment.type === 'RECEIVED' ? 'green' : 'blue'}>
                          {payment.type === 'RECEIVED' ? '+' : '-'}KES {payment.amount.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>{new Date(payment.paymentDate).toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <Text size="sm">{payment.paymentMethod.replace('_', ' ')}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(payment.status)} variant="light">
                          {payment.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon 
                            variant="light" 
                            color="blue"
                            onClick={() => {
                              setSelectedPayment(payment);
                              openViewModal();
                            }}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="light" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon 
                            variant="light" 
                            color="red"
                            onClick={() => {
                              setSelectedPayment(payment);
                              openDeleteModal();
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
            )}
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* Record Payment Modal */}
      <Modal 
        opened={modalOpened} 
        onClose={closeModal} 
        title="Record Payment" 
        size="lg"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Payment Type"
                placeholder="Select type"
                data={[
                  { value: 'RECEIVED', label: 'Payment Received' },
                  { value: 'SENT', label: 'Payment Sent' }
                ]}
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value as 'RECEIVED' | 'SENT' }))}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Party Name"
                placeholder="Customer or vendor name"
                value={formData.partyName}
                onChange={(e) => setFormData(prev => ({ ...prev, partyName: e.target.value }))}
                required
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Invoice Number (Optional)"
                placeholder="Related invoice number"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Amount"
                placeholder="Payment amount"
                value={formData.amount}
                onChange={(value) => setFormData(prev => ({ ...prev, amount: Number(value) || 0 }))}
                min={0}
                required
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <DateInput
                label="Payment Date"
                placeholder="Select date"
                value={formData.paymentDate}
                onChange={(value) => setFormData(prev => ({ ...prev, paymentDate: value || '' }))}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Payment Method"
                placeholder="Select method"
                data={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                  { value: 'CREDIT_CARD', label: 'Credit Card' },
                  { value: 'DEBIT_CARD', label: 'Debit Card' },
                  { value: 'MPESA', label: 'M-Pesa' },
                  { value: 'AIRTEL_MONEY', label: 'Airtel Money' },
                  { value: 'CHEQUE', label: 'Cheque' }
                ]}
                value={formData.paymentMethod}
                onChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as Payment['paymentMethod'] }))}
                required
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Reference Number (Optional)"
            placeholder="Transaction reference or cheque number"
            value={formData.reference}
            onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
          />

          <Textarea
            label="Description"
            placeholder="Payment description or notes"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSavePayment}>Record Payment</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Payment Modal */}
      <Modal 
        opened={viewModalOpened} 
        onClose={closeViewModal} 
        title={`Payment ${selectedPayment?.paymentNumber}`} 
        size="md"
      >
        {selectedPayment && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Payment Type</Text>
                <Badge color={getTypeColor(selectedPayment.type)} variant="light" size="lg">
                  {selectedPayment.type}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Status</Text>
                <Badge color={getStatusColor(selectedPayment.status)} variant="light" size="lg">
                  {selectedPayment.status}
                </Badge>
              </Grid.Col>
            </Grid>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Party</Text>
                <Text fw={600}>{selectedPayment.partyName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Amount</Text>
                <Text fw={700} size="lg" color={selectedPayment.type === 'RECEIVED' ? 'green' : 'blue'}>
                  {selectedPayment.type === 'RECEIVED' ? '+' : '-'}KES {selectedPayment.amount.toLocaleString()}
                </Text>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Payment Date</Text>
                <Text>{new Date(selectedPayment.paymentDate).toLocaleDateString()}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Payment Method</Text>
                <Group gap={4}>
                  {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                  <Text>{selectedPayment.paymentMethod.replace('_', ' ')}</Text>
                </Group>
              </Grid.Col>
            </Grid>

            {selectedPayment.invoiceNumber && (
              <div>
                <Text size="sm" color="dimmed">Related Invoice</Text>
                <Text color="blue">{selectedPayment.invoiceNumber}</Text>
              </div>
            )}

            {selectedPayment.reference && (
              <div>
                <Text size="sm" color="dimmed">Reference</Text>
                <Text>{selectedPayment.reference}</Text>
              </div>
            )}

            <div>
              <Text size="sm" color="dimmed">Description</Text>
              <Text>{selectedPayment.description}</Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<IconDownload size={16} />}>
                Download Receipt
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Payment"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete payment {selectedPayment?.paymentNumber}? This action cannot be undone.
          </Alert>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeleteModal}>Cancel</Button>
            <Button color="red" onClick={handleDeletePayment}>Delete Payment</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default function PaymentsPageWrapper() {
  return (
    <AppLayout>
      <PaymentsPage />
    </AppLayout>
  );
} 