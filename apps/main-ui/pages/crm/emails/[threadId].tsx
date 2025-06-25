import React from 'react';
import { Container, Title, Stack } from '@mantine/core';
import CollaborativeEmailThread from '../../src/components/CollaborativeEmailThread';

export default function EmailThreadPage() {
  return (
    <Container size="md" py="md">
      <Title order={2} mb="md" fw={900} tt="uppercase" c="blue.8">Collaborative Email Thread</Title>
      <Stack>
        <CollaborativeEmailThread />
      </Stack>
    </Container>
  );
} 