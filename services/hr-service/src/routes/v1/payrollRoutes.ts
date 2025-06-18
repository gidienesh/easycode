import express from 'express';
import {
    initiatePayrollRun,
    getPayrollRunStatus,
    getPayslipsForRun,
    getEmployeePayslip
} from '../../controllers/payroll.controller';
// import { authenticate, authorizePayrollAdmin } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate);
// router.use(authorizePayrollAdmin); // Secure payroll routes

router.post('/run', initiatePayrollRun);
router.get('/run/:runId/status', getPayrollRunStatus);
router.get('/run/:runId/payslips', getPayslipsForRun);
router.get('/payslips/:payslipId', getEmployeePayslip); // Needs employee context for security

// TODO: Add routes for approving payroll runs, etc.

export default router;
