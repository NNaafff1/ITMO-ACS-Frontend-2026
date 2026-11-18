<script setup>
import { computed, reactive, watch } from 'vue'
import { responsesApi } from '@/api'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import FormField from '@/components/ui/FormField.vue'
import { useAuth } from '@/composables/useAuth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useSubmit } from '@/composables/useSubmit'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  vacancy: { type: Object, required: true },
  resumes: { type: Array, default: () => [] },
})

const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['applied'])

const { user } = useAuth()
const { showToast } = useToast()
const { formRef, validated, validate, resetValidation } = useFormValidation()

const form = reactive({ resumeId: '', letter: '' })
const hasResumes = computed(() => props.resumes.length > 0)

const { submitting, error, submit } = useSubmit(async () => {
  await responsesApi.create({
    userId: user.value.id,
    vacancyId: props.vacancy.id,
    resumeId: Number(form.resumeId),
    letter: form.letter.trim(),
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10),
  })
  return true
})

watch(open, (isOpen) => {
  if (isOpen) {
    form.resumeId = props.resumes[0]?.id ?? ''
    form.letter = ''
    resetValidation()
  }
})

async function onSubmit() {
  if (!validate()) {
    return
  }
  const ok = await submit()
  if (ok) {
    open.value = false
    showToast('Отклик отправлен. Работодатель увидит его в своём кабинете.')
    emit('applied')
  }
}
</script>

<template>
  <BaseModal id="applyModal" v-model="open" title="Отклик на вакансию">
    <form
      id="applyForm"
      ref="formRef"
      class="needs-validation"
      :class="{ 'was-validated': validated }"
      novalidate
      @submit.prevent="onSubmit"
    >
      <p class="text-secondary">{{ vacancy.title }}, {{ vacancy.company }}</p>

      <div v-if="!hasResumes" class="alert alert-warning" role="alert">
        У вас пока нет резюме.
        <RouterLink :to="{ name: 'profile' }" class="alert-link">Создайте его в личном кабинете</RouterLink>,
        и вернитесь к отклику.
      </div>
      <AlertMessage :message="error" />

      <FormField
        id="applyResume"
        v-model="form.resumeId"
        tag="select"
        label="Резюме"
        required
        feedback="Выберите резюме."
      >
        <option v-if="!hasResumes" value="">Нет резюме</option>
        <option v-for="resume in resumes" :key="resume.id" :value="resume.id">{{ resume.position }}</option>
      </FormField>

      <FormField
        id="applyLetter"
        v-model="form.letter"
        tag="textarea"
        label="Сопроводительное письмо"
        rows="5"
        maxlength="1000"
        placeholder="Расскажите, почему вам подходит эта вакансия"
        required
        feedback="Напишите пару предложений."
        wrapper-class="mb-0"
      />
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
      <button type="submit" form="applyForm" class="btn btn-primary" :disabled="submitting || !hasResumes">
        Отправить отклик
      </button>
    </template>
  </BaseModal>
</template>
