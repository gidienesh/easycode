import { Request, Response } from 'express';
import { PayrollRun, Payslip, Employee, PayslipEarning, PayslipDeduction, PayrollRunStatus } from '../models';
import { FinanceIntegrationService, PayrollJournalPayload, PayrollJournalLine } from '../services/finance.integration.service';
import { randomUUID } from 'crypto';

// Assuming mockEmployees is accessible here or through a service for payroll processing.
// For simplicity, it's redeclared here, but in a real app, it would come from EmployeeController/Service.
const mockEmployeesForPayroll: Employee[] = [];
const mockPayrollRuns: PayrollRun[] = [];
const mockPayslips: Payslip[] = [];

// Helper function (conceptual) - should be in a payroll processing service
async function processPayrollForRun(run: PayrollRun, employees: Employee[]): Promise<void> {
  console.log(`Processing payroll for run ${run.id}, tenant ${run.tenantId}`);
  const payslipsForRun: Payslip[] = [];
  let totalGrossForRun = 0;
  let totalDeductionsForRun = 0;
  let totalNetForRun = 0;

  for (const emp of employees) {
    if (!emp.salary || emp.status !== 'active') continue; // Skip if no salary or not active

    const grossEarnings: PayslipEarning[] = [];
    const deductions: PayslipDeduction[] = [];

    let monthlySalary = 0;
    if (emp.salary.frequency === 'annual') {
      monthlySalary = emp.salary.amount / 12;
    } else if (emp.salary.frequency === 'monthly') {
      monthlySalary = emp.salary.amount;
    } // Add other frequencies if needed

    grossEarnings.push({ description: 'Base Salary', amount: monthlySalary, type: 'base' });
    // TODO: Add other earnings like bonus, overtime based on other HR data (e.g., timesheets, bonus approvals)

    let currentGross = monthlySalary; // Sum of all earnings
    // Example Simplified Tax Deduction
    const taxAmount = currentGross * 0.20; // Super simplified 20% tax
    deductions.push({ description: 'Income Tax (Mock)', amount: taxAmount, type: 'statutory_tax' });
    // TODO: Add other deductions (social security, pension, health, etc.)

    const currentTotalDeductions = taxAmount; // Sum of all deductions
    const netPay = currentGross - currentTotalDeductions;

    const payslip: Payslip = {
      id: randomUUID(),
      tenantId: run.tenantId,
      payrollRunId: run.id,
      employeeId: emp.id,
      employeeInfoSnapshot: { firstName: emp.firstName, lastName: emp.lastName, employeeNumber: emp.employeeNumber, jobTitle: emp.jobTitle },
      payPeriodStartDate: run.payPeriodStartDate,
      payPeriodEndDate: run.payPeriodEndDate,
      paymentDate: run.paymentDate,
      grossEarnings: currentGross,
      totalDeductions: currentTotalDeductions,
      netPay,
      earnings: grossEarnings,
      deductions,
      createdAt: new Date()
    };
    payslipsForRun.push(payslip);
    mockPayslips.push(payslip); // Add to global mock store

    totalGrossForRun += currentGross;
    totalDeductionsForRun += currentTotalDeductions;
    totalNetForRun += netPay;
  }

  run.status = 'completed';
  run.totalEmployeesProcessed = payslipsForRun.length;
  run.totalGrossPay = totalGrossForRun;
  run.totalDeductions = totalDeductionsForRun;
  run.totalNetPay = totalNetForRun;
  run.updatedAt = new Date();

  // Post to Finance (conceptual journal)
  const journalLines: PayrollJournalLine[] = [
    { glAccountId: 'gl-salary-expense', amount: totalGrossForRun, type: 'debit', description: `Payroll Run ${run.id} - Gross Pay`},
    { glAccountId: 'gl-tax-payable', amount: totalDeductionsForRun, type: 'credit', description: `Payroll Run ${run.id} - Taxes Payable`}, // Simplified
    { glAccountId: 'gl-cash-bank', amount: totalNetForRun, type: 'credit', description: `Payroll Run ${run.id} - Net Pay Disbursed`}
  ];
  const journalPayload: PayrollJournalPayload = { payrollRunId: run.id, transactionDate: run.paymentDate, description: `Payroll for period ${run.payPeriodStartDate.toISOString().split('T')[0]} to ${run.payPeriodEndDate.toISOString().split('T')[0]}`, lines: journalLines };
  await FinanceIntegrationService.postPayrollJournal(run.tenantId, run.id, journalPayload);
  console.log(`Payroll processing completed for run ${run.id}`);
}


export const initiatePayrollRun = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, payPeriodStartDate, payPeriodEndDate, paymentDate } = req.body;
  if (!tenantId || !payPeriodStartDate || !payPeriodEndDate || !paymentDate) {
    res.status(400).json({ message: 'Missing required fields for payroll run.' });
    return;
  }
  const newRun: PayrollRun = {
    id: randomUUID(), tenantId,
    payPeriodStartDate: new Date(payPeriodStartDate),
    payPeriodEndDate: new Date(payPeriodEndDate),
    paymentDate: new Date(paymentDate),
    status: 'processing' as PayrollRunStatus, // Mark as processing immediately for mock
    createdAt: new Date(), updatedAt: new Date()
  };
  mockPayrollRuns.push(newRun);

  // In a real app, this would be an async job. Here we call it directly for mock.
  // Fetch employees for the tenant for this run - using the shared mockEmployeesForPayroll for now
  const employeesForRun = mockEmployeesForPayroll.filter(e => e.tenantId === tenantId);
  processPayrollForRun(newRun, employeesForRun).catch(err => {
      console.error(`Error during background mock payroll processing for run ${newRun.id}:`, err);
      newRun.status = 'failed';
      newRun.notes = err.message;
      newRun.updatedAt = new Date();
  });

  res.status(202).json({ message: "Payroll run initiated and processing.", run: newRun }); // 202 Accepted
};

export const getPayrollRunStatus = async (req: Request, res: Response): Promise<void> => {
    const { runId } = req.params;
    const { tenantId } = req.query; // Or from auth context
    const run = mockPayrollRuns.find(r => r.id === runId && r.tenantId === tenantId);
    if (run) {
        res.json({ id: run.id, status: run.status, payPeriodStartDate: run.payPeriodStartDate, payPeriodEndDate: run.payPeriodEndDate, paymentDate: run.paymentDate, totalEmployeesProcessed: run.totalEmployeesProcessed, totalNetPay: run.totalNetPay });
    } else {
        res.status(404).json({ message: 'Payroll run not found.'});
    }
};

export const getPayslipsForRun = async (req: Request, res: Response): Promise<void> => {
    const { runId } = req.params;
    const { tenantId } = req.query; // Or from auth context
    // Ensure this run belongs to the tenant if tenantId is part of security context
    const runExists = mockPayrollRuns.find(r => r.id === runId && r.tenantId === tenantId);
    if (!runExists) {
        res.status(404).json({ message: 'Payroll run not found for this tenant.' });
        return;
    }
    const payslips = mockPayslips.filter(p => p.payrollRunId === runId && p.tenantId === tenantId);
    res.json(payslips);
};

export const getEmployeePayslip = async (req: Request, res: Response): Promise<void> => {
    const { payslipId } = req.params;
    const { tenantId, employeeId } = req.query; // Or from auth context
    const payslip = mockPayslips.find(p => p.id === payslipId && p.tenantId === tenantId && p.employeeId === employeeId);
    if (payslip) {
        res.json(payslip);
    } else {
        res.status(404).json({ message: 'Payslip not found.' });
    }
};

// TODO: Controllers for approving payroll runs, rolling back runs, etc.
