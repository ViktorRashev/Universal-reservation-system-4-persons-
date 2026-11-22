import React, { memo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Clock, User, Plus, CalendarOff } from 'lucide-react';

const SlotCard = memo(function SlotCard({
  slot,
  resource,
  onSelectAvailable,
  onSelectBooked
}) {
  const isBooked = slot.status === 'BOOKED';
  const isPartial = slot.status === 'PARTIAL';
  const isBreak = slot.status === 'BREAK';
  const isPast = slot.status === 'PAST';
  const isClosed = slot.status === 'CLOSED';

  if (isClosed) {
    return (
      <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
        <CalendarOff className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
        {slot.label || 'Почивен ден за този ресурс'}
      </div>
    );
  }

  if (isBreak) {
    return (
      <div className="py-2.5 px-3 rounded-xl bg-slate-100/70 text-slate-400 text-xs flex items-center justify-between opacity-80 cursor-not-allowed">
        <div className="flex items-center gap-1.5 font-mono font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{slot.time} - {slot.endTime}</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-200/70 text-slate-500 dark:text-slate-400 px-1.5 rounded">
          Почивка
        </span>
      </div>
    );
  }

  if (isPast) {
    return (
      <div className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs flex items-center justify-between opacity-50">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{slot.time}</span>
        </div>
        <span className="text-[10px]">Изминал</span>
      </div>
    );
  }

  if (isBooked) {
    const booking = slot.bookings[0];
    return (
      <div
        onClick={() => booking && onSelectBooked(booking)}
        className="group relative py-2.5 px-3 rounded-xl bg-rose-50/70 border border-rose-200 text-slate-800 text-xs flex flex-col justify-between hover:bg-rose-100/80 transition-all cursor-pointer shadow-xs"
        title="Кликнете за преглед или промяна на резервацията"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono font-bold text-rose-900 text-xs">
            {slot.time} - {slot.endTime}
          </span>
          <span className="text-[10px] font-bold bg-rose-200/80 text-rose-800 px-1.5 py-0.2 rounded-full uppercase">
            Зает
          </span>
        </div>
        <div className="truncate text-slate-700 font-medium flex items-center gap-1">
          <User className="w-3 h-3 text-rose-500 shrink-0" />
          <span className="truncate">{booking ? booking.customerName : 'Резервиран'}</span>
        </div>
      </div>
    );
  }

  if (isPartial) {
    return (
      <div
        onClick={() => onSelectAvailable(slot, resource)}
        className="group py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-slate-800 text-xs flex flex-col justify-between hover:bg-amber-100 transition-all cursor-pointer shadow-xs hover:border-amber-400"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono font-bold text-amber-900 text-xs">
            {slot.time} - {slot.endTime}
          </span>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full">
            {slot.occupiedCapacity}/{slot.maxCapacity} заети
          </span>
        </div>
        <div className="flex items-center justify-between text-amber-800 font-medium">
          <span>Свободни: {slot.remainingCapacity}</span>
          <span className="text-amber-700 font-bold group-hover:underline flex items-center gap-0.5">
            + Резервирай
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelectAvailable(slot, resource)}
      className="group py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/70 shadow-sm text-slate-800 text-xs flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:scale-110 transition-transform">
        <Clock className="w-3.5 h-3.5 text-emerald-600" />
        <span>{slot.time} - {slot.endTime}</span>
      </div>
      <div className="flex items-center gap-1 text-emerald-700 font-bold opacity-80 group-hover:opacity-100">
        <span className="text-[11px] hidden sm:inline">Свободен</span>
        <Plus className="w-3.5 h-3.5 text-emerald-600" />
      </div>
    </button>
  );
});

export default function ScheduleGrid() {
  const {
    filteredResources,
    resourcesSlotsMap,
    openCreateBooking,
    openEditBooking
  } = useBooking();

  return (
    <div className="space-y-6">
      {filteredResources.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Няма намерени ресурси за текущия филтър.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const slots = resourcesSlotsMap[res.id] || [];
            const availableCount = slots.filter(s => s.status === 'AVAILABLE' || s.status === 'PARTIAL').length;

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/95 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${res.avatarBg}`}>
                      {res.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{res.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{res.role} • {res.room}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {availableCount} свободни
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      Капацитет: {res.capacity} {res.capacity === 1 ? 'място' : 'места'}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  {slots.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Няма налични слотове за този времеви филтър.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {slots.map((slot) => (
                        <SlotCard
                          key={slot.id}
                          slot={slot}
                          resource={res}
                          onSelectAvailable={openCreateBooking}
                          onSelectBooked={openEditBooking}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}