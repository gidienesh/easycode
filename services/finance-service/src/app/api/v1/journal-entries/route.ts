import { NextResponse } from 'next/server';
import { prisma, JournalEntryStatus, JournalEntryLine } from '@/lib/prismaPlaceholders'; // Adjusted import path
// Note: Using a proper Decimal library is crucial for financial applications.
// The placeholder uses 'number' for simplicity, which is not suitable for real currency.
// We'll simulate Decimal logic for validation.

// Helper to simulate Decimal for validation logic
class SimpleDecimal {
  private value: number;
  constructor(val: string | number) {
    // In a real scenario, this would handle various formats and precision
    this.value = parseFloat(Number(val).toFixed(2)); // Basic toFixed for 2 decimal places
  }
  plus(other: SimpleDecimal): SimpleDecimal {
    return new SimpleDecimal(this.value + other.value);
  }
  equals(other: SimpleDecimal): boolean {
    return this.value === other.value;
  }
  isGreaterThan(other: SimpleDecimal | number): boolean {
    const otherValue = typeof other === 'number' ? other : other.value;
    return this.value > otherValue;
  }
  isNegative(): boolean {
    return this.value < 0;
  }
  toNumber(): number {
    return this.value;
  }
}


const validateJournalEntryLines = (lines: Array<Partial<JournalEntryLine>>): string | null => {
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return 'Journal entry must have at least one line.';
  }

  let totalDebit = new SimpleDecimal(0);
  let totalCredit = new SimpleDecimal(0);

  for (const line of lines) {
    if (!line.chartOfAccountId) {
      return 'Each line must have a chartOfAccountId.';
    }
    const debit = new SimpleDecimal(line.debit ?? 0);
    const credit = new SimpleDecimal(line.credit ?? 0);

    if (debit.isNegative() || credit.isNegative()) {
      return 'Debit and credit amounts cannot be negative.';
    }
    if (debit.isGreaterThan(0) && credit.isGreaterThan(0)) {
      return 'A single line cannot have both debit and credit values greater than zero.';
    }
    // It's okay for a line to have 0 debit and 0 credit if it's being cleared or placeholder,
    // but the sum of all debits/credits for the JE must be > 0.

    totalDebit = totalDebit.plus(debit);
    totalCredit = totalCredit.plus(credit);
  }

  if (!totalDebit.equals(totalCredit)) {
    return 'Total debits and credits must balance.';
  }
  if (!totalDebit.isGreaterThan(0)) { // Also implies totalCredit > 0 due to balance check
      return 'Total debits and credits must be greater than zero.';
  }

  return null; // No validation errors
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, tenantId, entryDate, lines } = body; // Status is forced to DRAFT on create

    if (!description || !tenantId || !entryDate) {
      return NextResponse.json({ error: 'Missing required fields: description, tenantId, entryDate' }, { status: 400 });
    }

    const lineValidationError = validateJournalEntryLines(lines);
    if (lineValidationError) {
      return NextResponse.json({ error: lineValidationError }, { status: 400 });
    }

    const journalEntryData = {
      description,
      tenantId,
      entryDate: new Date(entryDate),
      status: JournalEntryStatus.DRAFT, // Always DRAFT on creation
      lines: {
        create: lines.map((line: any) => ({
          chartOfAccountId: line.chartOfAccountId,
          debit: new SimpleDecimal(line.debit || 0).toNumber(),
          credit: new SimpleDecimal(line.credit || 0).toNumber(),
          description: line.description,
          financialDimensions: line.financialDimensions,
        })),
      },
    };

    // @ts-ignore // Prisma placeholder might not match perfectly with inferred types for nested create
    const newEntry = await prisma.journalEntry.create({
      data: journalEntryData,
      include: { lines: true },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/v1/journal-entries Error:', error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) { // More robust check
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create journal entry', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const descriptionSearch = searchParams.get('description'); // New filter

    const filters: any = {};
    if (tenantId) filters.tenantId = tenantId;
    if (status) {
        if (!Object.values(JournalEntryStatus).includes(status as JournalEntryStatus)) {
            return NextResponse.json({ error: 'Invalid status filter value' }, { status: 400 });
        }
        filters.status = status as JournalEntryStatus;
    }
    if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (!isNaN(parsedStartDate.getTime())) {
            filters.entryDate = { ...filters.entryDate, gte: parsedStartDate };
        } else {
            return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 });
        }
    }
    if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (!isNaN(parsedEndDate.getTime())) {
            filters.entryDate = { ...filters.entryDate, lte: parsedEndDate };
        } else {
            return NextResponse.json({ error: 'Invalid endDate format' }, { status: 400 });
        }
    }
    if (descriptionSearch) { // Basic contains search (prisma specific: { contains: descriptionSearch, mode: 'insensitive' })
        filters.description = { contains: descriptionSearch }; // Placeholder will need to simulate this
    }

    const entries = await prisma.journalEntry.findMany({
      where: filters,
      include: { lines: true },
      orderBy: { entryDate: 'desc' },
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/v1/journal-entries Error:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries', details: error.message }, { status: 500 });
  }
}
