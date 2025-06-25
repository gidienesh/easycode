import React, { useState } from 'react';
import {
  Container, Title, Text, Stack, Badge, Card, Tooltip, Button, ActionIcon, Modal, Divider, Avatar, Textarea, Menu, ScrollArea, ThemeIcon, Group, SegmentedControl, Paper, Grid, Box
} from '@mantine/core';
import {
  IconNote, IconAlertTriangle, IconRobotFace, IconUsers, IconArrowBackUp, IconSend, IconShare, IconUser, IconCheck, IconClock, IconCalendar, IconFlag, IconPlus, IconFileText, IconBookmark, IconPin
} from '@tabler/icons-react';

// Mock notes with sticky note styling
const mockNotes = [
  {
    id: 'note-1',
    title: 'Q2 Planning Meeting Notes',
    author: 'Mary Wambui',
    category: 'meeting',
    tags: ['planning', 'Q2', 'strategy'],
    content: 'Key points from Q2 planning meeting:\n\n1. Revenue targets increased by 15%\n2. New product launch scheduled for July\n3. Team expansion planned for Q3\n4. Marketing budget approved\n\nAction items:\n- Prepare detailed project timeline\n- Set up weekly progress reviews\n- Coordinate with marketing team',
    createdDate: '2024-06-10T09:00:00Z',
    updatedDate: '2024-06-10T11:30:00Z',
    priority: 'high',
    status: 'active',
    read: false,
    color: 'yellow',
    pinned: true
  },
  {
    id: 'note-2',
    title: 'Client Requirements - Beta Corp',
    author: 'Alice M.',
    category: 'client',
    tags: ['client', 'requirements', 'beta-corp'],
    content: 'Beta Corp project requirements:\n\nTechnical Requirements:\n- Cloud-based solution\n- Mobile responsive design\n- Integration with existing systems\n- Real-time reporting\n\nTimeline: 3 months\nBudget: $50,000\n\nNext steps: Technical review meeting',
    createdDate: '2024-06-09T14:00:00Z',
    updatedDate: '2024-06-09T16:00:00Z',
    priority: 'medium',
    status: 'active',
    read: true,
    color: 'blue',
    pinned: false
  },
  {
    id: 'note-3',
    title: 'System Architecture Ideas',
    author: 'Bob N.',
    category: 'technical',
    tags: ['architecture', 'system', 'ideas'],
    content: 'System architecture improvements:\n\n1. Microservices approach\n2. API-first design\n3. Containerization with Docker\n4. CI/CD pipeline\n5. Monitoring and logging\n\nBenefits:\n- Scalability\n- Maintainability\n- Faster deployment\n- Better testing',
    createdDate: '2024-06-08T10:00:00Z',
    updatedDate: '2024-06-08T12:00:00Z',
    priority: 'low',
    status: 'draft',
    read: true,
    color: 'green',
    pinned: false
  },
  {
    id: 'note-4',
    title: 'Quick Ideas for Marketing',
    author: 'Grace Njeri',
    category: 'ideas',
    tags: ['marketing', 'ideas', 'campaign'],
    content: 'Marketing campaign ideas:\n\n- Social media challenge\n- Influencer partnerships\n- Email newsletter series\n- Webinar series\n- Customer testimonials\n\nNeed to discuss with team!',
    createdDate: '2024-06-07T15:00:00Z',
    updatedDate: '2024-06-07T15:30:00Z',
    priority: 'medium',
    status: 'active',
    read: true,
    color: 'pink',
    pinned: true
  }
];

function aiSummarizeNote(note) {
  if (note.id === 'note-1') return 'Q2 planning meeting notes with key objectives and action items.';
  if (note.id === 'note-2') return 'Beta Corp client requirements and project specifications.';
  if (note.id === 'note-3') return 'Technical architecture ideas for system improvements.';
  if (note.id === 'note-4') return 'Marketing campaign ideas and strategies.';
  return 'No summary available.';
}

