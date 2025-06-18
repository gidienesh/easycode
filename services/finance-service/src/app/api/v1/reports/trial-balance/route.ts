import { NextResponse } from 'next/server';
import { prisma, JournalEntryStatus, ChartOfAccount, JournalEntryLine } from '@/lib/prismaPlaceholders'; // Adjust path as needed

// Note: Using a proper Decimal library is crucial for financial applications.
// The placeholder uses 'number' for simplicity, which is not suitable for real currency.
class SimpleDecimal {
  private value: number;
  constructor(val: string | number | SimpleDecimal) {
    if (val instanceof SimpleDecimal) {
        this.value = val.toNumber();
    } else {
        // Basic toFixed for 2 decimal places, ensure it's a number first
        this.value = parseFloat(Number(val).toFixed(2));
    }
  }
  plus(other: SimpleDecimal): SimpleDecimal {
    return new SimpleDecimal(this.value + other.value);
  }
  minus(other: SimpleDecimal): SimpleDecimal {
    return new SimpleDecimal(this.value - other.value);
  }
  toNumber(): number {
    return this.value;
  }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!tenantId || !startDateStr || !endDateStr) {
      return NextResponse.json({ error: 'Missing required query parameters: tenantId, startDate, endDate' }, { status: 400 });
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for startDate or endDate' }, { status: 400 });
    }
    // Optional: Ensure endDate is not before startDate
    if (endDate < startDate) {
        return NextResponse.json({ error: 'endDate cannot be before startDate' }, { status: 400 });
    }
    // Set endDate to the end of the day for inclusive range
    endDate.setHours(23, 59, 59, 999);


    const activeAccounts = await prisma.chartOfAccount.findMany({
      where: {
        tenantId: tenantId,
        isActive: true,
      },
    });

    if (!activeAccounts || activeAccounts.length === 0) {
      return NextResponse.json([], { status: 200 }); // No active accounts, return empty trial balance
    }

    const trialBalanceReportLines = [];

    for (const account of activeAccounts) {
      let totalDebit = new SimpleDecimal(0);
      let totalCredit = new SimpleDecimal(0);

      // The placeholder for journalEntryLine.findMany needs to be smart enough
      // to filter based on the parent JournalEntry's properties.
      // We'll construct a complex 'where' that the placeholder can interpret.
      const lines = await prisma.journalEntryLine.findMany({
        where: {
          chartOfAccountId: account.id,
          // This part simulates needing to join/filter on JournalEntry properties
          // The placeholder needs to handle this specific structure.
          journalEntry: { // This is a made-up structure for the placeholder to understand
            tenantId: tenantId,
            status: JournalEntryStatus.POSTED,
            entryDate: {
              gte: startDate.toISOString(), // Use ISO strings for placeholder consistency
              lte: endDate.toISOString(),
            },
          },
        },
      });

      for (const line of lines) {
        totalDebit = totalDebit.plus(new SimpleDecimal(line.debit));
        totalCredit = totalCredit.plus(new SimpleDecimal(line.credit));
      }

      // Only include accounts that have activity or are part of the COA.
      // A traditional trial balance includes all accounts, even with zero balance.
      trialBalanceReportLines.push({
        accountCode: account.accountCode,
        accountName: account.accountName,
        totalDebit: totalDebit.toNumber(),
        totalCredit: totalCredit.toNumber(),
        balance: totalDebit.minus(totalCredit).toNumber(),
      });
    }

    return NextResponse.json(trialBalanceReportLines, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/v1/reports/trial-balance Error:', error);
    return NextResponse.json({ error: 'Failed to generate trial balance report', details: error.message }, { status: 500 });
  }
}
