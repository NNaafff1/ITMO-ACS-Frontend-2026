<template>
  <base-layout>
    <h1>Работа рядом: вакансии</h1>
    <form
      ref="vacancyForm"
      class="d-flex flex-column my-5"
      @submit.prevent="createCard"
    >
      <label for="vacancyTitle" class="form-label">Название вакансии</label>
      <input
        id="vacancyTitle"
        type="text"
        v-model="form.title"
        class="form-control mb-2"
        required
      >
      <label for="vacancyCompany" class="form-label">Компания</label>
      <input
        id="vacancyCompany"
        type="text"
        v-model="form.company"
        class="form-control mb-2"
        required
      >
      <label for="vacancyCity" class="form-label">Город</label>
      <input
        id="vacancyCity"
        type="text"
        v-model="form.city"
        class="form-control mb-2"
      >
      <label for="vacancySalary" class="form-label">Зарплата от, ₽</label>
      <input
        id="vacancySalary"
        type="number"
        min="0"
        v-model.number="form.salary"
        class="form-control mb-2"
        required
      >
      <label for="vacancyDescription" class="form-label">Описание</label>
      <textarea
        id="vacancyDescription"
        rows="4"
        v-model="form.description"
        class="form-control mb-3"
      />
      <button type="submit" class="btn btn-primary">Добавить вакансию</button>
    </form>
    <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="vacancies">
      <div class="col" v-for="vacancy in vacancies" :key="vacancy.id">
        <vacancy-card
          :title="vacancy.title"
          :company="vacancy.company"
          :city="vacancy.city"
          :salary="vacancy.salary"
          :description="vacancy.description"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import VacancyCard from '@/components/VacancyCard.vue'
import useVacanciesStore from '@/stores/vacancies'

const emptyForm = () => ({
  title: '',
  company: '',
  city: '',
  salary: null,
  description: ''
})

export default {
  name: 'VacanciesPage',
  components: { BaseLayout, VacancyCard },
  data() {
    return {
      form: emptyForm()
    }
  },
  computed: {
    ...mapState(useVacanciesStore, ['vacancies'])
  },
  methods: {
    ...mapActions(useVacanciesStore, ['loadVacancies', 'createVacancy']),
    async createCard() {
      await this.createVacancy(this.form)
      await this.loadVacancies()
      this.$refs.vacancyForm.reset()
      this.form = emptyForm()
    }
  },
  mounted() {
    this.loadVacancies()
  }
}
</script>
