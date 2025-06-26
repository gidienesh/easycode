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
  Progress,
  Table,
  SegmentedControl,
  Tabs
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconUser,
  IconUsers,
  IconTool,
  IconCalendar,
  IconClock,
  IconAlertCircle
} from '@tabler/icons-react';

// Mock resources data
const mockTeamMembers = [
  {
    id: 'user-1',
    name: 'Mary Wambui',
    role: 'Full Stack Developer',
    email: 'mary@easycode.com',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    availability: 85,
    currentProjects: ['EasyCode Platform Enhancement'],
    hourlyRate: 50,
    status: 'available'
  },
  {
    id: 'user-2',
    name: 'Peter Otieno',
    role: 'UI/UX Designer',
    email: 'peter@easycode.com',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    availability: 60,
    currentProjects: ['EasyCode Platform Enhancement', 'Client Onboarding Automation'],
    hourlyRate: 45,
    status: 'busy'
  },
  {
    id: 'user-3',
    name: 'Grace Njeri',
    role: 'Backend Developer',
    email: 'grace@easycode.com',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    availability: 90,
    currentProjects: ['Client Onboarding Automation'],
    hourlyRate: 55,
    status: 'available'
  }
];

const mockEquipment = [
  {
    id: 'eq-1',
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    assignedTo: 'Mary Wambui',
    status: 'in-use',
    location: 'Office - Desk 1',
    purchaseDate: '2023-01-15',
    warranty: '2026-01-15'
  },
  {
    id: 'eq-2',
    name: 'Dell Monitor 27"',
    type: 'Monitor',
    assignedTo: 'Peter Otieno',
    status: 'in-use',
    location: 'Office - Desk 2',
    purchaseDate: '2023-03-20',
    warranty: '2026-03-20'
  },
  {
    id: 'eq-3',
    name: 'iPad Pro',
    type: 'Tablet',
    assignedTo: null,
    status: 'available',
    location: 'Storage Room',
    purchaseDate: '2023-05-10',
    warranty: '2025-05-10'
  }
];

const statusColors = {
  available: 'green',
  busy: 'orange',
  unavailable: 'red',
  'in-use': 'blue',
  maintenance: 'yellow'
};

