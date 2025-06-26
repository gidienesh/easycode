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
  Switch,
  Alert,
  Loader,
  Title,
  Paper,
  Divider
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
  IconAlertCircle
} from '@tabler/icons-react';

interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  parentId?: string;
  hierarchyLevel: number;
  isActive: boolean;
  balance: number;
  children?: ChartOfAccount[];
}

const accountTypes = [
  { value: 'ASSET', label: 'Asset' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'EQUITY', label: 'Equity' },
  { value: 'REVENUE', label: 'Revenue' },
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'COST_OF_GOODS_SOLD', label: 'Cost of Goods Sold' }
];

const mockAccounts: ChartOfAccount[] = [
  {
    id: '1',
    accountCode: '1000',
    accountName: 'Cash and Cash Equivalents',
    accountType: 'ASSET',
    hierarchyLevel: 0,
    isActive: true,
    balance: 250000
  },
  {
    id: '2',
    accountCode: '1001',
    accountName: 'Petty Cash',
    accountType: 'ASSET',
    parentId: '1',
    hierarchyLevel: 1,
    isActive: true,
    balance: 5000
  },
  {
    id: '3',
    accountCode: '1002',
    accountName: 'Bank Account - KCB',
    accountType: 'ASSET',
    parentId: '1',
    hierarchyLevel: 1,
    isActive: true,
    balance: 245000
  },
  {
    id: '4',
    accountCode: '1100',
    accountName: 'Accounts Receivable',
    accountType: 'ASSET',
    hierarchyLevel: 0,
    isActive: true,
    balance: 180000
  },
  {
    id: '5',
    accountCode: '1200',
    accountName: 'Inventory',
    accountType: 'ASSET',
    hierarchyLevel: 0,
    isActive: true,
    balance: 95000
  },
  {
    id: '6',
    accountCode: '2000',
    accountName: 'Accounts Payable',
    accountType: 'LIABILITY',
    hierarchyLevel: 0,
    isActive: true,
    balance: 85000
  },
  {
    id: '7',
    accountCode: '2100',
    accountName: 'Accrued Expenses',
    accountType: 'LIABILITY',
    hierarchyLevel: 0,
    isActive: true,
    balance: 25000
  },
  {
    id: '8',
    accountCode: '3000',
    accountName: 'Retained Earnings',
    accountType: 'EQUITY',
    hierarchyLevel: 0,
    isActive: true,
    balance: 150000
  },
  {
    id: '9',
    accountCode: '4000',
    accountName: 'Sales Revenue',
    accountType: 'REVENUE',
    hierarchyLevel: 0,
    isActive: true,
    balance: 450000
  },
  {
    id: '10',
    accountCode: '5000',
    accountName: 'Cost of Goods Sold',
    accountType: 'COST_OF_GOODS_SOLD',
    hierarchyLevel: 0,
    isActive: true,
    balance: 200000
  },
  {
    id: '11',
    accountCode: '6000',
    accountName: 'Operating Expenses',
    accountType: 'EXPENSE',
    hierarchyLevel: 0,
    isActive: true,
    balance: 120000
  },
  {
    id: '12',
    accountCode: '6001',
    accountName: 'Rent Expense',
    accountType: 'EXPENSE',
    parentId: '11',
    hierarchyLevel: 1,
    isActive: true,
    balance: 36000
  },
  {
    id: '13',
    accountCode: '6002',
    accountName: 'Utilities Expense',
    accountType: 'EXPENSE',
    parentId: '11',
    hierarchyLevel: 1,
    isActive: true,
    balance: 18000
  }
];

