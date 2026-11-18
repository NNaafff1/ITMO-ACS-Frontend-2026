import { toValue, watchEffect } from 'vue'

export function useDocumentTitle(title) {
  watchEffect(() => {
    document.title = toValue(title)
  })
}