function aiNoteHealth(note) {
  if (note.id === 'note-1') return { health: 'Complete', reason: 'Meeting notes fully documented', color: 'green' };
  if (note.id === 'note-2') return { health: 'In Progress', reason: 'Requirements need validation', color: 'yellow' };
  if (note.id === 'note-3') return { health: 'Draft', reason: 'Architecture ideas need review', color: 'gray' };
  if (note.id === 'note-4') return { health: 'Active', reason: 'Ideas ready for discussion', color: 'blue' };
  return { health: 'Unknown', reason: '', color: 'gray' };
}

const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T12:15:00', text: 'Action items have been assigned to team members.', mentions: ['Alice M.'] },
  { id: 2, author: 'Alice M.', date: '2024-06-10T12:30:00', text: 'Will review and update timeline.', mentions: [] },
];

const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T12:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T12:15:00' },
  { id: 3, type: 'commented', user: 'Alice M.', date: '2024-06-10T12:30:00' },
];

const owners = ['Mary Wambui', 'Alice M.', 'Bob N.', 'Grace Njeri'];

const noteColors = {
  yellow: { bg: '#fef9c3', border: '#fde047', text: '#92400e' },
  blue: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  green: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  pink: { bg: '#fce7f3', border: '#f9a8d4', text: '#be185d' },
  purple: { bg: '#f3e8ff', border: '#c4b5fd', text: '#7c3aed' },
  orange: { bg: '#fed7aa', border: '#fdba74', text: '#c2410c' }
};

