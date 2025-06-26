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
  Select,
  Progress,
  Table,
  Tabs,
  RingProgress,
  Center
} from '@mantine/core';
import {
  IconDownload,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconClock,
  IconTarget,
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconFileText
} from '@tabler/icons-react';

// Mock data for reports
const projectPerformanceData = [
  { project: 'EasyCode Platform', completed: 75, inProgress: 20, pending: 5 },
  { project: 'Client Onboarding', completed: 60, inProgress: 30, pending: 10 },
  { project: 'Mobile App', completed: 40, inProgress: 45, pending: 15 }
];

const timeTrackingData = [
  { month: 'Jan', hours: 320 },
  { month: 'Feb', hours: 380 },
  { month: 'Mar', hours: 420 },
  { month: 'Apr', hours: 390 },
  { month: 'May', hours: 450 },
  { month: 'Jun', hours: 480 }
];

const teamProductivityData = [
  { name: 'Mary Wambui', tasksCompleted: 24, hoursLogged: 160, efficiency: 95 },
  { name: 'Peter Otieno', tasksCompleted: 18, hoursLogged: 140, efficiency: 88 },
  { name: 'Grace Njeri', tasksCompleted: 21, hoursLogged: 155, efficiency: 92 }
];

const budgetData = [
  { project: 'EasyCode Platform', budget: 50000, spent: 37500, remaining: 12500 },
  { project: 'Client Onboarding', budget: 30000, spent: 18000, remaining: 12000 },
  { project: 'Mobile App', budget: 25000, spent: 10000, remaining: 15000 }
];

