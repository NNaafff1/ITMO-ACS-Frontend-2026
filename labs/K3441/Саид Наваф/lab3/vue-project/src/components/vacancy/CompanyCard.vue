<script setup>
import { computed } from 'vue'
import { initials } from '@/utils/format'

const props = defineProps({
  vacancy: { type: Object, required: true },
  openCount: { type: [Number, String], default: '…' },
})

const companyInitials = computed(() => initials(props.vacancy.company))
</script>

<template>
  <div class="card vacancy-card mb-3">
    <div class="card-body p-4">
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="company-logo" aria-hidden="true">{{ companyInitials }}</div>
        <div>
          <h2 class="h5 mb-0">{{ vacancy.company }}</h2>
          <p class="text-secondary small mb-0">Работодатель</p>
        </div>
      </div>
      <dl class="row small mb-3">
        <dt class="col-6 text-secondary fw-normal">Город</dt>
        <dd class="col-6 mb-1">{{ vacancy.city }}</dd>
        <dt class="col-6 text-secondary fw-normal">Открыто вакансий</dt>
        <dd class="col-6 mb-0">{{ openCount }}</dd>
      </dl>
      <RouterLink class="btn btn-outline-primary w-100" :to="{ name: 'vacancies' }">Все вакансии</RouterLink>
    </div>
  </div>
</template>
