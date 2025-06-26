import { useState, useEffect } from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { 
  Card, 
  Text, 
  Title, 
  Button, 
  Table, 
  Group, 
  Grid,
  Paper,
  Loader,
  Select,
  Badge,
  Alert
} from '@mantine/core';
import { 
  IconScale, 
  IconDownload,
  IconRefresh,
  IconPrinter,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  debitBalance: number;
  creditBalance: number;
}

interface TrialBalanceData {
  asOfDate: string;
  accounts: TrialBalanceItem[];
  totals: {
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    variance: number;
  };
}

function TrialBalancePage() {
  const [loading, setLoading] = useState(true);
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceData | null>(null);
  const [selectedDate, setSelectedDate] = useState('2024-01-31');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('');

  useEffect(() => {
    const mockData: TrialBalanceData = {
      asOfDate: 'January 31, 2024',
      accounts: [
        // Assets
        { accountCode: '1000', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET', debitBalance: 850000, creditBalance: 0 },
        { accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET', debitBalance: 320000, creditBalance: 0 },
        { accountCode: '1200', accountName: 'Inventory', accountType: 'ASSET', debitBalance: 450000, creditBalance: 0 },
        { accountCode: '1300', accountName: 'Prepaid Expenses', accountType: 'ASSET', debitBalance: 75000, creditBalance: 0 },
        { accountCode: '1500', accountName: 'Property, Plant & Equipment', accountType: 'ASSET', debitBalance: 2500000, creditBalance: 0 },
        { accountCode: '1600', accountName: 'Accumulated Depreciation', accountType: 'ASSET', debitBalance: 0, creditBalance: 450000 },
        { accountCode: '1700', accountName: 'Intangible Assets', accountType: 'ASSET', debitBalance: 180000, creditBalance: 0 },
        
        // Liabilities
        { accountCode: '2000', accountName: 'Accounts Payable', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 180000 },
        { accountCode: '2100', accountName: 'Accrued Expenses', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 95000 },
        { accountCode: '2200', accountName: 'Short-term Loans', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 250000 },
        { accountCode: '2300', accountName: 'Current Portion of Long-term Debt', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 120000 },
        { accountCode: '2500', accountName: 'Long-term Loans', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 800000 },
        { accountCode: '2600', accountName: 'Deferred Tax Liability', accountType: 'LIABILITY', debitBalance: 0, creditBalance: 45000 },
        
        // Equity
        { accountCode: '3000', accountName: 'Share Capital', accountType: 'EQUITY', debitBalance: 0, creditBalance: 1500000 },
        { accountCode: '3100', accountName: 'Retained Earnings', accountType: 'EQUITY', debitBalance: 0, creditBalance: 935000 },
        
        // Revenue
        { accountCode: '4000', accountName: 'Sales Revenue', accountType: 'REVENUE', debitBalance: 0, creditBalance: 2450000 },
        { accountCode: '4100', accountName: 'Service Revenue', accountType: 'REVENUE', debitBalance: 0, creditBalance: 580000 },
        { accountCode: '4200', accountName: 'Other Income', accountType: 'REVENUE', debitBalance: 0, creditBalance: 45000 },
        
        // Expenses
        { accountCode: '5000', accountName: 'Cost of Goods Sold', accountType: 'EXPENSE', debitBalance: 980000, creditBalance: 0 },
        { accountCode: '6100', accountName: 'Salaries and Wages', accountType: 'EXPENSE', debitBalance: 420000, creditBalance: 0 },
        { accountCode: '6200', accountName: 'Rent Expense', accountType: 'EXPENSE', debitBalance: 120000, creditBalance: 0 },
        { accountCode: '6300', accountName: 'Utilities', accountType: 'EXPENSE', debitBalance: 45000, creditBalance: 0 },
        { accountCode: '6400', accountName: 'Marketing', accountType: 'EXPENSE', debitBalance: 65000, creditBalance: 0 },
        { accountCode: '7000', accountName: 'Administrative Expenses', accountType: 'EXPENSE', debitBalance: 180000, creditBalance: 0 },
        { accountCode: '8000', accountName: 'Interest Expense', accountType: 'EXPENSE', debitBalance: 25000, creditBalance: 0 }
      ],
      totals: {
        totalDebits: 6210000,
        totalCredits: 6210000,
        isBalanced: true,
        variance: 0
      }
    };

    setTimeout(() => {
      setTrialBalanceData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedDate]);

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType) {
      case 'ASSET': return 'blue';
      case 'LIABILITY': return 'red';
      case 'EQUITY': return 'green';
      case 'REVENUE': return 'teal';
      case 'EXPENSE': return 'orange';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return `KES ${amount.toLocaleString()}`;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    notifications.show({
      title: 'Export Started',
      message: `Exporting Trial Balance as ${format.toUpperCase()}...`,
      color: 'blue'
    });
  };

  const filteredAccounts = trialBalanceData?.accounts.filter(account => 
    !accountTypeFilter || account.accountType === accountTypeFilter
  ) || [];

  const getAccountTypeTotals = (accountType: string) => {
    const accounts = trialBalanceData?.accounts.filter(acc => acc.accountType === accountType) || [];
    return {
      debits: accounts.reduce((sum, acc) => sum + acc.debitBalance, 0),
      credits: accounts.reduce((sum, acc) => sum + acc.creditBalance, 0)
    };
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (!trialBalanceData) {
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
              <IconScale size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Trial Balance
            </h1>
            <Text color="dimmed">Trial Balance as of {trialBalanceData.asOfDate}</Text>
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
            <Button leftSection={<IconDownload size={16} />} variant="light" onClick={() => handleExport('excel')}>
              Export Excel
            </Button>
          </Group>
        </Group>
      </div>

      {/* Balance Status Alert */}
      {trialBalanceData.totals.isBalanced ? (
        <Alert icon={<IconCheck size={16} />} color="green" className="mb-6">
          <Text fw={600}>Trial Balance is in balance!</Text>
          <Text size="sm">Total Debits: {formatCurrency(trialBalanceData.totals.totalDebits)} = Total Credits: {formatCurrency(trialBalanceData.totals.totalCredits)}</Text>
        </Alert>
      ) : (
        <Alert icon={<IconAlertCircle size={16} />} color="red" className="mb-6">
          <Text fw={600}>Trial Balance is OUT OF BALANCE!</Text>
          <Text size="sm">
            Variance: {formatCurrency(Math.abs(trialBalanceData.totals.variance))} 
            ({trialBalanceData.totals.variance > 0 ? 'Debits exceed Credits' : 'Credits exceed Debits'})
          </Text>
        </Alert>
      )}

      {/* Date Selection and Filters */}
      <Card className="mb-6">
        <Grid>
          <Grid.Col span={3}>
            <Select
              label="As of Date"
              value={selectedDate}
              onChange={(value) => setSelectedDate(value || '2024-01-31')}
              data={[
                { value: '2024-01-31', label: 'January 31, 2024' },
                { value: '2023-12-31', label: 'December 31, 2023' },
                { value: '2023-11-30', label: 'November 30, 2023' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Account Type Filter"
              value={accountTypeFilter}
              onChange={(value) => setAccountTypeFilter(value || '')}
              data={[
                { value: '', label: 'All Account Types' },
                { value: 'ASSET', label: 'Assets' },
                { value: 'LIABILITY', label: 'Liabilities' },
                { value: 'EQUITY', label: 'Equity' },
                { value: 'REVENUE', label: 'Revenue' },
                { value: 'EXPENSE', label: 'Expenses' }
              ]}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <div style={{ paddingTop: '25px' }}>
              <Button>Generate Report</Button>
            </div>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Summary by Account Type */}
      <Grid className="mb-6">
        {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map(accountType => {
          const totals = getAccountTypeTotals(accountType);
          const netBalance = totals.debits - totals.credits;
          return (
            <Grid.Col span={2.4} key={accountType}>
              <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>{accountType}S</Text>
                <Text fw={700} size="lg" color={getAccountTypeColor(accountType)}>
                  {formatCurrency(Math.abs(netBalance))}
                </Text>
                <Text size="xs" color="dimmed">
                  Dr: {formatCurrency(totals.debits)} | Cr: {formatCurrency(totals.credits)}
                </Text>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>

      {/* Trial Balance Table */}
      <Card>
        <div className="card-header">
          <Title order={3}>Trial Balance</Title>
          <Text color="dimmed">As of {trialBalanceData.asOfDate}</Text>
        </div>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Account Code</Table.Th>
              <Table.Th>Account Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Debit Balance</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Credit Balance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredAccounts.map((account) => (
              <Table.Tr key={account.accountCode}>
                <Table.Td>
                  <Text fw={600}>{account.accountCode}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>{account.accountName}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getAccountTypeColor(account.accountType)} variant="light">
                    {account.accountType}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={account.debitBalance > 0 ? 600 : 400}>
                    {formatCurrency(account.debitBalance)}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={account.creditBalance > 0 ? 600 : 400}>
                    {formatCurrency(account.creditBalance)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
            
            {/* Totals Row */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
              <Table.Td colSpan={3}>
                <Text fw={700} size="lg">TOTALS</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg" color={trialBalanceData.totals.isBalanced ? 'green' : 'red'}>
                  {formatCurrency(trialBalanceData.totals.totalDebits)}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg" color={trialBalanceData.totals.isBalanced ? 'green' : 'red'}>
                  {formatCurrency(trialBalanceData.totals.totalCredits)}
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Variance Row (if not balanced) */}
            {!trialBalanceData.totals.isBalanced && (
              <Table.Tr style={{ backgroundColor: '#ffebee' }}>
                <Table.Td colSpan={3}>
                  <Text fw={700} color="red">VARIANCE</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {trialBalanceData.totals.variance > 0 && (
                    <Text fw={700} color="red">
                      {formatCurrency(trialBalanceData.totals.variance)}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {trialBalanceData.totals.variance < 0 && (
                    <Text fw={700} color="red">
                      {formatCurrency(Math.abs(trialBalanceData.totals.variance))}
                    </Text>
                  )}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}

export default function TrialBalancePageWrapper() {
  return (
    <AppLayout>
      <TrialBalancePage />
    </AppLayout>
  );
} 