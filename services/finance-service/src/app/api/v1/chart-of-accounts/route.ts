import { NextResponse } from 'next/server';
import { prisma, AccountType } from '@/lib/prismaPlaceholders'; // Adjusted import path

// Enum values for validation
const validAccountTypes = Object.values(AccountType);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      accountCode,
      accountName,
      accountType,
      tenantId,
      parentId,
      hierarchyLevel,
      isActive,
    } = body;

    // Basic validation
    if (!accountCode || !accountName || !accountType || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields: accountCode, accountName, accountType, tenantId' }, { status: 400 });
    }

    if (!validAccountTypes.includes(accountType as AccountType)) {
      return NextResponse.json({ error: `Invalid accountType. Must be one of: ${validAccountTypes.join(', ')}` }, { status: 400 });
    }

    const chartOfAccountData: any = {
      accountCode,
      accountName,
      accountType,
      tenantId,
      parentId: parentId || null, // Ensure parentId is null if not provided, to match Prisma schema optional relation
      hierarchyLevel: hierarchyLevel !== undefined ? Number(hierarchyLevel) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    const newAccount = await prisma.chartOfAccount.create({
      data: chartOfAccountData,
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/v1/chart-of-accounts Error:', error);
    if (error.name === 'SyntaxError') { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    // In a real scenario, you might check for Prisma-specific error codes here
    return NextResponse.json({ error: 'Failed to create chart of account', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const isActiveParam = searchParams.get('isActive');
    const parentId = searchParams.get('parentId');

    const filters: any = {};
    if (tenantId) filters.tenantId = tenantId;
    if (isActiveParam !== null) filters.isActive = isActiveParam === 'true';
    if (parentId) filters.parentId = parentId;
    // parentId: null can be a valid filter for top-level accounts
    if (searchParams.has('parentId') && parentId === null) filters.parentId = null;


    const accounts = await prisma.chartOfAccount.findMany({
      where: filters,
      // You might want to add orderBy, include (for children/parent) here
      // include: { children: true, parent: true } // Example
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/v1/chart-of-accounts Error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart of accounts', details: error.message }, { status: 500 });
  }
}
