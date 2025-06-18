import express from 'express';
import { sendNotification, getNotificationStatus } from '../../controllers/notification.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder for actual auth

const router = express.Router();

// router.use(authenticate); // Apply auth to all notification routes if needed

// Generic endpoint, channel is specified in the request body
router.post('/send', sendNotification);

// Endpoint to get the status of a previously submitted notification
router.get('/status/:notificationId', getNotificationStatus);

// TODO: Add routes for template management (e.g., POST /templates, GET /templates/:id)
// These would likely need different authentication/authorization (e.g., admin only)

export default router;
