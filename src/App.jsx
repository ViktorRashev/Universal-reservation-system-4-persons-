import { CalendarCheck2, FileText, Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import BusinessSelector from './components/BusinessSelector';
import DateNavigator from './components/DateNavigator';
import FilterBar from './components/FilterBar';
import ScheduleGrid from './components/ScheduleGrid';
import BookingModal from './components/BookingModal';
import { useBooking } from './context/BookingContext';

function DailyNotes() {
  const { selectedDate, activeBusiness, dailyNote, setDailyNote } = useBooking();

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-fit">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Дневни бележки</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        {activeBusiness.shortName} · {selectedDate}
      </p>
      <label htmlFor="daily-note" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
        Бележките се запазват автоматично в този браузър.
      </label>
      <textarea
        id="daily-note"
        rows={10}
        className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Например: Проверка на оборудването в 09:00..."
        value={dailyNote}
        onChange={(event) => setDailyNote(event.target.value)}
      />
      <p className="text-[11px] mt-3 text-slate-400">За демонстрация: не въвеждайте реални лични или медицински данни.</p>
    </aside>
  );
}

export default function App() {
  const { activeBusiness, selectedDate, reservations, openCreateBooking } = useBooking();
  const activeForDay = reservations.filter((booking) =>
    booking.businessId === activeBusiness.id &&
    booking.date === selectedDate &&
    booking.status !== 'cancelled' && booking.status !== 'canceled');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck2 className="w-5 h-5 text-indigo-600" />
              <h1 className="text-2xl font-extrabold tracking-tight">График и резервации</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{activeBusiness.tagline}</p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm"
            onClick={() => openCreateBooking()}
          >
            <Plus className="w-4 h-4" /> Нова резервация
          </button>
        </section>

        <BusinessSelector />
        <DateNavigator />

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          <div className="min-w-0 space-y-5">
            <FilterBar />
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-base font-bold">График за {selectedDate}</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{activeForDay.length} активни резервации</span>
            </div>
            <ScheduleGrid />
          </div>
          <DailyNotes />
        </section>
      </main>
      <BookingModal />
    </div>
  );
}
