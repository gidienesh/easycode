// Kenya-specific static mock data for CRM modules

export const leads = [
  {
    id: 'lead-1',
    name: 'Wanjiku Mwangi',
    email: 'wanjiku.mwangi@example.co.ke',
    company: 'Safaricom PLC',
    phone: '+254 722 123456',
    status: 'New',
    product: 'M-PESA Business Account',
    createdAt: '2024-05-01',
  },
  {
    id: 'lead-2',
    name: 'John Kamau',
    email: 'john.kamau@equitybank.co.ke',
    company: 'Equity Bank',
    phone: '+254 733 654321',
    status: 'Qualified',
    product: 'EazzyNet Corporate Banking',
    createdAt: '2024-04-20',
  },
  {
    id: 'lead-3',
    name: 'Aisha Hassan',
    email: 'aisha.hassan@kengen.co.ke',
    company: 'KenGen',
    phone: '+254 721 987654',
    status: 'Contacted',
    product: 'Solar Power Solutions',
    createdAt: '2024-03-15',
  },
];

export const contacts = [
  {
    id: 'contact-1',
    name: 'Peter Otieno',
    email: 'peter.otieno@kcbgroup.com',
    phone: '+254 700 111222',
    jobTitle: 'Relationship Manager',
    company: 'KCB Group',
    createdAt: '2024-02-10',
  },
  {
    id: 'contact-2',
    name: 'Grace Njeri',
    email: 'grace.njeri@bidcokenya.com',
    phone: '+254 701 333444',
    jobTitle: 'Procurement Officer',
    company: 'Bidco Africa',
    createdAt: '2024-01-25',
  },
  {
    id: 'contact-3',
    name: 'Samuel Kiptoo',
    email: 'samuel.kiptoo@nationmedia.com',
    phone: '+254 702 555666',
    jobTitle: 'Editor',
    company: 'Nation Media Group',
    createdAt: '2024-03-05',
  },
];

export const accounts = [
  {
    id: 'account-1',
    name: 'Safaricom PLC',
    website: 'https://www.safaricom.co.ke',
    phone: '+254 722 123456',
    industry: 'Telecommunications',
    annualRevenue: 250000000000,
    numberOfEmployees: 6000,
  },
  {
    id: 'account-2',
    name: 'Equity Bank',
    website: 'https://www.equitybankgroup.com',
    phone: '+254 733 654321',
    industry: 'Banking',
    annualRevenue: 120000000000,
    numberOfEmployees: 8000,
  },
  {
    id: 'account-3',
    name: 'KenGen',
    website: 'https://www.kengen.co.ke',
    phone: '+254 721 987654',
    industry: 'Energy',
    annualRevenue: 50000000000,
    numberOfEmployees: 2500,
  },
];

export const opportunities = [
  {
    id: 'opp-1',
    name: 'Safaricom Cloud Migration',
    accountName: 'Safaricom PLC',
    stage: 'Prospecting',
    amount: 15000000,
    closeDate: '2024-07-01',
  },
  {
    id: 'opp-2',
    name: 'Equity Bank Mobile App Upgrade',
    accountName: 'Equity Bank',
    stage: 'Proposal',
    amount: 8000000,
    closeDate: '2024-08-15',
  },
  {
    id: 'opp-3',
    name: 'KenGen Solar Project',
    accountName: 'KenGen',
    stage: 'Negotiation',
    amount: 20000000,
    closeDate: '2024-09-10',
  },
];

export const activities = [
  {
    id: 'act-1',
    subject: 'Introductory Call',
    type: 'Call',
    relatedTo: 'Safaricom PLC',
    dueDate: '2024-05-10',
    status: 'Completed',
  },
  {
    id: 'act-2',
    subject: 'Send Proposal',
    type: 'Email',
    relatedTo: 'Equity Bank',
    dueDate: '2024-06-01',
    status: 'Open',
  },
  {
    id: 'act-3',
    subject: 'Project Kickoff Meeting',
    type: 'Meeting',
    relatedTo: 'KenGen',
    dueDate: '2024-06-15',
    status: 'Open',
  },
]; 