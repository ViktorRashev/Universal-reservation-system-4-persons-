/**  * Core Algorithmic Booking Engine  * OmniReserve High-Performance Slot & Conflict Resolution Engine /

/*  * Превръща времеви низ 'HH:mm' в брой минути от полунощ за O(1) математически сравнения  * @param {string} timeStr - напр. "14:30"  * @returns {number} минути от началото на денонощието (870) /
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/*  * Превръща брой минути обратно в четим времеви формат 'HH:mm'  * @param {number} minutes  * @returns {string} /
export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/*  * Бърза проверка за засичане/припокриване на два времеви интервала  * Два полуотворени интервала [startA, endA) и [startB, endB) се припокриват точно тогава,  * когато: startA < endB && endA > startB /
export function isIntervalOverlapping(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

/*  * Изгражда хеш-индексирана карта на активните резервации по дата и ресурс.  * Това трансформира търсенето от O(N) линейно сканиране на всички резервации  * в O(1) хеш достъп до конкретния списък за деня и ресурса.  * @param {Array} reservations  * @returns {Map<string, Array>} /
export function buildReservationIndex(reservations) {
  const index = new Map();

  for (let i = 0; i < reservations.length; i++) {
    const res = reservations[i];
    if (res.status === 'cancelled') continue; // Игнорираме отменените

    const key = `${res.date}_${res.resourceId}`;
    let list = index.get(key);
    if (!list) {
      list = [];
      index.set(key, list);
    }
    list.push({
      ...res,
      _startMins: timeToMinutes(res.startTime),
      _endMins: timeToMinutes(res.endTime)
    });
  }

  return index;
}

/*  * Генерира пълен набор от времеви слотове за даден ресурс и дата  * с пълна статус информация (AVAILABLE, BOOKED, PARTIAL, BREAK, CLOSED, PAST) /
export function generateResourceSlots({
  businessConfig,
  resource,
  date,
  reservationsIndex,
  isToday = false,
  currentMinutes = 0
}) {
  if (!businessConfig || !resource || !date) return [];

  // 1. Проверка дали ресурсът работи в този ден от седмицата
  // неделя = 7 в европейския стандарт, или JS Date.getDay(): 0=нд, 1=пн ... 6=сб
  const targetDate = new Date(date + 'T00:00:00');
  const jsDay = targetDate.getDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;

  if (resource.availableDays && !resource.availableDays.includes(dayOfWeek)) {
    return [{
      id: `${resource.id}closed`,
      time: '00:00',
      endTime: '23:59',
      status: 'CLOSED',
      label: 'Почивен ден за специалиста/ресурса'
    }];
  }

  const openMins = timeToMinutes(businessConfig.workingHours.open);
  const closeMins = timeToMinutes(businessConfig.workingHours.close);
  const slotDuration = businessConfig.slotDurationMinutes || 30;

  // Обедни/технологични почивки, превърнати в минути за бърз анализ
  const parsedBreaks = (businessConfig.breaks || []).map(b => ({
    start: timeToMinutes(b.start),
    end: timeToMinutes(b.end),
    title: b.title
  }));

  // Вземаме само резервациите за този ден и ресурс от O(1) индекса
  const key = `${date}${resource.id}`;
  const dayReservations = reservationsIndex?.get(key) || [];

  const slots = [];

  for (let start = openMins; start + slotDuration <= closeMins; start += slotDuration) {
    const end = start + slotDuration;
    const timeLabel = minutesToTime(start);
    const endLabel = minutesToTime(end);

    // Проверка дали слотът попада в почивка
    const breakOverlap = parsedBreaks.find(b => isIntervalOverlapping(start, end, b.start, b.end));
    if (breakOverlap) {
      slots.push({
        id: `${resource.id}_${timeLabel}`,
        time: timeLabel,
        endTime: endLabel,
        status: 'BREAK',
        label: breakOverlap.title,
        resourceId: resource.id,
        occupiedCapacity: 0,
        maxCapacity: resource.capacity,
        bookings: []
      });
      continue;
    }

    // Проверка дали слотът е в миналото (ако датата е днешна)
    const isPast = isToday && start < currentMinutes;

    // Намиране на всички припокриващи се активни резервации за този слот
    const overlappingBookings = dayReservations.filter(res =>
      isIntervalOverlapping(start, end, res._startMins, res.endMins)
    );

    const isShared = Boolean(resource.isSharedPool);
    let totalBookedParty = 0;
    for (let i = 0; i < overlappingBookings.length; i++) {
      totalBookedParty += (overlappingBookings[i].partySize || 1);
    }

    let status = 'AVAILABLE';
    if (isPast) {
      status = 'PAST';
    } else if (isShared) {
      if (totalBookedParty >= resource.capacity) {
        status = 'BOOKED';
      } else if (totalBookedParty > 0) {
        status = 'PARTIAL';
      } else {
        status = 'AVAILABLE';
      }
    } else {
      // Ексклузивен ресурс (лекар, маса за ресторант)
      if (overlappingBookings.length > 0) {
        status = 'BOOKED';
      } else {
        status = 'AVAILABLE';
      }
    }

    slots.push({
      id: `${resource.id}${timeLabel}`,
      time: timeLabel,
      endTime: endLabel,
      status,
      resourceId: resource.id,
      occupiedCapacity: totalBookedParty,
      maxCapacity: resource.capacity,
      remainingCapacity: Math.max(0, resource.capacity - totalBookedParty),
      bookings: overlappingBookings
    });
  }

  return slots;
}

/*  * Валидира нова или редактирана резервация срещу всякакви конфликти  * Гарантира 100% консистентност без припокривания */
export function validateReservation({
  businessConfig,
  resource,
  date,
  startTime,
  endTime,
  partySize = 1,
  reservationsIndex,
  excludeReservationId = null
}) {
  if (!businessConfig || !resource || !date || !startTime || !endTime) {
    return { valid: false, error: 'Моля, попълнете всички задължителни полета.' };
  }

  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (startMins >= endMins) {
    return { valid: false, error: 'Крайният час трябва да бъде след началния час.' };
  }

  const openMins = timeToMinutes(businessConfig.workingHours.open);
  const closeMins = timeToMinutes(businessConfig.workingHours.close);

  if (startMins < openMins || endMins > closeMins) {
    return {
      valid: false,
      error: `Избраният интервал е извън работното време (${businessConfig.workingHours.open} - ${businessConfig.workingHours.close}).`
    };
  }

  // Проверка за обедни/технологични почивки
  for (const b of businessConfig.breaks || []) {
    const bStart = timeToMinutes(b.start);
    const bEnd = timeToMinutes(b.end);
    if (isIntervalOverlapping(startMins, endMins, bStart, bEnd)) {
      return {
        valid: false,
        error: `Интервалът засича регламентирана почивка: ${b.title} (${b.start} - ${b.end}).`
      };
    }
  }

  // Проверка за максимален капацитет на ресурса
  const requestedSize = Number(partySize) || 1;
  if (requestedSize > resource.capacity) {
    return {
      valid: false,
      error: `Капацитетът на избрания ресурс е ${resource.capacity} места, а заявените са ${requestedSize}.`
    };
  }

  // Проверка за конфликт с вече съществуващи активни резервации
  const key = `${date}_${resource.id}`;
  const existingBookings = reservationsIndex?.get(key) || [];

  const conflicting = existingBookings.filter(b => {
    if (excludeReservationId && b.id === excludeReservationId) return false;
    return isIntervalOverlapping(startMins, endMins, b._startMins, b._endMins);
  });

  const isShared = Boolean(resource.isSharedPool);

  if (isShared) {
    const currentPartyTotal = conflicting.reduce((sum, b) => sum + (b.partySize || 1), 0);
    if (currentPartyTotal + requestedSize > resource.capacity) {
      const free = resource.capacity - currentPartyTotal;
      return {
        valid: false,
        error: `Няма достатъчно свободни места в този интервал. Свободни: ${free}, заявени: ${requestedSize}.`
      };
    }
  } else {
    if (conflicting.length > 0) {
      const conf = conflicting[0];
      return {
        valid: false,
        error: `Конфликт! Ресурсът вече е зает от ${conf.startTime} до ${conf.endTime} (${conf.customerName}).`
      };
    }
  }

  return { valid: true, error: null };
}

