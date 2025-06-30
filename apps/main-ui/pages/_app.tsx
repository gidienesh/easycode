import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { EasyCodeProvider, TenantThemeProvider } from '@easycode/ui-library';
import { AppLayout } from '../src/components/AppLayout';
import '@mantine/core/styles.css';
import '../styles/globals.css';
import '../styles/components.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Pages that should not have the AppLayout (dashboard structure)
  const pagesWithoutLayout = ['/login'];
  const shouldShowLayout = !pagesWithoutLayout.includes(router.pathname);

  return (
    <MantineProvider>
      <Notifications />
      <EasyCodeProvider>
        <TenantThemeProvider 
          initialTenantId="default"
          onThemeChange={(tenantId, theme) => {
            console.log('Theme changed:', tenantId, theme);
          }}
        >
          {shouldShowLayout ? (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </TenantThemeProvider>
      </EasyCodeProvider>
    </MantineProvider>
  );
}