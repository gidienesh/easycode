import { Request, Response } from 'express';
import { RegisterSession } from '../models';
import { randomUUID } from 'crypto';

const mockRegisterSessions: RegisterSession[] = [];

export const openRegisterSession = async (req: Request, res: Response): Promise<void> => {
    const { registerId } = req.params;
    const { tenantId, cashierId, openingFloatAmount } = req.body;

    if (!tenantId || !cashierId || openingFloatAmount === undefined) {
        res.status(400).json({ message: 'Missing required fields: tenantId, cashierId, openingFloatAmount.' });
        return;
    }

    // Check if there's already an open session for this register
    const existingOpenSession = mockRegisterSessions.find(s => s.registerId === registerId && s.tenantId === tenantId && s.status === 'open');
    if (existingOpenSession) {
        res.status(409).json({ message: `Register ${registerId} already has an open session (ID: ${existingOpenSession.id}).` });
        return;
    }

    const newSession: RegisterSession = {
        id: randomUUID(),
        tenantId,
        registerId,
        cashierId,
        openingTimestamp: new Date(),
        openingFloatAmount: Number(openingFloatAmount),
        status: 'open',
    };
    mockRegisterSessions.push(newSession);
    res.status(201).json(newSession);
};

export const closeRegisterSession = async (req: Request, res: Response): Promise<void> => {
    const { registerId } = req.params;
    const { tenantId, cashierId, actualCashAtClose } = req.body; // cashierId closing might be different from opening

    if (!tenantId || !cashierId || actualCashAtClose === undefined) {
        res.status(400).json({ message: 'Missing required fields: tenantId, cashierId (closing), actualCashAtClose.' });
        return;
    }

    const sessionIndex = mockRegisterSessions.findIndex(s => s.registerId === registerId && s.tenantId === tenantId && s.status === 'open');
    if (sessionIndex === -1) {
        res.status(404).json({ message: `No open session found for register ${registerId}.` });
        return;
    }

    const session = mockRegisterSessions[sessionIndex];
    session.closingTimestamp = new Date();
    session.actualCashAtClose = Number(actualCashAtClose);
    session.closedByUserId = cashierId; // Assuming the request body cashierId is the closer

    // Simplified calculation for expected cash. Real app would sum payments from SaleTransactions within session.
    // This part is highly conceptual for mock as we don't have sales linked to sessions yet.
    let expectedCashSales = 0; // = sum of 'cash' PaymentDetails from sales in this session
    session.closingFloatAmount = session.openingFloatAmount + expectedCashSales; // Simplified
    session.discrepancyAmount = session.actualCashAtClose - session.closingFloatAmount;
    session.status = session.discrepancyAmount === 0 ? 'closed' : 'discrepancy'; // Or 'reconciled' if a separate step

    // TODO: Aggregate sales data for X/Z report if storing summaries on session.
    // TODO: Potentially trigger EOD financial posting to finance-service.

    mockRegisterSessions[sessionIndex] = session;
    res.json(session);
};

export const getRegisterSession = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    const { tenantId, registerId } = req.query; // For context/filtering

    const session = mockRegisterSessions.find(s =>
        s.id === sessionId &&
        s.tenantId === tenantId &&
        s.registerId === registerId
    );

    if (session) {
        res.json(session);
    } else {
        res.status(404).json({ message: 'Register session not found.' });
    }
};

// TODO: Add controllers for session reconciliation, printing X/Z reports.
