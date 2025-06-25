import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group, SegmentedControl, Grid, Paper, Tabs
} from '@mantine/core';
import {
  IconCalendar, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck, IconClock, IconMapPin, IconFlag, IconPlus, IconChevronLeft, IconChevronRight, IconVideo, IconPhone, IconBuilding
} from '@tabler/icons-react';

// Mock calendar events
const mockEvents = [
  {
    id: 'event-1',
    title: 'Q2 Planning Meeting',
    type: 'meeting',
    startTime: '2024-06-15T09:00:00Z',
    endTime: '2024-06-15T10:30:00Z',
    attendees: ['Mary Wambui', 'Alice M.', 'Bob N.'],
    location: 'Conference Room A',
    description: 'Quarterly planning session to review Q2 goals and set Q3 objectives.',
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: 'event-2',
    title: 'Client Demo - Beta Corp',
    type: 'presentation',
    startTime: '2024-06-16T14:00:00Z',
    endTime: '2024-06-16T15:00:00Z',
    attendees: ['Alice M.', 'Beta Corp Team'],
    location: 'Virtual Meeting',
    description: 'Product demonstration for Beta Corp stakeholders.',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 'event-3',
    title: 'System Maintenance',
    type: 'maintenance',
    startTime: '2024-06-17T22:00:00Z',
    endTime: '2024-06-18T02:00:00Z',
    attendees: ['Bob N.'],
    location: 'Server Room',
    description: 'Scheduled system maintenance and updates.',
    priority: 'low',
    status: 'confirmed'
  }
];

function aiSummarizeEvent(event) {
  if (event.id === 'event-1') return 'Q2 planning meeting with key stakeholders.';
  if (event.id === 'event-2') return 'Client demo for Beta Corp - high priority.';
  if (event.id === 'event-3') return 'Overnight system maintenance scheduled.';
  return 'No summary available.';
}

function aiEventHealth(event) {
  if (event.id === 'event-1') return { health: 'Healthy', reason: 'All attendees confirmed', color: 'green' };
  if (event.id === 'event-2') return { health: 'At Risk', reason: 'Client not confirmed yet', color: 'red' };
  if (event.id === 'event-3') return { health: 'Healthy', reason: 'Maintenance window confirmed', color: 'green' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}

const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T10:15:00', text: 'Agenda sent to all attendees.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T10:30:00', text: 'Will prepare presentation slides.', mentions: [] },
];

const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T10:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T10:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T10:30:00' },
];

const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

