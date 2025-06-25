import { faker } from '@faker-js/faker';

// Seed Faker to ensure consistent data for SSR and client-side rendering
faker.seed(123);

export const leads = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  company: faker.company.name(),
  phone: faker.phone.number(),
  status: faker.helpers.arrayElement(['New', 'Contacted', 'Qualified', 'Lost']),
  createdAt: faker.date.past().toISOString(),
}));

export const contacts = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  position: faker.person.jobTitle(),
  company: faker.company.name(),
}));

export const accounts = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  industry: faker.commerce.department(),
  website: faker.internet.url(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  billingAddress: {
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode(),
  },
  shippingAddress: {
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode(),
  },
  annualRevenue: parseFloat(faker.finance.amount(100000, 10000000, 2)),
  numberOfEmployees: faker.number.int({ min: 1, max: 5000 }),
  ownerId: faker.string.uuid(),
}));

export const opportunities = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  account: faker.company.name(),
  value: faker.finance.amount({ min: 1000, max: 10000, dec: 2 }),
  stage: faker.helpers.arrayElement(['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
  closeDate: faker.date.future().toISOString(),
}));

export const activities = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['Call', 'Email', 'Meeting', 'Task']),
  subject: faker.lorem.sentence({ min: 3, max: 6 }),
  contact: faker.person.fullName(),
  dueDate: faker.date.soon().toISOString(),
  status: faker.helpers.arrayElement(['Pending', 'Completed']),
})); 