import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppLayout } from '../../src/components/AppLayout';

export default function CrmPageWrapper() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Activity Feed by default
    if (router.pathname === '/crm') {
      router.replace('/crm/activity-feed');
    }
  }, [router]);

  return (
    <AppLayout>
      <div>Redirecting to Activity Feed...</div>
    </AppLayout>
  );
} 