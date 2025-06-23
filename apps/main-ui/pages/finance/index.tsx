import React from 'react';
import { AppLayout } from '../../src/components/AppLayout';
import { FinancePage } from '../../src/pages/FinancePage';

export default function FinancePageWrapper() {
  return (
    <AppLayout>
      <FinancePage />
    </AppLayout>
  );
} 