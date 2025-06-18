export type ActivityDirection = 'inbound' | 'outbound' | 'internal';
export type ActivityVisibility = 'private' | 'team' | 'tenant-wide';
export type ActivityType = 'email' | 'call' | 'sms' | 'whatsapp' | 'note' | 'meeting';

export interface BaseActivity {
  activityId: string; // UUID
  tenantId: string;
  contactId?: string; // FK
  accountId?: string; // FK
  userId?: string; // Stema employee involved
  activityTimestamp: Date;
  direction: ActivityDirection;
  summary?: string;
  visibility: ActivityVisibility;
  activityType: ActivityType; // Discriminator
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
  bodyPreview?: string; // Short preview
  bodyStorageRef?: string; // Ref to full body in R2/object store
  threadId?: string;
  gatewayMessageId?: string;
  attachments?: Array<{ fileName: string; size: number; storageRef: string }>;
}

export interface CallActivity extends BaseActivity {
  activityType: 'call';
  fromPhoneNumber?: string;
  toPhoneNumber: string;
  durationSeconds?: number;
  outcome?: string; // e.g., connected, busy, voicemail
  recordingStorageRef?: string; // Ref to recording in R2
  callNotesStorageRef?: string; // Ref to detailed notes in R2
}

// Simplified SMS and WhatsApp for now, can be expanded
export interface SmsActivity extends BaseActivity {
  activityType: 'sms';
  fromNumber: string;
  toNumber: string;
  body?: string; // Or bodyStorageRef for long messages
  gatewayMessageId?: string;
  status?: string; // e.g., sent, delivered, failed
}

export interface WhatsAppActivity extends BaseActivity {
    activityType: 'whatsapp';
    fromId: string; // WhatsApp ID
    toId: string; // WhatsApp ID
    messageBody?: string; // Or bodyStorageRef
    conversationId?: string;
    messageType?: string; // e.g., text, image, document
    mediaStorageRef?: string; // If media attached
}

export interface NoteActivity extends BaseActivity {
  activityType: 'note';
  title?: string;
  content?: string; // For short notes
  contentStorageRef?: string; // For rich text/long notes in R2
  isPinned?: boolean;
}

export interface MeetingActivity extends BaseActivity {
  activityType: 'meeting';
  subject: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  internalAttendees?: string[]; // User IDs
  externalAttendees?: Array<{ name?: string; email?: string; phone?: string }>;
  meetingNotesStorageRef?: string; // Ref to notes/agenda in R2
}

// Union type for all activities
export type Activity = EmailActivity | CallActivity | SmsActivity | WhatsAppActivity | NoteActivity | MeetingActivity;
