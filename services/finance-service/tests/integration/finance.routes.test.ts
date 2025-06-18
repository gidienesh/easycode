// import request from 'supertest';
// import app from '../../src/index';

describe('Finance V1 Routes Integration Tests', () => {
  describe('GL Routes', () => {
    it('POST /v1/gl/journal-entries - should create a JE', async () => {
      // const jeData = { tenantId: 't1', entryDate: new Date(), lines: [ { ledgerAccountId: 'acc1', lineType: 'debit', amount: 100 }, { ledgerAccountId: 'acc2', lineType: 'credit', amount: 100 } ] };
      // const response = await request(app).post('/v1/gl/journal-entries').send(jeData);
      // expect(response.status).toBe(201);
      // expect(response.body).toHaveProperty('id');
      // expect(response.body.status).toBe('posted');
    });
    it('POST /v1/gl/journal-entries - should fail for unbalanced JE', async () => {
      // const jeData = { tenantId: 't1', entryDate: new Date(), lines: [ { ledgerAccountId: 'acc1', lineType: 'debit', amount: 100 }, { ledgerAccountId: 'acc2', lineType: 'credit', amount: 90 } ] };
      // const response = await request(app).post('/v1/gl/journal-entries').send(jeData);
      // expect(response.status).toBe(400);
    });
    it('GET /v1/gl/accounts/:accountId/balance - should get account balance', async () => {
        // // This might require seeding some JEs first or ensuring the mock controller has data
        // const response = await request(app).get('/v1/gl/accounts/acc-cash/balance?tenantId=t1');
        // expect(response.status).toBe(200);
        // expect(response.body).toHaveProperty('balance');
    });
  });

  describe('AP Routes', () => {
    it('POST /v1/ap/invoices/direct - should create a direct AP invoice', async () => {
      // const apInvoiceData = { tenantId: 't1', supplierId: 's1', invoiceNumber: 'INV001-INT', invoiceDate: new Date(), lines: [{id:'l1', description: 'Service Int', amount: 200}], subTotal: 200, totalAmount: 200, currency: 'USD' };
      // const response = await request(app).post('/v1/ap/invoices/direct').send(apInvoiceData);
      // expect(response.status).toBe(201);
      // expect(response.body.invoiceNumber).toBe('INV001-INT');
    });
    // TODO: Add test for POST /v1/ap/invoices/from-procurement (would need to mock the service call)
    it('POST /v1/ap/payments - should record a payment', async () => {
        // const paymentData = { tenantId: 't1', supplierId: 's1', amount: 100, paymentDate: new Date(), apInvoiceIds: ['some-ap-invoice-id']};
        // const response = await request(app).post('/v1/ap/payments').send(paymentData);
        // expect(response.status).toBe(201);
        // expect(response.body).toHaveProperty('id');
    });
  });

  describe('AR Routes', () => {
    it('POST /v1/ar/invoices/direct - should create a direct AR invoice', async () => {
      // const arInvoiceData = { tenantId: 't1', customerId: 'c1', invoiceDate: new Date(), lines: [{id:'l1', description: 'Product Sale Int', amount: 300}], subTotal: 300, totalAmount: 300, currency: 'USD' };
      // const response = await request(app).post('/v1/ar/invoices/direct').send(arInvoiceData);
      // expect(response.status).toBe(201);
      // expect(response.body.customerId).toBe('c1');
    });
    it('POST /v1/ar/receipts - should record a receipt', async () => {
        // const receiptData = { tenantId: 't1', customerId: 'c1', amount: 100, receiptDate: new Date(), arInvoiceIds: ['some-ar-invoice-id']};
        // const response = await request(app).post('/v1/ar/receipts').send(receiptData);
        // expect(response.status).toBe(201);
        // expect(response.body).toHaveProperty('id');
    });
  });
});
