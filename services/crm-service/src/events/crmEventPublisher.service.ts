// import { MessageQueueClient } from './messageQueueClient'; // Conceptual
export interface LeadReferredAndConvertedPayload {
  leadId: string;
  tenantId: string;
  referredByEmployeeId: string;
  convertedValue?: number;
  conversionTimestamp: Date;
}
export class CrmEventPublisher {
  static async publishLeadReferredAndConverted(payload: LeadReferredAndConvertedPayload): Promise<void> {
    const eventName = 'LeadReferredAndConverted';
    console.log(`Mock EventBus: Publishing ${eventName}`, payload);
    // await MessageQueueClient.publish(eventName, payload);
  }
}
