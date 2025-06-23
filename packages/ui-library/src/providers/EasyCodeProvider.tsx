import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
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
        <MantineProvider theme={theme}>
            <Notifications />
            {children}
        </MantineProvider>
    );
};
