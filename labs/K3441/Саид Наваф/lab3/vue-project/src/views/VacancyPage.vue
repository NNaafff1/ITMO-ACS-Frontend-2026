<script setup>
import { computed, ref, toRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resumesApi } from '@/api'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ApplyModal from '@/components/vacancy/ApplyModal.vue'
import CompanyCard from '@/components/vacancy/CompanyCard.vue'
import SimilarVacancies from '@/components/vacancy/SimilarVacancies.vue'
import VacancyDetails from '@/components/vacancy/VacancyDetails.vue'
import { useAuth } from '@/composables/useAuth'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useToast } from '@/composables/useToast'
import { useVacancyDetails } from '@/composables/useVacancyDetails'
import { getErrorMessage } from '@/utils/errors'

const props = defineProps({
  id: { type: String, required: true },
})

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, isSeeker } = useAuth()
const { showToast } = useToast()

const { vacancy, loading, error, companyOpen, similar, applied, markApplied } = useVacancyDetails(
  toRef(props, 'id'),
)

const resumes = ref([])
const applyOpen = ref(false)

useDocumentTitle(computed(() => (vacancy.value ? `${vacancy.value.title} — Работа рядом` : 'Вакансия — Работа рядом')))

async function onApply() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (!isSeeker.value) {
    showToast('Откликаться на вакансии могут только соискатели.', 'danger')
    return
  }
  try {
    resumes.value = await resumesApi.getByUser(user.value.id)
  } catch (err) {
    showToast(getErrorMessage(err), 'danger')
    return
  }
  applyOpen.value = true
}
</script>

<template>
  <div class="py-4">
    <div class="container">
      <nav aria-label="Хлебные крошки">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink :to="{ name: 'home' }">Главная</RouterLink></li>
          <li class="breadcrumb-item"><RouterLink :to="{ name: 'vacancies' }">Вакансии</RouterLink></li>
          <li class="breadcrumb-item active" aria-current="page">{{ vacancy ? vacancy.title : 'Вакансия' }}</li>
        </ol>
      </nav>

      <LoadingSpinner v-if="loading" />
      <AlertMessage :message="error" />

      <div v-if="vacancy" class="row g-4">
        <div class="col-lg-8">
          <VacancyDetails :vacancy="vacancy" :applied="applied" @apply="onApply" />
        </div>
        <aside class="col-lg-4" aria-label="О компании">
          <CompanyCard :vacancy="vacancy" :open-count="companyOpen" />
          <SimilarVacancies :items="similar" />
        </aside>
      </div>

      <ApplyModal v-if="vacancy" v-model="applyOpen" :vacancy="vacancy" :resumes="resumes" @applied="markApplied" />
    </div>
  </div>
</template>
