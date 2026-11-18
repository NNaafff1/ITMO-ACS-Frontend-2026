import { computed, ref } from 'vue'
import { vacanciesApi } from '@/api'
import { useToast } from '@/composables/useToast'
import { getErrorMessage } from '@/utils/errors'

export function useEmployerVacancies(getUserId, getCompany) {
  const { showToast } = useToast()

  const vacancies = ref([])
  const loading = ref(true)
  const saving = ref(false)
  const togglingId = ref(null)

  const stats = computed(() => {
    const active = vacancies.value.filter((vacancy) => vacancy.active).length
    const responses = vacancies.value.reduce((sum, vacancy) => sum + (vacancy.responses?.length ?? 0), 0)
    return { active, closed: vacancies.value.length - active, responses }
  })

  async function load() {
    loading.value = true
    try {
      vacancies.value = await vacanciesApi.getByEmployer(getUserId())
    } catch (error) {
      vacancies.value = []
      showToast(getErrorMessage(error), 'danger')
    } finally {
      loading.value = false
    }
  }

  async function save(data, id) {
    saving.value = true
    try {
      if (id !== null) {
        const updated = await vacanciesApi.update(id, data)
        const index = vacancies.value.findIndex((vacancy) => vacancy.id === id)
        vacancies.value[index] = { ...vacancies.value[index], ...updated }
        showToast('Изменения сохранены.')
      } else {
        const created = await vacanciesApi.create({
          ...data,
          userId: getUserId(),
          company: getCompany(),
          employment: 'Полная занятость',
          format: 'Офис',
          active: true,
          responsibilities: [],
          requirements: [],
          conditions: [],
        })
        vacancies.value.unshift({ ...created, responses: [] })
        showToast('Вакансия опубликована.')
      }
      return true
    } catch (error) {
      showToast(getErrorMessage(error), 'danger')
      return false
    } finally {
      saving.value = false
    }
  }

  async function toggle(vacancy) {
    togglingId.value = vacancy.id
    try {
      const updated = await vacanciesApi.update(vacancy.id, { active: !vacancy.active })
      vacancy.active = updated.active
      showToast(vacancy.active ? 'Вакансия снова активна.' : 'Вакансия закрыта.')
    } catch (error) {
      showToast(getErrorMessage(error), 'danger')
    } finally {
      togglingId.value = null
    }
  }

  async function remove(id) {
    try {
      await vacanciesApi.remove(id)
      vacancies.value = vacancies.value.filter((vacancy) => vacancy.id !== id)
      showToast('Вакансия удалена.')
      return true
    } catch (error) {
      showToast(getErrorMessage(error), 'danger')
      return false
    }
  }

  return { vacancies, loading, saving, togglingId, stats, load, save, toggle, remove }
}
