import { ref } from 'vue'

export function useFormValidation() {
  const formRef = ref(null)
  const validated = ref(false)

  function validate() {
    const form = formRef.value
    if (!form) {
      return false
    }
    if (form.checkValidity()) {
      return true
    }
    validated.value = true
    form.querySelector(':invalid')?.focus()
    return false
  }

  function resetValidation() {
    validated.value = false
  }

  return { formRef, validated, validate, resetValidation }
}
