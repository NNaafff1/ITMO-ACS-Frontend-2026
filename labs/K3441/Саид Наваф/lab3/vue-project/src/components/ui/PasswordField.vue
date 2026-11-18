<script setup>
import { computed, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  feedback: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })
const attrs = useAttrs()
const visible = ref(false)

const inputAttrs = computed(() => ({
  ...attrs,
  'aria-describedby': props.feedback ? `${props.id}Feedback` : undefined,
}))
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="input-group has-validation">
      <input
        :id="id"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        class="form-control"
        v-bind="inputAttrs"
      >
      <button
        class="btn btn-outline-secondary"
        type="button"
        :aria-controls="id"
        :aria-label="visible ? 'Скрыть пароль' : 'Показать пароль'"
        @click="visible = !visible"
      >
        {{ visible ? 'Скрыть' : 'Показать' }}
      </button>
      <div v-if="feedback" :id="`${id}Feedback`" class="invalid-feedback">{{ feedback }}</div>
    </div>
  </div>
</template>
