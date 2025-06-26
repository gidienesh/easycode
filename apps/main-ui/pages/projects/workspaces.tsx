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
  Table,
  Tabs,
  FileInput,
  Progress
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconFolder,
  IconFile,
  IconUsers,
  IconSettings,
  IconStar,
  IconStarFilled,
  IconDownload,
  IconUpload,
  IconShare
} from '@tabler/icons-react';

// Mock workspaces data
const mockWorkspaces = [
  {
    id: 'workspace-1',
    name: 'EasyCode Platform Development',
    description: 'Main workspace for platform development and collaboration',
    project: 'EasyCode Platform Enhancement',
    members: [
      { id: 'user-1', name: 'Mary Wambui', role: 'Admin', avatar: 'MW' },
      { id: 'user-2', name: 'Peter Otieno', role: 'Member', avatar: 'PO' },
      { id: 'user-3', name: 'Grace Njeri', role: 'Member', avatar: 'GN' }
    ],
    filesCount: 24,
    lastActivity: new Date('2024-06-25T10:30:00'),
    isStarred: true,
    status: 'active'
  },
  {
    id: 'workspace-2',
    name: 'Client Onboarding Resources',
    description: 'Shared workspace for client onboarding materials and documentation',
    project: 'Client Onboarding Automation',
    members: [
      { id: 'user-2', name: 'Peter Otieno', role: 'Admin', avatar: 'PO' },
      { id: 'user-3', name: 'Grace Njeri', role: 'Member', avatar: 'GN' }
    ],
    filesCount: 15,
    lastActivity: new Date('2024-06-24T16:45:00'),
    isStarred: false,
    status: 'active'
  },
  {
    id: 'workspace-3',
    name: 'Design Assets Library',
    description: 'Central repository for design assets, mockups, and brand materials',
    project: 'EasyCode Platform Enhancement',
    members: [
      { id: 'user-2', name: 'Peter Otieno', role: 'Admin', avatar: 'PO' }
    ],
    filesCount: 42,
    lastActivity: new Date('2024-06-23T14:20:00'),
    isStarred: true,
    status: 'active'
  }
];

const mockFiles = [
  {
    id: 'file-1',
    name: 'Database_Schema_v2.sql',
    type: 'sql',
    size: '24.5 KB',
    uploadedBy: 'Mary Wambui',
    uploadedAt: new Date('2024-06-25T09:15:00'),
    workspace: 'workspace-1'
  },
  {
    id: 'file-2',
    name: 'UI_Mockups_Dashboard.fig',
    type: 'figma',
    size: '2.1 MB',
    uploadedBy: 'Peter Otieno',
    uploadedAt: new Date('2024-06-24T15:30:00'),
    workspace: 'workspace-1'
  },
  {
    id: 'file-3',
    name: 'API_Documentation.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedBy: 'Grace Njeri',
    uploadedAt: new Date('2024-06-23T11:45:00'),
    workspace: 'workspace-2'
  }
];

