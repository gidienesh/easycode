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
  Progress,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  Table,
  Avatar,
  Tooltip,
  SegmentedControl,
  Paper,
  Divider
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconColumns,
  IconList,
  IconTimeline,
  IconCalendarTime,
  IconDashboard,
  IconCheck,
  IconClock,
  IconFlag,
  IconUser
} from '@tabler/icons-react';

// Mock task data
const mockTasks = [
  {
    id: 'task-1',
    title: 'Setup Database Schema',
    description: 'Create the initial database schema for the project management module',
    status: 'in_progress',
    priority: 'high',
    assignee: { id: 'user-1', name: 'Mary Wambui', avatar: null },
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    dueDate: new Date('2024-06-30'),
    progress: 75,
    estimatedHours: 16,
    actualHours: 12,
    tags: ['backend', 'database']
  },
  {
    id: 'task-2',
    title: 'Design Project Dashboard UI',
    description: 'Create wireframes and mockups for the project dashboard interface',
    status: 'completed',
    priority: 'medium',
    assignee: { id: 'user-2', name: 'Peter Otieno', avatar: null },
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    dueDate: new Date('2024-06-25'),
    progress: 100,
    estimatedHours: 8,
    actualHours: 10,
    tags: ['frontend', 'design']
  },
  {
    id: 'task-3',
    title: 'Implement Task Management API',
    description: 'Build RESTful API endpoints for task CRUD operations',
    status: 'todo',
    priority: 'high',
    assignee: { id: 'user-3', name: 'Grace Njeri', avatar: null },
    project: { id: 'proj-2', name: 'Client Onboarding Automation' },
    dueDate: new Date('2024-07-05'),
    progress: 0,
    estimatedHours: 20,
    actualHours: 0,
    tags: ['backend', 'api']
  },
  {
    id: 'task-4',
    title: 'User Authentication System',
    description: 'Implement secure user authentication and authorization',
    status: 'in_review',
    priority: 'critical',
    assignee: { id: 'user-1', name: 'Mary Wambui', avatar: null },
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    dueDate: new Date('2024-06-28'),
    progress: 90,
    estimatedHours: 24,
    actualHours: 22,
    tags: ['security', 'backend']
  },
  {
    id: 'task-5',
    title: 'Mobile App Testing',
    description: 'Comprehensive testing of mobile application features',
    status: 'todo',
    priority: 'medium',
    assignee: { id: 'user-2', name: 'Peter Otieno', avatar: null },
    project: { id: 'proj-2', name: 'Client Onboarding Automation' },
    dueDate: new Date('2024-07-10'),
    progress: 0,
    estimatedHours: 16,
    actualHours: 0,
    tags: ['testing', 'mobile']
  }
];

const statusColors = {
  todo: 'gray',
  in_progress: 'blue',
  in_review: 'yellow',
  completed: 'green',
  blocked: 'red'
};

