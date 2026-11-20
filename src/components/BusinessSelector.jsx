import React from 'react';
import { useBooking } from '../context/BookingContext';
import { BUSINESS_CONFIGS } from '../data/businessConfigs';
import { Stethoscope, Utensils, Dumbbell, Clock, Users, ShieldCheck, Check } from 'lucide-react';

const ICONS = {
  Stethoscope,
  Utensils,
  Dumbbell
};

export default function BusinessSelector() {
  const { activeBusinessId, switchBusiness } = useBooking();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Избор на тип бизнес и конфигурационен модел</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 dark:border-slate-800">
              3 демо конфигурации
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Системата адаптира автоматично работното време, продължителността на слотовете, логиката на капацитета и ресурсите.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(BUSINESS_CONFIGS).map((b) => {
          const Icon = ICONS[b.iconName] || Stethoscope;
          const isActive = activeBusinessId === b.id;

          return (
            <div
              key={b.id}
              onClick={() => switchBusiness(b.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/70 bg-white dark:bg-slate-900'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  <Check className="w-3 h-3" />
                  Активен
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{b.name}</h3>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{b.category}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{b.tagline}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>{b.slotDurationMinutes} мин</strong> / слот</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>{b.resources.length}</strong> {b.resourceLabel.toLowerCase()}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Работно: {b.workingHours.open} - {b.workingHours.close}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}