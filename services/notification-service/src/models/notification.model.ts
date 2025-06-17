export type NotificationChannel = 'email' | 'sms' | 'push_notification' | 'webhook';

export interface RecipientDetails {
  userId?: string; // If linked to a user in user-service
  tenantId?: string;
  emailAddress?: string;
  phoneNumber?: string; // E.164 format
  pushDeviceTokens?: string[]; // For mobile push
  webhookUrl?: string;
}

export interface MessageContent {
  subject?: string; // For email
  body: string; // Can be plain text, HTML for email, or JSON for webhooks
  // Add channel-specific options if needed
}

export interface NotificationRequest {
  id: string; // UUID for tracking this request
  tenantId: string; // For context and potentially billing/rate limiting
  channel: NotificationChannel;
  recipient: RecipientDetails;
  content?: MessageContent; // Direct content
  templateId?: string; // ID of a pre-defined template
  templateData?: Record<string, any>; // Data to populate the template
  sendAt?: Date; // For scheduled notifications
  priority?: 'high' | 'normal' | 'low';
  metadata?: Record<string, any>; // For additional tracking info
}

export interface NotificationStatusInfo {
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read'; // Simplified
  providerMessageId?: string;
  errorDetails?: string;
  timestamp: Date;
}

export interface NotificationAttempt extends NotificationStatusInfo {
  attemptNumber: number;
}

// This could be stored to track the lifecycle of a notification
export interface NotificationLog extends NotificationRequest {
  statusHistory: NotificationAttempt[];
  finalStatus: 'sent' | 'failed' | 'delivered'; // Simplified overall status
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface MessageTemplate {
  id: string; // UUID or human-readable ID
  tenantId?: string; // Can be global or tenant-specific
  name: string;
  description?: string;
  channelDefaults: Partial<Record<NotificationChannel, { subjectFormat?: string; bodyFormat: string }>>;
  requiredDataFields?: string[]; // Fields needed by the template
  createdAt: Date;
  updatedAt: Date;
}
