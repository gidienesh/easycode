import express from 'express';
import {
  getAllCommunications,
  getCommunicationsByType,
  getCommunicationStats,
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
  bulkDeleteCommunications,
  exportCommunications
} from '../../controllers/communications.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder for actual auth

const router = express.Router();

// router.use(authenticate); // Apply auth to all communication routes

// Get all communications with filters
router.get('/', getAllCommunications);

// Get communications by type
router.get('/type/:type', getCommunicationsByType);

// Get communication statistics
router.get('/stats', getCommunicationStats);

// Get specific communication by ID
router.get('/:id', getCommunicationById);

// Update communication
router.put('/:id', updateCommunication);

// Delete communication
router.delete('/:id', deleteCommunication);

// Bulk delete communications
router.delete('/bulk/delete', bulkDeleteCommunications);

// Export communications
router.get('/export', exportCommunications);

export default router; 