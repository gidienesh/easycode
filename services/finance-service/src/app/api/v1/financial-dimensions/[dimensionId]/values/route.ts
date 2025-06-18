import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaPlaceholders'; // Adjust path as needed

interface RouteContext {
  params: {
    dimensionId: string; // The ID of the parent FinancialDimension
  };
}

// Helper to check tenantId, assuming tenantId is part of the request context or JWT claims in a real app
const getTenantIdFromRequest = (request: Request): string | null => {
  // Placeholder: In a real app, extract from JWT or a header
  return request.headers.get('X-Tenant-ID') || 'test-tenant'; // Default for placeholder
};


export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId } = params;
    const body = await request.json();
    const { value, description, isActive } = body;
    const tenantId = getTenantIdFromRequest(request); // For checking parent dimension ownership

    if (!value) {
      return NextResponse.json({ error: 'Missing required field: value' }, { status: 400 });
    }
    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID context is required.' }, { status: 400 });
    }

    // Check if parent FinancialDimension exists and belongs to the tenant
    const parentDimension = await prisma.financialDimension.findUnique({
      where: { id: dimensionId },
    });

    if (!parentDimension) {
      return NextResponse.json({ error: `Financial dimension with ID ${dimensionId} not found.` }, { status: 404 });
    }
    if (parentDimension.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Access to financial dimension denied for this tenant.' }, { status: 403 });
    }

    // Simulate checking for uniqueness: financialDimensionId + value
    // @ts-ignore
    const existingValue = prisma._mockDb.financialDimensionValues.find(
      fdv => fdv.financialDimensionId === dimensionId && fdv.value === value
    );
    if (existingValue) {
      return NextResponse.json({ error: `Value "${value}" already exists for this financial dimension.` }, { status: 409 });
    }

    const newDimensionValue = await prisma.financialDimensionValue.create({
      data: {
        financialDimensionId: dimensionId,
        value,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(newDimensionValue, { status: 201 });
  } catch (error: any) {
    console.error(`POST /api/v1/financial-dimensions/${params.dimensionId}/values Error:`, error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create financial dimension value', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId } = params;
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get('isActive');
    const tenantId = getTenantIdFromRequest(request); // For checking parent dimension ownership


    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID context is required.' }, { status: 400 });
    }

    // Optional: Check if parent FinancialDimension exists and belongs to the tenant before listing values
    const parentDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId } });
    if (!parentDimension) {
      return NextResponse.json({ error: `Financial dimension with ID ${dimensionId} not found.` }, { status: 404 });
    }
    if (parentDimension.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access to financial dimension values denied for this tenant.' }, { status: 403 });
    }

    const filters: any = { financialDimensionId: dimensionId };
    if (isActiveParam !== null) {
      filters.isActive = isActiveParam === 'true';
    }

    const dimensionValues = await prisma.financialDimensionValue.findMany({
      where: filters,
    });

    return NextResponse.json(dimensionValues, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/v1/financial-dimensions/${params.dimensionId}/values Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch financial dimension values', details: error.message }, { status: 500 });
  }
}
