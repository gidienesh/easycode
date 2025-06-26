import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EasyCodeProvider } from './lib/EasyCodeProvider';
import { AppLayout } from './components/AppLayout';
import { DynamicDashboard } from './components/DynamicDashboard';

// Page imports
import CrmPage from './pages/CrmPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <EasyCodeProvider>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<DynamicDashboard />} />
                        <Route path="/dashboard" element={<DynamicDashboard />} />
                        <Route path="/crm/*" element={<CrmPage />} />
                        <Route path="/finance/*" element={<FinancePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </AppLayout>
            </Router>
        </EasyCodeProvider>
    );
}

export default App;
