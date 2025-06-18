// contact.model.ts
export interface Contact {
  id: string; // UUID
  tenantId: string;
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  accountId?: string; // FK to Account
  // Add other relevant contact fields like jobTitle, department, address, etc.
  createdAt: Date;
  updatedAt: Date;
}
