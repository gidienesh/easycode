export type LeadSource = 'web_form' | 'manual_entry' | 'import' | 'internal_employee_referral' | string;
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | string;

export interface Lead {
  id: string; // UUID
  tenantId: string;
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  status: LeadStatus;
  leadSource: LeadSource;
  assignedToUserId?: string;
  // Stema referral enhancements
  referred_by_employee_id?: string; // FK to user-service.Users.userId
  referral_details?: string;
  // Other common lead fields
  value?: number;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
