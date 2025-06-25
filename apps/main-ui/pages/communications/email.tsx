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
  Tooltip,
  TextInput,
  Select,
  Grid,
  Paper,
  ScrollArea,
  Modal,
  Divider,
  Box,
  Textarea,
  FileInput,
  Switch,
  Alert,
  ThemeIcon,
  Tabs,
  Avatar,
  Menu
} from '@mantine/core';
import {
  IconMail,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconSend,
  IconPaperclip,
  IconStar,
  IconArchive,
  IconDownload,
  IconShare,
  IconClock,
  IconUser,
  IconBuilding,
  IconCalendar,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconInbox,
  IconFileText,
  IconArchive as IconArchived,
  IconTrash as IconDeleted,
  IconRobotFace,
  IconAlertTriangle,
  IconUsers,
  IconTarget
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';

// Refactored mockEmails with required fields for UI
const mockEmails = [
  {
    id: 'email-1',
    subject: 'Proposal for M.V./L.V. Switchgear Maintenance Contract',
    from: 'john.kamau@apexsteel.co.ke',
    to: 'mary.wambui@company.com',
    date: '2024-06-10T14:30:00Z',
    timestamp: '2024-06-10T14:30:00Z',
    status: 'sent',
    read: false,
    threadId: 'thread-1',
    priority: 'high',
    category: 'proposal',
    folder: 'sent',
    body: `Dear Mary,\n\nThank you for the detailed discussion about our maintenance contract renewal. We are very interested in the premium maintenance package you outlined.\n\nCould you please provide a comprehensive proposal including:\n- Detailed scope of work\n- Pricing breakdown\n- Service level agreements\n- Implementation timeline\n\nWe would like to review this by Friday to make a decision before the end of the month.\n\nBest regards,\nJohn Kamau\nMaintenance Manager\nApex Steel Ltd`,
    contact: 'John Kamau',
    company: 'Apex Steel Ltd',
    attachments: ['maintenance_requirements.pdf'],
    tags: ['proposal', 'maintenance', 'contract-renewal']
  },
  {
    id: 'email-2',
    subject: 'Re: Site Visit Follow-up - French Embassy Project',
    from: 'aisha.hassan@french-embassy.ke',
    to: 'grace.njeri@company.com',
    date: '2024-06-10T11:15:00Z',
    timestamp: '2024-06-10T11:15:00Z',
    status: 'received',
    read: true,
    threadId: 'thread-2',
    priority: 'medium',
    category: 'follow-up',
    folder: 'inbox',
    body: `Hi Grace,\n\nThank you for the comprehensive site visit yesterday. The technical assessment was very thorough and we appreciate your attention to detail.\n\nWe have reviewed the maintenance schedule you provided and it looks excellent. The team was particularly impressed with your approach to preventive maintenance.\n\nA few questions:\n1. Can we start the implementation next week?\n2. Do you have availability for the initial setup?\n3. What training will be provided for our maintenance team?\n\nLooking forward to your response.\n\nBest regards,\nAisha Hassan\nFacilities Manager\nFrench Embassy`,
    contact: 'Aisha Hassan',
    company: 'French Embassy',
    attachments: [],
    tags: ['site-visit', 'follow-up', 'implementation']
  },
  {
    id: 'email-3',
    subject: 'Urgent: System Downtime Issue - Beta Corp',
    from: 'sarah.mwangi@betacorp.com',
    to: 'alice.m@company.com',
    date: '2024-06-10T09:45:00Z',
    timestamp: '2024-06-10T09:45:00Z',
    status: 'received',
    read: false,
    threadId: 'thread-3',
    priority: 'high',
    category: 'support',
    folder: 'inbox',
    body: `Hi Alice,\n\nWe are experiencing critical system downtime this morning. The M.V. switchgear is showing error codes and we need immediate assistance.\n\nError details:\n- Error Code: E-1023\n- Affected System: Main Distribution Panel\n- Impact: Production line shutdown\n\nThis is affecting our production schedule and we need urgent resolution.\n\nPlease advise on immediate steps and estimated resolution time.\n\nRegards,\nSarah Mwangi\nOperations Manager\nBeta Corp`,
    contact: 'Sarah Mwangi',
    company: 'Beta Corp',
    attachments: ['error_logs.pdf', 'system_status.pdf'],
    tags: ['urgent', 'support', 'downtime']
  },
  {
    id: 'email-4',
    subject: 'Contract Renewal Discussion - City Bank Kenya',
    from: 'patricia.wanjiku@citybank.co.ke',
    to: 'mary.wambui@company.com',
    date: '2024-06-09T16:20:00Z',
    timestamp: '2024-06-09T16:20:00Z',
    status: 'sent',
    read: true,
    threadId: 'thread-4',
    priority: 'high',
    category: 'contract',
    folder: 'sent',
    body: `Dear Patricia,\n\nThank you for the productive discussion about our contract renewal. We are very satisfied with the current services and would like to continue our partnership.\n\nHowever, we would like to discuss some pricing adjustments given the current economic conditions and our long-term relationship.\n\nKey points for discussion:\n- Current contract value: KES 12M annually\n- Requested adjustment: 10% reduction\n- Extended contract term: 3 years\n- Additional services: Emergency response time improvement\n\nPlease let me know when we can schedule a meeting to discuss these terms.\n\nBest regards,\nMary Wambui\nAccount Manager`,
    contact: 'Mary Wambui',
    company: 'City Bank Kenya',
    attachments: ['current_contract.pdf', 'proposed_terms.pdf'],
    tags: ['contract', 'renewal', 'pricing']
  },
  {
    id: 'email-5',
    subject: 'New Project Inquiry - Innovation Hub',
    from: 'james.kiprop@innovationhub.ke',
    to: 'bob.n@company.com',
    date: '2024-06-09T13:30:00Z',
    timestamp: '2024-06-09T13:30:00Z',
    status: 'received',
    read: true,
    threadId: 'thread-5',
    priority: 'medium',
    category: 'inquiry',
    folder: 'inbox',
    body: `Hi Bob,\n\nWe were very impressed with your product demonstration yesterday. The integration capabilities and real-time monitoring features are exactly what we need for our new facility.\n\nWe are planning to implement this across our entire campus and would like to discuss:\n- Total project scope\n- Implementation timeline\n- Training requirements\n- Ongoing support\n\nCould you please provide a detailed proposal with pricing? We have a budget of approximately KES 50M for this project.\n\nLooking forward to your response.\n\nBest regards,\nJames Kiprop\nCTO\nInnovation Hub`,
    contact: 'James Kiprop',
    company: 'Innovation Hub',
    attachments: ['facility_requirements.pdf'],
    tags: ['inquiry', 'new-project', 'proposal']
  },
  {
    id: 'email-6',
    subject: 'Weekly Project Status Update - Phase 1 Complete',
    from: 'alice.m@company.com',
    to: 'sarah.mwangi@betacorp.com',
    date: '2024-06-09T10:00:00Z',
    timestamp: '2024-06-09T10:00:00Z',
    status: 'sent',
    read: true,
    threadId: 'thread-3',
    priority: 'medium',
    category: 'update',
    folder: 'sent',
    body: `Hi Sarah,\n\nGreat news! Phase 1 of the M.V. switchgear installation has been completed successfully. Here's the status update:\n\n✅ Completed:\n- Main distribution panel installation\n- Safety system integration\n- Initial testing and calibration\n- Team training completed\n\n📋 Next Steps (Phase 2):\n- Secondary panel installation\n- Backup system setup\n- Final testing and certification\n- Documentation handover\n\nTimeline: Phase 2 will begin next week and should be completed within 2 weeks.\n\nPlease let me know if you have any questions or concerns.\n\nBest regards,\nAlice M.\nProject Manager`,
    contact: 'Alice M.',
    company: 'Company',
    attachments: ['phase1_completion_report.pdf', 'phase2_timeline.pdf'],
    tags: ['project', 'update', 'phase-complete']
  },
  {
    id: 'email-7',
    subject: 'Cold Outreach - Green Energy Solutions',
    from: 'grace.njeri@company.com',
    to: 'michael.odhiambo@greenenergy.ke',
    date: '2024-06-09T09:15:00Z',
    timestamp: '2024-06-09T09:15:00Z',
    status: 'sent',
    read: true,
    threadId: 'thread-6',
    priority: 'low',
    category: 'outreach',
    folder: 'sent',
    body: `Dear Michael,\n\nI hope this email finds you well. I'm reaching out to introduce our company and the comprehensive electrical engineering services we provide.\n\nWe specialize in:\n- M.V./L.V. switchgear installation and maintenance\n- Power system design and optimization\n- Emergency response and 24/7 support\n- Preventive maintenance programs\n\nGiven your focus on green energy solutions, I believe we could add significant value to your operations.\n\nWould you be interested in a brief 15-minute call to discuss how we might support your projects?\n\nBest regards,\nGrace Njeri\nBusiness Development Manager`,
    contact: 'Grace Njeri',
    company: 'Company',
    attachments: ['company_profile.pdf', 'case_studies.pdf'],
    tags: ['cold-outreach', 'introduction', 'green-energy']
  },
  {
    id: 'email-8',
    subject: 'Appointment Confirmation - Tech Solutions Ltd',
    from: 'david.ochieng@techsolutions.ke',
    to: 'mary.wambui@company.com',
    date: '2024-06-09T08:30:00Z',
    timestamp: '2024-06-09T08:30:00Z',
    status: 'received',
    read: true,
    threadId: 'thread-7',
    priority: 'medium',
    category: 'appointment',
    folder: 'inbox',
    body: `Hi Mary,\n\nThank you for the appointment reminder. I confirm our consultation meeting tomorrow at 10:00 AM.\n\nAgenda for discussion:\n- Current electrical system assessment\n- Upgrade requirements\n- Budget considerations\n- Implementation timeline\n\nI've prepared some questions and will have our technical team available for the discussion.\n\nLooking forward to meeting you.\n\nBest regards,\nDavid Ochieng\nOperations Director\nTech Solutions Ltd`,
    contact: 'David Ochieng',
    company: 'Tech Solutions Ltd',
    attachments: ['current_system_overview.pdf'],
    tags: ['appointment', 'consultation', 'confirmation']
  }
];

interface EmailCardProps {
  email: any;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
  onForward: (id: string) => void;
  onStar: (id: string) => void;
  onArchive: (id: string) => void;
}

function EmailCard({ email, onView, onEdit, onDelete, onReply, onForward, onStar, onArchive }: EmailCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'green';
      case 'received':
        return 'blue';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color={email.starred ? 'yellow' : 'gray'}
            size="sm"
            onClick={() => onStar(email.id)}
          >
            <IconStar size={14} fill={email.starred ? 'currentColor' : 'none'} />
          </ActionIcon>
          <Text fw={500} size="sm" style={{ opacity: email.read ? 0.7 : 1 }}>
            {email.subject}
          </Text>
        </Group>
        <Group gap="xs">
          {email.priority && (
            <Badge color={getPriorityColor(email.priority)} variant="light" size="xs">
              {email.priority}
            </Badge>
          )}
          <Badge color={getStatusColor(email.status)} variant="light" size="xs">
            {email.status}
          </Badge>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" mb="xs">
        {email.folder === 'sent' ? `To: ${email.to}` : `From: ${email.from}`}
      </Text>

      <Text size="sm" c="dimmed" mb="xs">
        {email.contact} • {email.company}
      </Text>

      <Text size="sm" mb="xs" lineClamp={2}>
        {email.body}
      </Text>

      {email.attachments && email.attachments.length > 0 && (
        <Group gap="xs" mb="xs">
          <IconPaperclip size={14} />
          <Text size="xs" c="dimmed">
            {email.attachments.length} attachment(s)
          </Text>
        </Group>
      )}

      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          {formatDate(email.timestamp)}
        </Text>
        <Group gap="xs">
          <Tooltip label="View details">
            <ActionIcon variant="light" size="sm" onClick={() => onView(email.id)}>
              <IconEye size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Reply">
            <ActionIcon variant="light" size="sm" onClick={() => onReply(email.id)}>
              <IconArrowBackUp size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Forward">
            <ActionIcon variant="light" size="sm" onClick={() => onForward(email.id)}>
              <IconArrowForwardUp size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Archive">
            <ActionIcon variant="light" size="sm" onClick={() => onArchive(email.id)}>
              <IconArchive size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon variant="light" size="sm" onClick={() => onEdit(email.id)}>
              <IconEdit size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="light" color="red" size="sm" onClick={() => onDelete(email.id)}>
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Card>
  );
}

