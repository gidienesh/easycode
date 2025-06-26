import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Badge,
  ActionIcon,
  Menu,
  Progress,
  SimpleGrid,
  Title,
  Divider,
  Paper,
  Table,
  Avatar,
  Anchor,
  Alert
} from '@mantine/core';
import {
  IconCash,
  IconTrendingUp,
  IconTrendingDown,
  IconReceipt,
  IconCreditCard,
  IconWallet,
  IconChartBar,
  IconFileInvoice,
  IconBuildingBank,
  IconCalculator,
  IconReportMoney,
  IconChartPie,
  IconAlertCircle,
  IconDots,
  IconEye,
  IconEdit,
  IconPlus,
  IconArrowUp,
  IconArrowDown,
  IconCurrency,
  IconCalendar
} from '@tabler/icons-react';

interface FinancialKPI {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface RecentTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

interface OutstandingItem {
  id: string;
  type: 'receivable' | 'payable';
  party: string;
  amount: number;
  dueDate: string;
  overdueDays?: number;
}

export function FinancePage() {
  const [kpis, setKpis] = useState<FinancialKPI[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [outstandingItems, setOutstandingItems] = useState<OutstandingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setKpis([
        {
          title: 'Total Revenue',
          value: 'KES 2,450,000',
          change: '+12.5%',
          changeType: 'positive',
          icon: <IconTrendingUp size="1.5rem" />,
          color: 'green'
        },
        {
          title: 'Total Expenses',
          value: 'KES 1,180,000',
          change: '+3.2%',
          changeType: 'negative',
          icon: <IconTrendingDown size="1.5rem" />,
          color: 'red'
        },
        {
          title: 'Net Profit',
          value: 'KES 1,270,000',
          change: '+18.7%',
          changeType: 'positive',
          icon: <IconCash size="1.5rem" />,
          color: 'blue'
        },
        {
          title: 'Cash Balance',
          value: 'KES 850,000',
          change: '+5.4%',
          changeType: 'positive',
          icon: <IconWallet size="1.5rem" />,
          color: 'teal'
        },
        {
          title: 'Accounts Receivable',
          value: 'KES 320,000',
          change: '-2.1%',
          changeType: 'positive',
          icon: <IconReceipt size="1.5rem" />,
          color: 'orange'
        },
        {
          title: 'Accounts Payable',
          value: 'KES 180,000',
          change: '-8.3%',
          changeType: 'positive',
          icon: <IconCreditCard size="1.5rem" />,
          color: 'purple'
        }
      ]);

      setRecentTransactions([
        {
          id: '1',
          type: 'income',
          description: 'Payment from ABC Corp',
          amount: 45000,
          date: '2024-01-15',
          status: 'completed',
          category: 'Sales'
        },
        {
          id: '2',
          type: 'expense',
          description: 'Office Rent Payment',
          amount: 25000,
          date: '2024-01-14',
          status: 'completed',
          category: 'Rent'
        },
        {
          id: '3',
          type: 'income',
          description: 'Service Revenue - XYZ Ltd',
          amount: 32000,
          date: '2024-01-13',
          status: 'pending',
          category: 'Services'
        },
        {
          id: '4',
          type: 'expense',
          description: 'Equipment Purchase',
          amount: 18000,
          date: '2024-01-12',
          status: 'completed',
          category: 'Equipment'
        },
        {
          id: '5',
          type: 'income',
          description: 'Consulting Fee',
          amount: 28000,
          date: '2024-01-11',
          status: 'completed',
          category: 'Consulting'
        }
      ]);

      setOutstandingItems([
        {
          id: '1',
          type: 'receivable',
          party: 'ABC Corporation',
          amount: 85000,
          dueDate: '2024-01-20',
          overdueDays: 0
        },
        {
          id: '2',
          type: 'payable',
          party: 'Office Supplies Ltd',
          amount: 12000,
          dueDate: '2024-01-18',
          overdueDays: 2
        },
        {
          id: '3',
          type: 'receivable',
          party: 'Tech Solutions Inc',
          amount: 65000,
          dueDate: '2024-01-10',
          overdueDays: 10
        },
        {
          id: '4',
          type: 'payable',
          party: 'Utility Company',
          amount: 8500,
          dueDate: '2024-01-25',
          overdueDays: 0
        }
      ]);

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
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return <IconArrowUp size="0.8rem" />;
      case 'negative': return <IconArrowDown size="0.8rem" />;
      default: return null;
    }
  };

  const quickActions = [
    { label: 'Create Invoice', icon: <IconFileInvoice size="1rem" />, color: 'blue', href: '/finance/invoices' },
    { label: 'Record Payment', icon: <IconWallet size="1rem" />, color: 'green', href: '/finance/payments' },
    { label: 'Journal Entry', icon: <IconEdit size="1rem" />, color: 'orange', href: '/finance/journal-entries' },
    { label: 'View Reports', icon: <IconChartBar size="1rem" />, color: 'purple', href: '/finance/reports' },
    { label: 'Reconcile Bank', icon: <IconBuildingBank size="1rem" />, color: 'teal', href: '/finance/bank-reconciliation' },
    { label: 'Manage Budget', icon: <IconChartPie size="1rem" />, color: 'pink', href: '/finance/budgets' }
  ];

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconCash size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Finance & Accounting
          </h1>
        </div>
        <Text>Loading financial data...</Text>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconCash size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Finance & Accounting
        </h1>
        <Group>
          <Button leftSection={<IconPlus size="1rem" />} color="blue">
            New Transaction
          </Button>
          <Button variant="outline" leftSection={<IconChartBar size="1rem" />}>
            Generate Report
          </Button>
        </Group>
      </div>

