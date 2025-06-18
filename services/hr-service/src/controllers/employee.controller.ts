import { Request, Response } from 'express';
import { Employee } from '../models';
import { randomUUID } from 'crypto';

const mockEmployees: Employee[] = [];

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, employeeNumber, firstName, lastName, workEmail, jobTitle, employmentType, startDate, status, ...rest } = req.body as Omit<Employee, 'id'|'createdAt'|'updatedAt'>;

    if (!tenantId || !employeeNumber || !firstName || !lastName || !workEmail || !jobTitle || !employmentType || !startDate || !status) {
        res.status(400).json({ message: 'Missing required fields for employee creation.' });
        return;
    }

    // TODO: Check for uniqueness of employeeNumber within tenantId

    const newEmployee: Employee = {
        id: randomUUID(),
        tenantId, employeeNumber, firstName, lastName, workEmail, jobTitle, employmentType, startDate: new Date(startDate), status,
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    mockEmployees.push(newEmployee);
    res.status(201).json(newEmployee);
};

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
    const { tenantId, departmentId, status } = req.query;
    // In a real app, tenantId would often come from auth context
    if (!tenantId) {
        // res.status(400).json({ message: "tenantId query parameter is required." });
        // return;
        // For mock, returning all if no tenantId, but this is not production behavior
    }
    let filteredEmployees = mockEmployees;
    if (tenantId) {
        filteredEmployees = filteredEmployees.filter(e => e.tenantId === tenantId);
    }
    if (departmentId) {
        filteredEmployees = filteredEmployees.filter(e => e.departmentId === departmentId);
    }
    if (status) {
        filteredEmployees = filteredEmployees.filter(e => e.status === status);
    }
    res.json(filteredEmployees);
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    const { employeeId } = req.params;
    const { tenantId } = req.query; // Or from auth context

    const employee = mockEmployees.find(e => e.id === employeeId && (tenantId ? e.tenantId === tenantId : true));

    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found or access denied.' });
    }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
    const { employeeId } = req.params;
    const { tenantId } = req.body; // tenantId should ideally come from auth or path for security

    const employeeIndex = mockEmployees.findIndex(e => e.id === employeeId && e.tenantId === tenantId);

    if (employeeIndex === -1) {
        res.status(404).json({ message: 'Employee not found or access denied.' });
        return;
    }
    // Update only fields that are sent, don't overwrite entire object blindly
    const updatedEmployee: Employee = { ...mockEmployees[employeeIndex], ...req.body, updatedAt: new Date() };
    mockEmployees[employeeIndex] = updatedEmployee;
    res.json(updatedEmployee);
};

// TODO: Add deleteEmployee (likely a soft delete by changing status to 'terminated')
