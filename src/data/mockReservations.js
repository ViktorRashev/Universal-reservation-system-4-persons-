// Utility to generate dynamic ISO dates relative to today
const getRelativeDateStr = (dayOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_RESERVATIONS = [
  // --- Медицински център (medical) ---
  {
    id: 'res-med-001',
    businessId: 'medical',
    resourceId: 'doc-1',
    date: getRelativeDateStr(0), // Днес
    startTime: '09:00',
    endTime: '09:30',
    partySize: 1,
    customerName: 'Иван Тодоров',
    customerPhone: '+359 888 123 456',
    customerEmail: 'i.todorov@example.com',
    serviceId: 'srv-1',
    serviceName: 'Първичен профилактичен преглед',
    notes: 'Пациент с оплаквания за високо кръвно сутрин.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-med-002',
    businessId: 'medical',
    resourceId: 'doc-1',
    date: getRelativeDateStr(0),
    startTime: '10:00',
    endTime: '10:30',
    partySize: 1,
    customerName: 'Радостина Стойчева',
    customerPhone: '+359 877 654 321',
    customerEmail: 'r.stoycheva@example.com',
    serviceId: 'srv-2',
    serviceName: 'Специализирана ехография / диагностика',
    notes: 'Носи предишни епикризи и изследвания.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-med-003',
    businessId: 'medical',
    resourceId: 'doc-2',
    date: getRelativeDateStr(0),
    startTime: '11:00',
    endTime: '11:30',
    partySize: 1,
    customerName: 'Борис Христов',
    customerPhone: '+359 899 444 555',
    customerEmail: 'boris.h@example.com',
    serviceId: 'srv-3',
    serviceName: 'Дентален преглед и почистване на зъбен камък',
    notes: 'Последен преглед преди 6 месеца.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-med-004',
    businessId: 'medical',
    resourceId: 'doc-3',
    date: getRelativeDateStr(0),
    startTime: '14:00',
    endTime: '14:30',
    partySize: 1,
    customerName: 'Мая Ангелова (за детето Алекс)',
    customerPhone: '+359 883 999 000',
    customerEmail: 'maya.a@example.com',
    serviceId: 'srv-4',
    serviceName: 'Повторна консултация и изписване на терапия',
    notes: 'Контролен преглед след антибиотично лечение.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-med-005',
    businessId: 'medical',
    resourceId: 'doc-1',
    date: getRelativeDateStr(1), // Утре
    startTime: '11:30',
    endTime: '12:00',
    partySize: 1,
    customerName: 'Красимир Пенев',
    customerPhone: '+359 878 112 233',
    customerEmail: 'krasimir@example.com',
    serviceId: 'srv-1',
    serviceName: 'Първичен профилактичен преглед',
    notes: 'ЕКГ и измерване на налягане.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },

  // --- Ресторант (restaurant) ---
  {
    id: 'res-rest-001',
    businessId: 'restaurant',
    resourceId: 'tbl-1',
    date: getRelativeDateStr(0),
    startTime: '13:00',
    endTime: '14:00',
    partySize: 2,
    customerName: 'Силвия и Димитър',
    customerPhone: '+359 888 222 333',
    customerEmail: 'silvia.d@example.com',
    serviceId: 'srv-rest-1',
    serviceName: 'Обяд / А ла карт дегустация',
    notes: 'Маса до прозореца, годишнина.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-rest-002',
    businessId: 'restaurant',
    resourceId: 'tbl-2',
    date: getRelativeDateStr(0),
    startTime: '19:00',
    endTime: '20:00',
    partySize: 4,
    customerName: 'Георги Милев',
    customerPhone: '+359 897 123 789',
    customerEmail: 'milev.g@example.com',
    serviceId: 'srv-rest-2',
    serviceName: 'Вечеря с 5-степенно меню на шеф-готвача',
    notes: 'Един вегетарианец в компанията.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-rest-003',
    businessId: 'restaurant',
    resourceId: 'tbl-4',
    date: getRelativeDateStr(0),
    startTime: '20:00',
    endTime: '21:00',
    partySize: 3,
    customerName: 'Виктория Костова',
    customerPhone: '+359 885 556 778',
    customerEmail: 'viki.k@example.com',
    serviceId: 'srv-rest-2',
    serviceName: 'Вечеря с 5-степенно меню на шеф-готвача',
    notes: 'Предпочитат маса до външния нагревател.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-rest-004',
    businessId: 'restaurant',
    resourceId: 'tbl-5',
    date: getRelativeDateStr(1),
    startTime: '18:00',
    endTime: '20:00',
    partySize: 8,
    customerName: 'Николай Димов (IT Екип)',
    customerPhone: '+359 884 777 888',
    customerEmail: 'n.dimov@techfirm.bg',
    serviceId: 'srv-rest-3',
    serviceName: 'Празнично събитие / Рожден ден',
    notes: 'Предварително избрано сомелиерско вино.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },

  // --- Спорт & Зали (sports) ---
  {
    id: 'res-sp-001',
    businessId: 'sports',
    resourceId: 'sp-1',
    date: getRelativeDateStr(0),
    startTime: '08:00',
    endTime: '09:00',
    partySize: 2,
    customerName: 'Александър и Петър',
    customerPhone: '+359 887 334 455',
    customerEmail: 'alex.tennis@example.com',
    serviceId: 'srv-sp-1',
    serviceName: 'Наем на тенис корт (60 мин) + осветление',
    notes: 'Наем на 2 кутии нови топки.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-sp-002',
    businessId: 'sports',
    resourceId: 'sp-3', // Зала за йога (споделен капацитет 12)
    date: getRelativeDateStr(0),
    startTime: '10:00',
    endTime: '11:00',
    partySize: 4,
    customerName: 'Група „Сутрешна свежест“ (4 души)',
    customerPhone: '+359 882 111 222',
    customerEmail: 'yoga.group@example.com',
    serviceId: 'srv-sp-2',
    serviceName: 'Единично посещение Йога клас',
    notes: 'Резервирани 4 от 12 налични постелки.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-sp-003',
    businessId: 'sports',
    resourceId: 'sp-4', // Конферентна зала
    date: getRelativeDateStr(0),
    startTime: '15:00',
    endTime: '17:00',
    partySize: 14,
    customerName: 'Фондация „Бъдеще днес“',
    customerPhone: '+359 879 001 002',
    customerEmail: 'contact@futurenow.org',
    serviceId: 'srv-sp-4',
    serviceName: 'Бизнес наем на конферентна зала (60 мин)',
    notes: 'Нужен е мултимедиен проектор и микрофони.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

export { getRelativeDateStr };