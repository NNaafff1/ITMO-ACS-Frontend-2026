import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vacancies',
      component: () => import('../views/VacanciesPage.vue')
    }
  ]
})

export default router