// Calendar view components
function MonthlyView({ events, onViewEvent }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  
  return (
    <Grid>
      {days.map((day) => {
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.startTime).getDate();
          return eventDate === day;
        });
        
        return (
          <Grid.Col key={day} span={1} style={{ minHeight: '120px', border: '1px solid #e0e0e0', padding: '8px' }}>
            <Text size="sm" fw={500} mb="xs">{day}</Text>
            <Stack gap="xs">
              {dayEvents.map((event) => (
                <Card
                  key={event.id}
                  shadow="sm"
                  padding="xs"
                  radius="sm"
                  withBorder
                  onClick={() => onViewEvent(event.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Text size="xs" fw={500} lineClamp={1}>{event.title}</Text>
                  <Text size="xs" c="dimmed">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </Card>
              ))}
            </Stack>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}

function WeeklyView({ events, onViewEvent }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Grid>
      {days.map((day) => (
        <Grid.Col key={day} span={1}>
          <Paper p="md" withBorder>
            <Text fw={600} size="sm" mb="md">{day}</Text>
            <Stack gap="sm">
              {events.filter(event => {
                const eventDay = new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'short' });
                return eventDay === day;
              }).map((event) => (
                <Card
                  key={event.id}
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                  onClick={() => onViewEvent(event.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Text fw={500} size="sm" mb="xs">{event.title}</Text>
                  <Text size="xs" c="dimmed" mb="xs">
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Badge color={event.priority === 'high' ? 'red' : 'blue'} size="xs">{event.priority}</Badge>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}

function DailyView({ events, onViewEvent }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <Stack gap="xs">
      {hours.map((hour) => {
        const hourEvents = events.filter(event => {
          const eventHour = new Date(event.startTime).getHours();
          return eventHour === hour;
        });
        
        return (
          <Group key={hour} align="flex-start">
            <Text size="sm" fw={500} style={{ width: '60px' }}>
              {hour.toString().padStart(2, '0')}:00
            </Text>
            <div style={{ flex: 1 }}>
              {hourEvents.map((event) => (
                <Card
                  key={event.id}
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                  onClick={() => onViewEvent(event.id)}
                  style={{ cursor: 'pointer', marginBottom: '8px' }}
                >
                  <Group justify="space-between" mb="xs">
                    <Text fw={500} size="sm">{event.title}</Text>
                    <Badge color={event.priority === 'high' ? 'red' : 'blue'} size="xs">{event.priority}</Badge>
                  </Group>
                  <Text size="xs" c="dimmed" mb="xs">
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text size="xs" c="dimmed">{event.location}</Text>
                </Card>
              ))}
            </div>
          </Group>
        );
      })}
    </Stack>
  );
}

export default function CalendarPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', event: any | null }>({ type: null, event: null });
  const [activeView, setActiveView] = useState('monthly');

  const handleView = (id: string) => {
    const event = mockEvents.find(e => e.id === id);
    setSelectedEvent(event);
    setViewModalOpened(true);
  };

  const renderCalendarView = () => {
    switch (activeView) {
      case 'monthly':
        return <MonthlyView events={mockEvents} onViewEvent={handleView} />;
      case 'weekly':
        return <WeeklyView events={mockEvents} onViewEvent={handleView} />;
      case 'daily':
        return <DailyView events={mockEvents} onViewEvent={handleView} />;
      default:
        return <MonthlyView events={mockEvents} onViewEvent={handleView} />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Calendar</Title>
        <Group gap="xs">
          <SegmentedControl
            value={activeView}
            onChange={setActiveView}
            data={[
              { label: 'Month', value: 'monthly' },
              { label: 'Week', value: 'weekly' },
              { label: 'Day', value: 'daily' }
            ]}
          />
          <Button leftSection={<IconPlus size={16} />} size="sm">
            Add Event
          </Button>
        </Group>
      </Group>

      {/* Calendar Navigation */}
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <ActionIcon variant="light" size="sm">
            <IconChevronLeft size={16} />
          </ActionIcon>
          <Text fw={600}>June 2024</Text>
          <ActionIcon variant="light" size="sm">
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
        <Button variant="light" size="sm">Today</Button>
      </Group>

      {/* Calendar View */}
      <Paper p="md" withBorder>
        {renderCalendarView()}
      </Paper>

      {/* Event Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedEvent.title}</Text>
                <Badge color={selectedEvent.status === 'confirmed' ? 'green' : 'yellow'}>{selectedEvent.status}</Badge>
              </Group>
              <Divider />
              <Group>
                <IconClock size={16} />
                <Text size="sm">
                  {new Date(selectedEvent.startTime).toLocaleString()} - {new Date(selectedEvent.endTime).toLocaleString()}
                </Text>
              </Group>
              <Group>
                <IconMapPin size={16} />
                <Text size="sm">{selectedEvent.location}</Text>
              </Group>
              <Group>
                <IconUsers size={16} />
                <Text size="sm">Attendees: {selectedEvent.attendees.join(', ')}</Text>
              </Group>
              <Text size="sm" fw={500}>Description:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedEvent.description}</Text>
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
              <Group gap="xs">
                <Button leftSection={<IconShare size={16} />}>Share Event</Button>
                <Menu withinPortal position="bottom-end" shadow="md">
                  <Menu.Target>
                    <Button leftSection={<IconUser size={16} />}>Invite</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {owners.map(u => <Menu.Item key={u}>{u}</Menu.Item>)}
                  </Menu.Dropdown>
                </Menu>
                <Button leftSection={<IconCheck size={16} />}>Reschedule</Button>
              </Group>
              <Group gap="xs" mt="xs">
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Time</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Optimize Schedule</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Find Conflicts</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Attendees</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, event: null })} title={modal.type === 'health' ? 'AI Event Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.event && (
          <Stack>
            <Text fw={700} color={aiEventHealth(modal.event).color}>{aiEventHealth(modal.event).health}</Text>
            <Text>{aiEventHealth(modal.event).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.event && (
          <Text>{aiSummarizeEvent(modal.event)}</Text>
        )}
        {modal.type === 'activity' && modal.event && (
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