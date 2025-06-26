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
  Textarea,
  Select,
  Progress,
  Timeline,
  ThemeIcon,
  Alert
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconFlag,
  IconCalendar,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconTarget,
  IconTrendingUp
} from '@tabler/icons-react';

// Mock milestones data
const mockMilestones = [
  {
    id: 'milestone-1',
    title: 'Project Kickoff',
    description: 'Initial project setup and team onboarding',
    project: 'EasyCode Platform Enhancement',
    dueDate: new Date('2024-06-15'),
    completedDate: new Date('2024-06-14'),
    status: 'completed',
    priority: 'high',
    progress: 100,
    tasks: [
      { id: 'task-1', title: 'Setup development environment', completed: true },
      { id: 'task-2', title: 'Create project documentation', completed: true },
      { id: 'task-3', title: 'Team alignment meeting', completed: true }
    ]
  },
  {
    id: 'milestone-2',
    title: 'Database Schema Design',
    description: 'Complete database architecture and schema design',
    project: 'EasyCode Platform Enhancement',
    dueDate: new Date('2024-06-30'),
    completedDate: null,
    status: 'in-progress',
    priority: 'high',
    progress: 75,
    tasks: [
      { id: 'task-4', title: 'User authentication schema', completed: true },
      { id: 'task-5', title: 'Project management schema', completed: true },
      { id: 'task-6', title: 'Integration schema', completed: false },
      { id: 'task-7', title: 'Schema optimization', completed: false }
    ]
  },
  {
    id: 'milestone-3',
    title: 'Frontend Development Phase 1',
    description: 'Core UI components and user interface',
    project: 'EasyCode Platform Enhancement',
    dueDate: new Date('2024-07-15'),
    completedDate: null,
    status: 'pending',
    priority: 'medium',
    progress: 25,
    tasks: [
      { id: 'task-8', title: 'Component library setup', completed: true },
      { id: 'task-9', title: 'Dashboard layout', completed: false },
      { id: 'task-10', title: 'Navigation system', completed: false },
      { id: 'task-11', title: 'Responsive design', completed: false }
    ]
  },
  {
    id: 'milestone-4',
    title: 'API Integration',
    description: 'Third-party API integrations and testing',
    project: 'Client Onboarding Automation',
    dueDate: new Date('2024-07-05'),
    completedDate: null,
    status: 'at-risk',
    priority: 'critical',
    progress: 40,
    tasks: [
      { id: 'task-12', title: 'Payment gateway integration', completed: true },
      { id: 'task-13', title: 'Email service integration', completed: false },
      { id: 'task-14', title: 'Document management API', completed: false },
      { id: 'task-15', title: 'Integration testing', completed: false }
    ]
  }
];

const statusColors = {
  completed: 'green',
  'in-progress': 'blue',
  pending: 'gray',
  'at-risk': 'red',
  overdue: 'red'
};

const priorityColors = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
};

