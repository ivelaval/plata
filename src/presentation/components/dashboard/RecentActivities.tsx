'use client';

import { Transaction } from '@/domain/entities/User';

interface RecentActivitiesProps {
  transactions: Transaction[];
}

export default function RecentActivities({ transactions }: RecentActivitiesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute right-3 top-2.5 text-slate-400">
              🔍
            </div>
          </div>
          <button className="text-slate-600 hover:text-slate-900">
            Filter ⚙️
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Activity</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Order ID</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Price</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      📄
                    </div>
                    <span className="font-medium text-slate-900">{transaction.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600">INV-{transaction.id.toString().slice(0, 6)}</td>
                <td className="py-4 px-4 text-slate-600">{formatDate(transaction.date)}</td>
                <td className="py-4 px-4 text-slate-600">{formatTime(transaction.date)}</td>
                <td className="py-4 px-4 font-semibold text-slate-900">
                  ${transaction.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      'completed'
                    )}`}
                  >
                    • completed
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-slate-400 hover:text-slate-600">
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}