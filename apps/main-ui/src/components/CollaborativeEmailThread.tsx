import React, { useState } from 'react';
import {
  Card, Stack, Group, Text, Button, Textarea, Modal, Badge, Tooltip, ActionIcon, Menu, Notification, Avatar, Divider
} from '@mantine/core';
import {
  IconUser, IconMail, IconRobotFace, IconThumbUp, IconThumbDown, IconShare, IconSend, IconCheck, IconAlertTriangle, IconMessage, IconUsers, IconChevronDown, IconChevronUp, IconInfoCircle
} from '@tabler/icons-react';

// Mock data
const mockThread = {
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
};
const users = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

// Mock AI functions
function aiSummarizeThread(thread: any) {
  return 'Customer is seeking clarification on project timeline and payment schedule. Awaiting finance input.';
}
function aiReviewDraft(draft: string) {
  if (!draft) return { issues: [], suggestions: [] };
  const issues = draft.length < 20 ? ['Reply is too short'] : [];
  const suggestions = draft.includes('thank') ? [] : ['Consider thanking the customer'];
  return { issues, suggestions };
}
function aiSuggestReply(thread: any) {
  return 'Thank you for your question. We will confirm the payment schedule and revert shortly.';
}
function aiSuggestSolution(thread: any) {
  return 'Refer to the attached payment schedule document. For further queries, contact finance@yourco.com.';
}
function aiThreadHealth(thread: any) {
  return { health: 'At Risk', reason: 'Awaiting internal input for 2 days', color: 'red' };
}

