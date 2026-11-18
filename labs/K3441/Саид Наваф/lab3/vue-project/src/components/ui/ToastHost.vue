<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show"
      :class="`text-bg-${toast.type}`"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toast.text }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Закрыть"
          @click="dismissToast(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>
