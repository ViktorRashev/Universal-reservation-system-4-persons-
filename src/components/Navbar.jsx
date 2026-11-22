import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { BUSINESS_CONFIGS } from '../data/businessConfigs';
import { CalendarDays, Sun, Moon, RotateCcw, ChevronDown, PlusCircle, LayoutDashboard, BarChart2, X } from 'lucide-react';

export default function Navbar() {
  const { 
    activeBusinessId, 
    switchBusiness, 
    resetToFactoryData, 
    toast,
    openCreateBooking,
    resourcesSlotsMap
  } = useBooking();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const allSlots = Object.values(resourcesSlotsMap).flat();
  const totalSlots = allSlots.length;
  const bookedSlots = allSlots.filter(s => s.status === 'BOOKED').length;
  const availableSlots = allSlots.filter(s => s.status === 'AVAILABLE' || s.status === 'PARTIAL').length;
  const occupancyRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800">
          <span>{toast.message}</span>
        </div>
      )}

      {/* Модален прозорец за Анализи */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold tracking-tight">Анализ на натовареността</h3>
              </div>
              <button onClick={() => setShowAnalyticsModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Общо часове / слотове</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalSlots}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Заети часове</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{bookedSlots}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Свободни часове</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{availableSlots}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Процент на заета площ</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{occupancyRate}%</span>
                </div>
              </div>

              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-sm mt-2"
              >
                Затвори справката
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Основен Navbar */}
      <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          
          {/* Лява част: Лого и име */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">ReservationSchedule</span>
                </div>
              </div>
            </div>

            {/* Меню опции горе */}
            <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>График</span>
              </button>

              <button 
                onClick={() => setShowAnalyticsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Анализи</span>
              </button>
            </nav>
          </div>

          {/* Дясна част */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openCreateBooking()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Нов час</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="relative inline-block text-left">
                <select
                  value={activeBusinessId}
                  onChange={(e) => switchBusiness(e.target.value)}
                  className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                >
                  {Object.values(BUSINESS_CONFIGS).map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Светъл режим' : 'Тъмен режим'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={resetToFactoryData}
              title="Възстанови фабрични данни"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>

        </div>
      </header>
    </>
  );
}