import { Request, Response } from 'express';
import { Activity, EmailActivity, CallActivity, SmsActivity, WhatsAppActivity, MeetingActivity } from '../models';
import { S3StorageService } from '../services/s3Storage.service';

// Mock storage for communications (in production, this would be a database)
const mockCommunications: Activity[] = [
  // Email communications
  {
    activityId: 'email-1',
    tenantId: 'tenant-1',
    contactId: 'contact-1',
    accountId: 'account-1',
    userId: 'user-1',
    activityTimestamp: new Date('2024-06-10T09:30:00Z'),
    direction: 'outbound',
    summary: 'Project Proposal - Apex Steel Switchgear',
    visibility: 'team',
    activityType: 'email',
    createdAt: new Date('2024-06-10T09:30:00Z'),
    updatedAt: new Date('2024-06-10T09:30:00Z'),
    subject: 'Project Proposal - Apex Steel Switchgear',
    fromAddress: 'grace.njeri@company.com',
    toAddresses: ['jaston.mbohe@apexsteel.co.ke'],
    bodyPreview: 'Dear Jaston, Please find attached our detailed proposal for the switchgear maintenance project...',
    threadId: 'thread-1'
  } as EmailActivity,
  
  {
    activityId: 'email-2',
    tenantId: 'tenant-1',
    contactId: 'contact-2',
    accountId: 'account-2',
    userId: 'user-2',
    activityTimestamp: new Date('2024-06-09T14:15:00Z'),
    direction: 'outbound',
    summary: 'Follow-up on Site Visit',
    visibility: 'team',
    activityType: 'email',
    createdAt: new Date('2024-06-09T14:15:00Z'),
    updatedAt: new Date('2024-06-09T14:15:00Z'),
    subject: 'Follow-up on Site Visit',
    fromAddress: 'peter.otieno@company.com',
    toAddresses: ['contact@marswrigley.co.ke'],
    bodyPreview: 'Thank you for hosting us during the site visit. We have prepared the maintenance schedule...',
    threadId: 'thread-2'
  } as EmailActivity,

  // WhatsApp communications
  {
    activityId: 'whatsapp-1',
    tenantId: 'tenant-1',
    contactId: 'contact-1',
    accountId: 'account-1',
    userId: 'user-1',
    activityTimestamp: new Date('2024-06-10T08:45:00Z'),
    direction: 'outbound',
    summary: 'Meeting confirmation',
    visibility: 'team',
    activityType: 'whatsapp',
    createdAt: new Date('2024-06-10T08:45:00Z'),
    updatedAt: new Date('2024-06-10T08:45:00Z'),
    fromId: 'company-whatsapp',
    toId: 'jaston-whatsapp',
    messageBody: 'Hi Jaston, just confirming our meeting tomorrow at 10 AM. Is that still good for you?',
    conversationId: 'conv-1',
    messageType: 'text'
  } as WhatsAppActivity,

  // SMS communications
  {
    activityId: 'sms-1',
    tenantId: 'tenant-1',
    contactId: 'contact-3',
    accountId: 'account-3',
    userId: 'user-1',
    activityTimestamp: new Date('2024-06-10T07:30:00Z'),
    direction: 'outbound',
    summary: 'Maintenance appointment confirmation',
    visibility: 'team',
    activityType: 'sms',
    createdAt: new Date('2024-06-10T07:30:00Z'),
    updatedAt: new Date('2024-06-10T07:30:00Z'),
    fromNumber: '+254700000001',
    toNumber: '+254700000004',
    body: 'Your maintenance appointment is confirmed for tomorrow at 2 PM. Reply YES to confirm.',
    status: 'delivered'
  } as SmsActivity,

  // Call communications
  {
    activityId: 'call-1',
    tenantId: 'tenant-1',
    contactId: 'contact-1',
    accountId: 'account-1',
    userId: 'user-1',
    activityTimestamp: new Date('2024-06-09T15:20:00Z'),
    direction: 'outbound',
    summary: 'Follow-up call with Jaston',
    visibility: 'team',
    activityType: 'call',
    createdAt: new Date('2024-06-09T15:20:00Z'),
    updatedAt: new Date('2024-06-09T15:20:00Z'),
    fromPhoneNumber: '+254700000001',
    toPhoneNumber: '+254700000002',
    durationSeconds: 450, // 7 minutes 30 seconds
    outcome: 'connected'
  } as CallActivity,

  // Meeting communications
  {
    activityId: 'meeting-1',
    tenantId: 'tenant-1',
    contactId: 'contact-1',
    accountId: 'account-1',
    userId: 'user-1',
    activityTimestamp: new Date('2024-06-11T10:00:00Z'),
    direction: 'outbound',
    summary: 'Project kickoff meeting',
    visibility: 'team',
    activityType: 'meeting',
    createdAt: new Date('2024-06-10T16:00:00Z'),
    updatedAt: new Date('2024-06-10T16:00:00Z'),
    subject: 'Project kickoff meeting',
    startTime: new Date('2024-06-11T10:00:00Z'),
    endTime: new Date('2024-06-11T11:00:00Z'),
    location: 'Conference Room A',
    internalAttendees: ['user-1', 'user-2'],
    externalAttendees: [{ name: 'Jaston Mbohe', email: 'jaston.mbohe@apexsteel.co.ke' }]
  } as MeetingActivity
];

