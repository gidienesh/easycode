// Tenant type
default export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'trial' | 'offboarded';
  primaryContact: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  branding?: {
    logoUrl?: string;
    colorScheme?: string;
  };
  region?: {
    timezone?: string;
    language?: string;
    currency?: string;
  };
  entitlements: string[]; // List of enabled service/module IDs
  subdomain?: string;
  affiliateAgentId?: string;
}

// Feature/Service type
export interface Feature {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  modules?: FeatureModule[];
}

export interface FeatureModule {
  id: string;
  name: string;
  description: string;
}

// Affiliate Agent type
export interface AffiliateAgent {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
} 