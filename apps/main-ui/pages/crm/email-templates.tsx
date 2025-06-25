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
  CopyButton,
  Tooltip
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCopy, 
  IconMail,
  IconEye,
  IconSend,
  IconTemplate
} from '@tabler/icons-react';

export default function CRMEmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const emailTemplates = [
    {
      id: 1,
      name: 'Initial Contact - Engineering Services',
      category: 'Prospecting',
      subject: 'Engineering Solutions for {{company_name}}',
      content: `Dear {{contact_name}},

I hope this email finds you well. I'm reaching out from {{our_company}} regarding your engineering needs.

Based on our research, {{company_name}} operates in the {{industry}} sector and may benefit from our comprehensive engineering services including:

• M.V./L.V. Switchgear Installation & Maintenance
• Transformer Installation & Commissioning
• Preventive Maintenance Programs
• UPS Systems & Power Solutions
• Earthing Audit & Improvement

We've successfully completed similar projects for companies like {{reference_company}} and would welcome the opportunity to discuss how we can support {{company_name}}.

Would you be available for a brief 15-minute call next week to explore potential collaboration?

Best regards,
{{sender_name}}
{{sender_title}}
{{our_company}}
{{phone_number}}`,
      variables: ['contact_name', 'company_name', 'industry', 'our_company', 'reference_company', 'sender_name', 'sender_title', 'phone_number'],
      usageCount: 45,
      lastUsed: '2024-06-10'
    },
    {
      id: 2,
      name: 'Proposal Follow-up',
      category: 'Sales',
      subject: 'Proposal for {{project_name}} - Next Steps',
      content: `Dear {{contact_name}},

Thank you for the opportunity to submit our proposal for the {{project_name}} project.

I wanted to follow up and ensure you received our comprehensive proposal that was sent on {{proposal_date}}. The proposal includes:

• Detailed technical specifications
• Project timeline and milestones
• Cost breakdown and payment terms
• Team qualifications and experience
• References from similar projects

I'm available for a detailed discussion of the proposal at your convenience. Would you prefer a call or meeting to address any questions you may have?

We're excited about the potential to work with {{company_name}} on this important project.

Best regards,
{{sender_name}}
{{sender_title}}
{{our_company}}`,
      variables: ['contact_name', 'project_name', 'proposal_date', 'company_name', 'sender_name', 'sender_title', 'our_company'],
      usageCount: 32,
      lastUsed: '2024-06-09'
    },
    {
      id: 3,
      name: 'Maintenance Schedule Confirmation',
      category: 'Service',
      subject: 'Maintenance Schedule Confirmation - {{equipment_type}}',
      content: `Dear {{contact_name}},

This email confirms the scheduled maintenance for your {{equipment_type}} at {{location}}.

Maintenance Details:
• Date: {{maintenance_date}}
• Time: {{maintenance_time}}
• Duration: {{duration}}
• Engineer: {{engineer_name}}
• Scope: {{maintenance_scope}}

Please ensure:
1. Access to the equipment area
2. Power shutdown coordination (if required)
3. Safety briefing for our team

If you need to reschedule or have any questions, please contact us immediately.

We appreciate your business and look forward to maintaining your equipment to optimal standards.

Best regards,
{{sender_name}}
Service Coordinator
{{our_company}}`,
      variables: ['contact_name', 'equipment_type', 'location', 'maintenance_date', 'maintenance_time', 'duration', 'engineer_name', 'maintenance_scope', 'sender_name', 'our_company'],
      usageCount: 28,
      lastUsed: '2024-06-08'
    },
    {
      id: 4,
      name: 'Project Completion Report',
      category: 'Project',
      subject: 'Project Completion Report - {{project_name}}',
      content: `Dear {{contact_name}},

I'm pleased to inform you that the {{project_name}} has been successfully completed.

Project Summary:
• Project: {{project_name}}
• Completion Date: {{completion_date}}
• Final Value: {{project_value}}
• Key Deliverables: {{deliverables}}

All work has been completed according to specifications and tested thoroughly. The project documentation and warranty information have been uploaded to your client portal.

We would appreciate your feedback on our performance and would welcome the opportunity to discuss any future projects.

Thank you for choosing {{our_company}} for this important project.

Best regards,
{{sender_name}}
Project Manager
{{our_company}}`,
      variables: ['contact_name', 'project_name', 'completion_date', 'project_value', 'deliverables', 'our_company', 'sender_name'],
      usageCount: 15,
      lastUsed: '2024-06-07'
    },
    {
      id: 5,
      name: 'Thank You - Meeting Follow-up',
      category: 'Relationship',
      subject: 'Thank you for meeting - {{meeting_topic}}',
      content: `Dear {{contact_name}},

Thank you for taking the time to meet with us today to discuss {{meeting_topic}}.

It was a pleasure learning more about {{company_name}}'s operations and how we can support your engineering needs.

As discussed, I will:
• {{action_item_1}}
• {{action_item_2}}
• {{action_item_3}}

I'll follow up with you by {{follow_up_date}} with the requested information.

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
{{sender_name}}
{{sender_title}}
{{our_company}}`,
      variables: ['contact_name', 'meeting_topic', 'company_name', 'action_item_1', 'action_item_2', 'action_item_3', 'follow_up_date', 'sender_name', 'sender_title', 'our_company'],
      usageCount: 22,
      lastUsed: '2024-06-06'
    }
  ];

  const categories = ['Prospecting', 'Sales', 'Service', 'Project', 'Relationship'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Prospecting': return 'blue';
      case 'Sales': return 'green';
      case 'Service': return 'orange';
      case 'Project': return 'purple';
      case 'Relationship': return 'cyan';
      default: return 'gray';
    }
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Email Templates</Title>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Create Template
        </Button>
      </Group>

      {/* Template Categories */}
      <Group mb="lg">
        {categories.map(category => (
          <Badge 
            key={category} 
            color={getCategoryColor(category)} 
            variant="light" 
            size="lg"
            style={{ cursor: 'pointer' }}
          >
            {category}
          </Badge>
        ))}
      </Group>

      {/* Email Templates Grid */}
      <Grid>
        {emailTemplates.map((template) => (
          <Grid.Col key={template.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Badge color={getCategoryColor(template.category)} variant="light">
                  {template.category}
                </Badge>
                <Group gap="xs">
                  <Tooltip label="Preview">
                    <ActionIcon 
                      variant="light" 
                      size="sm"
                      onClick={() => handlePreview(template)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Edit">
                    <ActionIcon 
                      variant="light" 
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Copy">
                    <CopyButton value={template.content}>
                      {({ copied, copy }) => (
                        <ActionIcon variant="light" size="sm" onClick={copy}>
                          <IconCopy size={16} />
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Tooltip>
                </Group>
              </Group>

              <Text fw={600} size="sm" mb="xs">{template.name}</Text>
              <Text size="xs" c="dimmed" mb="xs" lineClamp={2}>
                Subject: {template.subject}
              </Text>
              
              <Stack gap="xs">
                <Group gap="xs">
                  <IconTemplate size={14} />
                  <Text size="xs">{template.variables.length} variables</Text>
                </Group>
                <Group gap="xs">
                  <IconMail size={14} />
                  <Text size="xs">Used {template.usageCount} times</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Last used: {template.lastUsed}
                </Text>
              </Stack>

              <Group mt="md">
                <Button 
                  variant="light" 
                  size="xs" 
                  leftSection={<IconSend size={14} />}
                  fullWidth
                >
                  Use Template
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Edit Template Modal */}
      <Modal 
        opened={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Email Template"
        size="lg"
      >
        {selectedTemplate && (
          <Stack>
            <TextInput
              label="Template Name"
              value={selectedTemplate.name}
              placeholder="Enter template name"
            />
            <Select
              label="Category"
              value={selectedTemplate.category}
              data={categories}
            />
            <TextInput
              label="Subject"
              value={selectedTemplate.subject}
              placeholder="Enter email subject"
            />
            <Textarea
              label="Content"
              value={selectedTemplate.content}
              placeholder="Enter email content"
              minRows={10}
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

      {/* Preview Template Modal */}
      <Modal 
        opened={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="Preview Email Template"
        size="lg"
      >
        {selectedTemplate && (
          <Stack>
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Subject:</Text>
              <Text size="sm" mb="md">{selectedTemplate.subject}</Text>
              
              <Text fw={600} size="sm" mb="xs">Content:</Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedTemplate.content}
              </Text>
            </Paper>
            
            <Paper p="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Available Variables:</Text>
              <Group gap="xs">
                {selectedTemplate.variables.map((variable: string) => (
                  <Badge key={variable} variant="light" size="xs">
                    {`{{${variable}}}`}
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