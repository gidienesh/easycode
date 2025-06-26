import { useState, useEffect } from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { 
  Card, 
  Text, 
  Title, 
  Button, 
  Table, 
  Group, 
  Stack,
  Grid,
  Paper,
  Loader,
  Select,
  Badge,
  Alert,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Checkbox
} from '@mantine/core';
import { 
  IconBuildingBank, 
  IconDownload,
  IconRefresh,
  IconPrinter,
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  isReconciled: boolean;
}

interface BookTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  isReconciled: boolean;
  reference?: string;
}

interface ReconciliationItem {
  id: string;
  description: string;
  amount: number;
  type: 'OUTSTANDING_DEPOSIT' | 'OUTSTANDING_CHECK' | 'BANK_ERROR' | 'BOOK_ERROR' | 'BANK_CHARGE' | 'INTEREST_EARNED';
}

interface BankReconciliationData {
  accountName: string;
  statementDate: string;
  bookBalance: number;
  bankBalance: number;
  bankTransactions: BankTransaction[];
  bookTransactions: BookTransaction[];
  reconciliationItems: ReconciliationItem[];
  reconciledBalance: number;
  isReconciled: boolean;
  variance: number;
}

function BankReconciliationPage() {
  const [loading, setLoading] = useState(true);
  const [reconciliationData, setReconciliationData] = useState<BankReconciliationData | null>(null);
  const [selectedAccount, setSelectedAccount] = useState('main-checking');
  const [selectedDate, setSelectedDate] = useState('2024-01-31');
  
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | BookTransaction | null>(null);

  useEffect(() => {
    const mockData: BankReconciliationData = {
      accountName: 'Main Checking Account',
      statementDate: 'January 31, 2024',
      bookBalance: 850000,
      bankBalance: 875000,
      bankTransactions: [
        {
          id: 'B1',
          date: '2024-01-30',
          description: 'Customer Payment - ABC Corp',
          amount: 150000,
          type: 'CREDIT',
          isReconciled: true
        },
        {
          id: 'B2',
          date: '2024-01-29',
          description: 'Bank Service Charge',
          amount: 2500,
          type: 'DEBIT',
          isReconciled: false
        },
        {
          id: 'B3',
          date: '2024-01-28',
          description: 'Check #1234',
          amount: 45000,
          type: 'DEBIT',
          isReconciled: true
        },
        {
          id: 'B4',
          date: '2024-01-27',
          description: 'Interest Earned',
          amount: 1200,
          type: 'CREDIT',
          isReconciled: false
        }
      ],
      bookTransactions: [
        {
          id: 'BK1',
          date: '2024-01-30',
          description: 'Customer Payment - ABC Corp',
          amount: 150000,
          type: 'CREDIT',
          isReconciled: true,
          reference: 'REC001'
        },
        {
          id: 'BK2',
          date: '2024-01-28',
          description: 'Check #1234 - Office Supplies',
          amount: 45000,
          type: 'DEBIT',
          isReconciled: true,
          reference: 'CHK1234'
        },
        {
          id: 'BK3',
          date: '2024-01-31',
          description: 'Outstanding Deposit',
          amount: 75000,
          type: 'CREDIT',
          isReconciled: false,
          reference: 'DEP002'
        },
        {
          id: 'BK4',
          date: '2024-01-31',
          description: 'Outstanding Check #1235',
          amount: 32000,
          type: 'DEBIT',
          isReconciled: false,
          reference: 'CHK1235'
        }
      ],
      reconciliationItems: [
        {
          id: 'R1',
          description: 'Outstanding Deposit in Transit',
          amount: 75000,
          type: 'OUTSTANDING_DEPOSIT'
        },
        {
          id: 'R2',
          description: 'Outstanding Check #1235',
          amount: -32000,
          type: 'OUTSTANDING_CHECK'
        },
        {
          id: 'R3',
          description: 'Bank Service Charge (not recorded)',
          amount: -2500,
          type: 'BANK_CHARGE'
        },
        {
          id: 'R4',
          description: 'Interest Earned (not recorded)',
          amount: 1200,
          type: 'INTEREST_EARNED'
        }
      ],
      reconciledBalance: 850000,
      isReconciled: false,
      variance: -8800
    };

    setTimeout(() => {
      setReconciliationData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedAccount, selectedDate]);

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = `KES ${Math.abs(amount).toLocaleString()}`;
    return isNegative ? `(${formatted})` : formatted;
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'CREDIT' ? 'green' : 'red';
  };

  const getReconciliationItemColor = (type: string) => {
    switch (type) {
      case 'OUTSTANDING_DEPOSIT': return 'blue';
      case 'OUTSTANDING_CHECK': return 'orange';
      case 'BANK_ERROR': return 'red';
      case 'BOOK_ERROR': return 'red';
      case 'BANK_CHARGE': return 'yellow';
      case 'INTEREST_EARNED': return 'green';
      default: return 'gray';
    }
  };

  const handleReconcileTransaction = (transactionId: string, isBank: boolean) => {
    if (!reconciliationData) return;
    
    if (isBank) {
      const updatedTransactions = reconciliationData.bankTransactions.map(t =>
        t.id === transactionId ? { ...t, isReconciled: !t.isReconciled } : t
      );
      setReconciliationData({
        ...reconciliationData,
        bankTransactions: updatedTransactions
      });
    } else {
      const updatedTransactions = reconciliationData.bookTransactions.map(t =>
        t.id === transactionId ? { ...t, isReconciled: !t.isReconciled } : t
      );
      setReconciliationData({
        ...reconciliationData,
        bookTransactions: updatedTransactions
      });
    }
    
    notifications.show({
      title: 'Transaction Updated',
      message: 'Reconciliation status updated successfully',
      color: 'blue'
    });
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    notifications.show({
      title: 'Export Started',
      message: `Exporting Bank Reconciliation as ${format.toUpperCase()}...`,
      color: 'blue'
    });
  };

  const calculateAdjustedBalances = () => {
    if (!reconciliationData) return { adjustedBankBalance: 0, adjustedBookBalance: 0 };
    
    const outstandingDeposits = reconciliationData.reconciliationItems
      .filter(item => item.type === 'OUTSTANDING_DEPOSIT')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const outstandingChecks = reconciliationData.reconciliationItems
      .filter(item => item.type === 'OUTSTANDING_CHECK')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const bookAdjustments = reconciliationData.reconciliationItems
      .filter(item => ['BANK_CHARGE', 'INTEREST_EARNED', 'BANK_ERROR'].includes(item.type))
      .reduce((sum, item) => sum + item.amount, 0);
    
    return {
      adjustedBankBalance: reconciliationData.bankBalance + outstandingDeposits + outstandingChecks,
      adjustedBookBalance: reconciliationData.bookBalance + bookAdjustments
    };
  };

  const { adjustedBankBalance, adjustedBookBalance } = calculateAdjustedBalances();

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (!reconciliationData) {
    return (
      <div className="container">
        <Text>No data available</Text>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <Group justify="space-between">
          <div>
            <h1 className="page-title">
              <IconBuildingBank size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Bank Reconciliation
            </h1>
            <Text color="dimmed">{reconciliationData.accountName} - {reconciliationData.statementDate}</Text>
          </div>
          <Group>
            <Button leftSection={<IconRefresh size={16} />} variant="light">
              Refresh
            </Button>
            <Button leftSection={<IconPrinter size={16} />} variant="light">
              Print
            </Button>
            <Button leftSection={<IconDownload size={16} />} onClick={() => handleExport('pdf')}>
              Export PDF
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openModal}>
              Add Adjustment
            </Button>
          </Group>
        </Group>
      </div>

      {/* Reconciliation Status */}
      {Math.abs(adjustedBankBalance - adjustedBookBalance) < 0.01 ? (
        <Alert icon={<IconCheck size={16} />} color="green" className="mb-6">
          <Text fw={600}>Bank Reconciliation is Complete!</Text>
          <Text size="sm">Adjusted balances match: {formatCurrency(adjustedBankBalance)}</Text>
        </Alert>
      ) : (
        <Alert icon={<IconAlertCircle size={16} />} color="red" className="mb-6">
          <Text fw={600}>Bank Reconciliation has discrepancies</Text>
          <Text size="sm">
            Variance: {formatCurrency(Math.abs(adjustedBankBalance - adjustedBookBalance))}
          </Text>
        </Alert>
      )}

      {/* Account and Date Selection */}
      <Card className="mb-6">
        <Grid>
          <Grid.Col span={4}>
            <Select
              label="Bank Account"
              value={selectedAccount}
              onChange={(value) => setSelectedAccount(value || 'main-checking')}
              data={[
                { value: 'main-checking', label: 'Main Checking Account' },
                { value: 'savings', label: 'Business Savings Account' },
                { value: 'petty-cash', label: 'Petty Cash Account' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Statement Date"
              value={selectedDate}
              onChange={(value) => setSelectedDate(value || '2024-01-31')}
              data={[
                { value: '2024-01-31', label: 'January 31, 2024' },
                { value: '2023-12-31', label: 'December 31, 2023' },
                { value: '2023-11-30', label: 'November 30, 2023' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <div style={{ paddingTop: '25px' }}>
              <Button>Start Reconciliation</Button>
            </div>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Balance Summary */}
      <Grid className="mb-6">
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Book Balance</Text>
            <Text fw={700} size="xl" color="blue">{formatCurrency(reconciliationData.bookBalance)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Bank Balance</Text>
            <Text fw={700} size="xl" color="green">{formatCurrency(reconciliationData.bankBalance)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Adjusted Bank</Text>
            <Text fw={700} size="xl">{formatCurrency(adjustedBankBalance)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Adjusted Book</Text>
            <Text fw={700} size="xl">{formatCurrency(adjustedBookBalance)}</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Bank Statement Transactions */}
        <Grid.Col span={6}>
          <Card>
            <div className="card-header">
              <Title order={4}>Bank Statement Transactions</Title>
              <Text color="dimmed">From bank statement</Text>
            </div>
            
            <Table size="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Reconciled</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reconciliationData.bankTransactions.map((transaction) => (
                  <Table.Tr key={transaction.id} style={{ backgroundColor: transaction.isReconciled ? '#f8f9fa' : 'transparent' }}>
                    <Table.Td>
                      <Text size="sm">{new Date(transaction.date).toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{transaction.description}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getTransactionTypeColor(transaction.type)} variant="light">
                        {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Checkbox
                        checked={transaction.isReconciled}
                        onChange={() => handleReconcileTransaction(transaction.id, true)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        {/* Book Transactions */}
        <Grid.Col span={6}>
          <Card>
            <div className="card-header">
              <Title order={4}>Book Transactions</Title>
              <Text color="dimmed">From accounting records</Text>
            </div>
            
            <Table size="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Reconciled</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reconciliationData.bookTransactions.map((transaction) => (
                  <Table.Tr key={transaction.id} style={{ backgroundColor: transaction.isReconciled ? '#f8f9fa' : 'transparent' }}>
                    <Table.Td>
                      <Text size="sm">{new Date(transaction.date).toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{transaction.description}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getTransactionTypeColor(transaction.type)} variant="light">
                        {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Checkbox
                        checked={transaction.isReconciled}
                        onChange={() => handleReconcileTransaction(transaction.id, false)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Reconciliation Items */}
      <Card className="mt-6">
        <div className="card-header">
          <Title order={4}>Reconciliation Adjustments</Title>
          <Text color="dimmed">Outstanding items and adjustments</Text>
        </div>
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {reconciliationData.reconciliationItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text size="sm">{item.description}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getReconciliationItemColor(item.type)} variant="light">
                    {item.type.replace('_', ' ')}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={600} color={item.amount >= 0 ? 'green' : 'red'}>
                    {formatCurrency(item.amount)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Button size="xs" variant="light" leftSection={<IconEdit size={12} />}>
                      Edit
                    </Button>
                    <Button size="xs" variant="light" color="red" leftSection={<IconTrash size={12} />}>
                      Remove
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Add Adjustment Modal */}
      <Modal opened={modalOpened} onClose={closeModal} title="Add Reconciliation Adjustment">
        <Stack gap="md">
          <TextInput
            label="Description"
            placeholder="Enter description"
            required
          />
          <Select
            label="Type"
            placeholder="Select adjustment type"
            data={[
              { value: 'OUTSTANDING_DEPOSIT', label: 'Outstanding Deposit' },
              { value: 'OUTSTANDING_CHECK', label: 'Outstanding Check' },
              { value: 'BANK_CHARGE', label: 'Bank Charge' },
              { value: 'INTEREST_EARNED', label: 'Interest Earned' },
              { value: 'BANK_ERROR', label: 'Bank Error' },
              { value: 'BOOK_ERROR', label: 'Book Error' }
            ]}
            required
          />
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            required
          />
          <Textarea
            label="Notes"
            placeholder="Additional notes"
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeModal}>Cancel</Button>
            <Button onClick={closeModal}>Add Adjustment</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default function BankReconciliationPageWrapper() {
  return (
    <AppLayout>
      <BankReconciliationPage />
    </AppLayout>
  );
} 