export function formatSalary(value) {
  return `от ${Number(value).toLocaleString('ru-RU')} ₽`
}

export function initials(text = '') {
  return text
    .replace(/[«»"]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
