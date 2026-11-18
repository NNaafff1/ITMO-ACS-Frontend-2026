import { ref, watch } from 'vue'
import { responsesApi, vacanciesApi } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { getErrorMessage } from '@/utils/errors'

export function useVacancyDetails(id) {
  const { user, isSeeker } = useAuth()

  const vacancy = ref(null)
  const loading = ref(true)
  const error = ref('')
  const companyOpen = ref('…')
  const similar = ref(null)
  const applied = ref(false)

  async function loadExtras(item, requestedId) {
    try {
      const open = await vacanciesApi.countActive(item.userId)
      const others = await vacanciesApi.getSimilar(item)
      if (requestedId === id.value) {
        companyOpen.value = open
        similar.value = others
      }
    } catch {
      if (requestedId === id.value) {
        companyOpen.value = '—'
        similar.value = []
      }
    }
  }

  async function checkApplied(item, requestedId) {
    if (!isSeeker.value) {
      return
    }
    try {
      const existing = await responsesApi.find(user.value.id, item.id)
      if (requestedId === id.value) {
        applied.value = existing.length > 0
      }
    } catch {
      applied.value = false
    }
  }

  async function load() {
    const requestedId = id.value
    loading.value = true
    error.value = ''
    vacancy.value = null
    applied.value = false
    companyOpen.value = '…'
    similar.value = null

    try {
      const item = await vacanciesApi.getById(requestedId)
      if (requestedId !== id.value) {
        return
      }
      vacancy.value = item
      loading.value = false
      loadExtras(item, requestedId)
      checkApplied(item, requestedId)
    } catch (err) {
      if (requestedId !== id.value) {
        return
      }
      error.value = err.response?.status === 404 ? 'Такой вакансии нет.' : getErrorMessage(err)
      loading.value = false
    }
  }

  function markApplied() {
    applied.value = true
  }

  watch(id, load, { immediate: true })

  return { vacancy, loading, error, companyOpen, similar, applied, markApplied }
}
