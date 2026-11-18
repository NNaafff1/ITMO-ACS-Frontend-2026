<script setup>
import { computed } from 'vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { experienceLabel, industryLabel } from '@/constants/dictionaries'
import { formatSalary } from '@/utils/format'

const props = defineProps({
  vacancy: { type: Object, required: true },
  applied: { type: Boolean, default: false },
})

defineEmits(['apply'])

const badges = computed(() =>
  [
    industryLabel(props.vacancy.industry),
    `Опыт: ${experienceLabel(props.vacancy.experience)}`,
    props.vacancy.employment,
    props.vacancy.format,
  ].filter(Boolean),
)

const lists = computed(() => [
  { id: 'dutiesTitle', title: 'Обязанности', items: props.vacancy.responsibilities ?? [] },
  { id: 'reqTitle', title: 'Требования', items: props.vacancy.requirements ?? [] },
  { id: 'condTitle', title: 'Условия', items: props.vacancy.conditions ?? [] },
])

const applyLabel = computed(() => {
  if (props.applied) {
    return 'Вы откликнулись'
  }
  return props.vacancy.active ? 'Откликнуться' : 'Вакансия закрыта'
})

const applyDisabled = computed(() => props.applied || !props.vacancy.active)
</script>

<template>
  <article class="card vacancy-card">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h1 class="h3 fw-bold mb-1">{{ vacancy.title }}</h1>
          <p class="text-secondary mb-2">
            {{ vacancy.company }} · <SvgIcon name="location" class="me-1" />{{ vacancy.city }}
          </p>
          <p class="salary fs-4 mb-0">{{ formatSalary(vacancy.salary) }}</p>
        </div>
        <button
          type="button"
          class="btn btn-lg"
          :class="applied ? 'btn-success' : 'btn-primary'"
          :disabled="applyDisabled"
          @click="$emit('apply')"
        >
          {{ applyLabel }}
        </button>
      </div>

      <div class="d-flex flex-wrap gap-2 mb-4">
        <span v-for="badge in badges" :key="badge" class="badge site-chip border">{{ badge }}</span>
      </div>

      <section class="mb-4" aria-labelledby="descTitle">
        <h2 id="descTitle" class="h5 fw-bold">Описание</h2>
        <p>{{ vacancy.description }}</p>
      </section>

      <section
        v-for="(list, index) in lists"
        :key="list.id"
        :class="index < lists.length - 1 ? 'mb-4' : ''"
        :aria-labelledby="list.id"
      >
        <h2 :id="list.id" class="h5 fw-bold">{{ list.title }}</h2>
        <ul :class="index === lists.length - 1 ? 'mb-0' : ''">
          <li v-for="item in list.items" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </article>
</template>
