import { Request, Response } from 'express';
import { pool } from '../config/database';

export class DashboardController {

  async getFinancialKPIs(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      // Get current month and previous month for comparison
      const currentMonth = new Date();
      const previousMonth = new Date();
      previousMonth.setMonth(currentMonth.getMonth() - 1);

      // Revenue KPI
      const revenueQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', invoice_date) = DATE_TRUNC('month', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as current_revenue,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', invoice_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN total_amount ELSE 0 END), 0) as previous_revenue
        FROM ar_invoices 
        WHERE tenant_id = $1 AND status = 'PAID'
      `;

      // Expenses KPI
      const expensesQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', invoice_date) = DATE_TRUNC('month', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as current_expenses,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', invoice_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN total_amount ELSE 0 END), 0) as previous_expenses
        FROM ap_invoices 
        WHERE tenant_id = $1 AND status = 'PAID'
      `;

      // Cash Balance
      const cashQuery = `
        SELECT COALESCE(SUM(balance), 0) as cash_balance
        FROM chart_of_accounts 
        WHERE tenant_id = $1 AND account_type = 'ASSET' AND account_code LIKE '1000%'
      `;

      // Accounts Receivable
      const arQuery = `
        SELECT COALESCE(SUM(total_amount - paid_amount), 0) as ar_balance
        FROM ar_invoices 
        WHERE tenant_id = $1 AND status IN ('SENT', 'OVERDUE')
      `;

      // Accounts Payable
      const apQuery = `
        SELECT COALESCE(SUM(total_amount - paid_amount), 0) as ap_balance
        FROM ap_invoices 
        WHERE tenant_id = $1 AND status IN ('PENDING', 'APPROVED', 'OVERDUE')
      `;

      // Execute all queries in parallel
      const [revenueResult, expensesResult, cashResult, arResult, apResult] = await Promise.all([
        pool.query(revenueQuery, [tenantId]),
        pool.query(expensesQuery, [tenantId]),
        pool.query(cashQuery, [tenantId]),
        pool.query(arQuery, [tenantId]),
        pool.query(apQuery, [tenantId])
      ]);

      const revenue = revenueResult.rows[0];
      const expenses = expensesResult.rows[0];
      const cash = parseFloat(cashResult.rows[0].cash_balance);
      const ar = parseFloat(arResult.rows[0].ar_balance);
      const ap = parseFloat(apResult.rows[0].ap_balance);

      const currentRevenue = parseFloat(revenue.current_revenue);
      const previousRevenue = parseFloat(revenue.previous_revenue);
      const currentExpenses = parseFloat(expenses.current_expenses);
      const previousExpenses = parseFloat(expenses.previous_expenses);

      // Calculate trends
      const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const expensesTrend = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
      const netProfit = currentRevenue - currentExpenses;
      const previousNetProfit = previousRevenue - previousExpenses;
      const profitTrend = previousNetProfit > 0 ? ((netProfit - previousNetProfit) / previousNetProfit) * 100 : 0;

      const kpis = {
        revenue: {
          value: currentRevenue,
          trend: revenueTrend,
          currency: 'KES'
        },
        expenses: {
          value: currentExpenses,
          trend: expensesTrend,
          currency: 'KES'
        },
        netProfit: {
          value: netProfit,
          trend: profitTrend,
          currency: 'KES'
        },
        cash: {
          value: cash,
          trend: 5.4, // This would need historical data to calculate properly
          currency: 'KES'
        },
        accountsReceivable: {
          value: ar,
          trend: -2.1, // This would need historical data
          currency: 'KES'
        },
        accountsPayable: {
          value: ap,
          trend: -8.3, // This would need historical data
          currency: 'KES'
        }
      };

      res.json({ success: true, data: kpis });
    } catch (error) {
      console.error('Error fetching financial KPIs:', error);
      res.status(500).json({ error: 'Failed to fetch financial KPIs' });
    }
  }

  async getRecentTransactions(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const query = `
        SELECT 
          'AR' as type,
          p.payment_number as reference,
          c.name as party,
          p.amount,
          p.payment_date as date,
          p.payment_method as method,
          'Received' as direction
        FROM ar_payments p
        JOIN customers c ON p.customer_id = c.id
        WHERE p.tenant_id = $1
        
        UNION ALL
        
        SELECT 
          'AP' as type,
          p.payment_number as reference,
          v.name as party,
          p.amount,
          p.payment_date as date,
          p.payment_method as method,
          'Paid' as direction
        FROM ap_payments p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.tenant_id = $1
        
        ORDER BY date DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [tenantId, limit]);
      
      const transactions = result.rows.map(row => ({
        id: `${row.type}-${row.reference}`,
        type: row.type,
        reference: row.reference,
        party: row.party,
        amount: parseFloat(row.amount),
        date: row.date,
        method: row.method,
        direction: row.direction
      }));

      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      res.status(500).json({ error: 'Failed to fetch recent transactions' });
    }
  }

  async getOutstandingItems(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      // Get overdue invoices
      const overdueInvoicesQuery = `
        SELECT 
          'invoice' as type,
          invoice_number as reference,
          c.name as party,
          (total_amount - paid_amount) as amount,
          due_date,
          CURRENT_DATE - due_date as days_overdue
        FROM ar_invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.tenant_id = $1 
          AND i.status = 'OVERDUE'
          AND (total_amount - paid_amount) > 0
        ORDER BY days_overdue DESC
        LIMIT 5
      `;

      // Get overdue bills
      const overdueBillsQuery = `
        SELECT 
          'bill' as type,
          invoice_number as reference,
          v.name as party,
          (total_amount - paid_amount) as amount,
          due_date,
          CURRENT_DATE - due_date as days_overdue
        FROM ap_invoices i
        JOIN vendors v ON i.vendor_id = v.id
        WHERE i.tenant_id = $1 
          AND i.status = 'OVERDUE'
          AND (total_amount - paid_amount) > 0
        ORDER BY days_overdue DESC
        LIMIT 5
      `;

      const [invoicesResult, billsResult] = await Promise.all([
        pool.query(overdueInvoicesQuery, [tenantId]),
        pool.query(overdueBillsQuery, [tenantId])
      ]);

      const outstandingItems = [
        ...invoicesResult.rows.map(row => ({
          id: `${row.type}-${row.reference}`,
          type: row.type,
          reference: row.reference,
          party: row.party,
          amount: parseFloat(row.amount),
          dueDate: row.due_date,
          daysOverdue: parseInt(row.days_overdue)
        })),
        ...billsResult.rows.map(row => ({
          id: `${row.type}-${row.reference}`,
          type: row.type,
          reference: row.reference,
          party: row.party,
          amount: parseFloat(row.amount),
          dueDate: row.due_date,
          daysOverdue: parseInt(row.days_overdue)
        }))
      ].sort((a, b) => b.daysOverdue - a.daysOverdue);

      res.json({ success: true, data: outstandingItems });
    } catch (error) {
      console.error('Error fetching outstanding items:', error);
      res.status(500).json({ error: 'Failed to fetch outstanding items' });
    }
  }

  async getAlerts(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const alerts = [];

      // Check for overdue invoices
      const overdueInvoicesQuery = `
        SELECT COUNT(*) as count, SUM(total_amount - paid_amount) as amount
        FROM ar_invoices 
        WHERE tenant_id = $1 AND status = 'OVERDUE'
      `;

      // Check for overdue bills
      const overdueBillsQuery = `
        SELECT COUNT(*) as count, SUM(total_amount - paid_amount) as amount
        FROM ap_invoices 
        WHERE tenant_id = $1 AND status = 'OVERDUE'
      `;

      // Check for low cash balance
      const cashQuery = `
        SELECT SUM(balance) as cash_balance
        FROM chart_of_accounts 
        WHERE tenant_id = $1 AND account_type = 'ASSET' AND account_code LIKE '1000%'
      `;

      const [overdueInvoicesResult, overdueBillsResult, cashResult] = await Promise.all([
        pool.query(overdueInvoicesQuery, [tenantId]),
        pool.query(overdueBillsQuery, [tenantId]),
        pool.query(cashQuery, [tenantId])
      ]);

      const overdueInvoices = overdueInvoicesResult.rows[0];
      const overdueBills = overdueBillsResult.rows[0];
      const cashBalance = parseFloat(cashResult.rows[0].cash_balance || '0');

      if (parseInt(overdueInvoices.count) > 0) {
        alerts.push({
          id: 'overdue-invoices',
          type: 'warning',
          title: 'Overdue Invoices',
          message: `${overdueInvoices.count} invoices are overdue (KES ${parseFloat(overdueInvoices.amount || '0').toLocaleString()})`,
          action: 'View Overdue Invoices'
        });
      }

      if (parseInt(overdueBills.count) > 0) {
        alerts.push({
          id: 'overdue-bills',
          type: 'error',
          title: 'Overdue Bills',
          message: `${overdueBills.count} bills are overdue (KES ${parseFloat(overdueBills.amount || '0').toLocaleString()})`,
          action: 'View Overdue Bills'
        });
      }

      if (cashBalance < 100000) { // Alert if cash balance is below 100K
        alerts.push({
          id: 'low-cash',
          type: 'warning',
          title: 'Low Cash Balance',
          message: `Cash balance is low (KES ${cashBalance.toLocaleString()})`,
          action: 'Review Cash Flow'
        });
      }

      res.json({ success: true, data: alerts });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }
} 