import React from 'react';
import { Container, Title, Text, Card } from '@mantine/core';

export default function ProjectGanttPage() {
  return (
    <Container size="xl" py="md">
      <Title order={2} mb="xs">Gantt Charts</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Visual project scheduling and dependency management
      </Text>
      
      <Card withBorder p="xl">
        <Text ta="center" c="dimmed" size="lg">
          Gantt Chart View - Coming Soon
        </Text>
        <Text ta="center" c="dimmed" size="sm" mt="xs">
          Advanced Gantt chart with dependencies and resource allocation visualization.
        </Text>
      </Card>
    </Container>
  );
} 