// AI and collaboration mock functions
function aiSummarizeThread(email) {
  const summaries = {
    'email-1': 'Proposal request for M.V./L.V. switchgear maintenance contract renewal. Client interested in premium package and needs comprehensive proposal by Friday.',
    'email-2': 'Positive follow-up after site visit. Client impressed with technical assessment and wants to proceed with implementation. Training requirements discussed.',
    'email-3': 'Critical system downtime issue requiring immediate attention. M.V. switchgear showing error codes affecting production. Urgent support needed.',
    'email-4': 'Contract renewal discussion with pricing adjustment request. Client satisfied with services but wants 10% reduction. Meeting scheduling needed.',
    'email-5': 'New project inquiry following successful product demo. Client interested in campus-wide implementation with KES 50M budget. Proposal requested.',
    'email-6': 'Phase 1 completion update with positive progress. All deliverables completed successfully. Phase 2 planning in progress.',
    'email-7': 'Cold outreach to green energy company. Introduction of services and request for 15-minute call to discuss potential collaboration.',
    'email-8': 'Appointment confirmation for consultation meeting. Technical team will be available for system assessment and upgrade discussion.'
  };
  return summaries[email.id] || 'No summary available.';
}

function aiThreadHealth(email) {
  const healthMap = {
    'email-1': { health: 'High Priority', reason: 'Contract renewal with tight deadline', color: 'red' },
    'email-2': { health: 'Healthy', reason: 'Positive client engagement', color: 'green' },
    'email-3': { health: 'Critical', reason: 'System downtime affecting production', color: 'red' },
    'email-4': { health: 'At Risk', reason: 'Pricing negotiation in progress', color: 'yellow' },
    'email-5': { health: 'Opportunity', reason: 'New project with high budget', color: 'blue' },
    'email-6': { health: 'On Track', reason: 'Project progressing well', color: 'green' },
    'email-7': { health: 'Prospecting', reason: 'Cold outreach for new business', color: 'gray' },
    'email-8': { health: 'Scheduled', reason: 'Consultation meeting confirmed', color: 'blue' }
  };
  return healthMap[email.id] || { health: 'Unknown', reason: '', color: 'gray' };
}

