import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { BUSINESS_CONFIGS } from '../data/businessConfigs';
import { getRelativeDateStr } from '../data/mockReservations';
import {
  loadReservationsFromStorage,
  saveReservationsToStorage,
  resetReservationsToInitial,
  loadActiveBusinessFromStorage,
  saveActiveBusinessToStorage
} from '../utils/storage';
import {
  timeToMinutes,
  buildReservationIndex,
  generateResourceSlots,
  validateReservation
} from '../utils/bookingEngine';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [activeBusinessId, setActiveBusinessId] = useState(() => loadActiveBusinessFromStorage('medical'));
  const [reservations, setReservations] = useState(() => loadReservationsFromStorage());
  const [selectedDate, setSelectedDate] = useState(() => getRelativeDateStr(0));
  const [selectedResourceFilter, setSelectedResourceFilter] = useState('ALL');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('ALL');
  const [selectedPartySize, setSelectedPartySize] = useState(1);
  const [activeView, setActiveView] = useState('booking');

  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveReservationsToStorage(reservations);
  }, [reservations]);

  useEffect(() => {
    saveActiveBusinessToStorage(activeBusinessId);
  }, [activeBusinessId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    mode: 'create',
    slot: null,
    resource: null,
    reservationToEdit: null
  });

  const activeBusiness = useMemo(() => {
    return BUSINESS_CONFIGS[activeBusinessId] || BUSINESS_CONFIGS.medical;
  }, [activeBusinessId]);

  const switchBusiness = useCallback((newBusinessId) => {
    if (!BUSINESS_CONFIGS[newBusinessId]) return;
    setActiveBusinessId(newBusinessId);
    setSelectedResourceFilter('ALL');
    setSelectedTimeFilter('ALL');
    setSelectedPartySize(1);
    showToast(`Превключено към: ${BUSINESS_CONFIGS[newBusinessId].name}`, 'info');
  }, [showToast]);

  const reservationsIndex = useMemo(() => {
    return buildReservationIndex(reservations);
  }, [reservations]);

  const filteredResources = useMemo(() => {
    if (selectedResourceFilter === 'ALL') {
      return activeBusiness.resources;
    }
    return activeBusiness.resources.filter(r => r.id === selectedResourceFilter);
  }, [activeBusiness, selectedResourceFilter]);

  const resourcesSlotsMap = useMemo(() => {
    const todayStr = getRelativeDateStr(0);
    const isToday = selectedDate === todayStr;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const map = {};

    for (const res of filteredResources) {
      let slots = generateResourceSlots({
        businessConfig: activeBusiness,
        resource: res,
        date: selectedDate,
        reservationsIndex,
        isToday,
        currentMinutes
      });

      let filteredSlots = slots;
      if (selectedTimeFilter === 'MORNING') {
        filteredSlots = slots.filter(s => timeToMinutes(s.time) < 720);
      } else if (selectedTimeFilter === 'AFTERNOON') {
        filteredSlots = slots.filter(s => {
          const m = timeToMinutes(s.time);
          return m >= 720 && m < 1020;
        });
      } else if (selectedTimeFilter === 'EVENING') {
        filteredSlots = slots.filter(s => timeToMinutes(s.time) >= 1020);
      }

      map[res.id] = filteredSlots;
    }

    return map;
  }, [activeBusiness, filteredResources, selectedDate, reservationsIndex, selectedTimeFilter]);

  const analytics = useMemo(() => {
    const businessReservations = reservations.filter(r => r.businessId === activeBusinessId);
    const dayReservations = businessReservations.filter(r => r.date === selectedDate && r.status !== 'cancelled');

    let totalSlotsCount = 0;
    let bookedSlotsCount = 0;

    Object.values(resourcesSlotsMap).forEach(slots => {
      slots.forEach(s => {
        if (s.status === 'AVAILABLE' || s.status === 'BOOKED' || s.status === 'PARTIAL') {
          totalSlotsCount++;
          if (s.status === 'BOOKED' || s.status === 'PARTIAL') {
            bookedSlotsCount++;
          }
        }
      });
    });

    const occupancyRate = totalSlotsCount > 0 ? Math.round((bookedSlotsCount / totalSlotsCount) * 100) : 0;

    const hourHistogram = {};
    dayReservations.forEach(r => {
      const h = r.startTime.split(':')[0] + ':00';
      hourHistogram[h] = (hourHistogram[h] || 0) + 1;
    });

    return {
      totalBusinessReservations: businessReservations.length,
      dayActiveReservations: dayReservations.length,
      occupancyRate,
      totalSlotsCount,
      bookedSlotsCount,
      hourHistogram
    };
  }, [reservations, activeBusinessId, selectedDate, resourcesSlotsMap]);

  const openCreateBooking = useCallback((slot, resource) => {
    setBookingModalState({
      isOpen: true,
      mode: 'create',
      slot,
      resource,
      reservationToEdit: null
    });
  }, []);

  const openEditBooking = useCallback((reservation) => {
    const resource = activeBusiness.resources.find(r => r.id === reservation.resourceId);
    setBookingModalState({
      isOpen: true,
      mode: 'edit',
      slot: {
        time: reservation.startTime,
        endTime: reservation.endTime
      },
      resource,
      reservationToEdit: reservation
    });
  }, [activeBusiness]);

  const closeBookingModal = useCallback(() => {
    setBookingModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const addReservation = useCallback((formData) => {
    const resource = activeBusiness.resources.find(r => r.id === formData.resourceId);

    const validation = validateReservation({
      businessConfig: activeBusiness,
      resource,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      partySize: formData.partySize,
      reservationsIndex
    });

    if (!validation.valid) {
      showToast(validation.error, 'error');
      return { success: false, error: validation.error };
    }

    const newRes = {
      id: `res-${activeBusinessId}-${Date.now().toString(36)}`,
      businessId: activeBusinessId,
      resourceId: formData.resourceId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      partySize: Number(formData.partySize) || 1,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerEmail: formData.customerEmail?.trim() || '',
      serviceId: formData.serviceId || '',
      serviceName: formData.serviceName || '',
      notes: formData.notes?.trim() || '',

