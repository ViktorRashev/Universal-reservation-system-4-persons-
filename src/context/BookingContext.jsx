import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BUSINESS_CONFIGS } from '../data/businessConfigs';
import { INITIAL_RESERVATIONS, getRelativeDateStr } from '../data/mockReservations';
import { validateReservation } from '../utils/bookingEngine';
import {
  clearStoredData,
  loadDailyNotes,
  loadReservations,
  saveDailyNotes,
  saveReservations,
} from '../utils/storage';

const BookingContext = createContext(null);
const CLOSED_MODAL = {
  isOpen: false,
  mode: 'create',
  slot: null,
  resource: null,
  reservationToEdit: null,
};

// По този ключ групираме резервациите за един ресурс в един ден.
export const reservationIndexKey = (date, resourceId) => `${date}|${resourceId}`;

function timeToMinutes(time) {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const normalized = Math.max(0, Math.min(1440, minutes));
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

function activeReservation(booking) {
  return booking.status !== 'cancelled' && booking.status !== 'canceled';
}

function createReservationIndex(reservations) {
  const index = new Map();
  for (const booking of reservations) {
    if (!activeReservation(booking)) continue;
    const key = reservationIndexKey(booking.date, booking.resourceId);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(booking);
  }
  return index;
}

function makeResourceSlots(business, resource, date, reservationsIndex, partySize) {
  const jsDay = new Date(`${date}T00:00:00`).getDay();
  const weekDay = jsDay === 0 ? 7 : jsDay;
  if (resource.availableDays && !resource.availableDays.includes(weekDay)) {
    return [{ id: `${date}-${resource.id}-closed`, status: 'CLOSED', label: 'Почивен ден за този ресурс' }];
  }

  const start = timeToMinutes(business.workingHours.open);
  const close = timeToMinutes(business.workingHours.close);
  const step = business.slotDurationMinutes || 30;
  const bookings = reservationsIndex.get(reservationIndexKey(date, resource.id)) || [];
  const today = getRelativeDateStr(0);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const result = [];

  for (let minute = start; minute + step <= close; minute += step) {
    const end = minute + step;
    const matching = bookings.filter((booking) => {
      return timeToMinutes(booking.startTime) < end && timeToMinutes(booking.endTime) > minute;
    });
    const isBreak = (business.breaks || []).some((pause) => {
      return timeToMinutes(pause.start) < end && timeToMinutes(pause.end) > minute;
    });
    const occupiedCapacity = matching.reduce((sum, booking) => sum + (Number(booking.partySize) || 1), 0);
    const maxCapacity = Number(resource.capacity) || 1;
    const isShared = resource.isSharedPool === true;
    const remainingCapacity = Math.max(0, maxCapacity - occupiedCapacity);

    let status = 'AVAILABLE';
    if (isBreak) status = 'BREAK';
    else if (matching.length && (!isShared || remainingCapacity < partySize)) status = 'BOOKED';
    else if (matching.length && isShared) status = 'PARTIAL';
    else if (date < today || (date === today && end <= nowMinutes)) status = 'PAST';

    result.push({
      id: `${date}-${resource.id}-${minute}`,
      time: minutesToTime(minute),
      endTime: minutesToTime(end),
      status,
      bookings: matching,
      occupiedCapacity,
      remainingCapacity,
      maxCapacity,
    });
  }
  return result;
}

function createBookingId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `res-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BookingProvider({ children }) {
  const [activeBusinessId, setActiveBusinessId] = useState('medical');
  const [selectedDate, setSelectedDate] = useState(() => getRelativeDateStr(0));
  const [selectedResourceFilter, setSelectedResourceFilter] = useState('ALL');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('ALL');
  const [selectedPartySize, setSelectedPartySize] = useState(1);
  const [reservations, setReservations] = useState(() => loadReservations(INITIAL_RESERVATIONS));
  const [dailyNotes, setDailyNotes] = useState(loadDailyNotes);
  const [bookingModalState, setBookingModalState] = useState(CLOSED_MODAL);
  const [toast, setToast] = useState(null);

  const activeBusiness = BUSINESS_CONFIGS[activeBusinessId];

  useEffect(() => { saveReservations(reservations); }, [reservations]);
  useEffect(() => { saveDailyNotes(dailyNotes); }, [dailyNotes]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const reservationsIndex = useMemo(() => createReservationIndex(reservations), [reservations]);

  const filteredResources = useMemo(() => {
    return activeBusiness.resources.filter((resource) => {
      return selectedResourceFilter === 'ALL' || resource.id === selectedResourceFilter;
    });
  }, [activeBusiness, selectedResourceFilter]);

  const resourcesSlotsMap = useMemo(() => {
    const map = {};
    for (const resource of activeBusiness.resources) {
      let slots = makeResourceSlots(activeBusiness, resource, selectedDate, reservationsIndex, selectedPartySize);
      if (selectedTimeFilter !== 'ALL') {
        slots = slots.filter((slot) => {
          if (slot.status === 'CLOSED') return true;
          const minute = timeToMinutes(slot.time);
          if (selectedTimeFilter === 'MORNING') return minute < 12 * 60;
          if (selectedTimeFilter === 'AFTERNOON') return minute >= 12 * 60 && minute < 18 * 60;
          return minute >= 18 * 60; // EVENING
        });
      }
      map[resource.id] = slots;
    }
    return map;
  }, [activeBusiness, selectedDate, reservationsIndex, selectedPartySize, selectedTimeFilter]);

  const switchBusiness = useCallback((businessId) => {
    if (!BUSINESS_CONFIGS[businessId]) return;
    setActiveBusinessId(businessId);
    setSelectedResourceFilter('ALL');
    setSelectedTimeFilter('ALL');
    setSelectedPartySize(1);
    setBookingModalState(CLOSED_MODAL);
  }, []);

  const closeBookingModal = useCallback(() => setBookingModalState(CLOSED_MODAL), []);

  const openCreateBooking = useCallback((slot = null, resource = null) => {
    setBookingModalState({ isOpen: true, mode: 'create', slot, resource, reservationToEdit: null });
  }, []);

  const openEditBooking = useCallback((reservation) => {
    if (!reservation) return;
    setBookingModalState({
      isOpen: true, mode: 'edit', slot: null, resource: null, reservationToEdit: reservation,
    });
  }, []);

  // При запис проверяваме същата логика, която BookingModal използва за своята валидация.
  const checkReservation = useCallback((formData, excludeReservationId = null, businessId = activeBusinessId) => {
    const businessConfig = BUSINESS_CONFIGS[businessId];
    const resource = businessConfig?.resources.find((item) => item.id === formData.resourceId);
    if (!resource) return { valid: false, error: 'Невалиден ресурс.' };
    return validateReservation({
      businessConfig,
      resource,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      partySize: Number(formData.partySize) || 1,
      reservationsIndex,
      excludeReservationId,
    });
  }, [activeBusinessId, reservationsIndex]);

  const addReservation = useCallback((formData) => {
    const result = checkReservation(formData);
    if (!result.valid) {
      showToast(result.error || 'Невалидна резервация.', 'error');
      return false;
    }
    const nextReservation = {
      ...formData,
      id: createBookingId(),
      businessId: activeBusinessId,
      partySize: Number(formData.partySize) || 1,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setReservations((previous) => [...previous, nextReservation]);
    closeBookingModal();
    showToast('Резервацията е добавена успешно.');
    return true;
  }, [activeBusinessId, checkReservation, closeBookingModal, showToast]);

  const updateReservation = useCallback((id, formData) => {
    const existing = reservations.find((item) => item.id === id);
    if (!existing) {
      showToast('Резервацията не е намерена.', 'error');
      return false;
    }
    const result = checkReservation(formData, id, existing.businessId);
    if (!result.valid) {
      showToast(result.error || 'Невалидна промяна.', 'error');
      return false;
    }
    setReservations((previous) => previous.map((item) => item.id === id
      ? { ...item, ...formData, id, businessId: existing.businessId, partySize: Number(formData.partySize) || 1, updatedAt: new Date().toISOString() }
      : item));
    closeBookingModal();
    showToast('Резервацията е обновена успешно.');
    return true;
  }, [reservations, checkReservation, closeBookingModal, showToast]);

  const cancelReservation = useCallback((id) => {
    if (!reservations.some((item) => item.id === id)) return false;
    setReservations((previous) => previous.map((item) => item.id === id
      ? { ...item, status: 'cancelled', updatedAt: new Date().toISOString() }
      : item));
    closeBookingModal();
    showToast('Резервацията е анулирана.');
    return true;
  }, [reservations, closeBookingModal, showToast]);

  const deleteReservation = useCallback((id) => {
    if (!reservations.some((item) => item.id === id)) return false;
    setReservations((previous) => previous.filter((item) => item.id !== id));
    closeBookingModal();
    showToast('Резервацията е изтрита.');
    return true;
  }, [reservations, closeBookingModal, showToast]);

  const resetToFactoryData = useCallback(() => {
    if (!window.confirm('Да възстановим ли примерните резервации и да изтрием дневните бележки?')) return;
    clearStoredData();
    setReservations([...INITIAL_RESERVATIONS]);
    setDailyNotes({});
    setBookingModalState(CLOSED_MODAL);
    showToast('Примерните данни са възстановени.');
  }, [showToast]);

  const noteKey = `${activeBusinessId}|${selectedDate}`;
  const dailyNote = dailyNotes[noteKey] || '';
  const setDailyNote = useCallback((text) => {
    setDailyNotes((previous) => ({ ...previous, [noteKey]: text }));
  }, [noteKey]);

  const value = useMemo(() => ({
    activeBusinessId, activeBusiness, switchBusiness,
    selectedDate, setSelectedDate,
    selectedResourceFilter, setSelectedResourceFilter,
    selectedTimeFilter, setSelectedTimeFilter,
    selectedPartySize, setSelectedPartySize,
    reservations, reservationsIndex,
    filteredResources, resourcesSlotsMap,
    bookingModalState, openCreateBooking, openEditBooking, closeBookingModal,
    addReservation, updateReservation, cancelReservation, deleteReservation,
    resetToFactoryData, toast,
    dailyNotes, dailyNote, setDailyNote,
  }), [
    activeBusinessId, activeBusiness, switchBusiness, selectedDate,
    selectedResourceFilter, selectedTimeFilter, selectedPartySize,
    reservations, reservationsIndex, filteredResources, resourcesSlotsMap,
    bookingModalState, openCreateBooking, openEditBooking, closeBookingModal,
    addReservation, updateReservation, cancelReservation, deleteReservation,
    resetToFactoryData, toast, dailyNotes, dailyNote, setDailyNote,
  ]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking трябва да се използва в BookingProvider.');
  return context;
}

