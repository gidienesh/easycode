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
  Divider
} from '@mantine/core';
import { 
  IconCurrencyDollar, 
  IconDownload,
  IconRefresh,
  IconPrinter,
  IconTrendingUp,
  IconTrendingDown
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface CashFlowItem {
  description: string;
  amount: number;
  level: number;
}

interface CashFlowData {
  period: string;
  operatingActivities: CashFlowItem[];
  investingActivities: CashFlowItem[];
  financingActivities: CashFlowItem[];
  totals: {
    netCashFromOperating: number;
    netCashFromInvesting: number;
    netCashFromFinancing: number;
    netIncreaseInCash: number;
    beginningCash: number;
    endingCash: number;
  };
}

function CashFlowPage() {
  const [loading, setLoading] = useState(true);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  useEffect(() => {
    const mockData: CashFlowData = {
      period: 'January 2024',
      operatingActivities: [
        { description: 'Net Income', amount: 1240000, level: 0 },
        { description: 'Adjustments to reconcile net income:', amount: 0, level: 0 },
        { description: '  Depreciation and Amortization', amount: 85000, level: 1 },
        { description: '  Bad Debt Expense', amount: 12000, level: 1 },
        { description: 'Changes in working capital:', amount: 0, level: 0 },
        { description: '  (Increase) Decrease in Accounts Receivable', amount: -45000, level: 1 },
        { description: '  (Increase) Decrease in Inventory', amount: -25000, level: 1 },
        { description: '  (Increase) Decrease in Prepaid Expenses', amount: 5000, level: 1 },
        { description: '  Increase (Decrease) in Accounts Payable', amount: 18000, level: 1 },
        { description: '  Increase (Decrease) in Accrued Expenses', amount: 8000, level: 1 }
      ],
      investingActivities: [
        { description: 'Purchase of Property, Plant & Equipment', amount: -180000, level: 0 },
        { description: 'Purchase of Intangible Assets', amount: -25000, level: 0 },
        { description: 'Sale of Equipment', amount: 15000, level: 0 }
      ],
      financingActivities: [
        { description: 'Proceeds from Long-term Debt', amount: 200000, level: 0 },
        { description: 'Repayment of Short-term Loans', amount: -50000, level: 0 },
        { description: 'Dividends Paid', amount: -120000, level: 0 },
        { description: 'Share Repurchases', amount: -75000, level: 0 }
      ],
      totals: {
        netCashFromOperating: 1298000,
        netCashFromInvesting: -190000,
        netCashFromFinancing: -45000,
        netIncreaseInCash: 1063000,
        beginningCash: 650000,
        endingCash: 1713000
      }
    };

    setTimeout(() => {
      setCashFlowData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = `KES ${Math.abs(amount).toLocaleString()}`;
    return isNegative ? `(${formatted})` : formatted;
  };

  const getCashFlowIcon = (amount: number) => {
    if (amount > 0) return <IconTrendingUp size={16} color="#51cf66" />;
    if (amount < 0) return <IconTrendingDown size={16} color="#ff6b6b" />;
    return null;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    notifications.show({
      title: 'Export Started',
      message: `Exporting Cash Flow Statement as ${format.toUpperCase()}...`,
      color: 'blue'
    });
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

  if (!cashFlowData) {
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
              <IconCurrencyDollar size="1.5rem" style={{ marginRight: '0.5rem' }} />
              Cash Flow Statement
            </h1>
            <Text color="dimmed">Statement of Cash Flows for {cashFlowData.period}</Text>
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
              label="Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || '2024-01')}
              data={[
                { value: '2024-01', label: 'January 2024' },
                { value: '2023-12', label: 'December 2023' },
                { value: '2023-11', label: 'November 2023' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <div style={{ paddingTop: '25px' }}>
              <Button>Generate Report</Button>
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
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Operating Cash Flow</Text>
                <Text fw={700} size="xl" color="green">{formatCurrency(cashFlowData.totals.netCashFromOperating)}</Text>
              </div>
              {getCashFlowIcon(cashFlowData.totals.netCashFromOperating)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Investing Cash Flow</Text>
                <Text fw={700} size="xl" color={cashFlowData.totals.netCashFromInvesting >= 0 ? 'green' : 'red'}>
                  {formatCurrency(cashFlowData.totals.netCashFromInvesting)}
                </Text>
              </div>
              {getCashFlowIcon(cashFlowData.totals.netCashFromInvesting)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Financing Cash Flow</Text>
                <Text fw={700} size="xl" color={cashFlowData.totals.netCashFromFinancing >= 0 ? 'green' : 'red'}>
                  {formatCurrency(cashFlowData.totals.netCashFromFinancing)}
                </Text>
              </div>
              {getCashFlowIcon(cashFlowData.totals.netCashFromFinancing)}
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Net Change in Cash</Text>
                <Text fw={700} size="xl" color={cashFlowData.totals.netIncreaseInCash >= 0 ? 'green' : 'red'}>
                  {formatCurrency(cashFlowData.totals.netIncreaseInCash)}
                </Text>
              </div>
              {getCashFlowIcon(cashFlowData.totals.netIncreaseInCash)}
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Cash Flow Statement Table */}
      <Card>
        <div className="card-header">
          <Title order={3}>Cash Flow Statement</Title>
          <Text color="dimmed">For the period ended {cashFlowData.period}</Text>
        </div>

        <Table>
          <Table.Tbody>
            {/* OPERATING ACTIVITIES */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">CASH FLOWS FROM OPERATING ACTIVITIES</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {cashFlowData.operatingActivities.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ paddingLeft: `${20 + (item.level * 20)}px` }}>
                  <Text size="sm" fw={item.level === 0 && item.amount !== 0 ? 600 : 400}>
                    {item.description}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {item.amount !== 0 && (
                    <Text fw={item.level === 0 ? 600 : 400}>
                      {formatCurrency(item.amount)}
                    </Text>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#e8f5e8' }}>
              <Table.Td>
                <Text fw={700} style={{ paddingLeft: '20px' }}>
                  Net Cash Provided by Operating Activities
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(cashFlowData.totals.netCashFromOperating)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={2}><Divider my="md" /></Table.Td>
            </Table.Tr>

            {/* INVESTING ACTIVITIES */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">CASH FLOWS FROM INVESTING ACTIVITIES</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {cashFlowData.investingActivities.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ paddingLeft: `${20 + (item.level * 20)}px` }}>
                  <Text size="sm">{item.description}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#ffebee' }}>
              <Table.Td>
                <Text fw={700} style={{ paddingLeft: '20px' }}>
                  Net Cash Used in Investing Activities
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(cashFlowData.totals.netCashFromInvesting)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={2}><Divider my="md" /></Table.Td>
            </Table.Tr>

            {/* FINANCING ACTIVITIES */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">CASH FLOWS FROM FINANCING ACTIVITIES</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {cashFlowData.financingActivities.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ paddingLeft: `${20 + (item.level * 20)}px` }}>
                  <Text size="sm">{item.description}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#fff3e0' }}>
              <Table.Td>
                <Text fw={700} style={{ paddingLeft: '20px' }}>
                  Net Cash Used in Financing Activities
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>{formatCurrency(cashFlowData.totals.netCashFromFinancing)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={2}><Divider my="lg" /></Table.Td>
            </Table.Tr>

            {/* NET INCREASE IN CASH */}
            <Table.Tr style={{ backgroundColor: '#e3f2fd' }}>
              <Table.Td>
                <Text fw={700} size="md">NET INCREASE (DECREASE) IN CASH</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="md">{formatCurrency(cashFlowData.totals.netIncreaseInCash)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* BEGINNING CASH */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600}>CASH AT BEGINNING OF PERIOD</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={600}>{formatCurrency(cashFlowData.totals.beginningCash)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* ENDING CASH */}
            <Table.Tr style={{ backgroundColor: '#e8f5e8', border: '2px solid #4caf50' }}>
              <Table.Td>
                <Text fw={700} size="lg">CASH AT END OF PERIOD</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg">{formatCurrency(cashFlowData.totals.endingCash)}</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}

export default function CashFlowPageWrapper() {
  return (
    <AppLayout>
      <CashFlowPage />
    </AppLayout>
  );
} 