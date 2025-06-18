import { Request, Response } from 'express';
import { Shipment, Carrier, Package, ShipmentStatus, TrackingEvent } from '../models';
import { CarrierApiService, CarrierShipmentResponse, CarrierTrackingResponse } from '../services/carrier.api.service';
import { randomUUID } from 'crypto';

const mockShipments: Shipment[] = [];
// In a real app, carriers might be configurable per tenant or globally managed
const mockCarriers: Carrier[] = [
  { id: 'fedex_mock', name: 'Mock FedEx', isActive: true, servicesOffered: [{id: 'ground', name: 'FedEx Ground', type: 'parcel'}], supportsTracking: true, supportsShippingLabels: true },
  { id: 'ups_mock', name: 'Mock UPS', isActive: true, servicesOffered: [{id: 'standard', name: 'UPS Standard', type: 'parcel'}], supportsTracking: true, supportsShippingLabels: true },
  { id: 'mock_fail_carrier', name: 'Mock Failing Carrier', isActive: true, supportsTracking: false, supportsShippingLabels: false }
];

export const createShipmentRequest = async (req: Request, res: Response): Promise<void> => {
  const { tenantId, carrierId, originAddress, destinationAddress, packages: inputPackages, ...shipmentData } =
    req.body as Omit<Shipment, 'id'|'createdAt'|'updatedAt'|'status'|'packages'> & { packages: Omit<Package, 'id'>[] };

  if (!tenantId || !originAddress || !destinationAddress || !inputPackages || !inputPackages.length) {
    res.status(400).json({ message: 'Missing required fields: tenantId, originAddress, destinationAddress, packages' });
    return;
  }

  const carrier = carrierId ? mockCarriers.find(c => c.id === carrierId && c.isActive) : mockCarriers.find(c => c.isActive && c.id !== 'mock_fail_carrier'); // Default to a working carrier
  if (!carrier) {
    res.status(400).json({ message: 'Invalid or inactive carrierId specified.' });
    return;
  }

  const newShipmentId = randomUUID();
  const processedPackages: Package[] = inputPackages.map((pkg, index) => ({
    ...pkg,
    id: `${newShipmentId}-pkg-${index + 1}`, // Simple package ID generation for mock
  }));

  let newShipment: Shipment = {
    id: newShipmentId,
    tenantId,
    carrierId: carrier.id,
    originAddress,
    destinationAddress,
    packages: processedPackages,
    status: 'pending_booking' as ShipmentStatus, // Initial status before attempting booking
    ...shipmentData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Simulate booking with carrier API
  const bookingResult: CarrierShipmentResponse = await CarrierApiService.createShipment(carrier, newShipment);

  if (bookingResult.success) {
    newShipment.trackingNumber = bookingResult.trackingNumber; // Master tracking number
    newShipment.status = 'booked'; // Or 'in_transit' if immediate pickup/dropoff
    newShipment.freightCost = bookingResult.rate;
    newShipment.currency = bookingResult.currency;
    // Update package tracking numbers if provided per package
    if (bookingResult.packageTrackingNumbers) {
        newShipment.packages.forEach(pkg => {
            const pkgTrk = bookingResult.packageTrackingNumbers?.find(pt => pt.packageId === pkg.id);
            if (pkgTrk) pkg.trackingNumber = pkgTrk.trackingNumber;
        });
    }
    // In a real app, you'd store the label URL, perhaps generate an event, etc.
    console.log(`Shipment booked successfully. Label URL: ${bookingResult.labelUrl}`);
  } else {
    newShipment.status = 'exception'; // Or some error status
    newShipment.notes = `Booking failed: ${bookingResult.error || 'Unknown carrier error'}`;
    console.error(`Shipment booking failed for ${newShipment.id}: ${newShipment.notes}`);
  }
  newShipment.updatedAt = new Date();
  mockShipments.push(newShipment);

  if (bookingResult.success) {
    res.status(201).json(newShipment);
  } else {
    // Return a different status if booking failed but we still saved a record of the attempt
    res.status(202).json({ message: "Shipment request accepted, but booking failed with carrier.", details: newShipment });
  }
};

export const getShipmentById = async (req: Request, res: Response): Promise<void> => {
    const { shipmentId } = req.params;
    const { tenantId } = req.query; // Or from auth context
    const shipment = mockShipments.find(s => s.id === shipmentId && s.tenantId === tenantId);
    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({ message: 'Shipment not found or access denied.' });
    }
};

export const getShipmentTracking = async (req: Request, res: Response): Promise<void> => {
  const { shipmentId } = req.params;
  const { tenantId } = req.query; // Or from auth context

  const shipment = mockShipments.find(s => s.id === shipmentId && s.tenantId === tenantId);
  if (!shipment) {
    res.status(404).json({ message: 'Shipment not found or access denied.' });
    return;
  }
  if (!shipment.trackingNumber || !shipment.carrierId) { // Need at least a master tracking number
    res.status(404).json({ message: 'Tracking information not available for this shipment (no tracking number or carrier).' });
    return;
  }

  const carrier = mockCarriers.find(c => c.id === shipment.carrierId);
  if (!carrier || !carrier.supportsTracking) {
    res.status(500).json({ message: 'Carrier configuration error or carrier does not support tracking.' });
    return;
  }

  const trackingInfo: CarrierTrackingResponse = await CarrierApiService.getTrackingInfo(carrier, shipment.trackingNumber);

  if (trackingInfo.success) {
    res.json({
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
        carrierId: shipment.carrierId,
        carrierName: carrier.name,
        currentStatus: trackingInfo.currentStatus || shipment.status, // Prefer carrier's live status
        estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate,
        events: trackingInfo.events
    });
  } else {
    res.status(502).json({ message: 'Failed to retrieve tracking information from carrier.', error: trackingInfo.error });
  }
};

// TODO: Add controllers for cancelling shipments (if supported by carrier API), listing shipments with filters.
