import React from 'react';
import ReactECharts from 'echarts-for-react';
import { AgGridReact } from 'ag-grid-react';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export function PortfolioAnalyticsDashboard() {
  const chartOptions = {
    title: { text: 'Realtime Depth & Slippage Curve' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['10:00', '10:05', '10:10', '10:15', '10:20'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70], type: 'line', smooth: true }]
  };

  const columnDefs = [
    { field: 'orderId', headerName: 'Order ID', width: 120 },
    { field: 'asset', headerName: 'Asset Pair', width: 140 },
    { field: 'notional', headerName: 'Notional (USD)', width: 160 },
    { field: 'status', headerName: 'Execution Status', width: 140 }
  ];

  const rowData = [
    { orderId: 'ORD-9821', asset: 'ETH/USD', notional: '$450,000', status: 'FILLED' },
    { orderId: 'ORD-9822', asset: 'BTC/USD', notional: '$1,200,000', status: 'PENDING' }
  ];

  return (
    <div className="terminal-dashboard bg-zinc-950 text-zinc-100 p-4 font-mono text-xs">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wider">APEX CAPITAL EXECUTION TERMINAL</span>
        </div>
        <div className="flex gap-4">
          <span className="text-zinc-400">SESSION ID: 0x93FA</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE TRADING
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-2">
          <ReactECharts option={chartOptions} style={{ height: 260 }} />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-2 h-[280px] ag-theme-alpine-dark">
          <AgGridReact columnDefs={columnDefs} rowData={rowData} />
        </div>
      </div>
    </div>
  );
}
