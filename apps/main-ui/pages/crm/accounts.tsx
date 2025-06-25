import React, { useState } from 'react';
import { Group, Grid, Card, Text, Stack, ActionIcon, Anchor, Button, Modal, TextInput, NumberInput, Select, Menu } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconTable, IconLayoutGrid, IconDots, IconEdit, IconTrash, IconUser, IconNote } from '@tabler/icons-react';
import { accounts } from '../../src/utils/crmMockData';

const owners = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

export default function CRMAccountsPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [accountsState, setAccountsState] = useState(accounts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', website: '', phone: '', industry: '', annualRevenue: '', numberOfEmployees: '', owner: ''
  });
  const [formError, setFormError] = useState('');
  const [noteModal, setNoteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [noteText, setNoteText] = useState('');

  const columns = [
    { accessor: 'name', title: 'Name', sortable: true },
    { accessor: 'website', title: 'Website', sortable: true, render: ({ website }) => <a href={website} target="_blank" rel="noopener noreferrer">{website}</a> },
    { accessor: 'phone', title: 'Phone', sortable: true },
    { accessor: 'industry', title: 'Industry', sortable: true },
    { accessor: 'annualRevenue', title: 'Annual Revenue', sortable: true, render: ({ annualRevenue }) => `$${annualRevenue.toLocaleString()}` },
    { accessor: 'numberOfEmployees', title: 'Employees', sortable: true },
    {
      accessor: 'actions',
      title: '',
      render: (row: any) => (
        <Menu withinPortal position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray"><IconDots size={18} /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={16} />} onClick={() => handleEdit(row)}>Edit</Menu.Item>
            <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={() => setDeleteModal({ open: true, row })}>Delete</Menu.Item>
            <Menu.Item icon={<IconUser size={16} />} onClick={() => handleAssignOwner(row)}>Assign Owner</Menu.Item>
            <Menu.Item icon={<IconNote size={16} />} onClick={() => setNoteModal({ open: true, row })}>Add Note</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  function handleEdit(row: any) {
    setEditing(row);
    setForm({ ...row });
    setModalOpen(true);
    setFormError('');
  }
  function handleAdd() {
    setEditing(null);
    setForm({ name: '', website: '', phone: '', industry: '', annualRevenue: '', numberOfEmployees: '', owner: '' });
    setModalOpen(true);
    setFormError('');
  }
  function handleFormChange(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));
  }
  function handleSubmit() {
    if (!form.name || !form.website || !form.phone || !form.industry || !form.annualRevenue || !form.numberOfEmployees) {
      setFormError('All fields are required.');
      return;
    }
    if (editing) {
      setAccountsState(accountsState.map(a => a.id === editing.id ? { ...editing, ...form } : a));
    } else {
      setAccountsState([
        ...accountsState,
        { ...form, id: Date.now() },
      ]);
    }
    setModalOpen(false);
  }
  function handleAssignOwner(row: any) {
    const nextOwner = prompt('Assign to owner:', row.owner);
    if (nextOwner) setAccountsState(accountsState.map(a => a.id === row.id ? { ...a, owner: nextOwner } : a));
  }
  function handleDelete() {
    if (deleteModal.row) setAccountsState(accountsState.filter(a => a.id !== deleteModal.row.id));
    setDeleteModal({ open: false, row: null });
  }
  function handleAddNote() {
    setNoteText('');
    setNoteModal({ open: false, row: null });
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={700}>Accounts</Text>
        <Group>
          <Button onClick={handleAdd} color="blue">Add Account</Button>
          <ActionIcon
            variant={view === 'table' ? 'filled' : 'light'}
            onClick={() => setView('table')}
            aria-label="Table view"
          >
            <IconTable size={20} />
          </ActionIcon>
          <ActionIcon
            variant={view === 'grid' ? 'filled' : 'light'}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <IconLayoutGrid size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Account' : 'Add Account'}>
        <Stack>
          <TextInput label="Name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
          <TextInput label="Website" value={form.website} onChange={e => handleFormChange('website', e.target.value)} required />
          <TextInput label="Phone" value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} required />
          <TextInput label="Industry" value={form.industry} onChange={e => handleFormChange('industry', e.target.value)} required />
          <NumberInput label="Annual Revenue" value={form.annualRevenue} onChange={v => handleFormChange('annualRevenue', v)} required min={0} />
          <NumberInput label="Employees" value={form.numberOfEmployees} onChange={v => handleFormChange('numberOfEmployees', v)} required min={0} />
          <Select label="Owner" data={owners} value={form.owner} onChange={v => handleFormChange('owner', v)} required />
          {formError && <Text color="red" size="sm">{formError}</Text>}
          <Group justify="flex-end">
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Account'}</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal opened={noteModal.open} onClose={() => setNoteModal({ open: false, row: null })} title="Add Note">
        <Stack>
          <TextInput label="Note" value={noteText} onChange={e => setNoteText(e.target.value)} autoFocus />
          <Group justify="flex-end">
            <Button onClick={handleAddNote}>Add Note</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal opened={deleteModal.open} onClose={() => setDeleteModal({ open: false, row: null })} title="Confirm Delete" centered>
        <Stack>
          <Text>Are you sure you want to delete this account?</Text>
          <Group justify="flex-end">
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          records={accountsState}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={300}
          idAccessor="id"
        />
      ) : (
        <Grid gutter="md">
          {accountsState.map((account) => (
            <Grid.Col key={account.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={600}>{account.name}</Text>
                <Text size="sm" c="dimmed">{account.industry}</Text>
                <a href={account.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>{account.website}</a>
                <Text size="sm" mt={4}>{account.phone}</Text>
                <Text size="sm" mt={4}>Revenue: ${account.annualRevenue.toLocaleString()}</Text>
                <Text size="sm" mt={2}>Employees: {account.numberOfEmployees}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
} 