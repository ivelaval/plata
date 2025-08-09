'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <span className="text-xl font-bold text-slate-900">FinanceFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}