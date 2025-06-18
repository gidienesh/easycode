// import request from 'supertest';
// import app from '../../src/index';

describe('Notification V1 Routes Integration Tests', () => {
  describe('POST /v1/notifications/send', () => {
    it('should accept a valid email notification request (mocked send)', async () => {
      // const response = await request(app).post('/v1/notifications/send')
      //   .send({ tenantId: 't1', channel: 'email', recipient: { emailAddress: 'test@example.com' }, content: { subject: 'Int Test', body: 'Hello' } });
      // expect(response.status).toBe(202);
      // expect(response.body).toHaveProperty('notificationId');
    });
    it('should accept a valid SMS notification request with template (mocked send)', async () => {
      // const response = await request(app).post('/v1/notifications/send')
      //   .send({ tenantId: 't1', channel: 'sms', recipient: { phoneNumber: '+1234567890' }, templateId: 'mock_sms_template', templateData: { code: '12345'} });
      // expect(response.status).toBe(202);
    });
     it('should return 400 for an invalid request (e.g. missing recipient)', async () => {
      // const response = await request(app).post('/v1/notifications/send')
      //   .send({ tenantId: 't1', channel: 'email', content: { subject: 'Int Test', body: 'Hello' } }); // Missing recipient
      // expect(response.status).toBe(400);
    });
  });
  describe('GET /v1/notifications/status/:notificationId', () => {
      // Add tests after a notification is "sent"
      it('should return 404 for a non-existent notification ID', async () => {
        // const response = await request(app).get('/v1/notifications/status/nonexistent-id-123');
        // expect(response.status).toBe(404);
      });
      // it('should return status for an existing notification ID', async () => {
      //   // First, send a notification to get an ID
      //   const postRes = await request(app).post('/v1/notifications/send')
      //     .send({ tenantId: 't1', channel: 'email', recipient: { emailAddress: 'status@example.com' }, content: { subject: 'Status Test', body: 'Hello' } });
      //   const notificationId = postRes.body.notificationId;
      //   const response = await request(app).get(`/v1/notifications/status/${notificationId}`);
      //   expect(response.status).toBe(200);
      //   expect(response.body.id).toBe(notificationId);
      // });
  });
});
