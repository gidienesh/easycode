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
  Grid,
  Paper,
  Tooltip,
  Avatar,
  Timeline,
  Checkbox,
  Divider
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconClock,
  IconUser,
  IconCheck,
  IconX,
  IconFileText,
  IconDownload,
  IconShare,
  IconMapPin
} from '@tabler/icons-react';

export default function CRMMeetingNotesPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const meetingNotes = [
    {
      id: 1,
      title: 'Site Assessment Meeting - French Embassy',
      contact: 'Aisha Hassan',
      company: 'French Embassy',
      date: '2024-06-09T10:00:00Z',
      duration: '2 hours',
      location: 'French Embassy, Nairobi',
      type: 'Site Visit',
      attendees: ['Grace Njeri', 'Jaston Mbohe', 'Aisha Hassan', 'Technical Team'],
      status: 'Completed',
      notes: `Site Assessment Summary:
      
Key Findings:
• Current M.V./L.V Switchgear installation requires upgrade
• Transformer capacity needs assessment
• Earthing system needs improvement
• Space constraints identified for new equipment

Technical Requirements:
• 11KV M.V. Switchgear with protection relays
• 1000KVA Transformer with monitoring system
• L.V. Switchboard with PFC capabilities
• UPS system for critical loads

Timeline: 3-4 months for complete installation
Budget: KSh 2.5M - 3.2M

Next Steps:
1. Prepare detailed technical specifications
2. Submit formal proposal within 1 week
3. Schedule follow-up meeting for proposal review`,
      actionItems: [
        { id: 1, task: 'Prepare technical specifications', assignee: 'Jaston Mbohe', dueDate: '2024-06-16', completed: false },
        { id: 2, task: 'Submit formal proposal', assignee: 'Grace Njeri', dueDate: '2024-06-16', completed: false },
        { id: 3, task: 'Schedule follow-up meeting', assignee: 'Grace Njeri', dueDate: '2024-06-20', completed: false }
      ],
      attachments: ['Site_Assessment_Report.pdf', 'Technical_Specs.docx'],
      tags: ['Site Visit', 'Technical', 'Proposal']
    },
    {
      id: 2,
      title: 'Project Kickoff - Lafarge Holcim',
      contact: 'Project Manager',
      company: 'Lafarge Holcim Nairobi Grinding Plant',
      date: '2024-06-07T13:00:00Z',
      duration: '1.5 hours',
      location: 'Lafarge Holcim Plant, Athi River',
      type: 'Project Kickoff',
      attendees: ['Jaston Mbohe', 'Project Manager', 'Plant Engineer', 'Safety Officer'],
      status: 'Completed',
      notes: `Project Kickoff Meeting Summary:
      
Project Scope:
• Supply and installation of GHA M.V. switchgear
• Integration with existing power system
• Commissioning and testing
• Training for maintenance team

Project Timeline:
• Procurement: 2 weeks
• Installation: 3 weeks
• Commissioning: 1 week
• Training: 2 days

Key Deliverables:
• M.V. Switchgear with protection system
• Installation and commissioning
• Operation and maintenance manuals
• Training for plant staff

Safety Requirements:
• All personnel must complete safety induction
• Work permits required for all activities
• Daily safety briefings mandatory`,
      actionItems: [
        { id: 1, task: 'Begin procurement process', assignee: 'Jaston Mbohe', dueDate: '2024-06-14', completed: true },
        { id: 2, task: 'Schedule safety induction', assignee: 'Safety Officer', dueDate: '2024-06-12', completed: true },
        { id: 3, task: 'Prepare work permits', assignee: 'Project Manager', dueDate: '2024-06-15', completed: false }
      ],
      attachments: ['Project_Plan.pdf', 'Safety_Requirements.docx'],
      tags: ['Kickoff', 'Project', 'Safety']
    },
    {
      id: 3,
      title: 'Proposal Review - Mars Wrigley',
      contact: 'John Kamau',
      company: 'Mars Wrigley East Africa',
      date: '2024-06-05T14:00:00Z',
      duration: '1 hour',
      location: 'Mars Wrigley Office, Nairobi',
      type: 'Proposal Review',
      attendees: ['Peter Otieno', 'John Kamau', 'Technical Director', 'Procurement Manager'],
      status: 'Completed',
      notes: `Proposal Review Meeting Summary:
      
Proposal Feedback:
• Technical specifications approved
• Timeline acceptable (May 2016 - Sep 2017)
• Budget within acceptable range
• Quality standards meet requirements

Questions Addressed:
• Warranty terms clarified (2 years standard)
• Spare parts availability confirmed
• Training scope defined (3 days for maintenance team)
• Payment terms agreed (30% advance, 60% on delivery, 10% on completion)

Modifications Required:
• Include additional safety features
• Extend warranty to 3 years
• Add remote monitoring capabilities

Next Steps:
• Submit revised proposal within 3 days
• Schedule contract signing meeting
• Begin project planning`,
      actionItems: [
        { id: 1, task: 'Revise proposal with modifications', assignee: 'Peter Otieno', dueDate: '2024-06-08', completed: true },
        { id: 2, task: 'Schedule contract signing', assignee: 'Peter Otieno', dueDate: '2024-06-12', completed: false },
        { id: 3, task: 'Begin project planning', assignee: 'Jaston Mbohe', dueDate: '2024-06-15', completed: false }
      ],
      attachments: ['Revised_Proposal.pdf', 'Contract_Draft.docx'],
      tags: ['Proposal', 'Contract', 'Technical']
    },
    {
      id: 4,
      title: 'Maintenance Planning - DTB Mombasa Road',
      contact: 'Grace Njeri',
      company: 'Diamond Trust Bank Mombasa Road',
      date: '2024-06-03T11:00:00Z',
      duration: '45 minutes',
      location: 'DTB Branch, Mombasa Road',
      type: 'Maintenance Planning',
      attendees: ['Mary Wambui', 'Grace Njeri', 'Branch Manager', 'Facility Manager'],
      status: 'Completed',
      notes: `Maintenance Planning Meeting Summary:
      
Current Status:
• Earthing system audit completed
• M.V. switchgear condition assessed
• Transformer performance evaluated
• L.V. switchboards inspected

Maintenance Requirements:
• Earthing system improvement needed
• Preventive maintenance schedule established
• Emergency response procedures updated
• Staff training required

Maintenance Schedule:
• Monthly: Basic inspection and cleaning
• Quarterly: Comprehensive testing
• Annually: Full maintenance and calibration

Budget Allocation:
• Preventive maintenance: KSh 500K annually
• Emergency repairs: KSh 200K contingency
• Training: KSh 100K annually`,
      actionItems: [
        { id: 1, task: 'Implement earthing improvements', assignee: 'Jaston Mbohe', dueDate: '2024-06-20', completed: false },
        { id: 2, task: 'Schedule staff training', assignee: 'Mary Wambui', dueDate: '2024-06-25', completed: false },
        { id: 3, task: 'Update emergency procedures', assignee: 'Facility Manager', dueDate: '2024-06-18', completed: false }
      ],
      attachments: ['Maintenance_Plan.pdf', 'Training_Schedule.docx'],
      tags: ['Maintenance', 'Planning', 'Training']
    }
  ];

  const meetingTypes = ['Site Visit', 'Project Kickoff', 'Proposal Review', 'Maintenance Planning', 'Technical Discussion', 'Contract Signing'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Site Visit': return 'blue';
      case 'Project Kickoff': return 'green';
      case 'Proposal Review': return 'orange';
      case 'Maintenance Planning': return 'purple';
      case 'Technical Discussion': return 'cyan';
      case 'Contract Signing': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Scheduled': return 'blue';
      case 'Cancelled': return 'red';
      case 'Postponed': return 'yellow';
      default: return 'gray';
    }
  };

  const handleEdit = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  const handlePreview = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsPreviewOpen(true);
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Meeting Notes</Title>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Create Meeting Note
        </Button>
      </Group>

      {/* Meeting Notes Grid */}
      <Grid>
        {meetingNotes.map((meeting) => (
          <Grid.Col key={meeting.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Badge color={getTypeColor(meeting.type)} variant="light">
                  {meeting.type}
                </Badge>
                <Badge color={getStatusColor(meeting.status)} variant="light">
                  {meeting.status}
                </Badge>
              </Group>

              <Text fw={600} size="sm" mb="xs">{meeting.title}</Text>
              <Text size="xs" c="dimmed" mb="xs" lineClamp={2}>
                {meeting.notes}
              </Text>
              
              <Stack gap="xs">
                <Group gap="xs">
                  <IconBuilding size={14} />
                  <Text size="xs">{meeting.company}</Text>
                </Group>
                <Group gap="xs">
                  <IconUser size={14} />
                  <Text size="xs">{meeting.contact}</Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={14} />
                  <Text size="xs">{new Date(meeting.date).toLocaleDateString()}</Text>
                </Group>
                <Group gap="xs">
                  <IconClock size={14} />
                  <Text size="xs">{meeting.duration}</Text>
                </Group>
                <Group gap="xs">
                  <IconMapPin size={14} />
                  <Text size="xs">{meeting.location}</Text>
                </Group>
                
                <Text size="xs" c="dimmed">
                  {meeting.actionItems.filter(item => !item.completed).length} pending actions
                </Text>
              </Stack>

              <Group mt="md" gap="xs">
                <Tooltip label="Preview">
                  <ActionIcon 
                    variant="light" 
                    size="sm"
                    onClick={() => handlePreview(meeting)}
                  >
                    <IconFileText size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Edit">
                  <ActionIcon 
                    variant="light" 
                    size="sm"
                    onClick={() => handleEdit(meeting)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Download">
                  <ActionIcon variant="light" size="sm">
                    <IconDownload size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Share">
                  <ActionIcon variant="light" size="sm">
                    <IconShare size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Edit Meeting Modal */}
      <Modal 
        opened={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Meeting Note"
        size="lg"
      >
        {selectedMeeting && (
          <Stack>
            <TextInput
              label="Meeting Title"
              value={selectedMeeting.title}
              placeholder="Enter meeting title"
            />
            <Group>
              <TextInput
                label="Contact"
                value={selectedMeeting.contact}
                placeholder="Contact name"
                style={{ flex: 1 }}
              />
              <TextInput
                label="Company"
                value={selectedMeeting.company}
                placeholder="Company name"
                style={{ flex: 1 }}
              />
            </Group>
            <Group>
              <Select
                label="Meeting Type"
                value={selectedMeeting.type}
                data={meetingTypes}
                style={{ flex: 1 }}
              />
              <Select
                label="Status"
                value={selectedMeeting.status}
                data={['Scheduled', 'Completed', 'Cancelled', 'Postponed']}
                style={{ flex: 1 }}
              />
            </Group>
            <Group>
              <TextInput
                label="Location"
                value={selectedMeeting.location}
                placeholder="Meeting location"
                style={{ flex: 1 }}
              />
              <TextInput
                label="Duration"
                value={selectedMeeting.duration}
                placeholder="Meeting duration"
                style={{ flex: 1 }}
              />
            </Group>
            <Textarea
              label="Notes"
              value={selectedMeeting.notes}
              placeholder="Meeting notes and details"
              minRows={6}
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

      {/* Preview Meeting Modal */}
      <Modal 
        opened={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="Meeting Note Preview"
        size="lg"
      >
        {selectedMeeting && (
          <Stack>
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">{selectedMeeting.title}</Text>
                <Badge color={getTypeColor(selectedMeeting.type)}>
                  {selectedMeeting.type}
                </Badge>
              </Group>
              
              <Group gap="lg" mb="md">
                <Group gap="xs">
                  <IconBuilding size={16} />
                  <Text size="sm">{selectedMeeting.company}</Text>
                </Group>
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm">{selectedMeeting.contact}</Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text size="sm">{new Date(selectedMeeting.date).toLocaleDateString()}</Text>
                </Group>
                <Group gap="xs">
                  <IconClock size={16} />
                  <Text size="sm">{selectedMeeting.duration}</Text>
                </Group>
              </Group>
              
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedMeeting.notes}
              </Text>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="md">Action Items</Text>
              <Stack gap="xs">
                {selectedMeeting.actionItems.map((item: any) => (
                  <Group key={item.id} justify="space-between">
                    <Group gap="xs">
                      <Checkbox checked={item.completed} />
                      <Text size="sm">{item.task}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{item.assignee}</Text>
                  </Group>
                ))}
              </Stack>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="md">Attendees</Text>
              <Group gap="xs">
                {selectedMeeting.attendees.map((attendee: string) => (
                  <Badge key={attendee} variant="light">
                    {attendee}
                  </Badge>
                ))}
              </Group>
            </Paper>
          </Stack>
        )}
      </Modal>
    </Container>
  );
} 