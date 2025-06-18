import { Request, Response } from 'express';
import { ServiceDefinition, ModuleDefinition, EntitlementPackage } from '../models';

// Mocked data - In a real app, this comes from a persistent store
const mockServiceDefinitions: ServiceDefinition[] = [
  { id: 'crm-service', name: 'CRM Service', description: 'Customer Relationship Management', availableVersions: ['v1.0', 'v1.2'], modules: [{id: 'leads', name: 'Leads Management'}, {id: 'contacts', name: 'Contacts Management'}], defaultConfig: { baseApiUrl: '/crm', featureX: true } },
  { id: 'inventory-service', name: 'Inventory Service', description: 'Manage product inventory', availableVersions: ['v1.0'], modules: [{id: 'item_mgmt', name: 'Item Management'}, {id: 'stock_control', name: 'Stock Control'}], defaultConfig: { defaultWarehouse: 'main' } },
  { id: 'finance-service', name: 'Finance Service', description: 'Billing and Financial Reporting', availableVersions: ['v1.0'], modules: [{id: 'billing', name: 'Billing'}, {id: 'reporting', name: 'Reporting'}]},
  { id: 'notification-service', name: 'Notification Service', description: 'Handles Email and SMS notifications', availableVersions: ['v1.0'], modules: [{id: 'email_service', name: 'Email Service'}, {id: 'sms_service', name: 'SMS Service'}]}
];
// Add mockModuleDefinitions, mockEntitlementPackages if needed for more endpoints
// For now, focusing on getAllServiceDefinitions as per adminDefinitionRoutes.ts

export const getAllServiceDefinitions = (req: Request, res: Response): void => {
  res.json(mockServiceDefinitions);
};

// TODO: Add controllers for CRUD operations on ServiceDefinition, ModuleDefinition, EntitlementPackage
// These would be used by EasyCode internal admin UIs.
// e.g., createServiceDefinition, updateServiceDefinition, etc.
