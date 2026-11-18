import instance, { setUnauthorizedHandler } from '@/api/instance'
import AuthApi from '@/api/auth'
import VacanciesApi from '@/api/vacancies'
import ResumesApi from '@/api/resumes'
import ResponsesApi from '@/api/responses'

const authApi = new AuthApi(instance)
const vacanciesApi = new VacanciesApi(instance)
const resumesApi = new ResumesApi(instance)
const responsesApi = new ResponsesApi(instance)

export {
  authApi,
  vacanciesApi,
  resumesApi,
  responsesApi,
  setUnauthorizedHandler,
}
