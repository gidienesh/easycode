import { Request, Response } from 'express';
import { LeaveRequest, LeaveBalance, LeaveType, LeaveRequestStatus } from '../models';
import { randomUUID } from 'crypto';

const mockLeaveTypes: LeaveType[] = [
    { id: 'annual_leave', tenantId: 'global', name: 'Annual Leave', isPaid: true, accrualRatePerYear: 20, maxBalance: 40, requiresApproval: true, effectiveDate: new Date('2000-01-01'), isActive: true },
    { id: 'sick_leave', tenantId: 'global', name: 'Sick Leave', isPaid: true, accrualRatePerYear: 10, requiresApproval: false, effectiveDate: new Date('2000-01-01'), isActive: true },
];
const mockLeaveRequests: LeaveRequest[] = [];
const mockLeaveBalances: LeaveBalance[] = []; // In a real system, this is calculated or updated by accruals and taken leave.

// Helper to calculate requested days (simplified, ignores weekends/holidays for mock)
const calculateRequestedDays = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start and end date
};

export const createLeaveRequest = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, employeeId, leaveTypeId, startDate, endDate, reason } = req.body as Omit<LeaveRequest, 'id'|'status'|'createdAt'|'updatedAt'|'requestedDays'>;

    if (!tenantId || !employeeId || !leaveTypeId || !startDate || !endDate) {
        res.status(400).json({ message: 'Missing required fields for leave request.' });
        return;
    }

    const leaveType = mockLeaveTypes.find(lt => lt.id === leaveTypeId && (lt.tenantId === tenantId || lt.tenantId === 'global'));
    if (!leaveType) {
        res.status(400).json({ message: 'Invalid leave type.' });
        return;
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (eDate < sDate) {
        res.status(400).json({ message: 'End date cannot be before start date.' });
        return;
    }

    const requestedDays = calculateRequestedDays(sDate, eDate);

    // Basic balance check (simplified)
    // const balance = mockLeaveBalances.find(b => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId);
    // if (!balance || balance.balanceDays < requestedDays) {
    //     // res.status(400).json({ message: 'Insufficient leave balance.'});
    //     // return;
    // } // For mock, we'll allow it.

    const newRequest: LeaveRequest = {
        id: randomUUID(),
        tenantId, employeeId, leaveTypeId, startDate: sDate, endDate: eDate, reason,
        requestedDays,
        status: leaveType.requiresApproval ? 'pending' as LeaveRequestStatus : 'approved_by_hr' as LeaveRequestStatus, // Auto-approve if no approval needed
        createdAt: new Date(),
        updatedAt: new Date()
    };
    mockLeaveRequests.push(newRequest);

    // Conceptually, deduct from balance if auto-approved, or upon final approval.
    // if (newRequest.status === 'approved_by_hr') { /* update balance */ }

    res.status(201).json(newRequest);
};

export const getLeaveRequestsForEmployee = async (req: Request, res: Response): Promise<void> => {
    const { employeeId } = req.params;
    const { tenantId, status } = req.query; // tenantId from auth context in real app

    let requests = mockLeaveRequests.filter(lr => lr.employeeId === employeeId && lr.tenantId === tenantId);
    if (status) {
        requests = requests.filter(lr => lr.status === status);
    }
    res.json(requests);
};

export const updateLeaveRequestStatus = async (req: Request, res: Response): Promise<void> => {
    const { leaveRequestId } = req.params;
    const { status, comments, approverUserId } = req.body; // tenantId from auth context
    const { tenantId } = req.query; // Or from user's claims

    const requestIndex = mockLeaveRequests.findIndex(lr => lr.id === leaveRequestId && lr.tenantId === tenantId);
    if (requestIndex === -1) {
        res.status(404).json({ message: 'Leave request not found.' });
        return;
    }

    mockLeaveRequests[requestIndex].status = status as LeaveRequestStatus;
    mockLeaveRequests[requestIndex].comments = comments || mockLeaveRequests[requestIndex].comments;
    if (status.startsWith('approved')) {
        mockLeaveRequests[requestIndex].approvedByUserId = approverUserId || mockLeaveRequests[requestIndex].approvedByUserId;
        // Conceptually deduct from leave balance here
    }
    mockLeaveRequests[requestIndex].updatedAt = new Date();
    res.json(mockLeaveRequests[requestIndex]);
};

export const getLeaveBalancesForEmployee = async (req: Request, res: Response): Promise<void> => {
    const { employeeId } = req.params;
    const { tenantId } = req.query; // Or from auth context
    // This is highly simplified. Real balances are calculated based on accruals and taken leave.
    // For mock, we can return some defaults based on available leave types.
    const balances: LeaveBalance[] = mockLeaveTypes
        .filter(lt => lt.isActive && (lt.tenantId === tenantId || lt.tenantId === 'global'))
        .map(lt => {
            const existingBalance = mockLeaveBalances.find(b => b.employeeId === employeeId && b.leaveTypeId === lt.id && b.tenantId === tenantId);
            return existingBalance || {
                id: randomUUID(),
                tenantId: tenantId as string,
                employeeId,
                leaveTypeId: lt.id,
                balanceDays: lt.accrualRatePerYear || 10, // Mock starting balance
                lastAccrualDate: new Date(), // Mock
                updatedAt: new Date()
            };
        });
    res.json(balances);
};

// TODO: Controllers for managing LeaveTypes (admin), processing leave accruals (batch job).
