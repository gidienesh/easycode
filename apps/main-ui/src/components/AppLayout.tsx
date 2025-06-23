import React, { useState } from 'react';
import { AppShell } from '@mantine/core';
import { TenantProvider } from '../providers/TenantProvider';
import { UserProvider } from '../providers/UserProvider';
import { TenantNavigation, MobileHeader } from './TenantNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [navOpened, setNavOpened] = useState(false);

  return (
    <TenantProvider>
      <UserProvider>
        <AppShell
          navbar={{
            width: { base: 300 },
            breakpoint: 'sm',
            collapsed: { mobile: !navOpened }
          }}
          header={{
            height: 60
          }}
          padding="md"
        >
          <AppShell.Header>
            <MobileHeader 
              opened={navOpened} 
              onToggle={() => setNavOpened(!navOpened)} 
            />
          </AppShell.Header>
          
          <AppShell.Navbar>
            <TenantNavigation 
              opened={navOpened} 
              onToggle={() => setNavOpened(!navOpened)} 
            />
          </AppShell.Navbar>

          <AppShell.Main>
            {children}
          </AppShell.Main>
        </AppShell>
      </UserProvider>
    </TenantProvider>
  );
} 