function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: '',
    parentId: '',
    isActive: true
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(mockAccounts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountCode.includes(searchTerm);
    const matchesType = !filterType || account.accountType === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (account?: ChartOfAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        parentId: account.parentId || '',
        isActive: account.isActive
      });
    } else {
      setEditingAccount(null);
      setFormData({
        accountCode: '',
        accountName: '',
        accountType: '',
        parentId: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: '',
      parentId: '',
      isActive: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData }
          : acc
      ));
    } else {
      // Create new account
      const newAccount: ChartOfAccount = {
        id: Date.now().toString(),
        ...formData,
        hierarchyLevel: formData.parentId ? 1 : 0,
        balance: 0
      };
      setAccounts([...accounts, newAccount]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'ASSET': return 'blue';
      case 'LIABILITY': return 'red';
      case 'EQUITY': return 'green';
      case 'REVENUE': return 'teal';
      case 'EXPENSE': return 'orange';
      case 'COST_OF_GOODS_SOLD': return 'purple';
      default: return 'gray';
    }
  };

  const getParentAccounts = () => {
    return accounts.filter(acc => acc.hierarchyLevel === 0);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconReceipt size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Chart of Accounts
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconReceipt size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Chart of Accounts
          </h1>
          <Group>
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={() => handleOpenModal()}
            >
              Add Account
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
                placeholder="Search accounts..."
                leftSection={<IconSearch size="1rem" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Filter by type"
                leftSection={<IconFilter size="1rem" />}
                data={[
                  { value: '', label: 'All Types' },
                  ...accountTypes
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value || '')}
                clearable
              />
            </Group>
          </Card>

          {/* Account Summary */}
          <Card className="card">
            <Title order={4} mb="md">Account Summary</Title>
            <Group>
              {accountTypes.map(type => {
                const count = accounts.filter(acc => acc.accountType === type.value).length;
                const total = accounts
                  .filter(acc => acc.accountType === type.value)
                  .reduce((sum, acc) => sum + acc.balance, 0);
                
                return (
                  <Paper key={type.value} p="md" withBorder>
                    <Text size="xs" color="dimmed" mb={4}>
                      {type.label}
                    </Text>
                    <Text size="lg" fw={600}>
                      {count} accounts
                    </Text>
                    <Text size="sm" color={getAccountTypeColor(type.value)}>
                      {formatCurrency(total)}
                    </Text>
                  </Paper>
                );
              })}
            </Group>
          </Card>

          {/* Accounts Table */}
          <Card className="card">
            <div className="card-header">
              <h3 className="card-title">Accounts ({filteredAccounts.length})</h3>
            </div>
            <div className="card-content">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Account Code</Table.Th>
                    <Table.Th>Account Name</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Balance</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAccounts.map((account) => (
                    <Table.Tr key={account.id}>
                      <Table.Td>
                        <Text fw={500}>
                          {account.accountCode}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <div style={{ paddingLeft: `${account.hierarchyLevel * 20}px` }}>
                          <Text size="sm">
                            {account.accountName}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getAccountTypeColor(account.accountType)} 
                          variant="light"
                          size="sm"
                        >
                          {account.accountType.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600}>
                          {formatCurrency(account.balance)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={account.isActive ? 'green' : 'red'} 
                          variant="light"
                          size="sm"
                        >
                          {account.isActive ? 'Active' : 'Inactive'}
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
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconEdit size="0.9rem" />}
                              onClick={() => handleOpenModal(account)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size="0.9rem" />}
                              color="red"
                              onClick={() => handleDelete(account.id)}
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
          title={editingAccount ? 'Edit Account' : 'Create New Account'}
          size="md"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Account Code"
                placeholder="e.g., 1000"
                value={formData.accountCode}
                onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                required
              />
              
              <TextInput
                label="Account Name"
                placeholder="e.g., Cash and Cash Equivalents"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
              />
              
              <Select
                label="Account Type"
                placeholder="Select account type"
                data={accountTypes}
                value={formData.accountType}
                onChange={(value) => setFormData({ ...formData, accountType: value || '' })}
                required
              />
              
              <Select
                label="Parent Account (Optional)"
                placeholder="Select parent account"
                data={[
                  { value: '', label: 'None (Top Level)' },
                  ...getParentAccounts().map(acc => ({
                    value: acc.id,
                    label: `${acc.accountCode} - ${acc.accountName}`
                  }))
                ]}
                value={formData.parentId}
                onChange={(value) => setFormData({ ...formData, parentId: value || '' })}
              />
              
              <Switch
                label="Active"
                checked={formData.isActive}
                onChange={(event) => setFormData({ ...formData, isActive: event.currentTarget.checked })}
              />

              <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
                <Text size="sm">
                  Account codes should follow your organization's numbering system. 
                  Assets typically start with 1, Liabilities with 2, Equity with 3, 
                  Revenue with 4, and Expenses with 5-6.
                </Text>
              </Alert>
              
              <Group justify="flex-end">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAccount ? 'Update Account' : 'Create Account'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
} 