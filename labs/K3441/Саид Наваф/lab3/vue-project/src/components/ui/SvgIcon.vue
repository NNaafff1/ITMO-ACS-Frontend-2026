<script setup>
defineProps({
  name: { type: String, required: true },
})

const spriteUrl = `${import.meta.env.BASE_URL}img/sprite.svg`
</script>

<template>
  <svg class="icon" aria-hidden="true" focusable="false">
    <use :href="`${spriteUrl}#icon-${name}`" />
  </svg>
</template>
