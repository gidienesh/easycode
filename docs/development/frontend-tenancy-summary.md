# Frontend Tenancy Summary

## How Tenancy Works on the Frontend

When all services are backend, the frontend acts as a **smart client** that adapts its interface based on tenant entitlements. Here's how it works:

## 1. Tenant Context Identification

The frontend identifies which tenant it's operating in through:

- **Subdomain**: `client-company.easycode.com`
- **Path**: `easycode.com/tenant/client-company`
- **Query Parameter**: `easycode.com?tenant=client-company`
- **Local Storage**: For authenticated sessions

## 2. Dynamic UI Based on Entitlements

### Navigation
- Only shows menu items for services the tenant has access to
- Disabled services are hidden or grayed out
- Always shows core features (Dashboard, Settings)

### Components
- Service-specific components check entitlements before rendering
- Shows appropriate error messages when services aren't available
- Graceful fallbacks for disabled features

## 3. API Calls with Tenant Context

Every API call includes tenant context:

```typescript
// All requests include tenant ID in headers
headers: {
  'X-Tenant-ID': tenantId,
  'Content-Type': 'application/json'
}
```

## 4. User Experience Examples

### Scenario 1: Full-Service Tenant
- **Company**: Large enterprise with all services
- **Navigation**: Shows all menu items (CRM, Finance, Inventory, etc.)
- **Features**: Full access to all modules
- **API Calls**: All service endpoints available

### Scenario 2: Limited-Service Tenant
- **Company**: Small startup with basic services
- **Navigation**: Only shows enabled services (User Management, Notifications)
- **Features**: Limited to basic functionality
- **API Calls**: Only to enabled service endpoints

### Scenario 3: Trial Tenant
- **Company**: New customer on trial
- **Navigation**: Shows trial-eligible services
- **Features**: Limited functionality with upgrade prompts
- **API Calls**: Trial-restricted endpoints

## 5. Key Benefits

1. **Single Codebase**: One frontend serves all tenants
2. **Dynamic Configuration**: UI adapts automatically
3. **Security**: Frontend enforces access control
4. **User Experience**: Clean, relevant interface for each tenant
5. **Scalability**: Easy to add new services/features

## 6. Implementation Flow

1. **User Access**: User visits platform with tenant context
2. **Tenant Loading**: Frontend loads tenant details and entitlements
3. **UI Rendering**: Navigation and components render based on entitlements
4. **API Communication**: All requests include tenant context
5. **Data Isolation**: Backend services filter data by tenant

## 7. Demo

Visit `/tenant-demo` to see a live demonstration of how different tenant configurations affect the frontend interface.

This approach ensures that users only see and can access what their organization has paid for, while maintaining a consistent and professional experience across all tenants. 