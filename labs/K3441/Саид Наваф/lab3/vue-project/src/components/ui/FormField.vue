<script setup>
import { computed, ref, useAttrs, watchEffect } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  tag: { type: String, default: 'input' },
  feedback: { type: String, default: '' },
  customError: { type: String, default: '' },
  wrapperClass: { type: [String, Array, Object], default: 'mb-3' },
})

const model = defineModel({ type: [String, Number], default: '' })
const attrs = useAttrs()
const control = ref(null)

const controlAttrs = computed(() => ({
  ...attrs,
  'aria-describedby': props.feedback ? `${props.id}Feedback` : undefined,
}))

watchEffect(
  () => {
    control.value?.setCustomValidity(props.customError)
  },
  { flush: 'post' },
)
</script>

<template>
  <div :class="wrapperClass">
    <label :for="id" class="form-label">{{ label }}</label>
    <textarea
      v-if="tag === 'textarea'"
      :id="id"
      ref="control"
      v-model="model"
      class="form-control"
      v-bind="controlAttrs"
    />
    <select
      v-else-if="tag === 'select'"
      :id="id"
      ref="control"
      v-model="model"
      class="form-select"
      v-bind="controlAttrs"
    >
      <slot />
    </select>
    <input
      v-else
      :id="id"
      ref="control"
      v-model="model"
      :type="type"
      class="form-control"
      v-bind="controlAttrs"
    >
    <div v-if="feedback" :id="`${id}Feedback`" class="invalid-feedback">{{ feedback }}</div>
  </div>
</template>
