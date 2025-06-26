import React from 'react';
import { Container, Title, Text, Card } from '@mantine/core';

export default function ProjectFilesPage() {
  return (
    <Container size="xl" py="md">
      <Title order={2} mb="xs">File Management</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Upload, organize, and share project files and documents
      </Text>
      
      <Card withBorder p="xl">
        <Text ta="center" c="dimmed" size="lg">
          File Management - Coming Soon
        </Text>
        <Text ta="center" c="dimmed" size="sm" mt="xs">
          Secure file storage with version control and collaboration features.
        </Text>
      </Card>
    </Container>
  );
} 