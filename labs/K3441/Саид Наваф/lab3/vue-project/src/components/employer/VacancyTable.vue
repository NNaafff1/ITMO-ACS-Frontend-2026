<script setup>
import { industryLabel } from '@/constants/dictionaries'
import { formatSalary } from '@/utils/format'

defineProps({
  vacancies: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  togglingId: { type: Number, default: null },
})

defineEmits(['edit', 'toggle', 'delete'])
</script>

<template>
  <div class="table-responsive" role="region" aria-label="Таблица вакансий">
    <table class="table align-middle mb-0" aria-label="Список вакансий компании">
      <thead>
        <tr>
          <th scope="col">Вакансия</th>
          <th scope="col">Отрасль</th>
          <th scope="col">Зарплата</th>
          <th scope="col">Отклики</th>
          <th scope="col">Статус</th>
          <th scope="col" class="text-end">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-secondary">Загрузка…</td>
        </tr>
        <tr v-for="vacancy in loading ? [] : vacancies" :key="vacancy.id">
          <th scope="row" class="fw-semibold">
            <RouterLink class="text-decoration-none" :to="{ name: 'vacancy', params: { id: vacancy.id } }">
              {{ vacancy.title }}
            </RouterLink>
            <div class="text-secondary small fw-normal">{{ vacancy.city }}</div>
          </th>
          <td>{{ industryLabel(vacancy.industry) }}</td>
          <td>{{ formatSalary(vacancy.salary) }}</td>
          <td>{{ vacancy.responses?.length ?? 0 }}</td>
          <td>
            <span class="badge" :class="vacancy.active ? 'text-bg-success' : 'text-bg-secondary'">
              {{ vacancy.active ? 'Активна' : 'Закрыта' }}
            </span>
          </td>
          <td class="text-end text-nowrap">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :aria-label="`Изменить вакансию «${vacancy.title}»`"
              @click="$emit('edit', vacancy)"
            >
              Изменить
            </button>
            {{ ' ' }}
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              :disabled="togglingId === vacancy.id"
              :aria-label="`${vacancy.active ? 'Закрыть' : 'Открыть'} вакансию «${vacancy.title}»`"
              @click="$emit('toggle', vacancy)"
            >
              {{ vacancy.active ? 'Закрыть' : 'Открыть' }}
            </button>
            {{ ' ' }}
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              :aria-label="`Удалить вакансию «${vacancy.title}»`"
              @click="$emit('delete', vacancy)"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
