const AUTH_KEY = 'jobsite_auth'

export function readAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(AUTH_KEY)
}

export function writeAuth(data, remember) {
  clearAuth()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(AUTH_KEY, JSON.stringify({ token: data.token, user: data.user }))
}
