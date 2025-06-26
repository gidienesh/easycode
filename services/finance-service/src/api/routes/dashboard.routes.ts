import { Router } from 'express';
import { DashboardController } from '../../controllers/dashboardController';

const router = Router();
const dashboardController = new DashboardController();

// Financial KPIs endpoint
router.get('/kpis', dashboardController.getFinancialKPIs);

// Recent transactions endpoint
router.get('/transactions', dashboardController.getRecentTransactions);

// Outstanding items endpoint
router.get('/outstanding', dashboardController.getOutstandingItems);

// Alerts endpoint
router.get('/alerts', dashboardController.getAlerts);

export default router; 