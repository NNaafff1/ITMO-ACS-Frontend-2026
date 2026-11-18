<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import FormField from '@/components/ui/FormField.vue'
import { useFormValidation } from '@/composables/useFormValidation'

const open = defineModel({ type: Boolean, default: false })

const { formRef, validated, validate, resetValidation } = useFormValidation()
const email = ref('')
const sent = ref(false)

function onSubmit() {
  if (validate()) {
    sent.value = true
  }
}

function onHidden() {
  email.value = ''
  sent.value = false
  resetValidation()
}
</script>

<template>
  <BaseModal id="resetModal" v-model="open" title="Восстановление пароля" @hidden="onHidden">
    <form
      id="resetForm"
      ref="formRef"
      class="needs-validation"
      :class="{ 'was-validated': validated }"
      novalidate
      @submit.prevent="onSubmit"
    >
      <p class="text-secondary">Укажите почту, и мы отправим ссылку для смены пароля.</p>
      <FormField
        id="resetEmail"
        v-model="email"
        type="email"
        label="Эл. почта"
        required
        feedback="Введите корректный адрес почты."
        wrapper-class="mb-0"
      />
      <div v-if="sent" class="alert alert-success mt-3 mb-0" role="status">
        Ссылка отправлена. Проверьте почту.
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
      <button type="submit" form="resetForm" class="btn btn-primary">Отправить ссылку</button>
    </template>
  </BaseModal>
</template>
