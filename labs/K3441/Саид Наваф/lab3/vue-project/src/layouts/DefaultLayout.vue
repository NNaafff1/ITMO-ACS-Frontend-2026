<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ToastHost from '@/components/ui/ToastHost.vue'

function focusMain() {
  document.getElementById('main-content')?.focus()
}
</script>

<template>
  <a class="visually-hidden-focusable skip-link" href="#main-content" @click.prevent="focusMain">
    Перейти к основному содержимому
  </a>
  <AppNavbar />
  <main id="main-content" tabindex="-1">
    <slot />
  </main>
  <AppFooter />
  <ToastHost />
</template>