// Enhanced AI functions for action item extraction and task generation
function aiExtractActionItems(email) {
  const actionItemsMap = {
    'email-1': [
      { id: 1, description: 'Prepare comprehensive proposal with pricing breakdown', priority: 'high', dueDate: '2024-06-14', estimatedTime: '4 hours', assignee: 'Mary Wambui' },
      { id: 2, description: 'Include service level agreements and implementation timeline', priority: 'high', dueDate: '2024-06-14', estimatedTime: '2 hours', assignee: 'Mary Wambui' },
      { id: 3, description: 'Schedule proposal presentation meeting', priority: 'medium', dueDate: '2024-06-15', estimatedTime: '30 minutes', assignee: 'Mary Wambui' }
    ],
    'email-2': [
      { id: 1, description: 'Prepare implementation timeline for next week', priority: 'medium', dueDate: '2024-06-11', estimatedTime: '2 hours', assignee: 'Grace Njeri' },
      { id: 2, description: 'Create training program for maintenance team', priority: 'medium', dueDate: '2024-06-12', estimatedTime: '3 hours', assignee: 'Grace Njeri' },
      { id: 3, description: 'Schedule initial setup meeting', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '1 hour', assignee: 'Grace Njeri' }
    ],
    'email-3': [
      { id: 1, description: 'Immediate system diagnostics and error resolution', priority: 'critical', dueDate: '2024-06-10T12:00:00Z', estimatedTime: '2 hours', assignee: 'Alice M.' },
      { id: 2, description: 'Provide status update to client', priority: 'high', dueDate: '2024-06-10T10:00:00Z', estimatedTime: '15 minutes', assignee: 'Alice M.' },
      { id: 3, description: 'Schedule preventive maintenance review', priority: 'medium', dueDate: '2024-06-12', estimatedTime: '1 hour', assignee: 'Alice M.' }
    ],
    'email-4': [
      { id: 1, description: 'Prepare pricing adjustment proposals', priority: 'high', dueDate: '2024-06-11', estimatedTime: '3 hours', assignee: 'Mary Wambui' },
      { id: 2, description: 'Schedule contract review meeting', priority: 'high', dueDate: '2024-06-12', estimatedTime: '1 hour', assignee: 'Mary Wambui' },
      { id: 3, description: 'Review current contract terms and conditions', priority: 'medium', dueDate: '2024-06-10', estimatedTime: '2 hours', assignee: 'Mary Wambui' }
    ],
    'email-5': [
      { id: 1, description: 'Prepare detailed project proposal with KES 50M budget', priority: 'high', dueDate: '2024-06-12', estimatedTime: '6 hours', assignee: 'Bob N.' },
      { id: 2, description: 'Create implementation timeline for campus-wide deployment', priority: 'high', dueDate: '2024-06-12', estimatedTime: '3 hours', assignee: 'Bob N.' },
      { id: 3, description: 'Schedule proposal presentation meeting', priority: 'medium', dueDate: '2024-06-14', estimatedTime: '1 hour', assignee: 'Bob N.' }
    ],
    'email-6': [
      { id: 1, description: 'Begin Phase 2 planning and resource allocation', priority: 'medium', dueDate: '2024-06-11', estimatedTime: '2 hours', assignee: 'Alice M.' },
      { id: 2, description: 'Prepare Phase 2 timeline and deliverables', priority: 'medium', dueDate: '2024-06-12', estimatedTime: '3 hours', assignee: 'Alice M.' },
      { id: 3, description: 'Schedule Phase 2 kickoff meeting', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '1 hour', assignee: 'Alice M.' }
    ],
    'email-7': [
      { id: 1, description: 'Research Green Energy Solutions company profile', priority: 'low', dueDate: '2024-06-12', estimatedTime: '1 hour', assignee: 'Grace Njeri' },
      { id: 2, description: 'Prepare tailored pitch for green energy sector', priority: 'low', dueDate: '2024-06-13', estimatedTime: '2 hours', assignee: 'Grace Njeri' },
      { id: 3, description: 'Follow up with call scheduling', priority: 'low', dueDate: '2024-06-14', estimatedTime: '15 minutes', assignee: 'Grace Njeri' }
    ],
    'email-8': [
      { id: 1, description: 'Prepare consultation materials and system assessment tools', priority: 'medium', dueDate: '2024-06-09', estimatedTime: '2 hours', assignee: 'Mary Wambui' },
      { id: 2, description: 'Review current system documentation', priority: 'medium', dueDate: '2024-06-09', estimatedTime: '1 hour', assignee: 'Mary Wambui' },
      { id: 3, description: 'Prepare upgrade recommendations and pricing', priority: 'medium', dueDate: '2024-06-09', estimatedTime: '3 hours', assignee: 'Mary Wambui' }
    ]
  };
  return actionItemsMap[email.id] || [];
}

