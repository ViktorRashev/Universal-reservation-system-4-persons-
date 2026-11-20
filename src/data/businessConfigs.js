export const BUSINESS_CONFIGS = {
  medical: {
    id: 'medical',
    name: 'Медицински Център „Здраве & Баланс“',
    shortName: 'Медицински център',
    category: 'Здравеопазване и стоматология',
    tagline: 'Индивидуални прегледи, дентални и специализирани консултации',
    iconName: 'Stethoscope',
    theme: {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accent: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderActive: 'border-emerald-500 ring-emerald-500',
      lightBg: 'bg-emerald-50',
      dotColor: 'bg-emerald-500'
    },
    workingHours: {
      open: '08:30',
      close: '18:30'
    },
    breaks: [
      { start: '12:30', end: '13:30', title: 'Обедна почивка и дезинфекция' }
    ],
    slotDurationMinutes: 30,
    bufferMinutes: 0,
    capacityMode: 'exclusive',
    resourceLabel: 'Лекар / Специалист',
    capacityLabel: 'Брой пациенти',
    allowsCustomPartySize: false,
    resources: [
      {
        id: 'doc-1',
        name: 'Д-р Елена Василева',
        role: 'Кардиолог & Интернист',
        room: 'Кабинет 201',
        capacity: 1,
        color: 'emerald',
        avatarBg: 'bg-emerald-100 text-emerald-800',
        availableDays: [1, 2, 3, 4, 5]
      },
      {
        id: 'doc-2',
        name: 'Д-р Стефан Николов',
        role: 'Дентален хирург & Имплантолог',
        room: 'Стоматологичен кабинет 104',
        capacity: 1,
        color: 'teal',
        avatarBg: 'bg-teal-100 text-teal-800',
        availableDays: [1, 2, 3, 4, 5, 6]
      },
      {
        id: 'doc-3',
        name: 'Д-р Мария Петрова',
        role: 'Педиатър & Детски консултант',
        room: 'Кабинет 305 (Детски сектор)',
        capacity: 1,
        color: 'cyan',
        avatarBg: 'bg-cyan-100 text-cyan-800',
        availableDays: [1, 2, 3, 4, 5]
      },
      {
        id: 'doc-4',
        name: 'Д-р Калоян Димитров',
        role: 'Ортопед & Травматолог',
        room: 'Кабинет 108',
        capacity: 1,
        color: 'sky',
        avatarBg: 'bg-sky-100 text-sky-800',
        availableDays: [2, 3, 4, 5, 6]
      }
    ],
    services: [
      { id: 'srv-1', name: 'Първичен профилактичен преглед', duration: 30, price: '60 лв.' },
      { id: 'srv-2', name: 'Специализирана ехография / диагностика', duration: 30, price: '90 лв.' },
      { id: 'srv-3', name: 'Дентален преглед и почистване на зъбен камък', duration: 30, price: '80 лв.' },
      { id: 'srv-4', name: 'Повторна консултация и изписване на терапия', duration: 30, price: '45 лв.' }
    ]
  },
  restaurant: {
    id: 'restaurant',
    name: 'Гурме Ресторант „La Bella Terrazza“',
    shortName: 'Ресторант и бистро',
    category: 'Хорека & Заведения',
    tagline: 'Резервация на маси с различен капацитет и зони (Салон, Тераса, VIP)',
    iconName: 'Utensils',
    theme: {
      primary: 'bg-amber-600 hover:bg-amber-700 text-white',
      accent: 'amber',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderActive: 'border-amber-500 ring-amber-500',
      lightBg: 'bg-amber-50',
      dotColor: 'bg-amber-500'
    },
    workingHours: {
      open: '12:00',
      close: '23:00'
    },
    breaks: [
      { start: '16:00', end: '17:00', title: 'Технологична подготовка за вечеря' }
    ],
    slotDurationMinutes: 60,
    bufferMinutes: 0,
    capacityMode: 'table_capacity',
    resourceLabel: 'Маса / Зона',
    capacityLabel: 'Брой гости (места)',
    allowsCustomPartySize: true,
    resources: [
      {
        id: 'tbl-1',
        name: 'Маса 1 (Романтична кабина)',
        role: 'Основен салон, прозорец',
        room: 'Салон',
        capacity: 2,
        color: 'amber',
        avatarBg: 'bg-amber-100 text-amber-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'tbl-2',
        name: 'Маса 2 (Семейна ложа)',
        role: 'Основен салон, централна зона',
        room: 'Салон',
        capacity: 4,
        color: 'orange',
        avatarBg: 'bg-orange-100 text-orange-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'tbl-3',
        name: 'Маса 3 (Голяма семейна маса)',
        role: 'Основен салон, тиха зона',
        room: 'Салон',
        capacity: 6,
        color: 'yellow',
        avatarBg: 'bg-yellow-100 text-yellow-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'tbl-4',
        name: 'Тераса Т-10 (Панорамна)',
        role: 'Външна отопляема градина',
        room: 'Панорамна тераса',
        capacity: 4,
        color: 'rose',
        avatarBg: 'bg-rose-100 text-rose-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'tbl-5',
        name: 'VIP Зала „Сомелиер“',
        role: 'Самостоятелна банкетна зала',
        room: 'VIP Сектор',
        capacity: 10,
        color: 'red',
        avatarBg: 'bg-red-100 text-red-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      }
    ],
    services: [
      { id: 'srv-rest-1', name: 'Обяд / А ла карт дегустация', duration: 60, price: 'Без такса резервация' },
      { id: 'srv-rest-2', name: 'Вечеря с 5-степенно меню на шеф-готвача', duration: 120, price: '50 лв. депозит' },
      { id: 'srv-rest-3', name: 'Празнично събитие / Рожден ден', duration: 120, price: '100 лв. депозит' }
    ]
  },
  sports: {
    id: 'sports',
    name: 'Спортен Комплекс & Hub „Arena Active“',
    shortName: 'Спорт & Споделени зали',
    category: 'Спорт, отдих и споделени пространства',
    tagline: 'Наем на тенис кортове, групови зали за йога, конферентни зали и студия',
    iconName: 'Dumbbell',
    theme: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      accent: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderActive: 'border-indigo-500 ring-indigo-500',
      lightBg: 'bg-indigo-50',
      dotColor: 'bg-indigo-500'
    },
    workingHours: {
      open: '07:00',
      close: '22:00'
    },
    breaks: [
      { start: '14:00', end: '14:30', title: 'Техническа проверка и проветряване' }
    ],
    slotDurationMinutes: 60,
    bufferMinutes: 0,
    capacityMode: 'shared_or_slot',
    resourceLabel: 'Корт / Зала / Оборудване',
    capacityLabel: 'Брой участници / билети',
    allowsCustomPartySize: true,
    resources: [
      {
        id: 'sp-1',
        name: 'Тенис корт 1 (Червен клей, осветление)',
        role: 'Спортна зона',
        room: 'Открит корт А',
        capacity: 4,
        isSharedPool: false,
        color: 'indigo',
        avatarBg: 'bg-indigo-100 text-indigo-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'sp-2',
        name: 'Скуош зала „Про 1“',
        role: 'Закрита климатизирана зала',
        room: 'Сектор Ракети',
        capacity: 2,
        isSharedPool: false,
        color: 'violet',
        avatarBg: 'bg-violet-100 text-violet-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'sp-3',
        name: 'Зала за йога и пилатес „Хармония“',
        role: 'Групови тренировки',
        room: 'Студио 2',
        capacity: 12,
        isSharedPool: true,
        color: 'purple',
        avatarBg: 'bg-purple-100 text-purple-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 'sp-4',
        name: 'Конферентна зала „Иновация Hub“',
        role: 'Бизнес презентации & Хибридни срещи',
        room: 'Етаж 2, Коуркинг',
        capacity: 20,
        isSharedPool: false,
        color: 'blue',
        avatarBg: 'bg-blue-100 text-blue-800',
        availableDays: [1, 2, 3, 4, 5, 6]
      },
      {
        id: 'sp-5',
        name: 'Подкаст & Аудиовизуално студио',
        role: 'Записи и стрийминг',
        room: 'Акустично студио Б',
        capacity: 4,
        isSharedPool: false,
        color: 'fuchsia',
        avatarBg: 'bg-fuchsia-100 text-fuchsia-800',
        availableDays: [1, 2, 3, 4, 5, 6, 7]
      }
    ],
    services: [
      { id: 'srv-sp-1', name: 'Наем на тенис корт (60 мин) + осветление', duration: 60, price: '35 лв.' },
      { id: 'srv-sp-2', name: 'Единично посещение Йога клас', duration: 60, price: '16 лв.' },
      { id: 'srv-sp-3', name: 'Наем на Скуош зала (60 мин)', duration: 60, price: '28 лв.' },
      { id: 'srv-sp-4', name: 'Бизнес наем на конферентна зала (60 мин)', duration: 60, price: '50 лв.' }
    ]
  }
};