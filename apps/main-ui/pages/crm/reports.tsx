import React, { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Stack,
  Card,
  Text,
  Badge,
  Tabs,
  Grid,
  Paper,
  Button,
  Alert,
  Divider,
  SimpleGrid,
  Box,
  Modal,
  Select,
  MultiSelect,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { DataTable } from 'mantine-datatable';
import {
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconBuilding,
  IconTarget,
  IconCurrencyDollar,
  IconCalendar,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconClock,
  IconUser,
  IconMail,
  IconPhone,
  IconMessage,
  IconChevronRight,
  IconChevronDown,
  IconReportAnalytics,
  IconFilter,
  IconDownload,
  IconPrinter,
  IconShare
} from '@tabler/icons-react';

// Mock data for demonstration
const pipelineKPIs = [
  { label: 'Total Pipeline Value', value: 'KSh 125,000,000', icon: IconCurrencyDollar, trend: 'up', change: 8.2, drillKey: 'pipelineValue' },
  { label: 'Win Rate', value: '68.2%', icon: IconCheck, trend: 'up', change: 2.1, drillKey: 'winRate' },
  { label: 'Conversion Rate', value: '57.1%', icon: IconTrendingUp, trend: 'up', change: 1.4 },
  { label: 'Avg Deal Size', value: 'KSh 288,461', icon: IconBuilding, trend: 'down', change: -0.9 },
  { label: 'Forecasted Revenue', value: 'KSh 45,000,000', icon: IconReportAnalytics, trend: 'up', change: 5.6 },
];
const engagementKPIs = [
  { label: 'Total Communications', value: '1,245', icon: IconMail, trend: 'up', change: 4.3 },
  { label: 'Response Rate', value: '82%', icon: IconCheck, trend: 'up', change: 1.2 },
  { label: 'Avg Response Time', value: '2.1h', icon: IconClock, trend: 'down', change: -0.3 },
  { label: 'Overdue Follow-ups', value: '7', icon: IconAlertCircle, trend: 'down', change: -2 },
  { label: 'Low Engagement Clients', value: '3', icon: IconUser, trend: 'up', change: 1 },
];
const plannerKPIs = [
  { label: 'Key Milestones', value: '12', icon: IconTarget, trend: 'up', change: 2 },
  { label: 'Overdue Tasks', value: '5', icon: IconAlertCircle, trend: 'up', change: 1 },
  { label: 'Upcoming Meetings', value: '8', icon: IconCalendar, trend: 'down', change: -1 },
  { label: 'Resource Utilization', value: '78%', icon: IconUsers, trend: 'up', change: 3 },
  { label: 'Bottlenecks', value: '2', icon: IconX, trend: 'down', change: -1 },
  { label: 'Team Productivity', value: '92%', icon: IconUsers, trend: 'up', change: 4, drillKey: 'teamProductivity' },
];

const alerts = [
  { type: 'danger', message: '3 deals are at risk due to inactivity over 14 days.' },
  { type: 'warning', message: '5 tasks are overdue. Review Planner for details.' },
  { type: 'info', message: 'Engagement with Mars Wrigley East Africa is below average.' },
];

// Mock data for pipeline drill-down
const pipelineDeals = [
  { id: 1, name: 'Apex Steel Switchgear', stage: 'Proposal', value: 12000000, owner: 'Mary Wambui', status: 'At Risk', closeDate: '2024-07-10' },
  { id: 2, name: 'Mars Wrigley Maintenance', stage: 'Negotiation', value: 18000000, owner: 'Peter Otieno', status: 'Active', closeDate: '2024-07-20' },
  { id: 3, name: 'Parliament of Kenya Retrofit', stage: 'Discovery', value: 9000000, owner: 'Grace Njeri', status: 'Stalled', closeDate: '2024-08-01' },
  { id: 4, name: 'Central Bank UPS', stage: 'Prospecting', value: 15000000, owner: 'John Kamau', status: 'Active', closeDate: '2024-08-15' },
  { id: 5, name: 'Diamond Trust Bank Solar', stage: 'Closed Won', value: 22000000, owner: 'Mary Wambui', status: 'Won', closeDate: '2024-06-01' },
];

// Mock data for team productivity drill-down
const teamProductivity = [
  { id: 1, name: 'Mary Wambui', role: 'Project Manager', productivity: 98, overdueTasks: 0, activeProjects: 4 },
  { id: 2, name: 'Peter Otieno', role: 'Engineer', productivity: 89, overdueTasks: 1, activeProjects: 3 },
  { id: 3, name: 'Grace Njeri', role: 'Sales Lead', productivity: 94, overdueTasks: 0, activeProjects: 2 },
  { id: 4, name: 'John Kamau', role: 'Engineer', productivity: 85, overdueTasks: 2, activeProjects: 2 },
];

// Add mock data for Engagements and Planner drill-downs
const engagementLogs = [
  { id: 1, type: 'Email', subject: 'Proposal Sent', contact: 'Mars Wrigley', owner: 'Peter Otieno', date: '2024-06-10', status: 'Delivered' },
  { id: 2, type: 'Call', subject: 'Follow-up Call', contact: 'Apex Steel', owner: 'Mary Wambui', date: '2024-06-09', status: 'Completed' },
  { id: 3, type: 'WhatsApp', subject: 'Project Update', contact: 'Parliament of Kenya', owner: 'Grace Njeri', date: '2024-06-08', status: 'Read' },
  { id: 4, type: 'Meeting', subject: 'Kickoff Meeting', contact: 'Central Bank', owner: 'John Kamau', date: '2024-06-07', status: 'Scheduled' },
];
const plannerTasks = [
  { id: 1, task: 'Prepare Proposal', owner: 'Mary Wambui', dueDate: '2024-06-12', status: 'In Progress', priority: 'High' },
  { id: 2, task: 'Client Meeting', owner: 'Peter Otieno', dueDate: '2024-06-13', status: 'Scheduled', priority: 'Medium' },
  { id: 3, task: 'Site Visit', owner: 'Grace Njeri', dueDate: '2024-06-14', status: 'Completed', priority: 'Low' },
  { id: 4, task: 'Send Invoice', owner: 'John Kamau', dueDate: '2024-06-15', status: 'Overdue', priority: 'High' },
];

// Add drill-downs for ALL remaining KPIs
const kpiDrillMap: Record<string, { label: string; columns: any[]; records: any[]; size?: string }> = {
  // Pipeline
  pipelineValue: {
    label: 'Pipeline Deals',
    columns: [
      { accessor: 'name', title: 'Deal Name', sortable: true },
      { accessor: 'stage', title: 'Stage', sortable: true },
      { accessor: 'value', title: 'Value', sortable: true, render: ({ value }) => `KSh ${value.toLocaleString()}` },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'status', title: 'Status', sortable: true },
      { accessor: 'closeDate', title: 'Close Date', sortable: true, render: ({ closeDate }) => new Date(closeDate).toLocaleDateString() },
    ],
    records: pipelineDeals,
    size: 'xl',
  },
  winRate: {
    label: 'Won Deals',
    columns: [
      { accessor: 'name', title: 'Deal Name', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'value', title: 'Value', sortable: true, render: ({ value }) => `KSh ${value.toLocaleString()}` },
      { accessor: 'closeDate', title: 'Close Date', sortable: true, render: ({ closeDate }) => new Date(closeDate).toLocaleDateString() },
    ],
    records: pipelineDeals.filter(d => d.status === 'Won'),
    size: 'lg',
  },
  conversionRate: {
    label: 'Lead Conversion Details',
    columns: [
      { accessor: 'name', title: 'Lead Name', sortable: true },
      { accessor: 'company', title: 'Company', sortable: true },
      { accessor: 'stage', title: 'Stage', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'createdDate', title: 'Created', sortable: true, render: ({ createdDate }) => new Date(createdDate).toLocaleDateString() },
      { accessor: 'convertedDate', title: 'Converted', sortable: true, render: ({ convertedDate }) => convertedDate ? new Date(convertedDate).toLocaleDateString() : 'Not converted' },
    ],
    records: [
      { id: 1, name: 'John Doe', company: 'Tech Corp', stage: 'Qualified', owner: 'Mary Wambui', createdDate: '2024-05-01', convertedDate: '2024-05-15' },
      { id: 2, name: 'Jane Smith', company: 'Innovation Ltd', stage: 'Proposal', owner: 'Peter Otieno', createdDate: '2024-05-05', convertedDate: null },
      { id: 3, name: 'Bob Johnson', company: 'Startup Inc', stage: 'Closed Won', owner: 'Grace Njeri', createdDate: '2024-05-10', convertedDate: '2024-05-25' },
    ],
    size: 'lg',
  },
  avgDealSize: {
    label: 'Deal Size Analysis',
    columns: [
      { accessor: 'name', title: 'Deal Name', sortable: true },
      { accessor: 'value', title: 'Value', sortable: true, render: ({ value }) => `KSh ${value.toLocaleString()}` },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'stage', title: 'Stage', sortable: true },
      { accessor: 'size', title: 'Size Category', sortable: true },
    ],
    records: [
      { id: 1, name: 'Large Project A', value: 50000000, owner: 'Mary Wambui', stage: 'Proposal', size: 'Large' },
      { id: 2, name: 'Medium Project B', value: 15000000, owner: 'Peter Otieno', stage: 'Negotiation', size: 'Medium' },
      { id: 3, name: 'Small Project C', value: 5000000, owner: 'Grace Njeri', stage: 'Closed Won', size: 'Small' },
    ],
    size: 'md',
  },
  forecastedRevenue: {
    label: 'Revenue Forecast Details',
    columns: [
      { accessor: 'name', title: 'Deal Name', sortable: true },
      { accessor: 'value', title: 'Value', sortable: true, render: ({ value }) => `KSh ${value.toLocaleString()}` },
      { accessor: 'probability', title: 'Probability', sortable: true, render: ({ probability }) => `${probability}%` },
      { accessor: 'forecastedValue', title: 'Forecasted', sortable: true, render: ({ forecastedValue }) => `KSh ${forecastedValue.toLocaleString()}` },
      { accessor: 'closeDate', title: 'Close Date', sortable: true, render: ({ closeDate }) => new Date(closeDate).toLocaleDateString() },
    ],
    records: [
      { id: 1, name: 'Project Alpha', value: 20000000, probability: 80, forecastedValue: 16000000, closeDate: '2024-07-15' },
      { id: 2, name: 'Project Beta', value: 15000000, probability: 60, forecastedValue: 9000000, closeDate: '2024-07-30' },
      { id: 3, name: 'Project Gamma', value: 10000000, probability: 90, forecastedValue: 9000000, closeDate: '2024-08-15' },
    ],
    size: 'lg',
  },
  // Engagements
  totalCommunications: {
    label: 'All Communications',
    columns: [
      { accessor: 'type', title: 'Type', sortable: true },
      { accessor: 'subject', title: 'Subject', sortable: true },
      { accessor: 'contact', title: 'Contact', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'date', title: 'Date', sortable: true, render: ({ date }) => new Date(date).toLocaleDateString() },
      { accessor: 'status', title: 'Status', sortable: true },
    ],
    records: engagementLogs,
    size: 'lg',
  },
  responseRate: {
    label: 'Response Rate Details',
    columns: [
      { accessor: 'type', title: 'Type', sortable: true },
      { accessor: 'contact', title: 'Contact', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'date', title: 'Date', sortable: true, render: ({ date }) => new Date(date).toLocaleDateString() },
      { accessor: 'status', title: 'Status', sortable: true },
    ],
    records: engagementLogs.filter(e => e.status === 'Delivered' || e.status === 'Read'),
    size: 'md',
  },
  avgResponseTime: {
    label: 'Response Time Analysis',
    columns: [
      { accessor: 'type', title: 'Type', sortable: true },
      { accessor: 'contact', title: 'Contact', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'sentTime', title: 'Sent', sortable: true, render: ({ sentTime }) => new Date(sentTime).toLocaleString() },
      { accessor: 'responseTime', title: 'Response', sortable: true, render: ({ responseTime }) => new Date(responseTime).toLocaleString() },
      { accessor: 'duration', title: 'Duration', sortable: true, render: ({ duration }) => `${duration}h` },
    ],
    records: [
      { id: 1, type: 'Email', contact: 'Client A', owner: 'Mary Wambui', sentTime: '2024-06-10T09:00:00', responseTime: '2024-06-10T11:30:00', duration: 2.5 },
      { id: 2, type: 'Call', contact: 'Client B', owner: 'Peter Otieno', sentTime: '2024-06-10T14:00:00', responseTime: '2024-06-10T14:15:00', duration: 0.25 },
      { id: 3, type: 'WhatsApp', contact: 'Client C', owner: 'Grace Njeri', sentTime: '2024-06-10T16:00:00', responseTime: '2024-06-10T18:30:00', duration: 2.5 },
    ],
    size: 'lg',
  },
  overdueFollowUps: {
    label: 'Overdue Follow-ups',
    columns: [
      { accessor: 'type', title: 'Type', sortable: true },
      { accessor: 'contact', title: 'Contact', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'dueDate', title: 'Due Date', sortable: true, render: ({ dueDate }) => new Date(dueDate).toLocaleDateString() },
      { accessor: 'daysOverdue', title: 'Days Overdue', sortable: true },
      { accessor: 'priority', title: 'Priority', sortable: true },
    ],
    records: [
      { id: 1, type: 'Email', contact: 'Client X', owner: 'Mary Wambui', dueDate: '2024-06-08', daysOverdue: 2, priority: 'High' },
      { id: 2, type: 'Call', contact: 'Client Y', owner: 'Peter Otieno', dueDate: '2024-06-07', daysOverdue: 3, priority: 'Medium' },
      { id: 3, type: 'Meeting', contact: 'Client Z', owner: 'Grace Njeri', dueDate: '2024-06-06', daysOverdue: 4, priority: 'High' },
    ],
    size: 'md',
  },
  lowEngagementClients: {
    label: 'Low Engagement Clients',
    columns: [
      { accessor: 'name', title: 'Client Name', sortable: true },
      { accessor: 'lastContact', title: 'Last Contact', sortable: true, render: ({ lastContact }) => new Date(lastContact).toLocaleDateString() },
      { accessor: 'daysSinceContact', title: 'Days Since Contact', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'engagementScore', title: 'Engagement Score', sortable: true, render: ({ engagementScore }) => `${engagementScore}%` },
    ],
    records: [
      { id: 1, name: 'Client Alpha', lastContact: '2024-05-20', daysSinceContact: 21, owner: 'Mary Wambui', engagementScore: 25 },
      { id: 2, name: 'Client Beta', lastContact: '2024-05-25', daysSinceContact: 16, owner: 'Peter Otieno', engagementScore: 30 },
      { id: 3, name: 'Client Gamma', lastContact: '2024-05-30', daysSinceContact: 11, owner: 'Grace Njeri', engagementScore: 35 },
    ],
    size: 'md',
  },
  // Planner
  keyMilestones: {
    label: 'Key Milestones',
    columns: [
      { accessor: 'task', title: 'Task', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'dueDate', title: 'Due Date', sortable: true, render: ({ dueDate }) => new Date(dueDate).toLocaleDateString() },
      { accessor: 'status', title: 'Status', sortable: true },
      { accessor: 'priority', title: 'Priority', sortable: true },
    ],
    records: plannerTasks,
    size: 'lg',
  },
  overdueTasks: {
    label: 'Overdue Tasks',
    columns: [
      { accessor: 'task', title: 'Task', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'dueDate', title: 'Due Date', sortable: true, render: ({ dueDate }) => new Date(dueDate).toLocaleDateString() },
      { accessor: 'priority', title: 'Priority', sortable: true },
    ],
    records: plannerTasks.filter(t => t.status === 'Overdue'),
    size: 'md',
  },
  upcomingMeetings: {
    label: 'Upcoming Meetings',
    columns: [
      { accessor: 'title', title: 'Meeting Title', sortable: true },
      { accessor: 'participants', title: 'Participants', sortable: true },
      { accessor: 'date', title: 'Date & Time', sortable: true, render: ({ date }) => new Date(date).toLocaleString() },
      { accessor: 'duration', title: 'Duration', sortable: true, render: ({ duration }) => `${duration} min` },
      { accessor: 'type', title: 'Type', sortable: true },
    ],
    records: [
      { id: 1, title: 'Client Kickoff', participants: 'Mary Wambui, Client Team', date: '2024-06-12T10:00:00', duration: 60, type: 'Client Meeting' },
      { id: 2, title: 'Project Review', participants: 'Peter Otieno, Engineering Team', date: '2024-06-13T14:00:00', duration: 90, type: 'Internal' },
      { id: 3, title: 'Proposal Presentation', participants: 'Grace Njeri, Client', date: '2024-06-14T11:00:00', duration: 120, type: 'Client Meeting' },
    ],
    size: 'lg',
  },
  resourceUtilization: {
    label: 'Resource Utilization',
    columns: [
      { accessor: 'name', title: 'Employee', sortable: true },
      { accessor: 'role', title: 'Role', sortable: true },
      { accessor: 'utilization', title: 'Utilization', sortable: true, render: ({ utilization }) => `${utilization}%` },
      { accessor: 'activeProjects', title: 'Active Projects', sortable: true },
      { accessor: 'availableHours', title: 'Available Hours', sortable: true },
    ],
    records: [
      { id: 1, name: 'Mary Wambui', role: 'Project Manager', utilization: 85, activeProjects: 4, availableHours: 15 },
      { id: 2, name: 'Peter Otieno', role: 'Engineer', utilization: 92, activeProjects: 3, availableHours: 8 },
      { id: 3, name: 'Grace Njeri', role: 'Sales Lead', utilization: 78, activeProjects: 2, availableHours: 22 },
    ],
    size: 'md',
  },
  bottlenecks: {
    label: 'Bottlenecks & Blockers',
    columns: [
      { accessor: 'issue', title: 'Issue', sortable: true },
      { accessor: 'project', title: 'Project', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'priority', title: 'Priority', sortable: true },
      { accessor: 'status', title: 'Status', sortable: true },
      { accessor: 'createdDate', title: 'Created', sortable: true, render: ({ createdDate }) => new Date(createdDate).toLocaleDateString() },
    ],
    records: [
      { id: 1, issue: 'Pending Client Approval', project: 'Project Alpha', owner: 'Mary Wambui', priority: 'High', status: 'Blocked', createdDate: '2024-06-05' },
      { id: 2, issue: 'Resource Shortage', project: 'Project Beta', owner: 'Peter Otieno', priority: 'Medium', status: 'In Progress', createdDate: '2024-06-08' },
    ],
    size: 'md',
  },
  teamProductivity: {
    label: 'Team Productivity Details',
    columns: [
      { accessor: 'name', title: 'Employee', sortable: true },
      { accessor: 'role', title: 'Role', sortable: true },
      { accessor: 'productivity', title: 'Productivity (%)', sortable: true },
      { accessor: 'overdueTasks', title: 'Overdue Tasks', sortable: true },
      { accessor: 'activeProjects', title: 'Active Projects', sortable: true },
    ],
    records: teamProductivity,
    size: 'lg',
  },
  alerts: {
    label: 'Alerts Details',
    columns: [
      { accessor: 'type', title: 'Type', sortable: true },
      { accessor: 'message', title: 'Message', sortable: true },
      { accessor: 'entity', title: 'Related Entity', sortable: true },
      { accessor: 'owner', title: 'Owner', sortable: true },
      { accessor: 'date', title: 'Date', sortable: true, render: ({ date }) => new Date(date).toLocaleDateString() },
      { accessor: 'status', title: 'Status', sortable: true },
      { accessor: 'priority', title: 'Priority', sortable: true },
    ],
    records: [
      { id: 1, type: 'Deal', message: '3 deals are at risk due to inactivity over 14 days.', entity: 'Apex Steel Switchgear', owner: 'Mary Wambui', date: '2024-06-10', status: 'At Risk', priority: 'High' },
      { id: 2, type: 'Task', message: '5 tasks are overdue. Review Planner for details.', entity: 'Planner', owner: 'Peter Otieno', date: '2024-06-09', status: 'Overdue', priority: 'Medium' },
      { id: 3, type: 'Engagement', message: 'Engagement with Mars Wrigley East Africa is below average.', entity: 'Mars Wrigley East Africa', owner: 'Grace Njeri', date: '2024-06-08', status: 'Low Engagement', priority: 'Low' },
    ],
    size: 'lg',
  },
};

