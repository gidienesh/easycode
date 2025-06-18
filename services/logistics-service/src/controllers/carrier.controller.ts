import { Request, Response } from 'express';
import { Carrier } from '../models'; // Assuming models are available

// In a real app, carriers might be configurable per tenant or globally managed
// For now, using the same mockCarriers array as in shipment.controller for consistency in mock.
// Consider moving this to a shared service or data store if it grows.
const mockCarriers: Carrier[] = [
  { id: 'fedex_mock', name: 'Mock FedEx', isActive: true, servicesOffered: [{id: 'ground', name: 'FedEx Ground', type: 'parcel'}, {id: 'priority_overnight', name: 'FedEx Priority Overnight', type: 'parcel'}], supportsTracking: true, supportsShippingLabels: true },
  { id: 'ups_mock', name: 'Mock UPS', isActive: true, servicesOffered: [{id: 'standard', name: 'UPS Standard', type: 'parcel'}, {id: 'worldwide_expedited', name: 'UPS Worldwide Expedited', type: 'international'}], supportsTracking: true, supportsShippingLabels: true },
  { id: 'mock_freight_carrier', name: 'Mock Freight Inc.', isActive: true, servicesOffered: [{id: 'ltl_standard', name: 'LTL Standard', type: 'freight'}], supportsTracking: true, supportsShippingLabels: false },
  { id: 'mock_fail_carrier', name: 'Mock Failing Carrier', isActive: true, supportsTracking: false, supportsShippingLabels: false }
];


export const getCarriers = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, type } = req.query; // type could be 'parcel', 'freight'

  let filteredCarriers = mockCarriers.filter(c => c.isActive);

  if (tenantId) {
    // In a real app, filter by carriers enabled for this tenant
    // For mock, we assume all active carriers are available to all tenants unless tenantId is on Carrier model
    filteredCarriers = filteredCarriers.filter(c => c.tenantId === tenantId || c.tenantId === undefined);
  }

  if (type) {
    filteredCarriers = filteredCarriers.filter(c =>
      c.servicesOffered?.some(s => s.type === type)
    );
  }

  res.json(filteredCarriers.map(c => ({ id: c.id, name: c.name, servicesOffered: c.servicesOffered }))); // Return a subset of fields
};

export const getCarrierById = async (req: Request, res: Response): Promise<void> => {
    const { carrierId } = req.params;
    const carrier = mockCarriers.find(c => c.id === carrierId && c.isActive);
     // TODO: tenantId check if applicable
    if (carrier) {
        res.json(carrier); // Return full carrier details
    } else {
        res.status(404).json({ message: 'Active carrier not found.' });
    }
};

// TODO: Add admin controllers for CRUD operations on Carriers if this service manages them directly.
// Otherwise, they might be configured via client-admin-service and synced.
