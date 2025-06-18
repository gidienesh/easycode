export interface Address { street: string; city: string; state?: string; postalCode: string; country: string; } // Reusable
export interface BankDetails { bankName: string; accountNumber: string; sortCode?: string; iban?: string; swiftCode?: string; }

export interface Employee {
  id: string; // UUID
  tenantId: string;
  userId?: string; // Link to user-service for login if applicable
  employeeNumber: string; // Unique internal ID
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  personalEmail?: string;
  workEmail: string;
  phoneNumber?: string;
  address?: Address;
  emergencyContact?: { name: string; relationship: string; phone: string; email?: string; };
  // Employment Details
  jobTitle: string;
  departmentId?: string; // FK to Department model
  positionId?: string; // FK to Position model
  managerId?: string; // FK to another Employee (manager)
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
  startDate: Date;
  endDate?: Date; // For contract/interns or terminated employees
  salary?: {
    amount: number;
    currency: string; // e.g., USD, EUR
    frequency: 'annual' | 'monthly' | 'bi_weekly' | 'weekly' | 'hourly';
    effectiveDate: Date;
  };
  bankDetails?: BankDetails;
  customFields?: Record<string, any>; // For tenant-specific employee fields
  status: 'active' | 'on_leave' | 'terminated' | 'pending_hire' | 'offer_accepted';
  createdAt: Date;
  updatedAt: Date;
}

export interface Department { id: string; tenantId: string; name: string; description?: string; parentDepartmentId?: string; managerId?: string; }
export interface Position { id: string; tenantId: string; title: string; description?: string; departmentId: string; jobGrade?: string; reportsToPositionId?: string; }

export type PayrollRunStatus = 'draft' | 'pending_approval' | 'approved' | 'processing' | 'completed' | 'failed' | 'rolled_back';
export interface PayrollRun {
  id: string; // UUID
  tenantId: string;
  payPeriodStartDate: Date;
  payPeriodEndDate: Date;
  paymentDate: Date;
  status: PayrollRunStatus;
  notes?: string;
  // Summary data could be stored here after run, e.g., totalGross, totalNet, totalTax
  totalEmployeesProcessed?: number;
  totalGrossPay?: number;
  totalNetPay?: number;
  totalDeductions?: number;
  processedByUserId?: string;
  approvedByUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayslipEarning { description: string; amount: number; type: 'base' | 'bonus' | 'overtime' | 'commission' | 'allowance' | 'reimbursement'; }
export interface PayslipDeduction { description: string; amount: number; type: 'statutory_tax' | 'social_security' | 'pension_contribution' | 'loan_repayment' | 'salary_advance' | 'health_insurance_premium' | 'other_voluntary'; isPreTax?: boolean; }
export interface Payslip {
  id: string; // UUID
  tenantId: string;
  payrollRunId: string; // FK
  employeeId: string; // FK
  employeeInfoSnapshot: Partial<Employee>; // Key employee details at time of payroll
  payPeriodStartDate: Date;
  payPeriodEndDate: Date;
  paymentDate: Date;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  earnings: PayslipEarning[];
  deductions: PayslipDeduction[];
  employerContributions?: PayslipDeduction[]; // e.g., employer's pension part
  notesToEmployee?: string;
  createdAt: Date;
}

export interface LeaveType { id: string; tenantId: string; name: string; description?: string; accrualRatePerYear?: number; accrualFrequency?: 'annual' | 'monthly' | 'per_pay_period'; maxBalance?: number; isPaid: boolean; requiresApproval: boolean; effectiveDate: Date; isActive: boolean; }
export type LeaveRequestStatus = 'pending' | 'approved_by_manager' | 'approved_by_hr' | 'rejected' | 'cancelled_by_employee' | 'taken' | 'partially_taken';
export interface LeaveRequest {
  id: string; // UUID
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  // For partial days, can add startTime and endTime or durationInHours
  isPartialDayStart?: boolean;
  isPartialDayEnd?: boolean;
  reason?: string;
  status: LeaveRequestStatus;
  requestedDays: number; // Calculated, considering weekends/holidays based on policy
  approvedByUserId?: string;
  hrApprovalUserId?: string;
  comments?: string; // By employee or approvers
  createdAt: Date;
  updatedAt: Date;
}
export interface LeaveBalance {
  id: string; // UUID
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  fiscalYear?: number; // Or other tracking period
  balanceDays: number;
  lastAccrualDate?: Date;
  manualAdjustment?: number;
  notes?: string;
  updatedAt: Date;
}
