import React, { useState, useMemo } from 'react';
import { Card, Table, TextInput, Select, Pagination, Group, Button, Avatar, Badge, Text, Stack, Title } from '@mantine/core';
import { IconSearch, IconEye } from '@tabler/icons-react';
import { mockTenants } from './mockData';
import type Tenant from './types';

const PAGE_SIZE = 10;
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'trial', label: 'Trial' },
  { value: 'offboarded', label: 'Offboarded' },
];

function statusColor(status: Tenant['status']) {
  switch (status) {
    case 'active': return 'green';
    case 'suspended': return 'red';
    case 'trial': return 'yellow';
    case 'offboarded': return 'gray';
    default: return 'blue';
  }
}

export default function TenantListPage({ onViewTenant }: { onViewTenant?: (tenantId: string) => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockTenants.filter(t => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status ? t.status === status : true;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2} mb="md">Tenants</Title>
      <Group mb="md" spacing="md" align="flex-end">
        <TextInput
          icon={<IconSearch size={16} />}
          placeholder="Search by name or email"
          value={search}
          onChange={e => { setSearch(e.currentTarget.value); setPage(1); }}
          style={{ flex: 2 }}
        />
        <Select
          data={statusOptions}
          value={status}
          onChange={v => { setStatus(v || ''); setPage(1); }}
          label="Status"
          style={{ flex: 1, minWidth: 160 }}
        />
      </Group>
      <Table highlightOnHover verticalSpacing="sm" striped>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Status</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(t => (
            <tr key={t.id}>
              <td><Avatar src={t.branding?.logoUrl} alt={t.name} radius="xl" /></td>
              <td><Text weight={500}>{t.name}</Text></td>
              <td><Badge color={statusColor(t.status)}>{t.status}</Badge></td>
              <td>{t.primaryContact}</td>
              <td>{t.email}</td>
              <td>{t.phone}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>
                <Button size="xs" leftIcon={<IconEye size={14} />} variant="light" onClick={() => onViewTenant && onViewTenant(t.id)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group position="apart" mt="md">
        <Text size="sm" color="dimmed">
          Showing {paginated.length} of {filtered.length} tenants
        </Text>
        <Pagination
          page={page}
          onChange={setPage}
          total={Math.ceil(filtered.length / PAGE_SIZE)}
          size="sm"
        />
      </Group>
    </Card>
  );
} 