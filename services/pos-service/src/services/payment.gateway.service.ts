import { PaymentDetail, PaymentType } from '../models'; // Assuming PaymentDetail is defined in models

export interface PaymentGatewayRequestData {
    amount: number;
    currency: string; // e.g., 'USD'
    paymentType: PaymentType;
    cardNumber?: string; // For card payments
    cardExpiryMonth?: number;
    cardExpiryYear?: number;
    cardCvc?: string;
    token?: string; // For tokenized payments
    billingAddress?: any; // Could be a structured Address model
    customerDetails?: any; // Could be a structured Customer model
    metadata?: Record<string, any>; // For additional info to gateway
}

export interface PaymentGatewayResponse {
    success: boolean;
    transactionId?: string; // Gateway's transaction ID
    approvalCode?: string; // For card payments
    errorCode?: string;
    errorMessage?: string;
    rawResponse?: any; // Full response from gateway for logging/debugging
}

export class PaymentGatewayService {
  static async processPayment(paymentData: PaymentGatewayRequestData, tenantId: string): Promise<PaymentGatewayResponse> {
    console.log(`Mock PaymentGateway: Processing payment for tenant ${tenantId}, Amount: ${paymentData.amount} ${paymentData.currency} via ${paymentData.paymentType}`);

    // Simulate interaction with Stripe, Square, Adyen, etc.
    // This would involve using their SDKs or making HTTP API calls.
    // For example, if using Stripe:
    // if (paymentData.paymentType === 'card_credit' && paymentData.token) {
    //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
    //   try {
    //     const charge = await stripe.charges.create({
    //       amount: Math.round(paymentData.amount * 100), // Stripe expects cents
    //       currency: paymentData.currency,
    //       source: paymentData.token, // e.g., 'tok_visa'
    //       description: `Sale for tenant ${tenantId}`,
    //       metadata: paymentData.metadata
    //     });
    //     return { success: true, transactionId: charge.id, approvalCode: charge.balance_transaction, rawResponse: charge };
    //   } catch (error: any) {
    //     return { success: false, errorCode: error.code, errorMessage: error.message, rawResponse: error };
    //   }
    // }

    if (paymentData.amount <= 0) {
        return { success: false, errorCode: 'invalid_amount', errorMessage: 'Invalid payment amount' };
    }
    if (paymentData.paymentType === 'card_credit' && paymentData.cardNumber === 'fail_card') {
        return { success: false, errorCode: 'card_declined', errorMessage: 'Mock card declined by gateway' };
    }

    return {
        success: true,
        transactionId: `pg_txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        approvalCode: `appr_${Date.now()}`
    };
  }

  // TODO: Add methods for refunds, voids, pre-authorizations if needed
  // static async refundPayment(gatewayTransactionId: string, amount: number, tenantId: string): Promise<any> {}
}
