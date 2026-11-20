import React from 'react';
import { useBooking } from '../context/BookingContext';
import { getRelativeDateStr } from '../data/mockReservations';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const BG_MONTHS = [
  'януари', 'февруари', 'март', 'април', 'май', 'юни',
  'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
];

const BG_DAYS = ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];

export default function DateNavigator() {
  const { selectedDate, setSelectedDate } = useBooking();

  const quickDays = Array.from({ length: 9 }).map((_, idx) => {
    const dateStr = getRelativeDateStr(idx);
    const d = new Date(dateStr + 'T00:00:00');
    return {
      dateStr,
      dayNum: d.getDate(),
      dayName: idx === 0 ? 'Днес' : idx === 1 ? 'Утре' : BG_DAYS[d.getDay()].slice(0, 3),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  });

  const currentDateObj = new Date(selectedDate + 'T00:00:00');
  const formattedHeaderDate = `${BG_DAYS[currentDateObj.getDay()]}, ${currentDateObj.getDate()} ${BG_MONTHS[currentDateObj.getMonth()]} ${currentDateObj.getFullYear()}`;

  const handleStepDay = (step) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + step);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800/85 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 capitalize">{formattedHeaderDate}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Изберете ден от графика за проверка на свободните часове</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => handleStepDay(-1)}
            title="Предишен ден"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleStepDay(1)}
            title="Следващ ден"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800 text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDate(getRelativeDateStr(0))}
            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            Днес
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {quickDays.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <button
              key={item.dateStr}
              onClick={() => setSelectedDate(item.dateStr)}
              className={`flex-1 min-w-[72px] sm:min-w-[84px] py-2 px-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className={`text-[11px] font-medium uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {item.dayName}
              </div>
              <div className="text-base sm:text-lg font-black mt-0.5">
                {item.dayNum}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}