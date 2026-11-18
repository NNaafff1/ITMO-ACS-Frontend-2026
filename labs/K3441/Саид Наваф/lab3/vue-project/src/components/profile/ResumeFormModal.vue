<script setup>
import { reactive, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import FormField from '@/components/ui/FormField.vue'
import { EXPERIENCES, INDUSTRIES } from '@/constants/dictionaries'
import { useFormValidation } from '@/composables/useFormValidation'

const props = defineProps({
  resume: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})

const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['save'])

const { formRef, validated, validate, resetValidation } = useFormValidation()

const form = reactive({
  position: '',
  salary: '',
  industry: 'it',
  experience: 'none',
  city: '',
  skills: '',
  about: '',
})

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }
  const data = props.resume ?? {}
  form.position = data.position ?? ''
  form.salary = data.salary ?? ''
  form.industry = data.industry ?? 'it'
  form.experience = data.experience ?? 'none'
  form.city = data.city ?? ''
  form.skills = (data.skills ?? []).join(', ')
  form.about = data.about ?? ''
  resetValidation()
})

function onSubmit() {
  if (!validate()) {
    return
  }
  emit('save', {
    position: form.position.trim(),
    salary: Number(form.salary),
    industry: form.industry,
    experience: form.experience,
    city: form.city.trim(),
    skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    about: form.about.trim(),
  })
}
</script>

<template>
  <BaseModal id="editResumeModal" v-model="open" size="lg" title="Редактирование резюме">
    <form
      id="resumeForm"
      ref="formRef"
      class="needs-validation"
      :class="{ 'was-validated': validated }"
      novalidate
      @submit.prevent="onSubmit"
    >
      <div class="row g-3">
        <FormField
          id="inPosition"
          v-model="form.position"
          label="Желаемая должность"
          required
          feedback="Укажите должность."
          wrapper-class="col-md-8"
        />
        <FormField
          id="inSalary"
          v-model="form.salary"
          type="number"
          label="Зарплата от, ₽"
          min="0"
          step="1000"
          required
          feedback="Введите сумму."
          wrapper-class="col-md-4"
        />
        <FormField id="inIndustry" v-model="form.industry" tag="select" label="Отрасль" required wrapper-class="col-md-6">
          <option v-for="(label, value) in INDUSTRIES" :key="value" :value="value">{{ label }}</option>
        </FormField>
        <FormField id="inExperience" v-model="form.experience" tag="select" label="Опыт работы" required wrapper-class="col-md-6">
          <option v-for="(label, value) in EXPERIENCES" :key="value" :value="value">{{ label }}</option>
        </FormField>
        <FormField
          id="inCity"
          v-model="form.city"
          label="Город"
          required
          feedback="Укажите город."
          wrapper-class="col-md-6"
        />
        <FormField
          id="inSkills"
          v-model="form.skills"
          label="Навыки через запятую"
          placeholder="HTML, CSS, JavaScript"
          wrapper-class="col-md-6"
        />
        <FormField
          id="inAbout"
          v-model="form.about"
          tag="textarea"
          label="О себе"
          rows="4"
          maxlength="500"
          wrapper-class="col-12"
        />
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
      <button type="submit" form="resumeForm" class="btn btn-primary" :disabled="saving">Сохранить резюме</button>
    </template>
  </BaseModal>
</template>