const priorityColors = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
};

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline' | 'calendar'>('kanban');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
    dropZone.style.borderColor = '#007bff';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.style.backgroundColor = '';
    dropZone.style.borderColor = '';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const dropZone = e.currentTarget as HTMLElement;
    
    dropZone.style.backgroundColor = '';
    dropZone.style.borderColor = '';
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder 
      mb="sm"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      style={{ 
        cursor: 'grab',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm" lineClamp={1}>
          {task.title}
        </Text>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit Task</Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Text size="xs" c="dimmed" lineClamp={2} mb="sm">
        {task.description}
      </Text>

      <Group justify="space-between" mb="xs">
        <Badge color={statusColors[task.status as keyof typeof statusColors]} size="xs">
          {task.status.replace('_', ' ').toUpperCase()}
        </Badge>
        <Badge color={priorityColors[task.priority as keyof typeof priorityColors]} size="xs">
          {task.priority.toUpperCase()}
        </Badge>
      </Group>

      <Progress value={task.progress} size="xs" mb="sm" />

      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <IconClock size={14} />
          <Text size="xs" c="dimmed">
            {task.actualHours}h / {task.estimatedHours}h
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          Due: {task.dueDate.toLocaleDateString()}
        </Text>
      </Group>

      <Group justify="space-between">
        <Group gap="xs">
          <Avatar size="xs" name={task.assignee.name} />
          <Text size="xs" c="dimmed">{task.assignee.name}</Text>
        </Group>
        <Text size="xs" c="dimmed" fw={500}>
          {task.project.name}
        </Text>
      </Group>

      <Group gap="xs" mt="xs">
        {task.tags.map((tag: string) => (
          <Badge key={tag} variant="light" size="xs">
            {tag}
          </Badge>
        ))}
      </Group>
    </Card>
  );

  const KanbanBoard = () => {
    const columns = [
      { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
      { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
      { id: 'in_review', title: 'In Review', tasks: tasks.filter(t => t.status === 'in_review') },
      { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.status === 'completed') }
    ];

    return (
      <Grid>
        {columns.map((column) => (
          <Grid.Col key={column.id} span={3}>
            <Paper 
              p="md" 
              withBorder
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              style={{ 
                minHeight: '400px',
                transition: 'all 0.2s ease'
              }}
            >
              <Group justify="space-between" mb="md">
                <Text fw={600} size="sm">{column.title}</Text>
                <Badge variant="light" size="xs">{column.tasks.length}</Badge>
              </Group>
              <Stack gap="sm">
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  const ListView = () => (
    <Card withBorder>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Task</Table.Th>
            <Table.Th>Project</Table.Th>
            <Table.Th>Assignee</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Progress</Table.Th>
            <Table.Th>Due Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tasks.map((task) => (
            <Table.Tr key={task.id}>
              <Table.Td>
                <div>
                  <Text fw={500} size="sm">{task.title}</Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {task.description}
                  </Text>
                </div>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{task.project.name}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Avatar size="sm" name={task.assignee.name} />
                  <Text size="sm">{task.assignee.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge color={statusColors[task.status as keyof typeof statusColors]} size="sm">
                  {task.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={priorityColors[task.priority as keyof typeof priorityColors]} size="sm">
                  {task.priority.toUpperCase()}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Progress value={task.progress} size="sm" style={{ width: 60 }} />
                  <Text size="xs">{task.progress}%</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{task.dueDate.toLocaleDateString()}</Text>
              </Table.Td>
              <Table.Td>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEye size={14} />}>View</Menu.Item>
                    <Menu.Item leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
                    <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );

  const renderView = () => {
    switch (viewMode) {
      case 'kanban':
        return <KanbanBoard />;
      case 'list':
        return <ListView />;
      case 'timeline':
        return (
          <Card withBorder p="md">
            <Text>Timeline view - Coming soon</Text>
          </Card>
        );
      case 'calendar':
        return (
          <Card withBorder p="md">
            <Text>Calendar view - Coming soon</Text>
          </Card>
        );
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Tasks</Title>
          <Text c="dimmed" size="sm">
            Manage tasks across all your projects
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          New Task
        </Button>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Total Tasks</Text>
            <Text fw={700} size="xl">{tasks.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">In Progress</Text>
            <Text fw={700} size="xl" c="blue">
              {tasks.filter(t => t.status === 'in_progress').length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Completed</Text>
            <Text fw={700} size="xl" c="green">
              {tasks.filter(t => t.status === 'completed').length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Overdue</Text>
            <Text fw={700} size="xl" c="red">
              {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* View Controls */}
      <Card withBorder mb="md">
        <Group justify="space-between">
          <Text fw={500}>Task Views</Text>
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as any)}
            data={[
              { label: 'Kanban', value: 'kanban' },
              { label: 'List', value: 'list' },
              { label: 'Timeline', value: 'timeline' },
              { label: 'Calendar', value: 'calendar' }
            ]}
          />
        </Group>
      </Card>

      {/* Tasks Display */}
      {renderView()}

      {/* Create Task Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Task Title" placeholder="Enter task title" required />
          <Textarea label="Description" placeholder="Enter task description" rows={3} />
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
              label="Assignee"
              placeholder="Select assignee"
              data={[
                { value: 'user-1', label: 'Mary Wambui' },
                { value: 'user-2', label: 'Peter Otieno' },
                { value: 'user-3', label: 'Grace Njeri' }
              ]}
            />
          </Group>
          <Group grow>
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
            <TextInput
              label="Due Date"
              placeholder="YYYY-MM-DD"
              type="date"
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Create Task
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 