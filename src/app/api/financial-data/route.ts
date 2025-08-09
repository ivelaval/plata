import { NextRequest, NextResponse } from 'next/server';
import { getUserRepository } from '@/infrastructure/repositories/RepositoryFactory';
import { GetUserFinancialData } from '@/application/usecases/GetUserFinancialData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    // Get the configured repository
    const userRepository = await getUserRepository();
    const getUserFinancialData = new GetUserFinancialData(userRepository);

    // Execute the use case
    const financialData = await getUserFinancialData.execute(BigInt(userId));

    return NextResponse.json({
      success: true,
      data: {
        user: financialData.user ? {
          id: financialData.user.id.toString(),
          name: financialData.user.name,
          email: financialData.user.email,
        } : null,
        accounts: financialData.accounts,
        transactions: financialData.transactions,
        assets: financialData.assets,
        liabilities: financialData.liabilities,
        budgets: financialData.budgets,
        cycles: financialData.cycles,
        totalBalance: financialData.totalBalance,
        netWorth: financialData.netWorth,
        cashFlowData: financialData.cashFlowData,
      },
    });

  } catch (error) {
    console.error('Financial data API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}