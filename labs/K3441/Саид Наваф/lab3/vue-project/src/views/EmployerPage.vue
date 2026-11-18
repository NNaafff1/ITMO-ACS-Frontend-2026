<script setup>
import { computed, onMounted, ref } from 'vue'
import DeleteVacancyModal from '@/components/employer/DeleteVacancyModal.vue'
import StatCard from '@/components/employer/StatCard.vue'
import VacancyFormModal from '@/components/employer/VacancyFormModal.vue'
import VacancyTable from '@/components/employer/VacancyTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useEmployerVacancies } from '@/composables/useEmployerVacancies'

const { user } = useAuth()

const companyTitle = computed(() => user.value?.company || user.value?.name || '')

const { vacancies, loading, saving, togglingId, stats, load, save, toggle, remove } = useEmployerVacancies(
  () => user.value?.id,
  () => companyTitle.value,
)

const formOpen = ref(false)
const editing = ref(null)
const deleteOpen = ref(false)
const deleting = ref(null)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(vacancy) {
  editing.value = vacancy
  formOpen.value = true
}

function openDelete(vacancy) {
  deleting.value = vacancy
  deleteOpen.value = true
}

async function onSave(data) {
  if (await save(data, editing.value ? editing.value.id : null)) {
    formOpen.value = false
  }
}

async function onConfirmDelete() {
  if (deleting.value && (await remove(deleting.value.id))) {
    deleteOpen.value = false
    deleting.value = null
  }
}

onMounted(load)
</script>

<template>
  <div v-if="user" class="py-4">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 class="h3 fw-bold mb-1">Кабинет работодателя</h1>
          <p class="text-secondary mb-0">{{ companyTitle }}</p>
        </div>
        <button type="button" class="btn btn-primary" @click="openCreate">Добавить вакансию</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-4"><StatCard label="Активные вакансии" :value="loading ? '…' : stats.active" /></div>
        <div class="col-sm-4"><StatCard label="Закрытые вакансии" :value="loading ? '…' : stats.closed" /></div>
        <div class="col-sm-4"><StatCard label="Всего откликов" :value="loading ? '…' : stats.responses" /></div>
      </div>

      <section class="card stat-card" aria-labelledby="tableTitle">
        <div class="card-body pb-0">
          <h2 id="tableTitle" class="h5 fw-bold">Мои вакансии</h2>
        </div>
        <VacancyTable
          :vacancies="vacancies"
          :loading="loading"
          :toggling-id="togglingId"
          @edit="openEdit"
          @toggle="toggle"
          @delete="openDelete"
        />
        <div v-if="!loading && vacancies.length === 0" class="alert alert-secondary m-3" role="status">
          Вакансий пока нет. Нажмите «Добавить вакансию».
        </div>
      </section>
    </div>

    <VacancyFormModal v-model="formOpen" :vacancy="editing" :saving="saving" @save="onSave" />
    <DeleteVacancyModal v-model="deleteOpen" :vacancy="deleting" @confirm="onConfirmDelete" />
  </div>
</template>
