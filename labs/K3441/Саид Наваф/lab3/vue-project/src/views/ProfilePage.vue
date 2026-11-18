<script setup>
import { onMounted, ref, watch } from 'vue'
import { responsesApi } from '@/api'
import ProfileSummary from '@/components/profile/ProfileSummary.vue'
import ResponsesTable from '@/components/profile/ResponsesTable.vue'
import ResumeCard from '@/components/profile/ResumeCard.vue'
import ResumeFormModal from '@/components/profile/ResumeFormModal.vue'
import TabList from '@/components/ui/TabList.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAuth } from '@/composables/useAuth'
import { useResume } from '@/composables/useResume'
import { useToast } from '@/composables/useToast'

const { user } = useAuth()
const { showToast } = useToast()

const tabs = [
  { id: 'resume', label: 'Резюме' },
  { id: 'responses', label: 'Мои отклики' },
]
const activeTab = ref('resume')
const editOpen = ref(false)

const { resume, loading: resumeLoading, saving, load: loadResume, save } = useResume(() => user.value?.id)
const {
  data: responses,
  loading: responsesLoading,
  error: responsesError,
  execute: loadResponses,
} = useAsyncData(() => responsesApi.getByUser(user.value.id), { initial: [] })

watch(responsesError, (message) => {
  if (message) {
    showToast(message, 'danger')
  }
})

async function onSave(data) {
  if (await save(data)) {
    editOpen.value = false
  }
}

onMounted(() => {
  loadResume()
  loadResponses()
})
</script>

<template>
  <div v-if="user" class="py-4">
    <div class="container">
      <h1 class="h3 fw-bold mb-4">Личный кабинет</h1>

      <div class="row g-4">
        <div class="col-lg-4">
          <ProfileSummary :user="user" :resume="resume" :loading="resumeLoading" />
        </div>

        <div class="col-lg-8">
          <TabList v-model="activeTab" :tabs="tabs" label="Разделы личного кабинета" />

          <div class="tab-content">
            <div
              id="resume"
              class="tab-pane"
              :class="{ active: activeTab === 'resume' }"
              role="tabpanel"
              aria-labelledby="resume-tab"
              tabindex="0"
            >
              <ResumeCard :resume="resume" :loading="resumeLoading" @edit="editOpen = true" />
            </div>
            <div
              id="responses"
              class="tab-pane"
              :class="{ active: activeTab === 'responses' }"
              role="tabpanel"
              aria-labelledby="responses-tab"
              tabindex="0"
            >
              <ResponsesTable :responses="responses ?? []" :loading="responsesLoading" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ResumeFormModal v-model="editOpen" :resume="resume" :saving="saving" @save="onSave" />
  </div>
</template>
