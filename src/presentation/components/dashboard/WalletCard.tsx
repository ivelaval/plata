'use client';

interface WalletItem {
  id: string;
  currency: string;
  amount: number;
  limit: number;
  flag: string;
  status: 'Active' | 'Inactive';
}

interface WalletCardProps {
  walletData: WalletItem[];
}

export default function WalletCard({ walletData }: WalletCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">My Wallet</h3>
          <p className="text-sm text-slate-600">Today TUSD = 122.20 BDT</p>
        </div>
        <button className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors">
          + Add New
        </button>
      </div>

      <div className="space-y-4">
        {walletData.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                {item.flag}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.currency}</p>
                <p className="text-sm text-slate-600">
                  Limit is ${item.limit.toLocaleString()} a month
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-slate-900">
                ${item.amount.toLocaleString()}.00
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.status}
              </span>
            </div>
            
            <button className="text-slate-400 hover:text-slate-600 ml-2">
              ⋯
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}