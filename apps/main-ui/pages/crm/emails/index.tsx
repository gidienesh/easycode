import React, { useState } from 'react';
import { Container, Title, Stack, Card, Group, Text, Badge, Button, Tooltip, Avatar, Modal, Notification } from '@mantine/core';
import { IconMail, IconRobotFace, IconAlertTriangle, IconUsers } from '@tabler/icons-react';
import { useRouter } from 'next/router';

// Mock data (reuse thread structure)
const mockThreads = [
  {
    id: 1,
    subject: 'Re: Project Timeline and Next Steps',
    customer: 'client@company.com',
    messages: [
      { id: 1, from: 'client@company.com', to: 'sales@yourco.com', date: '2024-06-10T09:00:00', body: 'Can you confirm the project timeline and next steps?' },
      { id: 2, from: 'sales@yourco.com', to: 'client@company.com', date: '2024-06-10T10:00:00', body: 'We expect to deliver phase 1 by July 1st. Next steps: finalize requirements.' },
      { id: 3, from: 'client@company.com', to: 'sales@yourco.com', date: '2024-06-10T11:00:00', body: 'Thanks. Can you clarify the payment schedule?' },
    ],
    comments: [
      { id: 1, author: 'Mary Wambui', date: '2024-06-10T11:15:00', text: 'Can someone from finance confirm the payment terms?', mentions: ['Peter Otieno'] },
      { id: 2, author: 'Peter Otieno', date: '2024-06-10T11:30:00', text: 'Will check and update here.', mentions: [] },
    ],
    activity: [
      { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T11:10:00' },
      { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T11:15:00' },
      { id: 3, type: 'commented', user: 'Peter Otieno', date: '2024-06-10T11:30:00' },
    ],
  },
  {
    id: 2,
    subject: 'Invoice Query: #INV-2024-0012',
    customer: 'finance@bigcorp.com',
    messages: [
      { id: 1, from: 'finance@bigcorp.com', to: 'accounts@yourco.com', date: '2024-06-09T14:00:00', body: 'We have a question about invoice #INV-2024-0012.' },
      { id: 2, from: 'accounts@yourco.com', to: 'finance@bigcorp.com', date: '2024-06-09T15:00:00', body: 'Please clarify your question and we will assist.' },
    ],
    comments: [],
    activity: [
      { id: 1, type: 'viewed', user: 'Grace Njeri', date: '2024-06-09T15:10:00' },
    ],
  },
];

// AI functions (reuse from CollaborativeEmailThread)
function aiSummarizeThread(thread) {
  if (thread.id === 1) return 'Customer is seeking clarification on project timeline and payment schedule.';
  if (thread.id === 2) return 'Customer has a question about an invoice.';
  return 'No summary available.';
}
function aiThreadHealth(thread) {
  if (thread.id === 1) return { health: 'At Risk', reason: 'Awaiting internal input for 2 days', color: 'red' };
  if (thread.id === 2) return { health: 'Healthy', reason: 'Recent response sent', color: 'green' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}

export default function InboxPage() {
  const router = useRouter();
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', thread: any | null }>({ type: null, thread: null });

  return (
    <Container size="md" py="md">
      <Title order={2} mb="md" fw={900} tt="uppercase" c="blue.8">Inbox</Title>
      <Stack>
        {mockThreads.map(thread => {
          const lastMsg = thread.messages[thread.messages.length - 1];
          const aiHealth = aiThreadHealth(thread);
          const aiSummary = aiSummarizeThread(thread);
          return (
            <Card key={thread.id} withBorder shadow="sm" radius="md" p="md" mb="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                  <Avatar color="blue" radius="xl"><IconMail size={18} /></Avatar>
                  <Stack gap={0}>
                    <Text fw={700}>{thread.subject}</Text>
                    <Text size="sm" c="dimmed">{thread.customer}</Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={() => setModal({ type: 'health', thread })} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
                  <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={() => setModal({ type: 'summary', thread })} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
                  <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={() => setModal({ type: 'activity', thread })} style={{ cursor: 'pointer' }}>{thread.activity.length} activities</Badge></Tooltip>
                </Group>
              </Group>
              <Text mt={8} size="sm" c="dimmed">{lastMsg.body.slice(0, 80)}{lastMsg.body.length > 80 ? '...' : ''}</Text>
              <Group gap="xs" mt={8}>
                <Button size="xs" onClick={() => router.push(`/crm/emails/${thread.id}`)}>Open</Button>
                <Button size="xs" variant="light">Assign</Button>
                <Button size="xs" variant="light">Mark as Done</Button>
              </Group>
            </Card>
          );
        })}
      </Stack>
      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, thread: null })} title={modal.type === 'health' ? 'AI Thread Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.thread && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.thread).color}>{aiThreadHealth(modal.thread).health}</Text>
            <Text>{aiThreadHealth(modal.thread).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.thread && (
          <Text>{aiSummarizeThread(modal.thread)}</Text>
        )}
        {modal.type === 'activity' && modal.thread && (
          <Stack>
            {modal.thread.activity.map((a: any) => (
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