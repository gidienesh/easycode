import { Router } from "express";
import { AccountService } from '../../services/accountService';

const router = Router();
const accountService = new AccountService();

// Chart of Accounts routes
router.get('/accounts', async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const accounts = await accountService.getAllAccounts(tenantId);
    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

router.get('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const account = await accountService.getAccountById(id, tenantId);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json({ success: true, data: account });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

router.post('/accounts', async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const account = await accountService.createAccount(tenantId, req.body);
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.put('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const account = await accountService.updateAccount(id, tenantId, req.body);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json({ success: true, data: account });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

router.delete('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const deleted = await accountService.deleteAccount(id, tenantId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Search accounts
router.get('/accounts/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const tenantId = req.tenantId;
    const accounts = await accountService.searchAccounts(tenantId, term);
    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error searching accounts:', error);
    res.status(500).json({ error: 'Failed to search accounts' });
  }
});

export default router;
