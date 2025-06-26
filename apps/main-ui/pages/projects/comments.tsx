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
  TextInput,
  Textarea,
  Select,
  Avatar,
  Divider,
  Box,
  UnstyledButton
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconMessageReply,
  IconHeart,
  IconHeartFilled,
  IconPin,
  IconPinFilled,
  IconMessage,
  IconFilter,
  IconSearch,
  IconSend,
  IconFile,
  IconLink,
  IconAt,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';

// Mock comments data
const mockComments = [
  {
    id: 'comment-1',
    content: 'The database schema looks good, but I think we should add an index on the user_id column for better performance.',
    author: {
      id: 'user-1',
      name: 'Mary Wambui',
      avatar: 'MW',
      role: 'Lead Developer'
    },
    project: 'EasyCode Platform Enhancement',
    task: 'Database Schema Design',
    timestamp: new Date('2024-06-25T10:30:00'),
    likes: 3,
    isLiked: true,
    isPinned: false,
    replies: [
      {
        id: 'reply-1',
        content: 'Great point! I\'ll add that index. Should we also consider adding a composite index on (user_id, created_at)?',
        author: {
          id: 'user-2',
          name: 'Peter Otieno',
          avatar: 'PO',
          role: 'Backend Developer'
        },
        timestamp: new Date('2024-06-25T11:15:00'),
        likes: 1,
        isLiked: false
      },
      {
        id: 'reply-2',
        content: 'Yes, that composite index would be perfect for our query patterns.',
        author: {
          id: 'user-1',
          name: 'Mary Wambui',
          avatar: 'MW',
          role: 'Lead Developer'
        },
        timestamp: new Date('2024-06-25T11:30:00'),
        likes: 2,
        isLiked: true
      }
    ]
  },
  {
    id: 'comment-2',
    content: 'I\'ve completed the UI mockups for the dashboard. Please review and let me know if any changes are needed.',
    author: {
      id: 'user-3',
      name: 'Grace Njeri',
      avatar: 'GN',
      role: 'UI/UX Designer'
    },
    project: 'EasyCode Platform Enhancement',
    task: 'Dashboard UI Design',
    timestamp: new Date('2024-06-24T16:45:00'),
    likes: 5,
    isLiked: false,
    isPinned: true,
    replies: [
      {
        id: 'reply-3',
        content: 'The mockups look fantastic! I especially like the new color scheme.',
        author: {
          id: 'user-4',
          name: 'John Kiprotich',
          avatar: 'JK',
          role: 'Product Manager'
        },
        timestamp: new Date('2024-06-24T17:20:00'),
        likes: 2,
        isLiked: true
      }
    ]
  },
  {
    id: 'comment-3',
    content: 'We need to discuss the API rate limiting strategy. The current implementation might not scale well.',
    author: {
      id: 'user-2',
      name: 'Peter Otieno',
      avatar: 'PO',
      role: 'Backend Developer'
    },
    project: 'Client Onboarding Automation',
    task: 'API Development',
    timestamp: new Date('2024-06-23T14:20:00'),
    likes: 1,
    isLiked: false,
    isPinned: false,
    replies: []
  }
];

const mockProjects = [
  { value: 'all', label: 'All Projects' },
  { value: 'easycode', label: 'EasyCode Platform Enhancement' },
  { value: 'onboarding', label: 'Client Onboarding Automation' }
];

