import React from 'react';
import { MantineProvider, NotificationsProvider } from '@mantine/core';
import { easyCodeTheme } from '../theme/easyCodeTheme';

interface EasyCodeProviderProps {
    children: React.ReactNode;
    theme?: any;
}

export const EasyCodeProvider: React.FC<EasyCodeProviderProps> = ({
    children,
    theme = easyCodeTheme
}) => {
    return (
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
                {children}
            </NotificationsProvider>
        </MantineProvider>
    );
};
