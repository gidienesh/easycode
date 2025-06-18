export interface Address { // Reusable from other services if common model exists
  street1: string;
  street2?: string;
  city: string;
  stateProvince: string; // State, Province, or Region
  postalCode: string;
  countryCode: string; // ISO 2-letter alpha code (e.g., US, CA, GB)
  contactName?: string;
  companyName?: string;
  phoneNumber?: string;
  email?: string;
  isResidential?: boolean; // Useful for some carriers
}

export interface PackageItem {
  sku?: string; // From inventory-service or provided directly
  description: string;
  quantity: number;
  unitPrice?: number; // Optional, for customs/insurance value
  weight?: number; // Individual item weight
  weightUnit?: 'kg' | 'lb';
  dimensions?: { length: number; width: number; height: number; unit: 'cm' | 'in'; }; // Individual item dimensions
  hsCode?: string; // Harmonized System code for international shipments
  countryOfOrigin?: string; // ISO 2-letter
}

export interface Package {
  id: string; // System generated UUID for this package record, or can be carrier's package ID if known upfront
  trackingNumber?: string; // Carrier's tracking number specifically for this package
  weight: number; // Total weight of the package
  weightUnit: 'kg' | 'lb';
  dimensions: { length: number; width: number; height: number; unit: 'cm' | 'in'; }; // Total dimensions of the package
  items: PackageItem[];
  declaredValue?: number; // For insurance purposes
  currency?: string; // Currency for declared value
  packageType?: 'custom' | 'box_small' | 'box_medium' | 'pallet' | string; // Standard or custom
  // other package specific details
}

export type ShipmentStatus = 'draft' | 'pending_booking' | 'booked' | 'pickup_scheduled' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'attempted_delivery' | 'cancelled' | 'return_to_sender';

export interface Shipment {
  id: string; // UUID for the shipment
  tenantId: string;
  externalOrderId?: string; // e.g., CRM/POS Order ID, Procurement PO ID for inbound
  originAddress: Address;
  destinationAddress: Address;
  returnAddress?: Address; // Optional
  carrierId?: string; // Link to Carrier model (e.g., 'fedex', 'ups')
  carrierServiceLevel?: string; // e.g., 'ground', 'express', 'next_day_air', 'freight_ltl'
  packages: Package[];
  shipmentDate?: Date; // Scheduled or actual date of shipment
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  status: ShipmentStatus;
  trackingNumber?: string; // Master tracking number if applicable (some carriers provide one for multi-package shipments)
  freightCost?: number;
  currency?: string; // Currency for freight cost
  insuranceAmount?: number; // Amount insured for
  isInsured?: boolean;
  customsInformation?: Record<string, any>; // For international shipments
  notes?: string; // Internal notes or delivery instructions
  createdAt: Date;
  updatedAt: Date;
}

export interface Carrier {
  id: string; // System ID, e.g., 'fedex', 'ups_freight', 'dhl_express'
  tenantId?: string; // Some carriers might be tenant-specific if negotiated rates are stored here
  name: string; // e.g., "FedEx", "UPS Freight"
  servicesOffered?: Array<{id: string; name: string; type: 'parcel' | 'freight' | 'international'}>; // e.g., ["Ground", "Express", "International Priority"]
  apiIntegrationClass?: string; // For dynamic loading of provider logic (e.g., 'FedExApiService', 'ShippoService')
  accountNumber?: string; // If a direct account is held
  isActive: boolean;
  supportsTracking?: boolean;
  supportsShippingLabels?: boolean;
}

export interface TrackingEvent {
  timestamp: Date;
  statusDescription: string;
  location?: Partial<Address>; // Partial address (city, state, country) or just city/country
  eventCode?: string; // Carrier specific event code
  notes?: string;
}

export interface ShipmentTrackingInfo {
  shipmentId: string;
  trackingNumber?: string; // Master or primary package tracking number
  carrierId?: string;
  events: TrackingEvent[];
  estimatedDeliveryDate?: Date;
  status?: ShipmentStatus; // Current overall status from tracking
}
