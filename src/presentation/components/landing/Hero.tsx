'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              • AVAILABLE FOR MAY 2025
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Fuelling{' '}
            <span className="text-orange-500 inline-flex items-center">
              📈
            </span>{' '}
            growth with every click
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl">
            From landing pages to automation, we craft lead funnels that grow your business on autopilot.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link
              href="/dashboard"
              className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition-colors"
            >
              Drive results now
            </Link>
            <button className="flex items-center justify-center gap-2 text-slate-700 font-semibold px-8 py-4 hover:text-slate-900 transition-colors">
              ▶ Learn more
            </button>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white"></div>
              </div>
              <div className="ml-4 flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Upcoming Calls</h3>
                <span className="text-sm text-slate-500">1hr</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">New client call: David</p>
                    <p className="text-sm text-slate-500">9:30 AM - 10:30 AM</p>
                  </div>
                </div>
                
                <div className="border-l-2 border-slate-200 pl-4 space-y-3">
                  <div className="text-sm font-medium text-slate-600">TUE 19 MAY</div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-slate-900">New client call: Sarah</p>
                      <p className="text-sm text-slate-500">9:30 AM - 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="font-medium text-slate-900">New client call: Leah</p>
                      <p className="text-sm text-slate-500">12:45 PM - 1:15 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-2 border-slate-200 pl-4 space-y-3">
                  <div className="text-sm font-medium text-slate-600">THU 21 MAY</div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                    <div>
                      <p className="font-medium text-slate-900">New client call: Joshua</p>
                      <p className="text-sm text-slate-500">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-2 border-slate-200 pl-4 space-y-3">
                  <div className="text-sm font-medium text-slate-600">MON 25 MAY</div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500"></div>
                    <div>
                      <p className="font-medium text-slate-900">New client call: Edward</p>
                      <p className="text-sm text-slate-500">10:30 AM - 11:09 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}