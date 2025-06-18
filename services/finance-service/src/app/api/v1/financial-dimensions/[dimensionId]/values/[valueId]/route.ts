import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaPlaceholders'; // Adjust path as needed

interface RouteContext {
  params: {
    dimensionId: string;
    valueId: string;
  };
}

// Helper to check tenantId (placeholder)
const getTenantIdFromRequest = (request: Request): string | null => {
  return request.headers.get('X-Tenant-ID') || 'test-tenant';
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId, valueId } = params;
    const tenantId = getTenantIdFromRequest(request);

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID context is required.' }, { status: 400 });
    }

    const value = await prisma.financialDimensionValue.findUnique({
      where: { id: valueId },
    });

    if (!value || value.financialDimensionId !== dimensionId) {
      return NextResponse.json({ error: 'Financial dimension value not found or does not belong to the specified dimension.' }, { status: 404 });
    }

    // Additionally, check if the parent dimension belongs to the tenant
    const parentDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId } });
    if (!parentDimension || parentDimension.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access to financial dimension denied for this tenant.' }, { status: 403 });
    }

    return NextResponse.json(value, { status: 200 });
  } catch (error: any) {
    console.error(`GET .../values/${params.valueId} Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch financial dimension value', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId, valueId } = params;
    const body = await request.json();
    const { value, description, isActive } = body;
    const tenantId = getTenantIdFromRequest(request);

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID context is required.' }, { status: 400 });
    }

    // Check parent dimension ownership first
    const parentDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId } });
    if (!parentDimension || parentDimension.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access to financial dimension denied for this tenant.' }, { status: 403 });
    }

    const existingValue = await prisma.financialDimensionValue.findUnique({ where: { id: valueId } });
    if (!existingValue || existingValue.financialDimensionId !== dimensionId) {
      return NextResponse.json({ error: 'Financial dimension value not found or does not belong to the specified dimension.' }, { status: 404 });
    }

    if (value && value !== existingValue.value) {
      // @ts-ignore
      const conflictingValue = prisma._mockDb.financialDimensionValues.find(
        fdv => fdv.financialDimensionId === dimensionId && fdv.value === value && fdv.id !== valueId
      );
      if (conflictingValue) {
        return NextResponse.json({ error: `Value "${value}" already exists for this financial dimension.` }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (value !== undefined) updateData.value = value;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(existingValue, { status: 200 }); // No changes
    }

    const updatedValue = await prisma.financialDimensionValue.update({
      where: { id: valueId },
      data: updateData,
    });

    return NextResponse.json(updatedValue, { status: 200 });
  } catch (error: any) {
    console.error(`PUT .../values/${params.valueId} Error:`, error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update financial dimension value', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId, valueId } = params;
    const tenantId = getTenantIdFromRequest(request);

     if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID context is required.' }, { status: 400 });
    }

    // Check parent dimension ownership first
    const parentDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId } });
    if (!parentDimension || parentDimension.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access to financial dimension denied for this tenant.' }, { status: 403 });
    }

    const existingValue = await prisma.financialDimensionValue.findUnique({ where: { id: valueId } });
    if (!existingValue || existingValue.financialDimensionId !== dimensionId) {
      return NextResponse.json({ error: 'Financial dimension value not found or does not belong to the specified dimension.' }, { status: 404 });
    }

    await prisma.financialDimensionValue.delete({
      where: { id: valueId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`DELETE .../values/${params.valueId} Error:`, error);
    return NextResponse.json({ error: 'Failed to delete financial dimension value', details: error.message }, { status: 500 });
  }
}
