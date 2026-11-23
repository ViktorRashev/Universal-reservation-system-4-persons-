import { INITIAL_RESERVATIONS } from '../data/mockReservations';

const STORAGE_KEYS = {
  RESERVATIONS: 'omni_reserve_reservations_v1',
  ACTIVE_BUSINESS: 'omni_reserve_business_v1'
};

export function loadReservationsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      saveReservationsToStorage(INITIAL_RESERVATIONS);
      return INITIAL_RESERVATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_RESERVATIONS;
  } catch (err) {
    console.warn('Грешка при зареждане от LocalStorage, използват се начални данни:', err);
    return INITIAL_RESERVATIONS;
  }
}

export function saveReservationsToStorage(reservations) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (err) {
    console.error('Грешка при запис в LocalStorage:', err);
  }
}

export function resetReservationsToInitial() {
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    return [...INITIAL_RESERVATIONS];
  } catch (err) {
    console.error('Грешка при ресет:', err);
    return INITIAL_RESERVATIONS;
  }
}

export function loadActiveBusinessFromStorage(defaultId = 'medical') {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_BUSINESS) || defaultId;
  } catch {
    return defaultId;
  }
}

export function saveActiveBusinessToStorage(businessId) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BUSINESS, businessId);
  } catch (err) {
    console.warn('Неуспешен запис на активен бизнес:', err);
  }
}