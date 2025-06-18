import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaPlaceholders'; // Adjust path as needed

interface RouteContext {
  params: {
    dimensionId: string;
  };
}

// Helper to check tenantId, assuming tenantId is part of the request context or JWT claims in a real app
// For now, we'll pass it or assume it's part of the dimension data for checks.
const getTenantIdFromRequest = (request: Request): string | null => {
  // Placeholder: In a real app, extract from JWT or a header
  return request.headers.get('X-Tenant-ID') || 'test-tenant'; // Default for placeholder
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId } = params;
    // const tenantId = getTenantIdFromRequest(request); // Add tenantId check

    const dimension = await prisma.financialDimension.findUnique({
      where: { id: dimensionId },
      include: { definedValues: true }, // Include defined values
    });

    if (!dimension) {
      return NextResponse.json({ error: 'Financial dimension not found' }, { status: 404 });
    }
    // Optional: Check if dimension.tenantId matches tenantId from request

    return NextResponse.json(dimension, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/v1/financial-dimensions/${params.dimensionId} Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch financial dimension', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId } = params;
    const body = await request.json();
    const { name, description, isActive } = body;
    const tenantId = getTenantIdFromRequest(request); // Assuming we need tenant context for uniqueness check

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required for this operation.' }, { status: 400 });
    }

    const existingDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId }});
    if (!existingDimension) {
        return NextResponse.json({ error: 'Financial dimension not found' }, { status: 404 });
    }
    // Optional: if (existingDimension.tenantId !== tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });


    if (name && name !== existingDimension.name) {
      // Simulate checking for uniqueness: tenantId + name
      // @ts-ignore
      const conflictingDimension = prisma._mockDb.financialDimensions.find(
        fd => fd.tenantId === existingDimension.tenantId && fd.name === name && fd.id !== dimensionId
      );
      if (conflictingDimension) {
        return NextResponse.json({ error: `Financial dimension with name "${name}" already exists for this tenant.` }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(existingDimension, { status: 200 }); // No changes
    }

    const updatedDimension = await prisma.financialDimension.update({
      where: { id: dimensionId },
      data: updateData,
    });

    return NextResponse.json(updatedDimension, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/v1/financial-dimensions/${params.dimensionId} Error:`, error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update financial dimension', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { dimensionId } = params;
    // const tenantId = getTenantIdFromRequest(request); // Add tenantId check

    // First, check if the dimension exists
    const existingDimension = await prisma.financialDimension.findUnique({ where: { id: dimensionId }});
    if (!existingDimension) {
        return NextResponse.json({ error: 'Financial dimension not found' }, { status: 404 });
    }
    // Optional: if (existingDimension.tenantId !== tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });


    await prisma.financialDimension.delete({
      where: { id: dimensionId },
    });
    // Note: The placeholder's delete also removes associated values from its mockDb.
    // In real Prisma, this depends on `onDelete` relation strategy in schema.prisma.

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`DELETE /api/v1/financial-dimensions/${params.dimensionId} Error:`, error);
    // Handle potential errors, e.g., if delete fails due to constraints not handled by placeholder
    return NextResponse.json({ error: 'Failed to delete financial dimension', details: error.message }, { status: 500 });
  }
}
