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
  Grid
} from '@mantine/core';
import {
  IconFileText,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconSearch,
  IconFilter,
  IconDownload,
  IconAlertCircle,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  description: string;
  reference: string;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
  createdBy: string;
  createdAt: string;
}

const mockAccounts = [
  { value: 'acc-001', label: '1000 - Cash and Cash Equivalents' },
  { value: 'acc-002', label: '1100 - Accounts Receivable' },
  { value: 'acc-003', label: '1200 - Inventory' },
  { value: 'acc-004', label: '2000 - Accounts Payable' },
  { value: 'acc-005', label: '3000 - Retained Earnings' },
  { value: 'acc-006', label: '4000 - Sales Revenue' },
  { value: 'acc-007', label: '5000 - Cost of Goods Sold' },
  { value: 'acc-008', label: '6000 - Operating Expenses' }
];

const mockJournalEntries: JournalEntry[] = [
  {
    id: 'je-001',
    entryNumber: 'JE-2024-001',
    entryDate: '2024-01-15',
    description: 'Initial setup entry',
    reference: 'REF-001',
    status: 'POSTED',
    totalDebit: 50000,
    totalCredit: 50000,
    createdBy: 'Admin User',
    createdAt: '2024-01-15T10:00:00Z',
    lines: [
      {
        id: 'jel-001',
        accountId: 'acc-001',
        accountCode: '1000',
        accountName: 'Cash and Cash Equivalents',
        description: 'Initial capital injection',
        debit: 50000,
        credit: 0
      },
      {
        id: 'jel-002',
        accountId: 'acc-005',
        accountCode: '3000',
        accountName: 'Retained Earnings',
        description: 'Initial capital injection',
        debit: 0,
        credit: 50000
      }
    ]
  },
  {
    id: 'je-002',
    entryNumber: 'JE-2024-002',
    entryDate: '2024-01-20',
    description: 'Sales transaction',
    reference: 'INV-001',
    status: 'POSTED',
    totalDebit: 25000,
    totalCredit: 25000,
    createdBy: 'Sales User',
    createdAt: '2024-01-20T14:30:00Z',
    lines: [
      {
        id: 'jel-003',
        accountId: 'acc-002',
        accountCode: '1100',
        accountName: 'Accounts Receivable',
        description: 'Sales on credit',
        debit: 25000,
        credit: 0
      },
      {
        id: 'jel-004',
        accountId: 'acc-006',
        accountCode: '4000',
        accountName: 'Sales Revenue',
        description: 'Revenue recognition',
        debit: 0,
        credit: 25000
      }
    ]
  },
  {
    id: 'je-003',
    entryNumber: 'JE-2024-003',
    entryDate: '2024-01-22',
    description: 'Office rent payment',
    reference: 'RENT-JAN',
    status: 'DRAFT',
    totalDebit: 15000,
    totalCredit: 15000,
    createdBy: 'Finance User',
    createdAt: '2024-01-22T09:15:00Z',
    lines: [
      {
        id: 'jel-005',
        accountId: 'acc-008',
        accountCode: '6000',
        accountName: 'Operating Expenses',
        description: 'January rent expense',
        debit: 15000,
        credit: 0
      },
      {
        id: 'jel-006',
        accountId: 'acc-001',
        accountCode: '1000',
        accountName: 'Cash and Cash Equivalents',
        description: 'Cash payment for rent',
        debit: 0,
        credit: 15000
      }
    ]
  }
];

