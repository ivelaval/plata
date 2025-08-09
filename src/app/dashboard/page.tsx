'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NoSSR from '@/presentation/components/NoSSR';
import { FinancialSummary } from '@/application/usecases/GetUserFinancialData';

// Dynamic imports to prevent SSR issues
const FinancialCard = dynamic(() => import('@/presentation/components/dashboard/FinancialCard'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-48"></div>
});

const CashFlowChart = dynamic(() => import('@/presentation/components/dashboard/CashFlowChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cash Flow</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">$342,323.44</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-slate-600">Monthly</button>
          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg">Yearly</button>
        </div>
      </div>
      <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-lg animate-pulse">
        <div className="text-slate-500">Loading chart...</div>
      </div>
    </div>
  )
});

const WalletCard = dynamic(() => import('@/presentation/components/dashboard/WalletCard'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-80"></div>
});

const RecentActivities = dynamic(() => import('@/presentation/components/dashboard/RecentActivities'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-96"></div>
});

export default function DashboardPage() {
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/financial-data?userId=1');
        const result = await response.json();
        
        if (result.success) {
          setFinancialData(result.data);
        } else {
          console.error('Error loading financial data:', result.error);
        }
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-red-600">Error loading data</div>
      </div>
    );
  }

  const walletBalance = financialData.accounts.find(a => a.type === 'wallet');
  const savingsBalance = financialData.accounts.find(a => a.type === 'savings');
  const investmentBalance = financialData.accounts.find(a => a.type === 'investment');

  const walletData = [
    {
      id: '1',
      currency: 'USD',
      amount: 22678,
      limit: 50000,
      flag: '🇺🇸',
      status: 'Active' as const,
    },
    {
      id: '2',
      currency: 'EUR',
      amount: 18345,
      limit: 30000,
      flag: '🇪🇺',
      status: 'Active' as const,
    },
    {
      id: '3',
      currency: 'BDT',
      amount: 122678,
      limit: 200000,
      flag: '🇧🇩',
      status: 'Active' as const,
    },
    {
      id: '4',
      currency: 'GBP',
      amount: 15000,
      limit: 25000,
      flag: '🇬🇧',
      status: 'Inactive' as const,
    },
  ];

  return (
    <NoSSR
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Overview</h1>
            <p className="text-slate-600">Here is the summary of overall data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-48"></div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-48"></div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-80"></div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-80"></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse h-96"></div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Overview</h1>
          <p className="text-slate-600">Here is the summary of overall data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinancialCard
            title="My balance"
            subtitle="Wallet Overview & Spending"
            amount={`$${walletBalance?.balance.toLocaleString() || '0'}.32`}
            change="+1.5% ↗"
            changeType="positive"
            icon="💰"
            actionText="See details"
            onAction={() => console.log('See wallet details')}
          />
          
          <FinancialCard
            title="Savings account"
            subtitle="Steady Growth Savings"
            amount={`$${savingsBalance?.balance.toLocaleString() || '0'}.45`}
            change="+3.2% ↗"
            changeType="positive"
            icon="💳"
            actionText="View summary"
            onAction={() => console.log('View savings summary')}
          />
          
          <FinancialCard
            title="Investment portfolio"
            subtitle="Track Your Wealth Growth"
            amount={`$${investmentBalance?.balance.toLocaleString() || '0'}.78`}
            change="+4.7% ↗"
            changeType="positive"
            icon="📈"
            actionText="Analyze performance"
            onAction={() => console.log('Analyze investment performance')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashFlowChart data={financialData.cashFlowData} />
          <WalletCard walletData={walletData} />
        </div>

        <RecentActivities transactions={financialData.transactions} />
      </div>
    </NoSSR>
  );
}