import React, { useState } from 'react';
import { Group, Grid, Card, Text, Stack, ActionIcon, Button, Modal, TextInput, Select, Menu } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconTable, IconLayoutGrid, IconDots, IconEdit, IconTrash, IconUser, IconNote } from '@tabler/icons-react';
import { contacts } from '../../src/utils/crmMockData';

const owners = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

export default function CRMContactsPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [contactsState, setContactsState] = useState(contacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', company: '', owner: '' });
  const [formError, setFormError] = useState('');
  const [noteModal, setNoteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [noteText, setNoteText] = useState('');

  const columns = [
    { accessor: 'name', title: 'Name', sortable: true },
    { accessor: 'email', title: 'Email', sortable: true },
    { accessor: 'phone', title: 'Phone', sortable: true },
    { accessor: 'position', title: 'Job Title', sortable: true },
    { accessor: 'company', title: 'Company', sortable: true },
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
    setForm({ name: '', email: '', phone: '', position: '', company: '', owner: '' });
    setModalOpen(true);
    setFormError('');
  }
  function handleFormChange(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));
  }
  function handleSubmit() {
    if (!form.name || !form.email || !form.phone || !form.position || !form.company) {
      setFormError('All fields are required.');
      return;
    }
    if (editing) {
      setContactsState(contactsState.map(c => c.id === editing.id ? { ...editing, ...form } : c));
    } else {
      setContactsState([
        ...contactsState,
        { ...form, id: Date.now() },
      ]);
    }
    setModalOpen(false);
  }
  function handleAssignOwner(row: any) {
    const nextOwner = prompt('Assign to owner:', row.owner);
    if (nextOwner) setContactsState(contactsState.map(c => c.id === row.id ? { ...c, owner: nextOwner } : c));
  }
  function handleDelete() {
    if (deleteModal.row) setContactsState(contactsState.filter(c => c.id !== deleteModal.row.id));
    setDeleteModal({ open: false, row: null });
  }
  function handleAddNote() {
    setNoteText('');
    setNoteModal({ open: false, row: null });
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={700}>Contacts</Text>
        <Group>
          <Button onClick={handleAdd} color="blue">Add Contact</Button>
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

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Contact' : 'Add Contact'}>
        <Stack>
          <TextInput label="Name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
          <TextInput label="Email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} required />
          <TextInput label="Phone" value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} required />
          <TextInput label="Job Title" value={form.position} onChange={e => handleFormChange('position', e.target.value)} required />
          <TextInput label="Company" value={form.company} onChange={e => handleFormChange('company', e.target.value)} required />
          <Select label="Owner" data={owners} value={form.owner} onChange={v => handleFormChange('owner', v)} required />
          {formError && <Text color="red" size="sm">{formError}</Text>}
          <Group justify="flex-end">
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Contact'}</Button>
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
          <Text>Are you sure you want to delete this contact?</Text>
          <Group justify="flex-end">
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          records={contactsState}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={300}
          idAccessor="id"
        />
      ) : (
        <Grid gutter="md">
          {contactsState.map((contact) => (
            <Grid.Col key={contact.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={600}>{contact.name}</Text>
                <Text size="sm" c="dimmed">{contact.position}</Text>
                <Text size="sm" mt={4}>{contact.company}</Text>
                <Text size="sm" mt={4}>{contact.email}</Text>
                <Text size="sm" mt={2}>{contact.phone}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
} 