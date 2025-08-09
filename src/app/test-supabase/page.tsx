import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { GetUserFinancialData } from '@/application/usecases/GetUserFinancialData';
import { seedSupabaseData } from '@/infrastructure/supabase/seed';
import { CashFlowData } from '@/domain/entities/User';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function TestSupabasePage() {
  let result;
  let error;

  // Check if Supabase is configured
  const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseConfigured) {
    error = {
      status: 'error',
      message: 'Supabase not configured',
      error: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables',
    };
  } else {
    try {
      // First, seed the data
      console.log('Seeding Supabase data...');
      await seedSupabaseData();

    // Test the Supabase repository
    const userRepository = new SupabaseUserRepository();
    const getUserFinancialData = new GetUserFinancialData(userRepository);

    // Test with user ID 1
    const financialData = await getUserFinancialData.execute(BigInt(1));

    result = {
      status: 'success',
      message: 'Supabase connection and data operations successful!',
      data: {
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
      },
    };

    } catch (err) {
      console.error('Error testing Supabase:', err);
      error = {
        status: 'error',
        message: 'Failed to connect to Supabase or process data',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Connection Test
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-800">❌ Test Failed</h3>
              <p className="text-red-700 mt-2">{error.message}</p>
              <pre className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded overflow-auto">
                {error.error}
              </pre>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-800">✅ Test Successful</h3>
              <p className="text-green-700 mt-2">{result?.message}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">User Data</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {result.data.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {result.data.user?.email || 'N/A'}</p>
                <p><strong>ID:</strong> {result.data.user?.id || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Data Counts</h3>
              <div className="space-y-2">
                <p><strong>Accounts:</strong> {result.data.accountsCount}</p>
                <p><strong>Transactions:</strong> {result.data.transactionsCount}</p>
                <p><strong>Assets:</strong> {result.data.assetsCount}</p>
                <p><strong>Liabilities:</strong> {result.data.liabilitiesCount}</p>
                <p><strong>Budgets:</strong> {result.data.budgetsCount}</p>
                <p><strong>Cycles:</strong> {result.data.cyclesCount}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
              <div className="space-y-2">
                <p><strong>Total Balance:</strong> ${result.data.totalBalance.toLocaleString()}</p>
                <p><strong>Net Worth:</strong> ${result.data.netWorth.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Cash Flow Data</h3>
              <div className="space-y-2">
                {result.data.cashFlowData.map((item: CashFlowData, index: number) => (
                  <p key={index}>
                    <strong>{item.date}:</strong> ${item.cashFlow.toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-blue-800">Setup Instructions</h3>
          <div className="text-blue-700 mt-2">
            <p className="mb-2">To set up Supabase:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
              <li>Copy your project URL and anon key</li>
              <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file with:</li>
            </ol>
            <pre className="bg-blue-100 p-2 rounded mt-2 text-sm overflow-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
            </pre>
            <p className="mt-2">
              <li>Run the migration SQL in your Supabase SQL editor</li>
              <li>Refresh this page to test the connection</li>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}