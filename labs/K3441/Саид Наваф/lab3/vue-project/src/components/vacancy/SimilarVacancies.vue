<script setup>
import { formatSalary } from '@/utils/format'

defineProps({
  items: { type: Array, default: null },
})
</script>

<template>
  <div class="card vacancy-card">
    <div class="card-body p-4">
      <h2 class="h6 fw-bold mb-3">Похожие вакансии</h2>
      <ul class="list-unstyled mb-0">
        <li v-if="items === null" class="text-secondary small">Загрузка…</li>
        <li v-else-if="items.length === 0" class="text-secondary small">Похожих вакансий нет.</li>
        <li v-for="item in items ?? []" :key="item.id" class="mb-2">
          <RouterLink class="fw-semibold text-decoration-none" :to="{ name: 'vacancy', params: { id: item.id } }">
            {{ item.title }}
          </RouterLink>
          <div class="text-secondary small">{{ item.company }} · {{ formatSalary(item.salary) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
