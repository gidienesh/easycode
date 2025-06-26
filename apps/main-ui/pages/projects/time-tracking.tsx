import React, { useState, useEffect } from 'react';
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
  Table,
  Progress,
  Divider
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconClock,
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconCalendar,
  IconUser,
  IconFolder
} from '@tabler/icons-react';

// Mock time tracking data
const mockTimeEntries = [
  {
    id: 'time-1',
    task: 'Database Schema Design',
    project: 'EasyCode Platform Enhancement',
    user: 'Mary Wambui',
    startTime: new Date('2024-06-24T09:00:00'),
    endTime: new Date('2024-06-24T12:30:00'),
    duration: 3.5,
    description: 'Designed user authentication and project management schemas',
    status: 'completed'
  },
  {
    id: 'time-2',
    task: 'UI Component Development',
    project: 'EasyCode Platform Enhancement',
    user: 'Peter Otieno',
    startTime: new Date('2024-06-24T14:00:00'),
    endTime: new Date('2024-06-24T17:00:00'),
    duration: 3,
    description: 'Built reusable dashboard components',
    status: 'completed'
  },
  {
    id: 'time-3',
    task: 'API Integration',
    project: 'Client Onboarding Automation',
    user: 'Grace Njeri',
    startTime: new Date('2024-06-25T10:00:00'),
    endTime: null,
    duration: 0,
    description: 'Working on third-party API integrations',
    status: 'running'
  }
];

const mockActiveTimers = [
  {
    id: 'timer-1',
    task: 'API Integration',
    project: 'Client Onboarding Automation',
    user: 'Grace Njeri',
    startTime: new Date('2024-06-25T10:00:00'),
    elapsedTime: 0
  }
];

export default function ProjectTimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [activeTimers, setActiveTimers] = useState(mockActiveTimers);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for active timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getElapsedTime = (startTime: Date) => {
    const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return elapsed;
  };

  const startTimer = (task: string, project: string) => {
    const newTimer = {
      id: `timer-${Date.now()}`,
      task,
      project,
      user: 'Current User',
      startTime: new Date(),
      elapsedTime: 0
    };
    setActiveTimers([...activeTimers, newTimer]);
  };

  const stopTimer = (timerId: string) => {
    const timer = activeTimers.find(t => t.id === timerId);
    if (timer) {
      const duration = getElapsedTime(timer.startTime);
      const newEntry = {
        id: `time-${Date.now()}`,
        task: timer.task,
        project: timer.project,
        user: timer.user,
        startTime: timer.startTime,
        endTime: new Date(),
        duration,
        description: '',
        status: 'completed'
      };
      setTimeEntries([newEntry, ...timeEntries]);
      setActiveTimers(activeTimers.filter(t => t.id !== timerId));
    }
  };

  const ActiveTimerCard = ({ timer }: { timer: any }) => {
    const elapsed = getElapsedTime(timer.startTime);
    
    return (
      <Card withBorder p="md" mb="md" style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}>
        <Group justify="space-between" mb="xs">
          <Group>
            <IconPlayerPlay size={20} color="green" />
            <div>
              <Text fw={500} size="sm">{timer.task}</Text>
              <Text size="xs" c="dimmed">{timer.project}</Text>
            </div>
          </Group>
          <Group>
            <Text fw={700} size="lg" c="green">
              {formatDuration(elapsed)}
            </Text>
            <ActionIcon color="red" onClick={() => stopTimer(timer.id)}>
              <IconPlayerStop size={16} />
            </ActionIcon>
          </Group>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            Started: {timer.startTime.toLocaleTimeString()}
          </Text>
          <Text size="xs" c="dimmed">
            User: {timer.user}
          </Text>
        </Group>
      </Card>
    );
  };

  const TimeEntryRow = ({ entry }: { entry: any }) => (
    <Table.Tr>
      <Table.Td>
        <div>
          <Text fw={500} size="sm">{entry.task}</Text>
          <Text size="xs" c="dimmed">{entry.description}</Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{entry.project}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{entry.user}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{entry.startTime.toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString() || 'Running'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500} size="sm">
          {entry.status === 'running' ? 
            formatDuration(getElapsedTime(entry.startTime)) : 
            formatDuration(entry.duration)
          }
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge color={entry.status === 'running' ? 'green' : 'blue'} size="sm">
          {entry.status.toUpperCase()}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit Entry</Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );

  // Calculate statistics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const todayEntries = timeEntries.filter(entry => 
    entry.startTime.toDateString() === new Date().toDateString()
  );
  const todayHours = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Time Tracking</Title>
          <Text c="dimmed" size="sm">
            Track time spent on tasks and projects
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          Start Timer
        </Button>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconClock size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Total Hours</Text>
                <Text fw={700} size="xl">{formatDuration(totalHours)}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconCalendar size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Today</Text>
                <Text fw={700} size="xl" c="green">{formatDuration(todayHours)}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconPlayerPlay size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">Active Timers</Text>
                <Text fw={700} size="xl" c="orange">{activeTimers.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconFolder size={24} color="purple" />
              <div>
                <Text size="xs" c="dimmed">Projects</Text>
                <Text fw={700} size="xl" c="purple">
                  {new Set(timeEntries.map(e => e.project)).size}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Active Timers */}
      {activeTimers.length > 0 && (
        <Card withBorder mb="lg">
          <Title order={4} mb="md">Active Timers</Title>
          <Stack gap="sm">
            {activeTimers.map((timer) => (
              <ActiveTimerCard key={timer.id} timer={timer} />
            ))}
          </Stack>
        </Card>
      )}

      {/* Time Entries Table */}
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Time Entries</Title>
          <Group>
            <Select
              placeholder="Filter by project"
              data={[
                { value: 'all', label: 'All Projects' },
                { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
                { value: 'proj-2', label: 'Client Onboarding Automation' }
              ]}
              defaultValue="all"
              size="sm"
            />
            <Select
              placeholder="Filter by user"
              data={[
                { value: 'all', label: 'All Users' },
                { value: 'mary', label: 'Mary Wambui' },
                { value: 'peter', label: 'Peter Otieno' },
                { value: 'grace', label: 'Grace Njeri' }
              ]}
              defaultValue="all"
              size="sm"
            />
          </Group>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Task</Table.Th>
              <Table.Th>Project</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {timeEntries.map((entry) => (
              <TimeEntryRow key={entry.id} entry={entry} />
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Start Timer Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Start New Timer"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Task Name" placeholder="Enter task name" required />
          <Select
            label="Project"
            placeholder="Select project"
            data={[
              { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
              { value: 'proj-2', label: 'Client Onboarding Automation' }
            ]}
            required
          />
          <Textarea 
            label="Description" 
            placeholder="Optional task description" 
            rows={3} 
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              leftSection={<IconPlayerPlay size={16} />}
              onClick={() => {
                startTimer('New Task', 'EasyCode Platform Enhancement');
                setCreateModalOpen(false);
              }}
            >
              Start Timer
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 