import { Request, Response } from 'express';
import { Lead } from '../models';
import { CrmEventPublisher, LeadReferredAndConvertedPayload } from '../events/crmEventPublisher.service';

const mockLeads: Lead[] = [];

export const createLead = async (req: Request, res: Response): Promise<void> => {
  // It's good practice to pick only expected fields from req.body
  const {
    tenantId,
    firstName,
    lastName,
    email,
    phone,
    companyName,
    status,
    leadSource,
    assignedToUserId,
    referred_by_employee_id,
    referral_details,
    value,
    expectedCloseDate
  } = req.body as Partial<Omit<Lead, 'id'|'createdAt'|'updatedAt'>>;

  if (!tenantId || !lastName || !status || !leadSource) {
    res.status(400).json({ message: "Missing required lead fields: tenantId, lastName, status, leadSource" });
    return;
  }

  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    tenantId,
    lastName,
    status,
    leadSource,
    firstName,
    email,
    phone,
    companyName,
    assignedToUserId,
    referred_by_employee_id,
    referral_details,
    value,
    expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockLeads.push(lead);

  // If lead is created as 'converted' and has referral info, publish event
  if (lead.status === 'converted' && lead.referred_by_employee_id) {
    const eventPayload: LeadReferredAndConvertedPayload = {
        leadId: lead.id,
        tenantId: lead.tenantId,
        referredByEmployeeId: lead.referred_by_employee_id,
        convertedValue: lead.value,
        conversionTimestamp: new Date()
    };
    // In a real app, you'd await this, but for mock, it's fire and forget
    CrmEventPublisher.publishLeadReferredAndConverted(eventPayload);
  }
  res.status(201).json(lead);
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, referredByEmployeeId, isReferred, leadSource, status } = req.query;

    // In a real app, tenantId would likely be derived from auth/session, not a query param for listing
    // Or it would be a mandatory filter for system users.
    if (!tenantId) {
        res.status(400).json({ message: "tenantId query parameter is required."});
        return;
    }

    const filteredLeads = mockLeads.filter(lead =>
        lead.tenantId === tenantId &&
        (!referredByEmployeeId || lead.referred_by_employee_id === referredByEmployeeId) &&
        (!isReferred || (isReferred === 'true' ? !!lead.referred_by_employee_id : !lead.referred_by_employee_id)) &&
        (!leadSource || lead.leadSource === leadSource) &&
        (!status || lead.status === status)
    );
    // TODO: Add sorting and pagination
    res.json(filteredLeads);
};

// TODO: Add getLeadById, updateLead, deleteLead controllers
// TODO: Add controller for GET /v1/reports/employee-lead-referrals (Conceptual)
