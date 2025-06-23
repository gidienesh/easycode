import React from 'react';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { EasyCodeProvider, TenantThemeProvider } from '@easycode/ui-library';
import { AppLayout } from '../src/components/AppLayout';
import '@mantine/core/styles.css';
import '../styles/globals.css';
import '../styles/components.css';

export default function App({ Component, pageProps }: AppProps) {
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
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </TenantThemeProvider>
      </EasyCodeProvider>
    </MantineProvider>
  );
} 