import axios from 'axios'
import { readAuth } from '@/utils/authStorage'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

instance.interceptors.request.use((config) => {
  const auth = readAuth()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && readAuth() && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(error)
  },
)

export default instance
