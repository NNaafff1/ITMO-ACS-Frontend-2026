<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Modal } from 'bootstrap'

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  size: { type: String, default: '' },
})

const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['hidden'])

const element = ref(null)
let instance = null

function onHidden() {
  open.value = false
  emit('hidden')
}

onMounted(() => {
  instance = new Modal(element.value)
  element.value.addEventListener('hidden.bs.modal', onHidden)
  if (open.value) {
    instance.show()
  }
})

watch(open, (isOpen) => {
  if (!instance) {
    return
  }
  if (isOpen) {
    instance.show()
  } else {
    instance.hide()
  }
})

onBeforeUnmount(() => {
  if (!instance) {
    return
  }
  element.value?.removeEventListener('hidden.bs.modal', onHidden)
  if (element.value?.classList.contains('show')) {
    instance.hide()
  } else {
    instance.dispose()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      :id="id"
      ref="element"
      class="modal fade"
      tabindex="-1"
      :aria-labelledby="`${id}Label`"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" :class="size ? `modal-${size}` : ''">
        <div class="modal-content">
          <div class="modal-header">
            <h2 :id="`${id}Label`" class="modal-title fs-5">{{ title }}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
