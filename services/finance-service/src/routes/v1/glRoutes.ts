import express from 'express';
import {
    createJournalEntry,
    getJournalEntryById,
    getLedgerAccountBalance
    // TODO: Add controllers for COA management
} from '../../controllers/gl.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all GL routes

router.post('/journal-entries', createJournalEntry);
router.get('/journal-entries/:journalEntryId', getJournalEntryById);

router.get('/accounts/:accountId/balance', getLedgerAccountBalance);
// TODO: Add routes for managing LedgerAccounts (CRUD for COA)
// TODO: Add routes for financial reports (Trial Balance, P&L, Balance Sheet)

export default router;