function aiGenerateLead(email) {
  const leadMap = {
    'email-1': {
      shouldCreate: true,
      company: 'Apex Steel Ltd',
      contact: 'John Kamau',
      estimatedValue: 8000000,
      confidence: 'high',
      probability: '85%',
      timeline: '30 days',
      source: 'Contract Renewal',
      notes: 'Premium maintenance package interest with tight deadline'
    },
    'email-2': {
      shouldCreate: false,
      reason: 'Existing client relationship'
    },
    'email-3': {
      shouldCreate: false,
      reason: 'Support request from existing client'
    },
    'email-4': {
      shouldCreate: false,
      reason: 'Contract renewal with existing client'
    },
    'email-5': {
      shouldCreate: true,
      company: 'Innovation Hub',
      contact: 'James Kiprop',
      estimatedValue: 50000000,
      confidence: 'high',
      probability: '90%',
      timeline: '60 days',
      source: 'Product Demo Follow-up',
      notes: 'Campus-wide implementation with KES 50M budget'
    },
    'email-6': {
      shouldCreate: false,
      reason: 'Project update for existing client'
    },
    'email-7': {
      shouldCreate: true,
      company: 'Green Energy Solutions',
      contact: 'Michael Odhiambo',
      estimatedValue: 15000000,
      confidence: 'low',
      probability: '20%',
      timeline: '90 days',
      source: 'Cold Outreach',
      notes: 'Green energy sector with long-term potential'
    },
    'email-8': {
      shouldCreate: true,
      company: 'Tech Solutions Ltd',
      contact: 'David Ochieng',
      estimatedValue: 20000000,
      confidence: 'medium',
      probability: '60%',
      timeline: '45 days',
      source: 'Consultation Meeting',
      notes: 'System upgrade consultation with technical team'
    }
  };
  return leadMap[email.id] || { shouldCreate: false, reason: 'No lead opportunity identified' };
}

