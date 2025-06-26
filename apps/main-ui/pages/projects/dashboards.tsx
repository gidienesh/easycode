import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Card,
  Badge,
  Stack,
  Grid,
  Paper,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  RingProgress,
  Progress,
  Tabs,
  SimpleGrid,
  Avatar,
  Table,
  ScrollArea,
  Divider
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconChartBar,
  IconChartPie,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconCalendar,
  IconClock,
  IconTarget,
  IconCheckbox,
  IconAlertTriangle,
  IconStar,
  IconRefresh,
  IconSettings,
  IconShare,
  IconDownload
} from '@tabler/icons-react';

// Mock dashboard data
const mockDashboards = [
  {
    id: 'dashboard-1',
    name: 'Project Overview',
    description: 'High-level overview of all project metrics and KPIs',
    type: 'overview',
    isDefault: true,
    lastUpdated: new Date('2024-06-25T10:30:00'),
    widgets: ['project-stats', 'task-progress', 'team-activity', 'budget-tracking']
  },
  {
    id: 'dashboard-2',
    name: 'Team Performance',
    description: 'Team productivity and performance metrics',
    type: 'team',
    isDefault: false,
    lastUpdated: new Date('2024-06-24T16:45:00'),
    widgets: ['team-workload', 'productivity-chart', 'time-tracking', 'team-leaderboard']
  },
  {
    id: 'dashboard-3',
    name: 'Financial Dashboard',
    description: 'Budget, expenses, and financial tracking',
    type: 'financial',
    isDefault: false,
    lastUpdated: new Date('2024-06-23T14:20:00'),
    widgets: ['budget-overview', 'expense-breakdown', 'revenue-forecast', 'cost-analysis']
  }
];

const mockMetrics = {
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  totalTasks: 156,
  completedTasks: 98,
  inProgressTasks: 42,
  overdueProjects: 2,
  teamMembers: 15,
  totalBudget: 850000,
  spentBudget: 420000,
  projectsOnTrack: 6,
  projectsAtRisk: 2
};

const mockRecentActivity = [
  {
    id: 'activity-1',
    type: 'task_completed',
    user: 'Mary Wambui',
    description: 'completed task "Database Schema Design"',
    timestamp: new Date('2024-06-25T09:15:00'),
    project: 'EasyCode Platform'
  },
  {
    id: 'activity-2',
    type: 'project_updated',
    user: 'Peter Otieno',
    description: 'updated project timeline',
    timestamp: new Date('2024-06-25T08:30:00'),
    project: 'Client Onboarding'
  },
  {
    id: 'activity-3',
    type: 'milestone_reached',
    user: 'Grace Njeri',
    description: 'reached milestone "MVP Complete"',
    timestamp: new Date('2024-06-24T17:45:00'),
    project: 'EasyCode Platform'
  }
];

const mockTeamPerformance = [
  { name: 'Mary Wambui', tasksCompleted: 24, hoursLogged: 156, efficiency: 92 },
  { name: 'Peter Otieno', tasksCompleted: 18, hoursLogged: 142, efficiency: 87 },
  { name: 'Grace Njeri', tasksCompleted: 21, hoursLogged: 138, efficiency: 89 },
  { name: 'John Kiprotich', tasksCompleted: 15, hoursLogged: 120, efficiency: 85 }
];

