import { Router } from 'express';
import { ProjectController } from '../../controllers/project.controller';

const router = Router();

// Project CRUD routes
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

// Project dashboard and analytics
router.get('/:id/dashboard', ProjectController.getProjectDashboard);

export default router; 