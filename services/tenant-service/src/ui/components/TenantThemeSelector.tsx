import React from 'react';
import { Card, Title, Text, Group, Button, ColorSwatch, Stack } from '@mantine/core';
import { useTenantTheme, tenantThemes, type TenantTheme } from '@easycode/ui-library';

interface TenantThemeSelectorProps {
  onThemeSelect?: (theme: TenantTheme) => void;
}

export function TenantThemeSelector({ onThemeSelect }: TenantThemeSelectorProps) {
  const { currentTheme, setTenantId } = useTenantTheme();

  const handleThemeSelect = (tenantId: string) => {
    setTenantId(tenantId);
    const theme = tenantThemes[tenantId];
    onThemeSelect?.(theme);
  };

  return (
    <Card withBorder p="md">
      <Title order={3} mb="md">Select Tenant Theme</Title>
      <Text size="sm" color="dimmed" mb="lg">
        Current theme: {currentTheme.name}
      </Text>
      
      <Stack gap="sm">
        {Object.entries(tenantThemes).map(([tenantId, theme]) => (
          <Group key={tenantId} justify="space-between" p="xs" style={{ 
            border: currentTheme.id === tenantId ? '2px solid var(--mantine-color-primary-6)' : '1px solid var(--mantine-color-gray-3)',
            borderRadius: '8px',
            backgroundColor: currentTheme.id === tenantId ? 'var(--mantine-color-primary-0)' : 'transparent'
          }}>
            <Group>
              <ColorSwatch color={theme.customColors?.brand?.[5] || theme.primaryColor} size={24} />
              <div>
                <Text fw={500}>{theme.name}</Text>
                <Text size="xs" color="dimmed">
                  {theme.colorScheme} • {theme.primaryColor}
                </Text>
              </div>
            </Group>
            <Button 
              size="xs" 
              variant={currentTheme.id === tenantId ? "filled" : "outline"}
              onClick={() => handleThemeSelect(tenantId)}
            >
              {currentTheme.id === tenantId ? 'Active' : 'Select'}
            </Button>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

// Example usage in any service
export function TenantThemeDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <Title order={1} mb="xl">Tenant Theme System Demo</Title>
      <TenantThemeSelector 
        onThemeSelect={(theme) => {
          console.log('Theme selected:', theme);
          // You can save this to your tenant service backend
        }}
      />
    </div>
  );
} 