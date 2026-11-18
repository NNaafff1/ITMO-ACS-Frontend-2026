<script setup>
import { computed, reactive, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import FormField from '@/components/ui/FormField.vue'
import { EXPERIENCES, INDUSTRIES } from '@/constants/dictionaries'
import { useFormValidation } from '@/composables/useFormValidation'

const props = defineProps({
  vacancy: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})

const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['save'])

const { formRef, validated, validate, resetValidation } = useFormValidation()

const form = reactive({
  title: '',
  salary: '',
  industry: 'it',
  experience: 'none',
  city: '',
  description: '',
})

const isEdit = computed(() => props.vacancy !== null)

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }
  const data = props.vacancy ?? {}
  form.title = data.title ?? ''
  form.salary = data.salary ?? ''
  form.industry = data.industry ?? 'it'
  form.experience = data.experience ?? 'none'
  form.city = data.city ?? ''
  form.description = data.description ?? ''
  resetValidation()
})

function onSubmit() {
  if (!validate()) {
    return
  }
  emit('save', {
    title: form.title.trim(),
    salary: Number(form.salary),
    industry: form.industry,
    experience: form.experience,
    city: form.city.trim(),
    description: form.description.trim(),
  })
}
</script>

<template>
  <BaseModal id="vacancyModal" v-model="open" size="lg" :title="isEdit ? 'Изменение вакансии' : 'Новая вакансия'">
    <form
      id="vacancyForm"
      ref="formRef"
      class="needs-validation"
      :class="{ 'was-validated': validated }"
      novalidate
      @submit.prevent="onSubmit"
    >
      <div class="row g-3">
        <FormField
          id="vTitle"
          v-model="form.title"
          label="Название"
          required
          feedback="Укажите название вакансии."
          wrapper-class="col-md-8"
        />
        <FormField
          id="vSalary"
          v-model="form.salary"
          type="number"
          label="Зарплата от, ₽"
          min="0"
          step="1000"
          required
          feedback="Введите сумму."
          wrapper-class="col-md-4"
        />
        <FormField id="vIndustry" v-model="form.industry" tag="select" label="Отрасль" required wrapper-class="col-md-4">
          <option v-for="(label, value) in INDUSTRIES" :key="value" :value="value">{{ label }}</option>
        </FormField>
        <FormField id="vExperience" v-model="form.experience" tag="select" label="Опыт" required wrapper-class="col-md-4">
          <option v-for="(label, value) in EXPERIENCES" :key="value" :value="value">{{ label }}</option>
        </FormField>
        <FormField
          id="vCity"
          v-model="form.city"
          label="Город"
          required
          feedback="Укажите город."
          wrapper-class="col-md-4"
        />
        <FormField
          id="vDescription"
          v-model="form.description"
          tag="textarea"
          label="Описание и требования"
          rows="4"
          maxlength="1000"
          wrapper-class="col-12"
        />
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
      <button type="submit" form="vacancyForm" class="btn btn-primary" :disabled="saving">
        {{ isEdit ? 'Сохранить' : 'Опубликовать' }}
      </button>
    </template>
  </BaseModal>
</template>
