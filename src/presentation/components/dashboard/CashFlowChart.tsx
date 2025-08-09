'use client';

import { useEffect, useRef } from 'react';
import { CashFlowData } from '@/domain/entities/User';

interface CashFlowChartProps {
  data: CashFlowData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (data.length === 0) return;

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Find min and max values
    const values = data.map(d => d.cashFlow);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Draw grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const stepX = chartWidth / (data.length - 1);
    for (let i = 0; i < data.length; i++) {
      const x = padding + stepX * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, rect.height - padding);
      ctx.stroke();
    }

    // Create path for area chart
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].cashFlow - minValue) / valueRange;
      const y = rect.height - padding - normalizedValue * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Create area fill
    const lastX = padding + chartWidth;
    const bottomY = rect.height - padding;
    ctx.lineTo(lastX, bottomY);
    ctx.lineTo(padding, bottomY);
    ctx.closePath();

    // Fill area with gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].cashFlow - minValue) / valueRange;
      const y = rect.height - padding - normalizedValue * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].cashFlow - minValue) / valueRange;
      const y = rect.height - padding - normalizedValue * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cash Flow</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">$342,323.44</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Monthly
          </button>
          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg">
            Yearly
          </button>
        </div>
      </div>
      
      <div className="w-full h-[300px] relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
        {data.slice(0, 7).map((item) => (
          <div key={item.date} className="text-center">
            <div className="text-slate-500 font-medium">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}