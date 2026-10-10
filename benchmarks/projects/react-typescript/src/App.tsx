import React, { useState } from 'react';

interface MetricItem {
  id: string;
  name: string;
  value: number;
}

export function App() {
  const [metrics] = useState<MetricItem[]>([
    { id: 'm1', name: 'Latency', value: 42 },
    { id: 'm2', name: 'Throughput', value: 980 }
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
      </header>
      <main className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <span className="text-sm text-slate-400">{m.name}</span>
            <p className="text-3xl font-semibold mt-1">{m.value}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
