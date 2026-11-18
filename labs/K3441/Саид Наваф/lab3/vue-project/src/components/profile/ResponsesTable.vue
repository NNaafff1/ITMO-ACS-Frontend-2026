<script setup>
import { RESPONSE_STATUSES } from '@/constants/dictionaries'

defineProps({
  responses: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

function statusOf(status) {
  return RESPONSE_STATUSES[status] ?? { label: status, className: 'site-chip border' }
}
</script>

<template>
  <div class="card profile-card">
    <div class="table-responsive" role="region" aria-label="Таблица откликов">
      <table class="table align-middle mb-0" aria-label="Список откликов на вакансии">
        <thead>
          <tr>
            <th scope="col">Вакансия</th>
            <th scope="col">Компания</th>
            <th scope="col">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="text-secondary">Загрузка…</td>
          </tr>
          <tr v-else-if="responses.length === 0">
            <td colspan="3" class="text-secondary">
              Откликов пока нет. Найдите вакансию и нажмите «Откликнуться».
            </td>
          </tr>
          <tr v-for="item in loading ? [] : responses" :key="item.id">
            <td>
              <RouterLink v-if="item.vacancy" :to="{ name: 'vacancy', params: { id: item.vacancyId } }">
                {{ item.vacancy.title }}
              </RouterLink>
              <span v-else>Вакансия удалена</span>
            </td>
            <td>{{ item.vacancy ? item.vacancy.company : '—' }}</td>
            <td>
              <span class="badge" :class="statusOf(item.status).className">{{ statusOf(item.status).label }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
