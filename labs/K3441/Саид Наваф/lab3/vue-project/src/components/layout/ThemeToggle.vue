<script setup>
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button type="button" class="btn btn-outline-secondary ms-lg-2 mt-2 mt-lg-0" @click="toggleTheme">
    <SvgIcon :name="isDark ? 'sun' : 'moon'" class="me-2" />{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
  </button>
</template>
