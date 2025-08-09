'use client';

interface FinancialCardProps {
  title: string;
  subtitle: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  actionText: string;
  onAction: () => void;
}

export default function FinancialCard({
  title,
  subtitle,
  amount,
  change,
  changeType,
  icon,
  actionText,
  onAction,
}: FinancialCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          ⋯
        </button>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-slate-900 mb-1">
          {amount}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        </div>
      </div>

      <button
        onClick={onAction}
        className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
      >
        {actionText}
        <span>→</span>
      </button>
    </div>
  );
}