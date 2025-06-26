import { pool } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  accountType?: string;
  customerId?: string;
  vendorId?: string;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface FinancialStatement {
  title: string;
  period: string;
  sections: ReportSection[];
  totals: { [key: string]: number };
}

export interface ReportSection {
  title: string;
  items: ReportItem[];
  subtotal?: number;
}

export interface ReportItem {
  accountCode: string;
  accountName: string;
  amount: number;
  percentage?: number;
}

export class ReportService {

  async generateIncomeStatement(tenantId: string, params: ReportParams): Promise<FinancialStatement> {
    const { startDate, endDate } = params;
    const period = `${startDate} to ${endDate}`;

    // Revenue Section
    const revenueQuery = `
      SELECT 
        coa.account_code,
        coa.account_name,
        COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0) as amount
      FROM chart_of_accounts coa
      LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
      LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE coa.tenant_id = $1 
        AND coa.account_type = 'REVENUE'
        AND coa.is_active = true
        AND ($2::date IS NULL OR je.entry_date >= $2::date)
        AND ($3::date IS NULL OR je.entry_date <= $3::date)
        AND (je.status = 'POSTED' OR je.status IS NULL)
      GROUP BY coa.account_code, coa.account_name
      ORDER BY coa.account_code
    `;

    // Expense Section
    const expenseQuery = `
      SELECT 
        coa.account_code,
        coa.account_name,
        COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as amount
      FROM chart_of_accounts coa
      LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
      LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE coa.tenant_id = $1 
        AND coa.account_type = 'EXPENSE'
        AND coa.is_active = true
        AND ($2::date IS NULL OR je.entry_date >= $2::date)
        AND ($3::date IS NULL OR je.entry_date <= $3::date)
        AND (je.status = 'POSTED' OR je.status IS NULL)
      GROUP BY coa.account_code, coa.account_name
      ORDER BY coa.account_code
    `;

    const [revenueResult, expenseResult] = await Promise.all([
      pool.query(revenueQuery, [tenantId, startDate, endDate]),
      pool.query(expenseQuery, [tenantId, startDate, endDate])
    ]);

    const revenueItems: ReportItem[] = revenueResult.rows.map(row => ({
      accountCode: row.account_code,
      accountName: row.account_name,
      amount: parseFloat(row.amount)
    }));

    const expenseItems: ReportItem[] = expenseResult.rows.map(row => ({
      accountCode: row.account_code,
      accountName: row.account_name,
      amount: parseFloat(row.amount)
    }));

    const totalRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    // Calculate percentages
    revenueItems.forEach(item => {
      item.percentage = totalRevenue > 0 ? (item.amount / totalRevenue) * 100 : 0;
    });

    expenseItems.forEach(item => {
      item.percentage = totalRevenue > 0 ? (item.amount / totalRevenue) * 100 : 0;
    });

    return {
      title: 'Income Statement',
      period,
      sections: [
        {
          title: 'Revenue',
          items: revenueItems,
          subtotal: totalRevenue
        },
        {
          title: 'Expenses',
          items: expenseItems,
          subtotal: totalExpenses
        }
      ],
      totals: {
        totalRevenue,
        totalExpenses,
        netIncome
      }
    };
  }

