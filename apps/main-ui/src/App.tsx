import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { EasyCodeProvider } from '@easycode/ui-library';

function App() {
    return (
        <MantineProvider>
            <Notifications />
            <EasyCodeProvider>
                {/* Next.js will handle the routing and layout */}
                <div>Loading...</div>
            </EasyCodeProvider>
        </MantineProvider>
    );
}

export default App;
