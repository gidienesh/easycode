import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group
} from '@mantine/core';
import {
  IconPhoneCall, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck
} from '@tabler/icons-react';

// Mock call logs
const mockCalls = [
  {
    id: 'call-1',
    from: '254700111222',
    to: '254799888777',
    contact: 'Alice M.',
    company: 'Delta Ltd',
    summary: 'Discussed contract terms.',
    timestamp: '2024-06-10T15:00:00Z',
    status: 'completed',
    priority: 'high',
    read: false
  },
  {
    id: 'call-2',
    from: '254799888777',
    to: '254700111222',
    contact: 'Bob N.',
    company: 'Gamma Corp',
    summary: 'Follow-up on delivery.',
    timestamp: '2024-06-09T17:30:00Z',
    status: 'missed',
    priority: 'medium',
    read: true
  }
];

function aiSummarizeThread(call) {
  if (call.id === 'call-1') return 'Contract terms discussed.';
  if (call.id === 'call-2') return 'Missed call, follow-up needed.';
  return 'No summary available.';
}
function aiThreadHealth(call) {
  if (call.id === 'call-1') return { health: 'Healthy', reason: 'Call completed', color: 'green' };
  if (call.id === 'call-2') return { health: 'At Risk', reason: 'Missed call', color: 'red' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}
const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T16:15:00', text: 'Please log the call notes.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T16:30:00', text: 'Notes added.', mentions: [] },
];
const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T16:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T16:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T16:30:00' },
];
const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

export default function PhoneCallsCommunicationsPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', call: any | null }>({ type: null, call: null });

  const handleView = (id: string) => {
    const call = mockCalls.find(m => m.id === id);
    setSelectedCall(call);
    setViewModalOpened(true);
  };

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="lg">Phone Calls Communications</Title>
      <ScrollArea h={600}>
        <Stack gap="md">
          {mockCalls.map((call) => {
            const aiHealth = aiThreadHealth(call);
            const aiSummary = aiSummarizeThread(call);
            return (
              <Card
                key={call.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => handleView(call.id)}
                style={{ cursor: 'pointer' }}
              >
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon color="red" variant="light" size="md"><IconPhoneCall size={18} /></ThemeIcon>
                    <Text fw={500} size="sm" style={{ opacity: call.read ? 0.7 : 1 }}>{call.summary.slice(0, 40)}...</Text>
                  </Group>
                  <Badge color={call.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs">{call.priority}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">From: {call.from}</Text>
                <Text size="sm" c="dimmed" mb="xs">{call.contact} • {call.company}</Text>
                <Group gap="xs" mb="xs">
                  <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', call }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
                  <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', call }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
                  <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', call }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">{new Date(call.timestamp).toLocaleDateString()}</Text>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); handleView(call.id); }}>View Details</Button>
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
        title="Call Details"
        size="lg"
      >
        {selectedCall && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedCall.summary.slice(0, 40)}...</Text>
                <Badge color={selectedCall.status === 'completed' ? 'green' : 'red'}>{selectedCall.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>From:</Text><Text size="sm">{selectedCall.from}</Text></Group>
              <Group><Text size="sm" fw={500}>To:</Text><Text size="sm">{selectedCall.to}</Text></Group>
              <Group><Text size="sm" fw={500}>Date:</Text><Text size="sm">{new Date(selectedCall.timestamp).toLocaleString()}</Text></Group>
              <Group><Text size="sm" fw={500}>Contact:</Text><Text size="sm">{selectedCall.contact}</Text></Group>
              <Group><Text size="sm" fw={500}>Company:</Text><Text size="sm">{selectedCall.company}</Text></Group>
              <Text size="sm" fw={500}>Summary:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedCall.summary}</Text>
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
              <Textarea label="Draft Call Note" minRows={3} autosize />
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
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Summarize Call</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Next Step</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Solution</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>
      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, call: null })} title={modal.type === 'health' ? 'AI Thread Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.call && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.call).color}>{aiThreadHealth(modal.call).health}</Text>
            <Text>{aiThreadHealth(modal.call).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.call && (
          <Text>{aiSummarizeThread(modal.call)}</Text>
        )}
        {modal.type === 'activity' && modal.call && (
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