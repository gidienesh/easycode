import { MessageTemplate, NotificationChannel } from '../models';
const mockTemplates: MessageTemplate[] = [
    { id: 'welcome_email', name: 'Welcome Email', tenantId: 'global', channelDefaults: { email: { subjectFormat: 'Welcome to EasyCode, {{name}}!', bodyFormat: 'Hello {{name}}, welcome aboard! You registered on {{registrationDate}}.' }}, requiredDataFields: ['name', 'registrationDate'], createdAt: new Date(), updatedAt: new Date() },
    { id: 'order_confirmation_sms', name: 'Order Confirmation SMS', tenantId: 'global', channelDefaults: { sms: { bodyFormat: 'Your order #{{orderId}} for ${{totalAmount}} has been confirmed.'}}, requiredDataFields: ['orderId', 'totalAmount'], createdAt: new Date(), updatedAt: new Date()}
];
export class TemplateService {
    static async getTemplate(templateId: string, tenantId?: string): Promise<MessageTemplate | null> {
        // In a real app, would query DB, first for tenant-specific, then for global
        return mockTemplates.find(t => t.id === templateId && (t.tenantId === tenantId || t.tenantId === 'global')) || null;
    }
    static renderTemplate(templateContent: string, data: Record<string, any>): string {
        let rendered = templateContent;
        for (const key in data) {
            rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(data[key]));
        }
        return rendered;
    }
    // TODO: Add methods for creating, updating, deleting templates
}
