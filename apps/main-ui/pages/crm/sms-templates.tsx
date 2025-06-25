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
  Tooltip,
  Progress
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCopy, 
  IconMessage,
  IconEye,
  IconSend,
  IconTemplate,
  IconCheck
} from '@tabler/icons-react';

export default function CRMSMSTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const smsTemplates = [
    {
      id: 1,
      name: 'Appointment Confirmation',
      category: 'Service',
      content: `Hi {{contact_name}}, your maintenance appointment for {{equipment_type}} at {{location}} is confirmed for {{date}} at {{time}}. Engineer: {{engineer_name}}. Call {{phone}} if you need to reschedule.`,
      variables: ['contact_name', 'equipment_type', 'location', 'date', 'time', 'engineer_name', 'phone'],
      usageCount: 67,
      lastUsed: '2024-06-10',
      characterCount: 156,
      maxCharacters: 160
    },
    {
      id: 2,
      name: 'Follow-up Reminder',
      category: 'Sales',
      content: `Hi {{contact_name}}, following up on our proposal for {{project_name}}. Have you had a chance to review? I'm available for any questions. Call {{phone}} or reply STOP to opt out.`,
      variables: ['contact_name', 'project_name', 'phone'],
      usageCount: 43,
      lastUsed: '2024-06-09',
      characterCount: 142,
      maxCharacters: 160
    },
    {
      id: 3,
      name: 'Project Update',
      category: 'Project',
      content: `Hi {{contact_name}}, {{project_name}} is {{progress}}% complete. Next milestone: {{next_milestone}} on {{date}}. Questions? Call {{phone}}.`,
      variables: ['contact_name', 'project_name', 'progress', 'next_milestone', 'date', 'phone'],
      usageCount: 28,
      lastUsed: '2024-06-08',
      characterCount: 134,
      maxCharacters: 160
    },
    {
      id: 4,
      name: 'Emergency Contact',
      category: 'Service',
      content: `Hi {{contact_name}}, we've received your emergency service request for {{equipment_type}}. Engineer {{engineer_name}} will arrive within {{eta}}. Call {{phone}} for updates.`,
      variables: ['contact_name', 'equipment_type', 'engineer_name', 'eta', 'phone'],
      usageCount: 15,
      lastUsed: '2024-06-07',
      characterCount: 148,
      maxCharacters: 160
    },
    {
      id: 5,
      name: 'Meeting Reminder',
      category: 'Sales',
      content: `Hi {{contact_name}}, reminder: {{meeting_type}} meeting tomorrow at {{time}} for {{project_name}}. Location: {{location}}. Call {{phone}} if you need to reschedule.`,
      variables: ['contact_name', 'meeting_type', 'time', 'project_name', 'location', 'phone'],
      usageCount: 34,
      lastUsed: '2024-06-06',
      characterCount: 158,
      maxCharacters: 160
    },
    {
      id: 6,
      name: 'Thank You Message',
      category: 'Relationship',
      content: `Hi {{contact_name}}, thank you for choosing {{our_company}} for {{project_name}}. We appreciate your business and look forward to serving you again.`,
      variables: ['contact_name', 'our_company', 'project_name'],
      usageCount: 22,
      lastUsed: '2024-06-05',
      characterCount: 127,
      maxCharacters: 160
    },
    {
      id: 7,
      name: 'Quote Request Confirmation',
      category: 'Sales',
      content: `Hi {{contact_name}}, we've received your quote request for {{service_type}}. Our team will review and send detailed proposal within {{timeline}}. Call {{phone}} for urgent requests.`,
      variables: ['contact_name', 'service_type', 'timeline', 'phone'],
      usageCount: 19,
      lastUsed: '2024-06-04',
      characterCount: 145,
      maxCharacters: 160
    },
    {
      id: 8,
      name: 'Maintenance Due',
      category: 'Service',
      content: `Hi {{contact_name}}, your {{equipment_type}} maintenance is due on {{due_date}}. Schedule now to avoid downtime. Call {{phone}} or visit {{website}}.`,
      variables: ['contact_name', 'equipment_type', 'due_date', 'phone', 'website'],
      usageCount: 31,
      lastUsed: '2024-06-03',
      characterCount: 139,
      maxCharacters: 160
    }
  ];

  const categories = ['Service', 'Sales', 'Project', 'Relationship'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Service': return 'orange';
      case 'Sales': return 'green';
      case 'Project': return 'purple';
      case 'Relationship': return 'cyan';
      default: return 'gray';
    }
  };

  const getCharacterColor = (count: number, max: number) => {
    const percentage = (count / max) * 100;
    if (percentage > 90) return 'red';
    if (percentage > 80) return 'yellow';
    return 'green';
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
        <Title order={2}>SMS Templates</Title>
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

      {/* SMS Templates Grid */}
      <Grid>
        {smsTemplates.map((template) => (
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
              <Text size="xs" c="dimmed" mb="xs" lineClamp={3}>
                {template.content}
              </Text>
              
              <Stack gap="xs">
                <Group gap="xs">
                  <IconTemplate size={14} />
                  <Text size="xs">{template.variables.length} variables</Text>
                </Group>
                <Group gap="xs">
                  <IconMessage size={14} />
                  <Text size="xs">Used {template.usageCount} times</Text>
                </Group>
                
                {/* Character Count Progress */}
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed">Characters</Text>
                    <Text size="xs" c={getCharacterColor(template.characterCount, template.maxCharacters)}>
                      {template.characterCount}/{template.maxCharacters}
                    </Text>
                  </Group>
                  <Progress 
                    value={(template.characterCount / template.maxCharacters) * 100} 
                    size="xs" 
                    color={getCharacterColor(template.characterCount, template.maxCharacters)}
                  />
                </div>
                
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
        title="Edit SMS Template"
        size="md"
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
            <Textarea
              label="Content"
              value={selectedTemplate.content}
              placeholder="Enter SMS content"
              minRows={4}
              maxLength={160}
            />
            <Text size="xs" c="dimmed">
              Characters: {selectedTemplate.content.length}/160
            </Text>
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
        title="Preview SMS Template"
        size="md"
      >
        {selectedTemplate && (
          <Stack>
            <Paper p="md" withBorder>
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

            <Paper p="md" withBorder>
              <Group justify="space-between">
                <Text size="sm">Character Count:</Text>
                <Text size="sm" fw={600} c={getCharacterColor(selectedTemplate.characterCount, selectedTemplate.maxCharacters)}>
                  {selectedTemplate.characterCount}/{selectedTemplate.maxCharacters}
                </Text>
              </Group>
              <Progress 
                value={(selectedTemplate.characterCount / selectedTemplate.maxCharacters) * 100} 
                size="sm" 
                color={getCharacterColor(selectedTemplate.characterCount, selectedTemplate.maxCharacters)}
                mt="xs"
              />
            </Paper>
          </Stack>
        )}
      </Modal>
    </Container>
  );
} 