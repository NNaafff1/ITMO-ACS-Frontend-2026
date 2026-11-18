class ResponsesApi {
  constructor(instance) {
    this.API = instance
  }

  getByUser = async (userId) => {
    const response = await this.API.get('/responses', { params: { userId, _expand: 'vacancy' } })
    return response.data
  }

  find = async (userId, vacancyId) => {
    const response = await this.API.get('/responses', { params: { userId, vacancyId } })
    return response.data
  }

  create = async (data) => {
    const response = await this.API.post('/responses', data)
    return response.data
  }
}

export default ResponsesApi
