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
  IconFileInvoice, 
  IconPlus, 
  IconEdit, 
  IconEye, 
  IconTrash, 
  IconDownload,
  IconSend,
  IconMail,
  IconPrinter,
  IconDots,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconCurrency,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    notes: '',
    taxRate: 16 // 16% VAT
  });

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        customerId: '1',
        customerName: 'Acme Corporation',
        customerEmail: 'billing@acme.com',
        issueDate: '2024-01-15',
        dueDate: '2024-02-14',
        subtotal: 50000,
        taxAmount: 8000,
        totalAmount: 58000,
        paidAmount: 58000,
        status: 'PAID',
        items: [
          { id: '1', description: 'Web Development Services', quantity: 1, unitPrice: 50000, amount: 50000 }
        ],
        notes: 'Thank you for your business!',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        customerId: '2',
        customerName: 'Tech Solutions Ltd',
        customerEmail: 'accounts@techsolutions.com',
        issueDate: '2024-01-20',
        dueDate: '2024-02-19',
        subtotal: 75000,
        taxAmount: 12000,
        totalAmount: 87000,
        paidAmount: 0,
        status: 'SENT',
        items: [
          { id: '2', description: 'Software License', quantity: 3, unitPrice: 25000, amount: 75000 }
        ],
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        customerId: '3',
        customerName: 'Global Enterprises',
        customerEmail: 'finance@global.com',
        issueDate: '2024-01-10',
        dueDate: '2024-01-25',
        subtotal: 120000,
        taxAmount: 19200,
        totalAmount: 139200,
        paidAmount: 50000,
        status: 'OVERDUE',
        items: [
          { id: '3', description: 'Consulting Services', quantity: 40, unitPrice: 3000, amount: 120000 }
        ],
        createdAt: '2024-01-10T09:15:00Z'
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        customerId: '4',
        customerName: 'StartUp Inc',
        customerEmail: 'admin@startup.com',
        issueDate: '2024-01-25',
        dueDate: '2024-02-24',
        subtotal: 30000,
        taxAmount: 4800,
        totalAmount: 34800,
        paidAmount: 0,
        status: 'DRAFT',
        items: [
          { id: '4', description: 'Logo Design', quantity: 1, unitPrice: 30000, amount: 30000 }
        ],
        createdAt: '2024-01-25T16:45:00Z'
      }
    ];

    const mockCustomers: Customer[] = [
      { id: '1', name: 'Acme Corporation', email: 'billing@acme.com', phone: '+254 700 123 456' },
      { id: '2', name: 'Tech Solutions Ltd', email: 'accounts@techsolutions.com', phone: '+254 700 234 567' },
      { id: '3', name: 'Global Enterprises', email: 'finance@global.com', phone: '+254 700 345 678' },
      { id: '4', name: 'StartUp Inc', email: 'admin@startup.com', phone: '+254 700 456 789' }
    ];

    setTimeout(() => {
      setInvoices(mockInvoices);
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'SENT': return 'blue';
      case 'VIEWED': return 'cyan';
      case 'OVERDUE': return 'red';
      case 'CANCELLED': return 'gray';
      case 'DRAFT': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <IconCheck size={14} />;
      case 'OVERDUE': return <IconAlertCircle size={14} />;
      default: return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'paid' && invoice.status === 'PAID') ||
                      (activeTab === 'pending' && ['SENT', 'VIEWED'].includes(invoice.status)) ||
                      (activeTab === 'overdue' && invoice.status === 'OVERDUE') ||
                      (activeTab === 'draft' && invoice.status === 'DRAFT');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const calculateItemAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const addInvoiceItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].amount = calculateItemAmount(
          field === 'quantity' ? value : newItems[index].quantity,
          field === 'unitPrice' ? value : newItems[index].unitPrice
        );
      }
      
      return { ...prev, items: newItems };
    });
  };

  const handleSaveInvoice = () => {
    // Validation
    if (!formData.customerId || !formData.issueDate || !formData.dueDate) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        color: 'red'
      });
      return;
    }

    // Save logic would go here
    notifications.show({
      title: 'Success',
      message: 'Invoice saved successfully',
      color: 'green'
    });
    closeModal();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      issueDate: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      notes: '',
      taxRate: 16
    });
    setSelectedInvoice(null);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    notifications.show({
      title: 'Invoice Sent',
      message: `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.customerEmail}`,
      color: 'blue'
    });
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.filter(inv => inv.id !== selectedInvoice.id));
      notifications.show({
        title: 'Invoice Deleted',
        message: `Invoice ${selectedInvoice.invoiceNumber} has been deleted`,
        color: 'green'
      });
    }
    closeDeleteModal();
    setSelectedInvoice(null);
  };

  const getTabCounts = () => {
    return {
      all: invoices.length,
      paid: invoices.filter(inv => inv.status === 'PAID').length,
      pending: invoices.filter(inv => ['SENT', 'VIEWED'].includes(inv.status)).length,
      overdue: invoices.filter(inv => inv.status === 'OVERDUE').length,
      draft: invoices.filter(inv => inv.status === 'DRAFT').length
    };
  };

  const tabCounts = getTabCounts();

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
              <IconFileInvoice size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Invoices
            </h1>
            <Text color="dimmed">Manage customer invoices and billing</Text>
          </div>
          <Group>
            <Button leftSection={<IconRefresh size={16} />} variant="light">
              Refresh
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openModal}>
              Create Invoice
            </Button>
          </Group>
        </Group>
      </div>

      {/* Summary Cards */}
      <Grid className="mb-6">
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Invoices</Text>
                <Text fw={700} size="xl">{invoices.length}</Text>
              </div>
              <IconFileInvoice size={24} color="#228be6" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Amount</Text>
                <Text fw={700} size="xl">KES {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}</Text>
              </div>
              <IconCurrency size={24} color="#40c057" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Paid Amount</Text>
                <Text fw={700} size="xl">KES {invoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString()}</Text>
              </div>
              <IconCheck size={24} color="#51cf66" />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Outstanding</Text>
                <Text fw={700} size="xl">KES {invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0).toLocaleString()}</Text>
              </div>
              <IconAlertCircle size={24} color="#fd7e14" />
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Card className="card">
        {/* Filters and Search */}
        <Group justify="space-between" className="mb-4">
          <Group>
            <TextInput
              placeholder="Search invoices..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: '', label: 'All Statuses' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'SENT', label: 'Sent' },
                { value: 'VIEWED', label: 'Viewed' },
                { value: 'PAID', label: 'Paid' },
                { value: 'OVERDUE', label: 'Overdue' },
                { value: 'CANCELLED', label: 'Cancelled' }
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || '')}
              clearable
            />
          </Group>
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
          <Tabs.List>
            <Tabs.Tab value="all">All ({tabCounts.all})</Tabs.Tab>
            <Tabs.Tab value="draft">Draft ({tabCounts.draft})</Tabs.Tab>
            <Tabs.Tab value="pending">Pending ({tabCounts.pending})</Tabs.Tab>
            <Tabs.Tab value="paid">Paid ({tabCounts.paid})</Tabs.Tab>
            <Tabs.Tab value="overdue">Overdue ({tabCounts.overdue})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab} pt="md">
            {filteredInvoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <IconFileInvoice size={48} color="#ced4da" />
                <Text size="lg" color="dimmed" mt="md">No invoices found</Text>
                <Text color="dimmed">Create your first invoice to get started</Text>
              </div>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Issue Date</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Paid</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredInvoices.map((invoice) => (
                    <Table.Tr key={invoice.id}>
                      <Table.Td>
                        <Text fw={600}>{invoice.invoiceNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm">{invoice.customerName}</Text>
                          <Text size="xs" color="dimmed">{invoice.customerEmail}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>{new Date(invoice.issueDate).toLocaleDateString()}</Table.Td>
                      <Table.Td>{new Date(invoice.dueDate).toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <Text fw={600}>KES {invoice.totalAmount.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text color={invoice.paidAmount > 0 ? 'green' : 'dimmed'}>
                          KES {invoice.paidAmount.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getStatusColor(invoice.status)} 
                          variant="light"
                          leftSection={getStatusIcon(invoice.status)}
                        >
                          {invoice.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon 
                            variant="light" 
                            color="blue"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              openViewModal();
                            }}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="light" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="light">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconSend size={14} />} onClick={() => handleSendInvoice(invoice)}>
                                Send Invoice
                              </Menu.Item>
                              <Menu.Item leftSection={<IconDownload size={14} />}>
                                Download PDF
                              </Menu.Item>
                              <Menu.Item leftSection={<IconPrinter size={14} />}>
                                Print
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item 
                                leftSection={<IconTrash size={14} />} 
                                color="red"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  openDeleteModal();
                                }}
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
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

      {/* Create/Edit Invoice Modal */}
      <Modal 
        opened={modalOpened} 
        onClose={closeModal} 
        title="Create Invoice" 
        size="xl"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Customer"
                placeholder="Select customer"
                data={customers.map(c => ({ value: c.id, label: c.name }))}
                value={formData.customerId}
                onChange={(value) => setFormData(prev => ({ ...prev, customerId: value || '' }))}
                required
                searchable
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DateInput
                label="Issue Date"
                placeholder="Select date"
                value={formData.issueDate}
                onChange={(value) => setFormData(prev => ({ ...prev, issueDate: value || '' }))}
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DateInput
                label="Due Date"
                placeholder="Select date"
                value={formData.dueDate}
                onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value || '' }))}
                required
              />
            </Grid.Col>
          </Grid>

          <Divider label="Invoice Items" labelPosition="left" />

          {formData.items.map((item, index) => (
            <Grid key={index} align="end">
              <Grid.Col span={5}>
                <TextInput
                  label={index === 0 ? "Description" : ""}
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label={index === 0 ? "Quantity" : ""}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(value) => updateInvoiceItem(index, 'quantity', value || 0)}
                  min={1}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label={index === 0 ? "Unit Price" : ""}
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(value) => updateInvoiceItem(index, 'unitPrice', value || 0)}
                  min={0}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label={index === 0 ? "Amount" : ""}
                  value={item.amount}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={1}>
                {formData.items.length > 1 && (
                  <ActionIcon color="red" onClick={() => removeInvoiceItem(index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Grid.Col>
            </Grid>
          ))}

          <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addInvoiceItem}>
            Add Item
          </Button>

          <Grid>
            <Grid.Col span={8}>
              <Textarea
                label="Notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text>Subtotal:</Text>
                  <Text fw={600}>KES {calculateSubtotal().toLocaleString()}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Tax ({formData.taxRate}%):</Text>
                  <Text fw={600}>KES {calculateTaxAmount().toLocaleString()}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text fw={700} size="lg">Total:</Text>
                  <Text fw={700} size="lg">KES {calculateTotal().toLocaleString()}</Text>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSaveInvoice}>Save Invoice</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Invoice Modal */}
      <Modal 
        opened={viewModalOpened} 
        onClose={closeViewModal} 
        title={`Invoice ${selectedInvoice?.invoiceNumber}`} 
        size="lg"
      >
        {selectedInvoice && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Customer</Text>
                <Text fw={600}>{selectedInvoice.customerName}</Text>
                <Text size="sm" color="dimmed">{selectedInvoice.customerEmail}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" color="dimmed">Issue Date</Text>
                    <Text>{new Date(selectedInvoice.issueDate).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text size="sm" color="dimmed">Due Date</Text>
                    <Text>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</Text>
                  </div>
                </Group>
              </Grid.Col>
            </Grid>

            <Divider />

            <div>
              <Text fw={600} mb="sm">Items</Text>
              {selectedInvoice.items.map((item, index) => (
                <Group justify="space-between" key={index} py="xs">
                  <div style={{ flex: 1 }}>
                    <Text>{item.description}</Text>
                    <Text size="sm" color="dimmed">{item.quantity} × KES {item.unitPrice.toLocaleString()}</Text>
                  </div>
                  <Text fw={600}>KES {item.amount.toLocaleString()}</Text>
                </Group>
              ))}
            </div>

            <Divider />

            <Group justify="space-between">
              <Text>Subtotal:</Text>
              <Text>KES {selectedInvoice.subtotal.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tax:</Text>
              <Text>KES {selectedInvoice.taxAmount.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={700} size="lg">Total:</Text>
              <Text fw={700} size="lg">KES {selectedInvoice.totalAmount.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600} color="green">Paid:</Text>
              <Text fw={600} color="green">KES {selectedInvoice.paidAmount.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600} color="orange">Outstanding:</Text>
              <Text fw={600} color="orange">KES {(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toLocaleString()}</Text>
            </Group>

            {selectedInvoice.notes && (
              <>
                <Divider />
                <div>
                  <Text fw={600} mb="xs">Notes</Text>
                  <Text>{selectedInvoice.notes}</Text>
                </div>
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<IconDownload size={16} />}>
                Download PDF
              </Button>
              <Button leftSection={<IconSend size={16} />} onClick={() => handleSendInvoice(selectedInvoice)}>
                Send Invoice
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Invoice"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete invoice {selectedInvoice?.invoiceNumber}? This action cannot be undone.
          </Alert>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeleteModal}>Cancel</Button>
            <Button color="red" onClick={handleDeleteInvoice}>Delete Invoice</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default function InvoicesPageWrapper() {
  return (
    <AppLayout>
      <InvoicesPage />
    </AppLayout>
  );
} 