// Update KPI maps to include ALL KPIs
const pipelineKpiMap = {
  'Total Pipeline Value': 'pipelineValue',
  'Win Rate': 'winRate',
  'Conversion Rate': 'conversionRate',
  'Avg Deal Size': 'avgDealSize',
  'Forecasted Revenue': 'forecastedRevenue',
};
const engagementKpiMap = {
  'Total Communications': 'totalCommunications',
  'Response Rate': 'responseRate',
  'Avg Response Time': 'avgResponseTime',
  'Overdue Follow-ups': 'overdueFollowUps',
  'Low Engagement Clients': 'lowEngagementClients',
};
const plannerKpiMap = {
  'Key Milestones': 'keyMilestones',
  'Overdue Tasks': 'overdueTasks',
  'Upcoming Meetings': 'upcomingMeetings',
  'Resource Utilization': 'resourceUtilization',
  'Bottlenecks': 'bottlenecks',
  'Team Productivity': 'teamProductivity',
};

// 1. Add mock data for report builder sources
const reportBuilderSources = {
  Deals: pipelineDeals,
  Activities: [
    { id: 1, subject: 'Follow-up call', type: 'Call', owner: 'Mary Wambui', status: 'Completed', date: '2024-06-10' },
    { id: 2, subject: 'Proposal sent', type: 'Email', owner: 'Peter Otieno', status: 'Pending', date: '2024-06-09' },
    { id: 3, subject: 'Site visit', type: 'Meeting', owner: 'Grace Njeri', status: 'Scheduled', date: '2024-06-08' },
  ],
  Clients: [
    { id: 1, name: 'Apex Steel Ltd', owner: 'Mary Wambui', industry: 'Manufacturing', status: 'Active', lastContact: '2024-06-10' },
    { id: 2, name: 'Mars Wrigley', owner: 'Peter Otieno', industry: 'FMCG', status: 'Low Engagement', lastContact: '2024-06-08' },
    { id: 3, name: 'Parliament of Kenya', owner: 'Grace Njeri', industry: 'Government', status: 'Active', lastContact: '2024-06-07' },
  ],
};
const reportBuilderColumns = {
  Deals: [
    { accessor: 'name', title: 'Deal Name', sortable: true },
    { accessor: 'stage', title: 'Stage', sortable: true },
    { accessor: 'value', title: 'Value', sortable: true, render: ({ value }) => `KSh ${value.toLocaleString()}` },
    { accessor: 'owner', title: 'Owner', sortable: true },
    { accessor: 'status', title: 'Status', sortable: true },
    { accessor: 'closeDate', title: 'Close Date', sortable: true, render: ({ closeDate }) => new Date(closeDate).toLocaleDateString() },
  ],
  Activities: [
    { accessor: 'subject', title: 'Subject', sortable: true },
    { accessor: 'type', title: 'Type', sortable: true },
    { accessor: 'owner', title: 'Owner', sortable: true },
    { accessor: 'status', title: 'Status', sortable: true },
    { accessor: 'date', title: 'Date', sortable: true, render: ({ date }) => new Date(date).toLocaleDateString() },
  ],
  Clients: [
    { accessor: 'name', title: 'Client Name', sortable: true },
    { accessor: 'owner', title: 'Owner', sortable: true },
    { accessor: 'industry', title: 'Industry', sortable: true },
    { accessor: 'status', title: 'Status', sortable: true },
    { accessor: 'lastContact', title: 'Last Contact', sortable: true, render: ({ lastContact }) => new Date(lastContact).toLocaleDateString() },
  ],
};

