import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Avatar, 
  Timeline,
  Select,
  Button,
  TextInput,
  ActionIcon,
  Paper,
  Divider
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconPlus,
  IconPhone,
  IconMail,
  IconCalendar,
  IconMessage,
  IconCheck,
  IconX,
  IconClock,
  IconUser,
  IconBuilding,
  IconRobotFace,
  IconTarget,
  IconPlus as IconPlusTabler
} from '@tabler/icons-react';

export default function CRMActivityFeedPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Mock activities with more comprehensive examples
  const mockActivities = [
    {
      id: 1,
      type: 'call',
      title: 'Follow-up call with Apex Steel Ltd',
      contact: 'John Kamau',
      company: 'Apex Steel Ltd',
      duration: '15 minutes',
      outcome: 'positive',
      nextAction: 'Send proposal by Friday',
      date: '2024-06-10T14:30:00Z',
      timestamp: '2024-06-10T14:30:00Z',
      notes: 'Discussed maintenance contract renewal. Client interested in premium package. Need to prepare detailed proposal with pricing.',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Mary Wambui',
      tags: ['follow-up', 'proposal', 'maintenance']
    },
    {
      id: 2,
      type: 'email',
      title: 'Project update sent to Beta Corp',
      contact: 'Sarah Mwangi',
      company: 'Beta Corp',
      duration: null,
      outcome: 'neutral',
      nextAction: 'Follow up in 3 days',
      date: '2024-06-10T11:15:00Z',
      timestamp: '2024-06-10T11:15:00Z',
      notes: 'Sent weekly project status update. Phase 1 completed successfully. Awaiting client feedback on Phase 2 requirements.',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Alice M.',
      tags: ['project', 'update', 'phase-1']
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Q2 Strategy Planning Meeting',
      contact: 'Team Meeting',
      company: 'Internal',
      duration: '90 minutes',
      outcome: 'positive',
      nextAction: 'Prepare action items and timeline',
      date: '2024-06-10T09:00:00Z',
      timestamp: '2024-06-10T09:00:00Z',
      notes: 'Quarterly strategy meeting with all department heads. Discussed revenue targets, new product launch, and team expansion plans.',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Grace Njeri',
      tags: ['strategy', 'planning', 'Q2']
    },
    {
      id: 4,
      type: 'task',
      title: 'Review competitor analysis report',
      contact: 'Marketing Team',
      company: 'Internal',
      duration: '45 minutes',
      outcome: 'completed',
      nextAction: 'Present findings to management',
      date: '2024-06-09T16:00:00Z',
      timestamp: '2024-06-09T16:00:00Z',
      notes: 'Completed comprehensive competitor analysis. Identified 3 key opportunities and 2 potential threats. Report ready for presentation.',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Bob N.',
      tags: ['analysis', 'competitor', 'report']
    },
    {
      id: 5,
      type: 'sms',
      title: 'Appointment reminder sent',
      contact: 'David Ochieng',
      company: 'Tech Solutions Ltd',
      duration: null,
      outcome: 'positive',
      nextAction: 'Confirm appointment 1 hour before',
      date: '2024-06-09T14:20:00Z',
      timestamp: '2024-06-09T14:20:00Z',
      notes: 'Sent SMS reminder for tomorrow\'s 10 AM consultation meeting. Client confirmed receipt.',
      status: 'completed',
      priority: 'low',
      assignedTo: 'Mary Wambui',
      tags: ['reminder', 'appointment', 'consultation']
    },
    {
      id: 6,
      type: 'whatsapp',
      title: 'Quick support chat',
      contact: 'Lisa Akinyi',
      company: 'Digital Innovations',
      duration: '20 minutes',
      outcome: 'positive',
      nextAction: 'Send follow-up email with solution details',
      date: '2024-06-09T13:45:00Z',
      timestamp: '2024-06-09T13:45:00Z',
      notes: 'Provided technical support via WhatsApp. Resolved login issue and provided additional security recommendations.',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Alice M.',
      tags: ['support', 'technical', 'security']
    },
    {
      id: 7,
      type: 'call',
      title: 'Cold call to potential client',
      contact: 'Michael Odhiambo',
      company: 'Green Energy Solutions',
      duration: '8 minutes',
      outcome: 'negative',
      nextAction: 'Add to follow-up list for Q3',
      date: '2024-06-09T10:30:00Z',
      timestamp: '2024-06-09T10:30:00Z',
      notes: 'Cold call to introduce our services. Client not interested at the moment but open to future discussions.',
      status: 'completed',
      priority: 'low',
      assignedTo: 'Grace Njeri',
      tags: ['cold-call', 'prospecting', 'future']
    },
    {
      id: 8,
      type: 'email',
      title: 'Contract renewal discussion',
      contact: 'Patricia Wanjiku',
      company: 'City Bank Kenya',
      duration: null,
      outcome: 'positive',
      nextAction: 'Schedule contract review meeting',
      date: '2024-06-08T15:20:00Z',
      timestamp: '2024-06-08T15:20:00Z',
      notes: 'Discussed contract renewal terms. Client satisfied with current services but wants to discuss pricing adjustments.',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'Mary Wambui',
      tags: ['contract', 'renewal', 'pricing']
    },
    {
      id: 9,
      type: 'meeting',
      title: 'Product demo for new client',
      contact: 'James Kiprop',
      company: 'Innovation Hub',
      duration: '60 minutes',
      outcome: 'positive',
      nextAction: 'Send proposal and pricing',
      date: '2024-06-08T11:00:00Z',
      timestamp: '2024-06-08T11:00:00Z',
      notes: 'Conducted product demonstration. Client impressed with features and integration capabilities. Ready for proposal.',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Bob N.',
      tags: ['demo', 'proposal', 'new-client']
    },
    {
      id: 10,
      type: 'task',
      title: 'Update client database',
      contact: 'Admin Team',
      company: 'Internal',
      duration: '30 minutes',
      outcome: 'completed',
      nextAction: 'Run data validation checks',
      date: '2024-06-08T09:15:00Z',
      timestamp: '2024-06-08T09:15:00Z',
      notes: 'Updated client contact information and preferences. Cleaned up duplicate entries and verified email addresses.',
      status: 'completed',
      priority: 'low',
      assignedTo: 'Alice M.',
      tags: ['database', 'cleanup', 'maintenance']
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <IconPhone size={16} />;
      case 'email': return <IconMail size={16} />;
      case 'meeting': return <IconCalendar size={16} />;
      case 'task': return <IconCheck size={16} />;
      case 'message': return <IconMessage size={16} />;
      default: return <IconClock size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'blue';
      case 'email': return 'green';
      case 'meeting': return 'purple';
      case 'task': return 'orange';
      case 'message': return 'cyan';
      default: return 'gray';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive':
      case 'Successful':
      case 'Completed': return 'green';
      case 'Qualified': return 'blue';
      case 'Pending': return 'yellow';
      case 'In Progress': return 'orange';
      default: return 'gray';
    }
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = search === '' || 
      activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.contact.toLowerCase().includes(search.toLowerCase()) ||
      activity.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // AI functions for activity analysis
  function aiAnalyzeActivity(activity) {
    // Enhanced AI analysis with more comprehensive suggestions
    const analysisMap = {
      1: {
        sentiment: 'positive',
        urgency: 'high',
        actionItems: [
          { description: 'Prepare detailed proposal with pricing breakdown', priority: 'high', dueDate: '2024-06-14', estimatedTime: '4 hours' },
          { description: 'Schedule follow-up call for proposal discussion', priority: 'medium', dueDate: '2024-06-17', estimatedTime: '30 minutes' },
          { description: 'Research competitor pricing for premium package', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '2 hours' }
        ],
        leadOpportunity: {
          shouldCreate: true,
          company: 'Apex Steel Ltd',
          estimatedValue: 8000000,
          confidence: 'high',
          probability: '85%',
          timeline: '30 days'
        },
        insights: [
          'Client shows strong interest in premium services',
          'Maintenance contract renewal is time-sensitive',
          'Opportunity to upsell additional services'
        ]
      },
      2: {
        sentiment: 'neutral',
        urgency: 'medium',
        actionItems: [
          { description: 'Follow up on Phase 2 requirements', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '1 hour' },
          { description: 'Prepare Phase 2 project timeline', priority: 'medium', dueDate: '2024-06-15', estimatedTime: '3 hours' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Existing client relationship'
        },
        insights: [
          'Phase 1 completed successfully - positive milestone',
          'Client may need additional support for Phase 2',
          'Opportunity to expand project scope'
        ]
      },
      3: {
        sentiment: 'positive',
        urgency: 'high',
        actionItems: [
          { description: 'Create detailed action items document', priority: 'high', dueDate: '2024-06-12', estimatedTime: '2 hours' },
          { description: 'Schedule weekly progress review meetings', priority: 'high', dueDate: '2024-06-14', estimatedTime: '1 hour' },
          { description: 'Coordinate with marketing team for product launch', priority: 'medium', dueDate: '2024-06-16', estimatedTime: '2 hours' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Internal strategy meeting'
        },
        insights: [
          'Strong team alignment on Q2 objectives',
          'Revenue targets are ambitious but achievable',
          'New product launch requires careful coordination'
        ]
      },
      4: {
        sentiment: 'positive',
        urgency: 'medium',
        actionItems: [
          { description: 'Prepare presentation slides for management', priority: 'medium', dueDate: '2024-06-11', estimatedTime: '2 hours' },
          { description: 'Schedule management presentation', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '30 minutes' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Internal analysis task'
        },
        insights: [
          'Competitor analysis reveals market opportunities',
          'Identified threats require strategic response',
          'Report provides valuable market intelligence'
        ]
      },
      5: {
        sentiment: 'positive',
        urgency: 'low',
        actionItems: [
          { description: 'Send appointment confirmation 1 hour before', priority: 'low', dueDate: '2024-06-10T09:00:00Z', estimatedTime: '5 minutes' },
          { description: 'Prepare consultation materials', priority: 'medium', dueDate: '2024-06-09', estimatedTime: '1 hour' }
        ],
        leadOpportunity: {
          shouldCreate: true,
          company: 'Tech Solutions Ltd',
          estimatedValue: 2000000,
          confidence: 'medium',
          probability: '60%',
          timeline: '14 days'
        },
        insights: [
          'Client responsiveness indicates interest',
          'Appointment confirmation shows professionalism',
          'Consultation meeting has high conversion potential'
        ]
      },
      6: {
        sentiment: 'positive',
        urgency: 'medium',
        actionItems: [
          { description: 'Send detailed solution documentation via email', priority: 'medium', dueDate: '2024-06-10', estimatedTime: '1 hour' },
          { description: 'Schedule follow-up call to ensure resolution', priority: 'low', dueDate: '2024-06-12', estimatedTime: '15 minutes' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Existing client support request'
        },
        insights: [
          'Quick resolution demonstrates technical competence',
          'Security recommendations show proactive approach',
          'WhatsApp support is cost-effective and efficient'
        ]
      },
      7: {
        sentiment: 'negative',
        urgency: 'low',
        actionItems: [
          { description: 'Add to Q3 follow-up list', priority: 'low', dueDate: '2024-07-01', estimatedTime: '15 minutes' },
          { description: 'Research company for future engagement', priority: 'low', dueDate: '2024-06-20', estimatedTime: '30 minutes' }
        ],
        leadOpportunity: {
          shouldCreate: true,
          company: 'Green Energy Solutions',
          estimatedValue: 1500000,
          confidence: 'low',
          probability: '20%',
          timeline: '90 days'
        },
        insights: [
          'Not interested now but open to future discussions',
          'Green energy sector shows growth potential',
          'Long-term nurturing strategy recommended'
        ]
      },
      8: {
        sentiment: 'positive',
        urgency: 'high',
        actionItems: [
          { description: 'Schedule contract review meeting', priority: 'high', dueDate: '2024-06-12', estimatedTime: '1 hour' },
          { description: 'Prepare pricing adjustment proposals', priority: 'high', dueDate: '2024-06-11', estimatedTime: '3 hours' },
          { description: 'Review current contract terms', priority: 'medium', dueDate: '2024-06-10', estimatedTime: '2 hours' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Existing client contract renewal'
        },
        insights: [
          'Client satisfaction with current services',
          'Pricing discussion indicates budget awareness',
          'Contract renewal has high probability of success'
        ]
      },
      9: {
        sentiment: 'positive',
        urgency: 'high',
        actionItems: [
          { description: 'Prepare comprehensive proposal', priority: 'high', dueDate: '2024-06-11', estimatedTime: '4 hours' },
          { description: 'Include pricing and implementation timeline', priority: 'high', dueDate: '2024-06-11', estimatedTime: '2 hours' },
          { description: 'Schedule proposal presentation', priority: 'medium', dueDate: '2024-06-13', estimatedTime: '1 hour' }
        ],
        leadOpportunity: {
          shouldCreate: true,
          company: 'Innovation Hub',
          estimatedValue: 5000000,
          confidence: 'high',
          probability: '90%',
          timeline: '21 days'
        },
        insights: [
          'Client impressed with product capabilities',
          'Integration features are key selling points',
          'High probability of successful conversion'
        ]
      },
      10: {
        sentiment: 'neutral',
        urgency: 'low',
        actionItems: [
          { description: 'Run data validation checks', priority: 'low', dueDate: '2024-06-09', estimatedTime: '30 minutes' },
          { description: 'Schedule regular database maintenance', priority: 'low', dueDate: '2024-06-15', estimatedTime: '1 hour' }
        ],
        leadOpportunity: {
          shouldCreate: false,
          reason: 'Internal maintenance task'
        },
        insights: [
          'Database cleanup improves data quality',
          'Regular maintenance prevents future issues',
          'Clean data supports better CRM performance'
        ]
      }
    };

    return analysisMap[activity.id] || {
      sentiment: 'neutral',
      urgency: 'medium',
      actionItems: [],
      leadOpportunity: { shouldCreate: false, reason: 'No analysis available' },
      insights: ['Analysis not available for this activity']
    };
  }

  function aiSuggestNextSteps(activity) {
    const aiAnalysis = aiAnalyzeActivity(activity);
    
    const suggestions = [];
    
    // Add action items as suggestions
    aiAnalysis.actionItems.forEach(item => {
      suggestions.push({
        type: 'task',
        description: item.description,
        priority: item.priority,
        dueDate: item.dueDate,
        estimatedTime: item.estimatedTime
      });
    });
    
    // Add lead creation suggestion if applicable
    if (aiAnalysis.leadOpportunity.shouldCreate) {
      suggestions.push({
        type: 'lead',
        description: `Create lead for ${aiAnalysis.leadOpportunity.company}`,
        priority: 'high',
        estimatedValue: aiAnalysis.leadOpportunity.estimatedValue,
        confidence: aiAnalysis.leadOpportunity.confidence
      });
    }
    
    // Add calendar event suggestions
    if (activity.type === 'meeting' || activity.type === 'call') {
      suggestions.push({
        type: 'calendar',
        description: `Schedule follow-up ${activity.type}`,
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    
    return suggestions;
  }

  // Add error boundary for missing fields
  function safeGet(obj, key, fallback = '') {
    return obj && obj[key] !== undefined ? obj[key] : fallback;
  }

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Activity Feed</Title>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Log Activity
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Group>
          <TextInput
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            value={filter}
            onChange={setFilter}
            data={[
              { value: 'all', label: 'All Activities' },
              { value: 'call', label: 'Calls' },
              { value: 'email', label: 'Emails' },
              { value: 'meeting', label: 'Meetings' },
              { value: 'task', label: 'Tasks' },
              { value: 'message', label: 'Messages' }
            ]}
            w={150}
          />
        </Group>
      </Card>

      {/* Activity Timeline */}
      <Timeline active={1} bulletSize={24} lineWidth={2}>
        {filteredActivities.map((activity, index) => {
          const aiAnalysis = aiAnalyzeActivity(activity);
          const aiNextSteps = aiSuggestNextSteps(activity);
          
          return (
            <Timeline.Item
              key={activity.id}
              bullet={getActivityIcon(activity.type)}
              title={
                <Group gap="xs">
                  <Text fw={600} size="sm">{activity.title}</Text>
                  <Badge color={getActivityColor(activity.type)} variant="light" size="xs">
                    {activity.type.toUpperCase()}
                  </Badge>
                  <Badge color={getOutcomeColor(activity.outcome)} variant="light" size="xs">
                    {activity.outcome}
                  </Badge>
                  {/* AI Sentiment Badge */}
                  <Badge 
                    color={aiAnalysis.sentiment === 'positive' ? 'green' : aiAnalysis.sentiment === 'negative' ? 'red' : 'gray'} 
                    variant="light" 
                    size="xs"
                    leftSection={<IconRobotFace size={10} />}
                  >
                    {aiAnalysis.sentiment}
                  </Badge>
                </Group>
              }
            >
              <Paper p="md" withBorder mt="xs">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">{activity.notes}</Text>
                  
                  <Group gap="lg" wrap="nowrap">
                    <Group gap="xs">
                      <IconUser size={14} />
                      <Text size="xs">{activity.contact}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconBuilding size={14} />
                      <Text size="xs">{activity.company}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconUser size={14} />
                      <Text size="xs">By: {activity.assignedTo}</Text>
                    </Group>
                    {activity.duration && (
                      <Group gap="xs">
                        <IconClock size={14} />
                        <Text size="xs">{activity.duration}</Text>
                      </Group>
                    )}
                  </Group>

                  <Text size="xs" c="dimmed">
                    {new Date(activity.date).toLocaleString()}
                  </Text>

                  {/* AI Action Items Section */}
                  {aiAnalysis.actionItems.length > 0 && (
                    <Paper p="xs" bg="blue.0" withBorder>
                      <Group gap="xs" mb="xs">
                        <IconRobotFace size={14} />
                        <Text size="xs" fw={500} c="blue">AI Detected Action Items:</Text>
                      </Group>
                      <Stack gap="xs">
                        {aiAnalysis.actionItems.map((item, idx) => (
                          <Group key={idx} gap="xs" justify="space-between">
                            <Text size="xs" style={{ flex: 1 }}>{item.description}</Text>
                            <Group gap="xs">
                              <Badge color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'} size="xs">
                                {item.priority}
                              </Badge>
                              <Button 
                                size="xs" 
                                variant="light" 
                                leftSection={<IconCheck size={10} />}
                              >
                                Create Task
                              </Button>
                            </Group>
                          </Group>
                        ))}
                      </Stack>
                    </Paper>
                  )}

                  {/* AI Lead Opportunity Section */}
                  {aiAnalysis.leadOpportunity && (
                    <Paper p="xs" bg="green.0" withBorder>
                      <Group gap="xs" justify="space-between">
                        <Group gap="xs">
                          <IconTarget size={14} />
                          <Text size="xs" fw={500} c="green">AI Suggests Lead Opportunity</Text>
                        </Group>
                        <Button 
                          size="xs" 
                          variant="light" 
                          color="green"
                          leftSection={<IconPlusTabler size={10} />}
                        >
                          Create Lead
                        </Button>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">
                        {aiAnalysis.leadOpportunity.company} - {aiAnalysis.leadOpportunity.estimatedValue ? aiAnalysis.leadOpportunity.estimatedValue.toLocaleString() : 'N/A'} KES
                      </Text>
                    </Paper>
                  )}

                  {/* AI Next Steps */}
                  <Paper p="xs" bg="gray.0" withBorder>
                    <Group gap="xs" mb="xs">
                      <IconRobotFace size={14} />
                      <Text size="xs" fw={500} c="gray">AI Suggested Next Steps:</Text>
                    </Group>
                    <Stack gap="xs">
                      {aiNextSteps.map((step, idx) => (
                        <Group key={idx} gap="xs" justify="space-between">
                          <Text size="xs" style={{ flex: 1 }}>{step.description}</Text>
                          <Group gap="xs">
                            <Badge color={step.priority === 'high' ? 'red' : step.priority === 'medium' ? 'yellow' : 'green'} size="xs">
                              {step.priority}
                            </Badge>
                            {step.type === 'task' && (
                              <Button 
                                size="xs" 
                                variant="light" 
                                leftSection={<IconCheck size={10} />}
                              >
                                Create Task
                              </Button>
                            )}
                            {step.type === 'lead' && (
                              <Button 
                                size="xs" 
                                variant="light" 
                                color="green"
                                leftSection={<IconPlusTabler size={10} />}
                              >
                                Create Lead
                              </Button>
                            )}
                            {step.type === 'calendar' && (
                              <Button 
                                size="xs" 
                                variant="light" 
                                color="blue"
                                leftSection={<IconCalendar size={10} />}
                              >
                                Schedule
                              </Button>
                            )}
                          </Group>
                        </Group>
                      ))}
                    </Stack>
                  </Paper>

                  {activity.nextAction && (
                    <Paper p="xs" bg="blue.0" withBorder>
                      <Text size="xs" fw={500} c="blue">Next Action: {activity.nextAction}</Text>
                    </Paper>
                  )}
                </Stack>
              </Paper>
            </Timeline.Item>
          );
        })}
      </Timeline>

      {filteredActivities.length === 0 && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">No activities found matching your criteria.</Text>
        </Card>
      )}
    </Container>
  );
} 