import instance from '@/api/instance'
import VacanciesApi from '@/api/vacancies'

const vacanciesApi = new VacanciesApi(instance)

export {
  vacanciesApi
}
