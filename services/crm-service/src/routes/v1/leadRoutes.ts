import express from 'express';
import { createLead, getLeads } from '../../controllers/lead.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder for actual auth

const router = express.Router();

// router.use(authenticate); // Apply auth to all lead routes

router.post('/', createLead);
router.get('/', getLeads);

// TODO: Add routes for getLeadById, updateLead, deleteLead
// TODO: Add route for GET /reports/employee-lead-referrals

export default router;
