class VacanciesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/vacancies'
    })
  }

  createVacancy = async (data) => {
    return this.API({
      method: 'POST',
      url: '/vacancies',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default VacanciesApi
