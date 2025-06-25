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
  DataTable,
  Paper,
  Tooltip,
  Avatar,
  Timeline
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconPhone,
  IconPhoneCall,
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconClock,
  IconUser,
  IconBuilding,
  IconCalendar,
  IconMessage,
  IconCheck,
  IconX
} from '@tabler/icons-react';

export default function CRMCallLogsPage() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'timeline'>('table');

  const callLogs = [
    {
      id: 1,
      contact: 'Wanjiku Mwangi',
      company: 'Apex Steel Ltd',
      phone: '+254 700 000001',
      type: 'outbound',
      duration: '15:32',
      date: '2024-06-10T14:30:00Z',
      outcome: 'Positive',
      notes: 'Discussed maintenance schedule for M.V./L.V. Switchgear. Client interested in preventive maintenance package. Scheduled follow-up call for next week.',
      user: 'Mary Wambui',
      status: 'Completed',
      nextAction: 'Send proposal by Friday',
      tags: ['Maintenance', 'Follow-up']
    },
    {
      id: 2,
      contact: 'John Kamau',
      company: 'Mars Wrigley East Africa',
      phone: '+254 700 000002',
      type: 'inbound',
      duration: '08:45',
      date: '2024-06-10T11:15:00Z',
      outcome: 'Qualified',
      notes: 'Client called to discuss proposal sent last week. Had questions about technical specifications. Provided detailed explanation and scheduled site visit.',
      user: 'Peter Otieno',
      status: 'Completed',
      nextAction: 'Schedule site visit',
      tags: ['Proposal', 'Technical']
    },
    {
      id: 3,
      contact: 'Aisha Hassan',
      company: 'French Embassy',
      phone: '+254 700 000003',
      type: 'outbound',
      duration: '22:15',
      date: '2024-06-09T10:00:00Z',
      outcome: 'Successful',
      notes: 'Follow-up call after site visit. Client confirmed requirements and approved project scope. Discussed timeline and budget.',
      user: 'Grace Njeri',
      status: 'Completed',
      nextAction: 'Prepare contract',
      tags: ['Site Visit', 'Approval']
    },
    {
      id: 4,
      contact: 'Grace Njeri',
      company: 'Diamond Trust Bank Mombasa Road',
      phone: '+254 700 000004',
      type: 'inbound',
      duration: '05:20',
      date: '2024-06-09T09:00:00Z',
      outcome: 'Neutral',
      notes: 'Client called to reschedule maintenance appointment. New date confirmed for next week. No issues reported.',
      user: 'Mary Wambui',
      status: 'Completed',
      nextAction: 'Update calendar',
      tags: ['Reschedule', 'Maintenance']
    },
    {
      id: 5,
      contact: 'Peter Otieno',
      company: 'Tanesco Zanzibar',
      phone: '+254 700 000005',
      type: 'outbound',
      duration: '18:30',
      date: '2024-06-08T16:45:00Z',
      outcome: 'Qualified',
      notes: 'Initial contact call. Introduced company services and discussed potential collaboration on GHA M.V./L.V. Switchgear maintenance.',
      user: 'Peter Otieno',
      status: 'Completed',
      nextAction: 'Schedule technical presentation',
      tags: ['Initial Contact', 'Qualification']
    },
    {
      id: 6,
      contact: 'Mercy Wairimu',
      company: 'Safe Pak Ltd',
      phone: '+254 700 000006',
      type: 'outbound',
      duration: '12:45',
      date: '2024-06-08T14:20:00Z',
      outcome: 'Positive',
      notes: 'Follow-up call on technical specifications sent. Client satisfied with details provided. Requested additional information on timeline.',
      user: 'Grace Njeri',
      status: 'Completed',
      nextAction: 'Send timeline details',
      tags: ['Technical', 'Follow-up']
    },
    {
      id: 7,
      contact: 'Project Manager',
      company: 'Lafarge Holcim Nairobi Grinding Plant',
      phone: '+254 700 000007',
      type: 'inbound',
      duration: '45:20',
      date: '2024-06-07T13:00:00Z',
      outcome: 'Successful',
      notes: 'Project kickoff call for GHA M.V. switchgear supply and installation. Discussed timeline, deliverables, and team assignments.',
      user: 'Jaston Mbohe',
      status: 'Completed',
      nextAction: 'Begin procurement process',
      tags: ['Kickoff', 'Project']
    },
    {
      id: 8,
      contact: 'Maintenance Team',
      company: 'Vipingo Ridge Kilifi',
      phone: '+254 700 000008',
      type: 'outbound',
      duration: '08:15',
      date: '2024-06-07T11:30:00Z',
      outcome: 'Neutral',
      notes: 'Routine check-in call. Discussed ongoing maintenance work and scheduled next service visit.',
      user: 'Jaston Mbohe',
      status: 'Completed',
      nextAction: 'Schedule next service',
      tags: ['Routine', 'Maintenance']
    }
  ];

  const columns = [
    { accessor: 'contact', title: 'Contact', sortable: true },
    { accessor: 'company', title: 'Company', sortable: true },
    { accessor: 'phone', title: 'Phone', sortable: true },
    { 
      accessor: 'type', 
      title: 'Type', 
      sortable: true,
      render: ({ type }) => (
        <Badge 
          color={type === 'inbound' ? 'green' : 'blue'} 
          variant="light"
          leftSection={type === 'inbound' ? <IconPhoneIncoming size={12} /> : <IconPhoneOutgoing size={12} />}
        >
          {type}
        </Badge>
      )
    },
    { accessor: 'duration', title: 'Duration', sortable: true },
    { 
      accessor: 'outcome', 
      title: 'Outcome', 
      sortable: true,
      render: ({ outcome }) => (
        <Badge 
          color={
            outcome === 'Positive' || outcome === 'Successful' ? 'green' : 
            outcome === 'Qualified' ? 'blue' : 
            outcome === 'Neutral' ? 'yellow' : 'red'
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
      title: 'Date', 
      sortable: true,
      render: ({ date }) => new Date(date).toLocaleDateString()
    }
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive':
      case 'Successful': return 'green';
      case 'Qualified': return 'blue';
      case 'Neutral': return 'yellow';
      default: return 'red';
    }
  };

  const handleEdit = (call: any) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Call Logs</Title>
        <Group>
          <Button 
            variant={view === 'table' ? 'filled' : 'light'}
            onClick={() => setView('table')}
            leftSection={<IconPhone size={16} />}
          >
            Table View
          </Button>
          <Button 
            variant={view === 'timeline' ? 'filled' : 'light'}
            onClick={() => setView('timeline')}
            leftSection={<IconCalendar size={16} />}
          >
            Timeline View
          </Button>
          <Button leftSection={<IconPlus size={16} />} color="blue">
            Log Call
          </Button>
        </Group>
      </Group>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          records={callLogs}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={400}
          idAccessor="id"
        />
      ) : (
        <Timeline active={1} bulletSize={24} lineWidth={2}>
          {callLogs.map((call, index) => (
            <Timeline.Item
              key={call.id}
              bullet={
                <ActionIcon 
                  color={getOutcomeColor(call.outcome)} 
                  variant="light" 
                  size="sm"
                  onClick={() => handleEdit(call)}
                >
                  {call.type === 'inbound' ? <IconPhoneIncoming size={12} /> : <IconPhoneOutgoing size={12} />}
                </ActionIcon>
              }
              title={
                <Group gap="xs">
                  <Text fw={600} size="sm">{call.contact}</Text>
                  <Badge color={getOutcomeColor(call.outcome)} variant="light" size="xs">
                    {call.outcome}
                  </Badge>
                  <Badge color={call.type === 'inbound' ? 'green' : 'blue'} variant="light" size="xs">
                    {call.type}
                  </Badge>
                </Group>
              }
            >
              <Paper p="md" withBorder mt="xs">
                <Stack gap="xs">
                  <Group gap="lg" wrap="nowrap">
                    <Group gap="xs">
                      <IconBuilding size={14} />
                      <Text size="sm">{call.company}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconPhone size={14} />
                      <Text size="sm">{call.phone}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconClock size={14} />
                      <Text size="sm">{call.duration}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconUser size={14} />
                      <Text size="sm">{call.user}</Text>
                    </Group>
                  </Group>
                  
                  <Text size="sm" c="dimmed">
                    {new Date(call.date).toLocaleString()}
                  </Text>
                  
                  <Text size="sm">{call.notes}</Text>
                  
                  {call.nextAction && (
                    <Paper p="xs" bg="blue.0" withBorder>
                      <Text size="xs" fw={500} c="blue">Next Action: {call.nextAction}</Text>
                    </Paper>
                  )}
                  
                  <Group gap="xs">
                    {call.tags.map((tag: string) => (
                      <Badge key={tag} variant="light" size="xs">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Paper>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      {/* Edit Call Modal */}
      <Modal 
        opened={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Call Log"
        size="lg"
      >
        {selectedCall && (
          <Stack>
            <Group>
              <TextInput
                label="Contact"
                value={selectedCall.contact}
                placeholder="Contact name"
                style={{ flex: 1 }}
              />
              <TextInput
                label="Company"
                value={selectedCall.company}
                placeholder="Company name"
                style={{ flex: 1 }}
              />
            </Group>
            
            <Group>
              <TextInput
                label="Phone"
                value={selectedCall.phone}
                placeholder="Phone number"
                style={{ flex: 1 }}
              />
              <Select
                label="Type"
                value={selectedCall.type}
                data={[
                  { value: 'inbound', label: 'Inbound' },
                  { value: 'outbound', label: 'Outbound' }
                ]}
                style={{ flex: 1 }}
              />
            </Group>
            
            <Group>
              <TextInput
                label="Duration"
                value={selectedCall.duration}
                placeholder="MM:SS"
                style={{ flex: 1 }}
              />
              <Select
                label="Outcome"
                value={selectedCall.outcome}
                data={[
                  { value: 'Positive', label: 'Positive' },
                  { value: 'Qualified', label: 'Qualified' },
                  { value: 'Neutral', label: 'Neutral' },
                  { value: 'Negative', label: 'Negative' },
                  { value: 'Successful', label: 'Successful' }
                ]}
                style={{ flex: 1 }}
              />
            </Group>
            
            <Textarea
              label="Notes"
              value={selectedCall.notes}
              placeholder="Call notes and details"
              minRows={4}
            />
            
            <TextInput
              label="Next Action"
              value={selectedCall.nextAction}
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
    </Container>
  );
} 