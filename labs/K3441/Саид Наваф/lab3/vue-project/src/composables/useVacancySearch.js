import { computed, reactive, watch } from 'vue'
import { vacanciesApi } from '@/api'
import { useAsyncData } from '@/composables/useAsyncData'
import { useDebounceFn } from '@/composables/useDebounce'

function defaultFilters() {
  return { q: '', industry: '', experience: '', salary: '' }
}

function buildParams(filters) {
  const params = { active: true }
  const query = String(filters.q).trim()
  if (query) {
    params.q = query
  }
  if (filters.industry) {
    params.industry = filters.industry
  }
  if (filters.experience) {
    params.experience = filters.experience
  }
  const minSalary = Number(filters.salary)
  if (minSalary > 0) {
    params.salary_gte = minSalary
  }
  return params
}

export function useVacancySearch() {
  const filters = reactive(defaultFilters())

  const { data, loading, error, execute } = useAsyncData(() => vacanciesApi.getAll(buildParams(filters)))
  const search = useDebounceFn(execute, 300)

  const vacancies = computed(() => (error.value ? [] : (data.value ?? [])))
  const countText = computed(() => (data.value === null && !error.value ? '…' : String(vacancies.value.length)))

  watch(filters, () => search())

  function reset() {
    Object.assign(filters, defaultFilters())
  }

  execute()

  return { filters, vacancies, countText, loading, error, reset }
}