export default function ProjectReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedProject, setSelectedProject] = useState('all');

  const ProjectOverviewCard = () => (
    <Card withBorder p="md">
      <Title order={4} mb="md">Project Overview</Title>
      <Grid>
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group>
              <RingProgress
                size={80}
                thickness={8}
                sections={[
                  { value: 40, color: 'blue' },
                  { value: 25, color: 'cyan' },
                  { value: 15, color: 'orange' }
                ]}
              />
              <div>
                <Text size="xs" c="dimmed">Active Projects</Text>
                <Text fw={700} size="xl">3</Text>
                <Text size="xs" c="green">+2 this month</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group>
              <RingProgress
                size={80}
                thickness={8}
                sections={[
                  { value: 70, color: 'green' }
                ]}
                label={
                  <Center>
                    <Text size="xs" fw={700}>70%</Text>
                  </Center>
                }
              />
              <div>
                <Text size="xs" c="dimmed">Overall Progress</Text>
                <Text fw={700} size="xl">70%</Text>
                <Text size="xs" c="green">On track</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Card>
  );

  const TimeTrackingChart = () => (
    <Card withBorder p="md">
      <Title order={4} mb="md">Time Tracking Trends</Title>
      <Paper p="xl" withBorder style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack align="center">
          <IconChartLine size={48} color="blue" />
          <Text c="dimmed">Time Tracking Chart</Text>
          <Text size="xs" c="dimmed">Chart visualization coming soon</Text>
        </Stack>
      </Paper>
    </Card>
  );

  const TeamProductivityTable = () => (
    <Card withBorder p="md">
      <Title order={4} mb="md">Team Productivity</Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team Member</Table.Th>
            <Table.Th>Tasks Completed</Table.Th>
            <Table.Th>Hours Logged</Table.Th>
            <Table.Th>Efficiency</Table.Th>
            <Table.Th>Performance</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teamProductivityData.map((member) => (
            <Table.Tr key={member.name}>
              <Table.Td>
                <Text fw={500}>{member.name}</Text>
              </Table.Td>
              <Table.Td>
                <Text>{member.tasksCompleted}</Text>
              </Table.Td>
              <Table.Td>
                <Text>{member.hoursLogged}h</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Progress value={member.efficiency} size="sm" style={{ width: 60 }} />
                  <Text size="sm">{member.efficiency}%</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge 
                  color={member.efficiency >= 90 ? 'green' : member.efficiency >= 80 ? 'yellow' : 'red'}
                  size="sm"
                >
                  {member.efficiency >= 90 ? 'Excellent' : member.efficiency >= 80 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );

  const BudgetAnalysis = () => (
    <Card withBorder p="md">
      <Title order={4} mb="md">Budget Analysis</Title>
      <Stack gap="md">
        {budgetData.map((project) => {
          const spentPercentage = (project.spent / project.budget) * 100;
          return (
            <Paper key={project.project} p="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{project.project}</Text>
                <Text size="sm" c="dimmed">
                  ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                </Text>
              </Group>
              <Progress value={spentPercentage} size="lg" mb="xs" />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {spentPercentage.toFixed(1)}% spent
                </Text>
                <Text size="xs" c={spentPercentage > 80 ? 'red' : 'green'}>
                  ${project.remaining.toLocaleString()} remaining
                </Text>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );

  const ProjectStatusChart = () => (
    <Card withBorder p="md">
      <Title order={4} mb="md">Project Status Distribution</Title>
      <Paper p="xl" withBorder style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack align="center">
          <IconChartBar size={48} color="green" />
          <Text c="dimmed">Project Status Chart</Text>
          <Text size="xs" c="dimmed">Bar chart visualization coming soon</Text>
        </Stack>
      </Paper>
    </Card>
  );

  const KPICards = () => (
    <Grid mb="lg">
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Group>
            <IconTarget size={24} color="blue" />
            <div>
              <Text size="xs" c="dimmed">Projects On Track</Text>
              <Group gap="xs">
                <Text fw={700} size="xl">2/3</Text>
                <IconTrendingUp size={16} color="green" />
              </Group>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Group>
            <IconClock size={24} color="orange" />
            <div>
              <Text size="xs" c="dimmed">Avg. Task Time</Text>
              <Group gap="xs">
                <Text fw={700} size="xl">4.2h</Text>
                <IconTrendingDown size={16} color="green" />
              </Group>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Group>
            <IconUsers size={24} color="green" />
            <div>
              <Text size="xs" c="dimmed">Team Utilization</Text>
              <Group gap="xs">
                <Text fw={700} size="xl">85%</Text>
                <IconTrendingUp size={16} color="green" />
              </Group>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Group>
            <IconChartBar size={24} color="purple" />
            <div>
              <Text size="xs" c="dimmed">Budget Efficiency</Text>
              <Group gap="xs">
                <Text fw={700} size="xl">92%</Text>
                <IconTrendingUp size={16} color="green" />
              </Group>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Reports</Title>
          <Text c="dimmed" size="sm">
            Analytics and insights for project performance
          </Text>
        </div>
        <Group>
          <Select
            placeholder="Select period"
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value || 'last-30-days')}
            data={[
              { value: 'last-7-days', label: 'Last 7 days' },
              { value: 'last-30-days', label: 'Last 30 days' },
              { value: 'last-90-days', label: 'Last 90 days' },
              { value: 'this-year', label: 'This year' }
            ]}
            size="sm"
          />
          <Select
            placeholder="All projects"
            value={selectedProject}
            onChange={(value) => setSelectedProject(value || 'all')}
            data={[
              { value: 'all', label: 'All Projects' },
              { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
              { value: 'proj-2', label: 'Client Onboarding Automation' }
            ]}
            size="sm"
          />
          <Button leftSection={<IconDownload size={16} />} variant="light">
            Export Report
          </Button>
        </Group>
      </Group>

      <KPICards />

      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconTrendingUp size={16} />}>
            Performance
          </Tabs.Tab>
          <Tabs.Tab value="time" leftSection={<IconClock size={16} />}>
            Time Tracking
          </Tabs.Tab>
          <Tabs.Tab value="budget" leftSection={<IconTarget size={16} />}>
            Budget
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Grid mt="md">
            <Grid.Col span={6}>
              <ProjectOverviewCard />
            </Grid.Col>
            <Grid.Col span={6}>
              <ProjectStatusChart />
            </Grid.Col>
            <Grid.Col span={12}>
              <TeamProductivityTable />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="performance">
          <Grid mt="md">
            <Grid.Col span={12}>
              <Card withBorder p="md">
                <Title order={4} mb="md">Project Performance Metrics</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Project</Table.Th>
                      <Table.Th>Progress</Table.Th>
                      <Table.Th>Tasks Completed</Table.Th>
                      <Table.Th>Team Members</Table.Th>
                      <Table.Th>Budget Used</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>EasyCode Platform Enhancement</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Progress value={75} size="sm" style={{ width: 80 }} />
                          <Text size="sm">75%</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>24/32</Table.Td>
                      <Table.Td>3</Table.Td>
                      <Table.Td>75%</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">On Track</Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Client Onboarding Automation</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Progress value={60} size="sm" style={{ width: 80 }} />
                          <Text size="sm">60%</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>18/30</Table.Td>
                      <Table.Td>2</Table.Td>
                      <Table.Td>60%</Table.Td>
                      <Table.Td>
                        <Badge color="yellow" size="sm">At Risk</Badge>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="time">
          <Grid mt="md">
            <Grid.Col span={8}>
              <TimeTrackingChart />
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder p="md">
                <Title order={4} mb="md">Time Summary</Title>
                <Stack gap="md">
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Total Hours This Month</Text>
                    <Text fw={700} size="xl">480h</Text>
                    <Text size="xs" c="green">+12% from last month</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Average Daily Hours</Text>
                    <Text fw={700} size="xl">8.2h</Text>
                    <Text size="xs" c="dimmed">Per team member</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Billable Hours</Text>
                    <Text fw={700} size="xl">432h</Text>
                    <Text size="xs" c="green">90% billable rate</Text>
                  </Paper>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="budget">
          <Grid mt="md">
            <Grid.Col span={8}>
              <BudgetAnalysis />
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder p="md">
                <Title order={4} mb="md">Budget Summary</Title>
                <Stack gap="md">
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Total Budget</Text>
                    <Text fw={700} size="xl">$105,000</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Total Spent</Text>
                    <Text fw={700} size="xl">$65,500</Text>
                    <Text size="xs" c="dimmed">62% of budget</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed">Remaining</Text>
                    <Text fw={700} size="xl" c="green">$39,500</Text>
                    <Text size="xs" c="green">38% remaining</Text>
                  </Paper>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 