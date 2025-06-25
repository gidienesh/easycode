import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Button, 
  ActionIcon,
  Modal,
  Textarea,
  TextInput,
  Select,
  Grid,
  Paper,
  Tooltip,
  Avatar,
  Timeline,
  ScrollArea
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconBrandWhatsapp,
  IconMessage,
  IconClock,
  IconUser,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconX,
  IconDownload,
  IconShare,
  IconPhone
} from '@tabler/icons-react';

export default function CRMWhatsAppLogsPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const whatsappLogs = [
    {
      id: 1,
      contact: 'Wanjiku Mwangi',
      company: 'Apex Steel Ltd',
      phone: '+254 700 000001',
      date: '2024-06-10T14:30:00Z',
      status: 'Active',
      lastMessage: 'Thank you for the maintenance schedule. When can we start?',
      messageCount: 24,
      outcome: 'Positive',
      notes: 'Client confirmed maintenance schedule and requested start date. Sent technical specifications via WhatsApp.',
      user: 'Mary Wambui',
      nextAction: 'Send detailed timeline',
      tags: ['Maintenance', 'Schedule']
    },
    {
      id: 2,
      contact: 'John Kamau',
      company: 'Mars Wrigley East Africa',
      phone: '+254 700 000002',
      date: '2024-06-10T11:15:00Z',
      status: 'Active',
      lastMessage: 'Received the proposal. Will review and get back to you by Friday.',
      messageCount: 18,
      outcome: 'Pending',
      notes: 'Sent proposal via WhatsApp. Client acknowledged receipt and promised feedback by Friday.',
      user: 'Peter Otieno',
      nextAction: 'Follow up on Friday',
      tags: ['Proposal', 'Follow-up']
    },
    {
      id: 3,
      contact: 'Aisha Hassan',
      company: 'French Embassy',
      phone: '+254 700 000003',
      date: '2024-06-09T10:00:00Z',
      status: 'Completed',
      lastMessage: 'Site visit confirmed for tomorrow at 10 AM. See you there.',
      messageCount: 32,
      outcome: 'Successful',
      notes: 'Coordinated site visit details via WhatsApp. All logistics confirmed and team briefed.',
      user: 'Grace Njeri',
      nextAction: 'Prepare site visit report',
      tags: ['Site Visit', 'Coordination']
    },
    {
      id: 4,
      contact: 'Grace Njeri',
      company: 'Diamond Trust Bank Mombasa Road',
      phone: '+254 700 000004',
      date: '2024-06-09T09:00:00Z',
      status: 'Active',
      lastMessage: 'Maintenance team will arrive at 2 PM as scheduled.',
      messageCount: 15,
      outcome: 'Confirmed',
      notes: 'Confirmed maintenance appointment time. Client acknowledged and prepared for team arrival.',
      user: 'Mary Wambui',
      nextAction: 'Monitor maintenance progress',
      tags: ['Maintenance', 'Appointment']
    },
    {
      id: 5,
      contact: 'Peter Otieno',
      company: 'Tanesco Zanzibar',
      phone: '+254 700 000005',
      date: '2024-06-08T16:45:00Z',
      status: 'Active',
      lastMessage: 'Interested in your services. Can we schedule a call?',
      messageCount: 8,
      outcome: 'Qualified',
      notes: 'Initial contact via WhatsApp. Client expressed interest in GHA M.V./L.V. Switchgear maintenance services.',
      user: 'Peter Otieno',
      nextAction: 'Schedule technical presentation call',
      tags: ['Initial Contact', 'Qualification']
    },
    {
      id: 6,
      contact: 'Mercy Wairimu',
      company: 'Safe Pak Ltd',
      phone: '+254 700 000006',
      date: '2024-06-08T14:20:00Z',
      status: 'Active',
      lastMessage: 'Technical specs received. Need clarification on timeline.',
      messageCount: 12,
      outcome: 'Positive',
      notes: 'Sent technical specifications via WhatsApp. Client needs timeline clarification for transformer installation project.',
      user: 'Grace Njeri',
      nextAction: 'Send detailed timeline',
      tags: ['Technical', 'Timeline']
    },
    {
      id: 7,
      contact: 'Project Manager',
      company: 'Lafarge Holcim Nairobi Grinding Plant',
      phone: '+254 700 000007',
      date: '2024-06-07T13:00:00Z',
      status: 'Active',
      lastMessage: 'Project kickoff meeting confirmed for tomorrow.',
      messageCount: 28,
      outcome: 'Confirmed',
      notes: 'Coordinated project kickoff meeting details. All stakeholders confirmed attendance.',
      user: 'Jaston Mbohe',
      nextAction: 'Prepare kickoff presentation',
      tags: ['Kickoff', 'Project']
    },
    {
      id: 8,
      contact: 'Maintenance Team',
      company: 'Vipingo Ridge Kilifi',
      phone: '+254 700 000008',
      date: '2024-06-07T11:30:00Z',
      status: 'Completed',
      lastMessage: 'Maintenance completed successfully. Report sent.',
      messageCount: 20,
      outcome: 'Completed',
      notes: 'Routine maintenance completed. Sent completion report and scheduled next service.',
      user: 'Jaston Mbohe',
      nextAction: 'Schedule next service visit',
      tags: ['Maintenance', 'Completed']
    }
  ];

  const columns = [
    { accessor: 'contact', title: 'Contact', sortable: true },
    { accessor: 'company', title: 'Company', sortable: true },
    { accessor: 'phone', title: 'Phone', sortable: true },
    { 
      accessor: 'status', 
      title: 'Status', 
      sortable: true,
      render: ({ status }) => (
        <Badge 
          color={status === 'Active' ? 'green' : status === 'Completed' ? 'blue' : 'gray'} 
          variant="light"
        >
          {status}
        </Badge>
      )
    },
    { accessor: 'messageCount', title: 'Messages', sortable: true },
    { 
      accessor: 'outcome', 
      title: 'Outcome', 
      sortable: true,
      render: ({ outcome }) => (
        <Badge 
          color={
            outcome === 'Positive' || outcome === 'Successful' || outcome === 'Completed' ? 'green' : 
            outcome === 'Qualified' || outcome === 'Confirmed' ? 'blue' : 
            outcome === 'Pending' ? 'yellow' : 'red'
          } 
          variant="light"
        >
          {outcome}
        </Badge>
      )
    },
    { accessor: 'user', title: 'User', sortable: true },
    { 
      accessor: 'date', 
      title: 'Last Activity', 
      sortable: true,
      render: ({ date }) => new Date(date).toLocaleDateString()
    }
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive':
      case 'Successful':
      case 'Completed': return 'green';
      case 'Qualified':
      case 'Confirmed': return 'blue';
      case 'Pending': return 'yellow';
      default: return 'red';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Completed': return 'blue';
      case 'Archived': return 'gray';
      default: return 'yellow';
    }
  };

  const handleEdit = (chat: any) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  const handlePreview = (chat: any) => {
    setSelectedChat(chat);
    setIsPreviewOpen(true);
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>WhatsApp Logs</Title>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Start New Chat
        </Button>
      </Group>

      {/* WhatsApp Chats Grid */}
      <Grid>
        {whatsappLogs.map((chat) => (
          <Grid.Col key={chat.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Badge color={getStatusColor(chat.status)} variant="light">
                  {chat.status}
                </Badge>
                <Badge color={getOutcomeColor(chat.outcome)} variant="light">
                  {chat.outcome}
                </Badge>
              </Group>

              <Group mb="xs">
                <Avatar color="green" size="sm">
                  <IconBrandWhatsapp size={16} />
                </Avatar>
                <div>
                  <Text fw={600} size="sm">{chat.contact}</Text>
                  <Text size="xs" c="dimmed">{chat.company}</Text>
                </div>
              </Group>

              <Text size="xs" c="dimmed" mb="xs" lineClamp={2}>
                {chat.lastMessage}
              </Text>
              
              <Stack gap="xs">
                <Group gap="xs">
                  <IconPhone size={14} />
                  <Text size="xs">{chat.phone}</Text>
                </Group>
                <Group gap="xs">
                  <IconMessage size={14} />
                  <Text size="xs">{chat.messageCount} messages</Text>
                </Group>
                <Group gap="xs">
                  <IconUser size={14} />
                  <Text size="xs">{chat.user}</Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={14} />
                  <Text size="xs">{new Date(chat.date).toLocaleDateString()}</Text>
                </Group>
                
                <Text size="xs" c="dimmed">
                  Next: {chat.nextAction}
                </Text>
              </Stack>

              <Group mt="md" gap="xs">
                <Tooltip label="View Chat">
                  <ActionIcon 
                    variant="light" 
                    size="sm"
                    onClick={() => handlePreview(chat)}
                  >
                    <IconMessage size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Edit">
                  <ActionIcon 
                    variant="light" 
                    size="sm"
                    onClick={() => handleEdit(chat)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Download">
                  <ActionIcon variant="light" size="sm">
                    <IconDownload size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Share">
                  <ActionIcon variant="light" size="sm">
                    <IconShare size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Edit Chat Modal */}
      <Modal 
        opened={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit WhatsApp Chat"
        size="md"
      >
        {selectedChat && (
          <Stack>
            <Group>
              <TextInput
                label="Contact"
                value={selectedChat.contact}
                placeholder="Contact name"
                style={{ flex: 1 }}
              />
              <TextInput
                label="Company"
                value={selectedChat.company}
                placeholder="Company name"
                style={{ flex: 1 }}
              />
            </Group>
            
            <TextInput
              label="Phone"
              value={selectedChat.phone}
              placeholder="Phone number"
            />
            
            <Group>
              <Select
                label="Status"
                value={selectedChat.status}
                data={['Active', 'Completed', 'Archived']}
                style={{ flex: 1 }}
              />
              <Select
                label="Outcome"
                value={selectedChat.outcome}
                data={['Positive', 'Qualified', 'Pending', 'Completed', 'Confirmed', 'Negative']}
                style={{ flex: 1 }}
              />
            </Group>
            
            <Textarea
              label="Notes"
              value={selectedChat.notes}
              placeholder="Chat notes and details"
              minRows={4}
            />
            
            <TextInput
              label="Next Action"
              value={selectedChat.nextAction}
              placeholder="Next action required"
            />
            
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Preview Chat Modal */}
      <Modal 
        opened={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="WhatsApp Chat Preview"
        size="lg"
      >
        {selectedChat && (
          <Stack>
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group>
                  <Avatar color="green" size="md">
                    <IconBrandWhatsapp size={20} />
                  </Avatar>
                  <div>
                    <Text fw={600}>{selectedChat.contact}</Text>
                    <Text size="sm" c="dimmed">{selectedChat.company}</Text>
                  </div>
                </Group>
                <Badge color={getStatusColor(selectedChat.status)}>
                  {selectedChat.status}
                </Badge>
              </Group>
              
              <Group gap="lg" mb="md">
                <Group gap="xs">
                  <IconPhone size={16} />
                  <Text size="sm">{selectedChat.phone}</Text>
                </Group>
                <Group gap="xs">
                  <IconMessage size={16} />
                  <Text size="sm">{selectedChat.messageCount} messages</Text>
                </Group>
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm">{selectedChat.user}</Text>
                </Group>
              </Group>
              
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedChat.notes}
              </Text>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Last Message:</Text>
              <Text size="sm" c="dimmed">{selectedChat.lastMessage}</Text>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Next Action:</Text>
              <Text size="sm">{selectedChat.nextAction}</Text>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Tags:</Text>
              <Group gap="xs">
                {selectedChat.tags.map((tag: string) => (
                  <Badge key={tag} variant="light" size="xs">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Paper>
          </Stack>
        )}
      </Modal>
    </Container>
  );
} 