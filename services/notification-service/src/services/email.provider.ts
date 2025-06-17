// import sgMail from '@sendgrid/mail'; // Conceptual
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export class EmailProvider {
  static async send(to: string, subject: string, htmlBody: string, from?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`Mock EmailProvider: Sending email to ${to}, Subject: ${subject}`);
    // const msg = { to, from: from || process.env.DEFAULT_FROM_EMAIL, subject, html: htmlBody };
    // try {
    //   const response = await sgMail.send(msg);
    //   return { success: true, messageId: response[0]?.headers['x-message-id'] };
    // } catch (error: any) {
    //   return { success: false, error: error.message };
    // }
    if (to.includes('fail')) return { success: false, error: 'Mock failure for email' };
    return { success: true, messageId: `mock-email-${Date.now()}` };
  }
}
