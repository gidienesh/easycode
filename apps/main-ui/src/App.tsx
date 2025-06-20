import React from 'react';
import { TenantThemeProvider } from '@easycode/ui-library';
import TenantDemo from './pages/tenant-demo';

function App() {
    return (
        <TenantThemeProvider initialTenantId="default">
            <TenantDemo />
        </TenantThemeProvider>
    );
}

export default App;
