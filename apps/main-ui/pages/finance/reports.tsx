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
  Grid,
  Tabs,
  Progress,
  SimpleGrid
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconReportAnalytics,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconSearch,
  IconFilter,
  IconDownload,
  IconCalendar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconFileText,
  IconChartBar,
  IconTrendingUp,
  IconCash
} from '@tabler/icons-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'FINANCIAL_STATEMENTS' | 'MANAGEMENT_REPORTS' | 'TAX_REPORTS' | 'CUSTOM';
  type: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'ON_DEMAND';
  lastGenerated?: string;
  status: 'ACTIVE' | 'INACTIVE';
  parameters: string[];
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  reportName: string;
  generatedBy: string;
  generatedDate: string;
  period: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  fileSize?: string;
  downloadUrl?: string;
}

const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'rpt-001',
    name: 'Balance Sheet',
    description: 'Statement of financial position showing assets, liabilities, and equity',
    category: 'FINANCIAL_STATEMENTS',
    type: 'Balance Sheet',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['date_range', 'comparison_period', 'consolidation']
  },
  {
    id: 'rpt-002',
    name: 'Income Statement',
    description: 'Profit and loss statement showing revenues and expenses',
    category: 'FINANCIAL_STATEMENTS',
    type: 'Income Statement',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['date_range', 'comparison_period', 'department']
  },
  {
    id: 'rpt-003',
    name: 'Cash Flow Statement',
    description: 'Statement showing cash receipts and payments',
    category: 'FINANCIAL_STATEMENTS',
    type: 'Cash Flow Statement',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['date_range', 'method', 'categories']
  },
  {
    id: 'rpt-004',
    name: 'Accounts Receivable Aging',
    description: 'Analysis of outstanding customer receivables by age',
    category: 'MANAGEMENT_REPORTS',
    type: 'AR Aging',
    frequency: 'WEEKLY',
    lastGenerated: '2024-02-05',
    status: 'ACTIVE',
    parameters: ['as_of_date', 'customer_filter', 'aging_buckets']
  },
  {
    id: 'rpt-005',
    name: 'Accounts Payable Aging',
    description: 'Analysis of outstanding vendor payables by age',
    category: 'MANAGEMENT_REPORTS',
    type: 'AP Aging',
    frequency: 'WEEKLY',
    lastGenerated: '2024-02-05',
    status: 'ACTIVE',
    parameters: ['as_of_date', 'vendor_filter', 'aging_buckets']
  },
  {
    id: 'rpt-006',
    name: 'Trial Balance',
    description: 'List of all accounts with their debit and credit balances',
    category: 'FINANCIAL_STATEMENTS',
    type: 'Trial Balance',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['date_range', 'account_filter', 'zero_balance']
  },
  {
    id: 'rpt-007',
    name: 'VAT Return',
    description: 'Value Added Tax return for submission to KRA',
    category: 'TAX_REPORTS',
    type: 'VAT Return',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['tax_period', 'vat_rate', 'exemptions']
  },
  {
    id: 'rpt-008',
    name: 'Budget vs Actual',
    description: 'Comparison of budgeted amounts against actual performance',
    category: 'MANAGEMENT_REPORTS',
    type: 'Budget Analysis',
    frequency: 'MONTHLY',
    lastGenerated: '2024-01-31',
    status: 'ACTIVE',
    parameters: ['date_range', 'budget_version', 'variance_threshold']
  }
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: 'gen-001',
    templateId: 'rpt-001',
    templateName: 'Balance Sheet',
    reportName: 'Balance Sheet - January 2024',
    generatedBy: 'Finance Manager',
    generatedDate: '2024-01-31T10:30:00Z',
    period: 'January 2024',
    format: 'PDF',
    status: 'COMPLETED',
    fileSize: '245 KB',
    downloadUrl: '/reports/balance-sheet-jan-2024.pdf'
  },
  {
    id: 'gen-002',
    templateId: 'rpt-002',
    templateName: 'Income Statement',
    reportName: 'Income Statement - January 2024',
    generatedBy: 'Finance Manager',
    generatedDate: '2024-01-31T11:15:00Z',
    period: 'January 2024',
    format: 'EXCEL',
    status: 'COMPLETED',
    fileSize: '156 KB',
    downloadUrl: '/reports/income-statement-jan-2024.xlsx'
  },
  {
    id: 'gen-003',
    templateId: 'rpt-004',
    templateName: 'Accounts Receivable Aging',
    reportName: 'AR Aging Report - February 5, 2024',
    generatedBy: 'AR Clerk',
    generatedDate: '2024-02-05T09:00:00Z',
    period: 'As of Feb 5, 2024',
    format: 'PDF',
    status: 'COMPLETED',
    fileSize: '189 KB',
    downloadUrl: '/reports/ar-aging-feb-5-2024.pdf'
  },
  {
    id: 'gen-004',
    templateId: 'rpt-007',
    templateName: 'VAT Return',
    reportName: 'VAT Return - January 2024',
    generatedBy: 'Tax Accountant',
    generatedDate: '2024-02-01T14:20:00Z',
    period: 'January 2024',
    format: 'PDF',
    status: 'GENERATING',
    fileSize: undefined,
    downloadUrl: undefined
  }
];