export default function ProjectMilestonesPage() {
  const [milestones, setMilestones] = useState(mockMilestones);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMilestoneStatus = (milestone: any) => {
    if (milestone.status === 'completed') return 'completed';
    
    const daysUntil = getDaysUntilDue(milestone.dueDate);
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 3 && milestone.progress < 80) return 'at-risk';
    
    return milestone.status;
  };

  const MilestoneCard = ({ milestone }: { milestone: any }) => {
    const status = getMilestoneStatus(milestone);
    const daysUntil = getDaysUntilDue(milestone.dueDate);
    const completedTasks = milestone.tasks.filter((task: any) => task.completed).length;

    return (
      <Card withBorder p="md" mb="md">
        <Group justify="space-between" mb="xs">
          <Group>
            <ThemeIcon
              size="lg"
              color={statusColors[status as keyof typeof statusColors]}
              variant="light"
            >
              {status === 'completed' ? <IconCheck size={20} /> : <IconFlag size={20} />}
            </ThemeIcon>
            <div>
              <Text fw={500} size="sm">{milestone.title}</Text>
              <Text size="xs" c="dimmed">{milestone.project}</Text>
            </div>
          </Group>
          <Group>
            <Badge color={priorityColors[milestone.priority as keyof typeof priorityColors]} size="sm">
              {milestone.priority.toUpperCase()}
            </Badge>
            <Badge color={statusColors[status as keyof typeof statusColors]} size="sm">
              {status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEye size={14} />} onClick={() => setSelectedMilestone(milestone)}>
                  View Details
                </Menu.Item>
                <Menu.Item leftSection={<IconEdit size={14} />}>Edit Milestone</Menu.Item>
                <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
          {milestone.description}
        </Text>

        <Group mb="md">
          <div style={{ flex: 1 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed">Progress</Text>
              <Text size="xs" fw={500}>{milestone.progress}%</Text>
            </Group>
            <Progress value={milestone.progress} size="sm" />
          </div>
        </Group>

        <Group justify="space-between">
          <Group gap="xs">
            <IconCalendar size={14} />
            <Text size="xs" c="dimmed">
              Due: {milestone.dueDate.toLocaleDateString()}
            </Text>
            {daysUntil >= 0 ? (
              <Text size="xs" c={daysUntil <= 3 ? 'red' : 'dimmed'}>
                ({daysUntil} days left)
              </Text>
            ) : (
              <Text size="xs" c="red">
                ({Math.abs(daysUntil)} days overdue)
              </Text>
            )}
          </Group>
          <Text size="xs" c="dimmed">
            {completedTasks}/{milestone.tasks.length} tasks completed
          </Text>
        </Group>
      </Card>
    );
  };

  const MilestoneTimeline = () => (
    <Timeline active={milestones.findIndex(m => m.status === 'in-progress')} bulletSize={24} lineWidth={2}>
      {milestones.map((milestone) => {
        const status = getMilestoneStatus(milestone);
        const completedTasks = milestone.tasks.filter((task: any) => task.completed).length;
        
        return (
          <Timeline.Item
            key={milestone.id}
            bullet={
              <ThemeIcon
                size={24}
                color={statusColors[status as keyof typeof statusColors]}
                variant="filled"
              >
                {status === 'completed' ? <IconCheck size={12} /> : <IconFlag size={12} />}
              </ThemeIcon>
            }
            title={milestone.title}
          >
            <Text c="dimmed" size="sm">
              {milestone.description}
            </Text>
            <Text size="xs" mt={4}>
              Due: {milestone.dueDate.toLocaleDateString()} • 
              Progress: {milestone.progress}% • 
              Tasks: {completedTasks}/{milestone.tasks.length}
            </Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );

  // Calculate statistics
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const atRiskMilestones = milestones.filter(m => getMilestoneStatus(m) === 'at-risk').length;
  const overdueMilestones = milestones.filter(m => getMilestoneStatus(m) === 'overdue').length;

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Milestones</Title>
          <Text c="dimmed" size="sm">
            Track project milestones and key deliverables
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          New Milestone
        </Button>
      </Group>

      {/* Alert for at-risk milestones */}
      {atRiskMilestones > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} title="Attention Required" color="orange" mb="lg">
          You have {atRiskMilestones} milestone{atRiskMilestones > 1 ? 's' : ''} at risk of missing their deadline.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconTarget size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Total Milestones</Text>
                <Text fw={700} size="xl">{milestones.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconCheck size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Completed</Text>
                <Text fw={700} size="xl" c="green">{completedMilestones}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconAlertCircle size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">At Risk</Text>
                <Text fw={700} size="xl" c="orange">{atRiskMilestones}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconClock size={24} color="red" />
              <div>
                <Text size="xs" c="dimmed">Overdue</Text>
                <Text fw={700} size="xl" c="red">{overdueMilestones}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={8}>
          <Card withBorder>
            <Title order={4} mb="md">Milestones</Title>
            <Stack gap="sm">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card withBorder>
            <Title order={4} mb="md">Timeline</Title>
            <MilestoneTimeline />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Milestone Details Modal */}
      <Modal
        opened={!!selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        title={selectedMilestone?.title}
        size="lg"
      >
        {selectedMilestone && (
          <Stack gap="md">
            <Group>
              <Badge color={priorityColors[selectedMilestone.priority as keyof typeof priorityColors]} size="sm">
                {selectedMilestone.priority.toUpperCase()}
              </Badge>
              <Badge color={statusColors[getMilestoneStatus(selectedMilestone) as keyof typeof statusColors]} size="sm">
                {getMilestoneStatus(selectedMilestone).replace('-', ' ').toUpperCase()}
              </Badge>
            </Group>
            
            <Text>{selectedMilestone.description}</Text>
            
            <Group>
              <Text size="sm" c="dimmed">Project:</Text>
              <Text size="sm">{selectedMilestone.project}</Text>
            </Group>
            
            <Group>
              <Text size="sm" c="dimmed">Due Date:</Text>
              <Text size="sm">{selectedMilestone.dueDate.toLocaleDateString()}</Text>
            </Group>
            
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Progress</Text>
                <Text size="sm" fw={500}>{selectedMilestone.progress}%</Text>
              </Group>
              <Progress value={selectedMilestone.progress} size="md" />
            </div>
            
            <div>
              <Text size="sm" c="dimmed" mb="xs">Tasks</Text>
              <Stack gap="xs">
                {selectedMilestone.tasks.map((task: any) => (
                  <Group key={task.id} justify="space-between">
                    <Text size="sm">{task.title}</Text>
                    <Badge color={task.completed ? 'green' : 'gray'} size="xs">
                      {task.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </div>
          </Stack>
        )}
      </Modal>

      {/* Create Milestone Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Milestone"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Milestone Title" placeholder="Enter milestone title" required />
          <Textarea label="Description" placeholder="Enter milestone description" rows={3} />
          <Group grow>
            <Select
              label="Project"
              placeholder="Select project"
              data={[
                { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
                { value: 'proj-2', label: 'Client Onboarding Automation' }
              ]}
              required
            />
            <Select
              label="Priority"
              placeholder="Select priority"
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ]}
              defaultValue="medium"
            />
          </Group>
          <TextInput
            label="Due Date"
            placeholder="YYYY-MM-DD"
            type="date"
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Create Milestone
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 