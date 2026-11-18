<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'danger' },
})
</script>

<template>
  <div v-if="message" class="alert" :class="`alert-${type}`" role="alert">{{ message }}</div>
</template>