function aiSuggestReply(email) {
  const replySuggestions = {
    'email-1': {
      tone: 'professional',
      urgency: 'high',
      keyPoints: [
        'Acknowledge the deadline and confirm proposal delivery',
        'Outline proposal structure and key components',
        'Request any additional requirements or preferences',
        'Offer to schedule a proposal presentation meeting'
      ],
      suggestedReply: `Dear John,\n\nThank you for your interest in our premium maintenance package. I'm pleased to confirm that we will deliver a comprehensive proposal by Friday as requested.\n\nOur proposal will include:\n• Detailed scope of work and service specifications\n• Complete pricing breakdown with transparent cost structure\n• Service level agreements with response time commitments\n• Implementation timeline with key milestones\n\nI'll also include case studies of similar projects we've successfully completed.\n\nWould you be available for a proposal presentation meeting next week to discuss the details?\n\nBest regards,\nMary Wambui`
    },
    'email-2': {
      tone: 'positive',
      urgency: 'medium',
      keyPoints: [
        'Confirm implementation readiness for next week',
        'Outline training program details',
        'Provide availability for initial setup',
        'Schedule follow-up meeting'
      ],
      suggestedReply: `Hi Aisha,\n\nExcellent! I'm glad the site visit was helpful. We're ready to begin implementation next week as requested.\n\nRegarding your questions:\n1. ✅ We can start implementation next week - I'll send the detailed schedule\n2. ✅ Our team is available for the initial setup - 3 days estimated\n3. ✅ Training program includes: 2-day hands-on workshop + documentation\n\nI'll prepare a comprehensive implementation plan and training schedule for your review.\n\nBest regards,\nGrace Njeri`
    },
    'email-3': {
      tone: 'urgent',
      urgency: 'critical',
      keyPoints: [
        'Acknowledge the critical nature of the issue',
        'Provide immediate troubleshooting steps',
        'Commit to rapid response time',
        'Schedule emergency support call'
      ],
      suggestedReply: `Hi Sarah,\n\nI understand this is a critical situation affecting your production. Our emergency response team is being notified immediately.\n\nImmediate steps:\n1. Please check if the emergency shutdown switch is engaged\n2. Verify all circuit breakers are in the correct position\n3. Check for any visible damage or unusual sounds\n\nOur technician will be on-site within 30 minutes. I'm also scheduling an emergency support call in the next 10 minutes.\n\nPlease confirm if you can join the call.\n\nBest regards,\nAlice M.`
    }
  };
  return replySuggestions[email.id] || {
    tone: 'professional',
    urgency: 'medium',
    keyPoints: ['Acknowledge the email', 'Provide relevant information', 'Suggest next steps'],
    suggestedReply: 'Thank you for your email. I will review and respond with detailed information shortly.'
  };
}

const mockComments = [
  { id: 1, author: 'Mary Wambui', date: '2024-06-10T11:15:00', text: 'Can someone from finance confirm the payment terms?', mentions: ['Peter Otieno'] },
  { id: 2, author: 'Peter Otieno', date: '2024-06-10T11:30:00', text: 'Will check and update here.', mentions: [] },
];
const mockActivity = [
  { id: 1, type: 'viewed', user: 'Mary Wambui', date: '2024-06-10T11:10:00' },
  { id: 2, type: 'commented', user: 'Mary Wambui', date: '2024-06-10T11:15:00' },
  { id: 3, type: 'commented', user: 'Peter Otieno', date: '2024-06-10T11:30:00' },
];
const owners = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

// Add error boundary for missing fields in EmailCommunicationsPage
function safeGet(obj, key, fallback = '') {
  return obj && obj[key] !== undefined ? obj[key] : fallback;
}