/**  * Benchmark runner за демонстрация пред комисията  * Изпълнява N проверки за конфликти и пресмята времето в микросекунди */
export function runAlgorithmBenchmark(iterations = 5000) {
  const mockIndex = new Map();
  const sampleBookings = [];

  for (let i = 0; i < 50; i++) {
    const s = 540 + (i * 30) % 480;
    sampleBookings.push({
      id: `bench_${i}`,
      startTime: minutesToTime(s),
      endTime: minutesToTime(s + 30),
      _startMins: s,
      _endMins: s + 30,
      partySize: 1,
      customerName: `Тест Потребител ${i}`
    });
  }
  mockIndex.set('2026-11-20_doc-1', sampleBookings);

  const testConfig = {
    workingHours: { open: '08:00', close: '20:00' },
    breaks: [{ start: '13:00', end: '14:00', title: 'Обяд' }],
    slotDurationMinutes: 30
  };
  const testResource = { id: 'doc-1', capacity: 1, isSharedPool: false };

  const startStamp = performance.now();

  let passed = 0;
  for (let i = 0; i < iterations; i++) {
    const testStart = minutesToTime(540 + (i % 600));
    const testEnd = minutesToTime(540 + (i % 600) + 30);
    const res = validateReservation({
      businessConfig: testConfig,
      resource: testResource,
      date: '2026-11-20',
      startTime: testStart,
      endTime: testEnd,
      partySize: 1,
      reservationsIndex: mockIndex
    });
    if (res.valid) passed++;
  }

  const endStamp = performance.now();
  const totalMs = endStamp - startStamp;
  const avgMicrosec = (totalMs / iterations) * 1000;
  const opsPerSec = Math.round((iterations / totalMs) * 1000);

  return {
    iterations,
    totalMs: Number(totalMs.toFixed(2)),
    avgMicrosec: Number(avgMicrosec.toFixed(2)),
    opsPerSec: opsPerSec.toLocaleString('bg-BG'),
    passedCount: passed
  };
}
