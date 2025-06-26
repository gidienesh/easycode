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
  Progress,
  Divider
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { 
  IconReportAnalytics, 
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconPrinter,
  IconShare
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface IncomeStatementItem {
  accountCode: string;
  accountName: string;
  currentPeriod: number;
  previousPeriod: number;
  variance: number;
  variancePercent: number;
  level: number; // For indentation
}

interface IncomeStatementData {
  period: string;
  previousPeriod: string;
  revenue: IncomeStatementItem[];
  expenses: IncomeStatementItem[];
  totals: {
    totalRevenue: number;
    totalExpenses: number;
    grossProfit: number;
    netIncome: number;
    previousTotalRevenue: number;
    previousTotalExpenses: number;
    previousGrossProfit: number;
    previousNetIncome: number;
  };
}

function IncomeStatementPage() {
  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState<IncomeStatementData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [comparisonPeriod, setComparisonPeriod] = useState('2023-01');
  const [periodType, setPeriodType] = useState('monthly');

  // Mock data
  useEffect(() => {
    const mockData: IncomeStatementData = {
      period: 'January 2024',
      previousPeriod: 'January 2023',
      revenue: [
        {
          accountCode: '4000',
          accountName: 'Sales Revenue',
          currentPeriod: 2450000,
          previousPeriod: 2180000,
          variance: 270000,
          variancePercent: 12.4,
          level: 0
        },
        {
          accountCode: '4100',
          accountName: 'Service Revenue',
          currentPeriod: 580000,
          previousPeriod: 520000,
          variance: 60000,
          variancePercent: 11.5,
          level: 0
        },
        {
          accountCode: '4200',
          accountName: 'Other Income',
          currentPeriod: 45000,
          previousPeriod: 38000,
          variance: 7000,
          variancePercent: 18.4,
          level: 0
        }
      ],
      expenses: [
        {
          accountCode: '5000',
          accountName: 'Cost of Goods Sold',
          currentPeriod: 980000,
          previousPeriod: 872000,
          variance: 108000,
          variancePercent: 12.4,
          level: 0
        },
        {
          accountCode: '6000',
          accountName: 'Operating Expenses',
          currentPeriod: 650000,
          previousPeriod: 620000,
          variance: 30000,
          variancePercent: 4.8,
          level: 0
        },
        {
          accountCode: '6100',
          accountName: '  Salaries and Wages',
          currentPeriod: 420000,
          previousPeriod: 400000,
          variance: 20000,
          variancePercent: 5.0,
          level: 1
        },
        {
          accountCode: '6200',
          accountName: '  Rent Expense',
          currentPeriod: 120000,
          previousPeriod: 120000,
          variance: 0,
          variancePercent: 0,
          level: 1
        },
        {
          accountCode: '6300',
          accountName: '  Utilities',
          currentPeriod: 45000,
          previousPeriod: 42000,
          variance: 3000,
          variancePercent: 7.1,
          level: 1
        },
        {
          accountCode: '6400',
          accountName: '  Marketing',
          currentPeriod: 65000,
          previousPeriod: 58000,
          variance: 7000,
          variancePercent: 12.1,
          level: 1
        },
        {
          accountCode: '7000',
          accountName: 'Administrative Expenses',
          currentPeriod: 180000,
          previousPeriod: 165000,
          variance: 15000,
          variancePercent: 9.1,
          level: 0
        },
        {
          accountCode: '8000',
          accountName: 'Interest Expense',
          currentPeriod: 25000,
          previousPeriod: 30000,
          variance: -5000,
          variancePercent: -16.7,
          level: 0
        }
      ],
      totals: {
        totalRevenue: 3075000,
        totalExpenses: 1835000,
        grossProfit: 2095000,
        netIncome: 1240000,
        previousTotalRevenue: 2738000,
        previousTotalExpenses: 1687000,
        previousGrossProfit: 1866000,
        previousNetIncome: 1051000
      }
    };

    setTimeout(() => {
      setStatementData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod, comparisonPeriod]);

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <IconTrendingUp size={14} color="#51cf66" />;
    if (variance < 0) return <IconTrendingDown size={14} color="#ff6b6b" />;
    return <IconMinus size={14} color="#868e96" />;
  };

  const getVarianceColor = (variance: number, isExpense: boolean = false) => {
    if (variance === 0) return 'dimmed';
    // For revenue, positive is good (green), negative is bad (red)
    // For expenses, positive is bad (red), negative is good (green)
    if (isExpense) {
      return variance > 0 ? 'red' : 'green';
    } else {
      return variance > 0 ? 'green' : 'red';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${Math.abs(amount).toLocaleString()}`;
  };

  const calculateMargins = () => {
    if (!statementData) return { grossMargin: 0, netMargin: 0, previousGrossMargin: 0, previousNetMargin: 0 };
    
    const { totals } = statementData;
    return {
      grossMargin: (totals.grossProfit / totals.totalRevenue) * 100,
      netMargin: (totals.netIncome / totals.totalRevenue) * 100,
      previousGrossMargin: (totals.previousGrossProfit / totals.previousTotalRevenue) * 100,
      previousNetMargin: (totals.previousNetIncome / totals.previousTotalRevenue) * 100
    };
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    notifications.show({
      title: 'Export Started',
      message: `Exporting Income Statement as ${format.toUpperCase()}...`,
      color: 'blue'
    });
  };

  const margins = calculateMargins();

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (!statementData) {
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
              <IconReportAnalytics size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Income Statement
            </h1>
            <Text color="dimmed">Profit & Loss Statement for {statementData.period}</Text>
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

      {/* Period Selection */}
      <Card className="mb-6">
        <Grid>
          <Grid.Col span={3}>
            <Select
              label="Period Type"
              value={periodType}
              onChange={(value) => setPeriodType(value || 'monthly')}
              data={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Current Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || '2024-01')}
              data={[
                { value: '2024-01', label: 'January 2024' },
                { value: '2023-12', label: 'December 2023' },
                { value: '2023-11', label: 'November 2023' },
                { value: '2023-10', label: 'October 2023' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Comparison Period"
              value={comparisonPeriod}
              onChange={(value) => setComparisonPeriod(value || '2023-01')}
              data={[
                { value: '2023-01', label: 'January 2023' },
                { value: '2022-12', label: 'December 2022' },
                { value: '2022-11', label: 'November 2022' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <div style={{ paddingTop: '25px' }}>
              <Button fullWidth>Generate Report</Button>
            </div>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Key Metrics */}
      <Grid className="mb-6">
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Revenue</Text>
                <Text fw={700} size="xl" color="green">{formatCurrency(statementData.totals.totalRevenue)}</Text>
                <Text size="xs" color="dimmed">
                  vs {formatCurrency(statementData.totals.previousTotalRevenue)} last period
                </Text>
              </div>
              {getVarianceIcon(statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Gross Profit</Text>
                <Text fw={700} size="xl" color="blue">{formatCurrency(statementData.totals.grossProfit)}</Text>
                <Text size="xs" color="dimmed">
                  {margins.grossMargin.toFixed(1)}% margin
                </Text>
              </div>
              {getVarianceIcon(statementData.totals.grossProfit - statementData.totals.previousGrossProfit)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Net Income</Text>
                <Text fw={700} size="xl" color="green">{formatCurrency(statementData.totals.netIncome)}</Text>
                <Text size="xs" color="dimmed">
                  {margins.netMargin.toFixed(1)}% margin
                </Text>
              </div>
              {getVarianceIcon(statementData.totals.netIncome - statementData.totals.previousNetIncome)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <div>
              <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Profit Margin Trend</Text>
              <Stack gap="xs" mt="xs">
                <div>
                  <Group justify="space-between">
                    <Text size="sm">Current</Text>
                    <Text size="sm" fw={600}>{margins.netMargin.toFixed(1)}%</Text>
                  </Group>
                  <Progress value={margins.netMargin} color="green" size="sm" />
                </div>
                <div>
                  <Group justify="space-between">
                    <Text size="sm">Previous</Text>
                    <Text size="sm" fw={600}>{margins.previousNetMargin.toFixed(1)}%</Text>
                  </Group>
                  <Progress value={margins.previousNetMargin} color="gray" size="sm" />
                </div>
              </Stack>
            </div>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Income Statement Table */}
      <Card>
        <div className="card-header">
          <Title order={3}>Income Statement - Comparative Analysis</Title>
          <Text color="dimmed">
            Comparing {statementData.period} vs {statementData.previousPeriod}
          </Text>
        </div>

        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '40%' }}>Account</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>{statementData.period}</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>{statementData.previousPeriod}</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Variance</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>% Change</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {/* Revenue Section */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="md">REVENUE</Text>
              </Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {statementData.revenue.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td>
                  <div style={{ paddingLeft: `${item.level * 20}px` }}>
                    <Text size="sm">
                      {item.accountCode} - {item.accountName}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={600}>{formatCurrency(item.currentPeriod)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.previousPeriod)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Group justify="flex-end" gap={4}>
                    {getVarianceIcon(item.variance)}
                    <Text color={getVarianceColor(item.variance)}>
                      {formatCurrency(item.variance)}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text color={getVarianceColor(item.variance)}>
                    {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
            
            {/* Total Revenue */}
            <Table.Tr style={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
              <Table.Td>
                <Text fw={700}>TOTAL REVENUE</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(statementData.totals.totalRevenue)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(statementData.totals.previousTotalRevenue)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Group justify="flex-end" gap={4}>
                  {getVarianceIcon(statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue)}
                  <Text fw={700} color={getVarianceColor(statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue)}>
                    {formatCurrency(statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue)}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} color={getVarianceColor(statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue)}>
                  {(((statementData.totals.totalRevenue - statementData.totals.previousTotalRevenue) / statementData.totals.previousTotalRevenue) * 100).toFixed(1)}%
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={5}><Divider /></Table.Td>
            </Table.Tr>

            {/* Expenses Section */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="md">EXPENSES</Text>
              </Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {statementData.expenses.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td>
                  <div style={{ paddingLeft: `${item.level * 20}px` }}>
                    <Text size="sm">
                      {item.accountCode} - {item.accountName}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={600}>{formatCurrency(item.currentPeriod)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.previousPeriod)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Group justify="flex-end" gap={4}>
                    {getVarianceIcon(item.variance)}
                    <Text color={getVarianceColor(item.variance, true)}>
                      {formatCurrency(item.variance)}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text color={getVarianceColor(item.variance, true)}>
                    {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}

            {/* Total Expenses */}
            <Table.Tr style={{ backgroundColor: '#ffebee', fontWeight: 'bold' }}>
              <Table.Td>
                <Text fw={700}>TOTAL EXPENSES</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(statementData.totals.totalExpenses)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(statementData.totals.previousTotalExpenses)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Group justify="flex-end" gap={4}>
                  {getVarianceIcon(statementData.totals.totalExpenses - statementData.totals.previousTotalExpenses)}
                  <Text fw={700} color={getVarianceColor(statementData.totals.totalExpenses - statementData.totals.previousTotalExpenses, true)}>
                    {formatCurrency(statementData.totals.totalExpenses - statementData.totals.previousTotalExpenses)}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} color={getVarianceColor(statementData.totals.totalExpenses - statementData.totals.previousTotalExpenses, true)}>
                  {(((statementData.totals.totalExpenses - statementData.totals.previousTotalExpenses) / statementData.totals.previousTotalExpenses) * 100).toFixed(1)}%
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Net Income */}
            <Table.Tr style={{ backgroundColor: '#e8f5e8', fontWeight: 'bold' }}>
              <Table.Td>
                <Text fw={700} size="lg">NET INCOME</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg" color="green">{formatCurrency(statementData.totals.netIncome)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg">{formatCurrency(statementData.totals.previousNetIncome)}</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Group justify="flex-end" gap={4}>
                  {getVarianceIcon(statementData.totals.netIncome - statementData.totals.previousNetIncome)}
                  <Text fw={700} size="lg" color={getVarianceColor(statementData.totals.netIncome - statementData.totals.previousNetIncome)}>
                    {formatCurrency(statementData.totals.netIncome - statementData.totals.previousNetIncome)}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg" color={getVarianceColor(statementData.totals.netIncome - statementData.totals.previousNetIncome)}>
                  {(((statementData.totals.netIncome - statementData.totals.previousNetIncome) / statementData.totals.previousNetIncome) * 100).toFixed(1)}%
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}

export default function IncomeStatementPageWrapper() {
  return (
    <AppLayout>
      <IncomeStatementPage />
    </AppLayout>
  );
} 