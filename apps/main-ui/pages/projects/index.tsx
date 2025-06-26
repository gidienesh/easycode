import React, { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  Card,
  Text,
  Badge,
  Stack,
  Grid,
  Progress,
  Avatar,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  DatePickerInput,
  NumberInput,
  Switch,
  Tabs,
  SegmentedControl,
  Paper,
  Divider,
  Tooltip,
  Alert,
  Table,
  RingProgress
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconSortDescending,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconUsers,
  IconCurrencyDollar,
  IconTarget,
  IconChartBar,
  IconGrid3x3,
  IconList,
  IconTimeline,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconBriefcase,
  IconSettings,
  IconShare,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react';
import { DatePickerInput as DatePicker } from '@mantine/dates';

// Mock data - replace with actual API calls
const mockProjects = [
  {
    id: 'proj-1',
    name: 'EasyCode Platform Enhancement',
    description: 'Major platform upgrade with new features and performance improvements',
    status: 'active',
    priority: 'high',
    progress: 65,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    projectManager: { id: 'user-1', name: 'Mary Wambui', avatar: null },
    teamMembers: [
      { id: 'user-1', name: 'Mary Wambui', avatar: null },
      { id: 'user-2', name: 'Peter Otieno', avatar: null },
      { id: 'user-3', name: 'Grace Njeri', avatar: null }
    ],
    budget: 150000,
    actualCost: 45000,
    currency: 'USD',
    completedTasks: 13,
    totalTasks: 20,
    tags: ['platform', 'enhancement', 'high-priority'],
    category: 'Development',
    lastActivity: new Date('2024-01-20'),
    isStarred: true
  },
  {
    id: 'proj-2',
    name: 'Client Onboarding Automation',
    description: 'Automate the client onboarding process to reduce manual work',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-15'),
    projectManager: { id: 'user-2', name: 'Peter Otieno', avatar: null },
    teamMembers: [
      { id: 'user-2', name: 'Peter Otieno', avatar: null },
      { id: 'user-4', name: 'John Kamau', avatar: null }
    ],
    budget: 75000,
    actualCost: 0,
    currency: 'USD',
    completedTasks: 2,
    totalTasks: 12,
    tags: ['automation', 'client', 'efficiency'],
    category: 'Process Improvement',
    lastActivity: new Date('2024-02-25'),
    isStarred: false
  },
  {
    id: 'proj-3',
    name: 'Mobile App Development',
    description: 'Native mobile applications for iOS and Android',
    status: 'active',
    priority: 'high',
    progress: 40,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-30'),
    projectManager: { id: 'user-3', name: 'Grace Njeri', avatar: null },
    teamMembers: [
      { id: 'user-3', name: 'Grace Njeri', avatar: null },
      { id: 'user-5', name: 'David Mwangi', avatar: null },
      { id: 'user-6', name: 'Sarah Kiprotich', avatar: null }
    ],
    budget: 200000,
    actualCost: 80000,
    currency: 'USD',
    completedTasks: 8,
    totalTasks: 25,
    tags: ['mobile', 'ios', 'android'],
    category: 'Development',
    lastActivity: new Date('2024-01-18'),
    isStarred: true
  }
];

const statusColors = {
  planning: 'blue',
  active: 'green',
  on_hold: 'yellow',
  completed: 'teal',
  cancelled: 'red',
  archived: 'gray'
};

const priorityColors = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: null as Date | null,
    projectManagerId: '',
    teamMemberIds: [] as string[],
    budget: 0,
    currency: 'USD',
    category: '',
    tags: [] as string[],
    priority: 'medium'
  });

  const handleCreateProject = () => {
    // TODO: Implement API call
    console.log('Creating project:', formData);
    setCreateModalOpen(false);
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      projectManagerId: project.projectManager.id,
      teamMemberIds: project.teamMembers.map((m: any) => m.id),
      budget: project.budget,
      currency: project.currency,
      category: project.category,
      tags: project.tags,
      priority: project.priority
    });
    setEditModalOpen(true);
  };

  const handleToggleStar = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    ));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(project.status);
    const matchesPriority = filterPriority.length === 0 || filterPriority.includes(project.priority);
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const ProjectCard = ({ project }: { project: any }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group>
            <ActionIcon
              variant="subtle"
              color={project.isStarred ? 'yellow' : 'gray'}
              onClick={() => handleToggleStar(project.id)}
            >
              {project.isStarred ? <IconStarFilled size={16} /> : <IconStar size={16} />}
            </ActionIcon>
            <Text fw={500} size="sm" truncate style={{ maxWidth: 200 }}>
              {project.name}
            </Text>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEditProject(project)}>
                Edit Project
              </Menu.Item>
              <Menu.Item leftSection={<IconShare size={14} />}>Share</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Archive
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Text size="sm" c="dimmed" lineClamp={2}>
          {project.description}
        </Text>

        <Group justify="space-between">
          <Badge color={statusColors[project.status as keyof typeof statusColors]} size="sm">
            {project.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge color={priorityColors[project.priority as keyof typeof priorityColors]} size="sm">
            {project.priority.toUpperCase()}
          </Badge>
        </Group>

        <Group justify="space-between">
          <Text size="xs" c="dimmed">Progress</Text>
          <Text size="xs" fw={500}>{project.progress}%</Text>
        </Group>
        <Progress value={project.progress} size="sm" />

        <Group justify="space-between">
          <Group gap="xs">
            <IconCalendar size={14} />
            <Text size="xs" c="dimmed">
              {project.endDate ? project.endDate.toLocaleDateString() : 'No deadline'}
            </Text>
          </Group>
          <Group gap="xs">
            <IconUsers size={14} />
            <Text size="xs" c="dimmed">{project.teamMembers.length}</Text>
          </Group>
        </Group>

        <Group justify="space-between">
          <Group gap="xs">
            <IconCurrencyDollar size={14} />
            <Text size="xs" c="dimmed">
              ${project.actualCost?.toLocaleString()} / ${project.budget?.toLocaleString()}
            </Text>
          </Group>
          <Group gap="xs">
            <IconTarget size={14} />
            <Text size="xs" c="dimmed">
              {project.completedTasks}/{project.totalTasks} tasks
            </Text>
          </Group>
        </Group>

        <Group gap="xs">
          {project.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="light" size="xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="light" size="xs" c="dimmed">
              +{project.tags.length - 2}
            </Badge>
          )}
        </Group>

        <Group justify="space-between" mt="xs">
          <Group gap="xs">
            <Avatar size="xs" name={project.projectManager.name} />
            <Text size="xs" c="dimmed">{project.projectManager.name}</Text>
          </Group>
          <Text size="xs" c="dimmed">
            {project.lastActivity.toLocaleDateString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  );

  const ProjectFormModal = ({ opened, onClose, title, onSubmit }: any) => (
    <Modal opened={opened} onClose={onClose} title={title} size="lg">
      <Stack gap="md">
        <TextInput
          label="Project Name"
          placeholder="Enter project name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Textarea
          label="Description"
          placeholder="Enter project description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <Group grow>
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(date) => setFormData({ ...formData, startDate: date || new Date() })}
            required
          />
          <DatePicker
            label="End Date"
            value={formData.endDate}
            onChange={(date) => setFormData({ ...formData, endDate: date })}
          />
        </Group>

        <Group grow>
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value || 'medium' })}
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' }
            ]}
          />
          <TextInput
            label="Category"
            placeholder="e.g., Development, Marketing"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Budget"
            value={formData.budget}
            onChange={(value) => setFormData({ ...formData, budget: value || 0 })}
            leftSection={<Text size="sm">$</Text>}
            thousandSeparator=","
          />
          <Select
            label="Currency"
            value={formData.currency}
            onChange={(value) => setFormData({ ...formData, currency: value || 'USD' })}
            data={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'KES', label: 'KES' }
            ]}
          />
        </Group>

        <MultiSelect
          label="Tags"
          placeholder="Add tags"
          value={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
          data={[
            { value: 'urgent', label: 'Urgent' },
            { value: 'client-work', label: 'Client Work' },
            { value: 'internal', label: 'Internal' },
            { value: 'development', label: 'Development' },
            { value: 'design', label: 'Design' },
            { value: 'marketing', label: 'Marketing' }
          ]}
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {title.includes('Create') ? 'Create Project' : 'Update Project'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Projects</Title>
          <Text c="dimmed" size="sm">
            Manage your projects, track progress, and collaborate with your team
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          New Project
        </Button>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <RingProgress
                size={60}
                thickness={4}
                sections={[{ value: 75, color: 'blue' }]}
              />
              <div>
                <Text size="xs" c="dimmed">Active Projects</Text>
                <Text fw={700} size="xl">12</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <RingProgress
                size={60}
                thickness={4}
                sections={[{ value: 60, color: 'green' }]}
              />
              <div>
                <Text size="xs" c="dimmed">Completion Rate</Text>
                <Text fw={700} size="xl">68%</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Total Budget</Text>
            <Text fw={700} size="xl">$425K</Text>
            <Group gap="xs" mt="xs">
              <IconTrendingUp size={14} color="green" />
              <Text size="xs" c="green">+12% from last month</Text>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="xs" c="dimmed">Overdue Tasks</Text>
            <Text fw={700} size="xl" c="red">5</Text>
            <Group gap="xs" mt="xs">
              <IconAlertCircle size={14} color="red" />
              <Text size="xs" c="red">Needs attention</Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters and Controls */}
      <Card withBorder mb="md">
        <Group justify="space-between" mb="md">
          <Group>
            <TextInput
              placeholder="Search projects..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
            <MultiSelect
              placeholder="Filter by status"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'completed', label: 'Completed' }
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 200 }}
            />
            <MultiSelect
              placeholder="Filter by priority"
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ]}
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: 200 }}
            />
          </Group>
          <Group>
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as any)}
              data={[
                { label: <IconGrid3x3 size={16} />, value: 'grid' },
                { label: <IconList size={16} />, value: 'list' },
                { label: <IconTimeline size={16} />, value: 'timeline' }
              ]}
            />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="light">
                  <IconSortDescending size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setSortBy('name')}>Name</Menu.Item>
                <Menu.Item onClick={() => setSortBy('progress')}>Progress</Menu.Item>
                <Menu.Item onClick={() => setSortBy('dueDate')}>Due Date</Menu.Item>
                <Menu.Item onClick={() => setSortBy('priority')}>Priority</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Card>

      {/* Projects Display */}
      {viewMode === 'grid' && (
        <Grid>
          {filteredProjects.map((project) => (
            <Grid.Col key={project.id} span={4}>
              <ProjectCard project={project} />
            </Grid.Col>
          ))}
        </Grid>
      )}

      {viewMode === 'list' && (
        <Card withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Progress</Table.Th>
                <Table.Th>Due Date</Table.Th>
                <Table.Th>Team</Table.Th>
                <Table.Th>Budget</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredProjects.map((project) => (
                <Table.Tr key={project.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <ActionIcon
                        variant="subtle"
                        color={project.isStarred ? 'yellow' : 'gray'}
                        size="sm"
                        onClick={() => handleToggleStar(project.id)}
                      >
                        {project.isStarred ? <IconStarFilled size={12} /> : <IconStar size={12} />}
                      </ActionIcon>
                      <div>
                        <Text fw={500} size="sm">{project.name}</Text>
                        <Text size="xs" c="dimmed" truncate style={{ maxWidth: 200 }}>
                          {project.description}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[project.status as keyof typeof statusColors]} size="sm">
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={priorityColors[project.priority as keyof typeof priorityColors]} size="sm">
                      {project.priority.toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Progress value={project.progress} size="sm" style={{ width: 60 }} />
                      <Text size="xs">{project.progress}%</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {project.endDate ? project.endDate.toLocaleDateString() : 'No deadline'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar.Group spacing="xs">
                        {project.teamMembers.slice(0, 3).map((member: any) => (
                          <Tooltip key={member.id} label={member.name}>
                            <Avatar size="sm" name={member.name} />
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                      {project.teamMembers.length > 3 && (
                        <Text size="xs" c="dimmed">+{project.teamMembers.length - 3}</Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      ${project.actualCost?.toLocaleString()} / ${project.budget?.toLocaleString()}
                    </Text>
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
                        <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEditProject(project)}>
                          Edit Project
                        </Menu.Item>
                        <Menu.Item leftSection={<IconShare size={14} />}>Share</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                          Archive
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* Modals */}
      <ProjectFormModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project"
        onSubmit={handleCreateProject}
      />

      <ProjectFormModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Project"
        onSubmit={() => {
          // TODO: Implement update logic
          setEditModalOpen(false);
        }}
      />
    </Container>
  );
} 