export default function CollaborativeEmailThread({ thread = mockThread }: { thread?: any }) {
  const [comment, setComment] = useState('');
  const [draft, setDraft] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const aiSummary = aiSummarizeThread(thread);
  const aiReview = aiReviewDraft(draft);
  const aiSuggestion = aiSuggestReply(thread);
  const aiSolution = aiSuggestSolution(thread);
  const aiHealth = aiThreadHealth(thread);

  // Drill-down modals
  const modals = (
    <>
      <Modal opened={showSummary} onClose={() => setShowSummary(false)} title="AI Thread Summary" size="md" centered>
        <Text>{aiSummary}</Text>
      </Modal>
      <Modal opened={showReview} onClose={() => setShowReview(false)} title="AI Review of Draft" size="md" centered>
        <Stack>
          <Text fw={700}>Issues:</Text>
          {aiReview.issues.length ? aiReview.issues.map((i, idx) => <Text color="red" key={idx}>- {i}</Text>) : <Text color="green">No major issues detected.</Text>}
          <Text fw={700} mt="md">Suggestions:</Text>
          {aiReview.suggestions.length ? aiReview.suggestions.map((s, idx) => <Text color="blue" key={idx}>- {s}</Text>) : <Text color="green">No suggestions.</Text>}
        </Stack>
      </Modal>
      <Modal opened={showSuggestion} onClose={() => setShowSuggestion(false)} title="AI Suggested Reply" size="md" centered>
        <Text>{aiSuggestion}</Text>
        <Button mt="md" onClick={() => { setDraft(aiSuggestion); setShowSuggestion(false); }}>Use This Reply</Button>
      </Modal>
      <Modal opened={showSolution} onClose={() => setShowSolution(false)} title="AI Suggested Solution" size="md" centered>
        <Text>{aiSolution}</Text>
        <Button mt="md" onClick={() => { setDraft(aiSolution); setShowSolution(false); }}>Insert Solution</Button>
      </Modal>
      <Modal opened={showHealth} onClose={() => setShowHealth(false)} title="Thread Health Details" size="md" centered>
        <Text fw={700} color={aiHealth.color}>{aiHealth.health}</Text>
        <Text>{aiHealth.reason}</Text>
      </Modal>
      <Modal opened={showActivity} onClose={() => setShowActivity(false)} title="Activity Timeline" size="md" centered>
        <Stack>
          {thread.activity.map((a: any) => (
            <Group key={a.id}>
              <Avatar size={24} color="blue"><IconUser size={16} /></Avatar>
              <Text>{a.user} {a.type} on {new Date(a.date).toLocaleString()}</Text>
            </Group>
          ))}
        </Stack>
      </Modal>
    </>
  );

  return (
    <Card withBorder shadow="sm" radius="md" p="md">
      {/* Executive AI summary and drill-downs */}
      <Group mb="md" gap="xs">
        <Notification title="AI Thread Health" color={aiHealth.color} icon={<IconAlertTriangle size={20} />} onClick={() => setShowHealth(true)} style={{ cursor: 'pointer' }}>
          <Text fw={700}>{aiHealth.health}</Text>
          <Text size="sm">{aiHealth.reason}</Text>
        </Notification>
        <Notification title="AI Summary" color="blue" icon={<IconRobotFace size={20} />} onClick={() => setShowSummary(true)} style={{ cursor: 'pointer' }}>
          <Text>{aiSummary}</Text>
        </Notification>
        <Notification title="Activity" color="gray" icon={<IconUsers size={20} />} onClick={() => setShowActivity(true)} style={{ cursor: 'pointer' }}>
          <Text>{thread.activity.length} activities</Text>
        </Notification>
      </Group>
      {/* Email thread view */}
      <Stack mb="md">
        <Text fw={700} size="lg">Subject: {thread.subject}</Text>
        {thread.messages.map((msg: any) => (
          <Card key={msg.id} withBorder radius="sm" p="sm" mb={4} bg={msg.from === thread.customer ? 'gray.0' : 'blue.0'}>
            <Group gap="xs">
              <Avatar color={msg.from === thread.customer ? 'gray' : 'blue'} radius="xl"><IconMail size={16} /></Avatar>
              <Text fw={600}>{msg.from === thread.customer ? 'Customer' : 'You'}</Text>
              <Text size="xs" c="dimmed">{new Date(msg.date).toLocaleString()}</Text>
            </Group>
            <Text mt={4}>{msg.body}</Text>
          </Card>
        ))}
        {/* Internal comments */}
        <Divider label={<Text fw={600} size="sm"><IconMessage size={16} style={{ verticalAlign: 'middle' }} /> Internal Comments</Text>} my="sm" />
        {thread.comments.map((c: any) => (
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
        {/* Add internal comment */}
        <Group align="flex-end" mt="xs">
          <Textarea
            label="Add Internal Comment (@mention to notify)"
            value={comment}
            onChange={e => setComment(e.currentTarget.value)}
            minRows={2}
            autosize
            maw={400}
          />
          <Button onClick={() => { setComment(''); }} leftSection={<IconSend size={16} />}>Comment</Button>
        </Group>
      </Stack>
      {/* Draft reply area and AI actions */}
      <Divider my="sm" />
      <Stack>
        <Textarea
          label="Draft Reply to Customer"
          value={draft}
          onChange={e => setDraft(e.currentTarget.value)}
          minRows={3}
          autosize
        />
        <Group gap="xs">
          <Button leftSection={<IconShare size={16} />}>Share Draft</Button>
          <Menu withinPortal position="bottom-end" shadow="md">
            <Menu.Target>
              <Button leftSection={<IconUser size={16} />}>Assign</Button>
            </Menu.Target>
            <Menu.Dropdown>
              {users.map(u => <Menu.Item key={u} onClick={() => {}}>{u}</Menu.Item>)}
            </Menu.Dropdown>
          </Menu>
          <Button leftSection={<IconCheck size={16} />}>Request Approval</Button>
        </Group>
        <Group gap="xs" mt="xs">
          <Button leftSection={<IconRobotFace size={16} />} variant="light" onClick={() => setShowReview(true)}>AI Review Draft</Button>
          <Button leftSection={<IconRobotFace size={16} />} variant="light" onClick={() => setShowSummary(true)}>AI Summarize Thread</Button>
          <Button leftSection={<IconRobotFace size={16} />} variant="light" onClick={() => setShowSuggestion(true)}>AI Suggest Reply</Button>
          <Button leftSection={<IconRobotFace size={16} />} variant="light" onClick={() => setShowSolution(true)}>AI Suggest Solution</Button>
        </Group>
      </Stack>
      {modals}
    </Card>
  );
} 