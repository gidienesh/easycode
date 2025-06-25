export type ActivityDirection = 'inbound' | 'outbound' | 'internal';
export type ActivityVisibility = 'private' | 'team' | 'tenant-wide';
export type ActivityType = 'email' | 'call' | 'sms' | 'whatsapp' | 'note' | 'meeting';

export interface BaseActivity {
  activityId: string;
  tenantId: string;
  contactId?: string;
  accountId?: string;
  userId?: string;
  activityTimestamp: Date;
  direction: ActivityDirection;
  summary?: string;
  visibility: ActivityVisibility;
  activityType: ActivityType;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailActivity extends BaseActivity {
  activityType: 'email';
  subject?: string;
  fromAddress: string;
  toAddresses: string[];
  ccAddresses?: string[];
  bccAddresses?: string[];
  bodyPreview?: string;
  bodyStorageRef?: string;
  threadId?: string;
  gatewayMessageId?: string;
  attachments?: Array<{ fileName: string; size: number; storageRef: string }>;
}

export interface CallActivity extends BaseActivity {
  activityType: 'call';
  fromPhoneNumber?: string;
  toPhoneNumber: string;
  durationSeconds?: number;
  outcome?: string;
  recordingStorageRef?: string;
  callNotesStorageRef?: string;
}

export interface SmsActivity extends BaseActivity {
  activityType: 'sms';
  fromNumber: string;
  toNumber: string;
  body?: string;
  gatewayMessageId?: string;
  status?: string;
}

export interface WhatsAppActivity extends BaseActivity {
  activityType: 'whatsapp';
  fromId: string;
  toId: string;
  messageBody?: string;
  conversationId?: string;
  messageType?: string;
  mediaStorageRef?: string;
}

export interface NoteActivity extends BaseActivity {
  activityType: 'note';
  title?: string;
  content?: string;
  contentStorageRef?: string;
  isPinned?: boolean;
}

export interface MeetingActivity extends BaseActivity {
  activityType: 'meeting';
  subject: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  internalAttendees?: string[];
  externalAttendees?: Array<{ name?: string; email?: string; phone?: string }>;
  meetingNotesStorageRef?: string;
}

export type Activity = EmailActivity | CallActivity | SmsActivity | WhatsAppActivity | NoteActivity | MeetingActivity;

// Contact and Account types
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  accountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Communication UI types (for the frontend)
export interface CommunicationCard {
  id: string;
  type: ActivityType;
  title?: string;
  subject?: string;
  message?: string;
  from?: string;
  to?: string;
  timestamp: Date;
  status: string;
  direction: ActivityDirection;
  contact?: string;
  company?: string;
  attachments?: string[];
  media?: string;
  duration?: number;
  read?: boolean;
  starred?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// Filter types
export interface CommunicationFilters {
  type?: ActivityType;
  direction?: ActivityDirection;
  status?: string;
  contactId?: string;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Form types for creating communications
export interface EmailFormData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments?: File[];
  contactId?: string;
  accountId?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface WhatsAppFormData {
  to: string;
  message: string;
  media?: File;
  contactId?: string;
  accountId?: string;
}

export interface SMSFormData {
  to: string;
  message: string;
  contactId?: string;
  accountId?: string;
}

export interface CallFormData {
  to: string;
  from?: string;
  duration?: number;
  notes?: string;
  recording?: File;
  outcome?: string;
  contactId?: string;
  accountId?: string;
}

export interface MeetingFormData {
  subject: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  description?: string;
  contactId?: string;
  accountId?: string;
} 