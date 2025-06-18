import { NextResponse } from 'next/server';
import { prisma, AccountType } from '@/lib/prismaPlaceholders'; // Adjusted import path

// Enum values for validation
const validAccountTypes = Object.values(AccountType);

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const account = await prisma.chartOfAccount.findUnique({
      where: { id },
      // include: { children: true, parent: true } // Example for including relations
    });

    if (!account) {
      return NextResponse.json({ error: 'Chart of account not found' }, { status: 404 });
    }

    return NextResponse.json(account, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/v1/chart-of-accounts/${params.id} Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch chart of account', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();

    // Fields that can be updated
    const {
      accountCode,
      accountName,
      accountType,
      parentId,
      hierarchyLevel,
      isActive,
      // tenantId should generally not be updatable for an existing record.
    } = body;

    // Basic validation for provided fields
    if (accountType && !validAccountTypes.includes(accountType as AccountType)) {
      return NextResponse.json({ error: `Invalid accountType. Must be one of: ${validAccountTypes.join(', ')}` }, { status: 400 });
    }

    // Construct data object with only provided fields
    const updateData: any = {};
    if (accountCode !== undefined) updateData.accountCode = accountCode;
    if (accountName !== undefined) updateData.accountName = accountName;
    if (accountType !== undefined) updateData.accountType = accountType;
    if (parentId !== undefined) updateData.parentId = parentId === "" ? null : parentId; // Allow unsetting parent
    if (hierarchyLevel !== undefined) updateData.hierarchyLevel = Number(hierarchyLevel);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    const updatedAccount = await prisma.chartOfAccount.update({
      where: { id },
      data: updateData,
    });

    if (!updatedAccount) { // Placeholder might return null if "not found"
        return NextResponse.json({ error: 'Chart of account not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/v1/chart-of-accounts/${params.id} Error:`, error);
    if (error.name === 'SyntaxError') { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    // In a real Prisma setup, you'd check for specific error codes, e.g., P2025 for record not found.
    // Our placeholder's update might return null if we decide it should for "not found".
    return NextResponse.json({ error: 'Failed to update chart of account', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;

    // You might want to check for children accounts before deleting,
    // depending on business logic (e.g., prevent deletion of accounts with children).
    // const account = await prisma.chartOfAccount.findUnique({ where: { id }, include: { children: true }});
    // if (account?.children && account.children.length > 0) {
    //   return NextResponse.json({ error: 'Cannot delete account with children. Reassign children first.' }, { status: 409 }); // Conflict
    // }

    const deletedAccount = await prisma.chartOfAccount.delete({
      where: { id },
    });

    if (!deletedAccount) { // Placeholder might return null if "not found"
        return NextResponse.json({ error: 'Chart of account not found' }, { status: 404 });
    }

    // Return 204 No Content for DELETE typically, or 200 with the deleted object / success message
    return new NextResponse(null, { status: 204 });
    // return NextResponse.json({ message: `Chart of account ${id} deleted successfully`}, { status: 200 });

  } catch (error: any) {
    console.error(`DELETE /api/v1/chart-of-accounts/${params.id} Error:`, error);
    // In a real Prisma setup, P2025 error code means record not found.
    return NextResponse.json({ error: 'Failed to delete chart of account', details: error.message }, { status: 500 });
  }
}
