<script setup>
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { experienceLabel, industryLabel } from '@/constants/dictionaries'
import { formatSalary } from '@/utils/format'

defineProps({
  vacancy: { type: Object, required: true },
})
</script>

<template>
  <article class="card vacancy-card h-100">
    <div class="card-body d-flex flex-column">
      <h2 class="h5 mb-1">
        <RouterLink class="text-decoration-none" :to="{ name: 'vacancy', params: { id: vacancy.id } }">
          {{ vacancy.title }}
        </RouterLink>
      </h2>
      <p class="text-secondary mb-2">
        {{ vacancy.company }} · <SvgIcon name="location" class="me-1" />{{ vacancy.city }}
      </p>
      <p class="salary fs-5 mb-3">{{ formatSalary(vacancy.salary) }}</p>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge site-chip border">{{ industryLabel(vacancy.industry) }}</span>
        <span class="badge site-chip border">{{ experienceLabel(vacancy.experience) }}</span>
      </div>
      <RouterLink
        class="btn btn-outline-primary mt-auto align-self-start"
        :to="{ name: 'vacancy', params: { id: vacancy.id } }"
        :aria-label="`Подробнее о вакансии ${vacancy.title}`"
      >
        Подробнее
      </RouterLink>
    </div>
  </article>
</template>
