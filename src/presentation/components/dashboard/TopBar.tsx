'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <button className="p-1 hover:bg-slate-100 rounded">
              ←
            </button>
            <button className="p-1 hover:bg-slate-100 rounded">
              →
            </button>
          </div>
          
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              OrípioFin
            </Link>
            <span className="text-slate-400">›</span>
            <span className="text-slate-900 font-medium">Dashboard</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <select className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            
            <button className="flex items-center gap-2 text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors">
              <span className="text-slate-600">🔄</span>
              <span>Reset Data</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg relative text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-lg">❓</span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg relative text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-lg">✉️</span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg relative text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-lg">🔔</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full border border-green-400"></div>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                <span>Share</span>
                <span className="text-slate-600">📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}