// Helper function to add communication
const addCommunication = <T extends Activity>(communicationData: Omit<T, 'activityId' | 'createdAt' | 'updatedAt'>): T => {
  const newCommunication: T = {
    ...communicationData,
    activityId: `${communicationData.activityType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as T;
  mockCommunications.push(newCommunication);
  return newCommunication;
};

// Get all communications with filters
export const getAllCommunications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, direction, dateFrom, dateTo, contactId, accountId, search } = req.query;
    
    let filtered = [...mockCommunications];

    // Filter by type
    if (type && typeof type === 'string') {
      filtered = filtered.filter(comm => comm.activityType === type);
    }

    // Filter by direction
    if (direction && typeof direction === 'string') {
      filtered = filtered.filter(comm => comm.direction === direction);
    }

    // Filter by contact
    if (contactId && typeof contactId === 'string') {
      filtered = filtered.filter(comm => comm.contactId === contactId);
    }

    // Filter by account
    if (accountId && typeof accountId === 'string') {
      filtered = filtered.filter(comm => comm.accountId === accountId);
    }

    // Filter by date range
    if (dateFrom && typeof dateFrom === 'string') {
      filtered = filtered.filter(comm => new Date(comm.activityTimestamp) >= new Date(dateFrom));
    }

    if (dateTo && typeof dateTo === 'string') {
      filtered = filtered.filter(comm => new Date(comm.activityTimestamp) <= new Date(dateTo));
    }

    // Search functionality
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(comm => {
        const subject = comm.activityType === 'email' ? (comm as EmailActivity).subject : '';
        const summary = comm.summary || '';
        return subject.toLowerCase().includes(searchLower) || 
               summary.toLowerCase().includes(searchLower);
      });
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.activityTimestamp).getTime() - new Date(a.activityTimestamp).getTime());

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
};

// Get communications by type
export const getCommunicationsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const { direction, dateFrom, dateTo, contactId, accountId } = req.query;
    
    let filtered = mockCommunications.filter(comm => comm.activityType === type);

    // Apply additional filters
    if (direction && typeof direction === 'string') {
      filtered = filtered.filter(comm => comm.direction === direction);
    }

    if (contactId && typeof contactId === 'string') {
      filtered = filtered.filter(comm => comm.contactId === contactId);
    }

    if (accountId && typeof accountId === 'string') {
      filtered = filtered.filter(comm => comm.accountId === accountId);
    }

    if (dateFrom && typeof dateFrom === 'string') {
      filtered = filtered.filter(comm => new Date(comm.activityTimestamp) >= new Date(dateFrom));
    }

    if (dateTo && typeof dateTo === 'string') {
      filtered = filtered.filter(comm => new Date(comm.activityTimestamp) <= new Date(dateTo));
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.activityTimestamp).getTime() - new Date(a.activityTimestamp).getTime());

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communications by type' });
  }
};

// Get communication statistics
export const getCommunicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = {
      total: mockCommunications.length,
      email: mockCommunications.filter(c => c.activityType === 'email').length,
      whatsapp: mockCommunications.filter(c => c.activityType === 'whatsapp').length,
      sms: mockCommunications.filter(c => c.activityType === 'sms').length,
      calls: mockCommunications.filter(c => c.activityType === 'call').length,
      meetings: mockCommunications.filter(c => c.activityType === 'meeting').length,
      notes: mockCommunications.filter(c => c.activityType === 'note').length,
      inbound: mockCommunications.filter(c => c.direction === 'inbound').length,
      outbound: mockCommunications.filter(c => c.direction === 'outbound').length,
      internal: mockCommunications.filter(c => c.direction === 'internal').length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communication statistics' });
  }
};

// Get communication by ID
export const getCommunicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const communication = mockCommunications.find(c => c.activityId === id);
    
    if (!communication) {
      res.status(404).json({ error: 'Communication not found' });
      return;
    }

    res.json(communication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communication' });
  }
};

// Update communication
export const updateCommunication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const index = mockCommunications.findIndex(c => c.activityId === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Communication not found' });
      return;
    }

    mockCommunications[index] = {
      ...mockCommunications[index],
      ...updateData,
      updatedAt: new Date(),
    };

    res.json(mockCommunications[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update communication' });
  }
};

// Delete communication
export const deleteCommunication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = mockCommunications.findIndex(c => c.activityId === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Communication not found' });
      return;
    }

    mockCommunications.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete communication' });
  }
};

// Bulk operations
export const bulkDeleteCommunications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'Invalid request: ids must be an array' });
      return;
    }

    const deletedCount = ids.filter(id => {
      const index = mockCommunications.findIndex(c => c.activityId === id);
      if (index !== -1) {
        mockCommunications.splice(index, 1);
        return true;
      }
      return false;
    }).length;

    res.json({ deletedCount, message: `Successfully deleted ${deletedCount} communications` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete communications' });
  }
};

// Export communications
export const exportCommunications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format = 'json', filters } = req.query;
    
    let filtered = [...mockCommunications];
    
    // Apply filters if provided
    if (filters && typeof filters === 'string') {
      const filterObj = JSON.parse(filters);
      // Apply filters similar to getAllCommunications
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(filtered);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=communications.csv');
      res.send(csvData);
    } else {
      res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export communications' });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data: Activity[]): string => {
  const headers = ['ID', 'Type', 'Direction', 'Contact ID', 'Account ID', 'Timestamp', 'Summary', 'Created At'];
  const rows = data.map(item => [
    item.activityId,
    item.activityType,
    item.direction,
    item.contactId || '',
    item.accountId || '',
    item.activityTimestamp,
    item.summary || '',
    item.createdAt
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}; 