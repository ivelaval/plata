'use client';

import { useState } from 'react';
import { CashFlowData } from '@/domain/entities/User';

interface TestResult {
  status: 'success' | 'error';
  message: string;
  error?: string;
  data?: {
    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
    accountsCount: number;
    transactionsCount: number;
    assetsCount: number;
    liabilitiesCount: number;
    budgetsCount: number;
    cyclesCount: number;
    totalBalance: number;
    netWorth: number;
    cashFlowData: CashFlowData[];
  };
}

export default function TestSupabaseClientPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      // First seed the data
      const seedResponse = await fetch('/api/setup-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed-data' })
      });

      if (!seedResponse.ok) {
        throw new Error(`Seed failed: ${seedResponse.statusText}`);
      }

      // Then test the repository
      const testResponse = await fetch('/api/test-repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 })
      });

      if (!testResponse.ok) {
        throw new Error(`Test failed: ${testResponse.statusText}`);
      }

      const testResult = await testResponse.json();
      setResult({
        status: 'success',
        message: 'Supabase test completed successfully!',
        data: testResult
      });

    } catch (error) {
      setResult({
        status: 'error',
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Repository Test (Client-Side)
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <button
            onClick={runTest}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '🔄 Running Test...' : '🧪 Run Supabase Test'}
          </button>
        </div>

        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {result.status === 'error' ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-red-800">❌ Test Failed</h3>
                <p className="text-red-700 mt-2">{result.message}</p>
                {result.error && (
                  <pre className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded overflow-auto">
                    {result.error}
                  </pre>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-green-800">✅ Test Successful</h3>
                <p className="text-green-700 mt-2">{result.message}</p>
              </div>
            )}

            {result.data && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">User Data</h3>
                  <pre className="text-sm">{JSON.stringify(result.data.user, null, 2)}</pre>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Data Counts</h3>
                  <pre className="text-sm">{JSON.stringify({
                    accounts: result.data.accountsCount,
                    transactions: result.data.transactionsCount,
                    assets: result.data.assetsCount,
                    liabilities: result.data.liabilitiesCount,
                    budgets: result.data.budgetsCount,
                    cycles: result.data.cyclesCount,
                  }, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-blue-800">📝 About This Test</h3>
          <p className="text-blue-700 mt-2">
            This client-side test avoids build-time execution by running the Supabase operations 
            only when you click the button. This prevents the seeding script from running during 
            the build process.
          </p>
        </div>
      </div>
    </div>
  );
}