import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { CrmPage } from '../../src/pages/CrmPage';

export default function CrmPageWrapper() {
  return (
    <AppLayout>
      <CrmPage />
    </AppLayout>
  );
} 