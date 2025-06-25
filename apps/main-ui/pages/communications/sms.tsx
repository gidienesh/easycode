import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group
} from '@mantine/core';
import {
  IconMessageCircle, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck
} from '@tabler/icons-react';

// Mock SMS messages
const mockSMS = [
  {
    id: 'sms-1',
    from: '254700111222',
    to: '254799888777',
    contact: 'Alice M.',
    company: 'Delta Ltd',
    body: 'Your OTP is 123456.',
    timestamp: '2024-06-10T12:00:00Z',
    status: 'delivered',
    priority: 'high',
    read: false
  },
  {
    id: 'sms-2',
    from: '254799888777',
    to: '254700111222',
    contact: 'Bob N.',
    company: 'Gamma Corp',
    body: 'Thank you for your payment.',
    timestamp: '2024-06-09T18:30:00Z',
    status: 'sent',
    priority: 'medium',
    read: true
  }
];

function aiSummarizeThread(msg) {
  if (msg.id === 'sms-1') return 'OTP sent to customer.';
  if (msg.id === 'sms-2') return 'Payment confirmation sent.';
  return 'No summary available.';
}
function aiThreadHealth(msg) {
  if (msg.id === 'sms-1') return { health: 'Healthy', reason: 'OTP delivered', color: 'green' };
  if (msg.id === 'sms-2') return { health: 'Healthy', reason: 'Payment confirmed', color: 'green' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}
const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T13:15:00', text: 'Please confirm if the OTP was used.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T13:30:00', text: 'Yes, it was successful.', mentions: [] },
];
const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T13:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T13:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T13:30:00' },
];
const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

export default function SMSCommunicationsPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', msg: any | null }>({ type: null, msg: null });

  const handleView = (id: string) => {
    const msg = mockSMS.find(m => m.id === id);
    setSelectedMsg(msg);
    setViewModalOpened(true);
  };

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="lg">SMS Communications</Title>
      <ScrollArea h={600}>
        <Stack gap="md">
          {mockSMS.map((msg) => {
            const aiHealth = aiThreadHealth(msg);
            const aiSummary = aiSummarizeThread(msg);
            return (
              <Card
                key={msg.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => handleView(msg.id)}
                style={{ cursor: 'pointer' }}
              >
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon color="orange" variant="light" size="md"><IconMessageCircle size={18} /></ThemeIcon>
                    <Text fw={500} size="sm" style={{ opacity: msg.read ? 0.7 : 1 }}>{msg.body.slice(0, 40)}...</Text>
                  </Group>
                  <Badge color={msg.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs">{msg.priority}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">From: {msg.from}</Text>
                <Text size="sm" c="dimmed" mb="xs">{msg.contact} • {msg.company}</Text>
                <Group gap="xs" mb="xs">
                  <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', msg }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
                  <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', msg }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
                  <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', msg }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">{new Date(msg.timestamp).toLocaleDateString()}</Text>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); handleView(msg.id); }}>View Details</Button>
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
        title="SMS Message Details"
        size="lg"
      >
        {selectedMsg && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedMsg.body.slice(0, 40)}...</Text>
                <Badge color={selectedMsg.status === 'sent' ? 'green' : 'blue'}>{selectedMsg.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>From:</Text><Text size="sm">{selectedMsg.from}</Text></Group>
              <Group><Text size="sm" fw={500}>To:</Text><Text size="sm">{selectedMsg.to}</Text></Group>
              <Group><Text size="sm" fw={500}>Date:</Text><Text size="sm">{new Date(selectedMsg.timestamp).toLocaleString()}</Text></Group>
              <Group><Text size="sm" fw={500}>Contact:</Text><Text size="sm">{selectedMsg.contact}</Text></Group>
              <Group><Text size="sm" fw={500}>Company:</Text><Text size="sm">{selectedMsg.company}</Text></Group>
              <Text size="sm" fw={500}>Message:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedMsg.body}</Text>
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
              <Textarea label="Draft Reply to Customer" minRows={3} autosize />
              <Group gap="xs">
                <Button leftSection={<IconShare size={16} />}>Share Draft</Button>
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
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Review Draft</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Summarize Thread</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Reply</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Solution</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>
      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, msg: null })} title={modal.type === 'health' ? 'AI Thread Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.msg && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.msg).color}>{aiThreadHealth(modal.msg).health}</Text>
            <Text>{aiThreadHealth(modal.msg).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.msg && (
          <Text>{aiSummarizeThread(modal.msg)}</Text>
        )}
        {modal.type === 'activity' && modal.msg && (
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