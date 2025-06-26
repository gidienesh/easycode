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
  IconScale, 
  IconDownload,
  IconRefresh,
  IconPrinter
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface BalanceSheetItem {
  accountCode: string;
  accountName: string;
  amount: number;
  level: number;
}

interface BalanceSheetData {
  asOfDate: string;
  assets: {
    currentAssets: BalanceSheetItem[];
    fixedAssets: BalanceSheetItem[];
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: BalanceSheetItem[];
    longTermLiabilities: BalanceSheetItem[];
    totalLiabilities: number;
  };
  equity: {
    equityItems: BalanceSheetItem[];
    totalEquity: number;
  };
}

function BalanceSheetPage() {
  const [loading, setLoading] = useState(true);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null);
  const [selectedDate, setSelectedDate] = useState('2024-01-31');

  useEffect(() => {
    const mockData: BalanceSheetData = {
      asOfDate: 'January 31, 2024',
      assets: {
        currentAssets: [
          { accountCode: '1000', accountName: 'Cash and Cash Equivalents', amount: 850000, level: 0 },
          { accountCode: '1100', accountName: 'Accounts Receivable', amount: 320000, level: 0 },
          { accountCode: '1200', accountName: 'Inventory', amount: 450000, level: 0 },
          { accountCode: '1300', accountName: 'Prepaid Expenses', amount: 75000, level: 0 }
        ],
        fixedAssets: [
          { accountCode: '1500', accountName: 'Property, Plant & Equipment', amount: 2500000, level: 0 },
          { accountCode: '1600', accountName: 'Less: Accumulated Depreciation', amount: -450000, level: 0 },
          { accountCode: '1700', accountName: 'Intangible Assets', amount: 180000, level: 0 }
        ],
        totalAssets: 3925000
      },
      liabilities: {
        currentLiabilities: [
          { accountCode: '2000', accountName: 'Accounts Payable', amount: 180000, level: 0 },
          { accountCode: '2100', accountName: 'Accrued Expenses', amount: 95000, level: 0 },
          { accountCode: '2200', accountName: 'Short-term Loans', amount: 250000, level: 0 },
          { accountCode: '2300', accountName: 'Current Portion of Long-term Debt', amount: 120000, level: 0 }
        ],
        longTermLiabilities: [
          { accountCode: '2500', accountName: 'Long-term Loans', amount: 800000, level: 0 },
          { accountCode: '2600', accountName: 'Deferred Tax Liability', amount: 45000, level: 0 }
        ],
        totalLiabilities: 1490000
      },
      equity: {
        equityItems: [
          { accountCode: '3000', accountName: 'Share Capital', amount: 1500000, level: 0 },
          { accountCode: '3100', accountName: 'Retained Earnings', amount: 935000, level: 0 }
        ],
        totalEquity: 2435000
      }
    };

    setTimeout(() => {
      setBalanceSheetData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedDate]);

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = `KES ${Math.abs(amount).toLocaleString()}`;
    return isNegative ? `(${formatted})` : formatted;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    notifications.show({
      title: 'Export Started',
      message: `Exporting Balance Sheet as ${format.toUpperCase()}...`,
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

  if (!balanceSheetData) {
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
              Balance Sheet
            </h1>
            <Text color="dimmed">Statement of Financial Position as of {balanceSheetData.asOfDate}</Text>
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

      {/* Date Selection */}
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
            <div style={{ paddingTop: '25px' }}>
              <Button>Generate Report</Button>
            </div>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Key Ratios */}
      <Grid className="mb-6">
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Assets</Text>
            <Text fw={700} size="xl" color="blue">{formatCurrency(balanceSheetData.assets.totalAssets)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Liabilities</Text>
            <Text fw={700} size="xl" color="red">{formatCurrency(balanceSheetData.liabilities.totalLiabilities)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Total Equity</Text>
            <Text fw={700} size="xl" color="green">{formatCurrency(balanceSheetData.equity.totalEquity)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" radius="md" style={{ border: '1px solid #e9ecef' }}>
            <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Debt-to-Equity Ratio</Text>
            <Text fw={700} size="xl">
              {(balanceSheetData.liabilities.totalLiabilities / balanceSheetData.equity.totalEquity).toFixed(2)}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Balance Sheet Table */}
      <Card>
        <div className="card-header">
          <Title order={3}>Balance Sheet</Title>
          <Text color="dimmed">As of {balanceSheetData.asOfDate}</Text>
        </div>

        <Table>
          <Table.Tbody>
            {/* ASSETS */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">ASSETS</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>

            {/* Current Assets */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600} style={{ paddingLeft: '20px' }}>Current Assets</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {balanceSheetData.assets.currentAssets.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td style={{ paddingLeft: '40px' }}>
                  <Text size="sm">{item.accountCode} - {item.accountName}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#f1f3f4' }}>
              <Table.Td style={{ paddingLeft: '20px' }}>
                <Text fw={600}>Total Current Assets</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={600}>
                  {formatCurrency(balanceSheetData.assets.currentAssets.reduce((sum, item) => sum + item.amount, 0))}
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Fixed Assets */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600} style={{ paddingLeft: '20px' }}>Fixed Assets</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {balanceSheetData.assets.fixedAssets.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td style={{ paddingLeft: '40px' }}>
                  <Text size="sm">{item.accountCode} - {item.accountName}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#f1f3f4' }}>
              <Table.Td style={{ paddingLeft: '20px' }}>
                <Text fw={600}>Total Fixed Assets</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={600}>
                  {formatCurrency(balanceSheetData.assets.fixedAssets.reduce((sum, item) => sum + item.amount, 0))}
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Total Assets */}
            <Table.Tr style={{ backgroundColor: '#e3f2fd' }}>
              <Table.Td>
                <Text fw={700} size="md">TOTAL ASSETS</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="md">{formatCurrency(balanceSheetData.assets.totalAssets)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={2}><Divider my="md" /></Table.Td>
            </Table.Tr>

            {/* LIABILITIES */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">LIABILITIES</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>

            {/* Current Liabilities */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600} style={{ paddingLeft: '20px' }}>Current Liabilities</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {balanceSheetData.liabilities.currentLiabilities.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td style={{ paddingLeft: '40px' }}>
                  <Text size="sm">{item.accountCode} - {item.accountName}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#f1f3f4' }}>
              <Table.Td style={{ paddingLeft: '20px' }}>
                <Text fw={600}>Total Current Liabilities</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={600}>
                  {formatCurrency(balanceSheetData.liabilities.currentLiabilities.reduce((sum, item) => sum + item.amount, 0))}
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Long-term Liabilities */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600} style={{ paddingLeft: '20px' }}>Long-term Liabilities</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {balanceSheetData.liabilities.longTermLiabilities.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td style={{ paddingLeft: '40px' }}>
                  <Text size="sm">{item.accountCode} - {item.accountName}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: '#f1f3f4' }}>
              <Table.Td style={{ paddingLeft: '20px' }}>
                <Text fw={600}>Total Long-term Liabilities</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={600}>
                  {formatCurrency(balanceSheetData.liabilities.longTermLiabilities.reduce((sum, item) => sum + item.amount, 0))}
                </Text>
              </Table.Td>
            </Table.Tr>

            {/* Total Liabilities */}
            <Table.Tr style={{ backgroundColor: '#ffebee' }}>
              <Table.Td>
                <Text fw={700} size="md">TOTAL LIABILITIES</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="md">{formatCurrency(balanceSheetData.liabilities.totalLiabilities)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Spacer */}
            <Table.Tr>
              <Table.Td colSpan={2}><Divider my="md" /></Table.Td>
            </Table.Tr>

            {/* EQUITY */}
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td>
                <Text fw={700} size="lg">EQUITY</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {balanceSheetData.equity.equityItems.map((item) => (
              <Table.Tr key={item.accountCode}>
                <Table.Td style={{ paddingLeft: '20px' }}>
                  <Text size="sm">{item.accountCode} - {item.accountName}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}

            {/* Total Equity */}
            <Table.Tr style={{ backgroundColor: '#e8f5e8' }}>
              <Table.Td>
                <Text fw={700} size="md">TOTAL EQUITY</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="md">{formatCurrency(balanceSheetData.equity.totalEquity)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Total Liabilities + Equity */}
            <Table.Tr style={{ backgroundColor: '#e3f2fd', border: '2px solid #1976d2' }}>
              <Table.Td>
                <Text fw={700} size="lg">TOTAL LIABILITIES + EQUITY</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700} size="lg">
                  {formatCurrency(balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.totalEquity)}
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}

export default function BalanceSheetPageWrapper() {
  return (
    <AppLayout>
      <BalanceSheetPage />
    </AppLayout>
  );
} 