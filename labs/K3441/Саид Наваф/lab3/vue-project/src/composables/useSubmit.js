import { ref } from 'vue'
import { getErrorMessage } from '@/utils/errors'

export function useSubmit(action) {
  const submitting = ref(false)
  const error = ref('')

  async function submit(...args) {
    submitting.value = true
    error.value = ''
    try {
      return await action(...args)
    } catch (err) {
      error.value = getErrorMessage(err)
      return undefined
    } finally {
      submitting.value = false
    }
  }

  return { submitting, error, submit }
}
