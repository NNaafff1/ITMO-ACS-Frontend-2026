import { defineStore } from 'pinia'
import { authApi } from '@/api'
import { clearAuth, readAuth, writeAuth } from '@/utils/authStorage'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const saved = readAuth()
    return {
      token: saved?.token ?? null,
      user: saved?.user ?? null,
    }
  },
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isEmployer: (state) => state.user?.role === 'employer',
    isSeeker: (state) => state.user?.role === 'seeker',
  },
  actions: {
    setSession(data, remember) {
      this.token = data.accessToken
      this.user = data.user
      writeAuth({ token: data.accessToken, user: data.user }, remember)
    },
    async login(credentials, remember) {
      const data = await authApi.login(credentials)
      this.setSession(data, remember)
      return data.user
    },
    async register(payload) {
      const data = await authApi.register(payload)
      this.setSession(data, true)
      return data.user
    },
    logout() {
      this.token = null
      this.user = null
      clearAuth()
    },
  },
})
