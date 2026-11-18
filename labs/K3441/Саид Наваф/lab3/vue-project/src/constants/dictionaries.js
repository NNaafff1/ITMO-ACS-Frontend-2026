export const INDUSTRIES = {
  it: 'IT и разработка',
  marketing: 'Маркетинг',
  finance: 'Финансы',
  education: 'Образование',
  trade: 'Торговля',
}

export const EXPERIENCES = {
  none: 'Без опыта',
  '1-3': '1–3 года',
  '3-6': '3–6 лет',
  '6+': 'Более 6 лет',
}

export const RESPONSE_STATUSES = {
  pending: { label: 'На рассмотрении', className: 'text-bg-warning' },
  invited: { label: 'Приглашение', className: 'text-bg-success' },
  rejected: { label: 'Отказ', className: 'text-bg-secondary' },
}

export function industryLabel(key) {
  return INDUSTRIES[key] ?? key
}

export function experienceLabel(key) {
  return EXPERIENCES[key] ?? key
}
