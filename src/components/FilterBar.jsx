import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Filter, Users, Sun, Sunset, Moon } from 'lucide-react';

export default function FilterBar() {
  const {
    activeBusiness,
    selectedResourceFilter,
    setSelectedResourceFilter,
    selectedTimeFilter,
    setSelectedTimeFilter,
    selectedPartySize,
    setSelectedPartySize
  } = useBooking();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {activeBusiness.resourceLabel}:
          </span>
          <select
            value={selectedResourceFilter}
            onChange={(e) => setSelectedResourceFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Всички ({activeBusiness.resources.length})</option>
            {activeBusiness.resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.room})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-0.5 text-xs font-medium">
          <button
            onClick={() => setSelectedTimeFilter('ALL')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedTimeFilter === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-100'
            }`}
          >
            Целият ден
          </button>
          <button
            onClick={() => setSelectedTimeFilter('MORNING')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
              selectedTimeFilter === 'MORNING'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-100'
            }`}
          >
            <Sun className="w-3 h-3 text-amber-500" />
            Сутрин
          </button>
          <button
            onClick={() => setSelectedTimeFilter('AFTERNOON')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
              selectedTimeFilter === 'AFTERNOON'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-100'
            }`}
          >
            <Sunset className="w-3 h-3 text-orange-500" />
            Следобед
          </button>
          <button
            onClick={() => setSelectedTimeFilter('EVENING')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
              selectedTimeFilter === 'EVENING'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-100'
            }`}
          >
            <Moon className="w-3 h-3 text-indigo-500" />
            Вечер
          </button>
        </div>

        {activeBusiness.allowsCustomPartySize && (
          <div className="flex items-center gap-2 pl-1">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Брой гости:</span>
            <select
              value={selectedPartySize}
              onChange={(e) => setSelectedPartySize(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 6, 8, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'човек' : 'души'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 overflow-x-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Легенда:</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Свободен</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span>Зает</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>Частичен</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
          <span>Почивка</span>
        </div>
      </div>
    </div>
  );
}