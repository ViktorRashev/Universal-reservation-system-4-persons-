import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { validateReservation, timeToMinutes, minutesToTime } from '../utils/bookingEngine';
import { X, CheckCircle2, AlertTriangle, Trash2, Ban } from 'lucide-react';

export default function BookingModal() {
  const {
    bookingModalState,
    closeBookingModal,
    addReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
    activeBusiness,
    selectedDate,
    reservationsIndex,
    selectedPartySize
  } = useBooking();

  const { isOpen, mode, slot, resource, reservationToEdit } = bookingModalState;

  const [formData, setFormData] = useState({
    resourceId: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '09:30',
    partySize: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    serviceName: '',
    notes: ''
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && reservationToEdit) {
      setFormData({
        resourceId: reservationToEdit.resourceId,
        date: reservationToEdit.date,
        startTime: reservationToEdit.startTime,
        endTime: reservationToEdit.endTime,
        partySize: reservationToEdit.partySize || 1,
        customerName: reservationToEdit.customerName || '',
        customerPhone: reservationToEdit.customerPhone || '',
        customerEmail: reservationToEdit.customerEmail || '',
        serviceId: reservationToEdit.serviceId || '',
        serviceName: reservationToEdit.serviceName || '',
        notes: reservationToEdit.notes || ''
      });
    } else {
      const defaultResource = resource || activeBusiness.resources[0];
      const defaultStart = slot?.time || activeBusiness.workingHours.open;
      const slotDuration = activeBusiness.slotDurationMinutes || 30;
      const defaultEnd = slot?.endTime || minutesToTime(timeToMinutes(defaultStart) + slotDuration);
      const defaultService = activeBusiness.services?.[0] || { id: '', name: '' };

      setFormData({
        resourceId: defaultResource.id,
        date: selectedDate,
        startTime: defaultStart,
        endTime: defaultEnd,
        partySize: activeBusiness.allowsCustomPartySize ? (selectedPartySize || 1) : 1,
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        serviceId: defaultService.id,
        serviceName: defaultService.name,
        notes: ''
      });
    }
  }, [isOpen, mode, slot, resource, reservationToEdit, selectedDate, activeBusiness, selectedPartySize]);

  const currentResource = useMemo(() => {
    return activeBusiness.resources.find(r => r.id === formData.resourceId) || activeBusiness.resources[0];
  }, [activeBusiness, formData.resourceId]);

  const validationResult = useMemo(() => {
    if (!isOpen || !currentResource) return { valid: true };

    return validateReservation({
      businessConfig: activeBusiness,
      resource: currentResource,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      partySize: formData.partySize,
      reservationsIndex,
      excludeReservationId: mode === 'edit' ? reservationToEdit?.id : null
    });
  }, [isOpen, activeBusiness, currentResource, formData, reservationsIndex, mode, reservationToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      alert('Моля, въведете име и телефонен номер за връзка.');
      return;
    }

    if (mode === 'edit') {
      updateReservation(reservationToEdit.id, formData);
    } else {
      addReservation(formData);
    }
  };

  const handleServiceChange = (e) => {
    const srv = activeBusiness.services?.find(s => s.id === e.target.value);
    if (srv) {
      setFormData(prev => {
        const startM = timeToMinutes(prev.startTime);
        const duration = srv.duration || activeBusiness.slotDurationMinutes || 30;
        return {
          ...prev,
          serviceId: srv.id,
          serviceName: srv.name,
          endTime: minutesToTime(startM + duration)
        };
      });
    } else {
      setFormData(prev => ({ ...prev, serviceId: '', serviceName: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              {mode === 'edit' ? 'Редактиране на резервация' : 'Нова резервация'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeBusiness.name}</p>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!validationResult.valid && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2.5 text-xs text-rose-800 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationResult.error}</span>
          </div>
        )}

        {validationResult.valid && (
          <div className="bg-emerald-50/80 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Избраният интервал е свободен и напълно валиден!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeBusiness.resourceLabel}
              </label>
              <select
                value={formData.resourceId}
                onChange={(e) => setFormData(prev => ({ ...prev, resourceId: e.target.value }))}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {activeBusiness.resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Дата</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Начален час</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  const newStart = e.target.value;
                  const duration = activeBusiness.slotDurationMinutes || 30;
                  setFormData(prev => ({
                    ...prev,
                    startTime: newStart,
                    endTime: minutesToTime(timeToMinutes(newStart) + duration)
                  }));
                }}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Краен час</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {activeBusiness.services && activeBusiness.services.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Услуга / Процедура</label>
              <select
                value={formData.serviceId}
                onChange={handleServiceChange}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {activeBusiness.services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} мин) - {s.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeBusiness.allowsCustomPartySize && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeBusiness.capacityLabel} (макс. {currentResource?.capacity || 10})
              </label>
              <input
                type="number"
                min="1"
                max={currentResource?.capacity || 20}
                value={formData.partySize}
                onChange={(e) => setFormData(prev => ({ ...prev, partySize: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Име на клиент / пациент *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Иван Петров"
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Телефон за контакт *</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="+359 888 123 456"
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Имейл адрес</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="ivan@example.com"
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Бележки / Специални изисквания</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Специфични предпочитания, медицински данни или детайли..."
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {mode === 'edit' ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Сигурни ли сте, че искате да анулирате тази резервация?')) {
                      cancelReservation(reservationToEdit.id);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 border border-rose-200"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Анулирай
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Сигурни ли сте, че искате да изтриете напълно записа?')) {
                      deleteReservation(reservationToEdit.id);
                    }
                  }}
                  className="p-2 text-xs text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Изтриване на записа"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Отказ
              </button>
              <button
                type="submit"
                disabled={!validationResult.valid}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md ${
                  validationResult.valid
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    : 'bg-slate-300 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {mode === 'edit' ? 'Запази промените' : 'Потвърди резервацията'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}