import { onBeforeUnmount } from 'vue'

export function useDebounceFn(fn, delay = 300) {
  let timer = null

  function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }

  debounced.cancel = () => clearTimeout(timer)

  onBeforeUnmount(() => clearTimeout(timer))

  return debounced
}
