import React from 'react';
import { Card, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { IconBuilding, IconUsers, IconBuildingStore } from '@tabler/icons-react';
import { useRouter } from 'next/router';

export function CrmPage() {
  const router = useRouter();
  const currentPath = router.pathname;

  const getSubPage = () => {
    if (currentPath.includes('/crm/leads')) {
      return <LeadsSubPage />;
    }
    if (currentPath.includes('/crm/contacts')) {
      return <ContactsSubPage />;
    }
    if (currentPath.includes('/crm/opportunities')) {
      return <OpportunitiesSubPage />;
    }
    if (currentPath.includes('/crm/accounts')) {
      return <AccountsSubPage />;
    }
    return <CrmOverviewSubPage />;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconBuilding size="1.5rem" style={{ marginRight: '0.5rem' }} />
          CRM
        </h1>
      </div>
      
      {getSubPage()}
    </div>
  );
}

function CrmOverviewSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <h2 className="card-title">CRM Overview</h2>
        </div>
        <div className="card-content">
          <Text color="dimmed">CRM dashboard and overview will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function LeadsSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Leads</h2>
            <Button>Add Lead</Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Leads management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function ContactsSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Contacts</h2>
            <Button>Add Contact</Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Contacts management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function OpportunitiesSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Opportunities</h2>
            <Button>Add Opportunity</Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Opportunities management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function AccountsSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Accounts</h2>
            <Button>Add Account</Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Accounts management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
} 