export default function ProjectCommentsPage() {
  const [comments, setComments] = useState(mockComments);
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            )
          };
        } else if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      })
    );
  };

  const togglePin = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isPinned: !comment.isPinned }
          : comment
      )
    );
  };

  const toggleExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const filteredComments = comments.filter(comment => {
    const matchesProject = selectedProject === 'all' || 
      comment.project.toLowerCase().includes(selectedProject === 'easycode' ? 'easycode' : 'onboarding');
    const matchesSearch = searchQuery === '' || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'oldest':
        return a.timestamp.getTime() - b.timestamp.getTime();
      case 'most_liked':
        return b.likes - a.likes;
      case 'pinned':
        return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      default:
        return 0;
    }
  });

  const CommentCard = ({ comment, isReply = false, parentId }: any) => (
    <Card withBorder p="md" mb={isReply ? "xs" : "md"} ml={isReply ? "xl" : 0}>
      <Group justify="space-between" align="flex-start" mb="xs">
        <Group gap="xs">
          <Avatar size="sm" name={comment.author.name}>
            {comment.author.avatar}
          </Avatar>
          <div>
            <Group gap="xs">
              <Text fw={500} size="sm">{comment.author.name}</Text>
              <Badge size="xs" variant="light">{comment.author.role}</Badge>
              {!isReply && comment.isPinned && (
                <IconPinFilled size={12} color="orange" />
              )}
            </Group>
            <Text size="xs" c="dimmed">
              {comment.timestamp.toLocaleString()}
            </Text>
          </div>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
            <Menu.Item leftSection={<IconMessageReply size={14} />} onClick={() => setReplyTo(comment.id)}>
              Reply
            </Menu.Item>
            {!isReply && (
              <Menu.Item 
                leftSection={comment.isPinned ? <IconPin size={14} /> : <IconPinFilled size={14} />}
                onClick={() => togglePin(comment.id)}
              >
                {comment.isPinned ? 'Unpin' : 'Pin'}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Text size="sm" mb="md">{comment.content}</Text>

      {!isReply && (
        <Group gap="xs" mb="xs">
          <Badge size="xs" variant="light" color="blue">{comment.project}</Badge>
          <Badge size="xs" variant="outline">{comment.task}</Badge>
        </Group>
      )}

      <Group justify="space-between">
        <Group gap="md">
          <UnstyledButton onClick={() => toggleLike(comment.id, isReply, parentId)}>
            <Group gap="xs">
              {comment.isLiked ? (
                <IconHeartFilled size={16} color="red" />
              ) : (
                <IconHeart size={16} />
              )}
              <Text size="xs" c={comment.isLiked ? "red" : "dimmed"}>
                {comment.likes}
              </Text>
            </Group>
          </UnstyledButton>
          {!isReply && (
                      <Button size="xs" variant="subtle" onClick={() => setReplyTo(comment.id)}>
            <IconMessageReply size={14} />
            <Text size="xs" ml="xs">Reply</Text>
          </Button>
          )}
        </Group>
        {!isReply && comment.replies.length > 0 && (
          <Button 
            size="xs" 
            variant="subtle" 
            onClick={() => toggleExpanded(comment.id)}
          >
            {expandedComments.has(comment.id) ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )}
            <Text size="xs" ml="xs">
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </Text>
          </Button>
        )}
      </Group>

      {replyTo === comment.id && (
        <Box mt="md" p="md" bg="gray.0" style={{ borderRadius: '8px' }}>
          <Group mb="xs">
            <Avatar size="xs" name="Current User">CU</Avatar>
            <Text size="sm" fw={500}>Reply to {comment.author.name}</Text>
          </Group>
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            mb="xs"
          />
          <Group justify="flex-end" gap="xs">
            <Button size="xs" variant="light" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
            <Button size="xs" leftSection={<IconSend size={14} />}>
              Reply
            </Button>
          </Group>
        </Box>
      )}

      {!isReply && expandedComments.has(comment.id) && comment.replies.length > 0 && (
        <Box mt="md">
          <Divider mb="md" />
          {comment.replies.map((reply) => (
            <CommentCard 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              parentId={comment.id}
            />
          ))}
        </Box>
      )}
    </Card>
  );

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">Project Comments</Title>
          <Text c="dimmed" size="sm">
            Team discussions and feedback on projects and tasks
          </Text>
        </div>
        <Group>
          <Button leftSection={<IconMessage size={16} />} variant="light">
            View Activity
          </Button>
          <Button leftSection={<IconPlus size={16} />}>
            New Comment
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconMessage size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Total Comments</Text>
                <Text fw={700} size="xl">{comments.length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconMessageReply size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Total Replies</Text>
                <Text fw={700} size="xl" c="green">
                  {comments.reduce((sum, c) => sum + c.replies.length, 0)}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconPinFilled size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">Pinned</Text>
                <Text fw={700} size="xl" c="orange">
                  {comments.filter(c => c.isPinned).length}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Group>
              <IconHeart size={24} color="red" />
              <div>
                <Text size="xs" c="dimmed">Total Likes</Text>
                <Text fw={700} size="xl" c="red">
                  {comments.reduce((sum, c) => sum + c.likes + c.replies.reduce((rSum, r) => rSum + r.likes, 0), 0)}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters and Search */}
      <Card withBorder p="md" mb="lg">
        <Group justify="space-between">
          <Group>
            <Select
              placeholder="Filter by project"
              data={mockProjects}
              value={selectedProject}
              onChange={(value) => setSelectedProject(value || 'all')}
              leftSection={<IconFilter size={16} />}
              w={200}
            />
            <Select
              placeholder="Sort by"
              data={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'most_liked', label: 'Most Liked' },
                { value: 'pinned', label: 'Pinned First' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value || 'newest')}
              w={150}
            />
          </Group>
          <TextInput
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<IconSearch size={16} />}
            w={250}
          />
        </Group>
      </Card>

      {/* New Comment */}
      <Card withBorder p="md" mb="lg">
        <Group mb="md">
          <Avatar size="sm" name="Current User">CU</Avatar>
          <Text fw={500}>Add a comment</Text>
        </Group>
        <Textarea
          placeholder="Share your thoughts, feedback, or questions..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          mb="md"
        />
        <Group justify="space-between">
          <Group gap="xs">
            <ActionIcon variant="light" size="sm">
              <IconFile size={16} />
            </ActionIcon>
            <ActionIcon variant="light" size="sm">
              <IconLink size={16} />
            </ActionIcon>
            <ActionIcon variant="light" size="sm">
              <IconAt size={16} />
            </ActionIcon>
          </Group>
          <Group gap="xs">
            <Select
              placeholder="Select project"
              data={mockProjects.slice(1)}
              w={200}
              size="sm"
            />
            <Button leftSection={<IconSend size={16} />} size="sm">
              Post Comment
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Comments List */}
      <Stack gap="md">
        {sortedComments.length === 0 ? (
          <Card withBorder p="xl">
            <Text ta="center" c="dimmed" size="lg">
              No comments found
            </Text>
            <Text ta="center" c="dimmed" size="sm" mt="xs">
              Try adjusting your filters or search terms.
            </Text>
          </Card>
        ) : (
          sortedComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </Stack>
    </Container>
  );
} 