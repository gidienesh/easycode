import { Request, Response } from 'express';
import { NotificationRequest, NotificationLog, RecipientDetails, MessageContent, NotificationChannel } from '../models';
import { EmailProvider } from '../services/email.provider';
import { SmsProvider } from '../services/sms.provider';
import { TemplateService } from '../services/template.service';
import { randomUUID } from 'crypto'; // Node.js built-in

const mockNotificationLogs: NotificationLog[] = [];

const processNotification = async (reqBody: any): Promise<{ success: boolean; log: NotificationLog }> => {
  const { tenantId, channel, recipient, content, templateId, templateData, ...rest } = reqBody as Partial<NotificationRequest>;
  const notificationId = randomUUID();

  if (!tenantId || !channel || !recipient) {
    // Early exit if essential fields are missing for logging and processing
    const minimalLogEntry: NotificationLog = {
        id: notificationId, tenantId: tenantId || 'unknown', channel: channel || 'unknown' as NotificationChannel,
        recipient: recipient || {}, ...rest,
        statusHistory: [{ status: 'failed', errorDetails: 'Missing tenantId, channel, or recipient in request body', timestamp: new Date(), attemptNumber: 1 }],
        finalStatus: 'failed', createdAt: new Date(), lastUpdatedAt: new Date()
    };
    mockNotificationLogs.push(minimalLogEntry);
    return { success: false, log: minimalLogEntry };
  }

  let processedContent: MessageContent | undefined = content;

  if (templateId && templateData) {
    const template = await TemplateService.getTemplate(templateId, tenantId);
    if (template && template.channelDefaults[channel]) {
        const channelTemplate = template.channelDefaults[channel]!;
        // Validate requiredDataFields if needed
        processedContent = {
            subject: channelTemplate.subjectFormat ? TemplateService.renderTemplate(channelTemplate.subjectFormat, templateData) : undefined,
            body: TemplateService.renderTemplate(channelTemplate.bodyFormat, templateData)
        };
    } else {
         const logEntry: NotificationLog = { id: notificationId, tenantId, channel, recipient, templateId, templateData, ...rest, statusHistory: [{ status: 'failed', errorDetails: 'Template not found or channel not configured for template', timestamp: new Date(), attemptNumber: 1 }], finalStatus: 'failed', createdAt: new Date(), lastUpdatedAt: new Date() };
        mockNotificationLogs.push(logEntry);
        return { success: false, log: logEntry };
    }
  }

  if (!processedContent || !processedContent.body) {
     const logEntry: NotificationLog = { id: notificationId, tenantId, channel, recipient, content, templateId, templateData, ...rest, statusHistory: [{ status: 'failed', errorDetails: 'No content to send (either direct content or rendered template is empty)', timestamp: new Date(), attemptNumber: 1 }], finalStatus: 'failed', createdAt: new Date(), lastUpdatedAt: new Date() };
    mockNotificationLogs.push(logEntry);
    return { success: false, log: logEntry };
  }

  const requestData: NotificationRequest = { id: notificationId, tenantId, channel, recipient, content: processedContent, templateId, templateData, ...rest };
  const logEntry: NotificationLog = { ...requestData, statusHistory: [], finalStatus: 'pending', createdAt: new Date(), lastUpdatedAt: new Date() };

  let providerResponse;
  try {
    if (channel === 'email' && recipient.emailAddress) {
      providerResponse = await EmailProvider.send(recipient.emailAddress, processedContent.subject || 'Notification', processedContent.body);
    } else if (channel === 'sms' && recipient.phoneNumber) {
      providerResponse = await SmsProvider.send(recipient.phoneNumber, processedContent.body);
    } else if (channel === 'push_notification' && recipient.pushDeviceTokens && recipient.pushDeviceTokens.length > 0) {
      // TODO: Implement PushProvider.send(recipient.pushDeviceTokens, processedContent.subject, processedContent.body)
      console.log(`Mock PushProvider: Sending to tokens: ${recipient.pushDeviceTokens.join(', ')}`);
      providerResponse = { success: true, messageId: `mock-push-${Date.now()}`}; // Mock success
    } else if (channel === 'webhook' && recipient.webhookUrl) {
      // TODO: Implement WebhookProvider.send(recipient.webhookUrl, processedContent.body) // body would be JSON
      console.log(`Mock WebhookProvider: Posting to URL: ${recipient.webhookUrl}`);
      providerResponse = { success: true, messageId: `mock-webhook-${Date.now()}`}; // Mock success
    }
    else {
      throw new Error('Channel not supported or recipient details missing for the specified channel.');
    }

    if (providerResponse.success) {
      logEntry.statusHistory.push({ status: 'sent', providerMessageId: providerResponse.messageId /*|| providerResponse.messageSid*/, timestamp: new Date(), attemptNumber: 1 });
      logEntry.finalStatus = 'sent'; // Simplified, actual delivery needs webhooks or status polling
    } else {
      throw new Error(providerResponse.error || 'Provider failed to send');
    }
  } catch (error: any) {
    logEntry.statusHistory.push({ status: 'failed', errorDetails: error.message, timestamp: new Date(), attemptNumber: 1 });
    logEntry.finalStatus = 'failed';
  }
  logEntry.lastUpdatedAt = new Date();
  mockNotificationLogs.push(logEntry);
  return { success: logEntry.finalStatus === 'sent', log: logEntry };
};

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    const result = await processNotification(req.body);
    if (result.success) {
        res.status(202).json({ message: 'Notification request accepted', notificationId: result.log.id, status: result.log.finalStatus });
    } else {
        // Determine appropriate status code based on why it failed, if possible from log.
        // For now, using 400 for client-side errors (e.g. bad input, template not found)
        // and 500 if it was a provider failure after accepting the request.
        // The log entry itself would have more details.
        const lastAttempt = result.log.statusHistory[result.log.statusHistory.length -1];
        const statusCode = (lastAttempt?.errorDetails?.includes('Template not found') || lastAttempt?.errorDetails?.includes('No content to send') || lastAttempt?.errorDetails?.includes('Missing tenantId')) ? 400 : 500;
        res.status(statusCode).json({ message: 'Notification request processing failed', notificationId: result.log.id, details: lastAttempt?.errorDetails });
    }
};

export const getNotificationStatus = async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;
    const log = mockNotificationLogs.find(l => l.id === notificationId);
    if (log) {
        res.json({
            id: log.id,
            channel: log.channel,
            recipient: log.recipient, // Potentially sensitive, consider what to return
            finalStatus: log.finalStatus,
            statusHistory: log.statusHistory,
            createdAt: log.createdAt,
            lastUpdatedAt: log.lastUpdatedAt
        });
    } else {
        res.status(404).json({ message: 'Notification log not found.' });
    }
};

// TODO: Add controllers for template management (CRUD for MessageTemplate)
// GET /templates, POST /templates, GET /templates/:id, PUT /templates/:id, DELETE /templates/:id