// 2. Add mock data for pipeline trends
const pipelineTrendData = [
  { date: '2024-05-01', value: 60000000 },
  { date: '2024-05-15', value: 80000000 },
  { date: '2024-06-01', value: 100000000 },
  { date: '2024-06-15', value: 125000000 },
];

export default function CRMExecutiveDashboard() {
  const [tab, setTab] = useState('pipeline');
  const [drillDown, setDrillDown] = useState<{ key: string; label: string; alertIdx?: number } | null>(null);
  // Dashboard-level filters
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  // In CRMExecutiveDashboard, add state for report builder
  const [reportSource, setReportSource] = useState<'Deals' | 'Activities' | 'Clients'>('Deals');
  const [reportColumns, setReportColumns] = useState<string[]>(reportBuilderColumns['Deals'].map(c => c.accessor));
  const [reportOwner, setReportOwner] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState<string | null>(null);

  // Helper to render KPI cards
  const renderKPICards = (kpis: any[], kpiMap: Record<string, DrillKey>) => (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md" mb="md">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const drillKey = kpiMap[kpi.label];
        const clickable = !!drillKey;
        return (
          <Card
            key={kpi.label}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={clickable ? { cursor: 'pointer', borderColor: 'var(--mantine-primary-color-light)' } : {}}
            onClick={clickable ? () => setDrillDown({ key: drillKey, label: kpi.label }) : undefined}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Icon size={28} color={kpi.trend === 'up' ? 'green' : kpi.trend === 'down' ? 'red' : 'gray'} />
                <Text fw={700} size="lg">{kpi.value}</Text>
              </Group>
              <Badge color={kpi.trend === 'up' ? 'green' : kpi.trend === 'down' ? 'red' : 'gray'} variant="light">
                {kpi.trend === 'up' ? <IconTrendingUp size={16} /> : kpi.trend === 'down' ? <IconTrendingDown size={16} /> : null}
                {Math.abs(kpi.change)}%
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mt={8}>{kpi.label}</Text>
          </Card>
        );
      })}
    </SimpleGrid>
  );

  // Helper to render smart alerts
  const renderAlerts = () => (
    <Stack mb="md">
      {alerts.map((alert, idx) => (
        <Alert
          key={idx}
          color={alert.type === 'danger' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}
          icon={<IconAlertCircle size={18} />}
          radius="md"
          variant="light"
          style={{ cursor: 'pointer' }}
          onClick={() => setDrillDown({ key: 'alerts', label: 'Alerts', alertIdx: idx })}
        >
          {alert.message}
        </Alert>
      ))}
    </Stack>
  );

  // Placeholder for trend charts and drill-downs
  const renderTrends = (label: string) => {
    if (label === 'Pipeline') {
      return (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={600}>Pipeline Value Trends</Text>
          </Group>
          <Box h={220} style={{ background: 'var(--mantine-color-gray-1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Simple SVG line chart */}
            <svg width="90%" height="180" viewBox="0 0 400 180">
              <polyline
                fill="none"
                stroke="#1971c2"
                strokeWidth="3"
                points="0,160 100,120 200,80 300,40"
              />
              {/* Dots */}
              {pipelineTrendData.map((d, i) => (
                <circle key={i} cx={i*100} cy={160 - (d.value-60000000)/20000000*40} r="6" fill="#1971c2" />
              ))}
              {/* Labels */}
              {pipelineTrendData.map((d, i) => (
                <text key={i} x={i*100} y={170} fontSize="12" textAnchor="middle">{new Date(d.date).toLocaleDateString()}</text>
              ))}
              {pipelineTrendData.map((d, i) => (
                <text key={i} x={i*100} y={160 - (d.value-60000000)/20000000*40 - 10} fontSize="12" textAnchor="middle">{`KSh ${(d.value/1000000).toFixed(0)}M`}</text>
              ))}
            </svg>
          </Box>
        </Card>
      );
    }
    // ... fallback for other trends ...
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group justify="space-between" align="center" mb="xs">
          <Text fw={600}>{label} Trends</Text>
          <Button size="xs" leftSection={<IconFilter size={16} />} variant="light">Filter</Button>
        </Group>
        <Box h={180} style={{ background: 'var(--mantine-color-gray-1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text c="dimmed">[Trend Chart Placeholder]</Text>
        </Box>
      </Card>
    );
  };

  // Replace renderCustomReportBuilder with interactive builder
  const renderCustomReportBuilder = () => {
    // Ensure reportColumns is always an array
    const safeReportColumns = Array.isArray(reportColumns) ? reportColumns : [];
    const columns = reportBuilderColumns[reportSource].filter(c => safeReportColumns.includes(c.accessor));
    let records = reportBuilderSources[reportSource];
    if (reportOwner) records = records.filter((r: any) => r.owner === reportOwner);
    if (reportStatus) records = records.filter((r: any) => r.status === reportStatus);
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center" mb="xs">
          <Text fw={600}>Custom Report Builder</Text>
          <Group gap="xs">
            <Button size="xs" leftSection={<IconDownload size={16} />} variant="light">Export</Button>
            <Button size="xs" leftSection={<IconPrinter size={16} />} variant="light">Print</Button>
            <Button size="xs" leftSection={<IconShare size={16} />} variant="light">Share</Button>
          </Group>
        </Group>
        <Group gap="md" mb="sm">
          <Select
            label="Data Source"
            data={['Deals', 'Activities', 'Clients']}
            value={reportSource}
            onChange={v => {
              setReportSource(v as any);
              setReportColumns(reportBuilderColumns[v as 'Deals' | 'Activities' | 'Clients'].map(c => c.accessor));
              setReportOwner(null);
              setReportStatus(null);
            }}
            maw={160}
          />
          <MultiSelect
            label="Columns"
            data={reportBuilderColumns[reportSource].map(c => ({ value: c.accessor, label: c.title }))}
            value={safeReportColumns}
            onChange={setReportColumns}
            maw={220}
          />
          <Select
            label="Owner"
            data={[...new Set(reportBuilderSources[reportSource].map((r: any) => r.owner))]}
            value={reportOwner}
            onChange={setReportOwner}
            maw={160}
            clearable
          />
          <Select
            label="Status"
            data={[...new Set(reportBuilderSources[reportSource].map((r: any) => r.status))]}
            value={reportStatus}
            onChange={setReportStatus}
            maw={160}
            clearable
          />
        </Group>
        <DataTable
          className="mantine-DataTable-root"
          columns={columns}
          records={records}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={180}
          idAccessor="id"
        />
      </Card>
    );
  };

  // Drill-down modal content
  const renderDrillDownModal = () => {
    if (!drillDown) return null;
    let drill = kpiDrillMap[drillDown.key];
    if (!drill) return null;
    let records = drill.records;
    let columns = drill.columns;
    // Context-sensitive filtering for alerts
    if (drillDown.key === 'alerts' && typeof drillDown.alertIdx === 'number') {
      const alert = alerts[drillDown.alertIdx];
      if (alert) {
        if (alert.type === 'danger') {
          // Show only deals at risk, use pipeline columns
          records = kpiDrillMap.pipelineValue.records.filter((d: any) => d.status === 'At Risk');
          columns = kpiDrillMap.pipelineValue.columns;
        } else if (alert.type === 'warning') {
          // Show only overdue tasks, use overdueTasks columns
          records = kpiDrillMap.overdueTasks.records;
          columns = kpiDrillMap.overdueTasks.columns;
        } else if (alert.type === 'info') {
          // Show only low engagement clients, use lowEngagementClients columns
          records = kpiDrillMap.lowEngagementClients.records;
          columns = kpiDrillMap.lowEngagementClients.columns;
        }
      }
    }
    const actionBar = (
      <Group mb="md" gap="xs">
        <Button size="xs" leftSection={<IconDownload size={16} />} variant="light">Download</Button>
        <Button size="xs" leftSection={<IconPrinter size={16} />} variant="light">Print</Button>
        <Button size="xs" leftSection={<IconShare size={16} />} variant="light">Share</Button>
      </Group>
    );
    return (
      <Modal opened onClose={() => setDrillDown(null)} title={drill.label} size={drill.size || 'md'} centered>
        {actionBar}
        <DataTable
          className="mantine-DataTable-root"
          columns={columns}
          records={records}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={250}
          idAccessor="id"
        />
      </Modal>
    );
  };

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="md" fw={900} tt="uppercase" c="blue.8">Executive CRM Dashboard</Title>
      {/* Dashboard-level filter bar */}
      <Card withBorder shadow="sm" radius="md" mb="md" p="md">
        <Group gap="md" wrap="wrap">
          <Select
            label="Date Range"
            placeholder="Select range"
            data={[
              { value: '7days', label: 'Last 7 days' },
              { value: '30days', label: 'Last 30 days' },
              { value: '90days', label: 'Last 90 days' },
              { value: 'thismonth', label: 'This month' },
              { value: 'lastmonth', label: 'Last month' },
              { value: 'thisquarter', label: 'This quarter' },
              { value: 'lastquarter', label: 'Last quarter' },
            ]}
            value={dateRange}
            onChange={setDateRange}
            clearable
            maw={180}
          />
          <Select
            label="Project Type"
            placeholder="All types"
            data={['All', 'Maintenance', 'Installation', 'Retrofit', 'Solar', 'Consulting']}
            value={projectType}
            onChange={setProjectType}
            maw={180}
            clearable
          />
          <Select
            label="Owner"
            placeholder="All owners"
            data={['All', 'Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau']}
            value={owner}
            onChange={setOwner}
            maw={180}
            clearable
          />
          <Select
            label="Status"
            placeholder="All statuses"
            data={['All', 'Active', 'At Risk', 'Stalled', 'Won', 'Lost']}
            value={status}
            onChange={setStatus}
            maw={160}
            clearable
          />
        </Group>
        {/* Show selected filters for demo */}
        <Group gap="xs" mt="sm">
          <Text size="xs" c="dimmed">Filters:</Text>
          <Text size="xs">{dateRange ? dateRange : 'Any'}</Text>
          <Text size="xs">| Project: {projectType || 'All'}</Text>
          <Text size="xs">| Owner: {owner || 'All'}</Text>
          <Text size="xs">| Status: {status || 'All'}</Text>
        </Group>
      </Card>
      <Tabs value={tab} onChange={setTab} variant="pills" radius="md" mb="md">
        <Tabs.List grow>
          <Tabs.Tab value="pipeline" leftSection={<IconChartBar size={18} />}>Pipeline</Tabs.Tab>
          <Tabs.Tab value="engagements" leftSection={<IconMail size={18} />}>Engagements</Tabs.Tab>
          <Tabs.Tab value="planner" leftSection={<IconCalendar size={18} />}>Planner</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="pipeline" pt="md">
          {renderKPICards(pipelineKPIs, pipelineKpiMap)}
          {renderAlerts()}
          {renderTrends('Pipeline')}
          {renderCustomReportBuilder()}
        </Tabs.Panel>
        <Tabs.Panel value="engagements" pt="md">
          {renderKPICards(engagementKPIs, engagementKpiMap)}
          {renderAlerts()}
          {renderTrends('Engagements')}
          {renderCustomReportBuilder()}
        </Tabs.Panel>
        <Tabs.Panel value="planner" pt="md">
          {renderKPICards(plannerKPIs, plannerKpiMap)}
          {renderAlerts()}
          {renderTrends('Planner')}
          {renderCustomReportBuilder()}
        </Tabs.Panel>
      </Tabs>
      {renderDrillDownModal()}
    </Container>
  );
} 