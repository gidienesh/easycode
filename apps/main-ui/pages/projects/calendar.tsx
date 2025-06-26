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
  Avatar,
  SimpleGrid
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFlag,
  IconUsers
} from '@tabler/icons-react';

// Mock calendar events
const mockEvents = [
  {
    id: 'event-1',
    title: 'Project Kickoff Meeting',
    description: 'Initial planning and team alignment',
    date: new Date('2024-06-25'),
    type: 'meeting',
    project: 'EasyCode Platform Enhancement',
    attendees: ['Mary Wambui', 'Peter Otieno'],
    duration: '2 hours',
    color: 'blue'
  },
  {
    id: 'event-2',
    title: 'Database Schema Review',
    description: 'Review and finalize database design',
    date: new Date('2024-06-27'),
    type: 'milestone',
    project: 'EasyCode Platform Enhancement',
    attendees: ['Grace Njeri', 'Mary Wambui'],
    duration: '1 hour',
    color: 'red'
  },
  {
    id: 'event-3',
    title: 'Sprint Planning',
    description: 'Plan next sprint activities',
    date: new Date('2024-06-30'),
    type: 'meeting',
    project: 'Client Onboarding Automation',
    attendees: ['Peter Otieno', 'Grace Njeri'],
    duration: '3 hours',
    color: 'green'
  },
  {
    id: 'event-4',
    title: 'UI Testing Deadline',
    description: 'Complete UI testing phase',
    date: new Date('2024-07-02'),
    type: 'deadline',
    project: 'EasyCode Platform Enhancement',
    attendees: ['Mary Wambui'],
    duration: 'All day',
    color: 'orange'
  }
];

const typeColors = {
  meeting: 'blue',
  milestone: 'red',
  deadline: 'orange',
  task: 'green'
};

export default function ProjectCalendarPage() {
  const [events, setEvents] = useState(mockEvents);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month info
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const EventCard = ({ event }: { event: any }) => (
    <Card 
      padding="xs" 
      radius="sm" 
      withBorder 
      mb="xs"
      style={{ borderLeft: `3px solid var(--mantine-color-${event.color}-6)` }}
    >
      <Group justify="space-between" gap="xs">
        <div style={{ flex: 1 }}>
          <Text size="xs" fw={500} lineClamp={1}>{event.title}</Text>
          <Text size="xs" c="dimmed">{event.duration}</Text>
        </div>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="xs">
              <IconDots size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit Event</Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );

  const CalendarCell = ({ date }: { date: Date | null }) => {
    if (!date) {
      return <Paper h={120} p="xs" withBorder style={{ opacity: 0.3 }} />;
    }

    const dayEvents = getEventsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

    return (
      <Paper 
        h={120} 
        p="xs" 
        withBorder
        style={{ 
          backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : isToday ? 'var(--mantine-color-gray-0)' : 'white',
          cursor: 'pointer'
        }}
        onClick={() => setSelectedDate(date)}
      >
        <Group justify="space-between" mb="xs">
          <Text 
            size="sm" 
            fw={isToday ? 700 : 500}
            c={isToday ? 'blue' : 'dark'}
          >
            {date.getDate()}
          </Text>
          {dayEvents.length > 0 && (
            <Badge size="xs" variant="light" color="blue">
              {dayEvents.length}
            </Badge>
          )}
        </Group>
        <Stack gap="xs">
          {dayEvents.slice(0, 2).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {dayEvents.length > 2 && (
            <Text size="xs" c="dimmed">
              +{dayEvents.length - 2} more
            </Text>
          )}
        </Stack>
      </Paper>
    );
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Calendar</Title>
          <Text c="dimmed" size="sm">
            View and manage project events, deadlines, and milestones
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          New Event
        </Button>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Total Events</Text>
            <Text fw={700} size="xl">{events.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">This Month</Text>
            <Text fw={700} size="xl" c="blue">
              {events.filter(e => e.date.getMonth() === currentMonth).length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Meetings</Text>
            <Text fw={700} size="xl" c="green">
              {events.filter(e => e.type === 'meeting').length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Deadlines</Text>
            <Text fw={700} size="xl" c="red">
              {events.filter(e => e.type === 'deadline').length}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Calendar Navigation */}
      <Card withBorder mb="md">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" onClick={() => navigateMonth('prev')}>
              <IconChevronLeft size={16} />
            </ActionIcon>
            <Text fw={600} size="lg">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <ActionIcon variant="subtle" onClick={() => navigateMonth('next')}>
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
          <Group>
            <Button variant="light" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Calendar Grid */}
      <Card withBorder>
        {/* Week headers */}
        <SimpleGrid cols={7} spacing="xs" mb="xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} ta="center" fw={600} size="sm" c="dimmed">
              {day}
            </Text>
          ))}
        </SimpleGrid>
        
        {/* Calendar cells */}
        <SimpleGrid cols={7} spacing="xs">
          {calendarDays.map((date, index) => (
            <CalendarCell key={index} date={date} />
          ))}
        </SimpleGrid>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card withBorder mt="md">
          <Title order={4} mb="md">
            Events for {selectedDate.toLocaleDateString()}
          </Title>
          {getEventsForDate(selectedDate).length > 0 ? (
            <Stack gap="sm">
              {getEventsForDate(selectedDate).map((event) => (
                <Card key={event.id} withBorder p="md">
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <Badge color={typeColors[event.type as keyof typeof typeColors]} size="sm">
                        {event.type.toUpperCase()}
                      </Badge>
                      <Text fw={500}>{event.title}</Text>
                    </Group>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
                        <Menu.Item leftSection={<IconEdit size={14} />}>Edit Event</Menu.Item>
                        <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                  <Text size="sm" c="dimmed" mb="xs">{event.description}</Text>
                  <Group gap="md">
                    <Group gap="xs">
                      <IconClock size={14} />
                      <Text size="sm">{event.duration}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconUsers size={14} />
                      <Text size="sm">{event.attendees.join(', ')}</Text>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              No events scheduled for this date
            </Text>
          )}
        </Card>
      )}

      {/* Create Event Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Event"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Event Title" placeholder="Enter event title" required />
          <Textarea label="Description" placeholder="Enter event description" rows={3} />
          <Group grow>
            <Select
              label="Event Type"
              placeholder="Select type"
              data={[
                { value: 'meeting', label: 'Meeting' },
                { value: 'milestone', label: 'Milestone' },
                { value: 'deadline', label: 'Deadline' },
                { value: 'task', label: 'Task' }
              ]}
              required
            />
            <TextInput
              label="Event Date"
              placeholder="YYYY-MM-DD"
              type="date"
              required
            />
          </Group>
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
            <TextInput
              label="Duration"
              placeholder="e.g., 2 hours, All day"
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Create Event
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 