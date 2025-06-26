import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Card,
  Badge,
  Timeline,
  Avatar,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  Paper,
  ThemeIcon,
  Grid,
  Stack
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconCheck,
  IconUsers,
  IconRocket,
  IconTarget
} from '@tabler/icons-react';

// Mock timeline data
const mockTimelineEvents = [
  {
    id: 'event-1',
    type: 'milestone',
    title: 'Project Kickoff',
    description: 'Initial project planning and team assignment completed',
    date: new Date('2024-06-01'),
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    assignee: { id: 'user-1', name: 'Mary Wambui' },
    status: 'completed',
    icon: IconRocket,
    color: 'green'
  },
  {
    id: 'event-2',
    type: 'task',
    title: 'Database Schema Design',
    description: 'Complete the database schema design for the new features',
    date: new Date('2024-06-15'),
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    assignee: { id: 'user-2', name: 'Peter Otieno' },
    status: 'completed',
    icon: IconCheck,
    color: 'blue'
  },
  {
    id: 'event-3',
    type: 'meeting',
    title: 'Sprint Planning Meeting',
    description: 'Plan the upcoming sprint and assign tasks to team members',
    date: new Date('2024-06-20'),
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    assignee: { id: 'user-3', name: 'Grace Njeri' },
    status: 'in_progress',
    icon: IconUsers,
    color: 'yellow'
  },
  {
    id: 'event-4',
    type: 'milestone',
    title: 'MVP Release',
    description: 'Release the minimum viable product for client testing',
    date: new Date('2024-07-01'),
    project: { id: 'proj-1', name: 'EasyCode Platform Enhancement' },
    assignee: { id: 'user-1', name: 'Mary Wambui' },
    status: 'upcoming',
    icon: IconTarget,
    color: 'red'
  }
];

const statusColors = {
  completed: 'green',
  in_progress: 'blue',
  upcoming: 'gray',
  overdue: 'red'
};

const typeColors = {
  milestone: 'red',
  task: 'blue',
  meeting: 'yellow',
  deadline: 'orange'
};

export default function ProjectTimelinePage() {
  const [events, setEvents] = useState(mockTimelineEvents);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterProject, setFilterProject] = useState<string | null>(null);

  const filteredEvents = filterProject 
    ? events.filter(event => event.project.id === filterProject)
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Timeline</Title>
          <Text c="dimmed" size="sm">
            Track project milestones, tasks, and important events
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
            <Text size="xs" c="dimmed">Milestones</Text>
            <Text fw={700} size="xl" c="red">
              {events.filter(e => e.type === 'milestone').length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">In Progress</Text>
            <Text fw={700} size="xl" c="blue">
              {events.filter(e => e.status === 'in_progress').length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Upcoming</Text>
            <Text fw={700} size="xl" c="gray">
              {events.filter(e => e.status === 'upcoming').length}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* View Controls */}
      <Card withBorder mb="md">
        <Group justify="space-between">
          <Text fw={500}>Timeline View</Text>
          <Select
            placeholder="Filter by project"
            value={filterProject}
            onChange={setFilterProject}
            data={[
              { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
              { value: 'proj-2', label: 'Client Onboarding Automation' }
            ]}
            clearable
          />
        </Group>
      </Card>

      {/* Timeline Display */}
      <Card withBorder p="md">
        <Timeline active={-1} bulletSize={24} lineWidth={2}>
          {sortedEvents.map((event) => (
            <Timeline.Item
              key={event.id}
              bullet={
                <ThemeIcon color={event.color} size={24} radius="xl">
                  <event.icon size={14} />
                </ThemeIcon>
              }
              title={
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Text fw={500} size="sm">{event.title}</Text>
                      <Badge color={typeColors[event.type as keyof typeof typeColors]} size="xs">
                        {event.type.toUpperCase()}
                      </Badge>
                      <Badge color={statusColors[event.status as keyof typeof statusColors]} size="xs">
                        {event.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed" mb="xs">
                      {event.description}
                    </Text>
                    <Group gap="sm" mb="xs">
                      <Group gap="xs">
                        <IconCalendar size={12} />
                        <Text size="xs" c="dimmed">
                          {event.date.toLocaleDateString()}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <Avatar size="xs" name={event.assignee.name} />
                        <Text size="xs" c="dimmed">
                          {event.assignee.name}
                        </Text>
                      </Group>
                    </Group>
                    <Text size="xs" c="dimmed" fw={500}>
                      {event.project.name}
                    </Text>
                  </div>
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
              }
            />
          ))}
        </Timeline>
      </Card>

      {/* Create Event Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Timeline Event"
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
                { value: 'milestone', label: 'Milestone' },
                { value: 'task', label: 'Task' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'deadline', label: 'Deadline' }
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