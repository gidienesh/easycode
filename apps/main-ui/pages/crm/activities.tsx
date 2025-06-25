import React, { useState } from 'react';
import { Group, Grid, Card, Text, Badge, Stack, ActionIcon } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconTable, IconLayoutGrid, IconPhone, IconMail, IconMessage } from '@tabler/icons-react';
import { activities } from '../../src/utils/crmMockData';

export default function CRMActivitiesPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');

  const columns = [
    { accessor: 'subject', title: 'Subject', sortable: true },
    { accessor: 'type', title: 'Type', sortable: true, filter: 'select', filterOptions: ['Call', 'Email', 'Meeting'] },
    { accessor: 'relatedTo', title: 'Related To', sortable: true },
    { accessor: 'dueDate', title: 'Due Date', sortable: true, render: (row) => new Date(row.dueDate).toLocaleDateString() },
    { accessor: 'status', title: 'Status', sortable: true, filter: 'select', filterOptions: ['Open', 'Completed'] },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <IconPhone size={16} />;
      case 'Email': return <IconMail size={16} />;
      case 'Meeting': return <IconMessage size={16} />;
      default: return null;
    }
  };

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={700}>Activities</Text>
        <Group>
          <ActionIcon
            variant={view === 'table' ? 'filled' : 'light'}
            onClick={() => setView('table')}
            aria-label="Table view"
          >
            <IconTable size={20} />
          </ActionIcon>
          <ActionIcon
            variant={view === 'grid' ? 'filled' : 'light'}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <IconLayoutGrid size={20} />
          </ActionIcon>
        </Group>
      </Group>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          records={activities}
          withColumnResizing
          withColumnReordering
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={300}
          idAccessor="id"
        />
      ) : (
        <Grid gutter="md">
          {activities.map((activity) => (
            <Grid.Col key={activity.id} xs={12} sm={6} md={4} lg={3}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Text fw={600}>{activity.subject}</Text>
                  <Badge 
                    color={activity.status === 'Completed' ? 'green' : 'blue'}
                    variant="light"
                  >
                    {activity.status}
                  </Badge>
                </Group>
                <Group gap="xs" mt={4} align="center">
                  {getTypeIcon(activity.type)}
                  <Text size="sm" c="dimmed">{activity.type}</Text>
                </Group>
                <Text size="sm" mt={8}>Related to: {activity.relatedTo}</Text>
                <Text size="xs" c="dimmed" mt={8}>Due: {new Date(activity.dueDate).toLocaleDateString()}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
} 