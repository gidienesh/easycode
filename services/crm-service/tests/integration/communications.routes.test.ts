import request from 'supertest';
import app from '../../src/index';

describe('Communications Routes', () => {
  describe('GET /v1/communications', () => {
    it('should return all communications', async () => {
      const response = await request(app)
        .get('/v1/communications')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter communications by type', async () => {
      const response = await request(app)
        .get('/v1/communications?type=email')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((comm: any) => {
        expect(comm.activityType).toBe('email');
      });
    });

    it('should filter communications by direction', async () => {
      const response = await request(app)
        .get('/v1/communications?direction=outbound')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((comm: any) => {
        expect(comm.direction).toBe('outbound');
      });
    });

    it('should search communications', async () => {
      const response = await request(app)
        .get('/v1/communications?search=proposal')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /v1/communications/type/:type', () => {
    it('should return communications by type', async () => {
      const response = await request(app)
        .get('/v1/communications/type/email')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((comm: any) => {
        expect(comm.activityType).toBe('email');
      });
    });

    it('should return empty array for non-existent type', async () => {
      const response = await request(app)
        .get('/v1/communications/type/nonexistent')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /v1/communications/stats', () => {
    it('should return communication statistics', async () => {
      const response = await request(app)
        .get('/v1/communications/stats')
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('whatsapp');
      expect(response.body).toHaveProperty('sms');
      expect(response.body).toHaveProperty('calls');
      expect(response.body).toHaveProperty('meetings');
      expect(response.body).toHaveProperty('notes');
      expect(response.body).toHaveProperty('inbound');
      expect(response.body).toHaveProperty('outbound');
      expect(response.body).toHaveProperty('internal');
    });
  });

  describe('GET /v1/communications/:id', () => {
    it('should return a specific communication', async () => {
      const response = await request(app)
        .get('/v1/communications/email-1')
        .expect(200);

      expect(response.body).toHaveProperty('activityId', 'email-1');
      expect(response.body).toHaveProperty('activityType', 'email');
    });

    it('should return 404 for non-existent communication', async () => {
      await request(app)
        .get('/v1/communications/nonexistent-id')
        .expect(404);
    });
  });

  describe('PUT /v1/communications/:id', () => {
    it('should update a communication', async () => {
      const updateData = {
        summary: 'Updated summary'
      };

      const response = await request(app)
        .put('/v1/communications/email-1')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('summary', 'Updated summary');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent communication', async () => {
      await request(app)
        .put('/v1/communications/nonexistent-id')
        .send({ summary: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /v1/communications/:id', () => {
    it('should delete a communication', async () => {
      await request(app)
        .delete('/v1/communications/email-1')
        .expect(204);
    });

    it('should return 404 for non-existent communication', async () => {
      await request(app)
        .delete('/v1/communications/nonexistent-id')
        .expect(404);
    });
  });

  describe('DELETE /v1/communications/bulk/delete', () => {
    it('should bulk delete communications', async () => {
      const response = await request(app)
        .delete('/v1/communications/bulk/delete')
        .send({ ids: ['email-2', 'whatsapp-1'] })
        .expect(200);

      expect(response.body).toHaveProperty('deletedCount');
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid request', async () => {
      await request(app)
        .delete('/v1/communications/bulk/delete')
        .send({ ids: 'invalid' })
        .expect(400);
    });
  });

  describe('GET /v1/communications/export', () => {
    it('should export communications as JSON', async () => {
      const response = await request(app)
        .get('/v1/communications/export?format=json')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should export communications as CSV', async () => {
      const response = await request(app)
        .get('/v1/communications/export?format=csv')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('filename=communications.csv');
    });
  });
}); 