<script setup>
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { experienceLabel, industryLabel } from '@/constants/dictionaries'
import { formatSalary } from '@/utils/format'

defineProps({
  resume: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['edit'])
</script>

<template>
  <div class="card profile-card">
    <div class="card-body p-4">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="!resume" class="text-center py-4">
        <p class="text-secondary mb-3">Резюме пока не заполнено.</p>
        <button class="btn btn-primary" type="button" @click="$emit('edit')">Создать резюме</button>
      </div>

      <div v-else>
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 class="h4 mb-1">{{ resume.position }}</h2>
            <p class="salary text-primary fw-bold mb-0">{{ formatSalary(resume.salary) }}</p>
          </div>
          <button class="btn btn-primary" type="button" @click="$emit('edit')">Редактировать резюме</button>
        </div>

        <div class="row mb-3">
          <div class="col-sm-6 mb-3 mb-sm-0">
            <div class="resume-label">Опыт работы</div>
            <div>{{ experienceLabel(resume.experience) }}</div>
          </div>
          <div class="col-sm-6">
            <div class="resume-label">Отрасль</div>
            <div>{{ industryLabel(resume.industry) }}</div>
          </div>
        </div>

        <div class="mb-3">
          <div class="resume-label">Навыки</div>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="skill in resume.skills ?? []" :key="skill" class="badge text-bg-primary">{{ skill }}</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="resume-label">О себе</div>
          <p class="mb-0">{{ resume.about || 'Не заполнено' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
