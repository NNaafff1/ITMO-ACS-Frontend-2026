class ResumesApi {
  constructor(instance) {
    this.API = instance
  }

  getByUser = async (userId) => {
    const response = await this.API.get('/resumes', { params: { userId } })
    return response.data
  }

  create = async (data) => {
    const response = await this.API.post('/resumes', data)
    return response.data
  }

  update = async (id, data) => {
    const response = await this.API.patch(`/resumes/${id}`, data)
    return response.data
  }
}

export default ResumesApi
