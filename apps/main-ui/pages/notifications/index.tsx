import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { Card, Text, Stack } from '@mantine/core';
import { IconNotification } from '@tabler/icons-react';

export default function NotificationPage() {
  return (
    <AppLayout>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <IconNotification size="1.5rem" style={{ marginRight: '0.5rem' }} />
            Notifications
          </h1>
        </div>
        
        <Stack spacing="lg">
          <Card className="card">
            <div className="card-header">
              <h2 className="card-title">Notifications Overview</h2>
            </div>
            <div className="card-content">
              <Text color="dimmed">Notification management will be displayed here</Text>
            </div>
          </Card>
        </Stack>
      </div>
    </AppLayout>
  );
} 