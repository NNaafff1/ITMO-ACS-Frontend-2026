<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, cabinetRoute, logout } = useAuth()

const menuOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

async function onLogout() {
  await router.push({ name: 'home' })
  logout()
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg site-navbar" aria-label="Основная навигация">
      <div class="container">
        <RouterLink
          class="navbar-brand text-primary d-inline-flex align-items-center gap-2"
          :to="{ name: 'home' }"
        >
          <SvgIcon name="briefcase" class="icon-lg" />Работа рядом
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          aria-controls="mainNav"
          :aria-expanded="menuOpen"
          aria-label="Открыть меню"
          @click="menuOpen = !menuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse" :class="{ show: menuOpen }">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'vacancies' }">Вакансии</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="cabinetRoute">
                <SvgIcon name="user" class="me-1" />Мой кабинет
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'employer' }">Работодателям</RouterLink>
            </li>
          </ul>

          <div v-if="isAuthenticated" class="d-flex align-items-center gap-2">
            <span class="navbar-text me-2">{{ user.name }}</span>
            <button type="button" class="btn btn-outline-primary" @click="onLogout">Выйти</button>
          </div>
          <div v-else class="d-flex gap-2">
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'login' }">Войти</RouterLink>
            <RouterLink class="btn btn-primary" :to="{ name: 'register' }">Регистрация</RouterLink>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  </header>
</template>
