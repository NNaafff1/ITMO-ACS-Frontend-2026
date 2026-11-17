import { defineStore } from 'pinia'
import { vacanciesApi } from '@/api'

const useVacanciesStore = defineStore('vacancies', {
  state: () => ({
    vacancies: []
  }),
  actions: {
    async loadVacancies() {
      const response = await vacanciesApi.getAll()
      this.vacancies = response.data
      return response
    },
    async createVacancy(data) {
      const response = await vacanciesApi.createVacancy(data)
      return response
    }
  }
})

export default useVacanciesStore
