import React from 'react';
import { Container, Title, Text, Button, Group } from '@mantine/core';

export default function TestCSSPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" className="text-center">
        CSS Test Page
      </Title>
      
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">CSS Custom Properties Test</h2>
        </div>
        <div className="card-content">
          <p>This page tests that all CSS custom properties are working correctly.</p>
          
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 auto var(--space-2) auto'
                }}
              ></div>
              <span className="text-sm">Primary</span>
            </div>
            <div className="text-center">
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--success-color)',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 auto var(--space-2) auto'
                }}
              ></div>
              <span className="text-sm">Success</span>
            </div>
            <div className="text-center">
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--warning-color)',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 auto var(--space-2) auto'
                }}
              ></div>
              <span className="text-sm">Warning</span>
            </div>
            <div className="text-center">
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--error-color)',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 auto var(--space-2) auto'
                }}
              ></div>
              <span className="text-sm">Error</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Component Classes Test</h2>
        </div>
        <div className="card-content">
          <p>Testing CSS utility classes and component styles.</p>
          
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-success">Success Button</button>
            <button className="btn btn-danger">Danger Button</button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-error">Error</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Mantine Components Test</h2>
        </div>
        <div className="card-content">
          <p>Testing Mantine components integration.</p>
          
          <Group mt="md">
            <Button variant="filled" color="blue">Mantine Primary</Button>
            <Button variant="outline">Mantine Secondary</Button>
            <Button variant="filled" color="red">Mantine Danger</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
} 