export default function ProjectDashboardsPage() {
  const [dashboards, setDashboards] = useState(mockDashboards);
  const [selectedDashboard, setSelectedDashboard] = useState(mockDashboards[0]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const MetricCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card withBorder p="md">
      <Group justify="space-between" mb="xs">
        <div>
          <Text size="xs" c="dimmed" mb={4}>{title}</Text>
          <Text fw={700} size="xl" c={color}>{value}</Text>
          {subtitle && <Text size="xs" c="dimmed">{subtitle}</Text>}
        </div>
        <div style={{ color }}>
          {icon}
        </div>
      </Group>
      {trend && (
        <Group gap="xs" mt="xs">
          {trend > 0 ? (
            <IconTrendingUp size={14} color="green" />
          ) : (
            <IconTrendingDown size={14} color="red" />
          )}
          <Text size="xs" c={trend > 0 ? "green" : "red"}>
            {Math.abs(trend)}% from last month
          </Text>
        </Group>
      )}
    </Card>
  );

  const ProjectProgressWidget = () => (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Project Progress</Title>
        <ActionIcon variant="subtle" size="sm">
          <IconRefresh size={16} />
        </ActionIcon>
      </Group>
      <Stack gap="md">
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm">EasyCode Platform</Text>
            <Text size="sm" c="dimmed">75%</Text>
          </Group>
          <Progress value={75} color="blue" size="sm" />
        </div>
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Client Onboarding</Text>
            <Text size="sm" c="dimmed">60%</Text>
          </Group>
          <Progress value={60} color="green" size="sm" />
        </div>
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Mobile App</Text>
            <Text size="sm" c="dimmed">40%</Text>
          </Group>
          <Progress value={40} color="orange" size="sm" />
        </div>
      </Stack>
    </Card>
  );

  const BudgetOverviewWidget = () => (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Budget Overview</Title>
        <Badge color="green" size="sm">On Track</Badge>
      </Group>
      <Group justify="center" mb="md">
        <RingProgress
          size={120}
          thickness={12}
          sections={[
            { value: (mockMetrics.spentBudget / mockMetrics.totalBudget) * 100, color: 'blue' },
          ]}
          label={
            <Text size="xs" ta="center">
              ${(mockMetrics.spentBudget / 1000).toFixed(0)}k
              <br />
              <Text size="xs" c="dimmed">of ${(mockMetrics.totalBudget / 1000).toFixed(0)}k</Text>
            </Text>
          }
        />
      </Group>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">Remaining</Text>
        <Text size="sm" fw={500}>
          ${((mockMetrics.totalBudget - mockMetrics.spentBudget) / 1000).toFixed(0)}k
        </Text>
      </Group>
    </Card>
  );

  const TeamActivityWidget = () => (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Recent Activity</Title>
        <Button size="xs" variant="light">View All</Button>
      </Group>
      <ScrollArea h={200}>
        <Stack gap="xs">
          {mockRecentActivity.map((activity) => (
            <Group key={activity.id} gap="xs" align="flex-start">
              <Avatar size="sm" name={activity.user}>
                {activity.user.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text size="sm">
                  <Text component="span" fw={500}>{activity.user}</Text>{' '}
                  {activity.description}
                </Text>
                <Group gap="xs">
                  <Text size="xs" c="dimmed">{activity.project}</Text>
                  <Text size="xs" c="dimmed">•</Text>
                  <Text size="xs" c="dimmed">
                    {activity.timestamp.toLocaleTimeString()}
                  </Text>
                </Group>
              </div>
            </Group>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  );

  const TeamPerformanceWidget = () => (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Team Performance</Title>
        <Select
          size="xs"
          value="week"
          data={[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'This Quarter' }
          ]}
        />
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Member</Table.Th>
            <Table.Th>Tasks</Table.Th>
            <Table.Th>Hours</Table.Th>
            <Table.Th>Efficiency</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockTeamPerformance.map((member, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Group gap="xs">
                  <Avatar size="sm" name={member.name}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Text size="sm">{member.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{member.tasksCompleted}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{member.hoursLogged}h</Text>
              </Table.Td>
              <Table.Td>
                <Badge 
                  color={member.efficiency >= 90 ? 'green' : member.efficiency >= 80 ? 'yellow' : 'red'}
                  size="sm"
                >
                  {member.efficiency}%
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );

  const renderDashboardContent = () => {
    switch (selectedDashboard.type) {
      case 'overview':
        return (
          <Stack gap="md">
            {/* Key Metrics */}
            <SimpleGrid cols={4} spacing="md">
              <MetricCard
                title="Total Projects"
                value={mockMetrics.totalProjects}
                icon={<IconChartBar size={24} />}
                color="blue"
                trend={8}
              />
              <MetricCard
                title="Active Projects"
                value={mockMetrics.activeProjects}
                icon={<IconTarget size={24} />}
                color="green"
                trend={12}
              />
              <MetricCard
                title="Completed Tasks"
                value={mockMetrics.completedTasks}
                icon={<IconCheckbox size={24} />}
                color="teal"
                trend={-3}
              />
              <MetricCard
                title="At Risk"
                value={mockMetrics.projectsAtRisk}
                icon={<IconAlertTriangle size={24} />}
                color="red"
                trend={-25}
              />
            </SimpleGrid>

            {/* Widgets Grid */}
            <Grid>
              <Grid.Col span={6}>
                <ProjectProgressWidget />
              </Grid.Col>
              <Grid.Col span={6}>
                <BudgetOverviewWidget />
              </Grid.Col>
              <Grid.Col span={8}>
                <TeamPerformanceWidget />
              </Grid.Col>
              <Grid.Col span={4}>
                <TeamActivityWidget />
              </Grid.Col>
            </Grid>
          </Stack>
        );
      
      case 'team':
        return (
          <Stack gap="md">
            <SimpleGrid cols={4} spacing="md">
              <MetricCard
                title="Team Members"
                value={mockMetrics.teamMembers}
                icon={<IconUsers size={24} />}
                color="blue"
              />
              <MetricCard
                title="Avg Efficiency"
                value="88%"
                icon={<IconTrendingUp size={24} />}
                color="green"
              />
              <MetricCard
                title="Hours This Week"
                value="556h"
                icon={<IconClock size={24} />}
                color="orange"
              />
              <MetricCard
                title="Tasks Completed"
                value="78"
                icon={<IconCheckbox size={24} />}
                color="teal"
              />
            </SimpleGrid>
            <Grid>
              <Grid.Col span={12}>
                <TeamPerformanceWidget />
              </Grid.Col>
            </Grid>
          </Stack>
        );
      
      case 'financial':
        return (
          <Stack gap="md">
            <SimpleGrid cols={4} spacing="md">
              <MetricCard
                title="Total Budget"
                value={`$${(mockMetrics.totalBudget / 1000).toFixed(0)}k`}
                icon={<IconChartPie size={24} />}
                color="blue"
              />
              <MetricCard
                title="Spent"
                value={`$${(mockMetrics.spentBudget / 1000).toFixed(0)}k`}
                icon={<IconTrendingDown size={24} />}
                color="red"
              />
              <MetricCard
                title="Remaining"
                value={`$${((mockMetrics.totalBudget - mockMetrics.spentBudget) / 1000).toFixed(0)}k`}
                icon={<IconTrendingUp size={24} />}
                color="green"
              />
              <MetricCard
                title="Burn Rate"
                value="$42k/mo"
                icon={<IconCalendar size={24} />}
                color="orange"
              />
            </SimpleGrid>
            <Grid>
              <Grid.Col span={6}>
                <BudgetOverviewWidget />
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder p="md">
                  <Title order={4} mb="md">Expense Breakdown</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Development</Text>
                      <Text size="sm" fw={500}>$180k (43%)</Text>
                    </Group>
                    <Progress value={43} color="blue" size="sm" />
                    
                    <Group justify="space-between">
                      <Text size="sm">Infrastructure</Text>
                      <Text size="sm" fw={500}>$120k (29%)</Text>
                    </Group>
                    <Progress value={29} color="green" size="sm" />
                    
                    <Group justify="space-between">
                      <Text size="sm">Marketing</Text>
                      <Text size="sm" fw={500}>$80k (19%)</Text>
                    </Group>
                    <Progress value={19} color="orange" size="sm" />
                    
                    <Group justify="space-between">
                      <Text size="sm">Operations</Text>
                      <Text size="sm" fw={500}>$40k (9%)</Text>
                    </Group>
                    <Progress value={9} color="red" size="sm" />
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        );
      
      default:
        return <Text>Dashboard content not found</Text>;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Dashboards</Title>
          <Text c="dimmed" size="sm">
            Comprehensive project analytics and insights
          </Text>
        </div>
        <Group>
          <Button leftSection={<IconRefresh size={16} />} variant="light">
            Refresh Data
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
            Create Dashboard
          </Button>
        </Group>
      </Group>

      {/* Dashboard Selector */}
      <Card withBorder mb="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Dashboards</Title>
          <Group>
            <ActionIcon variant="subtle" onClick={() => setEditModalOpen(true)}>
              <IconSettings size={16} />
            </ActionIcon>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconShare size={14} />}>Share Dashboard</Menu.Item>
                <Menu.Item leftSection={<IconDownload size={14} />}>Export Data</Menu.Item>
                <Menu.Item leftSection={<IconEdit size={14} />}>Edit Layout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        
        <Tabs value={selectedDashboard.id} onChange={(value) => {
          const dashboard = dashboards.find(d => d.id === value);
          if (dashboard) setSelectedDashboard(dashboard);
        }}>
          <Tabs.List>
            {dashboards.map((dashboard) => (
              <Tabs.Tab 
                key={dashboard.id} 
                value={dashboard.id}
                leftSection={<IconChartBar size={16} />}
              >
                <Group gap="xs">
                  {dashboard.name}
                  {dashboard.isDefault && <Badge size="xs" color="blue">Default</Badge>}
                </Group>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Card>

      {/* Dashboard Content */}
      <div>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={3}>{selectedDashboard.name}</Title>
            <Text size="sm" c="dimmed">{selectedDashboard.description}</Text>
          </div>
          <Text size="xs" c="dimmed">
            Last updated: {selectedDashboard.lastUpdated.toLocaleString()}
          </Text>
        </Group>
        
        {renderDashboardContent()}
      </div>

      {/* Create Dashboard Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Dashboard"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Dashboard Name" placeholder="Enter dashboard name" required />
          <TextInput label="Description" placeholder="Enter dashboard description" />
          <Select
            label="Dashboard Type"
            placeholder="Select type"
            data={[
              { value: 'overview', label: 'Project Overview' },
              { value: 'team', label: 'Team Performance' },
              { value: 'financial', label: 'Financial Dashboard' },
              { value: 'custom', label: 'Custom Dashboard' }
            ]}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Create Dashboard
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Dashboard Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Dashboard"
        size="lg"
      >
        <Stack gap="md">
          <TextInput 
            label="Dashboard Name" 
            defaultValue={selectedDashboard.name}
            required 
          />
          <TextInput 
            label="Description" 
            defaultValue={selectedDashboard.description}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditModalOpen(false)}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 