import React from 'react';
import { Container, Paper, Stack, Title, Text, Button, Card } from '@mantine/core';
import { mockTenantService, mockTenantData } from '../../utils/tenantServiceMocks';

export default function TenantServiceTest() {
    const [tenantData, setTenantData] = React.useState(mockTenantData);
    const [loading, setLoading] = React.useState(false);

    const handleTestAPI = async () => {
        setLoading(true);
        try {
            const result = await mockTenantService.getTenantData('test-tenant');
            console.log('API Test Result:', result);
            alert('API test completed! Check console for details.');
        } catch (error) {
            console.error('API Test Error:', error);
            alert('API test failed! Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Title order={1}>Tenant Service Test</Title>
                
                <Card withBorder p="md">
                    <Stack gap="md">
                        <Title order={2}>Mock Tenant Data</Title>
                        <Text>Tenant ID: {tenantData.tenantId}</Text>
                        <Text>Features: {tenantData.features.length}</Text>
                        <Text>Quotation: ${tenantData.quotation.total} {tenantData.quotation.currency}</Text>
                    </Stack>
                </Card>

                <Card withBorder p="md">
                    <Stack gap="md">
                        <Title order={2}>API Test</Title>
                        <Button 
                            onClick={handleTestAPI} 
                            loading={loading}
                            variant="filled"
                        >
                            Test Tenant Service API
                        </Button>
                        <Text size="sm" c="dimmed">
                            This will test the mock tenant service functions
                        </Text>
                    </Stack>
                </Card>

                <Card withBorder p="md">
                    <Stack gap="md">
                        <Title order={2}>Features</Title>
                        {tenantData.features.map((feature) => (
                            <div key={feature.id}>
                                <Text fw={500}>{feature.name}</Text>
                                <Text size="sm" c={feature.enabled ? 'green' : 'red'}>
                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                </Text>
                            </div>
                        ))}
                    </Stack>
                </Card>
            </Stack>
        </Container>
    );
}
