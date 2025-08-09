'use client';

import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/presentation/components/dashboard/Sidebar'), {
  ssr: false,
  loading: () => (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen animate-pulse">
      <div className="p-6 space-y-6">
        <div className="h-10 bg-slate-200 rounded-lg"></div>
        <div className="h-10 bg-slate-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
});

const TopBar = dynamic(() => import('@/presentation/components/dashboard/TopBar'), {
  ssr: false,
  loading: () => (
    <div className="bg-white border-b border-slate-200 px-6 py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <div className="flex gap-4">
          <div className="h-8 bg-slate-200 rounded w-32"></div>
          <div className="h-8 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}