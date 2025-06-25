import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Tabs,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  ActionIcon,
  Tooltip,
  TextInput,
  Select,
  Grid,
  Paper,
  ScrollArea,
  Modal,
  Divider,
  Box,
  Loader,
  Alert
} from '@mantine/core';
import {
  IconMail,
  IconMessage,
  IconPhone,
  IconNote,
  IconVideo,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconBrandWhatsapp,
  IconMessageCircle,
  IconPhoneCall,
  IconAlertCircle
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { useCommunications } from '../../src/hooks/useCommunications';
import { Activity, ActivityType } from '../../src/types/crm';

interface CommunicationCardProps {
  communication: Activity;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function CommunicationCard({ communication, onView, onEdit, onDelete }: CommunicationCardProps) {
  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case 'email': return <IconMail size={16} />;
      case 'whatsapp': return <IconBrandWhatsapp size={16} />;
      case 'sms': return <IconMessageCircle size={16} />;
      case 'call': return <IconPhoneCall size={16} />;
      case 'meeting': return <IconVideo size={16} />;
      case 'note': return <IconNote size={16} />;
      default: return <IconMessage size={16} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'completed':
      case 'scheduled':
        return 'green';
      case 'read':
        return 'blue';
      case 'failed':
      case 'missed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommunicationTitle = (comm: Activity) => {
    switch (comm.activityType) {
      case 'email':
        return comm.subject || 'Email';
      case 'call':
        return `Call to ${comm.toPhoneNumber}`;
      case 'meeting':
        return comm.subject;
      case 'whatsapp':
        return 'WhatsApp Message';
      case 'sms':
        return 'SMS Message';
      case 'note':
        return comm.title || 'Note';
      default:
        return 'Communication';
    }
  };

  const getCommunicationSummary = (comm: Activity) => {
    switch (comm.activityType) {
      case 'email':
        return comm.bodyPreview || 'No preview available';
      case 'whatsapp':
        return comm.messageBody || 'WhatsApp message';
      case 'sms':
        return comm.body || 'SMS message';
      case 'call':
        return `Duration: ${comm.durationSeconds ? Math.floor(comm.durationSeconds / 60) : 0}:${comm.durationSeconds ? (comm.durationSeconds % 60).toString().padStart(2, '0') : '00'}`;
      case 'meeting':
        return `${formatDate(comm.startTime)} - ${formatDate(comm.endTime)}`;
      case 'note':
        return comm.content || 'Note content';
      default:
        return comm.summary || 'No summary available';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          {getTypeIcon(communication.activityType)}
          <Text fw={500} size="sm">
            {getCommunicationTitle(communication)}
          </Text>
        </Group>
        <Group gap="xs">
          <Badge color={getStatusColor(communication.direction)} variant="light" size="xs">
            {communication.direction}
          </Badge>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" mb="xs">
        {communication.contactId ? `Contact ID: ${communication.contactId}` : 'No contact'}
        {communication.accountId && ` • Account ID: ${communication.accountId}`}
      </Text>

      <Text size="sm" mb="xs" lineClamp={2}>
        {getCommunicationSummary(communication)}
      </Text>

      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          {formatDate(communication.activityTimestamp)}
        </Text>
        <Group gap="xs">
          <Tooltip label="View details">
            <ActionIcon variant="light" size="sm" onClick={() => onView(communication.activityId)}>
              <IconEye size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon variant="light" size="sm" onClick={() => onEdit(communication.activityId)}>
              <IconEdit size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="light" color="red" size="sm" onClick={() => onDelete(communication.activityId)}>
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Card>
  );
}

export default function CommunicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Activity | null>(null);

  const {
    communications,
    loading,
    error,
    contacts,
    accounts,
    loadCommunications,
    loadCommunicationsByType,
    loadContactsAndAccounts,
    clearError,
    getStatistics
  } = useCommunications();

  // Load initial data
  useEffect(() => {
    loadCommunications();
    loadContactsAndAccounts();
  }, [loadCommunications, loadContactsAndAccounts]);

  const handleView = (id: string) => {
    const communication = communications.find(c => c.activityId === id);
    setSelectedCommunication(communication || null);
    setViewModalOpened(true);
  };

  const handleEdit = (id: string) => {
    notifications.show({
      title: 'Edit Communication',
      message: `Editing communication ${id}`,
      color: 'blue'
    });
  };

  const handleDelete = (id: string) => {
    notifications.show({
      title: 'Delete Communication',
      message: `Deleting communication ${id}`,
      color: 'red'
    });
  };

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'all') {
      loadCommunications();
    } else if (value && ['email', 'whatsapp', 'sms', 'call', 'meeting'].includes(value)) {
      loadCommunicationsByType(value as 'email' | 'whatsapp' | 'sms' | 'call' | 'meeting');
    }
  };

  const getFilteredCommunications = () => {
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => {
        const title = comm.activityType === 'email' ? comm.subject : 
                     comm.activityType === 'meeting' ? comm.subject :
                     comm.summary || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               comm.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (selectedContact) {
      filtered = filtered.filter(comm => comm.contactId === selectedContact);
    }

    return filtered.sort((a, b) => new Date(b.activityTimestamp).getTime() - new Date(a.activityTimestamp).getTime());
  };

  const communicationsToShow = getFilteredCommunications();
  const stats = getStatistics();

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="lg">
          {error}
        </Alert>
        <Button onClick={clearError}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Communications Hub</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => router.push('/communications/new')}>
          New Communication
        </Button>
      </Group>

      {/* Statistics Cards */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconMail size={20} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Emails</Text>
                <Text fw={700}>{stats.email}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconBrandWhatsapp size={20} color="green" />
              <div>
                <Text size="xs" c="dimmed">WhatsApp</Text>
                <Text fw={700}>{stats.whatsapp}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconMessageCircle size={20} color="orange" />
              <div>
                <Text size="xs" c="dimmed">SMS</Text>
                <Text fw={700}>{stats.sms}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconPhoneCall size={20} color="red" />
              <div>
                <Text size="xs" c="dimmed">Calls</Text>
                <Text fw={700}>{stats.calls}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconVideo size={20} color="purple" />
              <div>
                <Text size="xs" c="dimmed">Meetings</Text>
                <Text fw={700}>{stats.meetings}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <IconMessage size={20} color="gray" />
              <div>
                <Text size="xs" c="dimmed">Total</Text>
                <Text fw={700}>{stats.total}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Paper p="md" withBorder mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Search communications..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              placeholder="Contact"
              data={contacts.map(contact => ({ value: contact.id, label: contact.name }))}
              value={selectedContact}
              onChange={setSelectedContact}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconMessage size={16} />}>
            All Channels
          </Tabs.Tab>
          <Tabs.Tab value="email" leftSection={<IconMail size={16} />}>
            Email
          </Tabs.Tab>
          <Tabs.Tab value="whatsapp" leftSection={<IconBrandWhatsapp size={16} />}>
            WhatsApp
          </Tabs.Tab>
          <Tabs.Tab value="sms" leftSection={<IconMessageCircle size={16} />}>
            SMS
          </Tabs.Tab>
          <Tabs.Tab value="call" leftSection={<IconPhoneCall size={16} />}>
            Phone Calls
          </Tabs.Tab>
          <Tabs.Tab value="meeting" leftSection={<IconVideo size={16} />}>
            Meetings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading communications...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconMessage size={16} />} title="No Communications" color="blue">
                    No communications found. Create your first communication to get started.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="email" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading emails...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconMail size={16} />} title="No Emails" color="blue">
                    No email communications found.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="whatsapp" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading WhatsApp messages...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconBrandWhatsapp size={16} />} title="No WhatsApp Messages" color="blue">
                    No WhatsApp communications found.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="sms" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading SMS messages...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconMessageCircle size={16} />} title="No SMS Messages" color="blue">
                    No SMS communications found.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="call" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading calls...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconPhoneCall size={16} />} title="No Calls" color="blue">
                    No call communications found.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="meeting" pt="md">
          <ScrollArea h={600}>
            {loading ? (
              <Group justify="center" py="xl">
                <Loader size="lg" />
                <Text>Loading meetings...</Text>
              </Group>
            ) : (
              <Stack gap="md">
                {communicationsToShow.map((communication) => (
                  <CommunicationCard
                    key={communication.activityId}
                    communication={communication}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {communicationsToShow.length === 0 && (
                  <Alert icon={<IconVideo size={16} />} title="No Meetings" color="blue">
                    No meeting communications found.
                  </Alert>
                )}
              </Stack>
            )}
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>

      {/* View Communication Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Communication Details"
        size="lg"
      >
        {selectedCommunication && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>{selectedCommunication.activityType.toUpperCase()}</Text>
              <Badge color={selectedCommunication.direction === 'outbound' ? 'green' : 'blue'}>
                {selectedCommunication.direction}
              </Badge>
            </Group>
            
            <Divider />
            
            <Group>
              <Text size="sm" fw={500}>Activity ID:</Text>
              <Text size="sm">{selectedCommunication.activityId}</Text>
            </Group>
            
            <Group>
              <Text size="sm" fw={500}>Contact ID:</Text>
              <Text size="sm">{selectedCommunication.contactId || 'None'}</Text>
            </Group>
            
            <Group>
              <Text size="sm" fw={500}>Account ID:</Text>
              <Text size="sm">{selectedCommunication.accountId || 'None'}</Text>
            </Group>
            
            <Group>
              <Text size="sm" fw={500}>Date:</Text>
              <Text size="sm">
                {new Date(selectedCommunication.activityTimestamp).toLocaleString()}
              </Text>
            </Group>

            <Group>
              <Text size="sm" fw={500}>Summary:</Text>
              <Text size="sm">{selectedCommunication.summary || 'No summary'}</Text>
            </Group>

            <Group>
              <Text size="sm" fw={500}>Visibility:</Text>
              <Text size="sm">{selectedCommunication.visibility}</Text>
            </Group>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setViewModalOpened(false)}>
                Close
              </Button>
              <Button onClick={() => handleEdit(selectedCommunication.activityId)}>
                Edit
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
} 