import { NextRequest, NextResponse } from 'next/server';
import { getUserRepository } from '@/infrastructure/repositories/RepositoryFactory';
import { GetUserFinancialData } from '@/application/usecases/GetUserFinancialData';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId is required'
      }, { status: 400 });
    }

    // Test the configured repository
    const userRepository = await getUserRepository();
    const getUserFinancialData = new GetUserFinancialData(userRepository);

    // Execute the use case
    const financialData = await getUserFinancialData.execute(BigInt(userId));

    return NextResponse.json({
      user: financialData.user ? {
        id: financialData.user.id.toString(),
        name: financialData.user.name,
        email: financialData.user.email,
      } : null,
      accountsCount: financialData.accounts.length,
      transactionsCount: financialData.transactions.length,
      assetsCount: financialData.assets.length,
      liabilitiesCount: financialData.liabilities.length,
      budgetsCount: financialData.budgets.length,
      cyclesCount: financialData.cycles.length,
      totalBalance: financialData.totalBalance,
      netWorth: financialData.netWorth,
      cashFlowData: financialData.cashFlowData,
    });

  } catch (error) {
    console.error('Repository test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Repository Test API',
    usage: 'POST with userId to test Supabase repository'
  });
}