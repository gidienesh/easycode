// import { createLead, getLeads } from '../../src/controllers/lead.controller';
// import { CrmEventPublisher } from '../../src/events/crmEventPublisher.service'; // Mock this
// Mock express req, res

describe('LeadController Unit Tests', () => {
  // beforeEach(() => { jest.clearAllMocks(); });

  describe('createLead', () => {
    it('should create a lead and return it', async () => {
      // const mockReq = { body: { tenantId: 't1', lastName: 'Doe', status: 'new', leadSource: 'web_form' } } as any;
      // const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
      // await createLead(mockReq, mockRes);
      // expect(mockRes.status).toHaveBeenCalledWith(201);
      // expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ lastName: 'Doe' }));
    });

    it('should publish LeadReferredAndConverted event if referred lead is converted', async () => {
      // const mockReq = { body: { tenantId: 't1', lastName: 'Doe', status: 'converted', leadSource: 'internal_employee_referral', referred_by_employee_id: 'emp1' } } as any;
      // const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
      // jest.spyOn(CrmEventPublisher, 'publishLeadReferredAndConverted'); //.mockResolvedValueOnce(undefined);
      // await createLead(mockReq, mockRes);
      // expect(CrmEventPublisher.publishLeadReferredAndConverted).toHaveBeenCalled();
    });
  });
  describe('getLeads', () => { /* ... tests for filtering ... */ });
});
