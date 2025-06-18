import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaPlaceholders'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tenantId, description, isActive } = body;

    if (!name || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields: name and tenantId' }, { status: 400 });
    }

    // Simulate checking for uniqueness: tenantId + name
    const existingDimension = await prisma.financialDimension.findMany({ // findFirst would be better if available
      where: { tenantId, name },
    });
    // @ts-ignore // Prisma placeholder _mockDb access for simulation
    const existingInMock = prisma._mockDb.financialDimensions.find(fd => fd.tenantId === tenantId && fd.name === name);


    if (existingInMock) { // Check our mockDb directly for more accurate simulation
      return NextResponse.json({ error: `Financial dimension with name "${name}" already exists for this tenant.` }, { status: 409 });
    }

    const newDimension = await prisma.financialDimension.create({
      data: {
        name,
        tenantId,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(newDimension, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/v1/financial-dimensions Error:', error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create financial dimension', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const isActiveParam = searchParams.get('isActive');

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing required query parameter: tenantId' }, { status: 400 });
    }

    const filters: any = { tenantId };
    if (isActiveParam !== null) {
      filters.isActive = isActiveParam === 'true';
    }

    const dimensions = await prisma.financialDimension.findMany({
      where: filters,
      include: { definedValues: true } // Optionally include defined values
    });

    return NextResponse.json(dimensions, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/v1/financial-dimensions Error:', error);
    return NextResponse.json({ error: 'Failed to fetch financial dimensions', details: error.message }, { status: 500 });
  }
}
