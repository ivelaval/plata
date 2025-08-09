'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  count?: number;
}

const mainMenuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈', count: 20 },
  { name: 'Transactions', href: '/dashboard/transactions', icon: '💳' },
  { name: 'Invoices', href: '/dashboard/invoices', icon: '📄' },
];

const featureItems: MenuItem[] = [
  { name: 'Recurring', href: '/dashboard/recurring', icon: '🔄', count: 16 },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: '📋' },
  { name: 'Feedback', href: '/dashboard/feedback', icon: '💬' },
];

const generalItems: MenuItem[] = [
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  { name: 'Help Desk', href: '/dashboard/help', icon: '❓' },
  { name: 'Log out', href: '/logout', icon: '🚪' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">$</span>
          </div>
          <span className="text-xl font-bold text-slate-900">OrípioFin</span>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <div className="absolute right-3 top-2.5">
            <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">⌘ K</span>
          </div>
        </div>

        <nav className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
              MAIN MENU
            </h3>
            <ul className="space-y-1">
              {mainMenuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.count && (
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
              FEATURES
            </h3>
            <ul className="space-y-1">
              {featureItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.count && (
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
              GENERAL
            </h3>
            <ul className="space-y-1">
              {generalItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span>🔥</span>
            <span className="font-semibold">Upgrade Pro!</span>
          </div>
          <p className="text-sm text-green-50 mb-3">
            Higher productivity with better organization
          </p>
          <button className="w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-50 transition-colors">
            ⬆ Upgrade
          </button>
          <button className="block text-green-100 text-sm mt-2 hover:text-white transition-colors">
            Learn more
          </button>
        </div>
      </div>
    </aside>
  );
}