import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { UserManagementPage } from '../../src/pages/UserManagementPage';

export default function UsersPage() {
  return (
    <AppLayout>
      <UserManagementPage />
    </AppLayout>
  );
} 