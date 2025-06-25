import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group, SegmentedControl, Paper, Grid, Switch
} from '@mantine/core';
import {
  IconBell, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck, IconClock, IconCalendar, IconFlag, IconPlus, IconRepeat, IconAlarm
} from '@tabler/icons-react';

// Mock reminders
const mockReminders = [
  {
    id: 'reminder-1',
    title: 'Client Meeting - Alpha Corp',
    description: 'Follow up meeting with Alpha Corp to discuss project progress and next steps.',
    assignee: 'Mary Wambui',
    dueDate: '2024-06-15T10:00:00Z',
    priority: 'high',
    status: 'active',
    read: false,
    recurring: true,
    frequency: 'weekly',
    category: 'meeting',
    tags: ['client', 'meeting', 'follow-up']
  },
  {
    id: 'reminder-2',
    title: 'Submit Monthly Report',
    description: 'Complete and submit the monthly financial and activity report to management.',
    assignee: 'Alice M.',
    dueDate: '2024-06-20T17:00:00Z',
    priority: 'medium',
    status: 'active',
    read: true,
    recurring: true,
    frequency: 'monthly',
    category: 'report',
    tags: ['report', 'monthly', 'finance']
  },
  {
    id: 'reminder-3',
    title: 'Team Training Session',
    description: 'Conduct training session on new software features for the development team.',
    assignee: 'Bob N.',
    dueDate: '2024-06-18T14:00:00Z',
    priority: 'low',
    status: 'completed',
    read: true,
    recurring: false,
    frequency: null,
    category: 'training',
    tags: ['training', 'team', 'software']
  }
];

function aiSummarizeReminder(reminder) {
  if (reminder.id === 'reminder-1') return 'Weekly client meeting reminder for Alpha Corp project follow-up.';
  if (reminder.id === 'reminder-2') return 'Monthly report submission reminder for financial reporting.';
  if (reminder.id === 'reminder-3') return 'One-time team training session reminder for software features.';
  return 'No summary available.';
}

function aiReminderHealth(reminder) {
  const now = new Date();
  const dueDate = new Date(reminder.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (reminder.status === 'completed') return { health: 'Completed', reason: 'Reminder has been completed', color: 'green' };
  if (daysDiff < 0) return { health: 'Overdue', reason: 'Reminder is overdue', color: 'red' };
  if (daysDiff <= 1) return { health: 'Due Soon', reason: 'Reminder is due within 24 hours', color: 'orange' };
  if (daysDiff <= 3) return { health: 'Upcoming', reason: 'Reminder is due within 3 days', color: 'yellow' };
  return { health: 'On Track', reason: 'Reminder is well ahead of schedule', color: 'green' };
}

const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T09:15:00', text: 'Meeting agenda prepared and sent to client.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T09:30:00', text: 'Will join the meeting to provide technical support.', mentions: [] },
];

const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T09:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T09:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T09:30:00' },
];

const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

