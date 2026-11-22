import React, { useState } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import BusinessSelector from './components/BusinessSelector';
import DateNavigator from './components/DateNavigator';
import FilterBar from './components/FilterBar';
import ScheduleGrid from './components/ScheduleGrid';
import BookingModal from './components/BookingModal';
import { runAlgorithmBenchmark } from './utils/bookingEngine';
import { Cpu, Play, CheckCircle2, Calendar, Clock, User, Phone, Edit2, Trash2, FileText } from 'lucide-react';

function ReservationsListView() {
  const { reservations, activeBusiness, openEditBooking, cancelReservation } = useBooking();
  const businessReservations = reservations.filter(r => r.businessId === activeBusiness.id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Всички резервации — {activeBusiness.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Общо {businessReservations.length} записа в базата</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
              <th className="py-3 px-4 font-bold">Дата и час</th>
              <th className="py-3 px-4 font-bold">Клиент</th>
              <th className="py-3 px-4 font-bold">{activeBusiness.resourceLabel}</th>
              <th className="py-3 px-4 font-bold">Услуга</th>
              <th className="py-3 px-4 font-bold">Места</th>
              <th className="py-3 px-4 font-bold">Статус</th>
              <th className="py-3 px-4 font-bold text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {businessReservations.map(res => {
              const resource = activeBusiness.resources.find(r => r.id === res.resourceId);
              return (
                <tr key={res.id} className="hover:bg-slate-50 dark:bg-slate-800/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    <div>{res.date}</div>
                    <div className="text-indigo-600">{res.startTime} - {res.endTime}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{res.customerName}</div>
                    <div className="text-slate-500 dark:text-slate-400">{res.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{resource?.name || res.resourceId}</td>
                  <td className="py-3 px-4 text-slate-600">{res.serviceName}</td>
                  <td className="py-3 px-4 font-bold">{res.partySize}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      res.status === 'cancelled'
                        ? 'bg-slate-100 text-slate-500 dark:text-slate-400'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {res.status === 'cancelled' ? 'Отменена' : 'Потвърдена'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditBooking(res)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                      title="Редакция"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {res.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Откажи"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const { analytics, activeBusiness, selectedDate } = useBooking();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Заетост за {selectedDate}</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">{analytics.occupancyRate}%</div>
          <div className="text-xs text-slate-400 mt-1">
            {analytics.bookedSlotsCount} от {analytics.totalSlotsCount} налични слота
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Активни резервации за деня</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{analytics.dayActiveReservations}</div>
          <div className="text-xs text-slate-400 mt-1">{activeBusiness.shortName}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Общо в профила</div>
          <div className="text-3xl font-black text-slate-800 mt-1">{analytics.totalBusinessReservations}</div>
          <div className="text-xs text-slate-400 mt-1">Всички дати</div>
        </div>
      </div>
    </div>
  );
}

function BenchmarkView() {
  const [result, setResult] = useState(null);

  const handleRun = () => {
    const stats = runAlgorithmBenchmark(5000);
    setResult(stats);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-600" />
            Алгоритмичен Benchmark & Stress Test
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Измерва скоростта на O(1) хеш-индексацията и интервалната проверка за конфликти (5 000 итерации).
          </p>
        </div>
        <button
          onClick={handleRun}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <Play className="w-4 h-4" />
          Стартирай тест (5 000 проверки)
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Общо време</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{result.totalMs} ms</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-xs text-emerald-700">Средно време / проверка</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">{result.avgMicrosec} μs</div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
            <div className="text-xs text-indigo-700">Операции в секунда</div>
            <div className="text-2xl font-black text-indigo-900 mt-1">{result.opsPerSec} ops/s</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-xs text-amber-700">Валидни слотове</div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              {result.passedCount} / {result.iterations}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainLayout() {
  const { activeView } = useBooking();
  const [dailyNotes, setDailyNotes] = useState('Оперативен график за днешния ден.\nПроверка на свободните ресурси.');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex flex-col w-full">
      <Navbar />
      
      {/* Контейнер разделен на централна част и десен панел с дневни бележки */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ЦЕНТРАЛНА ЧАСТ (Заема 9 колони) */}
        <section className="lg:col-span-9 flex flex-col gap-6 w-full">
          {activeView === 'booking' && (
            <div className="space-y-6">
              <BusinessSelector />
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 p-5 space-y-5">
                <DateNavigator />
                <FilterBar />
              </div>
              <ScheduleGrid />
            </div>
          )}
          {activeView === 'reservations' && <ReservationsListView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'benchmark' && <BenchmarkView />}
        </section>

        {/* ДЕСЕН СТРАНИЧЕН ПАНЕЛ С ДНЕВНИ БЕЛЕЖКИ (Заема 3 колони) */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-5 sticky top-20">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Дневни бележки
            </h3>
            <textarea
              value={dailyNotes}
              onChange={(e) => setDailyNotes(e.target.value)}
              placeholder="Добавете бележка..."
              className="w-full h-40 p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1.5 block">Бележките се запазват автоматично в сесията.</span>
          </div>
        </aside>

      </main>

      <BookingModal />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <MainLayout />
    </BookingProvider>
  );
}