export default function ProjectWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [files, setFiles] = useState(mockFiles);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const toggleStar = (workspaceId: string) => {
    setWorkspaces(prev => 
      prev.map(ws => 
        ws.id === workspaceId ? { ...ws, isStarred: !ws.isStarred } : ws
      )
    );
  };

  const WorkspaceCard = ({ workspace }: { workspace: any }) => (
    <Card withBorder p="md" mb="md">
      <Group justify="space-between" mb="xs">
        <Group>
          <IconFolder size={24} color="blue" />
          <div>
            <Group gap="xs">
              <Text fw={500} size="sm">{workspace.name}</Text>
              <ActionIcon 
                variant="subtle" 
                size="sm"
                onClick={() => toggleStar(workspace.id)}
              >
                {workspace.isStarred ? 
                  <IconStarFilled size={14} color="orange" /> : 
                  <IconStar size={14} />
                }
              </ActionIcon>
            </Group>
            <Text size="xs" c="dimmed">{workspace.project}</Text>
          </div>
        </Group>
        <Group>
          <Badge color="green" size="sm">{workspace.status.toUpperCase()}</Badge>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => setSelectedWorkspace(workspace)}>
                View Details
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />}>Edit Workspace</Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
              <Menu.Item leftSection={<IconShare size={14} />}>Share</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {workspace.description}
      </Text>

      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text size="xs" c="dimmed">Members:</Text>
          <Avatar.Group spacing="xs">
            {workspace.members.slice(0, 3).map((member: any) => (
              <Avatar key={member.id} size="sm" name={member.name}>
                {member.avatar}
              </Avatar>
            ))}
            {workspace.members.length > 3 && (
              <Avatar size="sm">+{workspace.members.length - 3}</Avatar>
            )}
          </Avatar.Group>
        </Group>
        <Group gap="md">
          <Group gap="xs">
            <IconFile size={14} />
            <Text size="xs" c="dimmed">{workspace.filesCount} files</Text>
          </Group>
        </Group>
      </Group>

      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          Last activity: {workspace.lastActivity.toLocaleDateString()}
        </Text>
        <Group gap="xs">
          <Button size="xs" variant="light" onClick={() => setSelectedWorkspace(workspace)}>
            Open
          </Button>
          <Button size="xs" variant="outline" onClick={() => setUploadModalOpen(true)}>
            Upload
          </Button>
        </Group>
      </Group>
    </Card>
  );

  const FileRow = ({ file }: { file: any }) => (
    <Table.Tr>
      <Table.Td>
        <Group gap="xs">
          <IconFile size={16} />
          <Text size="sm" fw={500}>{file.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" size="xs">{file.type.toUpperCase()}</Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{file.size}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{file.uploadedBy}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{file.uploadedAt.toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" size="sm">
            <IconDownload size={14} />
          </ActionIcon>
          <ActionIcon variant="subtle" size="sm">
            <IconShare size={14} />
          </ActionIcon>
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={12} />}>Preview</Menu.Item>
              <Menu.Item leftSection={<IconEdit size={12} />}>Rename</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={12} />} color="red">Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Workspaces</Title>
          <Text c="dimmed" size="sm">
            Collaborative workspaces for project files and resources
          </Text>
        </div>
        <Group>
          <Button leftSection={<IconUpload size={16} />} variant="light" onClick={() => setUploadModalOpen(true)}>
            Upload File
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
            New Workspace
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconFolder size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Total Workspaces</Text>
                <Text fw={700} size="xl">{workspaces.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconFile size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Total Files</Text>
                <Text fw={700} size="xl" c="green">
                  {workspaces.reduce((sum, ws) => sum + ws.filesCount, 0)}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconUsers size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">Active Members</Text>
                <Text fw={700} size="xl" c="orange">
                  {new Set(workspaces.flatMap(ws => ws.members.map(m => m.id))).size}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconStarFilled size={24} color="yellow" />
              <div>
                <Text size="xs" c="dimmed">Starred</Text>
                <Text fw={700} size="xl" c="yellow">
                  {workspaces.filter(ws => ws.isStarred).length}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Tabs defaultValue="workspaces">
        <Tabs.List>
          <Tabs.Tab value="workspaces" leftSection={<IconFolder size={16} />}>
            Workspaces
          </Tabs.Tab>
          <Tabs.Tab value="files" leftSection={<IconFile size={16} />}>
            Recent Files
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="workspaces">
          <Grid mt="md">
            {workspaces.map((workspace) => (
              <Grid.Col key={workspace.id} span={6}>
                <WorkspaceCard workspace={workspace} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="files">
          <Card withBorder mt="md">
            <Group justify="space-between" mb="md">
              <Title order={4}>Recent Files</Title>
              <Button size="sm" variant="light" leftSection={<IconUpload size={14} />}>
                Upload New File
              </Button>
            </Group>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Size</Table.Th>
                  <Table.Th>Uploaded By</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {files.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Workspace Details Modal */}
      <Modal
        opened={!!selectedWorkspace}
        onClose={() => setSelectedWorkspace(null)}
        title={selectedWorkspace?.name}
        size="lg"
      >
        {selectedWorkspace && (
          <Stack gap="md">
            <Text>{selectedWorkspace.description}</Text>
            
            <Group>
              <Text size="sm" c="dimmed">Project:</Text>
              <Text size="sm">{selectedWorkspace.project}</Text>
            </Group>
            
            <div>
              <Text size="sm" c="dimmed" mb="xs">Members ({selectedWorkspace.members.length})</Text>
              <Stack gap="xs">
                {selectedWorkspace.members.map((member: any) => (
                  <Group key={member.id} justify="space-between">
                    <Group gap="xs">
                      <Avatar size="sm" name={member.name}>{member.avatar}</Avatar>
                      <div>
                        <Text size="sm">{member.name}</Text>
                        <Text size="xs" c="dimmed">{member.role}</Text>
                      </div>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </div>
            
            <Group>
              <Text size="sm" c="dimmed">Files:</Text>
              <Text size="sm">{selectedWorkspace.filesCount} files</Text>
            </Group>
            
            <Group>
              <Text size="sm" c="dimmed">Last Activity:</Text>
              <Text size="sm">{selectedWorkspace.lastActivity.toLocaleString()}</Text>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Create Workspace Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Workspace"
        size="lg"
      >
        <Stack gap="md">
          <TextInput label="Workspace Name" placeholder="Enter workspace name" required />
          <Textarea label="Description" placeholder="Enter workspace description" rows={3} />
          <Select
            label="Project"
            placeholder="Select project"
            data={[
              { value: 'proj-1', label: 'EasyCode Platform Enhancement' },
              { value: 'proj-2', label: 'Client Onboarding Automation' }
            ]}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Create Workspace
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload File"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Workspace"
            placeholder="Select workspace"
            data={workspaces.map(ws => ({ value: ws.id, label: ws.name }))}
            required
          />
          <FileInput
            label="Select File"
            placeholder="Choose file to upload"
            required
          />
          <Textarea 
            label="Description (Optional)" 
            placeholder="File description" 
            rows={2} 
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadModalOpen(false)}>
              Upload File
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 