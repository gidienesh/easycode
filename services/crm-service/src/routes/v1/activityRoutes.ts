import express from 'express';
import {
  logEmailActivity,
  logCallActivity,
  logSmsActivity,
  logWhatsAppActivity,
  logNoteActivity,
  logMeetingActivity,
  getActivityFeedForContact,
  getActivityFeedForAccount
} from '../../controllers/activity.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder for actual auth

const router = express.Router();

// router.use(authenticate); // Apply auth to all activity routes

router.post('/emails', logEmailActivity);
router.post('/calls', logCallActivity);
router.post('/sms', logSmsActivity);
router.post('/whatsapp', logWhatsAppActivity);
router.post('/notes', logNoteActivity);
router.post('/meetings', logMeetingActivity);

router.get('/contact/:contactId/feed', getActivityFeedForContact);
router.get('/account/:accountId/feed', getActivityFeedForAccount);

export default router;
