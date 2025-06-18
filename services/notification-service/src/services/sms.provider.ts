// import twilio from 'twilio'; // Conceptual
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export class SmsProvider {
  static async send(to: string, body: string, from?: string): Promise<{ success: boolean; messageSid?: string; error?: string }> {
    console.log(`Mock SmsProvider: Sending SMS to ${to}, Body: ${body}`);
    // try {
    //   const message = await client.messages.create({ body, from: from || process.env.TWILIO_FROM_NUMBER, to });
    //   return { success: true, messageSid: message.sid };
    // } catch (error: any) {
    //   return { success: false, error: error.message };
    // }
    if (to.includes('fail')) return { success: false, error: 'Mock failure for SMS' };
    return { success: true, messageSid: `mock-sms-${Date.now()}` };
  }
}
