import express from 'express';
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee
} from '../../controllers/employee.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all employee routes

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:employeeId', getEmployeeById);
router.put('/:employeeId', updateEmployee);
// TODO: Add DELETE (soft delete) route for employees

export default router;
