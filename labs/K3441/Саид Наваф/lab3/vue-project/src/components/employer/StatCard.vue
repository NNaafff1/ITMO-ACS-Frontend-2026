<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: '…' },
})
</script>

<template>
  <div class="card stat-card">
    <div class="card-body">
      <div class="text-secondary small">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
    </div>
  </div>
</template>
