import express from 'express';
import {
    createLeaveRequest,
    getLeaveRequestsForEmployee,
    updateLeaveRequestStatus,
    getLeaveBalancesForEmployee
    // TODO: getLeaveRequestById
} from '../../controllers/leave.controller';
// import { authenticate, authorizeHR } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all leave routes

router.post('/requests', createLeaveRequest);
router.get('/requests/employee/:employeeId', getLeaveRequestsForEmployee); // Or /my-requests using authenticated user
router.put('/requests/:leaveRequestId/status', updateLeaveRequestStatus); // Likely restricted (manager/HR)
// router.get('/requests/:leaveRequestId', getLeaveRequestById);

router.get('/balances/employee/:employeeId', getLeaveBalancesForEmployee); // Or /my-balances

// TODO: Admin routes for managing LeaveTypes

export default router;
