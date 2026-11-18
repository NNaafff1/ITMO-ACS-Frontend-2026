import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  const user = computed(() => store.user)
  const isAuthenticated = computed(() => store.isAuthenticated)
  const isEmployer = computed(() => store.isEmployer)
  const isSeeker = computed(() => store.isSeeker)
  const cabinetRoute = computed(() => ({ name: store.isEmployer ? 'employer' : 'profile' }))

  return {
    user,
    isAuthenticated,
    isEmployer,
    isSeeker,
    cabinetRoute,
    login: store.login,
    register: store.register,
    logout: store.logout,
  }
}
