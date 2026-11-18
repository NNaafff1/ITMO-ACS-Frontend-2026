class VacanciesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async (params = {}) => {
    const response = await this.API.get('/vacancies', { params })
    return response.data
  }

  getById = async (id) => {
    const response = await this.API.get(`/vacancies/${encodeURIComponent(id)}`)
    return response.data
  }

  getByEmployer = async (userId) => {
    const response = await this.API.get('/vacancies', {
      params: { userId, _embed: 'responses', _sort: 'id', _order: 'desc' },
    })
    return response.data
  }

  countActive = async (userId) => {
    const response = await this.API.get('/vacancies', { params: { active: true, userId } })
    return response.data.length
  }

  getSimilar = async (vacancy) => {
    const response = await this.API.get('/vacancies', {
      params: { active: true, industry: vacancy.industry, id_ne: vacancy.id, _limit: 2 },
    })
    return response.data
  }

  create = async (data) => {
    const response = await this.API.post('/vacancies', data)
    return response.data
  }

  update = async (id, data) => {
    const response = await this.API.patch(`/vacancies/${id}`, data)
    return response.data
  }

  remove = async (id) => {
    await this.API.delete(`/vacancies/${id}`, { params: { _dependent: 'responses' } })
  }
}

export default VacanciesApi
