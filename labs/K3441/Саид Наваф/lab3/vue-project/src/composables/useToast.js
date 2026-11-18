import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function dismissToast(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function showToast(text, type = 'success', timeout = 5000) {
    const id = nextId++
    toasts.value.push({ id, text, type })
    setTimeout(() => dismissToast(id), timeout)
  }

  return { toasts, showToast, dismissToast }
}
