
/**
 * ReservationSchedule Advanced System
 * Христо - Алгоритмично ядро
 */

// Преобразува час във формат HH:MM в минути
export function timeToMinutes(time) {
  if (typeof time === "number") return time;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

// Преобразува минути във формат HH:MM
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// Проверява дали два времеви интервала се застъпват
export function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

// Създава хеш индекс на резервациите
export function buildReservationIndex(reservations = []) {
  const index = new Map();

  reservations.forEach((reservation) => {
    if (reservation.status === "cancelled") return;

    const key = `${reservation.date}::${reservation.resourceId}`;

    if (!index.has(key)) {
      index.set(key, []);
    }

    index.get(key).push(reservation);
  });

  return index;
}

// Проверява дали резервацията е валидна
export function validateBooking({
  reservation,
  reservations = [],
  index = null,
  config = {},
  excludeReservationId = null,
}) {
  const start = timeToMinutes(reservation.startTime);
  const end = timeToMinutes(reservation.endTime);

  // Проверка на началния и крайния час
  if (start >= end) {
    return {
      valid: false,
      reason: "Невалиден времеви интервал",
    };
  }

  // Проверка на работното време
  const workingHours = config.workingHours || {
    start: "09:00",
    end: "18:00",
  };

  const workStart = timeToMinutes(workingHours.start);
  const workEnd = timeToMinutes(workingHours.end);

  if (start < workStart || end > workEnd) {
    return {
      valid: false,
      reason: "Извън работното време",
    };
  }

  // Проверка за почивки
  const breaks = config.breaks || [];

  for (const pause of breaks) {
    const pauseStart = timeToMinutes(pause.start);
    const pauseEnd = timeToMinutes(pause.end);

    if (
      intervalsOverlap(
        start,
        end,
        pauseStart,
        pauseEnd
      )
    ) {
      return {
        valid: false,
        reason: "Резервацията попада в почивка",
      };
    }
  }

  // Използваме готов индекс или създаваме нов
  const reservationIndex =
    index || buildReservationIndex(reservations);

  const key = `${reservation.date}::${reservation.resourceId}`;

  const existingReservations =
    reservationIndex.get(key) || [];

  // Изключваме текущата резервация при редакция
  const filteredReservations =
    existingReservations.filter(
      (item) => item.id !== excludeReservationId
    );

  // Проверка за конфликт
  const conflict = filteredReservations.some((item) => {
    const existingStart = timeToMinutes(item.startTime);
    const existingEnd = timeToMinutes(item.endTime);

    return intervalsOverlap(
      start,
      end,
      existingStart,
      existingEnd
    );
  });

  if (conflict) {
    return {
      valid: false,
      reason: "Този час вече е зает",
    };
  }

  return {
    valid: true,
    reason: null,
  };
}

// Генерира времеви слотове
export function generateTimeSlots(config = {}) {
  const workingHours = config.workingHours || {
    start: "09:00",
    end: "18:00",
  };

  const start = timeToMinutes(workingHours.start);
  const end = timeToMinutes(workingHours.end);

  const duration = config.slotDuration || 30;

  const slots = [];

  for (
    let time = start;
    time + duration <= end;
    time += duration
  ) {
    slots.push({
      startTime: minutesToTime(time),
      endTime: minutesToTime(time + duration),
    });
  }

  return slots;
}

// Benchmark: 5000 проверки за конфликти
export function runBookingBenchmark({
  reservations = [],
  config = {},
  iterations = 5000,
} = {}) {
  const index = buildReservationIndex(reservations);

  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    validateBooking({
      reservation: {
        id: `test-${i}`,
        date: "2026-01-01",
        resourceId: "benchmark-resource",
        startTime: "10:00",
        endTime: "10:30",
      },
      index,
      config,
    });
  }

  const endTime = performance.now();

  return {
    iterations,
    totalMs: Number(
      (endTime - startTime).toFixed(3)
    ),
    averageMs: Number(
      ((endTime - startTime) / iterations).toFixed(6)
    ),
  };
}