// Sticky Note Component
function StickyNote({ note, onViewNote, onTogglePin, setModal }) {
  const aiHealth = aiNoteHealth(note);
  const aiSummary = aiSummarizeNote(note);
  const colorScheme = noteColors[note.color] || noteColors.yellow;
  
  return (
    <Card
      shadow="md"
      padding="md"
      radius="md"
      withBorder
      onClick={() => onViewNote(note.id)}
      style={{
        cursor: 'pointer',
        backgroundColor: colorScheme.bg,
        borderColor: colorScheme.border,
        borderWidth: '2px',
        borderStyle: 'solid',
        transform: note.pinned ? 'rotate(-1deg)' : 'rotate(0deg)',
        transition: 'all 0.2s ease',
        position: 'relative',
        minHeight: '200px',
        fontFamily: '"Comic Sans MS", cursive, sans-serif',
        '&:hover': {
          transform: note.pinned ? 'rotate(0deg) scale(1.02)' : 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <Box
          style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          <ThemeIcon color="red" size="sm" radius="xl">
            <IconPin size={12} />
          </ThemeIcon>
        </Box>
      )}
      
      <Group justify="space-between" mb="xs">
        <Text 
          fw={700} 
          size="md" 
          style={{ 
            color: colorScheme.text,
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            textDecoration: 'underline'
          }}
        >
          {note.title}
        </Text>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          style={{ color: colorScheme.text }}
        >
          {note.pinned ? <IconPin size={16} /> : <IconPin size={16} />}
        </ActionIcon>
      </Group>
      
      <Text 
        size="sm" 
        c="dimmed" 
        mb="xs"
        style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
      >
        By: {note.author}
      </Text>
      
      <Text 
        size="sm" 
        mb="xs" 
        lineClamp={6} 
        style={{ 
          whiteSpace: 'pre-wrap',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          color: colorScheme.text,
          lineHeight: '1.4'
        }}
      >
        {note.content}
      </Text>
      
      <Group gap="xs" mb="xs" wrap="wrap">
        {note.tags.slice(0, 3).map((tag) => (
          <Badge 
            key={tag} 
            color="gray" 
            variant="light" 
            size="xs"
            style={{ 
              fontFamily: '"Comic Sans MS", cursive, sans-serif',
              fontSize: '10px'
            }}
          >
            #{tag}
          </Badge>
        ))}
        {note.tags.length > 3 && (
          <Text size="xs" c="dimmed" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            +{note.tags.length - 3} more
          </Text>
        )}
      </Group>
      
      <Group gap="xs" mb="xs" justify="center">
        <Tooltip label={aiHealth.reason}>
          <Badge 
            color={aiHealth.color} 
            leftSection={<IconAlertTriangle size={12} />} 
            onClick={e => { e.stopPropagation(); setModal({ type: 'health', note }); }} 
            style={{ cursor: 'pointer', fontSize: '10px' }}
          >
            {aiHealth.health}
          </Badge>
        </Tooltip>
        <Tooltip label={aiSummary}>
          <Badge 
            color="blue" 
            leftSection={<IconRobotFace size={12} />} 
            onClick={e => { e.stopPropagation(); setModal({ type: 'summary', note }); }} 
            style={{ cursor: 'pointer', fontSize: '10px' }}
          >
            AI Summary
          </Badge>
        </Tooltip>
      </Group>
      
      <Group justify="space-between" align="center" mt="auto">
        <Text 
          size="xs" 
          c="dimmed"
          style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
        >
          {new Date(note.updatedDate).toLocaleDateString()}
        </Text>
        <Button 
          size="xs" 
          variant="light" 
          onClick={e => { e.stopPropagation(); onViewNote(note.id); }}
          style={{ 
            backgroundColor: colorScheme.border,
            color: colorScheme.text,
            fontFamily: '"Comic Sans MS", cursive, sans-serif'
          }}
        >
          View Details
        </Button>
      </Group>
    </Card>
  );
}

// Sticky Note view components
function StickyNotesView({ notes, onViewNote, onTogglePin, setModal }) {
  const pinnedNotes = notes.filter(note => note.pinned);
  const unpinnedNotes = notes.filter(note => !note.pinned);
  
  return (
    <Stack gap="lg">
      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <Box>
          <Text fw={600} size="sm" mb="md" c="dimmed" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            📌 Pinned Notes
          </Text>
          <Grid>
            {pinnedNotes.map((note) => (
              <Grid.Col key={note.id} span={4}>
                <StickyNote note={note} onViewNote={onViewNote} onTogglePin={onTogglePin} setModal={setModal} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Regular Notes Section */}
      {unpinnedNotes.length > 0 && (
        <Box>
          <Text fw={600} size="sm" mb="md" c="dimmed" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            📝 All Notes
          </Text>
          <Grid>
            {unpinnedNotes.map((note) => (
              <Grid.Col key={note.id} span={4}>
                <StickyNote note={note} onViewNote={onViewNote} onTogglePin={onTogglePin} setModal={setModal} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}

function ListView({ notes, onViewNote, onTogglePin, setModal }) {
  return (
    <Stack gap="md">
      {notes.map((note) => {
        const aiHealth = aiNoteHealth(note);
        const aiSummary = aiSummarizeNote(note);
        const colorScheme = noteColors[note.color] || noteColors.yellow;
        
        return (
          <Card
            key={note.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            onClick={() => onViewNote(note.id)}
            style={{
              cursor: 'pointer',
              backgroundColor: colorScheme.bg,
              borderColor: colorScheme.border,
              borderWidth: '2px',
              borderStyle: 'solid',
              fontFamily: '"Comic Sans MS", cursive, sans-serif'
            }}
          >
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="blue" variant="light" size="md"><IconNote size={18} /></ThemeIcon>
                <Text 
                  fw={500} 
                  size="sm" 
                  style={{ 
                    opacity: note.read ? 0.7 : 1,
                    color: colorScheme.text,
                    fontFamily: '"Comic Sans MS", cursive, sans-serif'
                  }}
                >
                  {note.title}
                </Text>
                {note.pinned && <IconPin size={16} color="red" />}
              </Group>
              <Group gap="xs">
                <Badge color={note.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs" leftSection={<IconFlag size={12} />}>{note.priority}</Badge>
                <Badge color={note.status === 'active' ? 'green' : 'gray'} variant="light" size="xs">{note.status}</Badge>
              </Group>
            </Group>
            
            <Text size="sm" c="dimmed" mb="xs" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>Author: {note.author}</Text>
            <Text size="sm" c="dimmed" mb="xs" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>Category: {note.category}</Text>
            
            <Group gap="xs" mb="xs">
              {note.tags.map((tag) => (
                <Badge key={tag} color="gray" variant="light" size="xs" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>#{tag}</Badge>
              ))}
            </Group>
            
            <Text size="sm" mb="xs" lineClamp={3} style={{ whiteSpace: 'pre-wrap', color: colorScheme.text, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
              {note.content}
            </Text>
            
            <Group gap="xs" mb="xs">
              <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', note }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
              <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', note }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
              <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', note }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
            </Group>
            
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>Updated: {new Date(note.updatedDate).toLocaleDateString()}</Text>
              <Group gap="xs">
                <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); onViewNote(note.id); }}>View Details</Button>
                <ActionIcon variant="light" size="sm" onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}>
                  {note.pinned ? <IconPin size={14} /> : <IconPin size={14} />}
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}

export default function NotesPage() {
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', note: any | null }>({ type: null, note: null });
  const [activeView, setActiveView] = useState('sticky');
  const [notes, setNotes] = useState(mockNotes);

  const handleView = (id: string) => {
    const note = notes.find(n => n.id === id);
    setSelectedNote(note);
    setViewModalOpened(true);
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const renderView = () => {
    switch (activeView) {
      case 'sticky':
        return <StickyNotesView notes={notes} onViewNote={handleView} onTogglePin={handleTogglePin} setModal={setModal} />;
      case 'list':
        return <ListView notes={notes} onViewNote={handleView} onTogglePin={handleTogglePin} setModal={setModal} />;
      default:
        return <StickyNotesView notes={notes} onViewNote={handleView} onTogglePin={handleTogglePin} setModal={setModal} />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2} style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>📝 Sticky Notes</Title>
        <Group gap="xs">
          <SegmentedControl
            value={activeView}
            onChange={setActiveView}
            data={[
              { label: 'Sticky Notes', value: 'sticky' },
              { label: 'List', value: 'list' }
            ]}
          />
          <Button leftSection={<IconPlus size={16} />} size="sm">
            Add Note
          </Button>
        </Group>
      </Group>

      {renderView()}

      {/* Note Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Note Details"
        size="lg"
      >
        {selectedNote && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500} style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>{selectedNote.title}</Text>
                <Badge color={selectedNote.status === 'active' ? 'green' : 'gray'}>{selectedNote.status}</Badge>
              </Group>
              <Divider />
              <Group><Text size="sm" fw={500}>Author:</Text><Text size="sm">{selectedNote.author}</Text></Group>
              <Group><Text size="sm" fw={500}>Category:</Text><Text size="sm">{selectedNote.category}</Text></Group>
              <Group><Text size="sm" fw={500}>Created:</Text><Text size="sm">{new Date(selectedNote.createdDate).toLocaleString()}</Text></Group>
              <Group><Text size="sm" fw={500}>Updated:</Text><Text size="sm">{new Date(selectedNote.updatedDate).toLocaleString()}</Text></Group>
              <Group gap="xs">
                <Text size="sm" fw={500}>Tags:</Text>
                {selectedNote.tags.map((tag) => (
                  <Badge key={tag} color="gray" variant="light" size="sm">#{tag}</Badge>
                ))}
              </Group>
              <Text size="sm" fw={500}>Content:</Text>
              <Paper p="md" withBorder bg="gray.0" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{selectedNote.content}</Text>
              </Paper>
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
              <Textarea label="Edit Note Content" minRows={8} autosize defaultValue={selectedNote.content} />
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
                <Button leftSection={<IconBookmark size={16} />}>Bookmark</Button>
              </Group>
              <Group gap="xs" mt="xs">
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Summarize</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Extract Actions</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Suggest Tags</Button>
                <Button leftSection={<IconRobotFace size={16} />} variant="light">AI Improve Content</Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, note: null })} title={modal.type === 'health' ? 'AI Note Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.note && (
          <Stack>
            <Text fw={700} color={aiNoteHealth(modal.note).color}>{aiNoteHealth(modal.note).health}</Text>
            <Text>{aiNoteHealth(modal.note).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.note && (
          <Text>{aiSummarizeNote(modal.note)}</Text>
        )}
        {modal.type === 'activity' && modal.note && (
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