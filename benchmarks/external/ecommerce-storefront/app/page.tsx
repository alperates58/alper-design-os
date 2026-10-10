import React from 'react';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';

export default function StorefrontHome() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Nordic Apparel</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input className="pl-9 pr-4 py-2 border rounded-md" placeholder="Search catalog..." />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart (2)</span>
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="border rounded-lg p-4 bg-white">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </h2>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> In Stock
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Sustainable Wool
              </label>
            </div>
          </aside>
          <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <article className="border rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-slate-100 rounded-md mb-3" />
              <h3 className="font-medium">Merino Heavy Knit</h3>
              <p className="text-sm text-slate-500">$180.00</p>
              <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                <Star className="w-3 h-3 fill-current" />
                <span>4.9 (42 reviews)</span>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