export default function ProjectResourcesPage() {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('team');
  const [resourceType, setResourceType] = useState<'team' | 'equipment'>('team');

  const TeamMemberCard = ({ member }: { member: any }) => (
    <Card withBorder p="md" mb="md">
      <Group justify="space-between" mb="xs">
        <Group>
          <Avatar size="lg" name={member.name} />
          <div>
            <Text fw={500} size="sm">{member.name}</Text>
            <Text size="xs" c="dimmed">{member.role}</Text>
            <Text size="xs" c="dimmed">{member.email}</Text>
          </div>
        </Group>
        <Group>
          <Badge color={statusColors[member.status as keyof typeof statusColors]} size="sm">
            {member.status.toUpperCase()}
          </Badge>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />}>View Profile</Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />}>Edit Member</Menu.Item>
              <Menu.Item leftSection={<IconCalendar size={14} />}>View Schedule</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">Remove</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Group mb="md">
        <div style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" mb="xs">Availability</Text>
          <Progress value={member.availability} size="sm" />
          <Text size="xs" c="dimmed" mt="xs">{member.availability}% available</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">Rate</Text>
          <Text fw={500}>${member.hourlyRate}/hr</Text>
        </div>
      </Group>

      <div mb="md">
        <Text size="xs" c="dimmed" mb="xs">Skills</Text>
        <Group gap="xs">
          {member.skills.map((skill: string) => (
            <Badge key={skill} variant="light" size="xs">
              {skill}
            </Badge>
          ))}
        </Group>
      </div>

      <div>
        <Text size="xs" c="dimmed" mb="xs">Current Projects</Text>
        <Stack gap="xs">
          {member.currentProjects.map((project: string) => (
            <Text key={project} size="xs">• {project}</Text>
          ))}
        </Stack>
      </div>
    </Card>
  );

  const EquipmentCard = ({ item }: { item: any }) => (
    <Card withBorder p="md" mb="md">
      <Group justify="space-between" mb="xs">
        <Group>
          <IconTool size={24} />
          <div>
            <Text fw={500} size="sm">{item.name}</Text>
            <Text size="xs" c="dimmed">{item.type}</Text>
          </div>
        </Group>
        <Group>
          <Badge color={statusColors[item.status as keyof typeof statusColors]} size="sm">
            {item.status.replace('-', ' ').toUpperCase()}
          </Badge>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />}>Edit Equipment</Menu.Item>
              <Menu.Item leftSection={<IconUser size={14} />}>Assign/Unassign</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">Remove</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Assigned To:</Text>
          <Text size="xs">{item.assignedTo || 'Unassigned'}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Location:</Text>
          <Text size="xs">{item.location}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Purchase Date:</Text>
          <Text size="xs">{new Date(item.purchaseDate).toLocaleDateString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Warranty Until:</Text>
          <Text size="xs">{new Date(item.warranty).toLocaleDateString()}</Text>
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Resources</Title>
          <Text c="dimmed" size="sm">
            Manage team members, equipment, and resource allocation
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          Add Resource
        </Button>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconUsers size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Team Members</Text>
                <Text fw={700} size="xl">{teamMembers.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconUser size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Available</Text>
                <Text fw={700} size="xl" c="green">
                  {teamMembers.filter(m => m.status === 'available').length}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconTool size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">Equipment</Text>
                <Text fw={700} size="xl">{equipment.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconAlertCircle size={24} color="red" />
              <div>
                <Text size="xs" c="dimmed">Issues</Text>
                <Text fw={700} size="xl" c="red">0</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Resource Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="team" leftSection={<IconUsers size={16} />}>
            Team Members
          </Tabs.Tab>
          <Tabs.Tab value="equipment" leftSection={<IconTool size={16} />}>
            Equipment
          </Tabs.Tab>
          <Tabs.Tab value="allocation" leftSection={<IconCalendar size={16} />}>
            Resource Allocation
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="team">
          <Grid mt="md">
            {teamMembers.map((member) => (
              <Grid.Col key={member.id} span={6}>
                <TeamMemberCard member={member} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="equipment">
          <Grid mt="md">
            {equipment.map((item) => (
              <Grid.Col key={item.id} span={6}>
                <EquipmentCard item={item} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="allocation">
          <Card withBorder mt="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Resource</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Current Assignment</Table.Th>
                  <Table.Th>Availability</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {teamMembers.map((member) => (
                  <Table.Tr key={member.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Avatar size="sm" name={member.name} />
                        <div>
                          <Text size="sm" fw={500}>{member.name}</Text>
                          <Text size="xs" c="dimmed">{member.role}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>Team Member</Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        {member.currentProjects.map((project: string) => (
                          <Text key={project} size="xs">{project}</Text>
                        ))}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress value={member.availability} size="sm" style={{ width: 60 }} />
                        <Text size="xs">{member.availability}%</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={statusColors[member.status as keyof typeof statusColors]} size="sm">
                        {member.status.toUpperCase()}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="subtle" size="sm">
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Create Resource Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Resource"
        size="lg"
      >
        <Stack gap="md">
          <SegmentedControl
            value={resourceType}
            onChange={(value) => setResourceType(value as 'team' | 'equipment')}
            data={[
              { label: 'Team Member', value: 'team' },
              { label: 'Equipment', value: 'equipment' }
            ]}
            fullWidth
          />

          {resourceType === 'team' ? (
            <>
              <TextInput label="Full Name" placeholder="Enter full name" required />
              <TextInput label="Email" placeholder="Enter email address" type="email" required />
              <Group grow>
                <Select
                  label="Role"
                  placeholder="Select role"
                  data={[
                    { value: 'developer', label: 'Developer' },
                    { value: 'designer', label: 'Designer' },
                    { value: 'manager', label: 'Project Manager' },
                    { value: 'analyst', label: 'Business Analyst' }
                  ]}
                  required
                />
                <TextInput
                  label="Hourly Rate"
                  placeholder="50"
                  type="number"
                />
              </Group>
              <Textarea label="Skills" placeholder="React, Node.js, TypeScript..." rows={2} />
            </>
          ) : (
            <>
              <TextInput label="Equipment Name" placeholder="Enter equipment name" required />
              <Group grow>
                <Select
                  label="Type"
                  placeholder="Select type"
                  data={[
                    { value: 'laptop', label: 'Laptop' },
                    { value: 'monitor', label: 'Monitor' },
                    { value: 'tablet', label: 'Tablet' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'other', label: 'Other' }
                  ]}
                  required
                />
                <TextInput
                  label="Location"
                  placeholder="Office, Storage, etc."
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Purchase Date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
                <TextInput
                  label="Warranty Until"
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
              </Group>
            </>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Add Resource
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 