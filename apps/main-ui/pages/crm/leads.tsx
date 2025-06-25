import React, { useState } from 'react';
import { Group, Grid, Card, Text, Badge, Stack, ActionIcon, Tooltip, Button, Modal, TextInput, NumberInput, Select, Menu } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconTable, IconLayoutGrid, IconUser, IconNotes, IconCurrencyDollar, IconUserCheck, IconDots, IconEdit, IconTrash, IconNote } from '@tabler/icons-react';
import { leads } from '../../src/utils/crmMockData.fromProjects';

const owners = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

export default function CRMLeadsPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [leadsState, setLeadsState] = useState(leads);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', email: '', company: '', product: '', budget: '', leadSource: '', stage: '', owner: '', status: '', assignedEngineer: '', createdAt: ''
  });
  const [formError, setFormError] = useState('');
  const [noteModal, setNoteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [noteText, setNoteText] = useState('');

  const columns = [
    { accessor: 'name', title: 'Name', sortable: true, filter: 'text' },
    { accessor: 'email', title: 'Email', sortable: true, filter: 'text' },
    { accessor: 'company', title: 'Company', sortable: true, filter: 'text' },
    { accessor: 'product', title: 'Product/Service Interested', sortable: true, filter: 'text' },
    { accessor: 'budget', title: 'Budget (KES)', sortable: true, render: ({ budget }) => budget ? `KSh ${budget.toLocaleString()}` : 'N/A' },
    { accessor: 'leadSource', title: 'Source', sortable: true, filter: 'select', filterOptions: ['Referral', 'Website', 'Event', 'Cold Call'] },
    { accessor: 'stage', title: 'Stage', sortable: true, filter: 'select', filterOptions: ['Prospecting', 'Discovery', 'Proposal', 'Closed Lost'] },
    { accessor: 'owner', title: 'Owner', sortable: true, filter: 'text' },
    { accessor: 'status', title: 'Status', sortable: true, filter: 'select', filterOptions: ['New', 'Contacted', 'Qualified', 'Lost'] },
    { accessor: 'assignedEngineer', title: 'Assigned Engineer', sortable: true, filter: 'text' },
    { accessor: 'createdAt', title: 'Created', sortable: true, render: (row) => new Date(row.createdAt).toLocaleDateString() },
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
    setForm({ name: '', email: '', company: '', product: '', budget: '', leadSource: '', stage: '', owner: '', status: '', assignedEngineer: '', createdAt: new Date().toISOString() });
    setModalOpen(true);
    setFormError('');
  }
  function handleFormChange(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));
  }
  function handleSubmit() {
    if (!form.name || !form.email || !form.company || !form.product || !form.leadSource || !form.stage || !form.owner || !form.status || !form.assignedEngineer) {
      setFormError('All fields are required.');
      return;
    }
    if (editing) {
      setLeadsState(leadsState.map(l => l.id === editing.id ? { ...editing, ...form } : l));
    } else {
      setLeadsState([
        ...leadsState,
        { ...form, id: Date.now() },
      ]);
    }
    setModalOpen(false);
  }
  function handleAssignOwner(row: any) {
    const nextOwner = prompt('Assign to owner:', row.owner);
    if (nextOwner) setLeadsState(leadsState.map(l => l.id === row.id ? { ...l, owner: nextOwner } : l));
  }
  function handleDelete() {
    if (deleteModal.row) setLeadsState(leadsState.filter(l => l.id !== deleteModal.row.id));
    setDeleteModal({ open: false, row: null });
  }
  function handleAddNote() {
    setNoteText('');
    setNoteModal({ open: false, row: null });
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={700}>Leads</Text>
        <Group>
          <Button onClick={handleAdd} color="blue">Add Lead</Button>
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

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lead' : 'Add Lead'}>
        <Stack>
          <TextInput label="Name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
          <TextInput label="Email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} required />
          <TextInput label="Company" value={form.company} onChange={e => handleFormChange('company', e.target.value)} required />
          <TextInput label="Product/Service Interested" value={form.product} onChange={e => handleFormChange('product', e.target.value)} required />
          <NumberInput label="Budget (KES)" value={form.budget} onChange={v => handleFormChange('budget', v)} required min={0} />
          <Select label="Source" data={['Referral', 'Website', 'Event', 'Cold Call']} value={form.leadSource} onChange={v => handleFormChange('leadSource', v)} required />
          <Select label="Stage" data={['Prospecting', 'Discovery', 'Proposal', 'Closed Lost']} value={form.stage} onChange={v => handleFormChange('stage', v)} required />
          <Select label="Owner" data={owners} value={form.owner} onChange={v => handleFormChange('owner', v)} required />
          <Select label="Status" data={['New', 'Contacted', 'Qualified', 'Lost']} value={form.status} onChange={v => handleFormChange('status', v)} required />
          <TextInput label="Assigned Engineer" value={form.assignedEngineer} onChange={e => handleFormChange('assignedEngineer', e.target.value)} required />
          {formError && <Text color="red" size="sm">{formError}</Text>}
          <Group justify="flex-end">
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Lead'}</Button>
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
          <Text>Are you sure you want to delete this lead?</Text>
          <Group justify="flex-end">
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

      {view === 'table' ? (
        <DataTable
          className="mantine-DataTable-root"
          columns={columns}
          records={leadsState}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={300}
          idAccessor="id"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
        />
      ) : (
        <Grid gutter="md">
          {leadsState.map((lead) => (
            <Grid.Col key={lead.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Text fw={600}>{lead.name}</Text>
                  <Badge color={lead.status === 'New' ? 'blue' : lead.status === 'Contacted' ? 'yellow' : lead.status === 'Qualified' ? 'green' : 'red'}>{lead.status}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mt={4}>{lead.company}</Text>
                <Text size="sm" mt={4}>{lead.email}</Text>
                <Text size="sm" mt={2}>{lead.phone}</Text>
                <Text size="sm" mt={2} fw={500}>Interested: {lead.product}</Text>
                <Group gap="xs" mt={2} align="center">
                  <IconCurrencyDollar size={16} />
                  <Text size="sm">{lead.budget ? `KSh ${lead.budget.toLocaleString()}` : 'N/A'}</Text>
                </Group>
                <Group gap="xs" mt={2} align="center">
                  <IconUserCheck size={16} />
                  <Text size="sm">Owner: {lead.owner}</Text>
                </Group>
                <Group gap="xs" mt={2} align="center">
                  <IconUser size={16} />
                  <Text size="sm">Source: {lead.leadSource}</Text>
                </Group>
                <Group gap="xs" mt={2} align="center">
                  <IconUserCheck size={16} />
                  <Text size="sm">Engineer: {lead.assignedEngineer}</Text>
                </Group>
                <Text size="sm" mt={2}>Stage: {lead.stage}</Text>
                <Text size="xs" c="dimmed" mt={8}>Created: {new Date(lead.createdAt).toLocaleDateString()}</Text>
                {lead.notes && (
                  <Text size="xs" c="dimmed" mt={4}>
                    <a href={`/crm/leads/${lead.id}/communications`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <IconNotes size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {lead.notes}
                    </a>
                  </Text>
                )}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
} 