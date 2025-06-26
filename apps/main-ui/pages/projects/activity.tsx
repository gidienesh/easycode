import React from 'react';
import { Container, Title, Text, Card } from '@mantine/core';

export default function ProjectActivityPage() {
  return (
    <Container size="xl" py="md">
      <Title order={2} mb="xs">Activity Feed</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Real-time activity feed of all project events and updates
      </Text>
      
      <Card withBorder p="xl">
        <Text ta="center" c="dimmed" size="lg">
          Activity Feed - Coming Soon
        </Text>
        <Text ta="center" c="dimmed" size="sm" mt="xs">
          Live activity stream with filters and real-time notifications.
        </Text>
      </Card>
    </Container>
  );
} 