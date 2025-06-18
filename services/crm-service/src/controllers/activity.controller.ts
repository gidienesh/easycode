import { Request, Response } from 'express';
import { Activity, BaseActivity, EmailActivity, CallActivity, SmsActivity, WhatsAppActivity, NoteActivity, MeetingActivity } from '../models'; // Import specific types as needed
import { S3StorageService } from '../services/s3Storage.service'; // Assuming S3 service for storage refs

const mockActivities: Activity[] = []; // Store activities in memory for mock

// Generic function to add activity, can be specialized if needed
const addActivity = <T extends BaseActivity>(activityData: Omit<T, 'activityId' | 'createdAt' | 'updatedAt'>, activityType: T['activityType']): T => {
  const newActivity: T = {
    ...activityData,
    activityId: `${activityType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as T; // Type assertion might be needed depending on how activityData is structured
  mockActivities.push(newActivity as Activity); // Store as general Activity type
  return newActivity;
};

export const logEmailActivity = async (req: Request, res: Response): Promise<void> => {
  const { body, ...restOfBody } = req.body as Omit<EmailActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'|'bodyStorageRef'>;
  let bodyStorageRef: string | undefined;

  if (body && process.env.R2_BUCKET_NAME) { // Check if body content exists and bucket is configured
    // In a real app, 'body' would be the actual email content string or buffer
    // For mock, we assume 'body' is a placeholder for content that would be uploaded
    const mockEmailBodyContent = typeof body === 'object' ? JSON.stringify(body) : String(body); // Simulate content
    const s3Response = await S3StorageService.upload(
        process.env.R2_BUCKET_NAME,
        `emails/${restOfBody.tenantId}/${Date.now()}.html`, // Example key structure
        mockEmailBodyContent,
        'text/html'
    );
    bodyStorageRef = s3Response.storageRef;
  }

  const activity = addActivity<EmailActivity>({ ...restOfBody, bodyStorageRef, activityType: 'email' }, 'email');
  res.status(201).json(activity);
};

export const logCallActivity = async (req: Request, res: Response): Promise<void> => {
    const callData = req.body as Omit<CallActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'>;
    // Add mock storage for recording/notes if applicable from callData
    const activity = addActivity<CallActivity>({...callData, activityType: 'call'}, 'call');
    res.status(201).json(activity);
};

export const logSmsActivity = async (req: Request, res: Response): Promise<void> => {
    const smsData = req.body as Omit<SmsActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'>;
    const activity = addActivity<SmsActivity>({...smsData, activityType: 'sms'}, 'sms');
    res.status(201).json(activity);
};

export const logWhatsAppActivity = async (req: Request, res: Response): Promise<void> => {
    const whatsAppData = req.body as Omit<WhatsAppActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'>;
    const activity = addActivity<WhatsAppActivity>({...whatsAppData, activityType: 'whatsapp'}, 'whatsapp');
    res.status(201).json(activity);
};

export const logNoteActivity = async (req: Request, res: Response): Promise<void> => {
    const noteData = req.body as Omit<NoteActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'>;
    const activity = addActivity<NoteActivity>({...noteData, activityType: 'note'}, 'note');
    res.status(201).json(activity);
};

export const logMeetingActivity = async (req: Request, res: Response): Promise<void> => {
    const meetingData = req.body as Omit<MeetingActivity, 'activityId'|'activityType'|'createdAt'|'updatedAt'>;
    const activity = addActivity<MeetingActivity>({...meetingData, activityType: 'meeting'}, 'meeting');
    res.status(201).json(activity);
};


export const getActivityFeedForContact = async (req: Request, res: Response): Promise<void> => {
  const { contactId } = req.params;
  const { type, direction, userId, dateFrom, dateTo, visibility } = req.query;

  const feed = mockActivities.filter(act => {
    let matches = true;
    if (act.contactId !== contactId) matches = false;
    if (type && act.activityType !== type) matches = false;
    if (direction && act.direction !== direction) matches = false;
    if (userId && act.userId !== userId) matches = false;
    if (visibility && act.visibility !== visibility) matches = false;
    if (dateFrom && new Date(act.activityTimestamp) < new Date(dateFrom as string)) matches = false;
    if (dateTo && new Date(act.activityTimestamp) > new Date(dateTo as string)) matches = false;
    return matches;
  });
  // TODO: Add sorting and pagination
  res.json(feed);
};

export const getActivityFeedForAccount = async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;
     const { type, direction, userId, dateFrom, dateTo, visibility } = req.query;
    // Similar filtering logic as for contact, but by accountId
    const feed = mockActivities.filter(act => {
        let matches = true;
        if (act.accountId !== accountId) matches = false;
        if (type && act.activityType !== type) matches = false;
        if (direction && act.direction !== direction) matches = false;
        if (userId && act.userId !== userId) matches = false;
        if (visibility && act.visibility !== visibility) matches = false;
        if (dateFrom && new Date(act.activityTimestamp) < new Date(dateFrom as string)) matches = false;
        if (dateTo && new Date(act.activityTimestamp) > new Date(dateTo as string)) matches = false;
        return matches;
    });
    // TODO: Add sorting and pagination
    res.json(feed);
};
