<script setup>
import FormField from '@/components/ui/FormField.vue'
import { EXPERIENCES, INDUSTRIES } from '@/constants/dictionaries'

const query = defineModel('q', { type: String, default: '' })
const industry = defineModel('industry', { type: String, default: '' })
const experience = defineModel('experience', { type: String, default: '' })
const salary = defineModel('salary', { type: [String, Number], default: '' })

defineEmits(['reset'])
</script>

<template>
  <form class="card filters-card" role="search" aria-label="Поиск и фильтры вакансий" @submit.prevent>
    <div class="card-body">
      <h2 class="h6 fw-bold mb-3">Фильтры</h2>

      <FormField
        id="fSearch"
        v-model="query"
        type="search"
        label="Поиск по вакансиям"
        placeholder="Например, верстальщик или Москва"
      />

      <FormField id="fIndustry" v-model="industry" tag="select" label="Отрасль">
        <option value="">Любая</option>
        <option v-for="(label, value) in INDUSTRIES" :key="value" :value="value">{{ label }}</option>
      </FormField>

      <FormField
        id="fSalary"
        v-model="salary"
        type="number"
        label="Зарплата от, ₽"
        min="0"
        step="5000"
        placeholder="0"
      />

      <FormField
        id="fExperience"
        v-model="experience"
        tag="select"
        label="Опыт работы"
        wrapper-class="mb-4"
      >
        <option value="">Любой</option>
        <option v-for="(label, value) in EXPERIENCES" :key="value" :value="value">{{ label }}</option>
      </FormField>

      <button type="button" class="btn btn-outline-secondary w-100" @click="$emit('reset')">
        Сбросить фильтры
      </button>
    </div>
  </form>
</template>