  async generateBalanceSheet(tenantId: string, params: ReportParams): Promise<FinancialStatement> {
    const { endDate } = params;
    const asOfDate = endDate || new Date().toISOString().split('T')[0];

    // Assets
    const assetsQuery = `
      SELECT 
        coa.account_code,
        coa.account_name,
        coa.balance as amount
      FROM chart_of_accounts coa
      WHERE coa.tenant_id = $1 
        AND coa.account_type = 'ASSET'
        AND coa.is_active = true
      ORDER BY coa.account_code
    `;

    // Liabilities
    const liabilitiesQuery = `
      SELECT 
        coa.account_code,
        coa.account_name,
        coa.balance as amount
      FROM chart_of_accounts coa
      WHERE coa.tenant_id = $1 
        AND coa.account_type = 'LIABILITY'
        AND coa.is_active = true
      ORDER BY coa.account_code
    `;

    // Equity
    const equityQuery = `
      SELECT 
        coa.account_code,
        coa.account_name,
        coa.balance as amount
      FROM chart_of_accounts coa
      WHERE coa.tenant_id = $1 
        AND coa.account_type = 'EQUITY'
        AND coa.is_active = true
      ORDER BY coa.account_code
    `;

    const [assetsResult, liabilitiesResult, equityResult] = await Promise.all([
      pool.query(assetsQuery, [tenantId]),
      pool.query(liabilitiesQuery, [tenantId]),
      pool.query(equityQuery, [tenantId])
    ]);

    const assetItems: ReportItem[] = assetsResult.rows.map(row => ({
      accountCode: row.account_code,
      accountName: row.account_name,
      amount: parseFloat(row.amount)
    }));

    const liabilityItems: ReportItem[] = liabilitiesResult.rows.map(row => ({
      accountCode: row.account_code,
      accountName: row.account_name,
      amount: parseFloat(row.amount)
    }));

    const equityItems: ReportItem[] = equityResult.rows.map(row => ({
      accountCode: row.account_code,
      accountName: row.account_name,
      amount: parseFloat(row.amount)
    }));

    const totalAssets = assetItems.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilityItems.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equityItems.reduce((sum, item) => sum + item.amount, 0);

    return {
      title: 'Balance Sheet',
      period: `As of ${asOfDate}`,
      sections: [
        {
          title: 'Assets',
          items: assetItems,
          subtotal: totalAssets
        },
        {
          title: 'Liabilities',
          items: liabilityItems,
          subtotal: totalLiabilities
        },
        {
          title: 'Equity',
          items: equityItems,
          subtotal: totalEquity
        }
      ],
      totals: {
        totalAssets,
        totalLiabilities,
        totalEquity
      }
    };
  }

  async generateCashFlowStatement(tenantId: string, params: ReportParams): Promise<FinancialStatement> {
    const { startDate, endDate } = params;
    const period = `${startDate} to ${endDate}`;

    // Operating Activities
    const operatingQuery = `
      SELECT 
        'Net Income' as account_name,
        '' as account_code,
        (
          SELECT COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0)
          FROM journal_entry_lines jel
          JOIN journal_entries je ON jel.journal_entry_id = je.id
          JOIN chart_of_accounts coa ON jel.account_id = coa.id
          WHERE coa.tenant_id = $1 
            AND coa.account_type = 'REVENUE'
            AND je.entry_date >= $2::date
            AND je.entry_date <= $3::date
            AND je.status = 'POSTED'
        ) - (
          SELECT COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0)
          FROM journal_entry_lines jel
          JOIN journal_entries je ON jel.journal_entry_id = je.id
          JOIN chart_of_accounts coa ON jel.account_id = coa.id
          WHERE coa.tenant_id = $1 
            AND coa.account_type = 'EXPENSE'
            AND je.entry_date >= $2::date
            AND je.entry_date <= $3::date
            AND je.status = 'POSTED'
        ) as amount
    `;

    // AR Changes
    const arChangesQuery = `
      SELECT 
        'Accounts Receivable Changes' as account_name,
        '' as account_code,
        COALESCE(SUM(
          CASE 
            WHEN i.invoice_date >= $2::date AND i.invoice_date <= $3::date 
            THEN -(i.total_amount - i.paid_amount)
            ELSE 0
          END
        ), 0) as amount
      FROM ar_invoices i
      WHERE i.tenant_id = $1
    `;

    // AP Changes
    const apChangesQuery = `
      SELECT 
        'Accounts Payable Changes' as account_name,
        '' as account_code,
        COALESCE(SUM(
          CASE 
            WHEN i.invoice_date >= $2::date AND i.invoice_date <= $3::date 
            THEN (i.total_amount - i.paid_amount)
            ELSE 0
          END
        ), 0) as amount
      FROM ap_invoices i
      WHERE i.tenant_id = $1
    `;

    const [operatingResult, arResult, apResult] = await Promise.all([
      pool.query(operatingQuery, [tenantId, startDate, endDate]),
      pool.query(arChangesQuery, [tenantId, startDate, endDate]),
      pool.query(apChangesQuery, [tenantId, startDate, endDate])
    ]);

    const operatingItems: ReportItem[] = [
      {
        accountCode: '',
        accountName: 'Net Income',
        amount: parseFloat(operatingResult.rows[0]?.amount || '0')
      },
      {
        accountCode: '',
        accountName: 'Changes in Accounts Receivable',
        amount: parseFloat(arResult.rows[0]?.amount || '0')
      },
      {
        accountCode: '',
        accountName: 'Changes in Accounts Payable',
        amount: parseFloat(apResult.rows[0]?.amount || '0')
      }
    ];

    const netCashFromOperating = operatingItems.reduce((sum, item) => sum + item.amount, 0);

    return {
      title: 'Cash Flow Statement',
      period,
      sections: [
        {
          title: 'Operating Activities',
          items: operatingItems,
          subtotal: netCashFromOperating
        },
        {
          title: 'Investing Activities',
          items: [],
          subtotal: 0
        },
        {
          title: 'Financing Activities',
          items: [],
          subtotal: 0
        }
      ],
      totals: {
        netCashFromOperating,
        netCashFromInvesting: 0,
        netCashFromFinancing: 0,
        netCashFlow: netCashFromOperating
      }
    };
  }

