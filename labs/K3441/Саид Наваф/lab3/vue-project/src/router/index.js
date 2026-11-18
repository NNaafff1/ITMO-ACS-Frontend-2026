import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TITLE = 'Работа рядом'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: 'Работа рядом — поиск вакансий' },
  },
  {
    path: '/vacancies',
    name: 'vacancies',
    component: () => import('@/views/VacanciesPage.vue'),
    meta: { title: 'Поиск вакансий — Работа рядом' },
  },
  {
    path: '/vacancies/:id',
    name: 'vacancy',
    component: () => import('@/views/VacancyPage.vue'),
    props: true,
    meta: { title: 'Вакансия — Работа рядом' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: 'Вход — Работа рядом', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { title: 'Регистрация — Работа рядом', guestOnly: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { title: 'Личный кабинет — Работа рядом', requiresAuth: true, role: 'seeker' },
  },
  {
    path: '/employer',
    name: 'employer',
    component: () => import('@/views/EmployerPage.vue'),
    meta: { title: 'Кабинет работодателя — Работа рядом', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: 'Страница не найдена — Работа рядом' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const cabinet = { name: auth.isEmployer ? 'employer' : 'profile' }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return cabinet
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return cabinet
  }
  return true
})

router.afterEach((to, from) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
  if (from.name) {
    nextTick(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
  }
})

export default router
