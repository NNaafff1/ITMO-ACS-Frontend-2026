import { ref } from 'vue'
import { getErrorMessage } from '@/utils/errors'

export function useAsyncData(request, { initial = null } = {}) {
  const data = ref(initial)
  const loading = ref(false)
  const error = ref('')
  const status = ref(0)
  let lastRequestId = 0

  async function execute(...args) {
    const requestId = ++lastRequestId
    loading.value = true
    error.value = ''
    status.value = 0

    try {
      const result = await request(...args)
      if (requestId === lastRequestId) {
        data.value = result
      }
      return result
    } catch (err) {
      if (requestId === lastRequestId) {
        error.value = getErrorMessage(err)
        status.value = err.response?.status ?? 0
      }
      return undefined
    } finally {
      if (requestId === lastRequestId) {
        loading.value = false
      }
    }
  }

  return { data, loading, error, status, execute }
}
