import { Activity, EmailActivity, CallActivity, SmsActivity, WhatsAppActivity, MeetingActivity } from '../types/crm';

const API_BASE_URL = process.env.NEXT_PUBLIC_CRM_API_URL || 'http://localhost:3004/api/v1';

class CrmApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`CRM API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Activity Logging Methods
  async logEmailActivity(data: Omit<EmailActivity, 'activityId' | 'createdAt' | 'updatedAt'>): Promise<EmailActivity> {
    return this.request<EmailActivity>('/activities/emails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logCallActivity(data: Omit<CallActivity, 'activityId' | 'createdAt' | 'updatedAt'>): Promise<CallActivity> {
    return this.request<CallActivity>('/activities/calls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logSmsActivity(data: Omit<SmsActivity, 'activityId' | 'createdAt' | 'updatedAt'>): Promise<SmsActivity> {
    return this.request<SmsActivity>('/activities/sms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logWhatsAppActivity(data: Omit<WhatsAppActivity, 'activityId' | 'createdAt' | 'updatedAt'>): Promise<WhatsAppActivity> {
    return this.request<WhatsAppActivity>('/activities/whatsapp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logMeetingActivity(data: Omit<MeetingActivity, 'activityId' | 'createdAt' | 'updatedAt'>): Promise<MeetingActivity> {
    return this.request<MeetingActivity>('/activities/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Activity Retrieval Methods
  async getActivityFeedForContact(
    contactId: string,
    filters?: {
      type?: string;
      direction?: string;
      userId?: string;
      dateFrom?: string;
      dateTo?: string;
      visibility?: string;
    }
  ): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Activity[]>(`/activities/contact/${contactId}/feed?${params.toString()}`);
  }

  async getActivityFeedForAccount(
    accountId: string,
    filters?: {
      type?: string;
      direction?: string;
      userId?: string;
      dateFrom?: string;
      dateTo?: string;
      visibility?: string;
    }
  ): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Activity[]>(`/activities/account/${accountId}/feed?${params.toString()}`);
  }

  // NEW: Communications-specific methods (using new communications endpoints)
  async getAllCommunications(filters?: {
    type?: string;
    direction?: string;
    dateFrom?: string;
    dateTo?: string;
    contactId?: string;
    accountId?: string;
    search?: string;
  }): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Activity[]>(`/communications?${params.toString()}`);
  }

  async getCommunicationsByType(
    type: 'email' | 'call' | 'sms' | 'whatsapp' | 'meeting',
    filters?: {
      direction?: string;
      dateFrom?: string;
      dateTo?: string;
      contactId?: string;
      accountId?: string;
    }
  ): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Activity[]>(`/communications/type/${type}?${params.toString()}`);
  }

  async getCommunicationStats(): Promise<{
    total: number;
    email: number;
    whatsapp: number;
    sms: number;
    calls: number;
    meetings: number;
    notes: number;
    inbound: number;
    outbound: number;
    internal: number;
  }> {
    return this.request('/communications/stats');
  }

  async getCommunicationById(id: string): Promise<Activity> {
    return this.request<Activity>(`/communications/${id}`);
  }

  async updateCommunication(id: string, data: Partial<Activity>): Promise<Activity> {
    return this.request<Activity>(`/communications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCommunication(id: string): Promise<void> {
    return this.request(`/communications/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteCommunications(ids: string[]): Promise<{ deletedCount: number; message: string }> {
    return this.request('/communications/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  async exportCommunications(format: 'json' | 'csv' = 'json', filters?: any): Promise<any> {
    const params = new URLSearchParams({ format });
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    return this.request(`/communications/export?${params.toString()}`);
  }

  // Contact and Account methods
  async getContacts(): Promise<any[]> {
    // For now, return mock data until contacts endpoint is implemented
    return Promise.resolve([
      { id: 'contact-1', name: 'Jaston Mbohe', email: 'jaston.mbohe@apexsteel.co.ke', phone: '+254700000002' },
      { id: 'contact-2', name: 'Mars Wrigley Team', email: 'contact@marswrigley.co.ke', phone: '+254700000003' },
      { id: 'contact-3', name: 'Grace Njeri', email: 'grace.njeri@dtb.co.ke', phone: '+254700000004' },
    ]);
  }

  async getAccounts(): Promise<any[]> {
    // For now, return mock data until accounts endpoint is implemented
    return Promise.resolve([
      { id: 'account-1', name: 'Apex Steel Ltd', industry: 'Manufacturing', phone: '+254700000002' },
      { id: 'account-2', name: 'Mars Wrigley East Africa', industry: 'Food & Beverage', phone: '+254700000003' },
      { id: 'account-3', name: 'Diamond Trust Bank', industry: 'Banking', phone: '+254700000004' },
    ]);
  }

  async getContact(contactId: string): Promise<any> {
    const contacts = await this.getContacts();
    return contacts.find(contact => contact.id === contactId);
  }

  async getAccount(accountId: string): Promise<any> {
    const accounts = await this.getAccounts();
    return accounts.find(account => account.id === accountId);
  }
}

export const crmApiService = new CrmApiService();
export default crmApiService; 