// Reminder view components
function ListView({ reminders, onViewReminder }) {
  return (
    <Stack gap="md">
      {reminders.map((reminder) => {
        const aiHealth = aiReminderHealth(reminder);
        const aiSummary = aiSummarizeReminder(reminder);
        const dueDate = new Date(reminder.dueDate);
        const isOverdue = dueDate < new Date();
        
        return (
          <Card
            key={reminder.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            onClick={() => onViewReminder(reminder.id)}
            style={{ cursor: 'pointer' }}
          >
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="red" variant="light" size="md"><IconBell size={18} /></ThemeIcon>
                <Text fw={500} size="sm" style={{ opacity: reminder.read ? 0.7 : 1 }}>{reminder.title}</Text>
                {reminder.recurring && <IconRepeat size={16} color="blue" />}
              </Group>
              <Group gap="xs">
                <Badge color={reminder.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs" leftSection={<IconFlag size={12} />}>{reminder.priority}</Badge>
                <Badge color={reminder.status === 'active' ? 'green' : 'gray'} variant="light" size="xs">{reminder.status}</Badge>
              </Group>
            </Group>
            
            <Text size="sm" c="dimmed" mb="xs">Assignee: {reminder.assignee}</Text>
            <Text size="sm" c="dimmed" mb="xs">Category: {reminder.category}</Text>
            
            <Group gap="xs" mb="xs">
              <IconCalendar size={14} />
              <Text size="sm" c={isOverdue ? 'red' : 'dimmed'}>
                Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
              </Text>
            </Group>
            
            <Text size="sm" mb="xs" lineClamp={2}>
              {reminder.description}
            </Text>
            
            <Group gap="xs" mb="xs">
              {reminder.tags.map((tag) => (
                <Badge key={tag} color="gray" variant="light" size="xs">{tag}</Badge>
              ))}
            </Group>
            
            <Group gap="xs" mb="xs">
              <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', reminder }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
              <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', reminder }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
              <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', reminder }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
            </Group>
            
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed">
                {reminder.recurring ? `Recurring: ${reminder.frequency}` : 'One-time'}
              </Text>
              <Group gap="xs">
                <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); onViewReminder(reminder.id); }}>View Details</Button>
                <Tooltip label="Reply">
                  <ActionIcon variant="light" size="sm" onClick={e => e.stopPropagation()}><IconArrowBackUp size={14} /></ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}

function GridView({ reminders, onViewReminder }) {
  return (
    <Grid>
      {reminders.map((reminder) => {
        const aiHealth = aiReminderHealth(reminder);
        const dueDate = new Date(reminder.dueDate);
        const isOverdue = dueDate < new Date();
        
        return (
          <Grid.Col key={reminder.id} span={4}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewReminder(reminder.id)}
              style={{ cursor: 'pointer' }}
            >
              <Group justify="space-between" mb="xs">
                <ThemeIcon color="red" variant="light" size="md"><IconBell size={18} /></ThemeIcon>
                <Badge color={reminder.priority === 'high' ? 'red' : 'blue'} size="xs">{reminder.priority}</Badge>
              </Group>
              
              <Text fw={500} size="sm" mb="xs">{reminder.title}</Text>
              <Text size="xs" c="dimmed" mb="xs">{reminder.assignee}</Text>
              <Text size="xs" c="dimmed" mb="xs">{reminder.category}</Text>
              
              <Text size="xs" mb="xs" lineClamp={3}>
                {reminder.description}
              </Text>
              
              <Text size="xs" c={isOverdue ? 'red' : 'dimmed'} mb="xs">
                Due: {dueDate.toLocaleDateString()}
              </Text>
              
              <Group gap="xs" mb="xs">
                {reminder.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} color="gray" variant="light" size="xs">{tag}</Badge>
                ))}
                {reminder.tags.length > 2 && <Text size="xs" c="dimmed">+{reminder.tags.length - 2} more</Text>}
              </Group>
              
              <Badge color={aiHealth.color} size="xs">{aiHealth.health}</Badge>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}

export default function RemindersPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', reminder: any | null }>({ type: null, reminder: null });
  const [activeView, setActiveView] = useState('list');

  const handleView = (id: string) => {
    const reminder = mockReminders.find(r => r.id === id);
    setSelectedReminder(reminder);
    setViewModalOpened(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'list':
        return <ListView reminders={mockReminders} onViewReminder={handleView} />;
      case 'grid':
        return <GridView reminders={mockReminders} onViewReminder={handleView} />;
      default:
        return <ListView reminders={mockReminders} onViewReminder={handleView} />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Reminders</Title>
        <Group gap="xs">
          <SegmentedControl
            value={activeView}
            onChange={setActiveView}
            data={[
              { label: 'List', value: 'list' },
              { label: 'Grid', value: 'grid' }
            ]}
          />
          <Button leftSection={<IconPlus size={16} />} size="sm">
            Add Reminder
          </Button>
        </Group>
      </Group>

      {renderView()}

      {/* Reminder Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Reminder Details"
        size="lg"
      >
        {selectedReminder && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedReminder.title}</Text>
                <Badge color={selectedReminder.status === 'active' ? 'green' : 'gray'}>{selectedReminder.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>Assignee:</Text><Text size="sm">{selectedReminder.assignee}</Text></Group>
              <Group><Text size="sm" fw={500}>Category:</Text><Text size="sm">{selectedReminder.category}</Text></Group>
              <Group><Text size="sm" fw={500}>Due Date:</Text><Text size="sm">{new Date(selectedReminder.dueDate).toLocaleString()}</Text></Group>
              <Group><Text size="sm" fw={500}>Priority:</Text><Text size="sm">{selectedReminder.priority}</Text></Group>
              <Group><Text size="sm" fw={500}>Recurring:</Text><Text size="sm">{selectedReminder.recurring ? 'Yes' : 'No'}</Text></Group>
              {selectedReminder.recurring && (
                <Group><Text size="sm" fw={500}>Frequency:</Text><Text size="sm">{selectedReminder.frequency}</Text></Group>
              )}
              <Group gap="xs">
                <Text size="sm" fw={500}>Tags:</Text>
                {selectedReminder.tags.map((tag) => (
                  <Badge key={tag} color="gray" variant="light" size="sm">{tag}</Badge>
                ))}
              </Group>
              <Text size="sm" fw={500}>Description:</Text>
              <Paper p="md" withBorder bg="gray.0">
                <Text size="sm">{selectedReminder.description}</Text>
              </Paper>
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
              <Textarea label="Edit Reminder Description" minRows={3} autosize defaultValue={selectedReminder.description} />
              <Group gap="xs">
                <Button leftSection={<IconShare size={16} />}>Share Reminder</Button>
                <Menu withinPortal position="bottom-end" shadow="md">
                  <Menu.Target>
                    <Button leftSection={<IconUser size={16} />}>Assign</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {owners.map(u => <Menu.Item key={u}>{u}</Menu.Item>)}
                  </Menu.Dropdown>
                </Menu>
                <Button leftSection={<IconCheck size={16} />}>Mark Complete</Button>
              </Group>
              <Group gap="xs" mt="xs">
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Timing</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Optimize Schedule</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Predict Conflicts</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Dependencies</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, reminder: null })} title={modal.type === 'health' ? 'AI Reminder Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.reminder && (
          <Stack>
            <Text fw={700} color={aiReminderHealth(modal.reminder).color}>{aiReminderHealth(modal.reminder).health}</Text>
            <Text>{aiReminderHealth(modal.reminder).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.reminder && (
          <Text>{aiSummarizeReminder(modal.reminder)}</Text>
        )}
        {modal.type === 'activity' && modal.reminder && (
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