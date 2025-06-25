import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group
} from '@mantine/core';
import {
  IconVideo, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck
} from '@tabler/icons-react';

// Mock meetings
const mockMeetings = [
  {
    id: 'meeting-1',
    subject: 'Q2 Planning',
    organizer: 'Mary Wambui',
    participants: ['Alice M.', 'Bob N.'],
    company: 'Delta Ltd',
    notes: 'Discussed Q2 targets and deliverables.',
    timestamp: '2024-06-10T09:00:00Z',
    status: 'completed',
    priority: 'high',
    read: false
  },
  {
    id: 'meeting-2',
    subject: 'Client Demo',
    organizer: 'Bob N.',
    participants: ['Mary Wambui', 'Alice M.'],
    company: 'Gamma Corp',
    notes: 'Demoed new features to client.',
    timestamp: '2024-06-09T14:00:00Z',
    status: 'scheduled',
    priority: 'medium',
    read: true
  }
];

function aiSummarizeThread(meeting) {
  if (meeting.id === 'meeting-1') return 'Q2 planning completed.';
  if (meeting.id === 'meeting-2') return 'Client demo scheduled.';
  return 'No summary available.';
}
function aiThreadHealth(meeting) {
  if (meeting.id === 'meeting-1') return { health: 'Healthy', reason: 'Meeting completed', color: 'green' };
  if (meeting.id === 'meeting-2') return { health: 'Upcoming', reason: 'Scheduled for tomorrow', color: 'blue' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}
const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T10:15:00', text: 'Please upload the meeting notes.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T10:30:00', text: 'Notes uploaded.', mentions: [] },
];
const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T10:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T10:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T10:30:00' },
];
const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

export default function MeetingsCommunicationsPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', meeting: any | null }>({ type: null, meeting: null });

  const handleView = (id: string) => {
    const meeting = mockMeetings.find(m => m.id === id);
    setSelectedMeeting(meeting);
    setViewModalOpened(true);
  };

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="lg">Meetings Communications</Title>
      <ScrollArea h={600}>
        <Stack gap="md">
          {mockMeetings.map((meeting) => {
            const aiHealth = aiThreadHealth(meeting);
            const aiSummary = aiSummarizeThread(meeting);
            return (
              <Card
                key={meeting.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => handleView(meeting.id)}
                style={{ cursor: 'pointer' }}
              >
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon color="purple" variant="light" size="md"><IconVideo size={18} /></ThemeIcon>
                    <Text fw={500} size="sm" style={{ opacity: meeting.read ? 0.7 : 1 }}>{meeting.subject}</Text>
                  </Group>
                  <Badge color={meeting.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs">{meeting.priority}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">Organizer: {meeting.organizer}</Text>
                <Text size="sm" c="dimmed" mb="xs">Participants: {meeting.participants.join(', ')}</Text>
                <Text size="sm" c="dimmed" mb="xs">{meeting.company}</Text>
                <Group gap="xs" mb="xs">
                  <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', meeting }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
                  <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', meeting }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
                  <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', meeting }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">{new Date(meeting.timestamp).toLocaleDateString()}</Text>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); handleView(meeting.id); }}>View Details</Button>
                    <Tooltip label="Reply">
                      <ActionIcon variant="light" size="sm" onClick={e => e.stopPropagation()}><IconArrowBackUp size={14} /></ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Card>
            );
          })}
        </Stack>
      </ScrollArea>
      {/* Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Meeting Details"
        size="lg"
      >
        {selectedMeeting && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedMeeting.subject}</Text>
                <Badge color={selectedMeeting.status === 'completed' ? 'green' : 'blue'}>{selectedMeeting.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>Organizer:</Text><Text size="sm">{selectedMeeting.organizer}</Text></Group>
              <Group><Text size="sm" fw={500}>Participants:</Text><Text size="sm">{selectedMeeting.participants.join(', ')}</Text></Group>
              <Group><Text size="sm" fw={500}>Date:</Text><Text size="sm">{new Date(selectedMeeting.timestamp).toLocaleString()}</Text></Group>
              <Group><Text size="sm" fw={500}>Company:</Text><Text size="sm">{selectedMeeting.company}</Text></Group>
              <Text size="sm" fw={500}>Notes:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedMeeting.notes}</Text>
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
              <Textarea label="Draft Meeting Note" minRows={3} autosize />
              <Group gap="xs">
                <Button leftSection={<IconShare size={16} />}>Share Note</Button>
                <Menu withinPortal position="bottom-end" shadow="md">
                  <Menu.Target>
                    <Button leftSection={<IconUser size={16} />}>Assign</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {owners.map(u => <Menu.Item key={u}>{u}</Menu.Item>)}
                  </Menu.Dropdown>
                </Menu>
                <Button leftSection={<IconCheck size={16} />}>Request Approval</Button>
              </Group>
              <Group gap="xs" mt="xs">
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Review Note</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Summarize Meeting</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Next Step</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Solution</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>
      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, meeting: null })} title={modal.type === 'health' ? 'AI Thread Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.meeting && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.meeting).color}>{aiThreadHealth(modal.meeting).health}</Text>
            <Text>{aiThreadHealth(modal.meeting).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.meeting && (
          <Text>{aiSummarizeThread(modal.meeting)}</Text>
        )}
        {modal.type === 'activity' && modal.meeting && (
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