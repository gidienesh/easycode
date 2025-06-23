import React from 'react';
import { Card, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { IconUsers, IconUserPlus, IconUserEdit, IconUserCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';

export function UserManagementPage() {
  const router = useRouter();
  const currentPath = router.pathname;

  // Determine which sub-page to show based on pathname
  const getSubPage = () => {
    if (currentPath.includes('/users/roles')) {
      return <RolesSubPage />;
    }
    if (currentPath.includes('/users/permissions')) {
      return <PermissionsSubPage />;
    }
    return <UsersListSubPage />;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <IconUsers size="1.5rem" style={{ marginRight: '0.5rem' }} />
          User Management
        </h1>
      </div>
      
      {getSubPage()}
    </div>
  );
}

function UsersListSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Users</h2>
            <Button leftSection={<IconUserPlus size="1rem" />}>
              Add User
            </Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">User list will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function RolesSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Roles</h2>
            <Button leftSection={<IconUserEdit size="1rem" />}>
              Create Role
            </Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Roles management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
}

function PermissionsSubPage() {
  return (
    <Stack spacing="lg">
      <Card className="card">
        <div className="card-header">
          <Group position="apart">
            <h2 className="card-title">Permissions</h2>
            <Button leftSection={<IconUserCheck size="1rem" />}>
              Manage Permissions
            </Button>
          </Group>
        </div>
        <div className="card-content">
          <Text color="dimmed">Permissions management will be displayed here</Text>
        </div>
      </Card>
    </Stack>
  );
} 