function FinancialReportsPage() {
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'template' | 'generate'>('template');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setReportTemplates(mockReportTemplates);
      setGeneratedReports(mockGeneratedReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'COMPLETED': return 'green';
      case 'INACTIVE': return 'gray';
      case 'GENERATING': return 'blue';
      case 'FAILED': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FINANCIAL_STATEMENTS': return 'blue';
      case 'MANAGEMENT_REPORTS': return 'green';
      case 'TAX_REPORTS': return 'orange';
      case 'CUSTOM': return 'purple';
      default: return 'gray';
    }
  };

  const calculateReportSummary = () => {
    const totalTemplates = reportTemplates.length;
    const activeTemplates = reportTemplates.filter(t => t.status === 'ACTIVE').length;
    const reportsThisMonth = generatedReports.filter(r => 
      new Date(r.generatedDate).getMonth() === new Date().getMonth()
    ).length;
    const pendingReports = generatedReports.filter(r => r.status === 'GENERATING').length;

    return { totalTemplates, activeTemplates, reportsThisMonth, pendingReports };
  };

  const { totalTemplates, activeTemplates, reportsThisMonth, pendingReports } = calculateReportSummary();

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || template.category === filterCategory;
    const matchesStatus = !filterStatus || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredReports = generatedReports.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (type: 'template' | 'generate', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleGenerateReport = (templateId: string) => {
    // Simulate report generation
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      const newReport: GeneratedReport = {
        id: `gen-${Date.now()}`,
        templateId: template.id,
        templateName: template.name,
        reportName: `${template.name} - ${new Date().toLocaleDateString()}`,
        generatedBy: 'Current User',
        generatedDate: new Date().toISOString(),
        period: 'Current Period',
        format: 'PDF',
        status: 'GENERATING',
        fileSize: undefined,
        downloadUrl: undefined
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setGeneratedReports(prev => 
          prev.map(r => 
            r.id === newReport.id 
              ? { ...r, status: 'COMPLETED' as const, fileSize: '198 KB', downloadUrl: '/reports/generated.pdf' }
              : r
          )
        );
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconReportAnalytics size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Financial Reports
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
          <IconReportAnalytics size="1.5rem" style={{ marginRight: '0.5rem' }} />
          Financial Reports
        </h1>
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal('template')}
          >
            New Template
          </Button>
          <Button
            variant="outline"
            leftSection={<IconChartBar size="1rem" />}
            onClick={() => handleOpenModal('generate')}
          >
            Generate Report
          </Button>
          <Button variant="outline" leftSection={<IconDownload size="1rem" />}>
            Export All
          </Button>
        </Group>
      </div>

      <Stack gap="lg">
        {/* Summary Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Total Templates</Text>
                  <Text size="xl" fw={600}>{totalTemplates}</Text>
                </div>
                <IconFileText size="2rem" color="blue" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Active Templates</Text>
                  <Text size="xl" fw={600} color="green">{activeTemplates}</Text>
                </div>
                <IconCheck size="2rem" color="green" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Reports This Month</Text>
                  <Text size="xl" fw={600} color="blue">{reportsThisMonth}</Text>
                </div>
                <IconTrendingUp size="2rem" color="blue" />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" color="dimmed" mb={4}>Pending Reports</Text>
                  <Text size="xl" fw={600} color="orange">{pendingReports}</Text>
                </div>
                <IconAlertTriangle size="2rem" color="orange" />
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Quick Report Generation */}
        <Card className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Report Generation</h3>
          </div>
          <div className="card-content">
            <SimpleGrid cols={4}>
              <Button
                variant="light"
                leftSection={<IconFileText size="1rem" />}
                onClick={() => handleGenerateReport('rpt-001')}
              >
                Balance Sheet
              </Button>
              <Button
                variant="light"
                leftSection={<IconChartBar size="1rem" />}
                onClick={() => handleGenerateReport('rpt-002')}
              >
                Income Statement
              </Button>
              <Button
                variant="light"
                leftSection={<IconCash size="1rem" />}
                onClick={() => handleGenerateReport('rpt-003')}
              >
                Cash Flow
              </Button>
              <Button
                variant="light"
                leftSection={<IconReportAnalytics size="1rem" />}
                onClick={() => handleGenerateReport('rpt-006')}
              >
                Trial Balance
              </Button>
            </SimpleGrid>
          </div>
        </Card>

        {/* Filters */}
        <Card className="card">
          <Group>
            <TextInput
              placeholder="Search reports..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            {activeTab === 'templates' && (
              <Select
                placeholder="Filter by category"
                leftSection={<IconFilter size="1rem" />}
                data={[
                  { value: '', label: 'All Categories' },
                  { value: 'FINANCIAL_STATEMENTS', label: 'Financial Statements' },
                  { value: 'MANAGEMENT_REPORTS', label: 'Management Reports' },
                  { value: 'TAX_REPORTS', label: 'Tax Reports' },
                  { value: 'CUSTOM', label: 'Custom Reports' }
                ]}
                value={filterCategory}
                onChange={(value) => setFilterCategory(value || '')}
                clearable
              />
            )}
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size="1rem" />}
              data={
                activeTab === 'templates' ? [
                  { value: '', label: 'All Status' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' }
                ] : [
                  { value: '', label: 'All Status' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'GENERATING', label: 'Generating' },
                  { value: 'FAILED', label: 'Failed' }
                ]
              }
              value={filterStatus}
              onChange={(value) => setFilterStatus(value || '')}
              clearable
            />
          </Group>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="templates" leftSection={<IconFileText size="0.8rem" />}>
              Report Templates ({reportTemplates.length})
            </Tabs.Tab>
            <Tabs.Tab value="generated" leftSection={<IconReportAnalytics size="0.8rem" />}>
              Generated Reports ({generatedReports.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Templates Tab */}
          <Tabs.Panel value="templates" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Report Templates ({filteredTemplates.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Frequency</Table.Th>
                      <Table.Th>Last Generated</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredTemplates.map((template) => (
                      <Table.Tr key={template.id}>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{template.name}</Text>
                            <Text size="xs" color="dimmed">{template.description}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getCategoryColor(template.category)} 
                            variant="light"
                            size="sm"
                          >
                            {template.category.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{template.type}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{template.frequency}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {template.lastGenerated 
                              ? new Date(template.lastGenerated).toLocaleDateString()
                              : 'Never'
                            }
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(template.status)} 
                            variant="light"
                            size="sm"
                          >
                            {template.status}
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
                                leftSection={<IconChartBar size="0.9rem" />}
                                onClick={() => handleGenerateReport(template.id)}
                              >
                                Generate Report
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                                View Template
                              </Menu.Item>
                              <Menu.Item leftSection={<IconEdit size="0.9rem" />}>
                                Edit Template
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item leftSection={<IconTrash size="0.9rem" />} color="red">
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
          </Tabs.Panel>

          {/* Generated Reports Tab */}
          <Tabs.Panel value="generated" pt="md">
            <Card className="card">
              <div className="card-header">
                <h3 className="card-title">Generated Reports ({filteredReports.length})</h3>
              </div>
              <div className="card-content">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Report Name</Table.Th>
                      <Table.Th>Template</Table.Th>
                      <Table.Th>Generated By</Table.Th>
                      <Table.Th>Generated Date</Table.Th>
                      <Table.Th>Period</Table.Th>
                      <Table.Th>Format</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredReports.map((report) => (
                      <Table.Tr key={report.id}>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{report.reportName}</Text>
                            {report.fileSize && (
                              <Text size="xs" color="dimmed">{report.fileSize}</Text>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{report.templateName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{report.generatedBy}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(report.generatedDate).toLocaleDateString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{report.period}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">
                            {report.format}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getStatusColor(report.status)} 
                            variant="light"
                            size="sm"
                          >
                            {report.status}
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
                              {report.status === 'COMPLETED' && (
                                <Menu.Item leftSection={<IconDownload size="0.9rem" />}>
                                  Download Report
                                </Menu.Item>
                              )}
                              <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                                View Report
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item leftSection={<IconTrash size="0.9rem" />} color="red">
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
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Modal for creating/editing */}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title={`${editingItem ? 'Edit' : 'Create'} ${modalType === 'template' ? 'Report Template' : 'Generate Report'}`}
        size="lg"
      >
        <Text color="dimmed">
          {modalType === 'template' && 'Report template configuration form will be implemented here.'}
          {modalType === 'generate' && 'Report generation parameters form will be implemented here.'}
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleCloseModal}>
            {modalType === 'template' 
              ? (editingItem ? 'Update Template' : 'Create Template')
              : 'Generate Report'
            }
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default function FinancialReportsPageWrapper() {
  return (
    <AppLayout>
      <FinancialReportsPage />
    </AppLayout>
  );
}