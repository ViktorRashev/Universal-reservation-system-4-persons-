// Георги: localStorage помощни функции за демо приложението.
// Данните са локални за този браузър и не са подходящи за реални медицински записи.
const PREFIX = 'reservation-schedule:v1:';

export const STORAGE_KEYS = {
  reservations: `${PREFIX}reservations`,
  dailyNotes: `${PREFIX}daily-notes`,
};

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Неуспешно зареждане на ${key}:`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Неуспешно запазване на ${key}:`, error);
    return false;
  }
}

// Ако няма запазени данни, използваме примерните резервации.
// Важно: празен масив [] е валиден (потребителят може да е изтрил всички записи).
export function loadReservations(initialReservations = []) {
  const saved = readJSON(STORAGE_KEYS.reservations, null);
  return Array.isArray(saved) ? saved : [...initialReservations];
}

export function saveReservations(reservations) {
  if (!Array.isArray(reservations)) return false;
  return writeJSON(STORAGE_KEYS.reservations, reservations);
}

// Бележките са обект с ключ "businessId|YYYY-MM-DD".
export function loadDailyNotes() {
  const saved = readJSON(STORAGE_KEYS.dailyNotes, {});
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

export function saveDailyNotes(notes) {
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) return false;
  return writeJSON(STORAGE_KEYS.dailyNotes, notes);
}

export function clearStoredData() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.reservations);
    window.localStorage.removeItem(STORAGE_KEYS.dailyNotes);
    return true;
  } catch (error) {
    console.warn('Неуспешно изчистване на съхранените данни:', error);
    return false;
  }
}
