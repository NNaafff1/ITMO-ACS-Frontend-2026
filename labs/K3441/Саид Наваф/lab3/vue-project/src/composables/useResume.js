import { ref } from 'vue'
import { resumesApi } from '@/api'
import { useToast } from '@/composables/useToast'
import { getErrorMessage } from '@/utils/errors'

export function useResume(getUserId) {
  const { showToast } = useToast()

  const resume = ref(null)
  const loading = ref(true)
  const saving = ref(false)

  async function load() {
    loading.value = true
    try {
      const resumes = await resumesApi.getByUser(getUserId())
      resume.value = resumes[0] ?? null
    } catch (error) {
      showToast(getErrorMessage(error), 'danger')
    } finally {
      loading.value = false
    }
  }

  async function save(data) {
    saving.value = true
    try {
      resume.value = resume.value
        ? await resumesApi.update(resume.value.id, data)
        : await resumesApi.create({ userId: getUserId(), ...data })
      showToast('Резюме сохранено.')
      return true
    } catch (error) {
      showToast(getErrorMessage(error), 'danger')
      return false
    } finally {
      saving.value = false
    }
  }

  return { resume, loading, saving, load, save }
}
