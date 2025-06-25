import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group, Checkbox, TextInput, Tabs, SegmentedControl, Paper, Grid, Progress, RingProgress, Table, Timeline
} from '@mantine/core';
import {
  IconChecklist, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck, IconClock, IconCalendar, IconFlag, IconTrash, IconColumns, IconList, IconTimeline, IconCalendarTime, IconDashboard, IconDragDrop, IconMail, IconPhone
} from '@tabler/icons-react';

// Mock tasks with action item checklists
const mockTasks = [
  {
    id: 'task-1',
    title: 'Prepare Q2 Report',
    assignee: 'Mary Wambui',
    dueDate: '2024-06-15',
    status: 'In Progress',
    priority: 'high',
    description: 'Compile and review all Q2 financials and submit the report to the CEO.',
    read: false,
    estimatedHours: 8,
    actualHours: 5.2,
    source: 'manual',
    relatedActivity: null,
    checklist: [
      { id: 1, text: 'Gather financial data from all departments', completed: true },
      { id: 2, text: 'Review revenue and expense reports', completed: true },
      { id: 3, text: 'Create executive summary', completed: false },
      { id: 4, text: 'Prepare presentation slides', completed: false },
      { id: 5, text: 'Submit for CEO review', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Follow up on proposal feedback - Beta Corp',
    assignee: 'Alice M.',
    dueDate: '2024-06-12',
    status: 'Pending',
    priority: 'high',
    description: 'Follow up on proposal sent to Beta Corp and gather feedback.',
    read: true,
    estimatedHours: 2,
    actualHours: 0,
    source: 'ai_email',
    relatedActivity: 'email-1',
    checklist: [
      { id: 1, text: 'Send follow-up email', completed: false },
      { id: 2, text: 'Schedule technical discussion meeting', completed: false },
      { id: 3, text: 'Prepare additional technical details', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Send maintenance schedule document - DTB',
    assignee: 'Grace Njeri',
    dueDate: '2024-06-11',
    status: 'Pending',
    priority: 'medium',
    description: 'Send maintenance schedule document to DTB Mombasa Road.',
    read: true,
    estimatedHours: 1,
    actualHours: 0,
    source: 'ai_email',
    relatedActivity: 'email-2',
    checklist: [
      { id: 1, text: 'Prepare maintenance schedule document', completed: false },
      { id: 2, text: 'Send via email', completed: false },
      { id: 3, text: 'Follow up on receipt', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Schedule technical presentation - Tanesco',
    assignee: 'Peter Otieno',
    dueDate: '2024-06-17',
    status: 'Pending',
    priority: 'medium',
    description: 'Schedule technical presentation for Tanesco Zanzibar.',
    read: true,
    estimatedHours: 3,
    actualHours: 0,
    source: 'ai_call',
    relatedActivity: 'call-5',
    checklist: [
      { id: 1, text: 'Prepare presentation materials', completed: false },
      { id: 2, text: 'Schedule meeting with client', completed: false },
      { id: 3, text: 'Send meeting invitation', completed: false }
    ]
  },
  {
    id: 'task-5',
    title: 'System Maintenance',
    assignee: 'Bob N.',
    dueDate: '2024-06-25',
    status: 'Done',
    priority: 'low',
    description: 'Perform routine system maintenance and updates.',
    read: true,
    estimatedHours: 2,
    actualHours: 1.5,
    source: 'manual',
    relatedActivity: null,
    checklist: [
      { id: 1, text: 'Backup database', completed: true },
      { id: 2, text: 'Update security patches', completed: true },
      { id: 3, text: 'Test system functionality', completed: true }
    ]
  }
];

function aiSummarizeThread(task) {
  if (task.id === 'task-1') return 'Q2 report in progress, due soon.';
  if (task.id === 'task-2') return 'Onboarding pending for Beta Corp.';
  return 'No summary available.';
}
function aiThreadHealth(task) {
  if (task.id === 'task-1') return { health: 'At Risk', reason: 'Due in 2 days, not submitted', color: 'red' };
  if (task.id === 'task-2') return { health: 'Healthy', reason: 'Plenty of time left', color: 'green' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}
const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T10:15:00', text: 'Waiting for finance data.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T10:30:00', text: 'Will send by EOD.', mentions: [] },
];
const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T10:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T10:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T10:30:00' },
];
const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

// Calculate progress based on completed checklist items
function calculateProgress(task) {
  if (!task.checklist || task.checklist.length === 0) return 0;
  const completed = task.checklist.filter(item => item.completed).length;
  return Math.round((completed / task.checklist.length) * 100);
}

// Kanban Board Component
function KanbanBoard({ tasks, onViewTask }) {
  const columns = [
    { id: 'Pending', title: 'To Do', color: 'gray' },
    { id: 'In Progress', title: 'In Progress', color: 'blue' },
    { id: 'Done', title: 'Done', color: 'green' }
  ];

  const getSourceIcon = (source) => {
    switch (source) {
      case 'ai_email': return <IconMail size={12} />;
      case 'ai_call': return <IconPhone size={12} />;
      case 'ai_meeting': return <IconCalendar size={12} />;
      default: return <IconChecklist size={12} />;
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'ai_email': return 'blue';
      case 'ai_call': return 'green';
      case 'ai_meeting': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Grid gutter="md">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        return (
          <Grid.Col key={column.id} span={4}>
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="sm">{column.title}</Text>
                <Badge color={column.color} variant="light">{columnTasks.length}</Badge>
              </Group>
              <Stack gap="sm">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    shadow="sm"
                    padding="sm"
                    radius="md"
                    withBorder
                    onClick={() => onViewTask(task.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm" style={{ flex: 1 }}>{task.title}</Text>
                      {task.source !== 'manual' && (
                        <Tooltip label={`AI Generated from ${task.source.replace('ai_', '')}`}>
                          <Badge 
                            color={getSourceColor(task.source)} 
                            variant="light" 
                            size="xs"
                            leftSection={getSourceIcon(task.source)}
                          >
                            AI
                          </Badge>
                        </Tooltip>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed" mb="xs">{task.assignee}</Text>
                    <Progress 
                      value={calculateProgress(task)} 
                      size="xs" 
                      color={calculateProgress(task) > 80 ? 'green' : calculateProgress(task) > 50 ? 'blue' : 'orange'}
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                      {calculateProgress(task)}% ({task.checklist.filter(item => item.completed).length}/{task.checklist.length})
                    </Text>
                    {task.relatedActivity && (
                      <Text size="xs" c="dimmed" mt="xs">
                        📎 From: {task.relatedActivity}
                      </Text>
                    )}
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}

// List View Component
function ListView({ tasks, onViewTask }) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Task</Table.Th>
          <Table.Th>Assignee</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Priority</Table.Th>
          <Table.Th>Due Date</Table.Th>
          <Table.Th>Progress</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tasks.map((task) => (
          <Table.Tr key={task.id}>
            <Table.Td>
              <Text fw={500} size="sm">{task.title}</Text>
            </Table.Td>
            <Table.Td>{task.assignee}</Table.Td>
            <Table.Td>
              <Badge color={task.status === 'In Progress' ? 'blue' : task.status === 'Pending' ? 'yellow' : 'green'} size="sm">
                {task.status}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color={task.priority === 'high' ? 'red' : 'blue'} size="sm">
                {task.priority}
              </Badge>
            </Table.Td>
            <Table.Td>{task.dueDate}</Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Progress value={calculateProgress(task)} size="sm" style={{ width: 60 }} />
                <Text size="xs">{calculateProgress(task)}%</Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Button size="xs" variant="light" onClick={() => onViewTask(task.id)}>
                View
              </Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

// Timeline View Component
function TimelineView({ tasks, onViewTask }) {
  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      {tasks.map((task, index) => (
        <Timeline.Item key={task.id} bullet={<IconChecklist size={12} />} title={task.title}>
          <Text size="sm" c="dimmed" mb={4}>
            {task.assignee} • Due: {task.dueDate}
          </Text>
          <Text size="sm" mb={8}>{task.description}</Text>
          <Group gap="xs" mb="xs">
            <Badge color={task.priority === 'high' ? 'red' : 'blue'} size="xs">{task.priority}</Badge>
            <Badge color={task.status === 'In Progress' ? 'blue' : task.status === 'Pending' ? 'yellow' : 'green'} size="xs">
              {task.status}
            </Badge>
          </Group>
          <Progress value={calculateProgress(task)} size="xs" mb="xs" />
          <Button size="xs" variant="light" onClick={() => onViewTask(task.id)}>
            View Details
          </Button>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

// Calendar View Component
function CalendarView({ tasks, onViewTask }) {
  return (
    <Paper p="md" withBorder>
      <Text fw={600} mb="md">Task Calendar</Text>
      <Grid>
        {tasks.map((task) => (
          <Grid.Col key={task.id} span={4}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewTask(task.id)}
              style={{ cursor: 'pointer' }}
            >
              <Group justify="space-between" mb="xs">
                <Text fw={500} size="sm">{task.title}</Text>
                <Badge color={task.priority === 'high' ? 'red' : 'blue'} size="xs">
                  {task.priority}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed" mb="xs">{task.assignee}</Text>
              <Text size="xs" c="dimmed" mb="xs">Due: {task.dueDate}</Text>
              <Progress value={calculateProgress(task)} size="xs" />
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
}

// Dashboard View Component
function DashboardView({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const avgProgress = Math.round(tasks.reduce((sum, task) => sum + calculateProgress(task), 0) / totalTasks);

  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Group>
            <RingProgress
              size={60}
              thickness={4}
              sections={[{ value: (completedTasks / totalTasks) * 100, color: 'green' }]}
            />
            <div>
              <Text size="xs" c="dimmed">Completion Rate</Text>
              <Text fw={700}>{Math.round((completedTasks / totalTasks) * 100)}%</Text>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Text size="xs" c="dimmed">Total Tasks</Text>
          <Text fw={700} size="xl">{totalTasks}</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Text size="xs" c="dimmed">In Progress</Text>
          <Text fw={700} size="xl" color="blue">{inProgressTasks}</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Text size="xs" c="dimmed">Pending</Text>
          <Text fw={700} size="xl" color="orange">{pendingTasks}</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">Task Status Distribution</Text>
          <Group gap="lg">
            <div>
              <Text size="sm" fw={500}>To Do</Text>
              <Text size="xl" fw={700} color="gray">{pendingTasks}</Text>
            </div>
            <div>
              <Text size="sm" fw={500}>In Progress</Text>
              <Text size="xl" fw={700} color="blue">{inProgressTasks}</Text>
            </div>
            <div>
              <Text size="sm" fw={500}>Done</Text>
              <Text size="xl" fw={700} color="green">{completedTasks}</Text>
            </div>
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

export default function TasksPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', task: any | null }>({ type: null, task: null });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [activeView, setActiveView] = useState('kanban');

  const handleView = (id: string) => {
    const task = mockTasks.find(m => m.id === id);
    setSelectedTask(task);
    setViewModalOpened(true);
  };

  const handleToggleChecklistItem = (taskId: string, itemId: number) => {
    setSelectedTask(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        checklist: prev.checklist.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      };
    });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim() || !selectedTask) return;
    
    const newItem = {
      id: Math.max(...selectedTask.checklist.map(item => item.id)) + 1,
      text: newChecklistItem.trim(),
      completed: false
    };
    
    setSelectedTask(prev => ({
      ...prev!,
      checklist: [...prev!.checklist, newItem]
    }));
    
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = (itemId: number) => {
    setSelectedTask(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        checklist: prev.checklist.filter(item => item.id !== itemId)
      };
    });
  };

  const renderView = () => {
    switch (activeView) {
      case 'kanban':
        return <KanbanBoard tasks={mockTasks} onViewTask={handleView} />;
      case 'list':
        return <ListView tasks={mockTasks} onViewTask={handleView} />;
      case 'timeline':
        return <TimelineView tasks={mockTasks} onViewTask={handleView} />;
      case 'calendar':
        return <CalendarView tasks={mockTasks} onViewTask={handleView} />;
      case 'dashboard':
        return <DashboardView tasks={mockTasks} />;
      default:
        return <KanbanBoard tasks={mockTasks} onViewTask={handleView} />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Tasks</Title>
        <SegmentedControl
          value={activeView}
          onChange={setActiveView}
          data={[
            { label: 'Kanban', value: 'kanban', icon: IconColumns },
            { label: 'List', value: 'list', icon: IconList },
            { label: 'Timeline', value: 'timeline', icon: IconTimeline },
            { label: 'Calendar', value: 'calendar', icon: IconCalendarTime },
            { label: 'Dashboard', value: 'dashboard', icon: IconDashboard }
          ]}
        />
      </Group>

      {renderView()}

      {/* Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedTask.title}</Text>
                <Badge color={selectedTask.status === 'In Progress' ? 'blue' : selectedTask.status === 'Pending' ? 'yellow' : 'green'}>{selectedTask.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>Assignee:</Text><Text size="sm">{selectedTask.assignee}</Text></Group>
              <Group><Text size="sm" fw={500}>Due Date:</Text><Text size="sm">{selectedTask.dueDate}</Text></Group>
              <Group><Text size="sm" fw={500}>Estimated Hours:</Text><Text size="sm">{selectedTask.estimatedHours}h</Text></Group>
              <Group><Text size="sm" fw={500}>Actual Hours:</Text><Text size="sm">{selectedTask.actualHours}h</Text></Group>
              <Text size="sm" fw={500}>Description:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedTask.description}</Text>
              
              {/* Progress Section */}
              <Divider />
              <Text size="sm" fw={500}>Progress: {calculateProgress(selectedTask)}%</Text>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${calculateProgress(selectedTask)}%`, 
                    height: '100%', 
                    backgroundColor: calculateProgress(selectedTask) > 80 ? '#40c057' : calculateProgress(selectedTask) > 50 ? '#228be6' : '#fd7e14',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </Stack>
            <Divider my="md" />
            <Stack>
              <Text fw={700} size="md">Internal Collaboration</Text>
              {mockComments.map((c: any) => (
                <Card key={c.id} withBorder radius="sm" p="sm" mb={4} bg="yellow.0">
                  <Group gap="xs">
                    <Avatar color="yellow" radius="xl"><IconUser size={16} /></Avatar>
                    <Text fw={600}>{c.author}</Text>
                    <Text size="xs" c="dimmed">{new Date(c.date).toLocaleString()}</Text>
                    {c.mentions.length > 0 && <Badge color="blue">@{c.mentions.join(', @')}</Badge>}
                  </Group>
                  <Text mt={4}>{c.text}</Text>
                </Card>
              ))}
              <Group align="flex-end" mt="xs">
                <Textarea label="Add Internal Comment (@mention to notify)" minRows={2} autosize maw={400} />
                <Button leftSection={<IconSend size={16} />}>Comment</Button>
              </Group>
              <Divider my="sm" />
              <Textarea label="Edit Task Details" minRows={3} autosize />
              <Group gap="xs">
                <Button leftSection={<IconShare size={16} />}>Share Task</Button>
                <Menu withinPortal position="bottom-end" shadow="md">
                  <Menu.Target>
                    <Button leftSection={<IconUser size={16} />}>Assign</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {owners.map(u => <Menu.Item key={u}>{u}</Menu.Item>)}
                  </Menu.Dropdown>
                </Menu>
                <Button leftSection={<IconCheck size={16} />}>Request Approval</Button>
              </Group>
              <Group gap="xs" mt="xs">
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Dependencies</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Estimate Time</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Resources</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Optimize Workflow</Button>
              </Group>
            </Stack>
            {/* Checklist Section */}
            <Divider />
            <Text size="sm" fw={500} mb="xs">Action Items ({selectedTask.checklist.filter(item => item.completed).length}/{selectedTask.checklist.length} completed)</Text>
            <Stack gap="xs" mb="md">
              {selectedTask.checklist.map((item) => (
                <Group key={item.id} justify="space-between">
                  <Group gap="xs">
                    <Checkbox
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(selectedTask.id, item.id)}
                      size="sm"
                    />
                    <Text 
                      size="sm" 
                      style={{ 
                        textDecoration: item.completed ? 'line-through' : 'none',
                        opacity: item.completed ? 0.6 : 1
                      }}
                    >
                      {item.text}
                    </Text>
                  </Group>
                  <ActionIcon 
                    variant="light" 
                    color="red" 
                    size="xs"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
            {/* Add new checklist item */}
            <Group gap="xs">
              <TextInput
                placeholder="Add new action item..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                style={{ flex: 1 }}
                size="sm"
              />
              <Button size="sm" onClick={handleAddChecklistItem} disabled={!newChecklistItem.trim()}>
                Add
              </Button>
            </Group>
          </>
        )}
      </Modal>
      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, task: null })} title={modal.type === 'health' ? 'AI Task Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.task && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.task).color}>{aiThreadHealth(modal.task).health}</Text>
            <Text>{aiThreadHealth(modal.task).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.task && (
          <Text>{aiSummarizeThread(modal.task)}</Text>
        )}
        {modal.type === 'activity' && modal.task && (
          <Stack>
            {mockActivity.map((a: any) => (
              <Group key={a.id}>
                <Avatar size={24} color="blue"><IconUser size={16} /></Avatar>
                <Text>{a.user} {a.type} on {new Date(a.date).toLocaleString()}</Text>
              </Group>
            ))}
          </Stack>
        )}
      </Modal>
    </Container>
  );
} 