      <Stack spacing="lg">
        {/* Financial KPIs */}
        <div>
          <Title order={3} mb="md">Financial Overview</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {kpis.map((kpi, index) => (
              <Card key={index} className="card" padding="lg">
                <Group justify="space-between" mb="xs">
                  <div style={{ color: `var(--mantine-color-${kpi.color}-6)` }}>
                    {kpi.icon}
                  </div>
                  <Badge 
                    color={kpi.changeType === 'positive' ? 'green' : kpi.changeType === 'negative' ? 'red' : 'gray'}
                    variant="light"
                    leftSection={getChangeIcon(kpi.changeType)}
                  >
                    {kpi.change}
                  </Badge>
                </Group>
                <Text size="xs" color="dimmed" mb={4}>
                  {kpi.title}
                </Text>
                <Text size="xl" fw={700}>
                  {kpi.value}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        {/* Quick Actions */}
        <div>
          <Title order={3} mb="md">Quick Actions</Title>
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
            {quickActions.map((action, index) => (
              <Card key={index} className="card" padding="md" style={{ cursor: 'pointer' }}>
                <Stack align="center" spacing="xs">
                  <ActionIcon size="xl" color={action.color} variant="light">
                    {action.icon}
                  </ActionIcon>
                  <Text size="sm" ta="center" fw={500}>
                    {action.label}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        <Grid>
          {/* Recent Transactions */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card className="card">
              <div className="card-header">
                <Group justify="space-between">
                  <h3 className="card-title">Recent Transactions</h3>
                  <Anchor href="/finance/transactions" size="sm">
                    View All
                  </Anchor>
                </Group>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {recentTransactions.map((transaction) => (
                      <Table.Tr key={transaction.id}>
                        <Table.Td>
                          <Group spacing="sm">
                            <Avatar
                              size="sm"
                              color={transaction.type === 'income' ? 'green' : 'red'}
                              radius="xl"
                            >
                              {transaction.type === 'income' ? <IconArrowUp size="0.8rem" /> : <IconArrowDown size="0.8rem" />}
                            </Avatar>
                            <div>
                              <Text size="sm" fw={500}>
                                {transaction.description}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" size="sm">
                            {transaction.category}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text 
                            fw={600} 
                            color={transaction.type === 'income' ? 'green' : 'red'}
                          >
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(transaction.status)} variant="light" size="sm">
                            {transaction.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" color="dimmed">
                            {new Date(transaction.date).toLocaleDateString()}
                          </Text>
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
                                Edit
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
          </Grid.Col>

          {/* Outstanding Items */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Outstanding Items</h3>
              </div>
              <div className="card-content">
                <Stack spacing="sm">
                  {outstandingItems.map((item) => (
                    <Paper key={item.id} p="sm" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Badge 
                          color={item.type === 'receivable' ? 'blue' : 'orange'} 
                          variant="light"
                          size="sm"
                        >
                          {item.type === 'receivable' ? 'Receivable' : 'Payable'}
                        </Badge>
                        {item.overdueDays && item.overdueDays > 0 && (
                          <Badge color="red" variant="light" size="xs">
                            {item.overdueDays} days overdue
                          </Badge>
                        )}
                      </Group>
                      <Text size="sm" fw={500} mb={4}>
                        {item.party}
                      </Text>
                      <Group justify="space-between">
                        <Text size="lg" fw={600} color={item.type === 'receivable' ? 'green' : 'red'}>
                          {formatCurrency(item.amount)}
                        </Text>
                        <Text size="xs" color="dimmed">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
                
                <Divider my="md" />
                
                <Button variant="light" fullWidth size="sm">
                  View All Outstanding
                </Button>
              </div>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Alerts & Notifications */}
        <Card className="card">
          <div className="card-header">
            <h3 className="card-title">Alerts & Notifications</h3>
          </div>
          <div className="card-content">
            <Stack spacing="sm">
              <Alert icon={<IconAlertCircle size="1rem" />} color="yellow">
                <Text size="sm">
                  <strong>Payment Reminder:</strong> 3 invoices are due within the next 7 days totaling KES 125,000
                </Text>
              </Alert>
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                <Text size="sm">
                  <strong>Overdue Alert:</strong> Tech Solutions Inc payment of KES 65,000 is 10 days overdue
                </Text>
              </Alert>
              <Alert icon={<IconCalendar size="1rem" />} color="blue">
                <Text size="sm">
                  <strong>Monthly Closing:</strong> Don't forget to run month-end procedures by January 31st
                </Text>
              </Alert>
            </Stack>
          </div>
        </Card>
      </Stack>
    </div>
  );
} 