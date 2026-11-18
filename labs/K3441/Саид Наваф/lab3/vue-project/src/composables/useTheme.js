import { computed, ref } from 'vue'

const THEME_KEY = 'jobsite_theme'
const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(THEME_KEY)
    return theme === 'light' || theme === 'dark' ? theme : null
  } catch {
    return null
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
    return true
  } catch {
    return false
  }
}

const theme = ref(getStoredTheme() ?? (darkQuery?.matches ? 'dark' : 'light'))

function applyTheme(value) {
  theme.value = value
  document.documentElement.setAttribute('data-bs-theme', value)
}

applyTheme(theme.value)

if (darkQuery) {
  darkQuery.addEventListener('change', (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light')
    }
  })
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    const next = isDark.value ? 'light' : 'dark'
    storeTheme(next)
    applyTheme(next)
  }

  return { theme, isDark, toggleTheme }
}