function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    lines: [] as JournalEntryLine[]
  });

  useEffect(() => {
    setTimeout(() => {
      setEntries(mockJournalEntries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || entry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        entryDate: entry.entryDate,
        description: entry.description,
        reference: entry.reference,
        lines: [...entry.lines]
      });
    } else {
      setEditingEntry(null);
      setFormData({
        entryDate: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        lines: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    setFormData({
      entryDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: []
    });
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setViewingEntry(entry);
    setShowViewModal(true);
  };

  const addLine = () => {
    const newLine: JournalEntryLine = {
      id: `temp-${Date.now()}`,
      accountId: '',
      accountCode: '',
      accountName: '',
      description: '',
      debit: 0,
      credit: 0
    };
    setFormData({
      ...formData,
      lines: [...formData.lines, newLine]
    });
  };

  const updateLine = (index: number, field: keyof JournalEntryLine, value: any) => {
    const updatedLines = [...formData.lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    
    // If account is selected, update account code and name
    if (field === 'accountId') {
      const account = mockAccounts.find(acc => acc.value === value);
      if (account) {
        const [code, ...nameParts] = account.label.split(' - ');
        updatedLines[index].accountCode = code;
        updatedLines[index].accountName = nameParts.join(' - ');
      }
    }
    
    setFormData({ ...formData, lines: updatedLines });
  };

  const removeLine = (index: number) => {
    const updatedLines = formData.lines.filter((_, i) => i !== index);
    setFormData({ ...formData, lines: updatedLines });
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    return { totalDebit, totalCredit };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { totalDebit, totalCredit } = calculateTotals();
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Total debits must equal total credits');
      return;
    }

    if (formData.lines.length < 2) {
      alert('Journal entry must have at least 2 lines');
      return;
    }

    const newEntry: JournalEntry = {
      id: editingEntry?.id || `je-${Date.now()}`,
      entryNumber: editingEntry?.entryNumber || `JE-2024-${String(entries.length + 1).padStart(3, '0')}`,
      entryDate: formData.entryDate,
      description: formData.description,
      reference: formData.reference,
      status: 'DRAFT',
      totalDebit,
      totalCredit,
      lines: formData.lines,
      createdBy: 'Current User',
      createdAt: editingEntry?.createdAt || new Date().toISOString()
    };

    if (editingEntry) {
      setEntries(entries.map(entry => entry.id === editingEntry.id ? newEntry : entry));
    } else {
      setEntries([...entries, newEntry]);
    }

    handleCloseModal();
  };

  const handlePost = (entryId: string) => {
    if (confirm('Are you sure you want to post this journal entry? This action cannot be undone.')) {
      setEntries(entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'POSTED' as const }
          : entry
      ));
    }
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      setEntries(entries.filter(entry => entry.id !== entryId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return 'green';
      case 'DRAFT': return 'yellow';
      case 'REVERSED': return 'red';
      default: return 'gray';
    }
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconFileText size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Journal Entries
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
          <IconFileText size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Journal Entries
        </h1>
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal()}
          >
            New Entry
          </Button>
          <Button variant="outline" leftSection={<IconDownload size="1rem" />}>
            Export
          </Button>
        </Group>
      </div>

      <Stack gap="lg">
        {/* Filters */}
        <Card className="card">
          <Group>
            <TextInput
              placeholder="Search entries..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size="1rem" />}
              data={[
                { value: '', label: 'All Status' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'POSTED', label: 'Posted' },
                { value: 'REVERSED', label: 'Reversed' }
              ]}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value || '')}
              clearable
            />
          </Group>
        </Card>

        {/* Summary Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb={4}>Total Entries</Text>
              <Text size="xl" fw={600}>{entries.length}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb={4}>Draft Entries</Text>
              <Text size="xl" fw={600} color="yellow">
                {entries.filter(e => e.status === 'DRAFT').length}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb={4}>Posted Entries</Text>
              <Text size="xl" fw={600} color="green">
                {entries.filter(e => e.status === 'POSTED').length}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb={4}>Total Value</Text>
              <Text size="xl" fw={600}>
                {formatCurrency(entries.reduce((sum, e) => sum + e.totalDebit, 0))}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Journal Entries Table */}
        <Card className="card">
          <div className="card-header">
            <h3 className="card-title">Journal Entries ({filteredEntries.length})</h3>
          </div>
          <div className="card-content">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Entry Number</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Reference</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredEntries.map((entry) => (
                  <Table.Tr key={entry.id}>
                    <Table.Td>
                      <Text fw={500}>{entry.entryNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{entry.description}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{entry.reference}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600}>{formatCurrency(entry.totalDebit)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={getStatusColor(entry.status)} 
                        variant="light"
                        size="sm"
                      >
                        {entry.status}
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
                          <Menu.Item 
                            leftSection={<IconEye size="0.9rem" />}
                            onClick={() => handleViewEntry(entry)}
                          >
                            View Details
                          </Menu.Item>
                          {entry.status === 'DRAFT' && (
                            <>
                              <Menu.Item 
                                leftSection={<IconEdit size="0.9rem" />}
                                onClick={() => handleOpenModal(entry)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconCheck size="0.9rem" />}
                                color="green"
                                onClick={() => handlePost(entry.id)}
                              >
                                Post Entry
                              </Menu.Item>
                            </>
                          )}
                          <Menu.Divider />
                          <Menu.Item 
                            leftSection={<IconTrash size="0.9rem" />}
                            color="red"
                            onClick={() => handleDelete(entry.id)}
                          >
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
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title={editingEntry ? 'Edit Journal Entry' : 'Create New Journal Entry'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Entry Date"
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Reference"
                  placeholder="e.g., INV-001"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </Grid.Col>
            </Grid>
            
            <Textarea
              label="Description"
              placeholder="Enter journal entry description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <Divider label="Journal Entry Lines" />

            {formData.lines.map((line, index) => (
              <Paper key={line.id} p="md" withBorder>
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      label="Account"
                      placeholder="Select account"
                      data={mockAccounts}
                      value={line.accountId}
                      onChange={(value) => updateLine(index, 'accountId', value)}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Description"
                      placeholder="Line description"
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      label="Debit"
                      placeholder="0.00"
                      value={line.debit}
                      onChange={(value) => updateLine(index, 'debit', value || 0)}
                      min={0}
                      decimalScale={2}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      label="Credit"
                      placeholder="0.00"
                      value={line.credit}
                      onChange={(value) => updateLine(index, 'credit', value || 0)}
                      min={0}
                      decimalScale={2}
                    />
                  </Grid.Col>
                </Grid>
                <Group justify="flex-end" mt="sm">
                  <ActionIcon 
                    color="red" 
                    variant="light"
                    onClick={() => removeLine(index)}
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}

            <Button variant="outline" onClick={addLine}>
              <IconPlus size="1rem" style={{ marginRight: '0.5rem' }} />
              Add Line
            </Button>

            {/* Totals */}
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <Group>
                  <Text fw={600}>Total Debit: {formatCurrency(totalDebit)}</Text>
                  <Text fw={600}>Total Credit: {formatCurrency(totalCredit)}</Text>
                </Group>
                <Badge 
                  color={isBalanced ? 'green' : 'red'} 
                  variant="light"
                  leftSection={isBalanced ? <IconCheck size="0.8rem" /> : <IconX size="0.8rem" />}
                >
                  {isBalanced ? 'Balanced' : 'Out of Balance'}
                </Badge>
              </Group>
            </Paper>

            {!isBalanced && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                <Text size="sm">
                  Total debits must equal total credits. 
                  Difference: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </Text>
              </Alert>
            )}
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isBalanced || formData.lines.length < 2}>
                {editingEntry ? 'Update Entry' : 'Create Entry'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        opened={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Journal Entry Details"
        size="lg"
      >
        {viewingEntry && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Entry Number</Text>
                <Text fw={600}>{viewingEntry.entryNumber}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Date</Text>
                <Text fw={600}>{new Date(viewingEntry.entryDate).toLocaleDateString()}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Reference</Text>
                <Text fw={600}>{viewingEntry.reference}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" color="dimmed">Status</Text>
                <Badge color={getStatusColor(viewingEntry.status)} variant="light">
                  {viewingEntry.status}
                </Badge>
              </Grid.Col>
            </Grid>
            
            <div>
              <Text size="sm" color="dimmed">Description</Text>
              <Text fw={600}>{viewingEntry.description}</Text>
            </div>

            <Divider label="Entry Lines" />

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Debit</Table.Th>
                  <Table.Th>Credit</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {viewingEntry.lines.map((line) => (
                  <Table.Tr key={line.id}>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>{line.accountCode}</Text>
                        <Text size="xs" color="dimmed">{line.accountName}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{line.description}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600} color={line.debit > 0 ? 'green' : 'gray'}>
                        {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600} color={line.credit > 0 ? 'red' : 'gray'}>
                        {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Paper p="md" withBorder>
              <Group justify="space-between">
                <Text fw={600}>Total Debit: {formatCurrency(viewingEntry.totalDebit)}</Text>
                <Text fw={600}>Total Credit: {formatCurrency(viewingEntry.totalCredit)}</Text>
              </Group>
            </Paper>
          </Stack>
        )}
      </Modal>
    </div>
  );
}

export default function JournalEntriesPageWrapper() {
  return (
    <AppLayout>
      <JournalEntriesPage />
    </AppLayout>
  );
}