  async generateAgingReport(tenantId: string, type: 'AR' | 'AP', params: ReportParams): Promise<any> {
    const currentDate = new Date();
    
    if (type === 'AR') {
      const query = `
        SELECT 
          c.name as customer_name,
          i.invoice_number,
          i.invoice_date,
          i.due_date,
          (i.total_amount - i.paid_amount) as outstanding_amount,
          CURRENT_DATE - i.due_date as days_overdue,
          CASE 
            WHEN CURRENT_DATE <= i.due_date THEN 'Current'
            WHEN CURRENT_DATE - i.due_date <= 30 THEN '1-30 Days'
            WHEN CURRENT_DATE - i.due_date <= 60 THEN '31-60 Days'
            WHEN CURRENT_DATE - i.due_date <= 90 THEN '61-90 Days'
            ELSE '90+ Days'
          END as aging_bucket
        FROM ar_invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.tenant_id = $1 
          AND i.status IN ('SENT', 'OVERDUE')
          AND (i.total_amount - i.paid_amount) > 0
        ORDER BY c.name, i.due_date
      `;

      const result = await pool.query(query, [tenantId]);
      return this.formatAgingReport(result.rows, 'Accounts Receivable Aging Report');
    } else {
      const query = `
        SELECT 
          v.name as vendor_name,
          i.invoice_number,
          i.invoice_date,
          i.due_date,
          (i.total_amount - i.paid_amount) as outstanding_amount,
          CURRENT_DATE - i.due_date as days_overdue,
          CASE 
            WHEN CURRENT_DATE <= i.due_date THEN 'Current'
            WHEN CURRENT_DATE - i.due_date <= 30 THEN '1-30 Days'
            WHEN CURRENT_DATE - i.due_date <= 60 THEN '31-60 Days'
            WHEN CURRENT_DATE - i.due_date <= 90 THEN '61-90 Days'
            ELSE '90+ Days'
          END as aging_bucket
        FROM ap_invoices i
        JOIN vendors v ON i.vendor_id = v.id
        WHERE i.tenant_id = $1 
          AND i.status IN ('PENDING', 'APPROVED', 'OVERDUE')
          AND (i.total_amount - i.paid_amount) > 0
        ORDER BY v.name, i.due_date
      `;

      const result = await pool.query(query, [tenantId]);
      return this.formatAgingReport(result.rows, 'Accounts Payable Aging Report');
    }
  }

  private formatAgingReport(rows: any[], title: string): any {
    const buckets = ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'];
    const summary = buckets.reduce((acc, bucket) => {
      acc[bucket] = { count: 0, amount: 0 };
      return acc;
    }, {} as any);

    const details = rows.map(row => {
      const amount = parseFloat(row.outstanding_amount);
      summary[row.aging_bucket].count += 1;
      summary[row.aging_bucket].amount += amount;

      return {
        party: row.customer_name || row.vendor_name,
        invoiceNumber: row.invoice_number,
        invoiceDate: row.invoice_date,
        dueDate: row.due_date,
        outstandingAmount: amount,
        daysOverdue: parseInt(row.days_overdue),
        agingBucket: row.aging_bucket
      };
    });

    const totalAmount = Object.values(summary).reduce((sum: number, bucket: any) => sum + bucket.amount, 0);

    return {
      title,
      summary,
      details,
      totalAmount,
      generatedAt: new Date().toISOString()
    };
  }

  async saveReport(tenantId: string, reportData: any, fileName: string): Promise<string> {
    const reportsDir = path.join(process.cwd(), 'reports', tenantId);
    
    // Ensure directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));

    // Save report record to database
    const query = `
      INSERT INTO financial_reports (
        tenant_id,
        report_name,
        report_type,
        generated_at,
        status,
        file_path,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      tenantId,
      reportData.title,
      reportData.title.toLowerCase().replace(/\s+/g, '_'),
      new Date(),
      'COMPLETED',
      filePath,
      '00000000-0000-0000-0000-000000000000' // Default user ID
    ];

    const result = await pool.query(query, values);
    return result.rows[0].id;
  }
} 