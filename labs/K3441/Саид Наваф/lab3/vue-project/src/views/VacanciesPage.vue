<script setup>
import AlertMessage from '@/components/ui/AlertMessage.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'
import VacancyFilters from '@/components/vacancies/VacancyFilters.vue'
import { useVacancySearch } from '@/composables/useVacancySearch'

const { filters, vacancies, countText, loading, error, reset } = useVacancySearch()
</script>

<template>
  <div class="py-4">
    <div class="container">
      <h1 class="h3 fw-bold mb-4">Поиск вакансий</h1>

      <div class="row g-4">
        <aside class="col-lg-3" aria-label="Фильтры вакансий">
          <VacancyFilters
            v-model:q="filters.q"
            v-model:industry="filters.industry"
            v-model:experience="filters.experience"
            v-model:salary="filters.salary"
            @reset="reset"
          />
        </aside>

        <section class="col-lg-9" aria-labelledby="resultsTitle">
          <AlertMessage :message="error" />
          <LoadingSpinner v-if="loading" />
          <h2 id="resultsTitle" class="h6 text-secondary mb-3" aria-live="polite">
            Найдено вакансий: {{ countText }}
          </h2>

          <div class="row g-3" :aria-busy="loading">
            <div v-for="vacancy in vacancies" :key="vacancy.id" class="col-md-6">
              <VacancyCard :vacancy="vacancy" />
            </div>
          </div>

          <div v-if="!loading && !error && vacancies.length === 0" class="alert alert-secondary mt-3" role="status">
            Ничего не найдено. Измените условия поиска или сбросьте фильтры.
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
