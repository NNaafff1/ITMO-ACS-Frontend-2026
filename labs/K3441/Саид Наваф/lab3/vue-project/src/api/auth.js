class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  login = async (payload) => {
    const response = await this.API.post('/login', payload)
    return response.data
  }

  register = async (payload) => {
    const response = await this.API.post('/register', payload)
    return response.data
  }
}

export default AuthApi
