import { Shipment, Package, Carrier, TrackingEvent, Address } from '../models';

export interface CarrierShipmentResponse {
    success: boolean;
    trackingNumber?: string; // Master tracking number
    shipmentId?: string; // Carrier's internal ID for the shipment
    packageTrackingNumbers?: { packageId: string, trackingNumber: string }[]; // If per-package tracking
    labelUrl?: string; // URL to print the shipping label(s)
    rate?: number; // If rate was quoted
    currency?: string;
    error?: string;
    carrierDetails?: any; // Carrier specific response data
}

export interface CarrierTrackingResponse {
    success: boolean;
    events?: TrackingEvent[];
    estimatedDeliveryDate?: Date;
    currentStatus?: string; // Carrier's current status text
    error?: string;
    carrierDetails?: any;
}

// This would be a base class or dispatcher for specific carrier integrations
// For a real system, you'd have subclasses like FedExApiService, UpsApiService, ShippoApiService, etc.
export class CarrierApiService {
  static async createShipment(carrier: Carrier, shipmentDetails: Shipment): Promise<CarrierShipmentResponse> {
    console.log(`Mock CarrierAPI (${carrier.name}): Creating shipment for local ID ${shipmentDetails.id}`);
    // Simulate API call to a specific carrier or an aggregator
    if (carrier.id === 'mock_fail_carrier') {
        return { success: false, error: 'Mock carrier booking failure: Insufficient funds' };
    }

    // Simulate generating tracking numbers for each package
    const packageTrackingNumbers = shipmentDetails.packages.map(pkg => ({
        packageId: pkg.id, // Assuming internal package ID
        trackingNumber: `trk-${carrier.id}-pkg-${pkg.id.substring(0, 8)}-${Date.now()}`
    }));

    return {
        success: true,
        trackingNumber: `master-trk-${carrier.id}-${Date.now()}`, // Example master tracking
        shipmentId: `carrier-ship-${shipmentDetails.id.substring(0,12)}`,
        packageTrackingNumbers,
        labelUrl: `http://mock-carrier.com/labels/${shipmentDetails.id}.pdf`,
        rate: Math.random() * 100, // Mock rate
        currency: 'USD'
    };
  }

  static async getTrackingInfo(carrier: Carrier, trackingNumber: string): Promise<CarrierTrackingResponse> {
    console.log(`Mock CarrierAPI (${carrier.name}): Getting tracking for ${trackingNumber}`);
    if (trackingNumber.includes('fail')) {
        return { success: false, error: 'Mock carrier tracking error: Invalid tracking number' };
    }

    const mockEvents: TrackingEvent[] = [
      { timestamp: new Date(Date.now() - 2 * 86400000), statusDescription: 'Shipment information received by carrier', location: shipmentDetailsForMockTracking.originAddress as Address },
      { timestamp: new Date(Date.now() - 86400000), statusDescription: 'Picked Up', location: shipmentDetailsForMockTracking.originAddress as Address },
      { timestamp: new Date(Date.now() - 3600000), statusDescription: 'In Transit to Destination Facility', location: { city: 'Intermediate Hub', countryCode: 'US'} as Address },
      { timestamp: new Date(), statusDescription: 'Arrived at Local Facility', location: shipmentDetailsForMockTracking.destinationAddress as Address }
    ];
    const estimatedDelivery = new Date(Date.now() + 86400000);

    return { success: true, events: mockEvents, estimatedDeliveryDate: estimatedDelivery, currentStatus: 'In Transit' };
  }
}

// Mock shipment details for getTrackingInfo to use, as it doesn't have access to the full Shipment object
const shipmentDetailsForMockTracking = {
    originAddress: { city: 'Origin City', countryCode: 'US', street1: '1 Main St', postalCode: '10001', stateProvince: 'NY' },
    destinationAddress: { city: 'Destination City', countryCode: 'US', street1: '100 End Rd', postalCode: '90001', stateProvince: 'CA' }
};
