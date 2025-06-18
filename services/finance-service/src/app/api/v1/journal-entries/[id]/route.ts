import { NextResponse } from 'next/server';
import { prisma, JournalEntryStatus, JournalEntryLine, ChartOfAccount } from '@/lib/prismaPlaceholders'; // Adjust path

// Note: Using a proper Decimal library is crucial for financial applications.
// The placeholder uses 'number' for simplicity, which is not suitable for real currency.
// We'll simulate Decimal logic for validation.
class SimpleDecimal {
  private value: number;
  constructor(val: string | number) {
    this.value = parseFloat(Number(val).toFixed(2));
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

const validateJournalEntryLinesForPosting = async (lines: Array<Partial<JournalEntryLine>>): Promise<string | null> => {
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return 'Journal entry must have at least one line to be posted.';
  }

  let totalDebit = new SimpleDecimal(0);
  let totalCredit = new SimpleDecimal(0);

  for (const line of lines) {
    if (!line.chartOfAccountId) {
      return 'Each line must have a chartOfAccountId.';
    }
    // Simulate checking if COA exists and is active using the placeholder
    const coaExists = await prisma.chartOfAccount.findUnique({ where: { id: line.chartOfAccountId } });
    if (!coaExists) {
        return `Chart of Account with ID ${line.chartOfAccountId} not found.`;
    }
    if (!coaExists.isActive) {
        return `Chart of Account ${coaExists.accountCode} (${coaExists.accountName}) is not active.`;
    }

    const debit = new SimpleDecimal(line.debit ?? 0);
    const credit = new SimpleDecimal(line.credit ?? 0);

    if (debit.isNegative() || credit.isNegative()) {
      return 'Debit and credit amounts cannot be negative.';
    }
    if (debit.isGreaterThan(0) && credit.isGreaterThan(0)) {
      return 'A single line cannot have both debit and credit values greater than zero.';
    }
    totalDebit = totalDebit.plus(debit);
    totalCredit = totalCredit.plus(credit);
  }

  if (!totalDebit.equals(totalCredit)) {
    return 'Total debits and credits must balance for posting.';
  }
   if (!totalDebit.isGreaterThan(0)) {
      return 'Total debits and credits must be greater than zero for posting.';
  }
  return null;
};


interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: { include: { chartOfAccount: true } } }, // Include COA details for lines
    });

    if (!entry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/v1/journal-entries/${params.id} Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch journal entry', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const { description, status: newStatus } = body;

    const currentEntry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: true }, // Make sure lines are fetched for validation if posting
    });

    if (!currentEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    const updateData: Partial<Omit<JournalEntry, 'id' | 'lines' | 'createdAt' | 'updatedAt'>> = {};
    let requiresSave = false;

    if (description !== undefined && description !== currentEntry.description) {
      if (currentEntry.status !== JournalEntryStatus.DRAFT) {
        return NextResponse.json({ error: 'Description can only be updated for DRAFT entries.' }, { status: 403 });
      }
      updateData.description = description;
      requiresSave = true;
    }

    if (newStatus !== undefined && newStatus !== currentEntry.status) {
      if (!Object.values(JournalEntryStatus).includes(newStatus as JournalEntryStatus)) {
        return NextResponse.json({ error: 'Invalid target status value.' }, { status: 400 });
      }

      if (currentEntry.status === JournalEntryStatus.DRAFT && newStatus === JournalEntryStatus.POSTED) {
        const lineValidationError = await validateJournalEntryLinesForPosting(currentEntry.lines || []);
        if (lineValidationError) {
          return NextResponse.json({ error: `Cannot post entry: ${lineValidationError}` }, { status: 400 });
        }
        // Simulate checking ChartOfAccount isActive (already in validateJournalEntryLinesForPosting)
        for (const line of currentEntry.lines!) {
            const chartAccount = await prisma.chartOfAccount.findUnique({ where: { id: line.chartOfAccountId }});
            if (!chartAccount || !chartAccount.isActive) {
                 return NextResponse.json({ error: `Cannot post entry: Chart of Account ${chartAccount?.accountCode || line.chartOfAccountId} is inactive or not found.` }, { status: 400 });
            }
        }
        updateData.status = JournalEntryStatus.POSTED;
        updateData.entryDate = new Date(); // Optionally set posting date to now, or use existing entryDate
        requiresSave = true;
        // In a real system, this is where you'd generate ledger entries / update account balances.
        console.log(`Simulating posting of Journal Entry ${id}. Ledger updates would occur here.`);

      } else if (currentEntry.status === JournalEntryStatus.POSTED && newStatus === JournalEntryStatus.REVERSED) {
        updateData.status = JournalEntryStatus.REVERSED;
        requiresSave = true;
        // In a real system, this might create a new reversing JE or mark this one and reverse transactions.
        console.log(`Simulating reversal of Journal Entry ${id}. Reversal ledger updates would occur here.`);

      } else {
        return NextResponse.json({ error: `Invalid status transition from ${currentEntry.status} to ${newStatus}.` }, { status: 400 });
      }
    }

    if (!requiresSave) {
      return NextResponse.json(currentEntry, { status: 200 }); // No changes to save, return current state
    }

    // @ts-ignore // Placeholder type might not perfectly align
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: updateData,
      include: { lines: true },
    });

    return NextResponse.json(updatedEntry, { status: 200 });

  } catch (error: any)
{
    console.error(`PUT /api/v1/journal-entries/${params.id} Error:`, error);
    if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update journal entry', details: error.message }, { status: 500 });
  }
}
