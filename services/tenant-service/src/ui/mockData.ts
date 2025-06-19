import { faker } from '@faker-js/faker';
import type Tenant from './types';
import type { Feature, AffiliateAgent } from './types';

// Generate mock features
export const mockFeatures: Feature[] = [
  {
    id: 'crm',
    name: 'CRM Service',
    description: 'Customer relationship management tools.',
    pricePerMonth: 49,
    modules: [
      { id: 'sales_pipeline', name: 'Sales Pipeline', description: 'Track sales opportunities.' },
      { id: 'marketing_campaigns', name: 'Marketing Campaigns', description: 'Run and analyze campaigns.' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory Service',
    description: 'Track and manage inventory levels.',
    pricePerMonth: 39,
    modules: [
      { id: 'basic_stock_tracking', name: 'Basic Stock Tracking', description: 'Monitor stock levels.' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance Service',
    description: 'Accounting, invoicing, and payments.',
    pricePerMonth: 59,
  },
  {
    id: 'hr',
    name: 'HR Service',
    description: 'Employee and payroll management.',
    pricePerMonth: 29,
  },
  {
    id: 'pos',
    name: 'POS Service',
    description: 'Point of sale and retail operations.',
    pricePerMonth: 35,
  },
  {
    id: 'logistics',
    name: 'Logistics Service',
    description: 'Shipping and delivery management.',
    pricePerMonth: 45,
  },
];

// Generate mock affiliate agents
export const mockAffiliateAgents: AffiliateAgent[] = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  commissionRate: faker.number.int({ min: 5, max: 20 }),
}));

// Generate mock tenants
export const mockTenants: Tenant[] = Array.from({ length: 25 }, () => {
  const entitlements = faker.helpers.arrayElements(mockFeatures.map(f => f.id), faker.number.int({ min: 1, max: 4 }));
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    status: faker.helpers.arrayElement(['active', 'suspended', 'trial', 'offboarded']),
    primaryContact: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    branding: {
      logoUrl: faker.image.avatar(),
      colorScheme: faker.color.rgb(),
    },
    region: {
      timezone: faker.location.timeZone(),
      language: faker.location.countryCode(),
      currency: faker.finance.currencyCode(),
    },
    entitlements,
    subdomain: faker.internet.domainWord() + '.easycode.com',
    affiliateAgentId: faker.helpers.arrayElement([undefined, ...mockAffiliateAgents.map(a => a.id)]),
  };
}); 