import { pool } from '../config/database';
import { ChartOfAccount, CreateAccountDTO, UpdateAccountDTO } from '../models/finance.models';

export class AccountService {
  
  async getAllAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    const query = `
      SELECT 
        id,
        tenant_id,
        account_code,
        account_name,
        account_type,
        parent_account_id,
        balance,
        is_active,
        description,
        created_at,
        updated_at
      FROM chart_of_accounts 
      WHERE tenant_id = $1 AND is_active = true
      ORDER BY account_code
    `;
    
    const result = await pool.query(query, [tenantId]);
    return result.rows.map(row => ({
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async getAccountById(id: string, tenantId: string): Promise<ChartOfAccount | null> {
    const query = `
      SELECT 
        id,
        tenant_id,
        account_code,
        account_name,
        account_type,
        parent_account_id,
        balance,
        is_active,
        description,
        created_at,
        updated_at
      FROM chart_of_accounts 
      WHERE id = $1 AND tenant_id = $2
    `;
    
    const result = await pool.query(query, [id, tenantId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async createAccount(tenantId: string, accountData: CreateAccountDTO): Promise<ChartOfAccount> {
    const query = `
      INSERT INTO chart_of_accounts (
        tenant_id,
        account_code,
        account_name,
        account_type,
        parent_account_id,
        balance,
        description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      tenantId,
      accountData.accountCode,
      accountData.accountName,
      accountData.accountType,
      accountData.parentAccountId || null,
      accountData.balance || 0,
      accountData.description || null
    ];
    
    const result = await pool.query(query, values);
    const row = result.rows[0];
    
    return {
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async updateAccount(id: string, tenantId: string, accountData: UpdateAccountDTO): Promise<ChartOfAccount | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (accountData.accountName !== undefined) {
      fields.push(`account_name = $${paramCount++}`);
      values.push(accountData.accountName);
    }
    
    if (accountData.accountType !== undefined) {
      fields.push(`account_type = $${paramCount++}`);
      values.push(accountData.accountType);
    }
    
    if (accountData.parentAccountId !== undefined) {
      fields.push(`parent_account_id = $${paramCount++}`);
      values.push(accountData.parentAccountId);
    }
    
    if (accountData.balance !== undefined) {
      fields.push(`balance = $${paramCount++}`);
      values.push(accountData.balance);
    }
    
    if (accountData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(accountData.description);
    }
    
    if (accountData.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(accountData.isActive);
    }
    
    if (fields.length === 0) {
      return this.getAccountById(id, tenantId);
    }
    
    fields.push(`updated_at = NOW()`);
    values.push(id, tenantId);
    
    const query = `
      UPDATE chart_of_accounts 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount++} AND tenant_id = $${paramCount++}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async deleteAccount(id: string, tenantId: string): Promise<boolean> {
    // Soft delete by setting is_active to false
    const query = `
      UPDATE chart_of_accounts 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
    `;
    
    const result = await pool.query(query, [id, tenantId]);
    return result.rowCount > 0;
  }

  async getAccountsByType(tenantId: string, accountType: string): Promise<ChartOfAccount[]> {
    const query = `
      SELECT 
        id,
        tenant_id,
        account_code,
        account_name,
        account_type,
        parent_account_id,
        balance,
        is_active,
        description,
        created_at,
        updated_at
      FROM chart_of_accounts 
      WHERE tenant_id = $1 AND account_type = $2 AND is_active = true
      ORDER BY account_code
    `;
    
    const result = await pool.query(query, [tenantId, accountType]);
    return result.rows.map(row => ({
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async updateAccountBalance(id: string, tenantId: string, newBalance: number): Promise<boolean> {
    const query = `
      UPDATE chart_of_accounts 
      SET balance = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;
    
    const result = await pool.query(query, [newBalance, id, tenantId]);
    return result.rowCount > 0;
  }

  async searchAccounts(tenantId: string, searchTerm: string): Promise<ChartOfAccount[]> {
    const query = `
      SELECT 
        id,
        tenant_id,
        account_code,
        account_name,
        account_type,
        parent_account_id,
        balance,
        is_active,
        description,
        created_at,
        updated_at
      FROM chart_of_accounts 
      WHERE tenant_id = $1 
        AND is_active = true
        AND (
          LOWER(account_name) LIKE LOWER($2) 
          OR LOWER(account_code) LIKE LOWER($2)
          OR LOWER(description) LIKE LOWER($2)
        )
      ORDER BY account_code
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await pool.query(query, [tenantId, searchPattern]);
    
    return result.rows.map(row => ({
      id: row.id,
      tenantId: row.tenant_id,
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      parentAccountId: row.parent_account_id,
      balance: parseFloat(row.balance),
      isActive: row.is_active,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }
} 