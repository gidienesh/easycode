// src/app/page.tsx
import React from 'react';
import Card from '@/components/ui/Card'; // Adjust path based on your alias setup
import Button from '@/components/ui/Button'; // Assuming Button might be used
// import { mockData } from '@/lib/mockData'; // We can use this later if needed

const pageContainerStyle: React.CSSProperties = {
  // maxWidth: '1200px',
  // margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #eee',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

export default function HomePage() {
  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <h1>Welcome to the Finance Microservice Dashboard</h1>
        <p>This is a demonstration of the UI capabilities for the finance service modules.</p>
      </header>

      <section>
        <h2>Overview</h2>
        <div style={gridStyle}>
          <Card title="Key Metric 1">
            <p>Placeholder for a key financial metric (e.g., Total Revenue).</p>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>$123,456</p>
            <Button onClick={() => alert('View Details Clicked!')} style={{marginTop: '10px'}}>View Details</Button>
          </Card>

          <Card title="Recent Activity">
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ padding: '5px 0', borderBottom: '1px dashed #eee' }}>Posted Journal Entry #JE1023</li>
              <li style={{ padding: '5px 0', borderBottom: '1px dashed #eee' }}>New Vendor "Supply Co" added</li>
              <li style={{ padding: '5px 0' }}>Generated Trial Balance Report</li>
            </ul>
          </Card>

          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button variant="primary">New Journal Entry</Button>
              <Button variant="secondary">View Chart of Accounts</Button>
              <Button variant="secondary">Generate Report</Button>
            </div>
          </Card>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>System Status</h2>
        <Card>
          <p>All systems operational.</p>
          <p><small>Last checked: {new Date().toLocaleTimeString()}</small></p>
        </Card>
      </section>
    </div>
  );
}
