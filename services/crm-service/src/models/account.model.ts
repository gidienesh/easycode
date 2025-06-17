// account.model.ts
export interface Account { // Organization/Company
  id: string; // UUID
  tenantId: string;
  name: string;
  industry?: string;
  website?: string;
  // Add other relevant account fields like address, numberOfEmployees, annualRevenue, etc.
  createdAt: Date;
  updatedAt: Date;
}
