import React, { useState } from 'react';
import { Group, Grid, Card, Text, Badge, Stack, ActionIcon, Button, Modal, TextInput, NumberInput, Select, Menu, Tooltip, Notification } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DataTable } from 'mantine-datatable';
import { IconTable, IconLayoutGrid, IconDots, IconEdit, IconTrash, IconUser, IconFlag, IconCheck, IconX, IconNote, IconInfoCircle, IconAlertTriangle, IconRobotFace, IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import { opportunities } from '../../src/utils/crmMockData';

export default function CRMOpportunitiesPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [opps, setOpps] = useState(opportunities);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    account: '',
    stage: '',
    value: '',
    closeDate: '',
  });
  const [formError, setFormError] = useState('');
  const [noteModal, setNoteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });
  const [noteText, setNoteText] = useState('');

  const owners = ['Mary Wambui', 'Peter Otieno', 'Grace Njeri', 'John Kamau'];

  // Mock AI functions
  function getWinProbability(opportunity: any) {
    // Simulate with simple rules for demo
    let base = 0.5;
    if (opportunity.stage === 'Closed Won') base = 0.99;
    else if (opportunity.stage === 'Closed Lost') base = 0.01;
    else if (opportunity.stage === 'Negotiation') base = 0.8;
    else if (opportunity.stage === 'Proposal') base = 0.65;
    else if (opportunity.stage === 'Qualified') base = 0.5;
    else if (opportunity.stage === 'Prospecting') base = 0.3;
    // Add some random noise
    base += (Math.random() - 0.5) * 0.1;
    return Math.max(0, Math.min(1, base));
  }
  function getWinFactors(opportunity: any) {
    // Simulate top factors
    if (opportunity.stage === 'Negotiation') return ['Advanced stage', 'High engagement', 'Recent activity'];
    if (opportunity.stage === 'Prospecting') return ['Early stage', 'Low engagement'];
    if (opportunity.stage === 'Closed Lost') return ['Lost recently', 'No recent activity'];
    return ['Good pipeline position', 'Active owner'];
  }
  function getRisk(opportunity: any) {
    // Simulate risk
    if (opportunity.stage === 'Closed Lost') return { risk: true, reason: 'Deal marked as lost' };
    if (opportunity.stage !== 'Closed Won' && (!opportunity.lastActivity || (Date.now() - new Date(opportunity.lastActivity).getTime()) > 1000 * 60 * 60 * 24 * 14)) {
      return { risk: true, reason: 'No activity in 14 days' };
    }
    return { risk: false };
  }
  function getNextBestAction(opportunity: any) {
    if (opportunity.stage === 'Prospecting') return 'Schedule discovery call';
    if (opportunity.stage === 'Proposal') return 'Send proposal follow-up';
    if (opportunity.stage === 'Negotiation') return 'Loop in technical expert';
    if (opportunity.stage === 'Closed Lost') return 'Review lost reasons';
    if (opportunity.stage === 'Closed Won') return 'Send thank you note';
    return 'Review deal';
  }
  // Executive summary mock
  function getExecutiveSummary(opps: any[]) {
    const total = opps.length;
    const atRisk = opps.filter(o => getRisk(o).risk).length;
    const forecast = opps.reduce((sum, o) => sum + (getWinProbability(o) * o.value), 0);
    const health = Math.round(100 * (1 - atRisk / (total || 1)));
    return {
      forecast,
      health,
      atRisk,
      total,
    };
  }

  const summary = getExecutiveSummary(opps);

  const columns = [
    { accessor: 'name', title: 'Opportunity Name', sortable: true },
    { accessor: 'account', title: 'Account Name', sortable: true },
    { accessor: 'stage', title: 'Stage', sortable: true },
    { accessor: 'value', title: 'Amount', sortable: true, render: ({ value }) => `$${value}` },
    { accessor: 'closeDate', title: 'Close Date', sortable: true, render: (row) => new Date(row.closeDate).toLocaleDateString() },
    {
      accessor: 'aiWinProb',
      title: 'Win Probability',
      render: (row: any) => {
        const prob = getWinProbability(row);
        const factors = getWinFactors(row);
        return (
          <Tooltip label={<div>Top factors:<ul style={{margin:0,paddingLeft:16}}>{factors.map((f,i) => <li key={i}>{f}</li>)}</ul></div>}>
            <Badge color={prob > 0.8 ? 'green' : prob > 0.5 ? 'yellow' : 'red'} leftSection={<IconRobotFace size={14} />}>
              {Math.round(prob * 100)}%
            </Badge>
          </Tooltip>
        );
      },
    },
    {
      accessor: 'aiRisk',
      title: 'AI Risk',
      render: (row: any) => {
        const risk = getRisk(row);
        return risk.risk ? (
          <Tooltip label={risk.reason}>
            <Badge color="red" leftSection={<IconAlertTriangle size={14} />}>At Risk</Badge>
          </Tooltip>
        ) : null;
      },
    },
    {
      accessor: 'aiNextAction',
      title: 'Next Best Action',
      render: (row: any) => {
        const action = getNextBestAction(row);
        return (
          <Group gap="xs">
            <Button size="xs" leftSection={<IconRobotFace size={14} />} variant="light" onClick={() => alert(`AI recommends: ${action}`)}>{action}</Button>
            <Tooltip label="Accept"><ActionIcon color="green" variant="subtle"><IconThumbUp size={16} /></ActionIcon></Tooltip>
            <Tooltip label="Override"><ActionIcon color="red" variant="subtle"><IconThumbDown size={16} /></ActionIcon></Tooltip>
          </Group>
        );
      },
    },
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
            <Menu.Item icon={<IconFlag size={16} />} onClick={() => handleChangeStage(row)}>Change Stage</Menu.Item>
            <Menu.Item icon={<IconUser size={16} />} onClick={() => handleAssignOwner(row)}>Assign Owner</Menu.Item>
            <Menu.Item icon={<IconCheck size={16} />} onClick={() => handleMarkStatus(row, 'Closed Won')}>Mark as Won</Menu.Item>
            <Menu.Item icon={<IconX size={16} />} onClick={() => handleMarkStatus(row, 'Closed Lost')}>Mark as Lost</Menu.Item>
            <Menu.Item icon={<IconNote size={16} />} onClick={() => setNoteModal({ open: true, row })}>Add Note</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ].filter(Boolean);

  const getBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting': return 'blue';
      case 'Qualified': return 'cyan';
      case 'Proposal': return 'orange';
      case 'Negotiation': return 'yellow';
      case 'Closed Won': return 'green';
      case 'Closed Lost': return 'red';
      default: return 'gray';
    }
  };

  function handleEdit(row: any) {
    setEditing(row);
    setForm({
      name: row.name,
      account: row.account,
      stage: row.stage,
      value: row.value,
      closeDate: row.closeDate,
    });
    setModalOpen(true);
    setFormError('');
  }

  function handleAdd() {
    setEditing(null);
    setForm({ name: '', account: '', stage: '', value: '', closeDate: '' });
    setModalOpen(true);
    setFormError('');
  }

  function handleFormChange(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name || !form.account || !form.stage || !form.value || !form.closeDate) {
      setFormError('All fields are required.');
      return;
    }
    if (editing) {
      setOpps(opps.map(o => o.id === editing.id ? { ...editing, ...form } : o));
    } else {
      setOpps([
        ...opps,
        { ...form, id: Date.now() },
      ]);
    }
    setModalOpen(false);
  }

  function handleChangeStage(row: any) {
    const nextStage = prompt('Enter new stage (Prospecting, Qualified, Proposal, Negotiation, Closed Won, Closed Lost):', row.stage);
    if (nextStage) setOpps(opps.map(o => o.id === row.id ? { ...o, stage: nextStage } : o));
  }

  function handleAssignOwner(row: any) {
    const nextOwner = prompt('Assign to owner:', row.owner);
    if (nextOwner) setOpps(opps.map(o => o.id === row.id ? { ...o, owner: nextOwner } : o));
  }

  function handleMarkStatus(row: any, status: string) {
    setOpps(opps.map(o => o.id === row.id ? { ...o, stage: status } : o));
  }

  function handleDelete() {
    if (deleteModal.row) setOpps(opps.filter(o => o.id !== deleteModal.row.id));
    setDeleteModal({ open: false, row: null });
  }

  function handleAddNote() {
    // In real app, would save note to backend or state
    setNoteText('');
    setNoteModal({ open: false, row: null });
  }

  return (
    <Stack>
      <Notification title="Executive AI Summary" icon={<IconRobotFace size={24} />} color="blue" mb="md">
        <Text fw={700}>Forecasted Wins: <span style={{color:'#1971c2'}}>KSh {summary.forecast.toLocaleString()}</span></Text>
        <Text>Pipeline Health: <Badge color={summary.health > 80 ? 'green' : summary.health > 60 ? 'yellow' : 'red'}>{summary.health}%</Badge></Text>
        <Text>Deals at Risk: <Badge color={summary.atRisk > 0 ? 'red' : 'green'}>{summary.atRisk}</Badge> / {summary.total}</Text>
      </Notification>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={700}>Opportunities</Text>
        <Group>
          <Button onClick={handleAdd} color="blue">Add Opportunity</Button>
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

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Opportunity' : 'Add Opportunity'}>
        <Stack>
          <TextInput label="Opportunity Name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
          <TextInput label="Account Name" value={form.account} onChange={e => handleFormChange('account', e.target.value)} required />
          <Select
            label="Stage"
            data={['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']}
            value={form.stage}
            onChange={v => handleFormChange('stage', v)}
            required
          />
          <NumberInput label="Amount" value={form.value} onChange={v => handleFormChange('value', v)} required min={0} parser={v => v?.replace(/\$/g, '')} />
          <DateInput label="Close Date" value={form.closeDate ? new Date(form.closeDate) : undefined} onChange={d => handleFormChange('closeDate', d ? d.toISOString() : '')} required />
          {formError && <Text color="red" size="sm">{formError}</Text>}
          <Group justify="flex-end">
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Opportunity'}</Button>
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
          <Text>Are you sure you want to delete this opportunity?</Text>
          <Group justify="flex-end">
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          records={opps}
          highlightOnHover
          striped
          withTableBorder
          withColumnBorders
          minHeight={300}
          idAccessor="id"
        />
      ) : (
        <Grid gutter="md">
          {opps.map((opportunity) => (
            <Grid.Col key={opportunity.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Text fw={600}>{opportunity.name}</Text>
                  <Badge color={getBadgeColor(opportunity.stage)}>{opportunity.stage}</Badge>
                </Group>
                <Text size="sm" c="dimmed">{opportunity.account}</Text>
                <Text size="lg" fw={500} mt={8}>${opportunity.value}</Text>
                <Text size="xs" c="dimmed" mt={8}>Close Date: {new Date(opportunity.closeDate).toLocaleDateString()}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
} 