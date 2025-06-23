import React from 'react';
import { AppLayout } from '../src/components/AppLayout';
import { SettingsPage } from '../src/pages/SettingsPage';

export default function SettingsPageWrapper() {
  return (
    <AppLayout>
      <SettingsPage />
    </AppLayout>
  );
} 