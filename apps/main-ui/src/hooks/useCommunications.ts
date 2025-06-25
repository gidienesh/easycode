import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import crmApiService from '../services/crmApi';
import { Activity, CommunicationFilters, EmailFormData, WhatsAppFormData, SMSFormData, CallFormData, MeetingFormData } from '../types/crm';

export const useCommunications = () => {
  const [communications, setCommunications] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Load all communications
  const loadCommunications = useCallback(async (filters?: CommunicationFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await crmApiService.getAllCommunications(filters);
      setCommunications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load communications';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load communications by type
  const loadCommunicationsByType = useCallback(async (
    type: 'email' | 'call' | 'sms' | 'whatsapp' | 'meeting',
    filters?: CommunicationFilters
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await crmApiService.getCommunicationsByType(type, filters);
      setCommunications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load communications';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contacts and accounts
  const loadContactsAndAccounts = useCallback(async () => {
    try {
      const [contactsData, accountsData] = await Promise.all([
        crmApiService.getContacts(),
        crmApiService.getAccounts(),
      ]);
      setContacts(contactsData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('Failed to load contacts and accounts:', err);
    }
  }, []);

  // Create email communication
  const createEmail = useCallback(async (data: EmailFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const emailActivity = await crmApiService.logEmailActivity({
        tenantId: 'default-tenant', // This should come from context
        activityType: 'email',
        direction: 'outbound',
        visibility: 'team',
        activityTimestamp: new Date(),
        fromAddress: 'company@example.com', // This should come from user context
        toAddresses: [data.to],
        ccAddresses: data.cc ? [data.cc] : undefined,
        bccAddresses: data.bcc ? [data.bcc] : undefined,
        subject: data.subject,
        bodyPreview: data.body.substring(0, 200),
        contactId: data.contactId,
        accountId: data.accountId,
        summary: data.subject,
      });

      setCommunications(prev => [emailActivity, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'Email sent successfully!',
        color: 'green',
      });

      return emailActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create WhatsApp communication
  const createWhatsApp = useCallback(async (data: WhatsAppFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const whatsappActivity = await crmApiService.logWhatsAppActivity({
        tenantId: 'default-tenant',
        activityType: 'whatsapp',
        direction: 'outbound',
        visibility: 'team',
        activityTimestamp: new Date(),
        fromId: 'company-whatsapp-id',
        toId: data.to,
        messageBody: data.message,
        conversationId: `conv-${Date.now()}`,
        messageType: data.media ? 'media' : 'text',
        contactId: data.contactId,
        accountId: data.accountId,
        summary: data.message.substring(0, 100),
      });

      setCommunications(prev => [whatsappActivity, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'WhatsApp message sent successfully!',
        color: 'green',
      });

      return whatsappActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send WhatsApp message';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create SMS communication
  const createSMS = useCallback(async (data: SMSFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const smsActivity = await crmApiService.logSmsActivity({
        tenantId: 'default-tenant',
        activityType: 'sms',
        direction: 'outbound',
        visibility: 'team',
        activityTimestamp: new Date(),
        fromNumber: 'company-phone-number',
        toNumber: data.to,
        body: data.message,
        status: 'sent',
        contactId: data.contactId,
        accountId: data.accountId,
        summary: data.message.substring(0, 100),
      });

      setCommunications(prev => [smsActivity, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'SMS sent successfully!',
        color: 'green',
      });

      return smsActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send SMS';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create call communication
  const createCall = useCallback(async (data: CallFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const callActivity = await crmApiService.logCallActivity({
        tenantId: 'default-tenant',
        activityType: 'call',
        direction: 'outbound',
        visibility: 'team',
        activityTimestamp: new Date(),
        fromPhoneNumber: data.from || 'company-phone-number',
        toPhoneNumber: data.to,
        durationSeconds: data.duration,
        outcome: data.outcome || 'connected',
        contactId: data.contactId,
        accountId: data.accountId,
        summary: `Call to ${data.to}`,
      });

      setCommunications(prev => [callActivity, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'Call logged successfully!',
        color: 'green',
      });

      return callActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log call';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create meeting communication
  const createMeeting = useCallback(async (data: MeetingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const meetingActivity = await crmApiService.logMeetingActivity({
        tenantId: 'default-tenant',
        activityType: 'meeting',
        direction: 'outbound',
        visibility: 'team',
        activityTimestamp: new Date(),
        subject: data.subject,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        internalAttendees: data.attendees,
        contactId: data.contactId,
        accountId: data.accountId,
        summary: data.subject,
      });

      setCommunications(prev => [meetingActivity, ...prev]);
      notifications.show({
        title: 'Success',
        message: 'Meeting scheduled successfully!',
        color: 'green',
      });

      return meetingActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule meeting';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load activity feed for contact
  const loadContactFeed = useCallback(async (contactId: string, filters?: CommunicationFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await crmApiService.getActivityFeedForContact(contactId, filters);
      setCommunications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load contact feed';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load activity feed for account
  const loadAccountFeed = useCallback(async (accountId: string, filters?: CommunicationFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await crmApiService.getActivityFeedForAccount(accountId, filters);
      setCommunications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load account feed';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get statistics
  const getStatistics = useCallback(() => {
    const stats = {
      total: communications.length,
      email: communications.filter(c => c.activityType === 'email').length,
      whatsapp: communications.filter(c => c.activityType === 'whatsapp').length,
      sms: communications.filter(c => c.activityType === 'sms').length,
      calls: communications.filter(c => c.activityType === 'call').length,
      meetings: communications.filter(c => c.activityType === 'meeting').length,
      inbound: communications.filter(c => c.direction === 'inbound').length,
      outbound: communications.filter(c => c.direction === 'outbound').length,
    };
    return stats;
  }, [communications]);

  return {
    communications,
    loading,
    error,
    contacts,
    accounts,
    loadCommunications,
    loadCommunicationsByType,
    loadContactsAndAccounts,
    createEmail,
    createWhatsApp,
    createSMS,
    createCall,
    createMeeting,
    loadContactFeed,
    loadAccountFeed,
    clearError,
    getStatistics,
  };
}; 