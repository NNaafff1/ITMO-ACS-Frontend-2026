<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <h6 class="card-subtitle mb-2 text-body-secondary">{{ subtitle }}</h6>
      <p class="card-text fw-semibold">от {{ formattedSalary }} ₽</p>
      <p class="card-text">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VacancyCard',
  props: {
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: false
    },
    salary: {
      type: Number,
      required: false,
      default: 0
    },
    description: {
      type: String,
      required: false
    }
  },
  computed: {
    subtitle() {
      return [this.company, this.city].filter(Boolean).join(' · ')
    },
    formattedSalary() {
      return this.salary.toLocaleString('ru-RU')
    }
  }
}
</script>
