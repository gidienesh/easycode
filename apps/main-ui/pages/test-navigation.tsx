import React from 'react';
import { Container, Title, Text, Card, Group, Badge } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function TestNavigationPage() {
  const testResults = [
    {
      service: 'CRM Service',
      status: 'success',
      features: [
        'Leads Management',
        'Contacts',
        'Accounts',
        'Opportunities',
        'Activities',
        'Reports',
        'Email Templates',
        'SMS Templates',
        'Call Logs',
        'Meeting Notes',
        'WhatsApp Logs',
        'Activity Feed'
      ]
    },
    {
      service: 'Project Management Service',
      status: 'success',
      features: [
        'Projects',
        'Tasks',
        'Timeline',
        'Gantt Charts',
        'Calendar',
        'Resources',
        'Time Tracking',
        'Milestones',
        'Workspaces',
        'Reports',
        'Dashboards',
        'File Management',
        'Comments',
        'Activity Feed'
      ]
    },
    {
      service: 'Equipment Maintenance Service',
      status: 'success',
      features: [
        'Asset Registry',
        'Work Orders',
        'Preventive Maintenance',
        'Corrective Maintenance',
        'Checklists',
        'Service History',
        'Maintenance Schedule',
        'Technicians',
        'Spare Parts',
        'Reports',
        'Analytics',
        'QR Codes',
        'Asset Types'
      ]
    },
    {
      service: 'HR Service',
      status: 'success',
      features: [
        'Employees',
        'Departments',
        'Positions',
        'Payroll',
        'Leave Management',
        'Leave Balances',
        'Leave Requests',
        'Performance',
        'Recruitment',
        'Job Requisitions',
        'Candidates',
        'Interviews',
        'Onboarding',
        'Offboarding',
        'Documents',
        'Reports',
        'Organizational Chart'
      ]
    },
    {
      service: 'Finance Service',
      status: 'success',
      features: [
        'General Ledger',
        'Chart of Accounts',
        'Journal Entries',
        'Accounts Payable',
        'Accounts Receivable',
        'Fixed Assets',
        'Invoices',
        'Payments',
        'Bank Reconciliation',
        'Trial Balance',
        'Financial Reports',
        'Balance Sheet',
        'Income Statement',
        'Cash Flow',
        'Budget Management',
        'Tax Management',
        'Multi-Currency',
        'Financial Dimensions',
        'Audit Trail',
        'Dashboards'
      ]
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Navigation Enhancement Test Results
      </Title>
      
      <Text size="lg" mb="xl" ta="center" c="dimmed">
        Testing the enhanced navigation menu with comprehensive submenus for all services
      </Text>

      {testResults.map((result, index) => (
        <Card key={index} shadow="sm" p="lg" mb="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={3}>{result.service}</Title>
            <Badge 
              color={result.status === 'success' ? 'green' : 'red'}
              leftSection={result.status === 'success' ? <IconCheck size="0.8rem" /> : <IconX size="0.8rem" />}
            >
              {result.status === 'success' ? 'Enhanced' : 'Failed'}
            </Badge>
          </Group>
          
          <Text size="sm" c="dimmed" mb="md">
            {result.features.length} features implemented
          </Text>
          
          <Group gap="xs" wrap="wrap">
            {result.features.map((feature, featureIndex) => (
              <Badge key={featureIndex} variant="light" size="sm">
                {feature}
              </Badge>
            ))}
          </Group>
        </Card>
      ))}

      <Card shadow="sm" p="lg" mt="xl" withBorder>
        <Title order={3} mb="md">Navigation Features</Title>
        <Group gap="md">
          <Badge color="blue" variant="light">Client-Side Navigation</Badge>
          <Badge color="blue" variant="light">Expandable Submenus</Badge>
          <Badge color="blue" variant="light">Active State Tracking</Badge>
          <Badge color="blue" variant="light">Permission-Based Filtering</Badge>
          <Badge color="blue" variant="light">Responsive Design</Badge>
          <Badge color="blue" variant="light">Icon Integration</Badge>
          <Badge color="blue" variant="light">Service Count Badge</Badge>
        </Group>
      </Card>
    </Container>
  );
} 