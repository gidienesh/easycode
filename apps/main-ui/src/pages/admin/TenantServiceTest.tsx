import { Container, Paper, Stack, Title } from '@mantine/core';
import AdminFeatureManager from '@easycode/tenant-service/src/ui/AdminFeatureManager';
import FeatureChecklist from '@easycode/tenant-service/src/ui/FeatureChecklist';
import QuotationSummary from '@easycode/tenant-service/src/ui/QuotationSummary';

// Import tenant-service UI components


export default function TenantServiceTestPage() {
    return (
        <Container size="xl" py="xl">
            <Title order={1} mb="xl">Tenant Service UI Components Test</Title>

            <Stack spacing="xl">
                <Paper shadow="sm" p="md" withBorder>
                    <Title order={2} mb="md">Admin Feature Manager</Title>
                    <AdminFeatureManager />
                </Paper>

                <Paper shadow="sm" p="md" withBorder>
                    <Title order={2} mb="md">Feature Checklist</Title>
                    <FeatureChecklist />
                </Paper>

                <Paper shadow="sm" p="md" withBorder>
                    <Title order={2} mb="md">Quotation Summary</Title>
                    <QuotationSummary />
                </Paper>
            </Stack>
        </Container>
    );
}