export default function EmailCommunicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [hasAttachments, setHasAttachments] = useState<boolean | null>(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [composeModalOpened, setComposeModalOpened] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [modal, setModal] = useState<{ type: null | 'health' | 'summary' | 'activity', email: any | null }>({ type: null, email: null });

  const handleView = (id: string) => {
    const email = mockEmails.find(e => e.id === id);
    setSelectedEmail(email);
    setViewModalOpened(true);
  };

  const handleCompose = () => {
    setComposeModalOpened(true);
  };

  const handleSend = () => {
    notifications.show({
      title: 'Send Email',
      message: 'Email sent successfully!',
      color: 'green'
    });
    setComposeModalOpened(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setHasAttachments(null);
  };

  const getFilteredEmails = () => {
    let filtered = mockEmails;

    // Filter by folder/tab
    if (activeTab && activeTab !== 'all') {
      filtered = filtered.filter(email => email.folder === activeTab);
    }

    // Filter by search query (enhanced search)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.to.toLowerCase().includes(query) ||
        email.contact.toLowerCase().includes(query) ||
        email.company.toLowerCase().includes(query) ||
        email.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(email => email.priority === priorityFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(email => email.category === categoryFilter);
    }

    // Filter by date range
    if (dateFilter !== 'all') {
      const now = new Date();
      const emailDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(email => {
            emailDate.setTime(new Date(email.timestamp).getTime());
            return emailDate.toDateString() === now.toDateString();
          });
          break;
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filtered = filtered.filter(email => {
            emailDate.setTime(new Date(email.timestamp).getTime());
            return emailDate.toDateString() === yesterday.toDateString();
          });
          break;
        case 'this-week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(email => {
            emailDate.setTime(new Date(email.timestamp).getTime());
            return emailDate >= weekAgo;
          });
          break;
        case 'this-month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(email => {
            emailDate.setTime(new Date(email.timestamp).getTime());
            return emailDate >= monthAgo;
          });
          break;
      }
    }

    // Filter by attachments
    if (hasAttachments !== null) {
      filtered = filtered.filter(email => 
        hasAttachments ? (email.attachments && email.attachments.length > 0) : (!email.attachments || email.attachments.length === 0)
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const emails = getFilteredEmails();

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Email Communications</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCompose}>
          Compose Email
        </Button>
      </Group>

      {/* Email Statistics */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconInbox size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Inbox</Text>
                <Text fw={700}>{mockEmails.filter(e => e.folder === 'inbox').length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Paper p="md" withBorder>
            <Group>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconSend size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Sent</Text>
                <Text fw={700}>{mockEmails.filter(e => e.folder === 'sent').length}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Paper p="md" withBorder mb="lg">
        <Stack gap="md">
          {/* Search Bar */}
          <TextInput
            placeholder="Search emails by subject, body, sender, recipient, contact, company, or tags..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            rightSection={
              searchQuery && (
                <ActionIcon variant="subtle" onClick={() => setSearchQuery('')}>
                  <IconX size={14} />
                </ActionIcon>
              )
            }
          />
          
          {/* Filter Controls */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Select
                label="Priority"
                value={priorityFilter}
                onChange={setPriorityFilter}
                data={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ]}
                size="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Select
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                data={[
                  { value: 'all', label: 'All Status' },
                  { value: 'sent', label: 'Sent' },
                  { value: 'received', label: 'Received' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'failed', label: 'Failed' }
                ]}
                size="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Select
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                data={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'proposal', label: 'Proposal' },
                  { value: 'follow-up', label: 'Follow-up' },
                  { value: 'support', label: 'Support' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'inquiry', label: 'Inquiry' },
                  { value: 'update', label: 'Update' },
                  { value: 'outreach', label: 'Outreach' },
                  { value: 'appointment', label: 'Appointment' }
                ]}
                size="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Select
                label="Date Range"
                value={dateFilter}
                onChange={setDateFilter}
                data={[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'this-week', label: 'This Week' },
                  { value: 'this-month', label: 'This Month' }
                ]}
                size="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Select
                label="Attachments"
                value={hasAttachments === null ? 'all' : hasAttachments ? 'yes' : 'no'}
                onChange={(value) => setHasAttachments(value === 'all' ? null : value === 'yes')}
                data={[
                  { value: 'all', label: 'All Emails' },
                  { value: 'yes', label: 'With Attachments' },
                  { value: 'no', label: 'No Attachments' }
                ]}
                size="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Group gap="xs" align="end" h="100%">
                <Button 
                  variant="light" 
                  size="sm" 
                  onClick={clearAllFilters}
                  leftSection={<IconX size={14} />}
                  style={{ flex: 1 }}
                >
                  Clear Filters
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
          
          {/* Active Filters Display */}
          {(searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || hasAttachments !== null) && (
            <Paper p="xs" bg="blue.0" withBorder>
              <Group gap="xs" wrap="wrap">
                <Text size="xs" fw={500} c="blue">Active Filters:</Text>
                {searchQuery && (
                  <Badge color="blue" variant="light" size="xs">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {priorityFilter !== 'all' && (
                  <Badge color="red" variant="light" size="xs">
                    Priority: {priorityFilter}
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge color="green" variant="light" size="xs">
                    Status: {statusFilter}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge color="purple" variant="light" size="xs">
                    Category: {categoryFilter}
                  </Badge>
                )}
                {dateFilter !== 'all' && (
                  <Badge color="orange" variant="light" size="xs">
                    Date: {dateFilter.replace('-', ' ')}
                  </Badge>
                )}
                {hasAttachments !== null && (
                  <Badge color="gray" variant="light" size="xs">
                    Attachments: {hasAttachments ? 'Yes' : 'No'}
                  </Badge>
                )}
              </Group>
            </Paper>
          )}
        </Stack>
      </Paper>

      {/* Email Folders and Content */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="inbox" leftSection={<IconInbox size={16} />}>
            Inbox
          </Tabs.Tab>
          <Tabs.Tab value="sent" leftSection={<IconSend size={16} />}>
            Sent
          </Tabs.Tab>
          <Tabs.Tab value="drafts" leftSection={<IconFileText size={16} />}>
            Drafts
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="inbox" pt="md">
          <Group justify="space-between" mb="md">
            <Text size="sm" c="dimmed">
              {emails.length} email{emails.length !== 1 ? 's' : ''} found
              {(searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || hasAttachments !== null) && 
                ` (filtered from ${mockEmails.filter(e => e.folder === 'inbox').length} total)`
              }
            </Text>
            {emails.length === 0 && (
              <Button variant="light" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
          </Group>
          <ScrollArea h={600}>
            <Stack gap="md">
              {emails.map((email) => {
                const aiHealth = aiThreadHealth(email);
                const aiSummary = aiSummarizeThread(email);
                const aiActionItems = aiExtractActionItems(email);
                const aiLead = aiGenerateLead(email);
                return (
                  <Card
                    key={email.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    onClick={() => handleView(email.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm" style={{ opacity: email.read ? 0.7 : 1 }}>{email.subject}</Text>
                      <Badge color={email.priority === 'high' ? 'red' : 'blue'} variant="light" size="xs">{email.priority}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed" mb="xs">From: {email.from}</Text>
                    <Text size="sm" c="dimmed" mb="xs">{email.contact} • {email.company}</Text>
                    <Text size="sm" mb="xs" lineClamp={2}>{email.body}</Text>
                    
                    {/* AI Action Items Section */}
                    {aiActionItems.length > 0 && (
                      <Paper p="xs" bg="blue.0" withBorder mb="xs">
                        <Group gap="xs" mb="xs">
                          <IconRobotFace size={14} />
                          <Text size="xs" fw={500} c="blue">AI Detected Action Items:</Text>
                        </Group>
                        <Stack gap="xs">
                          {aiActionItems.slice(0, 2).map((item) => (
                            <Group key={item.id} gap="xs" justify="space-between">
                              <Text size="xs" style={{ flex: 1 }}>{item.description}</Text>
                              <Group gap="xs">
                                <Badge color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'} size="xs">
                                  {item.priority}
                                </Badge>
                                <Button 
                                  size="xs" 
                                  variant="light" 
                                  onClick={e => { e.stopPropagation(); }}
                                  leftSection={<IconCheck size={12} />}
                                >
                                  Create Task
                                </Button>
                              </Group>
                            </Group>
                          ))}
                          {aiActionItems.length > 2 && (
                            <Text size="xs" c="dimmed">+{aiActionItems.length - 2} more action items</Text>
                          )}
                        </Stack>
                      </Paper>
                    )}
                    
                    {/* AI Lead Generation Suggestion */}
                    {aiLead.shouldCreate && (
                      <Paper p="xs" bg="green.0" withBorder mb="xs">
                        <Group gap="xs" justify="space-between">
                          <Group gap="xs">
                            <IconTarget size={14} />
                            <Text size="xs" fw={500} c="green">AI Suggests Creating Lead</Text>
                          </Group>
                          <Button 
                            size="xs" 
                            variant="light" 
                            color="green"
                            onClick={e => { e.stopPropagation(); }}
                            leftSection={<IconPlus size={12} />}
                          >
                            Create Lead
                          </Button>
                        </Group>
                        <Text size="xs" c="dimmed" mt="xs">
                          {aiLead.company} - {aiLead.estimatedValue ? aiLead.estimatedValue.toLocaleString() : 'N/A'} KES
                        </Text>
                      </Paper>
                    )}
                    
                    <Group gap="xs" mb="xs">
                      <Tooltip label={aiHealth.reason}><Badge color={aiHealth.color} leftSection={<IconAlertTriangle size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'health', email }); }} style={{ cursor: 'pointer' }}>{aiHealth.health}</Badge></Tooltip>
                      <Tooltip label={aiSummary}><Badge color="blue" leftSection={<IconRobotFace size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'summary', email }); }} style={{ cursor: 'pointer' }}>AI Summary</Badge></Tooltip>
                      <Tooltip label="Activity Timeline"><Badge color="gray" leftSection={<IconUsers size={14} />} onClick={e => { e.stopPropagation(); setModal({ type: 'activity', email }); }} style={{ cursor: 'pointer' }}>{mockActivity.length} activities</Badge></Tooltip>
                    </Group>
                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">{new Date(email.timestamp).toLocaleDateString()}</Text>
                      <Group gap="xs">
                        <Button size="xs" variant="light" onClick={e => { e.stopPropagation(); handleView(email.id); }}>View Details</Button>
                        <Tooltip label="Reply">
                          <ActionIcon variant="light" size="sm" onClick={e => e.stopPropagation()}>
                            <IconArrowBackUp size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="sent" pt="md">
          <Group justify="space-between" mb="md">
            <Text size="sm" c="dimmed">
              {emails.length} email{emails.length !== 1 ? 's' : ''} found
              {(searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || hasAttachments !== null) && 
                ` (filtered from ${mockEmails.filter(e => e.folder === 'sent').length} total)`
              }
            </Text>
            {emails.length === 0 && (
              <Button variant="light" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
          </Group>
          <ScrollArea h={600}>
            <Stack gap="md">
              {emails.map((email) => (
                <Card key={email.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500} size="sm">
                      {email.subject}
                    </Text>
                    <Badge color="green" variant="light" size="xs">
                      {email.status}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mb="xs">
                    To: {email.to}
                  </Text>
                  <Text size="sm" c="dimmed" mb="xs">
                    {email.contact} • {email.company}
                  </Text>
                  <Text size="sm" mb="xs" lineClamp={2}>
                    {email.body}
                  </Text>
                  <Group justify="space-between" align="center">
                    <Text size="xs" c="dimmed">
                      {new Date(email.timestamp).toLocaleDateString()}
                    </Text>
                    <Group gap="xs">
                      <Tooltip label="View details">
                        <ActionIcon variant="light" size="sm" onClick={() => handleView(email.id)}>
                          <IconEye size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="drafts" pt="md">
          <Alert icon={<IconFileText size={16} />} title="Drafts" color="yellow">
            No draft emails found.
          </Alert>
        </Tabs.Panel>
      </Tabs>

      {/* View Email Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Email Details"
        size="lg"
      >
        {selectedEmail && (
          <>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{selectedEmail.subject}</Text>
                <Badge color={selectedEmail.status === 'sent' ? 'green' : 'blue'}>
                  {selectedEmail.status}
                </Badge>
              </Group>
              
              <Divider />
              
              <Group>
                <Text size="sm" fw={500}>From:</Text>
                <Text size="sm">{selectedEmail.from}</Text>
              </Group>
              
              <Group>
                <Text size="sm" fw={500}>To:</Text>
                <Text size="sm">{selectedEmail.to}</Text>
              </Group>
              
              <Group>
                <Text size="sm" fw={500}>Date:</Text>
                <Text size="sm">
                  {new Date(selectedEmail.timestamp).toLocaleString()}
                </Text>
              </Group>

              <Group>
                <Text size="sm" fw={500}>Contact:</Text>
                <Text size="sm">{selectedEmail.contact}</Text>
              </Group>
              
              <Group>
                <Text size="sm" fw={500}>Company:</Text>
                <Text size="sm">{selectedEmail.company}</Text>
              </Group>

              <Text size="sm" fw={500}>Body:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedEmail.body}
              </Text>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <>
                  <Text size="sm" fw={500}>Attachments:</Text>
                  <Group gap="xs">
                    {selectedEmail.attachments.map((attachment: string) => (
                      <Badge key={attachment} color="blue" variant="light">
                        <IconPaperclip size={12} /> {attachment}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}

              {/* AI Action Items Section */}
              {(() => {
                const aiActionItems = aiExtractActionItems(selectedEmail);
                if (aiActionItems.length > 0) {
                  return (
                    <>
                      <Divider />
                      <Paper p="md" bg="blue.0" withBorder>
                        <Group gap="xs" mb="md">
                          <IconRobotFace size={16} />
                          <Text fw={600} c="blue">AI Detected Action Items</Text>
                        </Group>
                        <Stack gap="md">
                          {aiActionItems.map((item) => (
                            <Card key={item.id} withBorder p="sm">
                              <Group justify="space-between" mb="xs">
                                <Text size="sm" fw={500}>{item.description}</Text>
                                <Badge color={item.priority === 'high' ? 'red' : item.priority === 'critical' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'} size="xs">
                                  {item.priority}
                                </Badge>
                              </Group>
                              <Group gap="xs" mb="xs">
                                <Text size="xs" c="dimmed">Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
                                <Text size="xs" c="dimmed">Est. Time: {item.estimatedTime}</Text>
                                <Text size="xs" c="dimmed">Assignee: {item.assignee}</Text>
                              </Group>
                              <Group gap="xs">
                                <Button 
                                  size="xs" 
                                  variant="light" 
                                  leftSection={<IconCheck size={12} />}
                                >
                                  Create Task
                                </Button>
                                <Button 
                                  size="xs" 
                                  variant="light" 
                                  leftSection={<IconCalendar size={12} />}
                                >
                                  Add to Calendar
                                </Button>
                                <Button 
                                  size="xs" 
                                  variant="light" 
                                  leftSection={<IconUser size={12} />}
                                >
                                  Assign
                                </Button>
                              </Group>
                            </Card>
                          ))}
                        </Stack>
                      </Paper>
                    </>
                  );
                }
                return null;
              })()}

              {/* AI Lead Generation Section */}
              {(() => {
                const aiLead = aiGenerateLead(selectedEmail);
                if (aiLead.shouldCreate) {
                  return (
                    <>
                      <Divider />
                      <Paper p="md" bg="green.0" withBorder>
                        <Group gap="xs" mb="md">
                          <IconTarget size={16} />
                          <Text fw={600} c="green">AI Suggests Creating Lead</Text>
                        </Group>
                        <Stack gap="sm">
                          <Group>
                            <Text size="sm" fw={500}>Company:</Text>
                            <Text size="sm">{aiLead.company}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Contact:</Text>
                            <Text size="sm">{aiLead.contact}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Email:</Text>
                            <Text size="sm">{selectedEmail.from}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Estimated Value:</Text>
                            <Text size="sm">{aiLead.estimatedValue ? aiLead.estimatedValue.toLocaleString() : 'N/A'} KES</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Confidence:</Text>
                            <Text size="sm">{aiLead.confidence} ({aiLead.probability})</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Timeline:</Text>
                            <Text size="sm">{aiLead.timeline}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Source:</Text>
                            <Text size="sm">{aiLead.source}</Text>
                          </Group>
                          <Group>
                            <Text size="sm" fw={500}>Notes:</Text>
                            <Text size="sm">{aiLead.notes}</Text>
                          </Group>
                          <Group gap="xs">
                            <Button 
                              size="sm" 
                              color="green"
                              leftSection={<IconPlus size={14} />}
                            >
                              Create Lead
                            </Button>
                            <Button 
                              size="sm" 
                              variant="light"
                              leftSection={<IconEye size={14} />}
                            >
                              Preview Lead
                            </Button>
                          </Group>
                        </Stack>
                      </Paper>
                    </>
                  );
                }
                return null;
              })()}

              {/* AI Reply Suggestion Section */}
              {(() => {
                const aiReply = aiSuggestReply(selectedEmail);
                return (
                  <>
                    <Divider />
                    <Paper p="md" bg="yellow.0" withBorder>
                      <Group gap="xs" mb="md">
                        <IconRobotFace size={16} />
                        <Text fw={600} c="yellow">AI Reply Suggestion</Text>
                        <Badge color={aiReply.urgency === 'critical' ? 'red' : aiReply.urgency === 'high' ? 'orange' : 'blue'} size="xs">
                          {aiReply.urgency} priority
                        </Badge>
                      </Group>
                      <Stack gap="sm">
                        <Text size="sm" fw={500}>Key Points:</Text>
                        <Stack gap="xs">
                          {aiReply.keyPoints.map((point, index) => (
                            <Text key={index} size="sm" c="dimmed">• {point}</Text>
                          ))}
                        </Stack>
                        <Text size="sm" fw={500}>Suggested Reply:</Text>
                        <Paper p="sm" bg="white" withBorder>
                          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{aiReply.suggestedReply}</Text>
                        </Paper>
                        <Group gap="xs">
                          <Button 
                            size="sm" 
                            color="yellow"
                            leftSection={<IconEdit size={14} />}
                          >
                            Use This Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="light"
                            leftSection={<IconEdit size={14} />}
                          >
                            Edit Reply
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </>
                );
              })()}

              <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={() => setViewModalOpened(false)}>
                  Close
                </Button>
                <Button variant="light">
                  Reply
                </Button>
                <Button variant="light">
                  Forward
                </Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      {/* Compose Email Modal */}
      <Modal
        opened={composeModalOpened}
        onClose={() => setComposeModalOpened(false)}
        title="Compose Email"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="To"
            placeholder="recipient@example.com"
          />
          
          <TextInput
            label="Subject"
            placeholder="Email subject"
          />
          
          <Textarea
            label="Body"
            placeholder="Email body..."
            minRows={8}
          />
          
          <FileInput
            label="Attachments"
            placeholder="Select files to attach"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setComposeModalOpened(false)}>
              Cancel
            </Button>
            <Button variant="light">
              Save Draft
            </Button>
            <Button leftSection={<IconSend size={16} />} onClick={handleSend}>
              Send
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Drill-down modals */}
      <Modal opened={!!modal.type} onClose={() => setModal({ type: null, email: null })} title={modal.type === 'health' ? 'AI Thread Health' : modal.type === 'summary' ? 'AI Summary' : 'Activity Timeline'} size="md" centered>
        {modal.type === 'health' && modal.email && (
          <Stack>
            <Text fw={700} color={aiThreadHealth(modal.email).color}>{aiThreadHealth(modal.email).health}</Text>
            <Text>{aiThreadHealth(modal.email).reason}</Text>
          </Stack>
        )}
        {modal.type === 'summary' && modal.email && (
          <Text>{aiSummarizeThread(modal.email)}</Text>
        )}
        {modal.type === 'activity' && modal.email && (
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